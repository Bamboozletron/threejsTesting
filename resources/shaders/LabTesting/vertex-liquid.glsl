
// Based on shaders from SimovDev GLSL course: https://simondev.teachable.com/

varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vModelPos;
varying vec3 vStartPos;

void main() {	
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  vNormal = (modelMatrix * vec4(normal, 0.0)).xyz;
  vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
  vStartPos = position;
}