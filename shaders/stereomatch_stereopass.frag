/* -*- Mode: C -*- */
uniform sampler2DRect textureID0;
uniform sampler2DRect textureID1;
uniform int min_disparity;
uniform int max_disparity;
uniform int window_size;

float SADWindow(in int disparity, in int half_window_size, in vec2 texCoord)
{
    float sad = 0.0;

    float gain = 1.0;
    float offset = 0.0;

    for (int y=-half_window_size; y<=half_window_size; y++) {
	float ygo = (y*gain)+(sign(y)*offset);
	for (int x=-half_window_size; x<=half_window_size; x++) {
	    float xgo = (x*gain)+(sign(x)*offset);
	    vec2 l_coord = texCoord + vec2(xgo, ygo);
	    vec2 r_coord = texCoord + vec2(xgo-disparity, ygo);
	    vec4 l_val = texture2DRect(textureID0, l_coord);
	    vec4 r_val = texture2DRect(textureID1, r_coord);
	    sad = sad + abs(l_val - r_val);
	}
    }
    return sad;
}

void main(void)
{
    float sad=100;
    
    float disp = min_disparity;

    int halfsz = window_size/2;

    for (int i=min_disparity; i < max_disparity; i++) {
	float temp_sad = SADWindow(i, halfsz, gl_TexCoord[0].xy); 
	if (temp_sad < sad) {
	    sad = temp_sad;
	    disp = i;
	}
    }
  
    if (sad > 2.3+100) {
	gl_FragColor = vec4(1,0,0,1);
    } else {
	gl_FragColor = (disp-min_disparity)/(float)(max_disparity-min_disparity);
    }
}
