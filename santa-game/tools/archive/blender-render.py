# Rendu « qualité film » des images du jeu avec Blender (Cycles : lumière qui rebondit, ombres douces,
# occlusion ambiante), au même angle et à la même échelle que le jeu. Entrée : tools/glb/*.glb (export-glb.mjs).
#
# Usage : blender -b -P tools/blender-render.py -- <dossier glb> <dossier sortie> <densité> [clé1 clé2 ...]
# Sortie : <clé>.png (fond transparent, ombre portée au sol) + meta.json {clé: {ax, ay, w, h}} en px CSS.
import bpy, json, math, os, sys
from mathutils import Vector

argv = sys.argv[sys.argv.index('--') + 1:]
GLB, OUT, DENS = argv[0], argv[1], float(argv[2])
ONLY = set(argv[3:])
SAMPLES = int(os.environ.get('SAMPLES', '64'))
os.makedirs(OUT, exist_ok=True)
PPU = 64 / math.sqrt(2)                       # px CSS par unité (comme bake.js)
E, Y = math.radians(30), math.radians(45)
# direction caméra (three.js Y-haut → Blender Z-haut : (x, y, z) → (x, -z, y))
D = Vector((math.cos(E) * math.sin(Y), -math.cos(E) * math.cos(Y), math.sin(E))).normalized()
SUN = Vector((-6, -2, 10)).normalized()       # soleil chaud venant de la gauche, comme dans le jeu

index = json.load(open(os.path.join(GLB, 'index.json')))
meta_path = os.path.join(OUT, 'meta.json')
meta = json.load(open(meta_path)) if os.path.exists(meta_path) else {}

def setup():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = 'CYCLES'
    sc.cycles.device = 'CPU'
    sc.cycles.samples = SAMPLES
    sc.cycles.use_denoising = False   # la version Ubuntu n'a pas OpenImageDenoise : on rend 2× plus grand puis on réduit (bruit moyenné)
    sc.cycles.max_bounces = 6
    sc.render.film_transparent = True
    sc.render.image_settings.file_format = 'PNG'
    sc.render.image_settings.color_mode = 'RGBA'
    sc.view_settings.view_transform = 'Standard'
    sc.view_settings.exposure = 0.15
    # ciel : lumière d'ambiance froide (neige) + soleil chaud
    w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True
    bg = w.node_tree.nodes['Background']; bg.inputs[0].default_value = (0.78, 0.86, 1.0, 1); bg.inputs[1].default_value = 0.85
    sun = bpy.data.lights.new('sun', 'SUN'); sun.energy = 3.6; sun.angle = math.radians(6); sun.color = (1.0, 0.95, 0.86)
    so = bpy.data.objects.new('sun', sun); sc.collection.objects.link(so)
    so.rotation_euler = (-SUN).to_track_quat('-Z', 'Y').to_euler()
    # sol qui ne garde que l'ombre
    bpy.ops.mesh.primitive_plane_add(size=80, location=(0, 0, 0))
    pl = bpy.context.active_object; pl.is_shadow_catcher = True
    cam = bpy.data.cameras.new('cam'); cam.type = 'ORTHO'
    co = bpy.data.objects.new('cam', cam); sc.collection.objects.link(co); sc.camera = co
    return sc, co, pl

for key, info in index.items():
    if ONLY and key not in ONLY: continue
    sc, co, plane = setup()
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=os.path.join(GLB, info['f']))
    objs = [o for o in bpy.data.objects if o not in before and o.type == 'MESH']
    if not objs: continue
    for o in objs:
        o.visible_shadow = True
    # les modèles « low poly » ont des faces ouvertes (pignons, portes) : vues de dos, l'intérieur serait noir.
    # On les éclaire avec leur propre couleur, comme dans le jeu.
    done = set()
    for o in objs:
        for slot in o.material_slots:
            m = slot.material
            if not m or m.name in done or not m.use_nodes: continue
            done.add(m.name); nt = m.node_tree
            bsdf = next((n for n in nt.nodes if n.type == 'BSDF_PRINCIPLED'), None)
            out = next((n for n in nt.nodes if n.type == 'OUTPUT_MATERIAL'), None)
            if not bsdf or not out: continue
            geo = nt.nodes.new('ShaderNodeNewGeometry'); em = nt.nodes.new('ShaderNodeEmission'); mix = nt.nodes.new('ShaderNodeMixShader')
            base = bsdf.inputs['Base Color']
            if base.is_linked: nt.links.new(base.links[0].from_socket, em.inputs['Color'])
            else: em.inputs['Color'].default_value = base.default_value
            em.inputs['Strength'].default_value = .55
            nt.links.new(geo.outputs['Backfacing'], mix.inputs['Fac'])
            nt.links.new(bsdf.outputs['BSDF'], mix.inputs[1]); nt.links.new(em.outputs['Emission'], mix.inputs[2])
            nt.links.new(mix.outputs['Shader'], out.inputs['Surface'])
    bpy.context.view_layer.update()
    pts = [o.matrix_world @ Vector(c) for o in objs for c in o.bound_box]
    mn = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
    mx = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
    h = mx.z
    # l'ombre part vers la droite : on agrandit la boîte au sol (même règle que bake.js)
    pts += [Vector((mx.x + h * .7, mn.y - h * .25, 0))]
    pad = .15
    corners = [Vector((x, y, z)) for x in (min(p.x for p in pts) - pad, max(p.x for p in pts) + pad)
               for y in (min(p.y for p in pts) - pad, max(p.y for p in pts) + pad)
               for z in (min(0, mn.z) - pad, mx.z + pad)]
    center = sum(corners, Vector()) / len(corners)
    co.location = center + D * 40
    co.rotation_euler = (-D).to_track_quat('-Z', 'Y').to_euler()
    bpy.context.view_layer.update()
    inv = co.matrix_world.inverted()
    cs = [inv @ c for c in corners]
    x0, x1 = min(c.x for c in cs), max(c.x for c in cs)
    y0, y1 = min(c.y for c in cs), max(c.y for c in cs)
    wu, hu = x1 - x0, y1 - y0
    rx, ry = max(2, math.ceil(wu * PPU * DENS)), max(2, math.ceil(hu * PPU * DENS))
    cam = co.data
    cam.ortho_scale = max(wu, hu)
    cam.sensor_fit = 'AUTO'
    cam.shift_x = ((x0 + x1) / 2) / cam.ortho_scale
    cam.shift_y = ((y0 + y1) / 2) / cam.ortho_scale
    cam.clip_start, cam.clip_end = 0.1, 200
    sc.render.resolution_x, sc.render.resolution_y = rx, ry
    sc.render.resolution_percentage = 100
    o = inv @ Vector((0, 0, 0))
    ax = (o.x - x0) / wu * rx / DENS
    ay = (y1 - o.y) / hu * ry / DENS
    sc.render.filepath = os.path.join(OUT, key.replace(':', '_') + '.png')
    bpy.ops.render.render(write_still=True)
    meta[key] = {'f': os.path.basename(sc.render.filepath), 'ax': round(ax, 2), 'ay': round(ay, 2), 'w': round(rx / DENS, 2), 'h': round(ry / DENS, 2)}
    json.dump(meta, open(meta_path, 'w'))
    print('RENDU', key, rx, 'x', ry, flush=True)
