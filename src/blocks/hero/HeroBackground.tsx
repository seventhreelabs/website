"use client";

import { useEffect, useRef } from "react";

const VERTEX = "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";

const FRAGMENT = `precision highp float;
uniform vec2 r;uniform float t;uniform vec2 m;
float sm(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}
float s(vec3 p,vec3 c,float q){return length(p-c)-q;}
float map(vec3 p){
float d=s(p,vec3(1.5+.5*sin(t*.31),.3*cos(t*.23),.2),1.05);
d=sm(d,s(p,vec3(-.6+.9*sin(t*.19),.95*cos(t*.27),-.2),.8),.55);
d=sm(d,s(p,vec3(2.8*cos(t*.13),-1.0+.5*sin(t*.37),.1),.7),.55);
d=sm(d,s(p,vec3(-2.6+.6*cos(t*.29),.7*sin(t*.17),.3),.95),.55);
d=sm(d,s(p,vec3(m.x*3.2,m.y*1.8,.6),.42),.7);
return d;}
vec3 nor(vec3 p){vec2 e=vec2(.002,0.);return normalize(vec3(map(p+e.xyy)-map(p-e.xyy),map(p+e.yxy)-map(p-e.yxy),map(p+e.yyx)-map(p-e.yyx)));}
void main(){
vec2 u=(gl_FragCoord.xy-.5*r)/r.y;
vec3 ro=vec3(0.,0.,5.5),rd=normalize(vec3(u*1.15,-1.5));
float d=0.,h=1.;
for(int i=0;i<56;i++){h=map(ro+rd*d);if(h<.002||d>10.)break;d+=h;}
float c=0.;
if(d<10.){
vec3 p=ro+rd*d,n=nor(p),q=reflect(rd,n);
float f=pow(1.-max(dot(n,-rd),0.),2.);
float sp=pow(max(dot(q,normalize(vec3(.5,.8,.6))),0.),40.);
float env=smoothstep(.55,.6,.5+.5*sin(q.y*5.+q.x*2.+t*.15));
c=.04+.42*f+.3*sp+.07*env;
}
c*=1.-.35*dot(u,u);
gl_FragColor=vec4(vec3(c*.96,c*.98,c*1.05),1.);
}`;

export function HeroBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const gl = canvas?.getContext("webgl");
    if (!canvas || !gl) return;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const position = gl.getAttribLocation(program, "a");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(program, "r");
    const uTime = gl.getUniformLocation(program, "t");
    const uMouse = gl.getUniformLocation(program, "m");

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let targetX = 0.3;
    let targetY = 0.2;
    let mouseX = targetX;
    let mouseY = targetY;
    let frame = 0;
    let visible = true;

    const onMove = (event: PointerEvent) => {
      const box = canvas.getBoundingClientRect();
      if (!box.width || !box.height) return;
      targetX = ((event.clientX - box.left) / box.width) * 2 - 1;
      targetY = 1 - ((event.clientY - box.top) / box.height) * 2;
    };

    const draw = (ms: number) => {
      const scale = window.innerWidth < 768 ? 0.45 : 0.6;
      const width = Math.max(1, Math.round(canvas.clientWidth * scale));
      const height = Math.max(1, Math.round(canvas.clientHeight * scale));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
      mouseX += (targetX - mouseX) * 0.04;
      mouseY += (targetY - mouseY) * 0.04;
      gl.uniform2f(uRes, width, height);
      gl.uniform1f(uTime, still ? 14 : 14 + ms / 1000);
      gl.uniform2f(uMouse, mouseX, mouseY);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!still && visible) frame = requestAnimationFrame(draw);
    };

    const observer = new IntersectionObserver(([entry]) => {
      const wasVisible = visible;
      visible = entry.isIntersecting;
      if (visible && !wasVisible && !still) frame = requestAnimationFrame(draw);
    });
    observer.observe(canvas);
    if (!still) window.addEventListener("pointermove", onMove);
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="absolute inset-0 block h-full w-full"
    />
  );
}
