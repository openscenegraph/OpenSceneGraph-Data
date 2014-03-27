#version 110

uniform sampler2D colorTexture;
uniform sampler2D depthTexture;
uniform sampler2D frontFaceDepthTexture;
uniform vec4 viewportDimensions;

// declare function defined in volume_compute_ray_color.frag
vec4 computeRayColor(vec4 fragColor, float px, float py, float depth_start, float depth_end);

void main(void)
{
    vec2 texcoord = vec2((gl_FragCoord.x-viewportDimensions[0])/viewportDimensions[2], (gl_FragCoord.y-viewportDimensions[1])/viewportDimensions[3]);
    vec4 color = texture2D( colorTexture, texcoord);
    float texture_depth = texture2D( depthTexture, texcoord).s;
    float front_depth = texture2D( frontFaceDepthTexture, texcoord).s;

    // if front_depth is set to the far plane then front
    // face has been clipped out by the near plane, so assume
    // front_depth is near plane and reset depth to 0.0
    if (front_depth==1.0) front_depth = 0.0;

    if (gl_FragCoord.z<texture_depth)
    {
        // fragment starts infront of all other scene objects

        gl_FragDepth = front_depth; // gl_FragCoord.z;

        vec4 ray_color = computeRayColor(vec4(0.0,0.0,0.0,0.0), gl_FragCoord.x, gl_FragCoord.y, gl_FragCoord.z, front_depth);

        gl_FragColor = mix(color, ray_color, ray_color.a);
    }
    else
    {
        // fragment starts behind other scene objects
        discard;

        if (front_depth<texture_depth)
        {
            gl_FragDepth = front_depth;
        }
        else
        {
            gl_FragDepth = texture_depth;
        }

        if (color.a<1.0)
        {
            // need to blend ray behind objects with object color and then with the ray from the object depth to the eye point

            if (front_depth<texture_depth)
            {
                vec4 front_ray_color = computeRayColor(vec4(0.0,0.0,0.0,0.0), gl_FragCoord.x, gl_FragCoord.y, texture_depth, front_depth);
                // front_ray_color *= vec4(0.0,0.0,1.0,1.0);
                if (front_ray_color.a<1.0)
                {
                    if (color.a<1.0)
                    {
                        vec4 back_ray_color = computeRayColor(vec4(0.0,0.0,0.0,0.0), gl_FragCoord.x, gl_FragCoord.y, gl_FragCoord.z, texture_depth);
                        // back_ray_color *= vec4(0.0,1.0,0.0,1.0);
                        color = mix(back_ray_color, color, color.a);
                    }
                    gl_FragColor = mix(color, front_ray_color, front_ray_color.a);
                }
                else
                {
                    gl_FragColor = front_ray_color;
                }
            }
            else
            {
                vec4 back_ray_color = computeRayColor(vec4(0.0,0.0,0.0,0.0), gl_FragCoord.x, gl_FragCoord.y, gl_FragCoord.z, front_depth);
                // back_ray_color *= vec4(0.0,1.0,1.0,1.0);
                gl_FragColor = mix(back_ray_color, color, color.a);
            }
        }
        else
        {
            // main scene fragment is opaque so no blending required with ray beyond scene depth

            // if the front face depth is behind the depth in the main scene
            if (front_depth>texture_depth) discard;

            // gl_FragDepth = texture_depth;

            // need to blend the object color with the ray from the object depth to the eye point
            vec4 ray_color = computeRayColor(vec4(0.0,0.0,0.0,0.0), gl_FragCoord.x, gl_FragCoord.y, texture_depth, front_depth);
            // ray_color *= vec4(1.0,1.0,0.0,1.0);
            gl_FragColor = mix(color, ray_color, ray_color.a);
        }
    }

}
