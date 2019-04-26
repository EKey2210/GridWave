#version 150

uniform vec2 resolution;
uniform float time;

vec3 color;
out vec4 outputColor;

#define PI 3.14159265359
#define TWO_PI 6.28318530718

vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix( vec3(1.0), rgb, c.y);
}

float random(vec2 st){ return fract(sin(dot(st.xy ,vec2(12.9898,78.233))) * 43758.5453); }

float sdBox(vec2 p,vec2 b)
{
    vec2 d = abs(p)-b;
    return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);
}

float box(vec2 p,vec2 b){
  float d = sdBox(p,b);
  // return 1.0-d/abs(length(p));
  float m = 1.0-smoothstep(0.01, 0.03, d);
  return m;
}

float lattice(vec2 uv,float s,float speed){
  uv = uv * s;
  vec2 iPos = floor(uv);
  vec2 fPos = fract(uv) - 0.5;

  float c = box(fPos,vec2((sin((time+(iPos.x+iPos.y))*speed)+1.0)/4.0));
  return c;
}

void main() {
  vec2 center = (gl_FragCoord.xy*2.0-resolution)/min(resolution.x,resolution.y);

  color.r = lattice(center,10.0,200.0);
  color.g = lattice(center,20.0,200.0);
  color.b = lattice(center,15.0,200.0);

  outputColor = vec4(color,1.0);
}
