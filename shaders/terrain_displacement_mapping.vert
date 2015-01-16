#version 120
#ifdef COMPUTE_DIAGONALS
#extension GL_EXT_geometry_shader4 : enable
#endif

uniform sampler2D terrainTexture;

#ifdef COMPUTE_DIAGONALS
varying vec2 texcoord_in;
varying float heights_in;
varying vec4 basecolor_in;
#else
varying vec2 texcoord;
varying vec4 basecolor;
#endif


#ifdef GL_LIGHTING
// forward declare lighting computation, provided by lighting.vert shader
void directionalLight( int lightNum, vec3 normal, inout vec4 color );
#endif

void main(void)
{
    vec2 texcoord_center = gl_MultiTexCoord0.xy;
    vec2 texelWorldRatio = gl_MultiTexCoord0.zw;
    vec2 texelTexcoordSize = gl_Color.xy;

    vec2 texcoord_right = texcoord_center;
    if (texcoord_center.x<0.5) texcoord_right.x = texcoord_right.x+texelTexcoordSize.x;
    else
    {
        texcoord_right.x = texcoord_right.x-texelTexcoordSize.x;
        texelWorldRatio.x = -texelWorldRatio.x;
    }

    vec2 texcoord_up = texcoord_center;
    if (texcoord_center.y<0.5) texcoord_up.y = texcoord_up.y+texelTexcoordSize.y;
    else
    {
        texcoord_up.y = texcoord_up.y-texelTexcoordSize.y;
        texelWorldRatio.y = -texelWorldRatio.y;
    }


    float height_center = texture2D(terrainTexture, texcoord_center).r;
    float height_right = texture2D(terrainTexture, texcoord_right).r;
    float height_up = texture2D(terrainTexture, texcoord_up).r;


#ifdef GL_LIGHTING
    vec4 color = vec4(1.0,1.0,1.0,1.0);

    // scale by texelWorldRatio to make effective dx=1
    float dz_dx = (height_center-height_right)*texelWorldRatio.x;
    float dx_denominator = 1.0 / sqrt(1.0+dz_dx*dz_dx);
    float sin_rx = dz_dx * dx_denominator;
    float cos_rx = dx_denominator;

    mat3 rotate_x_mat = mat3(cos_rx, 0.0, -sin_rx,
                             0.0,    1.0,  0.0,
                             sin_rx, 0.0, cos_rx);

    // scale by texelWorldRatio to make effective dy=1
    float dz_dy = (height_center-height_up)*texelWorldRatio.y;
    float dy_denominator = 1.0 / sqrt(1.0+dz_dy*dz_dy);
    float sin_ry = dz_dy * dy_denominator;
    float cos_ry = dy_denominator;

    mat3 rotate_y_mat = mat3(1.0,    0.0,  0.0,
                             0.0, cos_ry, -sin_ry,
                             0.0, sin_ry, cos_ry);

    vec3 normal = normalize(rotate_x_mat * (rotate_y_mat * gl_Normal.xyz));

    directionalLight( 0, normal, color);

#else
    vec4 color = vec4(1.0, 1.0, 1.0, 1.0);
#endif


#ifdef COMPUTE_DIAGONALS
    heights_in = height_center;
    texcoord_in = texcoord_center;
    basecolor_in = color;
#else
    texcoord = texcoord_center;
    basecolor = color;
#endif

    vec3 position = gl_Vertex.xyz + gl_Normal.xyz * height_center;
    gl_Position   = gl_ModelViewProjectionMatrix * vec4(position,1.0);

};
