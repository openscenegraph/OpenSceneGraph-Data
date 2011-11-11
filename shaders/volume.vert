#version 110
varying vec4 cameraPos;
varying vec4 vertexPos;
varying vec3 lightDirection;
varying mat4 texgen;
varying vec4 baseColor;

void main(void)
{
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
