// ShaderGen shader
// new version
#ifdef GL_ES
    precision highp float;
#endif

#pragma import_defines(GL_LIGHTING, GL_TEXTURE_2D)


#ifdef GL_LIGHTING
void directionalLight( int lightNum, vec3 normal, inout vec4 color )
{
    vec3 n = normalize(gl_NormalMatrix * normal);

    float NdotL = dot( n, normalize(gl_LightSource[lightNum].position.xyz) );
    NdotL = max( 0.0, NdotL );

    float NdotHV = dot( n, gl_LightSource[lightNum].halfVector.xyz );
    NdotHV = max( 0.0, NdotHV );

    color *= gl_FrontLightModelProduct.sceneColor +
             gl_FrontLightProduct[lightNum].ambient +
             gl_FrontLightProduct[lightNum].diffuse * NdotL;

    if ( NdotL * NdotHV > 0.0 )
        color += gl_FrontLightProduct[lightNum].specular * pow( NdotHV, gl_FrontMaterial.shininess );
}
#endif

varying vec4 vertexColor;

void main()
{
  gl_Position = ftransform();

#if defined(GL_TEXTURE_2D)
  gl_TexCoord[0] = gl_MultiTexCoord0;
#endif

  vertexColor = gl_Color;

#if defined(GL_LIGHTING)
    directionalLight(0, gl_Normal, vertexColor);
#endif
}
