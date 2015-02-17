#pragma import_defines ( LIGHTING, TEXTURE_2D, VERTEX_FUNC(v) )

#ifdef LIGHTING
// forward declare lighting computation, provided by lighting.vert shader
void directionalLight( int lightNum, vec3 normal, inout vec4 color );
#endif

#ifdef TEXTURE_2D
varying vec2 texcoord;
#endif

#ifdef VERTEX_FUNC
uniform float osg_SimulationTime;
#endif

varying vec4 basecolor;

void main(void)
{
    basecolor = gl_Color;

#ifdef LIGHTING
    directionalLight( 0, gl_Normal.xyz, basecolor);
#endif

#ifdef TEXTURE_2D
    // if we want texturing we need to pass on texture coords
    texcoord = gl_MultiTexCoord0.xy;
#endif

#ifdef VERTEX_FUNC
    gl_Position   = gl_ModelViewProjectionMatrix * VERTEX_FUNC(gl_Vertex);
#else
    gl_Position   = gl_ModelViewProjectionMatrix * gl_Vertex;
#endif

}
