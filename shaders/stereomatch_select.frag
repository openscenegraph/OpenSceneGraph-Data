/* -*- Mode: C -*- */
uniform sampler2DRect textureIn;
uniform int min_disparity;
uniform int max_disparity;

void main(void)
{
   float disp = texture2DRect( textureIn, gl_TexCoord[0].st ).g;
   float sad = texture2DRect( textureIn, gl_TexCoord[0].st ).r;
   if (sad > 0.7+100) {
       gl_FragColor = vec4(1,0,0,1);
   } else {
       disp = (disp-min_disparity)/(float)(max_disparity-min_disparity);
       gl_FragColor = vec4(disp,disp,disp,1);
   }
}
