#version 110

uniform sampler3D volumeTexture;

uniform float TransparencyValue;
uniform float AlphaFuncValue;

vec4 accumulateSamples(vec4 fragColor, vec3 ts, vec3 te, vec3 dt, float scale, float cutoff, int num_iterations)
{
    vec3 texcoord = te.xyz;

    float transmittance = 1.0;
    float t_cutoff = 1.0-cutoff;
    while(num_iterations>0 && transmittance>=t_cutoff)
    {
        vec4 color = texture3D( volumeTexture, texcoord);

        if (color.a>=AlphaFuncValue)
        {
            float ca = clamp(color.a*TransparencyValue, 0.0, 1.0);
            float new_transmitance = transmittance*pow(1.0-ca, scale);
            float r = transmittance-new_transmitance;
            fragColor.rgb += color.rgb*r;
            transmittance = new_transmitance;
        }

        texcoord += dt;

        --num_iterations;
    }

    fragColor.a = clamp(1.0-transmittance, 0.0, 1.0);
    if (num_iterations>0) fragColor.a = 1.0;

    return fragColor;
}
