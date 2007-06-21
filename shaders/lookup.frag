uniform sampler2D sourceTexture;
uniform sampler1D lookupTexture;

uniform float minValue;
uniform float inverseRange;
uniform mat3 filterMatrix;
varying vec2 texcoord[9];

uniform float filterBias;

#if 1

void main()
{
    float value_0 = 0.0;
    float original_value = texture2D(sourceTexture, texcoord[4].xy, 0.0).x;
    float max_delta = 0.01;
    float value = original_value;
    float minBias = 0.5;
    float maxBias = 2.5;
    float deltaBias = 0.5;
    for(float bias = minBias; bias<filterBias; bias += deltaBias)
    {
        float new_value = texture2D(sourceTexture, texcoord[4].xy, bias).x;
        if (abs(new_value-original_value) > max_delta) break;
        value = new_value; 
    }
    
    vec4 overlay_color = texture1D(lookupTexture, (value-minValue)*inverseRange );

    gl_FragColor = overlay_color * gl_Color;
}

#else

void main()
{
    float bias = filterBias;

    float value = 0.0;
    value += texture2D(sourceTexture, texcoord[0].xy, bias).x * filterMatrix[0][0];
    value += texture2D(sourceTexture, texcoord[1].xy, bias).x * filterMatrix[0][1];
    value += texture2D(sourceTexture, texcoord[2].xy, bias).x * filterMatrix[0][2];
    value += texture2D(sourceTexture, texcoord[3].xy, bias).x * filterMatrix[1][0];
    value += texture2D(sourceTexture, texcoord[4].xy, bias).x * filterMatrix[1][1];
    value += texture2D(sourceTexture, texcoord[5].xy, bias).x * filterMatrix[1][2];
    value += texture2D(sourceTexture, texcoord[6].xy, bias).x * filterMatrix[2][0];
    value += texture2D(sourceTexture, texcoord[7].xy, bias).x * filterMatrix[2][1];
    value += texture2D(sourceTexture, texcoord[8].xy, bias).x * filterMatrix[2][2];
    
    vec4 overlay_color = texture1D(lookupTexture, (value-minValue)*inverseRange );

    gl_FragColor = overlay_color * gl_Color;
}
#endif
