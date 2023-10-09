
uniform float uTime;
uniform vec2 uResolution;
varying vec3 vPosition;
uniform sampler2D uTexture;
varying vec2 vUv;
// out vec2 reference;

#define PI 3.141592653589793
#define HALF_PI 1.5707963267948966
#define TWO_PI 6.28318530718

// Paint colors.
    vec3 red    = vec3(0.725, 0.141, 0.149);
    vec3 blue   = vec3(0.012, 0.388, 0.624);
    vec3 yellow = vec3(0.988, 0.784, 0.173);
    vec3 beige  = vec3(.976, .949, .878);
    vec3 black  = vec3(0.078, 0.09, 0.114);
    vec3 green = vec3(0.09,0.169,0.035);

    // Reference to
    // http://thndl.com/square-shaped-shaders.html

void main() {
  vec3 color = vec3(0.34, 0.53, 0.96);

    gl_FragColor = vec4(0.0,0.0, 0.0, 1.0);

}