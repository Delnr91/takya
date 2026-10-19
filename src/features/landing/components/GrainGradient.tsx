"use client";

import { useEffect, useRef } from "react";

// Degradado de agua con grano, inspirado en ShaderGradient (waterPlane, grano
// activado) pero escrito en WebGL plano: sin dependencias nuevas, en pausa
// fuera de pantalla y fijo con movimiento reducido. El fondo CSS del
// contenedor queda como respaldo si no hay WebGL.

const VERTEX = `attribute vec2 p;void main(){gl_Position=vec4(p,0.0,1.0);}`;

// Ruido simplex 3D: Ashima Arts / Stefan Gustavson (MIT).
const FRAGMENT = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uC1;
uniform vec3 uC2;
uniform vec3 uC3;
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
void main(){
  vec2 p=(gl_FragCoord.xy-0.5*uRes)/uRes.y;
  float a=0.87;
  p=mat2(cos(a),-sin(a),sin(a),cos(a))*p;
  float t=uTime*0.11;
  float n=snoise(vec3(p*1.1,t));
  float n2=snoise(vec3(p*2.4+4.0,t*1.3));
  float band=p.y*1.5+n*0.55+n2*0.18;
  vec3 col=mix(uC1,uC2,smoothstep(-0.95,0.15,band));
  col=mix(col,uC3,smoothstep(0.1,0.95,band));
  col+=0.05*smoothstep(0.35,1.0,n);
  float grain=fract(sin(dot(gl_FragCoord.xy+fract(uTime)*91.0,vec2(12.9898,78.233)))*43758.5453);
  col+=(grain-0.5)*0.1;
  gl_FragColor=vec4(col,1.0);
}`;

function rgb(hex: string) {
  const value = Number.parseInt(hex.replace("#", ""), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255].map(
    (channel) => channel / 255,
  );
}

export function GrainGradient({
  colors,
  className,
}: {
  colors: [string, string, string];
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const palette = colors.join(",");

  useEffect(() => {
    const canvas = ref.current;
    const gl = canvas?.getContext("webgl", {
      antialias: false,
      powerPreference: "low-power",
    });
    if (!canvas || !gl) return;
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };
    const program = gl.createProgram();
    const vertex = compile(gl.VERTEX_SHADER, VERTEX);
    const fragment = compile(gl.FRAGMENT_SHADER, FRAGMENT);
    if (!program || !vertex || !fragment) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const position = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    palette.split(",").forEach((hex, index) => {
      gl.uniform3fv(gl.getUniformLocation(program, `uC${index + 1}`), rgb(hex));
    });
    const uRes = gl.getUniformLocation(program, "uRes");
    const uTime = gl.getUniformLocation(program, "uTime");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let visible = false;
    let elapsed = 6;
    let last = 0;

    const draw = () => {
      gl.uniform1f(uTime, elapsed);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const loop = (now: number) => {
      if (last) elapsed += Math.min(now - last, 64) / 1000;
      last = now;
      draw();
      frame = window.requestAnimationFrame(loop);
    };
    const update = () => {
      window.cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
      gl.uniform2f(uRes, width, height);
      if (visible && !reduced.matches && !document.hidden)
        frame = window.requestAnimationFrame(loop);
      else draw();
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      update();
    });
    const ro = new ResizeObserver(update);
    io.observe(canvas);
    ro.observe(canvas);
    document.addEventListener("visibilitychange", update);
    reduced.addEventListener("change", update);
    canvas.dataset.ready = "true";

    return () => {
      window.cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", update);
      reduced.removeEventListener("change", update);
      // Sin loseContext(): el mismo lienzo puede volver a montarse (modo
      // estricto) y un contexto perdido ya no dibuja. Se libera con el lienzo.
      gl.deleteProgram(program);
    };
  }, [palette]);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
