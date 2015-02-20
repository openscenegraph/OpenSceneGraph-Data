#version 120

#pragma import_defines ( HEIGHTFIELD_LAYER, COMPUTE_DIAGONALS, LIGHTING )

#ifdef COMPUTE_DIAGONALS
#extension GL_EXT_geometry_shader4 : enable
#endif

#ifdef HEIGHTFIELD_LAYER
uniform sampler2D terrainTexture;
#endif

#ifdef COMPUTE_DIAGONALS
varying vec2 texcoord_in;
varying vec3 normals_in;
varying vec4 basecolor_in;
#else
varying vec2 texcoord;
varying vec4 basecolor;
#endif


#ifdef LIGHTING
// forward declare lighting computation, provided by lighting.vert shader
void directionalLight( int lightNum, vec3 normal, inout vec4 color );
#endif

void main(void)
{
    vec2 texcoord_center = gl_MultiTexCoord0.xy;

#ifdef HEIGHTFIELD_LAYER
    float height_center = texture2D(terrainTexture, texcoord_center).r;
#else
    float height_center = 0.0;
#endif

#if defined(LIGHTING) && defined(HEIGHTFIELD_LAYER)
    vec2 texelWorldRatio = gl_MultiTexCoord0.zw;
    vec2 texelTexcoordSize = gl_Color.xy;

    vec2 texcoord_right = vec2(texcoord_center.x+texelTexcoordSize.x, texcoord_center.y);
    vec2 texcoord_left = vec2(texcoord_center.x-texelTexcoordSize.x, texcoord_center.y);
    vec2 texcoord_up = vec2(texcoord_center.x, texcoord_center.y+texelTexcoordSize.y);
    vec2 texcoord_down = vec2(texcoord_center.x, texcoord_center.y-texelTexcoordSize.y);

    float dz_dx = 0.0;
    float dx = 0.0;
    if (texcoord_left.x>=0.0)
    {
        float height = texture2D(terrainTexture, texcoord_left).r;
        dz_dx += (height_center-height)*texelWorldRatio.x;
        dx += 1.0;
    }

    if (texcoord_right.x<=1.0)
    {
        float height = texture2D(terrainTexture, texcoord_right).r;
        dz_dx += (height-height_center)*texelWorldRatio.x;
        dx += 1.0;
    }

    //dz_dx = 0.0;

    float dx_denominator = 1.0 / sqrt(dx*dx + dz_dx*dz_dx);
    float sin_rx = -dz_dx * dx_denominator;
    float cos_rx = 1.0 / (dx * dx_denominator);

    mat3 rotate_x_mat = mat3(cos_rx, 0.0, -sin_rx,
                             0.0,    1.0,  0.0,
                             sin_rx, 0.0, cos_rx);


    float dz_dy = 0.0;
    float dy = 0.0;
    if (texcoord_down.y>=0.0)
    {
        float height = texture2D(terrainTexture, texcoord_down).r;
        dz_dy += (height_center-height)*texelWorldRatio.y;
        dy += 1.0;
    }

    if (texcoord_up.y<=1.0)
    {
        float height = texture2D(terrainTexture, texcoord_up).r;
        dz_dy += (height-height_center)*texelWorldRatio.y;
        dy += 1.0;
    }

    //dz_dy = 0.0;

    float dy_denominator = 1.0 / sqrt(dy*dy + dz_dy*dz_dy);
    float sin_ry = -dz_dy * dy_denominator;
    float cos_ry = 1.0 / (dy_denominator*dy);

    mat3 rotate_y_mat = mat3(1.0,    0.0,  0.0,
                             0.0, cos_ry, -sin_ry,
                             0.0, sin_ry, cos_ry);


    vec3 normal = normalize(rotate_x_mat * (rotate_y_mat * gl_Normal.xyz));
    //vec3 normal = normalize(gl_Normal.xyz);
    vec4 color = vec4(1.0,1.0,1.0,1.0);
    directionalLight( 0, normal, color);

#elif defined(LIGHTING)
    vec3 normal = gl_Normal.xyz;
    vec4 color = vec4(1.0, 1.0, 1.0, 1.0);
    directionalLight( 0, normal, color);
#else
    vec3 normal = gl_Normal.xyz;
    vec4 color = vec4(1.0, 1.0, 1.0, 1.0);
#endif


#ifdef COMPUTE_DIAGONALS
    normals_in = normal;
    texcoord_in = texcoord_center;
    basecolor_in = color;
#else
    texcoord = texcoord_center;
    basecolor = color;
#endif

    vec3 position = gl_Vertex.xyz + gl_Normal.xyz * height_center;
    gl_Position   = gl_ModelViewProjectionMatrix * vec4(position,1.0);

};
