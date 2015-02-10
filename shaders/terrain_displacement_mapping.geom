#version 120

#pragma requires(COMPUTE_DIAGONALS)

#extension GL_EXT_geometry_shader4 : enable

varying in vec3 normals_in[4];
varying in vec2 texcoord_in[4];
varying in vec4 basecolor_in[4];

varying out vec2 texcoord;
varying out vec4 basecolor;

void main(void)
{
    float delta_02 = dot(normals_in[2],normals_in[0]);
    float delta_13 = dot(normals_in[3],normals_in[1]);

    if (delta_02>delta_13)
    {
        gl_Position = gl_PositionIn[3]; texcoord = texcoord_in[3]; basecolor = basecolor_in[3]; EmitVertex();
        gl_Position = gl_PositionIn[2]; texcoord = texcoord_in[2]; basecolor = basecolor_in[2]; EmitVertex();
        gl_Position = gl_PositionIn[0]; texcoord = texcoord_in[0]; basecolor = basecolor_in[0]; EmitVertex();
        gl_Position = gl_PositionIn[1]; texcoord = texcoord_in[1]; basecolor = basecolor_in[1]; EmitVertex();
        EndPrimitive();
    }
    else
    {
        gl_Position = gl_PositionIn[0]; texcoord = texcoord_in[0]; basecolor = basecolor_in[0]; EmitVertex();
        gl_Position = gl_PositionIn[3]; texcoord = texcoord_in[3]; basecolor = basecolor_in[3]; EmitVertex();
        gl_Position = gl_PositionIn[1]; texcoord = texcoord_in[1]; basecolor = basecolor_in[1]; EmitVertex();
        gl_Position = gl_PositionIn[2]; texcoord = texcoord_in[2]; basecolor = basecolor_in[2]; EmitVertex();
        EndPrimitive();
    }
}
