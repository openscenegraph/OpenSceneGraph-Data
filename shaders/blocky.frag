// blocky.frag - an OGLSL fragment shader with animation
// Mike Weiblen 2003-09-16 : derived from brick.frag
// Copyright 2003 3Dlabs Inc.
// see http://www.3dlabs.com/opengl2/ for more OpenGL Shading Language info.


// the App updates uniforms "slowly" (eg once per frame) for animation.
uniform float Sine;
uniform vec3 Color1;
uniform vec3 Color2;

// varyings are written by vert shader, interpolated, and read by frag shader.
varying vec2  BlockPosition;
varying float LightIntensity;

void main(void)
{
    vec3 color;
    float ss, tt, w, h;
    
    ss = BlockPosition.x;
    tt = BlockPosition.y;

    if (fract(tt * 0.5) > 0.5)
        ss += 0.5;

    ss = fract(ss);
    tt = fract(tt);

    // animate the proportion of block to mortar
    float blockFract = (Sine + 1.1) * 0.4;

    w = step(ss, blockFract);
    h = step(tt, blockFract);

    color = mix(Color2, Color1, w * h) * LightIntensity;
    gl_FragColor = vec4 (color, 1.0);
}

