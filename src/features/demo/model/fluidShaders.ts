/** Soft, folded membranes lit from within. No external textures or models. */
export const fluidVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uLayer;
  varying vec3 vPosition;
  varying vec3 vViewPosition;
  void main() {
    float t = uTime * 0.42 + uLayer * 1.6;
    vec3 p = position;
    float fold = sin(p.y * 4.0 + t + sin(p.x * 3.0 - t)) * 0.16;
    fold += cos(p.z * 5.0 - t * 0.7 + p.x * 2.0) * 0.1;
    p *= 1.0 + fold;
    p.x += sin(p.y * 3.0 + t) * 0.12;
    p.y += sin(p.z * 3.0 - t) * 0.1;
    vPosition = p;
    vec4 view = modelViewMatrix * vec4(p, 1.0);
    vViewPosition = view.xyz;
    gl_Position = projectionMatrix * view;
  }
`;

export const fluidFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uLayer;
  varying vec3 vPosition;
  varying vec3 vViewPosition;
  void main() {
    vec3 normal = normalize(cross(dFdx(vViewPosition), dFdy(vViewPosition)));
    vec3 view = normalize(-vViewPosition);
    float facing = abs(dot(normal, view));
    float rim = pow(1.0 - facing, 2.2);
    float light = pow(max(dot(normal, normalize(vec3(-0.4, 0.8, 1.0))), 0.0), 5.0);
    float flow = sin(vPosition.y * 8.0 + vPosition.x * 3.0 - uTime * 0.5 + uLayer);
    float vein = pow(0.5 + 0.5 * flow, 18.0);
    vec3 sage = vec3(0.31, 0.62, 0.49);
    vec3 pearl = vec3(0.94, 0.97, 0.83);
    vec3 amber = vec3(0.88, 0.47, 0.24);
    vec3 color = mix(sage, pearl, rim * 0.8 + light * 0.6);
    color += pearl * vein * 0.2;
    color += amber * pow(max(-normal.x, 0.0), 6.0) * 0.25;
    float alpha = 0.12 + rim * 0.64 + light * 0.22 + vein * 0.12;
    gl_FragColor = vec4(color, alpha * (uLayer > 0.5 ? 0.6 : 1.0));
  }
`;
