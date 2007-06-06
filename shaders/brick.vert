
//
// brick.vert: Vertex shader for procedural bricks
// an example of an OpenGL Shading Language source file.
//
// author: Dave Baldwin, Steve Koren, Randi Rost
//         based on a shader by Darwyn Peachey
//
// Copyright (c) 2002: 3Dlabs, Inc.
//

// This file derived from the ogl2demo example in the 3Dlabs OpenGL2 SDK
// available from http://www.3dlabs.com/opengl2/
// Mike Weiblen 2003-07-14 : til osgGL2 implements the setting of uniforms,
// temporarily use consts instead.

//uniform vec3 LightPosition;
const vec3 LightPosition = vec3(0.0, 0.0, 4.0);

const float specularContribution = 0.3;
const float diffuseContribution  = (1.0 - specularContribution);

varying float LightIntensity;
varying vec2  MCposition;

void main(void)
{
    vec4 ecPosition = gl_ModelViewMatrix * gl_Vertex;
    vec3 tnorm      = normalize(gl_NormalMatrix * gl_Normal);
    vec3 lightVec   = normalize(LightPosition - vec3 (ecPosition));
    vec3 reflectVec = reflect(-lightVec, tnorm);
    vec3 viewVec    = normalize(vec3 (-ecPosition));
    float spec      = max(dot(reflectVec, viewVec), 0.0);
    spec            = pow(spec, 16.0);
    LightIntensity  = diffuseContribution * max(dot(lightVec, tnorm), 0.0) +
                      specularContribution * spec;
    MCposition      = gl_Vertex.xz;
    gl_Position     = gl_ModelViewProjectionMatrix * gl_Vertex;
}
