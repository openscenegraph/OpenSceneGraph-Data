#version 110

uniform sampler3D volumeTexture;

uniform float IsoSurfaceValue;
uniform float TransparencyValue;
varying vec3 lightDirection;

vec4 accumulateSamples(vec4 fragColor, vec3 ts, vec3 te, vec3 dt, float scale, float cutoff, int num_iterations)
{
    vec3 texcoord = te.xyz;

    float normalSampleDistance = length(dt);
    vec3 deltaX = vec3(normalSampleDistance, 0.0, 0.0);
    vec3 deltaY = vec3(0.0, normalSampleDistance, 0.0);
    vec3 deltaZ = vec3(0.0, 0.0, normalSampleDistance);

    vec4 previousColor = texture3D( volumeTexture, texcoord);

    float targetValue = IsoSurfaceValue;

    while(num_iterations>0)
    {
        vec4 color = texture3D( volumeTexture, texcoord);

        float m = (previousColor.a-targetValue) * (color.a-targetValue);
        if (m <= 0.0)
        {
            float r = (targetValue-color.a)/(previousColor.a-color.a);
            texcoord = texcoord - r*dt;

            color.rgba = vec4(1.0, 1.0, 1.0, 1.0);

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

            color.a = clamp(color.a*TransparencyValue, 0.0, 1.0);
            return color;
        }

        previousColor = color;

        texcoord += dt;

        --num_iterations;
    }

    return vec4(0.0, 0.0, 0.0, 0.0);
}
