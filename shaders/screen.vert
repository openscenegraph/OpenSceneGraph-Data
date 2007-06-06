
//
// screen.vert: Vertex shader for testing the "discard" command
//            in a fragment shader
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

// uniform vec3  LightPosition;
const vec3 LightPosition = vec3(0.0, 0.0, 4.0);

const float Scale = 2.1;

varying float lightIntensity;
varying vec3  Position;

const float specularContribution = 0.5;
const float diffuseContribution  = (1.0 - specularContribution);

void main(void) {
    vec4 pos        = gl_ModelViewMatrix * gl_Vertex;
    Position        = gl_Vertex.xyz * Scale;
    vec3 tnorm      = normalize(gl_NormalMatrix * gl_Normal);
    vec3 lightVec   = normalize(LightPosition - vec3(pos));
    vec3 reflectVec = reflect(lightVec, tnorm);
    vec3 viewVec    = normalize(vec3(pos));
    float dotval    = abs(dot(lightVec, tnorm));

    float spec = pow(dot(reflectVec, viewVec), 8.0);

    lightIntensity = diffuseContribution * dotval +
                     specularContribution * spec;
    
    gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;

}
