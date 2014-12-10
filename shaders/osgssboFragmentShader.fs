uniform sampler2D particleTexture;
in vec2 ex_TexCoor;in vec4 particlecolorGS;


void main(void)
{
     gl_FragColor = particlecolorGS*texture2D(particleTexture,ex_TexCoor.xy);
}
