#version 110
varying vec4 cameraPos;
varying vec4 vertexPos;
varying mat4 texgen;

void main(void)
{
        gl_Position = ftransform();

        cameraPos = gl_ModelViewMatrixInverse*vec4(0,0,0,1);
        vertexPos = gl_Vertex;

        texgen = mat4(gl_ObjectPlaneS[0], 
                      gl_ObjectPlaneT[0],
                      gl_ObjectPlaneR[0],
                      gl_ObjectPlaneQ[0]);
}
