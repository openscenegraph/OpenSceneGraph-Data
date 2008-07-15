// osgWidget/GLSL - Copyright (C) 2007 Jeremy Moles
// $Id: osgwidgetshader-vert.glsl 28 2008-03-26 15:26:48Z cubicool $

// TODO: If I want do picking properly I need to transform the mouse coordinates
// by the matrix of the WindowManger.

varying vec4 color;

void main() {
	color = gl_Color;

	gl_Position = ftransform();
}
