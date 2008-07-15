// osgWidget/GLSL - Copyright (C) 2007 Jeremy Moles
// $Id: osgwidgetshader-frag.glsl 59 2008-05-15 20:55:31Z cubicool $

varying vec4 color;

void main() {
	// TODO: This doesn't work?
	vec4 c = clamp(color, 0.0, 1.0);

	if(int(gl_FragCoord.y) % 10 >= 3) gl_FragColor = c * vec4(
		gl_FragCoord.y / 1024.0,
		gl_FragCoord.y / 1024.0,
		gl_FragCoord.y / 1024.0,
		0.5
	);

	else gl_FragColor = c * vec4(
		gl_FragCoord.y / 1024.0,
		gl_FragCoord.y / 1024.0,
		gl_FragCoord.y / 1024.0,
		1.0
	);
}
