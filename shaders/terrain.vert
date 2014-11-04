uniform sampler2D terrainTexture;
varying vec2 texcoord;
varying vec4 basecolor;

void main(void)
{
    texcoord = gl_MultiTexCoord0.xy;
    vec2 texelWorldRatio = gl_MultiTexCoord0.zw;
    vec2 texelTexcoordSize = gl_Color.xy;

    vec2 texcoord_right = texcoord;
    if (texcoord.x<0.5) texcoord_right.x = texcoord_right.x+texelTexcoordSize.x;
    else texcoord_right.x = texcoord_right.x-texelTexcoordSize.x;

    vec2 texcoord_up = texcoord;
    if (texcoord.y<0.5) texcoord_up.y = texcoord_up.y+texelTexcoordSize.y;
    else texcoord_up.y = texcoord_up.y-texelTexcoordSize.y;

    float height_center = texture2D(terrainTexture, texcoord).r;
    float height_right = texture2D(terrainTexture, texcoord_right).r;
    float height_up = texture2D(terrainTexture, texcoord_up).r;

    vec2 gradient = vec2((height_center-height_right)*texelWorldRatio.x, (height_center-height_up)*texelWorldRatio.y);
    vec3 normal = vec3(gradient.x, gradient.y, 1.0-gradient.x*gradient.x-gradient.y*gradient.y);
    float intensity = normal.z;

    basecolor = vec4(intensity, intensity, intensity, 1.0);

    vec3 position = gl_Vertex.xyz + gl_Normal.xyz * height_center ;
    gl_Position     = gl_ModelViewProjectionMatrix * vec4(position,1.0);


};
