$OSG_GLSL_VERSION

#pragma import_defines( BACKDROP_COLOR, OUTLINE )

#if !defined(GL_ES)
    #if __VERSION__>=400
        #define osg_TextureQueryLOD textureQueryLod
        #define USE_SIGNED_DISTNACE_FIELD
    #else
        #extension GL_ARB_texture_query_lod : enable
        #ifdef GL_ARB_texture_query_lod
            #define osg_TextureQueryLOD textureQueryLOD
            #define USE_SIGNED_DISTNACE_FIELD
        #endif
    #endif
#endif


$OSG_PRECISION_FLOAT

//#undef USE_SIGNED_DISTNACE_FIELD

#if __VERSION__>=130
    #define TEXTURE texture
    out vec4 osg_FragColor;
#else
    #define TEXTURE texture2D
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

    #if 1
        float blend_ratio = OUTLINE*17.0;

        float outline_alpha = 0.0;
        if (blend_ratio>2.0) outline_alpha = glyph.b;
        else if (blend_ratio>1.0) outline_alpha = mix(glyph.g, glyph.b, blend_ratio-1.0);
        else outline_alpha = glyph.g*blend_ratio;
    #else
        float outline_alpha = glyph.g;
        //float outline_alpha = glyph.b;
    #endif

        float alpha = glyph.a+outline_alpha;
        if (alpha>1.0) alpha = 1.0;

        return vec4( vertexColor.rgb*glyph.a + BACKDROP_COLOR.rgb*outline_alpha, alpha);

    #else
        float alpha = TEXTURE(glyphTexture, texCoord).a;
        if (alpha==0.0) vec4(0.0, 0.0, 0.0, 0.0);
        return vec4(vertexColor.rgb, alpha);
    #endif
}

#ifdef USE_SIGNED_DISTNACE_FIELD
vec4 distanceFieldColor()
{
    float center_alpha = TEXTURE(glyphTexture, texCoord).r;

    float blend_width = 0.2;
    float distance_scale = 5.0;
    float edge_distance = (center_alpha-0.5)*distance_scale;

    #ifdef OUTLINE
        float outline_width = OUTLINE*17.0;//0.5;
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

#ifdef USE_SIGNED_DISTNACE_FIELD

    float mml = osg_TextureQueryLOD(glyphTexture, texCoord).x;

    float near_transition = 0.0;
    float far_transition = 1.0;

    vec4 color;
    if (mml<near_transition) color = distanceFieldColor();
    else if (mml>far_transition) color = textureColor();
    else color = mix(distanceFieldColor(), textureColor(), (mml-near_transition)/(far_transition-near_transition));

#else

    vec4 color = textureColor();

#endif

    if (color.a==0.0) discard;

    osg_FragColor = color;
}
