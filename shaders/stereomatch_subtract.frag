/* -*- Mode: C -*- */
uniform sampler2DRect textureLeft;
uniform sampler2DRect textureRight;
uniform int start_disparity;

void main(void)
{
   vec2 texCoord = gl_TexCoord[0].xy;
   vec4 final;

   vec4 im0 = texture2DRect(textureLeft, texCoord);
   
   for (int t=0; t<4; t++) {
       for (int c=0; c<4; c++) {
	   int disp_offset = (t*4)+c;
	   vec4 im1 = texture2DRect(textureRight, texCoord + vec2(-(disp_offset+start_disparity),0));
	   gl_FragData[t][c] = abs(im0 - im1);
       }
   }
}
