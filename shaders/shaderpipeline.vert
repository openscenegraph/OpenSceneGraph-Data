#ifdef GL_ES
    precision highp float;
    precision highp int;
#endif

#pragma import_modes ( GL_LIGHTING, GL_LIGHT0)
#pragma import_texture_modes ( GL_TEXTURE_GEN_S, GL_TEXTURE_GEN_T, GL_TEXTURE_GEN_R, GL_TEXTURE_GEN_Q)
#pragma import_defines ( GL_MAX_TEXTURE_UNITS )
#pragma import_defines ( TEXTURE_VERT_DECLARE0, TEXTURE_VERT_BODY0, TEXTURE_GEN_FUNCTION0 )
#pragma import_defines ( TEXTURE_VERT_DECLARE1, TEXTURE_VERT_BODY1, TEXTURE_GEN_FUNCTION1 )
#pragma import_defines ( TEXTURE_VERT_DECLARE2, TEXTURE_VERT_BODY2, TEXTURE_GEN_FUNCTION2 )
#pragma import_defines ( TEXTURE_VERT_DECLARE3, TEXTURE_VERT_BODY3, TEXTURE_GEN_FUNCTION3 )

#if GL_MAX_TEXTURE_UNITS>0

uniform bool GL_ACTIVE_TEXTURE[GL_MAX_TEXTURE_UNITS];

uniform vec4 osg_ObjectPlaneR[GL_MAX_TEXTURE_UNITS];
uniform vec4 osg_ObjectPlaneS[GL_MAX_TEXTURE_UNITS];
uniform vec4 osg_ObjectPlaneT[GL_MAX_TEXTURE_UNITS];
uniform vec4 osg_ObjectPlaneQ[GL_MAX_TEXTURE_UNITS];

uniform vec4 osg_EyePlaneR[GL_MAX_TEXTURE_UNITS];
uniform vec4 osg_EyePlaneS[GL_MAX_TEXTURE_UNITS];
uniform vec4 osg_EyePlaneT[GL_MAX_TEXTURE_UNITS];
uniform vec4 osg_EyePlaneQ[GL_MAX_TEXTURE_UNITS];


vec4 texgen_EYE_LINEAR(vec4 texcoord, int unit, bool s, bool t, bool r, bool q)
{
    vec4 vertex_eye = gl_ModelViewMatrix * gl_Vertex;
    if (s) texcoord.s = dot(vertex_eye , gl_EyePlaneS[unit]);
    if (t) texcoord.t = dot(vertex_eye , gl_EyePlaneT[unit]);
    if (r) texcoord.r = dot(vertex_eye , gl_EyePlaneR[unit]);
    if (q) texcoord.q = dot(vertex_eye , gl_EyePlaneQ[unit]);
    return texcoord;
}

vec4 texgen_OBJECT_LINEAR(vec4 texcoord, int unit, bool s, bool t, bool r, bool q)
{
    vec4 vertex_eye = gl_ModelViewMatrix * gl_Vertex;
    if (s) texcoord.s = dot(gl_Vertex , gl_ObjectPlaneS[unit]);
    if (t) texcoord.t = dot(gl_Vertex , gl_ObjectPlaneT[unit]);
    if (r) texcoord.r = dot(gl_Vertex , gl_ObjectPlaneR[unit]);
    if (q) texcoord.q = dot(gl_Vertex , gl_ObjectPlaneQ[unit]);
    return texcoord;
}

vec4 texgen_SPHERE_MAP(vec4 texcoord, int unit, bool s, bool t, bool r, bool q)
{
    vec4 vertex_eye = gl_ModelViewMatrix * gl_Vertex;
    vec3 normalized_vertex_eye = normalize(vertex_eye.xyz);
    vec3 normal_eye = gl_NormalMatrix * gl_Normal;
    vec3 reflection_vector = reflect(normalized_vertex_eye, normal_eye);
    reflection_vector.z = reflection_vector.z + 1.0;
    float spheremap_m = 1.0 / (2.0 * length(reflection_vector));
    if (s) texcoord.s = reflection_vector.x * spheremap_m + 0.5;
    if (t) texcoord.t = reflection_vector.y * spheremap_m + 0.5;
    return texcoord;
}

vec4 texgen_REFLECTION_MAP(vec4 texcoord, int unit, bool s, bool t, bool r, bool q)
{
    vec4 vertex_eye = gl_ModelViewMatrix * gl_Vertex;
    vec3 normalized_vertex_eye = normalize(vertex_eye.xyz);
    vec3 normal_eye = gl_NormalMatrix * gl_Normal;
    float m = 2.0 * dot(normalized_vertex_eye, normal_eye);
    if (s) texcoord.s = normalized_vertex_eye.x - normal_eye.x * m;
    if (t) texcoord.t = normalized_vertex_eye.y - normal_eye.y * m;
    if (r) texcoord.r = normalized_vertex_eye.z - normal_eye.z * m;
    return texcoord;
}

vec4 texgen_NORMAL_MAP(vec4 texcoord, int unit, bool s, bool t, bool r, bool q)
{
    vec3 normal_eye = normalize(gl_NormalMatrix * gl_Normal);
    if (s) texcoord.s = normal_eye.s;
    if (t) texcoord.s = normal_eye.t;
    if (r) texcoord.s = normal_eye.r;
    return texcoord;
}

#ifdef TEXTURE_VERT_DECLARE0
    TEXTURE_VERT_DECLARE0
#endif

#ifdef TEXTURE_VERT_DECLARE1
    TEXTURE_VERT_DECLARE1
#endif

#ifdef TEXTURE_VERT_DECLARE2
    TEXTURE_VERT_DECLARE2
#endif

#ifdef TEXTURE_VERT_DECLARE3
    TEXTURE_VERT_DECLARE3
#endif

#endif

varying vec4 vertex_color;

void main()
{
    vertex_color = gl_Color;

#if GL_LIGHTING
    // for each active light source we need to do lighting
    #if GL_LIGHT0
        // vertex_color = vertex_color*0.25;
    #endif
#endif

// for each active texture unit we need to do the following....
#if GL_MAX_TEXTURE_UNITS>0

    #ifdef TEXTURE_VERT_BODY0
        TEXTURE_VERT_BODY0

        #if defined(TEXTURE_GEN_FUNCTION0) && (GL_TEXTURE_GEN_S0 || GL_TEXTURE_GEN_T0 || GL_TEXTURE_GEN_R0 || GL_TEXTURE_GEN_Q0)
            TexCoord0 = TEXTURE_GEN_FUNCTION0(TexCoord0, 0, GL_TEXTURE_GEN_S0, GL_TEXTURE_GEN_T0, GL_TEXTURE_GEN_R0, GL_TEXTURE_GEN_Q0);
        #endif

    #endif

    #ifdef TEXTURE_VERT_BODY1
        TEXTURE_VERT_BODY1

        #if defined(TEXTURE_GEN_BODY1) && (TEXTURE_GEN_S1 || TEXTURE_GEN_T1 || TEXTURE_GEN_R1 || TEXTURE_GEN_Q1)
            TexCoord1 = TEXTURE_GEN_FUNCTION1(TexCoord1, 1, GL_TEXTURE_GEN_S1, GL_TEXTURE_GEN_T1, GL_TEXTURE_GEN_R1, GL_TEXTURE_GEN_Q1);
        #endif
    #endif

    #ifdef TEXTURE_VERT_BODY2
        TEXTURE_VERT_BODY2

        #if defined(TEXTURE_GEN_BODY2) && (TEXTURE_GEN_S2 || TEXTURE_GEN_T2 || TEXTURE_GEN_R2 || TEXTURE_GEN_Q2)
            TexCoord2 = TEXTURE_GEN_FUNCTION2(TexCoord2, 2, GL_TEXTURE_GEN_S2, GL_TEXTURE_GEN_T2, GL_TEXTURE_GEN_R2, GL_TEXTURE_GEN_Q2);
        #endif
    #endif

    #ifdef TEXTURE_VERT_BODY3
        TEXTURE_VERT_BODY3

        #if defined(TEXTURE_GEN_BODY3) && (TEXTURE_GEN_S3 || TEXTURE_GEN_T3 || TEXTURE_GEN_R3 || TEXTURE_GEN_Q3)
            TexCoord3 = TEXTURE_GEN_FUNCTION3(TexCoord3, 3, GL_TEXTURE_GEN_S3, GL_TEXTURE_GEN_T3, GL_TEXTURE_GEN_R3, GL_TEXTURE_GEN_Q3);
        #endif
    #endif

#endif

    gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;

}