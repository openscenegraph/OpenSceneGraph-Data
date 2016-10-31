#ifdef GL_ES
    precision highp float;
    precision highp int;
#endif

#pragma import_modes ( GL_LIGHTING, GL_LIGHT0)
#pragma import_defines ( GL_MAX_TEXTURE_UNITS, GL_OBJECT_LINEAR, GL_EYE_LINEAR, GL_SPHERE_MAP, GL_NORMAL_MAP, GL_REFLECTION_MAP )
#pragma import_defines ( TEXTURE_VERT_DECLARE0, TEXTURE_VERT_BODY0 )
#pragma import_defines ( TEXTURE_VERT_DECLARE1, TEXTURE_VERT_BODY1 )
#pragma import_defines ( TEXTURE_VERT_DECLARE2, TEXTURE_VERT_BODY2 )
#pragma import_defines ( TEXTURE_VERT_DECLARE3, TEXTURE_VERT_BODY3 )

#if GL_MAX_TEXTURE_UNITS>0

uniform bool GL_ACTIVE_TEXTURE[GL_MAX_TEXTURE_UNITS];
uniform int GL_TEXTURE_GEN_MODE[GL_MAX_TEXTURE_UNITS];
uniform bool GL_TEXTURE_GEN_S[GL_MAX_TEXTURE_UNITS];
uniform bool GL_TEXTURE_GEN_T[GL_MAX_TEXTURE_UNITS];

vec4 texgen(vec4 texcoord, int unit)
{
    int texgen_mode = GL_TEXTURE_GEN_MODE[unit];
#ifndef GL_ES
    if (texgen_mode==GL_EYE_LINEAR)
    {
        vec4 vertex_eye = gl_ModelViewMatrix * gl_Vertex;
        texcoord.s = dot(vertex_eye , gl_EyePlaneS[unit]);
        texcoord.t = dot(vertex_eye , gl_EyePlaneT[unit]);
        texcoord.r = dot(vertex_eye , gl_EyePlaneR[unit]);
        texcoord.q = dot(vertex_eye , gl_EyePlaneQ[unit]);
    }
    else
    if (texgen_mode==GL_OBJECT_LINEAR)
    {
        texcoord.s = dot(gl_Vertex , gl_ObjectPlaneS[unit]);
        texcoord.t = dot(gl_Vertex , gl_ObjectPlaneT[unit]);
        texcoord.r = dot(gl_Vertex , gl_ObjectPlaneR[unit]);
        texcoord.q = dot(gl_Vertex , gl_ObjectPlaneQ[unit]);
    }
    else
#endif
    if (texgen_mode==GL_SPHERE_MAP)
    {
        vec4 vertex_eye = gl_ModelViewMatrix * gl_Vertex;
        vec3 normalized_vertex_eye = normalize(vertex_eye.xyz);
        vec3 normal_eye = gl_NormalMatrix * gl_Normal;
        //vec3 reflection_vector = normalized_vertex_eye - 2.0 * dot(normalized_vertex_eye, normal_eye) * normal_eye;
        vec3 reflection_vector = reflect(normalized_vertex_eye, normal_eye);
        reflection_vector.z = reflection_vector.z + 1.0;
        float m = 1.0 / (2.0 * length(reflection_vector));
        //if (GL_TEXTURE_GEN_S[unit])
        {
            texcoord.s = reflection_vector.x * m + 0.5;
        }
        //if (GL_TEXTURE_GEN_T[unit])
        {
            texcoord.t = reflection_vector.y * m + 0.5;
        }
    }
    else
    if (texgen_mode==GL_REFLECTION_MAP)
    {
        vec4 vertex_eye = gl_ModelViewMatrix * gl_Vertex;
        vec3 normalized_vertex_eye = normalize(vertex_eye.xyz);
        vec3 normal_eye = gl_NormalMatrix * gl_Normal;
        float m = 2.0 * dot(normalized_vertex_eye, normal_eye);
        texcoord.xyz = normalized_vertex_eye - normal_eye * m;
    }
    else
    if (texgen_mode==GL_NORMAL_MAP)
    {
        //vec3 normal_eye = gl_NormalMatrix * gl_Normal;
        vec3 normal_eye = normalize(gl_NormalMatrix * gl_Normal);
        texcoord.xyz = normal_eye;
    }

    return texcoord;
}

#ifdef TEXTURE_VERT_DECLARE0
    TEXTURE_VERT_DECLARE0
#endif

#endif

varying vec4 vertex_color;

void main()
{
    vertex_color = gl_Color;

#ifdef GL_LIGHTING
    // for each active light source we need to do lighting
    #ifdef GL_LIGHT0
        vertex_color = vertex_color*0.25;
    #endif
#endif

// for each active texture unit we need to do the following....
#if GL_MAX_TEXTURE_UNITS>0

    #ifdef TEXTURE_VERT_BODY0
        TEXTURE_VERT_BODY0

        if (GL_TEXTURE_GEN_MODE[0]!=0)
        {
            TexCoord0 = texgen(TexCoord0, 0);
        }
    #endif

#endif

    gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;

}