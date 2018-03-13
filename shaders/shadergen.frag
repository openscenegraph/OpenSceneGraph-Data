// ShaderGen shader
// new version
#ifdef GL_ES
    precision highp float;
#endif

#pragma import_defines(LIGHTING, NORMAL_MAP, DIFFUSE_MAP, FOG)

#if defined(LIGHTING)
varying vec3 normalDir;
#endif

#if defined(LIGHTING) || defined(NORMAL_MAP)
varying vec3 lightDir;
#endif

#if defined(LIGHTING) || defined(NORMAL_MAP) || defined(FOG)
varying vec3 viewDir;
#endif

varying vec4 vertexColor;

#if defined(DIFFUSE_MAP)
uniform sampler2D diffuseMap;
#endif

#if defined(NORMAL_MAP)
uniform sampler2D normalMap;
#endif

void main()
{
  vec4 base = vertexColor;
#if defined(DIFFUSE_MAP)
  base = base * texture2D(diffuseMap, gl_TexCoord[0].st);
#endif

#if defined(NORMAL_MAP)
  vec3 normalDir = texture2D(normalMap, gl_TexCoord[0].st).xyz*2.0-1.0;
#endif

#if !defined(NORMAL_MAP) && !defined(LIGHTING)
  vec4 color = base;
#else
  vec4 color = base;
#endif

  gl_FragColor = color;
}
