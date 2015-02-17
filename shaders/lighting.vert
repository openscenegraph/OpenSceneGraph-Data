#pragma requires(LIGHTING)

void directionalLight( int lightNum, vec3 normal, inout vec4 color )
{
    vec3 n = normalize(gl_NormalMatrix * normal);

    float NdotL = dot( n, normalize(gl_LightSource[lightNum].position.xyz) );
    NdotL = max( 0.0, NdotL );

    float NdotHV = dot( n, gl_LightSource[lightNum].halfVector.xyz );
    NdotHV = max( 0.0, NdotHV );
#if 1
    color *= gl_LightSource[lightNum].ambient +
             gl_LightSource[lightNum].diffuse * NdotL;
#else
    color *= gl_FrontLightModelProduct.sceneColor +
             gl_FrontLightProduct[lightNum].ambient +
             gl_FrontLightProduct[lightNum].diffuse * NdotL;
#endif
#if 0
    if ( NdotL * NdotHV > 0.0 )
        color += gl_FrontLightProduct[lightNum].specular * pow( NdotHV, gl_FrontMaterial.shininess );
#endif
}
