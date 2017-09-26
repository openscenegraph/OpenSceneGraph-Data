$OSG_GLSL_VERSION

#pragma import_defines( BACKDROP_COLOR, OUTLINE, SIGNED_DISTNACE_FIELD )

#if !defined(GL_ES)
    #if __VERSION__>=400
        #define osg_TextureQueryLOD textureQueryLod
    #else
        #extension GL_ARB_texture_query_lod : enable
        #ifdef GL_ARB_texture_query_lod
            #define osg_TextureQueryLOD textureQueryLOD
        #endif
    #endif
#endif

$OSG_PRECISION_FLOAT

//#undef USE_SIGNED_DISTNACE_FIELD

#if __VERSION__>=130
    #define TEXTURE texture
    #define TEXTURELOD textureLod
    out vec4 osg_FragColor;
#else
    #define TEXTURE texture2D
    #define TEXTURELOD texture2DLod
    #define osg_FragColor gl_FragColor
#endif

uniform sampler2D glyphTexture;

$OSG_VARYING_IN vec2 texCoord;
$OSG_VARYING_IN vec4 vertexColor;

vec4 textureColor()
{
    #ifdef OUTLINE
        // glyph.rgba = (signed_distance, thin_outline, thick_outline, glyph_alpha)
        vec4 glyph = TEXTURE(glyphTexture, texCoord);

        float outline_alpha = (OUTLINE<=0.1) ? glyph.g : glyph.b;

        float alpha = glyph.a+outline_alpha;
        if (alpha>1.0) alpha = 1.0;

        return vec4( vertexColor.rgb*glyph.a + BACKDROP_COLOR.rgb*outline_alpha, alpha);

    #else
        float alpha = TEXTURE(glyphTexture, texCoord).a;
        if (alpha==0.0) vec4(0.0, 0.0, 0.0, 0.0);
        return vec4(vertexColor.rgb, alpha);
    #endif
}

#ifdef SIGNED_DISTNACE_FIELD
vec4 distanceFieldColor()
{
    float center_alpha = TEXTURELOD(glyphTexture, texCoord, 0.0).r;
    //float center_alpha = TEXTURE(glyphTexture, texCoord).r;

    float blend_width = 0.005;
    float distance_scale = 0.25;
    float edge_distance = (center_alpha-0.5)*distance_scale;

    #ifdef OUTLINE
        float outline_width = OUTLINE*0.5;
        if (edge_distance>blend_width*0.5)
        {
            return vertexColor;
        }
        else if (edge_distance>-blend_width*0.5)
        {
            return mix(vertexColor, BACKDROP_COLOR, (blend_width*0.5-edge_distance)/(blend_width));
        }
        else if (edge_distance>(blend_width-outline_width))
        {
            return BACKDROP_COLOR;
        }
        else if (edge_distance>-outline_width)
        {
            return vec4(BACKDROP_COLOR.rgb, (outline_width+edge_distance)/blend_width);
        }
        else
        {
            return vec4(0.0, 0.0, 0.0, 0.0);
        }
    #else
        if (edge_distance>0.0)
        {
            return vertexColor;
        }
        else if (edge_distance>-blend_width)
        {
            return vec4(vertexColor.rgb, 1.0+edge_distance/blend_width);
        }
        else
        {
            return vec4(0.0, 0.0, 0.0, 0.0);
        }
    #endif
}
#endif


void main(void)
{
    if (texCoord.x<0.0 && texCoord.y<0.0)
    {
        osg_FragColor = vertexColor;
        return;
    }


    float near_fade_away = 2.0;
    float far_fade_away = near_fade_away+5.0;

#ifdef osg_TextureQueryLOD
    float mml = osg_TextureQueryLOD(glyphTexture, texCoord).x;
    if (mml>far_fade_away) discard;
#else
    float mml = 0.0;
#endif


#ifdef SIGNED_DISTNACE_FIELD

    float near_transition = 0.0;
    float far_transition = near_transition+1.0;

    vec4 color;
    if (mml<near_transition) color = distanceFieldColor();
    else if (mml>far_transition) color = textureColor();
    else color = mix(distanceFieldColor(), textureColor(), (mml-near_transition)/(far_transition-near_transition));

#else

    vec4 color = textureColor();

#endif

    if (mml>near_fade_away) color.a *= (far_fade_away-mml)/(far_fade_away-near_fade_away);

    if (color.a==0.0) discard;

    osg_FragColor = color;
}
