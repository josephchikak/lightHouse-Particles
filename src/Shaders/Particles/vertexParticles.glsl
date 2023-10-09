
uniform sampler2D uPositions;
uniform sampler2D particlePosition;
uniform float uTime;
attribute vec2 reference;

varying vec2 vUv;


void main() {

  vUv = reference;

  vec3 pos = texture2D(uPositions, reference).xyz;

  vec4 modelPosition = modelMatrix * vec4(pos, 1.0);


  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  gl_PointSize = 50.0 * (1.0 / - viewPosition.z);

  //  Size attenuation;
  // gl_PointSize *= step(1.0 - (1.0/64.0), position.x) + 0.5;


}
