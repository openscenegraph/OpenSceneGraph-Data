/* -*- Mode: C -*- */
uniform sampler2DRect textureDiff0;
uniform sampler2DRect textureDiff1;
uniform sampler2DRect textureDiff2;
uniform sampler2DRect textureDiff3;
uniform sampler2DRect textureAggIn;
uniform int start_disparity;
uniform int window_size;

void main(void)
{
    int half_window_size = window_size/2;

    vec2 texCoord = gl_TexCoord[0].xy;
    sampler2DRect tdiff[4];
    tdiff[0] = textureDiff0;
    tdiff[1] = textureDiff1;
    tdiff[2] = textureDiff2;
    tdiff[3] = textureDiff3;
     
    float smallest_sum = 100;
    float sum;
    float disparity = 0;
    
    for (int t=0; t<4; t++) { // four textures
	for (int c=0; c<4; c++) { // four channels
	    sum = 0.0;
	    for (int y=-half_window_size; y<=half_window_size; y++) {
		for (int x=-half_window_size; x<=half_window_size; x++) {
		    vec2 coord = texCoord + vec2(x,y);
		    vec4 val = texture2DRect(tdiff[t], coord)[c];
		    sum+=val;
		}
	    }
	    if (sum < smallest_sum) {
		smallest_sum = sum;
		disparity = start_disparity + ((t*4)+c);
	    }
	}
    }

    float old_best_sum = texture2DRect(textureAggIn, texCoord)[0];
    float old_disparity = texture2DRect(textureAggIn, texCoord)[1];
    if (smallest_sum < old_best_sum) {
	gl_FragData[0][0] = smallest_sum;
	gl_FragData[0][1] = disparity;
    } else {
	gl_FragData[0][0] = old_best_sum;
	gl_FragData[0][1] = old_disparity;
    }
}
