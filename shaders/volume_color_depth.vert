#version 110

varying vec4 texcoord;

void main(void)
{
    gl_Position = ftransform();
    texcoord = gl_MultiTexCoord0;
}
