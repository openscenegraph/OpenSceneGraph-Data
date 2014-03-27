#version 110

uniform sampler2D colorTexture;
uniform sampler2D depthTexture;
uniform sampler2D backFaceDepthTexture;
uniform sampler2D frontFaceDepthTexture;
uniform vec4 viewportDimensions;
uniform float ExteriorTransparencyFactorValue;


// declare function defined in volume_compute_ray_color.frag
vec4 computeRayColor(vec4 fragColor, float px, float py, float depth_start, float depth_end);

vec4 computeSegment(vec4 fragColor, float px, float py, float depth_start, float depth_end, float transparencyFactor, vec4 scene_color, float scene_depth)
{
#if 1
    //return mix(fragColor, computeRayColor(fragColor, px, py, depth_start, depth_end), transparencyFactor);
    if ((depth_end<scene_depth) && (scene_depth<depth_start))
    {
        // scene fragment between segment end points
        // compute front segment color and blend with scene fragment color
        fragColor  = mix( fragColor, computeRayColor(fragColor, px, py, scene_depth, depth_end), transparencyFactor);
        fragColor  = mix(scene_color, fragColor, fragColor.a);
        if (fragColor.a>=1.0) return fragColor;

        // compute rear segement color and blend with accumulated_color
        return mix( fragColor, computeRayColor(fragColor, px, py, depth_start, scene_depth), transparencyFactor);
    }
    else
    {
        return mix( fragColor, computeRayColor(fragColor, px, py, depth_start, depth_end), transparencyFactor);
    }
#else
    if ((depth_end<scene_depth) && (scene_depth<depth_start))
    {
        // scene fragment between segment end points
        // compute front segment color and blend with scene fragment color
        fragColor  = computeRayColor(fragColor, px, py, scene_depth, depth_end) * transparencyFactor;
        fragColor  = mix(scene_color, fragColor, fragColor.a);
        if (fragColor.a>=1.0) return fragColor;

        // compute rear segement color and blend with accumulated_color
        return computeRayColor(fragColor, px, py, depth_start, scene_depth) * transparencyFactor;
    }
    else
    {
        return computeRayColor(fragColor, px, py, depth_start, depth_end) * transparencyFactor;
    }
#endif
}

void main(void)
{
    vec2 texcoord = vec2((gl_FragCoord.x-viewportDimensions[0])/viewportDimensions[2], (gl_FragCoord.y-viewportDimensions[1])/viewportDimensions[3]);
    vec4 color = texture2D( colorTexture, texcoord);
    float texture_depth = texture2D( depthTexture, texcoord).s;
    float back_depth = texture2D( backFaceDepthTexture, texcoord).s;
    float front_depth = texture2D( frontFaceDepthTexture, texcoord).s;

    //float ExteriorTransparencyFactorValue = 1.0;
    vec4 fragColor = vec4(0.0, 0.0, 0.0, 0.0);

    // make sure the front_depth and back_depth values represent usable depths for later tests
    if (front_depth>back_depth)
    {
        if (front_depth==1.0)
        {
            // front face likely to have been clipped out by near plane
            front_depth = 0.0;
        }
        else
        {
            // front and back faces of hull are reversed so treat them as empty.
            front_depth = 1.0;
            back_depth = 1.0;
        }
    }

    if (back_depth<gl_FragCoord.z)
    {
        // segment front_depth to 0.0, exterior transparancy
        // segment back_depth to front_depth, interior transparency
        // segment gl_FragCoord.z to back_depth, exterior transparency
        fragColor = computeSegment(fragColor, gl_FragCoord.x, gl_FragCoord.y, front_depth, 0.0, ExteriorTransparencyFactorValue, color, texture_depth);
        if (fragColor.a<1.0)
        {
            fragColor = computeSegment(fragColor, gl_FragCoord.x, gl_FragCoord.y, back_depth, front_depth, 1.0, color, texture_depth);
            if (fragColor.a<1.0)
            {
                fragColor = computeSegment(fragColor, gl_FragCoord.x, gl_FragCoord.y, gl_FragCoord.z, back_depth, ExteriorTransparencyFactorValue, color, texture_depth);
            }
        }
    }
    else if (front_depth<gl_FragCoord.z)
    {
        // segment front_depth to 0, exterior transparancy
        // segement gl_FragCoord.z to front_depth, interior transparancy
        // back_depth behind gl_FragCoord.z so clipped out by cube and not required.
        fragColor = computeSegment(fragColor, gl_FragCoord.x, gl_FragCoord.y, front_depth, 0.0, ExteriorTransparencyFactorValue, color, texture_depth);
        if (fragColor.a<1.0)
        {
            fragColor = computeSegment(fragColor, gl_FragCoord.x, gl_FragCoord.y, gl_FragCoord.z, front_depth, 1.0, color, texture_depth);
        }
    }
    else
    {
        // segment gl_FragCoord.z to 0.0
        fragColor = computeSegment(fragColor, gl_FragCoord.x, gl_FragCoord.y, gl_FragCoord.z, 0.0, ExteriorTransparencyFactorValue, color, texture_depth);
    }

    if (texture_depth>gl_FragCoord.z)
    {
        fragColor = mix(color, fragColor, fragColor.a);
    }

    gl_FragColor = fragColor;
    gl_FragDepth = 0.0;
}
