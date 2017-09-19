$OSG_GLSL_VERSION
$OSG_PRECISION_FLOAT

$OSG_VARYING_OUT vec2 texCoord;
$OSG_VARYING_OUT vec4 vertexColor;

void main(void)
{
    gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
    texCoord = gl_MultiTexCoord0.xy;
    vertexColor = gl_Color;
}
