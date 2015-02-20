#pragma import_defines ( TEXTURE_2D, TEXTURE_WEIGHTS, COLOR_LAYER0, COLOR_LAYER1, COLOR_LAYER2)


#if defined(TEXTURE_2D) && defined(COLOR_LAYER0)
uniform sampler2D colorTexture0;
#endif

#if defined(TEXTURE_2D) && defined(COLOR_LAYER1)
uniform sampler2D colorTexture1;
#endif

#if defined(TEXTURE_2D) && defined(COLOR_LAYER2)
uniform sampler2D colorTexture2;
#endif


#if defined(TEXTURE_2D) && defined(TEXTURE_WEIGHTS)
uniform float TextureWeights[];
#define WEIGHTS_LOOKUP(i) TextureWeights[i]
#else
#define WEIGHTS_LOOKUP(i) 1.0
#endif

varying vec2 texcoord;
varying vec4 basecolor;

void main(void)
{
#ifdef TEXTURE_2D
    vec4 color = vec4(0.0, 0.0, 0.0, 0.0);

    #ifdef COLOR_LAYER0
        color = color + texture2D( colorTexture0, texcoord)*WEIGHTS_LOOKUP(0);
    #endif

    #ifdef COLOR_LAYER1
        color = color + texture2D( colorTexture1, texcoord)*WEIGHTS_LOOKUP(1);
    #endif

    #ifdef COLOR_LAYER2
        color = color + texture2D( colorTexture2, texcoord)*WEIGHTS_LOOKUP(2);
    #endif

    gl_FragColor = basecolor * color;
#else
    gl_FragColor = basecolor;
#endif
}
