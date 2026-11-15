// ESSAIS — Nouvelles formes de bâtiments qui montrent leur métier, faites avec les MÊMES modèles 3D (Kenney / KayKit, CC0)
// et le MÊME rendu que le pack du jeu (js/v2/bake.js : caméra isométrique, soleil, ombres, contour).
// Coordonnées : comme js/buildings.js (terrain de 3,6 × 3,6, dessus du socle à y = BASE_Y ; le coin visible est +x, +z).
import * as THREE from 'three';
import {prop, tint, mergeStatic} from '../js/assets.js';
import {cabin, plotBase, BASE_Y, PLATE_DROP} from '../js/buildings.js';
const HP = Math.PI / 2;

/** Tour carrée de 1 × 1 en éléments de chalet, plusieurs étages, toit pointu enneigé */
function tower(floors = 2, {windows = ['cabin-window-a', 'cabin-window-b'], top = 'cabin-roof-snow-point', wreath = true} = {}){
  const g = new THREE.Group();
  for (let f = 0; f < floors; f++){
    const y = f;
    const side = (ry, name) => g.add(prop(name, {y, ry}));
    side(0, f === 0 ? 'cabin-window-large' : windows[f % windows.length]); side(Math.PI, 'cabin-wall'); side(HP, f === floors - 1 && wreath ? 'cabin-wall-wreath' : windows[(f + 1) % windows.length]); side(-HP, 'cabin-wall');
    for (const r of [0, HP, Math.PI, -HP]) g.add(prop('cabin-corner', {y, ry: r}));
  }
  const roof = prop(top, {y: floors}); g.add(roof);
  return mergeStatic(g);
}
const at = (o, x, y, z, ry = 0, s = 1) => { o.position.set(x, y, z); o.rotation.y = ry; o.scale.setScalar(s); return o; };

/** Modèle d'essai pour un type et une apparence t (1, 2, 3) — renvoie null si pas d'essai pour ce type */
export function model2(type, t = 3){
  const root = new THREE.Group(), g = new THREE.Group(); g.position.y = BASE_Y; root.add(plotBase(t), g);
  const add = (name, o = {}) => { const p = prop(name, o); g.add(p); return p; };
  const cab = (opts, x, z, ry = 0, s = 1.1, hue = null) => { let c = cabin(opts); if (hue != null) c = tint(c, hue[0], hue[1]); at(c, x, 0, z, ry, s); g.add(c); return c; };
  switch (type){
    case 'santa': {
      // grande maison + tour à horloge et couronne, porche de sucres d'orge, sapin, casse-noisettes de garde
      cab({len: 3, front: ['cabin-window-large', 'door'], sides: ['cabin-window-a', 'cabin-wall-wreath', 'cabin-window-a'], chimney: 2}, -.45, -.35, 0, 1.12);
      const tw = tower(t >= 3 ? 3 : 2); at(tw, 1.05, 0, -1.0, 0, t >= 3 ? 1.12 : 1.0); g.add(tw);
      add('banner-red', {x: 1.05, z: -1.0, s: .9}).position.y = (t >= 3 ? 3 : 2) * 1.12 + .55;
      add('lights-colored', {x: 1.05, y: (t >= 3 ? 3 : 2) * 1.02, z: -.3, s: .9});
      add('candycane_large', {x: -1.05, z: 1.15, s: .34}); add('candycane_large', {x: .15, z: 1.15, s: .34, ry: Math.PI});
      add('christmas_tree_decorated', {x: 1.45, z: .95, s: .3});
      if (t >= 2){ add('nutcracker', {x: -1.4, z: 1.45, s: .7}); add('nutcracker', {x: .5, z: 1.45, s: .7}); }
      if (t >= 3){ add('banner-red', {x: 1.6, z: -.15, s: 1.1, ry: -HP}); add('present_A_red', {x: 1.1, z: 1.6, s: .5}); add('present_C_yellow', {x: 1.5, z: 1.55, s: .42, ry: .4}); }
      return finish(root, .95);
    }
    case 'sawmill': {
      // hangar ouvert sur poteaux, grande roue à eau, scie (roue dentée) qui tourne, rondins et planches
      cab({len: 2, front: ['cabin-window-c', 'door'], chimney: 0, lights: false}, -.75, -.6, 0, 1.0);
      add('watermill-wide', {x: 1.25, z: -.55, s: 1.15}).position.y = .95;
      const saw = add('Parts_Cog', {x: .35, z: .55, s: 1.3}); saw.rotation.z = HP; saw.position.y = .55;
      add('Wood_Log_A', {x: .35, z: .75, s: .55, ry: HP}).position.y = .32;
      add('Wood_Log_Stack', {x: -1.1, z: 1.15, s: .6}); add('Wood_Log_Stack', {x: 1.35, z: 1.25, s: .45, ry: .6});
      add('Wood_Planks_Stack_Large', {x: -.2, z: 1.55, s: .45, ry: HP});
      if (t >= 2) add('cart', {x: 1.5, z: .35, s: .9, ry: -.6});
      if (t >= 3){ add('Wood_Planks_Stack_Medium', {x: -1.55, z: .1, s: .45}); add('lantern', {x: -1.5, z: 1.55, s: .5}); }
      return finish(root, .78);
    }
    case 'bakery': {
      // maison en pain d'épices + grande enseigne biscuit sur un poteau + étal de gâteaux
      add('gingerbread_house_decorated', {x: -.3, z: -.35, s: t >= 3 ? 1.85 : 1.6});
      add('poles', {x: 1.35, z: 1.35, s: .7});
      const sign = add('cookie', {x: 1.35, z: 1.35, s: 2.4}); sign.rotation.set(0, Math.PI / 4, 0); sign.position.y = 1.35;
      add('stall-red', {x: 1.35, z: -.35, s: .8, ry: -HP});
      add('cupcake', {x: 1.4, z: -.1, s: .85}).position.y = .55; add('donut', {x: 1.4, z: -.6, s: .85}).position.y = .55;
      if (t >= 2){ add('gingerbread-man', {x: -.9, z: 1.5, s: 1.3}); add('gingerbread-woman', {x: -.55, z: 1.55, s: 1.3}); }
      if (t >= 3){ add('candycane_large', {x: -1.55, z: 1.2, s: .34}); add('cake', {x: .15, z: 1.55, s: .7}); }
      return finish(root, .78);
    }
    case 'workshop': {
      // grand atelier à deux cheminées, roue dentée sur la façade, tapis roulant de jouets devant
      cab({len: 2, front: ['cabin-window-large', 'door'], sides: ['cabin-window-b'], chimney: 1}, -.65, -.6, 0, 1.08);
      cab({len: 1, front: ['cabin-window-b', 'cabin-window-a'], chimney: 1}, 1.05, -.8, -HP, .85);
      const cog = add('Parts_Cog', {x: -.65, z: .55, s: .8}); cog.position.y = 1.55;
      for (const x of [-1.2, -.2, .8]) add('tracks_straight', {x, z: 1.2, s: .95, ry: HP});
      const toys = ['train_locomotive', 'present_A_red', 'nutcracker', 'present_C_yellow', 'present_D_blue'];
      toys.slice(0, t + 2).forEach((n, i) => add(n, {x: -1.4 + i * .6, z: 1.2, s: n === 'nutcracker' ? .55 : n.startsWith('train') ? .45 : .4, ry: HP}));
      if (t >= 3) add('lights-colored', {x: -.65, y: 1.05, z: .45, s: 1.2});
      return finish(root, .78);
    }
    case 'stable': {
      // grange des rennes : grande porte, foin, enclos avec rennes, traîneau
      cab({len: 2, front: ['cabin-overhang-doorway', 'cabin-window-a'], sides: ['cabin-window-c'], chimney: 0, lights: t >= 2}, -.6, -.65, 0, 1.12, [.02, 1.15]);
      for (const [x, z, ry] of [[1.75, -.1, 0], [1.75, .9, 0], [1.25, 1.75, HP], [.25, 1.75, HP]]) add('fence', {x, z, ry, s: .9});
      add('reindeer', {x: 1.05, z: 1.15, s: .62, ry: .8}); if (t >= 2) add('reindeer', {x: .3, z: 1.35, s: .58, ry: .2}); if (t >= 3) add('reindeer', {x: 1.4, z: .35, s: .55, ry: 1.6});
      add('crops_wheatStageB', {x: -1.3, z: 1.2, s: .9}); add('Food_Basket_A_Berries', {x: -.8, z: 1.45, s: .55});
      if (t >= 2) add('sled', {x: -1.55, z: .35, s: .6, ry: HP});
      return finish(root, .78);
    }
    case 'orders': {
      // hangar du traîneau : grand abri ouvert (deux portes cochères), traîneau chargé qui sort, rennes attelés devant
      cab({len: 2, front: ['cabin-overhang-doorway', 'cabin-overhang-doorway'], sides: ['cabin-window-c', 'cabin-wall'], chimney: 0, lights: t >= 2}, -.55, -.75, 0, 1.12, [.08, .9]);
      add('sled-long', {x: -.45, z: 1.0, s: 1.15, ry: 0});
      add('present_A_red', {x: -.6, z: .85, s: .42}).position.y = .4; add('present_B_green', {x: -.3, z: 1.1, s: .38, ry: .4}).position.y = .4; add('present_E_white', {x: -.45, z: .95, s: .34}).position.y = .66;
      add('reindeer', {x: -.45, z: 2.05, s: .55, ry: 0});
      if (t >= 2) add('reindeer', {x: .25, z: 2.0, s: .55, ry: 0});
      if (t >= 3){ add('lantern_decorated', {x: 1.5, z: 1.4, s: .5}); add('present_C_yellow', {x: 1.25, z: .9, s: .45}); }
      return finish(root, .78);
    }
    case 'letters': {
      // bureau des lettres : guichet rouge, boîte aux lettres géante, sacs et piles de lettres
      cab({len: 1, front: ['cabin-window-c', 'door'], chimney: 1}, -.55, -.6, 0, 1.12, [.0, 1.25]);
      add('stall-red', {x: 1.2, z: -.1, s: 1.15, ry: -HP});
      add('bag', {x: 1.15, z: 1.15, s: 1.1}); add('bag', {x: .7, z: 1.4, s: .9, ry: .6});
      add('carton', {x: -1.25, z: 1.25, s: .9}); add('carton', {x: -1.25, z: 1.25, s: .7}).position.y = .32;
      add('banner-red', {x: -1.6, z: .2, s: 1.1, ry: HP});
      if (t >= 3) add('lantern_decorated', {x: .1, z: 1.55, s: .5});
      return finish(root, .78);
    }
  }
  return null;
}
function finish(root, s){ const w = new THREE.Group(); root.scale.setScalar(s); root.position.y -= PLATE_DROP; w.add(root); return w; }
export const ESSAI_TYPES = ['santa', 'sawmill', 'bakery', 'workshop', 'stable', 'orders', 'letters'];
