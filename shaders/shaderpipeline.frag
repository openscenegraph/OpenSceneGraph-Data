#ifdef GL_ES
    precision highp float;
#endif

varying vec4 vertex_color;

void main()
{
    gl_FragColor = vertex_color;
}