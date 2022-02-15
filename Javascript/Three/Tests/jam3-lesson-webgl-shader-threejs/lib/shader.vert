attribute vec4 position;
attribute vec3 normal;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

uniform float time;

varying vec3 vNormal;

void main () {
  vNormal = normal;
  vec4 offset = position;

  float dist = sin(time) * 0.5;
  offset.xyz += normal * dist * 0.1;
  gl_Position = projectionMatrix * modelViewMatrix * offset;
}
