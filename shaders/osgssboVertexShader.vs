#version 430
uniform int numRows;
uniform int numCols;
uniform float osg_FrameTime;
uniform float osg_DeltaFrameTime;
uniform mat4 osg_ProjectionMatrix;
uniform mat4 osg_ModelViewMatrix;
out vec4 particlecolor;
out float particleradius;
attribute vec2 tex_coords;

struct particle{ float    x; float y; float z; float w;};

layout(std140, binding=0) coherent buffer particles{particle p[];}; 

void main() {
ivec2 storePos = ivec2(numRows*tex_coords.x, numCols*tex_coords.y);

particle partCurrPos = p[(storePos.x*numRows + storePos.y)];
particle partProperties = p[7*(numRows*numCols)+(storePos.x*numRows + storePos.y)];
 
 #if 0 //color it somehow if hit 
 float lastHitTime = partProperties.z; 
 if( (osg_FrameTime-lastHitTime) < 0.5)
 {
    partProperties.w =10.0;
 }else
 {
     partProperties.w = 0.0;
 }
 particlecolor.rgb *=  partProperties.w;  particlecolor.a = 1.0;  particleradius = partProperties.y;
 #else
  particlecolor.rgb =  vec3(1,1,1);  particlecolor.a = 1.0;  particleradius = partProperties.y;
 #endif


 vec4 posFromBuffer = vec4(partCurrPos.x, partCurrPos.y, partCurrPos.z, 1.0);
 gl_Position =  posFromBuffer;

 }
