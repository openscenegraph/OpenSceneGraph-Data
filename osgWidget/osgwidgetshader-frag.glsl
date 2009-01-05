// osgWidget/GLSL - Copyright (C) 2007 Jeremy Moles
// $Id: osgwidgetshader-frag.glsl 59 2008-05-15 20:55:31Z cubicool $

varying vec4 color;

void main()
{
    vec4 c = clamp(color, 0.0, 1.0);

    if(mod(gl_FragCoord.y, 10.0) >= 3.0)
    {
        gl_FragColor = c * vec4(
            gl_FragCoord.y / 1024.0,
            gl_FragCoord.y / 1024.0,
            gl_FragCoord.y / 1024.0,
            0.5);

    }
    else
    {
       gl_FragColor = c * vec4(
            gl_FragCoord.y / 1024.0,
            gl_FragCoord.y / 1024.0,
            gl_FragCoord.y / 1024.0,
            1.0);
    }
}
