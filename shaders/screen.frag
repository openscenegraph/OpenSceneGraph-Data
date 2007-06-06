
//
// screen.frag: Fragment shader for testing the "discard" command
// an example of an OpenGL Shading Language source file.
//
// author: Randi Rost
//
// Copyright (c) 2002: 3Dlabs, Inc.
//

// This file derived from the ogl2demo example in the 3Dlabs OpenGL2 SDK
// available from http://www.3dlabs.com/opengl2/
// Mike Weiblen 2003-07-14 : til osgGL2 implements the setting of uniforms,
// temporarily use consts instead.

varying vec3  Position;
varying float lightIntensity;

void main (void)
{
    vec3	ct;
    float	ss, tt;

    vec3 pos = Position;
    
    ss = pos.x * 5.1;
    tt = pos.z * 5.1;

    ss = fract (ss);
    tt = fract (tt);

    if ((ss > 0.13) && (tt > 0.13)) discard;

    ct = vec3 (0.9, 0.7, 0.25) * lightIntensity * 1.5;
    ct = clamp(ct, 0.0, 1.0);

    gl_FragColor = vec4 (ct, 1.0);
}
