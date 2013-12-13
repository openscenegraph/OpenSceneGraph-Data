#version 110

uniform sampler3D volumeTexture;

uniform float AlphaFuncValue;

vec4 accumulateSamples(vec3 ts, vec3 te, vec3 dt, float scale, float cutoff, int num_iterations)
{
    vec3 texcoord = te.xyz;
    vec4 fragColor = vec4(0.0, 0.0, 0.0, 0.0);

    while(num_iterations>0 && fragColor.a<cutoff)
    {
        vec4 color = texture3D( volumeTexture, texcoord);

        if (color.a>AlphaFuncValue)
        {
            float r = color.a * ((1.0-fragColor.a)*scale);
            fragColor.rgb += color.rgb*r;
            fragColor.a += r;
        }

        texcoord += dt;

        --num_iterations;
    }

    if (num_iterations>0) fragColor.a = 1.0;

    return fragColor;
}
