// 3D simplex noise by Ashima Arts / Stefan Gustavson (MIT)
const noise = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`;

export const blobVertex = /* glsl */ `
uniform float uTime;
uniform float uAmp;
uniform float uFreq;
uniform vec2 uMouse;

varying vec3 vNormal;
varying vec3 vViewPos;
varying float vNoise;

${noise}

float displace(vec3 p) {
  float t = uTime * 0.22;
  float big = snoise(p * uFreq + vec3(t, t * 0.7, -t * 0.5));
  float small = snoise(p * uFreq * 3.1 - vec3(t * 1.6)) * 0.22;
  // A bulge that follows the mouse
  vec3 toMouse = normalize(vec3(uMouse * 1.3, 1.0));
  float bulge = pow(max(dot(p, toMouse), 0.0), 7.0) * 0.45 * min(length(uMouse) + 0.25, 1.0);
  return (big + small) * uAmp + bulge;
}

void main() {
  vec3 p = normalize(position);
  float d = displace(p);
  vec3 displaced = p * (1.0 + d);

  // Rebuild the normal from two neighbouring displaced points
  vec3 t = abs(p.y) > 0.99 ? vec3(1.0, 0.0, 0.0) : normalize(cross(p, vec3(0.0, 1.0, 0.0)));
  vec3 b = normalize(cross(p, t));
  float eps = 0.012;
  vec3 q1 = normalize(p + t * eps);
  vec3 q2 = normalize(p + b * eps);
  vec3 d1 = q1 * (1.0 + displace(q1));
  vec3 d2 = q2 * (1.0 + displace(q2));
  vec3 n = normalize(cross(d1 - displaced, d2 - displaced));

  vNormal = normalize(normalMatrix * n);
  vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
  vViewPos = mv.xyz;
  vNoise = d;
  gl_Position = projectionMatrix * mv;
}
`;

export const blobFragment = /* glsl */ `
uniform float uTime;
uniform vec3 uDeep;
uniform vec3 uBody;
uniform vec3 uCrest;
uniform vec3 uRim;

varying vec3 vNormal;
varying vec3 vViewPos;
varying float vNoise;

void main() {
  vec3 N = normalize(vNormal);
  if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(-vViewPos);
  float facing = max(dot(N, V), 0.0);
  float fresnel = pow(1.0 - facing, 2.2);

  // Body colour: deep -> body, crests glow acid
  vec3 col = mix(uDeep, uBody, smoothstep(-0.35, 0.25, vNoise));
  col = mix(col, uCrest, smoothstep(0.18, 0.5, vNoise));

  // Soft key light + specular
  vec3 L = normalize(vec3(-0.5, 0.8, 0.7));
  float diff = max(dot(N, L), 0.0);
  vec3 H = normalize(L + V);
  float spec = pow(max(dot(N, H), 0.0), 60.0);
  col *= 0.35 + 0.85 * diff;

  // Oil-slick iridescence around the edges
  float phase = vNoise * 2.5 + N.y * 0.8 + uTime * 0.08;
  vec3 irid = 0.5 + 0.5 * cos(6.2831 * (phase + vec3(0.0, 0.33, 0.67)));
  col += irid * fresnel * 0.55;
  col = mix(col, uRim, fresnel * 0.55);
  col += spec * 0.9;

  gl_FragColor = vec4(col, 1.0);
}
`;

export const pointsVertex = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
attribute float aScale;
varying float vAlpha;

void main() {
  vec3 p = position;
  p.y += sin(uTime * 0.4 + position.x * 2.0) * 0.08;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aScale * 28.0 * uPixelRatio / -mv.z;
  vAlpha = smoothstep(14.0, 4.0, -mv.z);
}
`;

export const pointsFragment = /* glsl */ `
uniform vec3 uColor;
varying float vAlpha;

void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(uColor, a * vAlpha * 0.65);
}
`;
