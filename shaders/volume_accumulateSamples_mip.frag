#version 110

uniform sampler3D volumeTexture;
uniform float TransparencyValue;
uniform float AlphaFuncValue;

vec4 accumulateSamples(vec4 fragColor, vec3 ts, vec3 te, vec3 dt, float scale, float cutoff, int num_iterations)
{
    vec3 texcoord = te.xyz;

    while(num_iterations>0)
    {
        vec4 color = texture3D( volumeTexture, texcoord);

        if (color.a>AlphaFuncValue &&  color.a>fragColor.a)
        {
            fragColor = color;
        }

        texcoord += dt;

        --num_iterations;
    }

    fragColor.a *= TransparencyValue;

    return fragColor;
}
