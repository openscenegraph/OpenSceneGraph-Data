uniform sampler2D colorTexture;
uniform sampler2D depthTexture;

varying vec4 texcoord;

void main(void)
{
    vec4 color = texture2D( colorTexture, texcoord);
    float texture_depth = texture2D( depthTexture, texcoord).s;
    gl_FragColor = color;
    gl_FragDepth = texture_depth;
}
