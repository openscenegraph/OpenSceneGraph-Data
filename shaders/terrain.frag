uniform sampler2D colorTexture1;
uniform sampler2D colorTexture2;
uniform sampler2D colorTexture3;

varying vec2 texcoord;
varying vec4 basecolor;

void main(void)
{
    float multiplier = 1.0/3.0;
    vec4 color = texture2D( colorTexture1, texcoord)*multiplier +
                 texture2D( colorTexture2, texcoord)*multiplier +
                 texture2D( colorTexture3, texcoord)*multiplier;

#if 1
    gl_FragColor = basecolor * color;
#else
    gl_FragColor = basecolor;//basecolor * color;
#endif
}
