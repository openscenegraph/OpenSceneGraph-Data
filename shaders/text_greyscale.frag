$OSG_GLSL_VERSION
$OSG_PRECISION_FLOAT

#pragma import_defines( BACKDROP_COLOR, OUTLINE, ALPHA )

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

#ifndef ALPHA
    #if !defined(GL_ES) && __VERSION__>=130
        #define ALPHA r
    #else
        #define ALPHA a
    #endif
#endif

void main(void)
{
    float alpha = TEXTURE(glyphTexture, texCoord).ALPHA;

    if (alpha==0.0) discard;

    osg_FragColor = vec4(vertexColor.rgb, alpha);
}
