#version 110

uniform sampler3D volumeTexture;

vec4 accumulateSamples(vec3 ts, vec3 te, vec3 dt, float scale, float cutoff, int num_iterations)
{
    vec3 texcoord = te.xyz;
    vec4 fragColor = vec4(0.0, 0.0, 0.0, 0.0);

    while(num_iterations>0)
    {
        vec4 color = texture3D( volumeTexture, texcoord);

        if (color.a>fragColor.a)
        {
            fragColor = color;
        }

        texcoord += dt;

        --num_iterations;
    }

    return fragColor;
}
