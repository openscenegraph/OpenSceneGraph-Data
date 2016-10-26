#ifdef GL_ES
    precision highp float;
#endif

#pragma import_defines ( GL_MAX_TEXTURE_UNITS, GL_MODULATE, GL_REPLACE, GL_DECAL,GL_BLEND, GL_ADD )
#pragma import_texture_modes ( 0, GL_TEXTURE_1D, GL_TEXTURE_2D, GL_TEXTURE_3D, GL_TEXTURE_CUBE_MAP )

#define GL_TEXTURE_2D

#if GL_MAX_TEXTURE_UNITS>0

#if 1
//#ifdef GL_ES
uniform int GL_TEXTURE_ENV_MODE[GL_MAX_TEXTURE_UNITS];
uniform int GL_TEXTURE_MODE[GL_MAX_TEXTURE_UNITS];
#else
const int GL_TEXTURE_ENV_MODE[8] = int[](GL_MODULATE, 0, 0, 0, 0, 0, 0, 0);
const int GL_TEXTURE_MODE[8] = int[](GL_TEXTURE_2D, 0, 0, 0, 0, 0, 0, 0);
#endif


vec4 texenv_MODULATE(vec4 color, vec4 texture_color) { return color*texture_color; }
vec4 texenv_REPLACE(vec4 color, vec4 texture_color) { return texture_color; }
vec4 texenv_DECAL(vec4 color, vec4 texture_color) { color.rgb = color.rgb * (1.0-texture_color.a) + texture_color.rgb*texture_color.a; return color; }
vec4 texenv_ADD(vec4 color, vec4 texture_color) { color.rgb = color.rgb + texture_color.rgb; color.a = color.a*texture_color.a; return color; }
vec4 texenv_BLEND(vec4 color, vec4 texture_color, int unit) { color.rgb = color.rgb * (vec3(1.0,1.0,1.0)-texture_color.rgb) + texture_color.rgb * gl_TextureEnvColor[unit].rgb; return color; }

vec4 texenv(vec4 color, vec4 texture_color, int unit)
{
    int texenv_mode = GL_TEXTURE_ENV_MODE[unit];
    if (texenv_mode==GL_MODULATE) return texenv_MODULATE(color, texture_color);
    else if (texenv_mode==GL_REPLACE)  return texenv_REPLACE(color, texture_color);
    else if (texenv_mode==GL_DECAL)  return texenv_DECAL(color, texture_color);
    else if (texenv_mode==GL_BLEND)  return texenv_BLEND(color, texture_color, unit);
    else if (texenv_mode==GL_ADD)  return texenv_ADD(color, texture_color);
    else return texenv_MODULATE(color, texture_color);
}


#if defined(GL_TEXTURE_1D)
    uniform sampler1D sampler0;
    #define GL_TEXTURE_FRAG_BODY0(color, unit) { color = texenv(color, texture1D( sampler0, TexCoord[unit].s), unit); }
#elif defined(GL_TEXTURE_2D)
    uniform sampler2D sampler0;
    #define GL_TEXTURE_FRAG_BODY0(color, unit) { color = texenv(color, texture2D( sampler0, TexCoord[unit].st), unit); }
#elif defined(GL_TEXTURE_3D)
    uniform sampler3D sampler0;
    #define GL_TEXTURE_FRAG_BODY0(color, unit) { color = texenv(color, texture3D( sampler0, TexCoord[unit].str), unit); }
#elif defined(GL_TEXTURE_CUBE_MAP)
    uniform samplerCube sampler0;
    #define GL_TEXTURE_FRAG_BODY0(color, unit) { color = texenv(color, textureCube( sampler0, TexCoord[unit].str), unit); }
#endif


varying vec4 TexCoord[GL_MAX_TEXTURE_UNITS];
#endif

varying vec4 vertex_color;

void main()
{
    vec4 frag_color = vertex_color;

#if GL_MAX_TEXTURE_UNITS>0
    GL_TEXTURE_FRAG_BODY0(frag_color, 0);
#endif

    gl_FragColor = frag_color;
}

