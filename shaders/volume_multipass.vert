#version 110

uniform mat4 eyeToTile;
uniform mat4 tileToImage;

varying vec4 vertexPos;
varying vec3 lightDirection;
varying vec4 baseColor;

varying mat4 texgen_eyeToTile;

varying float near;
varying float far;
varying float near_mult_far;
varying float far_sub_near;

void main(void)
{
    // compute near and far values from projection matrix.
    near = gl_ProjectionMatrix[2][3] / (gl_ProjectionMatrix[2][2]-1.0);
    far = gl_ProjectionMatrix[2][3] / (1.0+gl_ProjectionMatrix[2][2]);

    near_mult_far = near*far;
    far_sub_near = far-near;

    gl_Position = ftransform();

    vertexPos = gl_Vertex;
    baseColor = gl_FrontMaterial.diffuse;

    vec4 lightPosition = gl_ModelViewMatrixInverse * gl_LightSource[0].position;
    if (lightPosition[3]==0.0)
    {
        // directional light source
        lightDirection = -normalize(lightPosition.xyz);
    }
    else
    {
        // positional light source
        lightDirection = normalize((lightPosition-vertexPos).xyz);
    }

    texgen_eyeToTile =  eyeToTile * gl_ProjectionMatrixInverse;
}
