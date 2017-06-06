#ifdef GL_ES
    precision highp float;
#endif

#pragma import_modes ( GL_LIGHTING )
#pragma import_defines ( GL_MAX_TEXTURE_UNITS, GL_ALPHA )

#pragma import_defines ( TEXTURE_FRAG_DECLARE0, TEXTURE_FUNCTION0, TEXTURE_ENV_FUNCTION0 )
#pragma import_defines ( TEXTURE_FRAG_DECLARE1, TEXTURE_FUNCTION1, TEXTURE_ENV_FUNCTION1 )
#pragma import_defines ( TEXTURE_FRAG_DECLARE2, TEXTURE_FUNCTION2, TEXTURE_ENV_FUNCTION2 )
#pragma import_defines ( TEXTURE_FRAG_DECLARE3, TEXTURE_FUNCTION3, TEXTURE_ENV_FUNCTION3 )

#if GL_MAX_TEXTURE_UNITS>0

uniform int osg_TextureFormat[GL_MAX_TEXTURE_UNITS];
uniform vec4 osg_TextureEnvColor[GL_MAX_TEXTURE_UNITS];

vec4 texenv_MODULATE(vec4 color, vec4 texture_color, int unit) { return (osg_TextureFormat[unit]==GL_ALPHA) ? vec4(color.r, color.g, color.b, color.a*texture_color.a) :  color*texture_color; }
vec4 texenv_REPLACE(vec4 color, vec4 texture_color, int unit) { return (osg_TextureFormat[unit]==GL_ALPHA) ? vec4(color.r, color.g, color.b, texture_color.a) : texture_color; }
vec4 texenv_DECAL(vec4 color, vec4 texture_color, int unit) { color.rgb = color.rgb * (1.0-texture_color.a) + texture_color.rgb*texture_color.a; return color; }
vec4 texenv_ADD(vec4 color, vec4 texture_color, int unit) { color.rgb = color.rgb + texture_color.rgb; color.a = color.a*texture_color.a; return color; }
vec4 texenv_BLEND(vec4 color, vec4 texture_color, int unit) { color.rgb = color.rgb * (vec3(1.0,1.0,1.0)-texture_color.rgb) + texture_color.rgb * osg_TextureEnvColor[unit].rgb; return color; }

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

#if GL_MAX_TEXTURE_UNITS>0
    #ifdef TEXTURE_FUNCTION0
        #ifdef TEXTURE_ENV_FUNCTION0
            frag_color = TEXTURE_ENV_FUNCTION0(frag_color, TEXTURE_FUNCTION0(), 0);
        #else
            frag_color = TEXTURE_FUNCTION0();
        #endif
    #endif

    #ifdef TEXTURE_FUNCTION1
        #ifdef TEXTURE_ENV_FUNCTION1
            frag_color = TEXTURE_ENV_FUNCTION1(frag_color, TEXTURE_FUNCTION1(), 1);
        #else
            frag_color = TEXTURE_FUNCTION1();
        #endif
    #endif

    #ifdef TEXTURE_FUNCTION2
        #ifdef TEXTURE_ENV_FUNCTION2
            frag_color = TEXTURE_ENV_FUNCTION2(frag_color, TEXTURE_FUNCTION2(), 2);
        #else
            frag_color = TEXTURE_FUNCTION2();
        #endif
    #endif

    #ifdef TEXTURE_FUNCTION3
        #ifdef TEXTURE_ENV_FUNCTION3
            frag_color = TEXTURE_ENV_FUNCTION3(frag_color, TEXTURE_FUNCTION3(), 3);
        #else
            frag_color = TEXTURE_FUNCTION3();
        #endif
    #endif

#endif

    gl_FragColor = frag_color;
}

