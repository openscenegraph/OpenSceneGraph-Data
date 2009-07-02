uniform sampler3D baseTexture;
uniform float SampleDensityValue;
uniform float TransparencyValue;
uniform float AlphaFuncValue;

varying vec4 cameraPos;
varying vec4 vertexPos;
varying mat4 texgen;

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

    const float max_iteratrions = 2048.0;
    float num_iterations = ceil(length((te-t0).xyz)/SampleDensityValue);
    if (num_iterations<2.0) num_iterations = 2.0;

    if (num_iterations>max_iteratrions) 
    {
        num_iterations = max_iteratrions;
    }

    vec3 deltaTexCoord=(te-t0).xyz/float(num_iterations-1.0);
    vec3 texcoord = t0.xyz;

    vec4 fragColor = vec4(0.0, 0.0, 0.0, 0.0); 
    while(num_iterations>0.0)
    {
        vec4 color = texture3D( baseTexture, texcoord);
        if (fragColor.w<color.w)
        {
            fragColor = color;
        }
        texcoord += deltaTexCoord; 

        --num_iterations;
    }

    fragColor.w *= TransparencyValue;

    if (fragColor.w>1.0) fragColor.w = 1.0; 
    if (fragColor.w<AlphaFuncValue) discard;
    
    gl_FragColor = fragColor;
}
