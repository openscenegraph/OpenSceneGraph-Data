// ShaderGen shader
// new version
#ifdef GL_ES
    precision highp float;
#endif

#pragma import_defines(GL_LIGHTING, GL_TEXTURE_2D, GL_FOG)

#if defined(GL_LIGHTING)
varying vec3 normalDir;
varying vec3 lightDir;
#endif

#if defined(GL_LIGHTING) || defined(GL_FOG)
varying vec3 viewDir;
#endif

varying vec4 vertexColor;


void main()
{
  gl_Position = ftransform();

#if defined(GL_TEXTURE_2D)
  gl_TexCoord[0] = gl_MultiTexCoord0;
#endif

#if defined(GL_LIGHTING) || defined(GL_FOG)
  viewDir = -vec3(gl_ModelViewMatrix * gl_Vertex);
#endif

#if defined(GL_LIGHTING)
  normalDir = gl_NormalMatrix * gl_Normal;
  vec4 lpos = gl_LightSource[0].position;
  if (lpos.w == 0.0)
    lightDir = lpos.xyz;
  else
    lightDir = lpos.xyz + viewDir;
#endif

  vertexColor = gl_Color;
}
