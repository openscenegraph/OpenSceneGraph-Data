uniform sampler2D sourceTexture;
uniform sampler1D lookupTexture;

uniform float minValue;
uniform float inverseRange;
uniform mat3 filterMatrix;
varying vec2 texcoord[9];

void main()
{
    float value = 0.0;
    value += texture2D(sourceTexture, texcoord[0].xy).x * filterMatrix[0][0];
    value += texture2D(sourceTexture, texcoord[1].xy).x * filterMatrix[0][1];
    value += texture2D(sourceTexture, texcoord[2].xy).x * filterMatrix[0][2];
    value += texture2D(sourceTexture, texcoord[3].xy).x * filterMatrix[1][0];
    value += texture2D(sourceTexture, texcoord[4].xy).x * filterMatrix[1][1];
    value += texture2D(sourceTexture, texcoord[5].xy).x * filterMatrix[1][2];
    value += texture2D(sourceTexture, texcoord[6].xy).x * filterMatrix[2][0];
    value += texture2D(sourceTexture, texcoord[7].xy).x * filterMatrix[2][1];
    value += texture2D(sourceTexture, texcoord[8].xy).x * filterMatrix[2][2];
    
    vec4 overlay_color = texture1D(lookupTexture, (value-minValue)*inverseRange );

    gl_FragColor = overlay_color * gl_Color;
}
