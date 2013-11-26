uniform sampler2D colorTexture;
uniform sampler2D depthTexture;

varying vec4 texcoord;

varying float far;
varying float near_mult_far;
varying float far_sub_near;

void main(void)
{
    vec4 color = texture2D( colorTexture, texcoord);
    float texture_depth = texture2D( depthTexture, texcoord).s;
    float depth = near_mult_far / (far - texture_depth*far_sub_near);

    gl_FragColor = color;
    gl_FragDepth = depth;
}
