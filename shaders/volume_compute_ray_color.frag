#version 110

uniform vec4 viewportDimensions;
uniform sampler3D volumeTexture;
uniform vec3 volumeCellSize;

uniform float SampleRatioValue;
uniform float TransparencyValue;
varying mat4 texgen_withProjectionMatrixInverse;

// forward declare, probided by volume_accumulateSamples*.frag shaders
vec4 accumulateSamples(vec3 ts, vec3 te, vec3 dt, float scale, float cutoff, int num_iterations);

vec4 accumulateSegment(vec3 ts, vec3 te)
{
    const int max_iterations = 8192;

    float density = volumeCellSize.x;
    if (volumeCellSize.y<density) density = volumeCellSize.y;
    if (volumeCellSize.z<density) density = volumeCellSize.z;
    density /= SampleRatioValue;

    int num_iterations = int(ceil(length((te-ts).xyz)/density));


    vec4 baseColor = vec4(1.0,1.0,1.0,1.0);

    // clamp to 2 to max_iterations range.
    if (num_iterations<2) num_iterations = 2;
    if (num_iterations>max_iterations)
    {
        num_iterations = max_iterations;
        baseColor.r = 0.0;
    }

    // traverse from front to back
    vec3 deltaTexCoord=(ts-te).xyz/float(num_iterations-1);
    float stepLength = length(deltaTexCoord);

    //float scale = 0.5/sampleRatio;
    float scale = stepLength/length(volumeCellSize);
    if (scale>1.0) scale = 1.0;

    scale *= TransparencyValue;

    float cutoff = 1.0-1.0/256.0;

    vec4 fragColor;

    fragColor = accumulateSamples(ts, te, deltaTexCoord, scale, cutoff, num_iterations);

    fragColor *= baseColor;

    return fragColor;
}

vec3 clampToUnitCube(vec3 ts, vec3 te)
{
    if (te.x>=0.0 && te.x<=1.0 &&
        te.y>=0.0 && te.y<=1.0 &&
        te.z>=0.0 && te.z<=1.0)
    {
        // do nothing... te inside volume
        return te;
    }
    else
    {
        if (te.x<0.0)
        {
            float r = -te.x / (ts.x-te.x);
            te = te + (ts-te)*r;
        }

        if (te.x>1.0)
        {
            float r = (1.0-te.x) / (ts.x-te.x);
            te = te + (ts-te)*r;
        }

        if (te.y<0.0)
        {
            float r = -te.y / (ts.y-te.y);
            te = te + (ts-te)*r;
        }

        if (te.y>1.0)
        {
            float r = (1.0-te.y) / (ts.y-te.y);
            te = te + (ts-te)*r;
        }

        if (te.z<0.0)
        {
            float r = -te.z / (ts.z-te.z);
            te = te + (ts-te)*r;
        }

        if (te.z>1.0)
        {
            float r = (1.0-te.z) / (ts.z-te.z);
            te = te + (ts-te)*r;
        }
    }
    return te;
}


vec4 computeRayColor(float px, float py, float depth_start, float depth_end)
{
    float viewportWidth = viewportDimensions[2];
    float viewportHeight = viewportDimensions[3];

    px -= viewportDimensions.x;
    py -= viewportDimensions.y;

    // start and end clip space coords
    vec4 start_clip = vec4((px/viewportWidth)*2.0-1.0, (py/viewportHeight)*2.0-1.0, (depth_start)*2.0-1.0, 1.0);
    vec4 end_clip = vec4((px/viewportWidth)*2.0-1.0, (py/viewportHeight)*2.0-1.0, (depth_end)*2.0-1.0, 1.0);

    vec4 start_texcoord = texgen_withProjectionMatrixInverse * start_clip;
    vec4 end_texcoord = texgen_withProjectionMatrixInverse * end_clip;

    start_texcoord.xyz = start_texcoord.xyz / start_texcoord.w;
    start_texcoord.w = 1.0;

    end_texcoord.xyz = end_texcoord.xyz / end_texcoord.w;
    end_texcoord.w = 1.0;

    vec3 clamped_start_texcoord = clampToUnitCube(end_texcoord.xyz, start_texcoord.xyz);
    vec3 clamped_end_texcoord = clampToUnitCube(start_texcoord.xyz, end_texcoord.xyz);

    return accumulateSegment(clamped_start_texcoord, clamped_end_texcoord);
}
