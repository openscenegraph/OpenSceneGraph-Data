#version 110

uniform sampler3D volumeTexture;

uniform sampler1D tfTexture;
uniform float tfScale;
uniform float tfOffset;

uniform float AlphaFuncValue;

varying vec3 lightDirection;

vec4 accumulateSamples(vec4 fragColor, vec3 ts, vec3 te, vec3 dt, float scale, float cutoff, int num_iterations)
{
    vec3 texcoord = te.xyz;

    float normalSampleDistance = length(dt);
    vec3 deltaX = vec3(normalSampleDistance, 0.0, 0.0);
    vec3 deltaY = vec3(0.0, normalSampleDistance, 0.0);
    vec3 deltaZ = vec3(0.0, 0.0, normalSampleDistance);

    while(num_iterations>0 && fragColor.a<cutoff)
    {
        float a = texture3D( volumeTexture, texcoord).a;
        float v = a * tfScale + tfOffset;
        vec4 color = texture1D( tfTexture, v);

        if (a>AlphaFuncValue)
        {

            float px = texture3D( volumeTexture, texcoord + deltaX).a;
            float py = texture3D( volumeTexture, texcoord + deltaY).a;
            float pz = texture3D( volumeTexture, texcoord + deltaZ).a;

            float nx = texture3D( volumeTexture, texcoord - deltaX).a;
            float ny = texture3D( volumeTexture, texcoord - deltaY).a;
            float nz = texture3D( volumeTexture, texcoord - deltaZ).a;

            vec3 grad = vec3(px-nx, py-ny, pz-nz);
            if (grad.x!=0.0 || grad.y!=0.0 || grad.z!=0.0)
            {
                vec3 normal = normalize(grad);
                float lightScale = 0.1 +  max(0.0, dot(normal.xyz, lightDirection))*0.9;

                color.r *= lightScale;
                color.g *= lightScale;
                color.b *= lightScale;
            }

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
