
//
// brick.frag: Fragment shader for procedural bricks
// an example of an OpenGL Shading Language source file.
//
// author: Dave Baldwin, Steve Koren, Randi Rost
//         originally based on a shader by Darwyn Peachey
//
// Copyright (c) 2002: 3Dlabs, Inc.
//

// This file derived from the ogl2demo example in the 3Dlabs OpenGL2 SDK
// available from http://www.3dlabs.com/opengl2/
// Mike Weiblen 2003-07-14 : til osgGL2 implements the setting of uniforms,
// temporarily use consts instead.

// uniform vec3  BrickColor, MortarColor;
// uniform float ColumnWidth, RowHeight;
// uniform float Bwf, Bhf;

const vec3 BrickColor = vec3(1.0, 0.3, 0.2);
const vec3 MortarColor = vec3(0.85, 0.85, 0.85);
const float ColumnWidth = 0.30;
const float RowHeight = 0.15;
const float Bwf = 0.95;
const float Bhf = 0.90;

varying vec2  MCposition;
varying float LightIntensity;

void main(void)
{
    vec3 color;
    float ss, tt, w, h;
    
    ss = MCposition.x / ColumnWidth;
    tt = MCposition.y / RowHeight;

    if (fract(tt * 0.5) > 0.5)
        ss += 0.5;

    ss = fract(ss);
    tt = fract(tt);

    w = step(ss, Bwf);
    h = step(tt, Bhf);

    color = mix(MortarColor, BrickColor, w * h) * LightIntensity;
    gl_FragColor = vec4 (color, 1.0);
}
