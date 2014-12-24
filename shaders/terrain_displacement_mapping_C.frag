uniform sampler2D colorTexture1;

varying vec2 texcoord;
varying vec4 basecolor;

void main(void)
{
    vec4 color = texture2D( colorTexture1, texcoord);
    gl_FragColor = basecolor * color;
}
