// Based on shaders from SimovDev GLSL course: https://simondev.teachable.com/

varying vec3 vNormal;
varying vec3 vPosition;

uniform float time;

float inverseLerp(float v, float minValue, float maxValue) {
  return (v - minValue) / (maxValue - minValue);
}

float remap(float v, float inMin, float inMax, float outMin, float outMax) {
  float t = inverseLerp(v, inMin, inMax);
  return mix(outMin, outMax, t);
}


void main() {
  vec3 baseColour = vec3(1.0, 0.6, 1.0);
  vec3 lighting = vec3(0.0);
  vec3 normal = normalize(vNormal);

  if (vPosition.y > sin(time))
  {
    discard;
  }

  vec3 colour = baseColour;

  // colour = linearTosRGB(colour);
  colour = pow(colour, vec3(1.0 / 2.2));

  gl_FragColor = vec4(colour, 1.0);
}