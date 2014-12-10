#version 430
uniform int numRows;
uniform int numCols;
uniform highp float osg_FrameTime;
uniform uint osg_FrameNumber;
uniform highp float osg_DeltaFrameTime;

layout (local_size_x = 16, local_size_y = 16, local_size_z = 1) in;

float timeMultiplier = 0.01 ;
int OFFSET = numRows*numRows;
int POSITION_NOW_OFFSET = 0; 
int POSITION_OLD_OFFSET = 1; 
int POSITION_INIT_OFFSET = 2; 
int VELOCITY_NOW_OFFSET = 3; 
int VELOCITY_OLD_OFFSET = 4; 
int VELOCITY_INIT_OFFSET = 5; 
int ACCELERATION_OFFSET = 6; 
int PROPERTIES_OFFSET = 7; 


layout(std140, binding = 0) coherent buffer particles{vec4 particleDataBuffer[];};


void main() {
uint gidX = gl_GlobalInvocationID.x;
uint gidY = gl_GlobalInvocationID.y;
ivec2 storePos = ivec2(gidX,gidY);
vec4 partCurrPos         = particleDataBuffer[ POSITION_NOW_OFFSET *OFFSET+(gidY*numCols + gidX)];
vec4 partPrevPos         = particleDataBuffer[ POSITION_OLD_OFFSET *OFFSET+(gidY*numCols + gidX)];
vec4 partInitPos         = particleDataBuffer[ POSITION_INIT_OFFSET *OFFSET+(gidY*numCols + gidX)];
vec4 partCurrVelocity = particleDataBuffer[ VELOCITY_NOW_OFFSET *OFFSET+(gidY*numCols + gidX)];
vec4 partPrevVelocity = particleDataBuffer[ VELOCITY_OLD_OFFSET *OFFSET+(gidY*numCols + gidX)];
vec4 partInitVelocity = particleDataBuffer[ VELOCITY_INIT_OFFSET *OFFSET+(gidY*numCols + gidX)];
vec4 partAcceleration = particleDataBuffer[ ACCELERATION_OFFSET *OFFSET+(gidY*numCols + gidX)];
vec4 partProperties   = particleDataBuffer[ PROPERTIES_OFFSET *OFFSET+(gidY*numCols + gidX)];
  highp vec4 tempCurrPos;
  highp vec4 tempCurrVelocity;

#if 0  //begin reininit (resetset all particles  back on init position)

partPrevPos            = partInitPos ; 
partPrevVelocity    = partInitVelocity; 
//partProperties.w =   0.0;

#endif //end reininit 



float maxParticles = numRows *numCols;
uint gid = gidY*numCols + gidX;




#if 0 //collision testing could be done here , all against all not working yet

bool hitSomeOtherParticle = false;

for(uint i = 0; i < maxParticles ;i++)
{
    if ( (i == gid) ) //|| (mod(i+osg_FrameNumber, 5) > 0)  ) 
    {
            //ignore, not try to test against itself
    }
    else
    {
        vec4 somneighborPrevPos         = particleDataBuffer[POSITION_OLD_OFFSET *OFFSET+(numRows * numCols) + i];

            //collision testing this way is expensive
            float distanceBetweenParticles = length(partPrevPos.xyz-somneighborPrevPos.xyz); 
            if(distanceBetweenParticles < (0.05) )
            {
                    hitSomeOtherParticle = true;
            }
        }
}

if(hitSomeOtherParticle)
{
  //store hittime and change the color (used by vertexshader)
    partProperties.z = osg_FrameTime;
    partProperties.w = 1.0;
}
else
{
    partProperties.w = 0.0;
}

#endif


//is highp needed to get best precision on nvidia gpu's

//put your own rocket science stuff here.. this is just to get it moving
highp float r = partProperties.y;
highp float _coeff_A = 1.0;
highp float _coeff_B = 1.0;
highp vec3  velocityNormalized = normalize(partPrevVelocity.xyz);
highp float R = _coeff_A * r * velocityNormalized + _coeff_B * r * r * velocityNormalized * velocityNormalized;
highp vec3  fr = -R * vec3(partPrevVelocity.xyz);
highp float mass =  1000.0 *  r*r*r *3.141572 *0.75;
highp float massInvers = 1.0 / mass;
highp vec3 dv = fr * massInvers * osg_DeltaFrameTime;


vec3 vortAxis = vec3(0, 1, 0);
highp float l = vortAxis * ( partPrevPos.xyz - vec3(0.5, 0.5, 0.5));
highp vec3 lc = vec3(0.5, 0.5, 0.5) + vortAxis * l;
highp vec3 Ra = partPrevPos.xyz - lc;
highp vec3 vVort = cross(Ra, vortAxis) * massInvers ;


#if 1 //begin toggle to pause simulation , set 0, it will stop writing

tempCurrVelocity = partPrevVelocity +  timeMultiplier*osg_DeltaFrameTime*osg_DeltaFrameTime*partAcceleration*mass*100 + 10000.0*vec4(vVort.xyz,1.0)* 100.0 *timeMultiplier*osg_DeltaFrameTime;
partPrevVelocity = partCurrVelocity;
partCurrVelocity = tempCurrVelocity;

tempCurrPos= partPrevPos + (timeMultiplier*osg_DeltaFrameTime *  partCurrVelocity);
partPrevPos = partCurrPos;
partCurrPos = tempCurrPos;

//memoryBarrierBuffer(); 

 particleDataBuffer[POSITION_NOW_OFFSET*OFFSET+(gidY*numCols + gidX)] = partCurrPos;
 particleDataBuffer[POSITION_OLD_OFFSET*OFFSET+(gidY*numCols + gidX)] = partPrevPos;
 particleDataBuffer[VELOCITY_NOW_OFFSET *OFFSET+(gidY*numCols + gidX)] = partCurrVelocity;
 particleDataBuffer[VELOCITY_NOW_OFFSET*OFFSET+(gidY*numCols + gidX)] = partPrevVelocity;
 particleDataBuffer[ACCELERATION_OFFSET*OFFSET+(gidY*numCols + gidX)] = partAcceleration;
 particleDataBuffer[PROPERTIES_OFFSET*OFFSET+(gidY*numCols + gidX)]  = partProperties;



#endif //end pause 
};
