// Monde : terrain enneigé en terrasses, forêt, place du village, lumières, nuages sur les zones verrouillées.
import * as THREE from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {prop, propParts} from './assets.js';

export const ZD = 11, ZH = 1.7;
export const COLS = [-4.9, 0, 4.9], ROWS = [2.75, -2.75];
export const HQ_ID = '0-1-1', PLAZA_ID = '0-0-1';
export const LANE_X = 2.45;
export const NZ = 6;
export const zoneZ = k => -k * ZD;
export const zoneY = k => k * ZH;
export const plotPos = id => { const [k, r, c] = id.split('-').map(Number); return new THREE.Vector3(COLS[c], zoneY(k), zoneZ(k) + ROWS[r]); };
export const ALL_PLOTS = [];
for (let k = 0; k < NZ; k++) for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++){ const id = `${k}-${r}-${c}`; if (id !== PLAZA_ID) ALL_PLOTS.push(id); }

const smooth = (e0, e1, x) => { const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };
function hash(x, z){ const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453; return s - Math.floor(s); }
function noise(x, z){
  const ix = Math.floor(x), iz = Math.floor(z), fx = x - ix, fz = z - iz;
  const u = fx * fx * (3 - 2 * fx), v = fz * fz * (3 - 2 * fz);
  const a = hash(ix, iz), b = hash(ix + 1, iz), c = hash(ix, iz + 1), d = hash(ix + 1, iz + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
const fbm = (x, z) => noise(x, z) * .6 + noise(x * 2.1, z * 2.1) * .3 + noise(x * 4.3, z * 4.3) * .1;
export const TOP_Z = zoneZ(NZ - 1) - ZD / 2;

/** Hauteur du sol (utilisée par le terrain, les arbres et les personnages). */
export function groundY(x, z){
  let h = 0;
  for (let k = 1; k < NZ; k++){ const zb = -k * ZD + ZD / 2; h += ZH * smooth(zb + .7, zb - .7, z); }
  h += smooth(TOP_Z - 2, TOP_Z - 30, z) * 16 * (.7 + .3 * fbm(x * .08, z * .08));
  const ax = Math.abs(x);
  const flat = 1 - smooth(8.2, 10.5, ax);
  h += smooth(9, 22, ax) * (3.5 + 4 * fbm(x * .1, z * .1)) + smooth(24, 45, ax) * 6;
  h += (1 - flat) * (fbm(x * .35, z * .35) - .5) * .9;
  h -= smooth(7, 20, z) * 1.2;
  return h;
}

export function createWorld(renderer){
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog('#cfe2f8', 70, 150);
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new RoomEnvironment(), .04).texture;
  scene.environmentIntensity = .25;

  const hemi = new THREE.HemisphereLight('#cfe2ff', '#7d93bd', .6); scene.add(hemi);
  const sun = new THREE.DirectionalLight('#ffeed6', 3.1);
  sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, {left: -22, right: 22, top: 22, bottom: -22, near: 1, far: 80});
  sun.shadow.bias = -.0004; sun.shadow.normalBias = .03; sun.shadow.radius = 3;
  scene.add(sun, sun.target);

  /* ---------- terrain ---------- */
  const W = 110, D = 170, geo = new THREE.PlaneGeometry(W, D, 200, 300);
  geo.rotateX(-Math.PI / 2); geo.translate(0, 0, -D / 2 + 26);
  const pos = geo.attributes.position, colors = new Float32Array(pos.count * 3);
  const snow = new THREE.Color('#e4edf9'), shade = new THREE.Color('#9fb6dc'), path = new THREE.Color('#e3d6c6'), plaza = new THREE.Color('#d5dbe8');
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++){
    const x = pos.getX(i), z = pos.getZ(i), y = groundY(x, z);
    pos.setY(i, y);
    const slope = Math.min(1, (Math.abs(groundY(x + .3, z) - y) + Math.abs(groundY(x, z + .3) - y)) * 2.2);
    c.copy(snow).lerp(shade, slope * .8 + (fbm(x * .5, z * .5) - .5) * .12);
    const vLane = Math.abs(Math.abs(x) - LANE_X) < .62 && z < 6.5 && z > TOP_Z + 1;
    const zk = Math.round(-z / ZD), hLane = zk >= 0 && zk < NZ && Math.abs(z - zoneZ(zk)) < .62 && Math.abs(x) < 7.8;
    if (vLane || hLane) c.lerp(path, .8);
    const pd = Math.hypot(x, z - ROWS[0]);
    if (pd < 2.6) c.lerp(plaza, .9 * (1 - smooth(2.2, 2.6, pd)));
    colors.set([c.r, c.g, c.b], i * 3);
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  const ground = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({vertexColors: true, roughness: .95, metalness: 0}));
  ground.receiveShadow = true; scene.add(ground);

  /* ---------- forêt (instanciée) ---------- */
  const rnd = mulberry(11);
  const treeKinds = ['tree-snow-a', 'tree-snow-b', 'tree-snow-c', 'tree'];
  const spots = treeKinds.map(() => []);
  const tryTree = (x, z, s) => {
    const ax = Math.abs(x);
    if (ax < 8.6 && z > TOP_Z - 1 && z < 7) return;
    spots[Math.floor(rnd() * (rnd() < .85 ? 3 : 4))].push([x, groundY(x, z) - .05, z, s, rnd() * 6.28]);
  };
  for (let i = 0; i < 420; i++){
    const side = rnd() < .5 ? -1 : 1;
    const x = side * (8.8 + Math.pow(rnd(), 1.3) * 40), z = 24 - rnd() * 135;
    tryTree(x, z, .9 + rnd() * 1.1);
  }
  for (let i = 0; i < 60; i++){ const x = (rnd() - .5) * 70, z = TOP_Z - 3 - rnd() * 30; tryTree(x, z, 1 + rnd()); }
  for (let i = 0; i < 40; i++){ const x = (rnd() - .5) * 30, z = 9 + rnd() * 14; tryTree(x, z, .8 + rnd() * .8); }
  const dummy = new THREE.Object3D();
  treeKinds.forEach((k, ki) => {
    const list = spots[ki]; if (!list.length) return;
    for (const part of propParts(k)){
      const im = new THREE.InstancedMesh(part.geometry, part.material, list.length);
      im.castShadow = true; im.receiveShadow = true;
      list.forEach(([x, y, z, s, r], i) => { dummy.position.set(x, y, z); dummy.rotation.set(0, r, 0); dummy.scale.setScalar(s); dummy.updateMatrix(); im.setMatrixAt(i, dummy.matrix.clone().multiply(part.matrix)); });
      scene.add(im);
    }
  });

  /* ---------- rochers & décor ---------- */
  const deco = (name, x, z, o = {}) => { const p = prop(name, {x, z, y: groundY(x, z) - (o.sink ?? 0), s: o.s ?? 1, ry: o.ry ?? rnd() * 6.28}); scene.add(p); return p; };
  for (let k = 0; k < NZ; k++){
    for (const side of [-1, 1]){
      deco(rnd() < .5 ? 'rocks-large' : 'rocks-medium', side * (9 + rnd() * 1.5), zoneZ(k) - ZD / 2 + .5, {s: .8 + rnd() * .5, sink: .3});
      deco('rocks-small', side * (8.4 + rnd()), zoneZ(k) + (rnd() - .5) * 6, {s: .7 + rnd() * .4, sink: .2});
    }
  }
  // place du village
  const pz = ROWS[0];
  const tree = deco('christmas_tree_decorated', 0, pz, {s: .55, ry: 0});
  const ring = [[1.25, .7, 'present_A_red'], [-1.2, .8, 'present_B_green'], [.9, -1.1, 'present_C_yellow'], [-1, -1.05, 'present_D_blue'], [1.5, -.2, 'present_sphere_A_red']];
  for (const [x, z, n] of ring) deco(n, x, pz + z, {s: .45});
  deco('snowman_A', -2.6, pz + 1.6, {s: .5, ry: .5});
  deco('bench', 2.4, pz + 1.8, {s: 1.1, ry: -.4});
  deco('candycane_large', -2.3, pz - 1.6, {s: .28, ry: .3});
  // lampadaires le long du chemin
  const lamps = [];
  for (let k = 0; k < NZ; k++) for (const [x, dz] of [[-LANE_X - .75, ZD / 2 - .6], [LANE_X + .75, ZD / 2 - .6], [-7.6, .75], [7.6, .75]]){
    const z = zoneZ(k) + dz; deco('lantern', x, z, {s: .75, ry: x > 0 ? -1.2 : 1.2});
    lamps.push(new THREE.Vector3(x, groundY(x, z) + 1.25, z));
  }
  const glowTex = radialTexture('rgba(255,214,140,1)', 'rgba(255,190,90,0)');
  for (const p of lamps){ const s = new THREE.Sprite(new THREE.SpriteMaterial({map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: .8})); s.position.copy(p); s.scale.setScalar(1.3); scene.add(s); }

  /* ---------- nuages sur les zones verrouillées ---------- */
  const cloudTex = cloudTexture();
  const clouds = [];
  for (let k = 1; k < NZ; k++){
    const group = []; const n = 7;
    for (let i = 0; i < n; i++){
      const m = new THREE.Sprite(new THREE.SpriteMaterial({map: cloudTex, transparent: true, depthWrite: false, opacity: .9, fog: false}));
      const x = -7.5 + (i % 4) * 5 + (rnd() - .5) * 1.2, z = zoneZ(k) + (i < 4 ? 2.4 : -2.6) + (rnd() - .5) * 1.5;
      m.position.set(x, zoneY(k) + 1.2 + rnd() * .6, z); m.scale.set(5.5 + rnd() * 2, 3.2 + rnd(), 1);
      m.userData = {bx: x, ph: rnd() * 6};
      scene.add(m); group.push(m);
    }
    clouds[k] = group;
  }

  /* ---------- neige qui tombe ---------- */
  const N = 700, sp = new Float32Array(N * 3), vel = new Float32Array(N);
  for (let i = 0; i < N; i++){ sp.set([(rnd() - .5) * 44, rnd() * 24, (rnd() - .5) * 44], i * 3); vel[i] = .7 + rnd(); }
  const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
  const flakes = new THREE.Points(sg, new THREE.PointsMaterial({size: .16, map: radialTexture('rgba(255,255,255,1)', 'rgba(255,255,255,0)'), transparent: true, depthWrite: false, color: '#ffffff'}));
  scene.add(flakes);

  function update(t, dt, focus, openZones){
    sun.position.set(focus.x - 9, focus.y + 18, focus.z + 12); sun.target.position.copy(focus);
    for (let k = 1; k < NZ; k++){
      const open = openZones > k;
      for (const m of clouds[k]){
        const target = open ? 0 : .88;
        m.material.opacity += (target - m.material.opacity) * Math.min(1, dt * 1.5);
        m.position.x = m.userData.bx + Math.sin(t * .15 + m.userData.ph) * .8 + (open ? (m.userData.bx > 0 ? 1 : -1) * (1 - m.material.opacity) * 12 : 0);
        m.visible = m.material.opacity > .01;
      }
    }
    const a = sg.attributes.position.array;
    for (let i = 0; i < N; i++){
      a[i * 3 + 1] -= vel[i] * dt; a[i * 3] += Math.sin(t * .7 + i) * dt * .25;
      if (a[i * 3 + 1] < 0){ a[i * 3 + 1] = 24; }
    }
    sg.attributes.position.needsUpdate = true; flakes.position.set(focus.x, focus.y - 4, focus.z - 4);
    tree.rotation.y = Math.sin(t * .2) * .05;
  }

  return {scene, sun, update};
}

export function mulberry(seed){ return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

export function radialTexture(inner, outer){
  const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d');
  const g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, inner); g.addColorStop(1, outer);
  x.fillStyle = g; x.fillRect(0, 0, 64, 64); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function cloudTexture(){
  const c = document.createElement('canvas'); c.width = 256; c.height = 160; const x = c.getContext('2d');
  const R = mulberry(5);
  for (let i = 0; i < 14; i++){
    const cx = 50 + R() * 156, cy = 70 + R() * 40, r = 30 + R() * 36;
    const g = x.createRadialGradient(cx, cy - r * .3, r * .1, cx, cy, r);
    g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.7, 'rgba(240,246,255,.95)'); g.addColorStop(1, 'rgba(225,236,252,0)');
    x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.fill();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
