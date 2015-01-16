uniform sampler2D colorTexture1;

varying vec2 texcoord;
varying vec4 basecolor;

void main(void)
{
#ifdef GL_TEXTURE_2D
    vec4 color = texture2D( colorTexture1, texcoord);
    gl_FragColor = basecolor * color;
#else
    gl_FragColor = basecolor;
#endif
}
