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
  scene.background = skyTexture();
  scene.fog = new THREE.Fog('#bcd6f5', 110, 280);
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new RoomEnvironment(), .04).texture;
  scene.environmentIntensity = .26;

  // lumière : soleil chaud et rasant + ciel froid -> contraste chaud/froid et relief
  const hemi = new THREE.HemisphereLight('#b7d2ff', '#4f6398', .42); scene.add(hemi);
  const sun = new THREE.DirectionalLight('#fff0dc', 3.8);
  sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, {left: -20, right: 20, top: 20, bottom: -20, near: 1, far: 80});
  sun.shadow.bias = -.0003; sun.shadow.normalBias = .025; sun.shadow.radius = 4;
  scene.add(sun, sun.target);
  const fill = new THREE.DirectionalLight('#8fb6ff', .5); scene.add(fill, fill.target);

  /* ---------- terrain ---------- */
  const W = 110, D = 170, geo = new THREE.PlaneGeometry(W, D, 200, 300);
  geo.rotateX(-Math.PI / 2); geo.translate(0, 0, -D / 2 + 26);
  const pos = geo.attributes.position, colors = new Float32Array(pos.count * 3);
  const snow = new THREE.Color('#eef4fc'), shade = new THREE.Color('#8ea8d6'), blue = new THREE.Color('#cfdff0'), path = new THREE.Color('#cdb9a2'), plaza = new THREE.Color('#c9cfdc');
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++){
    const x = pos.getX(i), z = pos.getZ(i), y = groundY(x, z);
    pos.setY(i, y);
    const slope = Math.min(1, (Math.abs(groundY(x + .3, z) - y) + Math.abs(groundY(x, z + .3) - y)) * 2.2);
    c.copy(snow).lerp(blue, Math.min(1, Math.max(0, fbm(x * .16 + 3, z * .16) - .3) * 2.2)).lerp(shade, Math.min(1, slope * .95));
    const vLane = Math.abs(Math.abs(x) - LANE_X) < .62 && z < 6.5 && z > TOP_Z + 1;
    const zk = Math.round(-z / ZD), hLane = zk >= 0 && zk < NZ && Math.abs(z - zoneZ(zk)) < .62 && Math.abs(x) < 7.8;
    const pd = Math.hypot(x, z - ROWS[0]);
    if (pd < 2.6) c.lerp(plaza, .9 * (1 - smooth(2.2, 2.6, pd)));
    colors.set([c.r, c.g, c.b], i * 3);
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  const [snowMap, snowNormal] = snowTextures();
  const ground = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({vertexColors: true, map: snowMap, normalMap: snowNormal, normalScale: new THREE.Vector2(.9, .9), roughness: .78, metalness: 0}));
  ground.receiveShadow = true; scene.add(ground);

  /* ---------- chemins pavés ---------- */
  const cobble = cobbleTexture();
  const pathMat = new THREE.MeshStandardMaterial({map: cobble, roughness: .9, polygonOffset: true, polygonOffsetFactor: -2});
  const ribbon = pts => {
    const w = .55, verts = [], uvs = [], idx = []; let len = 0;
    pts.forEach(([x, z], i) => {
      const [nx, nz] = i < pts.length - 1 ? [pts[i + 1][0] - x, pts[i + 1][1] - z] : [x - pts[i - 1][0], z - pts[i - 1][1]];
      const l = Math.hypot(nx, nz), px = -nz / l * w, pz = nx / l * w;
      if (i) len += Math.hypot(x - pts[i - 1][0], z - pts[i - 1][1]);
      for (const sgn of [-1, 1]){ const vx = x + px * sgn, vz = z + pz * sgn; verts.push(vx, groundY(vx, vz) + .04, vz); uvs.push((sgn + 1) / 2, len / 1.24); }
      if (i){ const a = (i - 1) * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    });
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2)); g.setIndex(idx); g.computeVertexNormals();
    const m = new THREE.Mesh(g, pathMat); m.receiveShadow = true; scene.add(m);
  };
  for (const lx of [-LANE_X, LANE_X]){ const pts = []; for (let z = 7; z >= TOP_Z + 1; z -= .5) pts.push([lx, z]); ribbon(pts); }
  { const pts = []; for (let z = -.6; z <= .9; z += .5) pts.push([0, z]); ribbon(pts); }
  for (let k = 0; k < NZ; k++){ for (const [a, b] of [[-7.8, -LANE_X - .6], [LANE_X + .6, 7.8], [-LANE_X + .6, LANE_X - .6]]){ const pts = []; for (let x = a; x <= b + .01; x += .5) pts.push([x, zoneZ(k)]); ribbon(pts); } }

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
  // clôtures au bord des terrasses, buissons et tas de neige pour remplir le décor
  for (let k = 0; k < NZ; k++){
    const fz = zoneZ(k) + ZD / 2 - .35;
    for (const [a, b] of [[-8.4, -LANE_X - .9], [LANE_X + .9, 8.4], [-LANE_X + .9, LANE_X - .9]]) for (let x = a; x + 1.1 <= b + .05; x += 1.1) deco('cabin-fence', x + 1.1, fz, {ry: 0, s: 1});
    for (const side of [-1, 1]){
      for (const [dz, kind, sc] of [[3.6, 'tree', .95], [1.4, 'tree-snow-b', .8], [-1.6, 'tree', .85], [-3.6, 'tree-snow-a', .9]]) deco(kind, side * (7.75 + rnd() * .3), zoneZ(k) + dz, {s: sc});
      deco('snow-pile', side * 7.6, zoneZ(k) - 4.5, {s: 1.3});
      deco('snow-pile', side * 1.2, zoneZ(k) + 4.9, {s: 1});
    }
  }
  // étang gelé et patineurs au premier plan
  const pondZ = 12, pondX = -4.5;
  const ice = new THREE.Mesh(new THREE.CircleGeometry(3.4, 48), new THREE.MeshStandardMaterial({color: '#bfe3ff', roughness: .08, metalness: .25, envMapIntensity: 1.6}));
  ice.rotation.x = -Math.PI / 2; ice.scale.set(1.4, 1, 1); ice.position.set(pondX, groundY(pondX, pondZ) + .05, pondZ); ice.receiveShadow = true; scene.add(ice);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(3.4, .22, 8, 48), new THREE.MeshStandardMaterial({color: '#ffffff', roughness: .9}));
  rim.rotation.x = -Math.PI / 2; rim.scale.set(1.4, 1, 1); rim.position.copy(ice.position); scene.add(rim);
  deco('snowman', pondX + 4.6, pondZ - 1.2, {s: 1.1, ry: -.6}); deco('bench', pondX + 1.5, pondZ - 3.3, {s: 1.1, ry: 0});
  deco('lantern', pondX - 4.9, pondZ - 1.6, {s: .75}); deco('tree-decorated-snow', pondX + 6.5, pondZ + 1, {s: .9});
  deco('rocks-medium', pondX - 5, pondZ + 1.5, {s: .7, sink: .2}); deco('sled', pondX + 3.4, pondZ + 2, {s: 1.1, ry: .8});
  for (const [x, z, n] of [[4.5, 10.5, 'snowman_B'], [6.5, 13, 'tree-snow-a'], [2.5, 14, 'tree-snow-b'], [7.5, 9, 'present_D_blue']]) deco(n, x, z, {s: n.includes('tree') ? 1.2 : n === 'snowman_B' ? .55 : .5});
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
    sun.position.set(focus.x - 16, focus.y + 12, focus.z + 9); sun.target.position.copy(focus);
    fill.position.set(focus.x + 10, focus.y + 8, focus.z - 6); fill.target.position.copy(focus);
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

/* ---------- textures procédurales ---------- */
function skyTexture(){
  const c = document.createElement('canvas'); c.width = 4; c.height = 256; const x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, '#4f8fe0'); g.addColorStop(.45, '#8cc0f5'); g.addColorStop(.8, '#d7e8fb'); g.addColorStop(1, '#ffe9d6');
  x.fillStyle = g; x.fillRect(0, 0, 4, 256);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
// neige : bosses et cristaux (carte de couleur + carte de normales)
function snowTextures(){
  const N = 256, h = new Float32Array(N * N), R = mulberry(9);
  const tile = (x, y) => h[((y + N) % N) * N + (x + N) % N];
  for (let o = 0; o < 4; o++){
    const f = 4 << o, amp = 1 / (1 + o * 1.6), g = [];
    for (let i = 0; i <= f; i++){ g[i] = []; for (let j = 0; j <= f; j++) g[i][j] = R(); }
    for (let i = 0; i <= f; i++){ g[i][f] = g[i][0]; g[f][i] = g[0][i]; }
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++){
      const fx = x / N * f, fy = y / N * f, ix = Math.floor(fx), iy = Math.floor(fy), u = fx - ix, v = fy - iy, su = u * u * (3 - 2 * u), sv = v * v * (3 - 2 * v);
      h[y * N + x] += amp * ((g[iy][ix] * (1 - su) + g[iy][ix + 1] * su) * (1 - sv) + (g[iy + 1][ix] * (1 - su) + g[iy + 1][ix + 1] * su) * sv);
    }
  }
  const cc = document.createElement('canvas'); cc.width = cc.height = N; const cx = cc.getContext('2d'), cd = cx.createImageData(N, N);
  const nc = document.createElement('canvas'); nc.width = nc.height = N; const nx = nc.getContext('2d'), nd = nx.createImageData(N, N);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++){
    const i = (y * N + x) * 4, v = h[y * N + x];
    const sparkle = R() > .996 ? 30 : 0;
    const l = Math.min(255, 228 + (v - 1) * 26 + sparkle);
    cd.data[i] = l - 6; cd.data[i + 1] = l - 2; cd.data[i + 2] = 255; cd.data[i + 3] = 255;
    const dx = (tile(x + 1, y) - tile(x - 1, y)) * 3, dy = (tile(x, y + 1) - tile(x, y - 1)) * 3;
    const len = Math.hypot(dx, dy, 1);
    nd.data[i] = (-dx / len * .5 + .5) * 255; nd.data[i + 1] = (-dy / len * .5 + .5) * 255; nd.data[i + 2] = (1 / len * .5 + .5) * 255; nd.data[i + 3] = 255;
  }
  cx.putImageData(cd, 0, 0); nx.putImageData(nd, 0, 0);
  const map = new THREE.CanvasTexture(cc), nrm = new THREE.CanvasTexture(nc);
  for (const t of [map, nrm]){ t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(26, 40); t.anisotropy = 8; }
  map.colorSpace = THREE.SRGBColorSpace;
  return [map, nrm];
}
// pavés avec de la neige dans les joints
export function cobbleTexture(){
  const c = document.createElement('canvas'); c.width = 128; c.height = 256; const x = c.getContext('2d'), R = mulberry(21);
  x.fillStyle = '#b59a72'; x.fillRect(0, 0, 128, 256);
  const cols = ['#d6c49c', '#cdb88e', '#e0cfa8', '#c8b590', '#d9c7a0', '#c2ad84'];
  for (let row = 0; row < 8; row++){
    const off = row % 2 ? 21 : 0;
    for (let col = -1; col < 3; col++){
      const px = col * 42 + off + 3, py = row * 32 + 3, w = 36 + R() * 4, hh = 26;
      x.fillStyle = cols[Math.floor(R() * cols.length)];
      x.beginPath(); x.roundRect(px, py, w, hh, 9); x.fill();
      x.fillStyle = 'rgba(255,255,255,.22)'; x.beginPath(); x.roundRect(px + 4, py + 3, w - 12, 7, 4); x.fill();
      x.fillStyle = 'rgba(40,30,30,.18)'; x.beginPath(); x.roundRect(px + 2, py + hh - 6, w - 4, 5, 3); x.fill();
      if (R() < .22){ x.fillStyle = 'rgba(240,246,255,.9)'; x.beginPath(); x.ellipse(px + R() * w, py + R() * hh, 6 + R() * 6, 3 + R() * 3, 0, 0, 7); x.fill(); }
    }
  }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
export function blobTexture(){
  const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
  const g = x.createRadialGradient(64, 64, 20, 64, 64, 64); g.addColorStop(0, 'rgba(20,30,70,.55)'); g.addColorStop(.6, 'rgba(20,30,70,.25)'); g.addColorStop(1, 'rgba(20,30,70,0)');
  x.fillStyle = g; x.fillRect(0, 0, 128, 128); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
