varying vec2 vUv;
attribute vec2 uvs;
varying vec2 vUvs;

void main() {
  vUv = vec2(uvs.x, uvs.y);
  vUvs = uvs;


  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
}