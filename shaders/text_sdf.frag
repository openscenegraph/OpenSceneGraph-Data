$OSG_GLSL_VERSION

#pragma import_defines( BACKDROP_COLOR, OUTLINE, SIGNED_DISTNACE_FIELD, TEXTURE_DIMENSION, GLYPH_DIMENSION)

#ifdef GL_ES
    #extension GL_OES_standard_derivatives : enable
    #ifndef GL_OES_standard_derivatives
        #undef SIGNED_DISTNACE_FIELD
    #endif
#endif

$OSG_PRECISION_FLOAT

#undef SIGNED_DISTNACE_FIELD

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

#ifdef SIGNED_DISTNACE_FIELD

float distanceFromEdge(vec2 tc)
{
    float center_alpha = TEXTURELOD(glyphTexture, tc, 0.0).r;
    if (center_alpha==0.0) return -1.0;

    //float distance_scale = (1.0/4.0)*1.41;
    float distance_scale = (1.0/6.0)*1.41;
    //float distance_scale = (1.0/8.0)*1.41;

    return (center_alpha-0.5)*distance_scale;
}

vec4 distanceFieldColorSample(float edge_distance, float blend_width, float  blend_half_width)
{
#ifdef OUTLINE
    float outline_width = OUTLINE*0.5;
    if (edge_distance>blend_half_width)
    {
        return vertexColor;
    }
    else if (edge_distance>-blend_half_width)
    {
        return mix(vertexColor, BACKDROP_COLOR, smoothstep(0.0, 1.0, (blend_half_width-edge_distance)/(blend_width)));
    }
    else if (edge_distance>(blend_half_width-outline_width))
    {
        return BACKDROP_COLOR;
    }
    else if (edge_distance>-(outline_width+blend_half_width))
    {
        return vec4(BACKDROP_COLOR.rgb, ((blend_half_width+outline_width+edge_distance)/blend_width));
    }
    else
    {
        return vec4(0.0, 0.0, 0.0, 0.0);
    }
#else
    if (edge_distance>blend_half_width)
    {
        return vertexColor;
    }
    else if (edge_distance>-blend_half_width)
    {
        return vec4(vertexColor.rgb, smoothstep(1.0, 0.0, (blend_half_width-edge_distance)/(blend_width)));
    }
    else
    {
        return vec4(0.0, 0.0, 0.0, 0.0);
    }
#endif
}

vec4 distanceFieldColor()
{
    float sample_distance_scale = 0.75;
    vec2 dx = dFdx(texCoord)*sample_distance_scale;
    vec2 dy = dFdy(texCoord)*sample_distance_scale;

    #ifndef TEXTURE_DIMENSION
    float TEXTURE_DIMENSION = 1024.0;
    #endif

    #ifndef GLYPH_DIMENSION
    float GLYPH_DIMENSION = 32.0;
    #endif

    float distance_across_pixel = length(dx+dy)*(TEXTURE_DIMENSION/GLYPH_DIMENSION);

    // compute the appropriate number of samples required to avoid aliasing.
    int maxNumSamplesAcrossSide = 4;

    int numSamplesX = int(TEXTURE_DIMENSION * length(dx));
    int numSamplesY = int(TEXTURE_DIMENSION * length(dy));
    if (numSamplesX<2) numSamplesX = 2;
    if (numSamplesY<2) numSamplesY = 2;
    if (numSamplesX>maxNumSamplesAcrossSide) numSamplesX = maxNumSamplesAcrossSide;
    if (numSamplesY>maxNumSamplesAcrossSide) numSamplesY = maxNumSamplesAcrossSide;


    vec2 delta_tx = dx/float(numSamplesX-1);
    vec2 delta_ty = dy/float(numSamplesY-1);

    float numSamples = float(numSamplesX)*float(numSamplesY);
    float scale = 1.0/numSamples;
    vec4 total_color = vec4(0.0,0.0,0.0,0.0);

    float blend_width = 1.5*distance_across_pixel/numSamples;
    float blend_half_width = blend_width*0.5;

    // check whether fragment is wholly within or outwith glyph body+outline
    float cd = distanceFromEdge(texCoord); // central distance (distance from center to edge)
    if (cd-blend_half_width>distance_across_pixel) return vertexColor; // pixel fully within glyph body

    #ifdef OUTLINE
    float outline_width = OUTLINE*0.5;
    if ((-cd-outline_width-blend_half_width)>distance_across_pixel) return vec4(0.0, 0.0, 0.0, 0.0); // pixel fully outside outline+glyph body
    #else
    if (-cd-blend_half_width>distance_across_pixel) return vec4(0.0, 0.0, 0.0, 0.0); // pixel fully outside glyph body
    #endif


    // use multi-sampling to provide high quality antialised fragments
    vec2 origin = texCoord - dx*0.5 - dy*0.5;
    for(;numSamplesY>0; --numSamplesY)
    {
        vec2 pos = origin;
        int numX = numSamplesX;
        for(;numX>0; --numX)
        {
            vec4 c = distanceFieldColorSample(distanceFromEdge(pos), blend_width, blend_half_width);
            total_color = total_color + c * c.a;
            pos += delta_tx;
        }
        origin += delta_ty;
    }

    total_color.rgb /= total_color.a;
    total_color.a *= scale;

    return total_color;
}
#else

vec4 textureColor()
{
    #ifdef OUTLINE
        // glyph.rgba = (signed_distance, thin_outline, thick_outline, glyph_alpha)
        vec4 glyph = TEXTURE(glyphTexture, texCoord);

        float outline_alpha = (OUTLINE<=0.05) ? glyph.g : glyph.b;

        float alpha = glyph.a+outline_alpha;
        if (alpha>1.0) alpha = 1.0;

        return vec4( vertexColor.rgb*glyph.a + BACKDROP_COLOR.rgb*outline_alpha, alpha);

    #else
        float alpha = TEXTURE(glyphTexture, texCoord).a;
        if (alpha==0.0) vec4(0.0, 0.0, 0.0, 0.0);
        return vec4(vertexColor.rgb, alpha);
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

#ifdef SIGNED_DISTNACE_FIELD
    vec4 color = distanceFieldColor();
#else
    vec4 color = textureColor();
#endif

    if (color.a==0.0) discard;

    osg_FragColor = color;
}
