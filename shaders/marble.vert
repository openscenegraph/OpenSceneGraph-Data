
//
// marble.vert: Vertex shader for producing a marble effect
//
// author: Randi Rost
//
// Copyright (c) 2002: 3Dlabs, Inc.
//

// Mike Weiblen 2003-09-19 : derived from ogl2demo in the 3Dlabs OpenGL2 SDK,
// available from http://www.3dlabs.com/opengl2/

const float Scale = 1.0;
const vec3  LightPos = vec3( 0.0, 0.0, 4.0 );

varying float LightIntensity;
varying vec3  MCposition;

void main(void)
{
    vec4 ECposition = gl_ModelViewMatrix * gl_Vertex;
    MCposition      = vec3 (gl_Vertex) * Scale;
    vec3 tnorm      = normalize(vec3 (gl_NormalMatrix * gl_Normal));
    LightIntensity  = dot(normalize(LightPos - vec3 (ECposition)), tnorm) * 1.5;
    gl_Position     = gl_ModelViewProjectionMatrix * gl_Vertex;
}
