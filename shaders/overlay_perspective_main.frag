uniform sampler2D texture_0;
uniform sampler2D texture_1;

uniform float y0;
uniform float inverse_one_minus_y0;

void main()
{
    vec4 base_color = texture2D(texture_0, gl_TexCoord[0].xy);
    vec4 overlay_color = texture2D(texture_1, gl_TexCoord[1].xy);
    vec3 mixed_color = mix(base_color.rgb, overlay_color.rgb, overlay_color.a);
    gl_FragColor = vec4(mixed_color, base_color.a);
}
