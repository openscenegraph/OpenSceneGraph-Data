#version 120
void main()
{
    // Vertex position in main camera Screen space.
    gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}

