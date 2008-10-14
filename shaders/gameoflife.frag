/* -*- Mode: C -*- */
uniform sampler2DRect textureIn;

void main(void)
{
    vec2 texCoord = gl_TexCoord[0].xy;
    
    const float offset = 1.0;

	// Consider only the red channel in the input image, if > 0.5 assume alive.

	// center
    int c  = texture2DRect(textureIn, texCoord).r > 0.5 ? 1 : 0;
	// bottom left
    int bl = texture2DRect(textureIn, texCoord + vec2(-offset, -offset)).r > 0.5 ? 1 : 0;
	// left
    int l  = texture2DRect(textureIn, texCoord + vec2(-offset,     0.0)).r > 0.5 ? 1 : 0;
	// top left
    int tl = texture2DRect(textureIn, texCoord + vec2(-offset,  offset)).r > 0.5 ? 1 : 0;
	// top
    int t  = texture2DRect(textureIn, texCoord + vec2(    0.0,  offset)).r > 0.5 ? 1 : 0;
	// top right
    int tr = texture2DRect(textureIn, texCoord + vec2( offset,  offset)).r > 0.5 ? 1 : 0;
	// right
    int r  = texture2DRect(textureIn, texCoord + vec2( offset,     0.0)).r > 0.5 ? 1 : 0;
	// bottom right
    int br = texture2DRect(textureIn, texCoord + vec2( offset, -offset)).r > 0.5 ? 1 : 0;
	// bottom
    int b  = texture2DRect(textureIn, texCoord + vec2(    0.0, -offset)).r > 0.5 ? 1 : 0;
    
	// sum neighbours
    int sum = bl + l + tl + t + tr + r + br + b; 

    // the rules of Conway's game of life
	vec4 outval;
    if (c == 1) { // cell alive
		if (sum < 2 ) { // loneliness
			outval = vec4(0,0,0,1);
		} else if (sum > 3) { // overcrowding
			outval = vec4(0,0,0,1);
		} else { // unchanged
			outval = vec4(1,1,1,1);
		}
    } else { // cell dead
		if (sum == 3) { // come to life
			outval = vec4(1,1,1,1);
		} else { // unchanged
			outval = vec4(0,0,0,1);
		}
    }
    
    gl_FragColor = outval;
}
