#ifdef GL_ES
    precision highp float;
    precision highp int;
#endif

#pragma import_modes ( GL_LIGHTING, GL_LIGHT0)
#pragma import_defines ( GL_MAX_TEXTURE_UNITS, GL_OBJECT_LINEAR, GL_EYE_LINEAR, GL_SPHERE_MAP, GL_NORMAL_MAP, GL_REFLECTION_MAP )
#pragma import_texture_modes ( 0, GL_TEXTURE_2D)

varying vec4 vertex_color;

#define GL_TEXTURE0


// #define GL_OBJECT_LINEAR 1
// #define GL_EYE_LINEAR 2
// #define GL_SPHERE_MAP 3
// #define GL_NORMAL_MAP 4
// #define GL_REFLECTION_MAP 5

//#define GL_TEXTURE_GEN_MODE GL_SPHERE_MAP
//#define GL_TEXTURE_GEN_MODE GL_REFLECTION_MAP
//#define GL_TEXTURE_GEN_MODE GL_NORMAL_MAP
// #define GL_TEXTURE_GEN_MODE GL_EYE_LINEAR

#if GL_MAX_TEXTURE_UNITS>0

#if 1
//#ifdef GL_ES
uniform bool GL_ACTIVE_TEXTURE[GL_MAX_TEXTURE_UNITS];
uniform int GL_TEXTURE_GEN_MODE[GL_MAX_TEXTURE_UNITS];
uniform bool GL_TEXTURE_GEN_S[GL_MAX_TEXTURE_UNITS];
uniform bool GL_TEXTURE_GEN_T[GL_MAX_TEXTURE_UNITS];
#else
const bool GL_ACTIVE_TEXTURE[8] = bool[](true, false, false, false, false, false, false, false);
const int GL_TEXTURE_GEN_MODE[8] = int[](GL_SPHERE_MAP, 0, 0, 0, 0, 0, 0, 0);
const bool GL_TEXTURE_GEN_S[8] = bool[](true, false, false, false, false, false, false, false);
const bool GL_TEXTURE_GEN_T[8] = bool[](true, false, false, false, false, false, false, false);
#endif

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

varying vec4 TexCoord[GL_MAX_TEXTURE_UNITS];
#define GL_TEXTURE_VERT_BODY0 { TexCoord[0] = gl_MultiTexCoord0; }
#endif

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
    #ifdef GL_TEXTURE_VERT_BODY0
        GL_TEXTURE_VERT_BODY0
    #endif

    if (GL_TEXTURE_GEN_MODE[0]!=0)
    {
        TexCoord[0] = texgen(TexCoord[0], 0);
    }
#endif

    gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;


}