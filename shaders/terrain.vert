uniform sampler2D terrainTexture;
varying vec2 texcoord;
varying vec4 basecolor;

void main(void)
{
    texcoord = gl_MultiTexCoord0.xy;

    vec2 texcoord_up = texcoord + vec2(1.0/64.0, 0.0);
    vec2 texcoord_right = texcoord + vec2(0.0, 1.0/64.0);

    float height_center = texture2D(terrainTexture, texcoord).r;
    float height_up = texture2D(terrainTexture, texcoord_up).r;
    float height_right = texture2D(terrainTexture, texcoord_right).r;

    vec3 normal = vec3(height_center-height_right, height_center-height_right, 1.0);
    float intensity = 1.0/length(normal);
    basecolor = vec4(1.0, 1.0, 1.0, 1.0);

    vec3 position = gl_Vertex.xyz + gl_Normal.xyz * height_center ;
    gl_Position     = gl_ModelViewProjectionMatrix * vec4(position,1.0);


};
