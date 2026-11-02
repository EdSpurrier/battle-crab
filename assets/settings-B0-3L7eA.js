var Lo=Object.defineProperty;var Vo=(a,e,t)=>e in a?Lo(a,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[e]=t;var f=(a,e,t)=>Vo(a,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function t(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerPolicy&&(r.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?r.credentials="include":o.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(o){if(o.ep)return;o.ep=!0;const r=t(o);fetch(o.href,r)}})();class O{constructor(e,t,i,o){f(this,"handle");f(this,"uniforms",new Map);this.gl=e;const r=Mi(e,e.VERTEX_SHADER,t),s=Mi(e,e.FRAGMENT_SHADER,i),n=e.createProgram();if(!n)throw new Error("createProgram failed");if(e.attachShader(n,r),e.attachShader(n,s),o&&e.transformFeedbackVaryings(n,o,e.INTERLEAVED_ATTRIBS),e.linkProgram(n),!e.getProgramParameter(n,e.LINK_STATUS))throw new Error(`link failed: ${e.getProgramInfoLog(n)??""}`);e.deleteShader(r),e.deleteShader(s),this.handle=n}use(){this.gl.useProgram(this.handle)}uniform(e){let t=this.uniforms.get(e);return t===void 0&&(t=this.gl.getUniformLocation(this.handle,e),this.uniforms.set(e,t)),t}setMat4(e,t){this.gl.uniformMatrix4fv(this.uniform(e),!1,t)}setMat3(e,t){this.gl.uniformMatrix3fv(this.uniform(e),!1,t)}setVec3(e,t,i,o){this.gl.uniform3f(this.uniform(e),t,i,o)}setFloat(e,t){this.gl.uniform1f(this.uniform(e),t)}dispose(){this.gl.deleteProgram(this.handle)}}function Mi(a,e,t){const i=a.createShader(e);if(!i)throw new Error("createShader failed");if(a.shaderSource(i,t),a.compileShader(i),!a.getShaderParameter(i,a.COMPILE_STATUS)){const o=a.getShaderInfoLog(i)??"";throw a.deleteShader(i),new Error(`${e===a.VERTEX_SHADER?"vertex":"fragment"} shader failed:
${o}`)}return i}function ct(a){const e=a??new Float32Array(16);return e[0]=e[5]=e[10]=e[15]=1,e}function de(a,e,t=new Float32Array(16)){for(let i=0;i<4;i++)for(let o=0;o<4;o++)t[i*4+o]=a[o]*e[i*4]+a[4+o]*e[i*4+1]+a[8+o]*e[i*4+2]+a[12+o]*e[i*4+3];return t}function Bo(a,e,t,i){const o=ct();return o[12]=a,o[13]=e,o[14]=t,o}function Rs(a,e){const t=ct(e),i=Math.cos(a),o=Math.sin(a);return t[0]=i,t[2]=-o,t[8]=o,t[10]=i,t}function mo(a,e,t,i){const o=1/Math.tan(a/2),r=new Float32Array(16);return r[0]=o/e,r[5]=o,r[10]=(i+t)/(t-i),r[11]=-1,r[14]=2*i*t/(t-i),r}function No(a,e,t,i,o,r){const s=ct();return s[0]=2/(e-a),s[5]=2/(i-t),s[10]=-2/(r-o),s[12]=-(e+a)/(e-a),s[13]=-(i+t)/(i-t),s[14]=-(r+o)/(r-o),s}function Si(a){const e=Math.hypot(a[0],a[1],a[2])||1;return[a[0]/e,a[1]/e,a[2]/e]}function Di(a,e){return[a[1]*e[2]-a[2]*e[1],a[2]*e[0]-a[0]*e[2],a[0]*e[1]-a[1]*e[0]]}function jt(a,e){return a[0]*e[0]+a[1]*e[1]+a[2]*e[2]}function Oo(a,e){return[a[0]-e[0],a[1]-e[1],a[2]-e[2]]}function Ht(a,e,t=[0,1,0]){const i=Si(Oo(a,e)),o=Si(Di(t,i)),r=Di(i,o),s=ct();return s[0]=o[0],s[4]=o[1],s[8]=o[2],s[1]=r[0],s[5]=r[1],s[9]=r[2],s[2]=i[0],s[6]=i[1],s[10]=i[2],s[12]=-jt(o,a),s[13]=-jt(r,a),s[14]=-jt(i,a),s}function Pe(a){return a[0]*(a[5]*a[10]-a[6]*a[9])-a[4]*(a[1]*a[10]-a[2]*a[9])+a[8]*(a[1]*a[6]-a[2]*a[5])<0}function Qe(a,e=new Float32Array(16)){const t=a[0],i=a[1],o=a[2],r=a[3],s=a[4],n=a[5],u=a[6],l=a[7],c=a[8],d=a[9],h=a[10],m=a[11],g=a[12],w=a[13],x=a[14],v=a[15],p=t*n-i*s,b=t*u-o*s,F=t*l-r*s,_=i*u-o*n,E=i*l-r*n,R=o*l-r*u,M=c*w-d*g,z=c*x-h*g,L=c*v-m*g,A=d*x-h*w,S=d*v-m*w,U=h*v-m*x;let D=p*U-b*S+F*A+_*L-E*z+R*M;return D?(D=1/D,e[0]=(n*U-u*S+l*A)*D,e[1]=(o*S-i*U-r*A)*D,e[2]=(w*R-x*E+v*_)*D,e[3]=(h*E-d*R-m*_)*D,e[4]=(u*L-s*U-l*z)*D,e[5]=(t*U-o*L+r*z)*D,e[6]=(x*F-g*R-v*b)*D,e[7]=(c*R-h*F+m*b)*D,e[8]=(s*S-n*L+l*M)*D,e[9]=(i*L-t*S-r*M)*D,e[10]=(g*E-w*F+v*p)*D,e[11]=(d*F-c*E-m*p)*D,e[12]=(n*z-s*A-u*M)*D,e[13]=(t*A-i*z+o*M)*D,e[14]=(w*b-g*_-x*p)*D,e[15]=(c*_-d*b+h*p)*D,e):ct()}function vo(a,e){const t=e[0],i=e[1],o=e[2];return[a[0]*t+a[4]*i+a[8]*o+a[12],a[1]*t+a[5]*i+a[9]*o+a[13],a[2]*t+a[6]*i+a[10]*o+a[14],a[3]*t+a[7]*i+a[11]*o+a[15]]}function Ci(a,e=new Float32Array(9)){for(let t=0;t<3;t++){const i=a[t*4],o=a[t*4+1],r=a[t*4+2],s=Math.hypot(i,o,r)||1;e[t*3]=i/s,e[t*3+1]=o/s,e[t*3+2]=r/s}return e}function mi(a={}){return{color:[1,1,1],albedo:null,metallicRoughness:null,normal:null,uvScale:1,metallic:0,roughness:.7,emissive:[0,0,0],emissiveMap:null,doubleSided:!1,splat:null,fade:null,nearFade:!0,transparent:!1,opacity:1,cutoff:0,...a}}const Pi=32,Ve=class Ve{constructor(e,t=!0){f(this,"handle");f(this,"width",1);f(this,"height",1);f(this,"loaded",!1);f(this,"source",null);f(this,"flipped",!1);f(this,"pixels",null);f(this,"coarse",null);f(this,"holders",1);f(this,"freed",null);this.gl=e,this.srgb=t;const i=e.createTexture();if(!i)throw new Error("createTexture failed");this.handle=i,e.bindTexture(e.TEXTURE_2D,i),e.texImage2D(e.TEXTURE_2D,0,e.RGBA8,1,1,0,e.RGBA,e.UNSIGNED_BYTE,new Uint8Array([255,255,255,255])),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.REPEAT),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.REPEAT),e.bindTexture(e.TEXTURE_2D,null)}queueImage(e,t=!0){Ve.queue.push({pixels:e.width*e.height,run:()=>this.setImage(e,t)})}static flush(e){let t=e;for(;Ve.queue.length;){const i=Ve.queue[0];if(i.pixels>t&&t<e)break;Ve.queue.shift().run(),t-=i.pixels}}static get pending(){return Ve.queue.length}setImage(e,t=!0){const i=this.gl;i.bindTexture(i.TEXTURE_2D,this.handle),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,t),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.NONE),i.texImage2D(i.TEXTURE_2D,0,this.srgb?i.SRGB8_ALPHA8:i.RGBA8,i.RGBA,i.UNSIGNED_BYTE,e),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.generateMipmap(i.TEXTURE_2D),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR_MIPMAP_LINEAR);const o=i.getExtension("EXT_texture_filter_anisotropic");o&&i.texParameterf(i.TEXTURE_2D,o.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(8,i.getParameter(o.MAX_TEXTURE_MAX_ANISOTROPY_EXT))),i.bindTexture(i.TEXTURE_2D,null),this.width=e.width,this.height=e.height,this.source=e,this.flipped=t,this.pixels=null,this.coarse=null,this.loaded=!0}sample(e,t){return this.source?(this.pixels||(this.pixels=this.readBack(this.width,this.height)),this.pixels?this.texel(this.pixels,this.width,this.height,e,t):[1,1,1]):[1,1,1]}sampleCoarse(e,t){if(!this.source)return[1,1,1];const i=Math.max(1,Math.min(Pi,this.width)),o=Math.max(1,Math.min(Pi,this.height));return this.coarse||(this.coarse=this.readBack(i,o)),this.coarse?this.texel(this.coarse,i,o,e,t):[1,1,1]}readBack(e,t){const i=(typeof OffscreenCanvas<"u"?new OffscreenCanvas(e,t):Object.assign(document.createElement("canvas"),{width:e,height:t})).getContext("2d");return i?(i.imageSmoothingEnabled=!0,i.imageSmoothingQuality="high",i.drawImage(this.source,0,0,e,t),i.getImageData(0,0,e,t).data):null}texel(e,t,i,o,r){const s=(Math.floor(o*t)%t+t)%t,n=(Math.floor(r*i)%i+i)%i,u=((this.flipped?i-1-n:n)*t+s)*4,l=c=>{const d=c/255;return this.srgb?d<=.04045?d/12.92:Math.pow((d+.055)/1.055,2.4):d};return[l(e[u]),l(e[u+1]),l(e[u+2])]}bind(e){const t=this.gl;t.activeTexture(t.TEXTURE0+e),t.bindTexture(t.TEXTURE_2D,this.handle)}retain(){return this.holders++,this}onFreed(e){this.freed=e}dispose(){var e;--this.holders>0||(this.gl.deleteTexture(this.handle),(e=this.freed)==null||e.call(this),this.freed=null)}static load(e,t,i=!0){const o=new Ve(e,i),r=new Image;return r.crossOrigin="anonymous",r.onload=()=>o.setImage(r),r.onerror=()=>console.warn(`texture failed to load: ${t}`),r.src=t,o}static fromCanvas(e,t,i,o=!0){const r=document.createElement("canvas");r.width=r.height=t;const s=r.getContext("2d");i(s,t);const n=new Ve(e,o);return n.setImage(r),n}};f(Ve,"queue",[]);let Vt=Ve;const Ui=16,vi=9,pi=10,Yt=16,ut=2048,ki=13,rt=14,po=`
uniform highp sampler2D uCrowd;
uniform int uCrowdBase;
vec4 crowdTexel(int i, int k) {
  int t = i * 4 + k;
  return texelFetch(uCrowd, ivec2(t & ${ut-1}, t >> ${Math.log2(ut)}), 0);
}
mat4 crowdModel(int i) {
  vec4 r0 = crowdTexel(i, 0);
  vec4 r1 = crowdTexel(i, 1);
  vec4 r2 = crowdTexel(i, 2);
  return mat4(vec4(r0.x, r1.x, r2.x, 0.0), vec4(r0.y, r1.y, r2.y, 0.0), vec4(r0.z, r1.z, r2.z, 0.0), vec4(r0.w, r1.w, r2.w, 1.0));
}
vec4 crowdInst(int i) {
  return crowdTexel(i, 3);
}
`,Ri=`
layout(location = ${vi}) in vec4 aJoints;
layout(location = ${pi}) in vec4 aWeights;
uniform highp sampler2D uJoints;
uniform int uJointBase;
mat4 jointMatrix(float j, int base) {
  int i = base + int(j + 0.5);
  ivec2 at = ivec2((i % ${Ui}) * 4, i / ${Ui});
  return mat4(texelFetch(uJoints, at, 0), texelFetch(uJoints, at + ivec2(1, 0), 0), texelFetch(uJoints, at + ivec2(2, 0), 0), texelFetch(uJoints, at + ivec2(3, 0), 0));
}
mat4 skinMatrix(int base) {
  float total = aWeights.x + aWeights.y + aWeights.z + aWeights.w;
  if (total < 1e-5) return mat4(1.0);
  mat4 m = aWeights.x * jointMatrix(aJoints.x, base) + aWeights.y * jointMatrix(aJoints.y, base) + aWeights.z * jointMatrix(aJoints.z, base) + aWeights.w * jointMatrix(aJoints.w, base);
  return m * (1.0 / total);
}
`,Bt=3,zi=[7,20,60],go=`
float cutoutAlpha(float a, vec2 uv) {
  vec2 t = uv * vec2(textureSize(uAlbedo, 0));
  vec2 dx = dFdx(t);
  vec2 dy = dFdy(t);
  float mip = max(0.0, 0.5 * log2(max(dot(dx, dx), dot(dy, dy))));
  return a * (1.0 + 0.25 * mip);
}`,Ke=(a,e=!1,t=!1,i=!1)=>`#version 300 es
layout(location = 0) in vec3 aPosition;
${t?`layout(location = 3) in vec2 aUv;
uniform float uUvScale;
out vec2 vUv;`:""}
${i?po:a?`layout(location = 4) in vec4 aModel0;
layout(location = 5) in vec4 aModel1;
layout(location = 6) in vec4 aModel2;
layout(location = 7) in vec4 aModel3;`:"uniform mat4 uModel;"}
${e?Ri:""}
uniform mat4 uLightViewProj;
void main() {
  ${i?`int crowdI = uCrowdBase + gl_InstanceID;
  mat4 model = crowdModel(crowdI);`:a?"mat4 model = mat4(aModel0, aModel1, aModel2, aModel3);":"mat4 model = uModel;"}
  ${t?"vUv = aUv * uUvScale;":""}
  gl_Position = uLightViewProj * model * ${e?`skinMatrix(${i?"int(crowdInst(crowdI).x + 0.5)":"uJointBase"}) * `:""}vec4(aPosition, 1.0);
}`,xt=`#version 300 es
precision highp float;
void main() {}`,qt=`#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uAlbedo;
uniform float uOpacity;
uniform float uCutoff;
${go}
void main() {
  if (cutoutAlpha(texture(uAlbedo, vUv).a * uOpacity, vUv) < uCutoff) discard;
}`,Xo={strength:1,cascades:3,soft:!0,lightSize:60,stagger:!0};class $o{constructor(e,t=2048){f(this,"size");f(this,"program");f(this,"instancedProgram");f(this,"crowdProgram");f(this,"skinnedProgram");f(this,"skinnedInstancedProgram");f(this,"cutoutProgram");f(this,"cutoutInstancedProgram");f(this,"cutoutSkinnedProgram");f(this,"settings",{...Xo});f(this,"cascades",[]);f(this,"frame",0);f(this,"due",[!0,!0,!0]);f(this,"drawn",[!1,!1,!1]);f(this,"lastCount",0);f(this,"halves",[0,0,0]);this.gl=e,this.size=t;for(let i=0;i<Bt;i++){const o=e.createTexture(),r=e.createFramebuffer();if(!o||!r)throw new Error("shadow map allocation failed");e.bindTexture(e.TEXTURE_2D,o),e.texImage2D(e.TEXTURE_2D,0,e.DEPTH_COMPONENT24,t,t,0,e.DEPTH_COMPONENT,e.UNSIGNED_INT,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.bindFramebuffer(e.FRAMEBUFFER,r),e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.TEXTURE_2D,o,0),e.drawBuffers([e.NONE]),e.readBuffer(e.NONE);const s=e.checkFramebufferStatus(e.FRAMEBUFFER);if(e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindTexture(e.TEXTURE_2D,null),s!==e.FRAMEBUFFER_COMPLETE)throw new Error(`shadow framebuffer incomplete: ${s}`);this.cascades.push({texture:o,fbo:r,viewProj:new Float32Array(16)})}this.program=new O(e,Ke(!1),xt),this.instancedProgram=new O(e,Ke(!0),xt),this.crowdProgram=new O(e,Ke(!0,!1,!1,!0),xt),this.skinnedProgram=new O(e,Ke(!1,!0),xt),this.skinnedInstancedProgram=new O(e,Ke(!0,!0,!1,!0),xt),this.cutoutProgram=new O(e,Ke(!1,!1,!0),qt),this.cutoutInstancedProgram=new O(e,Ke(!0,!1,!0),qt),this.cutoutSkinnedProgram=new O(e,Ke(!1,!0,!0),qt)}get count(){return Math.max(1,Math.min(Bt,Math.round(this.settings.cascades)))}viewProj(e){return this.cascades[e].viewProj}isDue(e){return this.due[e]}setup(e,t,i){this.frame++,this.count!==this.lastCount&&(this.lastCount=this.count,this.drawn.fill(!1));for(let n=0;n<this.count;n++)this.due[n]=!this.settings.stagger||n===0||!this.drawn[n]||this.frame%(n+1)===0,this.due[n]&&(this.drawn[n]=!0);const o=Math.hypot(t[0],t[1],t[2])||1,r=[t[0]/o,t[1]/o,t[2]/o],s=Math.max(1,i/24);for(let n=0;n<this.count;n++){if(!this.due[n])continue;const u=zi[n]*s;this.halves[n]=u;const l=u*3,c=[e[0]-r[0]*l,e[1]-r[1]*l,e[2]-r[2]*l],d=Ht(c,e,Math.abs(r[1])>.99?[0,0,1]:[0,1,0]),h=2*u/this.size,[m,g]=vo(d,e),w=Math.round(m/h)*h-m,x=Math.round(g/h)*h-g,v=No(-u-w,u-w,-u-x,u-x,1,l*2+u);this.cascades[n].viewProj=de(v,d)}}halfExtent(e){return this.halves[e]||zi[e]}begin(e){const t=this.gl;t.bindFramebuffer(t.FRAMEBUFFER,this.cascades[e].fbo),t.viewport(0,0,this.size,this.size),t.clear(t.DEPTH_BUFFER_BIT),t.cullFace(t.BACK)}end(e,t){const i=this.gl;i.cullFace(i.BACK),i.bindFramebuffer(i.FRAMEBUFFER,null),i.viewport(0,0,e,t)}texture(e){return this.cascades[e].texture}bind(e,t){const i=this.gl;i.activeTexture(i.TEXTURE0+t),i.bindTexture(i.TEXTURE_2D,this.cascades[e].texture)}}const Kt=256,gi=64,et=32,dt=5,Go={point:0,spot:1,area:2};class Wo{constructor(e){f(this,"lights",[]);f(this,"lightTexture");f(this,"tileTexture");f(this,"lightData",new Float32Array(Kt*dt*4));f(this,"tileData",new Uint16Array(0));f(this,"tilesX",1);f(this,"tilesY",1);f(this,"visible",0);this.gl=e;const t=e.createTexture(),i=e.createTexture();if(!t||!i)throw new Error("light texture allocation failed");this.lightTexture=t,this.tileTexture=i;for(const o of[t,i])e.bindTexture(e.TEXTURE_2D,o),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE);e.bindTexture(e.TEXTURE_2D,t),e.texImage2D(e.TEXTURE_2D,0,e.RGBA32F,Kt*dt,1,0,e.RGBA,e.FLOAT,null),e.bindTexture(e.TEXTURE_2D,null)}update(e,t,i){const o=this.gl,r=this.lights.map((h,m)=>m).slice(0,Kt),s=h=>h.intensity*h.radius*h.radius;r.sort((h,m)=>s(this.lights[m])-s(this.lights[h])||h-m);const n=r.length,u=Math.max(1,Math.ceil(t/et)),l=Math.max(1,Math.ceil(i/et)),c=gi+1;(u!==this.tilesX||l!==this.tilesY||this.tileData.length!==u*l*c)&&(this.tilesX=u,this.tilesY=l,this.tileData=new Uint16Array(u*l*c));const d=this.tileData;d.fill(0),this.visible=0;for(let h=0;h<n;h++){const m=r[h],g=this.lights[m],w=h*dt*4,x=this.lightData,v=Go[g.kind??"point"],p=g.dir??[0,-1,0];if(x.fill(0,w,w+dt*4),x[w]=g.x,x[w+1]=g.y,x[w+2]=g.z,x[w+3]=g.radius,x[w+4]=g.r,x[w+5]=g.g,x[w+6]=g.b,x[w+7]=g.intensity,x[w+8]=p[0],x[w+9]=p[1],x[w+10]=p[2],x[w+11]=v,v===1){const D=Math.min(Math.PI/2,Math.max(.01,g.outer??.5));x[w+12]=Math.cos(Math.min(D-.001,Math.max(0,g.inner??D*.7))),x[w+13]=Math.cos(D)}else if(v===2){const D=g.axis??[1,0,0];x[w+12]=D[0],x[w+13]=D[1],x[w+14]=D[2],x[w+15]=(g.width??1)/2,x[w+16]=(g.height??1)/2}const b=g.radius+(v===2?Math.hypot(g.width??1,g.height??1)/2:0);let F=1/0,_=1/0,E=-1/0,R=-1/0,M=!1;for(let D=0;D<8;D++){const ae=g.x+(D&1?b:-b),ee=g.y+(D&2?b:-b),se=g.z+(D&4?b:-b),[ue,Ue,,he]=vo(e,[ae,ee,se]);if(he<=0){F=-1,E=1,_=-1,R=1;continue}M=!0;const Te=ue/he,Ee=Ue/he;Te<F&&(F=Te),Te>E&&(E=Te),Ee<_&&(_=Ee),Ee>R&&(R=Ee)}if(!M||E<-1||F>1||R<-1||_>1)continue;const z=Math.max(0,Math.floor((F+1)*.5*t/et)),L=Math.min(u-1,Math.floor((E+1)*.5*t/et)),A=Math.max(0,Math.floor((_+1)*.5*i/et)),S=Math.min(l-1,Math.floor((R+1)*.5*i/et));let U=!1;for(let D=A;D<=S;D++)for(let ae=z;ae<=L;ae++){const ee=(D*u+ae)*c,se=d[ee];se>=gi||(d[ee+1+se]=h,d[ee]=se+1,U=!0)}U&&this.visible++}o.bindTexture(o.TEXTURE_2D,this.lightTexture),n>0&&o.texSubImage2D(o.TEXTURE_2D,0,0,0,n*dt,1,o.RGBA,o.FLOAT,this.lightData,0),o.bindTexture(o.TEXTURE_2D,this.tileTexture),o.pixelStorei(o.UNPACK_ALIGNMENT,2),o.texImage2D(o.TEXTURE_2D,0,o.R16UI,c,u*l,0,o.RED_INTEGER,o.UNSIGNED_SHORT,d),o.pixelStorei(o.UNPACK_ALIGNMENT,4),o.bindTexture(o.TEXTURE_2D,null)}bind(e,t){const i=this.gl;i.activeTexture(i.TEXTURE0+e),i.bindTexture(i.TEXTURE_2D,this.lightTexture),i.activeTexture(i.TEXTURE0+t),i.bindTexture(i.TEXTURE_2D,this.tileTexture)}}function lt(a,e=new Float32Array(24)){const t=(i,o)=>a[o*4+i];for(let i=0;i<6;i++){const o=i>>1,r=i&1?-1:1;let s=0;for(let n=0;n<4;n++){const u=t(3,n)+r*t(o,n);e[i*4+n]=u,n<3&&(s+=u*u)}s=Math.sqrt(s)||1;for(let n=0;n<4;n++)e[i*4+n]/=s}return e}function mt(a,e,t=6){for(let i=0;i<t;i++){const o=a[i*4],r=a[i*4+1],s=a[i*4+2],n=a[i*4+3],u=o>=0?e[3]:e[0],l=r>=0?e[4]:e[1],c=s>=0?e[5]:e[2];if(o*u+r*l+s*c+n<0)return!1}return!0}function Zt(a,e,t,i=new Float32Array(6)){const o=(e[0]+t[0])/2,r=(e[1]+t[1])/2,s=(e[2]+t[2])/2,n=(t[0]-e[0])/2,u=(t[1]-e[1])/2,l=(t[2]-e[2])/2;for(let c=0;c<3;c++){const d=a[c]*o+a[4+c]*r+a[8+c]*s+a[12+c],h=Math.abs(a[c])*n+Math.abs(a[4+c])*u+Math.abs(a[8+c])*l;i[c]=d-h,i[3+c]=d+h}return i}function Nt(a,e){const t=[1/0,1/0,1/0],i=[-1/0,-1/0,-1/0];for(let o=0;o+2<a.length;o+=e)for(let r=0;r<3;r++){const s=a[o+r];s<t[r]&&(t[r]=s),s>i[r]&&(i[r]=s)}return t[0]>i[0]?[[0,0,0],[0,0,0]]:[t,i]}const Jt=7;class Ii{constructor(e,t){f(this,"vao");f(this,"count");f(this,"min");f(this,"max");f(this,"vbo");f(this,"ibo");this.gl=e;const i=e.createVertexArray(),o=e.createBuffer(),r=e.createBuffer();if(!i||!o||!r)throw new Error("overlay allocation failed");this.vao=i,this.vbo=o,this.ibo=r,e.bindVertexArray(i),e.bindBuffer(e.ARRAY_BUFFER,o),e.bufferData(e.ARRAY_BUFFER,t.vertices,e.STATIC_DRAW);const s=Jt*4;e.enableVertexAttribArray(0),e.vertexAttribPointer(0,3,e.FLOAT,!1,s,0),e.enableVertexAttribArray(1),e.vertexAttribPointer(1,4,e.FLOAT,!1,s,12),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,r),e.bufferData(e.ELEMENT_ARRAY_BUFFER,t.indices,e.STATIC_DRAW),e.bindVertexArray(null),this.count=t.indices.length,[this.min,this.max]=Nt(t.vertices,Jt)}draw(){if(this.count===0)return;const e=this.gl;e.bindVertexArray(this.vao),e.drawElements(e.TRIANGLES,this.count,e.UNSIGNED_INT,0),e.bindVertexArray(null)}setData(e){const t=this.gl;t.bindVertexArray(this.vao),t.bindBuffer(t.ARRAY_BUFFER,this.vbo),t.bufferData(t.ARRAY_BUFFER,e.vertices,t.DYNAMIC_DRAW),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.ibo),t.bufferData(t.ELEMENT_ARRAY_BUFFER,e.indices,t.DYNAMIC_DRAW),t.bindVertexArray(null),this.count=e.indices.length,[this.min,this.max]=Nt(e.vertices,Jt)}setIndices(e){const t=this.gl;t.bindVertexArray(this.vao),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.ibo),t.bufferData(t.ELEMENT_ARRAY_BUFFER,e,t.DYNAMIC_DRAW),t.bindVertexArray(null),this.count=e.length}dispose(){this.gl.deleteVertexArray(this.vao),this.gl.deleteBuffer(this.vbo),this.gl.deleteBuffer(this.ibo)}}const Ho=`#version 300 es
layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec4 aColor;
uniform mat4 uProjection;
uniform mat4 uView;
uniform mat4 uModel;
out vec4 vColor;
void main() {
  vColor = aColor;
  gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);
}`,jo=`#version 300 es
precision highp float;
in vec4 vColor;
uniform float uExposure;
uniform float uToneMap;
uniform float uLight; // the scene's light level (1 by day, low at night) so unlit overlays don't glow in the dark
uniform float uAlpha; // the instance's own alpha (OverlayInstance.alpha)
out vec4 outColor;
void main() {
  // Same tone curve as the lit shader so overlays sit in the same space (skipped when the post stack does it).
  vec3 c = vColor.rgb * uLight;
  if (uToneMap > 0.5) {
    c *= uExposure;
    c = clamp((c * (2.51 * c + 0.03)) / (c * (2.43 * c + 0.59) + 0.14), 0.0, 1.0);
    c = pow(c, vec3(1.0 / 2.2));
  }
  outColor = vec4(c, vColor.a * uAlpha);
}`,xo=`uniform sampler2D uVeilMask;
uniform vec2 uVeilCells;
uniform float uVeilOn;
uniform float uVeilAlpha;
float veilOpen(vec3 w) {
  if (uVeilOn < 0.5) return 1.0;
  vec4 m = texture(uVeilMask, w.xz / uVeilCells);
  float dark = smoothstep(0.3, 0.7, m.r);
  float unseen = smoothstep(0.3, 0.7, m.g);
  return (1.0 - dark) * (1.0 - uVeilAlpha * unseen);
}`,Je=3,Yo={enabled:!0,coverage:.4,density:.5,base:30,thickness:14,scale:70,windSpeed:3,windDirection:60,systems:.5,systemScale:600,darkness:.1,shadowStrength:.6},Li={enabled:!1,shadows:!1,steps:32,layers:[{...Yo}]},wo=`
#define CLOUD_LAYERS ${Je}
uniform sampler2D uCloudWeather;
uniform vec4 uCloudA[CLOUD_LAYERS]; // coverage, base, thickness, scale
uniform vec4 uCloudB[CLOUD_LAYERS]; // wind offset x, wind offset z, systems, system scale
uniform vec4 uCloudC[CLOUD_LAYERS]; // on, density, darkness, shadow strength
uniform vec3 uCloudTint; // the clouds' colour cast
float cloudCover(vec2 xz, int i) {
  vec4 A = uCloudA[i];
  vec4 B = uCloudB[i];
  vec2 p = (xz + B.xy) / A.w + float(i) * vec2(0.37, 0.61);
  float w = texture(uCloudWeather, p).r * 0.65 + texture(uCloudWeather, p * 2.7 + 0.31).r * 0.35;
  float front = texture(uCloudWeather, (xz + B.xy * 0.4) / B.w + 0.53 + float(i) * 0.29).r;
  float cov = clamp(A.x + (front - 0.5) * 1.4 * B.z, 0.0, 1.0);
  return smoothstep(1.0 - cov, 1.0 - cov + 0.4, w);
}`;class qo{constructor(e){f(this,"settings",{...Li,layers:Li.layers.map(e=>({...e}))});f(this,"offsets",Array.from({length:Je},()=>[0,0]));f(this,"weather");f(this,"detail");f(this,"a",new Float32Array(Je*4));f(this,"b",new Float32Array(Je*4));f(this,"c",new Float32Array(Je*4));this.gl=e,this.weather=Zo(e,256),this.detail=Jo(e,48)}get active(){return this.settings.layers.slice(0,Je).filter(e=>e.enabled)}advance(e){this.settings.layers.slice(0,Je).forEach((t,i)=>{const o=t.windDirection*Math.PI/180,r=this.offsets[i];r[0]-=Math.sin(o)*t.windSpeed*e,r[1]-=Math.cos(o)*t.windSpeed*e;const s=Math.max(1,t.scale)*Math.max(1,t.systemScale)*4;for(const n of[0,1])Math.abs(r[n])>s&&(r[n]%=s)})}bindCommon(e,t){const i=this.gl;for(let r=0;r<Je;r++){const s=this.settings.layers[r],n=this.offsets[r];this.a.set(s?[s.coverage,s.base,Math.max(.1,s.thickness),Math.max(1,s.scale)]:[0,0,1,1],r*4),this.b.set(s?[n[0],n[1],s.systems,Math.max(1,s.systemScale)]:[0,0,0,1],r*4),this.c.set(s?[s.enabled?1:0,s.density,s.darkness,s.shadowStrength]:[0,0,0,0],r*4)}i.activeTexture(i.TEXTURE0+t),i.bindTexture(i.TEXTURE_2D,this.weather),i.uniform1i(e.uniform("uCloudWeather"),t),i.uniform4fv(e.uniform("uCloudA"),this.a),i.uniform4fv(e.uniform("uCloudB"),this.b),i.uniform4fv(e.uniform("uCloudC"),this.c);const o=this.settings.tint??[1,1,1];i.uniform3f(e.uniform("uCloudTint"),o[0],o[1],o[2])}dispose(){this.gl.deleteTexture(this.weather),this.gl.deleteTexture(this.detail)}}function yt(a,e,t,i){let o=a*374761393+e*668265263+t*2147483647+i*1442695041|0;return o=Math.imul(o^o>>>13,1274126177),((o^o>>>16)>>>0)/4294967296}function Ko(a,e,t,i){const o=Math.floor(a),r=Math.floor(e);let s=a-o,n=e-r;s=s*s*(3-2*s),n=n*n*(3-2*n);const u=h=>(h%t+t)%t,l=(h,m)=>yt(u(o+h),u(r+m),0,i),c=l(0,0)+(l(1,0)-l(0,0))*s,d=l(0,1)+(l(1,1)-l(0,1))*s;return c+(d-c)*n}function Zo(a,e){const t=new Float32Array(e*e);let i=1/0,o=-1/0;for(let n=0;n<e;n++)for(let u=0;u<e;u++){let l=0,c=.5,d=0;for(let h=0;h<5;h++){const m=4<<h;l+=Ko(u/e*m,n/e*m,m,11+h)*c,d+=c,c*=.5}l/=d,t[n*e+u]=l,i=Math.min(i,l),o=Math.max(o,l)}const r=new Uint8Array(e*e);for(let n=0;n<t.length;n++)r[n]=Math.round((t[n]-i)/Math.max(1e-6,o-i)*255);const s=a.createTexture();if(!s)throw new Error("cloud weather texture failed");return a.bindTexture(a.TEXTURE_2D,s),a.pixelStorei(a.UNPACK_ALIGNMENT,1),a.texImage2D(a.TEXTURE_2D,0,a.R8,e,e,0,a.RED,a.UNSIGNED_BYTE,r),a.pixelStorei(a.UNPACK_ALIGNMENT,4),a.generateMipmap(a.TEXTURE_2D),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.LINEAR_MIPMAP_LINEAR),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MAG_FILTER,a.LINEAR),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_S,a.REPEAT),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_T,a.REPEAT),a.bindTexture(a.TEXTURE_2D,null),s}function Jo(a,e){const t=new Float32Array(648);for(let s=0;s<6;s++)for(let n=0;n<6;n++)for(let u=0;u<6;u++){const l=((s*6+n)*6+u)*3;t[l]=u+yt(u,n,s,1),t[l+1]=n+yt(u,n,s,2),t[l+2]=s+yt(u,n,s,3)}const i=new Uint8Array(e*e*e),o=s=>(s%6+6)%6;for(let s=0;s<e;s++)for(let n=0;n<e;n++)for(let u=0;u<e;u++){const l=u/e*6,c=n/e*6,d=s/e*6,h=Math.floor(l),m=Math.floor(c),g=Math.floor(d);let w=9;for(let b=-1;b<=1;b++)for(let F=-1;F<=1;F++)for(let _=-1;_<=1;_++){const E=((o(g+b)*6+o(m+F))*6+o(h+_))*3,R=t[E]-o(h+_)+h+_,M=t[E+1]-o(m+F)+m+F,z=t[E+2]-o(g+b)+g+b;w=Math.min(w,(R-l)**2+(M-c)**2+(z-d)**2)}const x=1-Math.min(1,Math.sqrt(w)*1.1),v=(b,F)=>{const _=u/e*b,E=n/e*b,R=s/e*b,M=Math.floor(_),z=Math.floor(E),L=Math.floor(R),A=ue=>ue*ue*(3-2*ue),S=A(_-M),U=A(E-z),D=A(R-L),ae=ue=>(ue%b+b)%b,ee=(ue,Ue,he)=>yt(ae(M+ue),ae(z+Ue),ae(L+he),F),se=(ue,Ue,he)=>ue+(Ue-ue)*he;return se(se(se(ee(0,0,0),ee(1,0,0),S),se(ee(0,1,0),ee(1,1,0),S),U),se(se(ee(0,0,1),ee(1,0,1),S),se(ee(0,1,1),ee(1,1,1),S),U),D)},p=x*.65+v(8,21)*.23+v(16,22)*.12;i[(s*e+n)*e+u]=Math.round(Math.min(1,Math.max(0,p))*255)}const r=a.createTexture();if(!r)throw new Error("cloud detail texture failed");return a.bindTexture(a.TEXTURE_3D,r),a.pixelStorei(a.UNPACK_ALIGNMENT,1),a.texImage3D(a.TEXTURE_3D,0,a.R8,e,e,e,0,a.RED,a.UNSIGNED_BYTE,i),a.pixelStorei(a.UNPACK_ALIGNMENT,4),a.texParameteri(a.TEXTURE_3D,a.TEXTURE_MIN_FILTER,a.LINEAR),a.texParameteri(a.TEXTURE_3D,a.TEXTURE_MAG_FILTER,a.LINEAR),a.texParameteri(a.TEXTURE_3D,a.TEXTURE_WRAP_S,a.REPEAT),a.texParameteri(a.TEXTURE_3D,a.TEXTURE_WRAP_T,a.REPEAT),a.texParameteri(a.TEXTURE_3D,a.TEXTURE_WRAP_R,a.REPEAT),a.bindTexture(a.TEXTURE_3D,null),r}const Qo=`#version 300 es
precision highp float;
precision highp sampler3D;
in vec2 vUv;
uniform sampler2D uDepth;
uniform sampler3D uCloudDetail;
uniform mat4 uInvViewProj;
uniform vec3 uSunDir;
uniform vec3 uSunRadiance;
uniform vec3 uSkyColor;
uniform float uFar;
uniform float uSkip;
uniform float uTime;
uniform int uSteps;
${xo}
${wo}
out vec4 outColor;
// The fog of war under a cloud, softened: the veil averaged over a ring five cells round the
// point, so clouds thin out across the edge of explored land instead of ending in a wall there.
float cloudVeil(vec3 p) {
  if (uVeilOn < 0.5) return 1.0;
  const float r = 5.0;
  float v = veilOpen(p);
  for (int k = 0; k < 8; k++) {
    float a = float(k) * 0.7853982;
    v += veilOpen(p + vec3(cos(a), 0.0, sin(a)) * r);
  }
  return smoothstep(0.0, 1.0, v / 9.0);
}
float ign(vec2 p) {
  return fract(52.9829189 * fract(0.06711056 * p.x + 0.00583715 * p.y));
}
// Cumulus: a flat-ish base, and the thicker the cover the higher it builds, so each cloud is a
// dome (seen from above, its sunlit top stands out).
float shapeAt(vec3 p, int i) {
  vec4 A = uCloudA[i];
  float h = (p.y - A.y) / A.z;
  if (h < 0.0 || h > 1.0) return 0.0;
  float c = cloudCover(p.xz, i);
  return smoothstep(0.0, 0.08, h) * clamp((c - h) * 3.0, 0.0, 1.0);
}
float densityAt(vec3 p, int i) {
  float s = shapeAt(p, i);
  if (s <= 0.0) return 0.0;
  vec4 B = uCloudB[i];
  vec3 q = (p + vec3(B.x, uTime * 0.15, B.y)) / (uCloudA[i].w * 0.45) + float(i) * 0.41;
  // Two scales of billow: big puffs and the cauliflower on them.
  float d = texture(uCloudDetail, q).r * 0.7 + texture(uCloudDetail, q * 3.1 + 0.37).r * 0.3;
  // The detail eats the thin edges and leaves the thick middle: puffs with a firm edge.
  return clamp((s - (1.0 - d) * 0.65) / 0.22, 0.0, 1.0);
}
// Where the ray (from o along dir) is inside layer i: t0..t1 (t1 <= t0 when it misses).
vec2 slab(int i, vec3 o, vec3 dir, float tEnd) {
  float b0 = uCloudA[i].y;
  float b1 = b0 + uCloudA[i].z;
  if (uCloudC[i].x < 0.5) return vec2(1.0, 0.0);
  if (abs(dir.y) < 1e-4) return o.y < b0 || o.y > b1 ? vec2(1.0, 0.0) : vec2(0.0, tEnd);
  float ta = (b0 - o.y) / dir.y;
  float tb = (b1 - o.y) / dir.y;
  return vec2(max(0.0, min(ta, tb)), min(max(ta, tb), tEnd));
}
void main() {
  float depth = texture(uDepth, vUv).r;
  vec4 nearP = uInvViewProj * vec4(vUv * 2.0 - 1.0, -1.0, 1.0);
  vec3 o = nearP.xyz / nearP.w;
  vec4 farP = uInvViewProj * vec4(vUv * 2.0 - 1.0, 1.0, 1.0);
  vec3 dir = normalize(farP.xyz / farP.w - o);
  float tEnd = uFar;
  if (depth < 1.0) {
    vec4 hp = uInvViewProj * vec4(vUv * 2.0 - 1.0, depth * 2.0 - 1.0, 1.0);
    tEnd = min(uFar, length(hp.xyz / hp.w - o));
  }
  // An orthographic eye pulled far back: the ray starts where the scene does (cloud layers between
  // that far eye and the ground are not in the view).
  float skip = min(uSkip, tEnd);
  o += dir * skip;
  tEnd -= skip;
  // The layers in the order the ray meets them (a three-element sort).
  vec2 r0 = slab(0, o, dir, tEnd);
  vec2 r1 = slab(1, o, dir, tEnd);
  vec2 r2 = slab(2, o, dir, tEnd);
  ivec3 order = ivec3(0, 1, 2);
  vec3 starts = vec3(r0.y > r0.x ? r0.x : 1e9, r1.y > r1.x ? r1.x : 1e9, r2.y > r2.x ? r2.x : 1e9);
  if (starts.y < starts.x) { order.xy = order.yx; starts.xy = starts.yx; }
  if (starts.z < starts.y) { order.yz = order.zy; starts.yz = starts.zy; }
  if (starts.y < starts.x) { order.xy = order.yx; starts.xy = starts.yx; }
  vec3 l = normalize(-uSunDir);
  float cosA = dot(dir, l);
  // Two-lobe Henyey-Greenstein: a bright rim toward the sun, a little back-scatter.
  float g1 = 0.6;
  float g2 = -0.2;
  float hg1 = (1.0 - g1 * g1) / pow(1.0 + g1 * g1 - 2.0 * g1 * cosA, 1.5);
  float hg2 = (1.0 - g2 * g2) / pow(1.0 + g2 * g2 - 2.0 * g2 * cosA, 1.5);
  float phase = mix(hg2, hg1, 0.6) * 0.25 + 0.35;
  float jitter = ign(gl_FragCoord.xy);
  vec3 inscatter = vec3(0.0);
  float trans = 1.0;
  for (int k = 0; k < 3; k++) {
    if (starts[k] >= 1e8 || trans < 0.02) break;
    int i = order[k];
    vec2 r = slab(i, o, dir, tEnd);
    vec4 A = uCloudA[i];
    vec4 C = uCloudC[i];
    // Long slanting paths (toward the horizon) would take huge steps: cap them, and accept stopping
    // short (the far end fades into the horizon haze anyway).
    float stepLen = min((r.y - r.x) / float(uSteps), A.z * 0.25);
    float sigma = 0.15 + C.y * 2.2;
    vec3 sunCol = uSunRadiance * (1.0 - C.z * 0.75) * uCloudTint;
    vec3 ambient = uSkyColor * (1.0 - C.z * 0.6) * uCloudTint;
    float ls = A.z * 0.24;
    float t = r.x + stepLen * jitter;
    for (int s = 0; s < 128; s++) {
      if (s >= uSteps || t > r.y) break;
      // Far clouds thin out into the horizon, and the march stops where they are gone.
      float fade = 1.0 - smoothstep(uFar * 0.45, uFar, t);
      if (fade <= 0.0) break;
      vec3 p = o + dir * t;
      if (shapeAt(p, i) <= 0.0) {
        // Clear sky: stride on.
        t += stepLen * 2.0;
        continue;
      }
      float d = densityAt(p, i) * fade;
      // (Under the fog of war: a cloud over unexplored land is not there, one out of sight is dimmed.)
      if (d > 0.002) d *= cloudVeil(p);
      if (d > 0.002) {
        // Light reaching this sample: a short march toward the sun through the layer's shape.
        float toSun = 0.0;
        for (int m = 1; m <= 3; m++) toSun += shapeAt(p + l * ls * float(m), i);
        float sunT = exp(-toSun * ls * sigma * 1.4);
        // Powder: the sunlit side of a puff glows less at its very edge.
        float powder = 1.0 - exp(-d * 4.0);
        float h = (p.y - A.y) / A.z;
        vec3 c = sunCol * sunT * phase * mix(0.6, 1.0, powder) + ambient * mix(0.55, 1.0, h);
        float st = exp(-d * sigma * stepLen);
        inscatter += trans * c * (1.0 - st);
        trans *= st;
        if (trans < 0.02) break;
      }
      t += stepLen;
    }
  }
  outColor = vec4(inscatter, trans);
}`,Ot=64,bo=16,yo=5,Tt=32,ea={center:[0,1,0],size:[8,2,8],yaw:0,color:[.85,.9,1],density:.6,softness:.4,falloff:.6,glow:[.4,.8,1],glowStrength:0,noise:.6,noiseScale:4,speed:.6,direction:60,rise:.05,churn:.3},ta={enabled:!0,steps:24,selfShadow:!0,lights:!0,shadows:!0,sun:.45,ambient:.6};function ia(a={}){const e=ea;return{...e,...a,center:[...a.center??e.center],size:[...a.size??e.size],color:[...a.color??e.color],glow:[...a.glow??e.glow]}}function oa(a,e=new Float32Array(6)){const t=a.yaw*Math.PI/180,i=Math.abs(Math.cos(t)),o=Math.abs(Math.sin(t)),r=Math.abs(a.size[0])/2,s=Math.abs(a.size[1])/2,n=Math.abs(a.size[2])/2,u=i*r+o*n,l=o*r+i*n;return e[0]=a.center[0]-u,e[1]=a.center[1]-s,e[2]=a.center[2]-l,e[3]=a.center[0]+u,e[4]=a.center[1]+s,e[5]=a.center[2]+l,e}function aa(a,e){const t=Math.max(.05,a.noiseScale)*yo,i=a.direction*Math.PI/180,o=r=>r-Math.floor(r);return{drift:[o(-Math.sin(i)*a.speed*e/t),o(-a.rise*e/t),o(-Math.cos(i)*a.speed*e/t)],churn:o(-a.churn*e/t)}}function ra(a,e,t){const i=new Float32Array(6),o=a.filter(s=>s.enabled!==!1&&s.density>0&&s.size.every(n=>Math.abs(n)>.001)&&(!e||mt(e,oa(s,i))));if(o.length<=1)return o;const r=s=>Math.hypot(s.center[0]-t[0],s.center[1]-t[1],s.center[2]-t[2]);return o.sort((s,n)=>r(s)-r(n)).slice(0,Ot)}function To(a,e=!1){return`
#define FOG_VOLUMES ${a}
uniform int uFogVolCount;
uniform vec4 uFogVolA[FOG_VOLUMES]; // centre xyz, cos yaw
uniform vec4 uFogVolB[FOG_VOLUMES]; // half size xyz, sin yaw
uniform vec4 uFogVolC[FOG_VOLUMES]; // colour rgb, density
uniform vec4 uFogVolD[FOG_VOLUMES]; // glow rgb (times its strength), softness
uniform vec4 uFogVolE[FOG_VOLUMES]; // noise drift xyz (texture units), 1 / the noise's repeat (world units)
uniform vec4 uFogVolF[FOG_VOLUMES]; // churn phase, noise amount, falloff, seed
${e?`
#define FOG_CLEARS ${Tt}
uniform int uFogClearCount;
uniform vec4 uFogClearA[FOG_CLEARS]; // x, z, range, strength
uniform vec4 uFogClearB[FOG_CLEARS]; // heading cos, sin, cos of the half angle, soft
// How much of the mist at p the clears leave (1: all of it; 0: cleared): each a wedge on the ground and all above it.
float fogClearKeep(vec3 p) {
  float keep = 1.0;
  for (int i = 0; i < FOG_CLEARS; i++) {
    if (i >= uFogClearCount) break;
    vec4 A = uFogClearA[i];
    vec4 B = uFogClearB[i];
    vec2 d = p.xz - A.xy;
    float r = length(d);
    if (r >= A.z) continue;
    float c = r > 1e-3 ? dot(d / r, B.xy) : 1.0;
    // Inside the angle (soft at its sides), and short of its end (soft there too).
    float soft = max(B.w, 1e-3);
    // (A half angle of PI or more: all round, a disc.)
    float side = B.z <= -0.9999 ? 1.0 : smoothstep(B.z, B.z + (1.0 - B.z) * soft, c);
    float end = 1.0 - smoothstep(A.z * (1.0 - soft), A.z, r);
    keep *= 1.0 - A.w * side * end;
  }
  return keep;
}`:""}
vec3 fogVolLocal(int i, vec3 p) {
  vec4 A = uFogVolA[i];
  float s = uFogVolB[i].w;
  vec3 d = p - A.xyz;
  return vec3(A.w * d.x - s * d.z, d.y, s * d.x + A.w * d.z);
}
vec3 fogVolDir(int i, vec3 dir) {
  float c = uFogVolA[i].w;
  float s = uFogVolB[i].w;
  return vec3(c * dir.x - s * dir.z, dir.y, s * dir.x + c * dir.z);
}
// Where the ray from o along dir is inside box i: t0..t1 (t1 <= t0 when it misses).
vec2 fogVolHit(int i, vec3 o, vec3 dir) {
  vec3 h = uFogVolB[i].xyz;
  vec3 lo = fogVolLocal(i, o);
  vec3 ld = fogVolDir(i, dir);
  // Axis-parallel rays: a tiny slope instead of a divide by zero.
  vec3 inv = 1.0 / mix(ld, vec3(1e-6), vec3(lessThan(abs(ld), vec3(1e-6))));
  vec3 ta = (-h - lo) * inv;
  vec3 tb = (h - lo) * inv;
  vec3 tmin = min(ta, tb);
  vec3 tmax = max(ta, tb);
  float t0 = max(max(tmin.x, tmin.y), max(tmin.z, 0.0));
  float t1 = min(min(tmax.x, tmax.y), tmax.z);
  return vec2(t0, t1);
}
// How much sun gets to p past the boxes: each box's thickness along the sun's path to p, about half
// strength for its soft sides (no noise: a shadow, not a picture of the billows).
float fogVolShade(vec3 p, vec3 l) {
  float s = 0.0;
  for (int i = 0; i < FOG_VOLUMES; i++) {
    if (i >= uFogVolCount) break;
    vec2 r = fogVolHit(i, p, l);
    if (r.y <= r.x) continue;
    s += uFogVolC[i].w * (r.y - r.x) * (1.0 - uFogVolD[i].w * 0.5) * (1.0 - uFogVolF[i].z * 0.5);
  }
  return exp(-s * 0.6);
}`}const sa=To(Ot,!0),na=To(bo),Wt=class Wt{constructor(){f(this,"settings",{...ta});f(this,"volumes",[]);f(this,"count",0);f(this,"data",Array.from({length:6},()=>new Float32Array(Ot*4)));f(this,"clears",[]);f(this,"clearCount",0);f(this,"clearData",[new Float32Array(Tt*4),new Float32Array(Tt*4)])}get active(){return this.count}prepare(e,t,i){const o=this.settings.enabled?ra(this.volumes,e,t):[];this.count=o.length;const[r,s,n,u,l,c]=this.data,d=o.some(v=>v.seed===void 0)?new Map(this.volumes.map((v,p)=>[v,p])):null;o.forEach((v,p)=>{const b=v.yaw*Math.PI/180,F=p*4,_=aa(v,i),E=Math.max(0,v.glowStrength);r.set([v.center[0],v.center[1],v.center[2],Math.cos(b)],F),s.set([Math.abs(v.size[0])/2,Math.abs(v.size[1])/2,Math.abs(v.size[2])/2,Math.sin(b)],F),n.set([v.color[0],v.color[1],v.color[2],Math.max(0,v.density)],F),u.set([v.glow[0]*E,v.glow[1]*E,v.glow[2]*E,Math.min(1,Math.max(0,v.softness))],F),l.set([_.drift[0],_.drift[1],_.drift[2],1/(Math.max(.05,v.noiseScale)*yo)],F),c.set([_.churn,Math.min(1,Math.max(0,v.noise)),Math.min(1,Math.max(0,v.falloff)),v.seed??(d==null?void 0:d.get(v))??0],F)});const h=t[0],m=t[2],g=this.count?this.clears.filter(v=>(v.strength??1)>0&&v.range>0):[];g.length>Tt&&g.sort((v,p)=>Math.hypot(v.x-h,v.z-m)-Math.hypot(p.x-h,p.z-m)),this.clearCount=Math.min(Tt,g.length);const[w,x]=this.clearData;for(let v=0;v<this.clearCount;v++){const p=g[v];w.set([p.x,p.z,p.range,Math.min(1,Math.max(0,p.strength??1))],v*4),x.set([Math.cos(p.heading),Math.sin(p.heading),Math.cos(Math.min(Math.PI,Math.max(0,p.halfAngle))),Math.min(1,Math.max(0,p.soft??.3))],v*4)}}bind(e,t,i=this.count,o=Ot){const r=Math.min(i,o);e.uniform1i(t.uniform("uFogVolCount"),r),e.uniform1i(t.uniform("uFogClearCount"),r?this.clearCount:0),r&&(Wt.NAMES.forEach((s,n)=>e.uniform4fv(t.uniform(s),this.data[n],0,o*4)),this.clearCount&&(e.uniform4fv(t.uniform("uFogClearA"),this.clearData[0]),e.uniform4fv(t.uniform("uFogClearB"),this.clearData[1])))}};f(Wt,"NAMES",["uFogVolA","uFogVolB","uFogVolC","uFogVolD","uFogVolE","uFogVolF"]);let xi=Wt;const la={enabled:!0,bloom:!0,bloomThreshold:1,bloomStrength:.35,vignette:.25,contrast:1.05,saturation:1.05,ssao:!0,ssaoStrength:.7,ssaoRadius:.9,volumetric:!0,fogDensity:.012,fogHeight:5,fogColor:[.8,.85,.95],fogAmbient:.3,fogSteps:24,fogSun:.3,fogFullRes:!1,fogScale:.5,fogDepthAware:!0,fogTemporal:!0,cloudsHalfRate:!0,fogSmooth:1,dof:!1,dofFocus:30,dofRange:4,dofFalloff:20,dofBlur:8,blurOutside:null,chroma:0},ua=5,Le=`#version 300 es
out vec2 vUv;
void main() {
  // One triangle covering the screen: no vertex buffer needed.
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`,ca=`#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uScene;
uniform float uThreshold;
out vec4 outColor;
void main() {
  vec3 c = texture(uScene, vUv).rgb;
  // Any NaN or negative in the scene would blur into a black blob: drop it here.
  if (any(isnan(c)) || any(isinf(c))) c = vec3(0.0);
  c = max(c, vec3(0.0));
  float l = max(c.r, max(c.g, c.b));
  float k = max(l - uThreshold, 0.0);
  k = k / (1.0 + k);
  outColor = vec4(c * k, 1.0);
}`,ha=`#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uSrc;
uniform vec2 uTexel;
out vec4 outColor;
void main() {
  vec3 a = texture(uSrc, vUv + uTexel * vec2(-1.0, -1.0)).rgb;
  vec3 b = texture(uSrc, vUv + uTexel * vec2(1.0, -1.0)).rgb;
  vec3 c = texture(uSrc, vUv + uTexel * vec2(-1.0, 1.0)).rgb;
  vec3 d = texture(uSrc, vUv + uTexel * vec2(1.0, 1.0)).rgb;
  vec3 e = texture(uSrc, vUv).rgb;
  vec3 f = texture(uSrc, vUv + uTexel * vec2(-2.0, 0.0)).rgb;
  vec3 g = texture(uSrc, vUv + uTexel * vec2(2.0, 0.0)).rgb;
  vec3 h = texture(uSrc, vUv + uTexel * vec2(0.0, -2.0)).rgb;
  vec3 i = texture(uSrc, vUv + uTexel * vec2(0.0, 2.0)).rgb;
  outColor = vec4((a + b + c + d) * 0.125 + e * 0.25 + (f + g + h + i) * 0.0625, 1.0);
}`,fa=`#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uSrc;
uniform sampler2D uPrev;
uniform vec2 uTexel;
out vec4 outColor;
void main() {
  vec3 s = texture(uSrc, vUv + uTexel * vec2(-1.0, -1.0)).rgb + texture(uSrc, vUv + uTexel * vec2(1.0, -1.0)).rgb + texture(uSrc, vUv + uTexel * vec2(-1.0, 1.0)).rgb + texture(uSrc, vUv + uTexel * vec2(1.0, 1.0)).rgb;
  vec3 t = texture(uSrc, vUv + uTexel * vec2(-1.0, 0.0)).rgb + texture(uSrc, vUv + uTexel * vec2(1.0, 0.0)).rgb + texture(uSrc, vUv + uTexel * vec2(0.0, -1.0)).rgb + texture(uSrc, vUv + uTexel * vec2(0.0, 1.0)).rgb;
  vec3 blurred = (s + t * 2.0 + texture(uSrc, vUv).rgb * 4.0) / 16.0;
  outColor = vec4(blurred + texture(uPrev, vUv).rgb, 1.0);
}`,da=`#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uDepth;
uniform mat4 uProjection;
uniform mat4 uInvProjection;
uniform vec2 uTexel;
uniform float uRadius;
out vec4 outColor;
const int SAMPLES = 12;
const vec3 KERNEL[12] = vec3[12](vec3(0.21, 0.08, 0.24), vec3(-0.17, 0.11, 0.31), vec3(0.07, 0.29, 0.18), vec3(-0.33, -0.09, 0.35), vec3(0.38, -0.22, 0.27), vec3(-0.05, 0.42, 0.44), vec3(0.46, 0.31, 0.39), vec3(-0.49, 0.18, 0.52), vec3(0.12, -0.55, 0.47), vec3(-0.28, -0.41, 0.61), vec3(0.63, 0.09, 0.58), vec3(-0.2, 0.6, 0.72));
vec3 viewPos(vec2 uv) {
  float z = texture(uDepth, uv).r * 2.0 - 1.0;
  vec4 p = uInvProjection * vec4(uv * 2.0 - 1.0, z, 1.0);
  return p.xyz / p.w;
}
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}
void main() {
  float d = texture(uDepth, vUv).r;
  if (d >= 1.0) {
    outColor = vec4(1.0);
    return;
  }
  vec3 p = viewPos(vUv);
  // Normal from the depth derivatives of neighbouring positions.
  vec3 px = viewPos(vUv + vec2(uTexel.x, 0.0)) - p;
  vec3 py = viewPos(vUv + vec2(0.0, uTexel.y)) - p;
  vec3 n = normalize(cross(px, py));
  // A random rotation about the normal per pixel (4×4 pattern; the blur averages it away).
  float a = hash(floor(gl_FragCoord.xy)) * 6.2831853;
  vec3 rnd = vec3(cos(a), sin(a), 0.0);
  vec3 t = normalize(rnd - n * dot(rnd, n));
  vec3 b = cross(n, t);
  mat3 tbn = mat3(t, b, n);
  float occlusion = 0.0;
  for (int i = 0; i < SAMPLES; i++) {
    vec3 s = p + tbn * KERNEL[i] * uRadius;
    vec4 c = uProjection * vec4(s, 1.0);
    vec2 suv = c.xy / c.w * 0.5 + 0.5;
    if (suv.x < 0.0 || suv.x > 1.0 || suv.y < 0.0 || suv.y > 1.0) continue;
    float sceneZ = viewPos(suv).z;
    float range = smoothstep(0.0, 1.0, uRadius / abs(p.z - sceneZ));
    occlusion += (sceneZ >= s.z + 0.02 ? 1.0 : 0.0) * range;
  }
  outColor = vec4(vec3(1.0 - occlusion / float(SAMPLES)), 1.0);
}`,ma=`#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uSrc;
uniform vec2 uTexel;
out vec4 outColor;
void main() {
  float sum = 0.0;
  for (int y = -2; y < 2; y++) {
    for (int x = -2; x < 2; x++) {
      sum += texture(uSrc, vUv + vec2(float(x) + 0.5, float(y) + 0.5) * uTexel).r;
    }
  }
  outColor = vec4(vec3(sum / 16.0), 1.0);
}`,va=`#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uSrc;
uniform sampler2D uDepth;
uniform mat4 uInvProjection;
uniform vec2 uStep;
out vec4 outColor;
float viewZ(vec2 uv) {
  float d = texture(uDepth, uv).r;
  vec4 p = uInvProjection * vec4(uv * 2.0 - 1.0, d * 2.0 - 1.0, 1.0);
  return p.z / p.w;
}
void main() {
  // Depth-aware: a tap across a depth edge (a cliff's silhouette against the ground behind) barely
  // counts, so the fog doesn't smear a halo over the edge.
  float z0 = viewZ(vUv);
  float tol = 0.03 * abs(z0) + 0.2;
  float offs[5] = float[](0.0, 1.384615, -1.384615, 3.230769, -3.230769);
  float ws[5] = float[](0.227027, 0.316216, 0.316216, 0.070270, 0.070270);
  vec4 sum = vec4(0.0);
  float wsum = 0.0;
  for (int i = 0; i < 5; i++) {
    vec2 uv = vUv + uStep * offs[i];
    float w = ws[i] * exp(-abs(viewZ(uv) - z0) / tol);
    sum += texture(uSrc, uv) * w;
    wsum += w;
  }
  outColor = sum / max(wsum, 1e-5);
}`,pa=`#version 300 es
precision highp float;
precision highp sampler3D;
precision highp usampler2D;
in vec2 vUv;
uniform sampler2D uDepth;
uniform sampler2D uShadow0;
uniform sampler2D uShadow1;
uniform sampler2D uShadow2;
uniform mat4 uLightVP0;
uniform mat4 uLightVP1;
uniform mat4 uLightVP2;
uniform int uCascades;
uniform mat4 uInvViewProj;
uniform vec3 uEye;
uniform vec3 uSunDir;
uniform vec3 uSunRadiance;
uniform vec3 uSkyColor;
uniform vec3 uFogColor;
uniform float uDensity;
uniform float uHeight;
uniform float uAmbient;
uniform float uSunScatter;
uniform int uSteps;
uniform float uFar;
uniform float uFrameJitter;
uniform float uSkip;
uniform vec3 uViewPoint;
uniform sampler3D uNoise;
uniform int uVolSteps;
uniform float uVolSelfShadow;
uniform float uVolSun;
uniform float uVolAmbient;
uniform sampler2D uLights;
uniform usampler2D uTiles;
uniform vec3 uTileInfo; // tiles across, tile size in pixels, lights on (0 / 1)
uniform vec2 uScreen;
uniform sampler2D uScene;
${xo}
${sa}
out vec4 outColor;
float ign(vec2 p) {
  return fract(52.9829189 * fract(0.06711056 * p.x + 0.00583715 * p.y));
}
// 1 where the sun reaches the point, from the first cascade that holds it.
float sunlit(vec3 w) {
  for (int i = 0; i < 3; i++) {
    if (i >= uCascades) break;
    vec4 sp = (i == 0 ? uLightVP0 : i == 1 ? uLightVP1 : uLightVP2) * vec4(w, 1.0);
    vec3 p = sp.xyz / sp.w * 0.5 + 0.5;
    if (p.x < 0.01 || p.x > 0.99 || p.y < 0.01 || p.y > 0.99 || p.z > 1.0) continue;
    float d = i == 0 ? texture(uShadow0, p.xy).r : i == 1 ? texture(uShadow1, p.xy).r : texture(uShadow2, p.xy).r;
    return p.z - 0.002 <= d ? 1.0 : 0.0;
  }
  return 1.0;
}
// Fog volume i's mist at p: the soft-sided, top-thinned box (fogVolumeShape in fogVolumes.ts),
// eaten into billows by two octaves of the drifting noise, the finer one churning up through the coarse.
float fogVolShape(int i, vec3 p) {
  vec3 l = fogVolLocal(i, p);
  vec3 h = uFogVolB[i].xyz;
  vec3 d = h - abs(l);
  if (min(d.x, min(d.y, d.z)) <= 0.0) return 0.0;
  vec3 soft = max(vec3(1e-3), h * uFogVolD[i].w);
  vec3 f = smoothstep(vec3(0.0), soft, d);
  float top = smoothstep(0.0, 1.0, (l.y + h.y) / max(2.0 * h.y, 1e-3));
  return f.x * f.y * f.z * (1.0 - uFogVolF[i].z * top);
}
float fogVolDensity(int i, vec3 p) {
  float s = fogVolShape(i, p);
  if (s <= 0.0) return 0.0;
  vec4 E = uFogVolE[i];
  vec4 F = uFogVolF[i];
  float k = F.y;
  if (k <= 0.0) return uFogVolC[i].w * s;
  // (Offset by its seed, not by i: i is its place among this frame's boxes, which changes with the view.)
  vec3 q = p * E.w + E.xyz + F.w * 0.137;
  float n1 = texture(uNoise, q).r;
  // The fine octave rides twice the drift (it still repeats every 1) and climbs with the churn,
  // bent a little by the coarse one so the two don't slide past each other in straight lines.
  vec3 q2 = q * 2.0 + vec3(0.37, F.x, 0.61) + (n1 - 0.5) * 0.35;
  float n = smoothstep(0.15, 0.85, n1 * 0.65 + texture(uNoise, q2).r * 0.35);
  // The noise eats into the middle too (gaps between billows), and most where the box thins out.
  return uFogVolC[i].w * clamp((s * (1.0 + k * 0.3) - (1.0 - n) * k * 1.2) / max(1.0 - k * 0.6, 0.1), 0.0, 1.0);
}
// The scene lights that reach this pixel's mist (up to four, from its tile's list): position and
// reach, colour times intensity, and for spots and areas their direction and shape.
vec4 litPos[4];
vec4 litCol[4];
vec4 litDir[4];
vec4 litExt[4];
float litH[4];
int litCount = 0;
void gatherLights(vec3 o, vec3 dir, float t0, float t1) {
  litCount = 0;
  if (uTileInfo.z < 0.5) return;
  ivec2 tile = ivec2(vUv * uScreen / uTileInfo.y);
  int tileIndex = tile.y * int(uTileInfo.x) + tile.x;
  int count = int(texelFetch(uTiles, ivec2(0, tileIndex), 0).r);
  for (int k = 0; k < 64; k++) {
    if (k >= count || litCount >= 4) break;
    int li = int(texelFetch(uTiles, ivec2(k + 1, tileIndex), 0).r) * 5;
    vec4 pr = texelFetch(uLights, ivec2(li, 0), 0);
    vec4 dk = texelFetch(uLights, ivec2(li + 2, 0), 0);
    vec4 ex = texelFetch(uLights, ivec2(li + 3, 0), 0);
    float hh = texelFetch(uLights, ivec2(li + 4, 0), 0).x;
    // Does the light's reach (an area light's: past its panel) touch the marched stretch?
    float reach = pr.w + (dk.w > 1.5 ? length(vec2(ex.w, hh)) : 0.0);
    float tc = clamp(dot(pr.xyz - o, dir), t0, t1);
    if (distance(o + dir * tc, pr.xyz) > reach) continue;
    litPos[litCount] = pr;
    litCol[litCount] = texelFetch(uLights, ivec2(li + 1, 0), 0);
    litDir[litCount] = dk;
    litExt[litCount] = ex;
    litH[litCount] = hh;
    litCount++;
  }
}
// Light from the gathered lights at p (mist scatters it every way), with the lit shader's falloff.
vec3 lightsAt(vec3 p) {
  vec3 sum = vec3(0.0);
  for (int k = 0; k < 4; k++) {
    if (k >= litCount) break;
    vec4 pr = litPos[k];
    vec4 dk = litDir[k];
    vec3 lp = pr.xyz;
    float shape = 1.0;
    if (dk.w > 1.5) {
      // Area: from the panel's nearest point, on its front only.
      vec4 ax = litExt[k];
      vec3 hAxis = cross(dk.xyz, ax.xyz);
      vec3 rel = p - pr.xyz;
      lp = pr.xyz + ax.xyz * clamp(dot(rel, ax.xyz), -ax.w, ax.w) + hAxis * clamp(dot(rel, hAxis), -litH[k], litH[k]);
      shape = smoothstep(-0.02, 0.2, dot(rel, dk.xyz) / max(length(rel), 1e-4));
    }
    vec3 toL = lp - p;
    float d2 = max(dot(toL, toL), 1e-6);
    float r2 = pr.w * pr.w;
    if (d2 >= r2 || shape <= 0.0) continue;
    if (dk.w > 0.5 && dk.w < 1.5) shape = smoothstep(litExt[k].y, litExt[k].x, dot(-toL * inversesqrt(d2), dk.xyz));
    float win = 1.0 - (d2 * d2) / (r2 * r2);
    sum += litCol[k].rgb * litCol[k].a * (win * win) / (d2 + 1.0) * shape;
  }
  return sum;
}
// The mist at p of the boxes in this stretch (a bit mask of the ray's slots, ids the box in each),
// with the colour and glow they share there.
float volsAt(vec3 p, int mask, int ids[8], out vec3 col, out vec3 glow) {
  float sum = 0.0;
  col = vec3(0.0);
  glow = vec3(0.0);
  for (int m = 0; m < 8; m++) {
    if ((mask & (1 << m)) == 0) continue;
    int i = ids[m];
    float d = fogVolDensity(i, p);
    sum += d;
    col += uFogVolC[i].rgb * d;
    glow += uFogVolD[i].rgb * d;
  }
  if (sum > 0.0) {
    col /= sum;
    glow /= sum;
  }
  // (Less where a fog clear takes it away: a spotlight seeing through it.)
  return sum * fogClearKeep(p);
}
float volsDensity(vec3 p, int mask, int ids[8]) {
  float sum = 0.0;
  for (int m = 0; m < 8; m++) if ((mask & (1 << m)) != 0) sum += fogVolDensity(ids[m], p);
  // (The mist as the fog of war lets it show at this point: in sight it stands, unexplored it is not there;
  // and less where a fog clear takes it away.)
  return sum * veilOpen(p) * fogClearKeep(p);
}
// March the fog volumes along the ray from o (unit dir) up to tEnd: in-scatter and transmittance,
// and where the ray first enters one (tFirst; 1e9 when it meets none).
vec4 marchVolumes(vec3 o, vec3 dir, float tEnd, float jitter, out float tFirst) {
  tFirst = 1e9;
  // The boxes the ray crosses, sorted by where it enters them (an insertion sort; eight kept).
  vec2 hits[8];
  int ids[8];
  int n = 0;
  for (int i = 0; i < FOG_VOLUMES; i++) {
    if (i >= uFogVolCount || n >= 8) break;
    vec2 r = fogVolHit(i, o, dir);
    r.y = min(r.y, tEnd);
    if (r.y <= r.x) continue;
    int j = n;
    for (int m = 7; m > 0; m--) {
      if (m > n) continue;
      if (hits[m - 1].x <= r.x) break;
      hits[m] = hits[m - 1];
      ids[m] = ids[m - 1];
      j = m - 1;
    }
    hits[j] = r;
    ids[j] = i;
    n++;
  }
  if (n == 0) return vec4(0.0, 0.0, 0.0, 1.0);
  tFirst = hits[0].x;
  float tLast = 0.0;
  for (int m = 0; m < 8; m++) if (m < n) tLast = max(tLast, hits[m].y);
  gatherLights(o, dir, hits[0].x, tLast);
  vec3 l = normalize(-uSunDir);
  // A gentle forward lobe toward the sun, much like the clouds'.
  float g = 0.45;
  float phase = (1.0 - g * g) / pow(1.0 + g * g - 2.0 * g * dot(dir, l), 1.5) * 0.3 + 0.55;
  vec3 sunCol = uSunRadiance * uVolSun * phase;
  vec3 inscatter = vec3(0.0);
  float trans = 1.0;
  int k = 0;
  for (int span = 0; span < 8; span++) {
    if (k >= n || trans < 0.01) break;
    // One stretch: this box and every later one that overlaps it, marched together.
    // (Its mask by the ray's slots, not the boxes' numbers: there are more boxes than an int has bits.)
    float t0 = hits[k].x;
    float t1 = hits[k].y;
    int mask = 1 << k;
    k++;
    for (int m = 1; m < 8; m++) {
      if (k >= n || hits[k].x > t1) break;
      t1 = max(t1, hits[k].y);
      mask |= 1 << k;
      k++;
    }
    float len = t1 - t0;
    int steps = clamp(int(ceil(len / 0.08)), 2, uVolSteps);
    float stepLen = len / float(steps);
    // How far the self-shadow looks toward the sun: about a third of the smallest box's half size.
    float ls = 1e9;
    for (int m = 0; m < 8; m++) {
      if ((mask & (1 << m)) == 0) continue;
      vec3 h = uFogVolB[ids[m]].xyz;
      ls = min(ls, min(h.x, min(h.y, h.z)));
    }
    ls = clamp(ls * 0.3, 0.1, 3.0);
    for (int s = 0; s < 64; s++) {
      if (s >= steps) break;
      vec3 p = o + dir * (t0 + stepLen * (float(s) + jitter));
      vec3 col;
      vec3 glow;
      // (As the fog of war lets this point show: in sight it stands, unexplored it is not there.)
      float d = volsAt(p, mask, ids, col, glow) * veilOpen(p);
      if (d <= 0.001) continue;
      // The sun through the cascades and (self-shadow) through the mist toward it: two looks.
      float sunT = sunlit(p);
      if (uVolSelfShadow > 0.5 && sunT > 0.0) sunT *= exp(-(volsDensity(p + l * ls, mask, ids) * ls + volsDensity(p + l * ls * 3.0, mask, ids) * ls * 2.0));
      vec3 c = (sunCol * sunT + uSkyColor * uVolAmbient + lightsAt(p)) * col + glow;
      float st = exp(-d * stepLen);
      inscatter += trans * c * (1.0 - st);
      trans *= st;
      if (trans < 0.01) break;
    }
  }
  return vec4(inscatter, trans);
}
void main() {
  float depth = texture(uDepth, vUv).r;
  vec4 farP = uInvViewProj * vec4(vUv * 2.0 - 1.0, 1.0, 1.0);
  vec3 farW = farP.xyz / farP.w;
  vec4 hitP = uInvViewProj * vec4(vUv * 2.0 - 1.0, depth * 2.0 - 1.0, 1.0);
  // The ray starts on the near plane (the eye for a perspective camera; a parallel ray for an
  // orthographic one).
  vec4 nearP = uInvViewProj * vec4(vUv * 2.0 - 1.0, -1.0, 1.0);
  vec3 o = nearP.xyz / nearP.w;
  vec3 hitW = depth >= 1.0 ? o + normalize(farW - o) * uFar : hitP.xyz / hitP.w;
  vec3 dir = normalize(hitW - o);
  // Per pixel, and (temporal fog) moved on every frame, so the frames between them cover the gaps.
  float jitter = fract(ign(gl_FragCoord.xy) + uFrameJitter);
  // The fog volumes, from the near plane to the scene (they are where they are, whatever the camera).
  float tFirst = 1e9;
  vec4 vols = vec4(0.0, 0.0, 0.0, 1.0);
  if (uFogVolCount > 0) vols = marchVolumes(o, dir, dot(hitW - o, dir), jitter, tFirst);
  bool before = tFirst < 1e8;
  vec3 firstW = o + dir * (before ? tFirst : 0.0);
  // An orthographic eye pulled far back: each point gets the fog a perspective camera at the view
  // point would see in front of it (as far back along the ray as that camera is from it), so nearer
  // ground fogs lightly and farther ground more, with no edge where the view point's plane cuts.
  if (uSkip > 0.0) o += dir * max(0.0, dot(hitW - o, dir) - distance(hitW, uViewPoint));
  // Start where the ray comes down into the fog layer (above about six heights it is nil), so
  // every step lands where there is fog to see.
  float top = uHeight * 6.0;
  bool march = uSteps > 0 && uDensity > 0.0;
  if (march && o.y > top) {
    if (dir.y >= -1e-4) march = false;
    else o += dir * ((o.y - top) / -dir.y);
  }
  vec3 inscatter = vec3(0.0);
  float trans = 1.0;
  // The fog up to where the ray first meets a volume.
  vec3 inBefore = vec3(0.0);
  float transBefore = 1.0;
  if (march) {
    vec3 ray = hitW - o;
    float len = max(0.0, dot(ray, dir));
    float stepLen = len / float(uSteps);
    float tVol = before ? dot(firstW - o, dir) : 1e9;
    // Henyey-Greenstein-ish forward scattering toward the sun.
    float cosA = dot(dir, normalize(-uSunDir));
    float phase = 0.6 + 0.4 * pow(max(cosA, 0.0), 4.0) * 3.0;
    for (int i = 0; i < 128; i++) {
      if (i >= uSteps) break;
      float t = stepLen * (float(i) + jitter);
      if (before && t > tVol) {
        before = false;
        inBefore = inscatter;
        transBefore = trans;
      }
      vec3 w = o + dir * t;
      float dens = uDensity * exp(-max(w.y, 0.0) / uHeight);
      float absorb = dens * stepLen;
      // Sunlit fog sits around the sky's brightness (the sun's radiance is a few times that); shadowed fog keeps the sky share.
      vec3 light = (uSunRadiance * uSunScatter * sunlit(w) * phase + uSkyColor * uAmbient) * uFogColor;
      inscatter += light * absorb * trans;
      trans *= exp(-absorb);
      if (trans < 0.01) break;
    }
  }
  // Every fog step lay in front of the volumes (or there are none): all the fog is in front.
  if (before) {
    inBefore = inscatter;
    transBefore = trans;
  }
  // The distance fog stops where the fog-of-war veil has closed the pixel (the scene's alpha is how
  // open it is): the black of unexplored ground is not hazed over. The volumes were weighted sample
  // by sample above, so mist in sight stays in front of it.
  float open = clamp(texture(uScene, vUv).a, 0.0, 1.0);
  inscatter *= open;
  inBefore *= open;
  trans = mix(1.0, trans, open);
  transBefore = mix(1.0, transBefore, open);
  // The fog in front, then the volumes, then the fog behind them (dimmed by the volumes).
  outColor = vec4(inBefore + transBefore * vols.rgb + vols.a * (inscatter - inBefore), trans * vols.a);
}`,ga=`#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uCurrent;
uniform sampler2D uHistory;
uniform sampler2D uDepth;
uniform mat4 uInvViewProj;
uniform mat4 uPrevViewProj;
uniform vec2 uTexel;
uniform float uBlend;
uniform float uFar;
out vec4 outColor;
void main() {
  vec4 cur = texture(uCurrent, vUv);
  float depth = textureLod(uDepth, vUv, 0.0).r;
  vec2 ndc = vUv * 2.0 - 1.0;
  vec3 w;
  if (depth >= 1.0) {
    vec4 n = uInvViewProj * vec4(ndc, -1.0, 1.0);
    vec4 f = uInvViewProj * vec4(ndc, 1.0, 1.0);
    vec3 o = n.xyz / n.w;
    w = o + normalize(f.xyz / f.w - o) * uFar;
  } else {
    vec4 p = uInvViewProj * vec4(ndc, depth * 2.0 - 1.0, 1.0);
    w = p.xyz / p.w;
  }
  vec4 q = uPrevViewProj * vec4(w, 1.0);
  vec2 puv = q.xy / q.w * 0.5 + 0.5;
  if (q.w <= 0.0 || puv.x < 0.0 || puv.y < 0.0 || puv.x > 1.0 || puv.y > 1.0) {
    outColor = cur;
    return;
  }
  vec4 hist = texture(uHistory, puv);
  vec4 a = texture(uCurrent, vUv + vec2(uTexel.x, 0.0));
  vec4 b = texture(uCurrent, vUv - vec2(uTexel.x, 0.0));
  vec4 c = texture(uCurrent, vUv + vec2(0.0, uTexel.y));
  vec4 d = texture(uCurrent, vUv - vec2(0.0, uTexel.y));
  vec4 lo = min(cur, min(min(a, b), min(c, d)));
  vec4 hi = max(cur, max(max(a, b), max(c, d)));
  vec4 pad = (hi - lo) * 0.25;
  hist = clamp(hist, lo - pad, hi + pad);
  outColor = mix(hist, cur, uBlend);
}`,xa=`#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uScene;
uniform sampler2D uBloom;
uniform sampler2D uAo;
uniform sampler2D uFog;
uniform float uHasFog;
uniform vec2 uFogSize;
uniform float uDepthAware;
uniform sampler2D uCloud;
uniform float uHasCloud;
uniform vec2 uCloudSize;
uniform float uCloudOpacity;
uniform float uCloudShade;
uniform vec2 uCloudDigital; // (block size in screen pixels, density steps): CloudSettings.digital
uniform float uAoStrength;
uniform float uBloomStrength;
uniform float uExposure;
uniform float uVignette;
uniform float uContrast;
uniform float uSaturation;
uniform sampler2D uDepth;
uniform mat4 uInvProjection;
uniform mat4 uInvViewProj;
uniform vec4 uDof;
uniform vec4 uBlurRect;
uniform vec2 uBlurOut;
uniform vec2 uTexel;
uniform float uChroma;
uniform float uLens; // PostSettings.lens
uniform float uAspect;
// Where the dome lens bends a screen point to (lensSource in TypeScript): a barrel, the middle drawn in,
// the edges pushed out, the middle of each side staying put.
vec2 lensUv(vec2 p) {
  vec2 a = vec2(uAspect, 1.0);
  vec2 d = (p - 0.5) * a;
  float s = (1.0 + uLens * dot(d, d)) / (1.0 + uLens * 0.25);
  return 0.5 + d * s / a;
}
out vec4 outColor;
// How blurred the scene is at uv, as a radius in pixels: depth of field (distance from the focus,
// past the sharp range, over the falloff) and the blur outside a ground rectangle. The scenery outside
// the rectangle is blurred only as far as it is open (scene alpha): an overlay drawn over the fog-of-war
// veil (the renderer's overVeil ones, which take the alpha down by their coverage) stays sharp over it.
float coc(vec2 uv) {
  float d = textureLod(uDepth, uv, 0.0).r;
  vec4 clip = vec4(uv * 2.0 - 1.0, d * 2.0 - 1.0, 1.0);
  float c = 0.0;
  if (uDof.w > 0.0) {
    vec4 p = uInvProjection * clip;
    float z = -p.z / p.w;
    c = uDof.w * smoothstep(0.0, 1.0, (abs(z - uDof.x) - uDof.y) / max(uDof.z, 1e-3));
  }
  if (uBlurOut.y > 0.0) {
    vec4 w = uInvViewProj * clip;
    w.xyz /= w.w;
    float outside = max(max(uBlurRect.x - w.x, w.x - uBlurRect.z), max(uBlurRect.y - w.z, w.z - uBlurRect.w));
    float open = clamp(textureLod(uScene, uv, 0.0).a, 0.0, 1.0);
    c = max(c, uBlurOut.y * smoothstep(0.0, uBlurOut.x, outside) * open);
  }
  return c;
}
vec3 aces(vec3 x) {
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}
// Distance from the eye along the view at a screen point (for the depth-aware upsampling).
float viewZ(vec2 uv) {
  float d = textureLod(uDepth, uv, 0.0).r;
  vec4 p = uInvProjection * vec4(uv * 2.0 - 1.0, d * 2.0 - 1.0, 1.0);
  return abs(p.z / p.w);
}
// A lower-resolution layer (fog, clouds) brought up to this pixel, depth-aware: of the four texels
// around it, only those that marched to about the same depth as this pixel lend their value, so fog
// from behind an edge doesn't bleed over what is in front of it (and the other way round). When
// none match (a thin thing between texels), the one nearest in depth stands in.
vec4 upsample(sampler2D tex, vec2 size, vec2 uv) {
  if (uDepthAware < 0.5) return texture(tex, uv);
  vec2 p = uv * size - 0.5;
  vec2 i = floor(p);
  vec2 f = p - i;
  float z = viewZ(uv);
  vec4 sum = vec4(0.0);
  float wsum = 0.0;
  vec4 nearest = vec4(0.0);
  float best = 1e9;
  for (int k = 0; k < 4; k++) {
    vec2 o = vec2(float(k & 1), float(k >> 1));
    vec2 tc = (i + o + 0.5) / size;
    vec4 v = textureLod(tex, tc, 0.0);
    float rel = abs(viewZ(tc) - z) / max(z, 0.1);
    float bw = mix(1.0 - f.x, f.x, o.x) * mix(1.0 - f.y, f.y, o.y);
    float w = bw * (1.0 - smoothstep(0.015, 0.08, rel));
    sum += v * w;
    wsum += w;
    if (rel < best) {
      best = rel;
      nearest = v;
    }
  }
  return wsum > 1e-3 ? sum / wsum : nearest;
}
void main() {
  // The lens (PostSettings.lens): each pixel shows the scene from where the dome bends it to; past the
  // scene's edge, the dome's black rim.
  vec2 uv = vUv;
  if (uLens > 0.0) {
    uv = lensUv(vUv);
    if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) {
      outColor = vec4(0.0, 0.0, 0.0, 1.0);
      return;
    }
  }
  float ao = mix(1.0, texture(uAo, uv).r, uAoStrength);
  vec4 sceneTex;
  float c0 = uDof.w > 0.0 || uBlurOut.y > 0.0 ? coc(uv) : 0.0;
  if (c0 > 0.5) {
    // Gather a disk (golden-angle spiral) as wide as this pixel's blur. A sample only lends its colour
    // if its own blur reaches this far, so sharp things don't smear over blurred ones.
    vec4 sum = textureLod(uScene, uv, 0.0);
    float wsum = 1.0;
    for (int i = 0; i < 32; i++) {
      float r = sqrt((float(i) + 0.5) / 32.0);
      float a = float(i) * 2.39996323;
      vec2 suv = uv + vec2(cos(a), sin(a)) * (r * c0) * uTexel;
      float w = clamp(coc(suv) - r * c0 + 1.0, 0.0, 1.0);
      sum += textureLod(uScene, suv, 0.0) * w;
      wsum += w;
    }
    sceneTex = sum / wsum;
  } else {
    sceneTex = texture(uScene, uv);
    if (uChroma > 0.0) {
      vec2 dir = (uv - 0.5) * uChroma * 0.012;
      sceneTex.r = texture(uScene, uv + dir).r;
      sceneTex.b = texture(uScene, uv - dir).b;
    }
  }
  // Ambient occlusion darkens the surfaces only: applied before the fog and clouds in front of them,
  // so its rings round trees and along cliff feet don't show through a cloud.
  vec3 scene = sceneTex.rgb * ao;
  // How much of what lies behind the fog and clouds still shows (their glow, too, is dimmed by it).
  float through = 1.0;
  if (uHasFog > 0.5) {
    // (The fog pass has already stopped the distance fog where the fog-of-war veil closed the pixel,
    // and marched the mist by the fog of war: what it gives is what shows.)
    vec4 fog = upsample(uFog, uFogSize, uv);
    scene = scene * fog.a + fog.rgb;
    through *= fog.a;
  }
  if (uHasCloud > 0.5) {
    // Clouds over everything (they are high above it). The march weighted them by the fog of war
    // where each cloud is, so a cloud over explored land stands in front of unexplored ground behind it.
    // Their opacity lets the scene through; their shade takes their light away, leaving the darkening.
    vec4 cl;
    if (uCloudDigital.x > 0.0) {
      // Digital: one sample a block of screen pixels, its density and light in a few steps, the blocks'
      // edges thinner (a pixel grid through them).
      vec2 block = uCloudDigital.x * uTexel;
      vec2 cell = floor(uv / block);
      cl = upsample(uCloud, uCloudSize, (cell + 0.5) * block);
      float steps = max(1.0, uCloudDigital.y);
      float cover = floor((1.0 - cl.a) * steps + 0.5) / steps;
      vec2 f = fract(uv / block);
      cover *= max(f.x, f.y) > 0.86 ? 0.55 : 1.0;
      float was = max(1e-3, 1.0 - cl.a);
      cl.rgb *= cover / was;
      cl.a = 1.0 - cover;
    } else cl = upsample(uCloud, uCloudSize, uv);
    float clT = mix(1.0, cl.a, uCloudOpacity);
    scene = scene * clT + cl.rgb * (1.0 - uCloudShade) * uCloudOpacity;
    through *= clT;
  }
  if (any(isnan(scene)) || any(isinf(scene))) scene = vec3(0.0);
  vec3 c = scene + texture(uBloom, uv).rgb * uBloomStrength * through;
  c = aces(c * uExposure);
  float lum = dot(c, vec3(0.2126, 0.7152, 0.0722));
  c = mix(vec3(lum), c, uSaturation);
  c = (c - 0.5) * uContrast + 0.5;
  vec2 d = vUv - 0.5;
  c *= 1.0 - uVignette * smoothstep(0.2, 0.8, dot(d, d) * 2.0);
  outColor = vec4(pow(clamp(c, 0.0, 1.0), vec3(1.0 / 2.2)), 1.0);
}`;class wa{constructor(e){f(this,"timers",null);f(this,"fogHist",[null,null]);f(this,"fogHistAt",0);f(this,"prevViewProj",null);f(this,"prevEye",null);f(this,"histValid",!1);f(this,"frameIndex",0);f(this,"fogTemporal");f(this,"cloudValid",!1);f(this,"settings",{...la});f(this,"hdr");f(this,"scene",null);f(this,"mips",[]);f(this,"ao",null);f(this,"aoBlur",null);f(this,"fog",null);f(this,"fogTmp",null);f(this,"fogBlur");f(this,"cloudProgram");f(this,"cloud",null);f(this,"cloudTmp",null);f(this,"volume");f(this,"ssao");f(this,"blur");f(this,"vao");f(this,"bright");f(this,"down");f(this,"up");f(this,"composite");f(this,"width",0);f(this,"height",0);f(this,"depthCopy",null);f(this,"depthCopyFbo",null);f(this,"depthCopyW",0);f(this,"depthCopyH",0);f(this,"blackTex",null);this.gl=e,this.hdr=!!e.getExtension("EXT_color_buffer_float"),e.getExtension("OES_texture_float_linear");const t=e.createVertexArray();if(!t)throw new Error("post vao failed");this.vao=t,this.bright=new O(e,Le,ca),this.down=new O(e,Le,ha),this.up=new O(e,Le,fa),this.composite=new O(e,Le,xa),this.ssao=new O(e,Le,da),this.volume=new O(e,Le,pa),this.fogBlur=new O(e,Le,va),this.fogTemporal=new O(e,Le,ga),this.cloudProgram=new O(e,Le,Qo),this.blur=new O(e,Le,ma)}makeTarget(e,t,i,o=this.hdr){const r=this.gl,s=r.createTexture(),n=r.createFramebuffer();if(!s||!n)throw new Error("post target failed");r.bindTexture(r.TEXTURE_2D,s),r.texImage2D(r.TEXTURE_2D,0,o?r.RGBA16F:r.RGBA8,e,t,0,r.RGBA,o?r.HALF_FLOAT:r.UNSIGNED_BYTE,null),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE),r.bindFramebuffer(r.FRAMEBUFFER,n),r.framebufferTexture2D(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,s,0);let u;if(i){const c=r.createTexture();if(!c)throw new Error("post depth failed");r.bindTexture(r.TEXTURE_2D,c),r.texImage2D(r.TEXTURE_2D,0,r.DEPTH_COMPONENT24,e,t,0,r.DEPTH_COMPONENT,r.UNSIGNED_INT,null),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,r.NEAREST),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE),r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,c,0),u=c}const l=r.checkFramebufferStatus(r.FRAMEBUFFER);if(r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindTexture(r.TEXTURE_2D,null),l!==r.FRAMEBUFFER_COMPLETE)throw new Error(`post framebuffer incomplete: ${l}`);return{fbo:n,tex:s,width:e,height:t,depth:u}}dropTarget(e){e&&(this.gl.deleteFramebuffer(e.fbo),this.gl.deleteTexture(e.tex),e.depth&&this.gl.deleteTexture(e.depth))}resize(e,t){if(e=Math.max(1,e),t=Math.max(1,t),e===this.width&&t===this.height&&this.scene)return;this.width=e,this.height=t,this.dropTarget(this.scene),this.dropTarget(this.ao),this.dropTarget(this.aoBlur),this.dropTarget(this.fog),this.dropTarget(this.fogTmp),this.fog=this.fogTmp=null,this.dropTarget(this.cloud),this.dropTarget(this.cloudTmp),this.cloud=this.cloudTmp=null,this.cloudValid=!1,this.dropTarget(this.fogHist[0]),this.dropTarget(this.fogHist[1]),this.fogHist=[null,null],this.histValid=!1;for(const n of this.mips)this.dropTarget(n);this.mips.length=0,this.scene=this.makeTarget(e,t,!0);const i=Math.max(1,e>>1),o=Math.max(1,t>>1);this.ao=this.makeTarget(i,o,!1,!1),this.aoBlur=this.makeTarget(i,o,!1,!1);let r=Math.max(1,e>>1),s=Math.max(1,t>>1);for(let n=0;n<ua;n++)this.mips.push(this.makeTarget(r,s,!1)),r=Math.max(1,r>>1),s=Math.max(1,s>>1)}get depthTexture(){var e;return((e=this.scene)==null?void 0:e.depth)??null}snapshotDepth(){var t;const e=this.gl;if(!((t=this.scene)!=null&&t.depth))return null;if(!this.depthCopy||this.depthCopyW!==this.scene.width||this.depthCopyH!==this.scene.height){this.depthCopy&&e.deleteTexture(this.depthCopy),this.depthCopyFbo&&e.deleteFramebuffer(this.depthCopyFbo);const i=e.createTexture(),o=e.createFramebuffer();if(!i||!o)throw new Error("depth copy failed");e.bindTexture(e.TEXTURE_2D,i),e.texImage2D(e.TEXTURE_2D,0,e.DEPTH_COMPONENT24,this.scene.width,this.scene.height,0,e.DEPTH_COMPONENT,e.UNSIGNED_INT,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.bindFramebuffer(e.FRAMEBUFFER,o),e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.TEXTURE_2D,i,0),e.drawBuffers([e.NONE]),e.readBuffer(e.NONE),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindTexture(e.TEXTURE_2D,null),this.depthCopy=i,this.depthCopyFbo=o,this.depthCopyW=this.scene.width,this.depthCopyH=this.scene.height}return e.bindFramebuffer(e.READ_FRAMEBUFFER,this.scene.fbo),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,this.depthCopyFbo),e.blitFramebuffer(0,0,this.scene.width,this.scene.height,0,0,this.scene.width,this.scene.height,e.DEPTH_BUFFER_BIT,e.NEAREST),e.bindFramebuffer(e.FRAMEBUFFER,this.scene.fbo),this.depthCopy}begin(){if(!this.scene)return;const e=this.gl;e.bindFramebuffer(e.FRAMEBUFFER,this.scene.fbo),e.viewport(0,0,this.scene.width,this.scene.height)}end(e,t,i,o){var b,F,_,E,R,M,z,L,A,S,U,D,ae,ee,se,ue,Ue,he,Te,Ee;const r=this.gl;if(!this.scene)return;const s=this.settings;r.disable(r.DEPTH_TEST),r.disable(r.BLEND),r.bindVertexArray(this.vao);let n=null;const u=o==null?void 0:o.fogVolumes,l=u&&(o!=null&&o.clouds)?u.active:0,c=!!o&&!!this.scene.depth&&(s.volumetric||l>0);if(c&&o&&this.scene.depth){(b=this.timers)==null||b.begin("fog");const q=s.fogFullRes?1:Math.min(1,Math.max(.25,s.fogScale)),ie=Math.max(1,Math.floor(this.scene.width*q)),T=Math.max(1,Math.floor(this.scene.height*q));(!this.fog||!this.fogTmp||this.fog.width!==ie||this.fog.height!==T)&&(this.dropTarget(this.fog),this.dropTarget(this.fogTmp),this.dropTarget(this.fogHist[0]),this.dropTarget(this.fogHist[1]),this.fogHist=[null,null],this.histValid=!1,this.fog=this.makeTarget(ie,T,!1),this.fogTmp=this.makeTarget(ie,T,!1)),r.bindFramebuffer(r.FRAMEBUFFER,this.fog.fbo),r.viewport(0,0,this.fog.width,this.fog.height);const y=this.volume;y.use(),this.bind(y,"uDepth",this.scene.depth,0);for(let P=0;P<3;P++)this.bind(y,`uShadow${P}`,o.shadowMaps[Math.min(P,o.shadowMaps.length-1)]??this.black(),1+P),y.setMat4(`uLightVP${P}`,o.lightViewProj[Math.min(P,o.lightViewProj.length-1)]??ct());r.uniform1i(y.uniform("uCascades"),o.shadowMaps.length),y.setMat4("uInvViewProj",o.invViewProj),y.setVec3("uEye",...o.eye),y.setVec3("uSunDir",...o.sunDir),y.setVec3("uSunRadiance",...o.sunRadiance),y.setVec3("uSkyColor",...o.skyColor),y.setVec3("uFogColor",...s.fogColor),y.setFloat("uDensity",s.volumetric?s.fogDensity:0),y.setFloat("uHeight",Math.max(.1,s.fogHeight)),y.setFloat("uAmbient",s.fogAmbient),y.setFloat("uSunScatter",s.fogSun),r.uniform1i(y.uniform("uSteps"),s.volumetric?Math.max(4,Math.min(128,Math.round(s.fogSteps))):0),u==null||u.bind(r,y,l),o.clouds&&(r.activeTexture(r.TEXTURE4),r.bindTexture(r.TEXTURE_3D,o.clouds.detail)),r.uniform1i(y.uniform("uNoise"),4),(F=o.lights)==null||F.bind(5,6),r.uniform1i(y.uniform("uLights"),5),r.uniform1i(y.uniform("uTiles"),6);const C=u==null?void 0:u.settings;r.uniform1i(y.uniform("uVolSteps"),Math.max(2,Math.min(64,Math.round((C==null?void 0:C.steps)??24)))),y.setFloat("uVolSelfShadow",C!=null&&C.selfShadow?1:0),y.setFloat("uVolSun",(C==null?void 0:C.sun)??0),y.setFloat("uVolAmbient",(C==null?void 0:C.ambient)??0),r.uniform3f(y.uniform("uTileInfo"),((_=o.lights)==null?void 0:_.tilesX)??1,et,C!=null&&C.lights&&o.lights?1:0),r.uniform2f(y.uniform("uScreen"),this.scene.width,this.scene.height),y.setFloat("uFar",o.far),this.bind(y,"uScene",this.scene.tex,7),this.bind(y,"uVeilMask",((E=o.veil)==null?void 0:E.mask)??this.black(),8),r.uniform2f(y.uniform("uVeilCells"),((R=o.veil)==null?void 0:R.cells[0])??1,((M=o.veil)==null?void 0:M.cells[1])??1),y.setFloat("uVeilOn",o.veil?1:0),y.setFloat("uVeilAlpha",((z=o.veil)==null?void 0:z.alpha)??0),this.frameIndex++,y.setFloat("uFrameJitter",s.fogTemporal?this.frameIndex*.6180339887%1:0),y.setFloat("uSkip",o.rayStart??0),y.setVec3("uViewPoint",...o.viewPoint??o.eye),r.drawArrays(r.TRIANGLES,0,3);let I=this.fog;const X=Qe(o.invViewProj);if(s.fogTemporal){(!this.fogHist[0]||!this.fogHist[1])&&(this.fogHist=[this.makeTarget(ie,T,!1),this.makeTarget(ie,T,!1)],this.histValid=!1);const P=this.fogHist[this.fogHistAt],G=this.fogHist[1-this.fogHistAt];r.bindFramebuffer(r.FRAMEBUFFER,P.fbo);const N=this.fogTemporal;N.use(),this.bind(N,"uCurrent",this.fog.tex,0),this.bind(N,"uHistory",G.tex,1),this.bind(N,"uDepth",this.scene.depth,2),N.setMat4("uInvViewProj",o.invViewProj),N.setMat4("uPrevViewProj",this.prevViewProj??X),r.uniform2f(N.uniform("uTexel"),1/ie,1/T);const re=this.prevEye?Math.hypot(o.eye[0]-this.prevEye[0],o.eye[1]-this.prevEye[1],o.eye[2]-this.prevEye[2]):0;N.setFloat("uBlend",this.histValid&&this.prevViewProj?Math.min(.85,.15+re*1.5):1),N.setFloat("uFar",o.far),r.drawArrays(r.TRIANGLES,0,3),this.fogHistAt=1-this.fogHistAt,this.histValid=!0,I=P}else this.histValid=!1;this.prevViewProj=X,this.prevEye=[...o.eye];const V=Math.max(0,Math.min(3,Math.round(s.fogSmooth)));if(V>0&&this.fogTmp){const P=this.fogBlur;P.use(),this.bind(P,"uDepth",this.scene.depth,1),P.setMat4("uInvProjection",i);for(let G=0;G<V;G++)r.bindFramebuffer(r.FRAMEBUFFER,this.fogTmp.fbo),this.bind(P,"uSrc",G===0?I.tex:this.fog.tex,0),r.uniform2f(P.uniform("uStep"),1/this.fog.width,0),r.drawArrays(r.TRIANGLES,0,3),r.bindFramebuffer(r.FRAMEBUFFER,this.fog.fbo),this.bind(P,"uSrc",this.fogTmp.tex,0),r.uniform2f(P.uniform("uStep"),0,1/this.fog.height),r.drawArrays(r.TRIANGLES,0,3)}n=V>0?this.fog.tex:I.tex}let d=null;const h=o==null?void 0:o.clouds;c||this.frameIndex++;const m=!!(h&&h.settings.enabled&&h.active.length&&o&&this.scene.depth);if(m||(this.cloudValid=!1),m&&s.cloudsHalfRate&&this.cloudValid&&this.cloud&&this.frameIndex%2===1)d=this.cloud.tex;else if(h&&m&&o&&this.scene.depth){if(this.cloudValid=!0,(L=this.timers)==null||L.begin("clouds"),!this.cloud||!this.cloudTmp){const y=Math.max(1,this.scene.width>>1),C=Math.max(1,this.scene.height>>1);this.cloud=this.makeTarget(y,C,!1),this.cloudTmp=this.makeTarget(y,C,!1)}const q=this.cloudProgram,ie=h.settings;r.bindFramebuffer(r.FRAMEBUFFER,this.cloud.fbo),r.viewport(0,0,this.cloud.width,this.cloud.height),q.use(),this.bind(q,"uDepth",this.scene.depth,0),this.bind(q,"uVeilMask",((A=o.veil)==null?void 0:A.mask)??this.black(),3),r.uniform2f(q.uniform("uVeilCells"),((S=o.veil)==null?void 0:S.cells[0])??1,((U=o.veil)==null?void 0:U.cells[1])??1),q.setFloat("uVeilOn",o.veil&&!ie.overVeil?1:0),q.setFloat("uVeilAlpha",((D=o.veil)==null?void 0:D.alpha)??0),h.bindCommon(q,1),r.activeTexture(r.TEXTURE2),r.bindTexture(r.TEXTURE_3D,h.detail),r.uniform1i(q.uniform("uCloudDetail"),2),q.setMat4("uInvViewProj",o.invViewProj),q.setVec3("uSunDir",...o.sunDir),q.setVec3("uSunRadiance",...o.sunRadiance),q.setVec3("uSkyColor",...o.skyColor),q.setFloat("uFar",Math.max(o.far*1.5,300)),q.setFloat("uTime",o.time??0),q.setFloat("uSkip",o.rayStart??0),r.uniform1i(q.uniform("uSteps"),Math.max(8,Math.min(128,Math.round(ie.steps)))),r.drawArrays(r.TRIANGLES,0,3),r.bindTexture(r.TEXTURE_3D,null);const T=this.fogBlur;T.use(),this.bind(T,"uDepth",this.scene.depth,1),T.setMat4("uInvProjection",i),r.bindFramebuffer(r.FRAMEBUFFER,this.cloudTmp.fbo),this.bind(T,"uSrc",this.cloud.tex,0),r.uniform2f(T.uniform("uStep"),1/this.cloud.width,0),r.drawArrays(r.TRIANGLES,0,3),r.bindFramebuffer(r.FRAMEBUFFER,this.cloud.fbo),this.bind(T,"uSrc",this.cloudTmp.tex,0),r.uniform2f(T.uniform("uStep"),0,1/this.cloud.height),r.drawArrays(r.TRIANGLES,0,3),d=this.cloud.tex}let g=null;s.ssao&&this.ao&&this.aoBlur&&this.scene.depth&&((ae=this.timers)==null||ae.begin("ssao"),r.bindFramebuffer(r.FRAMEBUFFER,this.ao.fbo),r.viewport(0,0,this.ao.width,this.ao.height),this.ssao.use(),this.bind(this.ssao,"uDepth",(o==null?void 0:o.opaqueDepth)??this.scene.depth,0),this.ssao.setMat4("uProjection",t),this.ssao.setMat4("uInvProjection",i),r.uniform2f(this.ssao.uniform("uTexel"),1/this.scene.width,1/this.scene.height),this.ssao.setFloat("uRadius",s.ssaoRadius),r.drawArrays(r.TRIANGLES,0,3),r.bindFramebuffer(r.FRAMEBUFFER,this.aoBlur.fbo),this.blur.use(),this.bind(this.blur,"uSrc",this.ao.tex,0),r.uniform2f(this.blur.uniform("uTexel"),1/this.ao.width,1/this.ao.height),r.drawArrays(r.TRIANGLES,0,3),g=this.aoBlur.tex);let w=null;if(s.bloom&&this.mips.length){(ee=this.timers)==null||ee.begin("bloom");const q=this.mips[0];r.bindFramebuffer(r.FRAMEBUFFER,q.fbo),r.viewport(0,0,q.width,q.height),this.bright.use(),this.bind(this.bright,"uScene",this.scene.tex,0),this.bright.setFloat("uThreshold",s.bloomThreshold),r.drawArrays(r.TRIANGLES,0,3),this.down.use();for(let ie=1;ie<this.mips.length;ie++){const T=this.mips[ie-1],y=this.mips[ie];r.bindFramebuffer(r.FRAMEBUFFER,y.fbo),r.viewport(0,0,y.width,y.height),this.bind(this.down,"uSrc",T.tex,0),r.uniform2f(this.down.uniform("uTexel"),1/T.width,1/T.height),r.drawArrays(r.TRIANGLES,0,3)}this.up.use();for(let ie=this.mips.length-2;ie>=0;ie--){const T=this.mips[ie+1],y=this.mips[ie];r.bindFramebuffer(r.FRAMEBUFFER,y.fbo),r.viewport(0,0,y.width,y.height),r.enable(r.BLEND),r.blendFunc(r.ONE,r.ONE),this.bind(this.up,"uSrc",T.tex,0),this.bind(this.up,"uPrev",this.black(),1),r.uniform2f(this.up.uniform("uTexel"),1/T.width,1/T.height),r.drawArrays(r.TRIANGLES,0,3),r.disable(r.BLEND)}w=this.mips[0].tex}(se=this.timers)==null||se.begin("composite"),r.bindFramebuffer(r.FRAMEBUFFER,null),r.viewport(0,0,this.width,this.height),this.composite.use(),this.bind(this.composite,"uScene",this.scene.tex,0),this.bind(this.composite,"uBloom",w??this.black(),1),this.composite.setFloat("uBloomStrength",w?s.bloomStrength:0),this.bind(this.composite,"uAo",g??this.black(),2),this.bind(this.composite,"uFog",n??this.black(),3),this.composite.setFloat("uHasFog",n?1:0),r.uniform2f(this.composite.uniform("uFogSize"),((ue=this.fog)==null?void 0:ue.width)??1,((Ue=this.fog)==null?void 0:Ue.height)??1),this.composite.setFloat("uDepthAware",s.fogDepthAware?1:0),this.bind(this.composite,"uCloud",d??this.black(),5),this.composite.setFloat("uHasCloud",d?1:0);const x=(he=o==null?void 0:o.clouds)==null?void 0:he.settings;this.composite.setFloat("uCloudOpacity",Math.min(1,Math.max(0,(x==null?void 0:x.opacity)??1))),this.composite.setFloat("uCloudShade",Math.min(1,Math.max(0,(x==null?void 0:x.shade)??0))),r.uniform2f(this.composite.uniform("uCloudDigital"),x!=null&&x.digital?Math.max(1,x.digital.pixels):0,x!=null&&x.digital?x.digital.steps:0),r.uniform2f(this.composite.uniform("uCloudSize"),((Te=this.cloud)==null?void 0:Te.width)??1,((Ee=this.cloud)==null?void 0:Ee.height)??1),this.composite.setFloat("uAoStrength",g?s.ssaoStrength:0),this.composite.setFloat("uExposure",e),this.composite.setFloat("uVignette",s.vignette),this.composite.setFloat("uContrast",s.contrast),this.composite.setFloat("uSaturation",s.saturation),this.bind(this.composite,"uDepth",this.scene.depth??this.black(),4),this.composite.setMat4("uInvProjection",i),this.composite.setMat4("uInvViewProj",(o==null?void 0:o.invViewProj)??ct()),r.uniform4f(this.composite.uniform("uDof"),s.dofFocus,s.dofRange,s.dofFalloff,s.dof&&this.scene.depth?s.dofBlur:0);const v=s.blurOutside&&o&&this.scene.depth?s.blurOutside:null,p=v?v.rect:[0,0,0,0];r.uniform4f(this.composite.uniform("uBlurRect"),p[0],p[1],p[2],p[3]),r.uniform2f(this.composite.uniform("uBlurOut"),v?Math.max(.01,v.distance):1,v?v.blur:0),r.uniform2f(this.composite.uniform("uTexel"),1/this.scene.width,1/this.scene.height),this.composite.setFloat("uChroma",s.chroma),this.composite.setFloat("uLens",Math.max(0,s.lens??0)),this.composite.setFloat("uAspect",this.scene.width/Math.max(1,this.scene.height)),r.drawArrays(r.TRIANGLES,0,3),r.bindVertexArray(null),r.enable(r.DEPTH_TEST)}black(){if(this.blackTex)return this.blackTex;const e=this.gl,t=e.createTexture();return e.bindTexture(e.TEXTURE_2D,t),e.texImage2D(e.TEXTURE_2D,0,e.RGBA8,1,1,0,e.RGBA,e.UNSIGNED_BYTE,new Uint8Array([0,0,0,255])),e.bindTexture(e.TEXTURE_2D,null),this.blackTex=t,t}bind(e,t,i,o){const r=this.gl;r.activeTexture(r.TEXTURE0+o),r.bindTexture(r.TEXTURE_2D,i),r.uniform1i(e.uniform(t),o)}}const ba={enabled:!1,dayLength:24,azimuth:35,maxElevation:58,nightLight:.5},me=(a,e,t)=>[a[0]+(e[0]-a[0])*t,a[1]+(e[1]-a[1])*t,a[2]+(e[2]-a[2])*t],Ft=(a,e,t)=>{const i=Math.min(1,Math.max(0,(a-e)/(t-e)));return i*i*(3-2*i)};function Vi(a,e,t){return a+(e-a)*t}function ya(a,e,t,i=0,o=[1,1,1]){const r=Ta(a,e,t),s=Math.min(1,Math.max(0,i));if(s<=0)return r;const n=r.day,u=me([1,1,1],o,s),l=m=>[m[0]*u[0],m[1]*u[1],m[2]*u[2]],c=l(me([.02,.025,.035],[.3,.32,.36],n)),d=l(me([.02,.025,.035],[.42,.44,.48],n)),h=l(me([.015,.02,.03],[.2,.22,.26],n));return{...r,sunIntensity:r.sunIntensity*(1-.9*s),sunColor:me(r.sunColor,l([.82,.84,.9]),.7*s),skyColor:me(r.skyColor,c,s),groundColor:me(r.groundColor,r.groundColor.map(m=>m*.6),s),ambient:r.ambient*(1-.3*s),horizon:me(r.horizon,d,s),zenith:me(r.zenith,h,s)}}function Ta(a,e,t){const i=(a%1+1)%1,o=Math.sin(i*Math.PI*2),r=Ft(o,-.18,.35),s=1-Math.min(1,Math.max(0,o/.35)),n=o<0,u=Ft(o,0,.22),l=Ft(-o,.02,.3),c=Math.max(n?25:4,Math.abs(o)*t.maxElevation)*Math.PI/180,d=(t.azimuth+(n?180:0))*Math.PI/180,h=[-Math.sin(d)*Math.cos(c),-Math.sin(c),Math.cos(d)*Math.cos(c)],m=[1,.55,.28],g=n?[.5,.62,1]:me(e.sunColor,m,s*.8),w=Math.min(1,Math.max(0,t.nightLight??.5)),x=n?e.sunIntensity*(.03+.2*w)*l:e.sunIntensity*(.1+.9*r)*u,v=[.02,.03,.06],p=[.9,.45,.25],b=[.18,.36,.78],F=[.62,.74,.92],_=me(v,b,r),E=(s*r*.9+s*(1-r)*.5)*Ft(o,-.2,0),R=me(me(v,F,r),p,E);return{sunDir:h,sunColor:g,sunIntensity:x,skyColor:me(me([.05,.06,.1],[.16,.2,.34],w),e.skyColor,r),groundColor:me([.03,.03,.04],e.groundColor,r),ambient:e.ambient*Vi(.18+.22*w,1,r),horizon:R,zenith:_,day:r,exposure:Vi(1+3*w,1,r)}}const Ea={enabled:!0,sunSize:.012,sunGlow:.6},Aa=`#version 300 es
out vec2 vNdc;
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  vNdc = p * 2.0 - 1.0;
  gl_Position = vec4(vNdc, 0.999999, 1.0);
}`,Ra=`#version 300 es
precision highp float;
in vec2 vNdc;
uniform mat4 uInvViewProj;
uniform vec3 uEye;
uniform vec3 uSunDir;
uniform vec3 uSunColor;
uniform float uSunIntensity;
uniform vec3 uHorizon;
uniform vec3 uZenith;
uniform float uSunSize;
uniform float uSunGlow;
uniform float uExposure;
uniform float uToneMap;
uniform vec3 uBelow; // what sits under the horizon (dim horizon on screen, the ground tone in the env cube)
out vec4 outColor;
void main() {
  vec4 far = uInvViewProj * vec4(vNdc, 1.0, 1.0);
  vec3 dir = normalize(far.xyz / far.w - uEye);
  float up = clamp(dir.y, 0.0, 1.0);
  // Gradient: horizon colour low, zenith high, with a soft band.
  vec3 c = mix(uHorizon, uZenith, pow(up, 0.55));
  // Below the horizon: fade toward a darker ground tone (the terrain covers it anyway).
  if (dir.y < 0.0) c = mix(c, uBelow, clamp(-dir.y * 4.0, 0.0, 1.0));
  vec3 toSun = normalize(-uSunDir);
  float cosA = dot(dir, toSun);
  float disc = smoothstep(1.0 - uSunSize * 1.6, 1.0 - uSunSize, cosA);
  float glow = pow(max(cosA, 0.0), 32.0) * uSunGlow * 0.6 + pow(max(cosA, 0.0), 8.0) * uSunGlow * 0.15;
  c += uSunColor * uSunIntensity * (disc * 1.5 + glow);
  if (uToneMap > 0.5) {
    c *= uExposure;
    c = clamp((c * (2.51 * c + 0.03)) / (c * (2.43 * c + 0.59) + 0.14), 0.0, 1.0);
    c = pow(c, vec3(1.0 / 2.2));
  }
  outColor = vec4(c, 1.0);
}`;class Fa{constructor(e){f(this,"settings",{...Ea});f(this,"program");f(this,"vao");this.gl=e,this.program=new O(e,Aa,Ra);const t=e.createVertexArray();if(!t)throw new Error("sky vao failed");this.vao=t}setSky(e,t){e.setVec3("uSunDir",...t.sunDir),e.setVec3("uSunColor",...t.sunColor),e.setFloat("uSunIntensity",t.sunIntensity),e.setVec3("uHorizon",...t.horizon),e.setVec3("uZenith",...t.zenith),e.setFloat("uSunSize",this.settings.sunSize),e.setFloat("uSunGlow",this.settings.sunGlow)}renderEnv(e,t){const i=this.gl,o=this.program;o.use(),this.setSky(o,t),o.setVec3("uEye",0,0,0),o.setVec3("uBelow",...t.groundColor),o.setFloat("uExposure",1),o.setFloat("uToneMap",0),i.disable(i.DEPTH_TEST),i.disable(i.CULL_FACE),i.bindVertexArray(this.vao);for(let r=0;r<6;r++)e.bindFace(r),o.setMat4("uInvViewProj",e.invViewProj[r]),i.drawArrays(i.TRIANGLES,0,3);i.bindVertexArray(null),e.finish(),i.enable(i.CULL_FACE),i.enable(i.DEPTH_TEST)}draw(e,t,i,o,r){const s=this.gl,n=this.program;n.use(),this.setSky(n,i),n.setMat4("uInvViewProj",e),n.setVec3("uEye",t[0],t[1],t[2]),n.setVec3("uBelow",i.horizon[0]*.5,i.horizon[1]*.5,i.horizon[2]*.5),n.setFloat("uExposure",o),n.setFloat("uToneMap",r?1:0),s.depthFunc(s.LEQUAL),s.depthMask(!1),s.disable(s.CULL_FACE),s.bindVertexArray(this.vao),s.drawArrays(s.TRIANGLES,0,3),s.bindVertexArray(null),s.enable(s.CULL_FACE),s.depthMask(!0),s.depthFunc(s.LESS)}}const _a={enabled:!0,reflections:!0,reflectionScale:.5,reflectionHalfRate:!0,waveHeight:.035,waveSpeed:1,waveSize:1,ripple:1,rippleSize:1,waveDirection:0,depthFade:1.2,foam:!0,foamWidth:.35,whitecaps:0,sides:!0,clarity:.55,color:[.07,.25,.32],sparkle:1,glow:1},ht=4,Ma=`#version 300 es
layout(location = 0) in vec3 aPosition;
layout(location = 1) in float aTop;
layout(location = 2) in vec4 aTint;
uniform mat4 uProjection;
uniform mat4 uView;
uniform float uTime;
uniform float uWaveHeight;
uniform float uWaveFreq;
uniform vec2 uWaveRot;
out vec3 vWorld;
out float vTop;
out vec4 vTint;
const vec2 D0 = vec2(0.8, 0.6);
const vec2 D1 = vec2(-0.5, 0.86);
const vec2 D2 = vec2(0.2, -0.98);
void main() {
  vec2 p = vec2(aPosition.x * uWaveRot.x + aPosition.z * uWaveRot.y, -aPosition.x * uWaveRot.y + aPosition.z * uWaveRot.x); // turned to the wave direction
  float k = uWaveFreq;
  float t = uTime;
  float h = (sin(dot(D0, p) * 1.7 * k + t * 1.3) * 0.5 + sin(dot(D1, p) * 2.9 * k + t * 1.9) * 0.3 + sin(dot(D2, p) * 4.3 * k + t * 2.6) * 0.2) * uWaveHeight;
  vWorld = vec3(aPosition.x, aPosition.y + h * aTop, aPosition.z);
  vTop = aTop;
  vTint = aTint;
  gl_Position = uProjection * uView * vec4(vWorld, 1.0);
}`,Sa=`#version 300 es
precision highp float;
in vec3 vWorld;
in float vTop;
in vec4 vTint;
uniform vec3 uColor;
uniform float uLight;
uniform float uGlow;
uniform vec3 uHorizon;
uniform vec3 uEye;
uniform vec3 uFogColor;
uniform vec2 uFogRange;
uniform float uExposure;
uniform float uToneMap;
out vec4 outColor;
void main() {
  // A tint of its own (r at or over 0): its colour and glow; else the settings' colour.
  bool own = vTint.r >= 0.0;
  vec3 base = own ? vTint.rgb : uColor;
  float glow = own ? vTint.a * uGlow : 0.0;
  vec3 body = base * uLight;
  // Lit near the surface (a little sky shows through), dark lower down.
  vec3 c = mix(body * 0.35, body * 1.4 + uHorizon * 0.08 * uLight, vTop);
  float a = mix(0.85, 0.6, vTop);
  // The surface edge: a thin bright line.
  float edge = smoothstep(0.93, 1.0, vTop);
  c = mix(c, vec3(0.75, 0.88, 0.95) * uLight, edge * 0.6 * (1.0 - min(glow, 1.0)));
  a = max(a, edge * 0.9);
  // Its own light (by night too), brightest at the top.
  c += base * glow * mix(0.15, 0.45, vTop);
  a = max(a, min(glow, 1.0) * 0.9);
  float fog = clamp((distance(vWorld, uEye) - uFogRange.x) / (uFogRange.y - uFogRange.x), 0.0, 1.0);
  c = mix(c, uFogColor, fog);
  if (uToneMap > 0.5) {
    c *= uExposure;
    c = clamp((c * (2.51 * c + 0.03)) / (c * (2.43 * c + 0.59) + 0.14), 0.0, 1.0);
    c = pow(c, vec3(1.0 / 2.2));
  }
  outColor = vec4(c, a);
}`,Da=`#version 300 es
layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec2 aUv;
layout(location = 2) in float aShore;
layout(location = 3) in vec4 aTint;
out float vShore;
out vec4 vTint;
uniform mat4 uProjection;
uniform mat4 uView;
uniform float uTime;
uniform float uWaveHeight;
uniform float uWaveFreq;
uniform vec2 uWaveRot;
out vec3 vWorld;
out vec2 vUv;
out vec3 vWaveNormal;
// Three waves: direction (xz), wavelength scale, speed.
const vec2 D0 = vec2(0.8, 0.6);
const vec2 D1 = vec2(-0.5, 0.86);
const vec2 D2 = vec2(0.2, -0.98);
void main() {
  vec2 p = vec2(aPosition.x * uWaveRot.x + aPosition.z * uWaveRot.y, -aPosition.x * uWaveRot.y + aPosition.z * uWaveRot.x); // turned to the wave direction
  float t = uTime;
  float k = uWaveFreq;
  float f0 = dot(D0, p) * 1.7 * k + t * 1.3;
  float f1 = dot(D1, p) * 2.9 * k + t * 1.9;
  float f2 = dot(D2, p) * 4.3 * k + t * 2.6;
  float h = (sin(f0) * 0.5 + sin(f1) * 0.3 + sin(f2) * 0.2) * uWaveHeight;
  // Analytic slope of the sum for the normal.
  vec2 dh = (cos(f0) * 0.5 * 1.7 * D0 + cos(f1) * 0.3 * 2.9 * D1 + cos(f2) * 0.2 * 4.3 * D2) * uWaveHeight * k;
  dh = vec2(dh.x * uWaveRot.x - dh.y * uWaveRot.y, dh.x * uWaveRot.y + dh.y * uWaveRot.x); // back to the map's axes
  vWaveNormal = normalize(vec3(-dh.x, 1.0, -dh.y));
  vWorld = vec3(aPosition.x, aPosition.y + h, aPosition.z);
  vUv = aUv;
  vShore = aShore;
  vTint = aTint;
  gl_Position = uProjection * uView * vec4(vWorld, 1.0);
}`,Ca=`#version 300 es
precision highp float;
in vec3 vWorld;
in vec2 vUv;
in float vShore;
in vec4 vTint;
uniform float uGlow;
uniform vec2 uWaveRot;
uniform float uFoam;
uniform float uFoamWidth;
uniform float uWhitecaps;
uniform float uWaveFreq;
in vec3 vWaveNormal;
// The vertex shader's three waves (for the whitecaps on their crests).
const vec2 D0 = vec2(0.8, 0.6);
const vec2 D1 = vec2(-0.5, 0.86);
const vec2 D2 = vec2(0.2, -0.98);
uniform vec3 uEye;
uniform vec3 uSunDir;
uniform vec3 uSunColor;
uniform float uSunIntensity;
uniform vec3 uHorizon;
uniform vec3 uZenith;
uniform vec3 uColor;
uniform float uLight;
uniform float uClarity;
uniform float uSparkle;
uniform float uRipple;
uniform float uRippleFreq;
uniform float uTime;
uniform sampler2D uReflection;
uniform float uHasReflection;
uniform vec2 uResolution;
uniform sampler2D uSceneDepth;
uniform float uHasDepth;
uniform float uAbsorb;
uniform mat4 uInvViewProj;
uniform vec3 uFogColor;
uniform vec2 uFogRange;
uniform float uExposure;
uniform float uToneMap;
out vec4 outColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
// Gradient of two drifting noise layers (different scales, speeds and directions): ripples that never tile.
vec2 rippleGrad(vec2 p, float t) {
  float e = 0.05;
  vec2 a = p * 3.1 + vec2(t * 0.21, t * 0.13);
  vec2 b = p * 7.7 + vec2(-t * 0.17, t * 0.29);
  float na = vnoise(a);
  float nb = vnoise(b);
  vec2 ga = vec2(vnoise(a + vec2(e, 0.0)) - na, vnoise(a + vec2(0.0, e)) - na) / e;
  vec2 gb = vec2(vnoise(b + vec2(e, 0.0)) - nb, vnoise(b + vec2(0.0, e)) - nb) / e;
  return ga * 0.06 + gb * 0.025;
}

void main() {
  vec2 rp = vec2(vWorld.x * uWaveRot.x + vWorld.z * uWaveRot.y, -vWorld.x * uWaveRot.y + vWorld.z * uWaveRot.x);
  vec2 g = rippleGrad(rp * uRippleFreq, uTime) * uRipple * uRippleFreq;
  g = vec2(g.x * uWaveRot.x - g.y * uWaveRot.y, g.x * uWaveRot.y + g.y * uWaveRot.x);
  vec3 n = normalize(vWaveNormal + vec3(-g.x, 0.0, -g.y));
  vec3 v = normalize(uEye - vWorld);
  float NoV = max(dot(n, v), 0.0);
  float fresnel = 0.02 + 0.98 * pow(1.0 - NoV, 5.0);
  // Reflection: the mirrored scene (distorted by the ripples) or the sky along the reflected ray.
  vec3 r = reflect(-v, n);
  vec3 sky = mix(uHorizon, uZenith, pow(clamp(r.y, 0.0, 1.0), 0.55));
  vec3 reflection = sky;
  if (uHasReflection > 0.5) {
    vec2 suv = gl_FragCoord.xy / uResolution + n.xz * 0.04;
    reflection = texture(uReflection, clamp(suv, 0.001, 0.999)).rgb;
  }
  // Sun: a tight highlight on the perturbed normal, plus glitter from the finest ripples.
  vec3 l = normalize(-uSunDir);
  vec3 h = normalize(l + v);
  float NoH = max(dot(n, h), 0.0);
  float spec = pow(NoH, 420.0) * 0.6 + pow(NoH, 60.0) * 0.05;
  float glitter = pow(max(dot(reflect(-l, n), v), 0.0), 900.0) * (0.5 + 0.5 * vnoise(vWorld.xz * 40.0 + uTime * 3.0));
  vec3 sun = uSunColor * uSunIntensity * (spec + glitter * 0.5) * uSparkle;
  // A tint of its own (r at or over 0): its colour and glow (a glowing liquid mirrors less); else the settings' colour.
  bool own = vTint.r >= 0.0;
  vec3 base = own ? vTint.rgb : uColor;
  float glow = own ? vTint.a * uGlow : 0.0;
  float glowing = min(glow, 1.0);
  vec3 color = mix(base * uLight, reflection, fresnel * (1.0 - glowing * 0.6)) + sun;
  // How much water lies between the surface and the ground behind it, along the line of sight
  // (needs the scene depth): it decides how see-through the water is and where the foam goes.
  float gap = 1e3;
  if (uHasDepth > 0.5) {
    float d = texelFetch(uSceneDepth, ivec2(gl_FragCoord.xy), 0).r;
    if (d < 0.99999) {
      vec4 sp = uInvViewProj * vec4(gl_FragCoord.xy / uResolution * 2.0 - 1.0, d * 2.0 - 1.0, 1.0);
      gap = length(sp.xyz / sp.w - vWorld);
    }
  }
  // Deeper water hides the bottom: clear at the waterline, the water's own colour further out.
  float clear = uClarity * (gap < 1e3 ? exp(-gap * uAbsorb) : 1.0);
  float alpha = mix(1.0 - clear, 0.97, fresnel);
  // A glowing liquid is thick: little of the bottom shows through.
  alpha = max(alpha, glowing * 0.9);
  // Foam and whitecaps: white on water, the liquid's own colour, lit, on a glowing one.
  vec3 froth = mix(vec3(0.9, 0.95, 1.0) * uLight, base * (1.0 + glow), glowing);
  // Foam where the water meets the shore: a band whose edge wanders and drifts with the water.
  if (uFoam > 0.5 && uFoamWidth > 0.0) {
    float n = vnoise(vWorld.xz * 2.6 + vec2(uTime * 0.31, -uTime * 0.23)) * 0.6 + vnoise(vWorld.xz * 7.3 - uTime * 0.37) * 0.4;
    // How close the shore is: the cell distance to land, or how close the ground behind the
    // surface is (the real waterline on a slope, the foot of a cliff face).
    float near = min(vShore, gap * 2.0);
    float edge = near + (n - 0.5) * uFoamWidth * 1.1;
    float foam = 1.0 - smoothstep(0.0, uFoamWidth, edge);
    foam *= 0.75 + 0.25 * vnoise(vWorld.xz * 13.0 + uTime * 0.5);
    color = mix(color, froth, foam * 0.85);
    alpha = max(alpha, foam * 0.92);
  }
  // Whitecaps: foam on the highest crests (and lingering just behind them), broken into drifting
  // patches by noise so they come and go rather than drawing lines along every wave.
  if (uWhitecaps > 0.0) {
    float k = uWaveFreq;
    float f0 = dot(D0, rp) * 1.7 * k + uTime * 1.3;
    float f1 = dot(D1, rp) * 2.9 * k + uTime * 1.9;
    float f2 = dot(D2, rp) * 4.3 * k + uTime * 2.6;
    // Foam runs along the main swell's crest lines (and lingers just behind them); where the shorter
    // waves add to the swell it breaks, elsewhere the line gaps, so crests come and go in dashes.
    float sum = sin(f0) * 0.5 + sin(f1) * 0.3 + sin(f2) * 0.2;
    // Streaky breakup: long along the crest, short across it, drifting.
    float across = dot(D0, rp) * k;
    float along = dot(vec2(-D0.y, D0.x), rp) * k;
    // The crest line wanders a little, so breaking crests curve rather than run ruler-straight.
    float line = sin(f0 + (vnoise(vec2(along * 0.5, across * 0.3 + uTime * 0.05)) - 0.5) * 1.6);
    float br = vnoise(vec2(along * 1.3 + uTime * 0.25, across * 7.0)) * 0.6 + vnoise(vec2(along * 3.1 - uTime * 0.4, across * 15.0)) * 0.4;
    float th = 0.975 - uWhitecaps * 0.13;
    float cap = smoothstep(th, th + 0.03, line + (br - 0.5) * 0.1);
    // Which stretches of crest are breaking: broad drifting noise (so they don't fall on a grid),
    // nudged by where the shorter waves pile onto the swell; more of them with more whitecaps.
    float gate = vnoise(vec2(along * 0.45 + uTime * 0.15, across * 0.9 - uTime * 0.05)) * 0.7 + (sum * 0.5 + 0.5) * 0.3;
    cap *= smoothstep(0.72 - uWhitecaps * 0.4, 0.92 - uWhitecaps * 0.4, gate);
    // Bubbly inside: the foam thins in places rather than lying as a solid sheet.
    cap *= 0.5 + 0.5 * smoothstep(0.3, 0.7, vnoise(vWorld.xz * 18.0 + uTime * 0.8));
    color = mix(color, froth, cap * 0.85);
    alpha = max(alpha, cap * 0.85);
  }
  // Its own light (by night too, past white for the bloom): brighter veins drifting slowly through it, so a
  // glowing liquid churns rather than lying as one flat sheet of light.
  if (glow > 0.0) {
    float n1 = vnoise(vWorld.xz * 0.45 + vec2(uTime * 0.12, -uTime * 0.08));
    float n2 = vnoise(vWorld.xz * 1.7 - vec2(uTime * 0.2, uTime * 0.15));
    float veins = n1 * 0.65 + n2 * 0.35;
    color += base * glow * (0.2 + 0.8 * veins * veins);
  }
  float dist = distance(vWorld, uEye);
  float fog = clamp((dist - uFogRange.x) / (uFogRange.y - uFogRange.x), 0.0, 1.0);
  color = mix(color, uFogColor, fog);
  if (uToneMap > 0.5) {
    color *= uExposure;
    color = clamp((color * (2.51 * color + 0.03)) / (color * (2.43 * color + 0.59) + 0.14), 0.0, 1.0);
    color = pow(color, vec3(1.0 / 2.2));
  }
  outColor = vec4(color, alpha);
}`;class Pa{constructor(e){f(this,"settings",{..._a});f(this,"level",0);f(this,"program");f(this,"vao",null);f(this,"vbo",null);f(this,"ibo",null);f(this,"count",0);f(this,"sideProgram");f(this,"sideVao",null);f(this,"sideVbo",null);f(this,"sideIbo",null);f(this,"sideCount",0);f(this,"tintVbo",null);f(this,"sideTintVbo",null);f(this,"fbo",null);f(this,"tex",null);f(this,"depth",null);f(this,"rw",0);f(this,"rh",0);f(this,"wet",new Set);this.gl=e,this.program=new O(e,Da,Ca),this.sideProgram=new O(e,Ma,Sa)}get hasSurface(){return this.count>0}nearWater(e,t){if(!this.wet.size)return!1;const i=Math.floor((e[0]-t)/ht),o=Math.floor((e[3]+t)/ht),r=Math.floor((e[2]-t)/ht),s=Math.floor((e[5]+t)/ht);for(let n=r;n<=s;n++)for(let u=i;u<=o;u++)if(this.wet.has(n*65536+u))return!0;return!1}setGeometry(e){const t=this.gl;this.dispose(!1),this.level=e.level,this.wet=new Set;for(let s=0;s+2<e.vertices.length;s+=6)this.wet.add(Math.floor(e.vertices[s+2]/ht)*65536+Math.floor(e.vertices[s]/ht));if(this.count=e.indices.length,!this.count)return;if(this.sideCount=e.sides.indices.length,this.sideCount){const s=t.createVertexArray(),n=t.createBuffer(),u=t.createBuffer();if(!s||!n||!u)throw new Error("water side allocation failed");this.sideVao=s,this.sideVbo=n,this.sideIbo=u,t.bindVertexArray(s),t.bindBuffer(t.ARRAY_BUFFER,n),t.bufferData(t.ARRAY_BUFFER,e.sides.vertices,t.STATIC_DRAW),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,3,t.FLOAT,!1,16,0),t.enableVertexAttribArray(1),t.vertexAttribPointer(1,1,t.FLOAT,!1,16,12),e.sides.tints&&(this.sideTintVbo=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,this.sideTintVbo),t.bufferData(t.ARRAY_BUFFER,e.sides.tints,t.STATIC_DRAW),t.enableVertexAttribArray(2),t.vertexAttribPointer(2,4,t.FLOAT,!1,16,0)),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,u),t.bufferData(t.ELEMENT_ARRAY_BUFFER,e.sides.indices,t.STATIC_DRAW),t.bindVertexArray(null)}const i=t.createVertexArray(),o=t.createBuffer(),r=t.createBuffer();if(!i||!o||!r)throw new Error("water allocation failed");this.vao=i,this.vbo=o,this.ibo=r,t.bindVertexArray(i),t.bindBuffer(t.ARRAY_BUFFER,o),t.bufferData(t.ARRAY_BUFFER,e.vertices,t.STATIC_DRAW),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,3,t.FLOAT,!1,24,0),t.enableVertexAttribArray(1),t.vertexAttribPointer(1,2,t.FLOAT,!1,24,12),t.enableVertexAttribArray(2),t.vertexAttribPointer(2,1,t.FLOAT,!1,24,20),e.tints&&(this.tintVbo=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,this.tintVbo),t.bufferData(t.ARRAY_BUFFER,e.tints,t.STATIC_DRAW),t.enableVertexAttribArray(3),t.vertexAttribPointer(3,4,t.FLOAT,!1,16,0)),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,r),t.bufferData(t.ELEMENT_ARRAY_BUFFER,e.indices,t.STATIC_DRAW),t.bindVertexArray(null)}mirroredView(e,t){const i=this.level,o=[e[0],2*i-e[1],e[2]],r=[t[0],2*i-t[1],t[2]];return{view:Ht(o,r),eye:o}}beginReflection(e,t,i){const o=this.gl,r=Math.max(1,Math.floor(e*this.settings.reflectionScale)),s=Math.max(1,Math.floor(t*this.settings.reflectionScale));if(!this.fbo||r!==this.rw||s!==this.rh){this.fbo&&o.deleteFramebuffer(this.fbo),this.tex&&o.deleteTexture(this.tex),this.depth&&o.deleteRenderbuffer(this.depth);const n=o.createFramebuffer(),u=o.createTexture(),l=o.createRenderbuffer();if(!n||!u||!l)throw new Error("reflection target failed");o.bindTexture(o.TEXTURE_2D,u),o.texImage2D(o.TEXTURE_2D,0,o.RGBA8,r,s,0,o.RGBA,o.UNSIGNED_BYTE,null),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MIN_FILTER,o.LINEAR),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MAG_FILTER,o.LINEAR),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_S,o.CLAMP_TO_EDGE),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_T,o.CLAMP_TO_EDGE),o.bindRenderbuffer(o.RENDERBUFFER,l),o.renderbufferStorage(o.RENDERBUFFER,o.DEPTH_COMPONENT24,r,s),o.bindFramebuffer(o.FRAMEBUFFER,n),o.framebufferTexture2D(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,u,0),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.DEPTH_ATTACHMENT,o.RENDERBUFFER,l),o.bindFramebuffer(o.FRAMEBUFFER,null),o.bindTexture(o.TEXTURE_2D,null),this.fbo=n,this.tex=u,this.depth=l,this.rw=r,this.rh=s}o.bindFramebuffer(o.FRAMEBUFFER,this.fbo),o.viewport(0,0,r,s),o.clearColor(i[0],i[1],i[2],1),o.clear(o.COLOR_BUFFER_BIT|o.DEPTH_BUFFER_BIT),o.cullFace(o.FRONT)}endReflection(){this.gl.cullFace(this.gl.BACK)}draw(e){if(!this.vao)return;const t=this.gl,i=this.program;i.use(),i.setMat4("uProjection",e.projection),i.setMat4("uView",e.view),i.setFloat("uTime",e.time*this.settings.waveSpeed),i.setFloat("uWaveHeight",this.settings.waveHeight),i.setFloat("uWaveFreq",1/Math.max(.1,this.settings.waveSize)),i.setFloat("uRipple",this.settings.ripple);const o=this.settings.waveDirection*Math.PI/180;this.gl.uniform2f(i.uniform("uWaveRot"),Math.cos(o),Math.sin(o)),i.setFloat("uFoam",this.settings.foam?1:0),i.setFloat("uFoamWidth",this.settings.foamWidth),i.setFloat("uWhitecaps",Math.max(0,Math.min(1,this.settings.whitecaps))),i.setFloat("uHasDepth",e.depth&&e.invViewProj?1:0),i.setFloat("uAbsorb",this.settings.depthFade),e.depth&&e.invViewProj&&(this.gl.activeTexture(this.gl.TEXTURE10),this.gl.bindTexture(this.gl.TEXTURE_2D,e.depth),i.setMat4("uInvViewProj",e.invViewProj)),this.gl.uniform1i(i.uniform("uSceneDepth"),10),i.setFloat("uRippleFreq",1/Math.max(.1,this.settings.rippleSize)),i.setVec3("uEye",...e.eye),i.setVec3("uSunDir",...e.sunDir),i.setVec3("uSunColor",...e.sunColor),i.setFloat("uSunIntensity",e.sunIntensity),i.setVec3("uHorizon",...e.horizon),i.setVec3("uZenith",...e.zenith),i.setVec3("uColor",...this.settings.color),i.setFloat("uLight",e.light),i.setFloat("uGlow",Math.max(0,this.settings.glow)),i.setFloat("uClarity",this.settings.clarity),i.setFloat("uSparkle",this.settings.sparkle);const r=this.settings.reflections&&this.tex?1:0;if(this.tex&&(t.activeTexture(t.TEXTURE0+9),t.bindTexture(t.TEXTURE_2D,this.tex)),t.uniform1i(i.uniform("uReflection"),9),i.setFloat("uHasReflection",r),t.uniform2f(i.uniform("uResolution"),e.width,e.height),i.setVec3("uFogColor",...e.fogColor),t.uniform2f(i.uniform("uFogRange"),e.fogRange[0],e.fogRange[1]),i.setFloat("uExposure",e.exposure),i.setFloat("uToneMap",e.toneMap?1:0),t.enable(t.BLEND),t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ZERO,t.ONE),t.depthMask(!1),t.disable(t.CULL_FACE),this.settings.sides&&this.sideVao){const s=this.sideProgram;s.use(),s.setMat4("uProjection",e.projection),s.setMat4("uView",e.view),s.setFloat("uTime",e.time*this.settings.waveSpeed),s.setFloat("uWaveHeight",this.settings.waveHeight),s.setFloat("uWaveFreq",1/Math.max(.1,this.settings.waveSize));const n=this.settings.waveDirection*Math.PI/180;t.uniform2f(s.uniform("uWaveRot"),Math.cos(n),Math.sin(n)),s.setVec3("uColor",...this.settings.color),s.setFloat("uLight",e.light),s.setFloat("uGlow",Math.max(0,this.settings.glow)),s.setVec3("uHorizon",...e.horizon),s.setVec3("uEye",...e.eye),s.setVec3("uFogColor",...e.fogColor),t.uniform2f(s.uniform("uFogRange"),e.fogRange[0],e.fogRange[1]),s.setFloat("uExposure",e.exposure),s.setFloat("uToneMap",e.toneMap?1:0),t.bindVertexArray(this.sideVao),this.sideTintVbo||t.vertexAttrib4f(2,-1,0,0,0),t.drawElements(t.TRIANGLES,this.sideCount,t.UNSIGNED_INT,0),i.use()}t.bindVertexArray(this.vao),this.tintVbo||t.vertexAttrib4f(3,-1,0,0,0),t.drawElements(t.TRIANGLES,this.count,t.UNSIGNED_INT,0),t.bindVertexArray(null),t.enable(t.CULL_FACE),t.depthMask(!0),t.disable(t.BLEND)}dispose(e=!0){const t=this.gl;this.vao&&t.deleteVertexArray(this.vao),this.vbo&&t.deleteBuffer(this.vbo),this.ibo&&t.deleteBuffer(this.ibo),this.vao=this.vbo=this.ibo=null,this.count=0,this.sideVao&&t.deleteVertexArray(this.sideVao),this.sideVbo&&t.deleteBuffer(this.sideVbo),this.sideIbo&&t.deleteBuffer(this.sideIbo),this.sideVao=this.sideVbo=this.sideIbo=null,this.tintVbo&&t.deleteBuffer(this.tintVbo),this.sideTintVbo&&t.deleteBuffer(this.sideTintVbo),this.tintVbo=this.sideTintVbo=null,this.sideCount=0,e&&(this.fbo&&t.deleteFramebuffer(this.fbo),this.tex&&t.deleteTexture(this.tex),this.depth&&t.deleteRenderbuffer(this.depth),this.fbo=this.tex=this.depth=null,this.program.dispose(),this.sideProgram.dispose())}}const ot=32;class Ua{constructor(e,t,i){f(this,"handle");if(this.gl=e,this.size=t,i.length>ot)throw new Error(`a splat takes at most ${ot} layers (got ${i.length})`);const o=e.createTexture();if(!o)throw new Error("texture array allocation failed");this.handle=o,e.bindTexture(e.TEXTURE_2D_ARRAY,o),e.texImage3D(e.TEXTURE_2D_ARRAY,0,e.SRGB8_ALPHA8,t,t,Math.max(1,i.length),0,e.RGBA,e.UNSIGNED_BYTE,null);const r=document.createElement("canvas");r.width=r.height=t;const s=r.getContext("2d");i.forEach((u,l)=>{s.clearRect(0,0,t,t),u(s,t),e.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,l,t,t,1,e.RGBA,e.UNSIGNED_BYTE,r)}),e.generateMipmap(e.TEXTURE_2D_ARRAY),e.texParameteri(e.TEXTURE_2D_ARRAY,e.TEXTURE_MIN_FILTER,e.LINEAR_MIPMAP_LINEAR),e.texParameteri(e.TEXTURE_2D_ARRAY,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D_ARRAY,e.TEXTURE_WRAP_S,e.REPEAT),e.texParameteri(e.TEXTURE_2D_ARRAY,e.TEXTURE_WRAP_T,e.REPEAT);const n=e.getExtension("EXT_texture_filter_anisotropic");n&&e.texParameterf(e.TEXTURE_2D_ARRAY,n.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(8,e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT))),e.bindTexture(e.TEXTURE_2D_ARRAY,null)}setLayer(e,t){const i=this.gl,o=document.createElement("canvas");o.width=o.height=this.size,t(o.getContext("2d"),this.size),i.bindTexture(i.TEXTURE_2D_ARRAY,this.handle),i.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,e,this.size,this.size,1,i.RGBA,i.UNSIGNED_BYTE,o),i.generateMipmap(i.TEXTURE_2D_ARRAY),i.bindTexture(i.TEXTURE_2D_ARRAY,null)}bind(e){const t=this.gl;t.activeTexture(t.TEXTURE0+e),t.bindTexture(t.TEXTURE_2D_ARRAY,this.handle)}dispose(){this.gl.deleteTexture(this.handle)}}class ka{constructor(e,t,i){f(this,"texture");f(this,"data");this.gl=e,this.width=t,this.height=i;const o=e.createTexture();if(!o)throw new Error("splat map allocation failed");this.texture=o,this.data=new Uint8Array(t*i*2*4),e.bindTexture(e.TEXTURE_2D,o),e.texImage2D(e.TEXTURE_2D,0,e.RGBA8,t,i*2,0,e.RGBA,e.UNSIGNED_BYTE,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.bindTexture(e.TEXTURE_2D,null)}set(e,t,i,o,r){const s=(t*this.width+e)*4;this.data[s]=i,this.data[s+1]=o,this.data[s+2]=Math.max(0,Math.min(255,Math.round(r))),this.data[s+3]=255}setMix(e,t,i,o){const r=((this.height+t)*this.width+e)*4;this.data[r]=i,this.data[r+1]=Math.max(0,Math.min(255,Math.round(o*255))),this.data[r+3]=255}upload(){const e=this.gl;e.bindTexture(e.TEXTURE_2D,this.texture),e.pixelStorei(e.UNPACK_ALIGNMENT,1),e.texSubImage2D(e.TEXTURE_2D,0,0,0,this.width,this.height*2,e.RGBA,e.UNSIGNED_BYTE,this.data),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.bindTexture(e.TEXTURE_2D,null)}dispose(){this.gl.deleteTexture(this.texture)}}const K=16,Bi=3,Ut=4,za=Ut*2+1,_t=8,Qt=8,Ni=11,Ia={enabled:!0,clumps:!0,density:40,height:.2,width:.04,wind:!0,windStrength:.45,windDirection:30,gustSpeed:1.6,gustSize:.18,interaction:!0,recover:3,distance:55,rootColor:[.03,.07,.015],tipColor:[.3,.42,.08],colorMix:0},La=`
uniform float uTime;
uniform vec4 uWind;       // dir x, dir z, strength, gust speed
uniform float uGustSize;
uniform sampler2D uTrample;
uniform vec2 uMapSize;
uniform float uTrampleOn;
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
// How a clump at its base bends (x, y: its lean along x and z; z: how flat it is pressed), seed its own: the wind's gusts and its flutter, then the trample.
vec3 clumpBend(vec3 base, float seed, out float flatOut) {
  vec2 wdir = uWind.xy;
  vec2 side = vec2(-wdir.y, wdir.x);
  float gust = noise(base.xz * uGustSize - wdir * uTime * uWind.w);
  float sway = uWind.z * (0.2 + 0.9 * gust * gust);
  float flutter = sin(uTime * (4.0 + seed * 3.0) + seed * 6.283) * (0.03 + 0.08 * uWind.z);
  vec2 bend = wdir * (sway + flutter) * 0.6 + side * flutter * 0.5;
  flatOut = 0.0;
  if (uTrampleOn > 0.5) {
    vec4 tr = textureLod(uTrample, base.xz / uMapSize, 0.0);
    vec2 push = tr.gb * 2.0 - 1.0;
    float pl = length(push);
    push = pl > 0.05 ? push / pl : vec2(cos(seed * 6.283), sin(seed * 6.283));
    bend = mix(bend, push * 1.3, tr.r);
    bend += side * sin(uTime * 23.0 + seed * 40.0) * tr.a * 0.35;
    flatOut = tr.r;
  }
  return vec3(bend, flatOut);
}
`,Va=`#version 300 es
precision highp float;
layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec3 aNormal;
layout(location = 2) in vec3 aColor;
layout(location = 3) in vec2 aUv;
layout(location = 4) in vec4 aBase;   // x, y, z, turn
layout(location = 5) in vec4 aLook;   // size, tint r, g, b
uniform mat4 uProjection;
uniform mat4 uView;
uniform vec3 uFocus;
uniform float uFar;
uniform float uKeep;
uniform float uCount;
uniform float uTall;   // the kind's height (its own space), for how high a vertex stands
${La}
out vec3 vWorld;
out vec3 vNormal;
out vec3 vColor;
out vec2 vUv;
out float vT;
out float vFlat;
void main() {
  vec3 base = aBase.xyz;
  float seed = hash(base.xz * 3.17);
  float rank = float(gl_InstanceID) / max(uCount, 1.0);
  float keep = smoothstep(uKeep, uKeep - 0.08, rank);
  float dist = distance(base.xz, uFocus.xz);
  float size = aLook.x * keep * (1.0 - smoothstep(uFar * 0.75, uFar, dist));
  float c = cos(aBase.w);
  float s = sin(aBase.w);
  vec3 local = vec3(c * aPosition.x - s * aPosition.z, aPosition.y, s * aPosition.x + c * aPosition.z) * size;
  float t = clamp(aPosition.y / max(uTall, 1e-3), 0.0, 1.0);
  float flat_;
  vec3 b = clumpBend(base, seed, flat_);
  // Higher up, further over (a curve: the root stays put); pressed flat, lower too.
  float k = t * t;
  float h = local.y;
  local.xz += b.xy * h * k * 1.1;
  local.y = h * (1.0 - 0.6 * flat_ * k) - length(b.xy) * h * k * 0.25;
  vec3 p = base + local;
  vec3 n = vec3(c * aNormal.x - s * aNormal.z, aNormal.y, s * aNormal.x + c * aNormal.z);
  vNormal = normalize(vec3(0.0, 1.0, 0.0) * 0.55 + normalize(n + vec3(0.0, 1e-4, 0.0)) * 0.45);
  vWorld = p;
  vColor = aColor * aLook.yzw * (0.92 + 0.16 * seed);
  vUv = aUv;
  vT = t;
  vFlat = flat_;
  gl_Position = uProjection * uView * vec4(p, 1.0);
}`,Ba=`#version 300 es
precision highp float;
layout(location = 0) in vec2 aBlade;      // side (-1, 0, 1), t up the blade (0..1)
layout(location = 1) in vec4 aBase;       // x, y, z, turn
layout(location = 2) in vec4 aLook;       // height, r, g, b
uniform mat4 uProjection;
uniform mat4 uView;
uniform vec3 uEye;
uniform vec3 uFocus;   // the middle of the view: grass thins and ends with distance from it
uniform float uTime;
uniform float uHeight;
uniform float uWidth;
uniform vec4 uWind;       // dir x, dir z, strength, gust speed
uniform float uGustSize;
uniform sampler2D uTrample;
uniform vec2 uMapSize;
uniform float uTrampleOn;
uniform float uFar;
uniform float uKeep;      // the share of this chunk's blades drawn (the rest shrink away)
uniform float uCount;
out vec3 vWorld;
out vec3 vNormal;
out vec3 vColor;
out float vVary;
out float vT;
out float vFlat;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

void main() {
  vec3 base = aBase.xyz;
  float seed = hash(base.xz * 3.17);
  // Thinning with distance: blades past this chunk's share shrink to nothing; all fade near the far edge.
  float rank = float(gl_InstanceID) / max(uCount, 1.0);
  float keep = smoothstep(uKeep, uKeep - 0.08, rank);
  float dist = distance(base.xz, uFocus.xz);
  float size = keep * (1.0 - smoothstep(uFar * 0.75, uFar, dist));
  float H = uHeight * aLook.x * size;

  // Wind: gusts travel across the field along the wind; each blade adds a flutter of its own.
  vec2 wdir = uWind.xy;
  vec2 side = vec2(-wdir.y, wdir.x);
  float gust = noise(base.xz * uGustSize - wdir * uTime * uWind.w);
  float sway = uWind.z * (0.2 + 0.9 * gust * gust);
  float flutter = sin(uTime * (5.0 + seed * 3.0) + seed * 6.283) * (0.04 + 0.1 * uWind.z);
  // Each blade leans its own way at rest (upright blades seen from above are only edges), then the wind.
  float lean = 0.35 + 0.55 * hash(base.zx * 7.31);
  float la = seed * 6.283 * 3.0;
  vec2 bend = vec2(cos(la), sin(la)) * lean + wdir * (sway + flutter) + side * flutter * 0.6;
  vFlat = 0.0;

  // Pressed: lie over along the push, rustle while disturbed.
  if (uTrampleOn > 0.5) {
    vec4 tr = textureLod(uTrample, base.xz / uMapSize, 0.0);
    float flat_ = tr.r;
    vec2 push = tr.gb * 2.0 - 1.0;
    float pl = length(push);
    push = pl > 0.05 ? push / pl : vec2(cos(seed * 6.283), sin(seed * 6.283));
    bend = mix(bend, push * 1.45, flat_);
    bend += side * sin(uTime * 23.0 + seed * 40.0) * tr.a * 0.45;
    H *= 1.0 - 0.25 * flat_;
    vFlat = flat_;
  }
  float amount = min(length(bend), 1.5);
  vec2 bdir = amount > 1e-4 ? bend / length(bend) : vec2(1.0, 0.0);

  // The blade: a curve from the base up through a control point to its bent tip.
  vec3 tip = base + vec3(bdir.x * sin(amount), cos(amount), bdir.y * sin(amount)) * H;
  vec3 ctrl = base + vec3(0.0, H * mix(0.55, 0.2, amount / 1.5), 0.0);
  float t = aBlade.y;
  float u = 1.0 - t;
  vec3 p = u * u * base + 2.0 * u * t * ctrl + t * t * tip;
  vec3 dp = normalize(2.0 * u * (ctrl - base) + 2.0 * t * (tip - ctrl) + vec3(0.0, 1e-4, 0.0));
  float turn = aBase.w;
  vec3 across = vec3(cos(turn), 0.0, sin(turn));
  p += across * aBlade.x * uWidth * size * (1.0 - t * 0.92);
  // Lit mostly from above (a lawn reads as a soft surface), a little from its face.
  vec3 face = normalize(cross(across, dp));
  vNormal = normalize(vec3(0.0, 1.0, 0.0) * 0.65 + face * 0.35);
  vWorld = p;
  vVary = 0.92 + 0.16 * seed;
  vColor = aLook.yzw * vVary;
  vT = t;
  gl_Position = uProjection * uView * vec4(p, 1.0);
}`,Eo=`#version 300 es
precision highp float;
in vec3 vWorld;
in vec3 vNormal;
in vec3 vColor;
in float vVary;
in float vT;
in float vFlat;
uniform vec3 uRootColor;
uniform vec3 uTipColor;
uniform float uColorMix;
uniform vec3 uEye;
uniform vec3 uSunDir;
uniform vec3 uSunColor;
uniform float uSunIntensity;
uniform vec3 uSkyColor;
uniform vec3 uGroundColor;
uniform float uAmbient;
uniform vec3 uFogColor;
uniform vec2 uFogRange;
uniform float uExposure;
uniform float uToneMap;
uniform sampler2D uShadow0;
uniform sampler2D uShadow1;
uniform sampler2D uShadow2;
uniform mat4 uLightVP[3];
uniform int uCascades;
uniform float uShadowStrength;
out vec4 outColor;

const float PI = 3.14159265;

float shadowIn(sampler2D map, mat4 vp, out bool inside) {
  vec4 s = vp * vec4(vWorld, 1.0);
  vec3 q = s.xyz / s.w * 0.5 + 0.5;
  inside = q.x > 0.01 && q.x < 0.99 && q.y > 0.01 && q.y < 0.99 && q.z < 1.0;
  if (!inside) return 1.0;
  vec2 texel = 1.0 / vec2(textureSize(map, 0));
  float lit = 0.0;
  for (int y = 0; y < 2; y++) for (int x = 0; x < 2; x++) lit += q.z - 0.0015 <= texture(map, q.xy + (vec2(float(x), float(y)) - 0.5) * texel).r ? 1.0 : 0.0;
  return lit * 0.25;
}

void main() {
  vec3 n = normalize(vNormal);
  vec3 l = normalize(-uSunDir);
  bool inside = false;
  float lit = 1.0;
  if (uCascades > 0 && uShadowStrength > 0.0) {
    lit = shadowIn(uShadow0, uLightVP[0], inside);
    if (!inside && uCascades > 1) lit = shadowIn(uShadow1, uLightVP[1], inside);
    if (!inside && uCascades > 2) lit = shadowIn(uShadow2, uLightVP[2], inside);
    lit = mix(1.0, lit, uShadowStrength);
  }
  // Darker down among the blades, lighter at the tips (or your own colours, root to tip); crushed grass darker still.
  vec3 ground = vColor * mix(0.4, 1.08, vT);
  vec3 own = mix(uRootColor, uTipColor, vT) * vVary;
  vec3 base = mix(ground, own, uColorMix) * (1.0 - 0.45 * vFlat);
  float NoL = max(dot(n, l), 0.0);
  vec3 sun = base / PI * uSunColor * uSunIntensity * NoL * lit;
  // Sun through the blades when looking towards it.
  vec3 v = normalize(uEye - vWorld);
  float through = pow(max(dot(-v, l), 0.0), 4.0) * vT * 0.35;
  sun += base * uSunColor * uSunIntensity * through * lit / PI;
  vec3 ambient = mix(uGroundColor, uSkyColor, n.y * 0.5 + 0.5) * uAmbient * base;
  vec3 color = sun + ambient;
  float fog = clamp((distance(vWorld, uEye) - uFogRange.x) / (uFogRange.y - uFogRange.x), 0.0, 1.0);
  color = mix(color, uFogColor, fog);
  if (uToneMap > 0.5) {
    color *= uExposure;
    color = clamp((color * (2.51 * color + 0.03)) / (color * (2.43 * color + 0.59) + 0.14), 0.0, 1.0);
    color = pow(color, vec3(1.0 / 2.2));
  }
  outColor = vec4(color, 1.0);
}`,kt=Eo.replace(`in float vVary;
`,`in vec2 vUv;
uniform sampler2D uAlbedo;
uniform float uHasTex;
uniform float uCutoff;
`).replace("vec3 ground = vColor * mix(0.4, 1.08, vT);",`vec4 tex = uHasTex > 0.5 ? texture(uAlbedo, vUv) : vec4(1.0);
  if (uCutoff > 0.0 && tex.a < uCutoff) discard;
  vec3 ground = vColor * tex.rgb * mix(0.55, 1.05, vT);`).replace("vec3 own = mix(uRootColor, uTipColor, vT) * vVary;","vec3 own = mix(uRootColor, uTipColor, vT);");if(!kt.includes("uCutoff")||!kt.includes("tex.rgb")||kt.includes("vVary"))throw new Error("grass: the clump shader could not be made from the blades’ one");function Ze(a,e,t){const i=Math.sin(a*127.1+e*311.7+t*74.7)*43758.5453;return i-Math.floor(i)}class Na{constructor(e){f(this,"settings",{...Ia});f(this,"program");f(this,"bladeBuffer");f(this,"chunks",new Map);f(this,"width",0);f(this,"height",0);f(this,"sample",null);f(this,"clumpProgram");f(this,"kinds",[]);f(this,"clumpSample",null);f(this,"clumpPer",0);f(this,"seed",0);f(this,"res",2);f(this,"firstFrame",!0);f(this,"stale",new Set);f(this,"trample");f(this,"tw",1);f(this,"th",1);f(this,"flat",new Float32Array(1));f(this,"pushX",new Float32Array(1));f(this,"pushZ",new Float32Array(1));f(this,"rustle",new Float32Array(1));f(this,"bytes",new Uint8Array(4));f(this,"active",new Set);f(this,"dirty",null);this.gl=e,this.program=new O(e,Ba,Eo),this.clumpProgram=new O(e,Va,kt);const t=[];for(let i=0;i<Ut;i++)t.push(-1,i/Ut,1,i/Ut);t.push(0,1),this.bladeBuffer=e.createBuffer(),e.bindBuffer(e.ARRAY_BUFFER,this.bladeBuffer),e.bufferData(e.ARRAY_BUFFER,new Float32Array(t),e.STATIC_DRAW),this.trample=e.createTexture(),this.resizeTrample(1,1)}get blades(){let e=0;for(const t of this.chunks.values())e+=t.count;return e}setField(e,t,i,o=0,r){this.clear(),this.width=e,this.height=t,this.sample=i,this.seed=o,this.clumpSample=(r==null?void 0:r.sample)??null,this.clumpPer=Math.max(0,Math.round((r==null?void 0:r.perCell)??0)),this.res=e*t<=256*256?2:1,this.resizeTrample(e*this.res,t*this.res),this.firstFrame=!0}rebuild(e,t,i,o,r=!1){if(!this.sample)return;const s=Math.max(0,Math.floor(e/K)),n=Math.max(0,Math.floor(t/K)),u=Math.min(Math.ceil(this.width/K),Math.ceil(i/K)),l=Math.min(Math.ceil(this.height/K),Math.ceil(o/K));for(let c=n;c<l;c++)for(let d=s;d<u;d++){const h=c*65536+d;this.chunks.has(h)&&(r?this.stale.add(h):(this.stale.delete(h),this.buildChunk(d,c)))}}setClumpKinds(e){const t=this.gl;for(const i of this.kinds)t.deleteBuffer(i.vbo),t.deleteBuffer(i.ibo);this.kinds=e.map(i=>{const o=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,o),t.bufferData(t.ARRAY_BUFFER,i.mesh.vertices,t.STATIC_DRAW);const r=t.createBuffer();t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,r),t.bufferData(t.ELEMENT_ARRAY_BUFFER,i.mesh.indices,t.STATIC_DRAW),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,null);let s=0;for(let n=1;n<i.mesh.vertices.length;n+=Ni)s=Math.max(s,i.mesh.vertices[n]);return{vbo:o,ibo:r,indices:i.mesh.indices.length,tall:s,kind:i}}),t.bindBuffer(t.ARRAY_BUFFER,null),this.regrow()}get clumpCount(){let e=0;for(const t of this.chunks.values())for(const i of t.clumps)e+=i.count;return e}regrow(){if(this.sample){this.stale.clear();for(const e of this.chunks.values())this.dropChunk(e);this.chunks.clear(),this.firstFrame=!0}}clear(){for(const e of this.chunks.values())this.dropChunk(e);this.chunks.clear(),this.stale.clear(),this.sample=null,this.clumpSample=null,this.active.clear()}dropChunk(e){e.vao&&this.gl.deleteVertexArray(e.vao),e.buffer&&this.gl.deleteBuffer(e.buffer);for(const t of e.clumps)this.gl.deleteVertexArray(t.vao),this.gl.deleteBuffer(t.buffer)}chunkDistance(e,t,i){const o=Math.min(this.width,e+K),r=Math.min(this.height,t+K);return Math.hypot(Math.max(e-i[0],0,i[0]-o),Math.max(t-i[2],0,i[2]-r))}stream(e){if(!this.sample)return;const t=this.settings.distance,i=Math.ceil(this.width/K),o=Math.ceil(this.height/K),r=Math.max(0,Math.floor((e[0]-t)/K)),s=Math.max(0,Math.floor((e[2]-t)/K)),n=Math.min(i-1,Math.floor((e[0]+t)/K)),u=Math.min(o-1,Math.floor((e[2]+t)/K)),l=[];for(let h=s;h<=u;h++)for(let m=r;m<=n;m++){if(this.chunks.has(h*65536+m))continue;const g=this.chunkDistance(m*K,h*K,e);g<=t&&l.push({cx:m,cz:h,d:g})}l.sort((h,m)=>h.d-m.d);const c=this.firstFrame;this.firstFrame=!1;const d=performance.now();if(this.stale.size){const h=[...this.stale].map(m=>({key:m,cx:m%65536,cz:Math.floor(m/65536)}));h.sort((m,g)=>this.chunkDistance(m.cx*K,m.cz*K,e)-this.chunkDistance(g.cx*K,g.cz*K,e));for(let m=0;m<h.length&&!(m>0&&performance.now()-d>=Bi);m++)this.stale.delete(h[m].key),this.chunks.has(h[m].key)&&this.buildChunk(h[m].cx,h[m].cz)}for(let h=0;h<l.length&&!((h>0||this.stale.size)&&!c&&performance.now()-d>=Bi);h++)this.buildChunk(l[h].cx,l[h].cz);for(const[h,m]of this.chunks)this.chunkDistance(m.x0,m.z0,e)>t*1.6&&(this.dropChunk(m),this.chunks.delete(h))}buildChunk(e,t){const i=t*65536+e,o=this.chunks.get(i);o&&(this.dropChunk(o),this.chunks.delete(i));const r=this.sample,s=Math.max(0,Math.round(this.settings.density)),n=e*K,u=t*K,l=Math.min(this.width,n+K),c=Math.min(this.height,u+K),d=new Float32Array(s*(l-n)*(c-u)*_t);let h=0,m=1/0,g=-1/0;for(let F=0;F<s;F++)for(let _=u;_<c;_++)for(let E=n;E<l;E++){const R=E+Ze(E,_,F*3+this.seed),M=_+Ze(E,_,F*3+1+this.seed),z=r(R,M);z&&(d[h++]=R,d[h++]=z.y,d[h++]=M,d[h++]=Ze(E,_,F*3+2+this.seed)*Math.PI,d[h++]=(z.height??1)*(.7+.6*Ze(_,E,F+9)),d[h++]=z.color[0],d[h++]=z.color[1],d[h++]=z.color[2],m=Math.min(m,z.y),g=Math.max(g,z.y))}const w=h/_t,x=this.growClumps(n,u,l,c);for(const F of x.ys)m=Math.min(m,F),g=Math.max(g,F);if(!w){this.chunks.set(i,{x0:n,z0:u,vao:null,buffer:null,count:0,minY:x.batches.length?m:0,maxY:x.batches.length?g:0,clumps:x.batches});return}const v=this.gl,p=v.createVertexArray(),b=v.createBuffer();v.bindVertexArray(p),v.bindBuffer(v.ARRAY_BUFFER,this.bladeBuffer),v.enableVertexAttribArray(0),v.vertexAttribPointer(0,2,v.FLOAT,!1,8,0),v.bindBuffer(v.ARRAY_BUFFER,b),v.bufferData(v.ARRAY_BUFFER,d.subarray(0,h),v.STATIC_DRAW),v.enableVertexAttribArray(1),v.vertexAttribPointer(1,4,v.FLOAT,!1,_t*4,0),v.vertexAttribDivisor(1,1),v.enableVertexAttribArray(2),v.vertexAttribPointer(2,4,v.FLOAT,!1,_t*4,16),v.vertexAttribDivisor(2,1),v.bindVertexArray(null),this.chunks.set(i,{x0:n,z0:u,vao:p,buffer:b,count:w,minY:m,maxY:g,clumps:x.batches})}growClumps(e,t,i,o){const r=this.clumpSample;if(!r||!this.kinds.length||!this.clumpPer)return{batches:[],ys:[]};const s=this.kinds.map(()=>[]),n=[];for(let c=0;c<this.clumpPer;c++)for(let d=t;d<o;d++)for(let h=e;h<i;h++){const m=h+Ze(h,d,c*5+101+this.seed),g=d+Ze(h,d,c*5+102+this.seed),w=r(m,g);if(!w||!this.kinds[w.kind])continue;const x=w.tint??[1,1,1],v=this.kinds[w.kind].kind.color;s[w.kind].push(m,w.y,g,Ze(h,d,c*5+103+this.seed)*Math.PI*2,(w.size??1)*(.8+.4*Ze(d,h,c+77)),x[0]*v[0],x[1]*v[1],x[2]*v[2]),n.push(w.y+this.kinds[w.kind].tall*(w.size??1)*1.2),n.push(w.y)}const u=this.gl,l=[];return s.forEach((c,d)=>{if(!c.length)return;const h=this.kinds[d],m=u.createVertexArray(),g=u.createBuffer();u.bindVertexArray(m),u.bindBuffer(u.ARRAY_BUFFER,h.vbo);const w=Ni*4;[[0,3,0],[1,3,3],[2,3,6],[3,2,9]].forEach(([x,v,p])=>{u.enableVertexAttribArray(x),u.vertexAttribPointer(x,v,u.FLOAT,!1,w,p*4)}),u.bindBuffer(u.ELEMENT_ARRAY_BUFFER,h.ibo),u.bindBuffer(u.ARRAY_BUFFER,g),u.bufferData(u.ARRAY_BUFFER,new Float32Array(c),u.STATIC_DRAW),u.enableVertexAttribArray(4),u.vertexAttribPointer(4,4,u.FLOAT,!1,Qt*4,0),u.vertexAttribDivisor(4,1),u.enableVertexAttribArray(5),u.vertexAttribPointer(5,4,u.FLOAT,!1,Qt*4,16),u.vertexAttribDivisor(5,1),u.bindVertexArray(null),l.push({kind:d,vao:m,buffer:g,count:c.length/Qt})}),{batches:l,ys:n}}resizeTrample(e,t){this.tw=Math.max(1,e),this.th=Math.max(1,t);const i=this.tw*this.th;this.flat=new Float32Array(i),this.pushX=new Float32Array(i),this.pushZ=new Float32Array(i),this.rustle=new Float32Array(i),this.bytes=new Uint8Array(i*4);for(let r=0;r<i;r++)this.bytes[r*4+1]=128,this.bytes[r*4+2]=128;const o=this.gl;o.activeTexture(o.TEXTURE13),o.bindTexture(o.TEXTURE_2D,this.trample),o.pixelStorei(o.UNPACK_ALIGNMENT,1),o.texImage2D(o.TEXTURE_2D,0,o.RGBA8,this.tw,this.th,0,o.RGBA,o.UNSIGNED_BYTE,this.bytes),o.pixelStorei(o.UNPACK_ALIGNMENT,4),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MIN_FILTER,o.LINEAR),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MAG_FILTER,o.LINEAR),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_S,o.CLAMP_TO_EDGE),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_T,o.CLAMP_TO_EDGE),o.bindTexture(o.TEXTURE_2D,null),this.active.clear(),this.dirty=null}touch(e){const t=e%this.tw,i=Math.floor(e/this.tw),o=this.dirty;this.dirty=o?[Math.min(o[0],t),Math.min(o[1],i),Math.max(o[2],t),Math.max(o[3],i)]:[t,i,t,i]}press(e,t,i,o=1,r=0,s=0){if(!this.settings.interaction||!this.sample)return;const n=Math.max(.75,i*this.res),u=e*this.res,l=t*this.res,c=Math.hypot(r,s);for(let d=Math.max(0,Math.floor(l-n));d<=Math.min(this.th-1,Math.ceil(l+n));d++)for(let h=Math.max(0,Math.floor(u-n));h<=Math.min(this.tw-1,Math.ceil(u+n));h++){const m=h+.5-u,g=d+.5-l,w=Math.hypot(m,g);if(w>n)continue;const x=o*(1-w/n*(w/n)),v=d*this.tw+h;let p=w>.001?m/w:0,b=w>.001?g/w:0;c>1e-4&&(p=p*.4+r/c*.6,b=b*.4+s/c*.6),x>=this.flat[v]&&(this.pushX[v]=p,this.pushZ[v]=b),this.flat[v]=Math.max(this.flat[v],x),this.rustle[v]=Math.max(this.rustle[v],Math.min(1,x*1.5)),this.active.add(v),this.touch(v)}}update(e){if(this.active.size){const n=e/Math.max(.05,this.settings.recover),u=e/.8;for(const l of this.active)this.flat[l]=Math.max(0,this.flat[l]-n*(.4+(1-this.flat[l])*1.2)),this.rustle[l]=Math.max(0,this.rustle[l]-u),this.flat[l]<=0&&this.rustle[l]<=0&&this.active.delete(l),this.touch(l)}const t=this.dirty;if(!t)return;this.dirty=null;const i=t[2]-t[0]+1,o=t[3]-t[1]+1,r=new Uint8Array(i*o*4);for(let n=0;n<o;n++)for(let u=0;u<i;u++){const l=(t[1]+n)*this.tw+t[0]+u,c=(n*i+u)*4;r[c]=Math.round(this.flat[l]*255),r[c+1]=Math.round((this.pushX[l]*.5+.5)*255),r[c+2]=Math.round((this.pushZ[l]*.5+.5)*255),r[c+3]=Math.round(this.rustle[l]*255)}const s=this.gl;s.activeTexture(s.TEXTURE13),s.bindTexture(s.TEXTURE_2D,this.trample),s.pixelStorei(s.UNPACK_ALIGNMENT,1),s.texSubImage2D(s.TEXTURE_2D,0,t[0],t[1],i,o,s.RGBA,s.UNSIGNED_BYTE,r),s.pixelStorei(s.UNPACK_ALIGNMENT,4),s.bindTexture(s.TEXTURE_2D,null)}draw(e){const t=this.settings;if(!t.enabled||!this.sample)return 0;this.stream(e.focus);const i=this.gl,o=this.program;o.use(),o.setMat4("uProjection",e.projection),o.setMat4("uView",e.view),o.setVec3("uEye",...e.eye),o.setVec3("uFocus",...e.focus),o.setFloat("uTime",e.time),o.setFloat("uHeight",t.height),o.setFloat("uWidth",t.width);const r=t.windDirection*Math.PI/180;i.uniform4f(o.uniform("uWind"),Math.cos(r),Math.sin(r),t.wind?t.windStrength:0,t.gustSpeed),o.setFloat("uGustSize",t.gustSize),i.activeTexture(i.TEXTURE13),i.bindTexture(i.TEXTURE_2D,this.trample),i.uniform1i(o.uniform("uTrample"),13),i.uniform2f(o.uniform("uMapSize"),this.width,this.height),o.setFloat("uTrampleOn",t.interaction?1:0),o.setFloat("uFar",t.distance),o.setVec3("uRootColor",...t.rootColor),o.setVec3("uTipColor",...t.tipColor),o.setFloat("uColorMix",t.colorMix);const s=Math.hypot(...e.sunDir)||1;o.setVec3("uSunDir",e.sunDir[0]/s,e.sunDir[1]/s,e.sunDir[2]/s),o.setVec3("uSunColor",...e.sunColor),o.setFloat("uSunIntensity",e.sunIntensity),o.setVec3("uSkyColor",...e.skyColor),o.setVec3("uGroundColor",...e.groundColor),o.setFloat("uAmbient",e.ambient),o.setVec3("uFogColor",...e.fogColor),i.uniform2f(o.uniform("uFogRange"),e.fogRange[0],e.fogRange[1]),o.setFloat("uExposure",e.exposure),o.setFloat("uToneMap",e.toneMap?1:0),i.uniform1i(o.uniform("uShadow0"),1),i.uniform1i(o.uniform("uShadow1"),7),i.uniform1i(o.uniform("uShadow2"),8);const n=new Float32Array(48);e.lightViewProj.slice(0,3).forEach((d,h)=>n.set(d,h*16)),i.uniformMatrix4fv(o.uniform("uLightVP"),!1,n),i.uniform1i(o.uniform("uCascades"),e.lightViewProj.length),o.setFloat("uShadowStrength",e.shadowStrength),i.disable(i.CULL_FACE);const u=de(e.projection,e.view);let l=0;const c=t.distance*.3;for(const d of this.chunks.values()){if(!d.vao)continue;const h=Math.min(this.width,d.x0+K),m=Math.min(this.height,d.z0+K),g=this.chunkDistance(d.x0,d.z0,e.focus);if(g>t.distance||Oi(u,d.x0,d.minY,d.z0,h,d.maxY+t.height*2,m))continue;const w=Math.max(.12,Math.min(1,1-(g-c)/(t.distance-c))),x=Math.min(d.count,Math.ceil(d.count*Math.min(1,w+.08)));o.setFloat("uKeep",w),o.setFloat("uCount",d.count),i.bindVertexArray(d.vao),i.drawArraysInstanced(i.TRIANGLE_STRIP,0,za,x),l++}return i.bindVertexArray(null),t.clumps&&this.kinds.length&&(l+=this.drawClumps(e,u)),i.enable(i.CULL_FACE),l}drawClumps(e,t){const i=this.settings,o=this.gl,r=this.clumpProgram;r.use(),r.setMat4("uProjection",e.projection),r.setMat4("uView",e.view),r.setVec3("uEye",...e.eye),r.setVec3("uFocus",...e.focus),r.setFloat("uTime",e.time);const s=i.windDirection*Math.PI/180;o.uniform4f(r.uniform("uWind"),Math.cos(s),Math.sin(s),i.wind?i.windStrength:0,i.gustSpeed),r.setFloat("uGustSize",i.gustSize),o.uniform1i(r.uniform("uTrample"),13),o.uniform2f(r.uniform("uMapSize"),this.width,this.height),r.setFloat("uTrampleOn",i.interaction?1:0),r.setFloat("uFar",i.distance),r.setVec3("uRootColor",...i.rootColor),r.setVec3("uTipColor",...i.tipColor),r.setFloat("uColorMix",0);const n=Math.hypot(...e.sunDir)||1;r.setVec3("uSunDir",e.sunDir[0]/n,e.sunDir[1]/n,e.sunDir[2]/n),r.setVec3("uSunColor",...e.sunColor),r.setFloat("uSunIntensity",e.sunIntensity),r.setVec3("uSkyColor",...e.skyColor),r.setVec3("uGroundColor",...e.groundColor),r.setFloat("uAmbient",e.ambient),r.setVec3("uFogColor",...e.fogColor),o.uniform2f(r.uniform("uFogRange"),e.fogRange[0],e.fogRange[1]),r.setFloat("uExposure",e.exposure),r.setFloat("uToneMap",e.toneMap?1:0),o.uniform1i(r.uniform("uShadow0"),1),o.uniform1i(r.uniform("uShadow1"),7),o.uniform1i(r.uniform("uShadow2"),8);const u=new Float32Array(48);e.lightViewProj.slice(0,3).forEach((d,h)=>u.set(d,h*16)),o.uniformMatrix4fv(r.uniform("uLightVP"),!1,u),o.uniform1i(r.uniform("uCascades"),e.lightViewProj.length),r.setFloat("uShadowStrength",e.shadowStrength),o.uniform1i(r.uniform("uAlbedo"),14);let l=0;const c=i.distance*.3;for(let d=0;d<this.kinds.length;d++){const h=this.kinds[d];r.setFloat("uTall",h.tall),r.setFloat("uCutoff",h.kind.cutoff),r.setFloat("uHasTex",h.kind.albedo?1:0),h.kind.albedo&&h.kind.albedo.bind(14);for(const m of this.chunks.values()){const g=m.clumps.find(v=>v.kind===d);if(!g)continue;const w=this.chunkDistance(m.x0,m.z0,e.focus);if(w>i.distance||Oi(t,m.x0,m.minY,m.z0,Math.min(this.width,m.x0+K),m.maxY,Math.min(this.height,m.z0+K)))continue;const x=Math.max(.12,Math.min(1,1-(w-c)/(i.distance-c)));r.setFloat("uKeep",x),r.setFloat("uCount",g.count),o.bindVertexArray(g.vao),o.drawElementsInstanced(o.TRIANGLES,h.indices,o.UNSIGNED_INT,0,Math.min(g.count,Math.ceil(g.count*Math.min(1,x+.08)))),l++}}return o.bindVertexArray(null),l}dispose(){this.clear(),this.setClumpKinds([]),this.gl.deleteBuffer(this.bladeBuffer),this.gl.deleteTexture(this.trample)}}function Oi(a,e,t,i,o,r,s){const n=[0,0,0,0,0,0];for(let u=0;u<8;u++){const l=u&1?o:e,c=u&2?r:t,d=u&4?s:i,h=a[0]*l+a[4]*c+a[8]*d+a[12],m=a[1]*l+a[5]*c+a[9]*d+a[13],g=a[2]*l+a[6]*c+a[10]*d+a[14],w=a[3]*l+a[7]*c+a[11]*d+a[15];h<-w&&n[0]++,h>w&&n[1]++,m<-w&&n[2]++,m>w&&n[3]++,g<-w&&n[4]++,g>w&&n[5]++}return n.some(u=>u===8)}class Oa{constructor(e){f(this,"enabled",!1);f(this,"ms",new Map);f(this,"ext");f(this,"pool",[]);f(this,"pending",[]);f(this,"current",null);f(this,"frame",0);f(this,"gathered",new Map);this.gl=e,this.ext=e.getExtension("EXT_disjoint_timer_query_webgl2")}get supported(){return!!this.ext}get total(){let e=0;for(const t of this.ms.values())e+=t;return e}startFrame(){this.frame++,this.ext&&this.poll()}begin(e){if(!this.enabled||!this.ext)return;this.end();const t=this.gl,i=this.pool.pop()??t.createQuery();i&&(t.beginQuery(this.ext.TIME_ELAPSED_EXT,i),this.current={q:i,name:e,frame:this.frame})}end(){!this.current||!this.ext||(this.gl.endQuery(this.ext.TIME_ELAPSED_EXT),this.pending.push(this.current),this.current=null)}poll(){const e=this.gl,t=e.getParameter(this.ext.GPU_DISJOINT_EXT);for(;this.pending.length&&e.getQueryParameter(this.pending[0].q,e.QUERY_RESULT_AVAILABLE);){const o=this.pending.shift(),r=e.getQueryParameter(o.q,e.QUERY_RESULT);if(this.pool.push(o.q),t)continue;let s=this.gathered.get(o.frame);s||this.gathered.set(o.frame,s=new Map),s.set(o.name,(s.get(o.name)??0)+r/1e6)}const i=this.pending.length?this.pending[0].frame:this.current?this.current.frame:this.frame;for(const[o,r]of[...this.gathered].sort((s,n)=>s[0]-n[0])){if(o>=i)break;this.gathered.delete(o);for(const[s,n]of r)this.ms.set(s,this.ms.has(s)?this.ms.get(s)*.85+n*.15:n);for(const[s,n]of this.ms){if(r.has(s))continue;const u=n*.85;u<.005?this.ms.delete(s):this.ms.set(s,u)}}}reset(){this.end(),this.ms.clear(),this.gathered.clear()}}const $e=20,Mt={none:0,down:1,up:2,"ease-out":3,"ease-in":4,peak:5,"soft-down":6},Xa={square:0,disc:1,spark:2,smoke:3},$a=`#version 300 es
layout(location = 0) in vec3 aPos;
layout(location = 1) in vec3 aVel;
layout(location = 2) in vec4 aLife;   // life, maxLife, size, alpha
layout(location = 3) in vec3 aColor;
layout(location = 4) in vec3 aColorTo;
layout(location = 5) in vec4 aParams; // curves packed, gravity, drag, shape
uniform float uDt;
out vec3 vPos;
out vec3 vVel;
out vec4 vLife;
out vec3 vColor;
out vec3 vColorTo;
out vec4 vParams;
void main() {
  float life = aLife.x - uDt;
  vec3 vel = aVel;
  vec3 pos = aPos;
  if (life > 0.0) {
    vel.y -= aParams.y * uDt;
    vel *= max(0.0, 1.0 - aParams.z * uDt);
    pos += vel * uDt;
    if (pos.y < 0.0) {
      pos.y = 0.0;
      vel.y = -vel.y * 0.3;
    }
  }
  vPos = pos;
  vVel = vel;
  vLife = vec4(life, aLife.yzw);
  vColor = aColor;
  vColorTo = aColorTo;
  vParams = aParams;
}`,Ga=`#version 300 es
precision highp float;
void main() {}`,Xi=`#version 300 es
layout(location = 0) in vec3 aPos;
layout(location = 1) in vec3 aVel;
layout(location = 2) in vec4 aLife;
layout(location = 3) in vec3 aColor;
layout(location = 4) in vec3 aColorTo;
layout(location = 5) in vec4 aParams;
layout(location = 6) in vec2 aCorner; // per vertex: the quad corner (instanced draws need one non-instanced attribute)
uniform mat4 uProjection;
uniform mat4 uView;
uniform vec3 uRight;
uniform vec3 uUp;
out vec2 vQuad;
out vec4 vTint;
out float vShape; // (not flat: the quad's corners all carry it; a flat varying costs the fragment stage dearly under ANGLE/D3D11)
out float vViewZ;
float curve(float id, float t) {
  if (id < 0.5) return 1.0;
  if (id < 1.5) return 1.0 - t;
  if (id < 2.5) return t;
  if (id < 3.5) return 1.0 - t * t;
  if (id < 4.5) return (1.0 - t) * (1.0 - t);
  if (id < 5.5) return sin(t * 3.14159265);
  return 1.0 - 0.7 * t;
}
void main() {
  float life = aLife.x;
  float age = 1.0 - life / max(aLife.y, 1e-4);
  // Curve ids packed as fade + size * 8 + speed * 64 + color * 512.
  float packed = aParams.x;
  float fadeId = mod(packed, 8.0);
  float sizeId = mod(floor(packed / 8.0), 8.0);
  float colorId = mod(floor(packed / 512.0), 8.0);
  float size = life > 0.0 ? aLife.z * curve(sizeId, age) : 0.0;
  vec2 corner = aCorner;
  vQuad = corner;
  // The shape and the streak's length share a float: shape * 4096 + stretch.
  float shape = floor(aParams.w / 4096.0);
  float stretch = aParams.w - shape * 4096.0;
  vec3 world;
  float speed2 = dot(aVel, aVel);
  if (stretch > 0.0 && speed2 > 1e-6) {
    // A streak: along the velocity, as wide as the size, facing the camera as well as it can.
    vec3 along = aVel * inversesqrt(speed2);
    vec3 forward = -vec3(uView[0][2], uView[1][2], uView[2][2]);
    vec3 side = cross(along, forward);
    float s2 = dot(side, side);
    side = s2 > 1e-6 ? side * inversesqrt(s2) : uRight;
    world = aPos + side * corner.x * size * 0.5 + along * corner.y * size * 0.5 * stretch;
  } else world = aPos + (uRight * corner.x + uUp * corner.y) * size * 0.5;
  vec4 view = uView * vec4(world, 1.0);
  vViewZ = view.z;
  gl_Position = uProjection * view;
  float alpha = aLife.w * curve(fadeId, age);
  vec3 color = mix(aColor, aColorTo, colorId > 0.5 ? curve(colorId, age) : 0.0);
  vTint = vec4(color, alpha);
  vShape = shape;
}`,Wa=`#version 300 es
precision highp float;
in vec2 vQuad;
in vec4 vTint;
in float vShape;
in float vViewZ;
uniform sampler2D uDepth;
uniform float uHasDepth;
uniform vec2 uResolution;
uniform mat4 uInvProjection;
uniform float uSoftness;
uniform float uExposure;
uniform float uToneMap;
out vec4 outColor;
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
// Smooth value noise: the hash eased between whole points, so a puff's texture has no square cells
// (a cell's edge showed as a square block where thick smoke's depth stopped the mist: depthAlpha).
float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = p - i;
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
void main() {
  float r2 = dot(vQuad, vQuad);
  float a = vTint.a;
  if (vShape < 0.5) {
    // square
  } else if (vShape < 1.5) {
    if (r2 > 1.0) discard; // disc
    a *= smoothstep(1.0, 0.7, r2);
  } else if (vShape < 2.5) {
    // spark: a bright core with a soft falloff
    a *= pow(max(0.0, 1.0 - r2), 1.5) * 1.6;
  } else {
    // smoke: a soft puff with a little texture
    if (r2 > 1.0) discard;
    float n = vnoise(vQuad * 4.0) * 0.3 + 0.7;
    a *= smoothstep(1.0, 0.2, r2) * 0.8 * n;
  }
  if (uHasDepth > 0.5) {
    // Soft particles: fade where the quad meets the scene.
    vec2 uv = gl_FragCoord.xy / uResolution;
    float d = texture(uDepth, uv).r * 2.0 - 1.0;
    vec4 p = uInvProjection * vec4(uv * 2.0 - 1.0, d, 1.0);
    float sceneZ = p.z / p.w;
    a *= clamp((vViewZ - sceneZ) / uSoftness, 0.0, 1.0);
  }
  vec3 c = vTint.rgb;
  if (uToneMap > 0.5) {
    c *= uExposure;
    c = clamp((c * (2.51 * c + 0.03)) / (c * (2.43 * c + 0.59) + 0.14), 0.0, 1.0);
    c = pow(c, vec3(1.0 / 2.2));
  }
  outColor = vec4(c, clamp(a, 0.0, 1.0));
}`,Ha=`#version 300 es
precision highp float;
in vec2 vQuad;
in vec4 vTint;
in float vShape;
in float vViewZ;
uniform float uDepthAlpha;
out vec4 outColor;
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
// Smooth value noise: the hash eased between whole points, so a puff's texture has no square cells
// (a cell's edge showed as a square block where thick smoke's depth stopped the mist: depthAlpha).
float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = p - i;
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
void main() {
  if (vShape < 2.5) discard;
  float r2 = dot(vQuad, vQuad);
  if (r2 > 1.0) discard;
  float n = vnoise(vQuad * 4.0) * 0.3 + 0.7;
  float a = vTint.a * smoothstep(1.0, 0.2, r2) * 0.8 * n;
  if (a < uDepthAlpha) discard;
  outColor = vec4(0.0);
}`,ei=[[0,3,0],[1,3,3],[2,4,6],[3,3,10],[4,3,13],[5,4,16]];class ja{constructor(e,t=2e4){f(this,"settings",{enabled:!0,softness:.4,depthAlpha:.55});f(this,"capacity");f(this,"spawned",0);f(this,"buffers");f(this,"updateVaos");f(this,"drawVaos");f(this,"feedback");f(this,"updateProgram");f(this,"drawProgram");f(this,"depthProgram");f(this,"current",0);f(this,"cursor",0);f(this,"staging");f(this,"pending",0);f(this,"cornerBuffer");f(this,"spawnBuffer");f(this,"spawnVao");f(this,"clock",0);f(this,"frameLife",0);f(this,"frameCount",0);f(this,"spans",[]);f(this,"ranges",[]);f(this,"dirty",[]);this.gl=e,this.capacity=t,this.staging=new Float32Array(t*$e);const i=e.createBuffer(),o=e.createBuffer(),r=e.createTransformFeedback();if(!i||!o||!r)throw new Error("particle buffers failed");this.buffers=[i,o],this.feedback=r;const s=e.createBuffer(),n=e.createBuffer();if(!s||!n)throw new Error("particle corner buffer failed");this.cornerBuffer=s,this.spawnBuffer=n,e.bindBuffer(e.ARRAY_BUFFER,s),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW);for(const u of this.buffers)e.bindBuffer(e.ARRAY_BUFFER,u),e.bufferData(e.ARRAY_BUFFER,this.staging.byteLength,e.DYNAMIC_COPY);e.bindBuffer(e.ARRAY_BUFFER,null),this.updateProgram=new O(e,$a,Ga,["vPos","vVel","vLife","vColor","vColorTo","vParams"]),this.drawProgram=new O(e,Xi,Wa),this.depthProgram=new O(e,Xi,Ha),this.updateVaos=[this.layout(i,0),this.layout(o,0)],this.drawVaos=[this.layout(i,1),this.layout(o,1)],this.spawnVao=this.layout(n,0)}layout(e,t){const i=this.gl,o=i.createVertexArray();if(!o)throw new Error("particle vao failed");i.bindVertexArray(o),i.bindBuffer(i.ARRAY_BUFFER,e);const r=$e*4;for(const[s,n,u]of ei)i.enableVertexAttribArray(s),i.vertexAttribPointer(s,n,i.FLOAT,!1,r,u*4),i.vertexAttribDivisor(s,t);return t===1&&(i.bindBuffer(i.ARRAY_BUFFER,this.cornerBuffer),i.enableVertexAttribArray(6),i.vertexAttribPointer(6,2,i.FLOAT,!1,0,0),i.vertexAttribDivisor(6,0)),i.bindVertexArray(null),i.bindBuffer(i.ARRAY_BUFFER,null),o}emit(e,t,i,o){this.frameLife=Math.max(this.frameLife,o.life*1.2+.05),this.frameCount+=o.count;const r=Mt[o.fadeCurve??"none"]+Mt[o.sizeCurve??"soft-down"]*8+Mt[o.speedCurve??"none"]*64+Mt[o.colorCurve??(o.colorTo?"up":"none")]*512,s=Xa[o.shape??"square"]*4096+Math.min(4095,Math.max(0,o.stretch??0));for(let n=0;n<o.count;n++){const u=this.cursor;this.cursor=(this.cursor+1)%this.capacity;const l=u*$e,c=this.staging,d=Math.random()*Math.PI*2,h=(Math.random()-.5)*Math.PI,m=o.vary,g=o.speed*(m===void 0?.4+Math.random()*.8:1-m+Math.random()*2*m);let w,x,v;if(o.dir){const b=(o.cone??.3)*g;w=o.dir[0]*g+(Math.random()-.5)*2*b,x=o.dir[1]*g+(Math.random()-.5)*2*b,v=o.dir[2]*g+(Math.random()-.5)*2*b}else w=Math.cos(d)*Math.cos(h)*g,x=Math.sin(h)*g,v=Math.sin(d)*Math.cos(h)*g;x+=o.up??0;const p=o.life*(m===void 0?.6+Math.random()*.6:1-m+Math.random()*2*m);c[l]=e,c[l+1]=t,c[l+2]=i,c[l+3]=w,c[l+4]=x,c[l+5]=v,c[l+6]=p,c[l+7]=p,c[l+8]=o.size,c[l+9]=o.alpha??1,c[l+10]=o.color[0],c[l+11]=o.color[1],c[l+12]=o.color[2],c[l+13]=(o.colorTo??o.color)[0],c[l+14]=(o.colorTo??o.color)[1],c[l+15]=(o.colorTo??o.color)[2],c[l+16]=r,c[l+17]=o.gravity??0,c[l+18]=o.drag??0,c[l+19]=s,this.dirty.push(u)}this.pending+=o.count}update(e){const t=this.gl;this.buffers[this.current];const i=this.buffers[1-this.current],o=$e*4,r=[];if(this.dirty.length){const l=this.dirty;for(let c=0;c<l.length;){let d=c+1;for(;d<l.length&&l[d]===l[d-1]+1;)d++;r.push([l[c],d-c]),c=d}this.spawned=this.dirty.length,this.dirty.length=0}else this.spawned=0;this.pending=0;const s=Math.min(e,.1);for(this.clock+=s,this.frameCount&&(this.spans.push({end:this.cursor,dies:this.clock+this.frameLife,count:this.frameCount}),this.frameCount=0,this.frameLife=0);this.spans.length&&this.spans[0].dies<=this.clock;)this.spans.shift();let n=0;for(const l of this.spans)n+=l.count;if(n=Math.min(n,this.capacity),this.ranges.length=0,!n)return;const u=(this.cursor-n+this.capacity)%this.capacity;u+n<=this.capacity?this.ranges.push([u,n]):this.ranges.push([u,this.capacity-u],[0,n-(this.capacity-u)]),this.updateProgram.use(),this.updateProgram.setFloat("uDt",s),t.enable(t.RASTERIZER_DISCARD),t.bindVertexArray(this.updateVaos[this.current]),t.bindTransformFeedback(t.TRANSFORM_FEEDBACK,this.feedback);for(const[l,c]of this.ranges)t.bindBufferRange(t.TRANSFORM_FEEDBACK_BUFFER,0,i,l*o,c*o),t.beginTransformFeedback(t.POINTS),t.drawArrays(t.POINTS,l,c),t.endTransformFeedback();if(r.length){this.updateProgram.setFloat("uDt",0),t.bindVertexArray(this.spawnVao);for(const[l,c]of r)t.bindBuffer(t.ARRAY_BUFFER,this.spawnBuffer),t.bufferData(t.ARRAY_BUFFER,this.staging.subarray(l*$e,(l+c)*$e),t.STREAM_DRAW),t.bindBuffer(t.ARRAY_BUFFER,null),t.bindBufferRange(t.TRANSFORM_FEEDBACK_BUFFER,0,i,l*o,c*o),t.beginTransformFeedback(t.POINTS),t.drawArrays(t.POINTS,0,c),t.endTransformFeedback()}t.bindBufferBase(t.TRANSFORM_FEEDBACK_BUFFER,0,null),t.bindTransformFeedback(t.TRANSFORM_FEEDBACK,null),t.bindVertexArray(null),t.disable(t.RASTERIZER_DISCARD),this.current=1-this.current}get live(){let e=0;for(const t of this.ranges)e+=t[1];return e}draw(e){if(!this.settings.enabled||!this.ranges.length)return;const t=this.gl,i=this.drawProgram;i.use(),i.setMat4("uProjection",e.projection),i.setMat4("uView",e.view),i.setVec3("uRight",...e.right),i.setVec3("uUp",...e.up),e.depth&&(t.activeTexture(t.TEXTURE0+10),t.bindTexture(t.TEXTURE_2D,e.depth)),t.uniform1i(i.uniform("uDepth"),10),i.setFloat("uHasDepth",e.depth&&this.settings.softness>0?1:0),t.uniform2f(i.uniform("uResolution"),e.width,e.height),i.setMat4("uInvProjection",e.invProjection),i.setFloat("uSoftness",Math.max(.01,this.settings.softness)),i.setFloat("uExposure",e.exposure),i.setFloat("uToneMap",e.toneMap?1:0),t.enable(t.BLEND),t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ZERO,t.ONE),t.depthMask(!1),t.disable(t.CULL_FACE),t.bindVertexArray(this.drawVaos[this.current]),t.bindBuffer(t.ARRAY_BUFFER,this.buffers[this.current]);const o=$e*4;for(const[r,s]of this.ranges){for(const[n,u,l]of ei)t.vertexAttribPointer(n,u,t.FLOAT,!1,o,(r*$e+l)*4);t.drawArraysInstanced(t.TRIANGLE_STRIP,0,4,s)}if(t.disable(t.BLEND),this.settings.depthAlpha>0){const r=this.depthProgram;r.use(),r.setMat4("uProjection",e.projection),r.setMat4("uView",e.view),r.setVec3("uRight",...e.right),r.setVec3("uUp",...e.up),r.setFloat("uDepthAlpha",this.settings.depthAlpha),t.colorMask(!1,!1,!1,!1),t.depthMask(!0);for(const[s,n]of this.ranges){for(const[u,l,c]of ei)t.vertexAttribPointer(u,l,t.FLOAT,!1,o,(s*$e+c)*4);t.drawArraysInstanced(t.TRIANGLE_STRIP,0,4,n)}t.colorMask(!0,!0,!0,!0)}t.bindBuffer(t.ARRAY_BUFFER,null),t.bindVertexArray(null),t.enable(t.CULL_FACE),t.depthMask(!0)}}const st=11,Ya=`#version 300 es
precision highp float;
layout(location = 0) in vec2 aCorner;   // -1..1
layout(location = 1) in vec3 aPos;
layout(location = 2) in float aGlyph;
layout(location = 3) in vec3 aColor;
layout(location = 4) in float aSize;
layout(location = 5) in float aAlpha;
layout(location = 6) in vec2 aOffset;
uniform mat4 uViewProj;
uniform vec2 uViewport;
uniform vec2 uGrid;        // atlas columns, rows
out vec2 vUV;
out vec4 vColor;
void main() {
  vec4 clip = uViewProj * vec4(aPos, 1.0);
  if (clip.w <= 0.0) {
    // Behind the camera: off screen.
    gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
    vUV = vec2(0.0);
    vColor = vec4(0.0);
    return;
  }
  vec2 ndc = clip.xy / clip.w;
  vec2 px = (aCorner * aSize * 0.5 + aOffset) * 2.0 / uViewport;
  gl_Position = vec4(ndc + px, 0.0, 1.0);
  float col = mod(aGlyph, uGrid.x);
  float row = floor(aGlyph / uGrid.x);
  // The atlas's first row is its top: the quad's top corner reads the cell's top.
  vUV = vec2((col + aCorner.x * 0.5 + 0.5) / uGrid.x, (row + 0.5 - aCorner.y * 0.5) / uGrid.y);
  vColor = vec4(aColor, aAlpha);
}`,qa=`#version 300 es
precision highp float;
in vec2 vUV;
in vec4 vColor;
uniform sampler2D uAtlas;
out vec4 outColor;
void main() {
  vec4 t = texture(uAtlas, vUV);
  outColor = vec4(t.rgb * vColor.rgb, t.a * vColor.a);
}`;class Ka{constructor(e){f(this,"enabled",!0);f(this,"list",[]);f(this,"program");f(this,"vao");f(this,"cornerBuffer");f(this,"instanceBuffer");f(this,"data",new Float32Array(st*256));f(this,"atlas",null);f(this,"grid",[1,1]);this.gl=e,this.program=new O(e,Ya,qa);const t=e.createBuffer(),i=e.createBuffer(),o=e.createVertexArray();if(!t||!i||!o)throw new Error("icon buffers failed");this.cornerBuffer=t,this.instanceBuffer=i,this.vao=o,e.bindVertexArray(o),e.bindBuffer(e.ARRAY_BUFFER,t),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.bindBuffer(e.ARRAY_BUFFER,i);const r=st*4,s=[[1,3,0],[2,1,3],[3,3,4],[4,1,7],[5,1,8],[6,2,9]];for(const[n,u,l]of s)e.enableVertexAttribArray(n),e.vertexAttribPointer(n,u,e.FLOAT,!1,r,l*4),e.vertexAttribDivisor(n,1);e.bindVertexArray(null),e.bindBuffer(e.ARRAY_BUFFER,null)}setAtlas(e,t,i){const o=this.gl;this.atlas||(this.atlas=o.createTexture()),o.bindTexture(o.TEXTURE_2D,this.atlas),o.pixelStorei(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),o.texImage2D(o.TEXTURE_2D,0,o.RGBA8,o.RGBA,o.UNSIGNED_BYTE,e),o.generateMipmap(o.TEXTURE_2D),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MIN_FILTER,o.LINEAR_MIPMAP_LINEAR),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MAG_FILTER,o.LINEAR),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_S,o.CLAMP_TO_EDGE),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_T,o.CLAMP_TO_EDGE),o.bindTexture(o.TEXTURE_2D,null),this.grid=[Math.max(1,t),Math.max(1,i)]}get ready(){return!!this.atlas}clear(){this.list.length=0}add(e){this.list.push(e)}get count(){return this.list.length}pack(){const e=this.list.length;this.data.length<e*st&&(this.data=new Float32Array(Math.max(e,this.data.length/st*2)*st));const t=this.data;for(let i=0;i<e;i++){const o=this.list[i],r=i*st;t[r]=o.x,t[r+1]=o.y,t[r+2]=o.z,t[r+3]=o.glyph,t[r+4]=o.r,t[r+5]=o.g,t[r+6]=o.b,t[r+7]=o.size,t[r+8]=o.alpha,t[r+9]=o.dx??0,t[r+10]=o.dy??0}return e}draw(e,t,i){if(!this.enabled||!this.atlas||!this.list.length)return 0;const o=this.gl,r=this.pack();o.bindBuffer(o.ARRAY_BUFFER,this.instanceBuffer),o.bufferData(o.ARRAY_BUFFER,this.data.subarray(0,r*st),o.STREAM_DRAW),o.bindBuffer(o.ARRAY_BUFFER,null);const s=this.program;return s.use(),s.setMat4("uViewProj",e),o.uniform2f(s.uniform("uViewport"),t,i),o.uniform2f(s.uniform("uGrid"),this.grid[0],this.grid[1]),o.activeTexture(o.TEXTURE0),o.bindTexture(o.TEXTURE_2D,this.atlas),o.uniform1i(s.uniform("uAtlas"),0),o.enable(o.BLEND),o.blendFuncSeparate(o.SRC_ALPHA,o.ONE_MINUS_SRC_ALPHA,o.ZERO,o.ONE),o.disable(o.DEPTH_TEST),o.depthMask(!1),o.disable(o.CULL_FACE),o.bindVertexArray(this.vao),o.drawArraysInstanced(o.TRIANGLE_STRIP,0,4,r),o.bindVertexArray(null),o.enable(o.CULL_FACE),o.depthMask(!0),o.enable(o.DEPTH_TEST),o.disable(o.BLEND),1}dispose(){const e=this.gl;e.deleteBuffer(this.cornerBuffer),e.deleteBuffer(this.instanceBuffer),e.deleteVertexArray(this.vao),this.atlas&&e.deleteTexture(this.atlas),this.atlas=null}}function ft(a,e,t,i){return`${t} Generate${a}Noise(${e} coordinate, float frequency, int octaveCount, float persistence, float lacunarity) {
  ${t} total = ${t}(0.0);
  float amplitude = 1.0;
  float totalAmplitude = 0.0;
  for (int octaveIndex = 0; octaveIndex < 16; octaveIndex++) {
    if (octaveIndex >= octaveCount) break;
    total += ${i}(coordinate * frequency) * amplitude;
    totalAmplitude += amplitude;
    amplitude *= persistence;
    frequency *= lacunarity;
  }
  return total / totalAmplitude;
}`}function $i(a){return`vec2 Generate${a}CurlNoise(vec2 coordinate, float frequency, int octaveCount, float persistence, float lacunarity) {
  vec2 total = vec2(0.0);
  float amplitude = 1.0;
  float totalAmplitude = 0.0;
  for (int octaveIndex = 0; octaveIndex < 16; octaveIndex++) {
    if (octaveIndex >= octaveCount) break;
    total += Generate${a}Noise2D(coordinate * frequency).yz * amplitude;
    totalAmplitude += amplitude;
    amplitude *= persistence;
    frequency *= lacunarity;
  }
  return vec2(total.y, -total.x) / totalAmplitude;
}`}function Gi(a){return`vec3 Generate${a}CurlNoise(vec3 coordinate, float frequency, int octaveCount, float persistence, float lacunarity) {
  vec2 total0 = vec2(0.0), total1 = vec2(0.0), total2 = vec2(0.0);
  float amplitude = 1.0;
  float totalAmplitude = 0.0;
  vec2 p0 = coordinate.zy, p1 = coordinate.xz + 100.0, p2 = coordinate.yx + 200.0;
  for (int octaveIndex = 0; octaveIndex < 16; octaveIndex++) {
    if (octaveIndex >= octaveCount) break;
    total0 += Generate${a}Noise2D(p0 * frequency).yz * amplitude;
    total1 += Generate${a}Noise2D(p1 * frequency).yz * amplitude;
    total2 += Generate${a}Noise2D(p2 * frequency).yz * amplitude;
    totalAmplitude += amplitude;
    amplitude *= persistence;
    frequency *= lacunarity;
  }
  return vec3(total2.x - total1.y, total0.x - total2.y, total1.x - total0.y) / totalAmplitude;
}`}const ti=`
#define VFX_EPSILON 1e-5
#define VFX_FLT_MIN 1.175494351e-38
#define RAND Rand(seed)
#define RAND2 vec2(RAND, RAND)
#define RAND3 vec3(RAND, RAND, RAND)
#define RAND4 vec4(RAND, RAND, RAND, RAND)
#define VFX_SAMPLER(name) name

// --- HLSL intrinsics ---
float saturate(float x) { return clamp(x, 0.0, 1.0); }
vec2 saturate(vec2 x) { return clamp(x, 0.0, 1.0); }
vec3 saturate(vec3 x) { return clamp(x, 0.0, 1.0); }
vec4 saturate(vec4 x) { return clamp(x, 0.0, 1.0); }
float hlsl_fmod(float a, float b) { return a - b * trunc(a / b); }
vec2 hlsl_fmod(vec2 a, vec2 b) { return a - b * trunc(a / b); }
vec3 hlsl_fmod(vec3 a, vec3 b) { return a - b * trunc(a / b); }
float hlsl_atan2(float y, float x) { return atan(y, x); }
vec2 hlsl_atan2(vec2 y, vec2 x) { return atan(y, x); }
vec3 hlsl_atan2(vec3 y, vec3 x) { return atan(y, x); }
float hlsl_rcp(float x) { return 1.0 / x; }
vec3 hlsl_rcp(vec3 x) { return 1.0 / x; }
bool hlsl_any(vec2 v) { return any(notEqual(v, vec2(0.0))); }
bool hlsl_any(vec3 v) { return any(notEqual(v, vec3(0.0))); }
bool hlsl_any(vec4 v) { return any(notEqual(v, vec4(0.0))); }
bool hlsl_all(vec3 v) { return all(notEqual(v, vec3(0.0))); }
uint asuint(float x) { return floatBitsToUint(x); }
uvec2 asuint(vec2 x) { return floatBitsToUint(x); }
uvec3 asuint(vec3 x) { return floatBitsToUint(x); }
uvec4 asuint(vec4 x) { return floatBitsToUint(x); }
uint asuint(uint x) { return x; }
uint asuint(int x) { return uint(x); }
float asfloat(uint x) { return uintBitsToFloat(x); }
vec2 asfloat(uvec2 x) { return uintBitsToFloat(x); }
vec3 asfloat(uvec3 x) { return uintBitsToFloat(x); }
vec4 asfloat(uvec4 x) { return uintBitsToFloat(x); }
float asfloat(int x) { return intBitsToFloat(x); }
float asfloat(float x) { return x; }
int asint(float x) { return floatBitsToInt(x); }
void sincos(float x, out float s, out float c) { s = sin(x); c = cos(x); }

// --- Random (VFXCommon.hlsl) ---
uint WangHash(uint seed) {
  seed = (seed ^ 61u) ^ (seed >> 16u);
  seed += (seed << 3u);
  seed = seed ^ (seed >> 4u);
  seed *= 0x27d4eb2du;
  seed = seed ^ (seed >> 15u);
  return seed;
}
uint AnotherHash(uint seed) {
  seed = ((seed >> 16u) ^ seed) * 0x45d9f3bu;
  seed = ((seed >> 16u) ^ seed) * 0x45d9f3bu;
  seed = (seed >> 16u) ^ seed;
  return seed;
}
uint Lcg(uint seed) { return 0x0019660du * seed + 0x3c6ef35fu; }
float ToFloat01(uint u) { return uintBitsToFloat((u >> 9u) | 0x3f800000u) - 1.0; }
float Rand(inout uint seed) { seed = Lcg(seed); return ToFloat01(seed); }
float FixedRand(uint seed) { return ToFloat01(AnotherHash(seed)); }

// --- Colour ---
vec3 HUEtoRGB(float H) {
  float R = abs(H * 6.0 - 3.0) - 1.0;
  float G = 2.0 - abs(H * 6.0 - 2.0);
  float B = 2.0 - abs(H * 6.0 - 4.0);
  return saturate(vec3(R, G, B));
}
vec3 RGBtoHCV(vec3 RGB) {
  vec4 P = (RGB.g < RGB.b) ? vec4(RGB.bg, -1.0, 2.0 / 3.0) : vec4(RGB.gb, 0.0, -1.0 / 3.0);
  vec4 Q = (RGB.r < P.x) ? vec4(P.xyw, RGB.r) : vec4(RGB.r, P.yzx);
  float C = Q.x - min(Q.w, Q.y);
  float H = abs((Q.w - Q.y) / (6.0 * C + 1e-10) + Q.z);
  return vec3(H, C, Q.x);
}
vec3 RGBtoHSV(vec3 RGB) { vec3 HCV = RGBtoHCV(RGB); return vec3(HCV.x, HCV.y / (HCV.z + 1e-10), HCV.z); }
vec3 HSVtoRGB(vec3 HSV) { return ((HUEtoRGB(HSV.x) - 1.0) * HSV.y + 1.0) * HSV.z; }

// --- Baked curves and gradients (one 128-wide row each in bakedTexture) ---
uniform sampler2D bakedTexture;
float HalfTexelOffset(float f) { return (127.0 / 128.0) * f + 0.5 / 128.0; }
vec4 SampleGradient(float v, float u) { return textureLod(bakedTexture, vec2(HalfTexelOffset(saturate(u)), v), 0.0); }
float SampleCurve(vec4 curveData, float u) {
  float uNorm = u * curveData.x + curveData.y;
  // Unity packs (clamp mode << 2 | channel) as uint bits in w; we store it as a plain float.
  uint mode = uint(curveData.w + 0.5);
  switch (mode >> 2u) {
    case 1u: uNorm = HalfTexelOffset(fract(min(1.0 - 1e-10, uNorm))); break;
    case 2u: uNorm = HalfTexelOffset(fract(max(0.0, uNorm))); break;
    case 3u: uNorm = HalfTexelOffset(saturate(uNorm)); break;
  }
  return textureLod(bakedTexture, vec2(uNorm, curveData.z), 0.0)[mode & 3u];
}

// --- Textures ---
vec4 SampleTexture(sampler2D s, vec2 uv) { return texture(s, uv); }
vec4 SampleTexture(sampler2D s, vec2 uv, float level) { return textureLod(s, uv, level); }
vec4 SampleTexture(sampler3D s, vec3 uvw) { return texture(s, uvw); }
vec4 SampleTexture(sampler3D s, vec3 uvw, float level) { return textureLod(s, uvw, level); }

// --- Space (effects simulate in their own local space) ---
uniform mat3 vfxViewRot;      // rows of Unity's VFX-to-view rotation, so vfxViewRot[i] == HLSL viewRot[i]
uniform vec3 vfxViewPosition; // camera position in effect space
mat3 GetVFXToViewRotMatrix() { return vfxViewRot; }
vec3 GetViewVFXPosition() { return vfxViewPosition; }
vec3 VFXSafeNormalize(vec3 v) { float sqrLength = max(VFX_FLT_MIN, dot(v, v)); return v * inversesqrt(sqrLength); }

// --- Noise (VFXNoise.hlsl, after Brian Sharpe's GPU-Noise-Lib) ---
vec4 Interpolation_C2_InterpAndDeriv(vec2 x) {
  return x.xyxy * x.xyxy * (x.xyxy * (x.xyxy * (x.xyxy * vec2(6.0, 0.0).xxyy + vec2(-15.0, 30.0).xxyy) + vec2(10.0, -60.0).xxyy) + vec2(0.0, 30.0).xxyy);
}
vec4 NoiseHash2D(vec2 gridcell) {
  vec2 kOffset = vec2(26.0, 161.0);
  float kDomain = 71.0;
  float kLargeFloat = 1.0 / 951.135664;
  vec4 P = vec4(gridcell.xy, gridcell.xy + 1.0);
  P = P - floor(P * (1.0 / kDomain)) * kDomain;
  P += kOffset.xyxy;
  P *= P;
  return fract(P.xzxz * P.yyww * kLargeFloat);
}
void NoiseHash2D(vec2 gridcell, out vec4 hash_0, out vec4 hash_1) {
  vec2 kOffset = vec2(26.0, 161.0);
  float kDomain = 71.0;
  vec2 kLargeFloats = 1.0 / vec2(951.135664, 642.949883);
  vec4 P = vec4(gridcell.xy, gridcell.xy + 1.0);
  P = P - floor(P * (1.0 / kDomain)) * kDomain;
  P += kOffset.xyxy;
  P *= P;
  P = P.xzxz * P.yyww;
  hash_0 = fract(P * kLargeFloats.x);
  hash_1 = fract(P * kLargeFloats.y);
}
vec3 GenerateValueNoise2D(vec2 coordinate) {
  vec2 i = floor(coordinate);
  vec2 f = coordinate - i;
  vec4 hash = NoiseHash2D(i);
  vec4 blend = Interpolation_C2_InterpAndDeriv(f);
  vec4 res0 = mix(hash.xyxz, hash.zwyw, blend.yyxx);
  vec2 resDelta = res0.yw - res0.xz;
  float noise = res0.x + resDelta.x * blend.x;
  vec2 derivatives = resDelta * blend.zw;
  return vec3(noise, derivatives);
}
vec3 GeneratePerlinNoise2D(vec2 coordinate) {
  vec2 i = floor(coordinate);
  vec4 f_fmin1 = coordinate.xyxy - vec4(i, i + 1.0);
  vec4 hash_x, hash_y;
  NoiseHash2D(i, hash_x, hash_y);
  vec4 grad_x = hash_x - 0.49999;
  vec4 grad_y = hash_y - 0.49999;
  vec4 norm = inversesqrt(grad_x * grad_x + grad_y * grad_y);
  grad_x *= norm;
  grad_y *= norm;
  vec4 dotval = (grad_x * f_fmin1.xzxz + grad_y * f_fmin1.yyww);
  vec3 dotval0_grad0 = vec3(dotval.x, grad_x.x, grad_y.x);
  vec3 dotval1_grad1 = vec3(dotval.y, grad_x.y, grad_y.y);
  vec3 dotval2_grad2 = vec3(dotval.z, grad_x.z, grad_y.z);
  vec3 dotval3_grad3 = vec3(dotval.w, grad_x.w, grad_y.w);
  vec3 k0_gk0 = dotval1_grad1 - dotval0_grad0;
  vec3 k1_gk1 = dotval2_grad2 - dotval0_grad0;
  vec3 k2_gk2 = dotval3_grad3 - dotval2_grad2 - k0_gk0;
  vec4 blend = Interpolation_C2_InterpAndDeriv(f_fmin1.xy);
  vec3 results = dotval0_grad0 + blend.x * k0_gk0 + blend.y * (k1_gk1 + blend.x * k2_gk2);
  results.yz += blend.zw * (vec2(k0_gk0.x, k1_gk1.x) + blend.yx * k2_gk2.xx);
  return results * 1.4142135623730950488;
}
vec2 Interpolation_C2_InterpAndDeriv(float x) { return x * x * (x * (x * (x * vec2(6.0, 0.0) + vec2(-15.0, 30.0)) + vec2(10.0, -60.0)) + vec2(0.0, 30.0)); }
vec3 Interpolation_C2(vec3 x) { return x * x * x * (x * (x * 6.0 - 15.0) + 10.0); }
vec3 Interpolation_C2_Deriv(vec3 x) { return x * x * (x * (x * 30.0 - 60.0) + 30.0); }
vec2 NoiseHash1D(float gridcell) {
  vec2 kOffset = vec2(26.0, 161.0);
  float kDomain = 71.0;
  float kLargeFloat = 1.0 / 951.135664;
  vec2 P = vec2(gridcell, gridcell + 1.0);
  P = P - floor(P * (1.0 / kDomain)) * kDomain;
  vec3 P3 = vec3(P.x, 0.0, P.y);
  P3 += kOffset.xyx;
  P3 *= P3;
  return fract(P3.xz * P3.y * kLargeFloat);
}
void NoiseHash3D(vec3 gridcell, out vec4 lowz_hash, out vec4 highz_hash) {
  vec2 kOffset = vec2(50.0, 161.0);
  float kDomain = 69.0;
  float kLargeFloat = 635.298681;
  float kZinc = 48.500388;
  gridcell.xyz = gridcell.xyz - floor(gridcell.xyz * (1.0 / kDomain)) * kDomain;
  vec3 gridcell_inc1 = step(gridcell, vec3(kDomain) - 1.5) * (gridcell + 1.0);
  vec4 P = vec4(gridcell.xy, gridcell_inc1.xy) + kOffset.xyxy;
  P *= P;
  P = P.xzxz * P.yyww;
  highz_hash.xy = vec2(1.0 / (kLargeFloat + vec2(gridcell.z, gridcell_inc1.z) * kZinc));
  lowz_hash = fract(P * highz_hash.xxxx);
  highz_hash = fract(P * highz_hash.yyyy);
}
void NoiseHash3D(vec3 gridcell, out vec4 lowz_hash_0, out vec4 lowz_hash_1, out vec4 lowz_hash_2, out vec4 highz_hash_0, out vec4 highz_hash_1, out vec4 highz_hash_2) {
  vec2 kOffset = vec2(50.0, 161.0);
  float kDomain = 69.0;
  vec3 kLargeFloats = vec3(635.298681, 682.357502, 668.926525);
  vec3 kZinc = vec3(48.500388, 65.294118, 63.934599);
  gridcell.xyz = gridcell.xyz - floor(gridcell.xyz * (1.0 / kDomain)) * kDomain;
  vec3 gridcell_inc1 = step(gridcell, vec3(kDomain) - 1.5) * (gridcell + 1.0);
  vec4 P = vec4(gridcell.xy, gridcell_inc1.xy) + kOffset.xyxy;
  P *= P;
  P = P.xzxz * P.yyww;
  vec3 lowz_mod = vec3(1.0 / (kLargeFloats + gridcell.zzz * kZinc));
  vec3 highz_mod = vec3(1.0 / (kLargeFloats + gridcell_inc1.zzz * kZinc));
  lowz_hash_0 = fract(P * lowz_mod.xxxx);
  highz_hash_0 = fract(P * highz_mod.xxxx);
  lowz_hash_1 = fract(P * lowz_mod.yyyy);
  highz_hash_1 = fract(P * highz_mod.yyyy);
  lowz_hash_2 = fract(P * lowz_mod.zzzz);
  highz_hash_2 = fract(P * highz_mod.zzzz);
}
vec2 GenerateValueNoise1D(float coordinate) {
  float i = floor(coordinate);
  float f = coordinate - i;
  vec2 hash = NoiseHash1D(i);
  vec2 blend = Interpolation_C2_InterpAndDeriv(f);
  float resDelta = hash.y - hash.x;
  return vec2(hash.x + resDelta * blend.x, resDelta * blend.y);
}
vec2 GeneratePerlinNoise1D(float coordinate) {
  vec2 i = floor(vec2(coordinate, 0.0));
  vec4 f_fmin1 = vec2(coordinate, 0.0).xyxy - vec4(i, i + 1.0);
  vec4 hash_x, hash_y;
  NoiseHash2D(i, hash_x, hash_y);
  vec4 grad_x = hash_x - 0.49999;
  vec4 grad_y = hash_y - 0.49999;
  vec4 norm = inversesqrt(grad_x * grad_x + grad_y * grad_y);
  grad_x *= norm;
  grad_y *= norm;
  vec4 dotval = (grad_x * f_fmin1.xzxz + grad_y * f_fmin1.yyww);
  vec2 dotval0_grad0 = vec2(dotval.x, grad_x.x);
  vec2 dotval1_grad1 = vec2(dotval.y, grad_x.y);
  vec2 dotval2_grad2 = vec2(dotval.z, grad_x.z);
  vec2 dotval3_grad3 = vec2(dotval.w, grad_x.w);
  vec2 k0_gk0 = dotval1_grad1 - dotval0_grad0;
  vec2 k1_gk1 = dotval2_grad2 - dotval0_grad0;
  vec2 k2_gk2 = dotval3_grad3 - dotval2_grad2 - k0_gk0;
  vec4 blend = Interpolation_C2_InterpAndDeriv(f_fmin1.xy);
  vec2 results = dotval0_grad0 + blend.x * k0_gk0 + blend.y * (k1_gk1 + blend.x * k2_gk2);
  results.y += blend.z * (k0_gk0.x + blend.y * k2_gk2.x);
  return results * 2.0;
}
vec4 GenerateValueNoise3D(vec3 coordinate) {
  vec3 i = floor(coordinate);
  vec3 f = coordinate - i;
  vec4 hash_lowz, hash_highz;
  NoiseHash3D(i, hash_lowz, hash_highz);
  vec3 blend = Interpolation_C2(f);
  vec4 res0 = mix(hash_lowz, hash_highz, blend.z);
  vec4 res1 = mix(res0.xyxz, res0.zwyw, blend.yyxx);
  vec4 res3 = mix(vec4(hash_lowz.xy, hash_highz.xy), vec4(hash_lowz.zw, hash_highz.zw), blend.y);
  vec2 res4 = mix(res3.xz, res3.yw, blend.x);
  vec3 resDelta = vec3(res1.yw, res4.y) - vec3(res1.xz, res4.x);
  float noise = res1.x + resDelta.x * blend.x;
  vec3 derivatives = resDelta * Interpolation_C2_Deriv(f);
  return vec4(noise, derivatives);
}
vec4 GeneratePerlinNoise3D(vec3 coordinate) {
  vec3 i = floor(coordinate);
  vec3 f = coordinate - i;
  vec3 f_min1 = f - 1.0;
  vec4 hashx0, hashy0, hashz0, hashx1, hashy1, hashz1;
  NoiseHash3D(i, hashx0, hashy0, hashz0, hashx1, hashy1, hashz1);
  vec4 grad_x0 = hashx0 - 0.49999, grad_y0 = hashy0 - 0.49999, grad_z0 = hashz0 - 0.49999;
  vec4 grad_x1 = hashx1 - 0.49999, grad_y1 = hashy1 - 0.49999, grad_z1 = hashz1 - 0.49999;
  vec4 norm_0 = inversesqrt(grad_x0 * grad_x0 + grad_y0 * grad_y0 + grad_z0 * grad_z0);
  vec4 norm_1 = inversesqrt(grad_x1 * grad_x1 + grad_y1 * grad_y1 + grad_z1 * grad_z1);
  grad_x0 *= norm_0; grad_y0 *= norm_0; grad_z0 *= norm_0;
  grad_x1 *= norm_1; grad_y1 *= norm_1; grad_z1 *= norm_1;
  vec4 dotval_0 = vec2(f.x, f_min1.x).xyxy * grad_x0 + vec2(f.y, f_min1.y).xxyy * grad_y0 + f.zzzz * grad_z0;
  vec4 dotval_1 = vec2(f.x, f_min1.x).xyxy * grad_x1 + vec2(f.y, f_min1.y).xxyy * grad_y1 + f_min1.zzzz * grad_z1;
  vec4 d0 = vec4(dotval_0.x, grad_x0.x, grad_y0.x, grad_z0.x);
  vec4 d1 = vec4(dotval_0.y, grad_x0.y, grad_y0.y, grad_z0.y);
  vec4 d2 = vec4(dotval_0.z, grad_x0.z, grad_y0.z, grad_z0.z);
  vec4 d3 = vec4(dotval_0.w, grad_x0.w, grad_y0.w, grad_z0.w);
  vec4 d4 = vec4(dotval_1.x, grad_x1.x, grad_y1.x, grad_z1.x);
  vec4 d5 = vec4(dotval_1.y, grad_x1.y, grad_y1.y, grad_z1.y);
  vec4 d6 = vec4(dotval_1.z, grad_x1.z, grad_y1.z, grad_z1.z);
  vec4 d7 = vec4(dotval_1.w, grad_x1.w, grad_y1.w, grad_z1.w);
  vec4 k0 = d1 - d0, k1 = d2 - d0, k2 = d4 - d0;
  vec4 k3 = d3 - d2 - k0, k4 = d5 - d4 - k0, k5 = d6 - d4 - k1;
  vec4 k6 = (d7 - d6) - (d5 - d4) - k3;
  vec3 blend = Interpolation_C2(f);
  vec3 blendDeriv = Interpolation_C2_Deriv(f);
  float u = blend.x, v = blend.y, w = blend.z;
  vec4 result = d0 + u * (k0 + v * k3) + v * (k1 + w * k5) + w * (k2 + u * (k4 + v * k6));
  result.y += dot(vec4(k0.x, k3.x * v, vec2(k4.x, k6.x * v) * w), vec4(blendDeriv.xxxx));
  result.z += dot(vec4(k1.x, k3.x * u, vec2(k5.x, k6.x * u) * w), vec4(blendDeriv.yyyy));
  result.w += dot(vec4(k2.x, k4.x * u, vec2(k5.x, k6.x * u) * v), vec4(blendDeriv.zzzz));
  return result * 1.1547005383792515290;
}
${ft("Value","float","vec2","GenerateValueNoise1D")}
${ft("Value","vec2","vec3","GenerateValueNoise2D")}
${ft("Value","vec3","vec4","GenerateValueNoise3D")}
${ft("Perlin","float","vec2","GeneratePerlinNoise1D")}
${ft("Perlin","vec2","vec3","GeneratePerlinNoise2D")}
${ft("Perlin","vec3","vec4","GeneratePerlinNoise3D")}
${$i("Value")}
${$i("Perlin")}
${Gi("Value")}
${Gi("Perlin")}
`,at=128;function Ao(a,e,t,i){let o;i?(o=i,o.length=a.length,o.fill(void 0)):o=new Array(a.length);const r=l=>(o[l]===void 0&&(o[l]=u(l)),o[l]),s=l=>r(l.args[0]),n=l=>r(l.args[1]);function u(l){var d;const c=a[l];switch(c.op){case"Value":return(d=e.overrides)!=null&&d.has(l)?e.overrides.get(l):c.value;case"Combine2f":case"Combine3f":case"Combine4f":return c.args.map(r);case"ExtractComponent":return s(c)[c.component];case"DeltaTime":return e.deltaTime;case"TotalTime":return e.time;case"SystemSeed":return e.seed>>>0;case"FrameIndex":return e.frame;case"LocalToWorld":case"WorldToLocal":return Za;case"Sin":return le(s(c),Math.sin);case"Cos":return le(s(c),Math.cos);case"Tan":return le(s(c),Math.tan);case"ASin":return le(s(c),Math.asin);case"ACos":return le(s(c),Math.acos);case"ATan":return le(s(c),Math.atan);case"Abs":return le(s(c),Math.abs);case"Sign":return le(s(c),Math.sign);case"Saturate":return le(s(c),h=>Math.min(1,Math.max(0,h)));case"Ceil":return le(s(c),Math.ceil);case"Round":return le(s(c),Math.round);case"Frac":return le(s(c),h=>h-Math.floor(h));case"Floor":return le(s(c),Math.floor);case"Log2":return le(s(c),Math.log2);case"Mul":return _e(s(c),n(c),(h,m)=>h*m);case"Divide":return _e(s(c),n(c),(h,m)=>h/m);case"Add":return _e(s(c),n(c),(h,m)=>h+m);case"Subtract":return _e(s(c),n(c),(h,m)=>h-m);case"Min":return _e(s(c),n(c),Math.min);case"Max":return _e(s(c),n(c),Math.max);case"Pow":return _e(s(c),n(c),Math.pow);case"ATan2":return _e(s(c),n(c),Math.atan2);case"BitwiseLeftShift":return _e(s(c),n(c),(h,m)=>h<<m>>>0);case"BitwiseRightShift":return _e(s(c),n(c),(h,m)=>h>>>m);case"BitwiseOr":return _e(s(c),n(c),(h,m)=>(h|m)>>>0);case"BitwiseAnd":return _e(s(c),n(c),(h,m)=>(h&m)>>>0);case"BitwiseXor":return _e(s(c),n(c),(h,m)=>(h^m)>>>0);case"BitwiseComplement":return le(s(c),h=>~h>>>0);case"CastUintToFloat":case"CastIntToFloat":return s(c);case"CastFloatToUint":return le(s(c),h=>Math.max(0,Math.trunc(h))>>>0);case"CastIntToUint":return le(s(c),h=>h>>>0);case"CastFloatToInt":return le(s(c),Math.trunc);case"CastUintToInt":return le(s(c),h=>h|0);case"TransposeMatrix":return Ja(s(c));case"InverseMatrix":case"InverseTRSMatrix":return er(s(c));case"TRSToMatrix":return tr(r(c.args[0]),r(c.args[1]),r(c.args[2]));case"TransformPos":return Wi(s(c),n(c),1);case"TransformVec":case"TransformDir":{const h=Wi(s(c),n(c),0);return c.op==="TransformDir"?Qa(h):h}case"BakeCurve":return t("curve",s(c));case"BakeGradient":return t("gradient",s(c));case"RGBtoHSV":return ir(s(c));case"HSVtoRGB":return or(s(c));default:throw new Error(`expression op ${c.op} is not supported by the runtime`)}}for(let l=0;l<a.length;l++)r(l);return o}const le=(a,e)=>Array.isArray(a)?a.map(e):e(a),_e=(a,e,t)=>{if(Array.isArray(a)||Array.isArray(e)){const i=Array.isArray(a)?a.length:e.length;return Array.from({length:i},(o,r)=>t(Array.isArray(a)?a[r]:a,Array.isArray(e)?e[r]:e))}return t(a,e)},Za=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],Ja=a=>[0,4,8,12,1,5,9,13,2,6,10,14,3,7,11,15].map(e=>a[e]),Wi=(a,e,t)=>[0,1,2].map(i=>a[i*4]*e[0]+a[i*4+1]*e[1]+a[i*4+2]*e[2]+a[i*4+3]*t),Qa=a=>{const e=Math.hypot(...a)||1;return a.map(t=>t/e)};function er(a){const e=new Array(16);e[0]=a[5]*a[10]*a[15]-a[5]*a[11]*a[14]-a[9]*a[6]*a[15]+a[9]*a[7]*a[14]+a[13]*a[6]*a[11]-a[13]*a[7]*a[10],e[4]=-a[4]*a[10]*a[15]+a[4]*a[11]*a[14]+a[8]*a[6]*a[15]-a[8]*a[7]*a[14]-a[12]*a[6]*a[11]+a[12]*a[7]*a[10],e[8]=a[4]*a[9]*a[15]-a[4]*a[11]*a[13]-a[8]*a[5]*a[15]+a[8]*a[7]*a[13]+a[12]*a[5]*a[11]-a[12]*a[7]*a[9],e[12]=-a[4]*a[9]*a[14]+a[4]*a[10]*a[13]+a[8]*a[5]*a[14]-a[8]*a[6]*a[13]-a[12]*a[5]*a[10]+a[12]*a[6]*a[9],e[1]=-a[1]*a[10]*a[15]+a[1]*a[11]*a[14]+a[9]*a[2]*a[15]-a[9]*a[3]*a[14]-a[13]*a[2]*a[11]+a[13]*a[3]*a[10],e[5]=a[0]*a[10]*a[15]-a[0]*a[11]*a[14]-a[8]*a[2]*a[15]+a[8]*a[3]*a[14]+a[12]*a[2]*a[11]-a[12]*a[3]*a[10],e[9]=-a[0]*a[9]*a[15]+a[0]*a[11]*a[13]+a[8]*a[1]*a[15]-a[8]*a[3]*a[13]-a[12]*a[1]*a[11]+a[12]*a[3]*a[9],e[13]=a[0]*a[9]*a[14]-a[0]*a[10]*a[13]-a[8]*a[1]*a[14]+a[8]*a[2]*a[13]+a[12]*a[1]*a[10]-a[12]*a[2]*a[9],e[2]=a[1]*a[6]*a[15]-a[1]*a[7]*a[14]-a[5]*a[2]*a[15]+a[5]*a[3]*a[14]+a[13]*a[2]*a[7]-a[13]*a[3]*a[6],e[6]=-a[0]*a[6]*a[15]+a[0]*a[7]*a[14]+a[4]*a[2]*a[15]-a[4]*a[3]*a[14]-a[12]*a[2]*a[7]+a[12]*a[3]*a[6],e[10]=a[0]*a[5]*a[15]-a[0]*a[7]*a[13]-a[4]*a[1]*a[15]+a[4]*a[3]*a[13]+a[12]*a[1]*a[7]-a[12]*a[3]*a[5],e[14]=-a[0]*a[5]*a[14]+a[0]*a[6]*a[13]+a[4]*a[1]*a[14]-a[4]*a[2]*a[13]-a[12]*a[1]*a[6]+a[12]*a[2]*a[5],e[3]=-a[1]*a[6]*a[11]+a[1]*a[7]*a[10]+a[5]*a[2]*a[11]-a[5]*a[3]*a[10]-a[9]*a[2]*a[7]+a[9]*a[3]*a[6],e[7]=a[0]*a[6]*a[11]-a[0]*a[7]*a[10]-a[4]*a[2]*a[11]+a[4]*a[3]*a[10]+a[8]*a[2]*a[7]-a[8]*a[3]*a[6],e[11]=-a[0]*a[5]*a[11]+a[0]*a[7]*a[9]+a[4]*a[1]*a[11]-a[4]*a[3]*a[9]-a[8]*a[1]*a[7]+a[8]*a[3]*a[5],e[15]=a[0]*a[5]*a[10]-a[0]*a[6]*a[9]-a[4]*a[1]*a[10]+a[4]*a[2]*a[9]+a[8]*a[1]*a[6]-a[8]*a[2]*a[5];const t=a[0]*e[0]+a[1]*e[4]+a[2]*e[8]+a[3]*e[12];return e.map(i=>i/(t||1))}function tr(a,e,t){const[i,o,r]=e.map(m=>m*Math.PI/180),[s,n,u,l,c,d]=[Math.cos(i),Math.sin(i),Math.cos(o),Math.sin(o),Math.cos(r),Math.sin(r)],h=[u*c+n*l*d,c*n*l-u*d,s*l,s*d,s*c,-n,-c*l+u*n*d,u*c*n+l*d,s*u];return[h[0]*t[0],h[1]*t[1],h[2]*t[2],a[0],h[3]*t[0],h[4]*t[1],h[5]*t[2],a[1],h[6]*t[0],h[7]*t[1],h[8]*t[2],a[2],0,0,0,1]}function ir([a,e,t]){const i=Math.max(a,e,t),o=i-Math.min(a,e,t);let r=0;return o&&(r=i===a?(e-t)/o%6:i===e?(t-a)/o+2:(a-e)/o+4),[(r/6+1)%1,i?o/i:0,i]}function or([a,e,t]){const i=o=>{const r=(o+a*6)%6;return t-t*e*Math.max(0,Math.min(r,4-r,1))};return[i(5),i(3),i(1)]}function ar(a){const e=new Float32Array(at*4);for(let t=0;t<at;t++){const i=t/(at-1),o=Hi(a.colors,i,a.mode,s=>s.color),r=Hi(a.alphas,i,a.mode,s=>[s.alpha]);e.set([o[0],o[1],o[2],r[0]],t*4)}return e}function Hi(a,e,t,i){if(!a.length)return[1,1,1];const o=[...a].sort((r,s)=>r.time-s.time);if(e<=o[0].time)return i(o[0]);for(let r=1;r<o.length;r++)if(e<=o[r].time){if(t==="fixed")return i(o[r]);const s=o[r-1],n=o[r],u=(e-s.time)/Math.max(1e-6,n.time-s.time);return i(s).map((l,c)=>l+(i(n)[c]-l)*u)}return i(o[o.length-1])}function rr(a){var r;const e=[...a.keys].sort((s,n)=>s.time-n.time),t=((r=e[0])==null?void 0:r.time)??0,i=e.length>1?e[e.length-1].time:t+1,o=new Float32Array(at*4);for(let s=0;s<at;s++){const n=Ro(e,t+(i-t)*s/(at-1));o.set([n,n,n,n],s*4)}return{data:o,start:t,end:i}}function Ro(a,e){if(!a.length)return 0;if(e<=a[0].time)return a[0].value;if(e>=a[a.length-1].time)return a[a.length-1].value;let t=1;for(;a[t].time<e;)t++;const i=a[t-1],o=a[t],r=o.time-i.time;if(!Number.isFinite(i.outSlope)||!Number.isFinite(o.inSlope))return i.value;const s=(e-i.time)/r,n=s*s,u=n*s;return(2*u-3*n+1)*i.value+(u-2*n+s)*i.outSlope*r+(-2*u+3*n)*o.value+(u-n)*o.inSlope*r}const sr={4:["uv",2],5:["uvNext",2],6:["vec2(0.0)",2],7:["vec2(0.0)",2],8:["frameBlend",1],9:["attributes.frame",1],10:["attributes.position",3],11:["float(gl_VertexID)",1],12:["size.x",1],13:["size.xy",2],14:["size",3],15:["attributes.angle.z",1],16:["attributes.angle",3],17:["0.0",1],18:["vec3(0.0)",3],19:["attributes.velocity",3],20:["length(attributes.velocity)",1],21:["life01",1],22:["1.0 / attributes.lifetime",1],23:["stable.x",1],24:["stable.xy",2],25:["stable.xyz",3],26:["stable",4],27:["stable.x",1],28:["stable.xy",2],29:["stable.xyz",3],30:["stable",4],31:["attributes.custom1.x",1],32:["attributes.custom1.xy",2],33:["attributes.custom1.xyz",3],34:["attributes.custom1",4],35:["attributes.custom2.x",1],36:["attributes.custom2.xy",2],37:["attributes.custom2.xyz",3],38:["attributes.custom2",4],39:["0.0",1],40:["vec2(0.0)",2],41:["vec3(0.0)",3],42:["0.0",1],43:["vec2(0.0)",2],44:["vec3(0.0)",3],45:["0.0",1]},Fo=`
uniform float uFxExposure;
uniform float uFxToneMap;
uniform vec4 uFxTint;
vec3 fxTone(vec3 c) {
  c *= uFxTint.rgb;
  if (uFxToneMap > 0.5) {
    c *= uFxExposure;
    c = clamp((c * (2.51 * c + 0.03)) / (c * (2.43 * c + 0.59) + 0.14), 0.0, 1.0);
    c = pow(c, vec3(1.0 / 2.2));
  }
  return c;
}`;function nr(a,e){let t=Math.max(0,e-(a.delay||0))/a.time;if(t=a.loop?t-Math.floor(t):Math.min(t,1),a.type==="float")return vt(a.curve,t)*(a.intensity??1);const i=a.gradient;let o=1;for(;o<i.length-1&&i[o][0]<t;)o++;const r=i[o-1],s=i[o],n=s[0]>r[0]?Math.min(1,Math.max(0,(t-r[0])/(s[0]-r[0]))):0;return[1,2,3,4].map(u=>r[u]+(s[u]-r[u])*n)}function lr(a,e){const t=e*a.speed;if(t/a.timeLimit>1)return null;const i=vt(a.curve,t/a.timeLimit)*a.frames+a.offsetFrames+1.1;return Math.ceil(-i)/(a.frames+1)+1/(a.frames+1)}function ur(a){return a?new Float32Array([a[0],a[3],a[6],a[1],a[4],a[7],a[2],a[5],a[8]]):new Float32Array([1,0,0,0,1,0,0,0,1])}function vt(a,e,t=Math.random){if(!a)return 0;switch(a.mode){case"random":return a.min+(a.max-a.min)*t();case"curve":return a.scalar*zt(a.curve,e);case"curves":{const i=zt(a.min,e);return a.scalar*(i+(zt(a.max,e)-i)*t())}default:return a.value??0}}function cr(a,e){return a.curve?a.intensity*a.curve.intensity*zt(a.curve.curve,e/a.curve.time):a.intensity}const zt=(a,e)=>Ro((a==null?void 0:a.keys)??[],e);function wi(a){if(!a)return 0;let e=0;for(let t=0;t<=32;t++)e=Math.max(e,vt(a,t/32,()=>1));return e}const hr=3;function fr(a,e,t){const i=Number(e);if(!(i>0)||!Number.isFinite(i))return t;const o=Math.max(.001,a.duration),r=a.looping?Math.ceil(i/o)+1:1;let s=wi(a.rate)*i;for(const n of a.bursts){const u=n.cycles>0?n.cycles:1/0,l=Math.min(u,n.interval>0?Math.floor(i/n.interval)+1:1,1e3);s+=Math.max(0,wi(n.count))*l*r}return Math.min(t,Math.max(8,Math.ceil(s*hr)))}function dr(a,e){if(a.looping)return!1;if(e.done)return!0;const t=e.time-e.delay;if(t>=a.duration)return!0;if(wi(a.rate)>0)return!1;for(const i of a.bursts){const o=i.cycles>0?Math.min(i.cycles,1e3):1e3;if(t<Math.min(i.time+(o-1)*i.interval,a.duration))return!1}return!0}function ji(a){return{time:0,delay:vt(a.startDelay,0),acc:0,done:!1}}function mr(a,e,t,i){const o=Math.max(.001,a.duration),r=e.time-e.delay;e.time+=t*(a.simulationSpeed||1);const s=e.time-e.delay;if(s<0||e.done)return{count:0,emitterTime:0};if(!a.looping&&r>=o)return e.done=!0,{count:0,emitterTime:1};const n=a.looping?s%o/o:Math.min(1,s/o);let u=0;const l=a.looping?s:Math.min(s,o),c=Math.max(0,r);e.acc+=Math.max(0,vt(a.rate,n))*Math.max(0,l-c)*i,u+=Math.floor(e.acc),e.acc-=Math.floor(e.acc);for(const d of a.bursts){const h=d.cycles>0?d.cycles:1/0,m=Math.floor(c/o),g=a.looping?Math.floor(l/o):0;for(let w=m;w<=g;w++)for(let x=0;x<Math.min(h,1e3);x++){const v=w*o+d.time+x*d.interval;if(d.time+x*d.interval>o&&a.looping||v>l)break;v>=c&&(v>c||c===0&&r<=0)&&Math.random()<=d.probability&&(u+=Math.round(vt(d.count,n)*i))}}return{count:u,emitterTime:n}}function vr(a,e){const{header:t,lib:i,attributeDecl:o,uniformDecls:r,loadAttributes:s,zeroInit:n}=e,u=a.output,l=u.material,c=u.mode,d=c==="mesh"||c==="vat",h=u.flipbook,m=br(u.streams||[0,1,3,4]),g=!!u.interpolateFrames||(u.streams||[]).includes(5);return{vs:`${t}
${i}
${o}
${r}
uniform mat4 uViewProj;
uniform mat4 uModel;
uniform mat4 uSystemRotation; // row-major math matrix (GLSL m[i] = row i)
uniform vec2 uViewport;
uniform float uProjScale;      // tan(fov / 2)
${c==="beam"?`uniform vec3 uBeamStart;      // effect space, the end grown so far
uniform vec3 uBeamEnd;`:""}
${c==="vat"?`uniform float uVatTime;       // the frame's row offset (BFX_ManualAnimationUpdate)
uniform sampler2D uVatPosHi, uVatPosLo, uVatNormal;`:""}
${Array.from({length:a.slots},(w,x)=>`layout(location = ${x}) in uvec4 a_s${x};`).join(`
`)}
${d?`layout(location = ${a.slots}) in vec3 aMeshPos;
layout(location = ${a.slots+1}) in vec3 aMeshNormal;
layout(location = ${a.slots+2}) in vec2 aMeshUV;`:""}
out vec4 vColor;
out vec4 vTex0;
out vec4 vTex1;
out vec4 vTex2;
out vec4 vTex3;
out vec3 vNormal;
out vec3 vWorldPos;
out vec3 vViewDir;
out vec2 vUVNext;
out float vFrameBlend;

vec3 eulerZXY(vec3 a, vec3 v) {
  vec3 s = sin(a), c = cos(a);
  return vec3(
    dot(vec3(c.y * c.z + s.x * s.y * s.z, c.z * s.x * s.y - c.y * s.z, c.x * s.y), v),
    dot(vec3(c.x * s.z, c.x * c.z, -s.x), v),
    dot(vec3(-c.z * s.y + c.y * s.x * s.z, c.y * c.z * s.x + s.y * s.z, c.x * c.y), v));
}

void main() {
  Attributes attributes;
${n}
${s}
  if (!attributes.alive) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  {
${a.stages.output.section}
  }
  float life01 = clamp(attributes.age / max(attributes.lifetime, 1e-4), 0.0, 1.0);
  vec4 stable = vec4(FixedRand(attributes.particleId ^ 101u), FixedRand(attributes.particleId ^ 102u), FixedRand(attributes.particleId ^ 103u), FixedRand(attributes.particleId ^ 104u));
  vec3 size = attributes.size3;
  vec3 camRight = vfxViewRot[0];
  vec3 camUp = vfxViewRot[1];
  vec3 toCam = normalize(vfxViewPosition - attributes.position);
${d?"":`  // Keep billboards within Unity's max particle size (a fraction of the screen).
  float maxSize = ${ye(u.maxParticleSize??.5)} * 2.0 * length(vfxViewPosition - attributes.position) * uProjScale;
  size.xy = min(size.xy, vec2(maxSize));`}
  vec2 corner = vec2(float(gl_VertexID & 1), float((gl_VertexID & 2) >> 1));
  vec3 p;
  vec3 n = toCam;
  vec2 uv = corner;
${wr(c,u)}
  // Flipbook: frame 0 is the top-left tile, rows go down.
${h?`  float frames = ${ye(h.tilesX*h.tilesY)};
  float f0 = mod(floor(attributes.frame), frames);
  float f1 = mod(f0 + 1.0, frames);
  float frameBlend = fract(attributes.frame);
  vec2 tiles = vec2(${ye(h.tilesX)}, ${ye(h.tilesY)});
  vec2 uvNext = (uv + vec2(mod(f1, tiles.x), tiles.y - 1.0 - floor(f1 / tiles.x))) / tiles;
  uv = (uv + vec2(mod(f0, tiles.x), tiles.y - 1.0 - floor(f0 / tiles.x))) / tiles;`:`  vec2 uvNext = uv;
  float frameBlend = 0.0;`}
  vec3 color = attributes.color;
${u.applyColorSpace?"  color = pow(max(color, vec3(0.0)), vec3(2.2)); // Unity converts particle colours to linear":""}
  vColor = vec4(color, attributes.alpha);
${c==="beam"?`  vColor *= mix(vec4(${u.beam.colors[0].map(ye).join(", ")}), vec4(${u.beam.colors[1].map(ye).join(", ")}), corner.x); // the line's gradient`:""}
  float tex[16];
  for (int i = 0; i < 16; i++) tex[i] = 0.0;
${m.join(`
`)}
  vTex0 = vec4(tex[0], tex[1], tex[2], tex[3]);
  vTex1 = vec4(tex[4], tex[5], tex[6], tex[7]);
  vTex2 = vec4(tex[8], tex[9], tex[10], tex[11]);
  vTex3 = vec4(tex[12], tex[13], tex[14], tex[15]);
  vUVNext = uvNext;
  vFrameBlend = ${g?"frameBlend":"0.0"};
  vec4 world = uModel * vec4(p, 1.0);
  vWorldPos = world.xyz;
  vNormal = normalize(mat3(uModel) * n);
  vViewDir = normalize(mat3(uModel) * (vfxViewPosition - p));
  gl_Position = uViewProj * world;
}`,fs:_o(t,l)}}function _o(a,e){return`${a}
in vec4 vColor;
in vec4 vTex0;
in vec4 vTex1;
in vec4 vTex2;
in vec4 vTex3;
in vec3 vNormal;
in vec3 vWorldPos;
in vec3 vViewDir;
in vec2 vUVNext;
in float vFrameBlend;
uniform float uTime;
uniform float uDeltaTime;
uniform vec2 uViewport;
uniform vec3 uCameraPos;
uniform mat3 uRecolor;        // the instance's colour matrix (hue turns: blood colours)
uniform sampler2D uWhite;
${((e==null?void 0:e.uniforms)||[]).map(t=>`uniform ${t.type} ${t.name};`).join(`
`)}
${((e==null?void 0:e.textures)||[]).map(t=>`uniform sampler2D ${t.name};`).join(`
`)}
${Fo}
out vec4 fragColor;
${(e==null?void 0:e.code)||"vec4 shadeFragment() { return vColor; }"}
void main() {
  vec4 c = shadeFragment();
  c.rgb = uRecolor * c.rgb;
  fragColor = vec4(fxTone(max(c.rgb, vec3(0.0))), clamp(c.a * uFxTint.a, 0.0, 1.0));
}`}const tt=2048,pr=a=>2*(a.points+2);function gr(a,e){var g,w;const{header:t,lib:i,attributeDecl:o,uniformDecls:r,loadAttributes:s,zeroInit:n}=e,u=a.output,l=u.trail,c=l.points,d=(x,v)=>{const p=a.layout.find(_=>_.name===x&&!_.counter),b=Array.from({length:{float:1,vec3:3,uint:1,bool:1}[v]},(_,E)=>{const R=p.offset+E;return`historySlot(k, ${R>>2}).${"xyzw"[R&3]}`});if(v==="bool")return`(${b[0]} != 0u)`;if(v==="uint")return b[0];const F=b.map(_=>`uintBitsToFloat(${_})`);return F.length===1?F[0]:`${v}(${F.join(", ")})`},h={stretch:"cum / max(total, 1e-6)",tile:"cum",distribute:"float(p) / max(float(tailAt), 1.0)",repeat:"float(p)"}[l.textureMode]||"cum / max(total, 1e-6)",m=(((w=(g=l.material)==null?void 0:g.blend)==null?void 0:w.src)??"SRC_ALPHA")==="SRC_ALPHA";return{vs:`${t}
${i}
${o}
${r}
uniform mat4 uViewProj;
uniform mat4 uModel;
uniform vec2 uViewport;
uniform float uProjScale;      // tan(fov / 2)
uniform highp usampler2DArray uTrailHistory;
uniform int uTrailHead;
uniform int uTrailCount;
uniform float uTrailAge[${c}];
${Array.from({length:a.slots},(x,v)=>`layout(location = ${v}) in uvec4 a_s${v};`).join(`
`)}
out vec4 vColor;
out vec4 vTex0;
out vec4 vTex1;
out vec4 vTex2;
out vec4 vTex3;
out vec3 vNormal;
out vec3 vWorldPos;
out vec3 vViewDir;
out vec2 vUVNext;
out float vFrameBlend;

const int POINTS = ${c};

uvec4 historySlot(int k, int s) {
  int layer = (uTrailHead - k + POINTS) % POINTS;
  int texel = gl_InstanceID * ${a.slots} + s;
  return texelFetch(uTrailHistory, ivec3(texel % ${tt}, texel / ${tt}, layer), 0);
}
// Sample k was this particle (alive) when it was recorded.
bool sameParticle(int k, uint id) {
  return k < uTrailCount && ${d("alive","bool")} && ${d("particleId","uint")} == id;
}
vec3 samplePosition(int k) { return ${d("position","vec3")}; }

void trailValues(Attributes attributes, float trailU, out vec4 trailColor, out float trailWidth, out float trailLife, out bool trailOn) {
  trailColor = vec4(1.0);
  trailWidth = 0.0;
  trailLife = 0.0;
  trailOn = true;
${a.stages.trail.section}
}

void main() {
  Attributes attributes;
${n}
${s}
  vColor = vec4(0.0); vTex0 = vec4(0.0); vTex1 = vec4(0.0); vTex2 = vec4(0.0); vTex3 = vec4(0.0);
  vNormal = vec3(0.0); vWorldPos = vec3(0.0); vViewDir = vec3(0.0); vUVNext = vec2(0.0); vFrameBlend = 0.0;
  gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
  if (!attributes.alive) return;
  {
${a.stages.output.section}
  }
  vec4 trailColor;
  float trailWidth, trailLife;
  bool trailOn;
  trailValues(attributes, 0.0, trailColor, trailWidth, trailLife, trailOn);
  if (!trailOn) return;
  uint id = attributes.particleId;

  // Points: 0 = the particle, j = sample j - 1, while it is this particle and younger than the trail's
  // lifetime (true up to some count, then false: samples are newest first). Find that count.
  int lo = 1, hi = POINTS + 1;
  while (lo < hi) {
    int mid = (lo + hi) / 2;
    if (sameParticle(mid - 1, id) && uTrailAge[mid - 1] <= trailLife) lo = mid + 1; else hi = mid;
  }
  int tailAt = lo; // the trail's end: where the lifetime runs out between the last live sample and the next
  vec3 tail = tailAt == 1 ? attributes.position : samplePosition(tailAt - 2);
  if (tailAt <= POINTS && sameParticle(tailAt - 1, id)) {
    float a0 = tailAt == 1 ? 0.0 : uTrailAge[tailAt - 2];
    float a1 = uTrailAge[tailAt - 1];
    tail = mix(tail, samplePosition(tailAt - 1), clamp((trailLife - a0) / max(a1 - a0, 1e-6), 0.0, 1.0));
  }
  int p = min(gl_VertexID / 2, tailAt);

  // Distance along the trail to this point, and the whole length.
  float cum = 0.0, total = 0.0;
  vec3 prev = attributes.position, here = attributes.position, before = attributes.position, after = tail;
  for (int j = 1; j <= POINTS + 1; j++) {
    if (j > tailAt) break;
    vec3 q = j == tailAt ? tail : samplePosition(j - 1);
    total += distance(prev, q);
    if (j == p) { cum = total; here = q; before = prev; }
    if (j == p + 1) after = q;
    prev = q;
  }
  if (p == tailAt) after = tail;
  float u = ${h};
  trailValues(attributes, clamp(cum / max(total, 1e-6), 0.0, 1.0), trailColor, trailWidth, trailLife, trailOn);

  vec3 toCam = normalize(vfxViewPosition - here);
  vec3 dir = before - after;
  if (dot(dir, dir) < 1e-12) dir = attributes.position - tail;
  if (dot(dir, dir) < 1e-12) dir = vfxViewRot[1];
  vec3 side = cross(normalize(dir), toCam);
  side = dot(side, side) < 1e-12 ? vfxViewRot[0] : normalize(side);
  // Keep at least a pixel wide; a thinner trail covers that pixel partly, so it fades instead.
  float pixel = 2.0 * length(vfxViewPosition - here) * uProjScale / max(uViewport.y, 1.0);
  float coverage = clamp(trailWidth / pixel, 0.0, 1.0);
  float width = max(trailWidth, pixel);
  float across = float(gl_VertexID & 1);
  vec3 pos = here + side * (across - 0.5) * width;

  vec3 color = trailColor.rgb;
${u.applyColorSpace?"  color = pow(max(color, vec3(0.0)), vec3(2.2)); // Unity converts particle colours to linear":""}
  vColor = vec4(color${m?"":" * coverage"}, trailColor.a * coverage);
  vTex0 = vec4(u, across, 0.0, 0.0);
  vUVNext = vTex0.xy;
  vec4 world = uModel * vec4(pos, 1.0);
  vWorldPos = world.xyz;
  vNormal = normalize(mat3(uModel) * toCam);
  vViewDir = normalize(mat3(uModel) * (vfxViewPosition - pos));
  gl_Position = uViewProj * world;
}`,fs:_o(t,l.material)}}const xr=`  vec3 vz = length(attributes.velocity) > 1e-6 ? normalize(attributes.velocity) : (vec4(0.0, 0.0, 1.0, 0.0) * uSystemRotation).xyz;
  vec3 vx = cross(vec3(0.0, 1.0, 0.0), vz);
  vx = length(vx) > 1e-6 ? normalize(vx) : vec3(1.0, 0.0, 0.0);
  vec3 vy = cross(vz, vx);
  lp = vx * lp.x + vy * lp.y + vz * lp.z;
  ln = vx * ln.x + vy * ln.y + vz * ln.z;`;function wr(a,e){const t=`vec3(${(e.pivot||[0,0,0]).map(ye).join(", ")})`;switch(a){case"beam":{const[i,o]=e.beam.widths;return`  vec3 mid = mix(uBeamStart, uBeamEnd, corner.x);
  vec3 side = cross(uBeamEnd - uBeamStart, vfxViewPosition - mid);
  side = length(side) > 1e-6 ? normalize(side) : camRight;
  p = mid + side * (corner.y - 0.5) * mix(${ye(i)}, ${ye(o)}, corner.x);`}case"vat":{const i=e.vat;return`  vec2 vuv = vec2(aMeshUV.x, fract(uVatTime + aMeshUV.y));
  vec3 hi = texture(uVatPosHi, vuv).rgb;
  vec3 lo = texture(uVatPosLo, vuv).rgb;
  vec3 tp = (floor(hi * 255.0 + 0.5) * 256.0 + floor(lo * 255.0 + 0.5)) / 65535.0;
  tp = tp * ${ye(i.max-i.min)} + ${ye(i.min)};
  tp.x = -tp.x;
  vec3 lp = tp.xzy + vec3(${i.heightOffset.map(ye).join(", ")});
  vec3 ln = (texture(uVatNormal, vuv).rgb * 2.0 - 1.0).xzy;
  ln.x = -ln.x;
  lp = (vec4(lp, 0.0) * uSystemRotation).xyz;
  ln = (vec4(ln, 0.0) * uSystemRotation).xyz;
  p = attributes.position + lp;
  n = normalize(ln);
  uv = aMeshUV;`}case"mesh":return`  vec3 lp = eulerZXY(attributes.angle, aMeshPos * size + ${t} * size);
  vec3 ln = eulerZXY(attributes.angle, aMeshNormal);
${e.alignment==="velocity"?xr:e.alignment==="view"?`  lp = camRight * lp.x + camUp * lp.y + toCam * -lp.z;
  ln = camRight * ln.x + camUp * ln.y + toCam * -ln.z;`:e.alignment==="world"?"":`  lp = (vec4(lp, 0.0) * uSystemRotation).xyz;
  ln = (vec4(ln, 0.0) * uSystemRotation).xyz;`}
  p = attributes.position + lp;
  n = ln;
  uv = aMeshUV;`;case"stretched":return`  vec3 vel = attributes.velocity;
  float speed = length(vel);
  vec3 dir = speed > 1e-5 ? vel / speed : camUp;
  vec3 side = normalize(cross(dir, toCam) + 1e-6);
  // Width from the X size, length from the Y size (they differ only with 3D start size: FXVille's spurts).
  float len = size.y * ${ye(e.lengthScale??2)} + speed * ${ye(e.velocityScale??0)};
  // Stretched along the motion, the particle at the head: as in Unity, the texture's U is 0 at the
  // particle and grows back along the stretch (a negative length scale stretches it forward instead).
  p = attributes.position - dir * corner.x * len + side * (corner.y - 0.5) * size.x;`;case"horizontal":return`  vec2 q = (corner - 0.5 - ${t}.xy) * size.xy;
  float ca = cos(attributes.angle.z), sa = sin(attributes.angle.z);
  q = vec2(q.x * ca - q.y * sa, q.x * sa + q.y * ca);
  p = attributes.position + vec3(q.x, 0.0, q.y);
  n = vec3(0.0, 1.0, 0.0);`;case"vertical":return`  vec3 r = normalize(cross(vec3(0.0, 1.0, 0.0), toCam) + 1e-6);
  vec2 q = (corner - 0.5 - ${t}.xy) * size.xy;
  p = attributes.position + r * q.x + vec3(0.0, q.y, 0.0);`;default:if(e.alignment==="local"||e.alignment==="world"){const i=o=>e.alignment==="local"?`(vec4(${o}, 0.0) * uSystemRotation).xyz`:`vec3(${o})`;return`  vec2 q = (corner - 0.5 - ${t}.xy) * size.xy;
  vec3 ax = ${i("1.0, 0.0, 0.0")};
  vec3 ay = ${i("0.0, 1.0, 0.0")};
  vec3 az = ${i("0.0, 0.0, 1.0")};
  vec3 r = eulerZXY(attributes.angle, vec3(-q.x, q.y, 0.0));
  vec3 rn = eulerZXY(attributes.angle, vec3(0.0, 0.0, 1.0));
  p = attributes.position - ax * r.x + ay * r.y + az * r.z;
  n = normalize(-ax * rn.x + ay * rn.y + az * rn.z);`}return`  vec2 q = (corner - 0.5 - ${t}.xy) * size.xy;
  float ca = cos(-attributes.angle.z), sa = sin(-attributes.angle.z);
  q = vec2(q.x * ca - q.y * sa, q.x * sa + q.y * ca);
  p = attributes.position + camRight * q.x + camUp * q.y;`}}function br(a){const e=[];let t=0;for(const i of a){const o=sr[i];if(!o)continue;const[r,s]=o;for(let n=0;n<s&&t<16;n++,t++){const u=s===1?`(${r})`:`(${r}).${"xyzw"[n]}`;e.push(`  tex[${t}] = ${u};`)}}return e}const ye=a=>{const e=Number(a)||0;return Number.isInteger(e)?`${e}.0`:String(e)},it=2048,ii=14,Yi=15,Xt=2,oi=8,yr=2;function Tr(a){return a==="mat4"?4:a==="mat3"?3:/^(float|vec[234]|uint|int|bool)$/.test(a)?1:0}function qi(a,e=Xt){const t=[],i={};let o=0;for(const r of a){if(r.name in i)continue;const s=Tr(r.type);if(!s)throw new Error(`effect uniform ${r.name}: type ${r.type} can't go in an instance row`);t.push({name:r.name,type:r.type,texel:o}),i[r.name]=o,o+=s}return{fields:t,width:o+e,at:i}}function bi(a,e){const t=o=>`texelFetch(${e}, ivec2(${o}, inst), 0)`,i=a.texel;switch(a.type){case"float":return`uintBitsToFloat(${t(i)}.x)`;case"vec2":return`uintBitsToFloat(${t(i)}.xy)`;case"vec3":return`uintBitsToFloat(${t(i)}.xyz)`;case"vec4":return`uintBitsToFloat(${t(i)})`;case"uint":return`${t(i)}.x`;case"int":return`int(${t(i)}.x)`;case"bool":return`(${t(i)}.x != 0u)`;case"mat4":return`mat4(${[0,1,2,3].map(o=>`uintBitsToFloat(${t(i+o)})`).join(", ")})`;case"mat3":return`mat3(${[0,1,2].map(o=>`uintBitsToFloat(${t(i+o)}.xyz)`).join(", ")})`;default:throw new Error(`effect uniform ${a.name}: type ${a.type}`)}}function Er(a){const e=["uniform highp usampler2D uInstData;","uint uSpawnStart, uSpawnCount, uSpawnBase, uSystemSeed, uCursor;","float uEmitterTime;",...a.fields.map(i=>`${i.type} ${i.name};`)].join(`
`),t=a.fields.map(i=>`  ${i.name} = ${bi(i,"uInstData")};`).join(`
`);return{decls:e,loads:t}}const pt=12,Ki=13,ai={vsDecls:`uniform highp usampler2D uDrawRows;
uniform int uRowBase;
uniform uint uCapacity;
uniform int uDrawFixed;
out float vRow;`,vsLoads:`  int inst = uRowBase + gl_InstanceID / int(uCapacity);
  vRow = float(inst);
  {
    uvec4 f11 = texelFetch(uDrawRows, ivec2(uDrawFixed + 11, inst), 0);
    if (f11.x == 0u) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); vRow = -1.0; return; }
    vec4 r0 = uintBitsToFloat(texelFetch(uDrawRows, ivec2(uDrawFixed, inst), 0));
    vec4 r1 = uintBitsToFloat(texelFetch(uDrawRows, ivec2(uDrawFixed + 1, inst), 0));
    vec4 r2 = uintBitsToFloat(texelFetch(uDrawRows, ivec2(uDrawFixed + 2, inst), 0));
    uModel = mat4(vec4(r0.x, r1.x, r2.x, 0.0), vec4(r0.y, r1.y, r2.y, 0.0), vec4(r0.z, r1.z, r2.z, 0.0), vec4(r0.w, r1.w, r2.w, 1.0));
    vfxViewRot = mat3(uintBitsToFloat(texelFetch(uDrawRows, ivec2(uDrawFixed + 7, inst), 0).xyz), uintBitsToFloat(texelFetch(uDrawRows, ivec2(uDrawFixed + 8, inst), 0).xyz), uintBitsToFloat(texelFetch(uDrawRows, ivec2(uDrawFixed + 9, inst), 0).xyz));
    vec4 vp = uintBitsToFloat(texelFetch(uDrawRows, ivec2(uDrawFixed + 10, inst), 0));
    vfxViewPosition = vp.xyz;
    uTime = vp.w;
    uVatTime = uintBitsToFloat(f11.y);
  }`,fsDecls:`uniform highp usampler2D uDrawRows;
uniform int uDrawFixed;
in float vRow;`};function ri(a,e,t,i,o,r){if(o==null)return;const s=r==="uint"||r==="int",n=o,u=o;switch(i){case"float":s?a[t]=n>>>0:e[t]=n;break;case"vec2":case"vec3":case"vec4":for(let l=0;l<u.length&&l<4;l++)e[t+l]=u[l];break;case"uint":s?a[t]=n>>>0:e[t]=n;break;case"int":s?a[t]=(n|0)>>>0:e[t]=n;break;case"bool":a[t]=n?1:0;break;case"mat4":for(let l=0;l<16;l++)e[t+l]=u[l];break;case"mat3":for(let l=0;l<3;l++)for(let c=0;c<3;c++)e[t+l*4+c]=u[l*3+c];break}}class Ar{constructor(e,t){f(this,"systems",[]);f(this,"slots",0);f(this,"high",0);f(this,"taken",[]);f(this,"passes",0);f(this,"bySystem",new Map);this.gl=e;for(const i of t){const o=this.make(i,oi);this.systems.push(o),this.bySystem.set(i,o)}this.slots=oi,this.taken.length=oi,this.taken.fill(!1)}take(){let e=this.taken.indexOf(!1);e<0&&(e=this.slots,this.grow(this.slots*yr)),this.taken[e]=!0,this.high=Math.max(this.high,e+1);for(const t of this.systems)this.zero(t,e);return e}free(e){if(!(e<0||!this.taken[e])){this.taken[e]=!1;for(const t of this.systems)t.rows[e*t.width*4+(t.width-1)*4+1]=0;for(;this.high>0&&!this.taken[this.high-1];)this.high--}}systemOf(e){return this.bySystem.get(e)}offset(e,t){return t*e.sys.capacity*e.sys.slots*16}rowAt(e,t){return t*e.width*4}beginFrame(){for(const e of this.systems){const t=(e.width-1)*4+1;for(let i=0;i<this.high;i++)e.rows[i*e.width*4+t]=0;e.active=0}}on(e,t){e.rows[t*e.width*4+(e.width-1)*4+1]=1,t+1>e.active&&(e.active=t+1)}beginDraw(){for(const e of this.systems){const t=(e.drawWidth-pt+11)*4;for(let i=0;i<this.high;i++)e.drawRows[i*e.drawWidth*4+t]=0;e.drawActive=0}}drawRowAt(e,t){return t*e.drawWidth*4}drawOn(e,t){e.drawRows[t*e.drawWidth*4+(e.drawWidth-pt+11)*4]=1,t+1>e.drawActive&&(e.drawActive=t+1)}uploadDraw(){const e=this.gl;for(const t of this.systems)t.drawActive&&(e.bindTexture(e.TEXTURE_2D,t.drawTexture),e.texSubImage2D(e.TEXTURE_2D,0,0,0,t.drawWidth,t.drawActive,e.RGBA_INTEGER,e.UNSIGNED_INT,t.drawRows.subarray(0,t.drawActive*t.drawWidth*4)));e.bindTexture(e.TEXTURE_2D,null)}bindDrawRows(e,t){const i=this.gl;i.activeTexture(i.TEXTURE0+Ki),i.bindTexture(i.TEXTURE_2D,e.drawTexture),i.uniform1i(t,Ki)}drawVaoAll(e){return e.drawVaosAll||(e.drawVaosAll=e.buffers.map(t=>St(this.gl,t,e.sys.slots,1,e.sys.mesh,0))),e.drawVaosAll[e.current]}simulate(e){const t=this.gl;this.passes=0,t.enable(t.RASTERIZER_DISCARD);for(const i of this.systems){if(!i.active)continue;const o=i.sys,r=i.current,s=1-r;t.useProgram(o.sim.program),e(o);const n=o.sim.locations;t.uniform1ui(n.uCapacity,o.capacity),n.uRing&&t.uniform1ui(n.uRing,o.ringK),t.activeTexture(t.TEXTURE0+ii),t.bindTexture(t.TEXTURE_2D,i.instTexture),t.uniform1i(n.uInstData,ii);const u=o.def.spawnFromEvent;if(u&&n.uParent){const l=this.systems.find(c=>c.sys.index===u.system);t.activeTexture(t.TEXTURE0+Yi),t.bindTexture(t.TEXTURE_2D,(l==null?void 0:l.parentTexture)??null),t.uniform1i(n.uParent,Yi),t.activeTexture(t.TEXTURE0+ii)}t.texSubImage2D(t.TEXTURE_2D,0,0,0,i.width,i.active,t.RGBA_INTEGER,t.UNSIGNED_INT,i.rows.subarray(0,i.active*i.width*4)),t.bindVertexArray(i.simVaos[r]),t.bindBuffer(t.ARRAY_BUFFER,null),t.bindBufferBase(t.TRANSFORM_FEEDBACK_BUFFER,0,i.buffers[s]),t.beginTransformFeedback(t.POINTS),t.drawArrays(t.POINTS,0,i.active*o.capacity),t.endTransformFeedback(),t.bindBufferBase(t.TRANSFORM_FEEDBACK_BUFFER,0,null),t.bindVertexArray(null),i.current=s,this.passes++,i.parentTexture&&this.copyToParentTexture(i)}t.disable(t.RASTERIZER_DISCARD)}drawVao(e,t){let i=e.drawVaos.get(t);return i||e.drawVaos.set(t,i=e.buffers.map(o=>St(this.gl,o,e.sys.slots,1,e.sys.mesh,this.offset(e,t)))),i[e.current]}trailVao(e,t){if(!e.sys.mesh)return this.drawVao(e,t);let i=e.trailVaos.get(t);return i||e.trailVaos.set(t,i=e.buffers.map(o=>St(this.gl,o,e.sys.slots,1,null,this.offset(e,t)))),i[e.current]}zero(e,t){const i=this.gl,o=e.sys.capacity*e.sys.slots*16;e.zeros??(e.zeros=new Uint8Array(o));for(const r of e.buffers)i.bindBuffer(i.ARRAY_BUFFER,r),i.bufferSubData(i.ARRAY_BUFFER,this.offset(e,t),e.zeros);i.bindBuffer(i.ARRAY_BUFFER,null)}dispose(){for(const e of this.systems)this.drop(e);this.systems.length=0,this.slots=0,this.high=0,this.taken.length=0}make(e,t,i){const o=this.gl,r=e.capacity*e.slots*16*t,s=[0,1].map(g=>{const w=o.createBuffer();return o.bindBuffer(o.ARRAY_BUFFER,w),o.bufferData(o.ARRAY_BUFFER,r,o.DYNAMIC_COPY),i&&(o.bindBuffer(o.COPY_READ_BUFFER,i.buffers[g]),o.copyBufferSubData(o.COPY_READ_BUFFER,o.ARRAY_BUFFER,0,0,e.capacity*e.slots*16*this.slots),o.bindBuffer(o.COPY_READ_BUFFER,null)),w});o.bindBuffer(o.ARRAY_BUFFER,null);let n=null;e.parentOfEvents&&(n=o.createTexture(),o.bindTexture(o.TEXTURE_2D,n),o.texStorage2D(o.TEXTURE_2D,1,o.RGBA32UI,it,Math.max(1,Math.ceil(e.capacity*e.slots*t/it))),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MIN_FILTER,o.NEAREST),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MAG_FILTER,o.NEAREST));const u=e.instance.width,l=o.createTexture();o.bindTexture(o.TEXTURE_2D,l),o.texStorage2D(o.TEXTURE_2D,1,o.RGBA32UI,u,t),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MIN_FILTER,o.NEAREST),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MAG_FILTER,o.NEAREST),o.bindTexture(o.TEXTURE_2D,null);const c=new Uint32Array(u*4*t);i&&c.set(i.rows);const d=e.draw.width,h=o.createTexture();o.bindTexture(o.TEXTURE_2D,h),o.texStorage2D(o.TEXTURE_2D,1,o.RGBA32UI,d,t),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MIN_FILTER,o.NEAREST),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MAG_FILTER,o.NEAREST),o.bindTexture(o.TEXTURE_2D,null);const m=new Uint32Array(d*4*t);return i&&m.set(i.drawRows),{sys:e,buffers:s,simVaos:s.map(g=>St(o,g,e.slots,0,null,0)),drawVaos:new Map,trailVaos:new Map,current:(i==null?void 0:i.current)??0,parentTexture:n,instTexture:l,rows:c,floats:new Float32Array(c.buffer),width:u,active:(i==null?void 0:i.active)??0,zeros:(i==null?void 0:i.zeros)??null,drawTexture:h,drawRows:m,drawFloats:new Float32Array(m.buffer),drawWidth:d,drawActive:(i==null?void 0:i.drawActive)??0,drawVaosAll:null}}grow(e){for(const t of this.systems){const i=this.make(t.sys,e,t);this.drop(t),Object.assign(t,i)}for(let t=this.slots;t<e;t++)this.taken[t]=!1;this.slots=e}drop(e){var i;const t=this.gl;e.buffers.forEach(o=>t.deleteBuffer(o)),e.simVaos.forEach(o=>t.deleteVertexArray(o));for(const o of[...e.drawVaos.values(),...e.trailVaos.values()])o.forEach(r=>t.deleteVertexArray(r));e.drawVaos.clear(),e.trailVaos.clear(),(i=e.drawVaosAll)==null||i.forEach(o=>t.deleteVertexArray(o)),e.drawVaosAll=null,e.parentTexture&&t.deleteTexture(e.parentTexture),t.deleteTexture(e.instTexture),t.deleteTexture(e.drawTexture)}copyToParentTexture(e){const t=this.gl,i=e.sys.capacity*e.sys.slots*e.active,o=Math.floor(i/it),r=i-o*it;t.bindBuffer(t.PIXEL_UNPACK_BUFFER,e.buffers[e.current]),t.bindTexture(t.TEXTURE_2D,e.parentTexture),o&&t.texSubImage2D(t.TEXTURE_2D,0,0,0,it,o,t.RGBA_INTEGER,t.UNSIGNED_INT,0),r&&t.texSubImage2D(t.TEXTURE_2D,0,0,o,r,1,t.RGBA_INTEGER,t.UNSIGNED_INT,o*it*16),t.bindBuffer(t.PIXEL_UNPACK_BUFFER,null)}}function St(a,e,t,i,o,r){const s=a.createVertexArray();a.bindVertexArray(s),a.bindBuffer(a.ARRAY_BUFFER,e);for(let n=0;n<t;n++)a.enableVertexAttribArray(n),a.vertexAttribIPointer(n,4,a.UNSIGNED_INT,t*16,r+n*16),a.vertexAttribDivisor(n,i);return o&&([[o.positions,3],[o.normals,3],[o.uvs,2]].forEach(([n,u],l)=>{a.bindBuffer(a.ARRAY_BUFFER,n),a.enableVertexAttribArray(t+l),a.vertexAttribPointer(t+l,u,a.FLOAT,!1,0,0),a.vertexAttribDivisor(t+l,0)}),a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,o.indices)),a.bindVertexArray(null),a.bindBuffer(a.ARRAY_BUFFER,null),s}const $t={float:1,vec2:2,vec3:3,vec4:4,uint:1,uvec2:2,uvec3:3,uvec4:4,int:1,ivec2:2,ivec3:3,ivec4:4,bool:1},Rr={float:"0.0",uint:"0u",int:"0",bool:"false"},nt=a=>Rr[a]??`${a}(0)`,Zi=.25,He=`#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
precision highp usampler2D;
`;class Fr{constructor(e,t,i={}){f(this,"name");f(this,"systems",[]);f(this,"spawners",[]);f(this,"textures");f(this,"exprTypes");f(this,"values0");f(this,"meshData");f(this,"bake");f(this,"byIndex",new Map);f(this,"_pool",null);f(this,"bakeBySource",new WeakMap);this.gl=e,this.effect=t,this.name=t.name,this.textures=i.textures??new Map,this.meshData=i.meshes??new Map;const o=i.maxCapacity??1<<20;this.bake=this.createBakeTexture(),this.values0=Ao(t.expressions,{time:0,deltaTime:0,frame:0,seed:0},(l,c)=>this.bakeRow(l,c)),this.exprTypes=t.expressions.map((l,c)=>Do(t,c));const r=t.systems,s=l=>l.spawnFromEvent?1+s(r[l.spawnFromEvent.system]):0,n=r.map((l,c)=>({def:l,index:c})).filter(l=>l.def.kind==="particles").sort((l,c)=>s(l.def)-s(c.def)),u=new Map;for(const{def:l}of n)l.spawnFromEvent&&(u.get(l.spawnFromEvent.system)??u.set(l.spawnFromEvent.system,new Set).get(l.spawnFromEvent.system)).add(l.spawnFromEvent.counter);for(const{def:l,index:c}of n){const d=this.setupSystem(l,c,u.get(c)??null,o);this.systems.push(d),this.byIndex.set(c,d)}r.forEach((l,c)=>{l.kind==="spawner"&&this.spawners.push({index:c,tasks:l.tasks??[],targets:l.targets??[]})})}system(e){return this.byIndex.get(e)}get drawOrder(){const e=this.effect.drawOrder;return e?e.map(t=>this.byIndex.get(t)).filter(t=>!!t):this.systems}bounds(){return Mo(this,this.values0)}get pool(){return this._pool??(this._pool=new Ar(this.gl,this.systems))}get pooled(){return!!this._pool&&this._pool.high>0}bindSimTextures(e){return this.bindStageTextures(e.sim,["init","update"],e)}bindStageTextures(e,t,i){const o=this.gl;let r=0;o.activeTexture(o.TEXTURE0),o.bindTexture(o.TEXTURE_2D,this.bake.texture),e.locations.bakedTexture&&o.uniform1i(e.locations.bakedTexture,r),r++;for(const s of t){const n=i.def.stages[s];if(n)for(const u of n.textures){const l=e.locations[u.name];if(!l)continue;const c=u.expr!==null?this.values0[u.expr]:null;o.activeTexture(o.TEXTURE0+r),u.type==="sampler3D"?o.bindTexture(o.TEXTURE_3D,this.texture3D(c)):o.bindTexture(o.TEXTURE_2D,this.textures.get(c)||Fi(o)),o.uniform1i(l,r),r++}}return r}drawSystem(e,t,i,o,r,s,n,u){const l=this.gl,c=e.render,d=e.def.output;l.useProgram(c.program);let h=this.bindStageTextures(c,["output"],e);const m=c.locations;if(l.uniformMatrix4fv(m.uViewProj,!1,o),l.uniform2fv(m.uViewport,i.viewport),m.uFxExposure&&l.uniform1f(m.uFxExposure,i.exposure),m.uFxToneMap&&l.uniform1f(m.uFxToneMap,i.toneMap?1:0),l.uniform1i(m.uRowBase,r),l.uniform1ui(m.uCapacity,e.capacity),l.uniform1i(m.uDrawFixed,e.draw.width-pt),(d==null?void 0:d.kind)==="shuriken"){const g=d.material;m.uProjScale&&l.uniform1f(m.uProjScale,1/i.projection[5]),m.uSystemRotation&&d.systemRotation&&l.uniformMatrix4fv(m.uSystemRotation,!1,d.systemRotation),m.uDeltaTime&&l.uniform1f(m.uDeltaTime,1/60),m.uCameraPos&&l.uniform3fv(m.uCameraPos,i.eye);const w=new Map;if(u&&d.beam){l.uniform3fv(m.uBeamStart,u.start),l.uniform3fv(m.uBeamEnd,u.end);const v=Math.hypot(u.end[0]-u.start[0],u.end[1]-u.start[1],u.end[2]-u.start[2]);for(const p of d.beam.tiling)w.set(p.uniform,p.perMetre*v)}for(const v of(g==null?void 0:g.uniforms)||[]){if(!m[v.name])continue;const p=w.has(v.name)&&Array.isArray(v.value)?[w.get(v.name),...v.value.slice(1)]:v.value;yi(l,m[v.name],v.type,p,"float")}const x=(v,p)=>{m[v]&&(l.activeTexture(l.TEXTURE0+h),l.bindTexture(l.TEXTURE_2D,p),l.uniform1i(m[v],h),h++)};x("uWhite",Gt(l));for(const v of(g==null?void 0:g.textures)||[])x(v.name,this.textures.get(v.key)||Gt(l));if(!(g!=null&&g.blend))l.disable(l.BLEND),l.depthMask(!0);else{l.enable(l.BLEND);const v=l;l.blendFuncSeparate(v[g.blend.src]??l.SRC_ALPHA,v[g.blend.dst]??l.ONE_MINUS_SRC_ALPHA,l.ZERO,l.ONE),l.depthMask(!!g.depthWrite)}g!=null&&g.cull?(l.enable(l.CULL_FACE),l.cullFace(l.BACK)):l.disable(l.CULL_FACE),this.pool.bindDrawRows(t,m.uDrawRows),l.bindVertexArray(n),e.mesh?l.drawElementsInstanced(l.TRIANGLES,e.mesh.count,l.UNSIGNED_INT,0,s):l.drawArraysInstanced(l.TRIANGLE_STRIP,0,4,s)}else{l.disable(l.CULL_FACE);const g=d==null?void 0:d.blend;g==="opaque"?(l.disable(l.BLEND),l.depthMask(!0)):(l.enable(l.BLEND),l.depthMask(!1),g==="add"?l.blendFuncSeparate(l.SRC_ALPHA,l.ONE,l.ZERO,l.ONE):g==="premultiply"?l.blendFuncSeparate(l.ONE,l.ONE_MINUS_SRC_ALPHA,l.ZERO,l.ONE):l.blendFuncSeparate(l.SRC_ALPHA,l.ONE_MINUS_SRC_ALPHA,l.ZERO,l.ONE)),this.pool.bindDrawRows(t,m.uDrawRows),l.bindVertexArray(n),l.drawArraysInstanced(l.TRIANGLE_STRIP,0,4,s)}return l.bindVertexArray(null),1}texture3D(e){const t=this.textures.get(e);if(t)return t;const i=Or(this.gl);return this.textures.set(e,i),i}bakeRow(e,t){const i=this.gl,o=typeof t=="object"&&t!==null?t:null,r=o?this.bakeBySource.get(o):void 0;if(r&&r.kind===e&&this.bake.used.get(r.key)===r.entry)return r.entry;const s=`${e}:${JSON.stringify(t)}`;let n=this.bake.used.get(s);if(n!==void 0)return o&&this.bakeBySource.set(o,{kind:e,key:s,entry:n}),n;{const u=this.bake.used.size%this.bake.rows,l=e==="gradient"?{data:ar(t),start:0,end:1}:rr(t);i.bindTexture(i.TEXTURE_2D,this.bake.texture),i.texSubImage2D(i.TEXTURE_2D,0,0,u,at,1,i.RGBA,i.FLOAT,l.data);const c=(u+.5)/this.bake.rows,d=l.end-l.start||1;n=e==="gradient"?c:[1/d,-l.start/d,c,12],this.bake.used.size>=this.bake.rows&&this.bake.used.clear(),this.bake.used.set(s,n),o&&this.bakeBySource.set(o,{kind:e,key:s,entry:n})}return n}get bakeTexture(){return this.bake.texture}dispose(){var t;const e=this.gl;(t=this._pool)==null||t.dispose(),this._pool=null;for(const i of this.systems)if(e.deleteProgram(i.sim.program),i.render&&e.deleteProgram(i.render.program),i.trail&&e.deleteProgram(i.trail.program),i.mesh)for(const o of[i.mesh.positions,i.mesh.normals,i.mesh.uvs,i.mesh.indices])e.deleteBuffer(o);e.deleteTexture(this.bake.texture);for(const i of this.textures.values())i&&!Nr(e,i)&&e.deleteTexture(i)}setupSystem(e,t,i,o){var b,F,_,E,R,M,z;const r=Math.max(1,Math.round(e.capacity));let s,n=1;if(e.spawnFromEvent){const L=this.byIndex.get(e.spawnFromEvent.system);let A=Math.max(1,Math.floor(r/Math.max(1,L.def.capacity)));e.spawnFromEvent.mode==="die"?A=Math.max(A,this.maxEventCount(L.def)):A=Math.max(A,(e.spawnFromEvent.ringStep||1)*2),A=Math.max(1,Math.min(A,Math.floor(o/L.capacity))),n=A,s=L.capacity*A}else s=Math.min(((b=e.spawner)==null?void 0:b.kind)==="shuriken"?fr(e.spawner,e.maxLifetime,r):r,o);const u=new Map(e.attributes.map(L=>[L.name,L.type])),l=e.attributes.filter(L=>L.stored).map(L=>({name:L.name,type:L.type,offset:0}));for(const L of i??[])l.push({name:`__${L}`,type:"uint",offset:0,counter:L});let c=0;for(const L of l)L.offset=c,c+=$t[L.type];const d=Math.max(1,Math.ceil(c/4)),h=qi([...((F=e.stages.init)==null?void 0:F.uniforms)??[],...((_=e.stages.update)==null?void 0:_.uniforms)??[]]),m=e.spawnFromEvent?this.byIndex.get(e.spawnFromEvent.system).capacity:0,g=(E=e.output)==null?void 0:E.material,w=(((R=e.output)==null?void 0:R.materialAnim)??[]).flatMap(L=>{const A=g==null?void 0:g.uniforms.find(S=>S.name===L.uniform);return A?[{name:A.name,type:A.type,anim:L}]:[]}),x=qi([...((M=e.stages.output)==null?void 0:M.uniforms)??[],...w],pt),v={index:t,def:e,name:e.name,capacity:s,ringK:n,fields:u,layout:l,slots:d,sim:null,render:null,trail:null,mesh:null,parentOfEvents:!!i,parentCapacity:m,instance:h,draw:x,animated:w};v.sim=this.buildSimProgram(v);const p=((z=e.output)==null?void 0:z.kind)==="shuriken";return v.render=e.stages.output?p?e.output.mode==="none"?null:this.buildShurikenRender(v):this.buildRenderProgram(v):null,v.trail=p&&e.output.trail&&e.stages.output&&e.stages.trail?this.buildShurikenTrail(v):null,v.mesh=p&&(e.output.mode==="mesh"||e.output.mode==="vat")?this.meshBuffers(e.output.mesh):null,v}maxEventCount(e){var i;let t=1;for(const o of((i=e.stages.update)==null?void 0:i.uniforms)||[])/^u_count_/.test(o.name)&&o.expr!==null&&(t=Math.max(t,Number(this.values0[o.expr])||1));return Math.min(t,4096)}meshBuffers(e){const t=this.gl,i=this.meshData.get(e);if(!i)return null;const o=s=>{const n=t.createBuffer();return t.bindBuffer(t.ARRAY_BUFFER,n),t.bufferData(t.ARRAY_BUFFER,new Float32Array(s),t.STATIC_DRAW),n},r=t.createBuffer();return t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,r),t.bufferData(t.ELEMENT_ARRAY_BUFFER,new Uint32Array(i.indices),t.STATIC_DRAW),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,null),t.bindBuffer(t.ARRAY_BUFFER,null),{positions:o(i.positions),normals:o(i.normals),uvs:o(i.uvs),indices:r,count:i.indices.length}}createBakeTexture(){const e=this.gl,t=Math.max(1,this.effect.expressions.filter(o=>o.op==="BakeCurve"||o.op==="BakeGradient").length*2),i=e.createTexture();return e.bindTexture(e.TEXTURE_2D,i),e.texStorage2D(e.TEXTURE_2D,1,e.RGBA16F,at,t),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),{texture:i,rows:t,used:new Map}}buildSimProgram(e){const t=e.def,{init:i,update:o}=t.stages,r=[i,o].filter(E=>!!E),s=Ji(r),n=t.spawnFromEvent,u=n?this.byIndex.get(n.system):null,l=e.fields,c=e.layout.filter(E=>!E.counter).map(E=>`  attributes.${E.name} = ${si("a_s",E)};`).join(`
`),d=Cr(e,"v_s"),h=(t.sourceAttributes.length?t.sourceAttributes:[{name:"_unused",type:"float"}]).map(E=>`  ${E.type} ${E.name};`).join(`
`);let m="";const g=E=>{const R=Array.from({length:$t[E.type]},(M,z)=>`parentComponent(parentIndex, ${E.offset+z})`);return So(E.type,R)};if(u)for(const E of t.sourceAttributes){const R=u.layout.find(M=>M.name===E.name);m+=R?`    sourceAttributes.${E.name} = ${g(R)};
`:`    sourceAttributes.${E.name} = ${nt(E.type)};
`}const w=u==null?void 0:u.layout.find(E=>E.counter===n.counter),x=[...new Set((o==null?void 0:o.events)||[])],v=Er(e.instance),p=e.instance.width,b=`${He}
${Object.entries(s).map(([E,R])=>`#define ${E} ${R}`).join(`
`)}
${ti}
struct Attributes {
${[...l].map(([E,R])=>`  ${R} ${E};`).join(`
`)}
};
struct SourceAttributes {
${h}
};
${Dr(r)}
${v.decls}
uniform uint uCapacity, uRing;
uniform usampler2D uParent;
${Array.from({length:e.slots},(E,R)=>`layout(location = ${R}) in uvec4 a_s${R};
flat out uvec4 v_s${R};`).join(`
`)}

uint parentComponent(uint particle, int c) {
  int texel = int(particle) * ${u?u.slots:1} + c / 4;
  return texelFetch(uParent, ivec2(texel % ${it}, texel / ${it}), 0)[c % 4];
}
${(i==null?void 0:i.functions)||""}
${(o==null?void 0:o.functions)||""}

void main() {
  uint index = uint(gl_VertexID);
  // Which copy's slot this particle is in (its row of instance data), and which particle of it.
  int inst = int(index / uCapacity);
  uint local = index - uint(inst) * uCapacity;
  uvec4 spawnA = texelFetch(uInstData, ivec2(${p-Xt}, inst), 0);
  uvec4 spawnB = texelFetch(uInstData, ivec2(${p-Xt+1}, inst), 0);
  // The slot is off this frame (its copy out of view or empty, or no copy): its particles stay as they are.
  if (spawnB.y == 0u) {
${Array.from({length:e.slots},(E,R)=>`    v_s${R} = a_s${R};`).join(`
`)}
    return;
  }
  uSpawnStart = spawnA.x;
  uSpawnCount = spawnA.y;
  uSpawnBase = spawnA.z;
  uSystemSeed = spawnA.w;
  uCursor = spawnB.x;
  uEmitterTime = uintBitsToFloat(spawnB.z);
${v.loads}
  Attributes attributes;
${[...l].map(([E,R])=>`  attributes.${E} = ${nt(R)};`).join(`
`)}
${c}
  SourceAttributes sourceAttributes;
${h.replace(/^ {2}(\w+) (\w+);$/gm,(E,R,M)=>`  sourceAttributes.${M} = ${nt(R)};`)}
${x.map(E=>`  uint ${E} = 0u;`).join(`
`)}

  bool spawnNow = false;
  uint particleIndex = 0u;
${u?`  uint parentIndex = uint(inst) * ${e.parentCapacity}u + local / uRing;
  uint sub = local % uRing;
  uint parentEvents = parentComponent(parentIndex, ${w?w.offset:0});
  ${n.mode==="die"?"spawnNow = sub < parentEvents;":"spawnNow = parentEvents > 0u && ((sub + uRing - uCursor) % uRing) < parentEvents;"}
  particleIndex = uSpawnBase + local;
  if (spawnNow) {
${m}  }`:`  uint rel = (local + uCapacity - uSpawnStart) % uCapacity;
  spawnNow = rel < uSpawnCount;
  particleIndex = uSpawnBase + rel;`}

  if (spawnNow) {
${[...l].map(([E,R])=>{var M;return`    attributes.${E} = ${((M=i==null?void 0:i.defaults)==null?void 0:M[E])??nt(R)};`}).join(`
`)}
${l.has("particleId")?"    attributes.particleId = particleIndex;":""}
${l.has("seed")?"    attributes.seed = WangHash(particleIndex ^ uSystemSeed);":""}
${l.has("alive")?"    attributes.alive = true;":""}
${l.has("age")?"    attributes.age = 0.0;":""}
    {
${(i==null?void 0:i.section)||""}
    }
  }
${l.has("alive")?"  if (attributes.alive) {":"  {"}
${Object.entries((o==null?void 0:o.defaults)||{}).filter(([E])=>!e.layout.some(R=>R.name===E)).map(([E,R])=>`    attributes.${E} = ${R};`).join(`
`)}
    {
${(o==null?void 0:o.section)||""}
    }
  }
${d}
}`,F=`${He}out vec4 o; void main() { o = vec4(0.0); }`,_=Array.from({length:e.slots},(E,R)=>`v_s${R}`);return this.program(b,F,`${this.name} / ${e.name} simulation`,_)}buildShurikenRender(e){const{vs:t,fs:i}=vr({slots:e.slots,output:e.def.output,stages:e.def.stages},this.shurikenShaderParts(e,[e.def.stages.output])),o=Qi(t,i,e);return this.program(o.vs,o.fs,`${this.name} / ${e.name} output`,null)}buildShurikenTrail(e){const t=[e.def.stages.output,e.def.stages.trail],{vs:i,fs:o}=gr({slots:e.slots,layout:e.layout,output:e.def.output,stages:e.def.stages},this.shurikenShaderParts(e,t));return this.program(i,o,`${this.name} / ${e.name} trails`,null)}shurikenShaderParts(e,t){const i=e.fields;return{header:He,lib:ti,attributeDecl:`struct Attributes {
${[...i].map(([o,r])=>`  ${r} ${o};`).join(`
`)}
};`,uniformDecls:eo(t),zeroInit:[...i].map(([o,r])=>`  attributes.${o} = ${nt(r)};`).join(`
`),loadAttributes:e.layout.filter(o=>!o.counter&&i.has(o.name)).map(o=>`  attributes.${o.name} = ${si("a_s",o)};`).join(`
`)}}buildRenderProgram(e){var x,v;const t=e.def,i=t.stages.output,o=e.fields,r=Ji([i]),s=new Set(e.layout.map(p=>p.name)),n=e.layout.filter(p=>!p.counter&&o.has(p.name)).map(p=>`  attributes.${p.name} = ${si("a_s",p)};`).join(`
`),u=p=>o.has(p),l=i.textures.find(p=>/mainTexture$/.test(p.name)),c=((x=t.output)==null?void 0:x.primitive)==="line",d=()=>`  vec3 size3 = vec3(${u("size")?"attributes.size":"0.1"});
${u("scaleX")?"  size3.x *= attributes.scaleX;":""}
${u("scaleY")?"  size3.y *= attributes.scaleY;":""}
${u("scaleZ")?"  size3.z *= attributes.scaleZ;":""}
  vec3 angles = vec3(${u("angleX")?"attributes.angleX":"0.0"}, ${u("angleY")?"attributes.angleY":"0.0"}, ${u("angleZ")?"attributes.angleZ":"0.0"});
  vec3 pivot = vec3(${u("pivotX")?"attributes.pivotX":"0.0"}, ${u("pivotY")?"attributes.pivotY":"0.0"}, ${u("pivotZ")?"attributes.pivotZ":"0.0"});
  vec3 axisX = ${u("axisX")?"attributes.axisX":"vec3(1.0, 0.0, 0.0)"};
  vec3 axisY = ${u("axisY")?"attributes.axisY":"vec3(0.0, 1.0, 0.0)"};
  vec3 axisZ = ${u("axisZ")?"attributes.axisZ":"vec3(0.0, 0.0, 1.0)"};
  // GetElementToVFXMatrix: pos + [axisX axisY axisZ] * Euler * size * (corner - pivot)
  vec3 local = eulerRotate(angles, size3 * (vec3(corner - 0.5, 0.0) - pivot));
  vec3 p = attributes.position + axisX * local.x + axisY * local.y + axisZ * local.z;
  gl_Position = uViewProj * uModel * vec4(p, 1.0);`,h=()=>`  vec3 target = ${u("targetPosition")?"attributes.targetPosition":"attributes.position + vec3(0.0, 0.0, 0.1)"};
  vec4 c0 = uViewProj * uModel * vec4(attributes.position, 1.0);
  vec4 c1 = uViewProj * uModel * vec4(target, 1.0);
  // keep both ends in front of the near plane
  if (c0.w < 0.01) c0 = mix(c0, c1, (0.01 - c0.w) / (c1.w - c0.w));
  if (c1.w < 0.01) c1 = mix(c1, c0, (0.01 - c1.w) / (c0.w - c1.w));
  vec2 d = c1.xy / c1.w - c0.xy / c0.w;
  vec2 n = normalize(vec2(-d.y, d.x) * uViewport + 1e-6) / uViewport * 2.0; // ~2 px wide
  vec4 c = corner.y < 0.5 ? c0 : c1;
  c.xy += n * (corner.x - 0.5) * 2.0 * c.w;
  gl_Position = c;`,m=`${He}
${Object.entries(r).map(([p,b])=>`#define ${p} ${b}`).join(`
`)}
${ti}
struct Attributes {
${[...o].map(([p,b])=>`  ${b} ${p};`).join(`
`)}
};
${eo([i])}
uniform mat4 uViewProj;
uniform mat4 uModel;
uniform vec2 uViewport;
${Array.from({length:e.slots},(p,b)=>`layout(location = ${b}) in uvec4 a_s${b};`).join(`
`)}
out vec4 vColor;
out vec2 vUV;
${i.functions}

// Unity's GetEulerMatrix (rows), applied to v.
vec3 eulerRotate(vec3 angles, vec3 v) {
  vec3 s = sin(radians(angles)), c = cos(radians(angles));
  return vec3(
    dot(vec3(c.y * c.z + s.x * s.y * s.z, c.z * s.x * s.y - c.y * s.z, c.x * s.y), v),
    dot(vec3(c.x * s.z, c.x * c.z, -s.x), v),
    dot(vec3(-c.z * s.y + c.y * s.x * s.z, c.y * c.z * s.x + s.y * s.z, c.x * c.y), v));
}

void main() {
  Attributes attributes;
${[...o].map(([p,b])=>`  attributes.${p} = ${s.has(p)?nt(b):i.defaults[p]??nt(b)};`).join(`
`)}
${n}
${u("alive")?"  if (!attributes.alive) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); vColor = vec4(0.0); vUV = vec2(0.0); return; }":""}
  {
${i.section}
  }
  vec2 corner = vec2(float(gl_VertexID & 1), float((gl_VertexID & 2) >> 1));
  vUV = corner;
  vColor = vec4(${u("color")?"attributes.color":"vec3(1.0)"}, ${u("alpha")?"attributes.alpha":"1.0"});
${c?h():d()}
}`,g=`${He}
in vec4 vColor;
in vec2 vUV;
${l?`uniform sampler2D ${l.name};`:""}
${Fo}
out vec4 fragColor;
void main() {
  vec4 color = vColor;
${l?`  color *= texture(${l.name}, vUV);`:""}
${(v=t.output)!=null&&v.alphaTest?"  if (color.a < 0.5) discard;":""}
  color.a = clamp(color.a, 0.0, 1.0);
  fragColor = vec4(fxTone(color.rgb), clamp(color.a * uFxTint.a, 0.0, 1.0));
}`,w=Qi(m,g,e);return this.program(w.vs,w.fs,`${this.name} / ${e.name} output`,null)}program(e,t,i,o){const r=this.gl,s=(h,m)=>{const g=r.createShader(h);if(r.shaderSource(g,m),r.compileShader(g),!r.getShaderParameter(g,r.COMPILE_STATUS)){const w=r.getShaderInfoLog(g)??"",x=m.split(`
`),v=[...w.matchAll(/ERROR: \d+:(\d+)/g)].slice(0,3).map(p=>{var b;return`${p[1]}: ${(b=x[Number(p[1])-1])==null?void 0:b.trim()}`}).join(`
`);throw r.deleteShader(g),new Error(`${i}: shader compile failed
${w}
${v}`)}return g},n=r.createProgram(),u=s(r.VERTEX_SHADER,e),l=s(r.FRAGMENT_SHADER,t);if(r.attachShader(n,u),r.attachShader(n,l),o&&r.transformFeedbackVaryings(n,o,r.INTERLEAVED_ATTRIBS),r.linkProgram(n),r.deleteShader(u),r.deleteShader(l),!r.getProgramParameter(n,r.LINK_STATUS))throw new Error(`${i}: link failed
${r.getProgramInfoLog(n)}`);const c={},d=r.getProgramParameter(n,r.ACTIVE_UNIFORMS);for(let h=0;h<d;h++){const m=r.getActiveUniform(n,h).name.replace(/\[0\]$/,"");c[m]=r.getUniformLocation(n,m)}return{program:n,locations:c}}}class _r{constructor(e,t={}){f(this,"time",0);f(this,"frame",0);f(this,"seed");f(this,"position",[0,0,0]);f(this,"rotation",[0,0,0,1]);f(this,"scale",1);f(this,"recolor",null);f(this,"tint",[1,1,1,1]);f(this,"density",1);f(this,"overrides",new Map);f(this,"playing",new Set);f(this,"looping");f(this,"values");f(this,"slot",-1);f(this,"hidden",!1);f(this,"veil",1);f(this,"pending",0);f(this,"spawnCounts",new Map);f(this,"ctx");f(this,"bake");f(this,"stoppedAt",null);f(this,"playedAt",new Map);f(this,"beamEnd",null);f(this,"states",[]);f(this,"stateOf",new Map);f(this,"spawners");f(this,"gl");f(this,"modelOut",new Float32Array(16));f(this,"recolorOut",null);f(this,"recolorSrc");this.asset=e;const i=this.gl=e.gl,o=e.effect;this.looping=!!o.looping&&!(t.once&&o.kind==="shuriken"),this.seed=(t.seed??Math.random()*4294967295)>>>0,this.values=e.values0,this.spawners=e.spawners.map(r=>({def:r,acc:0,timers:r.tasks.map(()=>null)})),this.ctx={time:0,deltaTime:0,frame:0,seed:this.seed,overrides:this.overrides},this.bake=(r,s)=>e.bakeRow(r,s),this.slot=e.pool.take();for(const r of e.pool.systems){const s=r.sys;let n=null;if(s.trail){const{points:c,interval:d}=s.def.output.trail,h=i.createTexture();i.bindTexture(i.TEXTURE_2D_ARRAY,h),i.texStorage3D(i.TEXTURE_2D_ARRAY,1,i.RGBA32UI,tt,Math.ceil(s.capacity*s.slots/tt),c),i.texParameteri(i.TEXTURE_2D_ARRAY,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D_ARRAY,i.TEXTURE_MAG_FILTER,i.NEAREST),n={texture:h,points:c,interval:d,head:0,count:0,last:-1/0,times:new Float64Array(c),ages:new Float32Array(c)}}const u=s.def.spawner?this.looping?s.def.spawner:{...s.def.spawner,looping:!1}:null,l={sys:s,ps:r,trail:n,ring:0,spawnBase:0,cursor:0,spawner:u,spawnState:u?ji(u):null,emitterTime:0,life:Mr(e,s),aliveUntil:0};l.aliveUntil=l.life===1/0?1/0:-1/0,this.states.push(l),this.stateOf.set(s.index,l)}this.play()}play(e=this.asset.effect.initialEvent){const t=this.asset.effect.events.find(i=>i.name===e);for(const i of(t==null?void 0:t.play)||[])this.playing.has(i)||this.playedAt.set(i,this.time),this.playing.add(i);for(const i of(t==null?void 0:t.stop)||[])this.playing.delete(i);this.stoppedAt=this.playing.size?null:this.time}stop(){this.play("OnStop"),this.asset.effect.events.some(e=>e.name==="OnStop")||(this.playing.clear(),this.stoppedAt=this.time)}get done(){const{playTime:e,fadeTime:t}=this.asset.effect;return!this.looping&&e!=null&&this.time>=e||t!=null&&this.stoppedAt!=null&&this.time-this.stoppedAt>=t?!0:this.settled()}settled(){if(this.looping||this.frame===0||this.asset.effect.kind!=="shuriken"||this.spawners.length)return!1;for(const e of this.states)if(this.time<=e.aliveUntil||e.spawner&&e.spawnState&&this.playing.has(e.sys.index)&&!dr(e.spawner,e.spawnState))return!1;for(const e of this.asset.effect.lights||[])if(!e.curve||this.time<e.curve.time)return!1;return!0}reset(e){const t=this.asset.pool;if(this.slot<0)this.slot=t.take();else for(const i of this.states)t.zero(i.ps,this.slot);this.pending=0,this.hidden=!1;for(const i of this.states)i.ring=0,i.spawnBase=0,i.cursor=0,i.spawnState=i.spawner?ji(i.spawner):null,i.emitterTime=0,i.aliveUntil=i.life===1/0?1/0:-1/0,i.trail&&(i.trail.count=0,i.trail.last=-1/0);for(const i of this.spawners)i.acc=0,i.timers=i.def.tasks.map(()=>null);e!==void 0&&(this.seed=e>>>0),this.time=0,this.frame=0,this.playing.clear(),this.play()}setParam(e,t){const i=this.asset.effect.params.find(o=>o.name===e);i&&this.overrides.set(i.expr,t)}getParam(e){const t=this.asset.effect.params.find(i=>i.name===e);return t?this.overrides.has(t.expr)?this.overrides.get(t.expr):this.asset.effect.expressions[t.expr].value:void 0}setBeamEnd(e){this.beamEnd=e?[e[0],e[1],e[2]]:null}beamEnds(e){const t=this.asset.effect.systems[e].output.beam,i=this.beamEnd?this.toLocalPoint(this.beamEnd):t.end,o=t.growth>0?Math.min(1,Math.max(0,(this.time-(this.playedAt.get(e)??0))/t.growth)):1;return{start:t.start,end:[0,1,2].map(r=>t.start[r]+(i[r]-t.start[r])*o)}}bounds(){return Mo(this.asset,this.values)}recolorNow(){const e=this.recolor??this.asset.effect.recolor;return(!this.recolorOut||e!==this.recolorSrc)&&(this.recolorSrc=e,this.recolorOut=ur(e)),this.recolorOut}model(){const e=this.rotation[0],t=this.rotation[1],i=this.rotation[2],o=this.rotation[3],r=this.scale,s=this.modelOut;return s[0]=-r*(1-2*(t*t+i*i)),s[1]=-r*(2*(e*t+i*o)),s[2]=-r*(2*(e*i-t*o)),s[3]=0,s[4]=r*(2*(e*t-i*o)),s[5]=r*(1-2*(e*e+i*i)),s[6]=r*(2*(t*i+e*o)),s[7]=0,s[8]=r*(2*(e*i+t*o)),s[9]=r*(2*(t*i-e*o)),s[10]=r*(1-2*(e*e+t*t)),s[11]=0,s[12]=this.position[0],s[13]=this.position[1],s[14]=this.position[2],s[15]=1,s}toLocalDir(e,t=[0,0,0]){const i=-this.rotation[0],o=-this.rotation[1],r=-this.rotation[2],s=this.rotation[3],n=2*(o*e[2]-r*e[1]),u=2*(r*e[0]-i*e[2]),l=2*(i*e[1]-o*e[0]);return t[0]=-(e[0]+s*n+(o*l-r*u)),t[1]=e[1]+s*u+(r*n-i*l),t[2]=e[2]+s*l+(i*u-o*n),t}toLocalPoint(e,t=[0,0,0]){const i=kr;return i[0]=e[0]-this.position[0],i[1]=e[1]-this.position[1],i[2]=e[2]-this.position[2],this.toLocalDir(i,t),t[0]/=this.scale,t[1]/=this.scale,t[2]/=this.scale,t}lights(e,t=1){for(const i of this.asset.effect.lights||[]){const o=cr(i,this.time)*t*this.veil;if(!(o>0))continue;const r=Br([-i.position[0]*this.scale,i.position[1]*this.scale,i.position[2]*this.scale],this.rotation);e.push({x:this.position[0]+r[0],y:this.position[1]+r[1],z:this.position[2]+r[2],radius:i.range*this.scale,r:i.color[0],g:i.color[1],b:i.color[2],intensity:o})}}update(e,t=1){const i=this.asset.pool;i.beginFrame(),this.advance(e,t),i.simulate(o=>this.asset.bindSimTextures(o)),this.afterSimulate()}idle(e){e=Math.min(e,1/15),this.time+=e,this.pending=Math.min(this.pending+e,Zi)}advance(e,t=1){var l;const i=this.asset,o=i.pool;e=Math.min(e,1/15),this.time+=e,this.frame++;const r=Math.min(e+this.pending,Zi);this.pending=0,e=r;const s=this.ctx;s.time=this.time,s.deltaTime=e,s.frame=this.frame,s.seed=this.seed,this.values=Ao(i.effect.expressions,s,this.bake,this.values);const n=this.spawnCounts;n.clear();for(const c of this.spawners){if(!this.playing.has(c.def.index))continue;const d=this.runSpawner(c,e,t);for(const h of c.def.targets)n.set(h,(n.get(h)||0)+d)}for(const c of this.states){if(!c.spawner||!c.spawnState||!this.playing.has(c.sys.index))continue;const d=mr(c.spawner,c.spawnState,e,t);n.set(c.sys.index,(n.get(c.sys.index)||0)+d.count),c.emitterTime=d.emitterTime}for(const c of this.states)c.life!==1/0&&!c.sys.def.spawnFromEvent&&(n.get(c.sys.index)||0)>=1&&(c.aliveUntil=Math.max(c.aliveUntil,this.time+c.life));for(let c=0;c<2;c++)for(const d of this.states){const h=d.sys.def.spawnFromEvent;d.life!==1/0&&h&&(d.aliveUntil=(((l=this.stateOf.get(h.system))==null?void 0:l.aliveUntil)??1/0)+d.life)}const u=i.exprTypes;for(const c of this.states){if(this.time>c.aliveUntil)continue;const d=c.sys,h=c.ps,m=h.rows,g=o.rowAt(h,this.slot),w=d.instance.at;for(const b of Ur){const F=d.def.stages[b];if(F)for(const _ of F.uniforms)_.expr!==null&&ri(m,h.floats,g+w[_.name]*4,_.type,this.values[_.expr],u[_.expr])}const x=g+(h.width-Xt)*4,v=x+4;m[x+3]=(this.seed^Math.imul(d.index+1,2654435761))>>>0,m[x+2]=c.spawnBase>>>0,h.floats[v+2]=c.emitterTime;const p=d.def.spawnFromEvent;if(p)m[v]=c.cursor%d.ringK,c.cursor=(c.cursor+(p.ringStep||1))%d.ringK,c.spawnBase+=d.capacity;else{const b=Math.min(d.capacity,Math.floor(n.get(d.index)||0));m[x]=c.ring,m[x+1]=b,c.ring=(c.ring+b)%d.capacity,c.spawnBase+=b}o.on(h,this.slot)}}afterSimulate(){for(const e of this.states)e.trail&&this.time<=e.aliveUntil&&this.recordTrail(e,e.trail)}park(){this.slot<0||(this.asset.pool.free(this.slot),this.slot=-1)}draw(e){if(this.slot<0)return 0;const t=this.asset.pool,i=Pr(e.projection,e.view);t.beginDraw();let o=0;if(this.stageDraw(e)){t.uploadDraw();for(const r of this.asset.drawOrder){const s=this.stateOf.get(r.index);!r.render||!this.rowOn(s)||(o+=this.asset.drawSystem(r,s.ps,e,i,this.slot,r.capacity,t.drawVao(s.ps,this.slot),this.beamOf(r)))}}return o+this.drawTrails(e,i)}stageDraw(e){if(this.slot<0)return!1;const t=this.asset,i=t.pool,o=this.model(),r=e.view,s=this.toLocalDir(li(ni,r[0],r[4],r[8]),zr),n=this.toLocalDir(li(ni,r[1],r[5],r[9]),Ir),u=this.toLocalDir(li(ni,r[2],r[6],r[10]),Lr),l=this.toLocalPoint(e.eye,Vr),c=this.recolorNow(),d=t.exprTypes;let h=!1;for(const m of this.states){const g=m.sys;if(!g.render||this.time>m.aliveUntil)continue;const w=g.def.output;if((w==null?void 0:w.mode)==="beam"&&!this.playing.has(g.index))continue;const x=this.time-(this.playedAt.get(g.index)??0);let v=0;if(w!=null&&w.vat){const S=lr(w.vat,x);if(S===null)continue;v=S}let p=o,b=l;const F=g.def.anchor;if(F){const{end:S}=this.beamEnds(F.beam),U=[0,1,2].map(D=>S[D]-F.origin[D]);p=Array.from(o);for(let D=0;D<3;D++)p[12+D]+=o[D]*U[0]+o[4+D]*U[1]+o[8+D]*U[2];b=[l[0]-U[0],l[1]-U[1],l[2]-U[2]]}const _=m.ps,E=_.drawRows,R=_.drawFloats,M=i.drawRowAt(_,this.slot),z=g.draw.at,L=g.def.stages.output;if(L)for(const S of L.uniforms)S.expr!==null&&ri(E,R,M+z[S.name]*4,S.type,this.values[S.expr],d[S.expr]);for(const S of g.animated)ri(E,R,M+z[S.name]*4,S.type,nr(S.anim,x),"float");const A=M+(g.draw.width-pt)*4;R[A]=p[0],R[A+1]=p[4],R[A+2]=p[8],R[A+3]=p[12],R[A+4]=p[1],R[A+5]=p[5],R[A+6]=p[9],R[A+7]=p[13],R[A+8]=p[2],R[A+9]=p[6],R[A+10]=p[10],R[A+11]=p[14],R[A+12]=this.tint[0],R[A+13]=this.tint[1],R[A+14]=this.tint[2],R[A+15]=this.tint[3]*this.veil;for(let S=0;S<3;S++)for(let U=0;U<3;U++)R[A+16+S*4+U]=c[S*3+U];for(let S=0;S<3;S++)R[A+28+S]=s[S],R[A+32+S]=n[S],R[A+36+S]=u[S],R[A+40+S]=b[S];R[A+43]=this.time,R[A+45]=v,i.drawOn(_,this.slot),h=!0}return h}rowOn(e){const t=e.ps;return t.drawRows[this.asset.pool.drawRowAt(t,this.slot)+(t.drawWidth-pt+11)*4]===1}rowOnFor(e){const t=this.stateOf.get(e.index);return!!t&&this.rowOn(t)}beamOf(e){var t;return(t=e.def.output)!=null&&t.beam?this.beamEnds(e.index):null}drawTrails(e,t){if(this.slot<0)return 0;const i=this.gl,o=this.asset.pool;let r=0,s=null,n=null,u=null;for(const l of this.asset.drawOrder){const c=this.stateOf.get(l.index),d=l.trail,h=c.trail;if(!d||!h||this.time>c.aliveUntil)continue;const m=l.def.output;if(!s){const p=e.view;s=new Float32Array([...this.toLocalDir([p[0],p[4],p[8]]),...this.toLocalDir([p[1],p[5],p[9]]),...this.toLocalDir([p[2],p[6],p[10]])]),n=this.toLocalPoint(e.eye),u=this.model()}i.useProgram(d.program);let g=this.bindUniforms(d,["output","trail"],l);const w=d.locations;i.uniformMatrix4fv(w.uViewProj,!1,t),i.uniformMatrix4fv(w.uModel,!1,u),i.uniformMatrix3fv(w.vfxViewRot,!1,s),i.uniform3fv(w.vfxViewPosition,n),i.uniform2fv(w.uViewport,e.viewport),w.uFxExposure&&i.uniform1f(w.uFxExposure,e.exposure),w.uFxToneMap&&i.uniform1f(w.uFxToneMap,e.toneMap?1:0),w.uFxTint&&i.uniform4fv(w.uFxTint,this.tint);const x=m.trail.material;w.uProjScale&&i.uniform1f(w.uProjScale,1/e.projection[5]),w.uSystemRotation&&m.systemRotation&&i.uniformMatrix4fv(w.uSystemRotation,!1,m.systemRotation),w.uTime&&i.uniform1f(w.uTime,this.time),w.uDeltaTime&&i.uniform1f(w.uDeltaTime,1/60),w.uCameraPos&&i.uniform3fv(w.uCameraPos,e.eye),w.uRecolor&&i.uniformMatrix3fv(w.uRecolor,!1,this.recolorNow());for(const p of(x==null?void 0:x.uniforms)||[])w[p.name]&&yi(i,w[p.name],p.type,p.value,"float");const v=(p,b)=>{w[p]&&(i.activeTexture(i.TEXTURE0+g),i.bindTexture(i.TEXTURE_2D,b),i.uniform1i(w[p],g),g++)};v("uWhite",Gt(i));for(const p of(x==null?void 0:x.textures)||[])v(p.name,this.asset.textures.get(p.key)||Gt(i));if(!(x!=null&&x.blend))i.disable(i.BLEND),i.depthMask(!0);else{i.enable(i.BLEND);const p=i;i.blendFuncSeparate(p[x.blend.src]??i.SRC_ALPHA,p[x.blend.dst]??i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE),i.depthMask(!!x.depthWrite)}i.disable(i.CULL_FACE),i.activeTexture(i.TEXTURE0+g),i.bindTexture(i.TEXTURE_2D_ARRAY,h.texture),i.uniform1i(w.uTrailHistory,g),i.uniform1i(w.uTrailHead,h.head),i.uniform1i(w.uTrailCount,h.count);for(let p=0;p<h.points;p++)h.ages[p]=this.time-h.times[(h.head-p+h.points)%h.points];i.uniform1fv(w.uTrailAge,h.ages),i.bindVertexArray(o.trailVao(c.ps,this.slot)),i.drawArraysInstanced(i.TRIANGLE_STRIP,0,pr(m.trail),l.capacity),r++}return i.bindVertexArray(null),r}dispose(){const e=this.gl;this.park();for(const t of this.states)t.trail&&e.deleteTexture(t.trail.texture);this.states.length=0,this.stateOf.clear()}stats(){return this.asset.systems.map(e=>({name:e.name,capacity:e.capacity}))}recordTrail(e,t){if(this.time-t.last<t.interval*.999)return;const i=this.gl;t.last=this.time,t.head=(t.head+1)%t.points,t.count=Math.min(t.count+1,t.points),t.times[t.head]=this.time;const o=e.sys.capacity*e.sys.slots,r=Math.floor(o/tt),s=o-r*tt,n=this.asset.pool.offset(e.ps,this.slot);i.bindBuffer(i.PIXEL_UNPACK_BUFFER,e.ps.buffers[e.ps.current]),i.bindTexture(i.TEXTURE_2D_ARRAY,t.texture),r&&i.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,t.head,tt,r,1,i.RGBA_INTEGER,i.UNSIGNED_INT,n),s&&i.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,r,t.head,s,1,1,i.RGBA_INTEGER,i.UNSIGNED_INT,n+r*tt*16),i.bindBuffer(i.PIXEL_UNPACK_BUFFER,null)}bindUniforms(e,t,i){const o=this.gl;let r=0;o.activeTexture(o.TEXTURE0),o.bindTexture(o.TEXTURE_2D,this.asset.bakeTexture),e.locations.bakedTexture&&o.uniform1i(e.locations.bakedTexture,r),r++;for(const s of t){const n=i.def.stages[s];if(n){for(const u of n.uniforms){const l=e.locations[u.name];!l||u.expr===null||yi(o,l,u.type,this.values[u.expr],this.asset.exprTypes[u.expr])}for(const u of n.textures){const l=e.locations[u.name];if(!l)continue;const c=u.expr!==null?this.values[u.expr]:null;o.activeTexture(o.TEXTURE0+r),u.type==="sampler3D"?o.bindTexture(o.TEXTURE_3D,this.asset.texture3D(c)):o.bindTexture(o.TEXTURE_2D,this.asset.textures.get(c)||Fi(o)),o.uniform1i(l,r),r++}}}return r}runSpawner(e,t,i){let o=0;const r=e.def.tasks;for(let s=0;s<r.length;s++){const n=r[s];if(n.kind==="constantRate"){e.acc+=Math.max(0,Number(this.values[n.values.Rate])||0)*t*i;const u=Math.floor(e.acc);e.acc-=u,o+=u}else if(n.kind==="periodicBurst"||n.kind==="burst"){const u=n.values.nb??n.values.Count??n.values.count,l=n.values.period??n.values.delay??n.values.Delay;if(e.timers[s]===null&&(e.timers[s]=0),e.timers[s]-=t,e.timers[s]<=0){if(n.kind==="burst"&&e.timers[s]===-1/0)continue;o+=Math.max(0,Math.round(to(this.values[u])*i)),e.timers[s]=n.kind==="burst"?-1/0:Math.max(.001,to(this.values[l])||1)}}}return o}}function Mr(a,e){var s,n,u;const t=e.def,i=t.output;if(a.effect.kind!=="shuriken"||t.anchor||i!=null&&i.beam||i!=null&&i.vat||i!=null&&i.trail||(s=t.spawner)!=null&&s.prewarm)return 1/0;const o=Number(t.maxLifetime);if(!(o>0)||!Number.isFinite(o))return 1/0;const r=t.spawnFromEvent?a.effect.systems[t.spawnFromEvent.system]:void 0;return o/(((n=t.spawner)==null?void 0:n.simulationSpeed)||((u=r==null?void 0:r.spawner)==null?void 0:u.simulationSpeed)||1)+.1}async function Sr(a,e,t={}){var c,d,h,m,g,w,x;const i=await(await fetch(e)).json(),o=new URL(e,((c=globalThis.location)==null?void 0:c.href)??"http://localhost/"),r=t.resolve??(v=>new URL(v,o).href),s=new Map,n=v=>{var p,b;return!!((b=(p=i.textureInfo)==null?void 0:p[v])!=null&&b.srgb)},u=new Set(i.expressions.filter(v=>v.op==="Value"&&v.type==="texture"&&v.value).map(v=>v.value));for(const v of i.systems)for(const p of[...((h=(d=v.output)==null?void 0:d.material)==null?void 0:h.textures)||[],...((w=(g=(m=v.output)==null?void 0:m.trail)==null?void 0:g.material)==null?void 0:w.textures)||[]])p.key&&u.add(p.key);await Promise.all([...u].map(async v=>{var p,b;v==="default-particle.png"?s.set(v,Fi(a)):v.startsWith("missing:")?s.set(v,null):s.set(v,await Xr(a,r(v),n(v),!!((b=(p=i.textureInfo)==null?void 0:p[v])!=null&&b.nearest)))}));const l=new Map;for(const v of i.systems){const p=(x=v.output)==null?void 0:x.mesh;p&&!l.has(p)&&l.set(p,await(await fetch(r(p))).json())}return new Fr(a,i,{textures:s,meshes:l,maxCapacity:t.maxCapacity})}function Mo(a,e){let t=null,i=null;for(const r of a.systems){const s=r.def.bounds,n=(s==null?void 0:s.center)!=null?e[s.center]:null,u=(s==null?void 0:s.size)!=null?e[s.size]:null;if(!Array.isArray(n)||!Array.isArray(u))continue;const l=n.map((d,h)=>d-u[h]/2),c=n.map((d,h)=>d+u[h]/2);t=t?t.map((d,h)=>Math.min(d,l[h])):l,i=i?i.map((d,h)=>Math.max(d,c[h])):c}if(!t||!i)return null;const o=i;return{center:t.map((r,s)=>(r+o[s])/2),size:o.map((r,s)=>r-t[s])}}function Ji(a){const e={};for(const t of a)Object.assign(e,t.defines);return e}function Qi(a,e,t){const i=(g,w,x)=>g.replace(new RegExp(`uniform ${w} ${x};`),`${w} ${x};`),o=(g,w)=>new RegExp(`\\b${w}\\b`).test(g),r=a.indexOf("void main() {"),s=e.indexOf("void main() {");if(r<0||s<0)throw new Error(`${t.name}: render shader without main`);let n=i(i(i(i(a,"mat3","vfxViewRot"),"vec3","vfxViewPosition"),"mat4","uModel"),"float","uVatTime");const u=t.draw.fields.filter(g=>o(a.slice(0,r),`uniform ${g.type} ${g.name};`.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"))||a.includes(`uniform ${g.type} ${g.name};`));for(const g of u)n=i(n,g.type,g.name);const l=[ai.vsDecls,n.includes("float uTime;")||/uniform float uTime;/.test(n)?"":"float uTime;",n.includes("float uVatTime;")?"":"float uVatTime;"].filter(Boolean).join(`
`);n=n.replace(He,`${He}${l}
`);const c=[ai.vsLoads,...u.map(g=>`  ${g.name} = ${bi(g,"uDrawRows")};`)].join(`
`);n=n.replace("void main() {",`void main() {
${c}`);let d=i(i(i(e,"vec4","uFxTint"),"mat3","uRecolor"),"float","uTime");const h=t.draw.fields.filter(g=>t.animated.some(w=>w.name===g.name)&&e.includes(`uniform ${g.type} ${g.name};`));for(const g of h)d=i(d,g.type,g.name);const m=["  int inst = int(vRow + 0.5);","  uFxTint = uintBitsToFloat(texelFetch(uDrawRows, ivec2(uDrawFixed + 3, inst), 0));",...o(e,"uRecolor")?["  uRecolor = mat3(uintBitsToFloat(texelFetch(uDrawRows, ivec2(uDrawFixed + 4, inst), 0).xyz), uintBitsToFloat(texelFetch(uDrawRows, ivec2(uDrawFixed + 5, inst), 0).xyz), uintBitsToFloat(texelFetch(uDrawRows, ivec2(uDrawFixed + 6, inst), 0).xyz));"]:[],...o(e,"uTime")?["  uTime = uintBitsToFloat(texelFetch(uDrawRows, ivec2(uDrawFixed + 10, inst), 0).w);"]:[],...h.map(g=>`  ${g.name} = ${bi(g,"uDrawRows")};`)].join(`
`);return d=d.replace(He,`${He}${ai.fsDecls}
`),d=d.replace("void main() {",`void main() {
${m}`),{vs:n,fs:d}}function Dr(a){const e=[];for(const t of a)for(const i of t.textures)e.push(`uniform ${i.type} ${i.name};`);return[...new Set(e)].join(`
`)}function eo(a){const e=[];for(const t of a){for(const i of t.uniforms)e.push(`uniform ${i.type} ${i.name};`);for(const i of t.textures)e.push(`uniform ${i.type} ${i.name};`)}return[...new Set(e)].join(`
`)}function si(a,e){const t=Array.from({length:$t[e.type]},(i,o)=>{const r=e.offset+o;return`${a}${r>>2}.${"xyzw"[r&3]}`});return So(e.type,t)}function So(a,e){if(a==="bool")return`(${e[0]} != 0u)`;if(/^(uint|uvec)/.test(a))return e.length===1?e[0]:`${a}(${e.join(", ")})`;if(/^(int|ivec)/.test(a))return e.length===1?`int(${e[0]})`:`${a}(${e.map(i=>`int(${i})`).join(", ")})`;const t=e.map(i=>`uintBitsToFloat(${i})`);return t.length===1?t[0]:`${a}(${t.join(", ")})`}function Cr(a,e){const t=new Array(a.slots*4).fill("0u");for(const i of a.layout){const o=$t[i.type];for(let r=0;r<o;r++){const s=i.counter?i.counter.replace(/^__/,""):`attributes.${i.name}${o>1?`.${"xyzw"[r]}`:""}`;t[i.offset+r]=i.counter?s:i.type==="bool"?`(${s} ? 1u : 0u)`:/^(uint|uvec)/.test(i.type)?s:/^(int|ivec)/.test(i.type)?`uint(${s})`:`floatBitsToUint(${s})`}}return Array.from({length:a.slots},(i,o)=>`  ${e}${o} = uvec4(${t.slice(o*4,o*4+4).join(", ")});`).join(`
`)}function yi(a,e,t,i,o){if(i==null)return;const r=(n,u)=>{const l=new ArrayBuffer(4);return u?(new Uint32Array(l)[0]=n>>>0,new Float32Array(l)[0]):(new Float32Array(l)[0]=n,new Uint32Array(l)[0])},s=o==="uint"||o==="int";switch(t){case"float":a.uniform1f(e,s?r(i,!0):i);break;case"vec2":a.uniform2fv(e,i);break;case"vec3":a.uniform3fv(e,i);break;case"vec4":a.uniform4fv(e,i);break;case"uint":a.uniform1ui(e,s?i>>>0:r(i,!1));break;case"int":a.uniform1i(e,s?i|0:r(i,!1)|0);break;case"bool":a.uniform1i(e,i?1:0);break;case"mat4":a.uniformMatrix4fv(e,!1,i);break;case"mat3":a.uniformMatrix3fv(e,!1,i);break}}function Do(a,e){const t=a.expressions[e];if(t.op==="Value")return t.type??"float";if(/^Bitwise|ToUint$|^SystemSeed$|^FrameIndex$/.test(t.op))return"uint";if(/ToInt$/.test(t.op))return"int";if(t.op==="ExtractComponent"||/^(Abs|Sign|Min|Max|Add|Subtract|Mul|Divide)$/.test(t.op)){const i=Do(a,t.args[0]);return i==="uint"||i==="int"?i:"float"}return"float"}function to(a){return Array.isArray(a)?a[0]+Math.random()*((a[1]??a[0])-a[0]):a}function Pr(a,e){const t=new Float32Array(16);for(let i=0;i<4;i++)for(let o=0;o<4;o++){let r=0;for(let s=0;s<4;s++)r+=a[s*4+o]*e[i*4+s];t[i*4+o]=r}return t}const Ur=["init","update"],kr=[0,0,0],ni=[0,0,0],zr=[0,0,0],Ir=[0,0,0],Lr=[0,0,0],Vr=[0,0,0];function li(a,e,t,i){return a[0]=e,a[1]=t,a[2]=i,a}function Br(a,e){const[t,i,o,r]=[e[0],e[1],e[2],e[3]],s=2*(i*a[2]-o*a[1]),n=2*(o*a[0]-t*a[2]),u=2*(t*a[1]-i*a[0]);return[a[0]+r*s+(i*u-o*n),a[1]+r*n+(o*s-t*u),a[2]+r*u+(t*n-i*s)]}const Ti=new WeakMap,Ei=new WeakMap,Nr=(a,e)=>Ti.get(a)===e||Ei.get(a)===e;function Fi(a){const e=Ti.get(a);if(e)return e;const t=64,i=new Uint8Array(t*t*4);for(let r=0;r<t;r++)for(let s=0;s<t;s++){const n=(s+.5)/t*2-1,u=(r+.5)/t*2-1,l=Math.min(1,Math.hypot(n,u));i.set([255,255,255,Math.round(Math.pow(1-l,1.6)*255)],(r*t+s)*4)}const o=a.createTexture();return a.bindTexture(a.TEXTURE_2D,o),a.texImage2D(a.TEXTURE_2D,0,a.RGBA8,t,t,0,a.RGBA,a.UNSIGNED_BYTE,i),a.generateMipmap(a.TEXTURE_2D),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.LINEAR_MIPMAP_LINEAR),Ti.set(a,o),o}function Or(a,e=16){const t=new Uint8Array(e*e*e*4);for(let o=0;o<e;o++)for(let r=0;r<e;r++)for(let s=0;s<e;s++){const[n,u,l]=[s/e,r/e,o/e].map(d=>d*Math.PI*2),c=[Math.sin(u*1.3+l)*Math.cos(n),Math.sin(l*1.7+n)*Math.cos(u),Math.sin(n*1.1+u)*Math.cos(l)];t.set([...c.map(d=>Math.round((d*.5+.5)*255)),255],((o*e+r)*e+s)*4)}const i=a.createTexture();a.bindTexture(a.TEXTURE_3D,i),a.texImage3D(a.TEXTURE_3D,0,a.RGBA8,e,e,e,0,a.RGBA,a.UNSIGNED_BYTE,t),a.texParameteri(a.TEXTURE_3D,a.TEXTURE_MIN_FILTER,a.LINEAR),a.texParameteri(a.TEXTURE_3D,a.TEXTURE_MAG_FILTER,a.LINEAR);for(const o of[a.TEXTURE_WRAP_S,a.TEXTURE_WRAP_T,a.TEXTURE_WRAP_R])a.texParameteri(a.TEXTURE_3D,o,a.REPEAT);return i}function Gt(a){let e=Ei.get(a);return e||(e=a.createTexture(),a.bindTexture(a.TEXTURE_2D,e),a.texImage2D(a.TEXTURE_2D,0,a.RGBA8,1,1,0,a.RGBA,a.UNSIGNED_BYTE,new Uint8Array([255,255,255,255])),Ei.set(a,e)),e}async function Xr(a,e,t,i=!1){const o=await createImageBitmap(await(await fetch(e)).blob(),{imageOrientation:"flipY",premultiplyAlpha:"none",colorSpaceConversion:"none"}),r=a.createTexture();return a.bindTexture(a.TEXTURE_2D,r),a.texImage2D(a.TEXTURE_2D,0,t?a.SRGB8_ALPHA8:a.RGBA8,a.RGBA,a.UNSIGNED_BYTE,o),i?(a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.NEAREST),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MAG_FILTER,a.NEAREST)):(a.generateMipmap(a.TEXTURE_2D),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.LINEAR_MIPMAP_LINEAR)),o.close(),r}const $r={enabled:!0,quality:1,maxCapacity:5e4,lights:!0,lightScale:1,cull:!0,cullRadius:6,cullPixels:3};function Gr(a,e,t,i){const o=t[5]*i/2;return t[15]===1?a*o:a*o/Math.max(1e-6,e)}class Wr{constructor(e){f(this,"settings",{...$r});f(this,"speed",1);f(this,"instances",[]);f(this,"assets",new Map);f(this,"pools",new Map);f(this,"lives",new Map);f(this,"once",new WeakSet);f(this,"reach",new Map);f(this,"planes",new Float32Array(24));f(this,"culled",0);f(this,"passes",0);this.gl=e}load(e,t={}){let i=this.assets.get(e);return i||(i=Sr(this.gl,e,{maxCapacity:this.settings.maxCapacity,...t}),this.assets.set(e,i),i.catch(()=>this.assets.delete(e))),i}play(e,t={}){const i=!!t.once,o=this.pools.get(e),r=(o==null?void 0:o.findIndex(n=>this.once.has(n)===i))??-1;let s;o&&r>=0?(s=o.splice(r,1)[0],s.reset(Math.random()*4294967295),s.overrides.clear()):(s=new _r(e,{once:i}),i&&this.once.add(s)),s.position=t.position?[t.position[0],t.position[1],t.position[2]]:[0,0,0],s.rotation=t.rotation?[...t.rotation]:t.yaw!==void 0?[0,Math.sin(t.yaw/2),0,Math.cos(t.yaw/2)]:[0,0,0,1],s.scale=t.scale??1,s.tint=t.tint?[...t.tint]:[1,1,1,1],s.recolor=t.recolor?[...t.recolor]:null,s.density=Math.max(0,t.density??1);for(const[n,u]of Object.entries(t.params??{}))s.setParam(n,u);return t.life!==void 0?this.lives.set(s,t.life):this.lives.delete(s),this.instances.push(s),s}release(e){const t=this.instances.indexOf(e);if(t<0)return;this.instances.splice(t,1),this.lives.delete(e),e.park();let i=this.pools.get(e.asset);i||this.pools.set(e.asset,i=[]),i.push(e)}clear(){for(const e of this.instances)e.dispose();for(const e of this.pools.values())for(const t of e)t.dispose();this.instances.length=0,this.pools.clear(),this.lives.clear()}update(e,t){if(!this.settings.enabled||(e*=Math.max(0,this.speed),e<=0))return;const i=Math.max(0,Math.min(1,this.settings.quality)),o=t&&this.settings.cull?this.culler(t):null,r=new Set;for(const s of this.instances)r.add(s.asset);for(const s of r)s.pool.beginFrame();this.culled=0;for(const s of this.instances){const n=this.settings.visibleAt;s.veil=n?Math.max(0,Math.min(1,n(s.position[0],s.position[1],s.position[2]))):1,s.hidden=!!o&&o(s)||s.veil<=0,s.hidden?(s.idle(e),this.culled++):s.advance(e,i*s.density)}this.passes=0;for(const s of r)s.pool.simulate(n=>s.bindSimTextures(n)),this.passes+=s.pool.passes;for(const s of[...this.instances]){s.hidden||s.afterSimulate();const n=this.lives.get(s);(s.done||n!==void 0&&s.time>=n)&&this.release(s)}}culler(e){const t=lt(de(e.projection,e.view),this.planes),i=e.view,o=this.settings.cullPixels;return r=>{const s=this.reachOf(r.asset)*r.scale;if(!Number.isFinite(s))return!1;const[n,u,l]=r.position;for(let c=0;c<6;c++)if(t[c*4]*n+t[c*4+1]*u+t[c*4+2]*l+t[c*4+3]<-s)return!0;if(o>0){const c=-(i[2]*n+i[6]*u+i[10]*l+i[14]);if(c>s&&Gr(s,c,e.projection,e.viewport[1])<o)return!0}return!1}}reachOf(e){let t=this.reach.get(e);if(t===void 0){if(e.effect.systems.some(i=>{var o;return((o=i.output)==null?void 0:o.beam)||i.anchor}))t=1/0;else{const i=e.bounds();t=i?Math.hypot(i.center[0],i.center[1],i.center[2])+Math.hypot(i.size[0],i.size[1],i.size[2])/2:this.settings.cullRadius,t=t*1.2+.5}this.reach.set(e,t)}return t}draw(e){var s;if(!this.settings.enabled||!this.instances.length)return 0;const t=this.gl;t.enable(t.DEPTH_TEST),t.depthFunc(t.LEQUAL);const i=de(e.projection,e.view),o=[];for(const n of this.instances)n.hidden||(o.includes(n.asset)||(o.push(n.asset),n.asset.pool.beginDraw()),n.stageDraw(e));let r=0;for(const n of o){const u=n.pool;u.uploadDraw();for(const l of n.drawOrder){if(!l.render)continue;const c=u.systemOf(l);if(c.drawActive)if((s=l.def.output)!=null&&s.beam)for(const d of this.instances)!d.hidden&&d.asset===n&&d.rowOnFor(l)&&(r+=n.drawSystem(l,c,e,i,d.slot,l.capacity,u.drawVao(c,d.slot),d.beamOf(l)));else r+=n.drawSystem(l,c,e,i,0,c.drawActive*l.capacity,u.drawVaoAll(c),null)}}for(const n of this.instances)n.hidden||(r+=n.drawTrails(e,i));return t.bindVertexArray(null),t.depthFunc(t.LESS),t.depthMask(!0),t.disable(t.BLEND),t.enable(t.CULL_FACE),t.cullFace(t.BACK),t.activeTexture(t.TEXTURE0),r}lights(e){if(!(!this.settings.enabled||!this.settings.lights))for(const t of this.instances)t.lights(e,this.settings.lightScale)}get count(){return this.instances.length}}const Hr={enabled:!0,strength:1},jr=[{dir:[1,0,0],up:[0,-1,0]},{dir:[-1,0,0],up:[0,-1,0]},{dir:[0,1,0],up:[0,0,1]},{dir:[0,-1,0],up:[0,0,-1]},{dir:[0,0,1],up:[0,-1,0]},{dir:[0,0,-1],up:[0,-1,0]}];class Yr{constructor(e,t=64){f(this,"texture");f(this,"fbo");f(this,"mips");f(this,"invViewProj",[]);this.gl=e,this.size=t;const i=e.createTexture(),o=e.createFramebuffer();if(!i||!o)throw new Error("env map allocation failed");this.texture=i,this.fbo=o,this.mips=Math.floor(Math.log2(t)),e.bindTexture(e.TEXTURE_CUBE_MAP,i);for(let s=0;s<6;s++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+s,0,e.RGBA16F,t,t,0,e.RGBA,e.HALF_FLOAT,null);e.texParameteri(e.TEXTURE_CUBE_MAP,e.TEXTURE_MIN_FILTER,e.LINEAR_MIPMAP_LINEAR),e.texParameteri(e.TEXTURE_CUBE_MAP,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_CUBE_MAP,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_CUBE_MAP,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.bindTexture(e.TEXTURE_CUBE_MAP,null);const r=mo(Math.PI/2,1,.1,10);for(const s of jr)this.invViewProj.push(Qe(de(r,Ht([0,0,0],s.dir,s.up))))}bindFace(e){const t=this.gl;t.bindFramebuffer(t.FRAMEBUFFER,this.fbo),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+e,this.texture,0),t.viewport(0,0,this.size,this.size)}finish(){const e=this.gl;e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindTexture(e.TEXTURE_CUBE_MAP,this.texture),e.generateMipmap(e.TEXTURE_CUBE_MAP),e.bindTexture(e.TEXTURE_CUBE_MAP,null)}bind(e){const t=this.gl;t.activeTexture(t.TEXTURE0+e),t.bindTexture(t.TEXTURE_CUBE_MAP,this.texture)}}const qr=30;function Kr(a){const e=a.eye();if(a.target)return{focus:a.target,distance:a.distance??Math.hypot(a.target[0]-e[0],a.target[1]-e[1],a.target[2]-e[2])};const t=a.view(),i=a.distance??qr;return{focus:[e[0]-t[2]*i,e[1]-t[6]*i,e[2]-t[10]*i],distance:i}}const It=64,Zr=4096;function Jr(){return{keys:new Float64Array(256),counts:new Int32Array(It+1),tmp:[]}}function Qr(a,e,t){const i=a.length;t.keys.length<i&&(t.keys=new Float64Array(i*2));const o=t.keys;let r=1/0,s=-1/0;for(let c=0;c<i;c++){const d=a[c].model,h=(d[12]-e[0])**2+(d[13]-e[1])**2+(d[14]-e[2])**2;o[c]=h,h<r&&(r=h),h>s&&(s=h)}if(!(s>r)||!Number.isFinite(s-r))return;const n=t.counts;n.fill(0);const u=It/(s-r);for(let c=0;c<i;c++){const d=Math.max(0,Math.min(It-1,(o[c]-r)*u|0));o[c]=d,n[d+1]++}for(let c=0;c<It;c++)n[c+1]+=n[c];const l=t.tmp;l.length=i;for(let c=0;c<i;c++)l[n[o[c]]++]=a[c];for(let c=0;c<i;c++)a[c]=l[c];l.length=0}function Dt(a){if(a.size>Zr){a.clear();return}for(const e of a.values())e.length=0}const es={scorch:0,rust:1},io=15,oo=a=>a.cutoff>0&&a.albedo&&!a.albedo.loaded?1e6:a.cutoff;function wt(a,e=!1,t=a&&e){return`#version 300 es
layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec3 aNormal;
layout(location = 2) in vec3 aColor;
layout(location = 3) in vec2 aUv;
${t?po:a?`layout(location = 4) in vec4 aModel0;
layout(location = 5) in vec4 aModel1;
layout(location = 6) in vec4 aModel2;
layout(location = 7) in vec4 aModel3;
layout(location = 8) in vec3 aTint;`:`uniform mat4 uModel;
uniform mat3 uNormal;`}
${t?"// (Not `flat`: a copy's vertices all carry the same value, so it interpolates to itself; a flat varying costs the fragment stage 2.7× under ANGLE/D3D11 on an RTX 4080.)\nout vec4 vInst;":""}
uniform mat4 uProjection;
uniform mat4 uView;
uniform mat4 uLightVP0;
uniform mat4 uLightVP1;
uniform mat4 uLightVP2;
uniform vec3 uShadowOffset;
${e?Ri:""}
out vec3 vNormal;
out vec3 vColor;
out vec3 vWorld;
out vec3 vLocal;
out vec2 vUv;
out vec4 vShadow0;
out vec4 vShadow1;
out vec4 vShadow2;
void main() {
${t?`  int crowdI = uCrowdBase + gl_InstanceID;
  mat4 model = crowdModel(crowdI);
  mat3 nrm = mat3(normalize(model[0].xyz), normalize(model[1].xyz), normalize(model[2].xyz));
  vec3 tint = vec3(1.0);
  vInst = crowdInst(crowdI);`:a?`  mat4 model = mat4(aModel0, aModel1, aModel2, aModel3);
  mat3 nrm = mat3(normalize(model[0].xyz), normalize(model[1].xyz), normalize(model[2].xyz));
  vec3 tint = aTint;`:`  mat4 model = uModel;
  mat3 nrm = uNormal;
  vec3 tint = vec3(1.0);`}
${e?`  mat4 skin = skinMatrix(${t?"int(vInst.x + 0.5)":"uJointBase"});
  vec4 local = skin * vec4(aPosition, 1.0);
  vec3 localNormal = mat3(skin) * aNormal;`:`  vec4 local = vec4(aPosition, 1.0);
  vec3 localNormal = aNormal;`}
  vec4 world = model * local;
  vWorld = world.xyz;
  vLocal = aPosition;
  vNormal = normalize(nrm * localNormal);
  vColor = aColor * tint;
  vUv = aUv;
  // Normal offset: push the lookup along the normal by about a texel of each cascade, so flat
  // ground stops shadowing itself without the shadow pulling away from the caster's feet.
  vShadow0 = uLightVP0 * vec4(world.xyz + vNormal * uShadowOffset.x, 1.0);
  vShadow1 = uLightVP1 * vec4(world.xyz + vNormal * uShadowOffset.y, 1.0);
  vShadow2 = uLightVP2 * vec4(world.xyz + vNormal * uShadowOffset.z, 1.0);
  gl_Position = uProjection * uView * world;
}`}const ao=`#version 300 es
precision highp float;
#define MAX_PER_TILE ${gi}
#define LIGHT_TEXELS ${dt}
in vec3 vNormal;
in vec3 vColor;
in vec3 vWorld;
in vec3 vLocal;
in vec2 vUv;
in vec4 vShadow0;
in vec4 vShadow1;
in vec4 vShadow2;
uniform sampler2D uShadow0;
uniform sampler2D uShadow1;
uniform sampler2D uShadow2;
uniform int uCascades;
uniform float uShadowTexel;
uniform float uShadowStrength;
uniform float uShadowSoft;
uniform float uLightSize;
uniform vec3 uSunDir;
uniform vec3 uSunColor;
uniform float uSunIntensity;
uniform vec3 uSkyColor;
uniform vec3 uGroundColor;
uniform samplerCube uEnv;
uniform float uEnvStrength;
uniform float uEnvMips;
uniform vec4 uFadeRect;
uniform float uFadeDist;
uniform vec4 uFadeColor; // rgb: what outside the fade rectangle melts into, w: 1 to use it (else the fog's colour)
uniform float uNearFade; // things nearer the eye than this fade out (screen-door), 0: never
uniform float uAmbient;
uniform float uExposure;
uniform float uToneMap;
uniform vec3 uFogColor;
uniform vec2 uFogRange;
uniform vec3 uEye;
uniform float uClipY; // below this height nothing draws (the reflection pass; a huge negative otherwise)
uniform sampler2D uLights;
uniform highp usampler2D uTiles;
uniform vec2 uTileInfo; // tiles across, tile size in pixels
uniform sampler2D uAlbedo;
uniform float uTransparent;
uniform float uOpacity;
uniform sampler2D uMetalRough;
uniform sampler2D uNormalMap;
uniform float uHasMetalRough;
uniform float uHasNormal;
uniform vec3 uMatColor;
uniform float uUvScale;
uniform float uMetallic;
uniform float uRoughness;
uniform vec3 uEmissive;
uniform sampler2D uEmissiveMap;
uniform float uEmissiveMapState; // 0 no map, 1 the map is up, 2 a map still loading (no glow yet)
uniform vec4 uTint;  // rgb multiplier, a = how much
uniform vec2 uFadeGrey; // x: how much of it shows (screen-door, 1 all), y: how grey (0 none)
uniform vec3 uGlow;
uniform float uEmissiveScale; // an instance's own brightness for its emission (1: the material's)
uniform vec4 uWear;  // amount, kind (0 scorch, 1 rust), blotches per mesh unit, seed
uniform float uSplatOn;
uniform sampler2D uSplatCells;
uniform mediump sampler2DArray uSplatLayers;
uniform vec2 uSplatSize;
uniform float uSplatLevelH;
uniform float uSplatCliff;
uniform float uSplatNoise;
uniform float uSplatSharp;
uniform vec3 uSplatTint[${ot}];
uniform float uSplatRough[${ot}];
uniform float uSplatOutLayer;
uniform float uSplatOutDist;
uniform float uSplatGrid;
uniform float uSplatGridWidth;
uniform float uSplatGridOpacity;
uniform mediump sampler2DArray uSurfLayers; // per layer: RGB tangent-space normal, A roughness (splat.ts SurfaceArray)
uniform float uSurfOn;
uniform float uSurfBump;
uniform float uSurfRough;
uniform float uCloudShadow;
uniform float uFogVolShadow;
uniform float uCutoff;
${go}
${wo}
${na}
// How much sun gets through the clouds to p: each layer's cloud straight up the sun's direction
// from it (at the layer's middle), the shadows of the layers multiplying.
float cloudShade(vec3 p, vec3 l) {
  if (uCloudShadow <= 0.0 || l.y <= 0.02) return 1.0;
  float s = 1.0;
  for (int i = 0; i < CLOUD_LAYERS; i++) {
    vec4 C = uCloudC[i];
    if (C.x < 0.5 || C.w <= 0.0) continue;
    float mid = uCloudA[i].y + uCloudA[i].z * 0.5;
    if (p.y >= mid) continue;
    vec2 xz = p.xz + l.xz * ((mid - p.y) / l.y);
    s *= 1.0 - C.w * smoothstep(0.12, 0.5, cloudCover(xz, i));
  }
  return s;
}
out vec4 outColor;

const float PI = 3.14159265;

// Terrain splatting (splat.ts): up to SPLAT_MAX layers on the map, blended from the cells around the pixel.
float splatHash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float splatNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(splatHash(i), splatHash(i + vec2(1.0, 0.0)), f.x), mix(splatHash(i + vec2(0.0, 1.0)), splatHash(i + vec2(1.0, 1.0)), f.x), f.y);
}
// Up to SPLAT_MAX layers on the map, but only the four cells around a pixel have a say, so a
// pixel blends at most four: each "slot" holds one layer id (ids, -1 empty) and its weight.
void splatAdd(inout ivec4 ids, inout vec4 acc, int layer, float wt) {
  for (int s = 0; s < 4; s++) {
    if (ids[s] == layer) { acc[s] += wt; return; }
  }
  for (int s = 0; s < 4; s++) {
    if (ids[s] < 0) { ids[s] = layer; acc[s] = wt; return; }
  }
  // All four taken by others: replace the weakest if this one counts for more.
  int m = 0;
  for (int s = 1; s < 4; s++) if (acc[s] < acc[m]) m = s;
  if (wt > acc[m]) { ids[m] = layer; acc[m] = wt; }
}
vec4 splatWeights(vec3 w, out ivec4 ids) {
  vec2 p = w.xz - 0.5;
  vec2 i = floor(p);
  vec2 f = fract(p);
  ids = ivec4(-1);
  vec4 acc = vec4(0.0);
  for (int k = 0; k < 4; k++) {
    vec2 o = vec2(float(k & 1), float(k >> 1));
    ivec2 c = ivec2(clamp(i + o, vec2(0.0), uSplatSize - 1.0));
    vec4 t = texelFetch(uSplatCells, c, 0) * 255.0;
    float dy = w.y - t.b * uSplatLevelH;
    // A cell far below this point is across a cliff: it has no say up here.
    if (dy > uSplatCliff) continue;
    float bw = mix(1.0 - f.x, f.x, o.x) * mix(1.0 - f.y, f.y, o.y);
    // Well below the cell's top (under its rim, at its cliff foot): the ground under it.
    if (dy < -uSplatCliff) {
      splatAdd(ids, acc, int(t.g + 0.5), bw);
      continue;
    }
    // Its top, with the layer mixed into it (the texel below, in the map's second half) in its share.
    vec4 mx = texelFetch(uSplatCells, c + ivec2(0, int(uSplatSize.y)), 0) * 255.0;
    float m = mx.g / 255.0;
    splatAdd(ids, acc, int(t.r + 0.5), bw * (1.0 - m));
    if (m > 0.0) splatAdd(ids, acc, int(mx.r + 0.5), bw * m);
  }
  if (acc.x + acc.y + acc.z + acc.w < 1e-4) {
    vec4 t = texelFetch(uSplatCells, ivec2(clamp(floor(w.xz), vec2(0.0), uSplatSize - 1.0)), 0) * 255.0;
    ids = ivec4(int(t.r + 0.5), -1, -1, -1);
    acc = vec4(1.0, 0.0, 0.0, 0.0);
  }
  // Off the map: ease into one layer, so the edge cells' layers don't streak out to the horizon.
  if (uSplatOutDist > 0.0) {
    vec2 past = max(-w.xz, w.xz - uSplatSize);
    float k = smoothstep(0.0, uSplatOutDist, max(past.x, past.y));
    acc = acc / max(acc.x + acc.y + acc.z + acc.w, 1e-5) * (1.0 - k);
    if (k > 0.0) splatAdd(ids, acc, int(uSplatOutLayer + 0.5), k);
  }
  // Ragged borders: each present layer's weight wobbles with its own noise, so a border bulges
  // one way here and the other way there; then the weights are sharpened and normalised.
  for (int s = 0; s < 4; s++) {
    if (acc[s] <= 0.0) continue;
    float l = float(ids[s]);
    vec2 q = w.xz + vec2(l * 17.31, l * 9.73);
    float n = splatNoise(q * 1.7) * 0.65 + splatNoise(q * 4.1) * 0.35 - 0.5;
    acc[s] = max(acc[s] + n * uSplatNoise, 0.0);
  }
  acc = pow(acc, vec4(uSplatSharp));
  return acc / max(acc.x + acc.y + acc.z + acc.w, 1e-5);
}

// GGX / Schlick / Smith: the usual Cook-Torrance terms.
float D_GGX(float NoH, float a) {
  float a2 = a * a;
  float d = NoH * NoH * (a2 - 1.0) + 1.0;
  return a2 / (PI * d * d);
}
float G_Smith(float NoV, float NoL, float a) {
  float k = (a + 1.0) * (a + 1.0) / 8.0;
  return (NoV / (NoV * (1.0 - k) + k)) * (NoL / (NoL * (1.0 - k) + k));
}
vec3 F_Schlick(float VoH, vec3 f0) {
  return f0 + (1.0 - f0) * pow(1.0 - VoH, 5.0);
}
// Value noise in 3D (for wear): smooth, about -0..1, period-free enough at these scales.
float hash31(vec3 p) {
  p = fract(p * 0.3183099 + vec3(0.71, 0.113, 0.419));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}
float vnoise3(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash31(i), hash31(i + vec3(1, 0, 0)), u.x), mix(hash31(i + vec3(0, 1, 0)), hash31(i + vec3(1, 1, 0)), u.x), u.y),
             mix(mix(hash31(i + vec3(0, 0, 1)), hash31(i + vec3(1, 0, 1)), u.x), mix(hash31(i + vec3(0, 1, 1)), hash31(i + vec3(1, 1, 1)), u.x), u.y), u.z);
}
float wearNoise(vec3 p) {
  return vnoise3(p) * 0.55 + vnoise3(p * 2.3 + 7.1) * 0.3 + vnoise3(p * 5.7 + 3.3) * 0.15;
}

// Poisson disk for the soft filter, rotated per pixel by an interleaved gradient noise.
const vec2 POISSON[12] = vec2[12](vec2(-0.326, -0.406), vec2(-0.840, -0.074), vec2(-0.696, 0.457), vec2(-0.203, 0.621), vec2(0.962, -0.195), vec2(0.473, -0.480), vec2(0.519, 0.767), vec2(0.185, -0.893), vec2(0.507, 0.064), vec2(0.896, 0.412), vec2(-0.322, -0.933), vec2(-0.792, -0.598));
float ign(vec2 p) {
  return fract(52.9829189 * fract(0.06711056 * p.x + 0.00583715 * p.y));
}
// Lit fraction from one cascade: 3×3 PCF, or PCSS (blocker search → penumbra → rotated Poisson PCF).
float sampleCascade(sampler2D map, vec3 p, float bias) {
  if (uShadowSoft < 0.5) {
    float lit = 0.0;
    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        float d = texture(map, p.xy + vec2(float(x), float(y)) * uShadowTexel).r;
        lit += p.z - bias <= d ? 1.0 : 0.0;
      }
    }
    return lit / 9.0;
  }
  float a = ign(gl_FragCoord.xy) * 6.2831853;
  mat2 rot = mat2(cos(a), sin(a), -sin(a), cos(a));
  // Blocker search over a fixed region: average depth of what is in front of us.
  float search = 4.0 * uShadowTexel;
  float blockers = 0.0;
  float blockerDepth = 0.0;
  for (int i = 0; i < 12; i++) {
    float d = texture(map, p.xy + rot * POISSON[i] * search).r;
    if (d < p.z - bias) {
      blockers += 1.0;
      blockerDepth += d;
    }
  }
  if (blockers < 0.5) return 1.0;
  blockerDepth /= blockers;
  // Penumbra grows with the gap between receiver and caster (depth is linear in an orthographic map).
  float penumbra = clamp((p.z - blockerDepth) * uLightSize, 1.0, 8.0) * uShadowTexel;
  float lit = 0.0;
  for (int i = 0; i < 12; i++) {
    float d = texture(map, p.xy + rot * POISSON[i] * penumbra).r;
    lit += p.z - bias <= d ? 1.0 : 0.0;
  }
  return lit / 12.0;
}
// The first cascade the pixel lands in (with a margin so edges blend into the next); beyond all of them, lit.
float shadow(float NoL) {
  float bias = 0.0004 + 0.0012 * (1.0 - NoL);
  vec4 sps[3] = vec4[3](vShadow0, vShadow1, vShadow2);
  for (int i = 0; i < 3; i++) {
    if (i >= uCascades) break;
    vec3 p = sps[i].xyz / sps[i].w * 0.5 + 0.5;
    if (p.x < 0.02 || p.x > 0.98 || p.y < 0.02 || p.y > 0.98 || p.z > 1.0) continue;
    float lit = i == 0 ? sampleCascade(uShadow0, p, bias) : i == 1 ? sampleCascade(uShadow1, p, bias * 1.5) : sampleCascade(uShadow2, p, bias * 2.5);
    // Fade the last 10% of this cascade into the next so the switch is not a line.
    float edge = max(max(abs(p.x - 0.5), abs(p.y - 0.5)) - 0.4, 0.0) / 0.08;
    if (edge > 0.0 && i + 1 < uCascades) {
      vec3 q = sps[i + 1].xyz / sps[i + 1].w * 0.5 + 0.5;
      float next = i + 1 == 1 ? sampleCascade(uShadow1, q, bias * 1.5) : sampleCascade(uShadow2, q, bias * 2.5);
      return mix(lit, next, clamp(edge, 0.0, 1.0));
    }
    return lit;
  }
  return 1.0;
}
vec3 aces(vec3 x) {
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

// Cook-Torrance for one light direction: what radiance arriving along l reflects toward v.
vec3 shade(vec3 n, vec3 v, vec3 l, vec3 radiance, vec3 diffuseColor, vec3 f0, float rough) {
  vec3 h = normalize(l + v);
  float NoL = max(dot(n, l), 0.0);
  if (NoL <= 0.0) return vec3(0.0);
  float NoV = max(dot(n, v), 1e-4);
  float NoH = max(dot(n, h), 0.0);
  float VoH = max(dot(v, h), 0.0);
  vec3 F = F_Schlick(VoH, f0);
  float D = D_GGX(NoH, rough);
  float G = G_Smith(NoV, NoL, rough);
  vec3 spec = (D * G * F) / max(4.0 * NoV * NoL, 1e-4);
  vec3 kd = (1.0 - F) * diffuseColor / PI;
  return (kd + spec) * radiance * NoL;
}

// Tangent frame from screen-space derivatives (no tangent attribute needed), then a tangent-space normal.
vec3 perturb(vec3 n, vec2 uv, vec3 tn) {
  vec3 dp1 = dFdx(vWorld);
  vec3 dp2 = dFdy(vWorld);
  vec2 duv1 = dFdx(uv);
  vec2 duv2 = dFdy(uv);
  vec3 dp2perp = cross(dp2, n);
  vec3 dp1perp = cross(n, dp1);
  vec3 t = dp2perp * duv1.x + dp1perp * duv2.x;
  vec3 b = dp2perp * duv1.y + dp1perp * duv2.y;
  float invmax = inversesqrt(max(dot(t, t), dot(b, b)) + 1e-12);
  mat3 tbn = mat3(t * invmax, b * invmax, n);
  return normalize(tbn * tn);
}

// A 4x4 ordered-dither threshold for this pixel, 1/32 .. 31/32.
float bayer4(vec2 p) {
  ivec2 i = ivec2(mod(p, 4.0));
  const int m[16] = int[16](0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5);
  return (float(m[i.x + i.y * 4]) + 0.5) / 16.0;
}

void main() {
  if (vWorld.y < uClipY) discard;
  // Too close to the eye: fade out as a screen-door (dithered discard), so what blocks the view can be seen through.
  // Whole beyond uNearFade, gone within about a third of it; the dither needs no sorting and works with instancing and skins.
  if (uNearFade > 0.0) {
    float seen = smoothstep(uNearFade * 0.35, uNearFade, distance(vWorld, uEye));
    if (seen < bayer4(gl_FragCoord.xy)) discard;
  }
  // Only partly there (an instance's fade): the same screen-door, its pattern shifted.
  if (uFadeGrey.x < 0.999 && uFadeGrey.x < bayer4(gl_FragCoord.xy + vec2(2.0, 1.0))) discard;
  // A degenerate normal must never become NaN: it would spread through bloom as black blobs.
  vec3 n = dot(vNormal, vNormal) > 1e-8 ? normalize(vNormal) : vec3(0.0, 1.0, 0.0);
  vec3 v = normalize(uEye - vWorld);
  vec3 l = normalize(-uSunDir);
  vec2 uv = vUv * uUvScale;
  if (uHasNormal > 0.5) n = perturb(n, uv, texture(uNormalMap, uv).xyz * 2.0 - 1.0);
  vec3 albedo;
  float alphaTex = 1.0;
  float rough = uRoughness;
  if (uSplatOn > 0.5) {
    ivec4 ids;
    vec4 sw = splatWeights(vWorld, ids);
    albedo = vec3(0.0);
    rough = 0.0;
    // Always four reads (an empty slot reads layer 0 at weight 0): no texture fetch under a branch.
    // With surface detail, four more: each layer's bumps (blended as normals) and roughness map.
    vec3 tn = vec3(0.0);
    for (int s = 0; s < 4; s++) {
      int l = max(ids[s], 0);
      albedo += texture(uSplatLayers, vec3(uv, float(l))).rgb * uSplatTint[l] * sw[s];
      float r = uSplatRough[l];
      if (uSurfOn > 0.5) {
        vec4 sf = texture(uSurfLayers, vec3(uv, float(l)));
        tn += (sf.xyz * 2.0 - 1.0) * sw[s];
        r += (sf.a - 0.5) * uSurfRough;
      }
      rough += r * sw[s];
    }
    if (uSurfOn > 0.5 && uSurfBump > 0.0) n = perturb(n, uv, normalize(vec3(tn.xy * uSurfBump, max(tn.z, 1e-3))));
    // Grid lines every uSplatGrid world units (0 = none), uSplatGridWidth wide, antialiased: the
    // coverage of a line across this pixel, so thin lines fade rather than flicker far away.
    if (uSplatGrid > 0.0) {
      vec2 gp = vWorld.xz / uSplatGrid;
      vec2 fw = max(fwidth(gp), vec2(1e-5));
      vec2 dist = abs(fract(gp + 0.5) - 0.5);
      float half_ = 0.5 * uSplatGridWidth / uSplatGrid;
      vec2 cov = clamp((half_ - dist) / fw + 0.5, 0.0, 1.0) * min(vec2(1.0), 2.0 * half_ / fw);
      albedo *= 1.0 - uSplatGridOpacity * max(cov.x, cov.y);
    }
  } else {
    vec4 at = texture(uAlbedo, uv);
    albedo = at.rgb;
    alphaTex = at.a;
    // Cut-out (leaves, fences): nothing where the alpha is under the cutoff.
    if (uCutoff > 0.0 && cutoutAlpha(alphaTex * uOpacity, uv) < uCutoff) discard;
  }
  vec3 base = vColor * uMatColor * albedo;
  float metal = uMetallic;
  if (uHasMetalRough > 0.5) {
    vec4 mr = texture(uMetalRough, uv);
    rough *= mr.g;
    metal *= mr.b;
  }
  // Per-instance tint (multiply, blended in), then wear blotches over the surface.
  base = mix(base, base * uTint.rgb, uTint.a);
  // Greyed (an instance's grey): toward its own brightness.
  if (uFadeGrey.y > 0.0) base = mix(base, vec3(dot(base, vec3(0.299, 0.587, 0.114))), uFadeGrey.y);
  vec3 wearGlow = vec3(0.0);
  if (uWear.x > 0.0) {
    vec3 wp = vLocal * uWear.z + vec3(uWear.w * 13.7, uWear.w * 7.9, uWear.w * 3.1);
    float nz = wearNoise(wp);
    // Spread: what is covered grows from the noise's peaks down as the amount rises.
    float edge = 0.95 - uWear.x * 0.92;
    float m = smoothstep(edge - 0.06, edge + 0.06, nz);
    if (uWear.y < 0.5) {
      // Scorch: blackened, dull, a little sooty variation, fading out through a brown heat halo;
      // embers along the spreading edge.
      m = smoothstep(edge - 0.1, edge + 0.14, nz);
      float halo = smoothstep(edge - 0.28, edge - 0.02, nz) * (1.0 - m);
      base *= mix(vec3(1.0), vec3(0.62, 0.5, 0.38), halo);
      float soot = 0.05 + 0.08 * vnoise3(wp * 3.1);
      base = mix(base, base * soot + vec3(0.01), m);
      rough = mix(rough, 0.95, m);
      metal = mix(metal, metal * 0.3, m);
      float rim = smoothstep(edge - 0.03, edge, nz) * (1.0 - smoothstep(edge, edge + 0.02, nz));
      wearGlow = vec3(1.0, 0.3, 0.05) * rim * 0.18 * uWear.x;
    } else {
      // Rust: mottled orange-brown, rough, not metallic.
      vec3 rust = mix(vec3(0.13, 0.045, 0.018), vec3(0.3, 0.11, 0.035), vnoise3(wp * 2.7 + 11.0));
      base = mix(base, rust, m * 0.9);
      rough = mix(rough, 0.92, m);
      metal = mix(metal, 0.0, m);
    }
  }
  rough = clamp(rough, 0.04, 1.0);
  metal = clamp(metal, 0.0, 1.0);
  vec3 f0 = mix(vec3(0.04), base, metal);
  vec3 diffuseColor = base * (1.0 - metal);
  float NoL = max(dot(n, l), 0.0);
  float lit = mix(1.0, shadow(NoL), uShadowStrength) * cloudShade(vWorld, l);
  // Under a fog volume: the sun dimmed by the mist it comes through.
  if (uFogVolShadow > 0.5) lit *= fogVolShade(vWorld, l);
  vec3 sun = shade(n, v, l, uSunColor * uSunIntensity * lit, diffuseColor, f0, rough);
  // Point, spot and area lights from this pixel's tile list (see lights.ts).
  ivec2 tile = ivec2(gl_FragCoord.xy / uTileInfo.y);
  int tileIndex = tile.y * int(uTileInfo.x) + tile.x;
  int count = int(texelFetch(uTiles, ivec2(0, tileIndex), 0).r);
  vec3 points = vec3(0.0);
  for (int k = 0; k < MAX_PER_TILE; k++) {
    if (k >= count) break;
    int idx = int(texelFetch(uTiles, ivec2(k + 1, tileIndex), 0).r);
    int li = idx * LIGHT_TEXELS;
    vec4 pr = texelFetch(uLights, ivec2(li, 0), 0);
    vec4 ci = texelFetch(uLights, ivec2(li + 1, 0), 0);
    vec4 dk = texelFetch(uLights, ivec2(li + 2, 0), 0); // direction, kind (0 point, 1 spot, 2 area)
    vec3 lp = pr.xyz;
    float shape = 1.0;
    if (dk.w > 1.5) {
      // Area: lit from the panel's nearest point, on its front only (fading round the edge-on angle).
      vec4 ax = texelFetch(uLights, ivec2(li + 3, 0), 0); // width axis, half width
      float halfH = texelFetch(uLights, ivec2(li + 4, 0), 0).x;
      vec3 hAxis = cross(dk.xyz, ax.xyz);
      vec3 rel = vWorld - pr.xyz;
      lp = pr.xyz + ax.xyz * clamp(dot(rel, ax.xyz), -ax.w, ax.w) + hAxis * clamp(dot(rel, hAxis), -halfH, halfH);
      shape = smoothstep(-0.02, 0.2, dot(rel, dk.xyz) / max(length(rel), 1e-4));
    }
    vec3 toL = lp - vWorld;
    float d2 = max(dot(toL, toL), 1e-6);
    float r2 = pr.w * pr.w;
    if (d2 >= r2 || shape <= 0.0) continue;
    vec3 L = toL * inversesqrt(d2);
    if (dk.w > 0.5 && dk.w < 1.5) {
      // Spot: full inside the inner cone, fading to nothing at the outer.
      vec2 cone = texelFetch(uLights, ivec2(li + 3, 0), 0).xy;
      shape = smoothstep(cone.y, cone.x, dot(-L, dk.xyz));
      if (shape <= 0.0) continue;
    }
    // Smooth window to zero at the radius, inverse-square inside.
    float win = 1.0 - (d2 * d2) / (r2 * r2);
    float att = (win * win) / (d2 + 1.0);
    points += shade(n, v, L, ci.rgb * ci.a * att * shape, diffuseColor, f0, rough);
  }
  // Hemisphere ambient: sky from above, ground bounce from below, tinted by the base colour.
  float hemi = n.y * 0.5 + 0.5;
  vec3 ambient = mix(uGroundColor, uSkyColor, hemi) * uAmbient * diffuseColor;
  // Specular from the sky cube: rougher surfaces read blurrier mips; Fresnel with a roughness-aware ceiling.
  vec3 env = vec3(0.0);
  if (uEnvStrength > 0.0) {
    float NoV = max(dot(n, v), 0.0);
    vec3 F = f0 + (max(vec3(1.0 - rough), f0) - f0) * pow(1.0 - NoV, 5.0);
    env = textureLod(uEnv, reflect(-v, n), rough * uEnvMips).rgb * F * uEnvStrength * mix(1.0, lit, 0.5);
  } else {
    // No cube: metals keep a flat sky tint so they are not black.
    env = mix(uGroundColor, uSkyColor, hemi) * uAmbient * base * metal;
  }
  // Emission: its colour, through its emission map when it has one (none while that map loads).
  vec3 emission = uEmissive * uEmissiveScale;
  if (uEmissiveMapState > 1.5) emission = vec3(0.0);
  else if (uEmissiveMapState > 0.5) emission *= texture(uEmissiveMap, uv).rgb;
  vec3 color = sun + points + ambient + env + emission + uGlow + wearGlow;
  float dist = distance(vWorld, uEye);
  float fog = clamp((dist - uFogRange.x) / (uFogRange.y - uFogRange.x), 0.0, 1.0);
  color = mix(color, uFogColor, fog);
  // Outside the fade rectangle, melt into the horizon (scenery around a map), or the material's fade colour.
  if (uFadeDist > 0.0) {
    float outside = max(max(uFadeRect.x - vWorld.x, vWorld.x - uFadeRect.z), max(uFadeRect.y - vWorld.z, vWorld.z - uFadeRect.w));
    color = mix(color, uFadeColor.w > 0.5 ? uFadeColor.rgb : uFogColor, smoothstep(0.0, uFadeDist, outside));
  }
  if (uToneMap > 0.5) {
    color = aces(color * uExposure);
    color = pow(color, vec3(1.0 / 2.2));
  }
  outColor = vec4(color, uTransparent > 0.5 ? alphaTex * uOpacity : 1.0);
}`;function bt(a){return a?ao.replace("in vec4 vShadow2;",`in vec4 vShadow2;
in vec4 vInst;`).replace(/uFadeGrey\.x/g,"vInst.z").replace(/uFadeGrey\.y/g,"vInst.w").replace(/uWear\.w/g,"vInst.y"):ao}class Fs{constructor(e){f(this,"gl");f(this,"program");f(this,"instancedProgram");f(this,"instances",[]);f(this,"instanced",[]);f(this,"overlays",[]);f(this,"icons");f(this,"wireColor",[.15,.85,1]);f(this,"wireProgram");f(this,"nearFade",{enabled:!1,distance:6});f(this,"veil",null);f(this,"veilGround",0);f(this,"post");f(this,"clouds");f(this,"fogVolumes",new xi);f(this,"sky");f(this,"envMap");f(this,"env",{...Hr});f(this,"envKey","");f(this,"water");f(this,"time",0);f(this,"lastTime",-1);f(this,"particles");f(this,"effects");f(this,"grass");f(this,"clipY",-1e9);f(this,"dayNight",{...ba});f(this,"timeOfDay",.2);f(this,"weather",{overcast:0,tint:[1,1,1]});f(this,"weathered",!1);f(this,"baseLighting");f(this,"overlayProgram");f(this,"skinnedProgram");f(this,"crowds",!0);f(this,"skinnedCrowds",!0);f(this,"skinnedInstancedProgram");f(this,"crowdProgram");f(this,"crowdTexture");f(this,"crowdRows",0);f(this,"crowdData",new Float32Array(0));f(this,"crowdUsed",0);f(this,"crowdSent",0);f(this,"idsOf",new WeakMap);f(this,"nextObjectId",1);f(this,"wireSkinnedProgram");f(this,"skinnedCasters",[]);f(this,"rigidCasters",[]);f(this,"cutoutCasters",[]);f(this,"cutoutGroups",[]);f(this,"lighting",{sunDir:[-.4,-.8,-.45],sunColor:[1,.95,.86],sunIntensity:3,skyColor:[.55,.65,.9],groundColor:[.3,.25,.2],ambient:.8,exposure:1});f(this,"fogColor",[.012,.016,.024]);f(this,"fogTint",null);f(this,"tinted",null);f(this,"fogRange",[60,220]);f(this,"drawCalls",0);f(this,"culling",!0);f(this,"lastReflection",null);f(this,"timers");f(this,"renderScale",1);f(this,"boxes",new WeakMap);f(this,"frame",0);f(this,"planes",new Float32Array(24));f(this,"scratchBox",new Float32Array(6));f(this,"scratchNormal",new Float32Array(9));f(this,"sorted",{frame:-1,solid:[],clear:[]});f(this,"tintScratch",new Float32Array(ot*3));f(this,"roughScratch",new Float32Array(ot));f(this,"bound",{program:null,material:null});f(this,"defaultMaterial",mi());f(this,"white");f(this,"shadows");f(this,"lights");f(this,"boundPalette",null);f(this,"boundPaletteProgram",null);f(this,"singlesScratch",{rigid:[],skinned:[],rigidGroups:new Map,skinnedGroups:new Map});f(this,"shadowGroups",new Map);f(this,"shadowSkinnedGroups",new Map);f(this,"stagedG",[]);f(this,"stagedAt",[]);f(this,"keyCache",new WeakMap);f(this,"sortScratch",Jr());f(this,"clockwise",!1);this.canvas=e;const t=e.getContext("webgl2",{antialias:!0});if(!t)throw new Error("WebGL2 is not available");this.gl=t,this.program=new O(t,wt(!1),bt(!1)),this.instancedProgram=new O(t,wt(!0),bt(!1)),this.skinnedProgram=new O(t,wt(!1,!0),bt(!1)),this.skinnedInstancedProgram=new O(t,wt(!0,!0),bt(!0)),this.crowdProgram=new O(t,wt(!0,!1,!0),bt(!0)),this.crowdTexture=this.makeCrowdTexture(64),this.overlayProgram=new O(t,Ho,jo),this.icons=new Ka(t),this.wireProgram=new O(t,ro(!1),so),this.wireSkinnedProgram=new O(t,ro(!0),so),this.white=new Vt(t),this.shadows=new $o(t,2048),this.lights=new Wo(t),this.post=new wa(t),this.clouds=new qo(t),this.sky=new Fa(t),this.envMap=new Yr(t,64),this.water=new Pa(t),this.particles=new ja(t,2e5),this.effects=new Wr(t),this.grass=new Na(t),this.timers=new Oa(t),this.post.timers=this.timers,this.baseLighting={...this.lighting},t.enable(t.DEPTH_TEST),t.enable(t.CULL_FACE),t.cullFace(t.BACK)}resize(){const e=Math.min(window.devicePixelRatio||1,2)*Math.min(1,Math.max(.25,this.renderScale)),t=Math.floor(this.canvas.clientWidth*e),i=Math.floor(this.canvas.clientHeight*e);(this.canvas.width!==t||this.canvas.height!==i)&&(this.canvas.width=t,this.canvas.height=i),this.gl.viewport(0,0,t,i)}get aspect(){return this.canvas.width/Math.max(1,this.canvas.height)}render(e){var E,R,M,z,L;const t=this.gl;if(this.drawCalls=0,this.crowdUsed=0,this.crowdSent=0,this.frame++,this.boundPalette=null,this.canvas.width===0||this.canvas.height===0)return;const i=this.timers;i.startFrame(),Vt.flush(1024*1024);const o=Math.min(1,Math.max(0,this.weather.overcast)),r=ya(this.dayNight.enabled?this.timeOfDay:.25,this.baseLighting,this.dayNight,o,this.weather.tint);this.dayNight.enabled||o>0?(this.lighting={...this.baseLighting,sunDir:this.dayNight.enabled?r.sunDir:this.baseLighting.sunDir,sunColor:r.sunColor,sunIntensity:r.sunIntensity,skyColor:r.skyColor,groundColor:r.groundColor,ambient:r.ambient,exposure:this.baseLighting.exposure*r.exposure},this.fogColor=r.horizon,this.weathered=o>0):(this.weathered&&(this.lighting={...this.baseLighting}),this.weathered=!1,this.sky.settings.enabled&&(this.fogColor=r.horizon));const s=this.tinted;s&&this.fogColor.every((A,S)=>A===s.to[S])&&(this.fogColor=s.from);const n=this.fogTint;if(n&&n.amount>0){const A=Math.min(1,n.amount),S=this.fogColor,U=S.map((D,ae)=>D+(n.color[ae]-D)*A);this.tinted={from:S,to:U},this.fogColor=U}else this.tinted=null;if(i.begin("sky cube"),this.env.enabled){const A=[...r.sunDir,...r.sunColor,r.sunIntensity,...r.horizon,...r.zenith,...r.groundColor,this.sky.settings.sunSize,this.sky.settings.sunGlow].map(S=>S.toFixed(2)).join(",");A!==this.envKey&&(this.envKey=A,this.sky.renderEnv(this.envMap,r),this.drawCalls+=6)}i.begin("shadows");const u=Kr(e);this.shadows.settings.strength>0&&this.shadowPass(u),i.begin("scene");const l=this.post.settings.enabled;l&&(this.post.resize(this.canvas.width,this.canvas.height),this.post.begin());const c=l?this.fogColor:this.fogColor.map(A=>Math.pow(Math.min(1,A*this.lighting.exposure),1/2.2));t.clearColor(c[0],c[1],c[2],1),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT);const d=e.projection(this.aspect),h=e.view(),m=e.eye(),g=this.lights.lights.length;this.effects.lights(this.lights.lights),this.lights.update(de(d,h),this.canvas.width,this.canvas.height),this.lights.lights.length=g,this.fogVolumes.prepare(lt(de(d,h),this.planes),((E=e.viewPoint)==null?void 0:E.call(e))??no(m,u.focus,((R=e.rayStart)==null?void 0:R.call(e))??0),this.time),this.bindShared();const w=this.water.settings.enabled&&this.water.hasSurface,x=this.lastReflection!==null&&this.lastReflection.w===this.canvas.width&&this.lastReflection.h===this.canvas.height&&h.every((A,S)=>A===this.lastReflection.view[S]),v=!(this.water.settings.reflectionHalfRate&&x&&this.frame%2===1);if(w&&this.water.settings.reflections&&v){this.lastReflection={view:new Float32Array(h),w:this.canvas.width,h:this.canvas.height},i.begin("reflection");const A=this.water.mirroredView(m,u.focus),S=l?this.fogColor:this.fogColor.map(U=>Math.pow(Math.min(1,U*this.lighting.exposure),1/2.2));this.water.beginReflection(this.canvas.width,this.canvas.height,S),this.clipY=this.water.level-.02,this.drawOpaque(d,A.view,A.eye,r,!l,!0),this.clipY=-1e9,this.water.endReflection(),l?this.post.begin():(t.bindFramebuffer(t.FRAMEBUFFER,null),t.viewport(0,0,this.canvas.width,this.canvas.height))}const p=this.lastTime<0?0:Math.max(0,this.time-this.lastTime);if(this.lastTime=this.time,this.clouds.advance(p),i.begin("particles"),this.particles.settings.enabled&&this.particles.update(p),this.effects.settings.enabled&&this.effects.count&&(i.begin("effects"),this.effects.update(p,{projection:d,view:h,eye:m,viewport:[this.canvas.width,this.canvas.height],exposure:this.lighting.exposure,toneMap:!l}),this.bindShared()),this.grass.update(p),i.begin("scene"),this.drawOpaque(d,h,m,r,!l,!1),i.begin("grass"),this.grass.settings.enabled){const A=this.lighting,S=this.shadows;this.drawCalls+=this.grass.draw({projection:d,view:h,eye:m,focus:u.focus,time:this.time,sunDir:A.sunDir,sunColor:A.sunColor,sunIntensity:A.sunIntensity,skyColor:A.skyColor,groundColor:A.groundColor,ambient:A.ambient,fogColor:this.fogColor,fogRange:this.fogRange,exposure:A.exposure,toneMap:!l,lightViewProj:S.settings.strength>0?Array.from({length:Bt},(U,D)=>S.viewProj(Math.min(D,S.count-1))).slice(0,S.count):[],shadowStrength:S.settings.strength})}if(i.begin("scene"),this.drawWires(d,h,!l),i.begin("water"),w&&(this.water.draw({projection:d,view:h,eye:m,time:this.time,sunDir:this.lighting.sunDir,sunColor:this.lighting.sunColor,sunIntensity:this.lighting.sunIntensity,horizon:r.horizon,zenith:r.zenith,light:.12+.88*r.day,fogColor:this.fogColor,fogRange:this.fogRange,exposure:this.lighting.exposure,toneMap:!l,width:this.canvas.width,height:this.canvas.height,depth:l?this.post.snapshotDepth():null,invViewProj:Qe(de(d,h))}),this.drawCalls++),i.begin("overlays"),this.overlays.length){const A=this.overlayProgram;A.use(),A.setMat4("uProjection",d),A.setMat4("uView",h),A.setFloat("uExposure",this.lighting.exposure),A.setFloat("uToneMap",l?0:1),A.setFloat("uLight",.12+.88*r.day),t.enable(t.BLEND),t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ZERO,t.ONE),t.depthMask(!1),t.disable(t.CULL_FACE);const S=lt(de(d,h),this.planes);for(const U of this.overlays)U.onTop||U.overVeil||U.overFrame||U.mesh.count===0||this.culling&&!mt(S,Zt(U.model,U.mesh.min,U.mesh.max,this.scratchBox))||(A.setMat4("uModel",U.model),A.setFloat("uAlpha",U.alpha??1),U.mesh.draw(),this.drawCalls++);t.enable(t.CULL_FACE),t.depthMask(!0),t.disable(t.BLEND)}if(this.veil){t.enable(t.BLEND),t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ZERO,t.ONE_MINUS_SRC_ALPHA),t.depthMask(!1),t.disable(t.CULL_FACE);const A=l?this.post.snapshotDepth():null;A?(t.disable(t.DEPTH_TEST),this.veil.drawScreen(A,Qe(de(d,h)),m,this.lighting.exposure,6,!l,this.veilGround),t.enable(t.DEPTH_TEST)):(t.enable(t.POLYGON_OFFSET_FILL),t.polygonOffset(-1,-2),this.veil.draw(d,h,this.lighting.exposure,6,!l),t.disable(t.POLYGON_OFFSET_FILL)),this.drawCalls++,t.enable(t.CULL_FACE),t.depthMask(!0),t.disable(t.BLEND)}const b=this.overlays.filter(A=>A.overVeil&&!A.onTop&&!A.overFrame&&A.mesh.count>0);if(b.length){const A=this.overlayProgram;A.use(),A.setMat4("uProjection",d),A.setMat4("uView",h),A.setFloat("uExposure",this.lighting.exposure),A.setFloat("uToneMap",l?0:1),A.setFloat("uLight",1),t.enable(t.BLEND),t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ZERO,t.ONE_MINUS_SRC_ALPHA),t.depthMask(!1),t.disable(t.CULL_FACE);const S=lt(de(d,h),this.planes);for(const U of b)this.culling&&!mt(S,Zt(U.model,U.mesh.min,U.mesh.max,this.scratchBox))||(A.setMat4("uModel",U.model),A.setFloat("uAlpha",U.alpha??1),U.mesh.draw(),this.drawCalls++);t.enable(t.CULL_FACE),t.depthMask(!0),t.disable(t.BLEND)}i.begin("particles");let F=null;if(this.particles.settings.enabled){const A=[h[0],h[4],h[8]],S=[h[1],h[5],h[9]];F=l?this.post.snapshotDepth():null,this.particles.draw({projection:d,view:h,right:A,up:S,depth:F,invProjection:Qe(d),width:this.canvas.width,height:this.canvas.height,exposure:this.lighting.exposure,toneMap:!l}),this.drawCalls+=2}if(this.effects.settings.enabled&&this.effects.count&&(i.begin("effects"),this.drawCalls+=this.effects.draw({projection:d,view:h,eye:m,viewport:[this.canvas.width,this.canvas.height],exposure:this.lighting.exposure,toneMap:!l}),this.bindShared()),i.begin("overlays"),this.drawOnTop(this.overlays.filter(A=>A.onTop&&!A.overFrame),d,h,!l),l){const A=this.shadows,S=this.lighting;i.begin("post");const U=A.settings.strength>0?{shadowMaps:Array.from({length:A.count},(D,ae)=>A.texture(ae)),lightViewProj:Array.from({length:A.count},(D,ae)=>A.viewProj(ae))}:{shadowMaps:[],lightViewProj:[]};this.post.end(this.lighting.exposure,d,Qe(d),{invViewProj:Qe(de(d,h)),eye:m,sunDir:S.sunDir,sunRadiance:[S.sunColor[0]*S.sunIntensity,S.sunColor[1]*S.sunIntensity,S.sunColor[2]*S.sunIntensity],skyColor:r.skyColor,...U,far:this.fogRange[1],rayStart:((M=e.rayStart)==null?void 0:M.call(e))??0,viewPoint:((z=e.viewPoint)==null?void 0:z.call(e))??no(m,u.focus,((L=e.rayStart)==null?void 0:L.call(e))??0),clouds:this.clouds,time:this.time,fogVolumes:this.fogVolumes,lights:this.lights,...this.veil?{veil:{mask:this.veil.maskTexture,cells:[this.veil.width,this.veil.height],alpha:this.veil.veilColor[3]}}:{},opaqueDepth:F}),this.drawCalls+=2}this.icons.enabled&&this.icons.count&&(i.begin("icons"),t.bindFramebuffer(t.FRAMEBUFFER,null),t.viewport(0,0,this.canvas.width,this.canvas.height),this.drawCalls+=this.icons.draw(de(d,h),this.canvas.width,this.canvas.height));const _=this.overlays.filter(A=>A.overFrame&&A.mesh.count>0);_.length&&(i.begin("overlays"),t.bindFramebuffer(t.FRAMEBUFFER,null),t.viewport(0,0,this.canvas.width,this.canvas.height),this.drawOnTop(_,d,h,!0)),i.end()}drawOnTop(e,t,i,o){if(!e.length)return;const r=this.gl,s=this.overlayProgram;s.use(),s.setMat4("uProjection",t),s.setMat4("uView",i),s.setFloat("uExposure",this.lighting.exposure),s.setFloat("uToneMap",o?1:0),s.setFloat("uLight",1),r.enable(r.BLEND),r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ZERO,r.ONE),r.disable(r.DEPTH_TEST),r.depthMask(!1),r.disable(r.CULL_FACE);for(const n of e)s.setMat4("uModel",n.model),s.setFloat("uAlpha",n.alpha??1),n.mesh.draw(),this.drawCalls++;r.enable(r.CULL_FACE),r.depthMask(!0),r.enable(r.DEPTH_TEST),r.disable(r.BLEND)}bindShared(){for(let e=0;e<Bt;e++)this.shadows.bind(Math.min(e,this.shadows.count-1),e===0?1:6+e);this.lights.bind(2,3)}drawOpaque(e,t,i,o,r,s){const n=this.gl;this.sky.settings.enabled&&(s&&n.cullFace(n.BACK),this.sky.draw(Qe(de(e,t)),i,o,this.lighting.exposure,r),s&&n.cullFace(n.FRONT),this.drawCalls++);const u=this.program;u.use(),this.setFrameUniforms(u,e,t,i);const l=lt(de(e,t),this.planes);this.unbind();const{solid:c,clear:d}=this.sortedInstances(),h=v=>!s||!this.culling||this.water.nearWater(v,Math.max(2,(v[4]-v[1])*1.5));this.drawSingles(c,v=>this.seen(v,l)&&h(this.boxOf(v)),e,t,i);const m=v=>v.mesh.count>0&&(!this.culling||!v.bounds||mt(l,this.groupBox(v))&&h(this.groupBox(v))),g=this.instanced.filter(v=>{var p;return!((p=v.material)!=null&&p.transparent)&&m(v)});if(g.length){const v=this.instancedProgram;v.use(),this.setFrameUniforms(v,e,t,i),this.unbind();for(const p of g)this.useMaterial(v,p.material??this.defaultMaterial),this.bindLook(v,null),this.wind(!!p.mirrored),p.mesh.draw(),this.drawCalls++;this.wind(!1)}const w=d.filter(v=>this.seen(v,l)&&h(this.boxOf(v))),x=this.instanced.filter(v=>{var p;return((p=v.material)==null?void 0:p.transparent)&&m(v)});if(w.length||x.length){if(n.enable(n.BLEND),n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE),n.depthMask(!1),n.enable(n.POLYGON_OFFSET_FILL),n.polygonOffset(-1,-4),x.length){const v=this.instancedProgram;v.use(),this.setFrameUniforms(v,e,t,i),this.unbind();for(const p of x)this.useMaterial(v,p.material),this.bindLook(v,null),this.wind(!!p.mirrored),p.mesh.draw(),this.drawCalls++;this.wind(!1)}w.length&&this.drawSingles(w,()=>!0,e,t,i,!1),n.disable(n.POLYGON_OFFSET_FILL),n.depthMask(!0),n.disable(n.BLEND)}}bindSkin(e,t){t.skin.upload(),(this.boundPalette!==t.skin||this.boundPaletteProgram!==e)&&(t.skin.bind(rt),this.boundPalette=t.skin,this.boundPaletteProgram=e),this.gl.uniform1i(e.uniform("uJointBase"),t.skinBase??0)}isSkinned(e){return!!e.skin&&e.mesh.skinned}drawSingles(e,t,i,o,r,s=!0){const{rigid:n,skinned:u,rigidGroups:l,skinnedGroups:c}=this.singlesScratch;n.length=0,u.length=0,Dt(l),Dt(c);const d=s&&this.crowds;for(const h of e){if(!t(h))continue;const m=this.isSkinned(h);if(!d||m&&!this.skinnedCrowds){(m?u:n).push(h);continue}const g=m?c:l,w=this.crowdKey(h,m),x=g.get(w);x?x.push(h):g.set(w,[h])}for(const h of l.values())h.length===1&&n.push(h[0]);for(const h of c.values())h.length===1&&u.push(h[0]);if(n.length){const h=this.program;h.use(),this.unbind();for(const m of n)this.useMaterial(h,m.material??this.defaultMaterial),this.bindLook(h,m),h.setMat4("uModel",m.model),h.setMat3("uNormal",Ci(m.model,this.scratchNormal)),this.wind(Pe(m.model)),m.mesh.draw(),this.drawCalls++;this.wind(!1)}if(u.length){const h=this.skinnedProgram;h.use(),this.setFrameUniforms(h,i,o,r),this.gl.uniform1i(h.uniform("uJoints"),rt),this.unbind();for(const m of u)this.useMaterial(h,m.material??this.defaultMaterial),this.bindLook(h,m),this.bindSkin(h,m),h.setMat4("uModel",m.model),h.setMat3("uNormal",Ci(m.model,this.scratchNormal)),this.wind(Pe(m.model)),m.mesh.draw(),this.drawCalls++;this.wind(!1)}this.drawCrowds(l,this.crowdProgram,i,o,r,!1),this.drawCrowds(c,this.skinnedInstancedProgram,i,o,r,!0)}idOf(e){let t=this.idsOf.get(e);return t===void 0&&(t=this.nextObjectId++,this.idsOf.set(e,t)),t}stageAll(e){let t=0;for(const i of e.values())i.length<2||(this.stagedG[t]=i,this.stagedAt[t]=this.stageCrowd(i),t++);return t}crowdKey(e,t){const i=e.tint,o=e.glow,r=e.wear,s=this.idOf(e.mesh),n=this.idOf(e.material??this.defaultMaterial),u=t?this.idOf(e.skin):0,l=Pe(e.model)?1:0,c=e.emissive??1;if(!i&&!o&&!r&&c===1)return((s*4096+n)*4096+u)*2+l;const d=this.keyCache.get(e);if(d&&d.t===i&&d.g===o&&d.w===r&&d.e===c&&d.mesh===e.mesh&&d.mat===e.material&&d.skin===e.skin&&d.mirrored===l)return d.key;const h=`${s}|${n}|${u}|${l}|${i?i.join(","):""}|${o?o.join(","):""}|${r?`${r.amount},${r.kind??"scorch"},${r.scale??12}`:""}|${c===1?"":c.toFixed(3)}`;return this.keyCache.set(e,{t:i,g:o,w:r,e:c,mesh:e.mesh,mat:e.material,skin:e.skin,mirrored:l,key:h}),h}drawCrowds(e,t,i,o,r,s){for(const u of e.values())u.length>=2&&Qr(u,r,this.sortScratch);const n=this.stageAll(e);if(n){this.flushCrowds(),t.use(),this.setFrameUniforms(t,i,o,r),s&&this.gl.uniform1i(t.uniform("uJoints"),rt),this.bindCrowdTexture(t),this.unbind();for(let u=0;u<n;u++){const l=this.stagedG[u],c=this.stagedAt[u],d=l[0];this.useMaterial(t,d.material??this.defaultMaterial),this.bindLook(t,d),s&&this.bindSkin(t,d),this.wind(Pe(d.model)),this.gl.uniform1i(t.uniform("uCrowdBase"),c),d.mesh.drawInstances(l.length),this.drawCalls++}this.wind(!1)}}bindCrowdTexture(e){const t=this.gl;t.activeTexture(t.TEXTURE0+ki),t.bindTexture(t.TEXTURE_2D,this.crowdTexture),t.uniform1i(e.uniform("uCrowd"),ki)}makeCrowdTexture(e){const t=this.gl,i=t.createTexture();if(!i)throw new Error("crowd texture allocation failed");t.bindTexture(t.TEXTURE_2D,i),t.texStorage2D(t.TEXTURE_2D,1,t.RGBA32F,ut,e),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.bindTexture(t.TEXTURE_2D,null),this.crowdRows=e;const o=new Float32Array(ut*4*e);return o.set(this.crowdData.subarray(0,Math.min(this.crowdData.length,o.length))),this.crowdData=o,i}stageCrowd(e){var r;const t=e.length*Yt;this.crowdData.length<this.crowdUsed+t&&(this.gl.deleteTexture(this.crowdTexture),this.crowdTexture=this.makeCrowdTexture(Math.max(this.crowdRows*2,Math.ceil((this.crowdUsed+t)/(ut*4)))),this.crowdSent=0);const i=this.crowdData,o=this.crowdUsed;for(let s=0;s<e.length;s++){const n=e[s],u=n.model,l=o+s*Yt;i[l]=u[0],i[l+1]=u[4],i[l+2]=u[8],i[l+3]=u[12],i[l+4]=u[1],i[l+5]=u[5],i[l+6]=u[9],i[l+7]=u[13],i[l+8]=u[2],i[l+9]=u[6],i[l+10]=u[10],i[l+11]=u[14],i[l+12]=n.skinBase??0,i[l+13]=((r=n.wear)==null?void 0:r.seed)??0,i[l+14]=Math.min(1,Math.max(0,n.fade??1)),i[l+15]=Math.min(1,Math.max(0,n.grey??0))}return this.crowdUsed+=t,o/Yt}flushCrowds(){if(this.crowdUsed<=this.crowdSent)return;const e=this.gl,t=ut*4,i=Math.floor(this.crowdSent/t),o=Math.ceil(this.crowdUsed/t);e.bindTexture(e.TEXTURE_2D,this.crowdTexture),e.texSubImage2D(e.TEXTURE_2D,0,0,i,ut,o-i,e.RGBA,e.FLOAT,this.crowdData,i*t),e.bindTexture(e.TEXTURE_2D,null),this.crowdSent=this.crowdUsed}sortedInstances(){var o;const e=this.sorted;if(e.frame===this.frame)return e;e.frame=this.frame,e.solid.length=0,e.clear.length=0;for(const r of this.instances)r.hidden||((o=r.material)!=null&&o.transparent?e.clear.push(r):e.solid.push(r));const t=new Map,i=r=>{const s=r??this.defaultMaterial;let n=t.get(s);return n===void 0&&t.set(s,n=t.size),n};return e.solid.sort((r,s)=>i(r.material)-i(s.material)),e}boxOf(e){let t=this.boxes.get(e);if(t||(t={frame:-1,box:new Float32Array(6)},this.boxes.set(e,t)),t.frame!==this.frame){const i=e.bounds??e.mesh;Zt(e.model,i.min,i.max,t.box),t.frame=this.frame}return t.box}seen(e,t,i=6){return!this.culling||mt(t,this.boxOf(e),i)}groupBox(e){const t=this.scratchBox,{min:i,max:o}=e.bounds;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=o[0],t[4]=o[1],t[5]=o[2],t}unbind(){this.bound.program=null,this.bound.material=null,this.boundPalette=null}useMaterial(e,t){this.bound.program===e&&this.bound.material===t||(this.bindMaterial(e,t),this.bound.program=e,this.bound.material=t)}drawWires(e,t,i){const o=lt(de(e,t),this.planes),r=this.instances.filter(n=>n.wireframe&&!n.hidden&&this.seen(n,o));if(!r.length)return;const s=this.gl;s.depthMask(!1);for(const n of[!1,!0]){const u=r.filter(c=>this.isSkinned(c)===n);if(!u.length)continue;const l=n?this.wireSkinnedProgram:this.wireProgram;l.use(),l.setMat4("uProjection",e),l.setMat4("uView",t),l.setVec3("uColor",...this.wireColor),l.setFloat("uToneMap",i?1:0),n&&s.uniform1i(l.uniform("uJoints"),rt);for(const c of u)n&&this.bindSkin(l,c),l.setMat4("uModel",c.model),c.mesh.drawWire(),this.drawCalls++}s.depthMask(!0)}shadowPass(e){var t,i,o,r;this.shadows.setup(e.focus,this.lighting.sunDir,e.distance);for(let s=0;s<this.shadows.count;s++){if(!this.shadows.isDue(s))continue;this.shadows.begin(s);const n=this.shadows.viewProj(s),u=this.shadows.program;u.use(),u.setMat4("uLightViewProj",n);const l=lt(n,this.planes),c=this.skinnedCasters;c.length=0;const d=this.rigidCasters;d.length=0;const h=this.cutoutCasters;h.length=0;for(const x of this.instances){if(x.hidden||(t=x.material)!=null&&t.transparent)continue;const v=x.shadow??"all";if(!(v==="none"||v==="near"&&s>0||v==="mid"&&s>1)&&this.seen(x,l,4)){if((i=x.material)!=null&&i.cutoff){h.push(x);continue}if(this.isSkinned(x)){c.push(x);continue}d.push(x)}}const m=this.shadowGroups;Dt(m);for(const x of d){const v=this.crowds?this.idOf(x.mesh)*2+(Pe(x.model)?1:0):-this.idOf(x),p=m.get(v);p?p.push(x):m.set(v,[x])}let g=0;for(const x of m.values()){if(x.length>1){g++;continue}if(!x.length)continue;const v=x[0];u.setMat4("uModel",v.model),this.wind(Pe(v.model)),v.mesh.draw(),this.drawCalls++}if(this.wind(!1),g){const x=this.stageAll(m);this.flushCrowds();const v=this.shadows.crowdProgram;v.use(),v.setMat4("uLightViewProj",n),this.bindCrowdTexture(v);for(let p=0;p<x;p++){const b=this.stagedG[p],F=this.stagedAt[p];this.wind(Pe(b[0].model)),this.gl.uniform1i(v.uniform("uCrowdBase"),F),b[0].mesh.drawInstances(b.length),this.drawCalls++}this.wind(!1)}if(d.length=0,c.length){const x=this.shadowSkinnedGroups;Dt(x);for(const b of c){const F=this.crowds&&this.skinnedCrowds?(this.idOf(b.mesh)*65536+this.idOf(b.skin))*2+(Pe(b.model)?1:0):-this.idOf(b),_=x.get(F);_?_.push(b):x.set(F,[b])}const v=this.shadows.skinnedProgram;v.use(),v.setMat4("uLightViewProj",n),this.gl.uniform1i(v.uniform("uJoints"),rt);let p=0;for(const b of x.values()){if(b.length>1){p++;continue}if(!b.length)continue;const F=b[0];this.bindSkin(v,F),v.setMat4("uModel",F.model),this.wind(Pe(F.model)),F.mesh.draw(),this.drawCalls++}if(p){const b=this.stageAll(x);this.flushCrowds();const F=this.shadows.skinnedInstancedProgram;F.use(),F.setMat4("uLightViewProj",n),this.gl.uniform1i(F.uniform("uJoints"),rt),this.bindCrowdTexture(F);for(let _=0;_<b;_++){const E=this.stagedG[_],R=this.stagedAt[_];this.bindSkin(F,E[0]),this.wind(Pe(E[0].model)),this.gl.uniform1i(F.uniform("uCrowdBase"),R),E[0].mesh.drawInstances(E.length),this.drawCalls++}}this.wind(!1),c.length=0}const w=this.cutoutGroups;if(w.length=0,this.instanced.length){const x=this.shadows.instancedProgram;x.use(),x.setMat4("uLightViewProj",n);for(const v of this.instanced){if(v.mesh.count===0||(o=v.material)!=null&&o.transparent||this.culling&&v.bounds&&!mt(l,this.groupBox(v),4))continue;const p=v.shadow??"all";if(!(p==="none"||p==="near"&&s>0||p==="mid"&&s>1)){if((r=v.material)!=null&&r.cutoff){w.push(v);continue}this.wind(!!v.mirrored),(v.shadowMesh??v.mesh).draw(),this.drawCalls++}}this.wind(!1)}(h.length||w.length)&&this.cutoutShadows(n,h,w)}this.shadows.end(this.canvas.width,this.canvas.height)}cutoutShadows(e,t,i){const o=this.gl,r=o.isEnabled(o.CULL_FACE);let s=null;const n=(u,l)=>{l!==s&&(s=l,l.doubleSided?o.disable(o.CULL_FACE):o.enable(o.CULL_FACE),(l.albedo??this.white).bind(0),u.setFloat("uUvScale",l.uvScale),u.setFloat("uOpacity",l.opacity),u.setFloat("uCutoff",oo(l)))};for(let u=0;u<2;u++){const l=u===0?this.shadows.cutoutProgram:this.shadows.cutoutSkinnedProgram;let c=!1;for(const d of t)this.isSkinned(d)===(u===1)&&(c||(c=!0,s=null,l.use(),l.setMat4("uLightViewProj",e),o.uniform1i(l.uniform("uAlbedo"),0),u===1&&o.uniform1i(l.uniform("uJoints"),rt)),n(l,d.material),u===1&&this.bindSkin(l,d),l.setMat4("uModel",d.model),this.wind(Pe(d.model)),d.mesh.draw(),this.drawCalls++)}if(i.length){const u=this.shadows.cutoutInstancedProgram;s=null,u.use(),u.setMat4("uLightViewProj",e),o.uniform1i(u.uniform("uAlbedo"),0);for(const l of i)n(u,l.material),this.wind(!!l.mirrored),(l.shadowMesh??l.mesh).draw(),this.drawCalls++}this.wind(!1),r?o.enable(o.CULL_FACE):o.disable(o.CULL_FACE)}wind(e){e!==this.clockwise&&(this.clockwise=e,this.gl.frontFace(e?this.gl.CW:this.gl.CCW))}bindLook(e,t){const i=t==null?void 0:t.tint,o=t==null?void 0:t.glow,r=t==null?void 0:t.wear;this.gl.uniform4f(e.uniform("uTint"),i?i[0]:1,i?i[1]:1,i?i[2]:1,i?Math.min(1,Math.max(0,i[3])):0),this.gl.uniform3f(e.uniform("uGlow"),o?o[0]:0,o?o[1]:0,o?o[2]:0),this.gl.uniform1f(e.uniform("uEmissiveScale"),(t==null?void 0:t.emissive)??1),this.gl.uniform4f(e.uniform("uWear"),r?Math.min(1,Math.max(0,r.amount)):0,es[(r==null?void 0:r.kind)??"scorch"],(r==null?void 0:r.scale)??12,(r==null?void 0:r.seed)??0),this.gl.uniform2f(e.uniform("uFadeGrey"),Math.min(1,Math.max(0,(t==null?void 0:t.fade)??1)),Math.min(1,Math.max(0,(t==null?void 0:t.grey)??0)))}bindMaterial(e,t){var r,s,n;t.doubleSided?this.gl.disable(this.gl.CULL_FACE):this.gl.enable(this.gl.CULL_FACE),(t.albedo??this.white).bind(0),this.gl.uniform1i(e.uniform("uAlbedo"),0),(t.metallicRoughness??this.white).bind(4),this.gl.uniform1i(e.uniform("uMetalRough"),4),e.setFloat("uHasMetalRough",(r=t.metallicRoughness)!=null&&r.loaded?1:0),(t.normal??this.white).bind(5),this.gl.uniform1i(e.uniform("uNormalMap"),5),e.setFloat("uHasNormal",(s=t.normal)!=null&&s.loaded?1:0),e.setVec3("uMatColor",...t.color),e.setFloat("uUvScale",t.uvScale),e.setFloat("uMetallic",t.metallic),e.setFloat("uRoughness",t.roughness),e.setVec3("uEmissive",...t.emissive),(t.emissiveMap??this.white).bind(io),this.gl.uniform1i(e.uniform("uEmissiveMap"),io),e.setFloat("uEmissiveMapState",t.emissiveMap?t.emissiveMap.loaded?1:2:0),e.setFloat("uTransparent",t.transparent?1:0),e.setFloat("uOpacity",t.opacity),e.setFloat("uCutoff",oo(t));const i=t.fade;if(e.setFloat("uFadeDist",i?i.distance:0),i){this.gl.uniform4f(e.uniform("uFadeRect"),i.rect[0],i.rect[1],i.rect[2],i.rect[3]);const u=i.color;this.gl.uniform4f(e.uniform("uFadeColor"),u?u[0]:0,u?u[1]:0,u?u[2]:0,u?1:0)}const o=t.splat;if(e.setFloat("uNearFade",this.nearFade.enabled&&t.nearFade&&!o?this.nearFade.distance:0),e.setFloat("uSplatOn",o?1:0),o){const u=this.gl;u.activeTexture(u.TEXTURE9),u.bindTexture(u.TEXTURE_2D,o.map.texture),o.layers.bind(10),u.uniform2f(e.uniform("uSplatSize"),o.map.width,o.map.height),e.setFloat("uSplatLevelH",o.levelHeight),e.setFloat("uSplatCliff",o.cliff),e.setFloat("uSplatNoise",o.noise),e.setFloat("uSplatSharp",o.sharpness),e.setFloat("uSplatOutLayer",((n=o.outside)==null?void 0:n.layer)??0),e.setFloat("uSplatOutDist",o.outside?Math.max(.01,o.outside.distance):0);const l=o.grid&&o.grid.size>0?o.grid:null;e.setFloat("uSplatGrid",l?l.size:0),e.setFloat("uSplatGridWidth",(l==null?void 0:l.width)??.025),e.setFloat("uSplatGridOpacity",(l==null?void 0:l.opacity)??.2);const c=this.tintScratch.fill(1);for(let g=0;g<Math.min(ot,o.tints.length);g++)c.set(o.tints[g],g*3);u.uniform3fv(e.uniform("uSplatTint"),c);const d=this.roughScratch.fill(.9);for(let g=0;g<Math.min(ot,o.roughness.length);g++)d[g]=o.roughness[g];u.uniform1fv(e.uniform("uSplatRough"),d);const h=o.surface,m=!!h&&(h.bump>0||h.roughness>0);e.setFloat("uSurfOn",m?1:0),h&&m&&(h.layers.bind(12),e.setFloat("uSurfBump",Math.max(0,h.bump)),e.setFloat("uSurfRough",Math.max(0,h.roughness)))}else e.setFloat("uSurfOn",0)}setFrameUniforms(e,t,i,o){e.setMat4("uProjection",t),e.setMat4("uView",i);const r=this.lighting,s=r.sunDir,n=Math.hypot(s[0],s[1],s[2])||1;e.setVec3("uSunDir",s[0]/n,s[1]/n,s[2]/n),e.setVec3("uSunColor",...r.sunColor),e.setFloat("uSunIntensity",r.sunIntensity),e.setVec3("uSkyColor",...r.skyColor),e.setFloat("uAmbient",r.ambient),e.setVec3("uGroundColor",...r.groundColor),this.envMap.bind(6),this.gl.uniform1i(e.uniform("uEnv"),6),e.setFloat("uEnvStrength",this.env.enabled?this.env.strength:0),e.setFloat("uEnvMips",this.envMap.mips),e.setFloat("uExposure",r.exposure),e.setFloat("uToneMap",this.post.settings.enabled?0:1),e.setVec3("uFogColor",...this.fogColor),this.gl.uniform2f(e.uniform("uFogRange"),this.fogRange[0],this.fogRange[1]),e.setVec3("uEye",o[0],o[1],o[2]),e.setFloat("uClipY",this.clipY);const u=this.shadows,l=m=>2*u.halfExtent(Math.min(m,u.count-1))/u.size*1.2;this.gl.uniform3f(e.uniform("uShadowOffset"),l(0),l(1),l(2)),e.setMat4("uLightVP0",u.viewProj(0)),e.setMat4("uLightVP1",u.viewProj(Math.min(1,u.count-1))),e.setMat4("uLightVP2",u.viewProj(Math.min(2,u.count-1))),this.gl.uniform1i(e.uniform("uShadow0"),1),this.gl.uniform1i(e.uniform("uShadow1"),7),this.gl.uniform1i(e.uniform("uShadow2"),8),this.gl.uniform1i(e.uniform("uCascades"),u.count),e.setFloat("uShadowTexel",1/u.size),e.setFloat("uShadowStrength",u.settings.strength),e.setFloat("uShadowSoft",u.settings.soft?1:0),e.setFloat("uLightSize",u.settings.lightSize),this.gl.uniform1i(e.uniform("uLights"),2),this.gl.uniform1i(e.uniform("uTiles"),3),this.gl.uniform1i(e.uniform("uSplatCells"),9),this.gl.uniform1i(e.uniform("uSplatLayers"),10),this.gl.uniform1i(e.uniform("uSurfLayers"),12);const c=this.clouds.settings;this.clouds.bindCommon(e,11),e.setFloat("uCloudShadow",c.shadows?1:0);const d=this.fogVolumes,h=d.settings.shadows&&this.post.settings.enabled?d.active:0;d.bind(this.gl,e,h,bo),e.setFloat("uFogVolShadow",h?1:0),this.gl.uniform2f(e.uniform("uTileInfo"),this.lights.tilesX,et)}}const ro=a=>`#version 300 es
layout(location = 0) in vec3 aPosition;
uniform mat4 uProjection;
uniform mat4 uView;
uniform mat4 uModel;
${a?Ri:""}
void main() {
  gl_Position = uProjection * uView * uModel * ${a?"skinMatrix(uJointBase) * ":""}vec4(aPosition, 1.0);
  gl_Position.z -= 0.0004 * gl_Position.w;
}`,so=`#version 300 es
precision highp float;
uniform vec3 uColor;
uniform float uToneMap;
out vec4 outColor;
void main() {
  vec3 c = uToneMap > 0.5 ? pow(uColor, vec3(1.0 / 2.2)) : uColor;
  outColor = vec4(c, 1.0);
}`;function no(a,e,t){const i=[e[0]-a[0],e[1]-a[1],e[2]-a[2]],o=Math.hypot(i[0],i[1],i[2])||1;return[a[0]+i[0]/o*t,a[1]+i[1]/o*t,a[2]+i[2]/o*t]}class _s{constructor(){f(this,"target",[0,0,0]);f(this,"yaw",Math.PI*.25);f(this,"pitch",55*Math.PI/180);f(this,"distance",24);f(this,"fov",45*Math.PI/180);f(this,"near",.1);f(this,"far",500);f(this,"minDistance",4);f(this,"maxDistance",120);f(this,"minPitch",12*Math.PI/180);f(this,"maxPitch",85*Math.PI/180)}eye(){const e=Math.cos(this.pitch);return[this.target[0]-Math.sin(this.yaw)*e*this.distance,this.target[1]+Math.sin(this.pitch)*this.distance,this.target[2]-Math.cos(this.yaw)*e*this.distance]}view(){return Ht(this.eye(),this.target)}projection(e){return mo(this.fov,e,this.near,Math.max(this.far,this.maxDistance*2.5))}pan(e,t){const i=Math.sin(this.yaw),o=Math.cos(this.yaw);this.target=[this.target[0]-o*e+i*t,this.target[1],this.target[2]+i*e+o*t]}rotate(e,t){this.yaw+=e,this.pitch=Math.min(this.maxPitch,Math.max(this.minPitch,this.pitch+t))}zoom(e){this.distance=Math.min(this.maxDistance,Math.max(this.minDistance,this.distance*e))}}const Be=11,Et=Be*4;function ts(a){a.enableVertexAttribArray(0),a.vertexAttribPointer(0,3,a.FLOAT,!1,Et,0),a.enableVertexAttribArray(1),a.vertexAttribPointer(1,3,a.FLOAT,!1,Et,12),a.enableVertexAttribArray(2),a.vertexAttribPointer(2,3,a.FLOAT,!1,Et,24),a.enableVertexAttribArray(3),a.vertexAttribPointer(3,2,a.FLOAT,!1,Et,36)}class Ct{constructor(e,t){f(this,"vao");f(this,"count");f(this,"min");f(this,"max");f(this,"vbo");f(this,"ibo");f(this,"indices");f(this,"skinVbo",null);f(this,"dynamic",!1);f(this,"wire",null);this.gl=e;const i=e.createVertexArray(),o=e.createBuffer(),r=e.createBuffer();if(!i||!o||!r)throw new Error("mesh allocation failed");this.vao=i,this.vbo=o,this.ibo=r,e.bindVertexArray(i),e.bindBuffer(e.ARRAY_BUFFER,o),e.bufferData(e.ARRAY_BUFFER,t.vertices,e.STATIC_DRAW),ts(e),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,r),e.bufferData(e.ELEMENT_ARRAY_BUFFER,t.indices,e.STATIC_DRAW),e.bindVertexArray(null),this.count=t.indices.length,this.indices=t.indices,[this.min,this.max]=Nt(t.vertices,Be)}draw(){if(this.count===0)return;const e=this.gl;e.bindVertexArray(this.vao),e.drawElements(e.TRIANGLES,this.count,e.UNSIGNED_INT,0),e.bindVertexArray(null)}drawInstances(e){if(this.count===0||e<=0)return;const t=this.gl;t.bindVertexArray(this.vao),t.drawElementsInstanced(t.TRIANGLES,this.count,t.UNSIGNED_INT,0,e),t.bindVertexArray(null)}get skinned(){return this.skinVbo!==null}setSkin(e,t){const i=this.gl,o=Math.min(e.length,t.length)/4,r=new Float32Array(o*8);for(let s=0;s<o;s++)r.set(e.subarray(s*4,s*4+4),s*8),r.set(t.subarray(s*4,s*4+4),s*8+4);if(!this.skinVbo){const s=i.createBuffer();if(!s)throw new Error("skin buffer allocation failed");this.skinVbo=s}i.bindVertexArray(this.vao),this.bindSkin(),i.bufferData(i.ARRAY_BUFFER,r,i.STATIC_DRAW),i.bindVertexArray(null),i.bindBuffer(i.ARRAY_BUFFER,null),this.dropWire()}bindSkin(){const e=this.gl;e.bindBuffer(e.ARRAY_BUFFER,this.skinVbo),e.enableVertexAttribArray(vi),e.vertexAttribPointer(vi,4,e.FLOAT,!1,32,0),e.enableVertexAttribArray(pi),e.vertexAttribPointer(pi,4,e.FLOAT,!1,32,16)}setVertices(e){const t=this.gl;t.bindBuffer(t.ARRAY_BUFFER,this.vbo),this.dynamic?t.bufferSubData(t.ARRAY_BUFFER,0,e):(t.bufferData(t.ARRAY_BUFFER,e,t.DYNAMIC_DRAW),this.dynamic=!0),t.bindBuffer(t.ARRAY_BUFFER,null);const[i,o]=Nt(e,Be);for(let r=0;r<3;r++)this.min[r]=i[r],this.max[r]=o[r]}setIndices(e){const t=this.gl;t.bindVertexArray(this.vao),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.ibo),t.bufferData(t.ELEMENT_ARRAY_BUFFER,e,t.DYNAMIC_DRAW),t.bindVertexArray(null),this.count=e.length,this.indices=e,this.dropWire()}drawWire(){const e=this.gl;if(!this.wire){const t=this.indices,i=new Set,o=[],r=67108864;for(let u=0;u+2<t.length;u+=3)for(const[l,c]of[[t[u],t[u+1]],[t[u+1],t[u+2]],[t[u+2],t[u]]]){const d=l<c?l*r+c:c*r+l;i.has(d)||(i.add(d),o.push(l,c))}const s=e.createVertexArray(),n=e.createBuffer();if(!s||!n)throw new Error("wireframe allocation failed");e.bindVertexArray(s),e.bindBuffer(e.ARRAY_BUFFER,this.vbo),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,3,e.FLOAT,!1,Et,0),this.skinVbo&&this.bindSkin(),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,n),e.bufferData(e.ELEMENT_ARRAY_BUFFER,new Uint32Array(o),e.STATIC_DRAW),e.bindVertexArray(null),this.wire={vao:s,ibo:n,count:o.length}}this.wire.count&&(e.bindVertexArray(this.wire.vao),e.drawElements(e.LINES,this.wire.count,e.UNSIGNED_INT,0),e.bindVertexArray(null))}dropWire(){this.wire&&(this.gl.deleteVertexArray(this.wire.vao),this.gl.deleteBuffer(this.wire.ibo),this.wire=null)}dispose(){this.dropWire(),this.gl.deleteVertexArray(this.vao),this.gl.deleteBuffer(this.vbo),this.gl.deleteBuffer(this.ibo),this.skinVbo&&this.gl.deleteBuffer(this.skinVbo)}}class is{constructor(){f(this,"verts",[]);f(this,"idx",[])}quad(e,t,i,o,r,s=[[0,0],[1,0],[1,1],[0,1]]){const n=lo(e,t,i),u=this.verts.length/Be;return[e,t,i,o].forEach((l,c)=>this.verts.push(l[0],l[1],l[2],n[0],n[1],n[2],r[0],r[1],r[2],s[c][0],s[c][1])),this.idx.push(u,u+1,u+2,u,u+2,u+3),this}tri(e,t,i,o,r=[[0,0],[1,0],[1,1]]){const s=lo(e,t,i),n=this.verts.length/Be;return[e,t,i].forEach((u,l)=>this.verts.push(u[0],u[1],u[2],s[0],s[1],s[2],o[0],o[1],o[2],r[l][0],r[l][1])),this.idx.push(n,n+1,n+2),this}build(){return{vertices:new Float32Array(this.verts),indices:new Uint32Array(this.idx)}}}function lo(a,e,t){const i=e[0]-a[0],o=e[1]-a[1],r=e[2]-a[2],s=t[0]-a[0],n=t[1]-a[1],u=t[2]-a[2],l=o*u-r*n,c=r*s-i*u,d=i*n-o*s,h=Math.hypot(l,c,d)||1;return[l/h,c/h,d/h]}function Ms(a,e,t,i,o,r,s){const n=new is;return n.quad([a,e,r],[i,e,r],[i,o,r],[a,o,r],s),n.quad([i,e,t],[a,e,t],[a,o,t],[i,o,t],s),n.quad([i,e,r],[i,e,t],[i,o,t],[i,o,r],s),n.quad([a,e,t],[a,e,r],[a,o,r],[a,o,t],s),n.quad([a,o,r],[i,o,r],[i,o,t],[a,o,t],s),n.quad([a,e,t],[i,e,t],[i,e,r],[a,e,r],s),n.build()}const os=`function $(c, u) {
  const a = c.vertices, d = a.length / 11, l = new Int32Array(d), v = /* @__PURE__ */ new Map(), e = [], f = [];
  for (let i = 0; i < d; i++) {
    const t = i * 11, s = \`\${Math.floor(a[t] / u)},\${Math.floor(a[t + 1] / u)},\${Math.floor(a[t + 2] / u)}\`;
    let n = v.get(s);
    n === void 0 && (n = e.length / 10, v.set(s, n), e.push(0, 0, 0, 0, 0, 0, 0, 0, 0, 0), f.push(i)), l[i] = n;
    const E = n * 10;
    for (let M = 0; M < 9; M++) e[E + M] += a[t + M];
    e[E + 9] += 1;
  }
  const y = e.length / 10, o = new Float32Array(y * 11);
  for (let i = 0; i < y; i++) {
    const t = i * 10, s = e[t + 9] || 1, n = i * 11, E = f[i] * 11;
    o[n] = e[t] / s, o[n + 1] = e[t + 1] / s, o[n + 2] = e[t + 2] / s;
    const M = Math.hypot(e[t + 3], e[t + 4], e[t + 5]) || 1;
    o[n + 3] = e[t + 3] / M, o[n + 4] = e[t + 4] / M, o[n + 5] = e[t + 5] / M, o[n + 6] = e[t + 6] / s, o[n + 7] = e[t + 7] / s, o[n + 8] = e[t + 8] / s, o[n + 9] = a[E + 9], o[n + 10] = a[E + 10];
  }
  const T = [], r = /* @__PURE__ */ new Set(), h = c.indices;
  for (let i = 0; i + 2 < h.length; i += 3) {
    const t = l[h[i]], s = l[h[i + 1]], n = l[h[i + 2]];
    if (t === s || s === n || t === n) continue;
    const E = t < s && t < n ? \`\${t},\${s},\${n}\` : s < n ? \`\${s},\${n},\${t}\` : \`\${n},\${t},\${s}\`;
    r.has(E) || (r.add(E), T.push(t, s, n));
  }
  return { vertices: o, indices: new Uint32Array(T) };
}
function g(c, u) {
  if (c.indices.length / 3 <= u) return c;
  let a = 1 / 0, d = -1 / 0, l = 1 / 0, v = -1 / 0, e = 1 / 0, f = -1 / 0;
  for (let r = 0; r < c.vertices.length; r += 11)
    a = Math.min(a, c.vertices[r]), d = Math.max(d, c.vertices[r]), l = Math.min(l, c.vertices[r + 1]), v = Math.max(v, c.vertices[r + 1]), e = Math.min(e, c.vertices[r + 2]), f = Math.max(f, c.vertices[r + 2]);
  let o = (Math.max(d - a, v - l, f - e) || 1) / 64, T = c;
  for (let r = 0; r < 8 && T.indices.length / 3 > u; r++)
    T = $(c, o), o *= 1.5;
  return T;
}
self.onmessage = (c) => {
  const { id: u, vertices: a, indices: d, targets: l } = c.data, v = { vertices: a, indices: d }, e = l.map((f) => g(v, f));
  self.postMessage({ id: u, levels: e }, e.flatMap((f) => [f.vertices.buffer, f.indices.buffer]));
};
//# sourceMappingURL=lodWorker-DnD4OyN-.js.map
`;typeof self<"u"&&self.Blob&&new Blob(["URL.revokeObjectURL(import.meta.url);",os],{type:"text/javascript;charset=utf-8"});const Co={topLow:[.54,.63,.48],topHigh:[1,1,1],step:[.96,.93,.89],cliff:[.85,.73,.65],rim:[.23,.19,.16]},as=2,rs=.3,ss=.28,ns=.34,uo=4,ls=.3,Ge=[0,1,0,-1],We=[-1,0,1,0],us=[[0,1,2,3],[1,3,0,2],[2,3,0,1],[0,2,1,3]],cs=[[0,0,0],[3,0,1],[2,2,2]];function co(a,e){const t=(l,c)=>{let d=l*374761393+c*668265263|0;return d=Math.imul(d^d>>>13,1274126177),((d^d>>>16)>>>0)/4294967296},i=Math.floor(a),o=Math.floor(e);let r=a-i,s=e-o;r=r*r*(3-2*r),s=s*s*(3-2*s);const n=t(i,o)+(t(i+1,o)-t(i,o))*r,u=t(i,o+1)+(t(i+1,o+1)-t(i,o+1))*r;return n+(u-n)*s}function hs(a,e,t){var w,x;const{width:i,height:o}=a,r=t??new Float32Array(i*o*4),s=0,n=o,u=0,l=i,c=a.maxStep,d=a.levelHeight,h=new Float64Array(4),m=new Uint8Array(4),g=(v,p,b)=>{for(let E=0;E<4;E++){const R=v-1+(E&1),M=p-1+(E>>1);h[E]=R>=0&&M>=0&&R<i&&M<o?a.level(R,M):NaN,m[E]=E===b?1:0}for(let E=!0;E;){E=!1;for(let R=0;R<4;R++){const M=h[R];if(!(m[R]||M!==M)){for(let z=0;z<4;z++)if(m[z]&&Math.abs(h[z]-M)<=c){m[R]=1,E=!0;break}}}}let F=0,_=0;for(let E=0;E<4;E++)m[E]&&(F+=h[E],_++);return F/Math.max(1,_)*d};for(let v=s;v<n;v++)for(let p=u;p<l;p++){const b=(v*i+p)*4,F=((w=a.sink)==null?void 0:w.call(a,p,v))??0;if((x=a.flat)!=null&&x.call(a,p,v)){const _=a.level(p,v)*d-F;r[b]=r[b+1]=r[b+2]=r[b+3]=_}else r[b]=g(p,v,3)-F,r[b+1]=g(p+1,v,2)-F,r[b+2]=g(p,v+1,1)-F,r[b+3]=g(p+1,v+1,0)-F;if(a.corner)for(let _=0;_<4;_++)r[b+_]=a.corner(p,v,_,r[b+_])}return r}function fs(a,e,t,i,o){const r=Math.min(e-1,Math.max(0,Math.floor(i))),s=Math.min(t-1,Math.max(0,Math.floor(o))),n=Math.min(1,Math.max(0,i-r)),u=Math.min(1,Math.max(0,o-s)),l=(s*e+r)*4,c=a[l]+(a[l+1]-a[l])*n,d=a[l+2]+(a[l+3]-a[l+2])*n;return c+(d-c)*u}function ds(a,e,t,i){if(!i)return a;let o=0;for(let n=0;n<t;n++)i[n]&&(o+=e[n*2+1]);const r=new Uint32Array(o);let s=0;for(let n=0;n<t;n++){if(!i[n])continue;const u=e[n*2],l=e[n*2+1];r.set(a.subarray(u,u+l),s),s+=l}return r}function ui(a,e=.001){const t=a.vertices,i=t.length/Be;if(i===0)return;const o=new Int32Array(i),r=new Int32Array(i),s=new Int32Array(i);let n=1;for(;n<i*2;)n<<=1;const u=n-1,l=new Int32Array(n).fill(-1),c=new Int32Array(i);for(let m=0;m<i;m++){const g=m*Be,w=Math.round(t[g]/e),x=Math.round(t[g+1]/e),v=Math.round(t[g+2]/e);o[m]=w,r[m]=x,s[m]=v;let p=Math.imul(w,2654435761)^Math.imul(x,2246822519)^Math.imul(v,3266489917);for(p^=p>>>15,p=Math.imul(p,739982445),p^=p>>>12,p&=u;;){const b=l[p];if(b<0){l[p]=m;break}if(o[b]===w&&r[b]===x&&s[b]===v)break;p=p+1&u}c[m]=p}const d=new Float64Array(n*3),h=new Int32Array(n);for(let m=0;m<i;m++){const g=m*Be,w=c[m];d[w*3]+=t[g+3],d[w*3+1]+=t[g+4],d[w*3+2]+=t[g+5],h[w]++}for(let m=0;m<i;m++){const g=c[m];if(h[g]<2)continue;const w=d[g*3],x=d[g*3+1],v=d[g*3+2],p=Math.hypot(w,x,v);if(p<1e-4)continue;const b=m*Be;t[b+3]=w/p,t[b+4]=x/p,t[b+5]=v/p}}function Pt(a,e,t){const i=Math.sin(a*12.9898+e*78.233+t*37.719)*43758.5453;return i-Math.floor(i)}function ci(a,e,t,i){const o=e*4,r=a[o]+(a[o+1]-a[o])*t,s=a[o+2]+(a[o+3]-a[o+2])*t;return r+(s-r)*i}class hi{constructor(){f(this,"v",[]);f(this,"idx",[])}get count(){return this.idx.length}tri(e,t,i,o,r,s,n,u,l,c,d,h,m,g,w,x){const v=s-e,p=n-t,b=u-i,F=d-e,_=h-t,E=m-i;let R=p*E-b*_,M=b*F-v*E,z=v*_-p*F;const L=Math.hypot(R,M,z)||1;R/=L,M/=L,z/=L;const A=this.v.length/Be;this.v.push(e,t,i,R,M,z,x[0],x[1],x[2],o,r,s,n,u,R,M,z,x[0],x[1],x[2],l,c,d,h,m,R,M,z,x[0],x[1],x[2],g,w),this.idx.push(A,A+1,A+2)}data(){return{vertices:new Float32Array(this.v),indices:new Uint32Array(this.idx)}}}class ms{constructor(){f(this,"v",[]);f(this,"idx",[])}get count(){return this.idx.length}tri(e,t,i,o,r,s,n,u,l,c,d,h,m){const g=this.v.length/7;this.v.push(e,t,i,m[0],m[1],m[2],o,r,s,n,m[0],m[1],m[2],u,l,c,d,m[0],m[1],m[2],h),this.idx.push(g,g+1,g+2)}data(){return{vertices:new Float32Array(this.v),indices:new Uint32Array(this.idx)}}}function ho(a,e,t=Co,i={}){var ie;const o=Math.max(0,i.faceRoughness??0),r=a.width,s=a.height,n=i.corners??hs(a),u=i.region,l=u?Math.max(0,u.x0-1):0,c=u?Math.max(0,u.z0-1):0,d=u?Math.min(r,u.x1+1):r,h=u?Math.min(s,u.z1+1):s,m=d-l,g=h-c,w=new Int32Array(m*g*2),x=new Int32Array(m*g*2),v=new Int32Array(m*g*2),p=new hi,b=new hi,F=new Int32Array(m*g*2);let _=p;const E=new hi,R=new ms,M=1/as,z=(T,y)=>y*r+T,L=(T,y)=>T>=0&&y>=0&&T<r&&y<s,A=(T,y)=>a.level(T,y),S=(T,y,C)=>{const I=T/Math.max(1,e),X=(y+C)%2===0?.94:1;return[(t.topLow[0]+(t.topHigh[0]-t.topLow[0])*I)*X,(t.topLow[1]+(t.topHigh[1]-t.topLow[1])*I)*X,(t.topLow[2]+(t.topHigh[2]-t.topLow[2])*I)*X]},U=(T,y,C,I,X,V,P,G,N,re)=>{(V-C)*(P-T)-(I-T)*(N-C)>=0?_.tri(T,y,C,T*M,C*M,I,X,V,I*M,V*M,P,G,N,P*M,N*M,re):_.tri(T,y,C,T*M,C*M,P,G,N,P*M,N*M,I,X,V,I*M,V*M,re)},D=(T,y,C)=>{var ge,ne;if(!L(T,y))return!1;const I=T+Ge[C],X=y+We[C];if(!L(I,X)||(ge=a.flat)!=null&&ge.call(a,T,y)||!(((ne=a.cliff)==null?void 0:ne.call(a,T,y,I,X))??A(T,y)-A(I,X)>a.maxStep))return!1;const[V,P,G,N]=us[C],re=z(T,y),oe=z(I,X);return n[re*4+V]>n[oe*4+G]+1e-4||n[re*4+P]>n[oe*4+N]+1e-4},ae=(T,y,C)=>ls*(.15+.85*Pt(T,y,C+7)),ee=(T,y,C,I)=>n[z(T,y)*4+(C-T)+2*(I-y)],se=(T,y,C,I,X,V,P)=>{const G=T+I,N=y+X;if(!D(T,y,C)||!D(G,N,C))return 0;const re=cs[X+1][I+1];if(D(T,y,re)||D(G,N,(re+2)%4))return 0;const oe=V-Ge[C],ge=P-We[C];if(Math.abs(ee(T,y,V,P)-ee(G,N,V,P))>1e-4||Math.abs(ee(T,y,oe,ge)-ee(G,N,oe,ge))>1e-4)return 0;const ne=T+Ge[C],ve=y+We[C];return Math.abs(ee(ne,ve,V,P)-ee(ne+I,ve+X,V,P))>1e-4?0:ae(V,P,C)},ue=(T,y,C,I,X,V,P,G,N,re,oe,ge=0,ne=1,ve=!1,Ye=0)=>{const Ne=Math.max(y-G,X-P);if(ve&&o>0&&Ne>.05){Ue(T,y,C,I,X,V,P,G,N,re,oe,ge,ne,Ye);return}const Se=I-T,qe=V-C,Ae=P-y,ke=qe*Ae*N+-Se*Ae*re>0,xe=(T+C)*M,we=(I+V)*M;ke?(E.tri(T,y,C,xe,y*M,I,X,V,we,X*M,I,P,V,we,P*M,oe),E.tri(T,y,C,xe,y*M,I,P,V,we,P*M,T,G,C,xe,G*M,oe)):(E.tri(T,y,C,xe,y*M,I,P,V,we,P*M,I,X,V,we,X*M,oe),E.tri(T,y,C,xe,y*M,T,G,C,xe,G*M,I,P,V,we,P*M,oe))},Ue=(T,y,C,I,X,V,P,G,N,re,oe,ge,ne,ve)=>{const Ye=Math.hypot(I-T,V-C),Ne=Math.max(1,Math.ceil(Ye/.2)),Se=ve>0?ve:Math.max(2,Math.ceil(Math.max(y-G,X-P)/.18)),qe=Math.hypot(N,re)||1,Ae=N/qe,ke=re/qe,xe=I-T,we=V-C,k=we*-1*Ae+-xe*-1*ke>0,W=(Z,ce)=>{const J=Z/Ne,pe=ce/Se,Q=T+xe*J,fe=C+we*J,De=y+(X-y)*J,Oe=G+(P-G)*J,Ce=De+(Oe-De)*pe,ze=ge+(ne-ge)*J,Re=De-Oe,Xe=Math.sin(Math.PI*pe)*Math.min(1,Math.min(ze,1-ze)*6)*Math.min(1,Math.max(0,Re)/.9),B=Q+fe,$=co(B*2.3,Ce*2.9)*.65+co(B*5.1+3.7,Ce*6.3+1.3)*.35,H=o*1.6*$*Xe;return[Q+Ae*H,Ce,fe+ke*H]},te=Z=>[(Z[0]+Z[2])*M,Z[1]*M];for(let Z=0;Z<Ne;Z++)for(let ce=0;ce<Se;ce++){const J=W(Z,ce),pe=W(Z+1,ce),Q=W(Z+1,ce+1),fe=W(Z,ce+1),[De,Oe]=te(J),[Ce,ze]=te(pe),[Re,Xe]=te(Q),[B,$]=te(fe);k?(E.tri(J[0],J[1],J[2],De,Oe,pe[0],pe[1],pe[2],Ce,ze,Q[0],Q[1],Q[2],Re,Xe,oe),E.tri(J[0],J[1],J[2],De,Oe,Q[0],Q[1],Q[2],Re,Xe,fe[0],fe[1],fe[2],B,$,oe)):(E.tri(J[0],J[1],J[2],De,Oe,Q[0],Q[1],Q[2],Re,Xe,pe[0],pe[1],pe[2],Ce,ze,oe),E.tri(J[0],J[1],J[2],De,Oe,fe[0],fe[1],fe[2],B,$,Q[0],Q[1],Q[2],Re,Xe,oe))}};for(let T=c;T<h;T++)for(let y=l;y<d;y++){const C=z(y,T),I=(T-c)*m+(y-l),X=A(y,T),V=n[C*4],P=n[C*4+1],G=n[C*4+2],N=n[C*4+3];_=(((ie=a.sink)==null?void 0:ie.call(a,y,T))??0)>0?b:p,w[I*2]=p.count,F[I*2]=b.count,x[I*2]=E.count,v[I*2]=R.count;const re=S(X,y,T),oe=(ne,ve,Ye,Ne,Se,qe,Ae,ke,xe,we)=>{let k=0,W=0,te=-1;if(L(ne,ve)){const ce=z(ne,ve);te=A(ne,ve),k=n[ce*4+xe],W=n[ce*4+we]}if(Se<=k+1e-4&&ke<=W+1e-4)return;const Z=te<0||X-te>a.maxStep?t.cliff:t.step;ue(Ye,Se,Ne,qe,ke,Ae,Math.min(W,ke),Math.min(k,Se),ne-y,ve-T,Z)},ge=[D(y,T,0),D(y,T,1),D(y,T,2),D(y,T,3)];if(!ge.some(Boolean))_.tri(y,V,T,y*M,T*M,y,G,T+1,y*M,(T+1)*M,y+1,N,T+1,(y+1)*M,(T+1)*M,re),_.tri(y,V,T,y*M,T*M,y+1,N,T+1,(y+1)*M,(T+1)*M,y+1,P,T,(y+1)*M,T*M,re),oe(y,T-1,y+1,T,P,y,T,V,3,2),oe(y,T+1,y,T+1,G,y+1,T+1,N,0,1),oe(y-1,T,y,T,V,y,T+1,G,1,3),oe(y+1,T,y+1,T+1,N,y+1,T,P,2,0);else{const ne=(k,W,te,Z,ce,J,pe)=>{const Q=se(y,T,Z,ce[0],ce[1],k,W),fe=se(y,T,J,pe[0],pe[1],k,W);return{x:k-Ge[Z]*Q-Ge[J]*fe,y:te,z:W-We[Z]*Q-We[J]*fe,t:0}},ve=ne(y,T,V,0,[-1,0],3,[0,-1]),Ye=ne(y+1,T,P,0,[1,0],1,[0,-1]),Ne=ne(y+1,T+1,N,2,[1,0],1,[0,1]),Se=ne(y,T+1,G,2,[-1,0],3,[0,1]),qe=[{from:ve,to:Se,sx:y,sz:T,sh:V,ex:y,ez:T+1,eh:G,side:3,nA:1,nB:3},{from:Se,to:Ne,sx:y,sz:T+1,sh:G,ex:y+1,ez:T+1,eh:N,side:2,nA:0,nB:1},{from:Ne,to:Ye,sx:y+1,sz:T+1,sh:N,ex:y+1,ez:T,eh:P,side:1,nA:2,nB:0},{from:Ye,to:ve,sx:y+1,sz:T,sh:P,ex:y,ez:T,eh:V,side:0,nA:3,nB:2}],Ae=[];for(const k of qe){const W=[{...k.from,t:0}];if(ge[k.side]){const B=-Ge[k.side],$=-We[k.side];for(let H=1;H<uo;H++){const j=H/uo,Y=k.sx+(k.ex-k.sx)*j,Fe=k.sz+(k.ez-k.sz)*j,be=ae(Y,Fe,k.side);W.push({x:Y+B*be,y:k.sh+(k.eh-k.sh)*j,z:Fe+$*be,t:j})}}Ae.push(...W),W.push({...k.to,t:1});const te=y+Ge[k.side],Z=T+We[k.side];if(!ge[k.side]){oe(te,Z,k.sx,k.sz,k.sh,k.ex,k.ez,k.eh,k.nA,k.nB);continue}const ce=z(te,Z),J=Math.min(n[ce*4+k.nA],k.sh),pe=Math.min(n[ce*4+k.nB],k.eh),Q=B=>J+(pe-J)*B,fe=S(A(te,Z),te,Z),De=B=>[k.sx+(k.ex-k.sx)*B,k.sz+(k.ez-k.sz)*B],Oe=Math.max(2,Math.ceil(Math.max(...W.map(B=>B.y-Q(B.t)))/.18));for(let B=0;B+1<W.length;B++){const $=W[B],H=W[B+1];ue($.x,$.y,$.z,H.x,H.y,H.z,Q(H.t),Q($.t),Ge[k.side],We[k.side],t.cliff,$.t,H.t,!0,Oe);const[j,Y]=De($.t),[Fe,be]=De(H.t),Ie=Q($.t),Me=Q(H.t);(Math.hypot($.x-j,$.z-Y)>1e-6||Math.hypot(H.x-Fe,H.z-be)>1e-6)&&(U($.x,Ie,$.z,j,Ie,Y,Fe,Me,be,fe),U($.x,Ie,$.z,Fe,Me,be,H.x,Me,H.z,fe))}const Ce=Ge[k.side],ze=We[k.side],Re=.015,Xe=W.map(B=>{const $=Pt(B.x,B.z,1),H=Pt(B.x,B.z,2),j=rs*(.55+.9*$),Y=B.x-Ce*j,Fe=B.z-ze*j,be=Q(B.t),Ie=ns*(.5+1*Pt(B.x,B.z,3)),Me=B.x+Ce*Ie,Rt=B.z+ze*Ie,Io=Me>=te&&Me<te+1&&Rt>=Z&&Rt<Z+1;return{ix:Y,iz:Fe,ih:ci(n,C,Math.min(1,Math.max(0,Y-y)),Math.min(1,Math.max(0,Fe-T)))+Re,drop:Math.min(ss*(.5+1*H),Math.max(.05,B.y-be)),a:.45+.3*H,fx:B.x,fz:B.z,fy:be+Re,gx:Me,gz:Rt,gy:(Io?ci(n,ce,Me-te,Rt-Z):be)+Re}});for(let B=0;B+1<W.length;B++){const $=W[B],H=W[B+1],j=Xe[B],Y=Xe[B+1];R.tri($.x,$.y+Re,$.z,j.a,j.ix,j.ih,j.iz,0,Y.ix,Y.ih,Y.iz,0,t.rim),R.tri($.x,$.y+Re,$.z,j.a,Y.ix,Y.ih,Y.iz,0,H.x,H.y+Re,H.z,Y.a,t.rim);const Fe=$.x+Ce*.012,be=$.z+ze*.012,Ie=H.x+Ce*.012,Me=H.z+ze*.012;R.tri(Fe,$.y,be,j.a,Ie,H.y,Me,Y.a,Ie,H.y-Y.drop,Me,0,t.rim),R.tri(Fe,$.y,be,j.a,Ie,H.y-Y.drop,Me,0,Fe,$.y-j.drop,be,0,t.rim),R.tri(j.fx,j.fy,j.fz,j.a,Y.fx,Y.fy,Y.fz,Y.a,Y.gx,Y.gy,Y.gz,0,t.rim),R.tri(j.fx,j.fy,j.fz,j.a,Y.gx,Y.gy,Y.gz,0,j.gx,j.gy,j.gz,0,t.rim)}}const ke=ci(n,C,.5,.5),xe=y+.5,we=T+.5;for(let k=0;k<Ae.length;k++){const W=Ae[k],te=Ae[(k+1)%Ae.length];_.tri(xe,ke,we,xe*M,we*M,W.x,W.y,W.z,W.x*M,W.z*M,te.x,te.y,te.z,te.x*M,te.z*M,re)}}w[I*2+1]=p.count-w[I*2],F[I*2+1]=b.count-F[I*2],x[I*2+1]=E.count-x[I*2],v[I*2+1]=R.count-v[I*2]}const he=p.data(),Te=b.data(),Ee=E.data();ui(he),ui(Te),ui(Ee);const q=R.data();if(u){const T=(C,I)=>{const X=new Uint8Array(m*g);for(let V=u.z0;V<u.z1;V++)for(let P=u.x0;P<u.x1;P++)X[(V-c)*m+(P-l)]=1;return ds(C,I,m*g,X)};he.indices=T(he.indices,w),Te.indices=T(Te.indices,F),Ee.indices=T(Ee.indices,x),q.indices=T(q.indices,v);const y=new Int32Array(0);return{tops:he,beds:Te,sides:Ee,rims:q,corners:n,topRanges:y,bedRanges:y,sideRanges:y,rimRanges:y,width:r,height:s}}return{tops:he,beds:Te,sides:Ee,rims:q,corners:n,topRanges:w,bedRanges:F,sideRanges:x,rimRanges:v,width:r,height:s}}const Po=1,fi=.5,Ai=8,Uo="battle-crab.map";function Lt(a={}){const e={center:[32,.9,32],size:[10,2,8],yaw:0,color:[.8,.86,.92],density:.45,softness:.5,falloff:.9,noise:.7,noiseScale:5,speed:.4,direction:60,rise:0,churn:.15,glow:[0,0,0],glowStrength:0},t=(i,o)=>Array.isArray(i)&&i.length===3?[Number(i[0]),Number(i[1]),Number(i[2])]:[...o];return{...e,...a,center:t(a.center,e.center),size:t(a.size,e.size),color:t(a.color,e.color),glow:t(a.glow,e.glow)}}function vs(a=64){const e=a*a;return{version:Po,name:"beach",size:a,levels:new Array(e).fill(0),paint:new Array(e).fill(0),mist:[Lt({center:[a/2,.5,a/2],size:[a,1.2,a],density:.12,noiseScale:9}),Lt({center:[a/2+10,.9,a/2-8],size:[12,2,9],yaw:25,density:.5}),Lt({center:[a/2-12,.9,a/2+9],size:[10,1.8,14],yaw:-40,density:.45})],spawn:[a/2,a/2]}}function ko(a){if(!a||typeof a!="object")return!1;const e=a;if(typeof e.size!="number"||e.size<8||e.size>256)return!1;const t=e.size*e.size;return!(!Array.isArray(e.levels)||e.levels.length!==t||!Array.isArray(e.paint)||e.paint.length!==t||!Array.isArray(e.mist)||!Array.isArray(e.spawn)||e.spawn.length!==2)}function zo(a){return{...a,version:Po,name:a.name||"beach",levels:a.levels.map(e=>Math.max(0,Math.min(Ai,Math.round(Number(e)||0)))),paint:a.paint.map(e=>Math.max(0,Math.round(Number(e)||0))),mist:a.mist.map(e=>Lt(e)),spawn:[Number(a.spawn[0])||a.size/2,Number(a.spawn[1])||a.size/2]}}function Ss(){try{const a=localStorage.getItem(Uo);if(a){const e=JSON.parse(a);if(ko(e))return zo(e)}}catch{}return vs()}function Ds(a){try{return localStorage.setItem(Uo,JSON.stringify(a)),!0}catch{return!1}}function Cs(a){const e=new Blob([JSON.stringify(a)],{type:"application/json"}),t=URL.createObjectURL(e),i=document.createElement("a");i.href=t,i.download=`${a.name||"map"}.json`,i.click(),setTimeout(()=>URL.revokeObjectURL(t),1e3)}async function Ps(a){const e=JSON.parse(await a.text());if(!ko(e))throw new Error(`${a.name} is not a Battle Crab map`);return zo(e)}function gt(a){let e=a>>>0;return()=>{e=e+1831565813>>>0;let t=e;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}function _i(a,e,t,i,o,r){for(const s of[-e,0,e])for(const n of[-e,0,e]){const u=t+s,l=i+n;u<-o||l<-o||u>e+o||l>e+o||r(u,l)}}function At(a,e,t,i,o,r,s,n=1){for(let u=0;u<i;u++)a.fillStyle=t()<.5?o:r,a.globalAlpha=s*(.4+t()*.6),a.fillRect(Math.floor(t()*e),Math.floor(t()*e),n,n);a.globalAlpha=1}function je(a,e,t,i,o,r,s,n){a.fillStyle=o;for(let u=0;u<i;u++){const l=s+t()*(n-s);a.globalAlpha=r*(.5+t()*.5),_i(a,e,t()*e,t()*e,l,(c,d)=>{a.beginPath(),a.ellipse(c,d,l,l*(.6+t()*.4),t()*Math.PI,0,Math.PI*2),a.fill()})}a.globalAlpha=1}const ps=(a,e)=>{const t=gt(11);a.fillStyle="#cdb27e",a.fillRect(0,0,e,e),je(a,e,t,40,"#d9c08c",.35,e*.05,e*.18),je(a,e,t,30,"#b89a68",.3,e*.04,e*.15),At(a,e,t,e*40,"#e8d6a8","#9c8252",.5)},gs=(a,e)=>{const t=gt(23);a.fillStyle="#8e7a58",a.fillRect(0,0,e,e),je(a,e,t,30,"#7a6749",.4,e*.08,e*.25),je(a,e,t,20,"#a08b66",.3,e*.05,e*.15),At(a,e,t,e*30,"#b4a07a","#5e4e36",.45)},xs=(a,e)=>{const t=gt(37);a.fillStyle="#9a927f",a.fillRect(0,0,e,e),At(a,e,t,e*20,"#b5ad9a","#6e675a",.5);for(let i=0;i<260;i++){const o=e*(.012+t()*.035),r=90+Math.floor(t()*90),s=Math.floor(t()*20),n=`rgb(${r+s}, ${r}, ${r-Math.floor(t()*15)})`,u=t()*Math.PI,l=.6+t()*.4;_i(a,e,t()*e,t()*e,o,(c,d)=>{a.globalAlpha=1,a.fillStyle="rgba(0,0,0,0.25)",a.beginPath(),a.ellipse(c+o*.15,d+o*.2,o,o*l,u,0,Math.PI*2),a.fill(),a.fillStyle=n,a.beginPath(),a.ellipse(c,d,o,o*l,u,0,Math.PI*2),a.fill(),a.fillStyle="rgba(255,255,255,0.18)",a.beginPath(),a.ellipse(c-o*.25,d-o*.25,o*.4,o*.3*l,u,0,Math.PI*2),a.fill()})}a.globalAlpha=1},ws=(a,e)=>{const t=gt(41);a.fillStyle="#5f7a35",a.fillRect(0,0,e,e),je(a,e,t,30,"#4e6a2a",.35,e*.06,e*.2),a.lineWidth=Math.max(1,e/256);for(let i=0;i<e*6;i++){const o=e*(.02+t()*.04),r=-Math.PI/2+(t()-.5)*1.2,s=100+Math.floor(t()*90);a.strokeStyle=`rgba(${Math.floor(s*.7)}, ${s}, ${Math.floor(s*.35)}, 0.8)`,_i(a,e,t()*e,t()*e,o,(n,u)=>{a.beginPath(),a.moveTo(n,u),a.lineTo(n+Math.cos(r)*o,u+Math.sin(r)*o),a.stroke()})}},bs=(a,e)=>{const t=gt(53);a.fillStyle="#6b6760",a.fillRect(0,0,e,e),je(a,e,t,30,"#7d7970",.35,e*.06,e*.2),je(a,e,t,20,"#55514b",.35,e*.05,e*.18),At(a,e,t,e*25,"#8f8b82","#3f3c37",.5),a.strokeStyle="rgba(30, 28, 25, 0.6)",a.lineWidth=Math.max(1,e/200);for(let i=0;i<28;i++){let o=t()*e,r=t()*e;const s=4+Math.floor(t()*6),n=e*.05;let u=t()*Math.PI*2;const l=[[o,r]];for(let c=0;c<s;c++)u+=(t()-.5)*1.4,o+=Math.cos(u)*n,r+=Math.sin(u)*n,l.push([o,r]);for(const c of[-e,0,e])for(const d of[-e,0,e])a.beginPath(),l.forEach(([h,m],g)=>g?a.lineTo(h+c,m+d):a.moveTo(h+c,m+d)),a.stroke()}},ys=(a,e)=>{const t=gt(67);a.fillStyle="#4e6a3f",a.fillRect(0,0,e,e),je(a,e,t,60,"#2f4a2b",.5,e*.03,e*.12),je(a,e,t,40,"#6a8a4c",.35,e*.02,e*.08),At(a,e,t,e*20,"#86a560","#22361f",.5)},di=[{name:"sand",draw:ps,tint:[1,1,1],roughness:.95,swatch:"#cdb27e"},{name:"wet sand",draw:gs,tint:[1,1,1],roughness:.7,swatch:"#8e7a58"},{name:"pebbles",draw:xs,tint:[1,1,1],roughness:.85,swatch:"#9a927f"},{name:"dune grass",draw:ws,tint:[1,1,1],roughness:.95,swatch:"#5f7a35"},{name:"rock",draw:bs,tint:[1,1,1],roughness:.8,swatch:"#6b6760"},{name:"seaweed",draw:ys,tint:[1,1,1],roughness:.6,swatch:"#4e6a3f"}];function Us(a,e){const t=a.gl,i=e.size,o=(p,b)=>Math.min(i-1,Math.max(0,Math.floor(b)))*i+Math.min(i-1,Math.max(0,Math.floor(p))),r=new ka(t,i,i),s={map:r,layers:new Ua(t,256,di.map(p=>p.draw)),tints:di.map(p=>p.tint),roughness:di.map(p=>p.roughness),levelHeight:fi,cliff:fi*1.5,noise:.35,sharpness:3,grid:null},n=()=>{for(let p=0;p<i;p++)for(let b=0;b<i;b++)r.set(b,p,e.paint[p*i+b],e.paint[p*i+b],e.levels[p*i+b]);r.upload()};n();const u={width:i,height:i,maxStep:1,levelHeight:fi,level:(p,b)=>e.levels[b*i+p]},l=Bo(0,0,0),c={...Co,topLow:[.8,.8,.8],topHigh:[1,1,1],step:[.6,.52,.4],cliff:[.55,.45,.33],rim:[.2,.16,.11]},d=mi({splat:s,roughness:.95,doubleSided:!0,nearFade:!1}),h=mi({roughness:.9,doubleSided:!0,nearFade:!1});let m=ho(u,Ai,c);const g={mesh:new Ct(t,m.tops),model:l,material:d},w={mesh:new Ct(t,m.sides),model:l,material:h},x={mesh:new Ii(t,m.rims),model:l};a.instances.push(g,w),a.overlays.push(x);let v=!1;return{map:e,size:i,heightAt:(p,b)=>fs(m.corners,i,i,p,b),levelAt:(p,b)=>e.levels[o(p,b)],rebuild(){m=ho(u,Ai,c),g.mesh.dispose(),w.mesh.dispose(),x.mesh.dispose(),g.mesh=new Ct(t,m.tops),w.mesh=new Ct(t,m.sides),x.mesh=new Ii(t,m.rims),n()},paint(p,b,F){const _=o(p,b);e.paint[_]!==F&&(e.paint[_]=F,r.set(_%i,Math.floor(_/i),F,F,e.levels[_]),v=!0)},commit(){v&&(r.upload(),v=!1)},setGrid(p){s.grid=p?{size:1,width:.03,opacity:.22}:null},dispose(){for(const b of[g,w]){const F=a.instances.indexOf(b);F>=0&&a.instances.splice(F,1),b.mesh.dispose()}const p=a.overlays.indexOf(x);p>=0&&a.overlays.splice(p,1),x.mesh.dispose(),r.dispose(),s.layers.dispose()}}}class ks{constructor(e,t){f(this,"volumes",[]);f(this,"thickness",1);this.renderer=e,this.defs=t,this.rebuild(t)}rebuild(e){const t=this.renderer.fogVolumes.volumes;for(const i of this.volumes){const o=t.indexOf(i);o>=0&&t.splice(o,1)}this.volumes.length=0,this.defs=e,e.forEach((i,o)=>this.add(o))}add(e){const t=ia();return this.volumes.splice(e,0,t),this.renderer.fogVolumes.volumes.push(t),this.sync(e),t}remove(e){const[t]=this.volumes.splice(e,1),i=this.renderer.fogVolumes.volumes,o=i.indexOf(t);o>=0&&i.splice(o,1),this.defs.splice(e,1)}sync(e){const t=this.defs[e],i=this.volumes[e];!t||!i||(i.center=[t.center[0],t.center[1],t.center[2]],i.size=[t.size[0],t.size[1],t.size[2]],i.yaw=t.yaw,i.color=[t.color[0],t.color[1],t.color[2]],i.density=t.density*this.thickness,i.softness=t.softness,i.falloff=t.falloff,i.noise=t.noise,i.noiseScale=t.noiseScale,i.speed=t.speed,i.direction=t.direction,i.rise=t.rise,i.churn=t.churn,i.glow=[t.glow[0],t.glow[1],t.glow[2]],i.glowStrength=t.glowStrength)}setThickness(e){this.thickness=e,this.defs.forEach((t,i)=>this.sync(i))}}function Ts(a){try{const e=localStorage.getItem(a);return e?JSON.parse(e):{}}catch{return{}}}function fo(a){const e=parseInt(a.replace("#",""),16),t=i=>Math.pow(i/255,2.2);return[t(e>>16&255),t(e>>8&255),t(e&255)]}function Es(a){const e=t=>Math.round(Math.pow(Math.min(1,Math.max(0,t)),.45454545454545453)*255).toString(16).padStart(2,"0");return`#${e(a[0])}${e(a[1])}${e(a[2])}`}class zs{constructor(e,t,i={}){f(this,"root");f(this,"stored");f(this,"store");f(this,"section_",null);f(this,"open_",!1);f(this,"onToggle",null);if(this.store=i.persist===!1?null:i.persist??"battle-crab.settings",this.stored=this.store?Ts(this.store):{},this.root=document.createElement("div"),this.root.className="settings",this.open_=i.open??!1,this.root.hidden=!this.open_,t){const o=document.createElement("h2");o.textContent=t,this.root.appendChild(o)}e.appendChild(this.root)}get open(){return this.open_}toggle(e=!this.open_){var t;this.open_=e,this.root.hidden=!e,(t=this.onToggle)==null||t.call(this,e)}section(e){const t=document.createElement("section"),i=document.createElement("h3");return i.textContent=e,t.appendChild(i),this.root.appendChild(t),this.section_=t,this}plain(){return this.section_=null,this}clear(){for(const e of Array.from(this.root.children))e.tagName!=="H2"&&e.remove();return this.section_=null,this}toggle_(e,t,i,o){const r=this.row(t),s=document.createElement("input");s.type="checkbox";const n=this.stored[e];return typeof n=="boolean"&&o(n),s.checked=i(),s.addEventListener("change",()=>{o(s.checked),this.save(e,s.checked)}),r.appendChild(s),this}slider(e,t,i,o,r,s,n,u=r<.01?3:r<.1?2:r<1?1:0,l=""){const c=this.row(t),d=document.createElement("input");d.type="range",d.min=String(i),d.max=String(o),d.step=String(r);const h=document.createElement("input");h.type="number",h.className="value",h.min=String(i),h.max=String(o),h.step=String(r),l&&(h.title=l);const m=this.stored[e];typeof m=="number"&&n(m);const g=x=>{d.value=String(x),d.style.setProperty("--fill",`${(x-i)/(o-i)*100}%`),document.activeElement!==h&&(h.value=x.toFixed(u))};g(s()),d.addEventListener("input",()=>{const x=Number(d.value);n(x),g(x),this.save(e,x)});const w=()=>{const x=Number(h.value);if(!Number.isFinite(x))return g(s());const v=Math.min(o,Math.max(i,x));n(v),h.blur(),g(v),this.save(e,v)};return h.addEventListener("change",w),h.addEventListener("keydown",x=>{x.key==="Enter"&&w(),x.key==="Escape"&&h.blur(),x.stopPropagation()}),h.addEventListener("blur",()=>g(s())),c.appendChild(d),c.appendChild(h),this}choice(e,t,i,o,r){const s=this.row(t),n=document.createElement("select");for(const l of i){const c=document.createElement("option");c.value=l,c.textContent=l,n.appendChild(c)}const u=this.stored[e];return typeof u=="string"&&i.includes(u)&&r(u),n.value=o(),n.addEventListener("change",()=>{r(n.value),this.save(e,n.value)}),s.appendChild(n),this}color(e,t,i,o){const r=this.row(t),s=document.createElement("input");s.type="color";const n=this.stored[e];return typeof n=="string"&&o(fo(n)),s.value=Es(i()),s.addEventListener("input",()=>{o(fo(s.value)),this.save(e,s.value)}),r.appendChild(s),this}button(e,t,i=""){const o=document.createElement("button");o.type="button",o.textContent=e,i&&(o.title=i),o.addEventListener("click",t);const r=this.section_??this.root;let s=r.lastElementChild;return(!s||!s.classList.contains("buttons"))&&(s=document.createElement("div"),s.className="buttons",r.appendChild(s)),s.appendChild(o),this}note(e){const t=document.createElement("p");return t.className="note",t.textContent=e,(this.section_??this.root).appendChild(t),t}row(e){const t=document.createElement("label"),i=document.createElement("span");return i.textContent=e,t.appendChild(i),(this.section_??this.root).appendChild(t),t}save(e,t){if(this.store){this.stored[e]=t;try{localStorage.setItem(this.store,JSON.stringify(this.stored))}catch{}}}}export{Ct as $,Si as A,is as C,Ii as F,_s as G,Oo as I,Qe as J,ks as M,Ht as O,Di as R,zs as S,di as T,Ms as W,Fs as X,Bo as a,Us as b,Lt as c,Ai as d,Cs as e,vs as f,mi as g,vo as h,jt as i,Rs as j,No as k,Ss as l,de as m,Ps as r,Ds as s,mo as u};
