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

#if defined(NORMAL_MAP)
attribute vec3 tangent;
#endif

void main()
{
  gl_Position = ftransform();

#if defined(DIFFUSE_MAP) || defined(NORMAL_MAP)
  gl_TexCoord[0] = gl_MultiTexCoord0;
#endif

#if defined(NORMAL_MAP)
  vec3 n = gl_NormalMatrix * gl_Normal;
  vec3 t = gl_NormalMatrix * tangent;
  vec3 b = cross(n, t);
  vec3 dir = -vec3(gl_ModelViewMatrix * gl_Vertex);
  viewDir.x = dot(dir, t);
  viewDir.y = dot(dir, b);
  viewDir.z = dot(dir, n);
  vec4 lpos = gl_LightSource[0].position;
  if (lpos.w == 0.0)
    dir = lpos.xyz;
  else
    dir += lpos.xyz;
  lightDir.x = dot(dir, t);
  lightDir.y = dot(dir, b);
  lightDir.z = dot(dir, n);
#endif

#if defined(LIGHTING)
  normalDir = gl_NormalMatrix * gl_Normal;
  vec3 dir = -vec3(gl_ModelViewMatrix * gl_Vertex);
  viewDir = dir;
  vec4 lpos = gl_LightSource[0].position;
  if (lpos.w == 0.0)
    lightDir = lpos.xyz;
  else
    lightDir = lpos.xyz + dir;
#endif

#if defined(FOG)
  viewDir = -vec3(gl_ModelViewMatrix * gl_Vertex);
#endif

  vertexColor = gl_Color;
}
