// ShaderGen shader
// new version
#ifdef GL_ES
    precision highp float;
#endif

#pragma import_defines(GL_TEXTURE_2D)

varying vec4 vertexColor;

#if defined(GL_TEXTURE_2D)
uniform sampler2D diffuseMap;
#endif

void main()
{
  vec4 color = vertexColor;

#if defined(GL_TEXTURE_2D)
  color = color * texture2D(diffuseMap, gl_TexCoord[0].st);
#endif

  gl_FragColor = color;
}
