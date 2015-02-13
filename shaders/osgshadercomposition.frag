#pragma import_defines ( GL_TEXTURE_2D )

#ifdef GL_TEXTURE_2D
uniform sampler2D texture0;

varying vec2 texcoord;
#endif

varying vec4 basecolor;

void main(void)
{
#ifdef GL_TEXTURE_2D
    gl_FragColor = texture2D( texture0, texcoord) * basecolor;
#else
    gl_FragColor = basecolor;
#endif
}
