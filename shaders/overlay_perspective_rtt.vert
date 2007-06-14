uniform float y0;
uniform bool lightingEnabled;

vec4 warp(in vec4 source)
{
    float divisor = source.y + y0;
    return vec4(source.x * (1.0 + y0 ), source.y * y0 + 1.0, (source.z * y0 + 1.0)*0.01, source.w * divisor);
}


vec3 fnormal(void)
{
    //Compute the normal 
    vec3 normal = gl_NormalMatrix * gl_Normal;
    normal = normalize(normal);
    return normal;
}

void directionalLight(in int i,
                      in vec3 normal,
                      inout vec4 ambient,
                      inout vec4 diffuse,
                      inout vec4 specular)
{
   float nDotVP;         // normal . light direction
   float nDotHV;         // normal . light half vector
   float pf;             // power factor

   nDotVP = max(0.0, dot(normal, normalize(vec3 (gl_LightSource[i].position))));
   nDotHV = max(0.0, dot(normal, vec3 (gl_LightSource[i].halfVector)));

   if (nDotVP == 0.0)
   {
       pf = 0.0;
   }
   else
   {
       pf = pow(nDotHV, gl_FrontMaterial.shininess);

   }
   ambient  += gl_LightSource[i].ambient;
   diffuse  += gl_LightSource[i].diffuse * nDotVP;
   specular += gl_LightSource[i].specular * pf;
}
void main()
{
    gl_Position = warp(ftransform());
    
    if (lightingEnabled)
    {    
        vec4 ambient = vec4(0.0);
        vec4 diffuse = vec4(0.0);
        vec4 specular = vec4(0.0);


        vec3 normal = fnormal();

        directionalLight(0, normal, ambient, diffuse, specular);

        vec4 color = gl_FrontLightModelProduct.sceneColor +
                     ambient  * gl_FrontMaterial.ambient +
                     diffuse  * gl_FrontMaterial.diffuse +
                     specular * gl_FrontMaterial.specular;

        gl_FrontColor = color;

    }
    else
    {
        gl_FrontColor = gl_Color;
    }
    
}
