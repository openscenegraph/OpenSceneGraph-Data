uniform sampler2D texture_0;
uniform sampler2D texture_1;

uniform float y0;

#if 1
vec4 warp(in vec4 source)
{
    float inv_divisor = 1.0 / (source.y + y0);
    return vec4(source.x * (1.0 + y0 ) * inv_divisor , (source.y * y0 + 1.0 ) * inv_divisor, source.z, source.w);
}
#else
vec4 warp(in vec4 source)
{
    return source;
}
#endif

void main()
{
    vec4 coord = gl_TexCoord[1];
    coord.x = coord.x*2.0 - 1.0;
    coord.y = coord.y*2.0 - 1.0;
    
    vec4 warped = warp(coord);
    warped.x = (warped.x + 1.0)*0.5;
    warped.y = (warped.y + 1.0)*0.5;
    
    vec4 base_color = texture2D(texture_0, gl_TexCoord[0].xy);
    vec4 overlay_color = texture2D(texture_1, warped.xy );
    vec3 mixed_color = mix(base_color.rgb, overlay_color.rgb, overlay_color.a);
    gl_FragColor = vec4(mixed_color, base_color.a);
}
