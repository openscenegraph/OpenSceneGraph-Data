#version 110

uniform sampler3D volumeTexture;

uniform float TransparencyValue;
uniform float AlphaFuncValue;
uniform sampler1D tfTexture;
uniform float tfScale;
uniform float tfOffset;

vec4 accumulateSamples(vec4 fragColor, vec3 ts, vec3 te, vec3 dt, float scale, float cutoff, int num_iterations)
{
    vec3 texcoord = te.xyz;

    float max_a = 0.0;
    while(num_iterations>0)
    {
        float a = texture3D( volumeTexture, texcoord).a;

        if (a>max_a)
        {
            float v = a * tfScale + tfOffset;
            vec4 color = texture1D( tfTexture, v);
            if (color.a>AlphaFuncValue)
            {
                fragColor = color;
                max_a = a;
            }
        }

        texcoord += dt;

        --num_iterations;
    }

    fragColor.a *= TransparencyValue;

    return fragColor;
}
