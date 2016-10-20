#ifdef GL_ES
    precision highp float;
#endif

varying vec4 vertex_color;

void main()
{
    vertex_color = gl_Color;
    gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}