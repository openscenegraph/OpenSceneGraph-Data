#pragma import_defines ( TEXTURE_2D )

uniform sampler2D colorTexture1;
uniform sampler2D colorTexture2;
uniform float TextureWeights[];

varying vec2 texcoord;
varying vec4 basecolor;

void main(void)
{
#ifdef TEXTURE_2D
    float totalWeights = TextureWeights[0]+TextureWeights[1];

    vec4 color = texture2D( colorTexture1, texcoord)*TextureWeights[0] +
                 texture2D( colorTexture2, texcoord)*TextureWeights[1];

    gl_FragColor = basecolor * mix(vec4(1.0,1.0,1.0,1.0), color, totalWeights);
#else
    gl_FragColor = basecolor;
#endif
}
