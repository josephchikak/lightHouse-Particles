
uniform sampler2D uPosition;
uniform sampler2D texturePosition;
uniform float uTime;
uniform float uFrequency;
varying vec2 vUv; 
varying vec2 vUvs;
uniform sampler2D uDisplacement;
uniform vec3 uMouse;
vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
    return mod289(((x*34.0)+1.0)*x);
}

float noise(vec2 v)
{
    const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
    // First corner
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);

    // Other corners
    vec2 i1;
    //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
    //i1.y = 1.0 - i1.x;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    // x0 = x0 - 0.0 + 0.0 * C.xx ;
    // x1 = x0 - i1 + 1.0 * C.xx ;
    // x2 = x0 - 1.0 + 2.0 * C.xx ;
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;

    // Permutations
    i = mod289(i); // Avoid truncation effects in permutation
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));

    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;

    // Gradients: 41 points uniformly over a line, mapped onto a diamond.
    // The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;

    // Normalise gradients implicitly by scaling m
    // Approximation of: m *= inversesqrt( a0*a0 + h*h );
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

    // Compute final noise value at P
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

vec3 curl(float	x,	float	y,	float	z)
{

    float	eps	= 1., eps2 = 2. * eps;
    float	n1,	n2,	a,	b;

    x += uTime * .05;
    y += uTime * .05;
    z += uTime * .05;

    vec3	curl = vec3(0.);

    n1	=	noise(vec2( x,	y	+	eps ));
    n2	=	noise(vec2( x,	y	-	eps ));
    a	=	(n1	-	n2)/eps2;

    n1	=	noise(vec2( x,	z	+	eps));
    n2	=	noise(vec2( x,	z	-	eps));
    b	=	(n1	-	n2)/eps2;

    curl.x	=	a	-	b;

    n1	=	noise(vec2( y,	z	+	eps));
    n2	=	noise(vec2( y,	z	-	eps));
    a	=	(n1	-	n2)/eps2;

    n1	=	noise(vec2( x	+	eps,	z));
    n2	=	noise(vec2( x	+	eps,	z));
    b	=	(n1	-	n2)/eps2;

    curl.y	=	a	-	b;

    n1	=	noise(vec2( x	+	eps,	y));
    n2	=	noise(vec2( x	-	eps,	y));
    a	=	(n1	-	n2)/eps2;

    n1	=	noise(vec2(  y	+	eps,	z));
    n2	=	noise(vec2(  y	-	eps,	z));
    b	=	(n1	-	n2)/eps2;

    curl.z	=	a	-	b;

    return	curl;
}




void main() {
    float distance = 4.0;
    float frequency = 2.5;
    float amplitude = 3.5;



   float displace = texture2D(uDisplacement, vUv).r;

   vec4 tmpPos = texture2D(uPosition, vUv);
   vec3 pos = tmpPos.xyz;

   vec3 newPos = pos;
    vec3 noisePos = pos+  amplitude * curl(frequency*pos.x, frequency*pos.y, frequency*pos.z *0.5) ;
  
    //rotate on y axis over time
    float angle = sin(uTime )* 0.1;
    float s = sin(angle);
    float c = cos(angle);
    mat3 rotation = mat3(angle);
    rotation[0] = vec3(c, 0.0, s);
    rotation[1] = vec3(0.0, 1.0, 0.0);
    rotation[2] = vec3(-s, 0.0, c);
    pos = rotation * pos;


   vec3 posDisplaced = pos;

   if(length(pos - uMouse) < (distance * 1.1)){
        float percent = length(pos - uMouse)/distance * 0.5;
        percent = sqrt(percent);
        // posDisplaced *= vec3(2.,2.,3.); 
        posDisplaced = mix(newPos, noisePos,1. - percent);
   }

  
  vec4 color   = texture2D(uDisplacement, vUvs);

   gl_FragColor = vec4(posDisplaced, 1.0);
}



