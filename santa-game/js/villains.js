// Les méchants du Grand Nord, dessinés au pinceau numérique (dégradés, ombres, reflets) sur un canevas.
// Utilisés dans les cinématiques (portraits), le bestiaire et la Défense du village (sprites animés).
//   krampus : le Krampus des Glaces, grand esprit d'hiver aux cornes de givre, manteau d'ombre, lanterne bleue
//   baron   : le Baron Glaçon, bonhomme de neige aristocrate, haut-de-forme, monocle de glace
//   troll   : troll des neiges (gris-bleu, poilu), variantes : runner (petit, rapide), shield (bouclier de glace),
//             thrower (lance des boules), yeti (énorme), chief (chef couronné)

const INK = '#141a33';
const lg = (x, x0, y0, x1, y1, stops) => { const g = x.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, c]) => g.addColorStop(o, c)); return g; };
const rg = (x, cx, cy, r0, r, stops) => { const g = x.createRadialGradient(cx, cy, r0, cx, cy, r); stops.forEach(([o, c]) => g.addColorStop(o, c)); return g; };
function shape(x, fill, stroke = INK, w = 3.2){ if (fill){ x.fillStyle = fill; x.fill(); } if (stroke){ x.lineWidth = w; x.strokeStyle = stroke; x.lineJoin = 'round'; x.lineCap = 'round'; x.stroke(); } }
function shine(x, cx, cy, rx, ry, a = .55){ x.save(); x.globalAlpha = a; x.fillStyle = '#fff'; x.beginPath(); x.ellipse(cx, cy, rx, ry, -.5, 0, 7); x.fill(); x.restore(); }

/* ===================== KRAMPUS DES GLACES ===================== */
// dessiné dans une boîte 200×200, pieds vers y = 196
export function drawKrampus(x, t = 0, mood = 0){
  const br = Math.sin(t * 2) * 2, glow = .6 + .4 * Math.sin(t * 3);
  x.save(); x.translate(100, 104); x.scale(.86, .86); x.translate(-100, -96);
  // aura glacée
  x.fillStyle = rg(x, 100, 110, 10, 100, [[0, `rgba(120,200,255,${.35 * glow})`], [1, 'rgba(120,200,255,0)']]); x.fillRect(0, 0, 200, 200);
  // manteau (silhouette en cloche, déchirée en bas)
  x.beginPath(); x.moveTo(62, 70 + br); x.bezierCurveTo(40, 110, 30, 160, 26, 192); x.lineTo(44, 182); x.lineTo(56, 196); x.lineTo(72, 184); x.lineTo(88, 196); x.lineTo(100, 186);
  x.lineTo(112, 196); x.lineTo(128, 184); x.lineTo(144, 196); x.lineTo(156, 182); x.lineTo(174, 192); x.bezierCurveTo(170, 160, 160, 110, 138, 70 + br); x.closePath();
  shape(x, lg(x, 0, 70, 0, 196, [[0, '#3b2a6e'], [.55, '#26184d'], [1, '#120a2a']]));
  // bordure de fourrure givrée
  x.beginPath(); for (let i = 0; i <= 12; i++){ const a = i / 12, px = 56 + a * 88, py = 80 + Math.sin(a * Math.PI) * 8 + br; i ? x.lineTo(px, py + (i % 2 ? 6 : 0)) : x.moveTo(px, py); }
  x.lineTo(146, 92 + br); x.lineTo(54, 92 + br); x.closePath(); shape(x, lg(x, 0, 104, 0, 124, [[0, '#ffffff'], [1, '#b9d8f5']]), INK, 2.5);
  // bras + griffes, l'un tient une lanterne bleue
  x.beginPath(); x.moveTo(140, 84 + br); x.quadraticCurveTo(172, 104, 168, 132); x.lineTo(156, 134); x.quadraticCurveTo(158, 110, 132, 98); x.closePath(); shape(x, '#2c1d58');
  x.beginPath(); x.moveTo(156, 132); x.lineTo(152, 146); x.moveTo(162, 134); x.lineTo(162, 148); x.moveTo(168, 132); x.lineTo(172, 145); x.lineWidth = 3; x.strokeStyle = '#d8e8ff'; x.stroke();
  x.strokeStyle = INK; x.lineWidth = 2; x.beginPath(); x.moveTo(162, 148); x.lineTo(162, 156); x.stroke();
  x.beginPath(); x.roundRect(150, 156, 24, 30, 6); shape(x, '#3a3f5c', INK, 2.5);
  x.fillStyle = rg(x, 162, 171, 2, 26, [[0, `rgba(170,240,255,${.95 * glow})`], [.4, `rgba(80,190,255,${.6 * glow})`], [1, 'rgba(80,190,255,0)']]); x.fillRect(132, 146, 60, 52);
  x.beginPath(); x.roundRect(154, 160, 16, 22, 4); shape(x, `rgba(150,230,255,${.85})`, INK, 1.5);
  x.beginPath(); x.moveTo(60, 84 + br); x.quadraticCurveTo(34, 104, 38, 128); x.lineTo(50, 128); x.quadraticCurveTo(50, 108, 70, 98); x.closePath(); shape(x, '#2c1d58');
  x.beginPath(); x.moveTo(38, 128); x.lineTo(32, 140); x.moveTo(44, 129); x.lineTo(42, 143); x.moveTo(50, 128); x.lineTo(54, 140); x.lineWidth = 3; x.strokeStyle = '#d8e8ff'; x.stroke();
  // tête : museau de bouc, fourrure sombre
  const hy = 52 + br;
  // cornes de givre (spirales anguleuses, cristallines)
  for (const s of [-1, 1]){
    x.beginPath(); x.moveTo(100 + s * 18, hy - 14); x.bezierCurveTo(100 + s * 46, hy - 30, 100 + s * 60, hy - 6, 100 + s * 70, hy - 40);
    x.bezierCurveTo(100 + s * 74, hy - 54, 100 + s * 66, hy - 62, 100 + s * 58, hy - 58); x.bezierCurveTo(100 + s * 62, hy - 44, 100 + s * 52, hy - 24, 100 + s * 26, hy - 4); x.closePath();
    shape(x, lg(x, 100 + s * 20, hy, 100 + s * 66, hy - 58, [[0, '#e8f2ff'], [.5, '#9fd0ff'], [1, '#4c8fe0']]));
    x.strokeStyle = 'rgba(255,255,255,.7)'; x.lineWidth = 1.6; x.beginPath(); x.moveTo(100 + s * 36, hy - 18); x.lineTo(100 + s * 42, hy - 12); x.moveTo(100 + s * 50, hy - 22); x.lineTo(100 + s * 56, hy - 18); x.stroke();
  }
  x.beginPath(); x.ellipse(100, hy, 32, 34, 0, 0, 7); shape(x, rg(x, 92, hy - 12, 4, 40, [[0, '#4d3a86'], [1, '#22164a']]));
  // longues oreilles pointues
  for (const s of [-1, 1]){ x.beginPath(); x.moveTo(100 + s * 28, hy - 6); x.quadraticCurveTo(100 + s * 52, hy - 2, 100 + s * 56, hy + 10); x.quadraticCurveTo(100 + s * 40, hy + 8, 100 + s * 28, hy + 6); x.closePath(); shape(x, '#3a2a70'); }
  // museau clair
  x.beginPath(); x.ellipse(100, hy + 16, 18, 15, 0, 0, 7); shape(x, lg(x, 0, hy + 2, 0, hy + 31, [[0, '#cfc6e8'], [1, '#8f84b8']]), INK, 2.6);
  x.beginPath(); x.ellipse(100, hy + 9, 6, 3.6, 0, 0, 7); shape(x, '#241a40', null);
  // bouche : sourire mauvais + crocs ; mood 1 = colère
  x.beginPath(); x.moveTo(88, hy + 20); x.quadraticCurveTo(100, hy + (mood ? 24 : 30), 112, hy + 20); shape(x, null, INK, 2.4);
  x.fillStyle = '#fff'; for (const s of [-1, 1]){ x.beginPath(); x.moveTo(100 + s * 7, hy + 22); x.lineTo(100 + s * 9, hy + 30); x.lineTo(100 + s * 11, hy + 21); x.fill(); }
  // yeux luisants, sourcils froncés
  for (const s of [-1, 1]){
    x.fillStyle = rg(x, 100 + s * 13, hy - 6, 1, 14, [[0, `rgba(255,240,120,${.9 * glow})`], [1, 'rgba(255,200,60,0)']]); x.fillRect(80 + s * 13, hy - 26, 40, 40);
    x.beginPath(); x.ellipse(100 + s * 13, hy - 6, 7, 5, s * .35, 0, 7); shape(x, '#ffe25a', INK, 2.2);
    x.beginPath(); x.ellipse(100 + s * 13 + s, hy - 6, 2, 4, 0, 0, 7); x.fillStyle = INK; x.fill();
    x.beginPath(); x.moveTo(100 + s * 4, hy - 12 + (mood ? 2 : 0)); x.lineTo(100 + s * 22, hy - 18); shape(x, null, INK, 3.5);
  }
  // barbiche de givre
  x.beginPath(); x.moveTo(92, hy + 30); x.lineTo(100, hy + 46); x.lineTo(108, hy + 30); x.closePath(); shape(x, lg(x, 0, hy + 30, 0, hy + 46, [[0, '#e8f2ff'], [1, '#8cc0f0']]), INK, 2);
  // cristaux qui flottent autour
  for (let i = 0; i < 5; i++){ const a = t * .8 + i * 1.256, px = 100 + Math.cos(a) * 78, py = 110 + Math.sin(a) * 30, sz = 4 + (i % 2) * 2;
    x.save(); x.translate(px, py); x.rotate(a); x.beginPath(); x.moveTo(0, -sz * 1.6); x.lineTo(sz * .6, 0); x.lineTo(0, sz * 1.6); x.lineTo(-sz * .6, 0); x.closePath(); shape(x, '#c8ecff', INK, 1.4); x.restore(); }
  x.restore();
}

/* ===================== BARON GLAÇON ===================== */
export function drawBaron(x, t = 0){
  const b = Math.sin(t * 2.4) * 1.5; x.save();
  x.beginPath(); x.ellipse(100, 192, 58, 8, 0, 0, 7); x.fillStyle = 'rgba(20,30,60,.25)'; x.fill();
  // corps de neige (deux boules), écharpe pourpre
  x.beginPath(); x.ellipse(100, 150, 50, 44, 0, 0, 7); shape(x, rg(x, 84, 132, 6, 60, [[0, '#ffffff'], [.7, '#e2eefb'], [1, '#a9c4e6']]));
  for (const yy of [138, 156, 174]){ x.beginPath(); x.arc(100, yy, 4.5, 0, 7); shape(x, '#2a2f4a', INK, 1.5); }
  x.beginPath(); x.ellipse(100, 84 + b, 36, 33, 0, 0, 7); shape(x, rg(x, 88, 70, 4, 44, [[0, '#ffffff'], [.75, '#e2eefb'], [1, '#a9c4e6']]));
  x.beginPath(); x.moveTo(64, 108 + b); x.quadraticCurveTo(100, 124 + b, 136, 108 + b); x.lineTo(136, 118 + b); x.quadraticCurveTo(100, 134 + b, 64, 118 + b); x.closePath(); shape(x, lg(x, 64, 0, 136, 0, [[0, '#7a1f6e'], [1, '#b0359e']]), INK, 2.5);
  x.beginPath(); x.moveTo(122, 116 + b); x.lineTo(130, 150); x.lineTo(142, 146); x.lineTo(132, 114 + b); x.closePath(); shape(x, '#9a2a8a', INK, 2.5);
  // bras-branches, l'un tient une canne à pommeau de cristal
  x.strokeStyle = '#5a3a1e'; x.lineWidth = 5; x.lineCap = 'round'; x.beginPath(); x.moveTo(56, 140); x.lineTo(28, 120); x.moveTo(36, 126); x.lineTo(30, 112); x.stroke();
  x.beginPath(); x.moveTo(144, 140); x.lineTo(166, 150); x.stroke();
  x.strokeStyle = '#2a1a0e'; x.lineWidth = 4; x.beginPath(); x.moveTo(168, 196); x.lineTo(168, 120); x.stroke();
  x.beginPath(); x.arc(168, 114, 9, 0, 7); shape(x, rg(x, 165, 110, 1, 10, [[0, '#ffffff'], [1, '#5fb6ff']]), INK, 2);
  // visage : yeux de charbon, monocle de glace, nez-carotte, moustache en croc
  x.beginPath(); x.arc(88, 80 + b, 4, 0, 7); x.fillStyle = INK; x.fill();
  x.beginPath(); x.arc(112, 80 + b, 9, 0, 7); shape(x, 'rgba(180,230,255,.55)', '#d9b24a', 2.5); x.beginPath(); x.arc(112, 80 + b, 3.5, 0, 7); x.fillStyle = INK; x.fill();
  x.strokeStyle = '#d9b24a'; x.lineWidth = 1.2; x.beginPath(); x.moveTo(120, 86 + b); x.quadraticCurveTo(126, 100 + b, 122, 112 + b); x.stroke();
  x.beginPath(); x.moveTo(100, 88 + b); x.lineTo(122, 94 + b); x.lineTo(100, 96 + b); x.closePath(); shape(x, lg(x, 100, 0, 122, 0, [[0, '#ff8a2a'], [1, '#e85a10']]), INK, 2);
  x.beginPath(); x.moveTo(100, 100 + b); x.bezierCurveTo(90, 98 + b, 80, 108 + b, 74, 98 + b); x.moveTo(100, 100 + b); x.bezierCurveTo(110, 98 + b, 120, 108 + b, 126, 98 + b); shape(x, null, '#3a3f5c', 3.5);
  // haut-de-forme
  x.beginPath(); x.ellipse(100, 56 + b, 40, 8, 0, 0, 7); shape(x, '#1c1f33');
  x.beginPath(); x.moveTo(74, 56 + b); x.lineTo(78, 10 + b); x.lineTo(122, 10 + b); x.lineTo(126, 56 + b); x.closePath(); shape(x, lg(x, 74, 0, 126, 0, [[0, '#262a44'], [.5, '#3c4266'], [1, '#1c1f33']]));
  x.beginPath(); x.rect(76, 42 + b, 48, 9); shape(x, '#8a2a7a', INK, 2);
  x.beginPath(); x.arc(112, 46 + b, 5, 0, 7); shape(x, rg(x, 111, 45 + b, 1, 5, [[0, '#fff'], [1, '#6fc0ff']]), INK, 1.5);
  shine(x, 84, 132, 10, 6, .5); x.restore();
}

/* ===================== TROLLS DES NEIGES ===================== */
const TROLL_COL = {
  troll:   ['#7d9bb5', '#4e6a85', '#c9d9e8'], runner: ['#8fb3a0', '#56806a', '#d7e8de'],
  shield:  ['#8a8fa8', '#565b78', '#d6d9e8'], thrower: ['#b59a7d', '#806648', '#e8dcc9'],
  yeti:    ['#e8eef6', '#a9b8cc', '#ffffff'], chief: ['#9b7db5', '#6a4e85', '#e2d4ee'],
};
// dessin centré sur (0,0) = pieds, hauteur ~ 1 (on met à l'échelle avec ctx.scale)
export function drawTroll(x, kind = 'troll', t = 0, opt = {}){
  const [c1, c2, c3] = TROLL_COL[kind] || TROLL_COL.troll, hurt = opt.hurt, walk = Math.sin(t * 9) * (opt.walk ? 1 : 0), atk = opt.atk || 0;
  const S = kind === 'yeti' ? 1.25 : kind === 'runner' ? .82 : 1;
  x.save(); x.scale(S, S);
  x.beginPath(); x.ellipse(0, 0, 34, 7, 0, 0, 7); x.fillStyle = 'rgba(20,30,60,.25)'; x.fill();
  // jambes
  for (const s of [-1, 1]){ x.beginPath(); x.roundRect(s * 12 - 8 + walk * s * 3, -26, 16, 26, 7); shape(x, c2, INK, 2.6); x.beginPath(); x.ellipse(s * 12 + walk * s * 3, -2, 12, 6, 0, 0, 7); shape(x, c3, INK, 2.4); }
  if (kind === 'chief'){ x.beginPath(); x.moveTo(-30, -96); x.quadraticCurveTo(-52, -40, -44, -14); x.lineTo(44, -14); x.quadraticCurveTo(52, -40, 30, -96); x.closePath(); shape(x, lg(x, 0, -96, 0, -14, [[0, '#c0283c'], [1, '#7a1424']]), INK, 2.6); }
  // corps poilu (bord en dents de scie)
  x.beginPath(); const R = 34; for (let i = 0; i <= 28; i++){ const a = Math.PI * (1 + i / 28) - Math.PI / 2, r = R + (i % 2 ? 4 : 0); const px = Math.cos(a - Math.PI / 2) * r * 1.05, py = -60 + Math.sin(a - Math.PI / 2) * r; i ? x.lineTo(px, py) : x.moveTo(px, py); }
  x.closePath(); shape(x, hurt ? '#ff9aa8' : rg(x, -10, -74, 4, 46, [[0, c3], [.35, c1], [1, c2]]));
  x.beginPath(); x.ellipse(0, -52, 20, 18, 0, 0, 7); shape(x, c3, null); // ventre clair
  // bras
  const ar = atk ? -1.1 * atk : Math.sin(t * 9 + 1) * .15;
  for (const s of [-1, 1]){ x.save(); x.translate(s * 30, -70); x.rotate(s * (.5 + (s > 0 ? ar : 0))); x.beginPath(); x.roundRect(-8, 0, 16, 30, 8); shape(x, c1, INK, 2.6); x.beginPath(); x.arc(0, 32, 9, 0, 7); shape(x, c2, INK, 2.4); x.restore(); }
  // tête intégrée : yeux sous une arcade épaisse, gros nez, défenses
  x.beginPath(); x.ellipse(0, -96, 24, 20, 0, 0, 7); shape(x, rg(x, -6, -104, 2, 28, [[0, c3], [.4, c1], [1, c2]]));
  for (const s of [-1, 1]){ x.beginPath(); x.ellipse(s * 9, -98, 5.5, 6, 0, 0, 7); shape(x, '#fff', INK, 2); x.beginPath(); x.arc(s * 9 + s * .5, -97, 2.6, 0, 7); x.fillStyle = kind === 'chief' ? '#c01030' : INK; x.fill();
    x.beginPath(); x.moveTo(s * 2, -104); x.lineTo(s * 16, -108); shape(x, null, INK, 3.4); }
  x.beginPath(); x.ellipse(0, -88, 8, 6.5, 0, 0, 7); shape(x, c2, INK, 2);
  x.beginPath(); x.moveTo(-11, -80); x.quadraticCurveTo(0, -75, 11, -80); shape(x, null, INK, 2.4);
  x.fillStyle = '#fffbe8'; for (const s of [-1, 1]){ x.beginPath(); x.moveTo(s * 8, -80); x.lineTo(s * 10, -72); x.lineTo(s * 12, -80); x.closePath(); x.fill(); x.lineWidth = 1.4; x.strokeStyle = INK; x.stroke(); }
  // petites cornes
  for (const s of [-1, 1]){ x.beginPath(); x.moveTo(s * 12, -112); x.quadraticCurveTo(s * 22, -126, s * 16, -130); x.quadraticCurveTo(s * 14, -120, s * 6, -114); x.closePath(); shape(x, '#efe6d6', INK, 2.2); }
  // accessoires
  if (kind === 'shield'){ x.save(); x.translate(-6, -54); x.beginPath(); x.moveTo(0, -30); x.lineTo(24, -20); x.lineTo(22, 16); x.lineTo(0, 30); x.lineTo(-22, 16); x.lineTo(-24, -20); x.closePath();
    shape(x, lg(x, -24, -30, 24, 30, [[0, 'rgba(220,245,255,.95)'], [1, 'rgba(110,180,240,.9)']]), INK, 2.6); shine(x, -8, -10, 6, 12, .6); x.restore(); }
  if (kind === 'thrower'){ x.beginPath(); x.arc(32, -104 - atk * 10, 10, 0, 7); shape(x, '#fff', INK, 2.2); }
  if (kind === 'chief'){ x.beginPath(); x.moveTo(-16, -114); x.lineTo(-16, -128); x.lineTo(-8, -120); x.lineTo(0, -132); x.lineTo(8, -120); x.lineTo(16, -128); x.lineTo(16, -114); x.closePath(); shape(x, lg(x, 0, -132, 0, -114, [[0, '#fff2a0'], [1, '#e8a020']]), INK, 2.2);
}
  if (kind === 'yeti'){ x.beginPath(); x.ellipse(0, -96, 26, 22, 0, Math.PI * 1.05, Math.PI * 1.95); shape(x, null, '#c9d6e6', 4); }
  x.restore();
}

/** Portrait (dataURL) pour les cinématiques et le bestiaire. */
export function portrait(kind, size = 220){
  const c = document.createElement('canvas'); c.width = c.height = size; const x = c.getContext('2d');
  x.scale(size / 200, size / 200);
  if (kind === 'krampus') drawKrampus(x, .4); else if (kind === 'baron') drawBaron(x, .2);
  else { x.translate(100, 190); x.scale(1.25, 1.25); drawTroll(x, kind, .2); }
  return c.toDataURL('image/png');
}
