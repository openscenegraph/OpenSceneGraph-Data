
//
// marble.frag: Fragment shader for producing a marble effect
//
// author: Randi Rost
//
// Copyright (c) 2002: 3Dlabs, Inc.
//

// Mike Weiblen 2003-09-19 : derived from ogl2demo in the 3Dlabs OpenGL2 SDK,
// available from http://www.3dlabs.com/opengl2/

varying float LightIntensity; 
varying vec3  MCposition;

const vec3 MarbleColor = vec3( 0.7, 0.7, 0.7 );
const vec3 VeinColor = vec3( 0.0, 0.15, 0.0 );

uniform sampler3D NoiseTex;
uniform sampler1D SineTex;
uniform vec3 Offset;

void main (void)
{
    vec4 noisevec   = texture3D(NoiseTex, MCposition + Offset.yzx);

    float intensity = abs(noisevec[0] - 0.25) +
                      abs(noisevec[1] - 0.125) +
                      abs(noisevec[2] - 0.0625) +
                      abs(noisevec[3] - 0.03125);

    vec4 unswiz = texture1D(SineTex, MCposition.z + intensity * 2.0);
    float sineval = unswiz.s;
    vec3 color   = mix(VeinColor, MarbleColor, sineval);
    color       *= LightIntensity;
    color = clamp(color, 0.0, 1.0);
    gl_FragColor = vec4 (color, 1.0);
}
