// ─────────────────────────────────────────────────────────────────────────────
// 🌌 CONSTELLATION SHADERS (GLSL STRINGS)
// Bulletproof, high-performance GLSL shaders for nebula, star bloom, and stardust
// ─────────────────────────────────────────────────────────────────────────────

export const nebulaVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const nebulaFragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uOpacity;
  varying vec2 vUv;

  // Ultra-fast 2D hash and smooth value noise (100% driver compatible)
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  // 3-Octave Fractal Noise for Volumetric Nebula
  float fbm(vec2 p) {
    float v = 0.0;
    v += 0.5000 * noise(p); p *= 2.02;
    v += 0.2500 * noise(p); p *= 2.03;
    v += 0.1250 * noise(p);
    return v;
  }

  void main() {
    vec2 uv = vUv;

    // Slow drifting cosmic nebula clouds
    float t = uTime * 0.025;
    vec2 mouseOffset = (uMouse - 0.5) * 0.08;

    vec2 p1 = uv * 3.0 + vec2(t * 0.5, -t * 0.3) + mouseOffset;
    vec2 p2 = uv * 4.5 - vec2(t * 0.4, t * 0.6);

    float n1 = fbm(p1);
    float n2 = fbm(p2 + vec2(n1 * 0.6, -n1 * 0.5));

    // Deep space palette: Void -> Deep Violet -> Cosmic Cyan -> Stellar Magenta
    vec3 spaceVoid = vec3(0.02, 0.01, 0.04);
    vec3 deepViolet = vec3(0.28, 0.08, 0.45);
    vec3 cosmicCyan = vec3(0.02, 0.22, 0.36);
    vec3 magentaCore = vec3(0.42, 0.06, 0.38);

    vec3 col = mix(spaceVoid, deepViolet, smoothstep(0.15, 0.75, n1));
    col = mix(col, cosmicCyan, smoothstep(0.25, 0.85, n2) * 0.5);
    col += magentaCore * pow(clamp(n1 * n2, 0.0, 1.0), 2.2) * 0.8;

    // Smooth vignette around edges
    vec2 d = (vUv - 0.5) * 2.0;
    float vig = clamp(1.0 - dot(d, d) * 0.38, 0.0, 1.0);

    gl_FragColor = vec4(col * vig, uOpacity * vig);
  }
`;

export const starGlowVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const starGlowFragmentShader = /* glsl */ `
  precision highp float;

  uniform vec3 uColor;
  uniform float uIntensity;
  uniform float uHover;
  uniform float uPulse;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv - 0.5;
    float dist = length(uv) * 2.0;
    if (dist > 1.0) discard;

    // Exponential stellar bloom falloff
    float core = clamp(1.0 - dist * 1.6, 0.0, 1.0);
    float halo = exp(-dist * 3.6);

    // Subtle 4-point star spike
    float spikeX = exp(-abs(uv.x) * 20.0) * exp(-abs(uv.y) * 3.5);
    float spikeY = exp(-abs(uv.y) * 20.0) * exp(-abs(uv.x) * 3.5);
    float spikes = (spikeX + spikeY) * (0.35 + uHover * 0.5);

    float alpha = (pow(core, 2.2) * 1.4 + halo * 0.85 + spikes) * (uIntensity + uPulse * 0.3 + uHover * 0.8);
    vec3 finalColor = mix(uColor, vec3(1.0, 1.0, 1.0), core * 0.75 + uHover * 0.4);

    gl_FragColor = vec4(finalColor, clamp(alpha, 0.0, 1.0));
  }
`;

export const stardustVertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aOpacity;
  attribute vec3 aColor;

  uniform float uTime;
  uniform vec2 uMouse;

  varying vec3 vColor;
  varying float vOpacity;

  void main() {
    vColor = aColor;
    vOpacity = aOpacity;

    vec3 pos = position;

    // Depth parallax
    float depthFactor = (pos.z + 10.0) / 20.0;
    pos.x += (uMouse.x - 0.5) * depthFactor * 0.8;
    pos.y += (uMouse.y - 0.5) * depthFactor * 0.8;

    // Micro-twinkle
    float twinkle = sin(uTime * 2.2 + pos.x * 4.0 + pos.y * 6.0) * 0.2 + 0.8;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    float safeDepth = max(-mvPosition.z, 0.1);
    gl_PointSize = clamp(aSize * twinkle * (130.0 / safeDepth), 1.0, 32.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const stardustFragmentShader = /* glsl */ `
  precision highp float;

  varying vec3 vColor;
  varying float vOpacity;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord) * 2.0;
    if (dist > 1.0) discard;

    float alpha = exp(-dist * 2.8) * vOpacity;
    gl_FragColor = vec4(vColor, alpha);
  }
`;
