#version 110

varying vec4 cameraPos;
varying vec4 vertexPos;
varying vec3 lightDirection;
varying mat4 texgen;
varying vec4 baseColor;

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

    cameraPos = gl_ModelViewMatrixInverse * vec4(0,0,0,1);
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


    texgen = mat4(gl_ObjectPlaneS[0],
                    gl_ObjectPlaneT[0],
                    gl_ObjectPlaneR[0],
                    gl_ObjectPlaneQ[0]);
}
