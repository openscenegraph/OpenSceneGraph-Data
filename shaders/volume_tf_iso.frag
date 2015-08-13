#version 110

#pragma import_defines(NVIDIA_Corporation)

uniform sampler3D baseTexture;

uniform sampler1D tfTexture;
uniform float tfScale;
uniform float tfOffset;

uniform float SampleDensityValue;
uniform float TransparencyValue;
uniform float IsoSurfaceValue;

varying vec4 cameraPos;
varying vec4 vertexPos;
varying vec3 lightDirection;
varying mat4 texgen;
varying vec4 baseColor;

void main(void)
{
    vec4 t0 = vertexPos;
    vec4 te = cameraPos;

    if (te.x>=0.0 && te.x<=1.0 &&
        te.y>=0.0 && te.y<=1.0 &&
        te.z>=0.0 && te.z<=1.0)
    {
        // do nothing... te inside volume
    }
    else
    {
        if (te.x<0.0)
        {
            float r = -te.x / (t0.x-te.x);
            te = te + (t0-te)*r;
        }

        if (te.x>1.0)
        {
            float r = (1.0-te.x) / (t0.x-te.x);
            te = te + (t0-te)*r;
        }

        if (te.y<0.0)
        {
            float r = -te.y / (t0.y-te.y);
            te = te + (t0-te)*r;
        }

        if (te.y>1.0)
        {
            float r = (1.0-te.y) / (t0.y-te.y);
            te = te + (t0-te)*r;
        }

        if (te.z<0.0)
        {
            float r = -te.z / (t0.z-te.z);
            te = te + (t0-te)*r;
        }

        if (te.z>1.0)
        {
            float r = (1.0-te.z) / (t0.z-te.z);
            te = te + (t0-te)*r;
        }
    }

    t0 = t0 * texgen;
    te = te * texgen;

    const float min_iteratrions = 2.0;
    const float max_iteratrions = 2048.0;

    float num_iterations = ceil(length((te-t0).xyz)/SampleDensityValue);

    if (num_iterations<min_iteratrions) num_iterations = min_iteratrions;
    else if (num_iterations>max_iteratrions) num_iterations = max_iteratrions;
    #ifdef NVIDIA_Corporation
    // Recent NVidia drivers have a bug in length() where it throws nan for some values of input into length() so catch these
    else if (num_iterations!=num_iterations) num_iterations = max_iteratrions;
    #endif

    vec3 deltaTexCoord=(t0-te).xyz/float(num_iterations-1.0);
    vec3 texcoord = te.xyz;
    float previousV = texture3D( baseTexture, texcoord).a;

    float normalSampleDistance = 1.0/512.0;
    vec3 deltaX = vec3(normalSampleDistance, 0.0, 0.0);
    vec3 deltaY = vec3(0.0, normalSampleDistance, 0.0);
    vec3 deltaZ = vec3(0.0, 0.0, normalSampleDistance);

    while(num_iterations>0.0)
    {

        float v = texture3D( baseTexture, texcoord).a;

        float m = (previousV-IsoSurfaceValue) * (v-IsoSurfaceValue);
        if (m <= 0.0)
        {
            float r = (IsoSurfaceValue-v)/(previousV-v);
            texcoord = texcoord - r*deltaTexCoord;

            v = texture3D( baseTexture, texcoord).a * tfScale + tfOffset;
            vec4 color = texture1D( tfTexture, v);

            float px = texture3D( baseTexture, texcoord + deltaX).a;
            float py = texture3D( baseTexture, texcoord + deltaY).a;
            float pz = texture3D( baseTexture, texcoord + deltaZ).a;

            float nx = texture3D( baseTexture, texcoord - deltaX).a;
            float ny = texture3D( baseTexture, texcoord - deltaY).a;
            float nz = texture3D( baseTexture, texcoord - deltaZ).a;

            vec3 grad = vec3(px-nx, py-ny, pz-nz);
            if (grad.x!=0.0 || grad.y!=0.0 || grad.z!=0.0)
            {
                vec3 normal = normalize(grad);
                float lightScale = 0.1 +  max(0.0, dot(normal.xyz, lightDirection))*0.9;

                color.x *= lightScale;
                color.y *= lightScale;
                color.z *= lightScale;
            }

            color *= baseColor;

            gl_FragColor = color;

            return;
        }

        previousV = v;

        texcoord += deltaTexCoord;

        --num_iterations;
    }

    // we didn't find an intersection so just discard fragment
    discard;
}
