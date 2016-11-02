#ifdef GL_ES
    precision highp float;
#endif

#pragma import_defines ( GL_MAX_TEXTURE_UNITS )
#pragma import_defines ( GL_MODULATE, GL_REPLACE, GL_DECAL, GL_BLEND, GL_ADD )
#pragma import_defines ( GL_ALPHA )

#pragma import_defines ( TEXTURE_FRAG_DECLARE0, TEXTURE_FRAG_BODY0 )
#pragma import_defines ( TEXTURE_FRAG_DECLARE1, TEXTURE_FRAG_BODY1 )
#pragma import_defines ( TEXTURE_FRAG_DECLARE2, TEXTURE_FRAG_BODY2 )
#pragma import_defines ( TEXTURE_FRAG_DECLARE3, TEXTURE_FRAG_BODY3 )

#if GL_MAX_TEXTURE_UNITS>0

uniform int GL_TEXTURE_ENV_MODE[GL_MAX_TEXTURE_UNITS];
uniform int GL_TEXTURE_FORMAT[GL_MAX_TEXTURE_UNITS];

vec4 texenv_MODULATE(vec4 color, vec4 texture_color) { return color*texture_color; }
vec4 texenv_MODULATE_ALPHA(vec4 color, vec4 texture_color) { return vec4(color.r, color.g, color.b, color.a*texture_color.a); }

vec4 texenv_REPLACE(vec4 color, vec4 texture_color) { return texture_color; }
vec4 texenv_REPLACE_ALPHA(vec4 color, vec4 texture_color) { return vec4(color.r, color.g, color.b, texture_color.a); }

vec4 texenv_DECAL(vec4 color, vec4 texture_color) { color.rgb = color.rgb * (1.0-texture_color.a) + texture_color.rgb*texture_color.a; return color; }
vec4 texenv_ADD(vec4 color, vec4 texture_color) { color.rgb = color.rgb + texture_color.rgb; color.a = color.a*texture_color.a; return color; }
vec4 texenv_BLEND(vec4 color, vec4 texture_color, int unit) { color.rgb = color.rgb * (vec3(1.0,1.0,1.0)-texture_color.rgb) + texture_color.rgb * gl_TextureEnvColor[unit].rgb; return color; }



vec4 texenv(vec4 color, vec4 texture_color, int unit)
{
    int texenv_mode = GL_TEXTURE_ENV_MODE[unit];

    if (GL_TEXTURE_FORMAT[unit]==GL_ALPHA)
    {
        if (texenv_mode==GL_REPLACE)  return texenv_REPLACE_ALPHA(color, texture_color);
        else return texenv_MODULATE_ALPHA(color, texture_color);
    }
    else
    {
        if (texenv_mode==GL_MODULATE) return texenv_MODULATE(color, texture_color);
        else if (texenv_mode==GL_REPLACE)  return texenv_REPLACE(color, texture_color);
        else if (texenv_mode==GL_DECAL)  return texenv_DECAL(color, texture_color);
        else if (texenv_mode==GL_BLEND)  return texenv_BLEND(color, texture_color, unit);
        else if (texenv_mode==GL_ADD)  return texenv_ADD(color, texture_color);
        else return texenv_MODULATE(color, texture_color);
    }
}

#ifdef TEXTURE_FRAG_DECLARE0
    TEXTURE_FRAG_DECLARE0
#endif

#ifdef TEXTURE_FRAG_DECLARE1
    TEXTURE_FRAG_DECLARE1
#endif

#ifdef TEXTURE_FRAG_DECLARE2
    TEXTURE_FRAG_DECLARE2
#endif

#ifdef TEXTURE_FRAG_DECLARE3
    TEXTURE_FRAG_DECLARE3
#endif

#endif

varying vec4 vertex_color;


void main()
{
    vec4 frag_color = vertex_color;

#ifdef TEXTURE_FRAG_BODY0
    TEXTURE_FRAG_BODY0(frag_color)
#endif

#ifdef TEXTURE_FRAG_BODY1
    TEXTURE_FRAG_BODY1(frag_color)
#endif

#ifdef TEXTURE_FRAG_BODY2
    TEXTURE_FRAG_BODY2(frag_color)
#endif

#ifdef TEXTURE_FRAG_BODY3
    TEXTURE_FRAG_BODY3(frag_color)
#endif

    gl_FragColor = frag_color;
}

