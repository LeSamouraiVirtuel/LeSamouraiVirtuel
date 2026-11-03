// Post-traitement : rendu anti-crénelé (MSAA x4), léger halo sur les lumières, étalonnage
// (saturation, contraste, ombres froides / lumières chaudes) et vignette discrète. Aucun flou : l'image reste nette.
import * as THREE from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';

const GradeShader = {
  uniforms: {
    tDiffuse: {value: null}, res: {value: new THREE.Vector2(1, 1)},
    sat: {value: 1.26}, con: {value: 1.08}, vig: {value: .22}, tilt: {value: 1}, focus: {value: .52},
  },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: `
    uniform sampler2D tDiffuse; uniform vec2 res; uniform float sat, con, vig, tilt, focus; varying vec2 vUv;
    vec3 blur(vec2 uv, float r){
      vec3 c = vec3(0.); float tot = 0.;
      for (int i = -2; i <= 2; i++) for (int j = -2; j <= 2; j++){
        float w = 1.0 / (1.0 + float(i * i + j * j));
        c += texture2D(tDiffuse, uv + vec2(float(i), float(j)) * r / res).rgb * w; tot += w;
      }
      return c / tot;
    }
    void main(){
      vec3 c = texture2D(tDiffuse, vUv).rgb;
      float l = dot(c, vec3(.299, .587, .114));
      c = mix(vec3(l), c, sat);
      c = (c - .5) * con + .5;
      c += vec3(.015, .008, -.01) * smoothstep(.55, 1., l) + vec3(-.03, -.005, .05) * (1. - smoothstep(0., .55, l));
      float v = distance(vUv, vec2(.5, .52));
      c *= 1. - vig * smoothstep(.42, .95, v);
      gl_FragColor = vec4(clamp(c, 0., 1.), 1.);
    }`,
};

export function createPost(renderer, scene, camera){
  const size = renderer.getSize(new THREE.Vector2());
  const rt = new THREE.WebGLRenderTarget(size.x, size.y, {type: THREE.HalfFloatType, samples: 4});
  const composer = new EffectComposer(renderer, rt);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(size.x, size.y), .18, .3, .95);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
  const grade = new ShaderPass(GradeShader);
  composer.addPass(grade);

  let quality = 'high';
  const api = {
    get quality(){ return quality; },
    setQuality(q){
      quality = q;
      bloom.enabled = q !== 'low';
    },
    setSize(w, h, pr){
      composer.setPixelRatio(pr); composer.setSize(w, h);
      grade.uniforms.res.value.set(w * pr, h * pr);
    },
    render(){ composer.render(); },
  };
  return api;
}
