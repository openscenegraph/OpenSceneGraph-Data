#pragma import_defines ( GL_LIGHTING, GL_TEXTURE_2D )

#ifdef GL_LIGHTING
// forward declare lighting computation, provided by lighting.vert shader
void directionalLight( int lightNum, vec3 normal, inout vec4 color );
#endif

#ifdef GL_TEXTURE_2D
varying vec2 texcoord;
#endif

varying vec4 basecolor;

void main(void)
{
    basecolor = gl_Color;

#ifdef GL_LIGHTING
    directionalLight( 0, gl_Normal.xyz, basecolor);
#endif

#ifdef GL_TEXTURE_2D
    // if we want texturing we need to pass on texture coords
    texcoord = gl_MultiTexCoord0.xy;
#endif

    gl_Position   = gl_ModelViewProjectionMatrix * gl_Vertex;

}
