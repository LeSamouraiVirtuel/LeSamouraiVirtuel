// Packs the CC0 models used by the game into a few optimized GLB files.
//
// Source: https://github.com/series-ai/jam-ready-assets (mirror of the CC0 packs
// by Kenney — kenney.nl — and KayKit / Kay Lousberg — kaylousberg.com).
//
// Usage (from santa-game/tools, after `npm i`):
//   node build-assets.mjs /path/to/jam-ready-assets ../assets
import {NodeIO} from '@gltf-transform/core';
import {ALL_EXTENSIONS} from '@gltf-transform/extensions';
import {mergeDocuments, dedup, prune, weld, textureCompress, unpartition, quantize} from '@gltf-transform/functions';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const [SRC, OUT] = process.argv.slice(2);
if (!SRC || !OUT) { console.error('usage: node build-assets.mjs <jam-ready-assets dir> <out dir>'); process.exit(1); }
fs.mkdirSync(OUT, {recursive: true});

const K = 'kenney-holiday-kit/3D/seasonal-holiday/Models/GLB format/%.glb';
const Y = 'kaykit-holiday/3D/seasonal-holiday/Assets/gltf/%.gltf';
const R = 'kaykit-resource-bits/3D/misc/Assets/gltf/%.gltf';
const F = 'kenney-fantasy-town-kit/3D/fantasy/Models/GLB format/%.glb';
const CH = 'kaykit-adventurers/3D/characters/Characters/gltf/%.glb';
const AN = 'kaykit-adventurers/3D/characters/Animations/gltf/Rig_Medium/%.glb';

const PROPS = {
  [K]: ['cabin-corner', 'cabin-corner-logs', 'cabin-door-rotate', 'cabin-doorway', 'cabin-wall', 'cabin-wall-wreath',
    'cabin-window-a', 'cabin-window-b', 'cabin-window-c', 'cabin-window-large', 'cabin-wall-roof', 'cabin-wall-roof-center',
    'cabin-roof-snow', 'cabin-roof-snow-chimney', 'cabin-roof-snow-point', 'cabin-roof-snow-corner', 'cabin-roof-snow-dormer',
    'cabin-roof-top', 'cabin-fence', 'cabin-overhang-doorway', 'cabin-overhang-door-rotate', 'cabin-wall-low',
    'floor-wood-snow', 'floor-wood', 'floor-stone', 'snow-flat', 'snow-flat-large', 'snow-pile', 'snow-bunker',
    'tree', 'tree-snow-a', 'tree-snow-b', 'tree-snow-c', 'tree-decorated-snow', 'rocks-large', 'rocks-medium', 'rocks-small',
    'reindeer', 'sled', 'sled-long', 'lantern', 'lantern-hanging', 'lights-colored', 'lights-red', 'lights-green',
    'present-a-cube', 'present-a-rectangle', 'present-a-round', 'present-b-cube', 'present-b-rectangle', 'present-b-round',
    'snowman', 'snowman-hat', 'candy-cane-red', 'candy-cane-green', 'nutcracker', 'bench', 'wreath-decorated',
    'gingerbread-man', 'gingerbread-woman', 'sock-red-cane'],
  [Y]: ['gingerbread_house', 'gingerbread_house_decorated', 'christmas_tree_decorated', 'christmas_tree',
    'train_locomotive', 'train_tender_presents_A', 'train_tender_presents_B', 'train_wagon', 'tracks_curve', 'tracks_straight',
    'cookie', 'hot_chocolate_decorated', 'candycane_large', 'candycane_small', 'lantern_decorated', 'lantern_mini',
    'present_A_red', 'present_B_green', 'present_C_yellow', 'present_D_blue', 'present_E_white', 'present_sphere_A_red',
    'snowman_A', 'snowman_B', 'snowball_pile', 'bell_decorated', 'wreath', 'plate_decorated_A', 'milk', 'mistletoe_A'],
  [R]: ['Wood_Log_Stack', 'Wood_Log_A', 'Wood_Log_B', 'Wood_Planks_Stack_Large', 'Wood_Planks_Stack_Medium', 'Wood_Planks_Stack_Small',
    'Containers_Pile_Large', 'Containers_Pile_Medium', 'Containers_Crate_Large', 'Containers_Crate_Medium_Wood', 'Containers_Box_Large',
    'Pallet_Wood', 'Pallet_Wood_Covered_A', 'Pallet_Wood_Covered_B', 'Money_Coins_Stack_Large', 'Money_Coins_Stack_Medium',
    'Money_Pile_Large', 'Money_Pile_Small', 'Food_Barrel_Empty', 'Textiles_Stack_Large_Colored', 'Gold_Bars_Stack_Small',
    'Parts_Cog', 'Gems_Chest', 'Food_Basket_A_Berries'],
  [F]: ['watermill', 'watermill-wide', 'stall-red', 'stall-green', 'stall-bench', 'cart', 'fence', 'fence-gate',
    'banner-red', 'banner-green', 'poles', 'planks'],
};

// V2 « Township » : cultures, aliments (produits des usines), animaux de ferme
const N = 'kenney-nature-kit/3D/nature/Models/GLTF format/%.glb';
const FD = 'kenney-food-kit/3D/food/Models/GLB format/%.glb';
const PET = 'kenney-cube-pets/3D/characters/Models/GLB format/%.glb';
const FARM = {
  [N]: ['crops_dirtSingle', 'crops_dirtRow', 'crops_dirtDoubleRow', 'crops_wheatStageA', 'crops_wheatStageB', 'crops_cornStageA', 'crops_cornStageB', 'crops_cornStageC', 'crops_cornStageD',
    'crops_leafsStageA', 'crops_leafsStageB', 'crop_carrot', 'crop_pumpkin', 'crop_turnip', 'crop_melon', 'fence_simple', 'fence_simpleLow', 'fence_gate', 'flower_redA', 'flower_yellowA', 'grass_large'],
  [FD]: ['bread', 'carrot', 'egg', 'cheese', 'corn', 'cookie', 'ginger-bread', 'carton', 'cupcake', 'cake', 'honey', 'strawberry', 'pumpkin', 'croissant', 'donut', 'bag', 'chocolate', 'cherries', 'apple', 'whipped-cream', 'waffle', 'pudding'],
  [PET]: ['animal-chick', 'animal-cow', 'animal-pig', 'animal-deer', 'animal-polar', 'animal-bunny', 'animal-penguin'],
};
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const file = (pat, name) => path.join(SRC, pat.replace('%', name));
// Quantification des sommets (KHR_mesh_quantization) : lue nativement par three.js, sans WebAssembly.
const squeeze = () => quantize();
const webp = () => textureCompress({encoder: sharp, targetFormat: 'webp', quality: 90});

async function packProps(PACK = PROPS, outName = 'props.glb'){
  const target = await io.read(file(K, 'tree'));
  // empty the seed document, keeping its buffer
  for (const s of target.getRoot().listScenes()) s.dispose();
  const main = target.createScene('props');
  target.getRoot().setDefaultScene(main);
  for (const [pat, names] of Object.entries(PACK)) {
    for (const name of names) {
      const src = await io.read(file(pat, name));
      const scenes = src.getRoot().listScenes();
      const map = mergeDocuments(target, src);
      const holder = target.createNode(name);
      for (const s of scenes) {
        const ts = map.get(s);
        for (const child of ts.listChildren()) holder.addChild(child);
        ts.dispose();
      }
      main.addChild(holder);
    }
  }
  // certains modèles Kenney référencent des textures absentes : on les retire avant compression
  for (const t of target.getRoot().listTextures()){ const im = t.getImage(); if (!im || im.byteLength < 16 || !/png|jpe?g|webp/.test(t.getMimeType() || '')) t.dispose(); }
  await target.transform(unpartition(), dedup(), weld(), prune(), webp(), squeeze());
  await io.write(path.join(OUT, outName), target);
}

async function copyChar(name, out){
  const doc = await io.read(file(CH, name));
  await doc.transform(prune(), webp(), squeeze());
  await io.write(path.join(OUT, out), doc);
}

async function packAnims(){
  // keep only the skeleton + the clips we use; drop the mannequin meshes
  const keep = new Set(['Idle_A', 'Idle_B', 'Walking_A', 'Running_A', 'Interact', 'PickUp', 'Jump_Full_Short', 'Use_Item']);
  const target = await io.read(file(AN, 'Rig_Medium_General'));
  const mv = await io.read(file(AN, 'Rig_Medium_MovementBasic'));
  // movement clips target the same bone names: re-target channels by node name
  const byName = new Map(target.getRoot().listNodes().map(n => [n.getName(), n]));
  const tbuf = target.getRoot().listBuffers()[0];
  for (const a of mv.getRoot().listAnimations()) {
    if (!keep.has(a.getName())) continue;
    const na = target.createAnimation(a.getName());
    for (const c of a.listChannels()) {
      const tn = byName.get(c.getTargetNode().getName()); if (!tn) continue;
      const s = c.getSampler();
      const inp = target.createAccessor().setType(s.getInput().getType()).setArray(s.getInput().getArray().slice()).setBuffer(tbuf);
      const outp = target.createAccessor().setType(s.getOutput().getType()).setArray(s.getOutput().getArray().slice()).setBuffer(tbuf);
      const ns = target.createAnimationSampler().setInput(inp).setOutput(outp).setInterpolation(s.getInterpolation());
      na.addSampler(ns).addChannel(target.createAnimationChannel().setTargetNode(tn).setTargetPath(c.getTargetPath()).setSampler(ns));
    }
  }
  for (const a of target.getRoot().listAnimations()) if (!keep.has(a.getName())) a.dispose();
  for (const n of target.getRoot().listNodes()) if (n.getMesh()) { n.getMesh().dispose(); n.setMesh(null); n.setSkin(null); }
  for (const m of target.getRoot().listMaterials()) m.dispose();
  for (const t of target.getRoot().listTextures()) t.dispose();
  await target.transform(prune({keepLeaves: true}), squeeze());
  await io.write(path.join(OUT, 'anims.glb'), target);
}

await packProps();
await packProps(FARM, 'farm.glb');
await copyChar('Engineer', 'santa.glb');
await copyChar('Rogue_Hooded', 'elf.glb');
await packAnims();
for (const f of fs.readdirSync(OUT)) console.log(f.padEnd(14), (fs.statSync(path.join(OUT, f)).size / 1024).toFixed(0) + ' KB');
