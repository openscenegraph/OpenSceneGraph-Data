#version 110

uniform sampler2D colorTexture;
uniform sampler2D depthTexture;
uniform vec4 viewportDimensions;

// declare function defined in volume_compute_ray_color.frag
vec4 computeRayColor(float px, float py, float depth_start, float depth_end);

void main(void)
{
    vec2 texcoord = vec2((gl_FragCoord.x-viewportDimensions[0])/viewportDimensions[2], (gl_FragCoord.y-viewportDimensions[1])/viewportDimensions[3]);
    vec4 color = texture2D( colorTexture, texcoord);
    float texture_depth = texture2D( depthTexture, texcoord).s;

    if (gl_FragCoord.z<texture_depth)
    {
        gl_FragDepth = gl_FragCoord.z;

        // fragment starts infront of all other scene objects
        vec4 ray_color = computeRayColor(gl_FragCoord.x, gl_FragCoord.y, gl_FragCoord.z, 0.0);
        gl_FragColor = mix(color, ray_color, ray_color.a);
    }
    else
    {
        gl_FragDepth = texture_depth;
        // fragment starts behind other scene objects
        if (color.a<1.0)
        {
            // need to blend ray behind objects with object color and then with the ray from the object depth to the eye point
            vec4 front_ray_color = computeRayColor(gl_FragCoord.x, gl_FragCoord.y, texture_depth, 0.0);
            if (front_ray_color.a<1.0)
            {
                if (color.a<1.0)
                {
                    vec4 back_ray_color = computeRayColor(gl_FragCoord.x, gl_FragCoord.y, gl_FragCoord.z, texture_depth);
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
            // need to blend the object color with the ray from the object depth to the eye point
            vec4 ray_color = computeRayColor(gl_FragCoord.x, gl_FragCoord.y, texture_depth, 0.0);
            gl_FragColor = mix(color, ray_color, ray_color.a);
        }
    }

}
