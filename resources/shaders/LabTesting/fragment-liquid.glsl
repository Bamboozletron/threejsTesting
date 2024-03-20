
uniform vec3 uBaseColor;
uniform vec3 uAmbient;
uniform vec3 uLevels;
uniform float uTime;

varying vec3 vNormal;
varying vec3 vPosition;

varying vec3 vStartPos;

float inverseLerp(float v, float minValue, float maxValue) {
  return (v - minValue) / (maxValue - minValue);
}

float remap(float v, float inMin, float inMax, float outMin, float outMax) {
  float t = inverseLerp(v, inMin, inMax);
  return mix(outMin, outMax, t);
}

void main() {
  vec3 baseColour = uBaseColor;
  vec3 lighting = vec3(0.0);
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(cameraPosition - vPosition);
  
  float remapValue = remap(abs(vStartPos.z), abs(uLevels.y), abs(uLevels.x), 0.05, 1.0);
  
  float sinRemap = remap(sin(uTime), -1.0, 1.0, -0.0, 1.0);

  if (remapValue > sinRemap)
  {
    discard;
  }

  // Ambient
  vec3 ambient = uAmbient;

  lighting = ambient * 1.0;

  vec3 colour = baseColour * lighting;

  // colour = linearTosRGB(colour);
  colour = pow(colour, vec3(1.0 / 2.2));
  gl_FragColor = vec4(colour, 0.8);
}