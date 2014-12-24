varying vec2 texcoord;
varying vec4 basecolor;

void main(void)
{
    texcoord = gl_MultiTexCoord0.xy;

    float height_center = 0;

    // note, need to introduce a proper lighting computation based on the gl_Normal.xyz
    vec3 normal = vec3(0.0, 0.0, 1.0);
    float intensity = normal.z;
    basecolor = vec4(intensity, intensity, intensity, 1.0);

    vec3 position = gl_Vertex.xyz + gl_Normal.xyz * height_center ;
    gl_Position   = gl_ModelViewProjectionMatrix * vec4(position,1.0);
};
