#pragma import_defines ( TEXTURE_2D )

uniform sampler2D colorTexture1;
uniform float TextureWeights[];

varying vec2 texcoord;
varying vec4 basecolor;

void main(void)
{
#ifdef TEXTURE_2D
    float totalWeights = TextureWeights[0]+TextureWeights[1]+TextureWeights[2];

    vec4 color = texture2D( colorTexture1, texcoord);
    gl_FragColor = basecolor * mix(vec4(1.0,1.0,1.0,1.0), color, totalWeights);
#else
    gl_FragColor = basecolor;
#endif
}
