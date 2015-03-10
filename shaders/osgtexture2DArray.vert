varying vec3 texcoord;
uniform float osg_SimulationTime;

void main(void)
{
    texcoord.xy = gl_MultiTexCoord0.xy;
    texcoord.z = mod(osg_SimulationTime,3.0);
    gl_Position   = gl_ModelViewProjectionMatrix * gl_Vertex;
}
