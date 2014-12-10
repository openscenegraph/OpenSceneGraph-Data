#version 430
#extension GL_EXT_geometry_shader4 : enable
layout(points) in; 
layout(triangle_strip, max_vertices = 4) out; 
uniform mat4 osg_ProjectionMatrix;
uniform mat4 osg_ModelViewMatrix;
out vec2 ex_TexCoor;in vec4 particlecolor[];
in float particleradius[];
out vec4 particlecolorGS;
void main(void){
vec4 particlePos = osg_ProjectionMatrix * osg_ModelViewMatrix *gl_PositionIn[0]; 
float quadLength =  particleradius[0] *0.025  ; 
  particlecolorGS = particlecolor[0];gl_Position = particlePos;ex_TexCoor = vec2(0, 0); 
EmitVertex(); 
gl_Position = particlePos;  gl_Position.x += quadLength; 
ex_TexCoor = vec2(1, 0); 
EmitVertex(); 

gl_Position = particlePos;gl_Position.y += quadLength * 2; 
ex_TexCoor = vec2(0, 1); 
EmitVertex(); 
gl_Position = particlePos;
gl_Position.y += quadLength * 2; 
gl_Position.x += quadLength; 
ex_TexCoor = vec2(1, 1); 
EmitVertex(); 
EndPrimitive(); 
}
