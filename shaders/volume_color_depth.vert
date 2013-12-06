#version 110

varying vec4 texcoord;

varying float near;
varying float far;
varying float near_mult_far;
varying float far_sub_near;

void main(void)
{
    gl_Position = ftransform();
    texcoord = gl_MultiTexCoord0;

    // compute near and far values from projection matrix.
    near = gl_ProjectionMatrix[2][3] / (gl_ProjectionMatrix[2][2]-1.0);
    far = gl_ProjectionMatrix[2][3] / (1.0+gl_ProjectionMatrix[2][2]);

    near_mult_far = near*far;
    far_sub_near = far-near;
}
