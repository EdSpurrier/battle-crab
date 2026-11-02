var na=Object.defineProperty;var la=(a,e,t)=>e in a?na(a,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[e]=t;var d=(a,e,t)=>la(a,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function t(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerPolicy&&(r.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?r.credentials="include":o.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(o){if(o.ep)return;o.ep=!0;const r=t(o);fetch(o.href,r)}})();class O{constructor(e,t,i,o){d(this,"handle");d(this,"uniforms",new Map);this.gl=e;const r=Zi(e,e.VERTEX_SHADER,t),s=Zi(e,e.FRAGMENT_SHADER,i),n=e.createProgram();if(!n)throw new Error("createProgram failed");if(e.attachShader(n,r),e.attachShader(n,s),o&&e.transformFeedbackVaryings(n,o,e.INTERLEAVED_ATTRIBS),e.linkProgram(n),!e.getProgramParameter(n,e.LINK_STATUS))throw new Error(`link failed: ${e.getProgramInfoLog(n)??""}`);e.deleteShader(r),e.deleteShader(s),this.handle=n}use(){this.gl.useProgram(this.handle)}uniform(e){let t=this.uniforms.get(e);return t===void 0&&(t=this.gl.getUniformLocation(this.handle,e),this.uniforms.set(e,t)),t}setMat4(e,t){this.gl.uniformMatrix4fv(this.uniform(e),!1,t)}setMat3(e,t){this.gl.uniformMatrix3fv(this.uniform(e),!1,t)}setVec3(e,t,i,o){this.gl.uniform3f(this.uniform(e),t,i,o)}setFloat(e,t){this.gl.uniform1f(this.uniform(e),t)}dispose(){this.gl.deleteProgram(this.handle)}}function Zi(a,e,t){const i=a.createShader(e);if(!i)throw new Error("createShader failed");if(a.shaderSource(i,t),a.compileShader(i),!a.getShaderParameter(i,a.COMPILE_STATUS)){const o=a.getShaderInfoLog(i)??"";throw a.deleteShader(i),new Error(`${e===a.VERTEX_SHADER?"vertex":"fragment"} shader failed:
${o}`)}return i}function ct(a){const e=a??new Float32Array(16);return e[0]=e[5]=e[10]=e[15]=1,e}function he(a,e,t=new Float32Array(16)){for(let i=0;i<4;i++)for(let o=0;o<4;o++)t[i*4+o]=a[o]*e[i*4]+a[4+o]*e[i*4+1]+a[8+o]*e[i*4+2]+a[12+o]*e[i*4+3];return t}function Vo(a,e,t,i){const o=i?ct(i):ct();return o[12]=a,o[13]=e,o[14]=t,o}function ua(a,e){const t=ct(e),i=Math.cos(a),o=Math.sin(a);return t[0]=i,t[2]=-o,t[8]=o,t[10]=i,t}function Io(a,e,t,i){const o=1/Math.tan(a/2),r=new Float32Array(16);return r[0]=o/e,r[5]=o,r[10]=(i+t)/(t-i),r[11]=-1,r[14]=2*i*t/(t-i),r}function Bo(a,e,t,i,o,r){const s=ct();return s[0]=2/(e-a),s[5]=2/(i-t),s[10]=-2/(r-o),s[12]=-(e+a)/(e-a),s[13]=-(i+t)/(i-t),s[14]=-(r+o)/(r-o),s}function lt(a){const e=Math.hypot(a[0],a[1],a[2])||1;return[a[0]/e,a[1]/e,a[2]/e]}function Oe(a,e){return[a[1]*e[2]-a[2]*e[1],a[2]*e[0]-a[0]*e[2],a[0]*e[1]-a[1]*e[0]]}function Zt(a,e){return a[0]*e[0]+a[1]*e[1]+a[2]*e[2]}function Rt(a,e){return[a[0]-e[0],a[1]-e[1],a[2]-e[2]]}function hi(a,e,t=[0,1,0]){const i=lt(Rt(a,e)),o=lt(Oe(t,i)),r=Oe(i,o),s=ct();return s[0]=o[0],s[4]=o[1],s[8]=o[2],s[1]=r[0],s[5]=r[1],s[9]=r[2],s[2]=i[0],s[6]=i[1],s[10]=i[2],s[12]=-Zt(o,a),s[13]=-Zt(r,a),s[14]=-Zt(i,a),s}function ke(a){return a[0]*(a[5]*a[10]-a[6]*a[9])-a[4]*(a[1]*a[10]-a[2]*a[9])+a[8]*(a[1]*a[6]-a[2]*a[5])<0}function ot(a,e=new Float32Array(16)){const t=a[0],i=a[1],o=a[2],r=a[3],s=a[4],n=a[5],u=a[6],l=a[7],c=a[8],h=a[9],f=a[10],v=a[11],p=a[12],x=a[13],w=a[14],m=a[15],g=t*n-i*s,b=t*u-o*s,F=t*l-r*s,_=i*u-o*n,E=i*l-r*n,R=o*l-r*u,M=c*x-h*p,z=c*w-f*p,V=c*m-v*p,A=h*w-f*x,S=h*m-v*x,k=f*m-v*w;let C=g*k-b*S+F*A+_*V-E*z+R*M;return C?(C=1/C,e[0]=(n*k-u*S+l*A)*C,e[1]=(o*S-i*k-r*A)*C,e[2]=(x*R-w*E+m*_)*C,e[3]=(f*E-h*R-v*_)*C,e[4]=(u*V-s*k-l*z)*C,e[5]=(t*k-o*V+r*z)*C,e[6]=(w*F-p*R-m*b)*C,e[7]=(c*R-f*F+v*b)*C,e[8]=(s*S-n*V+l*M)*C,e[9]=(i*V-t*S-r*M)*C,e[10]=(p*E-x*F+m*g)*C,e[11]=(h*F-c*E-v*g)*C,e[12]=(n*z-s*A-u*M)*C,e[13]=(t*A-i*z+o*M)*C,e[14]=(x*b-p*_-w*g)*C,e[15]=(c*_-h*b+f*g)*C,e):ct()}function No(a,e){const t=e[0],i=e[1],o=e[2];return[a[0]*t+a[4]*i+a[8]*o+a[12],a[1]*t+a[5]*i+a[9]*o+a[13],a[2]*t+a[6]*i+a[10]*o+a[14],a[3]*t+a[7]*i+a[11]*o+a[15]]}function Ji(a,e=new Float32Array(9)){for(let t=0;t<3;t++){const i=a[t*4],o=a[t*4+1],r=a[t*4+2],s=Math.hypot(i,o,r)||1;e[t*3]=i/s,e[t*3+1]=o/s,e[t*3+2]=r/s}return e}function Ft(a={}){return{color:[1,1,1],albedo:null,metallicRoughness:null,normal:null,uvScale:1,metallic:0,roughness:.7,emissive:[0,0,0],emissiveMap:null,doubleSided:!1,splat:null,fade:null,nearFade:!0,transparent:!1,opacity:1,cutoff:0,...a}}const Qi=32,Ne=class Ne{constructor(e,t=!0){d(this,"handle");d(this,"width",1);d(this,"height",1);d(this,"loaded",!1);d(this,"source",null);d(this,"flipped",!1);d(this,"pixels",null);d(this,"coarse",null);d(this,"holders",1);d(this,"freed",null);this.gl=e,this.srgb=t;const i=e.createTexture();if(!i)throw new Error("createTexture failed");this.handle=i,e.bindTexture(e.TEXTURE_2D,i),e.texImage2D(e.TEXTURE_2D,0,e.RGBA8,1,1,0,e.RGBA,e.UNSIGNED_BYTE,new Uint8Array([255,255,255,255])),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.REPEAT),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.REPEAT),e.bindTexture(e.TEXTURE_2D,null)}queueImage(e,t=!0){Ne.queue.push({pixels:e.width*e.height,run:()=>this.setImage(e,t)})}static flush(e){let t=e;for(;Ne.queue.length;){const i=Ne.queue[0];if(i.pixels>t&&t<e)break;Ne.queue.shift().run(),t-=i.pixels}}static get pending(){return Ne.queue.length}setImage(e,t=!0){const i=this.gl;i.bindTexture(i.TEXTURE_2D,this.handle),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,t),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.NONE),i.texImage2D(i.TEXTURE_2D,0,this.srgb?i.SRGB8_ALPHA8:i.RGBA8,i.RGBA,i.UNSIGNED_BYTE,e),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.generateMipmap(i.TEXTURE_2D),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR_MIPMAP_LINEAR);const o=i.getExtension("EXT_texture_filter_anisotropic");o&&i.texParameterf(i.TEXTURE_2D,o.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(8,i.getParameter(o.MAX_TEXTURE_MAX_ANISOTROPY_EXT))),i.bindTexture(i.TEXTURE_2D,null),this.width=e.width,this.height=e.height,this.source=e,this.flipped=t,this.pixels=null,this.coarse=null,this.loaded=!0}sample(e,t){return this.source?(this.pixels||(this.pixels=this.readBack(this.width,this.height)),this.pixels?this.texel(this.pixels,this.width,this.height,e,t):[1,1,1]):[1,1,1]}sampleCoarse(e,t){if(!this.source)return[1,1,1];const i=Math.max(1,Math.min(Qi,this.width)),o=Math.max(1,Math.min(Qi,this.height));return this.coarse||(this.coarse=this.readBack(i,o)),this.coarse?this.texel(this.coarse,i,o,e,t):[1,1,1]}readBack(e,t){const i=(typeof OffscreenCanvas<"u"?new OffscreenCanvas(e,t):Object.assign(document.createElement("canvas"),{width:e,height:t})).getContext("2d");return i?(i.imageSmoothingEnabled=!0,i.imageSmoothingQuality="high",i.drawImage(this.source,0,0,e,t),i.getImageData(0,0,e,t).data):null}texel(e,t,i,o,r){const s=(Math.floor(o*t)%t+t)%t,n=(Math.floor(r*i)%i+i)%i,u=((this.flipped?i-1-n:n)*t+s)*4,l=c=>{const h=c/255;return this.srgb?h<=.04045?h/12.92:Math.pow((h+.055)/1.055,2.4):h};return[l(e[u]),l(e[u+1]),l(e[u+2])]}bind(e){const t=this.gl;t.activeTexture(t.TEXTURE0+e),t.bindTexture(t.TEXTURE_2D,this.handle)}retain(){return this.holders++,this}onFreed(e){this.freed=e}dispose(){var e;--this.holders>0||(this.gl.deleteTexture(this.handle),(e=this.freed)==null||e.call(this),this.freed=null)}static load(e,t,i=!0){const o=new Ne(e,i),r=new Image;return r.crossOrigin="anonymous",r.onload=()=>o.setImage(r),r.onerror=()=>console.warn(`texture failed to load: ${t}`),r.src=t,o}static fromCanvas(e,t,i,o=!0){const r=document.createElement("canvas");r.width=r.height=t;const s=r.getContext("2d");i(s,t);const n=new Ne(e,o);return n.setImage(r),n}};d(Ne,"queue",[]);let ii=Ne;const eo=16,Li=9,Vi=10,fi=16,pt=2048,to=13,ht=14,Oo=`
uniform highp sampler2D uCrowd;
uniform int uCrowdBase;
vec4 crowdTexel(int i, int k) {
  int t = i * 4 + k;
  return texelFetch(uCrowd, ivec2(t & ${pt-1}, t >> ${Math.log2(pt)}), 0);
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
`,Hi=`
layout(location = ${Li}) in vec4 aJoints;
layout(location = ${Vi}) in vec4 aWeights;
uniform highp sampler2D uJoints;
uniform int uJointBase;
mat4 jointMatrix(float j, int base) {
  int i = base + int(j + 0.5);
  ivec2 at = ivec2((i % ${eo}) * 4, i / ${eo});
  return mat4(texelFetch(uJoints, at, 0), texelFetch(uJoints, at + ivec2(1, 0), 0), texelFetch(uJoints, at + ivec2(2, 0), 0), texelFetch(uJoints, at + ivec2(3, 0), 0));
}
mat4 skinMatrix(int base) {
  float total = aWeights.x + aWeights.y + aWeights.z + aWeights.w;
  if (total < 1e-5) return mat4(1.0);
  mat4 m = aWeights.x * jointMatrix(aJoints.x, base) + aWeights.y * jointMatrix(aJoints.y, base) + aWeights.z * jointMatrix(aJoints.z, base) + aWeights.w * jointMatrix(aJoints.w, base);
  return m * (1.0 / total);
}
`,oi=3,io=[7,20,60],$o=`
float cutoutAlpha(float a, vec2 uv) {
  vec2 t = uv * vec2(textureSize(uAlbedo, 0));
  vec2 dx = dFdx(t);
  vec2 dy = dFdy(t);
  float mip = max(0.0, 0.5 * log2(max(dot(dx, dx), dot(dy, dy))));
  return a * (1.0 + 0.25 * mip);
}`,et=(a,e=!1,t=!1,i=!1)=>`#version 300 es
layout(location = 0) in vec3 aPosition;
${t?`layout(location = 3) in vec2 aUv;
uniform float uUvScale;
out vec2 vUv;`:""}
${i?Oo:a?`layout(location = 4) in vec4 aModel0;
layout(location = 5) in vec4 aModel1;
layout(location = 6) in vec4 aModel2;
layout(location = 7) in vec4 aModel3;`:"uniform mat4 uModel;"}
${e?Hi:""}
uniform mat4 uLightViewProj;
void main() {
  ${i?`int crowdI = uCrowdBase + gl_InstanceID;
  mat4 model = crowdModel(crowdI);`:a?"mat4 model = mat4(aModel0, aModel1, aModel2, aModel3);":"mat4 model = uModel;"}
  ${t?"vUv = aUv * uUvScale;":""}
  gl_Position = uLightViewProj * model * ${e?`skinMatrix(${i?"int(crowdInst(crowdI).x + 0.5)":"uJointBase"}) * `:""}vec4(aPosition, 1.0);
}`,Ct=`#version 300 es
precision highp float;
void main() {}`,di=`#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uAlbedo;
uniform float uOpacity;
uniform float uCutoff;
${$o}
void main() {
  if (cutoutAlpha(texture(uAlbedo, vUv).a * uOpacity, vUv) < uCutoff) discard;
}`,ca={strength:1,cascades:3,soft:!0,lightSize:60,stagger:!0};class ha{constructor(e,t=2048){d(this,"size");d(this,"program");d(this,"instancedProgram");d(this,"crowdProgram");d(this,"skinnedProgram");d(this,"skinnedInstancedProgram");d(this,"cutoutProgram");d(this,"cutoutInstancedProgram");d(this,"cutoutSkinnedProgram");d(this,"settings",{...ca});d(this,"cascades",[]);d(this,"frame",0);d(this,"due",[!0,!0,!0]);d(this,"drawn",[!1,!1,!1]);d(this,"lastCount",0);d(this,"halves",[0,0,0]);this.gl=e,this.size=t;for(let i=0;i<oi;i++){const o=e.createTexture(),r=e.createFramebuffer();if(!o||!r)throw new Error("shadow map allocation failed");e.bindTexture(e.TEXTURE_2D,o),e.texImage2D(e.TEXTURE_2D,0,e.DEPTH_COMPONENT24,t,t,0,e.DEPTH_COMPONENT,e.UNSIGNED_INT,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.bindFramebuffer(e.FRAMEBUFFER,r),e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.TEXTURE_2D,o,0),e.drawBuffers([e.NONE]),e.readBuffer(e.NONE);const s=e.checkFramebufferStatus(e.FRAMEBUFFER);if(e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindTexture(e.TEXTURE_2D,null),s!==e.FRAMEBUFFER_COMPLETE)throw new Error(`shadow framebuffer incomplete: ${s}`);this.cascades.push({texture:o,fbo:r,viewProj:new Float32Array(16)})}this.program=new O(e,et(!1),Ct),this.instancedProgram=new O(e,et(!0),Ct),this.crowdProgram=new O(e,et(!0,!1,!1,!0),Ct),this.skinnedProgram=new O(e,et(!1,!0),Ct),this.skinnedInstancedProgram=new O(e,et(!0,!0,!1,!0),Ct),this.cutoutProgram=new O(e,et(!1,!1,!0),di),this.cutoutInstancedProgram=new O(e,et(!0,!1,!0),di),this.cutoutSkinnedProgram=new O(e,et(!1,!0,!0),di)}get count(){return Math.max(1,Math.min(oi,Math.round(this.settings.cascades)))}viewProj(e){return this.cascades[e].viewProj}isDue(e){return this.due[e]}setup(e,t,i){this.frame++,this.count!==this.lastCount&&(this.lastCount=this.count,this.drawn.fill(!1));for(let n=0;n<this.count;n++)this.due[n]=!this.settings.stagger||n===0||!this.drawn[n]||this.frame%(n+1)===0,this.due[n]&&(this.drawn[n]=!0);const o=Math.hypot(t[0],t[1],t[2])||1,r=[t[0]/o,t[1]/o,t[2]/o],s=Math.max(1,i/24);for(let n=0;n<this.count;n++){if(!this.due[n])continue;const u=io[n]*s;this.halves[n]=u;const l=u*3,c=[e[0]-r[0]*l,e[1]-r[1]*l,e[2]-r[2]*l],h=hi(c,e,Math.abs(r[1])>.99?[0,0,1]:[0,1,0]),f=2*u/this.size,[v,p]=No(h,e),x=Math.round(v/f)*f-v,w=Math.round(p/f)*f-p,m=Bo(-u-x,u-x,-u-w,u-w,1,l*2+u);this.cascades[n].viewProj=he(m,h)}}halfExtent(e){return this.halves[e]||io[e]}begin(e){const t=this.gl;t.bindFramebuffer(t.FRAMEBUFFER,this.cascades[e].fbo),t.viewport(0,0,this.size,this.size),t.clear(t.DEPTH_BUFFER_BIT),t.cullFace(t.BACK)}end(e,t){const i=this.gl;i.cullFace(i.BACK),i.bindFramebuffer(i.FRAMEBUFFER,null),i.viewport(0,0,e,t)}texture(e){return this.cascades[e].texture}bind(e,t){const i=this.gl;i.activeTexture(i.TEXTURE0+t),i.bindTexture(i.TEXTURE_2D,this.cascades[e].texture)}}const mi=256,Ii=64,at=32,yt=5,fa={point:0,spot:1,area:2};class da{constructor(e){d(this,"lights",[]);d(this,"lightTexture");d(this,"tileTexture");d(this,"lightData",new Float32Array(mi*yt*4));d(this,"tileData",new Uint16Array(0));d(this,"tilesX",1);d(this,"tilesY",1);d(this,"visible",0);this.gl=e;const t=e.createTexture(),i=e.createTexture();if(!t||!i)throw new Error("light texture allocation failed");this.lightTexture=t,this.tileTexture=i;for(const o of[t,i])e.bindTexture(e.TEXTURE_2D,o),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE);e.bindTexture(e.TEXTURE_2D,t),e.texImage2D(e.TEXTURE_2D,0,e.RGBA32F,mi*yt,1,0,e.RGBA,e.FLOAT,null),e.bindTexture(e.TEXTURE_2D,null)}update(e,t,i){const o=this.gl,r=this.lights.map((f,v)=>v).slice(0,mi),s=f=>f.intensity*f.radius*f.radius;r.sort((f,v)=>s(this.lights[v])-s(this.lights[f])||f-v);const n=r.length,u=Math.max(1,Math.ceil(t/at)),l=Math.max(1,Math.ceil(i/at)),c=Ii+1;(u!==this.tilesX||l!==this.tilesY||this.tileData.length!==u*l*c)&&(this.tilesX=u,this.tilesY=l,this.tileData=new Uint16Array(u*l*c));const h=this.tileData;h.fill(0),this.visible=0;for(let f=0;f<n;f++){const v=r[f],p=this.lights[v],x=f*yt*4,w=this.lightData,m=fa[p.kind??"point"],g=p.dir??[0,-1,0];if(w.fill(0,x,x+yt*4),w[x]=p.x,w[x+1]=p.y,w[x+2]=p.z,w[x+3]=p.radius,w[x+4]=p.r,w[x+5]=p.g,w[x+6]=p.b,w[x+7]=p.intensity,w[x+8]=g[0],w[x+9]=g[1],w[x+10]=g[2],w[x+11]=m,m===1){const C=Math.min(Math.PI/2,Math.max(.01,p.outer??.5));w[x+12]=Math.cos(Math.min(C-.001,Math.max(0,p.inner??C*.7))),w[x+13]=Math.cos(C)}else if(m===2){const C=p.axis??[1,0,0];w[x+12]=C[0],w[x+13]=C[1],w[x+14]=C[2],w[x+15]=(p.width??1)/2,w[x+16]=(p.height??1)/2}const b=p.radius+(m===2?Math.hypot(p.width??1,p.height??1)/2:0);let F=1/0,_=1/0,E=-1/0,R=-1/0,M=!1;for(let C=0;C<8;C++){const ae=p.x+(C&1?b:-b),ee=p.y+(C&2?b:-b),se=p.z+(C&4?b:-b),[ue,ze,,fe]=No(e,[ae,ee,se]);if(fe<=0){F=-1,E=1,_=-1,R=1;continue}M=!0;const Te=ue/fe,Ee=ze/fe;Te<F&&(F=Te),Te>E&&(E=Te),Ee<_&&(_=Ee),Ee>R&&(R=Ee)}if(!M||E<-1||F>1||R<-1||_>1)continue;const z=Math.max(0,Math.floor((F+1)*.5*t/at)),V=Math.min(u-1,Math.floor((E+1)*.5*t/at)),A=Math.max(0,Math.floor((_+1)*.5*i/at)),S=Math.min(l-1,Math.floor((R+1)*.5*i/at));let k=!1;for(let C=A;C<=S;C++)for(let ae=z;ae<=V;ae++){const ee=(C*u+ae)*c,se=h[ee];se>=Ii||(h[ee+1+se]=f,h[ee]=se+1,k=!0)}k&&this.visible++}o.bindTexture(o.TEXTURE_2D,this.lightTexture),n>0&&o.texSubImage2D(o.TEXTURE_2D,0,0,0,n*yt,1,o.RGBA,o.FLOAT,this.lightData,0),o.bindTexture(o.TEXTURE_2D,this.tileTexture),o.pixelStorei(o.UNPACK_ALIGNMENT,2),o.texImage2D(o.TEXTURE_2D,0,o.R16UI,c,u*l,0,o.RED_INTEGER,o.UNSIGNED_SHORT,h),o.pixelStorei(o.UNPACK_ALIGNMENT,4),o.bindTexture(o.TEXTURE_2D,null)}bind(e,t){const i=this.gl;i.activeTexture(i.TEXTURE0+e),i.bindTexture(i.TEXTURE_2D,this.lightTexture),i.activeTexture(i.TEXTURE0+t),i.bindTexture(i.TEXTURE_2D,this.tileTexture)}}function vt(a,e=new Float32Array(24)){const t=(i,o)=>a[o*4+i];for(let i=0;i<6;i++){const o=i>>1,r=i&1?-1:1;let s=0;for(let n=0;n<4;n++){const u=t(3,n)+r*t(o,n);e[i*4+n]=u,n<3&&(s+=u*u)}s=Math.sqrt(s)||1;for(let n=0;n<4;n++)e[i*4+n]/=s}return e}function bt(a,e,t=6){for(let i=0;i<t;i++){const o=a[i*4],r=a[i*4+1],s=a[i*4+2],n=a[i*4+3],u=o>=0?e[3]:e[0],l=r>=0?e[4]:e[1],c=s>=0?e[5]:e[2];if(o*u+r*l+s*c+n<0)return!1}return!0}function vi(a,e,t,i=new Float32Array(6)){const o=(e[0]+t[0])/2,r=(e[1]+t[1])/2,s=(e[2]+t[2])/2,n=(t[0]-e[0])/2,u=(t[1]-e[1])/2,l=(t[2]-e[2])/2;for(let c=0;c<3;c++){const h=a[c]*o+a[4+c]*r+a[8+c]*s+a[12+c],f=Math.abs(a[c])*n+Math.abs(a[4+c])*u+Math.abs(a[8+c])*l;i[c]=h-f,i[3+c]=h+f}return i}function ai(a,e){const t=[1/0,1/0,1/0],i=[-1/0,-1/0,-1/0];for(let o=0;o+2<a.length;o+=e)for(let r=0;r<3;r++){const s=a[o+r];s<t[r]&&(t[r]=s),s>i[r]&&(i[r]=s)}return t[0]>i[0]?[[0,0,0],[0,0,0]]:[t,i]}const pi=7;class ma{constructor(e,t){d(this,"vao");d(this,"count");d(this,"min");d(this,"max");d(this,"vbo");d(this,"ibo");this.gl=e;const i=e.createVertexArray(),o=e.createBuffer(),r=e.createBuffer();if(!i||!o||!r)throw new Error("overlay allocation failed");this.vao=i,this.vbo=o,this.ibo=r,e.bindVertexArray(i),e.bindBuffer(e.ARRAY_BUFFER,o),e.bufferData(e.ARRAY_BUFFER,t.vertices,e.STATIC_DRAW);const s=pi*4;e.enableVertexAttribArray(0),e.vertexAttribPointer(0,3,e.FLOAT,!1,s,0),e.enableVertexAttribArray(1),e.vertexAttribPointer(1,4,e.FLOAT,!1,s,12),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,r),e.bufferData(e.ELEMENT_ARRAY_BUFFER,t.indices,e.STATIC_DRAW),e.bindVertexArray(null),this.count=t.indices.length,[this.min,this.max]=ai(t.vertices,pi)}draw(){if(this.count===0)return;const e=this.gl;e.bindVertexArray(this.vao),e.drawElements(e.TRIANGLES,this.count,e.UNSIGNED_INT,0),e.bindVertexArray(null)}setData(e){const t=this.gl;t.bindVertexArray(this.vao),t.bindBuffer(t.ARRAY_BUFFER,this.vbo),t.bufferData(t.ARRAY_BUFFER,e.vertices,t.DYNAMIC_DRAW),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.ibo),t.bufferData(t.ELEMENT_ARRAY_BUFFER,e.indices,t.DYNAMIC_DRAW),t.bindVertexArray(null),this.count=e.indices.length,[this.min,this.max]=ai(e.vertices,pi)}setIndices(e){const t=this.gl;t.bindVertexArray(this.vao),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.ibo),t.bufferData(t.ELEMENT_ARRAY_BUFFER,e,t.DYNAMIC_DRAW),t.bindVertexArray(null),this.count=e.length}dispose(){this.gl.deleteVertexArray(this.vao),this.gl.deleteBuffer(this.vbo),this.gl.deleteBuffer(this.ibo)}}const va=`#version 300 es
layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec4 aColor;
uniform mat4 uProjection;
uniform mat4 uView;
uniform mat4 uModel;
out vec4 vColor;
void main() {
  vColor = aColor;
  gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);
}`,pa=`#version 300 es
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
}`,Xo=`uniform sampler2D uVeilMask;
uniform vec2 uVeilCells;
uniform float uVeilOn;
uniform float uVeilAlpha;
float veilOpen(vec3 w) {
  if (uVeilOn < 0.5) return 1.0;
  vec4 m = texture(uVeilMask, w.xz / uVeilCells);
  float dark = smoothstep(0.3, 0.7, m.r);
  float unseen = smoothstep(0.3, 0.7, m.g);
  return (1.0 - dark) * (1.0 - uVeilAlpha * unseen);
}`,it=3,ga={enabled:!0,coverage:.4,density:.5,base:30,thickness:14,scale:70,windSpeed:3,windDirection:60,systems:.5,systemScale:600,darkness:.1,shadowStrength:.6},oo={enabled:!1,shadows:!1,steps:32,layers:[{...ga}]},Go=`
#define CLOUD_LAYERS ${it}
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
}`;class xa{constructor(e){d(this,"settings",{...oo,layers:oo.layers.map(e=>({...e}))});d(this,"offsets",Array.from({length:it},()=>[0,0]));d(this,"weather");d(this,"detail");d(this,"a",new Float32Array(it*4));d(this,"b",new Float32Array(it*4));d(this,"c",new Float32Array(it*4));this.gl=e,this.weather=ya(e,256),this.detail=ba(e,48)}get active(){return this.settings.layers.slice(0,it).filter(e=>e.enabled)}advance(e){this.settings.layers.slice(0,it).forEach((t,i)=>{const o=t.windDirection*Math.PI/180,r=this.offsets[i];r[0]-=Math.sin(o)*t.windSpeed*e,r[1]-=Math.cos(o)*t.windSpeed*e;const s=Math.max(1,t.scale)*Math.max(1,t.systemScale)*4;for(const n of[0,1])Math.abs(r[n])>s&&(r[n]%=s)})}bindCommon(e,t){const i=this.gl;for(let r=0;r<it;r++){const s=this.settings.layers[r],n=this.offsets[r];this.a.set(s?[s.coverage,s.base,Math.max(.1,s.thickness),Math.max(1,s.scale)]:[0,0,1,1],r*4),this.b.set(s?[n[0],n[1],s.systems,Math.max(1,s.systemScale)]:[0,0,0,1],r*4),this.c.set(s?[s.enabled?1:0,s.density,s.darkness,s.shadowStrength]:[0,0,0,0],r*4)}i.activeTexture(i.TEXTURE0+t),i.bindTexture(i.TEXTURE_2D,this.weather),i.uniform1i(e.uniform("uCloudWeather"),t),i.uniform4fv(e.uniform("uCloudA"),this.a),i.uniform4fv(e.uniform("uCloudB"),this.b),i.uniform4fv(e.uniform("uCloudC"),this.c);const o=this.settings.tint??[1,1,1];i.uniform3f(e.uniform("uCloudTint"),o[0],o[1],o[2])}dispose(){this.gl.deleteTexture(this.weather),this.gl.deleteTexture(this.detail)}}function Ut(a,e,t,i){let o=a*374761393+e*668265263+t*2147483647+i*1442695041|0;return o=Math.imul(o^o>>>13,1274126177),((o^o>>>16)>>>0)/4294967296}function wa(a,e,t,i){const o=Math.floor(a),r=Math.floor(e);let s=a-o,n=e-r;s=s*s*(3-2*s),n=n*n*(3-2*n);const u=f=>(f%t+t)%t,l=(f,v)=>Ut(u(o+f),u(r+v),0,i),c=l(0,0)+(l(1,0)-l(0,0))*s,h=l(0,1)+(l(1,1)-l(0,1))*s;return c+(h-c)*n}function ya(a,e){const t=new Float32Array(e*e);let i=1/0,o=-1/0;for(let n=0;n<e;n++)for(let u=0;u<e;u++){let l=0,c=.5,h=0;for(let f=0;f<5;f++){const v=4<<f;l+=wa(u/e*v,n/e*v,v,11+f)*c,h+=c,c*=.5}l/=h,t[n*e+u]=l,i=Math.min(i,l),o=Math.max(o,l)}const r=new Uint8Array(e*e);for(let n=0;n<t.length;n++)r[n]=Math.round((t[n]-i)/Math.max(1e-6,o-i)*255);const s=a.createTexture();if(!s)throw new Error("cloud weather texture failed");return a.bindTexture(a.TEXTURE_2D,s),a.pixelStorei(a.UNPACK_ALIGNMENT,1),a.texImage2D(a.TEXTURE_2D,0,a.R8,e,e,0,a.RED,a.UNSIGNED_BYTE,r),a.pixelStorei(a.UNPACK_ALIGNMENT,4),a.generateMipmap(a.TEXTURE_2D),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.LINEAR_MIPMAP_LINEAR),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MAG_FILTER,a.LINEAR),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_S,a.REPEAT),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_T,a.REPEAT),a.bindTexture(a.TEXTURE_2D,null),s}function ba(a,e){const t=new Float32Array(648);for(let s=0;s<6;s++)for(let n=0;n<6;n++)for(let u=0;u<6;u++){const l=((s*6+n)*6+u)*3;t[l]=u+Ut(u,n,s,1),t[l+1]=n+Ut(u,n,s,2),t[l+2]=s+Ut(u,n,s,3)}const i=new Uint8Array(e*e*e),o=s=>(s%6+6)%6;for(let s=0;s<e;s++)for(let n=0;n<e;n++)for(let u=0;u<e;u++){const l=u/e*6,c=n/e*6,h=s/e*6,f=Math.floor(l),v=Math.floor(c),p=Math.floor(h);let x=9;for(let b=-1;b<=1;b++)for(let F=-1;F<=1;F++)for(let _=-1;_<=1;_++){const E=((o(p+b)*6+o(v+F))*6+o(f+_))*3,R=t[E]-o(f+_)+f+_,M=t[E+1]-o(v+F)+v+F,z=t[E+2]-o(p+b)+p+b;x=Math.min(x,(R-l)**2+(M-c)**2+(z-h)**2)}const w=1-Math.min(1,Math.sqrt(x)*1.1),m=(b,F)=>{const _=u/e*b,E=n/e*b,R=s/e*b,M=Math.floor(_),z=Math.floor(E),V=Math.floor(R),A=ue=>ue*ue*(3-2*ue),S=A(_-M),k=A(E-z),C=A(R-V),ae=ue=>(ue%b+b)%b,ee=(ue,ze,fe)=>Ut(ae(M+ue),ae(z+ze),ae(V+fe),F),se=(ue,ze,fe)=>ue+(ze-ue)*fe;return se(se(se(ee(0,0,0),ee(1,0,0),S),se(ee(0,1,0),ee(1,1,0),S),k),se(se(ee(0,0,1),ee(1,0,1),S),se(ee(0,1,1),ee(1,1,1),S),k),C)},g=w*.65+m(8,21)*.23+m(16,22)*.12;i[(s*e+n)*e+u]=Math.round(Math.min(1,Math.max(0,g))*255)}const r=a.createTexture();if(!r)throw new Error("cloud detail texture failed");return a.bindTexture(a.TEXTURE_3D,r),a.pixelStorei(a.UNPACK_ALIGNMENT,1),a.texImage3D(a.TEXTURE_3D,0,a.R8,e,e,e,0,a.RED,a.UNSIGNED_BYTE,i),a.pixelStorei(a.UNPACK_ALIGNMENT,4),a.texParameteri(a.TEXTURE_3D,a.TEXTURE_MIN_FILTER,a.LINEAR),a.texParameteri(a.TEXTURE_3D,a.TEXTURE_MAG_FILTER,a.LINEAR),a.texParameteri(a.TEXTURE_3D,a.TEXTURE_WRAP_S,a.REPEAT),a.texParameteri(a.TEXTURE_3D,a.TEXTURE_WRAP_T,a.REPEAT),a.texParameteri(a.TEXTURE_3D,a.TEXTURE_WRAP_R,a.REPEAT),a.bindTexture(a.TEXTURE_3D,null),r}const Ta=`#version 300 es
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
${Xo}
${Go}
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
}`,ri=64,Wo=16,Ho=5,zt=32,Ea={center:[0,1,0],size:[8,2,8],yaw:0,color:[.85,.9,1],density:.6,softness:.4,falloff:.6,glow:[.4,.8,1],glowStrength:0,noise:.6,noiseScale:4,speed:.6,direction:60,rise:.05,churn:.3},Aa={enabled:!0,steps:24,selfShadow:!0,lights:!0,shadows:!0,sun:.45,ambient:.6};function Ra(a={}){const e=Ea;return{...e,...a,center:[...a.center??e.center],size:[...a.size??e.size],color:[...a.color??e.color],glow:[...a.glow??e.glow]}}function Fa(a,e=new Float32Array(6)){const t=a.yaw*Math.PI/180,i=Math.abs(Math.cos(t)),o=Math.abs(Math.sin(t)),r=Math.abs(a.size[0])/2,s=Math.abs(a.size[1])/2,n=Math.abs(a.size[2])/2,u=i*r+o*n,l=o*r+i*n;return e[0]=a.center[0]-u,e[1]=a.center[1]-s,e[2]=a.center[2]-l,e[3]=a.center[0]+u,e[4]=a.center[1]+s,e[5]=a.center[2]+l,e}function Ma(a,e){const t=Math.max(.05,a.noiseScale)*Ho,i=a.direction*Math.PI/180,o=r=>r-Math.floor(r);return{drift:[o(-Math.sin(i)*a.speed*e/t),o(-a.rise*e/t),o(-Math.cos(i)*a.speed*e/t)],churn:o(-a.churn*e/t)}}function _a(a,e,t){const i=new Float32Array(6),o=a.filter(s=>s.enabled!==!1&&s.density>0&&s.size.every(n=>Math.abs(n)>.001)&&(!e||bt(e,Fa(s,i))));if(o.length<=1)return o;const r=s=>Math.hypot(s.center[0]-t[0],s.center[1]-t[1],s.center[2]-t[2]);return o.sort((s,n)=>r(s)-r(n)).slice(0,ri)}function jo(a,e=!1){return`
#define FOG_VOLUMES ${a}
uniform int uFogVolCount;
uniform vec4 uFogVolA[FOG_VOLUMES]; // centre xyz, cos yaw
uniform vec4 uFogVolB[FOG_VOLUMES]; // half size xyz, sin yaw
uniform vec4 uFogVolC[FOG_VOLUMES]; // colour rgb, density
uniform vec4 uFogVolD[FOG_VOLUMES]; // glow rgb (times its strength), softness
uniform vec4 uFogVolE[FOG_VOLUMES]; // noise drift xyz (texture units), 1 / the noise's repeat (world units)
uniform vec4 uFogVolF[FOG_VOLUMES]; // churn phase, noise amount, falloff, seed
${e?`
#define FOG_CLEARS ${zt}
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
}`}const Sa=jo(ri,!0),Ca=jo(Wo),ci=class ci{constructor(){d(this,"settings",{...Aa});d(this,"volumes",[]);d(this,"count",0);d(this,"data",Array.from({length:6},()=>new Float32Array(ri*4)));d(this,"clears",[]);d(this,"clearCount",0);d(this,"clearData",[new Float32Array(zt*4),new Float32Array(zt*4)])}get active(){return this.count}prepare(e,t,i){const o=this.settings.enabled?_a(this.volumes,e,t):[];this.count=o.length;const[r,s,n,u,l,c]=this.data,h=o.some(m=>m.seed===void 0)?new Map(this.volumes.map((m,g)=>[m,g])):null;o.forEach((m,g)=>{const b=m.yaw*Math.PI/180,F=g*4,_=Ma(m,i),E=Math.max(0,m.glowStrength);r.set([m.center[0],m.center[1],m.center[2],Math.cos(b)],F),s.set([Math.abs(m.size[0])/2,Math.abs(m.size[1])/2,Math.abs(m.size[2])/2,Math.sin(b)],F),n.set([m.color[0],m.color[1],m.color[2],Math.max(0,m.density)],F),u.set([m.glow[0]*E,m.glow[1]*E,m.glow[2]*E,Math.min(1,Math.max(0,m.softness))],F),l.set([_.drift[0],_.drift[1],_.drift[2],1/(Math.max(.05,m.noiseScale)*Ho)],F),c.set([_.churn,Math.min(1,Math.max(0,m.noise)),Math.min(1,Math.max(0,m.falloff)),m.seed??(h==null?void 0:h.get(m))??0],F)});const f=t[0],v=t[2],p=this.count?this.clears.filter(m=>(m.strength??1)>0&&m.range>0):[];p.length>zt&&p.sort((m,g)=>Math.hypot(m.x-f,m.z-v)-Math.hypot(g.x-f,g.z-v)),this.clearCount=Math.min(zt,p.length);const[x,w]=this.clearData;for(let m=0;m<this.clearCount;m++){const g=p[m];x.set([g.x,g.z,g.range,Math.min(1,Math.max(0,g.strength??1))],m*4),w.set([Math.cos(g.heading),Math.sin(g.heading),Math.cos(Math.min(Math.PI,Math.max(0,g.halfAngle))),Math.min(1,Math.max(0,g.soft??.3))],m*4)}}bind(e,t,i=this.count,o=ri){const r=Math.min(i,o);e.uniform1i(t.uniform("uFogVolCount"),r),e.uniform1i(t.uniform("uFogClearCount"),r?this.clearCount:0),r&&(ci.NAMES.forEach((s,n)=>e.uniform4fv(t.uniform(s),this.data[n],0,o*4)),this.clearCount&&(e.uniform4fv(t.uniform("uFogClearA"),this.clearData[0]),e.uniform4fv(t.uniform("uFogClearB"),this.clearData[1])))}};d(ci,"NAMES",["uFogVolA","uFogVolB","uFogVolC","uFogVolD","uFogVolE","uFogVolF"]);let Bi=ci;const Da={enabled:!0,bloom:!0,bloomThreshold:1,bloomStrength:.35,vignette:.25,contrast:1.05,saturation:1.05,ssao:!0,ssaoStrength:.7,ssaoRadius:.9,volumetric:!0,fogDensity:.012,fogHeight:5,fogColor:[.8,.85,.95],fogAmbient:.3,fogSteps:24,fogSun:.3,fogFullRes:!1,fogScale:.5,fogDepthAware:!0,fogTemporal:!0,cloudsHalfRate:!0,fogSmooth:1,dof:!1,dofFocus:30,dofRange:4,dofFalloff:20,dofBlur:8,blurOutside:null,chroma:0},Pa=5,Be=`#version 300 es
out vec2 vUv;
void main() {
  // One triangle covering the screen: no vertex buffer needed.
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`,ka=`#version 300 es
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
}`,Ua=`#version 300 es
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
}`,za=`#version 300 es
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
}`,La=`#version 300 es
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
}`,Va=`#version 300 es
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
}`,Ia=`#version 300 es
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
}`,Ba=`#version 300 es
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
${Xo}
${Sa}
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
}`,Na=`#version 300 es
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
}`,Oa=`#version 300 es
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
}`;class $a{constructor(e){d(this,"timers",null);d(this,"fogHist",[null,null]);d(this,"fogHistAt",0);d(this,"prevViewProj",null);d(this,"prevEye",null);d(this,"histValid",!1);d(this,"frameIndex",0);d(this,"fogTemporal");d(this,"cloudValid",!1);d(this,"settings",{...Da});d(this,"hdr");d(this,"scene",null);d(this,"mips",[]);d(this,"ao",null);d(this,"aoBlur",null);d(this,"fog",null);d(this,"fogTmp",null);d(this,"fogBlur");d(this,"cloudProgram");d(this,"cloud",null);d(this,"cloudTmp",null);d(this,"volume");d(this,"ssao");d(this,"blur");d(this,"vao");d(this,"bright");d(this,"down");d(this,"up");d(this,"composite");d(this,"width",0);d(this,"height",0);d(this,"depthCopy",null);d(this,"depthCopyFbo",null);d(this,"depthCopyW",0);d(this,"depthCopyH",0);d(this,"blackTex",null);this.gl=e,this.hdr=!!e.getExtension("EXT_color_buffer_float"),e.getExtension("OES_texture_float_linear");const t=e.createVertexArray();if(!t)throw new Error("post vao failed");this.vao=t,this.bright=new O(e,Be,ka),this.down=new O(e,Be,Ua),this.up=new O(e,Be,za),this.composite=new O(e,Be,Oa),this.ssao=new O(e,Be,La),this.volume=new O(e,Be,Ba),this.fogBlur=new O(e,Be,Ia),this.fogTemporal=new O(e,Be,Na),this.cloudProgram=new O(e,Be,Ta),this.blur=new O(e,Be,Va)}makeTarget(e,t,i,o=this.hdr){const r=this.gl,s=r.createTexture(),n=r.createFramebuffer();if(!s||!n)throw new Error("post target failed");r.bindTexture(r.TEXTURE_2D,s),r.texImage2D(r.TEXTURE_2D,0,o?r.RGBA16F:r.RGBA8,e,t,0,r.RGBA,o?r.HALF_FLOAT:r.UNSIGNED_BYTE,null),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE),r.bindFramebuffer(r.FRAMEBUFFER,n),r.framebufferTexture2D(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,s,0);let u;if(i){const c=r.createTexture();if(!c)throw new Error("post depth failed");r.bindTexture(r.TEXTURE_2D,c),r.texImage2D(r.TEXTURE_2D,0,r.DEPTH_COMPONENT24,e,t,0,r.DEPTH_COMPONENT,r.UNSIGNED_INT,null),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,r.NEAREST),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE),r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,c,0),u=c}const l=r.checkFramebufferStatus(r.FRAMEBUFFER);if(r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindTexture(r.TEXTURE_2D,null),l!==r.FRAMEBUFFER_COMPLETE)throw new Error(`post framebuffer incomplete: ${l}`);return{fbo:n,tex:s,width:e,height:t,depth:u}}dropTarget(e){e&&(this.gl.deleteFramebuffer(e.fbo),this.gl.deleteTexture(e.tex),e.depth&&this.gl.deleteTexture(e.depth))}resize(e,t){if(e=Math.max(1,e),t=Math.max(1,t),e===this.width&&t===this.height&&this.scene)return;this.width=e,this.height=t,this.dropTarget(this.scene),this.dropTarget(this.ao),this.dropTarget(this.aoBlur),this.dropTarget(this.fog),this.dropTarget(this.fogTmp),this.fog=this.fogTmp=null,this.dropTarget(this.cloud),this.dropTarget(this.cloudTmp),this.cloud=this.cloudTmp=null,this.cloudValid=!1,this.dropTarget(this.fogHist[0]),this.dropTarget(this.fogHist[1]),this.fogHist=[null,null],this.histValid=!1;for(const n of this.mips)this.dropTarget(n);this.mips.length=0,this.scene=this.makeTarget(e,t,!0);const i=Math.max(1,e>>1),o=Math.max(1,t>>1);this.ao=this.makeTarget(i,o,!1,!1),this.aoBlur=this.makeTarget(i,o,!1,!1);let r=Math.max(1,e>>1),s=Math.max(1,t>>1);for(let n=0;n<Pa;n++)this.mips.push(this.makeTarget(r,s,!1)),r=Math.max(1,r>>1),s=Math.max(1,s>>1)}get depthTexture(){var e;return((e=this.scene)==null?void 0:e.depth)??null}snapshotDepth(){var t;const e=this.gl;if(!((t=this.scene)!=null&&t.depth))return null;if(!this.depthCopy||this.depthCopyW!==this.scene.width||this.depthCopyH!==this.scene.height){this.depthCopy&&e.deleteTexture(this.depthCopy),this.depthCopyFbo&&e.deleteFramebuffer(this.depthCopyFbo);const i=e.createTexture(),o=e.createFramebuffer();if(!i||!o)throw new Error("depth copy failed");e.bindTexture(e.TEXTURE_2D,i),e.texImage2D(e.TEXTURE_2D,0,e.DEPTH_COMPONENT24,this.scene.width,this.scene.height,0,e.DEPTH_COMPONENT,e.UNSIGNED_INT,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.bindFramebuffer(e.FRAMEBUFFER,o),e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.TEXTURE_2D,i,0),e.drawBuffers([e.NONE]),e.readBuffer(e.NONE),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindTexture(e.TEXTURE_2D,null),this.depthCopy=i,this.depthCopyFbo=o,this.depthCopyW=this.scene.width,this.depthCopyH=this.scene.height}return e.bindFramebuffer(e.READ_FRAMEBUFFER,this.scene.fbo),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,this.depthCopyFbo),e.blitFramebuffer(0,0,this.scene.width,this.scene.height,0,0,this.scene.width,this.scene.height,e.DEPTH_BUFFER_BIT,e.NEAREST),e.bindFramebuffer(e.FRAMEBUFFER,this.scene.fbo),this.depthCopy}begin(){if(!this.scene)return;const e=this.gl;e.bindFramebuffer(e.FRAMEBUFFER,this.scene.fbo),e.viewport(0,0,this.scene.width,this.scene.height)}end(e,t,i,o){var b,F,_,E,R,M,z,V,A,S,k,C,ae,ee,se,ue,ze,fe,Te,Ee;const r=this.gl;if(!this.scene)return;const s=this.settings;r.disable(r.DEPTH_TEST),r.disable(r.BLEND),r.bindVertexArray(this.vao);let n=null;const u=o==null?void 0:o.fogVolumes,l=u&&(o!=null&&o.clouds)?u.active:0,c=!!o&&!!this.scene.depth&&(s.volumetric||l>0);if(c&&o&&this.scene.depth){(b=this.timers)==null||b.begin("fog");const q=s.fogFullRes?1:Math.min(1,Math.max(.25,s.fogScale)),ie=Math.max(1,Math.floor(this.scene.width*q)),T=Math.max(1,Math.floor(this.scene.height*q));(!this.fog||!this.fogTmp||this.fog.width!==ie||this.fog.height!==T)&&(this.dropTarget(this.fog),this.dropTarget(this.fogTmp),this.dropTarget(this.fogHist[0]),this.dropTarget(this.fogHist[1]),this.fogHist=[null,null],this.histValid=!1,this.fog=this.makeTarget(ie,T,!1),this.fogTmp=this.makeTarget(ie,T,!1)),r.bindFramebuffer(r.FRAMEBUFFER,this.fog.fbo),r.viewport(0,0,this.fog.width,this.fog.height);const y=this.volume;y.use(),this.bind(y,"uDepth",this.scene.depth,0);for(let P=0;P<3;P++)this.bind(y,`uShadow${P}`,o.shadowMaps[Math.min(P,o.shadowMaps.length-1)]??this.black(),1+P),y.setMat4(`uLightVP${P}`,o.lightViewProj[Math.min(P,o.lightViewProj.length-1)]??ct());r.uniform1i(y.uniform("uCascades"),o.shadowMaps.length),y.setMat4("uInvViewProj",o.invViewProj),y.setVec3("uEye",...o.eye),y.setVec3("uSunDir",...o.sunDir),y.setVec3("uSunRadiance",...o.sunRadiance),y.setVec3("uSkyColor",...o.skyColor),y.setVec3("uFogColor",...s.fogColor),y.setFloat("uDensity",s.volumetric?s.fogDensity:0),y.setFloat("uHeight",Math.max(.1,s.fogHeight)),y.setFloat("uAmbient",s.fogAmbient),y.setFloat("uSunScatter",s.fogSun),r.uniform1i(y.uniform("uSteps"),s.volumetric?Math.max(4,Math.min(128,Math.round(s.fogSteps))):0),u==null||u.bind(r,y,l),o.clouds&&(r.activeTexture(r.TEXTURE4),r.bindTexture(r.TEXTURE_3D,o.clouds.detail)),r.uniform1i(y.uniform("uNoise"),4),(F=o.lights)==null||F.bind(5,6),r.uniform1i(y.uniform("uLights"),5),r.uniform1i(y.uniform("uTiles"),6);const D=u==null?void 0:u.settings;r.uniform1i(y.uniform("uVolSteps"),Math.max(2,Math.min(64,Math.round((D==null?void 0:D.steps)??24)))),y.setFloat("uVolSelfShadow",D!=null&&D.selfShadow?1:0),y.setFloat("uVolSun",(D==null?void 0:D.sun)??0),y.setFloat("uVolAmbient",(D==null?void 0:D.ambient)??0),r.uniform3f(y.uniform("uTileInfo"),((_=o.lights)==null?void 0:_.tilesX)??1,at,D!=null&&D.lights&&o.lights?1:0),r.uniform2f(y.uniform("uScreen"),this.scene.width,this.scene.height),y.setFloat("uFar",o.far),this.bind(y,"uScene",this.scene.tex,7),this.bind(y,"uVeilMask",((E=o.veil)==null?void 0:E.mask)??this.black(),8),r.uniform2f(y.uniform("uVeilCells"),((R=o.veil)==null?void 0:R.cells[0])??1,((M=o.veil)==null?void 0:M.cells[1])??1),y.setFloat("uVeilOn",o.veil?1:0),y.setFloat("uVeilAlpha",((z=o.veil)==null?void 0:z.alpha)??0),this.frameIndex++,y.setFloat("uFrameJitter",s.fogTemporal?this.frameIndex*.6180339887%1:0),y.setFloat("uSkip",o.rayStart??0),y.setVec3("uViewPoint",...o.viewPoint??o.eye),r.drawArrays(r.TRIANGLES,0,3);let L=this.fog;const $=ot(o.invViewProj);if(s.fogTemporal){(!this.fogHist[0]||!this.fogHist[1])&&(this.fogHist=[this.makeTarget(ie,T,!1),this.makeTarget(ie,T,!1)],this.histValid=!1);const P=this.fogHist[this.fogHistAt],G=this.fogHist[1-this.fogHistAt];r.bindFramebuffer(r.FRAMEBUFFER,P.fbo);const N=this.fogTemporal;N.use(),this.bind(N,"uCurrent",this.fog.tex,0),this.bind(N,"uHistory",G.tex,1),this.bind(N,"uDepth",this.scene.depth,2),N.setMat4("uInvViewProj",o.invViewProj),N.setMat4("uPrevViewProj",this.prevViewProj??$),r.uniform2f(N.uniform("uTexel"),1/ie,1/T);const re=this.prevEye?Math.hypot(o.eye[0]-this.prevEye[0],o.eye[1]-this.prevEye[1],o.eye[2]-this.prevEye[2]):0;N.setFloat("uBlend",this.histValid&&this.prevViewProj?Math.min(.85,.15+re*1.5):1),N.setFloat("uFar",o.far),r.drawArrays(r.TRIANGLES,0,3),this.fogHistAt=1-this.fogHistAt,this.histValid=!0,L=P}else this.histValid=!1;this.prevViewProj=$,this.prevEye=[...o.eye];const I=Math.max(0,Math.min(3,Math.round(s.fogSmooth)));if(I>0&&this.fogTmp){const P=this.fogBlur;P.use(),this.bind(P,"uDepth",this.scene.depth,1),P.setMat4("uInvProjection",i);for(let G=0;G<I;G++)r.bindFramebuffer(r.FRAMEBUFFER,this.fogTmp.fbo),this.bind(P,"uSrc",G===0?L.tex:this.fog.tex,0),r.uniform2f(P.uniform("uStep"),1/this.fog.width,0),r.drawArrays(r.TRIANGLES,0,3),r.bindFramebuffer(r.FRAMEBUFFER,this.fog.fbo),this.bind(P,"uSrc",this.fogTmp.tex,0),r.uniform2f(P.uniform("uStep"),0,1/this.fog.height),r.drawArrays(r.TRIANGLES,0,3)}n=I>0?this.fog.tex:L.tex}let h=null;const f=o==null?void 0:o.clouds;c||this.frameIndex++;const v=!!(f&&f.settings.enabled&&f.active.length&&o&&this.scene.depth);if(v||(this.cloudValid=!1),v&&s.cloudsHalfRate&&this.cloudValid&&this.cloud&&this.frameIndex%2===1)h=this.cloud.tex;else if(f&&v&&o&&this.scene.depth){if(this.cloudValid=!0,(V=this.timers)==null||V.begin("clouds"),!this.cloud||!this.cloudTmp){const y=Math.max(1,this.scene.width>>1),D=Math.max(1,this.scene.height>>1);this.cloud=this.makeTarget(y,D,!1),this.cloudTmp=this.makeTarget(y,D,!1)}const q=this.cloudProgram,ie=f.settings;r.bindFramebuffer(r.FRAMEBUFFER,this.cloud.fbo),r.viewport(0,0,this.cloud.width,this.cloud.height),q.use(),this.bind(q,"uDepth",this.scene.depth,0),this.bind(q,"uVeilMask",((A=o.veil)==null?void 0:A.mask)??this.black(),3),r.uniform2f(q.uniform("uVeilCells"),((S=o.veil)==null?void 0:S.cells[0])??1,((k=o.veil)==null?void 0:k.cells[1])??1),q.setFloat("uVeilOn",o.veil&&!ie.overVeil?1:0),q.setFloat("uVeilAlpha",((C=o.veil)==null?void 0:C.alpha)??0),f.bindCommon(q,1),r.activeTexture(r.TEXTURE2),r.bindTexture(r.TEXTURE_3D,f.detail),r.uniform1i(q.uniform("uCloudDetail"),2),q.setMat4("uInvViewProj",o.invViewProj),q.setVec3("uSunDir",...o.sunDir),q.setVec3("uSunRadiance",...o.sunRadiance),q.setVec3("uSkyColor",...o.skyColor),q.setFloat("uFar",Math.max(o.far*1.5,300)),q.setFloat("uTime",o.time??0),q.setFloat("uSkip",o.rayStart??0),r.uniform1i(q.uniform("uSteps"),Math.max(8,Math.min(128,Math.round(ie.steps)))),r.drawArrays(r.TRIANGLES,0,3),r.bindTexture(r.TEXTURE_3D,null);const T=this.fogBlur;T.use(),this.bind(T,"uDepth",this.scene.depth,1),T.setMat4("uInvProjection",i),r.bindFramebuffer(r.FRAMEBUFFER,this.cloudTmp.fbo),this.bind(T,"uSrc",this.cloud.tex,0),r.uniform2f(T.uniform("uStep"),1/this.cloud.width,0),r.drawArrays(r.TRIANGLES,0,3),r.bindFramebuffer(r.FRAMEBUFFER,this.cloud.fbo),this.bind(T,"uSrc",this.cloudTmp.tex,0),r.uniform2f(T.uniform("uStep"),0,1/this.cloud.height),r.drawArrays(r.TRIANGLES,0,3),h=this.cloud.tex}let p=null;s.ssao&&this.ao&&this.aoBlur&&this.scene.depth&&((ae=this.timers)==null||ae.begin("ssao"),r.bindFramebuffer(r.FRAMEBUFFER,this.ao.fbo),r.viewport(0,0,this.ao.width,this.ao.height),this.ssao.use(),this.bind(this.ssao,"uDepth",(o==null?void 0:o.opaqueDepth)??this.scene.depth,0),this.ssao.setMat4("uProjection",t),this.ssao.setMat4("uInvProjection",i),r.uniform2f(this.ssao.uniform("uTexel"),1/this.scene.width,1/this.scene.height),this.ssao.setFloat("uRadius",s.ssaoRadius),r.drawArrays(r.TRIANGLES,0,3),r.bindFramebuffer(r.FRAMEBUFFER,this.aoBlur.fbo),this.blur.use(),this.bind(this.blur,"uSrc",this.ao.tex,0),r.uniform2f(this.blur.uniform("uTexel"),1/this.ao.width,1/this.ao.height),r.drawArrays(r.TRIANGLES,0,3),p=this.aoBlur.tex);let x=null;if(s.bloom&&this.mips.length){(ee=this.timers)==null||ee.begin("bloom");const q=this.mips[0];r.bindFramebuffer(r.FRAMEBUFFER,q.fbo),r.viewport(0,0,q.width,q.height),this.bright.use(),this.bind(this.bright,"uScene",this.scene.tex,0),this.bright.setFloat("uThreshold",s.bloomThreshold),r.drawArrays(r.TRIANGLES,0,3),this.down.use();for(let ie=1;ie<this.mips.length;ie++){const T=this.mips[ie-1],y=this.mips[ie];r.bindFramebuffer(r.FRAMEBUFFER,y.fbo),r.viewport(0,0,y.width,y.height),this.bind(this.down,"uSrc",T.tex,0),r.uniform2f(this.down.uniform("uTexel"),1/T.width,1/T.height),r.drawArrays(r.TRIANGLES,0,3)}this.up.use();for(let ie=this.mips.length-2;ie>=0;ie--){const T=this.mips[ie+1],y=this.mips[ie];r.bindFramebuffer(r.FRAMEBUFFER,y.fbo),r.viewport(0,0,y.width,y.height),r.enable(r.BLEND),r.blendFunc(r.ONE,r.ONE),this.bind(this.up,"uSrc",T.tex,0),this.bind(this.up,"uPrev",this.black(),1),r.uniform2f(this.up.uniform("uTexel"),1/T.width,1/T.height),r.drawArrays(r.TRIANGLES,0,3),r.disable(r.BLEND)}x=this.mips[0].tex}(se=this.timers)==null||se.begin("composite"),r.bindFramebuffer(r.FRAMEBUFFER,null),r.viewport(0,0,this.width,this.height),this.composite.use(),this.bind(this.composite,"uScene",this.scene.tex,0),this.bind(this.composite,"uBloom",x??this.black(),1),this.composite.setFloat("uBloomStrength",x?s.bloomStrength:0),this.bind(this.composite,"uAo",p??this.black(),2),this.bind(this.composite,"uFog",n??this.black(),3),this.composite.setFloat("uHasFog",n?1:0),r.uniform2f(this.composite.uniform("uFogSize"),((ue=this.fog)==null?void 0:ue.width)??1,((ze=this.fog)==null?void 0:ze.height)??1),this.composite.setFloat("uDepthAware",s.fogDepthAware?1:0),this.bind(this.composite,"uCloud",h??this.black(),5),this.composite.setFloat("uHasCloud",h?1:0);const w=(fe=o==null?void 0:o.clouds)==null?void 0:fe.settings;this.composite.setFloat("uCloudOpacity",Math.min(1,Math.max(0,(w==null?void 0:w.opacity)??1))),this.composite.setFloat("uCloudShade",Math.min(1,Math.max(0,(w==null?void 0:w.shade)??0))),r.uniform2f(this.composite.uniform("uCloudDigital"),w!=null&&w.digital?Math.max(1,w.digital.pixels):0,w!=null&&w.digital?w.digital.steps:0),r.uniform2f(this.composite.uniform("uCloudSize"),((Te=this.cloud)==null?void 0:Te.width)??1,((Ee=this.cloud)==null?void 0:Ee.height)??1),this.composite.setFloat("uAoStrength",p?s.ssaoStrength:0),this.composite.setFloat("uExposure",e),this.composite.setFloat("uVignette",s.vignette),this.composite.setFloat("uContrast",s.contrast),this.composite.setFloat("uSaturation",s.saturation),this.bind(this.composite,"uDepth",this.scene.depth??this.black(),4),this.composite.setMat4("uInvProjection",i),this.composite.setMat4("uInvViewProj",(o==null?void 0:o.invViewProj)??ct()),r.uniform4f(this.composite.uniform("uDof"),s.dofFocus,s.dofRange,s.dofFalloff,s.dof&&this.scene.depth?s.dofBlur:0);const m=s.blurOutside&&o&&this.scene.depth?s.blurOutside:null,g=m?m.rect:[0,0,0,0];r.uniform4f(this.composite.uniform("uBlurRect"),g[0],g[1],g[2],g[3]),r.uniform2f(this.composite.uniform("uBlurOut"),m?Math.max(.01,m.distance):1,m?m.blur:0),r.uniform2f(this.composite.uniform("uTexel"),1/this.scene.width,1/this.scene.height),this.composite.setFloat("uChroma",s.chroma),this.composite.setFloat("uLens",Math.max(0,s.lens??0)),this.composite.setFloat("uAspect",this.scene.width/Math.max(1,this.scene.height)),r.drawArrays(r.TRIANGLES,0,3),r.bindVertexArray(null),r.enable(r.DEPTH_TEST)}black(){if(this.blackTex)return this.blackTex;const e=this.gl,t=e.createTexture();return e.bindTexture(e.TEXTURE_2D,t),e.texImage2D(e.TEXTURE_2D,0,e.RGBA8,1,1,0,e.RGBA,e.UNSIGNED_BYTE,new Uint8Array([0,0,0,255])),e.bindTexture(e.TEXTURE_2D,null),this.blackTex=t,t}bind(e,t,i,o){const r=this.gl;r.activeTexture(r.TEXTURE0+o),r.bindTexture(r.TEXTURE_2D,i),r.uniform1i(e.uniform(t),o)}}const Xa={enabled:!1,dayLength:24,azimuth:35,maxElevation:58,nightLight:.5},me=(a,e,t)=>[a[0]+(e[0]-a[0])*t,a[1]+(e[1]-a[1])*t,a[2]+(e[2]-a[2])*t],$t=(a,e,t)=>{const i=Math.min(1,Math.max(0,(a-e)/(t-e)));return i*i*(3-2*i)};function ao(a,e,t){return a+(e-a)*t}function Ga(a,e,t,i=0,o=[1,1,1]){const r=Wa(a,e,t),s=Math.min(1,Math.max(0,i));if(s<=0)return r;const n=r.day,u=me([1,1,1],o,s),l=v=>[v[0]*u[0],v[1]*u[1],v[2]*u[2]],c=l(me([.02,.025,.035],[.3,.32,.36],n)),h=l(me([.02,.025,.035],[.42,.44,.48],n)),f=l(me([.015,.02,.03],[.2,.22,.26],n));return{...r,sunIntensity:r.sunIntensity*(1-.9*s),sunColor:me(r.sunColor,l([.82,.84,.9]),.7*s),skyColor:me(r.skyColor,c,s),groundColor:me(r.groundColor,r.groundColor.map(v=>v*.6),s),ambient:r.ambient*(1-.3*s),horizon:me(r.horizon,h,s),zenith:me(r.zenith,f,s)}}function Wa(a,e,t){const i=(a%1+1)%1,o=Math.sin(i*Math.PI*2),r=$t(o,-.18,.35),s=1-Math.min(1,Math.max(0,o/.35)),n=o<0,u=$t(o,0,.22),l=$t(-o,.02,.3),c=Math.max(n?25:4,Math.abs(o)*t.maxElevation)*Math.PI/180,h=(t.azimuth+(n?180:0))*Math.PI/180,f=[-Math.sin(h)*Math.cos(c),-Math.sin(c),Math.cos(h)*Math.cos(c)],v=[1,.55,.28],p=n?[.5,.62,1]:me(e.sunColor,v,s*.8),x=Math.min(1,Math.max(0,t.nightLight??.5)),w=n?e.sunIntensity*(.03+.2*x)*l:e.sunIntensity*(.1+.9*r)*u,m=[.02,.03,.06],g=[.9,.45,.25],b=[.18,.36,.78],F=[.62,.74,.92],_=me(m,b,r),E=(s*r*.9+s*(1-r)*.5)*$t(o,-.2,0),R=me(me(m,F,r),g,E);return{sunDir:f,sunColor:p,sunIntensity:w,skyColor:me(me([.05,.06,.1],[.16,.2,.34],x),e.skyColor,r),groundColor:me([.03,.03,.04],e.groundColor,r),ambient:e.ambient*ao(.18+.22*x,1,r),horizon:R,zenith:_,day:r,exposure:ao(1+3*x,1,r)}}const Ha={enabled:!0,sunSize:.012,sunGlow:.6},ja=`#version 300 es
out vec2 vNdc;
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  vNdc = p * 2.0 - 1.0;
  gl_Position = vec4(vNdc, 0.999999, 1.0);
}`,Ya=`#version 300 es
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
}`;class qa{constructor(e){d(this,"settings",{...Ha});d(this,"program");d(this,"vao");this.gl=e,this.program=new O(e,ja,Ya);const t=e.createVertexArray();if(!t)throw new Error("sky vao failed");this.vao=t}setSky(e,t){e.setVec3("uSunDir",...t.sunDir),e.setVec3("uSunColor",...t.sunColor),e.setFloat("uSunIntensity",t.sunIntensity),e.setVec3("uHorizon",...t.horizon),e.setVec3("uZenith",...t.zenith),e.setFloat("uSunSize",this.settings.sunSize),e.setFloat("uSunGlow",this.settings.sunGlow)}renderEnv(e,t){const i=this.gl,o=this.program;o.use(),this.setSky(o,t),o.setVec3("uEye",0,0,0),o.setVec3("uBelow",...t.groundColor),o.setFloat("uExposure",1),o.setFloat("uToneMap",0),i.disable(i.DEPTH_TEST),i.disable(i.CULL_FACE),i.bindVertexArray(this.vao);for(let r=0;r<6;r++)e.bindFace(r),o.setMat4("uInvViewProj",e.invViewProj[r]),i.drawArrays(i.TRIANGLES,0,3);i.bindVertexArray(null),e.finish(),i.enable(i.CULL_FACE),i.enable(i.DEPTH_TEST)}draw(e,t,i,o,r){const s=this.gl,n=this.program;n.use(),this.setSky(n,i),n.setMat4("uInvViewProj",e),n.setVec3("uEye",t[0],t[1],t[2]),n.setVec3("uBelow",i.horizon[0]*.5,i.horizon[1]*.5,i.horizon[2]*.5),n.setFloat("uExposure",o),n.setFloat("uToneMap",r?1:0),s.depthFunc(s.LEQUAL),s.depthMask(!1),s.disable(s.CULL_FACE),s.bindVertexArray(this.vao),s.drawArrays(s.TRIANGLES,0,3),s.bindVertexArray(null),s.enable(s.CULL_FACE),s.depthMask(!0),s.depthFunc(s.LESS)}}const Ka={enabled:!0,reflections:!0,reflectionScale:.5,reflectionHalfRate:!0,waveHeight:.035,waveSpeed:1,waveSize:1,ripple:1,rippleSize:1,waveDirection:0,depthFade:1.2,foam:!0,foamWidth:.35,whitecaps:0,sides:!0,clarity:.55,color:[.07,.25,.32],sparkle:1,glow:1},gt=4,Za=`#version 300 es
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
}`,Ja=`#version 300 es
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
}`,Qa=`#version 300 es
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
}`,er=`#version 300 es
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
}`;class tr{constructor(e){d(this,"settings",{...Ka});d(this,"level",0);d(this,"program");d(this,"vao",null);d(this,"vbo",null);d(this,"ibo",null);d(this,"count",0);d(this,"sideProgram");d(this,"sideVao",null);d(this,"sideVbo",null);d(this,"sideIbo",null);d(this,"sideCount",0);d(this,"tintVbo",null);d(this,"sideTintVbo",null);d(this,"fbo",null);d(this,"tex",null);d(this,"depth",null);d(this,"rw",0);d(this,"rh",0);d(this,"wet",new Set);this.gl=e,this.program=new O(e,Qa,er),this.sideProgram=new O(e,Za,Ja)}get hasSurface(){return this.count>0}nearWater(e,t){if(!this.wet.size)return!1;const i=Math.floor((e[0]-t)/gt),o=Math.floor((e[3]+t)/gt),r=Math.floor((e[2]-t)/gt),s=Math.floor((e[5]+t)/gt);for(let n=r;n<=s;n++)for(let u=i;u<=o;u++)if(this.wet.has(n*65536+u))return!0;return!1}setGeometry(e){const t=this.gl;this.dispose(!1),this.level=e.level,this.wet=new Set;for(let s=0;s+2<e.vertices.length;s+=6)this.wet.add(Math.floor(e.vertices[s+2]/gt)*65536+Math.floor(e.vertices[s]/gt));if(this.count=e.indices.length,!this.count)return;if(this.sideCount=e.sides.indices.length,this.sideCount){const s=t.createVertexArray(),n=t.createBuffer(),u=t.createBuffer();if(!s||!n||!u)throw new Error("water side allocation failed");this.sideVao=s,this.sideVbo=n,this.sideIbo=u,t.bindVertexArray(s),t.bindBuffer(t.ARRAY_BUFFER,n),t.bufferData(t.ARRAY_BUFFER,e.sides.vertices,t.STATIC_DRAW),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,3,t.FLOAT,!1,16,0),t.enableVertexAttribArray(1),t.vertexAttribPointer(1,1,t.FLOAT,!1,16,12),e.sides.tints&&(this.sideTintVbo=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,this.sideTintVbo),t.bufferData(t.ARRAY_BUFFER,e.sides.tints,t.STATIC_DRAW),t.enableVertexAttribArray(2),t.vertexAttribPointer(2,4,t.FLOAT,!1,16,0)),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,u),t.bufferData(t.ELEMENT_ARRAY_BUFFER,e.sides.indices,t.STATIC_DRAW),t.bindVertexArray(null)}const i=t.createVertexArray(),o=t.createBuffer(),r=t.createBuffer();if(!i||!o||!r)throw new Error("water allocation failed");this.vao=i,this.vbo=o,this.ibo=r,t.bindVertexArray(i),t.bindBuffer(t.ARRAY_BUFFER,o),t.bufferData(t.ARRAY_BUFFER,e.vertices,t.STATIC_DRAW),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,3,t.FLOAT,!1,24,0),t.enableVertexAttribArray(1),t.vertexAttribPointer(1,2,t.FLOAT,!1,24,12),t.enableVertexAttribArray(2),t.vertexAttribPointer(2,1,t.FLOAT,!1,24,20),e.tints&&(this.tintVbo=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,this.tintVbo),t.bufferData(t.ARRAY_BUFFER,e.tints,t.STATIC_DRAW),t.enableVertexAttribArray(3),t.vertexAttribPointer(3,4,t.FLOAT,!1,16,0)),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,r),t.bufferData(t.ELEMENT_ARRAY_BUFFER,e.indices,t.STATIC_DRAW),t.bindVertexArray(null)}mirroredView(e,t){const i=this.level,o=[e[0],2*i-e[1],e[2]],r=[t[0],2*i-t[1],t[2]];return{view:hi(o,r),eye:o}}beginReflection(e,t,i){const o=this.gl,r=Math.max(1,Math.floor(e*this.settings.reflectionScale)),s=Math.max(1,Math.floor(t*this.settings.reflectionScale));if(!this.fbo||r!==this.rw||s!==this.rh){this.fbo&&o.deleteFramebuffer(this.fbo),this.tex&&o.deleteTexture(this.tex),this.depth&&o.deleteRenderbuffer(this.depth);const n=o.createFramebuffer(),u=o.createTexture(),l=o.createRenderbuffer();if(!n||!u||!l)throw new Error("reflection target failed");o.bindTexture(o.TEXTURE_2D,u),o.texImage2D(o.TEXTURE_2D,0,o.RGBA8,r,s,0,o.RGBA,o.UNSIGNED_BYTE,null),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MIN_FILTER,o.LINEAR),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MAG_FILTER,o.LINEAR),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_S,o.CLAMP_TO_EDGE),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_T,o.CLAMP_TO_EDGE),o.bindRenderbuffer(o.RENDERBUFFER,l),o.renderbufferStorage(o.RENDERBUFFER,o.DEPTH_COMPONENT24,r,s),o.bindFramebuffer(o.FRAMEBUFFER,n),o.framebufferTexture2D(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,u,0),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.DEPTH_ATTACHMENT,o.RENDERBUFFER,l),o.bindFramebuffer(o.FRAMEBUFFER,null),o.bindTexture(o.TEXTURE_2D,null),this.fbo=n,this.tex=u,this.depth=l,this.rw=r,this.rh=s}o.bindFramebuffer(o.FRAMEBUFFER,this.fbo),o.viewport(0,0,r,s),o.clearColor(i[0],i[1],i[2],1),o.clear(o.COLOR_BUFFER_BIT|o.DEPTH_BUFFER_BIT),o.cullFace(o.FRONT)}endReflection(){this.gl.cullFace(this.gl.BACK)}draw(e){if(!this.vao)return;const t=this.gl,i=this.program;i.use(),i.setMat4("uProjection",e.projection),i.setMat4("uView",e.view),i.setFloat("uTime",e.time*this.settings.waveSpeed),i.setFloat("uWaveHeight",this.settings.waveHeight),i.setFloat("uWaveFreq",1/Math.max(.1,this.settings.waveSize)),i.setFloat("uRipple",this.settings.ripple);const o=this.settings.waveDirection*Math.PI/180;this.gl.uniform2f(i.uniform("uWaveRot"),Math.cos(o),Math.sin(o)),i.setFloat("uFoam",this.settings.foam?1:0),i.setFloat("uFoamWidth",this.settings.foamWidth),i.setFloat("uWhitecaps",Math.max(0,Math.min(1,this.settings.whitecaps))),i.setFloat("uHasDepth",e.depth&&e.invViewProj?1:0),i.setFloat("uAbsorb",this.settings.depthFade),e.depth&&e.invViewProj&&(this.gl.activeTexture(this.gl.TEXTURE10),this.gl.bindTexture(this.gl.TEXTURE_2D,e.depth),i.setMat4("uInvViewProj",e.invViewProj)),this.gl.uniform1i(i.uniform("uSceneDepth"),10),i.setFloat("uRippleFreq",1/Math.max(.1,this.settings.rippleSize)),i.setVec3("uEye",...e.eye),i.setVec3("uSunDir",...e.sunDir),i.setVec3("uSunColor",...e.sunColor),i.setFloat("uSunIntensity",e.sunIntensity),i.setVec3("uHorizon",...e.horizon),i.setVec3("uZenith",...e.zenith),i.setVec3("uColor",...this.settings.color),i.setFloat("uLight",e.light),i.setFloat("uGlow",Math.max(0,this.settings.glow)),i.setFloat("uClarity",this.settings.clarity),i.setFloat("uSparkle",this.settings.sparkle);const r=this.settings.reflections&&this.tex?1:0;if(this.tex&&(t.activeTexture(t.TEXTURE0+9),t.bindTexture(t.TEXTURE_2D,this.tex)),t.uniform1i(i.uniform("uReflection"),9),i.setFloat("uHasReflection",r),t.uniform2f(i.uniform("uResolution"),e.width,e.height),i.setVec3("uFogColor",...e.fogColor),t.uniform2f(i.uniform("uFogRange"),e.fogRange[0],e.fogRange[1]),i.setFloat("uExposure",e.exposure),i.setFloat("uToneMap",e.toneMap?1:0),t.enable(t.BLEND),t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ZERO,t.ONE),t.depthMask(!1),t.disable(t.CULL_FACE),this.settings.sides&&this.sideVao){const s=this.sideProgram;s.use(),s.setMat4("uProjection",e.projection),s.setMat4("uView",e.view),s.setFloat("uTime",e.time*this.settings.waveSpeed),s.setFloat("uWaveHeight",this.settings.waveHeight),s.setFloat("uWaveFreq",1/Math.max(.1,this.settings.waveSize));const n=this.settings.waveDirection*Math.PI/180;t.uniform2f(s.uniform("uWaveRot"),Math.cos(n),Math.sin(n)),s.setVec3("uColor",...this.settings.color),s.setFloat("uLight",e.light),s.setFloat("uGlow",Math.max(0,this.settings.glow)),s.setVec3("uHorizon",...e.horizon),s.setVec3("uEye",...e.eye),s.setVec3("uFogColor",...e.fogColor),t.uniform2f(s.uniform("uFogRange"),e.fogRange[0],e.fogRange[1]),s.setFloat("uExposure",e.exposure),s.setFloat("uToneMap",e.toneMap?1:0),t.bindVertexArray(this.sideVao),this.sideTintVbo||t.vertexAttrib4f(2,-1,0,0,0),t.drawElements(t.TRIANGLES,this.sideCount,t.UNSIGNED_INT,0),i.use()}t.bindVertexArray(this.vao),this.tintVbo||t.vertexAttrib4f(3,-1,0,0,0),t.drawElements(t.TRIANGLES,this.count,t.UNSIGNED_INT,0),t.bindVertexArray(null),t.enable(t.CULL_FACE),t.depthMask(!0),t.disable(t.BLEND)}dispose(e=!0){const t=this.gl;this.vao&&t.deleteVertexArray(this.vao),this.vbo&&t.deleteBuffer(this.vbo),this.ibo&&t.deleteBuffer(this.ibo),this.vao=this.vbo=this.ibo=null,this.count=0,this.sideVao&&t.deleteVertexArray(this.sideVao),this.sideVbo&&t.deleteBuffer(this.sideVbo),this.sideIbo&&t.deleteBuffer(this.sideIbo),this.sideVao=this.sideVbo=this.sideIbo=null,this.tintVbo&&t.deleteBuffer(this.tintVbo),this.sideTintVbo&&t.deleteBuffer(this.sideTintVbo),this.tintVbo=this.sideTintVbo=null,this.sideCount=0,e&&(this.fbo&&t.deleteFramebuffer(this.fbo),this.tex&&t.deleteTexture(this.tex),this.depth&&t.deleteRenderbuffer(this.depth),this.fbo=this.tex=this.depth=null,this.program.dispose(),this.sideProgram.dispose())}}const Et=32,K=16,ro=3,Jt=4,ir=Jt*2+1,Xt=8,gi=8,so=11,or={enabled:!0,clumps:!0,density:40,height:.2,width:.04,wind:!0,windStrength:.45,windDirection:30,gustSpeed:1.6,gustSize:.18,interaction:!0,recover:3,distance:55,rootColor:[.03,.07,.015],tipColor:[.3,.42,.08],colorMix:0},ar=`
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
`,rr=`#version 300 es
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
${ar}
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
}`,sr=`#version 300 es
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
}`,Yo=`#version 300 es
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
}`,Qt=Yo.replace(`in float vVary;
`,`in vec2 vUv;
uniform sampler2D uAlbedo;
uniform float uHasTex;
uniform float uCutoff;
`).replace("vec3 ground = vColor * mix(0.4, 1.08, vT);",`vec4 tex = uHasTex > 0.5 ? texture(uAlbedo, vUv) : vec4(1.0);
  if (uCutoff > 0.0 && tex.a < uCutoff) discard;
  vec3 ground = vColor * tex.rgb * mix(0.55, 1.05, vT);`).replace("vec3 own = mix(uRootColor, uTipColor, vT) * vVary;","vec3 own = mix(uRootColor, uTipColor, vT);");if(!Qt.includes("uCutoff")||!Qt.includes("tex.rgb")||Qt.includes("vVary"))throw new Error("grass: the clump shader could not be made from the blades’ one");function tt(a,e,t){const i=Math.sin(a*127.1+e*311.7+t*74.7)*43758.5453;return i-Math.floor(i)}class nr{constructor(e){d(this,"settings",{...or});d(this,"program");d(this,"bladeBuffer");d(this,"chunks",new Map);d(this,"width",0);d(this,"height",0);d(this,"sample",null);d(this,"clumpProgram");d(this,"kinds",[]);d(this,"clumpSample",null);d(this,"clumpPer",0);d(this,"seed",0);d(this,"res",2);d(this,"firstFrame",!0);d(this,"stale",new Set);d(this,"trample");d(this,"tw",1);d(this,"th",1);d(this,"flat",new Float32Array(1));d(this,"pushX",new Float32Array(1));d(this,"pushZ",new Float32Array(1));d(this,"rustle",new Float32Array(1));d(this,"bytes",new Uint8Array(4));d(this,"active",new Set);d(this,"dirty",null);this.gl=e,this.program=new O(e,sr,Yo),this.clumpProgram=new O(e,rr,Qt);const t=[];for(let i=0;i<Jt;i++)t.push(-1,i/Jt,1,i/Jt);t.push(0,1),this.bladeBuffer=e.createBuffer(),e.bindBuffer(e.ARRAY_BUFFER,this.bladeBuffer),e.bufferData(e.ARRAY_BUFFER,new Float32Array(t),e.STATIC_DRAW),this.trample=e.createTexture(),this.resizeTrample(1,1)}get blades(){let e=0;for(const t of this.chunks.values())e+=t.count;return e}setField(e,t,i,o=0,r){this.clear(),this.width=e,this.height=t,this.sample=i,this.seed=o,this.clumpSample=(r==null?void 0:r.sample)??null,this.clumpPer=Math.max(0,Math.round((r==null?void 0:r.perCell)??0)),this.res=e*t<=256*256?2:1,this.resizeTrample(e*this.res,t*this.res),this.firstFrame=!0}rebuild(e,t,i,o,r=!1){if(!this.sample)return;const s=Math.max(0,Math.floor(e/K)),n=Math.max(0,Math.floor(t/K)),u=Math.min(Math.ceil(this.width/K),Math.ceil(i/K)),l=Math.min(Math.ceil(this.height/K),Math.ceil(o/K));for(let c=n;c<l;c++)for(let h=s;h<u;h++){const f=c*65536+h;this.chunks.has(f)&&(r?this.stale.add(f):(this.stale.delete(f),this.buildChunk(h,c)))}}setClumpKinds(e){const t=this.gl;for(const i of this.kinds)t.deleteBuffer(i.vbo),t.deleteBuffer(i.ibo);this.kinds=e.map(i=>{const o=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,o),t.bufferData(t.ARRAY_BUFFER,i.mesh.vertices,t.STATIC_DRAW);const r=t.createBuffer();t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,r),t.bufferData(t.ELEMENT_ARRAY_BUFFER,i.mesh.indices,t.STATIC_DRAW),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,null);let s=0;for(let n=1;n<i.mesh.vertices.length;n+=so)s=Math.max(s,i.mesh.vertices[n]);return{vbo:o,ibo:r,indices:i.mesh.indices.length,tall:s,kind:i}}),t.bindBuffer(t.ARRAY_BUFFER,null),this.regrow()}get clumpCount(){let e=0;for(const t of this.chunks.values())for(const i of t.clumps)e+=i.count;return e}regrow(){if(this.sample){this.stale.clear();for(const e of this.chunks.values())this.dropChunk(e);this.chunks.clear(),this.firstFrame=!0}}clear(){for(const e of this.chunks.values())this.dropChunk(e);this.chunks.clear(),this.stale.clear(),this.sample=null,this.clumpSample=null,this.active.clear()}dropChunk(e){e.vao&&this.gl.deleteVertexArray(e.vao),e.buffer&&this.gl.deleteBuffer(e.buffer);for(const t of e.clumps)this.gl.deleteVertexArray(t.vao),this.gl.deleteBuffer(t.buffer)}chunkDistance(e,t,i){const o=Math.min(this.width,e+K),r=Math.min(this.height,t+K);return Math.hypot(Math.max(e-i[0],0,i[0]-o),Math.max(t-i[2],0,i[2]-r))}stream(e){if(!this.sample)return;const t=this.settings.distance,i=Math.ceil(this.width/K),o=Math.ceil(this.height/K),r=Math.max(0,Math.floor((e[0]-t)/K)),s=Math.max(0,Math.floor((e[2]-t)/K)),n=Math.min(i-1,Math.floor((e[0]+t)/K)),u=Math.min(o-1,Math.floor((e[2]+t)/K)),l=[];for(let f=s;f<=u;f++)for(let v=r;v<=n;v++){if(this.chunks.has(f*65536+v))continue;const p=this.chunkDistance(v*K,f*K,e);p<=t&&l.push({cx:v,cz:f,d:p})}l.sort((f,v)=>f.d-v.d);const c=this.firstFrame;this.firstFrame=!1;const h=performance.now();if(this.stale.size){const f=[...this.stale].map(v=>({key:v,cx:v%65536,cz:Math.floor(v/65536)}));f.sort((v,p)=>this.chunkDistance(v.cx*K,v.cz*K,e)-this.chunkDistance(p.cx*K,p.cz*K,e));for(let v=0;v<f.length&&!(v>0&&performance.now()-h>=ro);v++)this.stale.delete(f[v].key),this.chunks.has(f[v].key)&&this.buildChunk(f[v].cx,f[v].cz)}for(let f=0;f<l.length&&!((f>0||this.stale.size)&&!c&&performance.now()-h>=ro);f++)this.buildChunk(l[f].cx,l[f].cz);for(const[f,v]of this.chunks)this.chunkDistance(v.x0,v.z0,e)>t*1.6&&(this.dropChunk(v),this.chunks.delete(f))}buildChunk(e,t){const i=t*65536+e,o=this.chunks.get(i);o&&(this.dropChunk(o),this.chunks.delete(i));const r=this.sample,s=Math.max(0,Math.round(this.settings.density)),n=e*K,u=t*K,l=Math.min(this.width,n+K),c=Math.min(this.height,u+K),h=new Float32Array(s*(l-n)*(c-u)*Xt);let f=0,v=1/0,p=-1/0;for(let F=0;F<s;F++)for(let _=u;_<c;_++)for(let E=n;E<l;E++){const R=E+tt(E,_,F*3+this.seed),M=_+tt(E,_,F*3+1+this.seed),z=r(R,M);z&&(h[f++]=R,h[f++]=z.y,h[f++]=M,h[f++]=tt(E,_,F*3+2+this.seed)*Math.PI,h[f++]=(z.height??1)*(.7+.6*tt(_,E,F+9)),h[f++]=z.color[0],h[f++]=z.color[1],h[f++]=z.color[2],v=Math.min(v,z.y),p=Math.max(p,z.y))}const x=f/Xt,w=this.growClumps(n,u,l,c);for(const F of w.ys)v=Math.min(v,F),p=Math.max(p,F);if(!x){this.chunks.set(i,{x0:n,z0:u,vao:null,buffer:null,count:0,minY:w.batches.length?v:0,maxY:w.batches.length?p:0,clumps:w.batches});return}const m=this.gl,g=m.createVertexArray(),b=m.createBuffer();m.bindVertexArray(g),m.bindBuffer(m.ARRAY_BUFFER,this.bladeBuffer),m.enableVertexAttribArray(0),m.vertexAttribPointer(0,2,m.FLOAT,!1,8,0),m.bindBuffer(m.ARRAY_BUFFER,b),m.bufferData(m.ARRAY_BUFFER,h.subarray(0,f),m.STATIC_DRAW),m.enableVertexAttribArray(1),m.vertexAttribPointer(1,4,m.FLOAT,!1,Xt*4,0),m.vertexAttribDivisor(1,1),m.enableVertexAttribArray(2),m.vertexAttribPointer(2,4,m.FLOAT,!1,Xt*4,16),m.vertexAttribDivisor(2,1),m.bindVertexArray(null),this.chunks.set(i,{x0:n,z0:u,vao:g,buffer:b,count:x,minY:v,maxY:p,clumps:w.batches})}growClumps(e,t,i,o){const r=this.clumpSample;if(!r||!this.kinds.length||!this.clumpPer)return{batches:[],ys:[]};const s=this.kinds.map(()=>[]),n=[];for(let c=0;c<this.clumpPer;c++)for(let h=t;h<o;h++)for(let f=e;f<i;f++){const v=f+tt(f,h,c*5+101+this.seed),p=h+tt(f,h,c*5+102+this.seed),x=r(v,p);if(!x||!this.kinds[x.kind])continue;const w=x.tint??[1,1,1],m=this.kinds[x.kind].kind.color;s[x.kind].push(v,x.y,p,tt(f,h,c*5+103+this.seed)*Math.PI*2,(x.size??1)*(.8+.4*tt(h,f,c+77)),w[0]*m[0],w[1]*m[1],w[2]*m[2]),n.push(x.y+this.kinds[x.kind].tall*(x.size??1)*1.2),n.push(x.y)}const u=this.gl,l=[];return s.forEach((c,h)=>{if(!c.length)return;const f=this.kinds[h],v=u.createVertexArray(),p=u.createBuffer();u.bindVertexArray(v),u.bindBuffer(u.ARRAY_BUFFER,f.vbo);const x=so*4;[[0,3,0],[1,3,3],[2,3,6],[3,2,9]].forEach(([w,m,g])=>{u.enableVertexAttribArray(w),u.vertexAttribPointer(w,m,u.FLOAT,!1,x,g*4)}),u.bindBuffer(u.ELEMENT_ARRAY_BUFFER,f.ibo),u.bindBuffer(u.ARRAY_BUFFER,p),u.bufferData(u.ARRAY_BUFFER,new Float32Array(c),u.STATIC_DRAW),u.enableVertexAttribArray(4),u.vertexAttribPointer(4,4,u.FLOAT,!1,gi*4,0),u.vertexAttribDivisor(4,1),u.enableVertexAttribArray(5),u.vertexAttribPointer(5,4,u.FLOAT,!1,gi*4,16),u.vertexAttribDivisor(5,1),u.bindVertexArray(null),l.push({kind:h,vao:v,buffer:p,count:c.length/gi})}),{batches:l,ys:n}}resizeTrample(e,t){this.tw=Math.max(1,e),this.th=Math.max(1,t);const i=this.tw*this.th;this.flat=new Float32Array(i),this.pushX=new Float32Array(i),this.pushZ=new Float32Array(i),this.rustle=new Float32Array(i),this.bytes=new Uint8Array(i*4);for(let r=0;r<i;r++)this.bytes[r*4+1]=128,this.bytes[r*4+2]=128;const o=this.gl;o.activeTexture(o.TEXTURE13),o.bindTexture(o.TEXTURE_2D,this.trample),o.pixelStorei(o.UNPACK_ALIGNMENT,1),o.texImage2D(o.TEXTURE_2D,0,o.RGBA8,this.tw,this.th,0,o.RGBA,o.UNSIGNED_BYTE,this.bytes),o.pixelStorei(o.UNPACK_ALIGNMENT,4),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MIN_FILTER,o.LINEAR),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MAG_FILTER,o.LINEAR),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_S,o.CLAMP_TO_EDGE),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_T,o.CLAMP_TO_EDGE),o.bindTexture(o.TEXTURE_2D,null),this.active.clear(),this.dirty=null}touch(e){const t=e%this.tw,i=Math.floor(e/this.tw),o=this.dirty;this.dirty=o?[Math.min(o[0],t),Math.min(o[1],i),Math.max(o[2],t),Math.max(o[3],i)]:[t,i,t,i]}press(e,t,i,o=1,r=0,s=0){if(!this.settings.interaction||!this.sample)return;const n=Math.max(.75,i*this.res),u=e*this.res,l=t*this.res,c=Math.hypot(r,s);for(let h=Math.max(0,Math.floor(l-n));h<=Math.min(this.th-1,Math.ceil(l+n));h++)for(let f=Math.max(0,Math.floor(u-n));f<=Math.min(this.tw-1,Math.ceil(u+n));f++){const v=f+.5-u,p=h+.5-l,x=Math.hypot(v,p);if(x>n)continue;const w=o*(1-x/n*(x/n)),m=h*this.tw+f;let g=x>.001?v/x:0,b=x>.001?p/x:0;c>1e-4&&(g=g*.4+r/c*.6,b=b*.4+s/c*.6),w>=this.flat[m]&&(this.pushX[m]=g,this.pushZ[m]=b),this.flat[m]=Math.max(this.flat[m],w),this.rustle[m]=Math.max(this.rustle[m],Math.min(1,w*1.5)),this.active.add(m),this.touch(m)}}update(e){if(this.active.size){const n=e/Math.max(.05,this.settings.recover),u=e/.8;for(const l of this.active)this.flat[l]=Math.max(0,this.flat[l]-n*(.4+(1-this.flat[l])*1.2)),this.rustle[l]=Math.max(0,this.rustle[l]-u),this.flat[l]<=0&&this.rustle[l]<=0&&this.active.delete(l),this.touch(l)}const t=this.dirty;if(!t)return;this.dirty=null;const i=t[2]-t[0]+1,o=t[3]-t[1]+1,r=new Uint8Array(i*o*4);for(let n=0;n<o;n++)for(let u=0;u<i;u++){const l=(t[1]+n)*this.tw+t[0]+u,c=(n*i+u)*4;r[c]=Math.round(this.flat[l]*255),r[c+1]=Math.round((this.pushX[l]*.5+.5)*255),r[c+2]=Math.round((this.pushZ[l]*.5+.5)*255),r[c+3]=Math.round(this.rustle[l]*255)}const s=this.gl;s.activeTexture(s.TEXTURE13),s.bindTexture(s.TEXTURE_2D,this.trample),s.pixelStorei(s.UNPACK_ALIGNMENT,1),s.texSubImage2D(s.TEXTURE_2D,0,t[0],t[1],i,o,s.RGBA,s.UNSIGNED_BYTE,r),s.pixelStorei(s.UNPACK_ALIGNMENT,4),s.bindTexture(s.TEXTURE_2D,null)}draw(e){const t=this.settings;if(!t.enabled||!this.sample)return 0;this.stream(e.focus);const i=this.gl,o=this.program;o.use(),o.setMat4("uProjection",e.projection),o.setMat4("uView",e.view),o.setVec3("uEye",...e.eye),o.setVec3("uFocus",...e.focus),o.setFloat("uTime",e.time),o.setFloat("uHeight",t.height),o.setFloat("uWidth",t.width);const r=t.windDirection*Math.PI/180;i.uniform4f(o.uniform("uWind"),Math.cos(r),Math.sin(r),t.wind?t.windStrength:0,t.gustSpeed),o.setFloat("uGustSize",t.gustSize),i.activeTexture(i.TEXTURE13),i.bindTexture(i.TEXTURE_2D,this.trample),i.uniform1i(o.uniform("uTrample"),13),i.uniform2f(o.uniform("uMapSize"),this.width,this.height),o.setFloat("uTrampleOn",t.interaction?1:0),o.setFloat("uFar",t.distance),o.setVec3("uRootColor",...t.rootColor),o.setVec3("uTipColor",...t.tipColor),o.setFloat("uColorMix",t.colorMix);const s=Math.hypot(...e.sunDir)||1;o.setVec3("uSunDir",e.sunDir[0]/s,e.sunDir[1]/s,e.sunDir[2]/s),o.setVec3("uSunColor",...e.sunColor),o.setFloat("uSunIntensity",e.sunIntensity),o.setVec3("uSkyColor",...e.skyColor),o.setVec3("uGroundColor",...e.groundColor),o.setFloat("uAmbient",e.ambient),o.setVec3("uFogColor",...e.fogColor),i.uniform2f(o.uniform("uFogRange"),e.fogRange[0],e.fogRange[1]),o.setFloat("uExposure",e.exposure),o.setFloat("uToneMap",e.toneMap?1:0),i.uniform1i(o.uniform("uShadow0"),1),i.uniform1i(o.uniform("uShadow1"),7),i.uniform1i(o.uniform("uShadow2"),8);const n=new Float32Array(48);e.lightViewProj.slice(0,3).forEach((h,f)=>n.set(h,f*16)),i.uniformMatrix4fv(o.uniform("uLightVP"),!1,n),i.uniform1i(o.uniform("uCascades"),e.lightViewProj.length),o.setFloat("uShadowStrength",e.shadowStrength),i.disable(i.CULL_FACE);const u=he(e.projection,e.view);let l=0;const c=t.distance*.3;for(const h of this.chunks.values()){if(!h.vao)continue;const f=Math.min(this.width,h.x0+K),v=Math.min(this.height,h.z0+K),p=this.chunkDistance(h.x0,h.z0,e.focus);if(p>t.distance||no(u,h.x0,h.minY,h.z0,f,h.maxY+t.height*2,v))continue;const x=Math.max(.12,Math.min(1,1-(p-c)/(t.distance-c))),w=Math.min(h.count,Math.ceil(h.count*Math.min(1,x+.08)));o.setFloat("uKeep",x),o.setFloat("uCount",h.count),i.bindVertexArray(h.vao),i.drawArraysInstanced(i.TRIANGLE_STRIP,0,ir,w),l++}return i.bindVertexArray(null),t.clumps&&this.kinds.length&&(l+=this.drawClumps(e,u)),i.enable(i.CULL_FACE),l}drawClumps(e,t){const i=this.settings,o=this.gl,r=this.clumpProgram;r.use(),r.setMat4("uProjection",e.projection),r.setMat4("uView",e.view),r.setVec3("uEye",...e.eye),r.setVec3("uFocus",...e.focus),r.setFloat("uTime",e.time);const s=i.windDirection*Math.PI/180;o.uniform4f(r.uniform("uWind"),Math.cos(s),Math.sin(s),i.wind?i.windStrength:0,i.gustSpeed),r.setFloat("uGustSize",i.gustSize),o.uniform1i(r.uniform("uTrample"),13),o.uniform2f(r.uniform("uMapSize"),this.width,this.height),r.setFloat("uTrampleOn",i.interaction?1:0),r.setFloat("uFar",i.distance),r.setVec3("uRootColor",...i.rootColor),r.setVec3("uTipColor",...i.tipColor),r.setFloat("uColorMix",0);const n=Math.hypot(...e.sunDir)||1;r.setVec3("uSunDir",e.sunDir[0]/n,e.sunDir[1]/n,e.sunDir[2]/n),r.setVec3("uSunColor",...e.sunColor),r.setFloat("uSunIntensity",e.sunIntensity),r.setVec3("uSkyColor",...e.skyColor),r.setVec3("uGroundColor",...e.groundColor),r.setFloat("uAmbient",e.ambient),r.setVec3("uFogColor",...e.fogColor),o.uniform2f(r.uniform("uFogRange"),e.fogRange[0],e.fogRange[1]),r.setFloat("uExposure",e.exposure),r.setFloat("uToneMap",e.toneMap?1:0),o.uniform1i(r.uniform("uShadow0"),1),o.uniform1i(r.uniform("uShadow1"),7),o.uniform1i(r.uniform("uShadow2"),8);const u=new Float32Array(48);e.lightViewProj.slice(0,3).forEach((h,f)=>u.set(h,f*16)),o.uniformMatrix4fv(r.uniform("uLightVP"),!1,u),o.uniform1i(r.uniform("uCascades"),e.lightViewProj.length),r.setFloat("uShadowStrength",e.shadowStrength),o.uniform1i(r.uniform("uAlbedo"),14);let l=0;const c=i.distance*.3;for(let h=0;h<this.kinds.length;h++){const f=this.kinds[h];r.setFloat("uTall",f.tall),r.setFloat("uCutoff",f.kind.cutoff),r.setFloat("uHasTex",f.kind.albedo?1:0),f.kind.albedo&&f.kind.albedo.bind(14);for(const v of this.chunks.values()){const p=v.clumps.find(m=>m.kind===h);if(!p)continue;const x=this.chunkDistance(v.x0,v.z0,e.focus);if(x>i.distance||no(t,v.x0,v.minY,v.z0,Math.min(this.width,v.x0+K),v.maxY,Math.min(this.height,v.z0+K)))continue;const w=Math.max(.12,Math.min(1,1-(x-c)/(i.distance-c)));r.setFloat("uKeep",w),r.setFloat("uCount",p.count),o.bindVertexArray(p.vao),o.drawElementsInstanced(o.TRIANGLES,f.indices,o.UNSIGNED_INT,0,Math.min(p.count,Math.ceil(p.count*Math.min(1,w+.08)))),l++}}return o.bindVertexArray(null),l}dispose(){this.clear(),this.setClumpKinds([]),this.gl.deleteBuffer(this.bladeBuffer),this.gl.deleteTexture(this.trample)}}function no(a,e,t,i,o,r,s){const n=[0,0,0,0,0,0];for(let u=0;u<8;u++){const l=u&1?o:e,c=u&2?r:t,h=u&4?s:i,f=a[0]*l+a[4]*c+a[8]*h+a[12],v=a[1]*l+a[5]*c+a[9]*h+a[13],p=a[2]*l+a[6]*c+a[10]*h+a[14],x=a[3]*l+a[7]*c+a[11]*h+a[15];f<-x&&n[0]++,f>x&&n[1]++,v<-x&&n[2]++,v>x&&n[3]++,p<-x&&n[4]++,p>x&&n[5]++}return n.some(u=>u===8)}class lr{constructor(e){d(this,"enabled",!1);d(this,"ms",new Map);d(this,"ext");d(this,"pool",[]);d(this,"pending",[]);d(this,"current",null);d(this,"frame",0);d(this,"gathered",new Map);this.gl=e,this.ext=e.getExtension("EXT_disjoint_timer_query_webgl2")}get supported(){return!!this.ext}get total(){let e=0;for(const t of this.ms.values())e+=t;return e}startFrame(){this.frame++,this.ext&&this.poll()}begin(e){if(!this.enabled||!this.ext)return;this.end();const t=this.gl,i=this.pool.pop()??t.createQuery();i&&(t.beginQuery(this.ext.TIME_ELAPSED_EXT,i),this.current={q:i,name:e,frame:this.frame})}end(){!this.current||!this.ext||(this.gl.endQuery(this.ext.TIME_ELAPSED_EXT),this.pending.push(this.current),this.current=null)}poll(){const e=this.gl,t=e.getParameter(this.ext.GPU_DISJOINT_EXT);for(;this.pending.length&&e.getQueryParameter(this.pending[0].q,e.QUERY_RESULT_AVAILABLE);){const o=this.pending.shift(),r=e.getQueryParameter(o.q,e.QUERY_RESULT);if(this.pool.push(o.q),t)continue;let s=this.gathered.get(o.frame);s||this.gathered.set(o.frame,s=new Map),s.set(o.name,(s.get(o.name)??0)+r/1e6)}const i=this.pending.length?this.pending[0].frame:this.current?this.current.frame:this.frame;for(const[o,r]of[...this.gathered].sort((s,n)=>s[0]-n[0])){if(o>=i)break;this.gathered.delete(o);for(const[s,n]of r)this.ms.set(s,this.ms.has(s)?this.ms.get(s)*.85+n*.15:n);for(const[s,n]of this.ms){if(r.has(s))continue;const u=n*.85;u<.005?this.ms.delete(s):this.ms.set(s,u)}}}reset(){this.end(),this.ms.clear(),this.gathered.clear()}}const je=20,Gt={none:0,down:1,up:2,"ease-out":3,"ease-in":4,peak:5,"soft-down":6},ur={square:0,disc:1,spark:2,smoke:3},cr=`#version 300 es
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
}`,hr=`#version 300 es
precision highp float;
void main() {}`,lo=`#version 300 es
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
}`,fr=`#version 300 es
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
}`,dr=`#version 300 es
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
}`,xi=[[0,3,0],[1,3,3],[2,4,6],[3,3,10],[4,3,13],[5,4,16]];class mr{constructor(e,t=2e4){d(this,"settings",{enabled:!0,softness:.4,depthAlpha:.55});d(this,"capacity");d(this,"spawned",0);d(this,"buffers");d(this,"updateVaos");d(this,"drawVaos");d(this,"feedback");d(this,"updateProgram");d(this,"drawProgram");d(this,"depthProgram");d(this,"current",0);d(this,"cursor",0);d(this,"staging");d(this,"pending",0);d(this,"cornerBuffer");d(this,"spawnBuffer");d(this,"spawnVao");d(this,"clock",0);d(this,"frameLife",0);d(this,"frameCount",0);d(this,"spans",[]);d(this,"ranges",[]);d(this,"dirty",[]);this.gl=e,this.capacity=t,this.staging=new Float32Array(t*je);const i=e.createBuffer(),o=e.createBuffer(),r=e.createTransformFeedback();if(!i||!o||!r)throw new Error("particle buffers failed");this.buffers=[i,o],this.feedback=r;const s=e.createBuffer(),n=e.createBuffer();if(!s||!n)throw new Error("particle corner buffer failed");this.cornerBuffer=s,this.spawnBuffer=n,e.bindBuffer(e.ARRAY_BUFFER,s),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW);for(const u of this.buffers)e.bindBuffer(e.ARRAY_BUFFER,u),e.bufferData(e.ARRAY_BUFFER,this.staging.byteLength,e.DYNAMIC_COPY);e.bindBuffer(e.ARRAY_BUFFER,null),this.updateProgram=new O(e,cr,hr,["vPos","vVel","vLife","vColor","vColorTo","vParams"]),this.drawProgram=new O(e,lo,fr),this.depthProgram=new O(e,lo,dr),this.updateVaos=[this.layout(i,0),this.layout(o,0)],this.drawVaos=[this.layout(i,1),this.layout(o,1)],this.spawnVao=this.layout(n,0)}layout(e,t){const i=this.gl,o=i.createVertexArray();if(!o)throw new Error("particle vao failed");i.bindVertexArray(o),i.bindBuffer(i.ARRAY_BUFFER,e);const r=je*4;for(const[s,n,u]of xi)i.enableVertexAttribArray(s),i.vertexAttribPointer(s,n,i.FLOAT,!1,r,u*4),i.vertexAttribDivisor(s,t);return t===1&&(i.bindBuffer(i.ARRAY_BUFFER,this.cornerBuffer),i.enableVertexAttribArray(6),i.vertexAttribPointer(6,2,i.FLOAT,!1,0,0),i.vertexAttribDivisor(6,0)),i.bindVertexArray(null),i.bindBuffer(i.ARRAY_BUFFER,null),o}emit(e,t,i,o){this.frameLife=Math.max(this.frameLife,o.life*1.2+.05),this.frameCount+=o.count;const r=Gt[o.fadeCurve??"none"]+Gt[o.sizeCurve??"soft-down"]*8+Gt[o.speedCurve??"none"]*64+Gt[o.colorCurve??(o.colorTo?"up":"none")]*512,s=ur[o.shape??"square"]*4096+Math.min(4095,Math.max(0,o.stretch??0));for(let n=0;n<o.count;n++){const u=this.cursor;this.cursor=(this.cursor+1)%this.capacity;const l=u*je,c=this.staging,h=Math.random()*Math.PI*2,f=(Math.random()-.5)*Math.PI,v=o.vary,p=o.speed*(v===void 0?.4+Math.random()*.8:1-v+Math.random()*2*v);let x,w,m;if(o.dir){const b=(o.cone??.3)*p;x=o.dir[0]*p+(Math.random()-.5)*2*b,w=o.dir[1]*p+(Math.random()-.5)*2*b,m=o.dir[2]*p+(Math.random()-.5)*2*b}else x=Math.cos(h)*Math.cos(f)*p,w=Math.sin(f)*p,m=Math.sin(h)*Math.cos(f)*p;w+=o.up??0;const g=o.life*(v===void 0?.6+Math.random()*.6:1-v+Math.random()*2*v);c[l]=e,c[l+1]=t,c[l+2]=i,c[l+3]=x,c[l+4]=w,c[l+5]=m,c[l+6]=g,c[l+7]=g,c[l+8]=o.size,c[l+9]=o.alpha??1,c[l+10]=o.color[0],c[l+11]=o.color[1],c[l+12]=o.color[2],c[l+13]=(o.colorTo??o.color)[0],c[l+14]=(o.colorTo??o.color)[1],c[l+15]=(o.colorTo??o.color)[2],c[l+16]=r,c[l+17]=o.gravity??0,c[l+18]=o.drag??0,c[l+19]=s,this.dirty.push(u)}this.pending+=o.count}update(e){const t=this.gl;this.buffers[this.current];const i=this.buffers[1-this.current],o=je*4,r=[];if(this.dirty.length){const l=this.dirty;for(let c=0;c<l.length;){let h=c+1;for(;h<l.length&&l[h]===l[h-1]+1;)h++;r.push([l[c],h-c]),c=h}this.spawned=this.dirty.length,this.dirty.length=0}else this.spawned=0;this.pending=0;const s=Math.min(e,.1);for(this.clock+=s,this.frameCount&&(this.spans.push({end:this.cursor,dies:this.clock+this.frameLife,count:this.frameCount}),this.frameCount=0,this.frameLife=0);this.spans.length&&this.spans[0].dies<=this.clock;)this.spans.shift();let n=0;for(const l of this.spans)n+=l.count;if(n=Math.min(n,this.capacity),this.ranges.length=0,!n)return;const u=(this.cursor-n+this.capacity)%this.capacity;u+n<=this.capacity?this.ranges.push([u,n]):this.ranges.push([u,this.capacity-u],[0,n-(this.capacity-u)]),this.updateProgram.use(),this.updateProgram.setFloat("uDt",s),t.enable(t.RASTERIZER_DISCARD),t.bindVertexArray(this.updateVaos[this.current]),t.bindTransformFeedback(t.TRANSFORM_FEEDBACK,this.feedback);for(const[l,c]of this.ranges)t.bindBufferRange(t.TRANSFORM_FEEDBACK_BUFFER,0,i,l*o,c*o),t.beginTransformFeedback(t.POINTS),t.drawArrays(t.POINTS,l,c),t.endTransformFeedback();if(r.length){this.updateProgram.setFloat("uDt",0),t.bindVertexArray(this.spawnVao);for(const[l,c]of r)t.bindBuffer(t.ARRAY_BUFFER,this.spawnBuffer),t.bufferData(t.ARRAY_BUFFER,this.staging.subarray(l*je,(l+c)*je),t.STREAM_DRAW),t.bindBuffer(t.ARRAY_BUFFER,null),t.bindBufferRange(t.TRANSFORM_FEEDBACK_BUFFER,0,i,l*o,c*o),t.beginTransformFeedback(t.POINTS),t.drawArrays(t.POINTS,0,c),t.endTransformFeedback()}t.bindBufferBase(t.TRANSFORM_FEEDBACK_BUFFER,0,null),t.bindTransformFeedback(t.TRANSFORM_FEEDBACK,null),t.bindVertexArray(null),t.disable(t.RASTERIZER_DISCARD),this.current=1-this.current}get live(){let e=0;for(const t of this.ranges)e+=t[1];return e}draw(e){if(!this.settings.enabled||!this.ranges.length)return;const t=this.gl,i=this.drawProgram;i.use(),i.setMat4("uProjection",e.projection),i.setMat4("uView",e.view),i.setVec3("uRight",...e.right),i.setVec3("uUp",...e.up),e.depth&&(t.activeTexture(t.TEXTURE0+10),t.bindTexture(t.TEXTURE_2D,e.depth)),t.uniform1i(i.uniform("uDepth"),10),i.setFloat("uHasDepth",e.depth&&this.settings.softness>0?1:0),t.uniform2f(i.uniform("uResolution"),e.width,e.height),i.setMat4("uInvProjection",e.invProjection),i.setFloat("uSoftness",Math.max(.01,this.settings.softness)),i.setFloat("uExposure",e.exposure),i.setFloat("uToneMap",e.toneMap?1:0),t.enable(t.BLEND),t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ZERO,t.ONE),t.depthMask(!1),t.disable(t.CULL_FACE),t.bindVertexArray(this.drawVaos[this.current]),t.bindBuffer(t.ARRAY_BUFFER,this.buffers[this.current]);const o=je*4;for(const[r,s]of this.ranges){for(const[n,u,l]of xi)t.vertexAttribPointer(n,u,t.FLOAT,!1,o,(r*je+l)*4);t.drawArraysInstanced(t.TRIANGLE_STRIP,0,4,s)}if(t.disable(t.BLEND),this.settings.depthAlpha>0){const r=this.depthProgram;r.use(),r.setMat4("uProjection",e.projection),r.setMat4("uView",e.view),r.setVec3("uRight",...e.right),r.setVec3("uUp",...e.up),r.setFloat("uDepthAlpha",this.settings.depthAlpha),t.colorMask(!1,!1,!1,!1),t.depthMask(!0);for(const[s,n]of this.ranges){for(const[u,l,c]of xi)t.vertexAttribPointer(u,l,t.FLOAT,!1,o,(s*je+c)*4);t.drawArraysInstanced(t.TRIANGLE_STRIP,0,4,n)}t.colorMask(!0,!0,!0,!0)}t.bindBuffer(t.ARRAY_BUFFER,null),t.bindVertexArray(null),t.enable(t.CULL_FACE),t.depthMask(!0)}}const ft=11,vr=`#version 300 es
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
}`,pr=`#version 300 es
precision highp float;
in vec2 vUV;
in vec4 vColor;
uniform sampler2D uAtlas;
out vec4 outColor;
void main() {
  vec4 t = texture(uAtlas, vUV);
  outColor = vec4(t.rgb * vColor.rgb, t.a * vColor.a);
}`;class gr{constructor(e){d(this,"enabled",!0);d(this,"list",[]);d(this,"program");d(this,"vao");d(this,"cornerBuffer");d(this,"instanceBuffer");d(this,"data",new Float32Array(ft*256));d(this,"atlas",null);d(this,"grid",[1,1]);this.gl=e,this.program=new O(e,vr,pr);const t=e.createBuffer(),i=e.createBuffer(),o=e.createVertexArray();if(!t||!i||!o)throw new Error("icon buffers failed");this.cornerBuffer=t,this.instanceBuffer=i,this.vao=o,e.bindVertexArray(o),e.bindBuffer(e.ARRAY_BUFFER,t),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.bindBuffer(e.ARRAY_BUFFER,i);const r=ft*4,s=[[1,3,0],[2,1,3],[3,3,4],[4,1,7],[5,1,8],[6,2,9]];for(const[n,u,l]of s)e.enableVertexAttribArray(n),e.vertexAttribPointer(n,u,e.FLOAT,!1,r,l*4),e.vertexAttribDivisor(n,1);e.bindVertexArray(null),e.bindBuffer(e.ARRAY_BUFFER,null)}setAtlas(e,t,i){const o=this.gl;this.atlas||(this.atlas=o.createTexture()),o.bindTexture(o.TEXTURE_2D,this.atlas),o.pixelStorei(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),o.texImage2D(o.TEXTURE_2D,0,o.RGBA8,o.RGBA,o.UNSIGNED_BYTE,e),o.generateMipmap(o.TEXTURE_2D),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MIN_FILTER,o.LINEAR_MIPMAP_LINEAR),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MAG_FILTER,o.LINEAR),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_S,o.CLAMP_TO_EDGE),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_T,o.CLAMP_TO_EDGE),o.bindTexture(o.TEXTURE_2D,null),this.grid=[Math.max(1,t),Math.max(1,i)]}get ready(){return!!this.atlas}clear(){this.list.length=0}add(e){this.list.push(e)}get count(){return this.list.length}pack(){const e=this.list.length;this.data.length<e*ft&&(this.data=new Float32Array(Math.max(e,this.data.length/ft*2)*ft));const t=this.data;for(let i=0;i<e;i++){const o=this.list[i],r=i*ft;t[r]=o.x,t[r+1]=o.y,t[r+2]=o.z,t[r+3]=o.glyph,t[r+4]=o.r,t[r+5]=o.g,t[r+6]=o.b,t[r+7]=o.size,t[r+8]=o.alpha,t[r+9]=o.dx??0,t[r+10]=o.dy??0}return e}draw(e,t,i){if(!this.enabled||!this.atlas||!this.list.length)return 0;const o=this.gl,r=this.pack();o.bindBuffer(o.ARRAY_BUFFER,this.instanceBuffer),o.bufferData(o.ARRAY_BUFFER,this.data.subarray(0,r*ft),o.STREAM_DRAW),o.bindBuffer(o.ARRAY_BUFFER,null);const s=this.program;return s.use(),s.setMat4("uViewProj",e),o.uniform2f(s.uniform("uViewport"),t,i),o.uniform2f(s.uniform("uGrid"),this.grid[0],this.grid[1]),o.activeTexture(o.TEXTURE0),o.bindTexture(o.TEXTURE_2D,this.atlas),o.uniform1i(s.uniform("uAtlas"),0),o.enable(o.BLEND),o.blendFuncSeparate(o.SRC_ALPHA,o.ONE_MINUS_SRC_ALPHA,o.ZERO,o.ONE),o.disable(o.DEPTH_TEST),o.depthMask(!1),o.disable(o.CULL_FACE),o.bindVertexArray(this.vao),o.drawArraysInstanced(o.TRIANGLE_STRIP,0,4,r),o.bindVertexArray(null),o.enable(o.CULL_FACE),o.depthMask(!0),o.enable(o.DEPTH_TEST),o.disable(o.BLEND),1}dispose(){const e=this.gl;e.deleteBuffer(this.cornerBuffer),e.deleteBuffer(this.instanceBuffer),e.deleteVertexArray(this.vao),this.atlas&&e.deleteTexture(this.atlas),this.atlas=null}}function xt(a,e,t,i){return`${t} Generate${a}Noise(${e} coordinate, float frequency, int octaveCount, float persistence, float lacunarity) {
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
}`}function uo(a){return`vec2 Generate${a}CurlNoise(vec2 coordinate, float frequency, int octaveCount, float persistence, float lacunarity) {
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
}`}function co(a){return`vec3 Generate${a}CurlNoise(vec3 coordinate, float frequency, int octaveCount, float persistence, float lacunarity) {
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
}`}const wi=`
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
${xt("Value","float","vec2","GenerateValueNoise1D")}
${xt("Value","vec2","vec3","GenerateValueNoise2D")}
${xt("Value","vec3","vec4","GenerateValueNoise3D")}
${xt("Perlin","float","vec2","GeneratePerlinNoise1D")}
${xt("Perlin","vec2","vec3","GeneratePerlinNoise2D")}
${xt("Perlin","vec3","vec4","GeneratePerlinNoise3D")}
${uo("Value")}
${uo("Perlin")}
${co("Value")}
${co("Perlin")}
`,ut=128;function qo(a,e,t,i){let o;i?(o=i,o.length=a.length,o.fill(void 0)):o=new Array(a.length);const r=l=>(o[l]===void 0&&(o[l]=u(l)),o[l]),s=l=>r(l.args[0]),n=l=>r(l.args[1]);function u(l){var h;const c=a[l];switch(c.op){case"Value":return(h=e.overrides)!=null&&h.has(l)?e.overrides.get(l):c.value;case"Combine2f":case"Combine3f":case"Combine4f":return c.args.map(r);case"ExtractComponent":return s(c)[c.component];case"DeltaTime":return e.deltaTime;case"TotalTime":return e.time;case"SystemSeed":return e.seed>>>0;case"FrameIndex":return e.frame;case"LocalToWorld":case"WorldToLocal":return xr;case"Sin":return le(s(c),Math.sin);case"Cos":return le(s(c),Math.cos);case"Tan":return le(s(c),Math.tan);case"ASin":return le(s(c),Math.asin);case"ACos":return le(s(c),Math.acos);case"ATan":return le(s(c),Math.atan);case"Abs":return le(s(c),Math.abs);case"Sign":return le(s(c),Math.sign);case"Saturate":return le(s(c),f=>Math.min(1,Math.max(0,f)));case"Ceil":return le(s(c),Math.ceil);case"Round":return le(s(c),Math.round);case"Frac":return le(s(c),f=>f-Math.floor(f));case"Floor":return le(s(c),Math.floor);case"Log2":return le(s(c),Math.log2);case"Mul":return Me(s(c),n(c),(f,v)=>f*v);case"Divide":return Me(s(c),n(c),(f,v)=>f/v);case"Add":return Me(s(c),n(c),(f,v)=>f+v);case"Subtract":return Me(s(c),n(c),(f,v)=>f-v);case"Min":return Me(s(c),n(c),Math.min);case"Max":return Me(s(c),n(c),Math.max);case"Pow":return Me(s(c),n(c),Math.pow);case"ATan2":return Me(s(c),n(c),Math.atan2);case"BitwiseLeftShift":return Me(s(c),n(c),(f,v)=>f<<v>>>0);case"BitwiseRightShift":return Me(s(c),n(c),(f,v)=>f>>>v);case"BitwiseOr":return Me(s(c),n(c),(f,v)=>(f|v)>>>0);case"BitwiseAnd":return Me(s(c),n(c),(f,v)=>(f&v)>>>0);case"BitwiseXor":return Me(s(c),n(c),(f,v)=>(f^v)>>>0);case"BitwiseComplement":return le(s(c),f=>~f>>>0);case"CastUintToFloat":case"CastIntToFloat":return s(c);case"CastFloatToUint":return le(s(c),f=>Math.max(0,Math.trunc(f))>>>0);case"CastIntToUint":return le(s(c),f=>f>>>0);case"CastFloatToInt":return le(s(c),Math.trunc);case"CastUintToInt":return le(s(c),f=>f|0);case"TransposeMatrix":return wr(s(c));case"InverseMatrix":case"InverseTRSMatrix":return br(s(c));case"TRSToMatrix":return Tr(r(c.args[0]),r(c.args[1]),r(c.args[2]));case"TransformPos":return ho(s(c),n(c),1);case"TransformVec":case"TransformDir":{const f=ho(s(c),n(c),0);return c.op==="TransformDir"?yr(f):f}case"BakeCurve":return t("curve",s(c));case"BakeGradient":return t("gradient",s(c));case"RGBtoHSV":return Er(s(c));case"HSVtoRGB":return Ar(s(c));default:throw new Error(`expression op ${c.op} is not supported by the runtime`)}}for(let l=0;l<a.length;l++)r(l);return o}const le=(a,e)=>Array.isArray(a)?a.map(e):e(a),Me=(a,e,t)=>{if(Array.isArray(a)||Array.isArray(e)){const i=Array.isArray(a)?a.length:e.length;return Array.from({length:i},(o,r)=>t(Array.isArray(a)?a[r]:a,Array.isArray(e)?e[r]:e))}return t(a,e)},xr=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],wr=a=>[0,4,8,12,1,5,9,13,2,6,10,14,3,7,11,15].map(e=>a[e]),ho=(a,e,t)=>[0,1,2].map(i=>a[i*4]*e[0]+a[i*4+1]*e[1]+a[i*4+2]*e[2]+a[i*4+3]*t),yr=a=>{const e=Math.hypot(...a)||1;return a.map(t=>t/e)};function br(a){const e=new Array(16);e[0]=a[5]*a[10]*a[15]-a[5]*a[11]*a[14]-a[9]*a[6]*a[15]+a[9]*a[7]*a[14]+a[13]*a[6]*a[11]-a[13]*a[7]*a[10],e[4]=-a[4]*a[10]*a[15]+a[4]*a[11]*a[14]+a[8]*a[6]*a[15]-a[8]*a[7]*a[14]-a[12]*a[6]*a[11]+a[12]*a[7]*a[10],e[8]=a[4]*a[9]*a[15]-a[4]*a[11]*a[13]-a[8]*a[5]*a[15]+a[8]*a[7]*a[13]+a[12]*a[5]*a[11]-a[12]*a[7]*a[9],e[12]=-a[4]*a[9]*a[14]+a[4]*a[10]*a[13]+a[8]*a[5]*a[14]-a[8]*a[6]*a[13]-a[12]*a[5]*a[10]+a[12]*a[6]*a[9],e[1]=-a[1]*a[10]*a[15]+a[1]*a[11]*a[14]+a[9]*a[2]*a[15]-a[9]*a[3]*a[14]-a[13]*a[2]*a[11]+a[13]*a[3]*a[10],e[5]=a[0]*a[10]*a[15]-a[0]*a[11]*a[14]-a[8]*a[2]*a[15]+a[8]*a[3]*a[14]+a[12]*a[2]*a[11]-a[12]*a[3]*a[10],e[9]=-a[0]*a[9]*a[15]+a[0]*a[11]*a[13]+a[8]*a[1]*a[15]-a[8]*a[3]*a[13]-a[12]*a[1]*a[11]+a[12]*a[3]*a[9],e[13]=a[0]*a[9]*a[14]-a[0]*a[10]*a[13]-a[8]*a[1]*a[14]+a[8]*a[2]*a[13]+a[12]*a[1]*a[10]-a[12]*a[2]*a[9],e[2]=a[1]*a[6]*a[15]-a[1]*a[7]*a[14]-a[5]*a[2]*a[15]+a[5]*a[3]*a[14]+a[13]*a[2]*a[7]-a[13]*a[3]*a[6],e[6]=-a[0]*a[6]*a[15]+a[0]*a[7]*a[14]+a[4]*a[2]*a[15]-a[4]*a[3]*a[14]-a[12]*a[2]*a[7]+a[12]*a[3]*a[6],e[10]=a[0]*a[5]*a[15]-a[0]*a[7]*a[13]-a[4]*a[1]*a[15]+a[4]*a[3]*a[13]+a[12]*a[1]*a[7]-a[12]*a[3]*a[5],e[14]=-a[0]*a[5]*a[14]+a[0]*a[6]*a[13]+a[4]*a[1]*a[14]-a[4]*a[2]*a[13]-a[12]*a[1]*a[6]+a[12]*a[2]*a[5],e[3]=-a[1]*a[6]*a[11]+a[1]*a[7]*a[10]+a[5]*a[2]*a[11]-a[5]*a[3]*a[10]-a[9]*a[2]*a[7]+a[9]*a[3]*a[6],e[7]=a[0]*a[6]*a[11]-a[0]*a[7]*a[10]-a[4]*a[2]*a[11]+a[4]*a[3]*a[10]+a[8]*a[2]*a[7]-a[8]*a[3]*a[6],e[11]=-a[0]*a[5]*a[11]+a[0]*a[7]*a[9]+a[4]*a[1]*a[11]-a[4]*a[3]*a[9]-a[8]*a[1]*a[7]+a[8]*a[3]*a[5],e[15]=a[0]*a[5]*a[10]-a[0]*a[6]*a[9]-a[4]*a[1]*a[10]+a[4]*a[2]*a[9]+a[8]*a[1]*a[6]-a[8]*a[2]*a[5];const t=a[0]*e[0]+a[1]*e[4]+a[2]*e[8]+a[3]*e[12];return e.map(i=>i/(t||1))}function Tr(a,e,t){const[i,o,r]=e.map(v=>v*Math.PI/180),[s,n,u,l,c,h]=[Math.cos(i),Math.sin(i),Math.cos(o),Math.sin(o),Math.cos(r),Math.sin(r)],f=[u*c+n*l*h,c*n*l-u*h,s*l,s*h,s*c,-n,-c*l+u*n*h,u*c*n+l*h,s*u];return[f[0]*t[0],f[1]*t[1],f[2]*t[2],a[0],f[3]*t[0],f[4]*t[1],f[5]*t[2],a[1],f[6]*t[0],f[7]*t[1],f[8]*t[2],a[2],0,0,0,1]}function Er([a,e,t]){const i=Math.max(a,e,t),o=i-Math.min(a,e,t);let r=0;return o&&(r=i===a?(e-t)/o%6:i===e?(t-a)/o+2:(a-e)/o+4),[(r/6+1)%1,i?o/i:0,i]}function Ar([a,e,t]){const i=o=>{const r=(o+a*6)%6;return t-t*e*Math.max(0,Math.min(r,4-r,1))};return[i(5),i(3),i(1)]}function Rr(a){const e=new Float32Array(ut*4);for(let t=0;t<ut;t++){const i=t/(ut-1),o=fo(a.colors,i,a.mode,s=>s.color),r=fo(a.alphas,i,a.mode,s=>[s.alpha]);e.set([o[0],o[1],o[2],r[0]],t*4)}return e}function fo(a,e,t,i){if(!a.length)return[1,1,1];const o=[...a].sort((r,s)=>r.time-s.time);if(e<=o[0].time)return i(o[0]);for(let r=1;r<o.length;r++)if(e<=o[r].time){if(t==="fixed")return i(o[r]);const s=o[r-1],n=o[r],u=(e-s.time)/Math.max(1e-6,n.time-s.time);return i(s).map((l,c)=>l+(i(n)[c]-l)*u)}return i(o[o.length-1])}function Fr(a){var r;const e=[...a.keys].sort((s,n)=>s.time-n.time),t=((r=e[0])==null?void 0:r.time)??0,i=e.length>1?e[e.length-1].time:t+1,o=new Float32Array(ut*4);for(let s=0;s<ut;s++){const n=Ko(e,t+(i-t)*s/(ut-1));o.set([n,n,n,n],s*4)}return{data:o,start:t,end:i}}function Ko(a,e){if(!a.length)return 0;if(e<=a[0].time)return a[0].value;if(e>=a[a.length-1].time)return a[a.length-1].value;let t=1;for(;a[t].time<e;)t++;const i=a[t-1],o=a[t],r=o.time-i.time;if(!Number.isFinite(i.outSlope)||!Number.isFinite(o.inSlope))return i.value;const s=(e-i.time)/r,n=s*s,u=n*s;return(2*u-3*n+1)*i.value+(u-2*n+s)*i.outSlope*r+(-2*u+3*n)*o.value+(u-n)*o.inSlope*r}const Mr={4:["uv",2],5:["uvNext",2],6:["vec2(0.0)",2],7:["vec2(0.0)",2],8:["frameBlend",1],9:["attributes.frame",1],10:["attributes.position",3],11:["float(gl_VertexID)",1],12:["size.x",1],13:["size.xy",2],14:["size",3],15:["attributes.angle.z",1],16:["attributes.angle",3],17:["0.0",1],18:["vec3(0.0)",3],19:["attributes.velocity",3],20:["length(attributes.velocity)",1],21:["life01",1],22:["1.0 / attributes.lifetime",1],23:["stable.x",1],24:["stable.xy",2],25:["stable.xyz",3],26:["stable",4],27:["stable.x",1],28:["stable.xy",2],29:["stable.xyz",3],30:["stable",4],31:["attributes.custom1.x",1],32:["attributes.custom1.xy",2],33:["attributes.custom1.xyz",3],34:["attributes.custom1",4],35:["attributes.custom2.x",1],36:["attributes.custom2.xy",2],37:["attributes.custom2.xyz",3],38:["attributes.custom2",4],39:["0.0",1],40:["vec2(0.0)",2],41:["vec3(0.0)",3],42:["0.0",1],43:["vec2(0.0)",2],44:["vec3(0.0)",3],45:["0.0",1]},Zo=`
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
}`;function _r(a,e){let t=Math.max(0,e-(a.delay||0))/a.time;if(t=a.loop?t-Math.floor(t):Math.min(t,1),a.type==="float")return Mt(a.curve,t)*(a.intensity??1);const i=a.gradient;let o=1;for(;o<i.length-1&&i[o][0]<t;)o++;const r=i[o-1],s=i[o],n=s[0]>r[0]?Math.min(1,Math.max(0,(t-r[0])/(s[0]-r[0]))):0;return[1,2,3,4].map(u=>r[u]+(s[u]-r[u])*n)}function Sr(a,e){const t=e*a.speed;if(t/a.timeLimit>1)return null;const i=Mt(a.curve,t/a.timeLimit)*a.frames+a.offsetFrames+1.1;return Math.ceil(-i)/(a.frames+1)+1/(a.frames+1)}function Cr(a){return a?new Float32Array([a[0],a[3],a[6],a[1],a[4],a[7],a[2],a[5],a[8]]):new Float32Array([1,0,0,0,1,0,0,0,1])}function Mt(a,e,t=Math.random){if(!a)return 0;switch(a.mode){case"random":return a.min+(a.max-a.min)*t();case"curve":return a.scalar*ei(a.curve,e);case"curves":{const i=ei(a.min,e);return a.scalar*(i+(ei(a.max,e)-i)*t())}default:return a.value??0}}function Dr(a,e){return a.curve?a.intensity*a.curve.intensity*ei(a.curve.curve,e/a.curve.time):a.intensity}const ei=(a,e)=>Ko((a==null?void 0:a.keys)??[],e);function Ni(a){if(!a)return 0;let e=0;for(let t=0;t<=32;t++)e=Math.max(e,Mt(a,t/32,()=>1));return e}const Pr=3;function kr(a,e,t){const i=Number(e);if(!(i>0)||!Number.isFinite(i))return t;const o=Math.max(.001,a.duration),r=a.looping?Math.ceil(i/o)+1:1;let s=Ni(a.rate)*i;for(const n of a.bursts){const u=n.cycles>0?n.cycles:1/0,l=Math.min(u,n.interval>0?Math.floor(i/n.interval)+1:1,1e3);s+=Math.max(0,Ni(n.count))*l*r}return Math.min(t,Math.max(8,Math.ceil(s*Pr)))}function Ur(a,e){if(a.looping)return!1;if(e.done)return!0;const t=e.time-e.delay;if(t>=a.duration)return!0;if(Ni(a.rate)>0)return!1;for(const i of a.bursts){const o=i.cycles>0?Math.min(i.cycles,1e3):1e3;if(t<Math.min(i.time+(o-1)*i.interval,a.duration))return!1}return!0}function mo(a){return{time:0,delay:Mt(a.startDelay,0),acc:0,done:!1}}function zr(a,e,t,i){const o=Math.max(.001,a.duration),r=e.time-e.delay;e.time+=t*(a.simulationSpeed||1);const s=e.time-e.delay;if(s<0||e.done)return{count:0,emitterTime:0};if(!a.looping&&r>=o)return e.done=!0,{count:0,emitterTime:1};const n=a.looping?s%o/o:Math.min(1,s/o);let u=0;const l=a.looping?s:Math.min(s,o),c=Math.max(0,r);e.acc+=Math.max(0,Mt(a.rate,n))*Math.max(0,l-c)*i,u+=Math.floor(e.acc),e.acc-=Math.floor(e.acc);for(const h of a.bursts){const f=h.cycles>0?h.cycles:1/0,v=Math.floor(c/o),p=a.looping?Math.floor(l/o):0;for(let x=v;x<=p;x++)for(let w=0;w<Math.min(f,1e3);w++){const m=x*o+h.time+w*h.interval;if(h.time+w*h.interval>o&&a.looping||m>l)break;m>=c&&(m>c||c===0&&r<=0)&&Math.random()<=h.probability&&(u+=Math.round(Mt(h.count,n)*i))}}return{count:u,emitterTime:n}}function Lr(a,e){const{header:t,lib:i,attributeDecl:o,uniformDecls:r,loadAttributes:s,zeroInit:n}=e,u=a.output,l=u.material,c=u.mode,h=c==="mesh"||c==="vat",f=u.flipbook,v=Or(u.streams||[0,1,3,4]),p=!!u.interpolateFrames||(u.streams||[]).includes(5);return{vs:`${t}
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
${Array.from({length:a.slots},(x,w)=>`layout(location = ${w}) in uvec4 a_s${w};`).join(`
`)}
${h?`layout(location = ${a.slots}) in vec3 aMeshPos;
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
${h?"":`  // Keep billboards within Unity's max particle size (a fraction of the screen).
  float maxSize = ${be(u.maxParticleSize??.5)} * 2.0 * length(vfxViewPosition - attributes.position) * uProjScale;
  size.xy = min(size.xy, vec2(maxSize));`}
  vec2 corner = vec2(float(gl_VertexID & 1), float((gl_VertexID & 2) >> 1));
  vec3 p;
  vec3 n = toCam;
  vec2 uv = corner;
${Nr(c,u)}
  // Flipbook: frame 0 is the top-left tile, rows go down.
${f?`  float frames = ${be(f.tilesX*f.tilesY)};
  float f0 = mod(floor(attributes.frame), frames);
  float f1 = mod(f0 + 1.0, frames);
  float frameBlend = fract(attributes.frame);
  vec2 tiles = vec2(${be(f.tilesX)}, ${be(f.tilesY)});
  vec2 uvNext = (uv + vec2(mod(f1, tiles.x), tiles.y - 1.0 - floor(f1 / tiles.x))) / tiles;
  uv = (uv + vec2(mod(f0, tiles.x), tiles.y - 1.0 - floor(f0 / tiles.x))) / tiles;`:`  vec2 uvNext = uv;
  float frameBlend = 0.0;`}
  vec3 color = attributes.color;
${u.applyColorSpace?"  color = pow(max(color, vec3(0.0)), vec3(2.2)); // Unity converts particle colours to linear":""}
  vColor = vec4(color, attributes.alpha);
${c==="beam"?`  vColor *= mix(vec4(${u.beam.colors[0].map(be).join(", ")}), vec4(${u.beam.colors[1].map(be).join(", ")}), corner.x); // the line's gradient`:""}
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
}`,fs:Jo(t,l)}}function Jo(a,e){return`${a}
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
${Zo}
out vec4 fragColor;
${(e==null?void 0:e.code)||"vec4 shadeFragment() { return vColor; }"}
void main() {
  vec4 c = shadeFragment();
  c.rgb = uRecolor * c.rgb;
  fragColor = vec4(fxTone(max(c.rgb, vec3(0.0))), clamp(c.a * uFxTint.a, 0.0, 1.0));
}`}const rt=2048,Vr=a=>2*(a.points+2);function Ir(a,e){var p,x;const{header:t,lib:i,attributeDecl:o,uniformDecls:r,loadAttributes:s,zeroInit:n}=e,u=a.output,l=u.trail,c=l.points,h=(w,m)=>{const g=a.layout.find(_=>_.name===w&&!_.counter),b=Array.from({length:{float:1,vec3:3,uint:1,bool:1}[m]},(_,E)=>{const R=g.offset+E;return`historySlot(k, ${R>>2}).${"xyzw"[R&3]}`});if(m==="bool")return`(${b[0]} != 0u)`;if(m==="uint")return b[0];const F=b.map(_=>`uintBitsToFloat(${_})`);return F.length===1?F[0]:`${m}(${F.join(", ")})`},f={stretch:"cum / max(total, 1e-6)",tile:"cum",distribute:"float(p) / max(float(tailAt), 1.0)",repeat:"float(p)"}[l.textureMode]||"cum / max(total, 1e-6)",v=(((x=(p=l.material)==null?void 0:p.blend)==null?void 0:x.src)??"SRC_ALPHA")==="SRC_ALPHA";return{vs:`${t}
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
${Array.from({length:a.slots},(w,m)=>`layout(location = ${m}) in uvec4 a_s${m};`).join(`
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
  return texelFetch(uTrailHistory, ivec3(texel % ${rt}, texel / ${rt}, layer), 0);
}
// Sample k was this particle (alive) when it was recorded.
bool sameParticle(int k, uint id) {
  return k < uTrailCount && ${h("alive","bool")} && ${h("particleId","uint")} == id;
}
vec3 samplePosition(int k) { return ${h("position","vec3")}; }

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
  float u = ${f};
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
}`,fs:Jo(t,l.material)}}const Br=`  vec3 vz = length(attributes.velocity) > 1e-6 ? normalize(attributes.velocity) : (vec4(0.0, 0.0, 1.0, 0.0) * uSystemRotation).xyz;
  vec3 vx = cross(vec3(0.0, 1.0, 0.0), vz);
  vx = length(vx) > 1e-6 ? normalize(vx) : vec3(1.0, 0.0, 0.0);
  vec3 vy = cross(vz, vx);
  lp = vx * lp.x + vy * lp.y + vz * lp.z;
  ln = vx * ln.x + vy * ln.y + vz * ln.z;`;function Nr(a,e){const t=`vec3(${(e.pivot||[0,0,0]).map(be).join(", ")})`;switch(a){case"beam":{const[i,o]=e.beam.widths;return`  vec3 mid = mix(uBeamStart, uBeamEnd, corner.x);
  vec3 side = cross(uBeamEnd - uBeamStart, vfxViewPosition - mid);
  side = length(side) > 1e-6 ? normalize(side) : camRight;
  p = mid + side * (corner.y - 0.5) * mix(${be(i)}, ${be(o)}, corner.x);`}case"vat":{const i=e.vat;return`  vec2 vuv = vec2(aMeshUV.x, fract(uVatTime + aMeshUV.y));
  vec3 hi = texture(uVatPosHi, vuv).rgb;
  vec3 lo = texture(uVatPosLo, vuv).rgb;
  vec3 tp = (floor(hi * 255.0 + 0.5) * 256.0 + floor(lo * 255.0 + 0.5)) / 65535.0;
  tp = tp * ${be(i.max-i.min)} + ${be(i.min)};
  tp.x = -tp.x;
  vec3 lp = tp.xzy + vec3(${i.heightOffset.map(be).join(", ")});
  vec3 ln = (texture(uVatNormal, vuv).rgb * 2.0 - 1.0).xzy;
  ln.x = -ln.x;
  lp = (vec4(lp, 0.0) * uSystemRotation).xyz;
  ln = (vec4(ln, 0.0) * uSystemRotation).xyz;
  p = attributes.position + lp;
  n = normalize(ln);
  uv = aMeshUV;`}case"mesh":return`  vec3 lp = eulerZXY(attributes.angle, aMeshPos * size + ${t} * size);
  vec3 ln = eulerZXY(attributes.angle, aMeshNormal);
${e.alignment==="velocity"?Br:e.alignment==="view"?`  lp = camRight * lp.x + camUp * lp.y + toCam * -lp.z;
  ln = camRight * ln.x + camUp * ln.y + toCam * -ln.z;`:e.alignment==="world"?"":`  lp = (vec4(lp, 0.0) * uSystemRotation).xyz;
  ln = (vec4(ln, 0.0) * uSystemRotation).xyz;`}
  p = attributes.position + lp;
  n = ln;
  uv = aMeshUV;`;case"stretched":return`  vec3 vel = attributes.velocity;
  float speed = length(vel);
  vec3 dir = speed > 1e-5 ? vel / speed : camUp;
  vec3 side = normalize(cross(dir, toCam) + 1e-6);
  // Width from the X size, length from the Y size (they differ only with 3D start size: FXVille's spurts).
  float len = size.y * ${be(e.lengthScale??2)} + speed * ${be(e.velocityScale??0)};
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
  p = attributes.position + camRight * q.x + camUp * q.y;`}}function Or(a){const e=[];let t=0;for(const i of a){const o=Mr[i];if(!o)continue;const[r,s]=o;for(let n=0;n<s&&t<16;n++,t++){const u=s===1?`(${r})`:`(${r}).${"xyzw"[n]}`;e.push(`  tex[${t}] = ${u};`)}}return e}const be=a=>{const e=Number(a)||0;return Number.isInteger(e)?`${e}.0`:String(e)},st=2048,yi=14,vo=15,si=2,bi=8,$r=2;function Xr(a){return a==="mat4"?4:a==="mat3"?3:/^(float|vec[234]|uint|int|bool)$/.test(a)?1:0}function po(a,e=si){const t=[],i={};let o=0;for(const r of a){if(r.name in i)continue;const s=Xr(r.type);if(!s)throw new Error(`effect uniform ${r.name}: type ${r.type} can't go in an instance row`);t.push({name:r.name,type:r.type,texel:o}),i[r.name]=o,o+=s}return{fields:t,width:o+e,at:i}}function Oi(a,e){const t=o=>`texelFetch(${e}, ivec2(${o}, inst), 0)`,i=a.texel;switch(a.type){case"float":return`uintBitsToFloat(${t(i)}.x)`;case"vec2":return`uintBitsToFloat(${t(i)}.xy)`;case"vec3":return`uintBitsToFloat(${t(i)}.xyz)`;case"vec4":return`uintBitsToFloat(${t(i)})`;case"uint":return`${t(i)}.x`;case"int":return`int(${t(i)}.x)`;case"bool":return`(${t(i)}.x != 0u)`;case"mat4":return`mat4(${[0,1,2,3].map(o=>`uintBitsToFloat(${t(i+o)})`).join(", ")})`;case"mat3":return`mat3(${[0,1,2].map(o=>`uintBitsToFloat(${t(i+o)}.xyz)`).join(", ")})`;default:throw new Error(`effect uniform ${a.name}: type ${a.type}`)}}function Gr(a){const e=["uniform highp usampler2D uInstData;","uint uSpawnStart, uSpawnCount, uSpawnBase, uSystemSeed, uCursor;","float uEmitterTime;",...a.fields.map(i=>`${i.type} ${i.name};`)].join(`
`),t=a.fields.map(i=>`  ${i.name} = ${Oi(i,"uInstData")};`).join(`
`);return{decls:e,loads:t}}const _t=12,go=13,Ti={vsDecls:`uniform highp usampler2D uDrawRows;
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
in float vRow;`};function Ei(a,e,t,i,o,r){if(o==null)return;const s=r==="uint"||r==="int",n=o,u=o;switch(i){case"float":s?a[t]=n>>>0:e[t]=n;break;case"vec2":case"vec3":case"vec4":for(let l=0;l<u.length&&l<4;l++)e[t+l]=u[l];break;case"uint":s?a[t]=n>>>0:e[t]=n;break;case"int":s?a[t]=(n|0)>>>0:e[t]=n;break;case"bool":a[t]=n?1:0;break;case"mat4":for(let l=0;l<16;l++)e[t+l]=u[l];break;case"mat3":for(let l=0;l<3;l++)for(let c=0;c<3;c++)e[t+l*4+c]=u[l*3+c];break}}class Wr{constructor(e,t){d(this,"systems",[]);d(this,"slots",0);d(this,"high",0);d(this,"taken",[]);d(this,"passes",0);d(this,"bySystem",new Map);this.gl=e;for(const i of t){const o=this.make(i,bi);this.systems.push(o),this.bySystem.set(i,o)}this.slots=bi,this.taken.length=bi,this.taken.fill(!1)}take(){let e=this.taken.indexOf(!1);e<0&&(e=this.slots,this.grow(this.slots*$r)),this.taken[e]=!0,this.high=Math.max(this.high,e+1);for(const t of this.systems)this.zero(t,e);return e}free(e){if(!(e<0||!this.taken[e])){this.taken[e]=!1;for(const t of this.systems)t.rows[e*t.width*4+(t.width-1)*4+1]=0;for(;this.high>0&&!this.taken[this.high-1];)this.high--}}systemOf(e){return this.bySystem.get(e)}offset(e,t){return t*e.sys.capacity*e.sys.slots*16}rowAt(e,t){return t*e.width*4}beginFrame(){for(const e of this.systems){const t=(e.width-1)*4+1;for(let i=0;i<this.high;i++)e.rows[i*e.width*4+t]=0;e.active=0}}on(e,t){e.rows[t*e.width*4+(e.width-1)*4+1]=1,t+1>e.active&&(e.active=t+1)}beginDraw(){for(const e of this.systems){const t=(e.drawWidth-_t+11)*4;for(let i=0;i<this.high;i++)e.drawRows[i*e.drawWidth*4+t]=0;e.drawActive=0}}drawRowAt(e,t){return t*e.drawWidth*4}drawOn(e,t){e.drawRows[t*e.drawWidth*4+(e.drawWidth-_t+11)*4]=1,t+1>e.drawActive&&(e.drawActive=t+1)}uploadDraw(){const e=this.gl;for(const t of this.systems)t.drawActive&&(e.bindTexture(e.TEXTURE_2D,t.drawTexture),e.texSubImage2D(e.TEXTURE_2D,0,0,0,t.drawWidth,t.drawActive,e.RGBA_INTEGER,e.UNSIGNED_INT,t.drawRows.subarray(0,t.drawActive*t.drawWidth*4)));e.bindTexture(e.TEXTURE_2D,null)}bindDrawRows(e,t){const i=this.gl;i.activeTexture(i.TEXTURE0+go),i.bindTexture(i.TEXTURE_2D,e.drawTexture),i.uniform1i(t,go)}drawVaoAll(e){return e.drawVaosAll||(e.drawVaosAll=e.buffers.map(t=>Wt(this.gl,t,e.sys.slots,1,e.sys.mesh,0))),e.drawVaosAll[e.current]}simulate(e){const t=this.gl;this.passes=0,t.enable(t.RASTERIZER_DISCARD);for(const i of this.systems){if(!i.active)continue;const o=i.sys,r=i.current,s=1-r;t.useProgram(o.sim.program),e(o);const n=o.sim.locations;t.uniform1ui(n.uCapacity,o.capacity),n.uRing&&t.uniform1ui(n.uRing,o.ringK),t.activeTexture(t.TEXTURE0+yi),t.bindTexture(t.TEXTURE_2D,i.instTexture),t.uniform1i(n.uInstData,yi);const u=o.def.spawnFromEvent;if(u&&n.uParent){const l=this.systems.find(c=>c.sys.index===u.system);t.activeTexture(t.TEXTURE0+vo),t.bindTexture(t.TEXTURE_2D,(l==null?void 0:l.parentTexture)??null),t.uniform1i(n.uParent,vo),t.activeTexture(t.TEXTURE0+yi)}t.texSubImage2D(t.TEXTURE_2D,0,0,0,i.width,i.active,t.RGBA_INTEGER,t.UNSIGNED_INT,i.rows.subarray(0,i.active*i.width*4)),t.bindVertexArray(i.simVaos[r]),t.bindBuffer(t.ARRAY_BUFFER,null),t.bindBufferBase(t.TRANSFORM_FEEDBACK_BUFFER,0,i.buffers[s]),t.beginTransformFeedback(t.POINTS),t.drawArrays(t.POINTS,0,i.active*o.capacity),t.endTransformFeedback(),t.bindBufferBase(t.TRANSFORM_FEEDBACK_BUFFER,0,null),t.bindVertexArray(null),i.current=s,this.passes++,i.parentTexture&&this.copyToParentTexture(i)}t.disable(t.RASTERIZER_DISCARD)}drawVao(e,t){let i=e.drawVaos.get(t);return i||e.drawVaos.set(t,i=e.buffers.map(o=>Wt(this.gl,o,e.sys.slots,1,e.sys.mesh,this.offset(e,t)))),i[e.current]}trailVao(e,t){if(!e.sys.mesh)return this.drawVao(e,t);let i=e.trailVaos.get(t);return i||e.trailVaos.set(t,i=e.buffers.map(o=>Wt(this.gl,o,e.sys.slots,1,null,this.offset(e,t)))),i[e.current]}zero(e,t){const i=this.gl,o=e.sys.capacity*e.sys.slots*16;e.zeros??(e.zeros=new Uint8Array(o));for(const r of e.buffers)i.bindBuffer(i.ARRAY_BUFFER,r),i.bufferSubData(i.ARRAY_BUFFER,this.offset(e,t),e.zeros);i.bindBuffer(i.ARRAY_BUFFER,null)}dispose(){for(const e of this.systems)this.drop(e);this.systems.length=0,this.slots=0,this.high=0,this.taken.length=0}make(e,t,i){const o=this.gl,r=e.capacity*e.slots*16*t,s=[0,1].map(p=>{const x=o.createBuffer();return o.bindBuffer(o.ARRAY_BUFFER,x),o.bufferData(o.ARRAY_BUFFER,r,o.DYNAMIC_COPY),i&&(o.bindBuffer(o.COPY_READ_BUFFER,i.buffers[p]),o.copyBufferSubData(o.COPY_READ_BUFFER,o.ARRAY_BUFFER,0,0,e.capacity*e.slots*16*this.slots),o.bindBuffer(o.COPY_READ_BUFFER,null)),x});o.bindBuffer(o.ARRAY_BUFFER,null);let n=null;e.parentOfEvents&&(n=o.createTexture(),o.bindTexture(o.TEXTURE_2D,n),o.texStorage2D(o.TEXTURE_2D,1,o.RGBA32UI,st,Math.max(1,Math.ceil(e.capacity*e.slots*t/st))),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MIN_FILTER,o.NEAREST),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MAG_FILTER,o.NEAREST));const u=e.instance.width,l=o.createTexture();o.bindTexture(o.TEXTURE_2D,l),o.texStorage2D(o.TEXTURE_2D,1,o.RGBA32UI,u,t),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MIN_FILTER,o.NEAREST),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MAG_FILTER,o.NEAREST),o.bindTexture(o.TEXTURE_2D,null);const c=new Uint32Array(u*4*t);i&&c.set(i.rows);const h=e.draw.width,f=o.createTexture();o.bindTexture(o.TEXTURE_2D,f),o.texStorage2D(o.TEXTURE_2D,1,o.RGBA32UI,h,t),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MIN_FILTER,o.NEAREST),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MAG_FILTER,o.NEAREST),o.bindTexture(o.TEXTURE_2D,null);const v=new Uint32Array(h*4*t);return i&&v.set(i.drawRows),{sys:e,buffers:s,simVaos:s.map(p=>Wt(o,p,e.slots,0,null,0)),drawVaos:new Map,trailVaos:new Map,current:(i==null?void 0:i.current)??0,parentTexture:n,instTexture:l,rows:c,floats:new Float32Array(c.buffer),width:u,active:(i==null?void 0:i.active)??0,zeros:(i==null?void 0:i.zeros)??null,drawTexture:f,drawRows:v,drawFloats:new Float32Array(v.buffer),drawWidth:h,drawActive:(i==null?void 0:i.drawActive)??0,drawVaosAll:null}}grow(e){for(const t of this.systems){const i=this.make(t.sys,e,t);this.drop(t),Object.assign(t,i)}for(let t=this.slots;t<e;t++)this.taken[t]=!1;this.slots=e}drop(e){var i;const t=this.gl;e.buffers.forEach(o=>t.deleteBuffer(o)),e.simVaos.forEach(o=>t.deleteVertexArray(o));for(const o of[...e.drawVaos.values(),...e.trailVaos.values()])o.forEach(r=>t.deleteVertexArray(r));e.drawVaos.clear(),e.trailVaos.clear(),(i=e.drawVaosAll)==null||i.forEach(o=>t.deleteVertexArray(o)),e.drawVaosAll=null,e.parentTexture&&t.deleteTexture(e.parentTexture),t.deleteTexture(e.instTexture),t.deleteTexture(e.drawTexture)}copyToParentTexture(e){const t=this.gl,i=e.sys.capacity*e.sys.slots*e.active,o=Math.floor(i/st),r=i-o*st;t.bindBuffer(t.PIXEL_UNPACK_BUFFER,e.buffers[e.current]),t.bindTexture(t.TEXTURE_2D,e.parentTexture),o&&t.texSubImage2D(t.TEXTURE_2D,0,0,0,st,o,t.RGBA_INTEGER,t.UNSIGNED_INT,0),r&&t.texSubImage2D(t.TEXTURE_2D,0,0,o,r,1,t.RGBA_INTEGER,t.UNSIGNED_INT,o*st*16),t.bindBuffer(t.PIXEL_UNPACK_BUFFER,null)}}function Wt(a,e,t,i,o,r){const s=a.createVertexArray();a.bindVertexArray(s),a.bindBuffer(a.ARRAY_BUFFER,e);for(let n=0;n<t;n++)a.enableVertexAttribArray(n),a.vertexAttribIPointer(n,4,a.UNSIGNED_INT,t*16,r+n*16),a.vertexAttribDivisor(n,i);return o&&([[o.positions,3],[o.normals,3],[o.uvs,2]].forEach(([n,u],l)=>{a.bindBuffer(a.ARRAY_BUFFER,n),a.enableVertexAttribArray(t+l),a.vertexAttribPointer(t+l,u,a.FLOAT,!1,0,0),a.vertexAttribDivisor(t+l,0)}),a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,o.indices)),a.bindVertexArray(null),a.bindBuffer(a.ARRAY_BUFFER,null),s}const ni={float:1,vec2:2,vec3:3,vec4:4,uint:1,uvec2:2,uvec3:3,uvec4:4,int:1,ivec2:2,ivec3:3,ivec4:4,bool:1},Hr={float:"0.0",uint:"0u",int:"0",bool:"false"},dt=a=>Hr[a]??`${a}(0)`,xo=.25,Ke=`#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
precision highp usampler2D;
`;class jr{constructor(e,t,i={}){d(this,"name");d(this,"systems",[]);d(this,"spawners",[]);d(this,"textures");d(this,"exprTypes");d(this,"values0");d(this,"meshData");d(this,"bake");d(this,"byIndex",new Map);d(this,"_pool",null);d(this,"bakeBySource",new WeakMap);this.gl=e,this.effect=t,this.name=t.name,this.textures=i.textures??new Map,this.meshData=i.meshes??new Map;const o=i.maxCapacity??1<<20;this.bake=this.createBakeTexture(),this.values0=qo(t.expressions,{time:0,deltaTime:0,frame:0,seed:0},(l,c)=>this.bakeRow(l,c)),this.exprTypes=t.expressions.map((l,c)=>ta(t,c));const r=t.systems,s=l=>l.spawnFromEvent?1+s(r[l.spawnFromEvent.system]):0,n=r.map((l,c)=>({def:l,index:c})).filter(l=>l.def.kind==="particles").sort((l,c)=>s(l.def)-s(c.def)),u=new Map;for(const{def:l}of n)l.spawnFromEvent&&(u.get(l.spawnFromEvent.system)??u.set(l.spawnFromEvent.system,new Set).get(l.spawnFromEvent.system)).add(l.spawnFromEvent.counter);for(const{def:l,index:c}of n){const h=this.setupSystem(l,c,u.get(c)??null,o);this.systems.push(h),this.byIndex.set(c,h)}r.forEach((l,c)=>{l.kind==="spawner"&&this.spawners.push({index:c,tasks:l.tasks??[],targets:l.targets??[]})})}system(e){return this.byIndex.get(e)}get drawOrder(){const e=this.effect.drawOrder;return e?e.map(t=>this.byIndex.get(t)).filter(t=>!!t):this.systems}bounds(){return Qo(this,this.values0)}get pool(){return this._pool??(this._pool=new Wr(this.gl,this.systems))}get pooled(){return!!this._pool&&this._pool.high>0}bindSimTextures(e){return this.bindStageTextures(e.sim,["init","update"],e)}bindStageTextures(e,t,i){const o=this.gl;let r=0;o.activeTexture(o.TEXTURE0),o.bindTexture(o.TEXTURE_2D,this.bake.texture),e.locations.bakedTexture&&o.uniform1i(e.locations.bakedTexture,r),r++;for(const s of t){const n=i.def.stages[s];if(n)for(const u of n.textures){const l=e.locations[u.name];if(!l)continue;const c=u.expr!==null?this.values0[u.expr]:null;o.activeTexture(o.TEXTURE0+r),u.type==="sampler3D"?o.bindTexture(o.TEXTURE_3D,this.texture3D(c)):o.bindTexture(o.TEXTURE_2D,this.textures.get(c)||ji(o)),o.uniform1i(l,r),r++}}return r}drawSystem(e,t,i,o,r,s,n,u){const l=this.gl,c=e.render,h=e.def.output;l.useProgram(c.program);let f=this.bindStageTextures(c,["output"],e);const v=c.locations;if(l.uniformMatrix4fv(v.uViewProj,!1,o),l.uniform2fv(v.uViewport,i.viewport),v.uFxExposure&&l.uniform1f(v.uFxExposure,i.exposure),v.uFxToneMap&&l.uniform1f(v.uFxToneMap,i.toneMap?1:0),l.uniform1i(v.uRowBase,r),l.uniform1ui(v.uCapacity,e.capacity),l.uniform1i(v.uDrawFixed,e.draw.width-_t),(h==null?void 0:h.kind)==="shuriken"){const p=h.material;v.uProjScale&&l.uniform1f(v.uProjScale,1/i.projection[5]),v.uSystemRotation&&h.systemRotation&&l.uniformMatrix4fv(v.uSystemRotation,!1,h.systemRotation),v.uDeltaTime&&l.uniform1f(v.uDeltaTime,1/60),v.uCameraPos&&l.uniform3fv(v.uCameraPos,i.eye);const x=new Map;if(u&&h.beam){l.uniform3fv(v.uBeamStart,u.start),l.uniform3fv(v.uBeamEnd,u.end);const m=Math.hypot(u.end[0]-u.start[0],u.end[1]-u.start[1],u.end[2]-u.start[2]);for(const g of h.beam.tiling)x.set(g.uniform,g.perMetre*m)}for(const m of(p==null?void 0:p.uniforms)||[]){if(!v[m.name])continue;const g=x.has(m.name)&&Array.isArray(m.value)?[x.get(m.name),...m.value.slice(1)]:m.value;$i(l,v[m.name],m.type,g,"float")}const w=(m,g)=>{v[m]&&(l.activeTexture(l.TEXTURE0+f),l.bindTexture(l.TEXTURE_2D,g),l.uniform1i(v[m],f),f++)};w("uWhite",li(l));for(const m of(p==null?void 0:p.textures)||[])w(m.name,this.textures.get(m.key)||li(l));if(!(p!=null&&p.blend))l.disable(l.BLEND),l.depthMask(!0);else{l.enable(l.BLEND);const m=l;l.blendFuncSeparate(m[p.blend.src]??l.SRC_ALPHA,m[p.blend.dst]??l.ONE_MINUS_SRC_ALPHA,l.ZERO,l.ONE),l.depthMask(!!p.depthWrite)}p!=null&&p.cull?(l.enable(l.CULL_FACE),l.cullFace(l.BACK)):l.disable(l.CULL_FACE),this.pool.bindDrawRows(t,v.uDrawRows),l.bindVertexArray(n),e.mesh?l.drawElementsInstanced(l.TRIANGLES,e.mesh.count,l.UNSIGNED_INT,0,s):l.drawArraysInstanced(l.TRIANGLE_STRIP,0,4,s)}else{l.disable(l.CULL_FACE);const p=h==null?void 0:h.blend;p==="opaque"?(l.disable(l.BLEND),l.depthMask(!0)):(l.enable(l.BLEND),l.depthMask(!1),p==="add"?l.blendFuncSeparate(l.SRC_ALPHA,l.ONE,l.ZERO,l.ONE):p==="premultiply"?l.blendFuncSeparate(l.ONE,l.ONE_MINUS_SRC_ALPHA,l.ZERO,l.ONE):l.blendFuncSeparate(l.SRC_ALPHA,l.ONE_MINUS_SRC_ALPHA,l.ZERO,l.ONE)),this.pool.bindDrawRows(t,v.uDrawRows),l.bindVertexArray(n),l.drawArraysInstanced(l.TRIANGLE_STRIP,0,4,s)}return l.bindVertexArray(null),1}texture3D(e){const t=this.textures.get(e);if(t)return t;const i=ls(this.gl);return this.textures.set(e,i),i}bakeRow(e,t){const i=this.gl,o=typeof t=="object"&&t!==null?t:null,r=o?this.bakeBySource.get(o):void 0;if(r&&r.kind===e&&this.bake.used.get(r.key)===r.entry)return r.entry;const s=`${e}:${JSON.stringify(t)}`;let n=this.bake.used.get(s);if(n!==void 0)return o&&this.bakeBySource.set(o,{kind:e,key:s,entry:n}),n;{const u=this.bake.used.size%this.bake.rows,l=e==="gradient"?{data:Rr(t),start:0,end:1}:Fr(t);i.bindTexture(i.TEXTURE_2D,this.bake.texture),i.texSubImage2D(i.TEXTURE_2D,0,0,u,ut,1,i.RGBA,i.FLOAT,l.data);const c=(u+.5)/this.bake.rows,h=l.end-l.start||1;n=e==="gradient"?c:[1/h,-l.start/h,c,12],this.bake.used.size>=this.bake.rows&&this.bake.used.clear(),this.bake.used.set(s,n),o&&this.bakeBySource.set(o,{kind:e,key:s,entry:n})}return n}get bakeTexture(){return this.bake.texture}dispose(){var t;const e=this.gl;(t=this._pool)==null||t.dispose(),this._pool=null;for(const i of this.systems)if(e.deleteProgram(i.sim.program),i.render&&e.deleteProgram(i.render.program),i.trail&&e.deleteProgram(i.trail.program),i.mesh)for(const o of[i.mesh.positions,i.mesh.normals,i.mesh.uvs,i.mesh.indices])e.deleteBuffer(o);e.deleteTexture(this.bake.texture);for(const i of this.textures.values())i&&!ns(e,i)&&e.deleteTexture(i)}setupSystem(e,t,i,o){var b,F,_,E,R,M,z;const r=Math.max(1,Math.round(e.capacity));let s,n=1;if(e.spawnFromEvent){const V=this.byIndex.get(e.spawnFromEvent.system);let A=Math.max(1,Math.floor(r/Math.max(1,V.def.capacity)));e.spawnFromEvent.mode==="die"?A=Math.max(A,this.maxEventCount(V.def)):A=Math.max(A,(e.spawnFromEvent.ringStep||1)*2),A=Math.max(1,Math.min(A,Math.floor(o/V.capacity))),n=A,s=V.capacity*A}else s=Math.min(((b=e.spawner)==null?void 0:b.kind)==="shuriken"?kr(e.spawner,e.maxLifetime,r):r,o);const u=new Map(e.attributes.map(V=>[V.name,V.type])),l=e.attributes.filter(V=>V.stored).map(V=>({name:V.name,type:V.type,offset:0}));for(const V of i??[])l.push({name:`__${V}`,type:"uint",offset:0,counter:V});let c=0;for(const V of l)V.offset=c,c+=ni[V.type];const h=Math.max(1,Math.ceil(c/4)),f=po([...((F=e.stages.init)==null?void 0:F.uniforms)??[],...((_=e.stages.update)==null?void 0:_.uniforms)??[]]),v=e.spawnFromEvent?this.byIndex.get(e.spawnFromEvent.system).capacity:0,p=(E=e.output)==null?void 0:E.material,x=(((R=e.output)==null?void 0:R.materialAnim)??[]).flatMap(V=>{const A=p==null?void 0:p.uniforms.find(S=>S.name===V.uniform);return A?[{name:A.name,type:A.type,anim:V}]:[]}),w=po([...((M=e.stages.output)==null?void 0:M.uniforms)??[],...x],_t),m={index:t,def:e,name:e.name,capacity:s,ringK:n,fields:u,layout:l,slots:h,sim:null,render:null,trail:null,mesh:null,parentOfEvents:!!i,parentCapacity:v,instance:f,draw:w,animated:x};m.sim=this.buildSimProgram(m);const g=((z=e.output)==null?void 0:z.kind)==="shuriken";return m.render=e.stages.output?g?e.output.mode==="none"?null:this.buildShurikenRender(m):this.buildRenderProgram(m):null,m.trail=g&&e.output.trail&&e.stages.output&&e.stages.trail?this.buildShurikenTrail(m):null,m.mesh=g&&(e.output.mode==="mesh"||e.output.mode==="vat")?this.meshBuffers(e.output.mesh):null,m}maxEventCount(e){var i;let t=1;for(const o of((i=e.stages.update)==null?void 0:i.uniforms)||[])/^u_count_/.test(o.name)&&o.expr!==null&&(t=Math.max(t,Number(this.values0[o.expr])||1));return Math.min(t,4096)}meshBuffers(e){const t=this.gl,i=this.meshData.get(e);if(!i)return null;const o=s=>{const n=t.createBuffer();return t.bindBuffer(t.ARRAY_BUFFER,n),t.bufferData(t.ARRAY_BUFFER,new Float32Array(s),t.STATIC_DRAW),n},r=t.createBuffer();return t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,r),t.bufferData(t.ELEMENT_ARRAY_BUFFER,new Uint32Array(i.indices),t.STATIC_DRAW),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,null),t.bindBuffer(t.ARRAY_BUFFER,null),{positions:o(i.positions),normals:o(i.normals),uvs:o(i.uvs),indices:r,count:i.indices.length}}createBakeTexture(){const e=this.gl,t=Math.max(1,this.effect.expressions.filter(o=>o.op==="BakeCurve"||o.op==="BakeGradient").length*2),i=e.createTexture();return e.bindTexture(e.TEXTURE_2D,i),e.texStorage2D(e.TEXTURE_2D,1,e.RGBA16F,ut,t),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),{texture:i,rows:t,used:new Map}}buildSimProgram(e){const t=e.def,{init:i,update:o}=t.stages,r=[i,o].filter(E=>!!E),s=wo(r),n=t.spawnFromEvent,u=n?this.byIndex.get(n.system):null,l=e.fields,c=e.layout.filter(E=>!E.counter).map(E=>`  attributes.${E.name} = ${Ai("a_s",E)};`).join(`
`),h=Jr(e,"v_s"),f=(t.sourceAttributes.length?t.sourceAttributes:[{name:"_unused",type:"float"}]).map(E=>`  ${E.type} ${E.name};`).join(`
`);let v="";const p=E=>{const R=Array.from({length:ni[E.type]},(M,z)=>`parentComponent(parentIndex, ${E.offset+z})`);return ea(E.type,R)};if(u)for(const E of t.sourceAttributes){const R=u.layout.find(M=>M.name===E.name);v+=R?`    sourceAttributes.${E.name} = ${p(R)};
`:`    sourceAttributes.${E.name} = ${dt(E.type)};
`}const x=u==null?void 0:u.layout.find(E=>E.counter===n.counter),w=[...new Set((o==null?void 0:o.events)||[])],m=Gr(e.instance),g=e.instance.width,b=`${Ke}
${Object.entries(s).map(([E,R])=>`#define ${E} ${R}`).join(`
`)}
${wi}
struct Attributes {
${[...l].map(([E,R])=>`  ${R} ${E};`).join(`
`)}
};
struct SourceAttributes {
${f}
};
${Zr(r)}
${m.decls}
uniform uint uCapacity, uRing;
uniform usampler2D uParent;
${Array.from({length:e.slots},(E,R)=>`layout(location = ${R}) in uvec4 a_s${R};
flat out uvec4 v_s${R};`).join(`
`)}

uint parentComponent(uint particle, int c) {
  int texel = int(particle) * ${u?u.slots:1} + c / 4;
  return texelFetch(uParent, ivec2(texel % ${st}, texel / ${st}), 0)[c % 4];
}
${(i==null?void 0:i.functions)||""}
${(o==null?void 0:o.functions)||""}

void main() {
  uint index = uint(gl_VertexID);
  // Which copy's slot this particle is in (its row of instance data), and which particle of it.
  int inst = int(index / uCapacity);
  uint local = index - uint(inst) * uCapacity;
  uvec4 spawnA = texelFetch(uInstData, ivec2(${g-si}, inst), 0);
  uvec4 spawnB = texelFetch(uInstData, ivec2(${g-si+1}, inst), 0);
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
${m.loads}
  Attributes attributes;
${[...l].map(([E,R])=>`  attributes.${E} = ${dt(R)};`).join(`
`)}
${c}
  SourceAttributes sourceAttributes;
${f.replace(/^ {2}(\w+) (\w+);$/gm,(E,R,M)=>`  sourceAttributes.${M} = ${dt(R)};`)}
${w.map(E=>`  uint ${E} = 0u;`).join(`
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
${[...l].map(([E,R])=>{var M;return`    attributes.${E} = ${((M=i==null?void 0:i.defaults)==null?void 0:M[E])??dt(R)};`}).join(`
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
${h}
}`,F=`${Ke}out vec4 o; void main() { o = vec4(0.0); }`,_=Array.from({length:e.slots},(E,R)=>`v_s${R}`);return this.program(b,F,`${this.name} / ${e.name} simulation`,_)}buildShurikenRender(e){const{vs:t,fs:i}=Lr({slots:e.slots,output:e.def.output,stages:e.def.stages},this.shurikenShaderParts(e,[e.def.stages.output])),o=yo(t,i,e);return this.program(o.vs,o.fs,`${this.name} / ${e.name} output`,null)}buildShurikenTrail(e){const t=[e.def.stages.output,e.def.stages.trail],{vs:i,fs:o}=Ir({slots:e.slots,layout:e.layout,output:e.def.output,stages:e.def.stages},this.shurikenShaderParts(e,t));return this.program(i,o,`${this.name} / ${e.name} trails`,null)}shurikenShaderParts(e,t){const i=e.fields;return{header:Ke,lib:wi,attributeDecl:`struct Attributes {
${[...i].map(([o,r])=>`  ${r} ${o};`).join(`
`)}
};`,uniformDecls:bo(t),zeroInit:[...i].map(([o,r])=>`  attributes.${o} = ${dt(r)};`).join(`
`),loadAttributes:e.layout.filter(o=>!o.counter&&i.has(o.name)).map(o=>`  attributes.${o.name} = ${Ai("a_s",o)};`).join(`
`)}}buildRenderProgram(e){var w,m;const t=e.def,i=t.stages.output,o=e.fields,r=wo([i]),s=new Set(e.layout.map(g=>g.name)),n=e.layout.filter(g=>!g.counter&&o.has(g.name)).map(g=>`  attributes.${g.name} = ${Ai("a_s",g)};`).join(`
`),u=g=>o.has(g),l=i.textures.find(g=>/mainTexture$/.test(g.name)),c=((w=t.output)==null?void 0:w.primitive)==="line",h=()=>`  vec3 size3 = vec3(${u("size")?"attributes.size":"0.1"});
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
  gl_Position = uViewProj * uModel * vec4(p, 1.0);`,f=()=>`  vec3 target = ${u("targetPosition")?"attributes.targetPosition":"attributes.position + vec3(0.0, 0.0, 0.1)"};
  vec4 c0 = uViewProj * uModel * vec4(attributes.position, 1.0);
  vec4 c1 = uViewProj * uModel * vec4(target, 1.0);
  // keep both ends in front of the near plane
  if (c0.w < 0.01) c0 = mix(c0, c1, (0.01 - c0.w) / (c1.w - c0.w));
  if (c1.w < 0.01) c1 = mix(c1, c0, (0.01 - c1.w) / (c0.w - c1.w));
  vec2 d = c1.xy / c1.w - c0.xy / c0.w;
  vec2 n = normalize(vec2(-d.y, d.x) * uViewport + 1e-6) / uViewport * 2.0; // ~2 px wide
  vec4 c = corner.y < 0.5 ? c0 : c1;
  c.xy += n * (corner.x - 0.5) * 2.0 * c.w;
  gl_Position = c;`,v=`${Ke}
${Object.entries(r).map(([g,b])=>`#define ${g} ${b}`).join(`
`)}
${wi}
struct Attributes {
${[...o].map(([g,b])=>`  ${b} ${g};`).join(`
`)}
};
${bo([i])}
uniform mat4 uViewProj;
uniform mat4 uModel;
uniform vec2 uViewport;
${Array.from({length:e.slots},(g,b)=>`layout(location = ${b}) in uvec4 a_s${b};`).join(`
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
${[...o].map(([g,b])=>`  attributes.${g} = ${s.has(g)?dt(b):i.defaults[g]??dt(b)};`).join(`
`)}
${n}
${u("alive")?"  if (!attributes.alive) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); vColor = vec4(0.0); vUV = vec2(0.0); return; }":""}
  {
${i.section}
  }
  vec2 corner = vec2(float(gl_VertexID & 1), float((gl_VertexID & 2) >> 1));
  vUV = corner;
  vColor = vec4(${u("color")?"attributes.color":"vec3(1.0)"}, ${u("alpha")?"attributes.alpha":"1.0"});
${c?f():h()}
}`,p=`${Ke}
in vec4 vColor;
in vec2 vUV;
${l?`uniform sampler2D ${l.name};`:""}
${Zo}
out vec4 fragColor;
void main() {
  vec4 color = vColor;
${l?`  color *= texture(${l.name}, vUV);`:""}
${(m=t.output)!=null&&m.alphaTest?"  if (color.a < 0.5) discard;":""}
  color.a = clamp(color.a, 0.0, 1.0);
  fragColor = vec4(fxTone(color.rgb), clamp(color.a * uFxTint.a, 0.0, 1.0));
}`,x=yo(v,p,e);return this.program(x.vs,x.fs,`${this.name} / ${e.name} output`,null)}program(e,t,i,o){const r=this.gl,s=(f,v)=>{const p=r.createShader(f);if(r.shaderSource(p,v),r.compileShader(p),!r.getShaderParameter(p,r.COMPILE_STATUS)){const x=r.getShaderInfoLog(p)??"",w=v.split(`
`),m=[...x.matchAll(/ERROR: \d+:(\d+)/g)].slice(0,3).map(g=>{var b;return`${g[1]}: ${(b=w[Number(g[1])-1])==null?void 0:b.trim()}`}).join(`
`);throw r.deleteShader(p),new Error(`${i}: shader compile failed
${x}
${m}`)}return p},n=r.createProgram(),u=s(r.VERTEX_SHADER,e),l=s(r.FRAGMENT_SHADER,t);if(r.attachShader(n,u),r.attachShader(n,l),o&&r.transformFeedbackVaryings(n,o,r.INTERLEAVED_ATTRIBS),r.linkProgram(n),r.deleteShader(u),r.deleteShader(l),!r.getProgramParameter(n,r.LINK_STATUS))throw new Error(`${i}: link failed
${r.getProgramInfoLog(n)}`);const c={},h=r.getProgramParameter(n,r.ACTIVE_UNIFORMS);for(let f=0;f<h;f++){const v=r.getActiveUniform(n,f).name.replace(/\[0\]$/,"");c[v]=r.getUniformLocation(n,v)}return{program:n,locations:c}}}class Yr{constructor(e,t={}){d(this,"time",0);d(this,"frame",0);d(this,"seed");d(this,"position",[0,0,0]);d(this,"rotation",[0,0,0,1]);d(this,"scale",1);d(this,"recolor",null);d(this,"tint",[1,1,1,1]);d(this,"density",1);d(this,"overrides",new Map);d(this,"playing",new Set);d(this,"looping");d(this,"values");d(this,"slot",-1);d(this,"hidden",!1);d(this,"veil",1);d(this,"pending",0);d(this,"spawnCounts",new Map);d(this,"ctx");d(this,"bake");d(this,"stoppedAt",null);d(this,"playedAt",new Map);d(this,"beamEnd",null);d(this,"states",[]);d(this,"stateOf",new Map);d(this,"spawners");d(this,"gl");d(this,"modelOut",new Float32Array(16));d(this,"recolorOut",null);d(this,"recolorSrc");this.asset=e;const i=this.gl=e.gl,o=e.effect;this.looping=!!o.looping&&!(t.once&&o.kind==="shuriken"),this.seed=(t.seed??Math.random()*4294967295)>>>0,this.values=e.values0,this.spawners=e.spawners.map(r=>({def:r,acc:0,timers:r.tasks.map(()=>null)})),this.ctx={time:0,deltaTime:0,frame:0,seed:this.seed,overrides:this.overrides},this.bake=(r,s)=>e.bakeRow(r,s),this.slot=e.pool.take();for(const r of e.pool.systems){const s=r.sys;let n=null;if(s.trail){const{points:c,interval:h}=s.def.output.trail,f=i.createTexture();i.bindTexture(i.TEXTURE_2D_ARRAY,f),i.texStorage3D(i.TEXTURE_2D_ARRAY,1,i.RGBA32UI,rt,Math.ceil(s.capacity*s.slots/rt),c),i.texParameteri(i.TEXTURE_2D_ARRAY,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D_ARRAY,i.TEXTURE_MAG_FILTER,i.NEAREST),n={texture:f,points:c,interval:h,head:0,count:0,last:-1/0,times:new Float64Array(c),ages:new Float32Array(c)}}const u=s.def.spawner?this.looping?s.def.spawner:{...s.def.spawner,looping:!1}:null,l={sys:s,ps:r,trail:n,ring:0,spawnBase:0,cursor:0,spawner:u,spawnState:u?mo(u):null,emitterTime:0,life:qr(e,s),aliveUntil:0};l.aliveUntil=l.life===1/0?1/0:-1/0,this.states.push(l),this.stateOf.set(s.index,l)}this.play()}play(e=this.asset.effect.initialEvent){const t=this.asset.effect.events.find(i=>i.name===e);for(const i of(t==null?void 0:t.play)||[])this.playing.has(i)||this.playedAt.set(i,this.time),this.playing.add(i);for(const i of(t==null?void 0:t.stop)||[])this.playing.delete(i);this.stoppedAt=this.playing.size?null:this.time}stop(){this.play("OnStop"),this.asset.effect.events.some(e=>e.name==="OnStop")||(this.playing.clear(),this.stoppedAt=this.time)}get done(){const{playTime:e,fadeTime:t}=this.asset.effect;return!this.looping&&e!=null&&this.time>=e||t!=null&&this.stoppedAt!=null&&this.time-this.stoppedAt>=t?!0:this.settled()}settled(){if(this.looping||this.frame===0||this.asset.effect.kind!=="shuriken"||this.spawners.length)return!1;for(const e of this.states)if(this.time<=e.aliveUntil||e.spawner&&e.spawnState&&this.playing.has(e.sys.index)&&!Ur(e.spawner,e.spawnState))return!1;for(const e of this.asset.effect.lights||[])if(!e.curve||this.time<e.curve.time)return!1;return!0}reset(e){const t=this.asset.pool;if(this.slot<0)this.slot=t.take();else for(const i of this.states)t.zero(i.ps,this.slot);this.pending=0,this.hidden=!1;for(const i of this.states)i.ring=0,i.spawnBase=0,i.cursor=0,i.spawnState=i.spawner?mo(i.spawner):null,i.emitterTime=0,i.aliveUntil=i.life===1/0?1/0:-1/0,i.trail&&(i.trail.count=0,i.trail.last=-1/0);for(const i of this.spawners)i.acc=0,i.timers=i.def.tasks.map(()=>null);e!==void 0&&(this.seed=e>>>0),this.time=0,this.frame=0,this.playing.clear(),this.play()}setParam(e,t){const i=this.asset.effect.params.find(o=>o.name===e);i&&this.overrides.set(i.expr,t)}getParam(e){const t=this.asset.effect.params.find(i=>i.name===e);return t?this.overrides.has(t.expr)?this.overrides.get(t.expr):this.asset.effect.expressions[t.expr].value:void 0}setBeamEnd(e){this.beamEnd=e?[e[0],e[1],e[2]]:null}beamEnds(e){const t=this.asset.effect.systems[e].output.beam,i=this.beamEnd?this.toLocalPoint(this.beamEnd):t.end,o=t.growth>0?Math.min(1,Math.max(0,(this.time-(this.playedAt.get(e)??0))/t.growth)):1;return{start:t.start,end:[0,1,2].map(r=>t.start[r]+(i[r]-t.start[r])*o)}}bounds(){return Qo(this.asset,this.values)}recolorNow(){const e=this.recolor??this.asset.effect.recolor;return(!this.recolorOut||e!==this.recolorSrc)&&(this.recolorSrc=e,this.recolorOut=Cr(e)),this.recolorOut}model(){const e=this.rotation[0],t=this.rotation[1],i=this.rotation[2],o=this.rotation[3],r=this.scale,s=this.modelOut;return s[0]=-r*(1-2*(t*t+i*i)),s[1]=-r*(2*(e*t+i*o)),s[2]=-r*(2*(e*i-t*o)),s[3]=0,s[4]=r*(2*(e*t-i*o)),s[5]=r*(1-2*(e*e+i*i)),s[6]=r*(2*(t*i+e*o)),s[7]=0,s[8]=r*(2*(e*i+t*o)),s[9]=r*(2*(t*i-e*o)),s[10]=r*(1-2*(e*e+t*t)),s[11]=0,s[12]=this.position[0],s[13]=this.position[1],s[14]=this.position[2],s[15]=1,s}toLocalDir(e,t=[0,0,0]){const i=-this.rotation[0],o=-this.rotation[1],r=-this.rotation[2],s=this.rotation[3],n=2*(o*e[2]-r*e[1]),u=2*(r*e[0]-i*e[2]),l=2*(i*e[1]-o*e[0]);return t[0]=-(e[0]+s*n+(o*l-r*u)),t[1]=e[1]+s*u+(r*n-i*l),t[2]=e[2]+s*l+(i*u-o*n),t}toLocalPoint(e,t=[0,0,0]){const i=ts;return i[0]=e[0]-this.position[0],i[1]=e[1]-this.position[1],i[2]=e[2]-this.position[2],this.toLocalDir(i,t),t[0]/=this.scale,t[1]/=this.scale,t[2]/=this.scale,t}lights(e,t=1){for(const i of this.asset.effect.lights||[]){const o=Dr(i,this.time)*t*this.veil;if(!(o>0))continue;const r=ss([-i.position[0]*this.scale,i.position[1]*this.scale,i.position[2]*this.scale],this.rotation);e.push({x:this.position[0]+r[0],y:this.position[1]+r[1],z:this.position[2]+r[2],radius:i.range*this.scale,r:i.color[0],g:i.color[1],b:i.color[2],intensity:o})}}update(e,t=1){const i=this.asset.pool;i.beginFrame(),this.advance(e,t),i.simulate(o=>this.asset.bindSimTextures(o)),this.afterSimulate()}idle(e){e=Math.min(e,1/15),this.time+=e,this.pending=Math.min(this.pending+e,xo)}advance(e,t=1){var l;const i=this.asset,o=i.pool;e=Math.min(e,1/15),this.time+=e,this.frame++;const r=Math.min(e+this.pending,xo);this.pending=0,e=r;const s=this.ctx;s.time=this.time,s.deltaTime=e,s.frame=this.frame,s.seed=this.seed,this.values=qo(i.effect.expressions,s,this.bake,this.values);const n=this.spawnCounts;n.clear();for(const c of this.spawners){if(!this.playing.has(c.def.index))continue;const h=this.runSpawner(c,e,t);for(const f of c.def.targets)n.set(f,(n.get(f)||0)+h)}for(const c of this.states){if(!c.spawner||!c.spawnState||!this.playing.has(c.sys.index))continue;const h=zr(c.spawner,c.spawnState,e,t);n.set(c.sys.index,(n.get(c.sys.index)||0)+h.count),c.emitterTime=h.emitterTime}for(const c of this.states)c.life!==1/0&&!c.sys.def.spawnFromEvent&&(n.get(c.sys.index)||0)>=1&&(c.aliveUntil=Math.max(c.aliveUntil,this.time+c.life));for(let c=0;c<2;c++)for(const h of this.states){const f=h.sys.def.spawnFromEvent;h.life!==1/0&&f&&(h.aliveUntil=(((l=this.stateOf.get(f.system))==null?void 0:l.aliveUntil)??1/0)+h.life)}const u=i.exprTypes;for(const c of this.states){if(this.time>c.aliveUntil)continue;const h=c.sys,f=c.ps,v=f.rows,p=o.rowAt(f,this.slot),x=h.instance.at;for(const b of es){const F=h.def.stages[b];if(F)for(const _ of F.uniforms)_.expr!==null&&Ei(v,f.floats,p+x[_.name]*4,_.type,this.values[_.expr],u[_.expr])}const w=p+(f.width-si)*4,m=w+4;v[w+3]=(this.seed^Math.imul(h.index+1,2654435761))>>>0,v[w+2]=c.spawnBase>>>0,f.floats[m+2]=c.emitterTime;const g=h.def.spawnFromEvent;if(g)v[m]=c.cursor%h.ringK,c.cursor=(c.cursor+(g.ringStep||1))%h.ringK,c.spawnBase+=h.capacity;else{const b=Math.min(h.capacity,Math.floor(n.get(h.index)||0));v[w]=c.ring,v[w+1]=b,c.ring=(c.ring+b)%h.capacity,c.spawnBase+=b}o.on(f,this.slot)}}afterSimulate(){for(const e of this.states)e.trail&&this.time<=e.aliveUntil&&this.recordTrail(e,e.trail)}park(){this.slot<0||(this.asset.pool.free(this.slot),this.slot=-1)}draw(e){if(this.slot<0)return 0;const t=this.asset.pool,i=Qr(e.projection,e.view);t.beginDraw();let o=0;if(this.stageDraw(e)){t.uploadDraw();for(const r of this.asset.drawOrder){const s=this.stateOf.get(r.index);!r.render||!this.rowOn(s)||(o+=this.asset.drawSystem(r,s.ps,e,i,this.slot,r.capacity,t.drawVao(s.ps,this.slot),this.beamOf(r)))}}return o+this.drawTrails(e,i)}stageDraw(e){if(this.slot<0)return!1;const t=this.asset,i=t.pool,o=this.model(),r=e.view,s=this.toLocalDir(Fi(Ri,r[0],r[4],r[8]),is),n=this.toLocalDir(Fi(Ri,r[1],r[5],r[9]),os),u=this.toLocalDir(Fi(Ri,r[2],r[6],r[10]),as),l=this.toLocalPoint(e.eye,rs),c=this.recolorNow(),h=t.exprTypes;let f=!1;for(const v of this.states){const p=v.sys;if(!p.render||this.time>v.aliveUntil)continue;const x=p.def.output;if((x==null?void 0:x.mode)==="beam"&&!this.playing.has(p.index))continue;const w=this.time-(this.playedAt.get(p.index)??0);let m=0;if(x!=null&&x.vat){const S=Sr(x.vat,w);if(S===null)continue;m=S}let g=o,b=l;const F=p.def.anchor;if(F){const{end:S}=this.beamEnds(F.beam),k=[0,1,2].map(C=>S[C]-F.origin[C]);g=Array.from(o);for(let C=0;C<3;C++)g[12+C]+=o[C]*k[0]+o[4+C]*k[1]+o[8+C]*k[2];b=[l[0]-k[0],l[1]-k[1],l[2]-k[2]]}const _=v.ps,E=_.drawRows,R=_.drawFloats,M=i.drawRowAt(_,this.slot),z=p.draw.at,V=p.def.stages.output;if(V)for(const S of V.uniforms)S.expr!==null&&Ei(E,R,M+z[S.name]*4,S.type,this.values[S.expr],h[S.expr]);for(const S of p.animated)Ei(E,R,M+z[S.name]*4,S.type,_r(S.anim,w),"float");const A=M+(p.draw.width-_t)*4;R[A]=g[0],R[A+1]=g[4],R[A+2]=g[8],R[A+3]=g[12],R[A+4]=g[1],R[A+5]=g[5],R[A+6]=g[9],R[A+7]=g[13],R[A+8]=g[2],R[A+9]=g[6],R[A+10]=g[10],R[A+11]=g[14],R[A+12]=this.tint[0],R[A+13]=this.tint[1],R[A+14]=this.tint[2],R[A+15]=this.tint[3]*this.veil;for(let S=0;S<3;S++)for(let k=0;k<3;k++)R[A+16+S*4+k]=c[S*3+k];for(let S=0;S<3;S++)R[A+28+S]=s[S],R[A+32+S]=n[S],R[A+36+S]=u[S],R[A+40+S]=b[S];R[A+43]=this.time,R[A+45]=m,i.drawOn(_,this.slot),f=!0}return f}rowOn(e){const t=e.ps;return t.drawRows[this.asset.pool.drawRowAt(t,this.slot)+(t.drawWidth-_t+11)*4]===1}rowOnFor(e){const t=this.stateOf.get(e.index);return!!t&&this.rowOn(t)}beamOf(e){var t;return(t=e.def.output)!=null&&t.beam?this.beamEnds(e.index):null}drawTrails(e,t){if(this.slot<0)return 0;const i=this.gl,o=this.asset.pool;let r=0,s=null,n=null,u=null;for(const l of this.asset.drawOrder){const c=this.stateOf.get(l.index),h=l.trail,f=c.trail;if(!h||!f||this.time>c.aliveUntil)continue;const v=l.def.output;if(!s){const g=e.view;s=new Float32Array([...this.toLocalDir([g[0],g[4],g[8]]),...this.toLocalDir([g[1],g[5],g[9]]),...this.toLocalDir([g[2],g[6],g[10]])]),n=this.toLocalPoint(e.eye),u=this.model()}i.useProgram(h.program);let p=this.bindUniforms(h,["output","trail"],l);const x=h.locations;i.uniformMatrix4fv(x.uViewProj,!1,t),i.uniformMatrix4fv(x.uModel,!1,u),i.uniformMatrix3fv(x.vfxViewRot,!1,s),i.uniform3fv(x.vfxViewPosition,n),i.uniform2fv(x.uViewport,e.viewport),x.uFxExposure&&i.uniform1f(x.uFxExposure,e.exposure),x.uFxToneMap&&i.uniform1f(x.uFxToneMap,e.toneMap?1:0),x.uFxTint&&i.uniform4fv(x.uFxTint,this.tint);const w=v.trail.material;x.uProjScale&&i.uniform1f(x.uProjScale,1/e.projection[5]),x.uSystemRotation&&v.systemRotation&&i.uniformMatrix4fv(x.uSystemRotation,!1,v.systemRotation),x.uTime&&i.uniform1f(x.uTime,this.time),x.uDeltaTime&&i.uniform1f(x.uDeltaTime,1/60),x.uCameraPos&&i.uniform3fv(x.uCameraPos,e.eye),x.uRecolor&&i.uniformMatrix3fv(x.uRecolor,!1,this.recolorNow());for(const g of(w==null?void 0:w.uniforms)||[])x[g.name]&&$i(i,x[g.name],g.type,g.value,"float");const m=(g,b)=>{x[g]&&(i.activeTexture(i.TEXTURE0+p),i.bindTexture(i.TEXTURE_2D,b),i.uniform1i(x[g],p),p++)};m("uWhite",li(i));for(const g of(w==null?void 0:w.textures)||[])m(g.name,this.asset.textures.get(g.key)||li(i));if(!(w!=null&&w.blend))i.disable(i.BLEND),i.depthMask(!0);else{i.enable(i.BLEND);const g=i;i.blendFuncSeparate(g[w.blend.src]??i.SRC_ALPHA,g[w.blend.dst]??i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE),i.depthMask(!!w.depthWrite)}i.disable(i.CULL_FACE),i.activeTexture(i.TEXTURE0+p),i.bindTexture(i.TEXTURE_2D_ARRAY,f.texture),i.uniform1i(x.uTrailHistory,p),i.uniform1i(x.uTrailHead,f.head),i.uniform1i(x.uTrailCount,f.count);for(let g=0;g<f.points;g++)f.ages[g]=this.time-f.times[(f.head-g+f.points)%f.points];i.uniform1fv(x.uTrailAge,f.ages),i.bindVertexArray(o.trailVao(c.ps,this.slot)),i.drawArraysInstanced(i.TRIANGLE_STRIP,0,Vr(v.trail),l.capacity),r++}return i.bindVertexArray(null),r}dispose(){const e=this.gl;this.park();for(const t of this.states)t.trail&&e.deleteTexture(t.trail.texture);this.states.length=0,this.stateOf.clear()}stats(){return this.asset.systems.map(e=>({name:e.name,capacity:e.capacity}))}recordTrail(e,t){if(this.time-t.last<t.interval*.999)return;const i=this.gl;t.last=this.time,t.head=(t.head+1)%t.points,t.count=Math.min(t.count+1,t.points),t.times[t.head]=this.time;const o=e.sys.capacity*e.sys.slots,r=Math.floor(o/rt),s=o-r*rt,n=this.asset.pool.offset(e.ps,this.slot);i.bindBuffer(i.PIXEL_UNPACK_BUFFER,e.ps.buffers[e.ps.current]),i.bindTexture(i.TEXTURE_2D_ARRAY,t.texture),r&&i.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,t.head,rt,r,1,i.RGBA_INTEGER,i.UNSIGNED_INT,n),s&&i.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,r,t.head,s,1,1,i.RGBA_INTEGER,i.UNSIGNED_INT,n+r*rt*16),i.bindBuffer(i.PIXEL_UNPACK_BUFFER,null)}bindUniforms(e,t,i){const o=this.gl;let r=0;o.activeTexture(o.TEXTURE0),o.bindTexture(o.TEXTURE_2D,this.asset.bakeTexture),e.locations.bakedTexture&&o.uniform1i(e.locations.bakedTexture,r),r++;for(const s of t){const n=i.def.stages[s];if(n){for(const u of n.uniforms){const l=e.locations[u.name];!l||u.expr===null||$i(o,l,u.type,this.values[u.expr],this.asset.exprTypes[u.expr])}for(const u of n.textures){const l=e.locations[u.name];if(!l)continue;const c=u.expr!==null?this.values[u.expr]:null;o.activeTexture(o.TEXTURE0+r),u.type==="sampler3D"?o.bindTexture(o.TEXTURE_3D,this.asset.texture3D(c)):o.bindTexture(o.TEXTURE_2D,this.asset.textures.get(c)||ji(o)),o.uniform1i(l,r),r++}}}return r}runSpawner(e,t,i){let o=0;const r=e.def.tasks;for(let s=0;s<r.length;s++){const n=r[s];if(n.kind==="constantRate"){e.acc+=Math.max(0,Number(this.values[n.values.Rate])||0)*t*i;const u=Math.floor(e.acc);e.acc-=u,o+=u}else if(n.kind==="periodicBurst"||n.kind==="burst"){const u=n.values.nb??n.values.Count??n.values.count,l=n.values.period??n.values.delay??n.values.Delay;if(e.timers[s]===null&&(e.timers[s]=0),e.timers[s]-=t,e.timers[s]<=0){if(n.kind==="burst"&&e.timers[s]===-1/0)continue;o+=Math.max(0,Math.round(To(this.values[u])*i)),e.timers[s]=n.kind==="burst"?-1/0:Math.max(.001,To(this.values[l])||1)}}}return o}}function qr(a,e){var s,n,u;const t=e.def,i=t.output;if(a.effect.kind!=="shuriken"||t.anchor||i!=null&&i.beam||i!=null&&i.vat||i!=null&&i.trail||(s=t.spawner)!=null&&s.prewarm)return 1/0;const o=Number(t.maxLifetime);if(!(o>0)||!Number.isFinite(o))return 1/0;const r=t.spawnFromEvent?a.effect.systems[t.spawnFromEvent.system]:void 0;return o/(((n=t.spawner)==null?void 0:n.simulationSpeed)||((u=r==null?void 0:r.spawner)==null?void 0:u.simulationSpeed)||1)+.1}async function Kr(a,e,t={}){var c,h,f,v,p,x,w;const i=await(await fetch(e)).json(),o=new URL(e,((c=globalThis.location)==null?void 0:c.href)??"http://localhost/"),r=t.resolve??(m=>new URL(m,o).href),s=new Map,n=m=>{var g,b;return!!((b=(g=i.textureInfo)==null?void 0:g[m])!=null&&b.srgb)},u=new Set(i.expressions.filter(m=>m.op==="Value"&&m.type==="texture"&&m.value).map(m=>m.value));for(const m of i.systems)for(const g of[...((f=(h=m.output)==null?void 0:h.material)==null?void 0:f.textures)||[],...((x=(p=(v=m.output)==null?void 0:v.trail)==null?void 0:p.material)==null?void 0:x.textures)||[]])g.key&&u.add(g.key);await Promise.all([...u].map(async m=>{var g,b;m==="default-particle.png"?s.set(m,ji(a)):m.startsWith("missing:")?s.set(m,null):s.set(m,await us(a,r(m),n(m),!!((b=(g=i.textureInfo)==null?void 0:g[m])!=null&&b.nearest)))}));const l=new Map;for(const m of i.systems){const g=(w=m.output)==null?void 0:w.mesh;g&&!l.has(g)&&l.set(g,await(await fetch(r(g))).json())}return new jr(a,i,{textures:s,meshes:l,maxCapacity:t.maxCapacity})}function Qo(a,e){let t=null,i=null;for(const r of a.systems){const s=r.def.bounds,n=(s==null?void 0:s.center)!=null?e[s.center]:null,u=(s==null?void 0:s.size)!=null?e[s.size]:null;if(!Array.isArray(n)||!Array.isArray(u))continue;const l=n.map((h,f)=>h-u[f]/2),c=n.map((h,f)=>h+u[f]/2);t=t?t.map((h,f)=>Math.min(h,l[f])):l,i=i?i.map((h,f)=>Math.max(h,c[f])):c}if(!t||!i)return null;const o=i;return{center:t.map((r,s)=>(r+o[s])/2),size:o.map((r,s)=>r-t[s])}}function wo(a){const e={};for(const t of a)Object.assign(e,t.defines);return e}function yo(a,e,t){const i=(p,x,w)=>p.replace(new RegExp(`uniform ${x} ${w};`),`${x} ${w};`),o=(p,x)=>new RegExp(`\\b${x}\\b`).test(p),r=a.indexOf("void main() {"),s=e.indexOf("void main() {");if(r<0||s<0)throw new Error(`${t.name}: render shader without main`);let n=i(i(i(i(a,"mat3","vfxViewRot"),"vec3","vfxViewPosition"),"mat4","uModel"),"float","uVatTime");const u=t.draw.fields.filter(p=>o(a.slice(0,r),`uniform ${p.type} ${p.name};`.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"))||a.includes(`uniform ${p.type} ${p.name};`));for(const p of u)n=i(n,p.type,p.name);const l=[Ti.vsDecls,n.includes("float uTime;")||/uniform float uTime;/.test(n)?"":"float uTime;",n.includes("float uVatTime;")?"":"float uVatTime;"].filter(Boolean).join(`
`);n=n.replace(Ke,`${Ke}${l}
`);const c=[Ti.vsLoads,...u.map(p=>`  ${p.name} = ${Oi(p,"uDrawRows")};`)].join(`
`);n=n.replace("void main() {",`void main() {
${c}`);let h=i(i(i(e,"vec4","uFxTint"),"mat3","uRecolor"),"float","uTime");const f=t.draw.fields.filter(p=>t.animated.some(x=>x.name===p.name)&&e.includes(`uniform ${p.type} ${p.name};`));for(const p of f)h=i(h,p.type,p.name);const v=["  int inst = int(vRow + 0.5);","  uFxTint = uintBitsToFloat(texelFetch(uDrawRows, ivec2(uDrawFixed + 3, inst), 0));",...o(e,"uRecolor")?["  uRecolor = mat3(uintBitsToFloat(texelFetch(uDrawRows, ivec2(uDrawFixed + 4, inst), 0).xyz), uintBitsToFloat(texelFetch(uDrawRows, ivec2(uDrawFixed + 5, inst), 0).xyz), uintBitsToFloat(texelFetch(uDrawRows, ivec2(uDrawFixed + 6, inst), 0).xyz));"]:[],...o(e,"uTime")?["  uTime = uintBitsToFloat(texelFetch(uDrawRows, ivec2(uDrawFixed + 10, inst), 0).w);"]:[],...f.map(p=>`  ${p.name} = ${Oi(p,"uDrawRows")};`)].join(`
`);return h=h.replace(Ke,`${Ke}${Ti.fsDecls}
`),h=h.replace("void main() {",`void main() {
${v}`),{vs:n,fs:h}}function Zr(a){const e=[];for(const t of a)for(const i of t.textures)e.push(`uniform ${i.type} ${i.name};`);return[...new Set(e)].join(`
`)}function bo(a){const e=[];for(const t of a){for(const i of t.uniforms)e.push(`uniform ${i.type} ${i.name};`);for(const i of t.textures)e.push(`uniform ${i.type} ${i.name};`)}return[...new Set(e)].join(`
`)}function Ai(a,e){const t=Array.from({length:ni[e.type]},(i,o)=>{const r=e.offset+o;return`${a}${r>>2}.${"xyzw"[r&3]}`});return ea(e.type,t)}function ea(a,e){if(a==="bool")return`(${e[0]} != 0u)`;if(/^(uint|uvec)/.test(a))return e.length===1?e[0]:`${a}(${e.join(", ")})`;if(/^(int|ivec)/.test(a))return e.length===1?`int(${e[0]})`:`${a}(${e.map(i=>`int(${i})`).join(", ")})`;const t=e.map(i=>`uintBitsToFloat(${i})`);return t.length===1?t[0]:`${a}(${t.join(", ")})`}function Jr(a,e){const t=new Array(a.slots*4).fill("0u");for(const i of a.layout){const o=ni[i.type];for(let r=0;r<o;r++){const s=i.counter?i.counter.replace(/^__/,""):`attributes.${i.name}${o>1?`.${"xyzw"[r]}`:""}`;t[i.offset+r]=i.counter?s:i.type==="bool"?`(${s} ? 1u : 0u)`:/^(uint|uvec)/.test(i.type)?s:/^(int|ivec)/.test(i.type)?`uint(${s})`:`floatBitsToUint(${s})`}}return Array.from({length:a.slots},(i,o)=>`  ${e}${o} = uvec4(${t.slice(o*4,o*4+4).join(", ")});`).join(`
`)}function $i(a,e,t,i,o){if(i==null)return;const r=(n,u)=>{const l=new ArrayBuffer(4);return u?(new Uint32Array(l)[0]=n>>>0,new Float32Array(l)[0]):(new Float32Array(l)[0]=n,new Uint32Array(l)[0])},s=o==="uint"||o==="int";switch(t){case"float":a.uniform1f(e,s?r(i,!0):i);break;case"vec2":a.uniform2fv(e,i);break;case"vec3":a.uniform3fv(e,i);break;case"vec4":a.uniform4fv(e,i);break;case"uint":a.uniform1ui(e,s?i>>>0:r(i,!1));break;case"int":a.uniform1i(e,s?i|0:r(i,!1)|0);break;case"bool":a.uniform1i(e,i?1:0);break;case"mat4":a.uniformMatrix4fv(e,!1,i);break;case"mat3":a.uniformMatrix3fv(e,!1,i);break}}function ta(a,e){const t=a.expressions[e];if(t.op==="Value")return t.type??"float";if(/^Bitwise|ToUint$|^SystemSeed$|^FrameIndex$/.test(t.op))return"uint";if(/ToInt$/.test(t.op))return"int";if(t.op==="ExtractComponent"||/^(Abs|Sign|Min|Max|Add|Subtract|Mul|Divide)$/.test(t.op)){const i=ta(a,t.args[0]);return i==="uint"||i==="int"?i:"float"}return"float"}function To(a){return Array.isArray(a)?a[0]+Math.random()*((a[1]??a[0])-a[0]):a}function Qr(a,e){const t=new Float32Array(16);for(let i=0;i<4;i++)for(let o=0;o<4;o++){let r=0;for(let s=0;s<4;s++)r+=a[s*4+o]*e[i*4+s];t[i*4+o]=r}return t}const es=["init","update"],ts=[0,0,0],Ri=[0,0,0],is=[0,0,0],os=[0,0,0],as=[0,0,0],rs=[0,0,0];function Fi(a,e,t,i){return a[0]=e,a[1]=t,a[2]=i,a}function ss(a,e){const[t,i,o,r]=[e[0],e[1],e[2],e[3]],s=2*(i*a[2]-o*a[1]),n=2*(o*a[0]-t*a[2]),u=2*(t*a[1]-i*a[0]);return[a[0]+r*s+(i*u-o*n),a[1]+r*n+(o*s-t*u),a[2]+r*u+(t*n-i*s)]}const Xi=new WeakMap,Gi=new WeakMap,ns=(a,e)=>Xi.get(a)===e||Gi.get(a)===e;function ji(a){const e=Xi.get(a);if(e)return e;const t=64,i=new Uint8Array(t*t*4);for(let r=0;r<t;r++)for(let s=0;s<t;s++){const n=(s+.5)/t*2-1,u=(r+.5)/t*2-1,l=Math.min(1,Math.hypot(n,u));i.set([255,255,255,Math.round(Math.pow(1-l,1.6)*255)],(r*t+s)*4)}const o=a.createTexture();return a.bindTexture(a.TEXTURE_2D,o),a.texImage2D(a.TEXTURE_2D,0,a.RGBA8,t,t,0,a.RGBA,a.UNSIGNED_BYTE,i),a.generateMipmap(a.TEXTURE_2D),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.LINEAR_MIPMAP_LINEAR),Xi.set(a,o),o}function ls(a,e=16){const t=new Uint8Array(e*e*e*4);for(let o=0;o<e;o++)for(let r=0;r<e;r++)for(let s=0;s<e;s++){const[n,u,l]=[s/e,r/e,o/e].map(h=>h*Math.PI*2),c=[Math.sin(u*1.3+l)*Math.cos(n),Math.sin(l*1.7+n)*Math.cos(u),Math.sin(n*1.1+u)*Math.cos(l)];t.set([...c.map(h=>Math.round((h*.5+.5)*255)),255],((o*e+r)*e+s)*4)}const i=a.createTexture();a.bindTexture(a.TEXTURE_3D,i),a.texImage3D(a.TEXTURE_3D,0,a.RGBA8,e,e,e,0,a.RGBA,a.UNSIGNED_BYTE,t),a.texParameteri(a.TEXTURE_3D,a.TEXTURE_MIN_FILTER,a.LINEAR),a.texParameteri(a.TEXTURE_3D,a.TEXTURE_MAG_FILTER,a.LINEAR);for(const o of[a.TEXTURE_WRAP_S,a.TEXTURE_WRAP_T,a.TEXTURE_WRAP_R])a.texParameteri(a.TEXTURE_3D,o,a.REPEAT);return i}function li(a){let e=Gi.get(a);return e||(e=a.createTexture(),a.bindTexture(a.TEXTURE_2D,e),a.texImage2D(a.TEXTURE_2D,0,a.RGBA8,1,1,0,a.RGBA,a.UNSIGNED_BYTE,new Uint8Array([255,255,255,255])),Gi.set(a,e)),e}async function us(a,e,t,i=!1){const o=await createImageBitmap(await(await fetch(e)).blob(),{imageOrientation:"flipY",premultiplyAlpha:"none",colorSpaceConversion:"none"}),r=a.createTexture();return a.bindTexture(a.TEXTURE_2D,r),a.texImage2D(a.TEXTURE_2D,0,t?a.SRGB8_ALPHA8:a.RGBA8,a.RGBA,a.UNSIGNED_BYTE,o),i?(a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.NEAREST),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MAG_FILTER,a.NEAREST)):(a.generateMipmap(a.TEXTURE_2D),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.LINEAR_MIPMAP_LINEAR)),o.close(),r}const cs={enabled:!0,quality:1,maxCapacity:5e4,lights:!0,lightScale:1,cull:!0,cullRadius:6,cullPixels:3};function hs(a,e,t,i){const o=t[5]*i/2;return t[15]===1?a*o:a*o/Math.max(1e-6,e)}class fs{constructor(e){d(this,"settings",{...cs});d(this,"speed",1);d(this,"instances",[]);d(this,"assets",new Map);d(this,"pools",new Map);d(this,"lives",new Map);d(this,"once",new WeakSet);d(this,"reach",new Map);d(this,"planes",new Float32Array(24));d(this,"culled",0);d(this,"passes",0);this.gl=e}load(e,t={}){let i=this.assets.get(e);return i||(i=Kr(this.gl,e,{maxCapacity:this.settings.maxCapacity,...t}),this.assets.set(e,i),i.catch(()=>this.assets.delete(e))),i}play(e,t={}){const i=!!t.once,o=this.pools.get(e),r=(o==null?void 0:o.findIndex(n=>this.once.has(n)===i))??-1;let s;o&&r>=0?(s=o.splice(r,1)[0],s.reset(Math.random()*4294967295),s.overrides.clear()):(s=new Yr(e,{once:i}),i&&this.once.add(s)),s.position=t.position?[t.position[0],t.position[1],t.position[2]]:[0,0,0],s.rotation=t.rotation?[...t.rotation]:t.yaw!==void 0?[0,Math.sin(t.yaw/2),0,Math.cos(t.yaw/2)]:[0,0,0,1],s.scale=t.scale??1,s.tint=t.tint?[...t.tint]:[1,1,1,1],s.recolor=t.recolor?[...t.recolor]:null,s.density=Math.max(0,t.density??1);for(const[n,u]of Object.entries(t.params??{}))s.setParam(n,u);return t.life!==void 0?this.lives.set(s,t.life):this.lives.delete(s),this.instances.push(s),s}release(e){const t=this.instances.indexOf(e);if(t<0)return;this.instances.splice(t,1),this.lives.delete(e),e.park();let i=this.pools.get(e.asset);i||this.pools.set(e.asset,i=[]),i.push(e)}clear(){for(const e of this.instances)e.dispose();for(const e of this.pools.values())for(const t of e)t.dispose();this.instances.length=0,this.pools.clear(),this.lives.clear()}update(e,t){if(!this.settings.enabled||(e*=Math.max(0,this.speed),e<=0))return;const i=Math.max(0,Math.min(1,this.settings.quality)),o=t&&this.settings.cull?this.culler(t):null,r=new Set;for(const s of this.instances)r.add(s.asset);for(const s of r)s.pool.beginFrame();this.culled=0;for(const s of this.instances){const n=this.settings.visibleAt;s.veil=n?Math.max(0,Math.min(1,n(s.position[0],s.position[1],s.position[2]))):1,s.hidden=!!o&&o(s)||s.veil<=0,s.hidden?(s.idle(e),this.culled++):s.advance(e,i*s.density)}this.passes=0;for(const s of r)s.pool.simulate(n=>s.bindSimTextures(n)),this.passes+=s.pool.passes;for(const s of[...this.instances]){s.hidden||s.afterSimulate();const n=this.lives.get(s);(s.done||n!==void 0&&s.time>=n)&&this.release(s)}}culler(e){const t=vt(he(e.projection,e.view),this.planes),i=e.view,o=this.settings.cullPixels;return r=>{const s=this.reachOf(r.asset)*r.scale;if(!Number.isFinite(s))return!1;const[n,u,l]=r.position;for(let c=0;c<6;c++)if(t[c*4]*n+t[c*4+1]*u+t[c*4+2]*l+t[c*4+3]<-s)return!0;if(o>0){const c=-(i[2]*n+i[6]*u+i[10]*l+i[14]);if(c>s&&hs(s,c,e.projection,e.viewport[1])<o)return!0}return!1}}reachOf(e){let t=this.reach.get(e);if(t===void 0){if(e.effect.systems.some(i=>{var o;return((o=i.output)==null?void 0:o.beam)||i.anchor}))t=1/0;else{const i=e.bounds();t=i?Math.hypot(i.center[0],i.center[1],i.center[2])+Math.hypot(i.size[0],i.size[1],i.size[2])/2:this.settings.cullRadius,t=t*1.2+.5}this.reach.set(e,t)}return t}draw(e){var s;if(!this.settings.enabled||!this.instances.length)return 0;const t=this.gl;t.enable(t.DEPTH_TEST),t.depthFunc(t.LEQUAL);const i=he(e.projection,e.view),o=[];for(const n of this.instances)n.hidden||(o.includes(n.asset)||(o.push(n.asset),n.asset.pool.beginDraw()),n.stageDraw(e));let r=0;for(const n of o){const u=n.pool;u.uploadDraw();for(const l of n.drawOrder){if(!l.render)continue;const c=u.systemOf(l);if(c.drawActive)if((s=l.def.output)!=null&&s.beam)for(const h of this.instances)!h.hidden&&h.asset===n&&h.rowOnFor(l)&&(r+=n.drawSystem(l,c,e,i,h.slot,l.capacity,u.drawVao(c,h.slot),h.beamOf(l)));else r+=n.drawSystem(l,c,e,i,0,c.drawActive*l.capacity,u.drawVaoAll(c),null)}}for(const n of this.instances)n.hidden||(r+=n.drawTrails(e,i));return t.bindVertexArray(null),t.depthFunc(t.LESS),t.depthMask(!0),t.disable(t.BLEND),t.enable(t.CULL_FACE),t.cullFace(t.BACK),t.activeTexture(t.TEXTURE0),r}lights(e){if(!(!this.settings.enabled||!this.settings.lights))for(const t of this.instances)t.lights(e,this.settings.lightScale)}get count(){return this.instances.length}}const ds={enabled:!0,strength:1},ms=[{dir:[1,0,0],up:[0,-1,0]},{dir:[-1,0,0],up:[0,-1,0]},{dir:[0,1,0],up:[0,0,1]},{dir:[0,-1,0],up:[0,0,-1]},{dir:[0,0,1],up:[0,-1,0]},{dir:[0,0,-1],up:[0,-1,0]}];class vs{constructor(e,t=64){d(this,"texture");d(this,"fbo");d(this,"mips");d(this,"invViewProj",[]);this.gl=e,this.size=t;const i=e.createTexture(),o=e.createFramebuffer();if(!i||!o)throw new Error("env map allocation failed");this.texture=i,this.fbo=o,this.mips=Math.floor(Math.log2(t)),e.bindTexture(e.TEXTURE_CUBE_MAP,i);for(let s=0;s<6;s++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+s,0,e.RGBA16F,t,t,0,e.RGBA,e.HALF_FLOAT,null);e.texParameteri(e.TEXTURE_CUBE_MAP,e.TEXTURE_MIN_FILTER,e.LINEAR_MIPMAP_LINEAR),e.texParameteri(e.TEXTURE_CUBE_MAP,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_CUBE_MAP,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_CUBE_MAP,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.bindTexture(e.TEXTURE_CUBE_MAP,null);const r=Io(Math.PI/2,1,.1,10);for(const s of ms)this.invViewProj.push(ot(he(r,hi([0,0,0],s.dir,s.up))))}bindFace(e){const t=this.gl;t.bindFramebuffer(t.FRAMEBUFFER,this.fbo),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+e,this.texture,0),t.viewport(0,0,this.size,this.size)}finish(){const e=this.gl;e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindTexture(e.TEXTURE_CUBE_MAP,this.texture),e.generateMipmap(e.TEXTURE_CUBE_MAP),e.bindTexture(e.TEXTURE_CUBE_MAP,null)}bind(e){const t=this.gl;t.activeTexture(t.TEXTURE0+e),t.bindTexture(t.TEXTURE_CUBE_MAP,this.texture)}}const ps=30;function gs(a){const e=a.eye();if(a.target)return{focus:a.target,distance:a.distance??Math.hypot(a.target[0]-e[0],a.target[1]-e[1],a.target[2]-e[2])};const t=a.view(),i=a.distance??ps;return{focus:[e[0]-t[2]*i,e[1]-t[6]*i,e[2]-t[10]*i],distance:i}}const ti=64,xs=4096;function ws(){return{keys:new Float64Array(256),counts:new Int32Array(ti+1),tmp:[]}}function ys(a,e,t){const i=a.length;t.keys.length<i&&(t.keys=new Float64Array(i*2));const o=t.keys;let r=1/0,s=-1/0;for(let c=0;c<i;c++){const h=a[c].model,f=(h[12]-e[0])**2+(h[13]-e[1])**2+(h[14]-e[2])**2;o[c]=f,f<r&&(r=f),f>s&&(s=f)}if(!(s>r)||!Number.isFinite(s-r))return;const n=t.counts;n.fill(0);const u=ti/(s-r);for(let c=0;c<i;c++){const h=Math.max(0,Math.min(ti-1,(o[c]-r)*u|0));o[c]=h,n[h+1]++}for(let c=0;c<ti;c++)n[c+1]+=n[c];const l=t.tmp;l.length=i;for(let c=0;c<i;c++)l[n[o[c]]++]=a[c];for(let c=0;c<i;c++)a[c]=l[c];l.length=0}function Ht(a){if(a.size>xs){a.clear();return}for(const e of a.values())e.length=0}const bs={scorch:0,rust:1},Eo=15,Ao=a=>a.cutoff>0&&a.albedo&&!a.albedo.loaded?1e6:a.cutoff;function Dt(a,e=!1,t=a&&e){return`#version 300 es
layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec3 aNormal;
layout(location = 2) in vec3 aColor;
layout(location = 3) in vec2 aUv;
${t?Oo:a?`layout(location = 4) in vec4 aModel0;
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
${e?Hi:""}
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
}`}const Ro=`#version 300 es
precision highp float;
#define MAX_PER_TILE ${Ii}
#define LIGHT_TEXELS ${yt}
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
uniform vec3 uSplatTint[${Et}];
uniform float uSplatRough[${Et}];
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
${$o}
${Go}
${Ca}
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
}`;function Pt(a){return a?Ro.replace("in vec4 vShadow2;",`in vec4 vShadow2;
in vec4 vInst;`).replace(/uFadeGrey\.x/g,"vInst.z").replace(/uFadeGrey\.y/g,"vInst.w").replace(/uWear\.w/g,"vInst.y"):Ro}class Ts{constructor(e){d(this,"gl");d(this,"program");d(this,"instancedProgram");d(this,"instances",[]);d(this,"instanced",[]);d(this,"overlays",[]);d(this,"icons");d(this,"wireColor",[.15,.85,1]);d(this,"wireProgram");d(this,"nearFade",{enabled:!1,distance:6});d(this,"veil",null);d(this,"veilGround",0);d(this,"post");d(this,"clouds");d(this,"fogVolumes",new Bi);d(this,"sky");d(this,"envMap");d(this,"env",{...ds});d(this,"envKey","");d(this,"water");d(this,"time",0);d(this,"lastTime",-1);d(this,"particles");d(this,"effects");d(this,"grass");d(this,"clipY",-1e9);d(this,"dayNight",{...Xa});d(this,"timeOfDay",.2);d(this,"weather",{overcast:0,tint:[1,1,1]});d(this,"weathered",!1);d(this,"baseLighting");d(this,"overlayProgram");d(this,"skinnedProgram");d(this,"crowds",!0);d(this,"skinnedCrowds",!0);d(this,"skinnedInstancedProgram");d(this,"crowdProgram");d(this,"crowdTexture");d(this,"crowdRows",0);d(this,"crowdData",new Float32Array(0));d(this,"crowdUsed",0);d(this,"crowdSent",0);d(this,"idsOf",new WeakMap);d(this,"nextObjectId",1);d(this,"wireSkinnedProgram");d(this,"skinnedCasters",[]);d(this,"rigidCasters",[]);d(this,"cutoutCasters",[]);d(this,"cutoutGroups",[]);d(this,"lighting",{sunDir:[-.4,-.8,-.45],sunColor:[1,.95,.86],sunIntensity:3,skyColor:[.55,.65,.9],groundColor:[.3,.25,.2],ambient:.8,exposure:1});d(this,"fogColor",[.012,.016,.024]);d(this,"fogTint",null);d(this,"tinted",null);d(this,"fogRange",[60,220]);d(this,"drawCalls",0);d(this,"culling",!0);d(this,"lastReflection",null);d(this,"timers");d(this,"renderScale",1);d(this,"boxes",new WeakMap);d(this,"frame",0);d(this,"planes",new Float32Array(24));d(this,"scratchBox",new Float32Array(6));d(this,"scratchNormal",new Float32Array(9));d(this,"sorted",{frame:-1,solid:[],clear:[]});d(this,"tintScratch",new Float32Array(Et*3));d(this,"roughScratch",new Float32Array(Et));d(this,"bound",{program:null,material:null});d(this,"defaultMaterial",Ft());d(this,"white");d(this,"shadows");d(this,"lights");d(this,"boundPalette",null);d(this,"boundPaletteProgram",null);d(this,"singlesScratch",{rigid:[],skinned:[],rigidGroups:new Map,skinnedGroups:new Map});d(this,"shadowGroups",new Map);d(this,"shadowSkinnedGroups",new Map);d(this,"stagedG",[]);d(this,"stagedAt",[]);d(this,"keyCache",new WeakMap);d(this,"sortScratch",ws());d(this,"clockwise",!1);this.canvas=e;const t=e.getContext("webgl2",{antialias:!0});if(!t)throw new Error("WebGL2 is not available");this.gl=t,this.program=new O(t,Dt(!1),Pt(!1)),this.instancedProgram=new O(t,Dt(!0),Pt(!1)),this.skinnedProgram=new O(t,Dt(!1,!0),Pt(!1)),this.skinnedInstancedProgram=new O(t,Dt(!0,!0),Pt(!0)),this.crowdProgram=new O(t,Dt(!0,!1,!0),Pt(!0)),this.crowdTexture=this.makeCrowdTexture(64),this.overlayProgram=new O(t,va,pa),this.icons=new gr(t),this.wireProgram=new O(t,Fo(!1),Mo),this.wireSkinnedProgram=new O(t,Fo(!0),Mo),this.white=new ii(t),this.shadows=new ha(t,2048),this.lights=new da(t),this.post=new $a(t),this.clouds=new xa(t),this.sky=new qa(t),this.envMap=new vs(t,64),this.water=new tr(t),this.particles=new mr(t,2e5),this.effects=new fs(t),this.grass=new nr(t),this.timers=new lr(t),this.post.timers=this.timers,this.baseLighting={...this.lighting},t.enable(t.DEPTH_TEST),t.enable(t.CULL_FACE),t.cullFace(t.BACK)}resize(){const e=Math.min(window.devicePixelRatio||1,2)*Math.min(1,Math.max(.25,this.renderScale)),t=Math.floor(this.canvas.clientWidth*e),i=Math.floor(this.canvas.clientHeight*e);(this.canvas.width!==t||this.canvas.height!==i)&&(this.canvas.width=t,this.canvas.height=i),this.gl.viewport(0,0,t,i)}get aspect(){return this.canvas.width/Math.max(1,this.canvas.height)}render(e){var E,R,M,z,V;const t=this.gl;if(this.drawCalls=0,this.crowdUsed=0,this.crowdSent=0,this.frame++,this.boundPalette=null,this.canvas.width===0||this.canvas.height===0)return;const i=this.timers;i.startFrame(),ii.flush(1024*1024);const o=Math.min(1,Math.max(0,this.weather.overcast)),r=Ga(this.dayNight.enabled?this.timeOfDay:.25,this.baseLighting,this.dayNight,o,this.weather.tint);this.dayNight.enabled||o>0?(this.lighting={...this.baseLighting,sunDir:this.dayNight.enabled?r.sunDir:this.baseLighting.sunDir,sunColor:r.sunColor,sunIntensity:r.sunIntensity,skyColor:r.skyColor,groundColor:r.groundColor,ambient:r.ambient,exposure:this.baseLighting.exposure*r.exposure},this.fogColor=r.horizon,this.weathered=o>0):(this.weathered&&(this.lighting={...this.baseLighting}),this.weathered=!1,this.sky.settings.enabled&&(this.fogColor=r.horizon));const s=this.tinted;s&&this.fogColor.every((A,S)=>A===s.to[S])&&(this.fogColor=s.from);const n=this.fogTint;if(n&&n.amount>0){const A=Math.min(1,n.amount),S=this.fogColor,k=S.map((C,ae)=>C+(n.color[ae]-C)*A);this.tinted={from:S,to:k},this.fogColor=k}else this.tinted=null;if(i.begin("sky cube"),this.env.enabled){const A=[...r.sunDir,...r.sunColor,r.sunIntensity,...r.horizon,...r.zenith,...r.groundColor,this.sky.settings.sunSize,this.sky.settings.sunGlow].map(S=>S.toFixed(2)).join(",");A!==this.envKey&&(this.envKey=A,this.sky.renderEnv(this.envMap,r),this.drawCalls+=6)}i.begin("shadows");const u=gs(e);this.shadows.settings.strength>0&&this.shadowPass(u),i.begin("scene");const l=this.post.settings.enabled;l&&(this.post.resize(this.canvas.width,this.canvas.height),this.post.begin());const c=l?this.fogColor:this.fogColor.map(A=>Math.pow(Math.min(1,A*this.lighting.exposure),1/2.2));t.clearColor(c[0],c[1],c[2],1),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT);const h=e.projection(this.aspect),f=e.view(),v=e.eye(),p=this.lights.lights.length;this.effects.lights(this.lights.lights),this.lights.update(he(h,f),this.canvas.width,this.canvas.height),this.lights.lights.length=p,this.fogVolumes.prepare(vt(he(h,f),this.planes),((E=e.viewPoint)==null?void 0:E.call(e))??_o(v,u.focus,((R=e.rayStart)==null?void 0:R.call(e))??0),this.time),this.bindShared();const x=this.water.settings.enabled&&this.water.hasSurface,w=this.lastReflection!==null&&this.lastReflection.w===this.canvas.width&&this.lastReflection.h===this.canvas.height&&f.every((A,S)=>A===this.lastReflection.view[S]),m=!(this.water.settings.reflectionHalfRate&&w&&this.frame%2===1);if(x&&this.water.settings.reflections&&m){this.lastReflection={view:new Float32Array(f),w:this.canvas.width,h:this.canvas.height},i.begin("reflection");const A=this.water.mirroredView(v,u.focus),S=l?this.fogColor:this.fogColor.map(k=>Math.pow(Math.min(1,k*this.lighting.exposure),1/2.2));this.water.beginReflection(this.canvas.width,this.canvas.height,S),this.clipY=this.water.level-.02,this.drawOpaque(h,A.view,A.eye,r,!l,!0),this.clipY=-1e9,this.water.endReflection(),l?this.post.begin():(t.bindFramebuffer(t.FRAMEBUFFER,null),t.viewport(0,0,this.canvas.width,this.canvas.height))}const g=this.lastTime<0?0:Math.max(0,this.time-this.lastTime);if(this.lastTime=this.time,this.clouds.advance(g),i.begin("particles"),this.particles.settings.enabled&&this.particles.update(g),this.effects.settings.enabled&&this.effects.count&&(i.begin("effects"),this.effects.update(g,{projection:h,view:f,eye:v,viewport:[this.canvas.width,this.canvas.height],exposure:this.lighting.exposure,toneMap:!l}),this.bindShared()),this.grass.update(g),i.begin("scene"),this.drawOpaque(h,f,v,r,!l,!1),i.begin("grass"),this.grass.settings.enabled){const A=this.lighting,S=this.shadows;this.drawCalls+=this.grass.draw({projection:h,view:f,eye:v,focus:u.focus,time:this.time,sunDir:A.sunDir,sunColor:A.sunColor,sunIntensity:A.sunIntensity,skyColor:A.skyColor,groundColor:A.groundColor,ambient:A.ambient,fogColor:this.fogColor,fogRange:this.fogRange,exposure:A.exposure,toneMap:!l,lightViewProj:S.settings.strength>0?Array.from({length:oi},(k,C)=>S.viewProj(Math.min(C,S.count-1))).slice(0,S.count):[],shadowStrength:S.settings.strength})}if(i.begin("scene"),this.drawWires(h,f,!l),i.begin("water"),x&&(this.water.draw({projection:h,view:f,eye:v,time:this.time,sunDir:this.lighting.sunDir,sunColor:this.lighting.sunColor,sunIntensity:this.lighting.sunIntensity,horizon:r.horizon,zenith:r.zenith,light:.12+.88*r.day,fogColor:this.fogColor,fogRange:this.fogRange,exposure:this.lighting.exposure,toneMap:!l,width:this.canvas.width,height:this.canvas.height,depth:l?this.post.snapshotDepth():null,invViewProj:ot(he(h,f))}),this.drawCalls++),i.begin("overlays"),this.overlays.length){const A=this.overlayProgram;A.use(),A.setMat4("uProjection",h),A.setMat4("uView",f),A.setFloat("uExposure",this.lighting.exposure),A.setFloat("uToneMap",l?0:1),A.setFloat("uLight",.12+.88*r.day),t.enable(t.BLEND),t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ZERO,t.ONE),t.depthMask(!1),t.disable(t.CULL_FACE);const S=vt(he(h,f),this.planes);for(const k of this.overlays)k.onTop||k.overVeil||k.overFrame||k.mesh.count===0||this.culling&&!bt(S,vi(k.model,k.mesh.min,k.mesh.max,this.scratchBox))||(A.setMat4("uModel",k.model),A.setFloat("uAlpha",k.alpha??1),k.mesh.draw(),this.drawCalls++);t.enable(t.CULL_FACE),t.depthMask(!0),t.disable(t.BLEND)}if(this.veil){t.enable(t.BLEND),t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ZERO,t.ONE_MINUS_SRC_ALPHA),t.depthMask(!1),t.disable(t.CULL_FACE);const A=l?this.post.snapshotDepth():null;A?(t.disable(t.DEPTH_TEST),this.veil.drawScreen(A,ot(he(h,f)),v,this.lighting.exposure,6,!l,this.veilGround),t.enable(t.DEPTH_TEST)):(t.enable(t.POLYGON_OFFSET_FILL),t.polygonOffset(-1,-2),this.veil.draw(h,f,this.lighting.exposure,6,!l),t.disable(t.POLYGON_OFFSET_FILL)),this.drawCalls++,t.enable(t.CULL_FACE),t.depthMask(!0),t.disable(t.BLEND)}const b=this.overlays.filter(A=>A.overVeil&&!A.onTop&&!A.overFrame&&A.mesh.count>0);if(b.length){const A=this.overlayProgram;A.use(),A.setMat4("uProjection",h),A.setMat4("uView",f),A.setFloat("uExposure",this.lighting.exposure),A.setFloat("uToneMap",l?0:1),A.setFloat("uLight",1),t.enable(t.BLEND),t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ZERO,t.ONE_MINUS_SRC_ALPHA),t.depthMask(!1),t.disable(t.CULL_FACE);const S=vt(he(h,f),this.planes);for(const k of b)this.culling&&!bt(S,vi(k.model,k.mesh.min,k.mesh.max,this.scratchBox))||(A.setMat4("uModel",k.model),A.setFloat("uAlpha",k.alpha??1),k.mesh.draw(),this.drawCalls++);t.enable(t.CULL_FACE),t.depthMask(!0),t.disable(t.BLEND)}i.begin("particles");let F=null;if(this.particles.settings.enabled){const A=[f[0],f[4],f[8]],S=[f[1],f[5],f[9]];F=l?this.post.snapshotDepth():null,this.particles.draw({projection:h,view:f,right:A,up:S,depth:F,invProjection:ot(h),width:this.canvas.width,height:this.canvas.height,exposure:this.lighting.exposure,toneMap:!l}),this.drawCalls+=2}if(this.effects.settings.enabled&&this.effects.count&&(i.begin("effects"),this.drawCalls+=this.effects.draw({projection:h,view:f,eye:v,viewport:[this.canvas.width,this.canvas.height],exposure:this.lighting.exposure,toneMap:!l}),this.bindShared()),i.begin("overlays"),this.drawOnTop(this.overlays.filter(A=>A.onTop&&!A.overFrame),h,f,!l),l){const A=this.shadows,S=this.lighting;i.begin("post");const k=A.settings.strength>0?{shadowMaps:Array.from({length:A.count},(C,ae)=>A.texture(ae)),lightViewProj:Array.from({length:A.count},(C,ae)=>A.viewProj(ae))}:{shadowMaps:[],lightViewProj:[]};this.post.end(this.lighting.exposure,h,ot(h),{invViewProj:ot(he(h,f)),eye:v,sunDir:S.sunDir,sunRadiance:[S.sunColor[0]*S.sunIntensity,S.sunColor[1]*S.sunIntensity,S.sunColor[2]*S.sunIntensity],skyColor:r.skyColor,...k,far:this.fogRange[1],rayStart:((M=e.rayStart)==null?void 0:M.call(e))??0,viewPoint:((z=e.viewPoint)==null?void 0:z.call(e))??_o(v,u.focus,((V=e.rayStart)==null?void 0:V.call(e))??0),clouds:this.clouds,time:this.time,fogVolumes:this.fogVolumes,lights:this.lights,...this.veil?{veil:{mask:this.veil.maskTexture,cells:[this.veil.width,this.veil.height],alpha:this.veil.veilColor[3]}}:{},opaqueDepth:F}),this.drawCalls+=2}this.icons.enabled&&this.icons.count&&(i.begin("icons"),t.bindFramebuffer(t.FRAMEBUFFER,null),t.viewport(0,0,this.canvas.width,this.canvas.height),this.drawCalls+=this.icons.draw(he(h,f),this.canvas.width,this.canvas.height));const _=this.overlays.filter(A=>A.overFrame&&A.mesh.count>0);_.length&&(i.begin("overlays"),t.bindFramebuffer(t.FRAMEBUFFER,null),t.viewport(0,0,this.canvas.width,this.canvas.height),this.drawOnTop(_,h,f,!0)),i.end()}drawOnTop(e,t,i,o){if(!e.length)return;const r=this.gl,s=this.overlayProgram;s.use(),s.setMat4("uProjection",t),s.setMat4("uView",i),s.setFloat("uExposure",this.lighting.exposure),s.setFloat("uToneMap",o?1:0),s.setFloat("uLight",1),r.enable(r.BLEND),r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ZERO,r.ONE),r.disable(r.DEPTH_TEST),r.depthMask(!1),r.disable(r.CULL_FACE);for(const n of e)s.setMat4("uModel",n.model),s.setFloat("uAlpha",n.alpha??1),n.mesh.draw(),this.drawCalls++;r.enable(r.CULL_FACE),r.depthMask(!0),r.enable(r.DEPTH_TEST),r.disable(r.BLEND)}bindShared(){for(let e=0;e<oi;e++)this.shadows.bind(Math.min(e,this.shadows.count-1),e===0?1:6+e);this.lights.bind(2,3)}drawOpaque(e,t,i,o,r,s){const n=this.gl;this.sky.settings.enabled&&(s&&n.cullFace(n.BACK),this.sky.draw(ot(he(e,t)),i,o,this.lighting.exposure,r),s&&n.cullFace(n.FRONT),this.drawCalls++);const u=this.program;u.use(),this.setFrameUniforms(u,e,t,i);const l=vt(he(e,t),this.planes);this.unbind();const{solid:c,clear:h}=this.sortedInstances(),f=m=>!s||!this.culling||this.water.nearWater(m,Math.max(2,(m[4]-m[1])*1.5));this.drawSingles(c,m=>this.seen(m,l)&&f(this.boxOf(m)),e,t,i);const v=m=>m.mesh.count>0&&(!this.culling||!m.bounds||bt(l,this.groupBox(m))&&f(this.groupBox(m))),p=this.instanced.filter(m=>{var g;return!((g=m.material)!=null&&g.transparent)&&v(m)});if(p.length){const m=this.instancedProgram;m.use(),this.setFrameUniforms(m,e,t,i),this.unbind();for(const g of p)this.useMaterial(m,g.material??this.defaultMaterial),this.bindLook(m,null),this.wind(!!g.mirrored),g.mesh.draw(),this.drawCalls++;this.wind(!1)}const x=h.filter(m=>this.seen(m,l)&&f(this.boxOf(m))),w=this.instanced.filter(m=>{var g;return((g=m.material)==null?void 0:g.transparent)&&v(m)});if(x.length||w.length){if(n.enable(n.BLEND),n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE),n.depthMask(!1),n.enable(n.POLYGON_OFFSET_FILL),n.polygonOffset(-1,-4),w.length){const m=this.instancedProgram;m.use(),this.setFrameUniforms(m,e,t,i),this.unbind();for(const g of w)this.useMaterial(m,g.material),this.bindLook(m,null),this.wind(!!g.mirrored),g.mesh.draw(),this.drawCalls++;this.wind(!1)}x.length&&this.drawSingles(x,()=>!0,e,t,i,!1),n.disable(n.POLYGON_OFFSET_FILL),n.depthMask(!0),n.disable(n.BLEND)}}bindSkin(e,t){t.skin.upload(),(this.boundPalette!==t.skin||this.boundPaletteProgram!==e)&&(t.skin.bind(ht),this.boundPalette=t.skin,this.boundPaletteProgram=e),this.gl.uniform1i(e.uniform("uJointBase"),t.skinBase??0)}isSkinned(e){return!!e.skin&&e.mesh.skinned}drawSingles(e,t,i,o,r,s=!0){const{rigid:n,skinned:u,rigidGroups:l,skinnedGroups:c}=this.singlesScratch;n.length=0,u.length=0,Ht(l),Ht(c);const h=s&&this.crowds;for(const f of e){if(!t(f))continue;const v=this.isSkinned(f);if(!h||v&&!this.skinnedCrowds){(v?u:n).push(f);continue}const p=v?c:l,x=this.crowdKey(f,v),w=p.get(x);w?w.push(f):p.set(x,[f])}for(const f of l.values())f.length===1&&n.push(f[0]);for(const f of c.values())f.length===1&&u.push(f[0]);if(n.length){const f=this.program;f.use(),this.unbind();for(const v of n)this.useMaterial(f,v.material??this.defaultMaterial),this.bindLook(f,v),f.setMat4("uModel",v.model),f.setMat3("uNormal",Ji(v.model,this.scratchNormal)),this.wind(ke(v.model)),v.mesh.draw(),this.drawCalls++;this.wind(!1)}if(u.length){const f=this.skinnedProgram;f.use(),this.setFrameUniforms(f,i,o,r),this.gl.uniform1i(f.uniform("uJoints"),ht),this.unbind();for(const v of u)this.useMaterial(f,v.material??this.defaultMaterial),this.bindLook(f,v),this.bindSkin(f,v),f.setMat4("uModel",v.model),f.setMat3("uNormal",Ji(v.model,this.scratchNormal)),this.wind(ke(v.model)),v.mesh.draw(),this.drawCalls++;this.wind(!1)}this.drawCrowds(l,this.crowdProgram,i,o,r,!1),this.drawCrowds(c,this.skinnedInstancedProgram,i,o,r,!0)}idOf(e){let t=this.idsOf.get(e);return t===void 0&&(t=this.nextObjectId++,this.idsOf.set(e,t)),t}stageAll(e){let t=0;for(const i of e.values())i.length<2||(this.stagedG[t]=i,this.stagedAt[t]=this.stageCrowd(i),t++);return t}crowdKey(e,t){const i=e.tint,o=e.glow,r=e.wear,s=this.idOf(e.mesh),n=this.idOf(e.material??this.defaultMaterial),u=t?this.idOf(e.skin):0,l=ke(e.model)?1:0,c=e.emissive??1;if(!i&&!o&&!r&&c===1)return((s*4096+n)*4096+u)*2+l;const h=this.keyCache.get(e);if(h&&h.t===i&&h.g===o&&h.w===r&&h.e===c&&h.mesh===e.mesh&&h.mat===e.material&&h.skin===e.skin&&h.mirrored===l)return h.key;const f=`${s}|${n}|${u}|${l}|${i?i.join(","):""}|${o?o.join(","):""}|${r?`${r.amount},${r.kind??"scorch"},${r.scale??12}`:""}|${c===1?"":c.toFixed(3)}`;return this.keyCache.set(e,{t:i,g:o,w:r,e:c,mesh:e.mesh,mat:e.material,skin:e.skin,mirrored:l,key:f}),f}drawCrowds(e,t,i,o,r,s){for(const u of e.values())u.length>=2&&ys(u,r,this.sortScratch);const n=this.stageAll(e);if(n){this.flushCrowds(),t.use(),this.setFrameUniforms(t,i,o,r),s&&this.gl.uniform1i(t.uniform("uJoints"),ht),this.bindCrowdTexture(t),this.unbind();for(let u=0;u<n;u++){const l=this.stagedG[u],c=this.stagedAt[u],h=l[0];this.useMaterial(t,h.material??this.defaultMaterial),this.bindLook(t,h),s&&this.bindSkin(t,h),this.wind(ke(h.model)),this.gl.uniform1i(t.uniform("uCrowdBase"),c),h.mesh.drawInstances(l.length),this.drawCalls++}this.wind(!1)}}bindCrowdTexture(e){const t=this.gl;t.activeTexture(t.TEXTURE0+to),t.bindTexture(t.TEXTURE_2D,this.crowdTexture),t.uniform1i(e.uniform("uCrowd"),to)}makeCrowdTexture(e){const t=this.gl,i=t.createTexture();if(!i)throw new Error("crowd texture allocation failed");t.bindTexture(t.TEXTURE_2D,i),t.texStorage2D(t.TEXTURE_2D,1,t.RGBA32F,pt,e),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.bindTexture(t.TEXTURE_2D,null),this.crowdRows=e;const o=new Float32Array(pt*4*e);return o.set(this.crowdData.subarray(0,Math.min(this.crowdData.length,o.length))),this.crowdData=o,i}stageCrowd(e){var r;const t=e.length*fi;this.crowdData.length<this.crowdUsed+t&&(this.gl.deleteTexture(this.crowdTexture),this.crowdTexture=this.makeCrowdTexture(Math.max(this.crowdRows*2,Math.ceil((this.crowdUsed+t)/(pt*4)))),this.crowdSent=0);const i=this.crowdData,o=this.crowdUsed;for(let s=0;s<e.length;s++){const n=e[s],u=n.model,l=o+s*fi;i[l]=u[0],i[l+1]=u[4],i[l+2]=u[8],i[l+3]=u[12],i[l+4]=u[1],i[l+5]=u[5],i[l+6]=u[9],i[l+7]=u[13],i[l+8]=u[2],i[l+9]=u[6],i[l+10]=u[10],i[l+11]=u[14],i[l+12]=n.skinBase??0,i[l+13]=((r=n.wear)==null?void 0:r.seed)??0,i[l+14]=Math.min(1,Math.max(0,n.fade??1)),i[l+15]=Math.min(1,Math.max(0,n.grey??0))}return this.crowdUsed+=t,o/fi}flushCrowds(){if(this.crowdUsed<=this.crowdSent)return;const e=this.gl,t=pt*4,i=Math.floor(this.crowdSent/t),o=Math.ceil(this.crowdUsed/t);e.bindTexture(e.TEXTURE_2D,this.crowdTexture),e.texSubImage2D(e.TEXTURE_2D,0,0,i,pt,o-i,e.RGBA,e.FLOAT,this.crowdData,i*t),e.bindTexture(e.TEXTURE_2D,null),this.crowdSent=this.crowdUsed}sortedInstances(){var o;const e=this.sorted;if(e.frame===this.frame)return e;e.frame=this.frame,e.solid.length=0,e.clear.length=0;for(const r of this.instances)r.hidden||((o=r.material)!=null&&o.transparent?e.clear.push(r):e.solid.push(r));const t=new Map,i=r=>{const s=r??this.defaultMaterial;let n=t.get(s);return n===void 0&&t.set(s,n=t.size),n};return e.solid.sort((r,s)=>i(r.material)-i(s.material)),e}boxOf(e){let t=this.boxes.get(e);if(t||(t={frame:-1,box:new Float32Array(6)},this.boxes.set(e,t)),t.frame!==this.frame){const i=e.bounds??e.mesh;vi(e.model,i.min,i.max,t.box),t.frame=this.frame}return t.box}seen(e,t,i=6){return!this.culling||bt(t,this.boxOf(e),i)}groupBox(e){const t=this.scratchBox,{min:i,max:o}=e.bounds;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=o[0],t[4]=o[1],t[5]=o[2],t}unbind(){this.bound.program=null,this.bound.material=null,this.boundPalette=null}useMaterial(e,t){this.bound.program===e&&this.bound.material===t||(this.bindMaterial(e,t),this.bound.program=e,this.bound.material=t)}drawWires(e,t,i){const o=vt(he(e,t),this.planes),r=this.instances.filter(n=>n.wireframe&&!n.hidden&&this.seen(n,o));if(!r.length)return;const s=this.gl;s.depthMask(!1);for(const n of[!1,!0]){const u=r.filter(c=>this.isSkinned(c)===n);if(!u.length)continue;const l=n?this.wireSkinnedProgram:this.wireProgram;l.use(),l.setMat4("uProjection",e),l.setMat4("uView",t),l.setVec3("uColor",...this.wireColor),l.setFloat("uToneMap",i?1:0),n&&s.uniform1i(l.uniform("uJoints"),ht);for(const c of u)n&&this.bindSkin(l,c),l.setMat4("uModel",c.model),c.mesh.drawWire(),this.drawCalls++}s.depthMask(!0)}shadowPass(e){var t,i,o,r;this.shadows.setup(e.focus,this.lighting.sunDir,e.distance);for(let s=0;s<this.shadows.count;s++){if(!this.shadows.isDue(s))continue;this.shadows.begin(s);const n=this.shadows.viewProj(s),u=this.shadows.program;u.use(),u.setMat4("uLightViewProj",n);const l=vt(n,this.planes),c=this.skinnedCasters;c.length=0;const h=this.rigidCasters;h.length=0;const f=this.cutoutCasters;f.length=0;for(const w of this.instances){if(w.hidden||(t=w.material)!=null&&t.transparent)continue;const m=w.shadow??"all";if(!(m==="none"||m==="near"&&s>0||m==="mid"&&s>1)&&this.seen(w,l,4)){if((i=w.material)!=null&&i.cutoff){f.push(w);continue}if(this.isSkinned(w)){c.push(w);continue}h.push(w)}}const v=this.shadowGroups;Ht(v);for(const w of h){const m=this.crowds?this.idOf(w.mesh)*2+(ke(w.model)?1:0):-this.idOf(w),g=v.get(m);g?g.push(w):v.set(m,[w])}let p=0;for(const w of v.values()){if(w.length>1){p++;continue}if(!w.length)continue;const m=w[0];u.setMat4("uModel",m.model),this.wind(ke(m.model)),m.mesh.draw(),this.drawCalls++}if(this.wind(!1),p){const w=this.stageAll(v);this.flushCrowds();const m=this.shadows.crowdProgram;m.use(),m.setMat4("uLightViewProj",n),this.bindCrowdTexture(m);for(let g=0;g<w;g++){const b=this.stagedG[g],F=this.stagedAt[g];this.wind(ke(b[0].model)),this.gl.uniform1i(m.uniform("uCrowdBase"),F),b[0].mesh.drawInstances(b.length),this.drawCalls++}this.wind(!1)}if(h.length=0,c.length){const w=this.shadowSkinnedGroups;Ht(w);for(const b of c){const F=this.crowds&&this.skinnedCrowds?(this.idOf(b.mesh)*65536+this.idOf(b.skin))*2+(ke(b.model)?1:0):-this.idOf(b),_=w.get(F);_?_.push(b):w.set(F,[b])}const m=this.shadows.skinnedProgram;m.use(),m.setMat4("uLightViewProj",n),this.gl.uniform1i(m.uniform("uJoints"),ht);let g=0;for(const b of w.values()){if(b.length>1){g++;continue}if(!b.length)continue;const F=b[0];this.bindSkin(m,F),m.setMat4("uModel",F.model),this.wind(ke(F.model)),F.mesh.draw(),this.drawCalls++}if(g){const b=this.stageAll(w);this.flushCrowds();const F=this.shadows.skinnedInstancedProgram;F.use(),F.setMat4("uLightViewProj",n),this.gl.uniform1i(F.uniform("uJoints"),ht),this.bindCrowdTexture(F);for(let _=0;_<b;_++){const E=this.stagedG[_],R=this.stagedAt[_];this.bindSkin(F,E[0]),this.wind(ke(E[0].model)),this.gl.uniform1i(F.uniform("uCrowdBase"),R),E[0].mesh.drawInstances(E.length),this.drawCalls++}}this.wind(!1),c.length=0}const x=this.cutoutGroups;if(x.length=0,this.instanced.length){const w=this.shadows.instancedProgram;w.use(),w.setMat4("uLightViewProj",n);for(const m of this.instanced){if(m.mesh.count===0||(o=m.material)!=null&&o.transparent||this.culling&&m.bounds&&!bt(l,this.groupBox(m),4))continue;const g=m.shadow??"all";if(!(g==="none"||g==="near"&&s>0||g==="mid"&&s>1)){if((r=m.material)!=null&&r.cutoff){x.push(m);continue}this.wind(!!m.mirrored),(m.shadowMesh??m.mesh).draw(),this.drawCalls++}}this.wind(!1)}(f.length||x.length)&&this.cutoutShadows(n,f,x)}this.shadows.end(this.canvas.width,this.canvas.height)}cutoutShadows(e,t,i){const o=this.gl,r=o.isEnabled(o.CULL_FACE);let s=null;const n=(u,l)=>{l!==s&&(s=l,l.doubleSided?o.disable(o.CULL_FACE):o.enable(o.CULL_FACE),(l.albedo??this.white).bind(0),u.setFloat("uUvScale",l.uvScale),u.setFloat("uOpacity",l.opacity),u.setFloat("uCutoff",Ao(l)))};for(let u=0;u<2;u++){const l=u===0?this.shadows.cutoutProgram:this.shadows.cutoutSkinnedProgram;let c=!1;for(const h of t)this.isSkinned(h)===(u===1)&&(c||(c=!0,s=null,l.use(),l.setMat4("uLightViewProj",e),o.uniform1i(l.uniform("uAlbedo"),0),u===1&&o.uniform1i(l.uniform("uJoints"),ht)),n(l,h.material),u===1&&this.bindSkin(l,h),l.setMat4("uModel",h.model),this.wind(ke(h.model)),h.mesh.draw(),this.drawCalls++)}if(i.length){const u=this.shadows.cutoutInstancedProgram;s=null,u.use(),u.setMat4("uLightViewProj",e),o.uniform1i(u.uniform("uAlbedo"),0);for(const l of i)n(u,l.material),this.wind(!!l.mirrored),(l.shadowMesh??l.mesh).draw(),this.drawCalls++}this.wind(!1),r?o.enable(o.CULL_FACE):o.disable(o.CULL_FACE)}wind(e){e!==this.clockwise&&(this.clockwise=e,this.gl.frontFace(e?this.gl.CW:this.gl.CCW))}bindLook(e,t){const i=t==null?void 0:t.tint,o=t==null?void 0:t.glow,r=t==null?void 0:t.wear;this.gl.uniform4f(e.uniform("uTint"),i?i[0]:1,i?i[1]:1,i?i[2]:1,i?Math.min(1,Math.max(0,i[3])):0),this.gl.uniform3f(e.uniform("uGlow"),o?o[0]:0,o?o[1]:0,o?o[2]:0),this.gl.uniform1f(e.uniform("uEmissiveScale"),(t==null?void 0:t.emissive)??1),this.gl.uniform4f(e.uniform("uWear"),r?Math.min(1,Math.max(0,r.amount)):0,bs[(r==null?void 0:r.kind)??"scorch"],(r==null?void 0:r.scale)??12,(r==null?void 0:r.seed)??0),this.gl.uniform2f(e.uniform("uFadeGrey"),Math.min(1,Math.max(0,(t==null?void 0:t.fade)??1)),Math.min(1,Math.max(0,(t==null?void 0:t.grey)??0)))}bindMaterial(e,t){var r,s,n;t.doubleSided?this.gl.disable(this.gl.CULL_FACE):this.gl.enable(this.gl.CULL_FACE),(t.albedo??this.white).bind(0),this.gl.uniform1i(e.uniform("uAlbedo"),0),(t.metallicRoughness??this.white).bind(4),this.gl.uniform1i(e.uniform("uMetalRough"),4),e.setFloat("uHasMetalRough",(r=t.metallicRoughness)!=null&&r.loaded?1:0),(t.normal??this.white).bind(5),this.gl.uniform1i(e.uniform("uNormalMap"),5),e.setFloat("uHasNormal",(s=t.normal)!=null&&s.loaded?1:0),e.setVec3("uMatColor",...t.color),e.setFloat("uUvScale",t.uvScale),e.setFloat("uMetallic",t.metallic),e.setFloat("uRoughness",t.roughness),e.setVec3("uEmissive",...t.emissive),(t.emissiveMap??this.white).bind(Eo),this.gl.uniform1i(e.uniform("uEmissiveMap"),Eo),e.setFloat("uEmissiveMapState",t.emissiveMap?t.emissiveMap.loaded?1:2:0),e.setFloat("uTransparent",t.transparent?1:0),e.setFloat("uOpacity",t.opacity),e.setFloat("uCutoff",Ao(t));const i=t.fade;if(e.setFloat("uFadeDist",i?i.distance:0),i){this.gl.uniform4f(e.uniform("uFadeRect"),i.rect[0],i.rect[1],i.rect[2],i.rect[3]);const u=i.color;this.gl.uniform4f(e.uniform("uFadeColor"),u?u[0]:0,u?u[1]:0,u?u[2]:0,u?1:0)}const o=t.splat;if(e.setFloat("uNearFade",this.nearFade.enabled&&t.nearFade&&!o?this.nearFade.distance:0),e.setFloat("uSplatOn",o?1:0),o){const u=this.gl;u.activeTexture(u.TEXTURE9),u.bindTexture(u.TEXTURE_2D,o.map.texture),o.layers.bind(10),u.uniform2f(e.uniform("uSplatSize"),o.map.width,o.map.height),e.setFloat("uSplatLevelH",o.levelHeight),e.setFloat("uSplatCliff",o.cliff),e.setFloat("uSplatNoise",o.noise),e.setFloat("uSplatSharp",o.sharpness),e.setFloat("uSplatOutLayer",((n=o.outside)==null?void 0:n.layer)??0),e.setFloat("uSplatOutDist",o.outside?Math.max(.01,o.outside.distance):0);const l=o.grid&&o.grid.size>0?o.grid:null;e.setFloat("uSplatGrid",l?l.size:0),e.setFloat("uSplatGridWidth",(l==null?void 0:l.width)??.025),e.setFloat("uSplatGridOpacity",(l==null?void 0:l.opacity)??.2);const c=this.tintScratch.fill(1);for(let p=0;p<Math.min(Et,o.tints.length);p++)c.set(o.tints[p],p*3);u.uniform3fv(e.uniform("uSplatTint"),c);const h=this.roughScratch.fill(.9);for(let p=0;p<Math.min(Et,o.roughness.length);p++)h[p]=o.roughness[p];u.uniform1fv(e.uniform("uSplatRough"),h);const f=o.surface,v=!!f&&(f.bump>0||f.roughness>0);e.setFloat("uSurfOn",v?1:0),f&&v&&(f.layers.bind(12),e.setFloat("uSurfBump",Math.max(0,f.bump)),e.setFloat("uSurfRough",Math.max(0,f.roughness)))}else e.setFloat("uSurfOn",0)}setFrameUniforms(e,t,i,o){e.setMat4("uProjection",t),e.setMat4("uView",i);const r=this.lighting,s=r.sunDir,n=Math.hypot(s[0],s[1],s[2])||1;e.setVec3("uSunDir",s[0]/n,s[1]/n,s[2]/n),e.setVec3("uSunColor",...r.sunColor),e.setFloat("uSunIntensity",r.sunIntensity),e.setVec3("uSkyColor",...r.skyColor),e.setFloat("uAmbient",r.ambient),e.setVec3("uGroundColor",...r.groundColor),this.envMap.bind(6),this.gl.uniform1i(e.uniform("uEnv"),6),e.setFloat("uEnvStrength",this.env.enabled?this.env.strength:0),e.setFloat("uEnvMips",this.envMap.mips),e.setFloat("uExposure",r.exposure),e.setFloat("uToneMap",this.post.settings.enabled?0:1),e.setVec3("uFogColor",...this.fogColor),this.gl.uniform2f(e.uniform("uFogRange"),this.fogRange[0],this.fogRange[1]),e.setVec3("uEye",o[0],o[1],o[2]),e.setFloat("uClipY",this.clipY);const u=this.shadows,l=v=>2*u.halfExtent(Math.min(v,u.count-1))/u.size*1.2;this.gl.uniform3f(e.uniform("uShadowOffset"),l(0),l(1),l(2)),e.setMat4("uLightVP0",u.viewProj(0)),e.setMat4("uLightVP1",u.viewProj(Math.min(1,u.count-1))),e.setMat4("uLightVP2",u.viewProj(Math.min(2,u.count-1))),this.gl.uniform1i(e.uniform("uShadow0"),1),this.gl.uniform1i(e.uniform("uShadow1"),7),this.gl.uniform1i(e.uniform("uShadow2"),8),this.gl.uniform1i(e.uniform("uCascades"),u.count),e.setFloat("uShadowTexel",1/u.size),e.setFloat("uShadowStrength",u.settings.strength),e.setFloat("uShadowSoft",u.settings.soft?1:0),e.setFloat("uLightSize",u.settings.lightSize),this.gl.uniform1i(e.uniform("uLights"),2),this.gl.uniform1i(e.uniform("uTiles"),3),this.gl.uniform1i(e.uniform("uSplatCells"),9),this.gl.uniform1i(e.uniform("uSplatLayers"),10),this.gl.uniform1i(e.uniform("uSurfLayers"),12);const c=this.clouds.settings;this.clouds.bindCommon(e,11),e.setFloat("uCloudShadow",c.shadows?1:0);const h=this.fogVolumes,f=h.settings.shadows&&this.post.settings.enabled?h.active:0;h.bind(this.gl,e,f,Wo),e.setFloat("uFogVolShadow",f?1:0),this.gl.uniform2f(e.uniform("uTileInfo"),this.lights.tilesX,at)}}const Fo=a=>`#version 300 es
layout(location = 0) in vec3 aPosition;
uniform mat4 uProjection;
uniform mat4 uView;
uniform mat4 uModel;
${a?Hi:""}
void main() {
  gl_Position = uProjection * uView * uModel * ${a?"skinMatrix(uJointBase) * ":""}vec4(aPosition, 1.0);
  gl_Position.z -= 0.0004 * gl_Position.w;
}`,Mo=`#version 300 es
precision highp float;
uniform vec3 uColor;
uniform float uToneMap;
out vec4 outColor;
void main() {
  vec3 c = uToneMap > 0.5 ? pow(uColor, vec3(1.0 / 2.2)) : uColor;
  outColor = vec4(c, 1.0);
}`;function _o(a,e,t){const i=[e[0]-a[0],e[1]-a[1],e[2]-a[2]],o=Math.hypot(i[0],i[1],i[2])||1;return[a[0]+i[0]/o*t,a[1]+i[1]/o*t,a[2]+i[2]/o*t]}const $e=11,Lt=$e*4;function Es(a){a.enableVertexAttribArray(0),a.vertexAttribPointer(0,3,a.FLOAT,!1,Lt,0),a.enableVertexAttribArray(1),a.vertexAttribPointer(1,3,a.FLOAT,!1,Lt,12),a.enableVertexAttribArray(2),a.vertexAttribPointer(2,3,a.FLOAT,!1,Lt,24),a.enableVertexAttribArray(3),a.vertexAttribPointer(3,2,a.FLOAT,!1,Lt,36)}class Bt{constructor(e,t){d(this,"vao");d(this,"count");d(this,"min");d(this,"max");d(this,"vbo");d(this,"ibo");d(this,"indices");d(this,"skinVbo",null);d(this,"dynamic",!1);d(this,"wire",null);this.gl=e;const i=e.createVertexArray(),o=e.createBuffer(),r=e.createBuffer();if(!i||!o||!r)throw new Error("mesh allocation failed");this.vao=i,this.vbo=o,this.ibo=r,e.bindVertexArray(i),e.bindBuffer(e.ARRAY_BUFFER,o),e.bufferData(e.ARRAY_BUFFER,t.vertices,e.STATIC_DRAW),Es(e),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,r),e.bufferData(e.ELEMENT_ARRAY_BUFFER,t.indices,e.STATIC_DRAW),e.bindVertexArray(null),this.count=t.indices.length,this.indices=t.indices,[this.min,this.max]=ai(t.vertices,$e)}draw(){if(this.count===0)return;const e=this.gl;e.bindVertexArray(this.vao),e.drawElements(e.TRIANGLES,this.count,e.UNSIGNED_INT,0),e.bindVertexArray(null)}drawInstances(e){if(this.count===0||e<=0)return;const t=this.gl;t.bindVertexArray(this.vao),t.drawElementsInstanced(t.TRIANGLES,this.count,t.UNSIGNED_INT,0,e),t.bindVertexArray(null)}get skinned(){return this.skinVbo!==null}setSkin(e,t){const i=this.gl,o=Math.min(e.length,t.length)/4,r=new Float32Array(o*8);for(let s=0;s<o;s++)r.set(e.subarray(s*4,s*4+4),s*8),r.set(t.subarray(s*4,s*4+4),s*8+4);if(!this.skinVbo){const s=i.createBuffer();if(!s)throw new Error("skin buffer allocation failed");this.skinVbo=s}i.bindVertexArray(this.vao),this.bindSkin(),i.bufferData(i.ARRAY_BUFFER,r,i.STATIC_DRAW),i.bindVertexArray(null),i.bindBuffer(i.ARRAY_BUFFER,null),this.dropWire()}bindSkin(){const e=this.gl;e.bindBuffer(e.ARRAY_BUFFER,this.skinVbo),e.enableVertexAttribArray(Li),e.vertexAttribPointer(Li,4,e.FLOAT,!1,32,0),e.enableVertexAttribArray(Vi),e.vertexAttribPointer(Vi,4,e.FLOAT,!1,32,16)}setVertices(e){const t=this.gl;t.bindBuffer(t.ARRAY_BUFFER,this.vbo),this.dynamic?t.bufferSubData(t.ARRAY_BUFFER,0,e):(t.bufferData(t.ARRAY_BUFFER,e,t.DYNAMIC_DRAW),this.dynamic=!0),t.bindBuffer(t.ARRAY_BUFFER,null);const[i,o]=ai(e,$e);for(let r=0;r<3;r++)this.min[r]=i[r],this.max[r]=o[r]}setIndices(e){const t=this.gl;t.bindVertexArray(this.vao),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.ibo),t.bufferData(t.ELEMENT_ARRAY_BUFFER,e,t.DYNAMIC_DRAW),t.bindVertexArray(null),this.count=e.length,this.indices=e,this.dropWire()}drawWire(){const e=this.gl;if(!this.wire){const t=this.indices,i=new Set,o=[],r=67108864;for(let u=0;u+2<t.length;u+=3)for(const[l,c]of[[t[u],t[u+1]],[t[u+1],t[u+2]],[t[u+2],t[u]]]){const h=l<c?l*r+c:c*r+l;i.has(h)||(i.add(h),o.push(l,c))}const s=e.createVertexArray(),n=e.createBuffer();if(!s||!n)throw new Error("wireframe allocation failed");e.bindVertexArray(s),e.bindBuffer(e.ARRAY_BUFFER,this.vbo),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,3,e.FLOAT,!1,Lt,0),this.skinVbo&&this.bindSkin(),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,n),e.bufferData(e.ELEMENT_ARRAY_BUFFER,new Uint32Array(o),e.STATIC_DRAW),e.bindVertexArray(null),this.wire={vao:s,ibo:n,count:o.length}}this.wire.count&&(e.bindVertexArray(this.wire.vao),e.drawElements(e.LINES,this.wire.count,e.UNSIGNED_INT,0),e.bindVertexArray(null))}dropWire(){this.wire&&(this.gl.deleteVertexArray(this.wire.vao),this.gl.deleteBuffer(this.wire.ibo),this.wire=null)}dispose(){this.dropWire(),this.gl.deleteVertexArray(this.vao),this.gl.deleteBuffer(this.vbo),this.gl.deleteBuffer(this.ibo),this.skinVbo&&this.gl.deleteBuffer(this.skinVbo)}}class Yi{constructor(){d(this,"verts",[]);d(this,"idx",[])}quad(e,t,i,o,r,s=[[0,0],[1,0],[1,1],[0,1]]){const n=So(e,t,i),u=this.verts.length/$e;return[e,t,i,o].forEach((l,c)=>this.verts.push(l[0],l[1],l[2],n[0],n[1],n[2],r[0],r[1],r[2],s[c][0],s[c][1])),this.idx.push(u,u+1,u+2,u,u+2,u+3),this}tri(e,t,i,o,r=[[0,0],[1,0],[1,1]]){const s=So(e,t,i),n=this.verts.length/$e;return[e,t,i].forEach((u,l)=>this.verts.push(u[0],u[1],u[2],s[0],s[1],s[2],o[0],o[1],o[2],r[l][0],r[l][1])),this.idx.push(n,n+1,n+2),this}build(){return{vertices:new Float32Array(this.verts),indices:new Uint32Array(this.idx)}}}function So(a,e,t){const i=e[0]-a[0],o=e[1]-a[1],r=e[2]-a[2],s=t[0]-a[0],n=t[1]-a[1],u=t[2]-a[2],l=o*u-r*n,c=r*s-i*u,h=i*n-o*s,f=Math.hypot(l,c,h)||1;return[l/f,c/f,h/f]}function ia(a,e,t,i,o,r,s){const n=new Yi;return n.quad([a,e,r],[i,e,r],[i,o,r],[a,o,r],s),n.quad([i,e,t],[a,e,t],[a,o,t],[i,o,t],s),n.quad([i,e,r],[i,e,t],[i,o,t],[i,o,r],s),n.quad([a,e,t],[a,e,r],[a,o,r],[a,o,t],s),n.quad([a,o,r],[i,o,r],[i,o,t],[a,o,t],s),n.quad([a,e,t],[i,e,t],[i,e,r],[a,e,r],s),n.build()}const As=`function $(c, u) {
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
`;typeof self<"u"&&self.Blob&&new Blob(["URL.revokeObjectURL(import.meta.url);",As],{type:"text/javascript;charset=utf-8"});const Rs={topLow:[.54,.63,.48],topHigh:[1,1,1],step:[.96,.93,.89],cliff:[.85,.73,.65],rim:[.23,.19,.16]},Fs=2,Ms=.3,_s=.28,Ss=.34,Co=4,Cs=.3,Ye=[0,1,0,-1],qe=[-1,0,1,0],Ds=[[0,1,2,3],[1,3,0,2],[2,3,0,1],[0,2,1,3]],Ps=[[0,0,0],[3,0,1],[2,2,2]];function Do(a,e){const t=(l,c)=>{let h=l*374761393+c*668265263|0;return h=Math.imul(h^h>>>13,1274126177),((h^h>>>16)>>>0)/4294967296},i=Math.floor(a),o=Math.floor(e);let r=a-i,s=e-o;r=r*r*(3-2*r),s=s*s*(3-2*s);const n=t(i,o)+(t(i+1,o)-t(i,o))*r,u=t(i,o+1)+(t(i+1,o+1)-t(i,o+1))*r;return n+(u-n)*s}function ks(a,e,t){var x,w;const{width:i,height:o}=a,r=t??new Float32Array(i*o*4),s=0,n=o,u=0,l=i,c=a.maxStep,h=a.levelHeight,f=new Float64Array(4),v=new Uint8Array(4),p=(m,g,b)=>{for(let E=0;E<4;E++){const R=m-1+(E&1),M=g-1+(E>>1);f[E]=R>=0&&M>=0&&R<i&&M<o?a.level(R,M):NaN,v[E]=E===b?1:0}for(let E=!0;E;){E=!1;for(let R=0;R<4;R++){const M=f[R];if(!(v[R]||M!==M)){for(let z=0;z<4;z++)if(v[z]&&Math.abs(f[z]-M)<=c){v[R]=1,E=!0;break}}}}let F=0,_=0;for(let E=0;E<4;E++)v[E]&&(F+=f[E],_++);return F/Math.max(1,_)*h};for(let m=s;m<n;m++)for(let g=u;g<l;g++){const b=(m*i+g)*4,F=((x=a.sink)==null?void 0:x.call(a,g,m))??0;if((w=a.flat)!=null&&w.call(a,g,m)){const _=a.level(g,m)*h-F;r[b]=r[b+1]=r[b+2]=r[b+3]=_}else r[b]=p(g,m,3)-F,r[b+1]=p(g+1,m,2)-F,r[b+2]=p(g,m+1,1)-F,r[b+3]=p(g+1,m+1,0)-F;if(a.corner)for(let _=0;_<4;_++)r[b+_]=a.corner(g,m,_,r[b+_])}return r}function Us(a,e,t,i,o){const r=Math.min(e-1,Math.max(0,Math.floor(i))),s=Math.min(t-1,Math.max(0,Math.floor(o))),n=Math.min(1,Math.max(0,i-r)),u=Math.min(1,Math.max(0,o-s)),l=(s*e+r)*4,c=a[l]+(a[l+1]-a[l])*n,h=a[l+2]+(a[l+3]-a[l+2])*n;return c+(h-c)*u}function zs(a,e,t,i){if(!i)return a;let o=0;for(let n=0;n<t;n++)i[n]&&(o+=e[n*2+1]);const r=new Uint32Array(o);let s=0;for(let n=0;n<t;n++){if(!i[n])continue;const u=e[n*2],l=e[n*2+1];r.set(a.subarray(u,u+l),s),s+=l}return r}function Mi(a,e=.001){const t=a.vertices,i=t.length/$e;if(i===0)return;const o=new Int32Array(i),r=new Int32Array(i),s=new Int32Array(i);let n=1;for(;n<i*2;)n<<=1;const u=n-1,l=new Int32Array(n).fill(-1),c=new Int32Array(i);for(let v=0;v<i;v++){const p=v*$e,x=Math.round(t[p]/e),w=Math.round(t[p+1]/e),m=Math.round(t[p+2]/e);o[v]=x,r[v]=w,s[v]=m;let g=Math.imul(x,2654435761)^Math.imul(w,2246822519)^Math.imul(m,3266489917);for(g^=g>>>15,g=Math.imul(g,739982445),g^=g>>>12,g&=u;;){const b=l[g];if(b<0){l[g]=v;break}if(o[b]===x&&r[b]===w&&s[b]===m)break;g=g+1&u}c[v]=g}const h=new Float64Array(n*3),f=new Int32Array(n);for(let v=0;v<i;v++){const p=v*$e,x=c[v];h[x*3]+=t[p+3],h[x*3+1]+=t[p+4],h[x*3+2]+=t[p+5],f[x]++}for(let v=0;v<i;v++){const p=c[v];if(f[p]<2)continue;const x=h[p*3],w=h[p*3+1],m=h[p*3+2],g=Math.hypot(x,w,m);if(g<1e-4)continue;const b=v*$e;t[b+3]=x/g,t[b+4]=w/g,t[b+5]=m/g}}function jt(a,e,t){const i=Math.sin(a*12.9898+e*78.233+t*37.719)*43758.5453;return i-Math.floor(i)}function _i(a,e,t,i){const o=e*4,r=a[o]+(a[o+1]-a[o])*t,s=a[o+2]+(a[o+3]-a[o+2])*t;return r+(s-r)*i}class Si{constructor(){d(this,"v",[]);d(this,"idx",[])}get count(){return this.idx.length}tri(e,t,i,o,r,s,n,u,l,c,h,f,v,p,x,w){const m=s-e,g=n-t,b=u-i,F=h-e,_=f-t,E=v-i;let R=g*E-b*_,M=b*F-m*E,z=m*_-g*F;const V=Math.hypot(R,M,z)||1;R/=V,M/=V,z/=V;const A=this.v.length/$e;this.v.push(e,t,i,R,M,z,w[0],w[1],w[2],o,r,s,n,u,R,M,z,w[0],w[1],w[2],l,c,h,f,v,R,M,z,w[0],w[1],w[2],p,x),this.idx.push(A,A+1,A+2)}data(){return{vertices:new Float32Array(this.v),indices:new Uint32Array(this.idx)}}}class Ls{constructor(){d(this,"v",[]);d(this,"idx",[])}get count(){return this.idx.length}tri(e,t,i,o,r,s,n,u,l,c,h,f,v){const p=this.v.length/7;this.v.push(e,t,i,v[0],v[1],v[2],o,r,s,n,v[0],v[1],v[2],u,l,c,h,v[0],v[1],v[2],f),this.idx.push(p,p+1,p+2)}data(){return{vertices:new Float32Array(this.v),indices:new Uint32Array(this.idx)}}}function Vs(a,e,t=Rs,i={}){var ie;const o=Math.max(0,i.faceRoughness??0),r=a.width,s=a.height,n=i.corners??ks(a),u=i.region,l=u?Math.max(0,u.x0-1):0,c=u?Math.max(0,u.z0-1):0,h=u?Math.min(r,u.x1+1):r,f=u?Math.min(s,u.z1+1):s,v=h-l,p=f-c,x=new Int32Array(v*p*2),w=new Int32Array(v*p*2),m=new Int32Array(v*p*2),g=new Si,b=new Si,F=new Int32Array(v*p*2);let _=g;const E=new Si,R=new Ls,M=1/Fs,z=(T,y)=>y*r+T,V=(T,y)=>T>=0&&y>=0&&T<r&&y<s,A=(T,y)=>a.level(T,y),S=(T,y,D)=>{const L=T/Math.max(1,e),$=(y+D)%2===0?.94:1;return[(t.topLow[0]+(t.topHigh[0]-t.topLow[0])*L)*$,(t.topLow[1]+(t.topHigh[1]-t.topLow[1])*L)*$,(t.topLow[2]+(t.topHigh[2]-t.topLow[2])*L)*$]},k=(T,y,D,L,$,I,P,G,N,re)=>{(I-D)*(P-T)-(L-T)*(N-D)>=0?_.tri(T,y,D,T*M,D*M,L,$,I,L*M,I*M,P,G,N,P*M,N*M,re):_.tri(T,y,D,T*M,D*M,P,G,N,P*M,N*M,L,$,I,L*M,I*M,re)},C=(T,y,D)=>{var ge,ne;if(!V(T,y))return!1;const L=T+Ye[D],$=y+qe[D];if(!V(L,$)||(ge=a.flat)!=null&&ge.call(a,T,y)||!(((ne=a.cliff)==null?void 0:ne.call(a,T,y,L,$))??A(T,y)-A(L,$)>a.maxStep))return!1;const[I,P,G,N]=Ds[D],re=z(T,y),oe=z(L,$);return n[re*4+I]>n[oe*4+G]+1e-4||n[re*4+P]>n[oe*4+N]+1e-4},ae=(T,y,D)=>Cs*(.15+.85*jt(T,y,D+7)),ee=(T,y,D,L)=>n[z(T,y)*4+(D-T)+2*(L-y)],se=(T,y,D,L,$,I,P)=>{const G=T+L,N=y+$;if(!C(T,y,D)||!C(G,N,D))return 0;const re=Ps[$+1][L+1];if(C(T,y,re)||C(G,N,(re+2)%4))return 0;const oe=I-Ye[D],ge=P-qe[D];if(Math.abs(ee(T,y,I,P)-ee(G,N,I,P))>1e-4||Math.abs(ee(T,y,oe,ge)-ee(G,N,oe,ge))>1e-4)return 0;const ne=T+Ye[D],ve=y+qe[D];return Math.abs(ee(ne,ve,I,P)-ee(ne+L,ve+$,I,P))>1e-4?0:ae(I,P,D)},ue=(T,y,D,L,$,I,P,G,N,re,oe,ge=0,ne=1,ve=!1,Je=0)=>{const Ge=Math.max(y-G,$-P);if(ve&&o>0&&Ge>.05){ze(T,y,D,L,$,I,P,G,N,re,oe,ge,ne,Je);return}const Ce=L-T,Qe=I-D,Ae=P-y,Le=Qe*Ae*N+-Ce*Ae*re>0,xe=(T+D)*M,we=(L+I)*M;Le?(E.tri(T,y,D,xe,y*M,L,$,I,we,$*M,L,P,I,we,P*M,oe),E.tri(T,y,D,xe,y*M,L,P,I,we,P*M,T,G,D,xe,G*M,oe)):(E.tri(T,y,D,xe,y*M,L,P,I,we,P*M,L,$,I,we,$*M,oe),E.tri(T,y,D,xe,y*M,T,G,D,xe,G*M,L,P,I,we,P*M,oe))},ze=(T,y,D,L,$,I,P,G,N,re,oe,ge,ne,ve)=>{const Je=Math.hypot(L-T,I-D),Ge=Math.max(1,Math.ceil(Je/.2)),Ce=ve>0?ve:Math.max(2,Math.ceil(Math.max(y-G,$-P)/.18)),Qe=Math.hypot(N,re)||1,Ae=N/Qe,Le=re/Qe,xe=L-T,we=I-D,U=we*-1*Ae+-xe*-1*Le>0,W=(Z,ce)=>{const J=Z/Ge,pe=ce/Ce,Q=T+xe*J,de=D+we*J,De=y+($-y)*J,We=G+(P-G)*J,Pe=De+(We-De)*pe,Ve=ge+(ne-ge)*J,Re=De-We,He=Math.sin(Math.PI*pe)*Math.min(1,Math.min(Ve,1-Ve)*6)*Math.min(1,Math.max(0,Re)/.9),B=Q+de,X=Do(B*2.3,Pe*2.9)*.65+Do(B*5.1+3.7,Pe*6.3+1.3)*.35,H=o*1.6*X*He;return[Q+Ae*H,Pe,de+Le*H]},te=Z=>[(Z[0]+Z[2])*M,Z[1]*M];for(let Z=0;Z<Ge;Z++)for(let ce=0;ce<Ce;ce++){const J=W(Z,ce),pe=W(Z+1,ce),Q=W(Z+1,ce+1),de=W(Z,ce+1),[De,We]=te(J),[Pe,Ve]=te(pe),[Re,He]=te(Q),[B,X]=te(de);U?(E.tri(J[0],J[1],J[2],De,We,pe[0],pe[1],pe[2],Pe,Ve,Q[0],Q[1],Q[2],Re,He,oe),E.tri(J[0],J[1],J[2],De,We,Q[0],Q[1],Q[2],Re,He,de[0],de[1],de[2],B,X,oe)):(E.tri(J[0],J[1],J[2],De,We,Q[0],Q[1],Q[2],Re,He,pe[0],pe[1],pe[2],Pe,Ve,oe),E.tri(J[0],J[1],J[2],De,We,de[0],de[1],de[2],B,X,Q[0],Q[1],Q[2],Re,He,oe))}};for(let T=c;T<f;T++)for(let y=l;y<h;y++){const D=z(y,T),L=(T-c)*v+(y-l),$=A(y,T),I=n[D*4],P=n[D*4+1],G=n[D*4+2],N=n[D*4+3];_=(((ie=a.sink)==null?void 0:ie.call(a,y,T))??0)>0?b:g,x[L*2]=g.count,F[L*2]=b.count,w[L*2]=E.count,m[L*2]=R.count;const re=S($,y,T),oe=(ne,ve,Je,Ge,Ce,Qe,Ae,Le,xe,we)=>{let U=0,W=0,te=-1;if(V(ne,ve)){const ce=z(ne,ve);te=A(ne,ve),U=n[ce*4+xe],W=n[ce*4+we]}if(Ce<=U+1e-4&&Le<=W+1e-4)return;const Z=te<0||$-te>a.maxStep?t.cliff:t.step;ue(Je,Ce,Ge,Qe,Le,Ae,Math.min(W,Le),Math.min(U,Ce),ne-y,ve-T,Z)},ge=[C(y,T,0),C(y,T,1),C(y,T,2),C(y,T,3)];if(!ge.some(Boolean))_.tri(y,I,T,y*M,T*M,y,G,T+1,y*M,(T+1)*M,y+1,N,T+1,(y+1)*M,(T+1)*M,re),_.tri(y,I,T,y*M,T*M,y+1,N,T+1,(y+1)*M,(T+1)*M,y+1,P,T,(y+1)*M,T*M,re),oe(y,T-1,y+1,T,P,y,T,I,3,2),oe(y,T+1,y,T+1,G,y+1,T+1,N,0,1),oe(y-1,T,y,T,I,y,T+1,G,1,3),oe(y+1,T,y+1,T+1,N,y+1,T,P,2,0);else{const ne=(U,W,te,Z,ce,J,pe)=>{const Q=se(y,T,Z,ce[0],ce[1],U,W),de=se(y,T,J,pe[0],pe[1],U,W);return{x:U-Ye[Z]*Q-Ye[J]*de,y:te,z:W-qe[Z]*Q-qe[J]*de,t:0}},ve=ne(y,T,I,0,[-1,0],3,[0,-1]),Je=ne(y+1,T,P,0,[1,0],1,[0,-1]),Ge=ne(y+1,T+1,N,2,[1,0],1,[0,1]),Ce=ne(y,T+1,G,2,[-1,0],3,[0,1]),Qe=[{from:ve,to:Ce,sx:y,sz:T,sh:I,ex:y,ez:T+1,eh:G,side:3,nA:1,nB:3},{from:Ce,to:Ge,sx:y,sz:T+1,sh:G,ex:y+1,ez:T+1,eh:N,side:2,nA:0,nB:1},{from:Ge,to:Je,sx:y+1,sz:T+1,sh:N,ex:y+1,ez:T,eh:P,side:1,nA:2,nB:0},{from:Je,to:ve,sx:y+1,sz:T,sh:P,ex:y,ez:T,eh:I,side:0,nA:3,nB:2}],Ae=[];for(const U of Qe){const W=[{...U.from,t:0}];if(ge[U.side]){const B=-Ye[U.side],X=-qe[U.side];for(let H=1;H<Co;H++){const j=H/Co,Y=U.sx+(U.ex-U.sx)*j,Fe=U.sz+(U.ez-U.sz)*j,ye=ae(Y,Fe,U.side);W.push({x:Y+B*ye,y:U.sh+(U.eh-U.sh)*j,z:Fe+X*ye,t:j})}}Ae.push(...W),W.push({...U.to,t:1});const te=y+Ye[U.side],Z=T+qe[U.side];if(!ge[U.side]){oe(te,Z,U.sx,U.sz,U.sh,U.ex,U.ez,U.eh,U.nA,U.nB);continue}const ce=z(te,Z),J=Math.min(n[ce*4+U.nA],U.sh),pe=Math.min(n[ce*4+U.nB],U.eh),Q=B=>J+(pe-J)*B,de=S(A(te,Z),te,Z),De=B=>[U.sx+(U.ex-U.sx)*B,U.sz+(U.ez-U.sz)*B],We=Math.max(2,Math.ceil(Math.max(...W.map(B=>B.y-Q(B.t)))/.18));for(let B=0;B+1<W.length;B++){const X=W[B],H=W[B+1];ue(X.x,X.y,X.z,H.x,H.y,H.z,Q(H.t),Q(X.t),Ye[U.side],qe[U.side],t.cliff,X.t,H.t,!0,We);const[j,Y]=De(X.t),[Fe,ye]=De(H.t),Ie=Q(X.t),_e=Q(H.t);(Math.hypot(X.x-j,X.z-Y)>1e-6||Math.hypot(H.x-Fe,H.z-ye)>1e-6)&&(k(X.x,Ie,X.z,j,Ie,Y,Fe,_e,ye,de),k(X.x,Ie,X.z,Fe,_e,ye,H.x,_e,H.z,de))}const Pe=Ye[U.side],Ve=qe[U.side],Re=.015,He=W.map(B=>{const X=jt(B.x,B.z,1),H=jt(B.x,B.z,2),j=Ms*(.55+.9*X),Y=B.x-Pe*j,Fe=B.z-Ve*j,ye=Q(B.t),Ie=Ss*(.5+1*jt(B.x,B.z,3)),_e=B.x+Pe*Ie,Ot=B.z+Ve*Ie,sa=_e>=te&&_e<te+1&&Ot>=Z&&Ot<Z+1;return{ix:Y,iz:Fe,ih:_i(n,D,Math.min(1,Math.max(0,Y-y)),Math.min(1,Math.max(0,Fe-T)))+Re,drop:Math.min(_s*(.5+1*H),Math.max(.05,B.y-ye)),a:.45+.3*H,fx:B.x,fz:B.z,fy:ye+Re,gx:_e,gz:Ot,gy:(sa?_i(n,ce,_e-te,Ot-Z):ye)+Re}});for(let B=0;B+1<W.length;B++){const X=W[B],H=W[B+1],j=He[B],Y=He[B+1];R.tri(X.x,X.y+Re,X.z,j.a,j.ix,j.ih,j.iz,0,Y.ix,Y.ih,Y.iz,0,t.rim),R.tri(X.x,X.y+Re,X.z,j.a,Y.ix,Y.ih,Y.iz,0,H.x,H.y+Re,H.z,Y.a,t.rim);const Fe=X.x+Pe*.012,ye=X.z+Ve*.012,Ie=H.x+Pe*.012,_e=H.z+Ve*.012;R.tri(Fe,X.y,ye,j.a,Ie,H.y,_e,Y.a,Ie,H.y-Y.drop,_e,0,t.rim),R.tri(Fe,X.y,ye,j.a,Ie,H.y-Y.drop,_e,0,Fe,X.y-j.drop,ye,0,t.rim),R.tri(j.fx,j.fy,j.fz,j.a,Y.fx,Y.fy,Y.fz,Y.a,Y.gx,Y.gy,Y.gz,0,t.rim),R.tri(j.fx,j.fy,j.fz,j.a,Y.gx,Y.gy,Y.gz,0,j.gx,j.gy,j.gz,0,t.rim)}}const Le=_i(n,D,.5,.5),xe=y+.5,we=T+.5;for(let U=0;U<Ae.length;U++){const W=Ae[U],te=Ae[(U+1)%Ae.length];_.tri(xe,Le,we,xe*M,we*M,W.x,W.y,W.z,W.x*M,W.z*M,te.x,te.y,te.z,te.x*M,te.z*M,re)}}x[L*2+1]=g.count-x[L*2],F[L*2+1]=b.count-F[L*2],w[L*2+1]=E.count-w[L*2],m[L*2+1]=R.count-m[L*2]}const fe=g.data(),Te=b.data(),Ee=E.data();Mi(fe),Mi(Te),Mi(Ee);const q=R.data();if(u){const T=(D,L)=>{const $=new Uint8Array(v*p);for(let I=u.z0;I<u.z1;I++)for(let P=u.x0;P<u.x1;P++)$[(I-c)*v+(P-l)]=1;return zs(D,L,v*p,$)};fe.indices=T(fe.indices,x),Te.indices=T(Te.indices,F),Ee.indices=T(Ee.indices,w),q.indices=T(q.indices,m);const y=new Int32Array(0);return{tops:fe,beds:Te,sides:Ee,rims:q,corners:n,topRanges:y,bedRanges:y,sideRanges:y,rimRanges:y,width:r,height:s}}return{tops:fe,beds:Te,sides:Ee,rims:q,corners:n,topRanges:x,bedRanges:F,sideRanges:w,rimRanges:m,width:r,height:s}}const Yt=200;class Is{constructor(){d(this,"target",[0,0,0]);d(this,"follow",[0,0,0]);d(this,"height",1.2);d(this,"yaw",0);d(this,"pitch",18*Math.PI/180);d(this,"distance",9);d(this,"fov",50*Math.PI/180);d(this,"near",.1);d(this,"far",400);d(this,"minDistance",3);d(this,"maxDistance",30);d(this,"minPitch",-5*Math.PI/180);d(this,"maxPitch",80*Math.PI/180);d(this,"stiffness",10);d(this,"ortho",!1)}viewPoint(){return this.eyeAt(this.distance)}eye(){return this.eyeAt(this.ortho?Yt:this.distance)}eyeAt(e){const t=Math.cos(this.pitch);return[this.target[0]-Math.sin(this.yaw)*t*e,this.target[1]+Math.sin(this.pitch)*e,this.target[2]-Math.cos(this.yaw)*t*e]}rayStart(){return this.ortho?Math.max(0,Yt-this.distance):0}view(){return hi(this.eye(),this.target)}projection(e){if(!this.ortho)return Io(this.fov,e,this.near,this.far);const t=this.distance*Math.tan(this.fov/2);return Bo(-t*e,t*e,-t,t,1,Yt*3)}focusDistance(){return this.ortho?Yt:this.distance}forward(){return[Math.sin(this.yaw),0,Math.cos(this.yaw)]}right(){return[-Math.cos(this.yaw),0,Math.sin(this.yaw)]}rotate(e,t){this.yaw+=e,this.pitch=Math.min(this.maxPitch,Math.max(this.minPitch,this.pitch+t))}zoom(e){this.distance=Math.min(this.maxDistance,Math.max(this.minDistance,this.distance*e))}update(e){const t=1-Math.exp(-this.stiffness*e);this.target[0]+=(this.follow[0]-this.target[0])*t,this.target[1]+=(this.follow[1]+this.height-this.target[1])*t,this.target[2]+=(this.follow[2]-this.target[2])*t}}function Bs(a,e){const t=a.gl,o=Vs({width:e,height:e,maxStep:1,levelHeight:.5,level:()=>0},1,{topLow:[.38,.3,.16],topHigh:[.46,.37,.21],step:[.34,.27,.15],cliff:[.28,.21,.12],rim:[.12,.09,.05]}),r=Vo(0,0,0);return a.instances.push({mesh:new Bt(t,o.tops),model:r,material:Ft({roughness:.95,doubleSided:!0})}),o.sides.indices.length&&a.instances.push({mesh:new Bt(t,o.sides),model:r,material:Ft({roughness:.9,doubleSided:!0})}),o.rims.indices.length&&a.overlays.push({mesh:new ma(t,o.rims),model:r}),{size:e,heightAt:(s,n)=>Us(o.corners,e,e,s,n)}}const oa="battle-crab.settings";function Ns(){try{const a=localStorage.getItem(oa);return a?JSON.parse(a):{}}catch{return{}}}class Os{constructor(e,t){d(this,"root");d(this,"stored",Ns());d(this,"section_",null);d(this,"open_",!1);d(this,"onToggle",null);this.root=document.createElement("div"),this.root.className="settings",this.root.hidden=!0;const i=document.createElement("h2");i.textContent=t,this.root.appendChild(i),e.appendChild(this.root)}get open(){return this.open_}toggle(e=!this.open_){var t;this.open_=e,this.root.hidden=!e,(t=this.onToggle)==null||t.call(this,e)}section(e){const t=document.createElement("section"),i=document.createElement("h3");return i.textContent=e,t.appendChild(i),this.root.appendChild(t),this.section_=t,this}toggle_(e,t,i,o){const r=this.row(t),s=document.createElement("input");s.type="checkbox";const n=this.stored[e];return typeof n=="boolean"&&o(n),s.checked=i(),s.addEventListener("change",()=>{o(s.checked),this.save(e,s.checked)}),r.appendChild(s),this}slider(e,t,i,o,r,s,n,u=l=>String(Math.round(l*100)/100)){const l=this.row(t),c=document.createElement("input");c.type="range",c.min=String(i),c.max=String(o),c.step=String(r);const h=document.createElement("span");h.className="value";const f=this.stored[e];return typeof f=="number"&&n(f),c.value=String(s()),h.textContent=u(s()),c.addEventListener("input",()=>{const v=Number(c.value);n(v),h.textContent=u(v),this.save(e,v)}),l.appendChild(c),l.appendChild(h),this}choice(e,t,i,o,r){const s=this.row(t),n=document.createElement("select");for(const l of i){const c=document.createElement("option");c.value=l,c.textContent=l,n.appendChild(c)}const u=this.stored[e];return typeof u=="string"&&i.includes(u)&&r(u),n.value=o(),n.addEventListener("change",()=>{r(n.value),this.save(e,n.value)}),s.appendChild(n),this}row(e){const t=document.createElement("label"),i=document.createElement("span");return i.textContent=e,t.appendChild(i),(this.section_??this.root).appendChild(t),t}save(e,t){this.stored[e]=t;try{localStorage.setItem(oa,JSON.stringify(this.stored))}catch{}}}const $s=[1e4,2e4];function Xs(a,e,t,i){const o=e.post.settings,r=new Os(a,"Settings (Tab)"),s=[],n=m=>{const g=Ra({color:[.8,.86,.92],softness:.5,falloff:.9,noise:.7,noiseScale:5,speed:.4,direction:60,churn:.15,...m});e.fogVolumes.volumes.push(g),s.push({volume:g,density:g.density})};n({center:[i/2,.5,i/2],size:[i,1.2,i],density:.12,noiseScale:9}),n({center:[i/2+10,.9,i/2-8],size:[12,2,9],yaw:25,density:.5}),n({center:[i/2-12,.9,i/2+9],size:[10,1.8,14],yaw:-40,density:.45});let u=1;const l=()=>{for(const m of s)m.volume.density=m.density*u};let c=!0,h=25,f=110,v=-1;const p=()=>{v=t.rayStart(),e.fogRange=c?[h+v,Math.max(h+1,f)+v]:$s};p();let x=!0,w=9;return o.dof=!1,o.dofRange=3,o.dofFalloff=14,o.dofBlur=6,r.section("Camera").choice("camera.type","Projection",["perspective","orthographic"],()=>t.ortho?"orthographic":"perspective",m=>t.ortho=m==="orthographic").slider("camera.fov","Field of view",30,90,1,()=>Math.round(t.fov*180/Math.PI),m=>t.fov=m*Math.PI/180,m=>`${Math.round(m)}°`).toggle_("camera.dof","Depth of field",()=>o.dof,m=>o.dof=m).choice("camera.focus","Focus",["on the crab","by hand"],()=>x?"on the crab":"by hand",m=>x=m==="on the crab").slider("camera.focusAt","Focus distance",2,60,.5,()=>w,m=>w=m).slider("camera.focusRange","Sharp range",.5,20,.5,()=>o.dofRange,m=>o.dofRange=m).slider("camera.blur","Blur",1,16,1,()=>o.dofBlur,m=>o.dofBlur=m).section("Fog").toggle_("fog.on","Distance fog",()=>c,m=>{c=m,p()}).slider("fog.start","Starts at",5,200,1,()=>h,m=>{h=m,p()}).slider("fog.end","Thick by",20,400,1,()=>f,m=>{f=m,p()}).section("Mist").toggle_("mist.volumetric","Volumetric haze",()=>o.volumetric,m=>o.volumetric=m).slider("mist.density","Haze density",0,.06,.002,()=>o.fogDensity,m=>o.fogDensity=m,m=>m.toFixed(3)).slider("mist.height","Haze height",1,30,.5,()=>o.fogHeight,m=>o.fogHeight=m).slider("mist.shafts","Light shafts",0,1,.05,()=>o.fogSun,m=>o.fogSun=m).toggle_("mist.banks","Mist banks",()=>e.fogVolumes.settings.enabled,m=>e.fogVolumes.settings.enabled=m).slider("mist.thickness","Bank thickness",0,3,.1,()=>u,m=>{u=m,l()}),{panel:r,update(){o.dofFocus=x?t.focusDistance():w,t.rayStart()!==v&&p()}}}const Ci=.5,Gs=.26,Ws=.13,Hs=.2,Po=.1,Di=[.5,.08,.03],qt=[.42,.07,.03],ko=[.36,.24,.12],js=[.42,.29,.15],Ys=[.02,.02,.02],At=(a,e)=>[a[0]+e[0],a[1]+e[1],a[2]+e[2]],Ze=(a,e)=>[a[0]*e,a[1]*e,a[2]*e],Vt=a=>Math.hypot(a[0],a[1],a[2]),Pi=(a,e)=>Math.hypot(a[0]-e[0],a[1]-e[1],a[2]-e[2]),qs=(a,e,t)=>[a[0]+(e[0]-a[0])*t,a[1]+(e[1]-a[1])*t,a[2]+(e[2]-a[2])*t];function Tt(a,e,t){const i=Math.sin(t),o=Math.cos(t);return[e[0]+a[0]*o+a[2]*i,e[1]+a[1],e[2]-a[0]*i+a[2]*o]}function ki(a,e){return Tt(a,[0,0,0],e)}function wt(a,e,t,i,o,r,s,n=12,u=7){const l=new Yi,c=(h,f)=>{const v=h/n*Math.PI*2,p=-Math.PI/2+f/u*Math.PI,x=Math.cos(p);return[a+i*x*Math.cos(v),e+o*Math.sin(p),t+r*x*Math.sin(v)]};for(let h=0;h<u;h++)for(let f=0;f<n;f++)h===0?l.tri(c(f,0),c(f,1),c(f+1,1),s):h===u-1?l.tri(c(f,h),c(f,u),c(f+1,h),s):l.quad(c(f,h),c(f,h+1),c(f+1,h+1),c(f+1,h),s);return l.build()}function Kt(a,e,t){return ia(-e/2,0,-e/2,e/2,a,e/2,t)}function kt(a,e,t,i){const o=lt(Rt(t,e));let r=Oe(i,o);Vt(r)<1e-4&&(r=Oe([1,0,0],o)),Vt(r)<1e-4&&(r=Oe([0,0,1],o)),r=lt(r);const s=Oe(r,o);a[0]=r[0],a[1]=r[1],a[2]=r[2],a[3]=0,a[4]=o[0],a[5]=o[1],a[6]=o[2],a[7]=0,a[8]=s[0],a[9]=s[1],a[10]=s[2],a[11]=0,a[12]=e[0],a[13]=e[1],a[14]=e[2],a[15]=1}function Ks(a,e,t){const i=Math.sin(t),o=Math.cos(t);a[0]=o,a[1]=0,a[2]=-i,a[3]=0,a[4]=0,a[5]=1,a[6]=0,a[7]=0,a[8]=i,a[9]=0,a[10]=o,a[11]=0,a[12]=e[0],a[13]=e[1],a[14]=e[2],a[15]=1}function Uo(a,e,t,i,o){const r=Rt(e,a);let s=Vt(r);const n=s<1e-5?[0,-1,0]:Ze(r,1/s);s=Math.min(t+i-.001,Math.max(Math.abs(t-i)+.001,s));const u=At(a,Ze(n,s)),l=(t*t-i*i+s*s)/(2*s),c=Math.sqrt(Math.max(0,t*t-l*l));let h=Rt(o,Ze(n,Zt(o,n)));return Vt(h)<1e-4&&(h=Oe(n,[1,0,0])),Vt(h)<1e-4&&(h=Oe(n,[0,0,1])),h=lt(h),{joint:At(a,At(Ze(n,l),Ze(h,c))),end:u}}class Zs{constructor(e,t,i,o){d(this,"legs",[]);d(this,"claws",[]);d(this,"bodyModel",new Float32Array(16));d(this,"ground");d(this,"phase",0);d(this,"centre",[0,Ci,0]);this.ground=t;const r=e.gl,s=Ft({roughness:.55}),n=Ft({roughness:.85}),u=(c,h=s)=>{const f={mesh:new Bt(r,c),model:new Float32Array(16),material:h};return e.instances.push(f),f},l=(c,h=s)=>{e.instances.push({mesh:new Bt(r,c),model:this.bodyModel,material:h})};l(wt(0,0,.1,.5,.2,.42,Di)),l(wt(0,.3,-.3,.62,.52,.75,ko,14,8),n),l(wt(-.3,.62,-.75,.4,.36,.42,js,12,6),n),l(wt(-.58,.9,-.95,.22,.2,.24,ko,10,5),n);for(const c of[-1,1]){const h=[c*.14,.08,.42],f=[c*.2,.42,.55],v=new Yi,p=lt(Rt(f,h)),x=Ze(lt(Oe(p,[0,0,1])),.025),w=Ze(lt(Oe(x,p)),.025),m=(b,F,_)=>At(b,At(Ze(x,F),Ze(w,_))),g=(b,F,_,E)=>v.quad(b,F,_,E,Di);g(m(h,-1,-1),m(h,1,-1),m(f,1,-1),m(f,-1,-1)),g(m(h,1,1),m(h,-1,1),m(f,-1,1),m(f,1,1)),g(m(h,1,-1),m(h,1,1),m(f,1,1),m(f,1,-1)),g(m(h,-1,1),m(h,-1,-1),m(f,-1,-1),m(f,-1,1)),l(v.build()),l(wt(f[0],f[1],f[2],.07,.07,.07,Ys,8,5))}for(let c=0;c<3;c++)for(const h of[-1,1]){const f=.3-c*.3,v=(1-c)*.25,p=.55,x=.75;this.legs.push({hip:[h*.4,0,f],rest:[h*1.05,0,f+v],pole:[h,.9,0],l1:p,l2:x,group:(c+(h>0?1:0))%2,foot:[0,0,0],from:[0,0,0],to:[0,0,0],t:-1,upper:u(Kt(p,.09,qt)),lower:u(Kt(x,.065,qt))})}for(const c of[-1,1])this.claws.push({shoulder:[c*.3,-.05,.4],rest:[c*.5,-.3,1.05],pole:[c*.8,.5,.2],l1:.4,l2:.45,side:c,upper:u(Kt(.4,.1,qt)),lower:u(Kt(.45,.085,qt)),pincer:u(wt(0,.2,0,.15,.24,.11,Di,10,6))});this.centre=[i[0],i[1]+Ci,i[2]];for(const c of this.legs)c.foot=this.restSpot(c,o,[0,0,0]);this.pose(o,0)}restSpot(e,t,i){const o=Tt(e.rest,this.centre,t);return o[0]+=i[0]*Po,o[2]+=i[2]*Po,o[1]=this.ground(o[0],o[2]),o}update(e,t,i,o){const r=Math.hypot(o[0],o[2]);this.phase+=e*(1.5+r*3),this.centre[0]=t[0],this.centre[2]=t[2],this.centre[1]=t[1]+Ci;const s=[!1,!1];for(const u of this.legs)u.t>=0&&(s[u.group]=!0);for(const u of[0,1]){if(s[1-u]||s[u])continue;let l=!1;for(const c of this.legs){if(c.group!==u)continue;const h=this.restSpot(c,i,o),f=Tt(c.hip,this.centre,i);(Pi(c.foot,h)>Gs||Pi(c.foot,f)>(c.l1+c.l2)*.97)&&(l=!0)}if(l){for(const c of this.legs){if(c.group!==u)continue;const h=this.restSpot(c,i,o);Pi(c.foot,h)<.06||(c.from=[c.foot[0],c.foot[1],c.foot[2]],c.to=h,c.t=0)}break}}let n=0;for(const u of this.legs){if(u.t<0)continue;u.t=Math.min(1,u.t+e/Ws),u.to=this.restSpot(u,i,o);const l=u.t,c=l*l*(3-2*l);u.foot=qs(u.from,u.to,c);const h=Math.sin(l*Math.PI)*Hs;u.foot[1]+=h,n=Math.max(n,Math.sin(l*Math.PI)),l>=1&&(u.foot=u.to,u.t=-1)}this.centre[1]+=n*.03,this.pose(i,r)}pose(e,t){Ks(this.bodyModel,this.centre,e);const i=ki([0,0,1],e);for(const o of this.legs){const r=Tt(o.hip,this.centre,e),{joint:s,end:n}=Uo(r,o.foot,o.l1,o.l2,ki(o.pole,e));kt(o.upper.model,r,s,i),kt(o.lower.model,s,n,i)}for(const o of this.claws){const r=Tt(o.shoulder,this.centre,e),s=Math.sin(this.phase*2+o.side)*(.02+Math.min(.06,t*.02)),n=[o.rest[0],o.rest[1]+s,o.rest[2]+s*.5],u=Tt(n,this.centre,e),{joint:l,end:c}=Uo(r,u,o.l1,o.l2,ki(o.pole,e));kt(o.upper.model,r,l,i),kt(o.lower.model,l,c,i);const h=At(c,Rt(c,l));kt(o.pincer.model,c,h,[0,1,0])}}}class Js{constructor(e,t,i){d(this,"position");d(this,"yaw",0);d(this,"speed",3.2);d(this,"turnRate",9);d(this,"velocity",[0,0,0]);d(this,"crab");this.ground=t,this.position=[i[0],t.heightAt(i[0],i[2]),i[2]],this.crab=new Zs(e,(o,r)=>t.heightAt(o,r),this.position,this.yaw)}update(e,t){const i=Math.hypot(t[0],t[2]),o=this.position[0],r=this.position[2];if(i>1e-4){const s=t[0]/i,n=t[2]/i,u=Math.atan2(s,n),l=Math.atan2(Math.sin(u-this.yaw),Math.cos(u-this.yaw));this.yaw+=l*Math.min(1,this.turnRate*e);const c=this.speed*Math.min(1,i)*e,h=1.5;this.position[0]=Math.min(this.ground.size-h,Math.max(h,o+s*c)),this.position[2]=Math.min(this.ground.size-h,Math.max(h,r+n*c))}this.position[1]=this.ground.heightAt(this.position[0],this.position[2]),e>0&&(this.velocity[0]=(this.position[0]-o)/e,this.velocity[2]=(this.position[2]-r)/e),this.crab.update(e,this.position,this.yaw,this.velocity)}}const Nt=document.getElementById("gl"),Qs=document.getElementById("stats"),qi=document.getElementById("hint"),Ue=new Ts(Nt),nt=64,aa=Bs(Ue,nt),Xe=new Is,It=new Js(Ue,aa,[nt/2,0,nt/2]);Xe.follow=It.position;Xe.target=[It.position[0],It.position[1]+Xe.height,It.position[2]];let zo=11;const mt=()=>((zo=zo*16807%2147483647)-1)/2147483646,en=Ft({roughness:.9});for(let a=0;a<24;a++){const e=4+mt()*(nt-8),t=4+mt()*(nt-8);if(Math.hypot(e-nt/2,t-nt/2)<4)continue;const i=.6+mt()*1.4,o=.5+mt()*1.2,r=.6+mt()*1.4,s=.1+mt()*.08,n=ia(-i/2,0,-r/2,i/2,o,r/2,[s,s*.95,s*.9]);Ue.instances.push({mesh:new Bt(Ue.gl,n),model:he(Vo(e,aa.heightAt(e,t),t),ua(mt()*Math.PI)),material:en})}Ue.dayNight.enabled=!0;Ue.timeOfDay=.3;const St=Xs(document.body,Ue,Xe,nt);St.panel.onToggle=a=>{a&&Ki()&&document.exitPointerLock(),Se.clear()};const Lo=.0022,Se=new Set;window.addEventListener("keydown",a=>{if(a.code==="Tab"){a.preventDefault(),St.panel.toggle();return}St.panel.open||Se.add(a.code)});window.addEventListener("keyup",a=>Se.delete(a.code));window.addEventListener("blur",()=>Se.clear());const Ki=()=>document.pointerLockElement===Nt,ui="mouse to look · WASD to walk · wheel to zoom · Tab for settings";qi.textContent=`${ui} · click to capture the mouse`;window.addEventListener("click",a=>{if(Ki()||St.panel.open||a.target instanceof Element&&a.target.closest(".settings"))return;const e=Nt.requestPointerLock();e instanceof Promise&&e.catch(()=>qi.textContent=`${ui} (this browser will not capture the mouse)`)});document.addEventListener("pointerlockchange",()=>{qi.textContent=Ki()?`${ui} · Esc to release the mouse`:`${ui} · click to capture the mouse`});window.addEventListener("mousemove",a=>{St.panel.open||Xe.rotate(-a.movementX*Lo,a.movementY*Lo)});Nt.addEventListener("contextmenu",a=>a.preventDefault());Nt.addEventListener("wheel",a=>{Xe.zoom(a.deltaY>0?1.1:.9),a.preventDefault()},{passive:!1});function tn(){let a=0,e=0;(Se.has("KeyW")||Se.has("ArrowUp"))&&(a+=1),(Se.has("KeyS")||Se.has("ArrowDown"))&&(a-=1),(Se.has("KeyD")||Se.has("ArrowRight"))&&(e+=1),(Se.has("KeyA")||Se.has("ArrowLeft"))&&(e-=1);const t=Xe.forward(),i=Xe.right();return[t[0]*a+i[0]*e,0,t[2]*a+i[2]*e]}let Wi=performance.now(),Ui=0,zi=Wi;function ra(a){const e=Math.min(.1,(a-Wi)/1e3);Wi=a,It.update(e,tn()),Xe.update(e),St.update(),Ue.time=a/1e3,Ue.resize(),Ue.render(Xe),Ui++,a-zi>500&&(Qs.textContent=`${Math.round(Ui*1e3/(a-zi))} fps · ${Ue.drawCalls} draws`,Ui=0,zi=a),requestAnimationFrame(ra)}requestAnimationFrame(ra);
