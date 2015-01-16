#version 120
#extension GL_EXT_geometry_shader4 : enable

varying in float heights_in[4];
varying in vec2 texcoord_in[4];
varying in vec4 basecolor_in[4];

varying out vec2 texcoord;
varying out vec4 basecolor;

void main(void)
{
    vec4 v0 = gl_PositionIn[0];
    vec4 v1 = gl_PositionIn[1];
    vec4 v2 = gl_PositionIn[2];
    vec4 v3 = gl_PositionIn[3];

    float delta_02 = abs(heights_in[2]-heights_in[0]);
    float delta_23 = abs(heights_in[3]-heights_in[2]);

    if (delta_02<delta_23)
    {
        gl_Position = v1; texcoord = texcoord_in[1]; basecolor = basecolor_in[1]; EmitVertex();
        gl_Position = v0; texcoord = texcoord_in[0]; basecolor = basecolor_in[0]; EmitVertex();
        gl_Position = v2; texcoord = texcoord_in[2]; basecolor = basecolor_in[2]; EmitVertex();
        gl_Position = v3; texcoord = texcoord_in[3]; basecolor = basecolor_in[3]; EmitVertex();
        EndPrimitive();
    }
    else
    {
        gl_Position = v2; texcoord = texcoord_in[2]; basecolor = basecolor_in[2]; EmitVertex();
        gl_Position = v1; texcoord = texcoord_in[1]; basecolor = basecolor_in[1]; EmitVertex();
        gl_Position = v3; texcoord = texcoord_in[3]; basecolor = basecolor_in[3]; EmitVertex();
        gl_Position = v0; texcoord = texcoord_in[0]; basecolor = basecolor_in[0]; EmitVertex();
        EndPrimitive();
    }
}
