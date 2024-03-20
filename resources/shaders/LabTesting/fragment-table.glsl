// Based on shaders from SimovDev GLSL course: https://simondev.teachable.com/

uniform vec3 uBaseColor;
uniform vec3 uAmbient;
uniform vec3 uDiffuseDir;
uniform vec3 uDiffuseColor;

varying vec3 vNormal;

void main() {
  vec3 baseColour = uBaseColor;
  vec3 lighting = vec3(0.0);
  vec3 normal = normalize(vNormal);

  // Ambient
  vec3 ambient = uAmbient;

  // Diffuse lighting
  vec3 lightDir = normalize(uDiffuseDir);
  vec3 lightColour = uDiffuseColor;
  float dp = max(0.0, dot(lightDir, normal));

  vec3 diffuse = dp * lightColour;

  lighting = ambient * 0.3 + diffuse * 0.8;

  vec3 colour = baseColour * lighting;

  // colour = linearTosRGB(colour);
  colour = pow(colour, vec3(1.0 / 2.2));

  gl_FragColor = vec4(colour, 1.0);
}