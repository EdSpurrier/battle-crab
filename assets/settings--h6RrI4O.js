var So=Object.defineProperty;var Do=(r,e,t)=>e in r?So(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var d=(r,e,t)=>Do(r,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function t(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(o){if(o.ep)return;o.ep=!0;const a=t(o);fetch(o.href,a)}})();class q{constructor(e,t,i,o){d(this,"handle");d(this,"uniforms",new Map);this.gl=e;const a=Ei(e,e.VERTEX_SHADER,t),s=Ei(e,e.FRAGMENT_SHADER,i),n=e.createProgram();if(!n)throw new Error("createProgram failed");if(e.attachShader(n,a),e.attachShader(n,s),o&&e.transformFeedbackVaryings(n,o,e.INTERLEAVED_ATTRIBS),e.linkProgram(n),!e.getProgramParameter(n,e.LINK_STATUS))throw new Error(`link failed: ${e.getProgramInfoLog(n)??""}`);e.deleteShader(a),e.deleteShader(s),this.handle=n}use(){this.gl.useProgram(this.handle)}uniform(e){let t=this.uniforms.get(e);return t===void 0&&(t=this.gl.getUniformLocation(this.handle,e),this.uniforms.set(e,t)),t}setMat4(e,t){this.gl.uniformMatrix4fv(this.uniform(e),!1,t)}setMat3(e,t){this.gl.uniformMatrix3fv(this.uniform(e),!1,t)}setVec3(e,t,i,o){this.gl.uniform3f(this.uniform(e),t,i,o)}setFloat(e,t){this.gl.uniform1f(this.uniform(e),t)}dispose(){this.gl.deleteProgram(this.handle)}}function Ei(r,e,t){const i=r.createShader(e);if(!i)throw new Error("createShader failed");if(r.shaderSource(i,t),r.compileShader(i),!r.getShaderParameter(i,r.COMPILE_STATUS)){const o=r.getShaderInfoLog(i)??"";throw r.deleteShader(i),new Error(`${e===r.VERTEX_SHADER?"vertex":"fragment"} shader failed:
${o}`)}return i}function ye(r){const e=r??new Float32Array(16);return r&&e.fill(0),e[0]=e[5]=e[10]=e[15]=1,e}function ve(r,e,t=new Float32Array(16)){for(let i=0;i<4;i++)for(let o=0;o<4;o++)t[i*4+o]=r[o]*e[i*4]+r[4+o]*e[i*4+1]+r[8+o]*e[i*4+2]+r[12+o]*e[i*4+3];return t}function ds(r,e,t,i){const o=i?ye(i):ye();return o[12]=r,o[13]=e,o[14]=t,o}function ms(r,e,t,i){const o=ye(i);return o[0]=r,o[5]=e,o[10]=t,o}function vs(r,e){const t=ye(e),i=Math.cos(r),o=Math.sin(r);return t[0]=i,t[2]=-o,t[8]=o,t[10]=i,t}function ps(r,e){const t=ye(e),i=Math.cos(r),o=Math.sin(r);return t[5]=i,t[6]=o,t[9]=-o,t[10]=i,t}function uo(r,e,t,i){const o=1/Math.tan(r/2),a=new Float32Array(16);return a[0]=o/e,a[5]=o,a[10]=(i+t)/(t-i),a[11]=-1,a[14]=2*i*t/(t-i),a}function Co(r,e,t,i,o,a){const s=ye();return s[0]=2/(e-r),s[5]=2/(i-t),s[10]=-2/(a-o),s[12]=-(e+r)/(e-r),s[13]=-(i+t)/(i-t),s[14]=-(a+o)/(a-o),s}function Ai(r){const e=Math.hypot(r[0],r[1],r[2])||1;return[r[0]/e,r[1]/e,r[2]/e]}function Ri(r,e){return[r[1]*e[2]-r[2]*e[1],r[2]*e[0]-r[0]*e[2],r[0]*e[1]-r[1]*e[0]]}function $t(r,e){return r[0]*e[0]+r[1]*e[1]+r[2]*e[2]}function Po(r,e){return[r[0]-e[0],r[1]-e[1],r[2]-e[2]]}function Xt(r,e,t=[0,1,0]){const i=Ai(Po(r,e)),o=Ai(Ri(t,i)),a=Ri(i,o),s=ye();return s[0]=o[0],s[4]=o[1],s[8]=o[2],s[1]=a[0],s[5]=a[1],s[9]=a[2],s[2]=i[0],s[6]=i[1],s[10]=i[2],s[12]=-$t(o,r),s[13]=-$t(a,r),s[14]=-$t(i,r),s}function ze(r){return r[0]*(r[5]*r[10]-r[6]*r[9])-r[4]*(r[1]*r[10]-r[2]*r[9])+r[8]*(r[1]*r[6]-r[2]*r[5])<0}function et(r,e=new Float32Array(16)){const t=r[0],i=r[1],o=r[2],a=r[3],s=r[4],n=r[5],u=r[6],l=r[7],c=r[8],f=r[9],h=r[10],v=r[11],p=r[12],x=r[13],w=r[14],m=r[15],g=t*n-i*s,E=t*u-o*s,S=t*l-a*s,C=i*u-o*n,A=i*l-a*n,R=o*l-a*u,_=c*x-f*p,k=c*w-h*p,B=c*m-v*p,y=f*w-h*x,F=f*m-v*x,M=h*m-v*w;let D=g*M-E*F+S*y+C*B-A*k+R*_;return D?(D=1/D,e[0]=(n*M-u*F+l*y)*D,e[1]=(o*F-i*M-a*y)*D,e[2]=(x*R-w*A+m*C)*D,e[3]=(h*A-f*R-v*C)*D,e[4]=(u*B-s*M-l*k)*D,e[5]=(t*M-o*B+a*k)*D,e[6]=(w*S-p*R-m*E)*D,e[7]=(c*R-h*S+v*E)*D,e[8]=(s*F-n*B+l*_)*D,e[9]=(i*B-t*F-a*_)*D,e[10]=(p*A-x*S+m*g)*D,e[11]=(f*S-c*A-v*g)*D,e[12]=(n*k-s*y-u*_)*D,e[13]=(t*y-i*k+o*_)*D,e[14]=(x*E-p*C-w*g)*D,e[15]=(c*C-f*E+h*g)*D,e):ye()}function co(r,e){const t=e[0],i=e[1],o=e[2];return[r[0]*t+r[4]*i+r[8]*o+r[12],r[1]*t+r[5]*i+r[9]*o+r[13],r[2]*t+r[6]*i+r[10]*o+r[14],r[3]*t+r[7]*i+r[11]*o+r[15]]}function Fi(r,e=new Float32Array(9)){for(let t=0;t<3;t++){const i=r[t*4],o=r[t*4+1],a=r[t*4+2],s=Math.hypot(i,o,a)||1;e[t*3]=i/s,e[t*3+1]=o/s,e[t*3+2]=a/s}return e}function ci(r={}){return{color:[1,1,1],albedo:null,metallicRoughness:null,normal:null,uvScale:1,metallic:0,roughness:.7,emissive:[0,0,0],emissiveMap:null,doubleSided:!1,splat:null,fade:null,nearFade:!0,transparent:!1,opacity:1,cutoff:0,...r}}const _i=32,Oe=class Oe{constructor(e,t=!0){d(this,"handle");d(this,"width",1);d(this,"height",1);d(this,"loaded",!1);d(this,"source",null);d(this,"flipped",!1);d(this,"pixels",null);d(this,"coarse",null);d(this,"holders",1);d(this,"freed",null);this.gl=e,this.srgb=t;const i=e.createTexture();if(!i)throw new Error("createTexture failed");this.handle=i,e.bindTexture(e.TEXTURE_2D,i),e.texImage2D(e.TEXTURE_2D,0,e.RGBA8,1,1,0,e.RGBA,e.UNSIGNED_BYTE,new Uint8Array([255,255,255,255])),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.REPEAT),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.REPEAT),e.bindTexture(e.TEXTURE_2D,null)}queueImage(e,t=!0){Oe.queue.push({pixels:e.width*e.height,run:()=>this.setImage(e,t)})}static flush(e){let t=e;for(;Oe.queue.length;){const i=Oe.queue[0];if(i.pixels>t&&t<e)break;Oe.queue.shift().run(),t-=i.pixels}}static get pending(){return Oe.queue.length}setImage(e,t=!0){const i=this.gl;i.bindTexture(i.TEXTURE_2D,this.handle),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,t),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.NONE),i.texImage2D(i.TEXTURE_2D,0,this.srgb?i.SRGB8_ALPHA8:i.RGBA8,i.RGBA,i.UNSIGNED_BYTE,e),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.generateMipmap(i.TEXTURE_2D),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR_MIPMAP_LINEAR);const o=i.getExtension("EXT_texture_filter_anisotropic");o&&i.texParameterf(i.TEXTURE_2D,o.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(8,i.getParameter(o.MAX_TEXTURE_MAX_ANISOTROPY_EXT))),i.bindTexture(i.TEXTURE_2D,null),this.width=e.width,this.height=e.height,this.source=e,this.flipped=t,this.pixels=null,this.coarse=null,this.loaded=!0}sample(e,t){return this.source?(this.pixels||(this.pixels=this.readBack(this.width,this.height)),this.pixels?this.texel(this.pixels,this.width,this.height,e,t):[1,1,1]):[1,1,1]}sampleCoarse(e,t){if(!this.source)return[1,1,1];const i=Math.max(1,Math.min(_i,this.width)),o=Math.max(1,Math.min(_i,this.height));return this.coarse||(this.coarse=this.readBack(i,o)),this.coarse?this.texel(this.coarse,i,o,e,t):[1,1,1]}readBack(e,t){const i=(typeof OffscreenCanvas<"u"?new OffscreenCanvas(e,t):Object.assign(document.createElement("canvas"),{width:e,height:t})).getContext("2d");return i?(i.imageSmoothingEnabled=!0,i.imageSmoothingQuality="high",i.drawImage(this.source,0,0,e,t),i.getImageData(0,0,e,t).data):null}texel(e,t,i,o,a){const s=(Math.floor(o*t)%t+t)%t,n=(Math.floor(a*i)%i+i)%i,u=((this.flipped?i-1-n:n)*t+s)*4,l=c=>{const f=c/255;return this.srgb?f<=.04045?f/12.92:Math.pow((f+.055)/1.055,2.4):f};return[l(e[u]),l(e[u+1]),l(e[u+2])]}bind(e){const t=this.gl;t.activeTexture(t.TEXTURE0+e),t.bindTexture(t.TEXTURE_2D,this.handle)}retain(){return this.holders++,this}onFreed(e){this.freed=e}dispose(){var e;--this.holders>0||(this.gl.deleteTexture(this.handle),(e=this.freed)==null||e.call(this),this.freed=null)}static load(e,t,i=!0){const o=new Oe(e,i),a=new Image;return a.crossOrigin="anonymous",a.onload=()=>o.setImage(a),a.onerror=()=>console.warn(`texture failed to load: ${t}`),a.src=t,o}static fromCanvas(e,t,i,o=!0){const a=document.createElement("canvas");a.width=a.height=t;const s=a.getContext("2d");i(s,t);const n=new Oe(e,o);return n.setImage(a),n}};d(Oe,"queue",[]);let Et=Oe;const Ne=16,hi=9,fi=10,Gt=16,ct=2048,Mi=13,st=14,ho=`
uniform highp sampler2D uCrowd;
uniform int uCrowdBase;
vec4 crowdTexel(int i, int k) {
  int t = i * 4 + k;
  return texelFetch(uCrowd, ivec2(t & ${ct-1}, t >> ${Math.log2(ct)}), 0);
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
`,bi=`
layout(location = ${hi}) in vec4 aJoints;
layout(location = ${fi}) in vec4 aWeights;
uniform highp sampler2D uJoints;
uniform int uJointBase;
mat4 jointMatrix(float j, int base) {
  int i = base + int(j + 0.5);
  ivec2 at = ivec2((i % ${Ne}) * 4, i / ${Ne});
  return mat4(texelFetch(uJoints, at, 0), texelFetch(uJoints, at + ivec2(1, 0), 0), texelFetch(uJoints, at + ivec2(2, 0), 0), texelFetch(uJoints, at + ivec2(3, 0), 0));
}
mat4 skinMatrix(int base) {
  float total = aWeights.x + aWeights.y + aWeights.z + aWeights.w;
  if (total < 1e-5) return mat4(1.0);
  mat4 m = aWeights.x * jointMatrix(aJoints.x, base) + aWeights.y * jointMatrix(aJoints.y, base) + aWeights.z * jointMatrix(aJoints.z, base) + aWeights.w * jointMatrix(aJoints.w, base);
  return m * (1.0 / total);
}
`;class gs{constructor(e,t){d(this,"texture");d(this,"rows");d(this,"data");d(this,"dirtyFrom",1/0);d(this,"dirtyTo",-1);this.gl=e,this.count=t;const i=e.createTexture();if(!i)throw new Error("joint palette allocation failed");this.texture=i,this.rows=Math.max(1,Math.ceil(t/Ne)),e.bindTexture(e.TEXTURE_2D,i),e.texImage2D(e.TEXTURE_2D,0,e.RGBA32F,Ne*4,this.rows,0,e.RGBA,e.FLOAT,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.bindTexture(e.TEXTURE_2D,null),this.data=new Float32Array(this.rows*Ne*16);for(let o=0;o<this.rows*Ne;o++)this.data[o*16]=this.data[o*16+5]=this.data[o*16+10]=this.data[o*16+15]=1;this.dirtyFrom=0,this.dirtyTo=this.rows-1}set(e,t=0){const i=Math.max(0,Math.min(this.count-t,Math.floor(e.length/16)));i&&(this.data.set(i*16===e.length?e:e.subarray(0,i*16),t*16),this.dirtyFrom=Math.min(this.dirtyFrom,Math.floor(t/Ne)),this.dirtyTo=Math.max(this.dirtyTo,Math.floor((t+i-1)/Ne)))}upload(){if(this.dirtyFrom>this.dirtyTo)return;const e=this.gl,t=this.dirtyTo-this.dirtyFrom+1;e.bindTexture(e.TEXTURE_2D,this.texture),e.texSubImage2D(e.TEXTURE_2D,0,0,this.dirtyFrom,Ne*4,t,e.RGBA,e.FLOAT,this.data,this.dirtyFrom*Ne*16),e.bindTexture(e.TEXTURE_2D,null),this.dirtyFrom=1/0,this.dirtyTo=-1}bind(e){this.upload();const t=this.gl;t.activeTexture(t.TEXTURE0+e),t.bindTexture(t.TEXTURE_2D,this.texture)}dispose(){this.gl.deleteTexture(this.texture)}}const zt=3,Si=[7,20,60],fo=`
float cutoutAlpha(float a, vec2 uv) {
  vec2 t = uv * vec2(textureSize(uAlbedo, 0));
  vec2 dx = dFdx(t);
  vec2 dy = dFdy(t);
  float mip = max(0.0, 0.5 * log2(max(dot(dx, dx), dot(dy, dy))));
  return a * (1.0 + 0.25 * mip);
}`,Ze=(r,e=!1,t=!1,i=!1)=>`#version 300 es
layout(location = 0) in vec3 aPosition;
${t?`layout(location = 3) in vec2 aUv;
uniform float uUvScale;
out vec2 vUv;`:""}
${i?ho:r?`layout(location = 4) in vec4 aModel0;
layout(location = 5) in vec4 aModel1;
layout(location = 6) in vec4 aModel2;
layout(location = 7) in vec4 aModel3;`:"uniform mat4 uModel;"}
${e?bi:""}
uniform mat4 uLightViewProj;
void main() {
  ${i?`int crowdI = uCrowdBase + gl_InstanceID;
  mat4 model = crowdModel(crowdI);`:r?"mat4 model = mat4(aModel0, aModel1, aModel2, aModel3);":"mat4 model = uModel;"}
  ${t?"vUv = aUv * uUvScale;":""}
  gl_Position = uLightViewProj * model * ${e?`skinMatrix(${i?"int(crowdInst(crowdI).x + 0.5)":"uJointBase"}) * `:""}vec4(aPosition, 1.0);
}`,gt=`#version 300 es
precision highp float;
void main() {}`,Wt=`#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uAlbedo;
uniform float uOpacity;
uniform float uCutoff;
${fo}
void main() {
  if (cutoutAlpha(texture(uAlbedo, vUv).a * uOpacity, vUv) < uCutoff) discard;
}`,Uo={strength:1,cascades:3,soft:!0,lightSize:60,stagger:!0};class ko{constructor(e,t=2048){d(this,"size");d(this,"program");d(this,"instancedProgram");d(this,"crowdProgram");d(this,"skinnedProgram");d(this,"skinnedInstancedProgram");d(this,"cutoutProgram");d(this,"cutoutInstancedProgram");d(this,"cutoutSkinnedProgram");d(this,"settings",{...Uo});d(this,"cascades",[]);d(this,"frame",0);d(this,"due",[!0,!0,!0]);d(this,"drawn",[!1,!1,!1]);d(this,"lastCount",0);d(this,"halves",[0,0,0]);this.gl=e,this.size=t;for(let i=0;i<zt;i++){const o=e.createTexture(),a=e.createFramebuffer();if(!o||!a)throw new Error("shadow map allocation failed");e.bindTexture(e.TEXTURE_2D,o),e.texImage2D(e.TEXTURE_2D,0,e.DEPTH_COMPONENT24,t,t,0,e.DEPTH_COMPONENT,e.UNSIGNED_INT,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.bindFramebuffer(e.FRAMEBUFFER,a),e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.TEXTURE_2D,o,0),e.drawBuffers([e.NONE]),e.readBuffer(e.NONE);const s=e.checkFramebufferStatus(e.FRAMEBUFFER);if(e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindTexture(e.TEXTURE_2D,null),s!==e.FRAMEBUFFER_COMPLETE)throw new Error(`shadow framebuffer incomplete: ${s}`);this.cascades.push({texture:o,fbo:a,viewProj:new Float32Array(16)})}this.program=new q(e,Ze(!1),gt),this.instancedProgram=new q(e,Ze(!0),gt),this.crowdProgram=new q(e,Ze(!0,!1,!1,!0),gt),this.skinnedProgram=new q(e,Ze(!1,!0),gt),this.skinnedInstancedProgram=new q(e,Ze(!0,!0,!1,!0),gt),this.cutoutProgram=new q(e,Ze(!1,!1,!0),Wt),this.cutoutInstancedProgram=new q(e,Ze(!0,!1,!0),Wt),this.cutoutSkinnedProgram=new q(e,Ze(!1,!0,!0),Wt)}get count(){return Math.max(1,Math.min(zt,Math.round(this.settings.cascades)))}viewProj(e){return this.cascades[e].viewProj}isDue(e){return this.due[e]}setup(e,t,i){this.frame++,this.count!==this.lastCount&&(this.lastCount=this.count,this.drawn.fill(!1));for(let n=0;n<this.count;n++)this.due[n]=!this.settings.stagger||n===0||!this.drawn[n]||this.frame%(n+1)===0,this.due[n]&&(this.drawn[n]=!0);const o=Math.hypot(t[0],t[1],t[2])||1,a=[t[0]/o,t[1]/o,t[2]/o],s=Math.max(1,i/24);for(let n=0;n<this.count;n++){if(!this.due[n])continue;const u=Si[n]*s;this.halves[n]=u;const l=u*3,c=[e[0]-a[0]*l,e[1]-a[1]*l,e[2]-a[2]*l],f=Xt(c,e,Math.abs(a[1])>.99?[0,0,1]:[0,1,0]),h=2*u/this.size,[v,p]=co(f,e),x=Math.round(v/h)*h-v,w=Math.round(p/h)*h-p,m=Co(-u-x,u-x,-u-w,u-w,1,l*2+u);this.cascades[n].viewProj=ve(m,f)}}halfExtent(e){return this.halves[e]||Si[e]}begin(e){const t=this.gl;t.bindFramebuffer(t.FRAMEBUFFER,this.cascades[e].fbo),t.viewport(0,0,this.size,this.size),t.clear(t.DEPTH_BUFFER_BIT),t.cullFace(t.BACK)}end(e,t){const i=this.gl;i.cullFace(i.BACK),i.bindFramebuffer(i.FRAMEBUFFER,null),i.viewport(0,0,e,t)}texture(e){return this.cascades[e].texture}bind(e,t){const i=this.gl;i.activeTexture(i.TEXTURE0+t),i.bindTexture(i.TEXTURE_2D,this.cascades[e].texture)}}const jt=256,di=64,tt=32,dt=5,zo={point:0,spot:1,area:2};class Lo{constructor(e){d(this,"lights",[]);d(this,"lightTexture");d(this,"tileTexture");d(this,"lightData",new Float32Array(jt*dt*4));d(this,"tileData",new Uint16Array(0));d(this,"tilesX",1);d(this,"tilesY",1);d(this,"visible",0);this.gl=e;const t=e.createTexture(),i=e.createTexture();if(!t||!i)throw new Error("light texture allocation failed");this.lightTexture=t,this.tileTexture=i;for(const o of[t,i])e.bindTexture(e.TEXTURE_2D,o),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE);e.bindTexture(e.TEXTURE_2D,t),e.texImage2D(e.TEXTURE_2D,0,e.RGBA32F,jt*dt,1,0,e.RGBA,e.FLOAT,null),e.bindTexture(e.TEXTURE_2D,null)}update(e,t,i){const o=this.gl,a=this.lights.map((h,v)=>v).slice(0,jt),s=h=>h.intensity*h.radius*h.radius;a.sort((h,v)=>s(this.lights[v])-s(this.lights[h])||h-v);const n=a.length,u=Math.max(1,Math.ceil(t/tt)),l=Math.max(1,Math.ceil(i/tt)),c=di+1;(u!==this.tilesX||l!==this.tilesY||this.tileData.length!==u*l*c)&&(this.tilesX=u,this.tilesY=l,this.tileData=new Uint16Array(u*l*c));const f=this.tileData;f.fill(0),this.visible=0;for(let h=0;h<n;h++){const v=a[h],p=this.lights[v],x=h*dt*4,w=this.lightData,m=zo[p.kind??"point"],g=p.dir??[0,-1,0];if(w.fill(0,x,x+dt*4),w[x]=p.x,w[x+1]=p.y,w[x+2]=p.z,w[x+3]=p.radius,w[x+4]=p.r,w[x+5]=p.g,w[x+6]=p.b,w[x+7]=p.intensity,w[x+8]=g[0],w[x+9]=g[1],w[x+10]=g[2],w[x+11]=m,m===1){const D=Math.min(Math.PI/2,Math.max(.01,p.outer??.5));w[x+12]=Math.cos(Math.min(D-.001,Math.max(0,p.inner??D*.7))),w[x+13]=Math.cos(D)}else if(m===2){const D=p.axis??[1,0,0];w[x+12]=D[0],w[x+13]=D[1],w[x+14]=D[2],w[x+15]=(p.width??1)/2,w[x+16]=(p.height??1)/2}const E=p.radius+(m===2?Math.hypot(p.width??1,p.height??1)/2:0);let S=1/0,C=1/0,A=-1/0,R=-1/0,_=!1;for(let D=0;D<8;D++){const j=p.x+(D&1?E:-E),K=p.y+(D&2?E:-E),X=p.z+(D&4?E:-E),[J,H,,N]=co(e,[j,K,X]);if(N<=0){S=-1,A=1,C=-1,R=1;continue}_=!0;const oe=J/N,Q=H/N;oe<S&&(S=oe),oe>A&&(A=oe),Q<C&&(C=Q),Q>R&&(R=Q)}if(!_||A<-1||S>1||R<-1||C>1)continue;const k=Math.max(0,Math.floor((S+1)*.5*t/tt)),B=Math.min(u-1,Math.floor((A+1)*.5*t/tt)),y=Math.max(0,Math.floor((C+1)*.5*i/tt)),F=Math.min(l-1,Math.floor((R+1)*.5*i/tt));let M=!1;for(let D=y;D<=F;D++)for(let j=k;j<=B;j++){const K=(D*u+j)*c,X=f[K];X>=di||(f[K+1+X]=h,f[K]=X+1,M=!0)}M&&this.visible++}o.bindTexture(o.TEXTURE_2D,this.lightTexture),n>0&&o.texSubImage2D(o.TEXTURE_2D,0,0,0,n*dt,1,o.RGBA,o.FLOAT,this.lightData,0),o.bindTexture(o.TEXTURE_2D,this.tileTexture),o.pixelStorei(o.UNPACK_ALIGNMENT,2),o.texImage2D(o.TEXTURE_2D,0,o.R16UI,c,u*l,0,o.RED_INTEGER,o.UNSIGNED_SHORT,f),o.pixelStorei(o.UNPACK_ALIGNMENT,4),o.bindTexture(o.TEXTURE_2D,null)}bind(e,t){const i=this.gl;i.activeTexture(i.TEXTURE0+e),i.bindTexture(i.TEXTURE_2D,this.lightTexture),i.activeTexture(i.TEXTURE0+t),i.bindTexture(i.TEXTURE_2D,this.tileTexture)}}function ut(r,e=new Float32Array(24)){const t=(i,o)=>r[o*4+i];for(let i=0;i<6;i++){const o=i>>1,a=i&1?-1:1;let s=0;for(let n=0;n<4;n++){const u=t(3,n)+a*t(o,n);e[i*4+n]=u,n<3&&(s+=u*u)}s=Math.sqrt(s)||1;for(let n=0;n<4;n++)e[i*4+n]/=s}return e}function mt(r,e,t=6){for(let i=0;i<t;i++){const o=r[i*4],a=r[i*4+1],s=r[i*4+2],n=r[i*4+3],u=o>=0?e[3]:e[0],l=a>=0?e[4]:e[1],c=s>=0?e[5]:e[2];if(o*u+a*l+s*c+n<0)return!1}return!0}function Ht(r,e,t,i=new Float32Array(6)){const o=(e[0]+t[0])/2,a=(e[1]+t[1])/2,s=(e[2]+t[2])/2,n=(t[0]-e[0])/2,u=(t[1]-e[1])/2,l=(t[2]-e[2])/2;for(let c=0;c<3;c++){const f=r[c]*o+r[4+c]*a+r[8+c]*s+r[12+c],h=Math.abs(r[c])*n+Math.abs(r[4+c])*u+Math.abs(r[8+c])*l;i[c]=f-h,i[3+c]=f+h}return i}function Lt(r,e){const t=[1/0,1/0,1/0],i=[-1/0,-1/0,-1/0];for(let o=0;o+2<r.length;o+=e)for(let a=0;a<3;a++){const s=r[o+a];s<t[a]&&(t[a]=s),s>i[a]&&(i[a]=s)}return t[0]>i[0]?[[0,0,0],[0,0,0]]:[t,i]}const Yt=7;class xs{constructor(e,t){d(this,"vao");d(this,"count");d(this,"min");d(this,"max");d(this,"vbo");d(this,"ibo");this.gl=e;const i=e.createVertexArray(),o=e.createBuffer(),a=e.createBuffer();if(!i||!o||!a)throw new Error("overlay allocation failed");this.vao=i,this.vbo=o,this.ibo=a,e.bindVertexArray(i),e.bindBuffer(e.ARRAY_BUFFER,o),e.bufferData(e.ARRAY_BUFFER,t.vertices,e.STATIC_DRAW);const s=Yt*4;e.enableVertexAttribArray(0),e.vertexAttribPointer(0,3,e.FLOAT,!1,s,0),e.enableVertexAttribArray(1),e.vertexAttribPointer(1,4,e.FLOAT,!1,s,12),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,a),e.bufferData(e.ELEMENT_ARRAY_BUFFER,t.indices,e.STATIC_DRAW),e.bindVertexArray(null),this.count=t.indices.length,[this.min,this.max]=Lt(t.vertices,Yt)}draw(){if(this.count===0)return;const e=this.gl;e.bindVertexArray(this.vao),e.drawElements(e.TRIANGLES,this.count,e.UNSIGNED_INT,0),e.bindVertexArray(null)}setData(e){const t=this.gl;t.bindVertexArray(this.vao),t.bindBuffer(t.ARRAY_BUFFER,this.vbo),t.bufferData(t.ARRAY_BUFFER,e.vertices,t.DYNAMIC_DRAW),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.ibo),t.bufferData(t.ELEMENT_ARRAY_BUFFER,e.indices,t.DYNAMIC_DRAW),t.bindVertexArray(null),this.count=e.indices.length,[this.min,this.max]=Lt(e.vertices,Yt)}setIndices(e){const t=this.gl;t.bindVertexArray(this.vao),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.ibo),t.bufferData(t.ELEMENT_ARRAY_BUFFER,e,t.DYNAMIC_DRAW),t.bindVertexArray(null),this.count=e.length}dispose(){this.gl.deleteVertexArray(this.vao),this.gl.deleteBuffer(this.vbo),this.gl.deleteBuffer(this.ibo)}}const Io=`#version 300 es
layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec4 aColor;
uniform mat4 uProjection;
uniform mat4 uView;
uniform mat4 uModel;
out vec4 vColor;
void main() {
  vColor = aColor;
  gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);
}`,Bo=`#version 300 es
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
}`,mo=`uniform sampler2D uVeilMask;
uniform vec2 uVeilCells;
uniform float uVeilOn;
uniform float uVeilAlpha;
float veilOpen(vec3 w) {
  if (uVeilOn < 0.5) return 1.0;
  vec4 m = texture(uVeilMask, w.xz / uVeilCells);
  float dark = smoothstep(0.3, 0.7, m.r);
  float unseen = smoothstep(0.3, 0.7, m.g);
  return (1.0 - dark) * (1.0 - uVeilAlpha * unseen);
}`,Qe=3,Vo={enabled:!0,coverage:.4,density:.5,base:30,thickness:14,scale:70,windSpeed:3,windDirection:60,systems:.5,systemScale:600,darkness:.1,shadowStrength:.6},Di={enabled:!1,shadows:!1,steps:32,layers:[{...Vo}]},vo=`
#define CLOUD_LAYERS ${Qe}
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
}`;class No{constructor(e){d(this,"settings",{...Di,layers:Di.layers.map(e=>({...e}))});d(this,"offsets",Array.from({length:Qe},()=>[0,0]));d(this,"weather");d(this,"detail");d(this,"a",new Float32Array(Qe*4));d(this,"b",new Float32Array(Qe*4));d(this,"c",new Float32Array(Qe*4));this.gl=e,this.weather=Xo(e,256),this.detail=$o(e,48)}get active(){return this.settings.layers.slice(0,Qe).filter(e=>e.enabled)}advance(e){this.settings.layers.slice(0,Qe).forEach((t,i)=>{const o=t.windDirection*Math.PI/180,a=this.offsets[i];a[0]-=Math.sin(o)*t.windSpeed*e,a[1]-=Math.cos(o)*t.windSpeed*e;const s=Math.max(1,t.scale)*Math.max(1,t.systemScale)*4;for(const n of[0,1])Math.abs(a[n])>s&&(a[n]%=s)})}bindCommon(e,t){const i=this.gl;for(let a=0;a<Qe;a++){const s=this.settings.layers[a],n=this.offsets[a];this.a.set(s?[s.coverage,s.base,Math.max(.1,s.thickness),Math.max(1,s.scale)]:[0,0,1,1],a*4),this.b.set(s?[n[0],n[1],s.systems,Math.max(1,s.systemScale)]:[0,0,0,1],a*4),this.c.set(s?[s.enabled?1:0,s.density,s.darkness,s.shadowStrength]:[0,0,0,0],a*4)}i.activeTexture(i.TEXTURE0+t),i.bindTexture(i.TEXTURE_2D,this.weather),i.uniform1i(e.uniform("uCloudWeather"),t),i.uniform4fv(e.uniform("uCloudA"),this.a),i.uniform4fv(e.uniform("uCloudB"),this.b),i.uniform4fv(e.uniform("uCloudC"),this.c);const o=this.settings.tint??[1,1,1];i.uniform3f(e.uniform("uCloudTint"),o[0],o[1],o[2])}dispose(){this.gl.deleteTexture(this.weather),this.gl.deleteTexture(this.detail)}}function bt(r,e,t,i){let o=r*374761393+e*668265263+t*2147483647+i*1442695041|0;return o=Math.imul(o^o>>>13,1274126177),((o^o>>>16)>>>0)/4294967296}function Oo(r,e,t,i){const o=Math.floor(r),a=Math.floor(e);let s=r-o,n=e-a;s=s*s*(3-2*s),n=n*n*(3-2*n);const u=h=>(h%t+t)%t,l=(h,v)=>bt(u(o+h),u(a+v),0,i),c=l(0,0)+(l(1,0)-l(0,0))*s,f=l(0,1)+(l(1,1)-l(0,1))*s;return c+(f-c)*n}function Xo(r,e){const t=new Float32Array(e*e);let i=1/0,o=-1/0;for(let n=0;n<e;n++)for(let u=0;u<e;u++){let l=0,c=.5,f=0;for(let h=0;h<5;h++){const v=4<<h;l+=Oo(u/e*v,n/e*v,v,11+h)*c,f+=c,c*=.5}l/=f,t[n*e+u]=l,i=Math.min(i,l),o=Math.max(o,l)}const a=new Uint8Array(e*e);for(let n=0;n<t.length;n++)a[n]=Math.round((t[n]-i)/Math.max(1e-6,o-i)*255);const s=r.createTexture();if(!s)throw new Error("cloud weather texture failed");return r.bindTexture(r.TEXTURE_2D,s),r.pixelStorei(r.UNPACK_ALIGNMENT,1),r.texImage2D(r.TEXTURE_2D,0,r.R8,e,e,0,r.RED,r.UNSIGNED_BYTE,a),r.pixelStorei(r.UNPACK_ALIGNMENT,4),r.generateMipmap(r.TEXTURE_2D),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR_MIPMAP_LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.REPEAT),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.REPEAT),r.bindTexture(r.TEXTURE_2D,null),s}function $o(r,e){const t=new Float32Array(648);for(let s=0;s<6;s++)for(let n=0;n<6;n++)for(let u=0;u<6;u++){const l=((s*6+n)*6+u)*3;t[l]=u+bt(u,n,s,1),t[l+1]=n+bt(u,n,s,2),t[l+2]=s+bt(u,n,s,3)}const i=new Uint8Array(e*e*e),o=s=>(s%6+6)%6;for(let s=0;s<e;s++)for(let n=0;n<e;n++)for(let u=0;u<e;u++){const l=u/e*6,c=n/e*6,f=s/e*6,h=Math.floor(l),v=Math.floor(c),p=Math.floor(f);let x=9;for(let E=-1;E<=1;E++)for(let S=-1;S<=1;S++)for(let C=-1;C<=1;C++){const A=((o(p+E)*6+o(v+S))*6+o(h+C))*3,R=t[A]-o(h+C)+h+C,_=t[A+1]-o(v+S)+v+S,k=t[A+2]-o(p+E)+p+E;x=Math.min(x,(R-l)**2+(_-c)**2+(k-f)**2)}const w=1-Math.min(1,Math.sqrt(x)*1.1),m=(E,S)=>{const C=u/e*E,A=n/e*E,R=s/e*E,_=Math.floor(C),k=Math.floor(A),B=Math.floor(R),y=J=>J*J*(3-2*J),F=y(C-_),M=y(A-k),D=y(R-B),j=J=>(J%E+E)%E,K=(J,H,N)=>bt(j(_+J),j(k+H),j(B+N),S),X=(J,H,N)=>J+(H-J)*N;return X(X(X(K(0,0,0),K(1,0,0),F),X(K(0,1,0),K(1,1,0),F),M),X(X(K(0,0,1),K(1,0,1),F),X(K(0,1,1),K(1,1,1),F),M),D)},g=w*.65+m(8,21)*.23+m(16,22)*.12;i[(s*e+n)*e+u]=Math.round(Math.min(1,Math.max(0,g))*255)}const a=r.createTexture();if(!a)throw new Error("cloud detail texture failed");return r.bindTexture(r.TEXTURE_3D,a),r.pixelStorei(r.UNPACK_ALIGNMENT,1),r.texImage3D(r.TEXTURE_3D,0,r.R8,e,e,e,0,r.RED,r.UNSIGNED_BYTE,i),r.pixelStorei(r.UNPACK_ALIGNMENT,4),r.texParameteri(r.TEXTURE_3D,r.TEXTURE_MIN_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_3D,r.TEXTURE_MAG_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_3D,r.TEXTURE_WRAP_S,r.REPEAT),r.texParameteri(r.TEXTURE_3D,r.TEXTURE_WRAP_T,r.REPEAT),r.texParameteri(r.TEXTURE_3D,r.TEXTURE_WRAP_R,r.REPEAT),r.bindTexture(r.TEXTURE_3D,null),a}const Go=`#version 300 es
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
${mo}
${vo}
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
}`,It=64,po=16,go=5,yt=32,Wo={center:[0,1,0],size:[8,2,8],yaw:0,color:[.85,.9,1],density:.6,softness:.4,falloff:.6,glow:[.4,.8,1],glowStrength:0,noise:.6,noiseScale:4,speed:.6,direction:60,rise:.05,churn:.3},jo={enabled:!0,steps:24,selfShadow:!0,lights:!0,shadows:!0,sun:.45,ambient:.6};function ws(r={}){const e=Wo;return{...e,...r,center:[...r.center??e.center],size:[...r.size??e.size],color:[...r.color??e.color],glow:[...r.glow??e.glow]}}function Ho(r,e=new Float32Array(6)){const t=r.yaw*Math.PI/180,i=Math.abs(Math.cos(t)),o=Math.abs(Math.sin(t)),a=Math.abs(r.size[0])/2,s=Math.abs(r.size[1])/2,n=Math.abs(r.size[2])/2,u=i*a+o*n,l=o*a+i*n;return e[0]=r.center[0]-u,e[1]=r.center[1]-s,e[2]=r.center[2]-l,e[3]=r.center[0]+u,e[4]=r.center[1]+s,e[5]=r.center[2]+l,e}function Yo(r,e){const t=Math.max(.05,r.noiseScale)*go,i=r.direction*Math.PI/180,o=a=>a-Math.floor(a);return{drift:[o(-Math.sin(i)*r.speed*e/t),o(-r.rise*e/t),o(-Math.cos(i)*r.speed*e/t)],churn:o(-r.churn*e/t)}}function qo(r,e,t){const i=new Float32Array(6),o=r.filter(s=>s.enabled!==!1&&s.density>0&&s.size.every(n=>Math.abs(n)>.001)&&(!e||mt(e,Ho(s,i))));if(o.length<=1)return o;const a=s=>Math.hypot(s.center[0]-t[0],s.center[1]-t[1],s.center[2]-t[2]);return o.sort((s,n)=>a(s)-a(n)).slice(0,It)}function xo(r,e=!1){return`
#define FOG_VOLUMES ${r}
uniform int uFogVolCount;
uniform vec4 uFogVolA[FOG_VOLUMES]; // centre xyz, cos yaw
uniform vec4 uFogVolB[FOG_VOLUMES]; // half size xyz, sin yaw
uniform vec4 uFogVolC[FOG_VOLUMES]; // colour rgb, density
uniform vec4 uFogVolD[FOG_VOLUMES]; // glow rgb (times its strength), softness
uniform vec4 uFogVolE[FOG_VOLUMES]; // noise drift xyz (texture units), 1 / the noise's repeat (world units)
uniform vec4 uFogVolF[FOG_VOLUMES]; // churn phase, noise amount, falloff, seed
${e?`
#define FOG_CLEARS ${yt}
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
}`}const Ko=xo(It,!0),Zo=xo(po),Ot=class Ot{constructor(){d(this,"settings",{...jo});d(this,"volumes",[]);d(this,"count",0);d(this,"data",Array.from({length:6},()=>new Float32Array(It*4)));d(this,"clears",[]);d(this,"clearCount",0);d(this,"clearData",[new Float32Array(yt*4),new Float32Array(yt*4)])}get active(){return this.count}prepare(e,t,i){const o=this.settings.enabled?qo(this.volumes,e,t):[];this.count=o.length;const[a,s,n,u,l,c]=this.data,f=o.some(m=>m.seed===void 0)?new Map(this.volumes.map((m,g)=>[m,g])):null;o.forEach((m,g)=>{const E=m.yaw*Math.PI/180,S=g*4,C=Yo(m,i),A=Math.max(0,m.glowStrength);a.set([m.center[0],m.center[1],m.center[2],Math.cos(E)],S),s.set([Math.abs(m.size[0])/2,Math.abs(m.size[1])/2,Math.abs(m.size[2])/2,Math.sin(E)],S),n.set([m.color[0],m.color[1],m.color[2],Math.max(0,m.density)],S),u.set([m.glow[0]*A,m.glow[1]*A,m.glow[2]*A,Math.min(1,Math.max(0,m.softness))],S),l.set([C.drift[0],C.drift[1],C.drift[2],1/(Math.max(.05,m.noiseScale)*go)],S),c.set([C.churn,Math.min(1,Math.max(0,m.noise)),Math.min(1,Math.max(0,m.falloff)),m.seed??(f==null?void 0:f.get(m))??0],S)});const h=t[0],v=t[2],p=this.count?this.clears.filter(m=>(m.strength??1)>0&&m.range>0):[];p.length>yt&&p.sort((m,g)=>Math.hypot(m.x-h,m.z-v)-Math.hypot(g.x-h,g.z-v)),this.clearCount=Math.min(yt,p.length);const[x,w]=this.clearData;for(let m=0;m<this.clearCount;m++){const g=p[m];x.set([g.x,g.z,g.range,Math.min(1,Math.max(0,g.strength??1))],m*4),w.set([Math.cos(g.heading),Math.sin(g.heading),Math.cos(Math.min(Math.PI,Math.max(0,g.halfAngle))),Math.min(1,Math.max(0,g.soft??.3))],m*4)}}bind(e,t,i=this.count,o=It){const a=Math.min(i,o);e.uniform1i(t.uniform("uFogVolCount"),a),e.uniform1i(t.uniform("uFogClearCount"),a?this.clearCount:0),a&&(Ot.NAMES.forEach((s,n)=>e.uniform4fv(t.uniform(s),this.data[n],0,o*4)),this.clearCount&&(e.uniform4fv(t.uniform("uFogClearA"),this.clearData[0]),e.uniform4fv(t.uniform("uFogClearB"),this.clearData[1])))}};d(Ot,"NAMES",["uFogVolA","uFogVolB","uFogVolC","uFogVolD","uFogVolE","uFogVolF"]);let mi=Ot;const Jo={enabled:!0,bloom:!0,bloomThreshold:1,bloomStrength:.35,vignette:.25,contrast:1.05,saturation:1.05,ssao:!0,ssaoStrength:.7,ssaoRadius:.9,volumetric:!0,fogDensity:.012,fogHeight:5,fogColor:[.8,.85,.95],fogAmbient:.3,fogSteps:24,fogSun:.3,fogFullRes:!1,fogScale:.5,fogDepthAware:!0,fogTemporal:!0,cloudsHalfRate:!0,fogSmooth:1,dof:!1,dofFocus:30,dofRange:4,dofFalloff:20,dofBlur:8,blurOutside:null,chroma:0},Qo=5,Ve=`#version 300 es
out vec2 vUv;
void main() {
  // One triangle covering the screen: no vertex buffer needed.
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`,er=`#version 300 es
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
}`,tr=`#version 300 es
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
}`,ir=`#version 300 es
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
}`,or=`#version 300 es
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
}`,rr=`#version 300 es
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
}`,ar=`#version 300 es
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
}`,sr=`#version 300 es
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
${mo}
${Ko}
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
}`,nr=`#version 300 es
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
}`,lr=`#version 300 es
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
}`;class ur{constructor(e){d(this,"timers",null);d(this,"fogHist",[null,null]);d(this,"fogHistAt",0);d(this,"prevViewProj",null);d(this,"prevEye",null);d(this,"histValid",!1);d(this,"frameIndex",0);d(this,"fogTemporal");d(this,"cloudValid",!1);d(this,"settings",{...Jo});d(this,"hdr");d(this,"scene",null);d(this,"mips",[]);d(this,"ao",null);d(this,"aoBlur",null);d(this,"fog",null);d(this,"fogTmp",null);d(this,"fogBlur");d(this,"cloudProgram");d(this,"cloud",null);d(this,"cloudTmp",null);d(this,"volume");d(this,"ssao");d(this,"blur");d(this,"vao");d(this,"bright");d(this,"down");d(this,"up");d(this,"composite");d(this,"width",0);d(this,"height",0);d(this,"depthCopy",null);d(this,"depthCopyFbo",null);d(this,"depthCopyW",0);d(this,"depthCopyH",0);d(this,"blackTex",null);this.gl=e,this.hdr=!!e.getExtension("EXT_color_buffer_float"),e.getExtension("OES_texture_float_linear");const t=e.createVertexArray();if(!t)throw new Error("post vao failed");this.vao=t,this.bright=new q(e,Ve,er),this.down=new q(e,Ve,tr),this.up=new q(e,Ve,ir),this.composite=new q(e,Ve,lr),this.ssao=new q(e,Ve,or),this.volume=new q(e,Ve,sr),this.fogBlur=new q(e,Ve,ar),this.fogTemporal=new q(e,Ve,nr),this.cloudProgram=new q(e,Ve,Go),this.blur=new q(e,Ve,rr)}makeTarget(e,t,i,o=this.hdr){const a=this.gl,s=a.createTexture(),n=a.createFramebuffer();if(!s||!n)throw new Error("post target failed");a.bindTexture(a.TEXTURE_2D,s),a.texImage2D(a.TEXTURE_2D,0,o?a.RGBA16F:a.RGBA8,e,t,0,a.RGBA,o?a.HALF_FLOAT:a.UNSIGNED_BYTE,null),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.LINEAR),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MAG_FILTER,a.LINEAR),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE),a.bindFramebuffer(a.FRAMEBUFFER,n),a.framebufferTexture2D(a.FRAMEBUFFER,a.COLOR_ATTACHMENT0,a.TEXTURE_2D,s,0);let u;if(i){const c=a.createTexture();if(!c)throw new Error("post depth failed");a.bindTexture(a.TEXTURE_2D,c),a.texImage2D(a.TEXTURE_2D,0,a.DEPTH_COMPONENT24,e,t,0,a.DEPTH_COMPONENT,a.UNSIGNED_INT,null),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.NEAREST),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MAG_FILTER,a.NEAREST),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE),a.framebufferTexture2D(a.FRAMEBUFFER,a.DEPTH_ATTACHMENT,a.TEXTURE_2D,c,0),u=c}const l=a.checkFramebufferStatus(a.FRAMEBUFFER);if(a.bindFramebuffer(a.FRAMEBUFFER,null),a.bindTexture(a.TEXTURE_2D,null),l!==a.FRAMEBUFFER_COMPLETE)throw new Error(`post framebuffer incomplete: ${l}`);return{fbo:n,tex:s,width:e,height:t,depth:u}}dropTarget(e){e&&(this.gl.deleteFramebuffer(e.fbo),this.gl.deleteTexture(e.tex),e.depth&&this.gl.deleteTexture(e.depth))}resize(e,t){if(e=Math.max(1,e),t=Math.max(1,t),e===this.width&&t===this.height&&this.scene)return;this.width=e,this.height=t,this.dropTarget(this.scene),this.dropTarget(this.ao),this.dropTarget(this.aoBlur),this.dropTarget(this.fog),this.dropTarget(this.fogTmp),this.fog=this.fogTmp=null,this.dropTarget(this.cloud),this.dropTarget(this.cloudTmp),this.cloud=this.cloudTmp=null,this.cloudValid=!1,this.dropTarget(this.fogHist[0]),this.dropTarget(this.fogHist[1]),this.fogHist=[null,null],this.histValid=!1;for(const n of this.mips)this.dropTarget(n);this.mips.length=0,this.scene=this.makeTarget(e,t,!0);const i=Math.max(1,e>>1),o=Math.max(1,t>>1);this.ao=this.makeTarget(i,o,!1,!1),this.aoBlur=this.makeTarget(i,o,!1,!1);let a=Math.max(1,e>>1),s=Math.max(1,t>>1);for(let n=0;n<Qo;n++)this.mips.push(this.makeTarget(a,s,!1)),a=Math.max(1,a>>1),s=Math.max(1,s>>1)}get depthTexture(){var e;return((e=this.scene)==null?void 0:e.depth)??null}snapshotDepth(){var t;const e=this.gl;if(!((t=this.scene)!=null&&t.depth))return null;if(!this.depthCopy||this.depthCopyW!==this.scene.width||this.depthCopyH!==this.scene.height){this.depthCopy&&e.deleteTexture(this.depthCopy),this.depthCopyFbo&&e.deleteFramebuffer(this.depthCopyFbo);const i=e.createTexture(),o=e.createFramebuffer();if(!i||!o)throw new Error("depth copy failed");e.bindTexture(e.TEXTURE_2D,i),e.texImage2D(e.TEXTURE_2D,0,e.DEPTH_COMPONENT24,this.scene.width,this.scene.height,0,e.DEPTH_COMPONENT,e.UNSIGNED_INT,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.bindFramebuffer(e.FRAMEBUFFER,o),e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.TEXTURE_2D,i,0),e.drawBuffers([e.NONE]),e.readBuffer(e.NONE),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindTexture(e.TEXTURE_2D,null),this.depthCopy=i,this.depthCopyFbo=o,this.depthCopyW=this.scene.width,this.depthCopyH=this.scene.height}return e.bindFramebuffer(e.READ_FRAMEBUFFER,this.scene.fbo),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,this.depthCopyFbo),e.blitFramebuffer(0,0,this.scene.width,this.scene.height,0,0,this.scene.width,this.scene.height,e.DEPTH_BUFFER_BIT,e.NEAREST),e.bindFramebuffer(e.FRAMEBUFFER,this.scene.fbo),this.depthCopy}begin(){if(!this.scene)return;const e=this.gl;e.bindFramebuffer(e.FRAMEBUFFER,this.scene.fbo),e.viewport(0,0,this.scene.width,this.scene.height)}end(e,t,i,o){var E,S,C,A,R,_,k,B,y,F,M,D,j,K,X,J,H,N,oe,Q;const a=this.gl;if(!this.scene)return;const s=this.settings;a.disable(a.DEPTH_TEST),a.disable(a.BLEND),a.bindVertexArray(this.vao);let n=null;const u=o==null?void 0:o.fogVolumes,l=u&&(o!=null&&o.clouds)?u.active:0,c=!!o&&!!this.scene.depth&&(s.volumetric||l>0);if(c&&o&&this.scene.depth){(E=this.timers)==null||E.begin("fog");const L=s.fogFullRes?1:Math.min(1,Math.max(.25,s.fogScale)),W=Math.max(1,Math.floor(this.scene.width*L)),T=Math.max(1,Math.floor(this.scene.height*L));(!this.fog||!this.fogTmp||this.fog.width!==W||this.fog.height!==T)&&(this.dropTarget(this.fog),this.dropTarget(this.fogTmp),this.dropTarget(this.fogHist[0]),this.dropTarget(this.fogHist[1]),this.fogHist=[null,null],this.histValid=!1,this.fog=this.makeTarget(W,T,!1),this.fogTmp=this.makeTarget(W,T,!1)),a.bindFramebuffer(a.FRAMEBUFFER,this.fog.fbo),a.viewport(0,0,this.fog.width,this.fog.height);const b=this.volume;b.use(),this.bind(b,"uDepth",this.scene.depth,0);for(let U=0;U<3;U++)this.bind(b,`uShadow${U}`,o.shadowMaps[Math.min(U,o.shadowMaps.length-1)]??this.black(),1+U),b.setMat4(`uLightVP${U}`,o.lightViewProj[Math.min(U,o.lightViewProj.length-1)]??ye());a.uniform1i(b.uniform("uCascades"),o.shadowMaps.length),b.setMat4("uInvViewProj",o.invViewProj),b.setVec3("uEye",...o.eye),b.setVec3("uSunDir",...o.sunDir),b.setVec3("uSunRadiance",...o.sunRadiance),b.setVec3("uSkyColor",...o.skyColor),b.setVec3("uFogColor",...s.fogColor),b.setFloat("uDensity",s.volumetric?s.fogDensity:0),b.setFloat("uHeight",Math.max(.1,s.fogHeight)),b.setFloat("uAmbient",s.fogAmbient),b.setFloat("uSunScatter",s.fogSun),a.uniform1i(b.uniform("uSteps"),s.volumetric?Math.max(4,Math.min(128,Math.round(s.fogSteps))):0),u==null||u.bind(a,b,l),o.clouds&&(a.activeTexture(a.TEXTURE4),a.bindTexture(a.TEXTURE_3D,o.clouds.detail)),a.uniform1i(b.uniform("uNoise"),4),(S=o.lights)==null||S.bind(5,6),a.uniform1i(b.uniform("uLights"),5),a.uniform1i(b.uniform("uTiles"),6);const P=u==null?void 0:u.settings;a.uniform1i(b.uniform("uVolSteps"),Math.max(2,Math.min(64,Math.round((P==null?void 0:P.steps)??24)))),b.setFloat("uVolSelfShadow",P!=null&&P.selfShadow?1:0),b.setFloat("uVolSun",(P==null?void 0:P.sun)??0),b.setFloat("uVolAmbient",(P==null?void 0:P.ambient)??0),a.uniform3f(b.uniform("uTileInfo"),((C=o.lights)==null?void 0:C.tilesX)??1,tt,P!=null&&P.lights&&o.lights?1:0),a.uniform2f(b.uniform("uScreen"),this.scene.width,this.scene.height),b.setFloat("uFar",o.far),this.bind(b,"uScene",this.scene.tex,7),this.bind(b,"uVeilMask",((A=o.veil)==null?void 0:A.mask)??this.black(),8),a.uniform2f(b.uniform("uVeilCells"),((R=o.veil)==null?void 0:R.cells[0])??1,((_=o.veil)==null?void 0:_.cells[1])??1),b.setFloat("uVeilOn",o.veil?1:0),b.setFloat("uVeilAlpha",((k=o.veil)==null?void 0:k.alpha)??0),this.frameIndex++,b.setFloat("uFrameJitter",s.fogTemporal?this.frameIndex*.6180339887%1:0),b.setFloat("uSkip",o.rayStart??0),b.setVec3("uViewPoint",...o.viewPoint??o.eye),a.drawArrays(a.TRIANGLES,0,3);let z=this.fog;const $=et(o.invViewProj);if(s.fogTemporal){(!this.fogHist[0]||!this.fogHist[1])&&(this.fogHist=[this.makeTarget(W,T,!1),this.makeTarget(W,T,!1)],this.histValid=!1);const U=this.fogHist[this.fogHistAt],V=this.fogHist[1-this.fogHistAt];a.bindFramebuffer(a.FRAMEBUFFER,U.fbo);const Y=this.fogTemporal;Y.use(),this.bind(Y,"uCurrent",this.fog.tex,0),this.bind(Y,"uHistory",V.tex,1),this.bind(Y,"uDepth",this.scene.depth,2),Y.setMat4("uInvViewProj",o.invViewProj),Y.setMat4("uPrevViewProj",this.prevViewProj??$),a.uniform2f(Y.uniform("uTexel"),1/W,1/T);const fe=this.prevEye?Math.hypot(o.eye[0]-this.prevEye[0],o.eye[1]-this.prevEye[1],o.eye[2]-this.prevEye[2]):0;Y.setFloat("uBlend",this.histValid&&this.prevViewProj?Math.min(.85,.15+fe*1.5):1),Y.setFloat("uFar",o.far),a.drawArrays(a.TRIANGLES,0,3),this.fogHistAt=1-this.fogHistAt,this.histValid=!0,z=U}else this.histValid=!1;this.prevViewProj=$,this.prevEye=[...o.eye];const O=Math.max(0,Math.min(3,Math.round(s.fogSmooth)));if(O>0&&this.fogTmp){const U=this.fogBlur;U.use(),this.bind(U,"uDepth",this.scene.depth,1),U.setMat4("uInvProjection",i);for(let V=0;V<O;V++)a.bindFramebuffer(a.FRAMEBUFFER,this.fogTmp.fbo),this.bind(U,"uSrc",V===0?z.tex:this.fog.tex,0),a.uniform2f(U.uniform("uStep"),1/this.fog.width,0),a.drawArrays(a.TRIANGLES,0,3),a.bindFramebuffer(a.FRAMEBUFFER,this.fog.fbo),this.bind(U,"uSrc",this.fogTmp.tex,0),a.uniform2f(U.uniform("uStep"),0,1/this.fog.height),a.drawArrays(a.TRIANGLES,0,3)}n=O>0?this.fog.tex:z.tex}let f=null;const h=o==null?void 0:o.clouds;c||this.frameIndex++;const v=!!(h&&h.settings.enabled&&h.active.length&&o&&this.scene.depth);if(v||(this.cloudValid=!1),v&&s.cloudsHalfRate&&this.cloudValid&&this.cloud&&this.frameIndex%2===1)f=this.cloud.tex;else if(h&&v&&o&&this.scene.depth){if(this.cloudValid=!0,(B=this.timers)==null||B.begin("clouds"),!this.cloud||!this.cloudTmp){const b=Math.max(1,this.scene.width>>1),P=Math.max(1,this.scene.height>>1);this.cloud=this.makeTarget(b,P,!1),this.cloudTmp=this.makeTarget(b,P,!1)}const L=this.cloudProgram,W=h.settings;a.bindFramebuffer(a.FRAMEBUFFER,this.cloud.fbo),a.viewport(0,0,this.cloud.width,this.cloud.height),L.use(),this.bind(L,"uDepth",this.scene.depth,0),this.bind(L,"uVeilMask",((y=o.veil)==null?void 0:y.mask)??this.black(),3),a.uniform2f(L.uniform("uVeilCells"),((F=o.veil)==null?void 0:F.cells[0])??1,((M=o.veil)==null?void 0:M.cells[1])??1),L.setFloat("uVeilOn",o.veil&&!W.overVeil?1:0),L.setFloat("uVeilAlpha",((D=o.veil)==null?void 0:D.alpha)??0),h.bindCommon(L,1),a.activeTexture(a.TEXTURE2),a.bindTexture(a.TEXTURE_3D,h.detail),a.uniform1i(L.uniform("uCloudDetail"),2),L.setMat4("uInvViewProj",o.invViewProj),L.setVec3("uSunDir",...o.sunDir),L.setVec3("uSunRadiance",...o.sunRadiance),L.setVec3("uSkyColor",...o.skyColor),L.setFloat("uFar",Math.max(o.far*1.5,300)),L.setFloat("uTime",o.time??0),L.setFloat("uSkip",o.rayStart??0),a.uniform1i(L.uniform("uSteps"),Math.max(8,Math.min(128,Math.round(W.steps)))),a.drawArrays(a.TRIANGLES,0,3),a.bindTexture(a.TEXTURE_3D,null);const T=this.fogBlur;T.use(),this.bind(T,"uDepth",this.scene.depth,1),T.setMat4("uInvProjection",i),a.bindFramebuffer(a.FRAMEBUFFER,this.cloudTmp.fbo),this.bind(T,"uSrc",this.cloud.tex,0),a.uniform2f(T.uniform("uStep"),1/this.cloud.width,0),a.drawArrays(a.TRIANGLES,0,3),a.bindFramebuffer(a.FRAMEBUFFER,this.cloud.fbo),this.bind(T,"uSrc",this.cloudTmp.tex,0),a.uniform2f(T.uniform("uStep"),0,1/this.cloud.height),a.drawArrays(a.TRIANGLES,0,3),f=this.cloud.tex}let p=null;s.ssao&&this.ao&&this.aoBlur&&this.scene.depth&&((j=this.timers)==null||j.begin("ssao"),a.bindFramebuffer(a.FRAMEBUFFER,this.ao.fbo),a.viewport(0,0,this.ao.width,this.ao.height),this.ssao.use(),this.bind(this.ssao,"uDepth",(o==null?void 0:o.opaqueDepth)??this.scene.depth,0),this.ssao.setMat4("uProjection",t),this.ssao.setMat4("uInvProjection",i),a.uniform2f(this.ssao.uniform("uTexel"),1/this.scene.width,1/this.scene.height),this.ssao.setFloat("uRadius",s.ssaoRadius),a.drawArrays(a.TRIANGLES,0,3),a.bindFramebuffer(a.FRAMEBUFFER,this.aoBlur.fbo),this.blur.use(),this.bind(this.blur,"uSrc",this.ao.tex,0),a.uniform2f(this.blur.uniform("uTexel"),1/this.ao.width,1/this.ao.height),a.drawArrays(a.TRIANGLES,0,3),p=this.aoBlur.tex);let x=null;if(s.bloom&&this.mips.length){(K=this.timers)==null||K.begin("bloom");const L=this.mips[0];a.bindFramebuffer(a.FRAMEBUFFER,L.fbo),a.viewport(0,0,L.width,L.height),this.bright.use(),this.bind(this.bright,"uScene",this.scene.tex,0),this.bright.setFloat("uThreshold",s.bloomThreshold),a.drawArrays(a.TRIANGLES,0,3),this.down.use();for(let W=1;W<this.mips.length;W++){const T=this.mips[W-1],b=this.mips[W];a.bindFramebuffer(a.FRAMEBUFFER,b.fbo),a.viewport(0,0,b.width,b.height),this.bind(this.down,"uSrc",T.tex,0),a.uniform2f(this.down.uniform("uTexel"),1/T.width,1/T.height),a.drawArrays(a.TRIANGLES,0,3)}this.up.use();for(let W=this.mips.length-2;W>=0;W--){const T=this.mips[W+1],b=this.mips[W];a.bindFramebuffer(a.FRAMEBUFFER,b.fbo),a.viewport(0,0,b.width,b.height),a.enable(a.BLEND),a.blendFunc(a.ONE,a.ONE),this.bind(this.up,"uSrc",T.tex,0),this.bind(this.up,"uPrev",this.black(),1),a.uniform2f(this.up.uniform("uTexel"),1/T.width,1/T.height),a.drawArrays(a.TRIANGLES,0,3),a.disable(a.BLEND)}x=this.mips[0].tex}(X=this.timers)==null||X.begin("composite"),a.bindFramebuffer(a.FRAMEBUFFER,null),a.viewport(0,0,this.width,this.height),this.composite.use(),this.bind(this.composite,"uScene",this.scene.tex,0),this.bind(this.composite,"uBloom",x??this.black(),1),this.composite.setFloat("uBloomStrength",x?s.bloomStrength:0),this.bind(this.composite,"uAo",p??this.black(),2),this.bind(this.composite,"uFog",n??this.black(),3),this.composite.setFloat("uHasFog",n?1:0),a.uniform2f(this.composite.uniform("uFogSize"),((J=this.fog)==null?void 0:J.width)??1,((H=this.fog)==null?void 0:H.height)??1),this.composite.setFloat("uDepthAware",s.fogDepthAware?1:0),this.bind(this.composite,"uCloud",f??this.black(),5),this.composite.setFloat("uHasCloud",f?1:0);const w=(N=o==null?void 0:o.clouds)==null?void 0:N.settings;this.composite.setFloat("uCloudOpacity",Math.min(1,Math.max(0,(w==null?void 0:w.opacity)??1))),this.composite.setFloat("uCloudShade",Math.min(1,Math.max(0,(w==null?void 0:w.shade)??0))),a.uniform2f(this.composite.uniform("uCloudDigital"),w!=null&&w.digital?Math.max(1,w.digital.pixels):0,w!=null&&w.digital?w.digital.steps:0),a.uniform2f(this.composite.uniform("uCloudSize"),((oe=this.cloud)==null?void 0:oe.width)??1,((Q=this.cloud)==null?void 0:Q.height)??1),this.composite.setFloat("uAoStrength",p?s.ssaoStrength:0),this.composite.setFloat("uExposure",e),this.composite.setFloat("uVignette",s.vignette),this.composite.setFloat("uContrast",s.contrast),this.composite.setFloat("uSaturation",s.saturation),this.bind(this.composite,"uDepth",this.scene.depth??this.black(),4),this.composite.setMat4("uInvProjection",i),this.composite.setMat4("uInvViewProj",(o==null?void 0:o.invViewProj)??ye()),a.uniform4f(this.composite.uniform("uDof"),s.dofFocus,s.dofRange,s.dofFalloff,s.dof&&this.scene.depth?s.dofBlur:0);const m=s.blurOutside&&o&&this.scene.depth?s.blurOutside:null,g=m?m.rect:[0,0,0,0];a.uniform4f(this.composite.uniform("uBlurRect"),g[0],g[1],g[2],g[3]),a.uniform2f(this.composite.uniform("uBlurOut"),m?Math.max(.01,m.distance):1,m?m.blur:0),a.uniform2f(this.composite.uniform("uTexel"),1/this.scene.width,1/this.scene.height),this.composite.setFloat("uChroma",s.chroma),this.composite.setFloat("uLens",Math.max(0,s.lens??0)),this.composite.setFloat("uAspect",this.scene.width/Math.max(1,this.scene.height)),a.drawArrays(a.TRIANGLES,0,3),a.bindVertexArray(null),a.enable(a.DEPTH_TEST)}black(){if(this.blackTex)return this.blackTex;const e=this.gl,t=e.createTexture();return e.bindTexture(e.TEXTURE_2D,t),e.texImage2D(e.TEXTURE_2D,0,e.RGBA8,1,1,0,e.RGBA,e.UNSIGNED_BYTE,new Uint8Array([0,0,0,255])),e.bindTexture(e.TEXTURE_2D,null),this.blackTex=t,t}bind(e,t,i,o){const a=this.gl;a.activeTexture(a.TEXTURE0+o),a.bindTexture(a.TEXTURE_2D,i),a.uniform1i(e.uniform(t),o)}}const cr={enabled:!1,dayLength:24,azimuth:35,maxElevation:58,nightLight:.5},xe=(r,e,t)=>[r[0]+(e[0]-r[0])*t,r[1]+(e[1]-r[1])*t,r[2]+(e[2]-r[2])*t],Rt=(r,e,t)=>{const i=Math.min(1,Math.max(0,(r-e)/(t-e)));return i*i*(3-2*i)};function Ci(r,e,t){return r+(e-r)*t}function hr(r,e,t,i=0,o=[1,1,1]){const a=fr(r,e,t),s=Math.min(1,Math.max(0,i));if(s<=0)return a;const n=a.day,u=xe([1,1,1],o,s),l=v=>[v[0]*u[0],v[1]*u[1],v[2]*u[2]],c=l(xe([.02,.025,.035],[.3,.32,.36],n)),f=l(xe([.02,.025,.035],[.42,.44,.48],n)),h=l(xe([.015,.02,.03],[.2,.22,.26],n));return{...a,sunIntensity:a.sunIntensity*(1-.9*s),sunColor:xe(a.sunColor,l([.82,.84,.9]),.7*s),skyColor:xe(a.skyColor,c,s),groundColor:xe(a.groundColor,a.groundColor.map(v=>v*.6),s),ambient:a.ambient*(1-.3*s),horizon:xe(a.horizon,f,s),zenith:xe(a.zenith,h,s)}}function fr(r,e,t){const i=(r%1+1)%1,o=Math.sin(i*Math.PI*2),a=Rt(o,-.18,.35),s=1-Math.min(1,Math.max(0,o/.35)),n=o<0,u=Rt(o,0,.22),l=Rt(-o,.02,.3),c=Math.max(n?25:4,Math.abs(o)*t.maxElevation)*Math.PI/180,f=(t.azimuth+(n?180:0))*Math.PI/180,h=[-Math.sin(f)*Math.cos(c),-Math.sin(c),Math.cos(f)*Math.cos(c)],v=[1,.55,.28],p=n?[.5,.62,1]:xe(e.sunColor,v,s*.8),x=Math.min(1,Math.max(0,t.nightLight??.5)),w=n?e.sunIntensity*(.03+.2*x)*l:e.sunIntensity*(.1+.9*a)*u,m=[.02,.03,.06],g=[.9,.45,.25],E=[.18,.36,.78],S=[.62,.74,.92],C=xe(m,E,a),A=(s*a*.9+s*(1-a)*.5)*Rt(o,-.2,0),R=xe(xe(m,S,a),g,A);return{sunDir:h,sunColor:p,sunIntensity:w,skyColor:xe(xe([.05,.06,.1],[.16,.2,.34],x),e.skyColor,a),groundColor:xe([.03,.03,.04],e.groundColor,a),ambient:e.ambient*Ci(.18+.22*x,1,a),horizon:R,zenith:C,day:a,exposure:Ci(1+3*x,1,a)}}const dr={enabled:!0,sunSize:.012,sunGlow:.6},mr=`#version 300 es
out vec2 vNdc;
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  vNdc = p * 2.0 - 1.0;
  gl_Position = vec4(vNdc, 0.999999, 1.0);
}`,vr=`#version 300 es
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
}`;class pr{constructor(e){d(this,"settings",{...dr});d(this,"program");d(this,"vao");this.gl=e,this.program=new q(e,mr,vr);const t=e.createVertexArray();if(!t)throw new Error("sky vao failed");this.vao=t}setSky(e,t){e.setVec3("uSunDir",...t.sunDir),e.setVec3("uSunColor",...t.sunColor),e.setFloat("uSunIntensity",t.sunIntensity),e.setVec3("uHorizon",...t.horizon),e.setVec3("uZenith",...t.zenith),e.setFloat("uSunSize",this.settings.sunSize),e.setFloat("uSunGlow",this.settings.sunGlow)}renderEnv(e,t){const i=this.gl,o=this.program;o.use(),this.setSky(o,t),o.setVec3("uEye",0,0,0),o.setVec3("uBelow",...t.groundColor),o.setFloat("uExposure",1),o.setFloat("uToneMap",0),i.disable(i.DEPTH_TEST),i.disable(i.CULL_FACE),i.bindVertexArray(this.vao);for(let a=0;a<6;a++)e.bindFace(a),o.setMat4("uInvViewProj",e.invViewProj[a]),i.drawArrays(i.TRIANGLES,0,3);i.bindVertexArray(null),e.finish(),i.enable(i.CULL_FACE),i.enable(i.DEPTH_TEST)}draw(e,t,i,o,a){const s=this.gl,n=this.program;n.use(),this.setSky(n,i),n.setMat4("uInvViewProj",e),n.setVec3("uEye",t[0],t[1],t[2]),n.setVec3("uBelow",i.horizon[0]*.5,i.horizon[1]*.5,i.horizon[2]*.5),n.setFloat("uExposure",o),n.setFloat("uToneMap",a?1:0),s.depthFunc(s.LEQUAL),s.depthMask(!1),s.disable(s.CULL_FACE),s.bindVertexArray(this.vao),s.drawArrays(s.TRIANGLES,0,3),s.bindVertexArray(null),s.enable(s.CULL_FACE),s.depthMask(!0),s.depthFunc(s.LESS)}}const gr={enabled:!0,reflections:!0,reflectionScale:.5,reflectionHalfRate:!0,waveHeight:.035,waveSpeed:1,waveSize:1,ripple:1,rippleSize:1,waveDirection:0,depthFade:1.2,foam:!0,foamWidth:.35,whitecaps:0,sides:!0,clarity:.55,color:[.07,.25,.32],sparkle:1,glow:1},ht=4,xr=`#version 300 es
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
}`,wr=`#version 300 es
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
}`,br=`#version 300 es
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
}`,yr=`#version 300 es
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
}`;class Tr{constructor(e){d(this,"settings",{...gr});d(this,"level",0);d(this,"program");d(this,"vao",null);d(this,"vbo",null);d(this,"ibo",null);d(this,"count",0);d(this,"sideProgram");d(this,"sideVao",null);d(this,"sideVbo",null);d(this,"sideIbo",null);d(this,"sideCount",0);d(this,"tintVbo",null);d(this,"sideTintVbo",null);d(this,"fbo",null);d(this,"tex",null);d(this,"depth",null);d(this,"rw",0);d(this,"rh",0);d(this,"wet",new Set);this.gl=e,this.program=new q(e,br,yr),this.sideProgram=new q(e,xr,wr)}get hasSurface(){return this.count>0}nearWater(e,t){if(!this.wet.size)return!1;const i=Math.floor((e[0]-t)/ht),o=Math.floor((e[3]+t)/ht),a=Math.floor((e[2]-t)/ht),s=Math.floor((e[5]+t)/ht);for(let n=a;n<=s;n++)for(let u=i;u<=o;u++)if(this.wet.has(n*65536+u))return!0;return!1}setGeometry(e){const t=this.gl;this.dispose(!1),this.level=e.level,this.wet=new Set;for(let s=0;s+2<e.vertices.length;s+=6)this.wet.add(Math.floor(e.vertices[s+2]/ht)*65536+Math.floor(e.vertices[s]/ht));if(this.count=e.indices.length,!this.count)return;if(this.sideCount=e.sides.indices.length,this.sideCount){const s=t.createVertexArray(),n=t.createBuffer(),u=t.createBuffer();if(!s||!n||!u)throw new Error("water side allocation failed");this.sideVao=s,this.sideVbo=n,this.sideIbo=u,t.bindVertexArray(s),t.bindBuffer(t.ARRAY_BUFFER,n),t.bufferData(t.ARRAY_BUFFER,e.sides.vertices,t.STATIC_DRAW),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,3,t.FLOAT,!1,16,0),t.enableVertexAttribArray(1),t.vertexAttribPointer(1,1,t.FLOAT,!1,16,12),e.sides.tints&&(this.sideTintVbo=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,this.sideTintVbo),t.bufferData(t.ARRAY_BUFFER,e.sides.tints,t.STATIC_DRAW),t.enableVertexAttribArray(2),t.vertexAttribPointer(2,4,t.FLOAT,!1,16,0)),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,u),t.bufferData(t.ELEMENT_ARRAY_BUFFER,e.sides.indices,t.STATIC_DRAW),t.bindVertexArray(null)}const i=t.createVertexArray(),o=t.createBuffer(),a=t.createBuffer();if(!i||!o||!a)throw new Error("water allocation failed");this.vao=i,this.vbo=o,this.ibo=a,t.bindVertexArray(i),t.bindBuffer(t.ARRAY_BUFFER,o),t.bufferData(t.ARRAY_BUFFER,e.vertices,t.STATIC_DRAW),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,3,t.FLOAT,!1,24,0),t.enableVertexAttribArray(1),t.vertexAttribPointer(1,2,t.FLOAT,!1,24,12),t.enableVertexAttribArray(2),t.vertexAttribPointer(2,1,t.FLOAT,!1,24,20),e.tints&&(this.tintVbo=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,this.tintVbo),t.bufferData(t.ARRAY_BUFFER,e.tints,t.STATIC_DRAW),t.enableVertexAttribArray(3),t.vertexAttribPointer(3,4,t.FLOAT,!1,16,0)),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,a),t.bufferData(t.ELEMENT_ARRAY_BUFFER,e.indices,t.STATIC_DRAW),t.bindVertexArray(null)}mirroredView(e,t){const i=this.level,o=[e[0],2*i-e[1],e[2]],a=[t[0],2*i-t[1],t[2]];return{view:Xt(o,a),eye:o}}beginReflection(e,t,i){const o=this.gl,a=Math.max(1,Math.floor(e*this.settings.reflectionScale)),s=Math.max(1,Math.floor(t*this.settings.reflectionScale));if(!this.fbo||a!==this.rw||s!==this.rh){this.fbo&&o.deleteFramebuffer(this.fbo),this.tex&&o.deleteTexture(this.tex),this.depth&&o.deleteRenderbuffer(this.depth);const n=o.createFramebuffer(),u=o.createTexture(),l=o.createRenderbuffer();if(!n||!u||!l)throw new Error("reflection target failed");o.bindTexture(o.TEXTURE_2D,u),o.texImage2D(o.TEXTURE_2D,0,o.RGBA8,a,s,0,o.RGBA,o.UNSIGNED_BYTE,null),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MIN_FILTER,o.LINEAR),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MAG_FILTER,o.LINEAR),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_S,o.CLAMP_TO_EDGE),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_T,o.CLAMP_TO_EDGE),o.bindRenderbuffer(o.RENDERBUFFER,l),o.renderbufferStorage(o.RENDERBUFFER,o.DEPTH_COMPONENT24,a,s),o.bindFramebuffer(o.FRAMEBUFFER,n),o.framebufferTexture2D(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,u,0),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.DEPTH_ATTACHMENT,o.RENDERBUFFER,l),o.bindFramebuffer(o.FRAMEBUFFER,null),o.bindTexture(o.TEXTURE_2D,null),this.fbo=n,this.tex=u,this.depth=l,this.rw=a,this.rh=s}o.bindFramebuffer(o.FRAMEBUFFER,this.fbo),o.viewport(0,0,a,s),o.clearColor(i[0],i[1],i[2],1),o.clear(o.COLOR_BUFFER_BIT|o.DEPTH_BUFFER_BIT),o.cullFace(o.FRONT)}endReflection(){this.gl.cullFace(this.gl.BACK)}draw(e){if(!this.vao)return;const t=this.gl,i=this.program;i.use(),i.setMat4("uProjection",e.projection),i.setMat4("uView",e.view),i.setFloat("uTime",e.time*this.settings.waveSpeed),i.setFloat("uWaveHeight",this.settings.waveHeight),i.setFloat("uWaveFreq",1/Math.max(.1,this.settings.waveSize)),i.setFloat("uRipple",this.settings.ripple);const o=this.settings.waveDirection*Math.PI/180;this.gl.uniform2f(i.uniform("uWaveRot"),Math.cos(o),Math.sin(o)),i.setFloat("uFoam",this.settings.foam?1:0),i.setFloat("uFoamWidth",this.settings.foamWidth),i.setFloat("uWhitecaps",Math.max(0,Math.min(1,this.settings.whitecaps))),i.setFloat("uHasDepth",e.depth&&e.invViewProj?1:0),i.setFloat("uAbsorb",this.settings.depthFade),e.depth&&e.invViewProj&&(this.gl.activeTexture(this.gl.TEXTURE10),this.gl.bindTexture(this.gl.TEXTURE_2D,e.depth),i.setMat4("uInvViewProj",e.invViewProj)),this.gl.uniform1i(i.uniform("uSceneDepth"),10),i.setFloat("uRippleFreq",1/Math.max(.1,this.settings.rippleSize)),i.setVec3("uEye",...e.eye),i.setVec3("uSunDir",...e.sunDir),i.setVec3("uSunColor",...e.sunColor),i.setFloat("uSunIntensity",e.sunIntensity),i.setVec3("uHorizon",...e.horizon),i.setVec3("uZenith",...e.zenith),i.setVec3("uColor",...this.settings.color),i.setFloat("uLight",e.light),i.setFloat("uGlow",Math.max(0,this.settings.glow)),i.setFloat("uClarity",this.settings.clarity),i.setFloat("uSparkle",this.settings.sparkle);const a=this.settings.reflections&&this.tex?1:0;if(this.tex&&(t.activeTexture(t.TEXTURE0+9),t.bindTexture(t.TEXTURE_2D,this.tex)),t.uniform1i(i.uniform("uReflection"),9),i.setFloat("uHasReflection",a),t.uniform2f(i.uniform("uResolution"),e.width,e.height),i.setVec3("uFogColor",...e.fogColor),t.uniform2f(i.uniform("uFogRange"),e.fogRange[0],e.fogRange[1]),i.setFloat("uExposure",e.exposure),i.setFloat("uToneMap",e.toneMap?1:0),t.enable(t.BLEND),t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ZERO,t.ONE),t.depthMask(!1),t.disable(t.CULL_FACE),this.settings.sides&&this.sideVao){const s=this.sideProgram;s.use(),s.setMat4("uProjection",e.projection),s.setMat4("uView",e.view),s.setFloat("uTime",e.time*this.settings.waveSpeed),s.setFloat("uWaveHeight",this.settings.waveHeight),s.setFloat("uWaveFreq",1/Math.max(.1,this.settings.waveSize));const n=this.settings.waveDirection*Math.PI/180;t.uniform2f(s.uniform("uWaveRot"),Math.cos(n),Math.sin(n)),s.setVec3("uColor",...this.settings.color),s.setFloat("uLight",e.light),s.setFloat("uGlow",Math.max(0,this.settings.glow)),s.setVec3("uHorizon",...e.horizon),s.setVec3("uEye",...e.eye),s.setVec3("uFogColor",...e.fogColor),t.uniform2f(s.uniform("uFogRange"),e.fogRange[0],e.fogRange[1]),s.setFloat("uExposure",e.exposure),s.setFloat("uToneMap",e.toneMap?1:0),t.bindVertexArray(this.sideVao),this.sideTintVbo||t.vertexAttrib4f(2,-1,0,0,0),t.drawElements(t.TRIANGLES,this.sideCount,t.UNSIGNED_INT,0),i.use()}t.bindVertexArray(this.vao),this.tintVbo||t.vertexAttrib4f(3,-1,0,0,0),t.drawElements(t.TRIANGLES,this.count,t.UNSIGNED_INT,0),t.bindVertexArray(null),t.enable(t.CULL_FACE),t.depthMask(!0),t.disable(t.BLEND)}dispose(e=!0){const t=this.gl;this.vao&&t.deleteVertexArray(this.vao),this.vbo&&t.deleteBuffer(this.vbo),this.ibo&&t.deleteBuffer(this.ibo),this.vao=this.vbo=this.ibo=null,this.count=0,this.sideVao&&t.deleteVertexArray(this.sideVao),this.sideVbo&&t.deleteBuffer(this.sideVbo),this.sideIbo&&t.deleteBuffer(this.sideIbo),this.sideVao=this.sideVbo=this.sideIbo=null,this.tintVbo&&t.deleteBuffer(this.tintVbo),this.sideTintVbo&&t.deleteBuffer(this.sideTintVbo),this.tintVbo=this.sideTintVbo=null,this.sideCount=0,e&&(this.fbo&&t.deleteFramebuffer(this.fbo),this.tex&&t.deleteTexture(this.tex),this.depth&&t.deleteRenderbuffer(this.depth),this.fbo=this.tex=this.depth=null,this.program.dispose(),this.sideProgram.dispose())}}const rt=32;class bs{constructor(e,t,i){d(this,"handle");if(this.gl=e,this.size=t,i.length>rt)throw new Error(`a splat takes at most ${rt} layers (got ${i.length})`);const o=e.createTexture();if(!o)throw new Error("texture array allocation failed");this.handle=o,e.bindTexture(e.TEXTURE_2D_ARRAY,o),e.texImage3D(e.TEXTURE_2D_ARRAY,0,e.SRGB8_ALPHA8,t,t,Math.max(1,i.length),0,e.RGBA,e.UNSIGNED_BYTE,null);const a=document.createElement("canvas");a.width=a.height=t;const s=a.getContext("2d");i.forEach((u,l)=>{s.clearRect(0,0,t,t),u(s,t),e.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,l,t,t,1,e.RGBA,e.UNSIGNED_BYTE,a)}),e.generateMipmap(e.TEXTURE_2D_ARRAY),e.texParameteri(e.TEXTURE_2D_ARRAY,e.TEXTURE_MIN_FILTER,e.LINEAR_MIPMAP_LINEAR),e.texParameteri(e.TEXTURE_2D_ARRAY,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D_ARRAY,e.TEXTURE_WRAP_S,e.REPEAT),e.texParameteri(e.TEXTURE_2D_ARRAY,e.TEXTURE_WRAP_T,e.REPEAT);const n=e.getExtension("EXT_texture_filter_anisotropic");n&&e.texParameterf(e.TEXTURE_2D_ARRAY,n.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(8,e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT))),e.bindTexture(e.TEXTURE_2D_ARRAY,null)}setLayer(e,t){const i=this.gl,o=document.createElement("canvas");o.width=o.height=this.size,t(o.getContext("2d"),this.size),i.bindTexture(i.TEXTURE_2D_ARRAY,this.handle),i.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,e,this.size,this.size,1,i.RGBA,i.UNSIGNED_BYTE,o),i.generateMipmap(i.TEXTURE_2D_ARRAY),i.bindTexture(i.TEXTURE_2D_ARRAY,null)}bind(e){const t=this.gl;t.activeTexture(t.TEXTURE0+e),t.bindTexture(t.TEXTURE_2D_ARRAY,this.handle)}dispose(){this.gl.deleteTexture(this.handle)}}class ys{constructor(e,t,i){d(this,"texture");d(this,"data");this.gl=e,this.width=t,this.height=i;const o=e.createTexture();if(!o)throw new Error("splat map allocation failed");this.texture=o,this.data=new Uint8Array(t*i*2*4),e.bindTexture(e.TEXTURE_2D,o),e.texImage2D(e.TEXTURE_2D,0,e.RGBA8,t,i*2,0,e.RGBA,e.UNSIGNED_BYTE,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.bindTexture(e.TEXTURE_2D,null)}set(e,t,i,o,a){const s=(t*this.width+e)*4;this.data[s]=i,this.data[s+1]=o,this.data[s+2]=Math.max(0,Math.min(255,Math.round(a))),this.data[s+3]=255}setMix(e,t,i,o){const a=((this.height+t)*this.width+e)*4;this.data[a]=i,this.data[a+1]=Math.max(0,Math.min(255,Math.round(o*255))),this.data[a+3]=255}upload(){const e=this.gl;e.bindTexture(e.TEXTURE_2D,this.texture),e.pixelStorei(e.UNPACK_ALIGNMENT,1),e.texSubImage2D(e.TEXTURE_2D,0,0,0,this.width,this.height*2,e.RGBA,e.UNSIGNED_BYTE,this.data),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.bindTexture(e.TEXTURE_2D,null)}dispose(){this.gl.deleteTexture(this.texture)}}const ae=16,Pi=3,Ct=4,Er=Ct*2+1,Ft=8,qt=8,Ui=11,Ar={enabled:!0,clumps:!0,density:40,height:.2,width:.04,wind:!0,windStrength:.45,windDirection:30,gustSpeed:1.6,gustSize:.18,interaction:!0,recover:3,distance:55,rootColor:[.03,.07,.015],tipColor:[.3,.42,.08],colorMix:0},Rr=`
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
`,Fr=`#version 300 es
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
${Rr}
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
}`,_r=`#version 300 es
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
}`,wo=`#version 300 es
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
}`,Pt=wo.replace(`in float vVary;
`,`in vec2 vUv;
uniform sampler2D uAlbedo;
uniform float uHasTex;
uniform float uCutoff;
`).replace("vec3 ground = vColor * mix(0.4, 1.08, vT);",`vec4 tex = uHasTex > 0.5 ? texture(uAlbedo, vUv) : vec4(1.0);
  if (uCutoff > 0.0 && tex.a < uCutoff) discard;
  vec3 ground = vColor * tex.rgb * mix(0.55, 1.05, vT);`).replace("vec3 own = mix(uRootColor, uTipColor, vT) * vVary;","vec3 own = mix(uRootColor, uTipColor, vT);");if(!Pt.includes("uCutoff")||!Pt.includes("tex.rgb")||Pt.includes("vVary"))throw new Error("grass: the clump shader could not be made from the blades’ one");function Je(r,e,t){const i=Math.sin(r*127.1+e*311.7+t*74.7)*43758.5453;return i-Math.floor(i)}class Mr{constructor(e){d(this,"settings",{...Ar});d(this,"program");d(this,"bladeBuffer");d(this,"chunks",new Map);d(this,"width",0);d(this,"height",0);d(this,"sample",null);d(this,"clumpProgram");d(this,"kinds",[]);d(this,"clumpSample",null);d(this,"clumpPer",0);d(this,"seed",0);d(this,"res",2);d(this,"firstFrame",!0);d(this,"stale",new Set);d(this,"trample");d(this,"tw",1);d(this,"th",1);d(this,"flat",new Float32Array(1));d(this,"pushX",new Float32Array(1));d(this,"pushZ",new Float32Array(1));d(this,"rustle",new Float32Array(1));d(this,"bytes",new Uint8Array(4));d(this,"active",new Set);d(this,"dirty",null);this.gl=e,this.program=new q(e,_r,wo),this.clumpProgram=new q(e,Fr,Pt);const t=[];for(let i=0;i<Ct;i++)t.push(-1,i/Ct,1,i/Ct);t.push(0,1),this.bladeBuffer=e.createBuffer(),e.bindBuffer(e.ARRAY_BUFFER,this.bladeBuffer),e.bufferData(e.ARRAY_BUFFER,new Float32Array(t),e.STATIC_DRAW),this.trample=e.createTexture(),this.resizeTrample(1,1)}get blades(){let e=0;for(const t of this.chunks.values())e+=t.count;return e}setField(e,t,i,o=0,a){this.clear(),this.width=e,this.height=t,this.sample=i,this.seed=o,this.clumpSample=(a==null?void 0:a.sample)??null,this.clumpPer=Math.max(0,Math.round((a==null?void 0:a.perCell)??0)),this.res=e*t<=256*256?2:1,this.resizeTrample(e*this.res,t*this.res),this.firstFrame=!0}rebuild(e,t,i,o,a=!1){if(!this.sample)return;const s=Math.max(0,Math.floor(e/ae)),n=Math.max(0,Math.floor(t/ae)),u=Math.min(Math.ceil(this.width/ae),Math.ceil(i/ae)),l=Math.min(Math.ceil(this.height/ae),Math.ceil(o/ae));for(let c=n;c<l;c++)for(let f=s;f<u;f++){const h=c*65536+f;this.chunks.has(h)&&(a?this.stale.add(h):(this.stale.delete(h),this.buildChunk(f,c)))}}setClumpKinds(e){const t=this.gl;for(const i of this.kinds)t.deleteBuffer(i.vbo),t.deleteBuffer(i.ibo);this.kinds=e.map(i=>{const o=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,o),t.bufferData(t.ARRAY_BUFFER,i.mesh.vertices,t.STATIC_DRAW);const a=t.createBuffer();t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,a),t.bufferData(t.ELEMENT_ARRAY_BUFFER,i.mesh.indices,t.STATIC_DRAW),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,null);let s=0;for(let n=1;n<i.mesh.vertices.length;n+=Ui)s=Math.max(s,i.mesh.vertices[n]);return{vbo:o,ibo:a,indices:i.mesh.indices.length,tall:s,kind:i}}),t.bindBuffer(t.ARRAY_BUFFER,null),this.regrow()}get clumpCount(){let e=0;for(const t of this.chunks.values())for(const i of t.clumps)e+=i.count;return e}regrow(){if(this.sample){this.stale.clear();for(const e of this.chunks.values())this.dropChunk(e);this.chunks.clear(),this.firstFrame=!0}}clear(){for(const e of this.chunks.values())this.dropChunk(e);this.chunks.clear(),this.stale.clear(),this.sample=null,this.clumpSample=null,this.active.clear()}dropChunk(e){e.vao&&this.gl.deleteVertexArray(e.vao),e.buffer&&this.gl.deleteBuffer(e.buffer);for(const t of e.clumps)this.gl.deleteVertexArray(t.vao),this.gl.deleteBuffer(t.buffer)}chunkDistance(e,t,i){const o=Math.min(this.width,e+ae),a=Math.min(this.height,t+ae);return Math.hypot(Math.max(e-i[0],0,i[0]-o),Math.max(t-i[2],0,i[2]-a))}stream(e){if(!this.sample)return;const t=this.settings.distance,i=Math.ceil(this.width/ae),o=Math.ceil(this.height/ae),a=Math.max(0,Math.floor((e[0]-t)/ae)),s=Math.max(0,Math.floor((e[2]-t)/ae)),n=Math.min(i-1,Math.floor((e[0]+t)/ae)),u=Math.min(o-1,Math.floor((e[2]+t)/ae)),l=[];for(let h=s;h<=u;h++)for(let v=a;v<=n;v++){if(this.chunks.has(h*65536+v))continue;const p=this.chunkDistance(v*ae,h*ae,e);p<=t&&l.push({cx:v,cz:h,d:p})}l.sort((h,v)=>h.d-v.d);const c=this.firstFrame;this.firstFrame=!1;const f=performance.now();if(this.stale.size){const h=[...this.stale].map(v=>({key:v,cx:v%65536,cz:Math.floor(v/65536)}));h.sort((v,p)=>this.chunkDistance(v.cx*ae,v.cz*ae,e)-this.chunkDistance(p.cx*ae,p.cz*ae,e));for(let v=0;v<h.length&&!(v>0&&performance.now()-f>=Pi);v++)this.stale.delete(h[v].key),this.chunks.has(h[v].key)&&this.buildChunk(h[v].cx,h[v].cz)}for(let h=0;h<l.length&&!((h>0||this.stale.size)&&!c&&performance.now()-f>=Pi);h++)this.buildChunk(l[h].cx,l[h].cz);for(const[h,v]of this.chunks)this.chunkDistance(v.x0,v.z0,e)>t*1.6&&(this.dropChunk(v),this.chunks.delete(h))}buildChunk(e,t){const i=t*65536+e,o=this.chunks.get(i);o&&(this.dropChunk(o),this.chunks.delete(i));const a=this.sample,s=Math.max(0,Math.round(this.settings.density)),n=e*ae,u=t*ae,l=Math.min(this.width,n+ae),c=Math.min(this.height,u+ae),f=new Float32Array(s*(l-n)*(c-u)*Ft);let h=0,v=1/0,p=-1/0;for(let S=0;S<s;S++)for(let C=u;C<c;C++)for(let A=n;A<l;A++){const R=A+Je(A,C,S*3+this.seed),_=C+Je(A,C,S*3+1+this.seed),k=a(R,_);k&&(f[h++]=R,f[h++]=k.y,f[h++]=_,f[h++]=Je(A,C,S*3+2+this.seed)*Math.PI,f[h++]=(k.height??1)*(.7+.6*Je(C,A,S+9)),f[h++]=k.color[0],f[h++]=k.color[1],f[h++]=k.color[2],v=Math.min(v,k.y),p=Math.max(p,k.y))}const x=h/Ft,w=this.growClumps(n,u,l,c);for(const S of w.ys)v=Math.min(v,S),p=Math.max(p,S);if(!x){this.chunks.set(i,{x0:n,z0:u,vao:null,buffer:null,count:0,minY:w.batches.length?v:0,maxY:w.batches.length?p:0,clumps:w.batches});return}const m=this.gl,g=m.createVertexArray(),E=m.createBuffer();m.bindVertexArray(g),m.bindBuffer(m.ARRAY_BUFFER,this.bladeBuffer),m.enableVertexAttribArray(0),m.vertexAttribPointer(0,2,m.FLOAT,!1,8,0),m.bindBuffer(m.ARRAY_BUFFER,E),m.bufferData(m.ARRAY_BUFFER,f.subarray(0,h),m.STATIC_DRAW),m.enableVertexAttribArray(1),m.vertexAttribPointer(1,4,m.FLOAT,!1,Ft*4,0),m.vertexAttribDivisor(1,1),m.enableVertexAttribArray(2),m.vertexAttribPointer(2,4,m.FLOAT,!1,Ft*4,16),m.vertexAttribDivisor(2,1),m.bindVertexArray(null),this.chunks.set(i,{x0:n,z0:u,vao:g,buffer:E,count:x,minY:v,maxY:p,clumps:w.batches})}growClumps(e,t,i,o){const a=this.clumpSample;if(!a||!this.kinds.length||!this.clumpPer)return{batches:[],ys:[]};const s=this.kinds.map(()=>[]),n=[];for(let c=0;c<this.clumpPer;c++)for(let f=t;f<o;f++)for(let h=e;h<i;h++){const v=h+Je(h,f,c*5+101+this.seed),p=f+Je(h,f,c*5+102+this.seed),x=a(v,p);if(!x||!this.kinds[x.kind])continue;const w=x.tint??[1,1,1],m=this.kinds[x.kind].kind.color;s[x.kind].push(v,x.y,p,Je(h,f,c*5+103+this.seed)*Math.PI*2,(x.size??1)*(.8+.4*Je(f,h,c+77)),w[0]*m[0],w[1]*m[1],w[2]*m[2]),n.push(x.y+this.kinds[x.kind].tall*(x.size??1)*1.2),n.push(x.y)}const u=this.gl,l=[];return s.forEach((c,f)=>{if(!c.length)return;const h=this.kinds[f],v=u.createVertexArray(),p=u.createBuffer();u.bindVertexArray(v),u.bindBuffer(u.ARRAY_BUFFER,h.vbo);const x=Ui*4;[[0,3,0],[1,3,3],[2,3,6],[3,2,9]].forEach(([w,m,g])=>{u.enableVertexAttribArray(w),u.vertexAttribPointer(w,m,u.FLOAT,!1,x,g*4)}),u.bindBuffer(u.ELEMENT_ARRAY_BUFFER,h.ibo),u.bindBuffer(u.ARRAY_BUFFER,p),u.bufferData(u.ARRAY_BUFFER,new Float32Array(c),u.STATIC_DRAW),u.enableVertexAttribArray(4),u.vertexAttribPointer(4,4,u.FLOAT,!1,qt*4,0),u.vertexAttribDivisor(4,1),u.enableVertexAttribArray(5),u.vertexAttribPointer(5,4,u.FLOAT,!1,qt*4,16),u.vertexAttribDivisor(5,1),u.bindVertexArray(null),l.push({kind:f,vao:v,buffer:p,count:c.length/qt})}),{batches:l,ys:n}}resizeTrample(e,t){this.tw=Math.max(1,e),this.th=Math.max(1,t);const i=this.tw*this.th;this.flat=new Float32Array(i),this.pushX=new Float32Array(i),this.pushZ=new Float32Array(i),this.rustle=new Float32Array(i),this.bytes=new Uint8Array(i*4);for(let a=0;a<i;a++)this.bytes[a*4+1]=128,this.bytes[a*4+2]=128;const o=this.gl;o.activeTexture(o.TEXTURE13),o.bindTexture(o.TEXTURE_2D,this.trample),o.pixelStorei(o.UNPACK_ALIGNMENT,1),o.texImage2D(o.TEXTURE_2D,0,o.RGBA8,this.tw,this.th,0,o.RGBA,o.UNSIGNED_BYTE,this.bytes),o.pixelStorei(o.UNPACK_ALIGNMENT,4),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MIN_FILTER,o.LINEAR),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MAG_FILTER,o.LINEAR),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_S,o.CLAMP_TO_EDGE),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_T,o.CLAMP_TO_EDGE),o.bindTexture(o.TEXTURE_2D,null),this.active.clear(),this.dirty=null}touch(e){const t=e%this.tw,i=Math.floor(e/this.tw),o=this.dirty;this.dirty=o?[Math.min(o[0],t),Math.min(o[1],i),Math.max(o[2],t),Math.max(o[3],i)]:[t,i,t,i]}press(e,t,i,o=1,a=0,s=0){if(!this.settings.interaction||!this.sample)return;const n=Math.max(.75,i*this.res),u=e*this.res,l=t*this.res,c=Math.hypot(a,s);for(let f=Math.max(0,Math.floor(l-n));f<=Math.min(this.th-1,Math.ceil(l+n));f++)for(let h=Math.max(0,Math.floor(u-n));h<=Math.min(this.tw-1,Math.ceil(u+n));h++){const v=h+.5-u,p=f+.5-l,x=Math.hypot(v,p);if(x>n)continue;const w=o*(1-x/n*(x/n)),m=f*this.tw+h;let g=x>.001?v/x:0,E=x>.001?p/x:0;c>1e-4&&(g=g*.4+a/c*.6,E=E*.4+s/c*.6),w>=this.flat[m]&&(this.pushX[m]=g,this.pushZ[m]=E),this.flat[m]=Math.max(this.flat[m],w),this.rustle[m]=Math.max(this.rustle[m],Math.min(1,w*1.5)),this.active.add(m),this.touch(m)}}update(e){if(this.active.size){const n=e/Math.max(.05,this.settings.recover),u=e/.8;for(const l of this.active)this.flat[l]=Math.max(0,this.flat[l]-n*(.4+(1-this.flat[l])*1.2)),this.rustle[l]=Math.max(0,this.rustle[l]-u),this.flat[l]<=0&&this.rustle[l]<=0&&this.active.delete(l),this.touch(l)}const t=this.dirty;if(!t)return;this.dirty=null;const i=t[2]-t[0]+1,o=t[3]-t[1]+1,a=new Uint8Array(i*o*4);for(let n=0;n<o;n++)for(let u=0;u<i;u++){const l=(t[1]+n)*this.tw+t[0]+u,c=(n*i+u)*4;a[c]=Math.round(this.flat[l]*255),a[c+1]=Math.round((this.pushX[l]*.5+.5)*255),a[c+2]=Math.round((this.pushZ[l]*.5+.5)*255),a[c+3]=Math.round(this.rustle[l]*255)}const s=this.gl;s.activeTexture(s.TEXTURE13),s.bindTexture(s.TEXTURE_2D,this.trample),s.pixelStorei(s.UNPACK_ALIGNMENT,1),s.texSubImage2D(s.TEXTURE_2D,0,t[0],t[1],i,o,s.RGBA,s.UNSIGNED_BYTE,a),s.pixelStorei(s.UNPACK_ALIGNMENT,4),s.bindTexture(s.TEXTURE_2D,null)}draw(e){const t=this.settings;if(!t.enabled||!this.sample)return 0;this.stream(e.focus);const i=this.gl,o=this.program;o.use(),o.setMat4("uProjection",e.projection),o.setMat4("uView",e.view),o.setVec3("uEye",...e.eye),o.setVec3("uFocus",...e.focus),o.setFloat("uTime",e.time),o.setFloat("uHeight",t.height),o.setFloat("uWidth",t.width);const a=t.windDirection*Math.PI/180;i.uniform4f(o.uniform("uWind"),Math.cos(a),Math.sin(a),t.wind?t.windStrength:0,t.gustSpeed),o.setFloat("uGustSize",t.gustSize),i.activeTexture(i.TEXTURE13),i.bindTexture(i.TEXTURE_2D,this.trample),i.uniform1i(o.uniform("uTrample"),13),i.uniform2f(o.uniform("uMapSize"),this.width,this.height),o.setFloat("uTrampleOn",t.interaction?1:0),o.setFloat("uFar",t.distance),o.setVec3("uRootColor",...t.rootColor),o.setVec3("uTipColor",...t.tipColor),o.setFloat("uColorMix",t.colorMix);const s=Math.hypot(...e.sunDir)||1;o.setVec3("uSunDir",e.sunDir[0]/s,e.sunDir[1]/s,e.sunDir[2]/s),o.setVec3("uSunColor",...e.sunColor),o.setFloat("uSunIntensity",e.sunIntensity),o.setVec3("uSkyColor",...e.skyColor),o.setVec3("uGroundColor",...e.groundColor),o.setFloat("uAmbient",e.ambient),o.setVec3("uFogColor",...e.fogColor),i.uniform2f(o.uniform("uFogRange"),e.fogRange[0],e.fogRange[1]),o.setFloat("uExposure",e.exposure),o.setFloat("uToneMap",e.toneMap?1:0),i.uniform1i(o.uniform("uShadow0"),1),i.uniform1i(o.uniform("uShadow1"),7),i.uniform1i(o.uniform("uShadow2"),8);const n=new Float32Array(48);e.lightViewProj.slice(0,3).forEach((f,h)=>n.set(f,h*16)),i.uniformMatrix4fv(o.uniform("uLightVP"),!1,n),i.uniform1i(o.uniform("uCascades"),e.lightViewProj.length),o.setFloat("uShadowStrength",e.shadowStrength),i.disable(i.CULL_FACE);const u=ve(e.projection,e.view);let l=0;const c=t.distance*.3;for(const f of this.chunks.values()){if(!f.vao)continue;const h=Math.min(this.width,f.x0+ae),v=Math.min(this.height,f.z0+ae),p=this.chunkDistance(f.x0,f.z0,e.focus);if(p>t.distance||ki(u,f.x0,f.minY,f.z0,h,f.maxY+t.height*2,v))continue;const x=Math.max(.12,Math.min(1,1-(p-c)/(t.distance-c))),w=Math.min(f.count,Math.ceil(f.count*Math.min(1,x+.08)));o.setFloat("uKeep",x),o.setFloat("uCount",f.count),i.bindVertexArray(f.vao),i.drawArraysInstanced(i.TRIANGLE_STRIP,0,Er,w),l++}return i.bindVertexArray(null),t.clumps&&this.kinds.length&&(l+=this.drawClumps(e,u)),i.enable(i.CULL_FACE),l}drawClumps(e,t){const i=this.settings,o=this.gl,a=this.clumpProgram;a.use(),a.setMat4("uProjection",e.projection),a.setMat4("uView",e.view),a.setVec3("uEye",...e.eye),a.setVec3("uFocus",...e.focus),a.setFloat("uTime",e.time);const s=i.windDirection*Math.PI/180;o.uniform4f(a.uniform("uWind"),Math.cos(s),Math.sin(s),i.wind?i.windStrength:0,i.gustSpeed),a.setFloat("uGustSize",i.gustSize),o.uniform1i(a.uniform("uTrample"),13),o.uniform2f(a.uniform("uMapSize"),this.width,this.height),a.setFloat("uTrampleOn",i.interaction?1:0),a.setFloat("uFar",i.distance),a.setVec3("uRootColor",...i.rootColor),a.setVec3("uTipColor",...i.tipColor),a.setFloat("uColorMix",0);const n=Math.hypot(...e.sunDir)||1;a.setVec3("uSunDir",e.sunDir[0]/n,e.sunDir[1]/n,e.sunDir[2]/n),a.setVec3("uSunColor",...e.sunColor),a.setFloat("uSunIntensity",e.sunIntensity),a.setVec3("uSkyColor",...e.skyColor),a.setVec3("uGroundColor",...e.groundColor),a.setFloat("uAmbient",e.ambient),a.setVec3("uFogColor",...e.fogColor),o.uniform2f(a.uniform("uFogRange"),e.fogRange[0],e.fogRange[1]),a.setFloat("uExposure",e.exposure),a.setFloat("uToneMap",e.toneMap?1:0),o.uniform1i(a.uniform("uShadow0"),1),o.uniform1i(a.uniform("uShadow1"),7),o.uniform1i(a.uniform("uShadow2"),8);const u=new Float32Array(48);e.lightViewProj.slice(0,3).forEach((f,h)=>u.set(f,h*16)),o.uniformMatrix4fv(a.uniform("uLightVP"),!1,u),o.uniform1i(a.uniform("uCascades"),e.lightViewProj.length),a.setFloat("uShadowStrength",e.shadowStrength),o.uniform1i(a.uniform("uAlbedo"),14);let l=0;const c=i.distance*.3;for(let f=0;f<this.kinds.length;f++){const h=this.kinds[f];a.setFloat("uTall",h.tall),a.setFloat("uCutoff",h.kind.cutoff),a.setFloat("uHasTex",h.kind.albedo?1:0),h.kind.albedo&&h.kind.albedo.bind(14);for(const v of this.chunks.values()){const p=v.clumps.find(m=>m.kind===f);if(!p)continue;const x=this.chunkDistance(v.x0,v.z0,e.focus);if(x>i.distance||ki(t,v.x0,v.minY,v.z0,Math.min(this.width,v.x0+ae),v.maxY,Math.min(this.height,v.z0+ae)))continue;const w=Math.max(.12,Math.min(1,1-(x-c)/(i.distance-c)));a.setFloat("uKeep",w),a.setFloat("uCount",p.count),o.bindVertexArray(p.vao),o.drawElementsInstanced(o.TRIANGLES,h.indices,o.UNSIGNED_INT,0,Math.min(p.count,Math.ceil(p.count*Math.min(1,w+.08)))),l++}}return o.bindVertexArray(null),l}dispose(){this.clear(),this.setClumpKinds([]),this.gl.deleteBuffer(this.bladeBuffer),this.gl.deleteTexture(this.trample)}}function ki(r,e,t,i,o,a,s){const n=[0,0,0,0,0,0];for(let u=0;u<8;u++){const l=u&1?o:e,c=u&2?a:t,f=u&4?s:i,h=r[0]*l+r[4]*c+r[8]*f+r[12],v=r[1]*l+r[5]*c+r[9]*f+r[13],p=r[2]*l+r[6]*c+r[10]*f+r[14],x=r[3]*l+r[7]*c+r[11]*f+r[15];h<-x&&n[0]++,h>x&&n[1]++,v<-x&&n[2]++,v>x&&n[3]++,p<-x&&n[4]++,p>x&&n[5]++}return n.some(u=>u===8)}class Sr{constructor(e){d(this,"enabled",!1);d(this,"ms",new Map);d(this,"ext");d(this,"pool",[]);d(this,"pending",[]);d(this,"current",null);d(this,"frame",0);d(this,"gathered",new Map);this.gl=e,this.ext=e.getExtension("EXT_disjoint_timer_query_webgl2")}get supported(){return!!this.ext}get total(){let e=0;for(const t of this.ms.values())e+=t;return e}startFrame(){this.frame++,this.ext&&this.poll()}begin(e){if(!this.enabled||!this.ext)return;this.end();const t=this.gl,i=this.pool.pop()??t.createQuery();i&&(t.beginQuery(this.ext.TIME_ELAPSED_EXT,i),this.current={q:i,name:e,frame:this.frame})}end(){!this.current||!this.ext||(this.gl.endQuery(this.ext.TIME_ELAPSED_EXT),this.pending.push(this.current),this.current=null)}poll(){const e=this.gl,t=e.getParameter(this.ext.GPU_DISJOINT_EXT);for(;this.pending.length&&e.getQueryParameter(this.pending[0].q,e.QUERY_RESULT_AVAILABLE);){const o=this.pending.shift(),a=e.getQueryParameter(o.q,e.QUERY_RESULT);if(this.pool.push(o.q),t)continue;let s=this.gathered.get(o.frame);s||this.gathered.set(o.frame,s=new Map),s.set(o.name,(s.get(o.name)??0)+a/1e6)}const i=this.pending.length?this.pending[0].frame:this.current?this.current.frame:this.frame;for(const[o,a]of[...this.gathered].sort((s,n)=>s[0]-n[0])){if(o>=i)break;this.gathered.delete(o);for(const[s,n]of a)this.ms.set(s,this.ms.has(s)?this.ms.get(s)*.85+n*.15:n);for(const[s,n]of this.ms){if(a.has(s))continue;const u=n*.85;u<.005?this.ms.delete(s):this.ms.set(s,u)}}}reset(){this.end(),this.ms.clear(),this.gathered.clear()}}const We=20,_t={none:0,down:1,up:2,"ease-out":3,"ease-in":4,peak:5,"soft-down":6},Dr={square:0,disc:1,spark:2,smoke:3},Cr=`#version 300 es
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
}`,Pr=`#version 300 es
precision highp float;
void main() {}`,zi=`#version 300 es
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
}`,Ur=`#version 300 es
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
}`,kr=`#version 300 es
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
}`,Kt=[[0,3,0],[1,3,3],[2,4,6],[3,3,10],[4,3,13],[5,4,16]];class zr{constructor(e,t=2e4){d(this,"settings",{enabled:!0,softness:.4,depthAlpha:.55});d(this,"capacity");d(this,"spawned",0);d(this,"buffers");d(this,"updateVaos");d(this,"drawVaos");d(this,"feedback");d(this,"updateProgram");d(this,"drawProgram");d(this,"depthProgram");d(this,"current",0);d(this,"cursor",0);d(this,"staging");d(this,"pending",0);d(this,"cornerBuffer");d(this,"spawnBuffer");d(this,"spawnVao");d(this,"clock",0);d(this,"frameLife",0);d(this,"frameCount",0);d(this,"spans",[]);d(this,"ranges",[]);d(this,"dirty",[]);this.gl=e,this.capacity=t,this.staging=new Float32Array(t*We);const i=e.createBuffer(),o=e.createBuffer(),a=e.createTransformFeedback();if(!i||!o||!a)throw new Error("particle buffers failed");this.buffers=[i,o],this.feedback=a;const s=e.createBuffer(),n=e.createBuffer();if(!s||!n)throw new Error("particle corner buffer failed");this.cornerBuffer=s,this.spawnBuffer=n,e.bindBuffer(e.ARRAY_BUFFER,s),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW);for(const u of this.buffers)e.bindBuffer(e.ARRAY_BUFFER,u),e.bufferData(e.ARRAY_BUFFER,this.staging.byteLength,e.DYNAMIC_COPY);e.bindBuffer(e.ARRAY_BUFFER,null),this.updateProgram=new q(e,Cr,Pr,["vPos","vVel","vLife","vColor","vColorTo","vParams"]),this.drawProgram=new q(e,zi,Ur),this.depthProgram=new q(e,zi,kr),this.updateVaos=[this.layout(i,0),this.layout(o,0)],this.drawVaos=[this.layout(i,1),this.layout(o,1)],this.spawnVao=this.layout(n,0)}layout(e,t){const i=this.gl,o=i.createVertexArray();if(!o)throw new Error("particle vao failed");i.bindVertexArray(o),i.bindBuffer(i.ARRAY_BUFFER,e);const a=We*4;for(const[s,n,u]of Kt)i.enableVertexAttribArray(s),i.vertexAttribPointer(s,n,i.FLOAT,!1,a,u*4),i.vertexAttribDivisor(s,t);return t===1&&(i.bindBuffer(i.ARRAY_BUFFER,this.cornerBuffer),i.enableVertexAttribArray(6),i.vertexAttribPointer(6,2,i.FLOAT,!1,0,0),i.vertexAttribDivisor(6,0)),i.bindVertexArray(null),i.bindBuffer(i.ARRAY_BUFFER,null),o}emit(e,t,i,o){this.frameLife=Math.max(this.frameLife,o.life*1.2+.05),this.frameCount+=o.count;const a=_t[o.fadeCurve??"none"]+_t[o.sizeCurve??"soft-down"]*8+_t[o.speedCurve??"none"]*64+_t[o.colorCurve??(o.colorTo?"up":"none")]*512,s=Dr[o.shape??"square"]*4096+Math.min(4095,Math.max(0,o.stretch??0));for(let n=0;n<o.count;n++){const u=this.cursor;this.cursor=(this.cursor+1)%this.capacity;const l=u*We,c=this.staging,f=Math.random()*Math.PI*2,h=(Math.random()-.5)*Math.PI,v=o.vary,p=o.speed*(v===void 0?.4+Math.random()*.8:1-v+Math.random()*2*v);let x,w,m;if(o.dir){const E=(o.cone??.3)*p;x=o.dir[0]*p+(Math.random()-.5)*2*E,w=o.dir[1]*p+(Math.random()-.5)*2*E,m=o.dir[2]*p+(Math.random()-.5)*2*E}else x=Math.cos(f)*Math.cos(h)*p,w=Math.sin(h)*p,m=Math.sin(f)*Math.cos(h)*p;w+=o.up??0;const g=o.life*(v===void 0?.6+Math.random()*.6:1-v+Math.random()*2*v);c[l]=e,c[l+1]=t,c[l+2]=i,c[l+3]=x,c[l+4]=w,c[l+5]=m,c[l+6]=g,c[l+7]=g,c[l+8]=o.size,c[l+9]=o.alpha??1,c[l+10]=o.color[0],c[l+11]=o.color[1],c[l+12]=o.color[2],c[l+13]=(o.colorTo??o.color)[0],c[l+14]=(o.colorTo??o.color)[1],c[l+15]=(o.colorTo??o.color)[2],c[l+16]=a,c[l+17]=o.gravity??0,c[l+18]=o.drag??0,c[l+19]=s,this.dirty.push(u)}this.pending+=o.count}update(e){const t=this.gl;this.buffers[this.current];const i=this.buffers[1-this.current],o=We*4,a=[];if(this.dirty.length){const l=this.dirty;for(let c=0;c<l.length;){let f=c+1;for(;f<l.length&&l[f]===l[f-1]+1;)f++;a.push([l[c],f-c]),c=f}this.spawned=this.dirty.length,this.dirty.length=0}else this.spawned=0;this.pending=0;const s=Math.min(e,.1);for(this.clock+=s,this.frameCount&&(this.spans.push({end:this.cursor,dies:this.clock+this.frameLife,count:this.frameCount}),this.frameCount=0,this.frameLife=0);this.spans.length&&this.spans[0].dies<=this.clock;)this.spans.shift();let n=0;for(const l of this.spans)n+=l.count;if(n=Math.min(n,this.capacity),this.ranges.length=0,!n)return;const u=(this.cursor-n+this.capacity)%this.capacity;u+n<=this.capacity?this.ranges.push([u,n]):this.ranges.push([u,this.capacity-u],[0,n-(this.capacity-u)]),this.updateProgram.use(),this.updateProgram.setFloat("uDt",s),t.enable(t.RASTERIZER_DISCARD),t.bindVertexArray(this.updateVaos[this.current]),t.bindTransformFeedback(t.TRANSFORM_FEEDBACK,this.feedback);for(const[l,c]of this.ranges)t.bindBufferRange(t.TRANSFORM_FEEDBACK_BUFFER,0,i,l*o,c*o),t.beginTransformFeedback(t.POINTS),t.drawArrays(t.POINTS,l,c),t.endTransformFeedback();if(a.length){this.updateProgram.setFloat("uDt",0),t.bindVertexArray(this.spawnVao);for(const[l,c]of a)t.bindBuffer(t.ARRAY_BUFFER,this.spawnBuffer),t.bufferData(t.ARRAY_BUFFER,this.staging.subarray(l*We,(l+c)*We),t.STREAM_DRAW),t.bindBuffer(t.ARRAY_BUFFER,null),t.bindBufferRange(t.TRANSFORM_FEEDBACK_BUFFER,0,i,l*o,c*o),t.beginTransformFeedback(t.POINTS),t.drawArrays(t.POINTS,0,c),t.endTransformFeedback()}t.bindBufferBase(t.TRANSFORM_FEEDBACK_BUFFER,0,null),t.bindTransformFeedback(t.TRANSFORM_FEEDBACK,null),t.bindVertexArray(null),t.disable(t.RASTERIZER_DISCARD),this.current=1-this.current}get live(){let e=0;for(const t of this.ranges)e+=t[1];return e}draw(e){if(!this.settings.enabled||!this.ranges.length)return;const t=this.gl,i=this.drawProgram;i.use(),i.setMat4("uProjection",e.projection),i.setMat4("uView",e.view),i.setVec3("uRight",...e.right),i.setVec3("uUp",...e.up),e.depth&&(t.activeTexture(t.TEXTURE0+10),t.bindTexture(t.TEXTURE_2D,e.depth)),t.uniform1i(i.uniform("uDepth"),10),i.setFloat("uHasDepth",e.depth&&this.settings.softness>0?1:0),t.uniform2f(i.uniform("uResolution"),e.width,e.height),i.setMat4("uInvProjection",e.invProjection),i.setFloat("uSoftness",Math.max(.01,this.settings.softness)),i.setFloat("uExposure",e.exposure),i.setFloat("uToneMap",e.toneMap?1:0),t.enable(t.BLEND),t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ZERO,t.ONE),t.depthMask(!1),t.disable(t.CULL_FACE),t.bindVertexArray(this.drawVaos[this.current]),t.bindBuffer(t.ARRAY_BUFFER,this.buffers[this.current]);const o=We*4;for(const[a,s]of this.ranges){for(const[n,u,l]of Kt)t.vertexAttribPointer(n,u,t.FLOAT,!1,o,(a*We+l)*4);t.drawArraysInstanced(t.TRIANGLE_STRIP,0,4,s)}if(t.disable(t.BLEND),this.settings.depthAlpha>0){const a=this.depthProgram;a.use(),a.setMat4("uProjection",e.projection),a.setMat4("uView",e.view),a.setVec3("uRight",...e.right),a.setVec3("uUp",...e.up),a.setFloat("uDepthAlpha",this.settings.depthAlpha),t.colorMask(!1,!1,!1,!1),t.depthMask(!0);for(const[s,n]of this.ranges){for(const[u,l,c]of Kt)t.vertexAttribPointer(u,l,t.FLOAT,!1,o,(s*We+c)*4);t.drawArraysInstanced(t.TRIANGLE_STRIP,0,4,n)}t.colorMask(!0,!0,!0,!0)}t.bindBuffer(t.ARRAY_BUFFER,null),t.bindVertexArray(null),t.enable(t.CULL_FACE),t.depthMask(!0)}}const nt=11,Lr=`#version 300 es
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
}`,Ir=`#version 300 es
precision highp float;
in vec2 vUV;
in vec4 vColor;
uniform sampler2D uAtlas;
out vec4 outColor;
void main() {
  vec4 t = texture(uAtlas, vUV);
  outColor = vec4(t.rgb * vColor.rgb, t.a * vColor.a);
}`;class Br{constructor(e){d(this,"enabled",!0);d(this,"list",[]);d(this,"program");d(this,"vao");d(this,"cornerBuffer");d(this,"instanceBuffer");d(this,"data",new Float32Array(nt*256));d(this,"atlas",null);d(this,"grid",[1,1]);this.gl=e,this.program=new q(e,Lr,Ir);const t=e.createBuffer(),i=e.createBuffer(),o=e.createVertexArray();if(!t||!i||!o)throw new Error("icon buffers failed");this.cornerBuffer=t,this.instanceBuffer=i,this.vao=o,e.bindVertexArray(o),e.bindBuffer(e.ARRAY_BUFFER,t),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.bindBuffer(e.ARRAY_BUFFER,i);const a=nt*4,s=[[1,3,0],[2,1,3],[3,3,4],[4,1,7],[5,1,8],[6,2,9]];for(const[n,u,l]of s)e.enableVertexAttribArray(n),e.vertexAttribPointer(n,u,e.FLOAT,!1,a,l*4),e.vertexAttribDivisor(n,1);e.bindVertexArray(null),e.bindBuffer(e.ARRAY_BUFFER,null)}setAtlas(e,t,i){const o=this.gl;this.atlas||(this.atlas=o.createTexture()),o.bindTexture(o.TEXTURE_2D,this.atlas),o.pixelStorei(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),o.texImage2D(o.TEXTURE_2D,0,o.RGBA8,o.RGBA,o.UNSIGNED_BYTE,e),o.generateMipmap(o.TEXTURE_2D),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MIN_FILTER,o.LINEAR_MIPMAP_LINEAR),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MAG_FILTER,o.LINEAR),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_S,o.CLAMP_TO_EDGE),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_T,o.CLAMP_TO_EDGE),o.bindTexture(o.TEXTURE_2D,null),this.grid=[Math.max(1,t),Math.max(1,i)]}get ready(){return!!this.atlas}clear(){this.list.length=0}add(e){this.list.push(e)}get count(){return this.list.length}pack(){const e=this.list.length;this.data.length<e*nt&&(this.data=new Float32Array(Math.max(e,this.data.length/nt*2)*nt));const t=this.data;for(let i=0;i<e;i++){const o=this.list[i],a=i*nt;t[a]=o.x,t[a+1]=o.y,t[a+2]=o.z,t[a+3]=o.glyph,t[a+4]=o.r,t[a+5]=o.g,t[a+6]=o.b,t[a+7]=o.size,t[a+8]=o.alpha,t[a+9]=o.dx??0,t[a+10]=o.dy??0}return e}draw(e,t,i){if(!this.enabled||!this.atlas||!this.list.length)return 0;const o=this.gl,a=this.pack();o.bindBuffer(o.ARRAY_BUFFER,this.instanceBuffer),o.bufferData(o.ARRAY_BUFFER,this.data.subarray(0,a*nt),o.STREAM_DRAW),o.bindBuffer(o.ARRAY_BUFFER,null);const s=this.program;return s.use(),s.setMat4("uViewProj",e),o.uniform2f(s.uniform("uViewport"),t,i),o.uniform2f(s.uniform("uGrid"),this.grid[0],this.grid[1]),o.activeTexture(o.TEXTURE0),o.bindTexture(o.TEXTURE_2D,this.atlas),o.uniform1i(s.uniform("uAtlas"),0),o.enable(o.BLEND),o.blendFuncSeparate(o.SRC_ALPHA,o.ONE_MINUS_SRC_ALPHA,o.ZERO,o.ONE),o.disable(o.DEPTH_TEST),o.depthMask(!1),o.disable(o.CULL_FACE),o.bindVertexArray(this.vao),o.drawArraysInstanced(o.TRIANGLE_STRIP,0,4,a),o.bindVertexArray(null),o.enable(o.CULL_FACE),o.depthMask(!0),o.enable(o.DEPTH_TEST),o.disable(o.BLEND),1}dispose(){const e=this.gl;e.deleteBuffer(this.cornerBuffer),e.deleteBuffer(this.instanceBuffer),e.deleteVertexArray(this.vao),this.atlas&&e.deleteTexture(this.atlas),this.atlas=null}}function ft(r,e,t,i){return`${t} Generate${r}Noise(${e} coordinate, float frequency, int octaveCount, float persistence, float lacunarity) {
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
}`}function Li(r){return`vec2 Generate${r}CurlNoise(vec2 coordinate, float frequency, int octaveCount, float persistence, float lacunarity) {
  vec2 total = vec2(0.0);
  float amplitude = 1.0;
  float totalAmplitude = 0.0;
  for (int octaveIndex = 0; octaveIndex < 16; octaveIndex++) {
    if (octaveIndex >= octaveCount) break;
    total += Generate${r}Noise2D(coordinate * frequency).yz * amplitude;
    totalAmplitude += amplitude;
    amplitude *= persistence;
    frequency *= lacunarity;
  }
  return vec2(total.y, -total.x) / totalAmplitude;
}`}function Ii(r){return`vec3 Generate${r}CurlNoise(vec3 coordinate, float frequency, int octaveCount, float persistence, float lacunarity) {
  vec2 total0 = vec2(0.0), total1 = vec2(0.0), total2 = vec2(0.0);
  float amplitude = 1.0;
  float totalAmplitude = 0.0;
  vec2 p0 = coordinate.zy, p1 = coordinate.xz + 100.0, p2 = coordinate.yx + 200.0;
  for (int octaveIndex = 0; octaveIndex < 16; octaveIndex++) {
    if (octaveIndex >= octaveCount) break;
    total0 += Generate${r}Noise2D(p0 * frequency).yz * amplitude;
    total1 += Generate${r}Noise2D(p1 * frequency).yz * amplitude;
    total2 += Generate${r}Noise2D(p2 * frequency).yz * amplitude;
    totalAmplitude += amplitude;
    amplitude *= persistence;
    frequency *= lacunarity;
  }
  return vec3(total2.x - total1.y, total0.x - total2.y, total1.x - total0.y) / totalAmplitude;
}`}const Zt=`
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
${Li("Value")}
${Li("Perlin")}
${Ii("Value")}
${Ii("Perlin")}
`,at=128;function bo(r,e,t,i){let o;i?(o=i,o.length=r.length,o.fill(void 0)):o=new Array(r.length);const a=l=>(o[l]===void 0&&(o[l]=u(l)),o[l]),s=l=>a(l.args[0]),n=l=>a(l.args[1]);function u(l){var f;const c=r[l];switch(c.op){case"Value":return(f=e.overrides)!=null&&f.has(l)?e.overrides.get(l):c.value;case"Combine2f":case"Combine3f":case"Combine4f":return c.args.map(a);case"ExtractComponent":return s(c)[c.component];case"DeltaTime":return e.deltaTime;case"TotalTime":return e.time;case"SystemSeed":return e.seed>>>0;case"FrameIndex":return e.frame;case"LocalToWorld":case"WorldToLocal":return Vr;case"Sin":return me(s(c),Math.sin);case"Cos":return me(s(c),Math.cos);case"Tan":return me(s(c),Math.tan);case"ASin":return me(s(c),Math.asin);case"ACos":return me(s(c),Math.acos);case"ATan":return me(s(c),Math.atan);case"Abs":return me(s(c),Math.abs);case"Sign":return me(s(c),Math.sign);case"Saturate":return me(s(c),h=>Math.min(1,Math.max(0,h)));case"Ceil":return me(s(c),Math.ceil);case"Round":return me(s(c),Math.round);case"Frac":return me(s(c),h=>h-Math.floor(h));case"Floor":return me(s(c),Math.floor);case"Log2":return me(s(c),Math.log2);case"Mul":return De(s(c),n(c),(h,v)=>h*v);case"Divide":return De(s(c),n(c),(h,v)=>h/v);case"Add":return De(s(c),n(c),(h,v)=>h+v);case"Subtract":return De(s(c),n(c),(h,v)=>h-v);case"Min":return De(s(c),n(c),Math.min);case"Max":return De(s(c),n(c),Math.max);case"Pow":return De(s(c),n(c),Math.pow);case"ATan2":return De(s(c),n(c),Math.atan2);case"BitwiseLeftShift":return De(s(c),n(c),(h,v)=>h<<v>>>0);case"BitwiseRightShift":return De(s(c),n(c),(h,v)=>h>>>v);case"BitwiseOr":return De(s(c),n(c),(h,v)=>(h|v)>>>0);case"BitwiseAnd":return De(s(c),n(c),(h,v)=>(h&v)>>>0);case"BitwiseXor":return De(s(c),n(c),(h,v)=>(h^v)>>>0);case"BitwiseComplement":return me(s(c),h=>~h>>>0);case"CastUintToFloat":case"CastIntToFloat":return s(c);case"CastFloatToUint":return me(s(c),h=>Math.max(0,Math.trunc(h))>>>0);case"CastIntToUint":return me(s(c),h=>h>>>0);case"CastFloatToInt":return me(s(c),Math.trunc);case"CastUintToInt":return me(s(c),h=>h|0);case"TransposeMatrix":return Nr(s(c));case"InverseMatrix":case"InverseTRSMatrix":return Xr(s(c));case"TRSToMatrix":return $r(a(c.args[0]),a(c.args[1]),a(c.args[2]));case"TransformPos":return Bi(s(c),n(c),1);case"TransformVec":case"TransformDir":{const h=Bi(s(c),n(c),0);return c.op==="TransformDir"?Or(h):h}case"BakeCurve":return t("curve",s(c));case"BakeGradient":return t("gradient",s(c));case"RGBtoHSV":return Gr(s(c));case"HSVtoRGB":return Wr(s(c));default:throw new Error(`expression op ${c.op} is not supported by the runtime`)}}for(let l=0;l<r.length;l++)a(l);return o}const me=(r,e)=>Array.isArray(r)?r.map(e):e(r),De=(r,e,t)=>{if(Array.isArray(r)||Array.isArray(e)){const i=Array.isArray(r)?r.length:e.length;return Array.from({length:i},(o,a)=>t(Array.isArray(r)?r[a]:r,Array.isArray(e)?e[a]:e))}return t(r,e)},Vr=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],Nr=r=>[0,4,8,12,1,5,9,13,2,6,10,14,3,7,11,15].map(e=>r[e]),Bi=(r,e,t)=>[0,1,2].map(i=>r[i*4]*e[0]+r[i*4+1]*e[1]+r[i*4+2]*e[2]+r[i*4+3]*t),Or=r=>{const e=Math.hypot(...r)||1;return r.map(t=>t/e)};function Xr(r){const e=new Array(16);e[0]=r[5]*r[10]*r[15]-r[5]*r[11]*r[14]-r[9]*r[6]*r[15]+r[9]*r[7]*r[14]+r[13]*r[6]*r[11]-r[13]*r[7]*r[10],e[4]=-r[4]*r[10]*r[15]+r[4]*r[11]*r[14]+r[8]*r[6]*r[15]-r[8]*r[7]*r[14]-r[12]*r[6]*r[11]+r[12]*r[7]*r[10],e[8]=r[4]*r[9]*r[15]-r[4]*r[11]*r[13]-r[8]*r[5]*r[15]+r[8]*r[7]*r[13]+r[12]*r[5]*r[11]-r[12]*r[7]*r[9],e[12]=-r[4]*r[9]*r[14]+r[4]*r[10]*r[13]+r[8]*r[5]*r[14]-r[8]*r[6]*r[13]-r[12]*r[5]*r[10]+r[12]*r[6]*r[9],e[1]=-r[1]*r[10]*r[15]+r[1]*r[11]*r[14]+r[9]*r[2]*r[15]-r[9]*r[3]*r[14]-r[13]*r[2]*r[11]+r[13]*r[3]*r[10],e[5]=r[0]*r[10]*r[15]-r[0]*r[11]*r[14]-r[8]*r[2]*r[15]+r[8]*r[3]*r[14]+r[12]*r[2]*r[11]-r[12]*r[3]*r[10],e[9]=-r[0]*r[9]*r[15]+r[0]*r[11]*r[13]+r[8]*r[1]*r[15]-r[8]*r[3]*r[13]-r[12]*r[1]*r[11]+r[12]*r[3]*r[9],e[13]=r[0]*r[9]*r[14]-r[0]*r[10]*r[13]-r[8]*r[1]*r[14]+r[8]*r[2]*r[13]+r[12]*r[1]*r[10]-r[12]*r[2]*r[9],e[2]=r[1]*r[6]*r[15]-r[1]*r[7]*r[14]-r[5]*r[2]*r[15]+r[5]*r[3]*r[14]+r[13]*r[2]*r[7]-r[13]*r[3]*r[6],e[6]=-r[0]*r[6]*r[15]+r[0]*r[7]*r[14]+r[4]*r[2]*r[15]-r[4]*r[3]*r[14]-r[12]*r[2]*r[7]+r[12]*r[3]*r[6],e[10]=r[0]*r[5]*r[15]-r[0]*r[7]*r[13]-r[4]*r[1]*r[15]+r[4]*r[3]*r[13]+r[12]*r[1]*r[7]-r[12]*r[3]*r[5],e[14]=-r[0]*r[5]*r[14]+r[0]*r[6]*r[13]+r[4]*r[1]*r[14]-r[4]*r[2]*r[13]-r[12]*r[1]*r[6]+r[12]*r[2]*r[5],e[3]=-r[1]*r[6]*r[11]+r[1]*r[7]*r[10]+r[5]*r[2]*r[11]-r[5]*r[3]*r[10]-r[9]*r[2]*r[7]+r[9]*r[3]*r[6],e[7]=r[0]*r[6]*r[11]-r[0]*r[7]*r[10]-r[4]*r[2]*r[11]+r[4]*r[3]*r[10]+r[8]*r[2]*r[7]-r[8]*r[3]*r[6],e[11]=-r[0]*r[5]*r[11]+r[0]*r[7]*r[9]+r[4]*r[1]*r[11]-r[4]*r[3]*r[9]-r[8]*r[1]*r[7]+r[8]*r[3]*r[5],e[15]=r[0]*r[5]*r[10]-r[0]*r[6]*r[9]-r[4]*r[1]*r[10]+r[4]*r[2]*r[9]+r[8]*r[1]*r[6]-r[8]*r[2]*r[5];const t=r[0]*e[0]+r[1]*e[4]+r[2]*e[8]+r[3]*e[12];return e.map(i=>i/(t||1))}function $r(r,e,t){const[i,o,a]=e.map(v=>v*Math.PI/180),[s,n,u,l,c,f]=[Math.cos(i),Math.sin(i),Math.cos(o),Math.sin(o),Math.cos(a),Math.sin(a)],h=[u*c+n*l*f,c*n*l-u*f,s*l,s*f,s*c,-n,-c*l+u*n*f,u*c*n+l*f,s*u];return[h[0]*t[0],h[1]*t[1],h[2]*t[2],r[0],h[3]*t[0],h[4]*t[1],h[5]*t[2],r[1],h[6]*t[0],h[7]*t[1],h[8]*t[2],r[2],0,0,0,1]}function Gr([r,e,t]){const i=Math.max(r,e,t),o=i-Math.min(r,e,t);let a=0;return o&&(a=i===r?(e-t)/o%6:i===e?(t-r)/o+2:(r-e)/o+4),[(a/6+1)%1,i?o/i:0,i]}function Wr([r,e,t]){const i=o=>{const a=(o+r*6)%6;return t-t*e*Math.max(0,Math.min(a,4-a,1))};return[i(5),i(3),i(1)]}function jr(r){const e=new Float32Array(at*4);for(let t=0;t<at;t++){const i=t/(at-1),o=Vi(r.colors,i,r.mode,s=>s.color),a=Vi(r.alphas,i,r.mode,s=>[s.alpha]);e.set([o[0],o[1],o[2],a[0]],t*4)}return e}function Vi(r,e,t,i){if(!r.length)return[1,1,1];const o=[...r].sort((a,s)=>a.time-s.time);if(e<=o[0].time)return i(o[0]);for(let a=1;a<o.length;a++)if(e<=o[a].time){if(t==="fixed")return i(o[a]);const s=o[a-1],n=o[a],u=(e-s.time)/Math.max(1e-6,n.time-s.time);return i(s).map((l,c)=>l+(i(n)[c]-l)*u)}return i(o[o.length-1])}function Hr(r){var a;const e=[...r.keys].sort((s,n)=>s.time-n.time),t=((a=e[0])==null?void 0:a.time)??0,i=e.length>1?e[e.length-1].time:t+1,o=new Float32Array(at*4);for(let s=0;s<at;s++){const n=yo(e,t+(i-t)*s/(at-1));o.set([n,n,n,n],s*4)}return{data:o,start:t,end:i}}function yo(r,e){if(!r.length)return 0;if(e<=r[0].time)return r[0].value;if(e>=r[r.length-1].time)return r[r.length-1].value;let t=1;for(;r[t].time<e;)t++;const i=r[t-1],o=r[t],a=o.time-i.time;if(!Number.isFinite(i.outSlope)||!Number.isFinite(o.inSlope))return i.value;const s=(e-i.time)/a,n=s*s,u=n*s;return(2*u-3*n+1)*i.value+(u-2*n+s)*i.outSlope*a+(-2*u+3*n)*o.value+(u-n)*o.inSlope*a}const Yr={4:["uv",2],5:["uvNext",2],6:["vec2(0.0)",2],7:["vec2(0.0)",2],8:["frameBlend",1],9:["attributes.frame",1],10:["attributes.position",3],11:["float(gl_VertexID)",1],12:["size.x",1],13:["size.xy",2],14:["size",3],15:["attributes.angle.z",1],16:["attributes.angle",3],17:["0.0",1],18:["vec3(0.0)",3],19:["attributes.velocity",3],20:["length(attributes.velocity)",1],21:["life01",1],22:["1.0 / attributes.lifetime",1],23:["stable.x",1],24:["stable.xy",2],25:["stable.xyz",3],26:["stable",4],27:["stable.x",1],28:["stable.xy",2],29:["stable.xyz",3],30:["stable",4],31:["attributes.custom1.x",1],32:["attributes.custom1.xy",2],33:["attributes.custom1.xyz",3],34:["attributes.custom1",4],35:["attributes.custom2.x",1],36:["attributes.custom2.xy",2],37:["attributes.custom2.xyz",3],38:["attributes.custom2",4],39:["0.0",1],40:["vec2(0.0)",2],41:["vec3(0.0)",3],42:["0.0",1],43:["vec2(0.0)",2],44:["vec3(0.0)",3],45:["0.0",1]},To=`
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
}`;function qr(r,e){let t=Math.max(0,e-(r.delay||0))/r.time;if(t=r.loop?t-Math.floor(t):Math.min(t,1),r.type==="float")return vt(r.curve,t)*(r.intensity??1);const i=r.gradient;let o=1;for(;o<i.length-1&&i[o][0]<t;)o++;const a=i[o-1],s=i[o],n=s[0]>a[0]?Math.min(1,Math.max(0,(t-a[0])/(s[0]-a[0]))):0;return[1,2,3,4].map(u=>a[u]+(s[u]-a[u])*n)}function Kr(r,e){const t=e*r.speed;if(t/r.timeLimit>1)return null;const i=vt(r.curve,t/r.timeLimit)*r.frames+r.offsetFrames+1.1;return Math.ceil(-i)/(r.frames+1)+1/(r.frames+1)}function Zr(r){return r?new Float32Array([r[0],r[3],r[6],r[1],r[4],r[7],r[2],r[5],r[8]]):new Float32Array([1,0,0,0,1,0,0,0,1])}function vt(r,e,t=Math.random){if(!r)return 0;switch(r.mode){case"random":return r.min+(r.max-r.min)*t();case"curve":return r.scalar*Ut(r.curve,e);case"curves":{const i=Ut(r.min,e);return r.scalar*(i+(Ut(r.max,e)-i)*t())}default:return r.value??0}}function Jr(r,e){return r.curve?r.intensity*r.curve.intensity*Ut(r.curve.curve,e/r.curve.time):r.intensity}const Ut=(r,e)=>yo((r==null?void 0:r.keys)??[],e);function vi(r){if(!r)return 0;let e=0;for(let t=0;t<=32;t++)e=Math.max(e,vt(r,t/32,()=>1));return e}const Qr=3;function ea(r,e,t){const i=Number(e);if(!(i>0)||!Number.isFinite(i))return t;const o=Math.max(.001,r.duration),a=r.looping?Math.ceil(i/o)+1:1;let s=vi(r.rate)*i;for(const n of r.bursts){const u=n.cycles>0?n.cycles:1/0,l=Math.min(u,n.interval>0?Math.floor(i/n.interval)+1:1,1e3);s+=Math.max(0,vi(n.count))*l*a}return Math.min(t,Math.max(8,Math.ceil(s*Qr)))}function ta(r,e){if(r.looping)return!1;if(e.done)return!0;const t=e.time-e.delay;if(t>=r.duration)return!0;if(vi(r.rate)>0)return!1;for(const i of r.bursts){const o=i.cycles>0?Math.min(i.cycles,1e3):1e3;if(t<Math.min(i.time+(o-1)*i.interval,r.duration))return!1}return!0}function Ni(r){return{time:0,delay:vt(r.startDelay,0),acc:0,done:!1}}function ia(r,e,t,i){const o=Math.max(.001,r.duration),a=e.time-e.delay;e.time+=t*(r.simulationSpeed||1);const s=e.time-e.delay;if(s<0||e.done)return{count:0,emitterTime:0};if(!r.looping&&a>=o)return e.done=!0,{count:0,emitterTime:1};const n=r.looping?s%o/o:Math.min(1,s/o);let u=0;const l=r.looping?s:Math.min(s,o),c=Math.max(0,a);e.acc+=Math.max(0,vt(r.rate,n))*Math.max(0,l-c)*i,u+=Math.floor(e.acc),e.acc-=Math.floor(e.acc);for(const f of r.bursts){const h=f.cycles>0?f.cycles:1/0,v=Math.floor(c/o),p=r.looping?Math.floor(l/o):0;for(let x=v;x<=p;x++)for(let w=0;w<Math.min(h,1e3);w++){const m=x*o+f.time+w*f.interval;if(f.time+w*f.interval>o&&r.looping||m>l)break;m>=c&&(m>c||c===0&&a<=0)&&Math.random()<=f.probability&&(u+=Math.round(vt(f.count,n)*i))}}return{count:u,emitterTime:n}}function oa(r,e){const{header:t,lib:i,attributeDecl:o,uniformDecls:a,loadAttributes:s,zeroInit:n}=e,u=r.output,l=u.material,c=u.mode,f=c==="mesh"||c==="vat",h=u.flipbook,v=la(u.streams||[0,1,3,4]),p=!!u.interpolateFrames||(u.streams||[]).includes(5);return{vs:`${t}
${i}
${o}
${a}
uniform mat4 uViewProj;
uniform mat4 uModel;
uniform mat4 uSystemRotation; // row-major math matrix (GLSL m[i] = row i)
uniform vec2 uViewport;
uniform float uProjScale;      // tan(fov / 2)
${c==="beam"?`uniform vec3 uBeamStart;      // effect space, the end grown so far
uniform vec3 uBeamEnd;`:""}
${c==="vat"?`uniform float uVatTime;       // the frame's row offset (BFX_ManualAnimationUpdate)
uniform sampler2D uVatPosHi, uVatPosLo, uVatNormal;`:""}
${Array.from({length:r.slots},(x,w)=>`layout(location = ${w}) in uvec4 a_s${w};`).join(`
`)}
${f?`layout(location = ${r.slots}) in vec3 aMeshPos;
layout(location = ${r.slots+1}) in vec3 aMeshNormal;
layout(location = ${r.slots+2}) in vec2 aMeshUV;`:""}
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
${r.stages.output.section}
  }
  float life01 = clamp(attributes.age / max(attributes.lifetime, 1e-4), 0.0, 1.0);
  vec4 stable = vec4(FixedRand(attributes.particleId ^ 101u), FixedRand(attributes.particleId ^ 102u), FixedRand(attributes.particleId ^ 103u), FixedRand(attributes.particleId ^ 104u));
  vec3 size = attributes.size3;
  vec3 camRight = vfxViewRot[0];
  vec3 camUp = vfxViewRot[1];
  vec3 toCam = normalize(vfxViewPosition - attributes.position);
${f?"":`  // Keep billboards within Unity's max particle size (a fraction of the screen).
  float maxSize = ${Fe(u.maxParticleSize??.5)} * 2.0 * length(vfxViewPosition - attributes.position) * uProjScale;
  size.xy = min(size.xy, vec2(maxSize));`}
  vec2 corner = vec2(float(gl_VertexID & 1), float((gl_VertexID & 2) >> 1));
  vec3 p;
  vec3 n = toCam;
  vec2 uv = corner;
${na(c,u)}
  // Flipbook: frame 0 is the top-left tile, rows go down.
${h?`  float frames = ${Fe(h.tilesX*h.tilesY)};
  float f0 = mod(floor(attributes.frame), frames);
  float f1 = mod(f0 + 1.0, frames);
  float frameBlend = fract(attributes.frame);
  vec2 tiles = vec2(${Fe(h.tilesX)}, ${Fe(h.tilesY)});
  vec2 uvNext = (uv + vec2(mod(f1, tiles.x), tiles.y - 1.0 - floor(f1 / tiles.x))) / tiles;
  uv = (uv + vec2(mod(f0, tiles.x), tiles.y - 1.0 - floor(f0 / tiles.x))) / tiles;`:`  vec2 uvNext = uv;
  float frameBlend = 0.0;`}
  vec3 color = attributes.color;
${u.applyColorSpace?"  color = pow(max(color, vec3(0.0)), vec3(2.2)); // Unity converts particle colours to linear":""}
  vColor = vec4(color, attributes.alpha);
${c==="beam"?`  vColor *= mix(vec4(${u.beam.colors[0].map(Fe).join(", ")}), vec4(${u.beam.colors[1].map(Fe).join(", ")}), corner.x); // the line's gradient`:""}
  float tex[16];
  for (int i = 0; i < 16; i++) tex[i] = 0.0;
${v.join(`
`)}
  vTex0 = vec4(tex[0], tex[1], tex[2], tex[3]);
  vTex1 = vec4(tex[4], tex[5], tex[6], tex[7]);
  vTex2 = vec4(tex[8], tex[9], tex[10], tex[11]);
  vTex3 = vec4(tex[12], tex[13], tex[14], tex[15]);
  vUVNext = uvNext;
  vFrameBlend = ${p?"frameBlend":"0.0"};
  vec4 world = uModel * vec4(p, 1.0);
  vWorldPos = world.xyz;
  vNormal = normalize(mat3(uModel) * n);
  vViewDir = normalize(mat3(uModel) * (vfxViewPosition - p));
  gl_Position = uViewProj * world;
}`,fs:Eo(t,l)}}function Eo(r,e){return`${r}
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
${To}
out vec4 fragColor;
${(e==null?void 0:e.code)||"vec4 shadeFragment() { return vColor; }"}
void main() {
  vec4 c = shadeFragment();
  c.rgb = uRecolor * c.rgb;
  fragColor = vec4(fxTone(max(c.rgb, vec3(0.0))), clamp(c.a * uFxTint.a, 0.0, 1.0));
}`}const it=2048,ra=r=>2*(r.points+2);function aa(r,e){var p,x;const{header:t,lib:i,attributeDecl:o,uniformDecls:a,loadAttributes:s,zeroInit:n}=e,u=r.output,l=u.trail,c=l.points,f=(w,m)=>{const g=r.layout.find(C=>C.name===w&&!C.counter),E=Array.from({length:{float:1,vec3:3,uint:1,bool:1}[m]},(C,A)=>{const R=g.offset+A;return`historySlot(k, ${R>>2}).${"xyzw"[R&3]}`});if(m==="bool")return`(${E[0]} != 0u)`;if(m==="uint")return E[0];const S=E.map(C=>`uintBitsToFloat(${C})`);return S.length===1?S[0]:`${m}(${S.join(", ")})`},h={stretch:"cum / max(total, 1e-6)",tile:"cum",distribute:"float(p) / max(float(tailAt), 1.0)",repeat:"float(p)"}[l.textureMode]||"cum / max(total, 1e-6)",v=(((x=(p=l.material)==null?void 0:p.blend)==null?void 0:x.src)??"SRC_ALPHA")==="SRC_ALPHA";return{vs:`${t}
${i}
${o}
${a}
uniform mat4 uViewProj;
uniform mat4 uModel;
uniform vec2 uViewport;
uniform float uProjScale;      // tan(fov / 2)
uniform highp usampler2DArray uTrailHistory;
uniform int uTrailHead;
uniform int uTrailCount;
uniform float uTrailAge[${c}];
${Array.from({length:r.slots},(w,m)=>`layout(location = ${m}) in uvec4 a_s${m};`).join(`
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
  int texel = gl_InstanceID * ${r.slots} + s;
  return texelFetch(uTrailHistory, ivec3(texel % ${it}, texel / ${it}, layer), 0);
}
// Sample k was this particle (alive) when it was recorded.
bool sameParticle(int k, uint id) {
  return k < uTrailCount && ${f("alive","bool")} && ${f("particleId","uint")} == id;
}
vec3 samplePosition(int k) { return ${f("position","vec3")}; }

void trailValues(Attributes attributes, float trailU, out vec4 trailColor, out float trailWidth, out float trailLife, out bool trailOn) {
  trailColor = vec4(1.0);
  trailWidth = 0.0;
  trailLife = 0.0;
  trailOn = true;
${r.stages.trail.section}
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
${r.stages.output.section}
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
  vColor = vec4(color${v?"":" * coverage"}, trailColor.a * coverage);
  vTex0 = vec4(u, across, 0.0, 0.0);
  vUVNext = vTex0.xy;
  vec4 world = uModel * vec4(pos, 1.0);
  vWorldPos = world.xyz;
  vNormal = normalize(mat3(uModel) * toCam);
  vViewDir = normalize(mat3(uModel) * (vfxViewPosition - pos));
  gl_Position = uViewProj * world;
}`,fs:Eo(t,l.material)}}const sa=`  vec3 vz = length(attributes.velocity) > 1e-6 ? normalize(attributes.velocity) : (vec4(0.0, 0.0, 1.0, 0.0) * uSystemRotation).xyz;
  vec3 vx = cross(vec3(0.0, 1.0, 0.0), vz);
  vx = length(vx) > 1e-6 ? normalize(vx) : vec3(1.0, 0.0, 0.0);
  vec3 vy = cross(vz, vx);
  lp = vx * lp.x + vy * lp.y + vz * lp.z;
  ln = vx * ln.x + vy * ln.y + vz * ln.z;`;function na(r,e){const t=`vec3(${(e.pivot||[0,0,0]).map(Fe).join(", ")})`;switch(r){case"beam":{const[i,o]=e.beam.widths;return`  vec3 mid = mix(uBeamStart, uBeamEnd, corner.x);
  vec3 side = cross(uBeamEnd - uBeamStart, vfxViewPosition - mid);
  side = length(side) > 1e-6 ? normalize(side) : camRight;
  p = mid + side * (corner.y - 0.5) * mix(${Fe(i)}, ${Fe(o)}, corner.x);`}case"vat":{const i=e.vat;return`  vec2 vuv = vec2(aMeshUV.x, fract(uVatTime + aMeshUV.y));
  vec3 hi = texture(uVatPosHi, vuv).rgb;
  vec3 lo = texture(uVatPosLo, vuv).rgb;
  vec3 tp = (floor(hi * 255.0 + 0.5) * 256.0 + floor(lo * 255.0 + 0.5)) / 65535.0;
  tp = tp * ${Fe(i.max-i.min)} + ${Fe(i.min)};
  tp.x = -tp.x;
  vec3 lp = tp.xzy + vec3(${i.heightOffset.map(Fe).join(", ")});
  vec3 ln = (texture(uVatNormal, vuv).rgb * 2.0 - 1.0).xzy;
  ln.x = -ln.x;
  lp = (vec4(lp, 0.0) * uSystemRotation).xyz;
  ln = (vec4(ln, 0.0) * uSystemRotation).xyz;
  p = attributes.position + lp;
  n = normalize(ln);
  uv = aMeshUV;`}case"mesh":return`  vec3 lp = eulerZXY(attributes.angle, aMeshPos * size + ${t} * size);
  vec3 ln = eulerZXY(attributes.angle, aMeshNormal);
${e.alignment==="velocity"?sa:e.alignment==="view"?`  lp = camRight * lp.x + camUp * lp.y + toCam * -lp.z;
  ln = camRight * ln.x + camUp * ln.y + toCam * -ln.z;`:e.alignment==="world"?"":`  lp = (vec4(lp, 0.0) * uSystemRotation).xyz;
  ln = (vec4(ln, 0.0) * uSystemRotation).xyz;`}
  p = attributes.position + lp;
  n = ln;
  uv = aMeshUV;`;case"stretched":return`  vec3 vel = attributes.velocity;
  float speed = length(vel);
  vec3 dir = speed > 1e-5 ? vel / speed : camUp;
  vec3 side = normalize(cross(dir, toCam) + 1e-6);
  // Width from the X size, length from the Y size (they differ only with 3D start size: FXVille's spurts).
  float len = size.y * ${Fe(e.lengthScale??2)} + speed * ${Fe(e.velocityScale??0)};
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
  p = attributes.position + camRight * q.x + camUp * q.y;`}}function la(r){const e=[];let t=0;for(const i of r){const o=Yr[i];if(!o)continue;const[a,s]=o;for(let n=0;n<s&&t<16;n++,t++){const u=s===1?`(${a})`:`(${a}).${"xyzw"[n]}`;e.push(`  tex[${t}] = ${u};`)}}return e}const Fe=r=>{const e=Number(r)||0;return Number.isInteger(e)?`${e}.0`:String(e)},ot=2048,Jt=14,Oi=15,Bt=2,Qt=8,ua=2;function ca(r){return r==="mat4"?4:r==="mat3"?3:/^(float|vec[234]|uint|int|bool)$/.test(r)?1:0}function Xi(r,e=Bt){const t=[],i={};let o=0;for(const a of r){if(a.name in i)continue;const s=ca(a.type);if(!s)throw new Error(`effect uniform ${a.name}: type ${a.type} can't go in an instance row`);t.push({name:a.name,type:a.type,texel:o}),i[a.name]=o,o+=s}return{fields:t,width:o+e,at:i}}function pi(r,e){const t=o=>`texelFetch(${e}, ivec2(${o}, inst), 0)`,i=r.texel;switch(r.type){case"float":return`uintBitsToFloat(${t(i)}.x)`;case"vec2":return`uintBitsToFloat(${t(i)}.xy)`;case"vec3":return`uintBitsToFloat(${t(i)}.xyz)`;case"vec4":return`uintBitsToFloat(${t(i)})`;case"uint":return`${t(i)}.x`;case"int":return`int(${t(i)}.x)`;case"bool":return`(${t(i)}.x != 0u)`;case"mat4":return`mat4(${[0,1,2,3].map(o=>`uintBitsToFloat(${t(i+o)})`).join(", ")})`;case"mat3":return`mat3(${[0,1,2].map(o=>`uintBitsToFloat(${t(i+o)}.xyz)`).join(", ")})`;default:throw new Error(`effect uniform ${r.name}: type ${r.type}`)}}function ha(r){const e=["uniform highp usampler2D uInstData;","uint uSpawnStart, uSpawnCount, uSpawnBase, uSystemSeed, uCursor;","float uEmitterTime;",...r.fields.map(i=>`${i.type} ${i.name};`)].join(`
`),t=r.fields.map(i=>`  ${i.name} = ${pi(i,"uInstData")};`).join(`
`);return{decls:e,loads:t}}const pt=12,$i=13,ei={vsDecls:`uniform highp usampler2D uDrawRows;
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
in float vRow;`};function ti(r,e,t,i,o,a){if(o==null)return;const s=a==="uint"||a==="int",n=o,u=o;switch(i){case"float":s?r[t]=n>>>0:e[t]=n;break;case"vec2":case"vec3":case"vec4":for(let l=0;l<u.length&&l<4;l++)e[t+l]=u[l];break;case"uint":s?r[t]=n>>>0:e[t]=n;break;case"int":s?r[t]=(n|0)>>>0:e[t]=n;break;case"bool":r[t]=n?1:0;break;case"mat4":for(let l=0;l<16;l++)e[t+l]=u[l];break;case"mat3":for(let l=0;l<3;l++)for(let c=0;c<3;c++)e[t+l*4+c]=u[l*3+c];break}}class fa{constructor(e,t){d(this,"systems",[]);d(this,"slots",0);d(this,"high",0);d(this,"taken",[]);d(this,"passes",0);d(this,"bySystem",new Map);this.gl=e;for(const i of t){const o=this.make(i,Qt);this.systems.push(o),this.bySystem.set(i,o)}this.slots=Qt,this.taken.length=Qt,this.taken.fill(!1)}take(){let e=this.taken.indexOf(!1);e<0&&(e=this.slots,this.grow(this.slots*ua)),this.taken[e]=!0,this.high=Math.max(this.high,e+1);for(const t of this.systems)this.zero(t,e);return e}free(e){if(!(e<0||!this.taken[e])){this.taken[e]=!1;for(const t of this.systems)t.rows[e*t.width*4+(t.width-1)*4+1]=0;for(;this.high>0&&!this.taken[this.high-1];)this.high--}}systemOf(e){return this.bySystem.get(e)}offset(e,t){return t*e.sys.capacity*e.sys.slots*16}rowAt(e,t){return t*e.width*4}beginFrame(){for(const e of this.systems){const t=(e.width-1)*4+1;for(let i=0;i<this.high;i++)e.rows[i*e.width*4+t]=0;e.active=0}}on(e,t){e.rows[t*e.width*4+(e.width-1)*4+1]=1,t+1>e.active&&(e.active=t+1)}beginDraw(){for(const e of this.systems){const t=(e.drawWidth-pt+11)*4;for(let i=0;i<this.high;i++)e.drawRows[i*e.drawWidth*4+t]=0;e.drawActive=0}}drawRowAt(e,t){return t*e.drawWidth*4}drawOn(e,t){e.drawRows[t*e.drawWidth*4+(e.drawWidth-pt+11)*4]=1,t+1>e.drawActive&&(e.drawActive=t+1)}uploadDraw(){const e=this.gl;for(const t of this.systems)t.drawActive&&(e.bindTexture(e.TEXTURE_2D,t.drawTexture),e.texSubImage2D(e.TEXTURE_2D,0,0,0,t.drawWidth,t.drawActive,e.RGBA_INTEGER,e.UNSIGNED_INT,t.drawRows.subarray(0,t.drawActive*t.drawWidth*4)));e.bindTexture(e.TEXTURE_2D,null)}bindDrawRows(e,t){const i=this.gl;i.activeTexture(i.TEXTURE0+$i),i.bindTexture(i.TEXTURE_2D,e.drawTexture),i.uniform1i(t,$i)}drawVaoAll(e){return e.drawVaosAll||(e.drawVaosAll=e.buffers.map(t=>Mt(this.gl,t,e.sys.slots,1,e.sys.mesh,0))),e.drawVaosAll[e.current]}simulate(e){const t=this.gl;this.passes=0,t.enable(t.RASTERIZER_DISCARD);for(const i of this.systems){if(!i.active)continue;const o=i.sys,a=i.current,s=1-a;t.useProgram(o.sim.program),e(o);const n=o.sim.locations;t.uniform1ui(n.uCapacity,o.capacity),n.uRing&&t.uniform1ui(n.uRing,o.ringK),t.activeTexture(t.TEXTURE0+Jt),t.bindTexture(t.TEXTURE_2D,i.instTexture),t.uniform1i(n.uInstData,Jt);const u=o.def.spawnFromEvent;if(u&&n.uParent){const l=this.systems.find(c=>c.sys.index===u.system);t.activeTexture(t.TEXTURE0+Oi),t.bindTexture(t.TEXTURE_2D,(l==null?void 0:l.parentTexture)??null),t.uniform1i(n.uParent,Oi),t.activeTexture(t.TEXTURE0+Jt)}t.texSubImage2D(t.TEXTURE_2D,0,0,0,i.width,i.active,t.RGBA_INTEGER,t.UNSIGNED_INT,i.rows.subarray(0,i.active*i.width*4)),t.bindVertexArray(i.simVaos[a]),t.bindBuffer(t.ARRAY_BUFFER,null),t.bindBufferBase(t.TRANSFORM_FEEDBACK_BUFFER,0,i.buffers[s]),t.beginTransformFeedback(t.POINTS),t.drawArrays(t.POINTS,0,i.active*o.capacity),t.endTransformFeedback(),t.bindBufferBase(t.TRANSFORM_FEEDBACK_BUFFER,0,null),t.bindVertexArray(null),i.current=s,this.passes++,i.parentTexture&&this.copyToParentTexture(i)}t.disable(t.RASTERIZER_DISCARD)}drawVao(e,t){let i=e.drawVaos.get(t);return i||e.drawVaos.set(t,i=e.buffers.map(o=>Mt(this.gl,o,e.sys.slots,1,e.sys.mesh,this.offset(e,t)))),i[e.current]}trailVao(e,t){if(!e.sys.mesh)return this.drawVao(e,t);let i=e.trailVaos.get(t);return i||e.trailVaos.set(t,i=e.buffers.map(o=>Mt(this.gl,o,e.sys.slots,1,null,this.offset(e,t)))),i[e.current]}zero(e,t){const i=this.gl,o=e.sys.capacity*e.sys.slots*16;e.zeros??(e.zeros=new Uint8Array(o));for(const a of e.buffers)i.bindBuffer(i.ARRAY_BUFFER,a),i.bufferSubData(i.ARRAY_BUFFER,this.offset(e,t),e.zeros);i.bindBuffer(i.ARRAY_BUFFER,null)}dispose(){for(const e of this.systems)this.drop(e);this.systems.length=0,this.slots=0,this.high=0,this.taken.length=0}make(e,t,i){const o=this.gl,a=e.capacity*e.slots*16*t,s=[0,1].map(p=>{const x=o.createBuffer();return o.bindBuffer(o.ARRAY_BUFFER,x),o.bufferData(o.ARRAY_BUFFER,a,o.DYNAMIC_COPY),i&&(o.bindBuffer(o.COPY_READ_BUFFER,i.buffers[p]),o.copyBufferSubData(o.COPY_READ_BUFFER,o.ARRAY_BUFFER,0,0,e.capacity*e.slots*16*this.slots),o.bindBuffer(o.COPY_READ_BUFFER,null)),x});o.bindBuffer(o.ARRAY_BUFFER,null);let n=null;e.parentOfEvents&&(n=o.createTexture(),o.bindTexture(o.TEXTURE_2D,n),o.texStorage2D(o.TEXTURE_2D,1,o.RGBA32UI,ot,Math.max(1,Math.ceil(e.capacity*e.slots*t/ot))),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MIN_FILTER,o.NEAREST),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MAG_FILTER,o.NEAREST));const u=e.instance.width,l=o.createTexture();o.bindTexture(o.TEXTURE_2D,l),o.texStorage2D(o.TEXTURE_2D,1,o.RGBA32UI,u,t),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MIN_FILTER,o.NEAREST),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MAG_FILTER,o.NEAREST),o.bindTexture(o.TEXTURE_2D,null);const c=new Uint32Array(u*4*t);i&&c.set(i.rows);const f=e.draw.width,h=o.createTexture();o.bindTexture(o.TEXTURE_2D,h),o.texStorage2D(o.TEXTURE_2D,1,o.RGBA32UI,f,t),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MIN_FILTER,o.NEAREST),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MAG_FILTER,o.NEAREST),o.bindTexture(o.TEXTURE_2D,null);const v=new Uint32Array(f*4*t);return i&&v.set(i.drawRows),{sys:e,buffers:s,simVaos:s.map(p=>Mt(o,p,e.slots,0,null,0)),drawVaos:new Map,trailVaos:new Map,current:(i==null?void 0:i.current)??0,parentTexture:n,instTexture:l,rows:c,floats:new Float32Array(c.buffer),width:u,active:(i==null?void 0:i.active)??0,zeros:(i==null?void 0:i.zeros)??null,drawTexture:h,drawRows:v,drawFloats:new Float32Array(v.buffer),drawWidth:f,drawActive:(i==null?void 0:i.drawActive)??0,drawVaosAll:null}}grow(e){for(const t of this.systems){const i=this.make(t.sys,e,t);this.drop(t),Object.assign(t,i)}for(let t=this.slots;t<e;t++)this.taken[t]=!1;this.slots=e}drop(e){var i;const t=this.gl;e.buffers.forEach(o=>t.deleteBuffer(o)),e.simVaos.forEach(o=>t.deleteVertexArray(o));for(const o of[...e.drawVaos.values(),...e.trailVaos.values()])o.forEach(a=>t.deleteVertexArray(a));e.drawVaos.clear(),e.trailVaos.clear(),(i=e.drawVaosAll)==null||i.forEach(o=>t.deleteVertexArray(o)),e.drawVaosAll=null,e.parentTexture&&t.deleteTexture(e.parentTexture),t.deleteTexture(e.instTexture),t.deleteTexture(e.drawTexture)}copyToParentTexture(e){const t=this.gl,i=e.sys.capacity*e.sys.slots*e.active,o=Math.floor(i/ot),a=i-o*ot;t.bindBuffer(t.PIXEL_UNPACK_BUFFER,e.buffers[e.current]),t.bindTexture(t.TEXTURE_2D,e.parentTexture),o&&t.texSubImage2D(t.TEXTURE_2D,0,0,0,ot,o,t.RGBA_INTEGER,t.UNSIGNED_INT,0),a&&t.texSubImage2D(t.TEXTURE_2D,0,0,o,a,1,t.RGBA_INTEGER,t.UNSIGNED_INT,o*ot*16),t.bindBuffer(t.PIXEL_UNPACK_BUFFER,null)}}function Mt(r,e,t,i,o,a){const s=r.createVertexArray();r.bindVertexArray(s),r.bindBuffer(r.ARRAY_BUFFER,e);for(let n=0;n<t;n++)r.enableVertexAttribArray(n),r.vertexAttribIPointer(n,4,r.UNSIGNED_INT,t*16,a+n*16),r.vertexAttribDivisor(n,i);return o&&([[o.positions,3],[o.normals,3],[o.uvs,2]].forEach(([n,u],l)=>{r.bindBuffer(r.ARRAY_BUFFER,n),r.enableVertexAttribArray(t+l),r.vertexAttribPointer(t+l,u,r.FLOAT,!1,0,0),r.vertexAttribDivisor(t+l,0)}),r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,o.indices)),r.bindVertexArray(null),r.bindBuffer(r.ARRAY_BUFFER,null),s}const Vt={float:1,vec2:2,vec3:3,vec4:4,uint:1,uvec2:2,uvec3:3,uvec4:4,int:1,ivec2:2,ivec3:3,ivec4:4,bool:1},da={float:"0.0",uint:"0u",int:"0",bool:"false"},lt=r=>da[r]??`${r}(0)`,Gi=.25,Ye=`#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
precision highp usampler2D;
`;class ma{constructor(e,t,i={}){d(this,"name");d(this,"systems",[]);d(this,"spawners",[]);d(this,"textures");d(this,"exprTypes");d(this,"values0");d(this,"meshData");d(this,"bake");d(this,"byIndex",new Map);d(this,"_pool",null);d(this,"bakeBySource",new WeakMap);this.gl=e,this.effect=t,this.name=t.name,this.textures=i.textures??new Map,this.meshData=i.meshes??new Map;const o=i.maxCapacity??1<<20;this.bake=this.createBakeTexture(),this.values0=bo(t.expressions,{time:0,deltaTime:0,frame:0,seed:0},(l,c)=>this.bakeRow(l,c)),this.exprTypes=t.expressions.map((l,c)=>Fo(t,c));const a=t.systems,s=l=>l.spawnFromEvent?1+s(a[l.spawnFromEvent.system]):0,n=a.map((l,c)=>({def:l,index:c})).filter(l=>l.def.kind==="particles").sort((l,c)=>s(l.def)-s(c.def)),u=new Map;for(const{def:l}of n)l.spawnFromEvent&&(u.get(l.spawnFromEvent.system)??u.set(l.spawnFromEvent.system,new Set).get(l.spawnFromEvent.system)).add(l.spawnFromEvent.counter);for(const{def:l,index:c}of n){const f=this.setupSystem(l,c,u.get(c)??null,o);this.systems.push(f),this.byIndex.set(c,f)}a.forEach((l,c)=>{l.kind==="spawner"&&this.spawners.push({index:c,tasks:l.tasks??[],targets:l.targets??[]})})}system(e){return this.byIndex.get(e)}get drawOrder(){const e=this.effect.drawOrder;return e?e.map(t=>this.byIndex.get(t)).filter(t=>!!t):this.systems}bounds(){return Ao(this,this.values0)}get pool(){return this._pool??(this._pool=new fa(this.gl,this.systems))}get pooled(){return!!this._pool&&this._pool.high>0}bindSimTextures(e){return this.bindStageTextures(e.sim,["init","update"],e)}bindStageTextures(e,t,i){const o=this.gl;let a=0;o.activeTexture(o.TEXTURE0),o.bindTexture(o.TEXTURE_2D,this.bake.texture),e.locations.bakedTexture&&o.uniform1i(e.locations.bakedTexture,a),a++;for(const s of t){const n=i.def.stages[s];if(n)for(const u of n.textures){const l=e.locations[u.name];if(!l)continue;const c=u.expr!==null?this.values0[u.expr]:null;o.activeTexture(o.TEXTURE0+a),u.type==="sampler3D"?o.bindTexture(o.TEXTURE_3D,this.texture3D(c)):o.bindTexture(o.TEXTURE_2D,this.textures.get(c)||yi(o)),o.uniform1i(l,a),a++}}return a}drawSystem(e,t,i,o,a,s,n,u){const l=this.gl,c=e.render,f=e.def.output;l.useProgram(c.program);let h=this.bindStageTextures(c,["output"],e);const v=c.locations;if(l.uniformMatrix4fv(v.uViewProj,!1,o),l.uniform2fv(v.uViewport,i.viewport),v.uFxExposure&&l.uniform1f(v.uFxExposure,i.exposure),v.uFxToneMap&&l.uniform1f(v.uFxToneMap,i.toneMap?1:0),l.uniform1i(v.uRowBase,a),l.uniform1ui(v.uCapacity,e.capacity),l.uniform1i(v.uDrawFixed,e.draw.width-pt),(f==null?void 0:f.kind)==="shuriken"){const p=f.material;v.uProjScale&&l.uniform1f(v.uProjScale,1/i.projection[5]),v.uSystemRotation&&f.systemRotation&&l.uniformMatrix4fv(v.uSystemRotation,!1,f.systemRotation),v.uDeltaTime&&l.uniform1f(v.uDeltaTime,1/60),v.uCameraPos&&l.uniform3fv(v.uCameraPos,i.eye);const x=new Map;if(u&&f.beam){l.uniform3fv(v.uBeamStart,u.start),l.uniform3fv(v.uBeamEnd,u.end);const m=Math.hypot(u.end[0]-u.start[0],u.end[1]-u.start[1],u.end[2]-u.start[2]);for(const g of f.beam.tiling)x.set(g.uniform,g.perMetre*m)}for(const m of(p==null?void 0:p.uniforms)||[]){if(!v[m.name])continue;const g=x.has(m.name)&&Array.isArray(m.value)?[x.get(m.name),...m.value.slice(1)]:m.value;gi(l,v[m.name],m.type,g,"float")}const w=(m,g)=>{v[m]&&(l.activeTexture(l.TEXTURE0+h),l.bindTexture(l.TEXTURE_2D,g),l.uniform1i(v[m],h),h++)};w("uWhite",Nt(l));for(const m of(p==null?void 0:p.textures)||[])w(m.name,this.textures.get(m.key)||Nt(l));if(!(p!=null&&p.blend))l.disable(l.BLEND),l.depthMask(!0);else{l.enable(l.BLEND);const m=l;l.blendFuncSeparate(m[p.blend.src]??l.SRC_ALPHA,m[p.blend.dst]??l.ONE_MINUS_SRC_ALPHA,l.ZERO,l.ONE),l.depthMask(!!p.depthWrite)}p!=null&&p.cull?(l.enable(l.CULL_FACE),l.cullFace(l.BACK)):l.disable(l.CULL_FACE),this.pool.bindDrawRows(t,v.uDrawRows),l.bindVertexArray(n),e.mesh?l.drawElementsInstanced(l.TRIANGLES,e.mesh.count,l.UNSIGNED_INT,0,s):l.drawArraysInstanced(l.TRIANGLE_STRIP,0,4,s)}else{l.disable(l.CULL_FACE);const p=f==null?void 0:f.blend;p==="opaque"?(l.disable(l.BLEND),l.depthMask(!0)):(l.enable(l.BLEND),l.depthMask(!1),p==="add"?l.blendFuncSeparate(l.SRC_ALPHA,l.ONE,l.ZERO,l.ONE):p==="premultiply"?l.blendFuncSeparate(l.ONE,l.ONE_MINUS_SRC_ALPHA,l.ZERO,l.ONE):l.blendFuncSeparate(l.SRC_ALPHA,l.ONE_MINUS_SRC_ALPHA,l.ZERO,l.ONE)),this.pool.bindDrawRows(t,v.uDrawRows),l.bindVertexArray(n),l.drawArraysInstanced(l.TRIANGLE_STRIP,0,4,s)}return l.bindVertexArray(null),1}texture3D(e){const t=this.textures.get(e);if(t)return t;const i=Sa(this.gl);return this.textures.set(e,i),i}bakeRow(e,t){const i=this.gl,o=typeof t=="object"&&t!==null?t:null,a=o?this.bakeBySource.get(o):void 0;if(a&&a.kind===e&&this.bake.used.get(a.key)===a.entry)return a.entry;const s=`${e}:${JSON.stringify(t)}`;let n=this.bake.used.get(s);if(n!==void 0)return o&&this.bakeBySource.set(o,{kind:e,key:s,entry:n}),n;{const u=this.bake.used.size%this.bake.rows,l=e==="gradient"?{data:jr(t),start:0,end:1}:Hr(t);i.bindTexture(i.TEXTURE_2D,this.bake.texture),i.texSubImage2D(i.TEXTURE_2D,0,0,u,at,1,i.RGBA,i.FLOAT,l.data);const c=(u+.5)/this.bake.rows,f=l.end-l.start||1;n=e==="gradient"?c:[1/f,-l.start/f,c,12],this.bake.used.size>=this.bake.rows&&this.bake.used.clear(),this.bake.used.set(s,n),o&&this.bakeBySource.set(o,{kind:e,key:s,entry:n})}return n}get bakeTexture(){return this.bake.texture}dispose(){var t;const e=this.gl;(t=this._pool)==null||t.dispose(),this._pool=null;for(const i of this.systems)if(e.deleteProgram(i.sim.program),i.render&&e.deleteProgram(i.render.program),i.trail&&e.deleteProgram(i.trail.program),i.mesh)for(const o of[i.mesh.positions,i.mesh.normals,i.mesh.uvs,i.mesh.indices])e.deleteBuffer(o);e.deleteTexture(this.bake.texture);for(const i of this.textures.values())i&&!Ma(e,i)&&e.deleteTexture(i)}setupSystem(e,t,i,o){var E,S,C,A,R,_,k;const a=Math.max(1,Math.round(e.capacity));let s,n=1;if(e.spawnFromEvent){const B=this.byIndex.get(e.spawnFromEvent.system);let y=Math.max(1,Math.floor(a/Math.max(1,B.def.capacity)));e.spawnFromEvent.mode==="die"?y=Math.max(y,this.maxEventCount(B.def)):y=Math.max(y,(e.spawnFromEvent.ringStep||1)*2),y=Math.max(1,Math.min(y,Math.floor(o/B.capacity))),n=y,s=B.capacity*y}else s=Math.min(((E=e.spawner)==null?void 0:E.kind)==="shuriken"?ea(e.spawner,e.maxLifetime,a):a,o);const u=new Map(e.attributes.map(B=>[B.name,B.type])),l=e.attributes.filter(B=>B.stored).map(B=>({name:B.name,type:B.type,offset:0}));for(const B of i??[])l.push({name:`__${B}`,type:"uint",offset:0,counter:B});let c=0;for(const B of l)B.offset=c,c+=Vt[B.type];const f=Math.max(1,Math.ceil(c/4)),h=Xi([...((S=e.stages.init)==null?void 0:S.uniforms)??[],...((C=e.stages.update)==null?void 0:C.uniforms)??[]]),v=e.spawnFromEvent?this.byIndex.get(e.spawnFromEvent.system).capacity:0,p=(A=e.output)==null?void 0:A.material,x=(((R=e.output)==null?void 0:R.materialAnim)??[]).flatMap(B=>{const y=p==null?void 0:p.uniforms.find(F=>F.name===B.uniform);return y?[{name:y.name,type:y.type,anim:B}]:[]}),w=Xi([...((_=e.stages.output)==null?void 0:_.uniforms)??[],...x],pt),m={index:t,def:e,name:e.name,capacity:s,ringK:n,fields:u,layout:l,slots:f,sim:null,render:null,trail:null,mesh:null,parentOfEvents:!!i,parentCapacity:v,instance:h,draw:w,animated:x};m.sim=this.buildSimProgram(m);const g=((k=e.output)==null?void 0:k.kind)==="shuriken";return m.render=e.stages.output?g?e.output.mode==="none"?null:this.buildShurikenRender(m):this.buildRenderProgram(m):null,m.trail=g&&e.output.trail&&e.stages.output&&e.stages.trail?this.buildShurikenTrail(m):null,m.mesh=g&&(e.output.mode==="mesh"||e.output.mode==="vat")?this.meshBuffers(e.output.mesh):null,m}maxEventCount(e){var i;let t=1;for(const o of((i=e.stages.update)==null?void 0:i.uniforms)||[])/^u_count_/.test(o.name)&&o.expr!==null&&(t=Math.max(t,Number(this.values0[o.expr])||1));return Math.min(t,4096)}meshBuffers(e){const t=this.gl,i=this.meshData.get(e);if(!i)return null;const o=s=>{const n=t.createBuffer();return t.bindBuffer(t.ARRAY_BUFFER,n),t.bufferData(t.ARRAY_BUFFER,new Float32Array(s),t.STATIC_DRAW),n},a=t.createBuffer();return t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,a),t.bufferData(t.ELEMENT_ARRAY_BUFFER,new Uint32Array(i.indices),t.STATIC_DRAW),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,null),t.bindBuffer(t.ARRAY_BUFFER,null),{positions:o(i.positions),normals:o(i.normals),uvs:o(i.uvs),indices:a,count:i.indices.length}}createBakeTexture(){const e=this.gl,t=Math.max(1,this.effect.expressions.filter(o=>o.op==="BakeCurve"||o.op==="BakeGradient").length*2),i=e.createTexture();return e.bindTexture(e.TEXTURE_2D,i),e.texStorage2D(e.TEXTURE_2D,1,e.RGBA16F,at,t),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),{texture:i,rows:t,used:new Map}}buildSimProgram(e){const t=e.def,{init:i,update:o}=t.stages,a=[i,o].filter(A=>!!A),s=Wi(a),n=t.spawnFromEvent,u=n?this.byIndex.get(n.system):null,l=e.fields,c=e.layout.filter(A=>!A.counter).map(A=>`  attributes.${A.name} = ${ii("a_s",A)};`).join(`
`),f=wa(e,"v_s"),h=(t.sourceAttributes.length?t.sourceAttributes:[{name:"_unused",type:"float"}]).map(A=>`  ${A.type} ${A.name};`).join(`
`);let v="";const p=A=>{const R=Array.from({length:Vt[A.type]},(_,k)=>`parentComponent(parentIndex, ${A.offset+k})`);return Ro(A.type,R)};if(u)for(const A of t.sourceAttributes){const R=u.layout.find(_=>_.name===A.name);v+=R?`    sourceAttributes.${A.name} = ${p(R)};
`:`    sourceAttributes.${A.name} = ${lt(A.type)};
`}const x=u==null?void 0:u.layout.find(A=>A.counter===n.counter),w=[...new Set((o==null?void 0:o.events)||[])],m=ha(e.instance),g=e.instance.width,E=`${Ye}
${Object.entries(s).map(([A,R])=>`#define ${A} ${R}`).join(`
`)}
${Zt}
struct Attributes {
${[...l].map(([A,R])=>`  ${R} ${A};`).join(`
`)}
};
struct SourceAttributes {
${h}
};
${xa(a)}
${m.decls}
uniform uint uCapacity, uRing;
uniform usampler2D uParent;
${Array.from({length:e.slots},(A,R)=>`layout(location = ${R}) in uvec4 a_s${R};
flat out uvec4 v_s${R};`).join(`
`)}

uint parentComponent(uint particle, int c) {
  int texel = int(particle) * ${u?u.slots:1} + c / 4;
  return texelFetch(uParent, ivec2(texel % ${ot}, texel / ${ot}), 0)[c % 4];
}
${(i==null?void 0:i.functions)||""}
${(o==null?void 0:o.functions)||""}

void main() {
  uint index = uint(gl_VertexID);
  // Which copy's slot this particle is in (its row of instance data), and which particle of it.
  int inst = int(index / uCapacity);
  uint local = index - uint(inst) * uCapacity;
  uvec4 spawnA = texelFetch(uInstData, ivec2(${g-Bt}, inst), 0);
  uvec4 spawnB = texelFetch(uInstData, ivec2(${g-Bt+1}, inst), 0);
  // The slot is off this frame (its copy out of view or empty, or no copy): its particles stay as they are.
  if (spawnB.y == 0u) {
${Array.from({length:e.slots},(A,R)=>`    v_s${R} = a_s${R};`).join(`
`)}
    return;
  }
  uSpawnStart = spawnA.x;
  uSpawnCount = spawnA.y;
  uSpawnBase = spawnA.z;
  uSystemSeed = spawnA.w;
  uCursor = spawnB.x;
  uEmitterTime = uintBitsToFloat(spawnB.z);
${m.loads}
  Attributes attributes;
${[...l].map(([A,R])=>`  attributes.${A} = ${lt(R)};`).join(`
`)}
${c}
  SourceAttributes sourceAttributes;
${h.replace(/^ {2}(\w+) (\w+);$/gm,(A,R,_)=>`  sourceAttributes.${_} = ${lt(R)};`)}
${w.map(A=>`  uint ${A} = 0u;`).join(`
`)}

  bool spawnNow = false;
  uint particleIndex = 0u;
${u?`  uint parentIndex = uint(inst) * ${e.parentCapacity}u + local / uRing;
  uint sub = local % uRing;
  uint parentEvents = parentComponent(parentIndex, ${x?x.offset:0});
  ${n.mode==="die"?"spawnNow = sub < parentEvents;":"spawnNow = parentEvents > 0u && ((sub + uRing - uCursor) % uRing) < parentEvents;"}
  particleIndex = uSpawnBase + local;
  if (spawnNow) {
${v}  }`:`  uint rel = (local + uCapacity - uSpawnStart) % uCapacity;
  spawnNow = rel < uSpawnCount;
  particleIndex = uSpawnBase + rel;`}

  if (spawnNow) {
${[...l].map(([A,R])=>{var _;return`    attributes.${A} = ${((_=i==null?void 0:i.defaults)==null?void 0:_[A])??lt(R)};`}).join(`
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
${Object.entries((o==null?void 0:o.defaults)||{}).filter(([A])=>!e.layout.some(R=>R.name===A)).map(([A,R])=>`    attributes.${A} = ${R};`).join(`
`)}
    {
${(o==null?void 0:o.section)||""}
    }
  }
${f}
}`,S=`${Ye}out vec4 o; void main() { o = vec4(0.0); }`,C=Array.from({length:e.slots},(A,R)=>`v_s${R}`);return this.program(E,S,`${this.name} / ${e.name} simulation`,C)}buildShurikenRender(e){const{vs:t,fs:i}=oa({slots:e.slots,output:e.def.output,stages:e.def.stages},this.shurikenShaderParts(e,[e.def.stages.output])),o=ji(t,i,e);return this.program(o.vs,o.fs,`${this.name} / ${e.name} output`,null)}buildShurikenTrail(e){const t=[e.def.stages.output,e.def.stages.trail],{vs:i,fs:o}=aa({slots:e.slots,layout:e.layout,output:e.def.output,stages:e.def.stages},this.shurikenShaderParts(e,t));return this.program(i,o,`${this.name} / ${e.name} trails`,null)}shurikenShaderParts(e,t){const i=e.fields;return{header:Ye,lib:Zt,attributeDecl:`struct Attributes {
${[...i].map(([o,a])=>`  ${a} ${o};`).join(`
`)}
};`,uniformDecls:Hi(t),zeroInit:[...i].map(([o,a])=>`  attributes.${o} = ${lt(a)};`).join(`
`),loadAttributes:e.layout.filter(o=>!o.counter&&i.has(o.name)).map(o=>`  attributes.${o.name} = ${ii("a_s",o)};`).join(`
`)}}buildRenderProgram(e){var w,m;const t=e.def,i=t.stages.output,o=e.fields,a=Wi([i]),s=new Set(e.layout.map(g=>g.name)),n=e.layout.filter(g=>!g.counter&&o.has(g.name)).map(g=>`  attributes.${g.name} = ${ii("a_s",g)};`).join(`
`),u=g=>o.has(g),l=i.textures.find(g=>/mainTexture$/.test(g.name)),c=((w=t.output)==null?void 0:w.primitive)==="line",f=()=>`  vec3 size3 = vec3(${u("size")?"attributes.size":"0.1"});
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
  gl_Position = c;`,v=`${Ye}
${Object.entries(a).map(([g,E])=>`#define ${g} ${E}`).join(`
`)}
${Zt}
struct Attributes {
${[...o].map(([g,E])=>`  ${E} ${g};`).join(`
`)}
};
${Hi([i])}
uniform mat4 uViewProj;
uniform mat4 uModel;
uniform vec2 uViewport;
${Array.from({length:e.slots},(g,E)=>`layout(location = ${E}) in uvec4 a_s${E};`).join(`
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
${[...o].map(([g,E])=>`  attributes.${g} = ${s.has(g)?lt(E):i.defaults[g]??lt(E)};`).join(`
`)}
${n}
${u("alive")?"  if (!attributes.alive) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); vColor = vec4(0.0); vUV = vec2(0.0); return; }":""}
  {
${i.section}
  }
  vec2 corner = vec2(float(gl_VertexID & 1), float((gl_VertexID & 2) >> 1));
  vUV = corner;
  vColor = vec4(${u("color")?"attributes.color":"vec3(1.0)"}, ${u("alpha")?"attributes.alpha":"1.0"});
${c?h():f()}
}`,p=`${Ye}
in vec4 vColor;
in vec2 vUV;
${l?`uniform sampler2D ${l.name};`:""}
${To}
out vec4 fragColor;
void main() {
  vec4 color = vColor;
${l?`  color *= texture(${l.name}, vUV);`:""}
${(m=t.output)!=null&&m.alphaTest?"  if (color.a < 0.5) discard;":""}
  color.a = clamp(color.a, 0.0, 1.0);
  fragColor = vec4(fxTone(color.rgb), clamp(color.a * uFxTint.a, 0.0, 1.0));
}`,x=ji(v,p,e);return this.program(x.vs,x.fs,`${this.name} / ${e.name} output`,null)}program(e,t,i,o){const a=this.gl,s=(h,v)=>{const p=a.createShader(h);if(a.shaderSource(p,v),a.compileShader(p),!a.getShaderParameter(p,a.COMPILE_STATUS)){const x=a.getShaderInfoLog(p)??"",w=v.split(`
`),m=[...x.matchAll(/ERROR: \d+:(\d+)/g)].slice(0,3).map(g=>{var E;return`${g[1]}: ${(E=w[Number(g[1])-1])==null?void 0:E.trim()}`}).join(`
`);throw a.deleteShader(p),new Error(`${i}: shader compile failed
${x}
${m}`)}return p},n=a.createProgram(),u=s(a.VERTEX_SHADER,e),l=s(a.FRAGMENT_SHADER,t);if(a.attachShader(n,u),a.attachShader(n,l),o&&a.transformFeedbackVaryings(n,o,a.INTERLEAVED_ATTRIBS),a.linkProgram(n),a.deleteShader(u),a.deleteShader(l),!a.getProgramParameter(n,a.LINK_STATUS))throw new Error(`${i}: link failed
${a.getProgramInfoLog(n)}`);const c={},f=a.getProgramParameter(n,a.ACTIVE_UNIFORMS);for(let h=0;h<f;h++){const v=a.getActiveUniform(n,h).name.replace(/\[0\]$/,"");c[v]=a.getUniformLocation(n,v)}return{program:n,locations:c}}}class va{constructor(e,t={}){d(this,"time",0);d(this,"frame",0);d(this,"seed");d(this,"position",[0,0,0]);d(this,"rotation",[0,0,0,1]);d(this,"scale",1);d(this,"recolor",null);d(this,"tint",[1,1,1,1]);d(this,"density",1);d(this,"overrides",new Map);d(this,"playing",new Set);d(this,"looping");d(this,"values");d(this,"slot",-1);d(this,"hidden",!1);d(this,"veil",1);d(this,"pending",0);d(this,"spawnCounts",new Map);d(this,"ctx");d(this,"bake");d(this,"stoppedAt",null);d(this,"playedAt",new Map);d(this,"beamEnd",null);d(this,"states",[]);d(this,"stateOf",new Map);d(this,"spawners");d(this,"gl");d(this,"modelOut",new Float32Array(16));d(this,"recolorOut",null);d(this,"recolorSrc");this.asset=e;const i=this.gl=e.gl,o=e.effect;this.looping=!!o.looping&&!(t.once&&o.kind==="shuriken"),this.seed=(t.seed??Math.random()*4294967295)>>>0,this.values=e.values0,this.spawners=e.spawners.map(a=>({def:a,acc:0,timers:a.tasks.map(()=>null)})),this.ctx={time:0,deltaTime:0,frame:0,seed:this.seed,overrides:this.overrides},this.bake=(a,s)=>e.bakeRow(a,s),this.slot=e.pool.take();for(const a of e.pool.systems){const s=a.sys;let n=null;if(s.trail){const{points:c,interval:f}=s.def.output.trail,h=i.createTexture();i.bindTexture(i.TEXTURE_2D_ARRAY,h),i.texStorage3D(i.TEXTURE_2D_ARRAY,1,i.RGBA32UI,it,Math.ceil(s.capacity*s.slots/it),c),i.texParameteri(i.TEXTURE_2D_ARRAY,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D_ARRAY,i.TEXTURE_MAG_FILTER,i.NEAREST),n={texture:h,points:c,interval:f,head:0,count:0,last:-1/0,times:new Float64Array(c),ages:new Float32Array(c)}}const u=s.def.spawner?this.looping?s.def.spawner:{...s.def.spawner,looping:!1}:null,l={sys:s,ps:a,trail:n,ring:0,spawnBase:0,cursor:0,spawner:u,spawnState:u?Ni(u):null,emitterTime:0,life:pa(e,s),aliveUntil:0};l.aliveUntil=l.life===1/0?1/0:-1/0,this.states.push(l),this.stateOf.set(s.index,l)}this.play()}play(e=this.asset.effect.initialEvent){const t=this.asset.effect.events.find(i=>i.name===e);for(const i of(t==null?void 0:t.play)||[])this.playing.has(i)||this.playedAt.set(i,this.time),this.playing.add(i);for(const i of(t==null?void 0:t.stop)||[])this.playing.delete(i);this.stoppedAt=this.playing.size?null:this.time}stop(){this.play("OnStop"),this.asset.effect.events.some(e=>e.name==="OnStop")||(this.playing.clear(),this.stoppedAt=this.time)}get done(){const{playTime:e,fadeTime:t}=this.asset.effect;return!this.looping&&e!=null&&this.time>=e||t!=null&&this.stoppedAt!=null&&this.time-this.stoppedAt>=t?!0:this.settled()}settled(){if(this.looping||this.frame===0||this.asset.effect.kind!=="shuriken"||this.spawners.length)return!1;for(const e of this.states)if(this.time<=e.aliveUntil||e.spawner&&e.spawnState&&this.playing.has(e.sys.index)&&!ta(e.spawner,e.spawnState))return!1;for(const e of this.asset.effect.lights||[])if(!e.curve||this.time<e.curve.time)return!1;return!0}reset(e){const t=this.asset.pool;if(this.slot<0)this.slot=t.take();else for(const i of this.states)t.zero(i.ps,this.slot);this.pending=0,this.hidden=!1;for(const i of this.states)i.ring=0,i.spawnBase=0,i.cursor=0,i.spawnState=i.spawner?Ni(i.spawner):null,i.emitterTime=0,i.aliveUntil=i.life===1/0?1/0:-1/0,i.trail&&(i.trail.count=0,i.trail.last=-1/0);for(const i of this.spawners)i.acc=0,i.timers=i.def.tasks.map(()=>null);e!==void 0&&(this.seed=e>>>0),this.time=0,this.frame=0,this.playing.clear(),this.play()}setParam(e,t){const i=this.asset.effect.params.find(o=>o.name===e);i&&this.overrides.set(i.expr,t)}getParam(e){const t=this.asset.effect.params.find(i=>i.name===e);return t?this.overrides.has(t.expr)?this.overrides.get(t.expr):this.asset.effect.expressions[t.expr].value:void 0}setBeamEnd(e){this.beamEnd=e?[e[0],e[1],e[2]]:null}beamEnds(e){const t=this.asset.effect.systems[e].output.beam,i=this.beamEnd?this.toLocalPoint(this.beamEnd):t.end,o=t.growth>0?Math.min(1,Math.max(0,(this.time-(this.playedAt.get(e)??0))/t.growth)):1;return{start:t.start,end:[0,1,2].map(a=>t.start[a]+(i[a]-t.start[a])*o)}}bounds(){return Ao(this.asset,this.values)}recolorNow(){const e=this.recolor??this.asset.effect.recolor;return(!this.recolorOut||e!==this.recolorSrc)&&(this.recolorSrc=e,this.recolorOut=Zr(e)),this.recolorOut}model(){const e=this.rotation[0],t=this.rotation[1],i=this.rotation[2],o=this.rotation[3],a=this.scale,s=this.modelOut;return s[0]=-a*(1-2*(t*t+i*i)),s[1]=-a*(2*(e*t+i*o)),s[2]=-a*(2*(e*i-t*o)),s[3]=0,s[4]=a*(2*(e*t-i*o)),s[5]=a*(1-2*(e*e+i*i)),s[6]=a*(2*(t*i+e*o)),s[7]=0,s[8]=a*(2*(e*i+t*o)),s[9]=a*(2*(t*i-e*o)),s[10]=a*(1-2*(e*e+t*t)),s[11]=0,s[12]=this.position[0],s[13]=this.position[1],s[14]=this.position[2],s[15]=1,s}toLocalDir(e,t=[0,0,0]){const i=-this.rotation[0],o=-this.rotation[1],a=-this.rotation[2],s=this.rotation[3],n=2*(o*e[2]-a*e[1]),u=2*(a*e[0]-i*e[2]),l=2*(i*e[1]-o*e[0]);return t[0]=-(e[0]+s*n+(o*l-a*u)),t[1]=e[1]+s*u+(a*n-i*l),t[2]=e[2]+s*l+(i*u-o*n),t}toLocalPoint(e,t=[0,0,0]){const i=Ta;return i[0]=e[0]-this.position[0],i[1]=e[1]-this.position[1],i[2]=e[2]-this.position[2],this.toLocalDir(i,t),t[0]/=this.scale,t[1]/=this.scale,t[2]/=this.scale,t}lights(e,t=1){for(const i of this.asset.effect.lights||[]){const o=Jr(i,this.time)*t*this.veil;if(!(o>0))continue;const a=_a([-i.position[0]*this.scale,i.position[1]*this.scale,i.position[2]*this.scale],this.rotation);e.push({x:this.position[0]+a[0],y:this.position[1]+a[1],z:this.position[2]+a[2],radius:i.range*this.scale,r:i.color[0],g:i.color[1],b:i.color[2],intensity:o})}}update(e,t=1){const i=this.asset.pool;i.beginFrame(),this.advance(e,t),i.simulate(o=>this.asset.bindSimTextures(o)),this.afterSimulate()}idle(e){e=Math.min(e,1/15),this.time+=e,this.pending=Math.min(this.pending+e,Gi)}advance(e,t=1){var l;const i=this.asset,o=i.pool;e=Math.min(e,1/15),this.time+=e,this.frame++;const a=Math.min(e+this.pending,Gi);this.pending=0,e=a;const s=this.ctx;s.time=this.time,s.deltaTime=e,s.frame=this.frame,s.seed=this.seed,this.values=bo(i.effect.expressions,s,this.bake,this.values);const n=this.spawnCounts;n.clear();for(const c of this.spawners){if(!this.playing.has(c.def.index))continue;const f=this.runSpawner(c,e,t);for(const h of c.def.targets)n.set(h,(n.get(h)||0)+f)}for(const c of this.states){if(!c.spawner||!c.spawnState||!this.playing.has(c.sys.index))continue;const f=ia(c.spawner,c.spawnState,e,t);n.set(c.sys.index,(n.get(c.sys.index)||0)+f.count),c.emitterTime=f.emitterTime}for(const c of this.states)c.life!==1/0&&!c.sys.def.spawnFromEvent&&(n.get(c.sys.index)||0)>=1&&(c.aliveUntil=Math.max(c.aliveUntil,this.time+c.life));for(let c=0;c<2;c++)for(const f of this.states){const h=f.sys.def.spawnFromEvent;f.life!==1/0&&h&&(f.aliveUntil=(((l=this.stateOf.get(h.system))==null?void 0:l.aliveUntil)??1/0)+f.life)}const u=i.exprTypes;for(const c of this.states){if(this.time>c.aliveUntil)continue;const f=c.sys,h=c.ps,v=h.rows,p=o.rowAt(h,this.slot),x=f.instance.at;for(const E of ya){const S=f.def.stages[E];if(S)for(const C of S.uniforms)C.expr!==null&&ti(v,h.floats,p+x[C.name]*4,C.type,this.values[C.expr],u[C.expr])}const w=p+(h.width-Bt)*4,m=w+4;v[w+3]=(this.seed^Math.imul(f.index+1,2654435761))>>>0,v[w+2]=c.spawnBase>>>0,h.floats[m+2]=c.emitterTime;const g=f.def.spawnFromEvent;if(g)v[m]=c.cursor%f.ringK,c.cursor=(c.cursor+(g.ringStep||1))%f.ringK,c.spawnBase+=f.capacity;else{const E=Math.min(f.capacity,Math.floor(n.get(f.index)||0));v[w]=c.ring,v[w+1]=E,c.ring=(c.ring+E)%f.capacity,c.spawnBase+=E}o.on(h,this.slot)}}afterSimulate(){for(const e of this.states)e.trail&&this.time<=e.aliveUntil&&this.recordTrail(e,e.trail)}park(){this.slot<0||(this.asset.pool.free(this.slot),this.slot=-1)}draw(e){if(this.slot<0)return 0;const t=this.asset.pool,i=ba(e.projection,e.view);t.beginDraw();let o=0;if(this.stageDraw(e)){t.uploadDraw();for(const a of this.asset.drawOrder){const s=this.stateOf.get(a.index);!a.render||!this.rowOn(s)||(o+=this.asset.drawSystem(a,s.ps,e,i,this.slot,a.capacity,t.drawVao(s.ps,this.slot),this.beamOf(a)))}}return o+this.drawTrails(e,i)}stageDraw(e){if(this.slot<0)return!1;const t=this.asset,i=t.pool,o=this.model(),a=e.view,s=this.toLocalDir(ri(oi,a[0],a[4],a[8]),Ea),n=this.toLocalDir(ri(oi,a[1],a[5],a[9]),Aa),u=this.toLocalDir(ri(oi,a[2],a[6],a[10]),Ra),l=this.toLocalPoint(e.eye,Fa),c=this.recolorNow(),f=t.exprTypes;let h=!1;for(const v of this.states){const p=v.sys;if(!p.render||this.time>v.aliveUntil)continue;const x=p.def.output;if((x==null?void 0:x.mode)==="beam"&&!this.playing.has(p.index))continue;const w=this.time-(this.playedAt.get(p.index)??0);let m=0;if(x!=null&&x.vat){const F=Kr(x.vat,w);if(F===null)continue;m=F}let g=o,E=l;const S=p.def.anchor;if(S){const{end:F}=this.beamEnds(S.beam),M=[0,1,2].map(D=>F[D]-S.origin[D]);g=Array.from(o);for(let D=0;D<3;D++)g[12+D]+=o[D]*M[0]+o[4+D]*M[1]+o[8+D]*M[2];E=[l[0]-M[0],l[1]-M[1],l[2]-M[2]]}const C=v.ps,A=C.drawRows,R=C.drawFloats,_=i.drawRowAt(C,this.slot),k=p.draw.at,B=p.def.stages.output;if(B)for(const F of B.uniforms)F.expr!==null&&ti(A,R,_+k[F.name]*4,F.type,this.values[F.expr],f[F.expr]);for(const F of p.animated)ti(A,R,_+k[F.name]*4,F.type,qr(F.anim,w),"float");const y=_+(p.draw.width-pt)*4;R[y]=g[0],R[y+1]=g[4],R[y+2]=g[8],R[y+3]=g[12],R[y+4]=g[1],R[y+5]=g[5],R[y+6]=g[9],R[y+7]=g[13],R[y+8]=g[2],R[y+9]=g[6],R[y+10]=g[10],R[y+11]=g[14],R[y+12]=this.tint[0],R[y+13]=this.tint[1],R[y+14]=this.tint[2],R[y+15]=this.tint[3]*this.veil;for(let F=0;F<3;F++)for(let M=0;M<3;M++)R[y+16+F*4+M]=c[F*3+M];for(let F=0;F<3;F++)R[y+28+F]=s[F],R[y+32+F]=n[F],R[y+36+F]=u[F],R[y+40+F]=E[F];R[y+43]=this.time,R[y+45]=m,i.drawOn(C,this.slot),h=!0}return h}rowOn(e){const t=e.ps;return t.drawRows[this.asset.pool.drawRowAt(t,this.slot)+(t.drawWidth-pt+11)*4]===1}rowOnFor(e){const t=this.stateOf.get(e.index);return!!t&&this.rowOn(t)}beamOf(e){var t;return(t=e.def.output)!=null&&t.beam?this.beamEnds(e.index):null}drawTrails(e,t){if(this.slot<0)return 0;const i=this.gl,o=this.asset.pool;let a=0,s=null,n=null,u=null;for(const l of this.asset.drawOrder){const c=this.stateOf.get(l.index),f=l.trail,h=c.trail;if(!f||!h||this.time>c.aliveUntil)continue;const v=l.def.output;if(!s){const g=e.view;s=new Float32Array([...this.toLocalDir([g[0],g[4],g[8]]),...this.toLocalDir([g[1],g[5],g[9]]),...this.toLocalDir([g[2],g[6],g[10]])]),n=this.toLocalPoint(e.eye),u=this.model()}i.useProgram(f.program);let p=this.bindUniforms(f,["output","trail"],l);const x=f.locations;i.uniformMatrix4fv(x.uViewProj,!1,t),i.uniformMatrix4fv(x.uModel,!1,u),i.uniformMatrix3fv(x.vfxViewRot,!1,s),i.uniform3fv(x.vfxViewPosition,n),i.uniform2fv(x.uViewport,e.viewport),x.uFxExposure&&i.uniform1f(x.uFxExposure,e.exposure),x.uFxToneMap&&i.uniform1f(x.uFxToneMap,e.toneMap?1:0),x.uFxTint&&i.uniform4fv(x.uFxTint,this.tint);const w=v.trail.material;x.uProjScale&&i.uniform1f(x.uProjScale,1/e.projection[5]),x.uSystemRotation&&v.systemRotation&&i.uniformMatrix4fv(x.uSystemRotation,!1,v.systemRotation),x.uTime&&i.uniform1f(x.uTime,this.time),x.uDeltaTime&&i.uniform1f(x.uDeltaTime,1/60),x.uCameraPos&&i.uniform3fv(x.uCameraPos,e.eye),x.uRecolor&&i.uniformMatrix3fv(x.uRecolor,!1,this.recolorNow());for(const g of(w==null?void 0:w.uniforms)||[])x[g.name]&&gi(i,x[g.name],g.type,g.value,"float");const m=(g,E)=>{x[g]&&(i.activeTexture(i.TEXTURE0+p),i.bindTexture(i.TEXTURE_2D,E),i.uniform1i(x[g],p),p++)};m("uWhite",Nt(i));for(const g of(w==null?void 0:w.textures)||[])m(g.name,this.asset.textures.get(g.key)||Nt(i));if(!(w!=null&&w.blend))i.disable(i.BLEND),i.depthMask(!0);else{i.enable(i.BLEND);const g=i;i.blendFuncSeparate(g[w.blend.src]??i.SRC_ALPHA,g[w.blend.dst]??i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE),i.depthMask(!!w.depthWrite)}i.disable(i.CULL_FACE),i.activeTexture(i.TEXTURE0+p),i.bindTexture(i.TEXTURE_2D_ARRAY,h.texture),i.uniform1i(x.uTrailHistory,p),i.uniform1i(x.uTrailHead,h.head),i.uniform1i(x.uTrailCount,h.count);for(let g=0;g<h.points;g++)h.ages[g]=this.time-h.times[(h.head-g+h.points)%h.points];i.uniform1fv(x.uTrailAge,h.ages),i.bindVertexArray(o.trailVao(c.ps,this.slot)),i.drawArraysInstanced(i.TRIANGLE_STRIP,0,ra(v.trail),l.capacity),a++}return i.bindVertexArray(null),a}dispose(){const e=this.gl;this.park();for(const t of this.states)t.trail&&e.deleteTexture(t.trail.texture);this.states.length=0,this.stateOf.clear()}stats(){return this.asset.systems.map(e=>({name:e.name,capacity:e.capacity}))}recordTrail(e,t){if(this.time-t.last<t.interval*.999)return;const i=this.gl;t.last=this.time,t.head=(t.head+1)%t.points,t.count=Math.min(t.count+1,t.points),t.times[t.head]=this.time;const o=e.sys.capacity*e.sys.slots,a=Math.floor(o/it),s=o-a*it,n=this.asset.pool.offset(e.ps,this.slot);i.bindBuffer(i.PIXEL_UNPACK_BUFFER,e.ps.buffers[e.ps.current]),i.bindTexture(i.TEXTURE_2D_ARRAY,t.texture),a&&i.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,t.head,it,a,1,i.RGBA_INTEGER,i.UNSIGNED_INT,n),s&&i.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,a,t.head,s,1,1,i.RGBA_INTEGER,i.UNSIGNED_INT,n+a*it*16),i.bindBuffer(i.PIXEL_UNPACK_BUFFER,null)}bindUniforms(e,t,i){const o=this.gl;let a=0;o.activeTexture(o.TEXTURE0),o.bindTexture(o.TEXTURE_2D,this.asset.bakeTexture),e.locations.bakedTexture&&o.uniform1i(e.locations.bakedTexture,a),a++;for(const s of t){const n=i.def.stages[s];if(n){for(const u of n.uniforms){const l=e.locations[u.name];!l||u.expr===null||gi(o,l,u.type,this.values[u.expr],this.asset.exprTypes[u.expr])}for(const u of n.textures){const l=e.locations[u.name];if(!l)continue;const c=u.expr!==null?this.values[u.expr]:null;o.activeTexture(o.TEXTURE0+a),u.type==="sampler3D"?o.bindTexture(o.TEXTURE_3D,this.asset.texture3D(c)):o.bindTexture(o.TEXTURE_2D,this.asset.textures.get(c)||yi(o)),o.uniform1i(l,a),a++}}}return a}runSpawner(e,t,i){let o=0;const a=e.def.tasks;for(let s=0;s<a.length;s++){const n=a[s];if(n.kind==="constantRate"){e.acc+=Math.max(0,Number(this.values[n.values.Rate])||0)*t*i;const u=Math.floor(e.acc);e.acc-=u,o+=u}else if(n.kind==="periodicBurst"||n.kind==="burst"){const u=n.values.nb??n.values.Count??n.values.count,l=n.values.period??n.values.delay??n.values.Delay;if(e.timers[s]===null&&(e.timers[s]=0),e.timers[s]-=t,e.timers[s]<=0){if(n.kind==="burst"&&e.timers[s]===-1/0)continue;o+=Math.max(0,Math.round(Yi(this.values[u])*i)),e.timers[s]=n.kind==="burst"?-1/0:Math.max(.001,Yi(this.values[l])||1)}}}return o}}function pa(r,e){var s,n,u;const t=e.def,i=t.output;if(r.effect.kind!=="shuriken"||t.anchor||i!=null&&i.beam||i!=null&&i.vat||i!=null&&i.trail||(s=t.spawner)!=null&&s.prewarm)return 1/0;const o=Number(t.maxLifetime);if(!(o>0)||!Number.isFinite(o))return 1/0;const a=t.spawnFromEvent?r.effect.systems[t.spawnFromEvent.system]:void 0;return o/(((n=t.spawner)==null?void 0:n.simulationSpeed)||((u=a==null?void 0:a.spawner)==null?void 0:u.simulationSpeed)||1)+.1}async function ga(r,e,t={}){var c,f,h,v,p,x,w;const i=await(await fetch(e)).json(),o=new URL(e,((c=globalThis.location)==null?void 0:c.href)??"http://localhost/"),a=t.resolve??(m=>new URL(m,o).href),s=new Map,n=m=>{var g,E;return!!((E=(g=i.textureInfo)==null?void 0:g[m])!=null&&E.srgb)},u=new Set(i.expressions.filter(m=>m.op==="Value"&&m.type==="texture"&&m.value).map(m=>m.value));for(const m of i.systems)for(const g of[...((h=(f=m.output)==null?void 0:f.material)==null?void 0:h.textures)||[],...((x=(p=(v=m.output)==null?void 0:v.trail)==null?void 0:p.material)==null?void 0:x.textures)||[]])g.key&&u.add(g.key);await Promise.all([...u].map(async m=>{var g,E;m==="default-particle.png"?s.set(m,yi(r)):m.startsWith("missing:")?s.set(m,null):s.set(m,await Da(r,a(m),n(m),!!((E=(g=i.textureInfo)==null?void 0:g[m])!=null&&E.nearest)))}));const l=new Map;for(const m of i.systems){const g=(w=m.output)==null?void 0:w.mesh;g&&!l.has(g)&&l.set(g,await(await fetch(a(g))).json())}return new ma(r,i,{textures:s,meshes:l,maxCapacity:t.maxCapacity})}function Ao(r,e){let t=null,i=null;for(const a of r.systems){const s=a.def.bounds,n=(s==null?void 0:s.center)!=null?e[s.center]:null,u=(s==null?void 0:s.size)!=null?e[s.size]:null;if(!Array.isArray(n)||!Array.isArray(u))continue;const l=n.map((f,h)=>f-u[h]/2),c=n.map((f,h)=>f+u[h]/2);t=t?t.map((f,h)=>Math.min(f,l[h])):l,i=i?i.map((f,h)=>Math.max(f,c[h])):c}if(!t||!i)return null;const o=i;return{center:t.map((a,s)=>(a+o[s])/2),size:o.map((a,s)=>a-t[s])}}function Wi(r){const e={};for(const t of r)Object.assign(e,t.defines);return e}function ji(r,e,t){const i=(p,x,w)=>p.replace(new RegExp(`uniform ${x} ${w};`),`${x} ${w};`),o=(p,x)=>new RegExp(`\\b${x}\\b`).test(p),a=r.indexOf("void main() {"),s=e.indexOf("void main() {");if(a<0||s<0)throw new Error(`${t.name}: render shader without main`);let n=i(i(i(i(r,"mat3","vfxViewRot"),"vec3","vfxViewPosition"),"mat4","uModel"),"float","uVatTime");const u=t.draw.fields.filter(p=>o(r.slice(0,a),`uniform ${p.type} ${p.name};`.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"))||r.includes(`uniform ${p.type} ${p.name};`));for(const p of u)n=i(n,p.type,p.name);const l=[ei.vsDecls,n.includes("float uTime;")||/uniform float uTime;/.test(n)?"":"float uTime;",n.includes("float uVatTime;")?"":"float uVatTime;"].filter(Boolean).join(`
`);n=n.replace(Ye,`${Ye}${l}
`);const c=[ei.vsLoads,...u.map(p=>`  ${p.name} = ${pi(p,"uDrawRows")};`)].join(`
`);n=n.replace("void main() {",`void main() {
${c}`);let f=i(i(i(e,"vec4","uFxTint"),"mat3","uRecolor"),"float","uTime");const h=t.draw.fields.filter(p=>t.animated.some(x=>x.name===p.name)&&e.includes(`uniform ${p.type} ${p.name};`));for(const p of h)f=i(f,p.type,p.name);const v=["  int inst = int(vRow + 0.5);","  uFxTint = uintBitsToFloat(texelFetch(uDrawRows, ivec2(uDrawFixed + 3, inst), 0));",...o(e,"uRecolor")?["  uRecolor = mat3(uintBitsToFloat(texelFetch(uDrawRows, ivec2(uDrawFixed + 4, inst), 0).xyz), uintBitsToFloat(texelFetch(uDrawRows, ivec2(uDrawFixed + 5, inst), 0).xyz), uintBitsToFloat(texelFetch(uDrawRows, ivec2(uDrawFixed + 6, inst), 0).xyz));"]:[],...o(e,"uTime")?["  uTime = uintBitsToFloat(texelFetch(uDrawRows, ivec2(uDrawFixed + 10, inst), 0).w);"]:[],...h.map(p=>`  ${p.name} = ${pi(p,"uDrawRows")};`)].join(`
`);return f=f.replace(Ye,`${Ye}${ei.fsDecls}
`),f=f.replace("void main() {",`void main() {
${v}`),{vs:n,fs:f}}function xa(r){const e=[];for(const t of r)for(const i of t.textures)e.push(`uniform ${i.type} ${i.name};`);return[...new Set(e)].join(`
`)}function Hi(r){const e=[];for(const t of r){for(const i of t.uniforms)e.push(`uniform ${i.type} ${i.name};`);for(const i of t.textures)e.push(`uniform ${i.type} ${i.name};`)}return[...new Set(e)].join(`
`)}function ii(r,e){const t=Array.from({length:Vt[e.type]},(i,o)=>{const a=e.offset+o;return`${r}${a>>2}.${"xyzw"[a&3]}`});return Ro(e.type,t)}function Ro(r,e){if(r==="bool")return`(${e[0]} != 0u)`;if(/^(uint|uvec)/.test(r))return e.length===1?e[0]:`${r}(${e.join(", ")})`;if(/^(int|ivec)/.test(r))return e.length===1?`int(${e[0]})`:`${r}(${e.map(i=>`int(${i})`).join(", ")})`;const t=e.map(i=>`uintBitsToFloat(${i})`);return t.length===1?t[0]:`${r}(${t.join(", ")})`}function wa(r,e){const t=new Array(r.slots*4).fill("0u");for(const i of r.layout){const o=Vt[i.type];for(let a=0;a<o;a++){const s=i.counter?i.counter.replace(/^__/,""):`attributes.${i.name}${o>1?`.${"xyzw"[a]}`:""}`;t[i.offset+a]=i.counter?s:i.type==="bool"?`(${s} ? 1u : 0u)`:/^(uint|uvec)/.test(i.type)?s:/^(int|ivec)/.test(i.type)?`uint(${s})`:`floatBitsToUint(${s})`}}return Array.from({length:r.slots},(i,o)=>`  ${e}${o} = uvec4(${t.slice(o*4,o*4+4).join(", ")});`).join(`
`)}function gi(r,e,t,i,o){if(i==null)return;const a=(n,u)=>{const l=new ArrayBuffer(4);return u?(new Uint32Array(l)[0]=n>>>0,new Float32Array(l)[0]):(new Float32Array(l)[0]=n,new Uint32Array(l)[0])},s=o==="uint"||o==="int";switch(t){case"float":r.uniform1f(e,s?a(i,!0):i);break;case"vec2":r.uniform2fv(e,i);break;case"vec3":r.uniform3fv(e,i);break;case"vec4":r.uniform4fv(e,i);break;case"uint":r.uniform1ui(e,s?i>>>0:a(i,!1));break;case"int":r.uniform1i(e,s?i|0:a(i,!1)|0);break;case"bool":r.uniform1i(e,i?1:0);break;case"mat4":r.uniformMatrix4fv(e,!1,i);break;case"mat3":r.uniformMatrix3fv(e,!1,i);break}}function Fo(r,e){const t=r.expressions[e];if(t.op==="Value")return t.type??"float";if(/^Bitwise|ToUint$|^SystemSeed$|^FrameIndex$/.test(t.op))return"uint";if(/ToInt$/.test(t.op))return"int";if(t.op==="ExtractComponent"||/^(Abs|Sign|Min|Max|Add|Subtract|Mul|Divide)$/.test(t.op)){const i=Fo(r,t.args[0]);return i==="uint"||i==="int"?i:"float"}return"float"}function Yi(r){return Array.isArray(r)?r[0]+Math.random()*((r[1]??r[0])-r[0]):r}function ba(r,e){const t=new Float32Array(16);for(let i=0;i<4;i++)for(let o=0;o<4;o++){let a=0;for(let s=0;s<4;s++)a+=r[s*4+o]*e[i*4+s];t[i*4+o]=a}return t}const ya=["init","update"],Ta=[0,0,0],oi=[0,0,0],Ea=[0,0,0],Aa=[0,0,0],Ra=[0,0,0],Fa=[0,0,0];function ri(r,e,t,i){return r[0]=e,r[1]=t,r[2]=i,r}function _a(r,e){const[t,i,o,a]=[e[0],e[1],e[2],e[3]],s=2*(i*r[2]-o*r[1]),n=2*(o*r[0]-t*r[2]),u=2*(t*r[1]-i*r[0]);return[r[0]+a*s+(i*u-o*n),r[1]+a*n+(o*s-t*u),r[2]+a*u+(t*n-i*s)]}const xi=new WeakMap,wi=new WeakMap,Ma=(r,e)=>xi.get(r)===e||wi.get(r)===e;function yi(r){const e=xi.get(r);if(e)return e;const t=64,i=new Uint8Array(t*t*4);for(let a=0;a<t;a++)for(let s=0;s<t;s++){const n=(s+.5)/t*2-1,u=(a+.5)/t*2-1,l=Math.min(1,Math.hypot(n,u));i.set([255,255,255,Math.round(Math.pow(1-l,1.6)*255)],(a*t+s)*4)}const o=r.createTexture();return r.bindTexture(r.TEXTURE_2D,o),r.texImage2D(r.TEXTURE_2D,0,r.RGBA8,t,t,0,r.RGBA,r.UNSIGNED_BYTE,i),r.generateMipmap(r.TEXTURE_2D),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR_MIPMAP_LINEAR),xi.set(r,o),o}function Sa(r,e=16){const t=new Uint8Array(e*e*e*4);for(let o=0;o<e;o++)for(let a=0;a<e;a++)for(let s=0;s<e;s++){const[n,u,l]=[s/e,a/e,o/e].map(f=>f*Math.PI*2),c=[Math.sin(u*1.3+l)*Math.cos(n),Math.sin(l*1.7+n)*Math.cos(u),Math.sin(n*1.1+u)*Math.cos(l)];t.set([...c.map(f=>Math.round((f*.5+.5)*255)),255],((o*e+a)*e+s)*4)}const i=r.createTexture();r.bindTexture(r.TEXTURE_3D,i),r.texImage3D(r.TEXTURE_3D,0,r.RGBA8,e,e,e,0,r.RGBA,r.UNSIGNED_BYTE,t),r.texParameteri(r.TEXTURE_3D,r.TEXTURE_MIN_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_3D,r.TEXTURE_MAG_FILTER,r.LINEAR);for(const o of[r.TEXTURE_WRAP_S,r.TEXTURE_WRAP_T,r.TEXTURE_WRAP_R])r.texParameteri(r.TEXTURE_3D,o,r.REPEAT);return i}function Nt(r){let e=wi.get(r);return e||(e=r.createTexture(),r.bindTexture(r.TEXTURE_2D,e),r.texImage2D(r.TEXTURE_2D,0,r.RGBA8,1,1,0,r.RGBA,r.UNSIGNED_BYTE,new Uint8Array([255,255,255,255])),wi.set(r,e)),e}async function Da(r,e,t,i=!1){const o=await createImageBitmap(await(await fetch(e)).blob(),{imageOrientation:"flipY",premultiplyAlpha:"none",colorSpaceConversion:"none"}),a=r.createTexture();return r.bindTexture(r.TEXTURE_2D,a),r.texImage2D(r.TEXTURE_2D,0,t?r.SRGB8_ALPHA8:r.RGBA8,r.RGBA,r.UNSIGNED_BYTE,o),i?(r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,r.NEAREST)):(r.generateMipmap(r.TEXTURE_2D),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR_MIPMAP_LINEAR)),o.close(),a}const Ca={enabled:!0,quality:1,maxCapacity:5e4,lights:!0,lightScale:1,cull:!0,cullRadius:6,cullPixels:3};function Pa(r,e,t,i){const o=t[5]*i/2;return t[15]===1?r*o:r*o/Math.max(1e-6,e)}class Ua{constructor(e){d(this,"settings",{...Ca});d(this,"speed",1);d(this,"instances",[]);d(this,"assets",new Map);d(this,"pools",new Map);d(this,"lives",new Map);d(this,"once",new WeakSet);d(this,"reach",new Map);d(this,"planes",new Float32Array(24));d(this,"culled",0);d(this,"passes",0);this.gl=e}load(e,t={}){let i=this.assets.get(e);return i||(i=ga(this.gl,e,{maxCapacity:this.settings.maxCapacity,...t}),this.assets.set(e,i),i.catch(()=>this.assets.delete(e))),i}play(e,t={}){const i=!!t.once,o=this.pools.get(e),a=(o==null?void 0:o.findIndex(n=>this.once.has(n)===i))??-1;let s;o&&a>=0?(s=o.splice(a,1)[0],s.reset(Math.random()*4294967295),s.overrides.clear()):(s=new va(e,{once:i}),i&&this.once.add(s)),s.position=t.position?[t.position[0],t.position[1],t.position[2]]:[0,0,0],s.rotation=t.rotation?[...t.rotation]:t.yaw!==void 0?[0,Math.sin(t.yaw/2),0,Math.cos(t.yaw/2)]:[0,0,0,1],s.scale=t.scale??1,s.tint=t.tint?[...t.tint]:[1,1,1,1],s.recolor=t.recolor?[...t.recolor]:null,s.density=Math.max(0,t.density??1);for(const[n,u]of Object.entries(t.params??{}))s.setParam(n,u);return t.life!==void 0?this.lives.set(s,t.life):this.lives.delete(s),this.instances.push(s),s}release(e){const t=this.instances.indexOf(e);if(t<0)return;this.instances.splice(t,1),this.lives.delete(e),e.park();let i=this.pools.get(e.asset);i||this.pools.set(e.asset,i=[]),i.push(e)}clear(){for(const e of this.instances)e.dispose();for(const e of this.pools.values())for(const t of e)t.dispose();this.instances.length=0,this.pools.clear(),this.lives.clear()}update(e,t){if(!this.settings.enabled||(e*=Math.max(0,this.speed),e<=0))return;const i=Math.max(0,Math.min(1,this.settings.quality)),o=t&&this.settings.cull?this.culler(t):null,a=new Set;for(const s of this.instances)a.add(s.asset);for(const s of a)s.pool.beginFrame();this.culled=0;for(const s of this.instances){const n=this.settings.visibleAt;s.veil=n?Math.max(0,Math.min(1,n(s.position[0],s.position[1],s.position[2]))):1,s.hidden=!!o&&o(s)||s.veil<=0,s.hidden?(s.idle(e),this.culled++):s.advance(e,i*s.density)}this.passes=0;for(const s of a)s.pool.simulate(n=>s.bindSimTextures(n)),this.passes+=s.pool.passes;for(const s of[...this.instances]){s.hidden||s.afterSimulate();const n=this.lives.get(s);(s.done||n!==void 0&&s.time>=n)&&this.release(s)}}culler(e){const t=ut(ve(e.projection,e.view),this.planes),i=e.view,o=this.settings.cullPixels;return a=>{const s=this.reachOf(a.asset)*a.scale;if(!Number.isFinite(s))return!1;const[n,u,l]=a.position;for(let c=0;c<6;c++)if(t[c*4]*n+t[c*4+1]*u+t[c*4+2]*l+t[c*4+3]<-s)return!0;if(o>0){const c=-(i[2]*n+i[6]*u+i[10]*l+i[14]);if(c>s&&Pa(s,c,e.projection,e.viewport[1])<o)return!0}return!1}}reachOf(e){let t=this.reach.get(e);if(t===void 0){if(e.effect.systems.some(i=>{var o;return((o=i.output)==null?void 0:o.beam)||i.anchor}))t=1/0;else{const i=e.bounds();t=i?Math.hypot(i.center[0],i.center[1],i.center[2])+Math.hypot(i.size[0],i.size[1],i.size[2])/2:this.settings.cullRadius,t=t*1.2+.5}this.reach.set(e,t)}return t}draw(e){var s;if(!this.settings.enabled||!this.instances.length)return 0;const t=this.gl;t.enable(t.DEPTH_TEST),t.depthFunc(t.LEQUAL);const i=ve(e.projection,e.view),o=[];for(const n of this.instances)n.hidden||(o.includes(n.asset)||(o.push(n.asset),n.asset.pool.beginDraw()),n.stageDraw(e));let a=0;for(const n of o){const u=n.pool;u.uploadDraw();for(const l of n.drawOrder){if(!l.render)continue;const c=u.systemOf(l);if(c.drawActive)if((s=l.def.output)!=null&&s.beam)for(const f of this.instances)!f.hidden&&f.asset===n&&f.rowOnFor(l)&&(a+=n.drawSystem(l,c,e,i,f.slot,l.capacity,u.drawVao(c,f.slot),f.beamOf(l)));else a+=n.drawSystem(l,c,e,i,0,c.drawActive*l.capacity,u.drawVaoAll(c),null)}}for(const n of this.instances)n.hidden||(a+=n.drawTrails(e,i));return t.bindVertexArray(null),t.depthFunc(t.LESS),t.depthMask(!0),t.disable(t.BLEND),t.enable(t.CULL_FACE),t.cullFace(t.BACK),t.activeTexture(t.TEXTURE0),a}lights(e){if(!(!this.settings.enabled||!this.settings.lights))for(const t of this.instances)t.lights(e,this.settings.lightScale)}get count(){return this.instances.length}}const ka={enabled:!0,strength:1},za=[{dir:[1,0,0],up:[0,-1,0]},{dir:[-1,0,0],up:[0,-1,0]},{dir:[0,1,0],up:[0,0,1]},{dir:[0,-1,0],up:[0,0,-1]},{dir:[0,0,1],up:[0,-1,0]},{dir:[0,0,-1],up:[0,-1,0]}];class La{constructor(e,t=64){d(this,"texture");d(this,"fbo");d(this,"mips");d(this,"invViewProj",[]);this.gl=e,this.size=t;const i=e.createTexture(),o=e.createFramebuffer();if(!i||!o)throw new Error("env map allocation failed");this.texture=i,this.fbo=o,this.mips=Math.floor(Math.log2(t)),e.bindTexture(e.TEXTURE_CUBE_MAP,i);for(let s=0;s<6;s++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+s,0,e.RGBA16F,t,t,0,e.RGBA,e.HALF_FLOAT,null);e.texParameteri(e.TEXTURE_CUBE_MAP,e.TEXTURE_MIN_FILTER,e.LINEAR_MIPMAP_LINEAR),e.texParameteri(e.TEXTURE_CUBE_MAP,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_CUBE_MAP,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_CUBE_MAP,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.bindTexture(e.TEXTURE_CUBE_MAP,null);const a=uo(Math.PI/2,1,.1,10);for(const s of za)this.invViewProj.push(et(ve(a,Xt([0,0,0],s.dir,s.up))))}bindFace(e){const t=this.gl;t.bindFramebuffer(t.FRAMEBUFFER,this.fbo),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+e,this.texture,0),t.viewport(0,0,this.size,this.size)}finish(){const e=this.gl;e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindTexture(e.TEXTURE_CUBE_MAP,this.texture),e.generateMipmap(e.TEXTURE_CUBE_MAP),e.bindTexture(e.TEXTURE_CUBE_MAP,null)}bind(e){const t=this.gl;t.activeTexture(t.TEXTURE0+e),t.bindTexture(t.TEXTURE_CUBE_MAP,this.texture)}}const Ia=30;function Ba(r){const e=r.eye();if(r.target)return{focus:r.target,distance:r.distance??Math.hypot(r.target[0]-e[0],r.target[1]-e[1],r.target[2]-e[2])};const t=r.view(),i=r.distance??Ia;return{focus:[e[0]-t[2]*i,e[1]-t[6]*i,e[2]-t[10]*i],distance:i}}const kt=64,Va=4096;function Na(){return{keys:new Float64Array(256),counts:new Int32Array(kt+1),tmp:[]}}function Oa(r,e,t){const i=r.length;t.keys.length<i&&(t.keys=new Float64Array(i*2));const o=t.keys;let a=1/0,s=-1/0;for(let c=0;c<i;c++){const f=r[c].model,h=(f[12]-e[0])**2+(f[13]-e[1])**2+(f[14]-e[2])**2;o[c]=h,h<a&&(a=h),h>s&&(s=h)}if(!(s>a)||!Number.isFinite(s-a))return;const n=t.counts;n.fill(0);const u=kt/(s-a);for(let c=0;c<i;c++){const f=Math.max(0,Math.min(kt-1,(o[c]-a)*u|0));o[c]=f,n[f+1]++}for(let c=0;c<kt;c++)n[c+1]+=n[c];const l=t.tmp;l.length=i;for(let c=0;c<i;c++)l[n[o[c]]++]=r[c];for(let c=0;c<i;c++)r[c]=l[c];l.length=0}function St(r){if(r.size>Va){r.clear();return}for(const e of r.values())e.length=0}const Xa={scorch:0,rust:1},qi=15,Ki=r=>r.cutoff>0&&r.albedo&&!r.albedo.loaded?1e6:r.cutoff;function xt(r,e=!1,t=r&&e){return`#version 300 es
layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec3 aNormal;
layout(location = 2) in vec3 aColor;
layout(location = 3) in vec2 aUv;
${t?ho:r?`layout(location = 4) in vec4 aModel0;
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
${e?bi:""}
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
  vInst = crowdInst(crowdI);`:r?`  mat4 model = mat4(aModel0, aModel1, aModel2, aModel3);
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
}`}const Zi=`#version 300 es
precision highp float;
#define MAX_PER_TILE ${di}
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
uniform vec3 uSplatTint[${rt}];
uniform float uSplatRough[${rt}];
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
${fo}
${vo}
${Zo}
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
}`;function wt(r){return r?Zi.replace("in vec4 vShadow2;",`in vec4 vShadow2;
in vec4 vInst;`).replace(/uFadeGrey\.x/g,"vInst.z").replace(/uFadeGrey\.y/g,"vInst.w").replace(/uWear\.w/g,"vInst.y"):Zi}class Ts{constructor(e){d(this,"gl");d(this,"program");d(this,"instancedProgram");d(this,"instances",[]);d(this,"instanced",[]);d(this,"overlays",[]);d(this,"icons");d(this,"wireColor",[.15,.85,1]);d(this,"wireProgram");d(this,"nearFade",{enabled:!1,distance:6});d(this,"veil",null);d(this,"veilGround",0);d(this,"post");d(this,"clouds");d(this,"fogVolumes",new mi);d(this,"sky");d(this,"envMap");d(this,"env",{...ka});d(this,"envKey","");d(this,"water");d(this,"time",0);d(this,"lastTime",-1);d(this,"particles");d(this,"effects");d(this,"grass");d(this,"clipY",-1e9);d(this,"dayNight",{...cr});d(this,"timeOfDay",.2);d(this,"weather",{overcast:0,tint:[1,1,1]});d(this,"weathered",!1);d(this,"baseLighting");d(this,"overlayProgram");d(this,"skinnedProgram");d(this,"crowds",!0);d(this,"skinnedCrowds",!0);d(this,"skinnedInstancedProgram");d(this,"crowdProgram");d(this,"crowdTexture");d(this,"crowdRows",0);d(this,"crowdData",new Float32Array(0));d(this,"crowdUsed",0);d(this,"crowdSent",0);d(this,"idsOf",new WeakMap);d(this,"nextObjectId",1);d(this,"wireSkinnedProgram");d(this,"skinnedCasters",[]);d(this,"rigidCasters",[]);d(this,"cutoutCasters",[]);d(this,"cutoutGroups",[]);d(this,"lighting",{sunDir:[-.4,-.8,-.45],sunColor:[1,.95,.86],sunIntensity:3,skyColor:[.55,.65,.9],groundColor:[.3,.25,.2],ambient:.8,exposure:1});d(this,"fogColor",[.012,.016,.024]);d(this,"fogTint",null);d(this,"tinted",null);d(this,"fogRange",[60,220]);d(this,"drawCalls",0);d(this,"culling",!0);d(this,"lastReflection",null);d(this,"timers");d(this,"renderScale",1);d(this,"boxes",new WeakMap);d(this,"frame",0);d(this,"planes",new Float32Array(24));d(this,"scratchBox",new Float32Array(6));d(this,"scratchNormal",new Float32Array(9));d(this,"sorted",{frame:-1,solid:[],clear:[]});d(this,"tintScratch",new Float32Array(rt*3));d(this,"roughScratch",new Float32Array(rt));d(this,"bound",{program:null,material:null});d(this,"defaultMaterial",ci());d(this,"white");d(this,"shadows");d(this,"lights");d(this,"boundPalette",null);d(this,"boundPaletteProgram",null);d(this,"singlesScratch",{rigid:[],skinned:[],rigidGroups:new Map,skinnedGroups:new Map});d(this,"shadowGroups",new Map);d(this,"shadowSkinnedGroups",new Map);d(this,"stagedG",[]);d(this,"stagedAt",[]);d(this,"keyCache",new WeakMap);d(this,"sortScratch",Na());d(this,"clockwise",!1);this.canvas=e;const t=e.getContext("webgl2",{antialias:!0});if(!t)throw new Error("WebGL2 is not available");this.gl=t,this.program=new q(t,xt(!1),wt(!1)),this.instancedProgram=new q(t,xt(!0),wt(!1)),this.skinnedProgram=new q(t,xt(!1,!0),wt(!1)),this.skinnedInstancedProgram=new q(t,xt(!0,!0),wt(!0)),this.crowdProgram=new q(t,xt(!0,!1,!0),wt(!0)),this.crowdTexture=this.makeCrowdTexture(64),this.overlayProgram=new q(t,Io,Bo),this.icons=new Br(t),this.wireProgram=new q(t,Ji(!1),Qi),this.wireSkinnedProgram=new q(t,Ji(!0),Qi),this.white=new Et(t),this.shadows=new ko(t,2048),this.lights=new Lo(t),this.post=new ur(t),this.clouds=new No(t),this.sky=new pr(t),this.envMap=new La(t,64),this.water=new Tr(t),this.particles=new zr(t,2e5),this.effects=new Ua(t),this.grass=new Mr(t),this.timers=new Sr(t),this.post.timers=this.timers,this.baseLighting={...this.lighting},t.enable(t.DEPTH_TEST),t.enable(t.CULL_FACE),t.cullFace(t.BACK)}resize(){const e=Math.min(window.devicePixelRatio||1,2)*Math.min(1,Math.max(.25,this.renderScale)),t=Math.floor(this.canvas.clientWidth*e),i=Math.floor(this.canvas.clientHeight*e);(this.canvas.width!==t||this.canvas.height!==i)&&(this.canvas.width=t,this.canvas.height=i),this.gl.viewport(0,0,t,i)}get aspect(){return this.canvas.width/Math.max(1,this.canvas.height)}render(e){var A,R,_,k,B;const t=this.gl;if(this.drawCalls=0,this.crowdUsed=0,this.crowdSent=0,this.frame++,this.boundPalette=null,this.canvas.width===0||this.canvas.height===0)return;const i=this.timers;i.startFrame(),Et.flush(1024*1024);const o=Math.min(1,Math.max(0,this.weather.overcast)),a=hr(this.dayNight.enabled?this.timeOfDay:.25,this.baseLighting,this.dayNight,o,this.weather.tint);this.dayNight.enabled||o>0?(this.lighting={...this.baseLighting,sunDir:this.dayNight.enabled?a.sunDir:this.baseLighting.sunDir,sunColor:a.sunColor,sunIntensity:a.sunIntensity,skyColor:a.skyColor,groundColor:a.groundColor,ambient:a.ambient,exposure:this.baseLighting.exposure*a.exposure},this.fogColor=a.horizon,this.weathered=o>0):(this.weathered&&(this.lighting={...this.baseLighting}),this.weathered=!1,this.sky.settings.enabled&&(this.fogColor=a.horizon));const s=this.tinted;s&&this.fogColor.every((y,F)=>y===s.to[F])&&(this.fogColor=s.from);const n=this.fogTint;if(n&&n.amount>0){const y=Math.min(1,n.amount),F=this.fogColor,M=F.map((D,j)=>D+(n.color[j]-D)*y);this.tinted={from:F,to:M},this.fogColor=M}else this.tinted=null;if(i.begin("sky cube"),this.env.enabled){const y=[...a.sunDir,...a.sunColor,a.sunIntensity,...a.horizon,...a.zenith,...a.groundColor,this.sky.settings.sunSize,this.sky.settings.sunGlow].map(F=>F.toFixed(2)).join(",");y!==this.envKey&&(this.envKey=y,this.sky.renderEnv(this.envMap,a),this.drawCalls+=6)}i.begin("shadows");const u=Ba(e);this.shadows.settings.strength>0&&this.shadowPass(u),i.begin("scene");const l=this.post.settings.enabled;l&&(this.post.resize(this.canvas.width,this.canvas.height),this.post.begin());const c=l?this.fogColor:this.fogColor.map(y=>Math.pow(Math.min(1,y*this.lighting.exposure),1/2.2));t.clearColor(c[0],c[1],c[2],1),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT);const f=e.projection(this.aspect),h=e.view(),v=e.eye(),p=this.lights.lights.length;this.effects.lights(this.lights.lights),this.lights.update(ve(f,h),this.canvas.width,this.canvas.height),this.lights.lights.length=p,this.fogVolumes.prepare(ut(ve(f,h),this.planes),((A=e.viewPoint)==null?void 0:A.call(e))??eo(v,u.focus,((R=e.rayStart)==null?void 0:R.call(e))??0),this.time),this.bindShared();const x=this.water.settings.enabled&&this.water.hasSurface,w=this.lastReflection!==null&&this.lastReflection.w===this.canvas.width&&this.lastReflection.h===this.canvas.height&&h.every((y,F)=>y===this.lastReflection.view[F]),m=!(this.water.settings.reflectionHalfRate&&w&&this.frame%2===1);if(x&&this.water.settings.reflections&&m){this.lastReflection={view:new Float32Array(h),w:this.canvas.width,h:this.canvas.height},i.begin("reflection");const y=this.water.mirroredView(v,u.focus),F=l?this.fogColor:this.fogColor.map(M=>Math.pow(Math.min(1,M*this.lighting.exposure),1/2.2));this.water.beginReflection(this.canvas.width,this.canvas.height,F),this.clipY=this.water.level-.02,this.drawOpaque(f,y.view,y.eye,a,!l,!0),this.clipY=-1e9,this.water.endReflection(),l?this.post.begin():(t.bindFramebuffer(t.FRAMEBUFFER,null),t.viewport(0,0,this.canvas.width,this.canvas.height))}const g=this.lastTime<0?0:Math.max(0,this.time-this.lastTime);if(this.lastTime=this.time,this.clouds.advance(g),i.begin("particles"),this.particles.settings.enabled&&this.particles.update(g),this.effects.settings.enabled&&this.effects.count&&(i.begin("effects"),this.effects.update(g,{projection:f,view:h,eye:v,viewport:[this.canvas.width,this.canvas.height],exposure:this.lighting.exposure,toneMap:!l}),this.bindShared()),this.grass.update(g),i.begin("scene"),this.drawOpaque(f,h,v,a,!l,!1),i.begin("grass"),this.grass.settings.enabled){const y=this.lighting,F=this.shadows;this.drawCalls+=this.grass.draw({projection:f,view:h,eye:v,focus:u.focus,time:this.time,sunDir:y.sunDir,sunColor:y.sunColor,sunIntensity:y.sunIntensity,skyColor:y.skyColor,groundColor:y.groundColor,ambient:y.ambient,fogColor:this.fogColor,fogRange:this.fogRange,exposure:y.exposure,toneMap:!l,lightViewProj:F.settings.strength>0?Array.from({length:zt},(M,D)=>F.viewProj(Math.min(D,F.count-1))).slice(0,F.count):[],shadowStrength:F.settings.strength})}if(i.begin("scene"),this.drawWires(f,h,!l),i.begin("water"),x&&(this.water.draw({projection:f,view:h,eye:v,time:this.time,sunDir:this.lighting.sunDir,sunColor:this.lighting.sunColor,sunIntensity:this.lighting.sunIntensity,horizon:a.horizon,zenith:a.zenith,light:.12+.88*a.day,fogColor:this.fogColor,fogRange:this.fogRange,exposure:this.lighting.exposure,toneMap:!l,width:this.canvas.width,height:this.canvas.height,depth:l?this.post.snapshotDepth():null,invViewProj:et(ve(f,h))}),this.drawCalls++),i.begin("overlays"),this.overlays.length){const y=this.overlayProgram;y.use(),y.setMat4("uProjection",f),y.setMat4("uView",h),y.setFloat("uExposure",this.lighting.exposure),y.setFloat("uToneMap",l?0:1),y.setFloat("uLight",.12+.88*a.day),t.enable(t.BLEND),t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ZERO,t.ONE),t.depthMask(!1),t.disable(t.CULL_FACE);const F=ut(ve(f,h),this.planes);for(const M of this.overlays)M.onTop||M.overVeil||M.overFrame||M.mesh.count===0||this.culling&&!mt(F,Ht(M.model,M.mesh.min,M.mesh.max,this.scratchBox))||(y.setMat4("uModel",M.model),y.setFloat("uAlpha",M.alpha??1),M.mesh.draw(),this.drawCalls++);t.enable(t.CULL_FACE),t.depthMask(!0),t.disable(t.BLEND)}if(this.veil){t.enable(t.BLEND),t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ZERO,t.ONE_MINUS_SRC_ALPHA),t.depthMask(!1),t.disable(t.CULL_FACE);const y=l?this.post.snapshotDepth():null;y?(t.disable(t.DEPTH_TEST),this.veil.drawScreen(y,et(ve(f,h)),v,this.lighting.exposure,6,!l,this.veilGround),t.enable(t.DEPTH_TEST)):(t.enable(t.POLYGON_OFFSET_FILL),t.polygonOffset(-1,-2),this.veil.draw(f,h,this.lighting.exposure,6,!l),t.disable(t.POLYGON_OFFSET_FILL)),this.drawCalls++,t.enable(t.CULL_FACE),t.depthMask(!0),t.disable(t.BLEND)}const E=this.overlays.filter(y=>y.overVeil&&!y.onTop&&!y.overFrame&&y.mesh.count>0);if(E.length){const y=this.overlayProgram;y.use(),y.setMat4("uProjection",f),y.setMat4("uView",h),y.setFloat("uExposure",this.lighting.exposure),y.setFloat("uToneMap",l?0:1),y.setFloat("uLight",1),t.enable(t.BLEND),t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ZERO,t.ONE_MINUS_SRC_ALPHA),t.depthMask(!1),t.disable(t.CULL_FACE);const F=ut(ve(f,h),this.planes);for(const M of E)this.culling&&!mt(F,Ht(M.model,M.mesh.min,M.mesh.max,this.scratchBox))||(y.setMat4("uModel",M.model),y.setFloat("uAlpha",M.alpha??1),M.mesh.draw(),this.drawCalls++);t.enable(t.CULL_FACE),t.depthMask(!0),t.disable(t.BLEND)}i.begin("particles");let S=null;if(this.particles.settings.enabled){const y=[h[0],h[4],h[8]],F=[h[1],h[5],h[9]];S=l?this.post.snapshotDepth():null,this.particles.draw({projection:f,view:h,right:y,up:F,depth:S,invProjection:et(f),width:this.canvas.width,height:this.canvas.height,exposure:this.lighting.exposure,toneMap:!l}),this.drawCalls+=2}if(this.effects.settings.enabled&&this.effects.count&&(i.begin("effects"),this.drawCalls+=this.effects.draw({projection:f,view:h,eye:v,viewport:[this.canvas.width,this.canvas.height],exposure:this.lighting.exposure,toneMap:!l}),this.bindShared()),i.begin("overlays"),this.drawOnTop(this.overlays.filter(y=>y.onTop&&!y.overFrame),f,h,!l),l){const y=this.shadows,F=this.lighting;i.begin("post");const M=y.settings.strength>0?{shadowMaps:Array.from({length:y.count},(D,j)=>y.texture(j)),lightViewProj:Array.from({length:y.count},(D,j)=>y.viewProj(j))}:{shadowMaps:[],lightViewProj:[]};this.post.end(this.lighting.exposure,f,et(f),{invViewProj:et(ve(f,h)),eye:v,sunDir:F.sunDir,sunRadiance:[F.sunColor[0]*F.sunIntensity,F.sunColor[1]*F.sunIntensity,F.sunColor[2]*F.sunIntensity],skyColor:a.skyColor,...M,far:this.fogRange[1],rayStart:((_=e.rayStart)==null?void 0:_.call(e))??0,viewPoint:((k=e.viewPoint)==null?void 0:k.call(e))??eo(v,u.focus,((B=e.rayStart)==null?void 0:B.call(e))??0),clouds:this.clouds,time:this.time,fogVolumes:this.fogVolumes,lights:this.lights,...this.veil?{veil:{mask:this.veil.maskTexture,cells:[this.veil.width,this.veil.height],alpha:this.veil.veilColor[3]}}:{},opaqueDepth:S}),this.drawCalls+=2}this.icons.enabled&&this.icons.count&&(i.begin("icons"),t.bindFramebuffer(t.FRAMEBUFFER,null),t.viewport(0,0,this.canvas.width,this.canvas.height),this.drawCalls+=this.icons.draw(ve(f,h),this.canvas.width,this.canvas.height));const C=this.overlays.filter(y=>y.overFrame&&y.mesh.count>0);C.length&&(i.begin("overlays"),t.bindFramebuffer(t.FRAMEBUFFER,null),t.viewport(0,0,this.canvas.width,this.canvas.height),this.drawOnTop(C,f,h,!0)),i.end()}drawOnTop(e,t,i,o){if(!e.length)return;const a=this.gl,s=this.overlayProgram;s.use(),s.setMat4("uProjection",t),s.setMat4("uView",i),s.setFloat("uExposure",this.lighting.exposure),s.setFloat("uToneMap",o?1:0),s.setFloat("uLight",1),a.enable(a.BLEND),a.blendFuncSeparate(a.SRC_ALPHA,a.ONE_MINUS_SRC_ALPHA,a.ZERO,a.ONE),a.disable(a.DEPTH_TEST),a.depthMask(!1),a.disable(a.CULL_FACE);for(const n of e)s.setMat4("uModel",n.model),s.setFloat("uAlpha",n.alpha??1),n.mesh.draw(),this.drawCalls++;a.enable(a.CULL_FACE),a.depthMask(!0),a.enable(a.DEPTH_TEST),a.disable(a.BLEND)}bindShared(){for(let e=0;e<zt;e++)this.shadows.bind(Math.min(e,this.shadows.count-1),e===0?1:6+e);this.lights.bind(2,3)}drawOpaque(e,t,i,o,a,s){const n=this.gl;this.sky.settings.enabled&&(s&&n.cullFace(n.BACK),this.sky.draw(et(ve(e,t)),i,o,this.lighting.exposure,a),s&&n.cullFace(n.FRONT),this.drawCalls++);const u=this.program;u.use(),this.setFrameUniforms(u,e,t,i);const l=ut(ve(e,t),this.planes);this.unbind();const{solid:c,clear:f}=this.sortedInstances(),h=m=>!s||!this.culling||this.water.nearWater(m,Math.max(2,(m[4]-m[1])*1.5));this.drawSingles(c,m=>this.seen(m,l)&&h(this.boxOf(m)),e,t,i);const v=m=>m.mesh.count>0&&(!this.culling||!m.bounds||mt(l,this.groupBox(m))&&h(this.groupBox(m))),p=this.instanced.filter(m=>{var g;return!((g=m.material)!=null&&g.transparent)&&v(m)});if(p.length){const m=this.instancedProgram;m.use(),this.setFrameUniforms(m,e,t,i),this.unbind();for(const g of p)this.useMaterial(m,g.material??this.defaultMaterial),this.bindLook(m,null),this.wind(!!g.mirrored),g.mesh.draw(),this.drawCalls++;this.wind(!1)}const x=f.filter(m=>this.seen(m,l)&&h(this.boxOf(m))),w=this.instanced.filter(m=>{var g;return((g=m.material)==null?void 0:g.transparent)&&v(m)});if(x.length||w.length){if(n.enable(n.BLEND),n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE),n.depthMask(!1),n.enable(n.POLYGON_OFFSET_FILL),n.polygonOffset(-1,-4),w.length){const m=this.instancedProgram;m.use(),this.setFrameUniforms(m,e,t,i),this.unbind();for(const g of w)this.useMaterial(m,g.material),this.bindLook(m,null),this.wind(!!g.mirrored),g.mesh.draw(),this.drawCalls++;this.wind(!1)}x.length&&this.drawSingles(x,()=>!0,e,t,i,!1),n.disable(n.POLYGON_OFFSET_FILL),n.depthMask(!0),n.disable(n.BLEND)}}bindSkin(e,t){t.skin.upload(),(this.boundPalette!==t.skin||this.boundPaletteProgram!==e)&&(t.skin.bind(st),this.boundPalette=t.skin,this.boundPaletteProgram=e),this.gl.uniform1i(e.uniform("uJointBase"),t.skinBase??0)}isSkinned(e){return!!e.skin&&e.mesh.skinned}drawSingles(e,t,i,o,a,s=!0){const{rigid:n,skinned:u,rigidGroups:l,skinnedGroups:c}=this.singlesScratch;n.length=0,u.length=0,St(l),St(c);const f=s&&this.crowds;for(const h of e){if(!t(h))continue;const v=this.isSkinned(h);if(!f||v&&!this.skinnedCrowds){(v?u:n).push(h);continue}const p=v?c:l,x=this.crowdKey(h,v),w=p.get(x);w?w.push(h):p.set(x,[h])}for(const h of l.values())h.length===1&&n.push(h[0]);for(const h of c.values())h.length===1&&u.push(h[0]);if(n.length){const h=this.program;h.use(),this.unbind();for(const v of n)this.useMaterial(h,v.material??this.defaultMaterial),this.bindLook(h,v),h.setMat4("uModel",v.model),h.setMat3("uNormal",Fi(v.model,this.scratchNormal)),this.wind(ze(v.model)),v.mesh.draw(),this.drawCalls++;this.wind(!1)}if(u.length){const h=this.skinnedProgram;h.use(),this.setFrameUniforms(h,i,o,a),this.gl.uniform1i(h.uniform("uJoints"),st),this.unbind();for(const v of u)this.useMaterial(h,v.material??this.defaultMaterial),this.bindLook(h,v),this.bindSkin(h,v),h.setMat4("uModel",v.model),h.setMat3("uNormal",Fi(v.model,this.scratchNormal)),this.wind(ze(v.model)),v.mesh.draw(),this.drawCalls++;this.wind(!1)}this.drawCrowds(l,this.crowdProgram,i,o,a,!1),this.drawCrowds(c,this.skinnedInstancedProgram,i,o,a,!0)}idOf(e){let t=this.idsOf.get(e);return t===void 0&&(t=this.nextObjectId++,this.idsOf.set(e,t)),t}stageAll(e){let t=0;for(const i of e.values())i.length<2||(this.stagedG[t]=i,this.stagedAt[t]=this.stageCrowd(i),t++);return t}crowdKey(e,t){const i=e.tint,o=e.glow,a=e.wear,s=this.idOf(e.mesh),n=this.idOf(e.material??this.defaultMaterial),u=t?this.idOf(e.skin):0,l=ze(e.model)?1:0,c=e.emissive??1;if(!i&&!o&&!a&&c===1)return((s*4096+n)*4096+u)*2+l;const f=this.keyCache.get(e);if(f&&f.t===i&&f.g===o&&f.w===a&&f.e===c&&f.mesh===e.mesh&&f.mat===e.material&&f.skin===e.skin&&f.mirrored===l)return f.key;const h=`${s}|${n}|${u}|${l}|${i?i.join(","):""}|${o?o.join(","):""}|${a?`${a.amount},${a.kind??"scorch"},${a.scale??12}`:""}|${c===1?"":c.toFixed(3)}`;return this.keyCache.set(e,{t:i,g:o,w:a,e:c,mesh:e.mesh,mat:e.material,skin:e.skin,mirrored:l,key:h}),h}drawCrowds(e,t,i,o,a,s){for(const u of e.values())u.length>=2&&Oa(u,a,this.sortScratch);const n=this.stageAll(e);if(n){this.flushCrowds(),t.use(),this.setFrameUniforms(t,i,o,a),s&&this.gl.uniform1i(t.uniform("uJoints"),st),this.bindCrowdTexture(t),this.unbind();for(let u=0;u<n;u++){const l=this.stagedG[u],c=this.stagedAt[u],f=l[0];this.useMaterial(t,f.material??this.defaultMaterial),this.bindLook(t,f),s&&this.bindSkin(t,f),this.wind(ze(f.model)),this.gl.uniform1i(t.uniform("uCrowdBase"),c),f.mesh.drawInstances(l.length),this.drawCalls++}this.wind(!1)}}bindCrowdTexture(e){const t=this.gl;t.activeTexture(t.TEXTURE0+Mi),t.bindTexture(t.TEXTURE_2D,this.crowdTexture),t.uniform1i(e.uniform("uCrowd"),Mi)}makeCrowdTexture(e){const t=this.gl,i=t.createTexture();if(!i)throw new Error("crowd texture allocation failed");t.bindTexture(t.TEXTURE_2D,i),t.texStorage2D(t.TEXTURE_2D,1,t.RGBA32F,ct,e),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.bindTexture(t.TEXTURE_2D,null),this.crowdRows=e;const o=new Float32Array(ct*4*e);return o.set(this.crowdData.subarray(0,Math.min(this.crowdData.length,o.length))),this.crowdData=o,i}stageCrowd(e){var a;const t=e.length*Gt;this.crowdData.length<this.crowdUsed+t&&(this.gl.deleteTexture(this.crowdTexture),this.crowdTexture=this.makeCrowdTexture(Math.max(this.crowdRows*2,Math.ceil((this.crowdUsed+t)/(ct*4)))),this.crowdSent=0);const i=this.crowdData,o=this.crowdUsed;for(let s=0;s<e.length;s++){const n=e[s],u=n.model,l=o+s*Gt;i[l]=u[0],i[l+1]=u[4],i[l+2]=u[8],i[l+3]=u[12],i[l+4]=u[1],i[l+5]=u[5],i[l+6]=u[9],i[l+7]=u[13],i[l+8]=u[2],i[l+9]=u[6],i[l+10]=u[10],i[l+11]=u[14],i[l+12]=n.skinBase??0,i[l+13]=((a=n.wear)==null?void 0:a.seed)??0,i[l+14]=Math.min(1,Math.max(0,n.fade??1)),i[l+15]=Math.min(1,Math.max(0,n.grey??0))}return this.crowdUsed+=t,o/Gt}flushCrowds(){if(this.crowdUsed<=this.crowdSent)return;const e=this.gl,t=ct*4,i=Math.floor(this.crowdSent/t),o=Math.ceil(this.crowdUsed/t);e.bindTexture(e.TEXTURE_2D,this.crowdTexture),e.texSubImage2D(e.TEXTURE_2D,0,0,i,ct,o-i,e.RGBA,e.FLOAT,this.crowdData,i*t),e.bindTexture(e.TEXTURE_2D,null),this.crowdSent=this.crowdUsed}sortedInstances(){var o;const e=this.sorted;if(e.frame===this.frame)return e;e.frame=this.frame,e.solid.length=0,e.clear.length=0;for(const a of this.instances)a.hidden||((o=a.material)!=null&&o.transparent?e.clear.push(a):e.solid.push(a));const t=new Map,i=a=>{const s=a??this.defaultMaterial;let n=t.get(s);return n===void 0&&t.set(s,n=t.size),n};return e.solid.sort((a,s)=>i(a.material)-i(s.material)),e}boxOf(e){let t=this.boxes.get(e);if(t||(t={frame:-1,box:new Float32Array(6)},this.boxes.set(e,t)),t.frame!==this.frame){const i=e.bounds??e.mesh;Ht(e.model,i.min,i.max,t.box),t.frame=this.frame}return t.box}seen(e,t,i=6){return!this.culling||mt(t,this.boxOf(e),i)}groupBox(e){const t=this.scratchBox,{min:i,max:o}=e.bounds;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=o[0],t[4]=o[1],t[5]=o[2],t}unbind(){this.bound.program=null,this.bound.material=null,this.boundPalette=null}useMaterial(e,t){this.bound.program===e&&this.bound.material===t||(this.bindMaterial(e,t),this.bound.program=e,this.bound.material=t)}drawWires(e,t,i){const o=ut(ve(e,t),this.planes),a=this.instances.filter(n=>n.wireframe&&!n.hidden&&this.seen(n,o));if(!a.length)return;const s=this.gl;s.depthMask(!1);for(const n of[!1,!0]){const u=a.filter(c=>this.isSkinned(c)===n);if(!u.length)continue;const l=n?this.wireSkinnedProgram:this.wireProgram;l.use(),l.setMat4("uProjection",e),l.setMat4("uView",t),l.setVec3("uColor",...this.wireColor),l.setFloat("uToneMap",i?1:0),n&&s.uniform1i(l.uniform("uJoints"),st);for(const c of u)n&&this.bindSkin(l,c),l.setMat4("uModel",c.model),c.mesh.drawWire(),this.drawCalls++}s.depthMask(!0)}shadowPass(e){var t,i,o,a;this.shadows.setup(e.focus,this.lighting.sunDir,e.distance);for(let s=0;s<this.shadows.count;s++){if(!this.shadows.isDue(s))continue;this.shadows.begin(s);const n=this.shadows.viewProj(s),u=this.shadows.program;u.use(),u.setMat4("uLightViewProj",n);const l=ut(n,this.planes),c=this.skinnedCasters;c.length=0;const f=this.rigidCasters;f.length=0;const h=this.cutoutCasters;h.length=0;for(const w of this.instances){if(w.hidden||(t=w.material)!=null&&t.transparent)continue;const m=w.shadow??"all";if(!(m==="none"||m==="near"&&s>0||m==="mid"&&s>1)&&this.seen(w,l,4)){if((i=w.material)!=null&&i.cutoff){h.push(w);continue}if(this.isSkinned(w)){c.push(w);continue}f.push(w)}}const v=this.shadowGroups;St(v);for(const w of f){const m=this.crowds?this.idOf(w.mesh)*2+(ze(w.model)?1:0):-this.idOf(w),g=v.get(m);g?g.push(w):v.set(m,[w])}let p=0;for(const w of v.values()){if(w.length>1){p++;continue}if(!w.length)continue;const m=w[0];u.setMat4("uModel",m.model),this.wind(ze(m.model)),m.mesh.draw(),this.drawCalls++}if(this.wind(!1),p){const w=this.stageAll(v);this.flushCrowds();const m=this.shadows.crowdProgram;m.use(),m.setMat4("uLightViewProj",n),this.bindCrowdTexture(m);for(let g=0;g<w;g++){const E=this.stagedG[g],S=this.stagedAt[g];this.wind(ze(E[0].model)),this.gl.uniform1i(m.uniform("uCrowdBase"),S),E[0].mesh.drawInstances(E.length),this.drawCalls++}this.wind(!1)}if(f.length=0,c.length){const w=this.shadowSkinnedGroups;St(w);for(const E of c){const S=this.crowds&&this.skinnedCrowds?(this.idOf(E.mesh)*65536+this.idOf(E.skin))*2+(ze(E.model)?1:0):-this.idOf(E),C=w.get(S);C?C.push(E):w.set(S,[E])}const m=this.shadows.skinnedProgram;m.use(),m.setMat4("uLightViewProj",n),this.gl.uniform1i(m.uniform("uJoints"),st);let g=0;for(const E of w.values()){if(E.length>1){g++;continue}if(!E.length)continue;const S=E[0];this.bindSkin(m,S),m.setMat4("uModel",S.model),this.wind(ze(S.model)),S.mesh.draw(),this.drawCalls++}if(g){const E=this.stageAll(w);this.flushCrowds();const S=this.shadows.skinnedInstancedProgram;S.use(),S.setMat4("uLightViewProj",n),this.gl.uniform1i(S.uniform("uJoints"),st),this.bindCrowdTexture(S);for(let C=0;C<E;C++){const A=this.stagedG[C],R=this.stagedAt[C];this.bindSkin(S,A[0]),this.wind(ze(A[0].model)),this.gl.uniform1i(S.uniform("uCrowdBase"),R),A[0].mesh.drawInstances(A.length),this.drawCalls++}}this.wind(!1),c.length=0}const x=this.cutoutGroups;if(x.length=0,this.instanced.length){const w=this.shadows.instancedProgram;w.use(),w.setMat4("uLightViewProj",n);for(const m of this.instanced){if(m.mesh.count===0||(o=m.material)!=null&&o.transparent||this.culling&&m.bounds&&!mt(l,this.groupBox(m),4))continue;const g=m.shadow??"all";if(!(g==="none"||g==="near"&&s>0||g==="mid"&&s>1)){if((a=m.material)!=null&&a.cutoff){x.push(m);continue}this.wind(!!m.mirrored),(m.shadowMesh??m.mesh).draw(),this.drawCalls++}}this.wind(!1)}(h.length||x.length)&&this.cutoutShadows(n,h,x)}this.shadows.end(this.canvas.width,this.canvas.height)}cutoutShadows(e,t,i){const o=this.gl,a=o.isEnabled(o.CULL_FACE);let s=null;const n=(u,l)=>{l!==s&&(s=l,l.doubleSided?o.disable(o.CULL_FACE):o.enable(o.CULL_FACE),(l.albedo??this.white).bind(0),u.setFloat("uUvScale",l.uvScale),u.setFloat("uOpacity",l.opacity),u.setFloat("uCutoff",Ki(l)))};for(let u=0;u<2;u++){const l=u===0?this.shadows.cutoutProgram:this.shadows.cutoutSkinnedProgram;let c=!1;for(const f of t)this.isSkinned(f)===(u===1)&&(c||(c=!0,s=null,l.use(),l.setMat4("uLightViewProj",e),o.uniform1i(l.uniform("uAlbedo"),0),u===1&&o.uniform1i(l.uniform("uJoints"),st)),n(l,f.material),u===1&&this.bindSkin(l,f),l.setMat4("uModel",f.model),this.wind(ze(f.model)),f.mesh.draw(),this.drawCalls++)}if(i.length){const u=this.shadows.cutoutInstancedProgram;s=null,u.use(),u.setMat4("uLightViewProj",e),o.uniform1i(u.uniform("uAlbedo"),0);for(const l of i)n(u,l.material),this.wind(!!l.mirrored),(l.shadowMesh??l.mesh).draw(),this.drawCalls++}this.wind(!1),a?o.enable(o.CULL_FACE):o.disable(o.CULL_FACE)}wind(e){e!==this.clockwise&&(this.clockwise=e,this.gl.frontFace(e?this.gl.CW:this.gl.CCW))}bindLook(e,t){const i=t==null?void 0:t.tint,o=t==null?void 0:t.glow,a=t==null?void 0:t.wear;this.gl.uniform4f(e.uniform("uTint"),i?i[0]:1,i?i[1]:1,i?i[2]:1,i?Math.min(1,Math.max(0,i[3])):0),this.gl.uniform3f(e.uniform("uGlow"),o?o[0]:0,o?o[1]:0,o?o[2]:0),this.gl.uniform1f(e.uniform("uEmissiveScale"),(t==null?void 0:t.emissive)??1),this.gl.uniform4f(e.uniform("uWear"),a?Math.min(1,Math.max(0,a.amount)):0,Xa[(a==null?void 0:a.kind)??"scorch"],(a==null?void 0:a.scale)??12,(a==null?void 0:a.seed)??0),this.gl.uniform2f(e.uniform("uFadeGrey"),Math.min(1,Math.max(0,(t==null?void 0:t.fade)??1)),Math.min(1,Math.max(0,(t==null?void 0:t.grey)??0)))}bindMaterial(e,t){var a,s,n;t.doubleSided?this.gl.disable(this.gl.CULL_FACE):this.gl.enable(this.gl.CULL_FACE),(t.albedo??this.white).bind(0),this.gl.uniform1i(e.uniform("uAlbedo"),0),(t.metallicRoughness??this.white).bind(4),this.gl.uniform1i(e.uniform("uMetalRough"),4),e.setFloat("uHasMetalRough",(a=t.metallicRoughness)!=null&&a.loaded?1:0),(t.normal??this.white).bind(5),this.gl.uniform1i(e.uniform("uNormalMap"),5),e.setFloat("uHasNormal",(s=t.normal)!=null&&s.loaded?1:0),e.setVec3("uMatColor",...t.color),e.setFloat("uUvScale",t.uvScale),e.setFloat("uMetallic",t.metallic),e.setFloat("uRoughness",t.roughness),e.setVec3("uEmissive",...t.emissive),(t.emissiveMap??this.white).bind(qi),this.gl.uniform1i(e.uniform("uEmissiveMap"),qi),e.setFloat("uEmissiveMapState",t.emissiveMap?t.emissiveMap.loaded?1:2:0),e.setFloat("uTransparent",t.transparent?1:0),e.setFloat("uOpacity",t.opacity),e.setFloat("uCutoff",Ki(t));const i=t.fade;if(e.setFloat("uFadeDist",i?i.distance:0),i){this.gl.uniform4f(e.uniform("uFadeRect"),i.rect[0],i.rect[1],i.rect[2],i.rect[3]);const u=i.color;this.gl.uniform4f(e.uniform("uFadeColor"),u?u[0]:0,u?u[1]:0,u?u[2]:0,u?1:0)}const o=t.splat;if(e.setFloat("uNearFade",this.nearFade.enabled&&t.nearFade&&!o?this.nearFade.distance:0),e.setFloat("uSplatOn",o?1:0),o){const u=this.gl;u.activeTexture(u.TEXTURE9),u.bindTexture(u.TEXTURE_2D,o.map.texture),o.layers.bind(10),u.uniform2f(e.uniform("uSplatSize"),o.map.width,o.map.height),e.setFloat("uSplatLevelH",o.levelHeight),e.setFloat("uSplatCliff",o.cliff),e.setFloat("uSplatNoise",o.noise),e.setFloat("uSplatSharp",o.sharpness),e.setFloat("uSplatOutLayer",((n=o.outside)==null?void 0:n.layer)??0),e.setFloat("uSplatOutDist",o.outside?Math.max(.01,o.outside.distance):0);const l=o.grid&&o.grid.size>0?o.grid:null;e.setFloat("uSplatGrid",l?l.size:0),e.setFloat("uSplatGridWidth",(l==null?void 0:l.width)??.025),e.setFloat("uSplatGridOpacity",(l==null?void 0:l.opacity)??.2);const c=this.tintScratch.fill(1);for(let p=0;p<Math.min(rt,o.tints.length);p++)c.set(o.tints[p],p*3);u.uniform3fv(e.uniform("uSplatTint"),c);const f=this.roughScratch.fill(.9);for(let p=0;p<Math.min(rt,o.roughness.length);p++)f[p]=o.roughness[p];u.uniform1fv(e.uniform("uSplatRough"),f);const h=o.surface,v=!!h&&(h.bump>0||h.roughness>0);e.setFloat("uSurfOn",v?1:0),h&&v&&(h.layers.bind(12),e.setFloat("uSurfBump",Math.max(0,h.bump)),e.setFloat("uSurfRough",Math.max(0,h.roughness)))}else e.setFloat("uSurfOn",0)}setFrameUniforms(e,t,i,o){e.setMat4("uProjection",t),e.setMat4("uView",i);const a=this.lighting,s=a.sunDir,n=Math.hypot(s[0],s[1],s[2])||1;e.setVec3("uSunDir",s[0]/n,s[1]/n,s[2]/n),e.setVec3("uSunColor",...a.sunColor),e.setFloat("uSunIntensity",a.sunIntensity),e.setVec3("uSkyColor",...a.skyColor),e.setFloat("uAmbient",a.ambient),e.setVec3("uGroundColor",...a.groundColor),this.envMap.bind(6),this.gl.uniform1i(e.uniform("uEnv"),6),e.setFloat("uEnvStrength",this.env.enabled?this.env.strength:0),e.setFloat("uEnvMips",this.envMap.mips),e.setFloat("uExposure",a.exposure),e.setFloat("uToneMap",this.post.settings.enabled?0:1),e.setVec3("uFogColor",...this.fogColor),this.gl.uniform2f(e.uniform("uFogRange"),this.fogRange[0],this.fogRange[1]),e.setVec3("uEye",o[0],o[1],o[2]),e.setFloat("uClipY",this.clipY);const u=this.shadows,l=v=>2*u.halfExtent(Math.min(v,u.count-1))/u.size*1.2;this.gl.uniform3f(e.uniform("uShadowOffset"),l(0),l(1),l(2)),e.setMat4("uLightVP0",u.viewProj(0)),e.setMat4("uLightVP1",u.viewProj(Math.min(1,u.count-1))),e.setMat4("uLightVP2",u.viewProj(Math.min(2,u.count-1))),this.gl.uniform1i(e.uniform("uShadow0"),1),this.gl.uniform1i(e.uniform("uShadow1"),7),this.gl.uniform1i(e.uniform("uShadow2"),8),this.gl.uniform1i(e.uniform("uCascades"),u.count),e.setFloat("uShadowTexel",1/u.size),e.setFloat("uShadowStrength",u.settings.strength),e.setFloat("uShadowSoft",u.settings.soft?1:0),e.setFloat("uLightSize",u.settings.lightSize),this.gl.uniform1i(e.uniform("uLights"),2),this.gl.uniform1i(e.uniform("uTiles"),3),this.gl.uniform1i(e.uniform("uSplatCells"),9),this.gl.uniform1i(e.uniform("uSplatLayers"),10),this.gl.uniform1i(e.uniform("uSurfLayers"),12);const c=this.clouds.settings;this.clouds.bindCommon(e,11),e.setFloat("uCloudShadow",c.shadows?1:0);const f=this.fogVolumes,h=f.settings.shadows&&this.post.settings.enabled?f.active:0;f.bind(this.gl,e,h,po),e.setFloat("uFogVolShadow",h?1:0),this.gl.uniform2f(e.uniform("uTileInfo"),this.lights.tilesX,tt)}}const Ji=r=>`#version 300 es
layout(location = 0) in vec3 aPosition;
uniform mat4 uProjection;
uniform mat4 uView;
uniform mat4 uModel;
${r?bi:""}
void main() {
  gl_Position = uProjection * uView * uModel * ${r?"skinMatrix(uJointBase) * ":""}vec4(aPosition, 1.0);
  gl_Position.z -= 0.0004 * gl_Position.w;
}`,Qi=`#version 300 es
precision highp float;
uniform vec3 uColor;
uniform float uToneMap;
out vec4 outColor;
void main() {
  vec3 c = uToneMap > 0.5 ? pow(uColor, vec3(1.0 / 2.2)) : uColor;
  outColor = vec4(c, 1.0);
}`;function eo(r,e,t){const i=[e[0]-r[0],e[1]-r[1],e[2]-r[2]],o=Math.hypot(i[0],i[1],i[2])||1;return[r[0]+i[0]/o*t,r[1]+i[1]/o*t,r[2]+i[2]/o*t]}class Es{constructor(){d(this,"target",[0,0,0]);d(this,"yaw",Math.PI*.25);d(this,"pitch",55*Math.PI/180);d(this,"distance",24);d(this,"fov",45*Math.PI/180);d(this,"near",.1);d(this,"far",500);d(this,"minDistance",4);d(this,"maxDistance",120);d(this,"minPitch",12*Math.PI/180);d(this,"maxPitch",85*Math.PI/180)}eye(){const e=Math.cos(this.pitch);return[this.target[0]-Math.sin(this.yaw)*e*this.distance,this.target[1]+Math.sin(this.pitch)*this.distance,this.target[2]-Math.cos(this.yaw)*e*this.distance]}view(){return Xt(this.eye(),this.target)}projection(e){return uo(this.fov,e,this.near,Math.max(this.far,this.maxDistance*2.5))}pan(e,t){const i=Math.sin(this.yaw),o=Math.cos(this.yaw);this.target=[this.target[0]-o*e+i*t,this.target[1],this.target[2]+i*e+o*t]}rotate(e,t){this.yaw+=e,this.pitch=Math.min(this.maxPitch,Math.max(this.minPitch,this.pitch+t))}zoom(e){this.distance=Math.min(this.maxDistance,Math.max(this.minDistance,this.distance*e))}}const ce=11,Tt=ce*4;function $a(r){r.enableVertexAttribArray(0),r.vertexAttribPointer(0,3,r.FLOAT,!1,Tt,0),r.enableVertexAttribArray(1),r.vertexAttribPointer(1,3,r.FLOAT,!1,Tt,12),r.enableVertexAttribArray(2),r.vertexAttribPointer(2,3,r.FLOAT,!1,Tt,24),r.enableVertexAttribArray(3),r.vertexAttribPointer(3,2,r.FLOAT,!1,Tt,36)}class As{constructor(e,t){d(this,"vao");d(this,"count");d(this,"min");d(this,"max");d(this,"vbo");d(this,"ibo");d(this,"indices");d(this,"skinVbo",null);d(this,"dynamic",!1);d(this,"wire",null);this.gl=e;const i=e.createVertexArray(),o=e.createBuffer(),a=e.createBuffer();if(!i||!o||!a)throw new Error("mesh allocation failed");this.vao=i,this.vbo=o,this.ibo=a,e.bindVertexArray(i),e.bindBuffer(e.ARRAY_BUFFER,o),e.bufferData(e.ARRAY_BUFFER,t.vertices,e.STATIC_DRAW),$a(e),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,a),e.bufferData(e.ELEMENT_ARRAY_BUFFER,t.indices,e.STATIC_DRAW),e.bindVertexArray(null),this.count=t.indices.length,this.indices=t.indices,[this.min,this.max]=Lt(t.vertices,ce)}draw(){if(this.count===0)return;const e=this.gl;e.bindVertexArray(this.vao),e.drawElements(e.TRIANGLES,this.count,e.UNSIGNED_INT,0),e.bindVertexArray(null)}drawInstances(e){if(this.count===0||e<=0)return;const t=this.gl;t.bindVertexArray(this.vao),t.drawElementsInstanced(t.TRIANGLES,this.count,t.UNSIGNED_INT,0,e),t.bindVertexArray(null)}get skinned(){return this.skinVbo!==null}setSkin(e,t){const i=this.gl,o=Math.min(e.length,t.length)/4,a=new Float32Array(o*8);for(let s=0;s<o;s++)a.set(e.subarray(s*4,s*4+4),s*8),a.set(t.subarray(s*4,s*4+4),s*8+4);if(!this.skinVbo){const s=i.createBuffer();if(!s)throw new Error("skin buffer allocation failed");this.skinVbo=s}i.bindVertexArray(this.vao),this.bindSkin(),i.bufferData(i.ARRAY_BUFFER,a,i.STATIC_DRAW),i.bindVertexArray(null),i.bindBuffer(i.ARRAY_BUFFER,null),this.dropWire()}bindSkin(){const e=this.gl;e.bindBuffer(e.ARRAY_BUFFER,this.skinVbo),e.enableVertexAttribArray(hi),e.vertexAttribPointer(hi,4,e.FLOAT,!1,32,0),e.enableVertexAttribArray(fi),e.vertexAttribPointer(fi,4,e.FLOAT,!1,32,16)}setVertices(e){const t=this.gl;t.bindBuffer(t.ARRAY_BUFFER,this.vbo),this.dynamic?t.bufferSubData(t.ARRAY_BUFFER,0,e):(t.bufferData(t.ARRAY_BUFFER,e,t.DYNAMIC_DRAW),this.dynamic=!0),t.bindBuffer(t.ARRAY_BUFFER,null);const[i,o]=Lt(e,ce);for(let a=0;a<3;a++)this.min[a]=i[a],this.max[a]=o[a]}setIndices(e){const t=this.gl;t.bindVertexArray(this.vao),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.ibo),t.bufferData(t.ELEMENT_ARRAY_BUFFER,e,t.DYNAMIC_DRAW),t.bindVertexArray(null),this.count=e.length,this.indices=e,this.dropWire()}drawWire(){const e=this.gl;if(!this.wire){const t=this.indices,i=new Set,o=[],a=67108864;for(let u=0;u+2<t.length;u+=3)for(const[l,c]of[[t[u],t[u+1]],[t[u+1],t[u+2]],[t[u+2],t[u]]]){const f=l<c?l*a+c:c*a+l;i.has(f)||(i.add(f),o.push(l,c))}const s=e.createVertexArray(),n=e.createBuffer();if(!s||!n)throw new Error("wireframe allocation failed");e.bindVertexArray(s),e.bindBuffer(e.ARRAY_BUFFER,this.vbo),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,3,e.FLOAT,!1,Tt,0),this.skinVbo&&this.bindSkin(),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,n),e.bufferData(e.ELEMENT_ARRAY_BUFFER,new Uint32Array(o),e.STATIC_DRAW),e.bindVertexArray(null),this.wire={vao:s,ibo:n,count:o.length}}this.wire.count&&(e.bindVertexArray(this.wire.vao),e.drawElements(e.LINES,this.wire.count,e.UNSIGNED_INT,0),e.bindVertexArray(null))}dropWire(){this.wire&&(this.gl.deleteVertexArray(this.wire.vao),this.gl.deleteBuffer(this.wire.ibo),this.wire=null)}dispose(){this.dropWire(),this.gl.deleteVertexArray(this.vao),this.gl.deleteBuffer(this.vbo),this.gl.deleteBuffer(this.ibo),this.skinVbo&&this.gl.deleteBuffer(this.skinVbo)}}class _o{constructor(){d(this,"verts",[]);d(this,"idx",[])}quad(e,t,i,o,a,s=[[0,0],[1,0],[1,1],[0,1]]){const n=to(e,t,i),u=this.verts.length/ce;return[e,t,i,o].forEach((l,c)=>this.verts.push(l[0],l[1],l[2],n[0],n[1],n[2],a[0],a[1],a[2],s[c][0],s[c][1])),this.idx.push(u,u+1,u+2,u,u+2,u+3),this}tri(e,t,i,o,a=[[0,0],[1,0],[1,1]]){const s=to(e,t,i),n=this.verts.length/ce;return[e,t,i].forEach((u,l)=>this.verts.push(u[0],u[1],u[2],s[0],s[1],s[2],o[0],o[1],o[2],a[l][0],a[l][1])),this.idx.push(n,n+1,n+2),this}build(){return{vertices:new Float32Array(this.verts),indices:new Uint32Array(this.idx)}}}function to(r,e,t){const i=e[0]-r[0],o=e[1]-r[1],a=e[2]-r[2],s=t[0]-r[0],n=t[1]-r[1],u=t[2]-r[2],l=o*u-a*n,c=a*s-i*u,f=i*n-o*s,h=Math.hypot(l,c,f)||1;return[l/h,c/h,f/h]}function Rs(r,e,t,i,o,a,s){const n=new _o;return n.quad([r,e,a],[i,e,a],[i,o,a],[r,o,a],s),n.quad([i,e,t],[r,e,t],[r,o,t],[i,o,t],s),n.quad([i,e,a],[i,e,t],[i,o,t],[i,o,a],s),n.quad([r,e,t],[r,e,a],[r,o,a],[r,o,t],s),n.quad([r,o,a],[i,o,a],[i,o,t],[r,o,t],s),n.quad([r,e,t],[i,e,t],[i,e,a],[r,e,a],s),n.build()}function Fs(r,e,t,i){const o=new _o;for(let a=0;a<e;a++)for(let s=0;s<r;s++){const n=(s+a)%2===0?t:i;o.quad([s,0,a+1],[s+1,0,a+1],[s+1,0,a],[s,0,a],n,[[s,a+1],[s+1,a+1],[s+1,a],[s,a]])}return o.build()}const Ga=`function $(c, u) {
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
`;typeof self<"u"&&self.Blob&&new Blob(["URL.revokeObjectURL(import.meta.url);",Ga],{type:"text/javascript;charset=utf-8"});class Wa{constructor(e){d(this,"rig");d(this,"world");d(this,"t");d(this,"r");d(this,"s");d(this,"done");d(this,"jointMats");d(this,"skinnedOut",new Map);d(this,"jointBoxes",new Map);d(this,"ident",ye());d(this,"v3",[0,0,0]);d(this,"q4",[0,0,0,1]);d(this,"animated");d(this,"local",new Float32Array(16));d(this,"tmp",new Float32Array(16));d(this,"inverseBinds");if(this.model=e,!e.rig)throw new Error("model has no rig");this.rig=e.rig;const t=this.rig.nodes.length;this.world=Array.from({length:t},()=>ye()),this.t=this.rig.nodes.map(i=>[...i.t]),this.r=this.rig.nodes.map(i=>[...i.r]),this.s=this.rig.nodes.map(i=>[...i.s]),this.done=new Uint8Array(t),this.animated=new Uint8Array(t),this.jointMats=this.rig.skins.map(i=>new Float32Array(i.joints.length*16)),this.inverseBinds=this.rig.skins.map(i=>i.joints.map((o,a)=>i.inverseBind.subarray(a*16,a*16+16))),this.pose(null,0)}get clips(){return this.rig.clips}pose(e,t){this.poseLayers(e?[{clip:e,time:t}]:[])}poseLayers(e){const t=this.rig.nodes;for(let s=0;s<t.length;s++){const n=t[s];this.t[s][0]=n.t[0],this.t[s][1]=n.t[1],this.t[s][2]=n.t[2],this.r[s][0]=n.r[0],this.r[s][1]=n.r[1],this.r[s][2]=n.r[2],this.r[s][3]=n.r[3],this.s[s][0]=n.s[0],this.s[s][1]=n.s[1],this.s[s][2]=n.s[2]}const i=this.animated;i.fill(0);for(const s of e){const n=Math.min(1,Math.max(0,s.weight??1));if(!(n<=0))for(const u of s.clip.channels){if(!t[u.node])continue;const l=u.path==="translation"?this.t[u.node]:u.path==="rotation"?this.r[u.node]:this.s[u.node];if(n>=1)io(u,s.time,l);else{const c=u.path==="rotation"?this.q4:this.v3;if(io(u,s.time,c),u.path==="rotation")Ha(l,c,n);else for(let f=0;f<3;f++)l[f]+=(c[f]-l[f])*n}i[u.node]=1}}this.done.fill(0);for(let s=0;s<t.length;s++)this.place(s);const o=this.rig.skins,a=this.tmp;for(let s=0;s<o.length;s++){const n=o[s],u=this.jointMats[s],l=this.inverseBinds[s];for(let c=0;c<n.joints.length;c++)ve(this.world[n.joints[c]]??this.ident,l[c],a),u.set(a,c*16)}}place(e){if(this.done[e])return this.world[e];this.done[e]=1;const t=this.rig.nodes[e],i=t.parent<0?null:this.place(t.parent),o=t.matrix&&!this.animated[e]?t.matrix:Ya(this.t[e],this.r[e],this.s[e],this.local);return i?ve(i,o,this.world[e]):this.world[e].set(o),this.world[e]}partMatrix(e){const t=this.model.parts[e];return t.skin!==void 0?this.ident:(t.node!==void 0?this.world[t.node]:void 0)??t.matrix}jointMatrices(e){return this.jointMats[e]}skinBounds(e,t=[0,0,0],i=[0,0,0]){const o=this.model.parts[e];if(t[0]=t[1]=t[2]=1/0,i[0]=i[1]=i[2]=-1/0,!this.isSkinned(e))return t.splice(0,3,...this.model.min),i.splice(0,3,...this.model.max),{min:t,max:i};const a=this.jointMats[o.skin],s=this.boxesOf(e,a.length/16);for(let n=0;n<a.length/16;n++){const u=n*6;if(s[u]>s[u+3])continue;const l=n*16;for(let c=0;c<8;c++){const f=c&1?s[u+3]:s[u],h=c&2?s[u+4]:s[u+1],v=c&4?s[u+5]:s[u+2];for(let p=0;p<3;p++){const x=a[l+p]*f+a[l+4+p]*h+a[l+8+p]*v+a[l+12+p];x<t[p]&&(t[p]=x),x>i[p]&&(i[p]=x)}}}return t[0]>i[0]&&(t.fill(0),i.fill(0)),{min:t,max:i}}boxesOf(e,t){let i=this.jointBoxes.get(e);if(i)return i;i=new Float32Array(t*6);for(let u=0;u<t;u++)i.set([1/0,1/0,1/0,-1/0,-1/0,-1/0],u*6);const o=this.model.parts[e],a=o.mesh.vertices,s=o.joints,n=o.weights;for(let u=0;u<a.length/ce;u++)for(let l=0;l<4;l++){if(!n[u*4+l])continue;const c=s[u*4+l];if(c<0||c>=t)continue;const f=c*6;for(let h=0;h<3;h++){const v=a[u*ce+h];v<i[f+h]&&(i[f+h]=v),v>i[f+3+h]&&(i[f+3+h]=v)}}return this.jointBoxes.set(e,i),i}isSkinned(e){const t=this.model.parts[e];return t.skin!==void 0&&!!t.joints&&!!t.weights&&!!this.rig.skins[t.skin]}skinned(e){const t=this.model.parts[e],i=t.mesh.vertices;let o=this.skinnedOut.get(e);o||(o=new Float32Array(i),this.skinnedOut.set(e,o));const a=this.jointMats[t.skin],s=t.joints,n=t.weights,u=i.length/ce,l=new Float64Array(12);for(let c=0;c<u;c++){l.fill(0);let f=0;for(let R=0;R<4;R++){const _=n[c*4+R];if(!_)continue;const k=s[c*4+R]*16;k+16>a.length||(f+=_,l[0]+=_*a[k],l[1]+=_*a[k+1],l[2]+=_*a[k+2],l[3]+=_*a[k+4],l[4]+=_*a[k+5],l[5]+=_*a[k+6],l[6]+=_*a[k+8],l[7]+=_*a[k+9],l[8]+=_*a[k+10],l[9]+=_*a[k+12],l[10]+=_*a[k+13],l[11]+=_*a[k+14])}const h=c*ce;if(f<=0)continue;if(Math.abs(f-1)>1e-4)for(let R=0;R<12;R++)l[R]/=f;const v=i[h],p=i[h+1],x=i[h+2];o[h]=l[0]*v+l[3]*p+l[6]*x+l[9],o[h+1]=l[1]*v+l[4]*p+l[7]*x+l[10],o[h+2]=l[2]*v+l[5]*p+l[8]*x+l[11];const w=i[h+3],m=i[h+4],g=i[h+5];let E=l[0]*w+l[3]*m+l[6]*g,S=l[1]*w+l[4]*m+l[7]*g,C=l[2]*w+l[5]*m+l[8]*g;const A=Math.sqrt(E*E+S*S+C*C)||1;E/=A,S/=A,C/=A,o[h+3]=E,o[h+4]=S,o[h+5]=C}return o}}function io(r,e,t){const i=r.times,o=t.length,a=i.length;if(!a)return;const s=r.interpolation==="CUBICSPLINE",n=s?3*o:o,u=s?o:0,l=r.values;if(e<=i[0]||a===1){for(let m=0;m<o;m++)t[m]=l[u+m];return}if(e>=i[a-1]){const m=(a-1)*n+u;for(let g=0;g<o;g++)t[g]=l[m+g];return}let c=0,f=a-1;for(;f-c>1;){const m=c+f>>1;i[m]<=e?c=m:f=m}const h=i[c],v=i[f]-h,p=v>0?(e-h)/v:0;if(r.interpolation==="STEP"){const m=c*n+u;for(let g=0;g<o;g++)t[g]=l[m+g];return}if(s){const m=p*p,g=m*p,E=2*g-3*m+1,S=g-2*m+p,C=-2*g+3*m,A=g-m,R=c*n+u,_=f*n+u;for(let k=0;k<o;k++)t[k]=E*l[R+k]+S*v*l[R+o+k]+C*l[_+k]+A*v*l[_-o+k];r.path==="rotation"&&Ti(t);return}const x=c*n+u,w=f*n+u;if(r.path==="rotation"){ja(l,x,w,p,t);return}for(let m=0;m<o;m++)t[m]=l[x+m]+(l[w+m]-l[x+m])*p}function ja(r,e,t,i,o){const a=r[e],s=r[e+1],n=r[e+2],u=r[e+3];let l=r[t],c=r[t+1],f=r[t+2],h=r[t+3],v=a*l+s*c+n*f+u*h;v<0&&(v=-v,l=-l,c=-c,f=-f,h=-h);let p,x;if(v>.9995)p=1-i,x=i;else{const w=Math.acos(v),m=Math.sin(w);p=Math.sin((1-i)*w)/m,x=Math.sin(i*w)/m}o[0]=a*p+l*x,o[1]=s*p+c*x,o[2]=n*p+f*x,o[3]=u*p+h*x,Ti(o)}function Ha(r,e,t){const i=r[0]*e[0]+r[1]*e[1]+r[2]*e[2]+r[3]*e[3]<0?-1:1;for(let o=0;o<4;o++)r[o]+=(e[o]*i-r[o])*t;Ti(r)}function Ti(r){const e=Math.sqrt(r[0]*r[0]+r[1]*r[1]+r[2]*r[2]+r[3]*r[3])||1;r[0]/=e,r[1]/=e,r[2]/=e,r[3]/=e}function Ya(r,e,t,i=new Float32Array(16)){const o=e[0],a=e[1],s=e[2],n=e[3];return i[0]=(1-2*(a*a+s*s))*t[0],i[1]=2*(o*a+s*n)*t[0],i[2]=2*(o*s-a*n)*t[0],i[3]=0,i[4]=2*(o*a-s*n)*t[1],i[5]=(1-2*(o*o+s*s))*t[1],i[6]=2*(a*s+o*n)*t[1],i[7]=0,i[8]=2*(o*s+a*n)*t[2],i[9]=2*(a*s-o*n)*t[2],i[10]=(1-2*(o*o+a*a))*t[2],i[11]=0,i[12]=r[0],i[13]=r[1],i[14]=r[2],i[15]=1,i}const oo={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT4:16};async function _s(r,e){const t=await fetch(e);if(!t.ok)throw new Error(`glb ${e}: ${t.status}`);return Ka(r,await t.arrayBuffer())}const ai=new WeakMap;function qa(r){let e=2166136261;for(let t=0;t<r.length;t++)e=Math.imul(e^r[t],16777619);return(e>>>0).toString(36)}function Ka(r,e,t={}){var _,k,B;const i=new DataView(e);if(i.getUint32(0,!0)!==1179937895)throw new Error("not a glb");let o=12,a=null,s=null;for(;o<e.byteLength;){const y=i.getUint32(o,!0),F=i.getUint32(o+4,!0),M=e.slice(o+8,o+8+y);F===1313821514?a=JSON.parse(new TextDecoder().decode(M)):F===5130562&&(s=M),o+=8+y}if(!a||!s)throw new Error("glb is missing its JSON or BIN chunk");const n=a,u=s,l=y=>{const F=n.bufferViews[y];return new Uint8Array(u,F.byteOffset??0,F.byteLength)},c=y=>{const F=n.accessors[y],M=oo[F.type],D=new Float32Array(F.count*M);if(F.bufferView===void 0)return D;const j=n.bufferViews[F.bufferView],K=(j.byteOffset??0)+(F.byteOffset??0),X=F.componentType===5126||F.componentType===5125?4:F.componentType===5123||F.componentType===5122?2:1,J=j.byteStride??M*X,H=new DataView(u);for(let N=0;N<F.count;N++)for(let oe=0;oe<M;oe++){const Q=K+N*J+oe*X;let L;switch(F.componentType){case 5126:L=H.getFloat32(Q,!0);break;case 5125:L=H.getUint32(Q,!0);break;case 5123:L=H.getUint16(Q,!0),F.normalized&&(L/=65535);break;case 5122:L=H.getInt16(Q,!0),F.normalized&&(L=Math.max(-1,L/32767));break;case 5121:L=H.getUint8(Q),F.normalized&&(L/=255);break;default:L=H.getInt8(Q),F.normalized&&(L=Math.max(-1,L/127))}D[N*M+oe]=L}return D},f=new Map,h=new Map,v=(y,F)=>{var N,oe,Q,L;const M=`${y}:${F}`;let D=f.get(M);if(D)return D;const j=(N=n.textures)==null?void 0:N[y],K=((Q=(oe=j==null?void 0:j.extensions)==null?void 0:oe.EXT_texture_webp)==null?void 0:Q.source)??(j==null?void 0:j.source),X=K!==void 0?(L=n.images)==null?void 0:L[K]:void 0,J=t.maxTextureSize??1/0;let H=null;if((X==null?void 0:X.bufferView)!==void 0&&t.shareTextures!==!1){const W=l(X.bufferView);H=`${F?"s":"l"}:${J}:${W.length}:${qa(W)}`;const T=h.get(H);if(T)return f.set(M,T),T;let b=ai.get(r);b||ai.set(r,b=new Map);const P=b.get(H);if(P)return P.retain(),h.set(H,P),f.set(M,P),P}if(D=new Et(r,F),f.set(M,D),H){const W=H,T=ai.get(r);T.set(W,D),h.set(W,D),D.onFreed(()=>T.get(W)===D&&T.delete(W))}if((X==null?void 0:X.bufferView)!==void 0){const W=l(X.bufferView),T=new Blob([W.slice().buffer],{type:X.mimeType??"image/png"});createImageBitmap(T,{imageOrientation:"flipY",colorSpaceConversion:"none"}).then(b=>{if(b.width<=J&&b.height<=J)return b;const P=J/Math.max(b.width,b.height);return createImageBitmap(b,{resizeWidth:Math.max(1,Math.round(b.width*P)),resizeHeight:Math.max(1,Math.round(b.height*P)),resizeQuality:"high"}).finally(()=>b.close())}).then(b=>D.queueImage(b,!1)).catch(b=>console.warn("glb texture failed",b))}else if(X!=null&&X.uri){const W=new Image;W.onload=()=>D.queueImage(W),W.src=X.uri}return D},p=new Map,x=y=>{var N,oe,Q;if(y===void 0)return ci();let F=p.get(y);if(F)return F;const M=(N=n.materials)==null?void 0:N[y],D=M==null?void 0:M.pbrMetallicRoughness,j=(D==null?void 0:D.baseColorFactor)??[1,1,1,1],K=((Q=(oe=M==null?void 0:M.extensions)==null?void 0:oe.KHR_materials_emissive_strength)==null?void 0:Q.emissiveStrength)??1,X=((M==null?void 0:M.emissiveFactor)??[0,0,0]).map(L=>L*K),J=(M==null?void 0:M.alphaMode)==="BLEND",H=(M==null?void 0:M.alphaMode)==="MASK";return F=ci({color:[j[0],j[1],j[2]],albedo:D!=null&&D.baseColorTexture?v(D.baseColorTexture.index,!0):null,metallicRoughness:D!=null&&D.metallicRoughnessTexture?v(D.metallicRoughnessTexture.index,!1):null,normal:M!=null&&M.normalTexture?v(M.normalTexture.index,!1):null,metallic:(D==null?void 0:D.metallicFactor)??1,roughness:(D==null?void 0:D.roughnessFactor)??1,emissive:[X[0],X[1],X[2]],emissiveMap:M!=null&&M.emissiveTexture?v(M.emissiveTexture.index,!0):null,doubleSided:(M==null?void 0:M.doubleSided)??!1,transparent:J,opacity:J||H?Math.min(1,Math.max(0,j[3]??1)):1,cutoff:H?Math.max(0,(M==null?void 0:M.alphaCutoff)??.5):0}),p.set(y,F),F},w=[],m=new Set,g=y=>{let F=y;for(let M=2;m.has(F);M++)F=`${y} ${M}`;return m.add(F),F},E=[1/0,1/0,1/0],S=[-1/0,-1/0,-1/0],C=(y,F)=>{var j,K,X,J;const M=(j=n.nodes)==null?void 0:j[y];if(!M)return;const D=ve(F,Ja(M));if(M.mesh!==void 0){const H=(K=n.meshes)==null?void 0:K[M.mesh];for(const N of(H==null?void 0:H.primitives)??[]){if((N.mode??4)!==4)continue;const oe=c(N.attributes.POSITION),Q=oe.length/3,L=N.attributes.NORMAL!==void 0?c(N.attributes.NORMAL):null,W=N.attributes.TEXCOORD_0!==void 0?c(N.attributes.TEXCOORD_0):null,T=N.attributes.COLOR_0!==void 0?c(N.attributes.COLOR_0):null,b=N.attributes.COLOR_0!==void 0?oo[n.accessors[N.attributes.COLOR_0].type]:0,P=new Float32Array(Q*ce);for(let U=0;U<Q;U++){const V=U*ce;P[V]=oe[U*3],P[V+1]=oe[U*3+1],P[V+2]=oe[U*3+2],P[V+3]=L?L[U*3]:0,P[V+4]=L?L[U*3+1]:1,P[V+5]=L?L[U*3+2]:0,P[V+6]=T?T[U*b]:1,P[V+7]=T?T[U*b+1]:1,P[V+8]=T?T[U*b+2]:1,P[V+9]=W?W[U*2]:0,P[V+10]=W?1-W[U*2+1]:0}let z;if(N.indices!==void 0){const U=c(N.indices);z=new Uint32Array(U.length);for(let V=0;V<U.length;V++)z[V]=U[V]}else{z=new Uint32Array(Q);for(let U=0;U<Q;U++)z[U]=U}L||Qa(P,z);const $={name:g(M.name??(H==null?void 0:H.name)??`part ${w.length}`),mesh:{vertices:P,indices:z},material:x(N.material),matrix:D,node:y},O=N.material!==void 0?(J=(X=n.materials)==null?void 0:X[N.material])==null?void 0:J.name:void 0;typeof O=="string"&&O&&($.materialName=O),M.skin!==void 0&&N.attributes.JOINTS_0!==void 0&&N.attributes.WEIGHTS_0!==void 0?($.skin=M.skin,$.joints=c(N.attributes.JOINTS_0),$.weights=c(N.attributes.WEIGHTS_0)):(si(P,D,$),ro(E,S,$)),w.push($)}}for(const H of M.children??[])C(H,D)},A=(_=n.scenes)==null?void 0:_[n.scene??0];for(const y of(A==null?void 0:A.nodes)??(n.nodes??[]).map((F,M)=>M))C(y,ye());const R={parts:w,min:E,max:S};if(((k=n.animations)!=null&&k.length||(B=n.skins)!=null&&B.length)&&(R.rig=Za(n,c)),R.rig&&w.some(y=>y.skin!==void 0)){const y=new Wa(R);w.forEach((F,M)=>{F.skin!==void 0&&(y.isSkinned(M)?si(y.skinned(M),null,F):si(F.mesh.vertices,F.matrix,F),ro(E,S,F))})}return E[0]>S[0]&&(E.fill(0),S.fill(0)),R}function si(r,e,t){const i=[1/0,1/0,1/0],o=[-1/0,-1/0,-1/0],a=e??ye();for(let s=0;s<r.length;s+=ce){const n=r[s],u=r[s+1],l=r[s+2],c=a[0]*n+a[4]*u+a[8]*l+a[12],f=a[1]*n+a[5]*u+a[9]*l+a[13],h=a[2]*n+a[6]*u+a[10]*l+a[14];c<i[0]&&(i[0]=c),f<i[1]&&(i[1]=f),h<i[2]&&(i[2]=h),c>o[0]&&(o[0]=c),f>o[1]&&(o[1]=f),h>o[2]&&(o[2]=h)}i[0]>o[0]&&(i.fill(0),o.fill(0)),t.min=i,t.max=o}function ro(r,e,t){if(t.mesh.vertices.length)for(let i=0;i<3;i++)t.min[i]<r[i]&&(r[i]=t.min[i]),t.max[i]>e[i]&&(e[i]=t.max[i])}function Za(r,e){const t=(r.nodes??[]).map((a,s)=>({name:a.name??`node ${s}`,parent:-1,t:a.translation??[0,0,0],r:a.rotation??[0,0,0,1],s:a.scale??[1,1,1],matrix:a.matrix?new Float32Array(a.matrix):null}));(r.nodes??[]).forEach((a,s)=>{for(const n of a.children??[])t[n]&&(t[n].parent=s)});const i=(r.skins??[]).map(a=>{const s=a.inverseBindMatrices!==void 0?e(a.inverseBindMatrices):new Float32Array(a.joints.length*16);if(a.inverseBindMatrices===void 0)for(let n=0;n<a.joints.length;n++)s.set(ye(),n*16);return{joints:a.joints.slice(),inverseBind:s}}),o=(r.animations??[]).map((a,s)=>{const n=[];let u=0;for(const l of a.channels){const c=l.target.path;if(l.target.node===void 0||c!=="translation"&&c!=="rotation"&&c!=="scale")continue;const f=a.samplers[l.sampler],h=e(f.input),v=f.interpolation==="STEP"||f.interpolation==="CUBICSPLINE"?f.interpolation:"LINEAR";n.push({node:l.target.node,path:c,interpolation:v,times:h,values:e(f.output)}),h.length&&(u=Math.max(u,h[h.length-1]))}return{name:a.name??`clip ${s+1}`,duration:u,channels:n}});return{nodes:t,skins:i,clips:o}}function Ja(r){if(r.matrix)return new Float32Array(r.matrix);const e=r.translation??[0,0,0],t=r.rotation??[0,0,0,1],i=r.scale??[1,1,1],[o,a,s,n]=t,u=new Float32Array(16);return u[0]=(1-2*(a*a+s*s))*i[0],u[1]=2*(o*a+s*n)*i[0],u[2]=2*(o*s-a*n)*i[0],u[4]=2*(o*a-s*n)*i[1],u[5]=(1-2*(o*o+s*s))*i[1],u[6]=2*(a*s+o*n)*i[1],u[8]=2*(o*s+a*n)*i[2],u[9]=2*(a*s-o*n)*i[2],u[10]=(1-2*(o*o+a*a))*i[2],u[12]=e[0],u[13]=e[1],u[14]=e[2],u[15]=1,u}function Qa(r,e){const t=r.length/ce,i=new Float32Array(t*3);for(let o=0;o+2<e.length;o+=3){const a=e[o]*ce,s=e[o+1]*ce,n=e[o+2]*ce,u=r[s]-r[a],l=r[s+1]-r[a+1],c=r[s+2]-r[a+2],f=r[n]-r[a],h=r[n+1]-r[a+1],v=r[n+2]-r[a+2],p=l*v-c*h,x=c*f-u*v,w=u*h-l*f;for(const m of[e[o],e[o+1],e[o+2]])i[m*3]+=p,i[m*3+1]+=x,i[m*3+2]+=w}for(let o=0;o<t;o++){const a=Math.hypot(i[o*3],i[o*3+1],i[o*3+2])||1;r[o*ce+3]=i[o*3]/a,r[o*ce+4]=i[o*3+1]/a,r[o*ce+5]=i[o*3+2]/a}}const es={topLow:[.54,.63,.48],topHigh:[1,1,1],step:[.96,.93,.89],cliff:[.85,.73,.65],rim:[.23,.19,.16]},ts=2,is=.3,os=.28,rs=.34,ao=4,as=.3,je=[0,1,0,-1],He=[-1,0,1,0],ss=[[0,1,2,3],[1,3,0,2],[2,3,0,1],[0,2,1,3]],ns=[[0,0,0],[3,0,1],[2,2,2]];function so(r,e){const t=(l,c)=>{let f=l*374761393+c*668265263|0;return f=Math.imul(f^f>>>13,1274126177),((f^f>>>16)>>>0)/4294967296},i=Math.floor(r),o=Math.floor(e);let a=r-i,s=e-o;a=a*a*(3-2*a),s=s*s*(3-2*s);const n=t(i,o)+(t(i+1,o)-t(i,o))*a,u=t(i,o+1)+(t(i+1,o+1)-t(i,o+1))*a;return n+(u-n)*s}function ls(r,e,t){var x,w;const{width:i,height:o}=r,a=t??new Float32Array(i*o*4),s=0,n=o,u=0,l=i,c=r.maxStep,f=r.levelHeight,h=new Float64Array(4),v=new Uint8Array(4),p=(m,g,E)=>{for(let A=0;A<4;A++){const R=m-1+(A&1),_=g-1+(A>>1);h[A]=R>=0&&_>=0&&R<i&&_<o?r.level(R,_):NaN,v[A]=A===E?1:0}for(let A=!0;A;){A=!1;for(let R=0;R<4;R++){const _=h[R];if(!(v[R]||_!==_)){for(let k=0;k<4;k++)if(v[k]&&Math.abs(h[k]-_)<=c){v[R]=1,A=!0;break}}}}let S=0,C=0;for(let A=0;A<4;A++)v[A]&&(S+=h[A],C++);return S/Math.max(1,C)*f};for(let m=s;m<n;m++)for(let g=u;g<l;g++){const E=(m*i+g)*4,S=((x=r.sink)==null?void 0:x.call(r,g,m))??0;if((w=r.flat)!=null&&w.call(r,g,m)){const C=r.level(g,m)*f-S;a[E]=a[E+1]=a[E+2]=a[E+3]=C}else a[E]=p(g,m,3)-S,a[E+1]=p(g+1,m,2)-S,a[E+2]=p(g,m+1,1)-S,a[E+3]=p(g+1,m+1,0)-S;if(r.corner)for(let C=0;C<4;C++)a[E+C]=r.corner(g,m,C,a[E+C])}return a}function Ms(r,e,t,i,o){const a=Math.min(e-1,Math.max(0,Math.floor(i))),s=Math.min(t-1,Math.max(0,Math.floor(o))),n=Math.min(1,Math.max(0,i-a)),u=Math.min(1,Math.max(0,o-s)),l=(s*e+a)*4,c=r[l]+(r[l+1]-r[l])*n,f=r[l+2]+(r[l+3]-r[l+2])*n;return c+(f-c)*u}function us(r,e,t,i){if(!i)return r;let o=0;for(let n=0;n<t;n++)i[n]&&(o+=e[n*2+1]);const a=new Uint32Array(o);let s=0;for(let n=0;n<t;n++){if(!i[n])continue;const u=e[n*2],l=e[n*2+1];a.set(r.subarray(u,u+l),s),s+=l}return a}function ni(r,e=.001){const t=r.vertices,i=t.length/ce;if(i===0)return;const o=new Int32Array(i),a=new Int32Array(i),s=new Int32Array(i);let n=1;for(;n<i*2;)n<<=1;const u=n-1,l=new Int32Array(n).fill(-1),c=new Int32Array(i);for(let v=0;v<i;v++){const p=v*ce,x=Math.round(t[p]/e),w=Math.round(t[p+1]/e),m=Math.round(t[p+2]/e);o[v]=x,a[v]=w,s[v]=m;let g=Math.imul(x,2654435761)^Math.imul(w,2246822519)^Math.imul(m,3266489917);for(g^=g>>>15,g=Math.imul(g,739982445),g^=g>>>12,g&=u;;){const E=l[g];if(E<0){l[g]=v;break}if(o[E]===x&&a[E]===w&&s[E]===m)break;g=g+1&u}c[v]=g}const f=new Float64Array(n*3),h=new Int32Array(n);for(let v=0;v<i;v++){const p=v*ce,x=c[v];f[x*3]+=t[p+3],f[x*3+1]+=t[p+4],f[x*3+2]+=t[p+5],h[x]++}for(let v=0;v<i;v++){const p=c[v];if(h[p]<2)continue;const x=f[p*3],w=f[p*3+1],m=f[p*3+2],g=Math.hypot(x,w,m);if(g<1e-4)continue;const E=v*ce;t[E+3]=x/g,t[E+4]=w/g,t[E+5]=m/g}}function Dt(r,e,t){const i=Math.sin(r*12.9898+e*78.233+t*37.719)*43758.5453;return i-Math.floor(i)}function li(r,e,t,i){const o=e*4,a=r[o]+(r[o+1]-r[o])*t,s=r[o+2]+(r[o+3]-r[o+2])*t;return a+(s-a)*i}class ui{constructor(){d(this,"v",[]);d(this,"idx",[])}get count(){return this.idx.length}tri(e,t,i,o,a,s,n,u,l,c,f,h,v,p,x,w){const m=s-e,g=n-t,E=u-i,S=f-e,C=h-t,A=v-i;let R=g*A-E*C,_=E*S-m*A,k=m*C-g*S;const B=Math.hypot(R,_,k)||1;R/=B,_/=B,k/=B;const y=this.v.length/ce;this.v.push(e,t,i,R,_,k,w[0],w[1],w[2],o,a,s,n,u,R,_,k,w[0],w[1],w[2],l,c,f,h,v,R,_,k,w[0],w[1],w[2],p,x),this.idx.push(y,y+1,y+2)}data(){return{vertices:new Float32Array(this.v),indices:new Uint32Array(this.idx)}}}class cs{constructor(){d(this,"v",[]);d(this,"idx",[])}get count(){return this.idx.length}tri(e,t,i,o,a,s,n,u,l,c,f,h,v){const p=this.v.length/7;this.v.push(e,t,i,v[0],v[1],v[2],o,a,s,n,v[0],v[1],v[2],u,l,c,f,v[0],v[1],v[2],h),this.idx.push(p,p+1,p+2)}data(){return{vertices:new Float32Array(this.v),indices:new Uint32Array(this.idx)}}}function Ss(r,e,t=es,i={}){var W;const o=Math.max(0,i.faceRoughness??0),a=r.width,s=r.height,n=i.corners??ls(r),u=i.region,l=u?Math.max(0,u.x0-1):0,c=u?Math.max(0,u.z0-1):0,f=u?Math.min(a,u.x1+1):a,h=u?Math.min(s,u.z1+1):s,v=f-l,p=h-c,x=new Int32Array(v*p*2),w=new Int32Array(v*p*2),m=new Int32Array(v*p*2),g=new ui,E=new ui,S=new Int32Array(v*p*2);let C=g;const A=new ui,R=new cs,_=1/ts,k=(T,b)=>b*a+T,B=(T,b)=>T>=0&&b>=0&&T<a&&b<s,y=(T,b)=>r.level(T,b),F=(T,b,P)=>{const z=T/Math.max(1,e),$=(b+P)%2===0?.94:1;return[(t.topLow[0]+(t.topHigh[0]-t.topLow[0])*z)*$,(t.topLow[1]+(t.topHigh[1]-t.topLow[1])*z)*$,(t.topLow[2]+(t.topHigh[2]-t.topLow[2])*z)*$]},M=(T,b,P,z,$,O,U,V,Y,fe)=>{(O-P)*(U-T)-(z-T)*(Y-P)>=0?C.tri(T,b,P,T*_,P*_,z,$,O,z*_,O*_,U,V,Y,U*_,Y*_,fe):C.tri(T,b,P,T*_,P*_,U,V,Y,U*_,Y*_,z,$,O,z*_,O*_,fe)},D=(T,b,P)=>{var Te,de;if(!B(T,b))return!1;const z=T+je[P],$=b+He[P];if(!B(z,$)||(Te=r.flat)!=null&&Te.call(r,T,b)||!(((de=r.cliff)==null?void 0:de.call(r,T,b,z,$))??y(T,b)-y(z,$)>r.maxStep))return!1;const[O,U,V,Y]=ss[P],fe=k(T,b),he=k(z,$);return n[fe*4+O]>n[he*4+V]+1e-4||n[fe*4+U]>n[he*4+Y]+1e-4},j=(T,b,P)=>as*(.15+.85*Dt(T,b,P+7)),K=(T,b,P,z)=>n[k(T,b)*4+(P-T)+2*(z-b)],X=(T,b,P,z,$,O,U)=>{const V=T+z,Y=b+$;if(!D(T,b,P)||!D(V,Y,P))return 0;const fe=ns[$+1][z+1];if(D(T,b,fe)||D(V,Y,(fe+2)%4))return 0;const he=O-je[P],Te=U-He[P];if(Math.abs(K(T,b,O,U)-K(V,Y,O,U))>1e-4||Math.abs(K(T,b,he,Te)-K(V,Y,he,Te))>1e-4)return 0;const de=T+je[P],we=b+He[P];return Math.abs(K(de,we,O,U)-K(de+z,we+$,O,U))>1e-4?0:j(O,U,P)},J=(T,b,P,z,$,O,U,V,Y,fe,he,Te=0,de=1,we=!1,qe=0)=>{const Xe=Math.max(b-V,$-U);if(we&&o>0&&Xe>.05){H(T,b,P,z,$,O,U,V,Y,fe,he,Te,de,qe);return}const Pe=z-T,Ke=O-P,_e=U-b,Le=Ke*_e*Y+-Pe*_e*fe>0,Ee=(T+P)*_,Ae=(z+O)*_;Le?(A.tri(T,b,P,Ee,b*_,z,$,O,Ae,$*_,z,U,O,Ae,U*_,he),A.tri(T,b,P,Ee,b*_,z,U,O,Ae,U*_,T,V,P,Ee,V*_,he)):(A.tri(T,b,P,Ee,b*_,z,U,O,Ae,U*_,z,$,O,Ae,$*_,he),A.tri(T,b,P,Ee,b*_,T,V,P,Ee,V*_,z,U,O,Ae,U*_,he))},H=(T,b,P,z,$,O,U,V,Y,fe,he,Te,de,we)=>{const qe=Math.hypot(z-T,O-P),Xe=Math.max(1,Math.ceil(qe/.2)),Pe=we>0?we:Math.max(2,Math.ceil(Math.max(b-V,$-U)/.18)),Ke=Math.hypot(Y,fe)||1,_e=Y/Ke,Le=fe/Ke,Ee=z-T,Ae=O-P,I=Ae*-1*_e+-Ee*-1*Le>0,ee=(se,pe)=>{const ne=se/Xe,be=pe/Pe,le=T+Ee*ne,ge=P+Ae*ne,Ue=b+($-b)*ne,$e=V+(U-V)*ne,ke=Ue+($e-Ue)*be,Ie=Te+(de-Te)*ne,Me=Ue-$e,Ge=Math.sin(Math.PI*be)*Math.min(1,Math.min(Ie,1-Ie)*6)*Math.min(1,Math.max(0,Me)/.9),G=le+ge,Z=so(G*2.3,ke*2.9)*.65+so(G*5.1+3.7,ke*6.3+1.3)*.35,te=o*1.6*Z*Ge;return[le+_e*te,ke,ge+Le*te]},ue=se=>[(se[0]+se[2])*_,se[1]*_];for(let se=0;se<Xe;se++)for(let pe=0;pe<Pe;pe++){const ne=ee(se,pe),be=ee(se+1,pe),le=ee(se+1,pe+1),ge=ee(se,pe+1),[Ue,$e]=ue(ne),[ke,Ie]=ue(be),[Me,Ge]=ue(le),[G,Z]=ue(ge);I?(A.tri(ne[0],ne[1],ne[2],Ue,$e,be[0],be[1],be[2],ke,Ie,le[0],le[1],le[2],Me,Ge,he),A.tri(ne[0],ne[1],ne[2],Ue,$e,le[0],le[1],le[2],Me,Ge,ge[0],ge[1],ge[2],G,Z,he)):(A.tri(ne[0],ne[1],ne[2],Ue,$e,le[0],le[1],le[2],Me,Ge,be[0],be[1],be[2],ke,Ie,he),A.tri(ne[0],ne[1],ne[2],Ue,$e,ge[0],ge[1],ge[2],G,Z,le[0],le[1],le[2],Me,Ge,he))}};for(let T=c;T<h;T++)for(let b=l;b<f;b++){const P=k(b,T),z=(T-c)*v+(b-l),$=y(b,T),O=n[P*4],U=n[P*4+1],V=n[P*4+2],Y=n[P*4+3];C=(((W=r.sink)==null?void 0:W.call(r,b,T))??0)>0?E:g,x[z*2]=g.count,S[z*2]=E.count,w[z*2]=A.count,m[z*2]=R.count;const fe=F($,b,T),he=(de,we,qe,Xe,Pe,Ke,_e,Le,Ee,Ae)=>{let I=0,ee=0,ue=-1;if(B(de,we)){const pe=k(de,we);ue=y(de,we),I=n[pe*4+Ee],ee=n[pe*4+Ae]}if(Pe<=I+1e-4&&Le<=ee+1e-4)return;const se=ue<0||$-ue>r.maxStep?t.cliff:t.step;J(qe,Pe,Xe,Ke,Le,_e,Math.min(ee,Le),Math.min(I,Pe),de-b,we-T,se)},Te=[D(b,T,0),D(b,T,1),D(b,T,2),D(b,T,3)];if(!Te.some(Boolean))C.tri(b,O,T,b*_,T*_,b,V,T+1,b*_,(T+1)*_,b+1,Y,T+1,(b+1)*_,(T+1)*_,fe),C.tri(b,O,T,b*_,T*_,b+1,Y,T+1,(b+1)*_,(T+1)*_,b+1,U,T,(b+1)*_,T*_,fe),he(b,T-1,b+1,T,U,b,T,O,3,2),he(b,T+1,b,T+1,V,b+1,T+1,Y,0,1),he(b-1,T,b,T,O,b,T+1,V,1,3),he(b+1,T,b+1,T+1,Y,b+1,T,U,2,0);else{const de=(I,ee,ue,se,pe,ne,be)=>{const le=X(b,T,se,pe[0],pe[1],I,ee),ge=X(b,T,ne,be[0],be[1],I,ee);return{x:I-je[se]*le-je[ne]*ge,y:ue,z:ee-He[se]*le-He[ne]*ge,t:0}},we=de(b,T,O,0,[-1,0],3,[0,-1]),qe=de(b+1,T,U,0,[1,0],1,[0,-1]),Xe=de(b+1,T+1,Y,2,[1,0],1,[0,1]),Pe=de(b,T+1,V,2,[-1,0],3,[0,1]),Ke=[{from:we,to:Pe,sx:b,sz:T,sh:O,ex:b,ez:T+1,eh:V,side:3,nA:1,nB:3},{from:Pe,to:Xe,sx:b,sz:T+1,sh:V,ex:b+1,ez:T+1,eh:Y,side:2,nA:0,nB:1},{from:Xe,to:qe,sx:b+1,sz:T+1,sh:Y,ex:b+1,ez:T,eh:U,side:1,nA:2,nB:0},{from:qe,to:we,sx:b+1,sz:T,sh:U,ex:b,ez:T,eh:O,side:0,nA:3,nB:2}],_e=[];for(const I of Ke){const ee=[{...I.from,t:0}];if(Te[I.side]){const G=-je[I.side],Z=-He[I.side];for(let te=1;te<ao;te++){const ie=te/ao,re=I.sx+(I.ex-I.sx)*ie,Se=I.sz+(I.ez-I.sz)*ie,Re=j(re,Se,I.side);ee.push({x:re+G*Re,y:I.sh+(I.eh-I.sh)*ie,z:Se+Z*Re,t:ie})}}_e.push(...ee),ee.push({...I.to,t:1});const ue=b+je[I.side],se=T+He[I.side];if(!Te[I.side]){he(ue,se,I.sx,I.sz,I.sh,I.ex,I.ez,I.eh,I.nA,I.nB);continue}const pe=k(ue,se),ne=Math.min(n[pe*4+I.nA],I.sh),be=Math.min(n[pe*4+I.nB],I.eh),le=G=>ne+(be-ne)*G,ge=F(y(ue,se),ue,se),Ue=G=>[I.sx+(I.ex-I.sx)*G,I.sz+(I.ez-I.sz)*G],$e=Math.max(2,Math.ceil(Math.max(...ee.map(G=>G.y-le(G.t)))/.18));for(let G=0;G+1<ee.length;G++){const Z=ee[G],te=ee[G+1];J(Z.x,Z.y,Z.z,te.x,te.y,te.z,le(te.t),le(Z.t),je[I.side],He[I.side],t.cliff,Z.t,te.t,!0,$e);const[ie,re]=Ue(Z.t),[Se,Re]=Ue(te.t),Be=le(Z.t),Ce=le(te.t);(Math.hypot(Z.x-ie,Z.z-re)>1e-6||Math.hypot(te.x-Se,te.z-Re)>1e-6)&&(M(Z.x,Be,Z.z,ie,Be,re,Se,Ce,Re,ge),M(Z.x,Be,Z.z,Se,Ce,Re,te.x,Ce,te.z,ge))}const ke=je[I.side],Ie=He[I.side],Me=.015,Ge=ee.map(G=>{const Z=Dt(G.x,G.z,1),te=Dt(G.x,G.z,2),ie=is*(.55+.9*Z),re=G.x-ke*ie,Se=G.z-Ie*ie,Re=le(G.t),Be=rs*(.5+1*Dt(G.x,G.z,3)),Ce=G.x+ke*Be,At=G.z+Ie*Be,Mo=Ce>=ue&&Ce<ue+1&&At>=se&&At<se+1;return{ix:re,iz:Se,ih:li(n,P,Math.min(1,Math.max(0,re-b)),Math.min(1,Math.max(0,Se-T)))+Me,drop:Math.min(os*(.5+1*te),Math.max(.05,G.y-Re)),a:.45+.3*te,fx:G.x,fz:G.z,fy:Re+Me,gx:Ce,gz:At,gy:(Mo?li(n,pe,Ce-ue,At-se):Re)+Me}});for(let G=0;G+1<ee.length;G++){const Z=ee[G],te=ee[G+1],ie=Ge[G],re=Ge[G+1];R.tri(Z.x,Z.y+Me,Z.z,ie.a,ie.ix,ie.ih,ie.iz,0,re.ix,re.ih,re.iz,0,t.rim),R.tri(Z.x,Z.y+Me,Z.z,ie.a,re.ix,re.ih,re.iz,0,te.x,te.y+Me,te.z,re.a,t.rim);const Se=Z.x+ke*.012,Re=Z.z+Ie*.012,Be=te.x+ke*.012,Ce=te.z+Ie*.012;R.tri(Se,Z.y,Re,ie.a,Be,te.y,Ce,re.a,Be,te.y-re.drop,Ce,0,t.rim),R.tri(Se,Z.y,Re,ie.a,Be,te.y-re.drop,Ce,0,Se,Z.y-ie.drop,Re,0,t.rim),R.tri(ie.fx,ie.fy,ie.fz,ie.a,re.fx,re.fy,re.fz,re.a,re.gx,re.gy,re.gz,0,t.rim),R.tri(ie.fx,ie.fy,ie.fz,ie.a,re.gx,re.gy,re.gz,0,ie.gx,ie.gy,ie.gz,0,t.rim)}}const Le=li(n,P,.5,.5),Ee=b+.5,Ae=T+.5;for(let I=0;I<_e.length;I++){const ee=_e[I],ue=_e[(I+1)%_e.length];C.tri(Ee,Le,Ae,Ee*_,Ae*_,ee.x,ee.y,ee.z,ee.x*_,ee.z*_,ue.x,ue.y,ue.z,ue.x*_,ue.z*_,fe)}}x[z*2+1]=g.count-x[z*2],S[z*2+1]=E.count-S[z*2],w[z*2+1]=A.count-w[z*2],m[z*2+1]=R.count-m[z*2]}const N=g.data(),oe=E.data(),Q=A.data();ni(N),ni(oe),ni(Q);const L=R.data();if(u){const T=(P,z)=>{const $=new Uint8Array(v*p);for(let O=u.z0;O<u.z1;O++)for(let U=u.x0;U<u.x1;U++)$[(O-c)*v+(U-l)]=1;return us(P,z,v*p,$)};N.indices=T(N.indices,x),oe.indices=T(oe.indices,S),Q.indices=T(Q.indices,w),L.indices=T(L.indices,m);const b=new Int32Array(0);return{tops:N,beds:oe,sides:Q,rims:L,corners:n,topRanges:b,bedRanges:b,sideRanges:b,rimRanges:b,width:a,height:s}}return{tops:N,beds:oe,sides:Q,rims:L,corners:n,topRanges:x,bedRanges:S,sideRanges:w,rimRanges:m,width:a,height:s}}function hs(r){try{const e=localStorage.getItem(r);return e?JSON.parse(e):{}}catch{return{}}}function no(r){const e=parseInt(r.replace("#",""),16),t=i=>Math.pow(i/255,2.2);return[t(e>>16&255),t(e>>8&255),t(e&255)]}function lo(r){const e=t=>Math.round(Math.pow(Math.min(1,Math.max(0,t)),.45454545454545453)*255).toString(16).padStart(2,"0");return`#${e(r[0])}${e(r[1])}${e(r[2])}`}class Ds{constructor(e,t,i={}){d(this,"root");d(this,"stored");d(this,"store");d(this,"section_",null);d(this,"open_",!1);d(this,"refreshers",[]);d(this,"onToggle",null);if(this.store=i.persist===!1?null:i.persist??"battle-crab.settings",this.stored=this.store?hs(this.store):{},this.root=document.createElement("div"),this.root.className="settings",this.open_=i.open??!1,this.root.hidden=!this.open_,t){const o=document.createElement("h2");o.textContent=t,this.root.appendChild(o)}e.appendChild(this.root)}get open(){return this.open_}toggle(e=!this.open_){var t;this.open_=e,this.root.hidden=!e,(t=this.onToggle)==null||t.call(this,e)}section(e){const t=document.createElement("section"),i=document.createElement("h3");return i.textContent=e,t.appendChild(i),this.root.appendChild(t),this.section_=t,this}plain(){return this.section_=null,this}clear(){for(const e of Array.from(this.root.children))e.tagName!=="H2"&&e.remove();return this.section_=null,this.refreshers.length=0,this}refresh(){for(const e of this.refreshers)e()}toggle_(e,t,i,o){const a=this.row(t),s=document.createElement("input");s.type="checkbox";const n=this.stored[e];return typeof n=="boolean"&&o(n),s.checked=i(),s.addEventListener("change",()=>{o(s.checked),this.save(e,s.checked)}),this.refreshers.push(()=>s.checked=i()),a.appendChild(s),this}slider(e,t,i,o,a,s,n,u=a<.01?3:a<.1?2:a<1?1:0,l=""){const c=this.row(t),f=document.createElement("input");f.type="range",f.min=String(i),f.max=String(o),f.step=String(a);const h=document.createElement("input");h.type="number",h.className="value",h.min=String(i),h.max=String(o),h.step=String(a),l&&(h.title=l);const v=this.stored[e];typeof v=="number"&&n(v);const p=w=>{f.value=String(w),f.style.setProperty("--fill",`${(w-i)/(o-i)*100}%`),document.activeElement!==h&&(h.value=w.toFixed(u))};p(s()),f.addEventListener("input",()=>{const w=Number(f.value);n(w),p(w),this.save(e,w)});const x=()=>{const w=Number(h.value);if(!Number.isFinite(w))return p(s());const m=Math.min(o,Math.max(i,w));n(m),h.blur(),p(m),this.save(e,m)};return h.addEventListener("change",x),h.addEventListener("keydown",w=>{w.key==="Enter"&&x(),w.key==="Escape"&&h.blur(),w.stopPropagation()}),h.addEventListener("blur",()=>p(s())),this.refreshers.push(()=>p(s())),c.appendChild(f),c.appendChild(h),this}choice(e,t,i,o,a){const s=this.row(t),n=document.createElement("select");for(const l of i){const c=document.createElement("option");c.value=l,c.textContent=l,n.appendChild(c)}const u=this.stored[e];return typeof u=="string"&&i.includes(u)&&a(u),n.value=o(),n.addEventListener("change",()=>{a(n.value),this.save(e,n.value)}),this.refreshers.push(()=>n.value=o()),s.appendChild(n),this}color(e,t,i,o){const a=this.row(t),s=document.createElement("input");s.type="color";const n=this.stored[e];return typeof n=="string"&&o(no(n)),s.value=lo(i()),s.addEventListener("input",()=>{o(no(s.value)),this.save(e,s.value)}),this.refreshers.push(()=>s.value=lo(i())),a.appendChild(s),this}button(e,t,i=""){const o=document.createElement("button");o.type="button",o.textContent=e,i&&(o.title=i),o.addEventListener("click",t);const a=this.section_??this.root;let s=a.lastElementChild;return(!s||!s.classList.contains("buttons"))&&(s=document.createElement("div"),s.className="buttons",a.appendChild(s)),s.appendChild(o),this}note(e){const t=document.createElement("p");return t.className="note",t.textContent=e,(this.section_??this.root).appendChild(t),t}row(e){const t=document.createElement("label"),i=document.createElement("span");return i.textContent=e,t.appendChild(i),(this.section_??this.root).appendChild(t),t}save(e,t){if(this.store){this.stored[e]=t;try{localStorage.setItem(this.store,JSON.stringify(this.stored))}catch{}}}}export{As as $,vs as A,_o as C,ws as D,xs as F,Es as G,Fs as H,Po as I,et as J,Ms as K,gs as M,ys as N,Xt as O,Ss as Q,Ri as R,Ds as S,Rs as W,Ts as X,_s as Y,Ai as a,ds as b,ci as c,$t as d,ce as e,ps as f,es as g,co as h,Wa as i,Co as k,ve as m,uo as u,ms as y,bs as z};
