#version 110

uniform vec4 viewportDimensions;
uniform sampler3D volumeTexture;
uniform vec3 volumeCellSize;
uniform mat4 tileToImage;
uniform float SampleRatioValue;

varying mat4 texgen_eyeToTile;

// forward declare, probided by volume_accumulateSamples*.frag shaders
vec4 accumulateSamples(vec4 fragColor, vec3 ts, vec3 te, vec3 dt, float scale, float cutoff, int num_iterations);

vec4 accumulateSegment(vec4 fragColor, vec3 ts, vec3 te)
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
    }

    // traverse from front to back
    vec3 deltaTexCoord=(ts-te).xyz/float(num_iterations-1);
    float stepLength = length(deltaTexCoord);

    //float scale = 0.5/sampleRatio;
    float scale = 1.73*stepLength/length(volumeCellSize);
    if (scale>1.0) scale = 1.0;

    float cutoff = 1.0-1.0/256.0;

    fragColor = accumulateSamples(fragColor, ts, te, deltaTexCoord, scale, cutoff, num_iterations);

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


vec4 computeRayColor(vec4 fragColor, float px, float py, float depth_start, float depth_end)
{
    float viewportWidth = viewportDimensions[2];
    float viewportHeight = viewportDimensions[3];

    px -= viewportDimensions.x;
    py -= viewportDimensions.y;

    // start and end clip space coords
    vec4 start_clip = vec4((px/viewportWidth)*2.0-1.0, (py/viewportHeight)*2.0-1.0, (depth_start)*2.0-1.0, 1.0);
    vec4 end_clip = vec4((px/viewportWidth)*2.0-1.0, (py/viewportHeight)*2.0-1.0, (depth_end)*2.0-1.0, 1.0);

    // compute the coords in tile coordinates
    vec4 start_tile = texgen_eyeToTile * start_clip;
    vec4 end_tile = texgen_eyeToTile * end_clip;

    start_tile.xyz = start_tile.xyz / start_tile.w;
    start_tile.w = 1.0;

    end_tile.xyz = end_tile.xyz / end_tile.w;
    end_tile.w = 1.0;

    vec4 clamped_start_tile = vec4(clampToUnitCube(end_tile.xyz, start_tile.xyz), 1.0);
    vec4 clamped_end_tile = vec4(clampToUnitCube(start_tile.xyz, end_tile.xyz), 1.0);

    // compute texcoords in image/texture coords
    vec4 start_texcoord = tileToImage * clamped_start_tile;
    vec4 end_texcoord = tileToImage * clamped_end_tile;

    start_texcoord.xyz = start_texcoord.xyz / start_texcoord.w;
    start_texcoord.w = 1.0;

    end_texcoord.xyz = end_texcoord.xyz / end_texcoord.w;
    end_texcoord.w = 1.0;

    vec3 clamped_start_texcoord = clampToUnitCube(end_texcoord.xyz, start_texcoord.xyz);
    vec3 clamped_end_texcoord = clampToUnitCube(start_texcoord.xyz, end_texcoord.xyz);

    return accumulateSegment(fragColor, clamped_start_texcoord, clamped_end_texcoord);
}
