
// Based on shaders from SimovDev GLSL course: https://simondev.teachable.com/

uniform vec3 uBaseColor;
uniform vec3 uAmbient;
uniform vec3 uDiffuseDir;
uniform vec3 uDiffuseColor;
uniform bool uSelected;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vec3 baseColour = uBaseColor;
  vec3 lighting = vec3(0.0);
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(cameraPosition - vPosition);

  // Ambient
  vec3 ambient = uAmbient;

  // Diffuse lighting
  vec3 lightDir = uDiffuseDir;
  vec3 lightColour = uDiffuseColor;
  float dp = max(0.0, dot(lightDir, normal));

  vec3 diffuse = dp * lightColour;

  lighting = ambient * 0.2 + diffuse * 0.2;

  // Specular
  vec3 reflection = normalize(reflect(-lightDir, normal));
  float phongValue = max(0.0, dot(viewDir, reflection));
  phongValue = pow(phongValue, 26.0);

  vec3 specular = vec3(phongValue);

  // Fresnel - I think this could be  done without the 1.0 - (result), but my brain can't figure it out yet.  Possibly weirds out the pow
  float fresnel = 1.0 - max(0.0, dot(viewDir, normal));
  fresnel = pow(fresnel, 1.0);

  float stepFresnel = step(0.6, fresnel);  
  if (uSelected && stepFresnel > 0.0)
  {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
  else
  {
    vec3 colour = baseColour * lighting + specular;    
    colour = pow(colour, vec3(1.0 / 2.2));
    gl_FragColor = vec4(colour, 0.7);
  }
}