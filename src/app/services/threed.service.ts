import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { VRButton } from 'three/examples/jsm/webxr/VRButton';

@Injectable({
  providedIn: 'root'
})
export class ThreedService {
  camera!: THREE.PerspectiveCamera;
  scene!: THREE.Scene;
  renderer!: THREE.WebGLRenderer;
  controls!: any;

  variants: any;
  variantIndex = 0;
  gltfParser: any;
  variantsExtension: any;

  constructor() {}

  init(container: HTMLElement) {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 20);
    this.camera.position.set(2.5, 1.5, 3.0);
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(this.renderer.domElement);
    container.appendChild( VRButton.createButton( this.renderer ) );
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.renderer.xr.enabled = true;
    
    this.controls.minDistance = 2;
    this.controls.maxDistance = 10;
    this.controls.target.set(0, 0.5, - 0.2);
    this.controls.update();

    new RGBELoader()
      .setPath('assets/3d/')
      .load('quarry_01_1k.hdr', (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;

        this.scene.background = texture;
        this.scene.environment = texture;
        
        this.render();
        const loader = new GLTFLoader().setPath('assets/3d/');
        loader.load('MaterialsVariantsShoe.glb', (gltf) => {
          gltf.scene.scale.set(10.0, 10.0, 10.0);
          this.scene.add(gltf.scene);
          this.gltfParser = gltf.parser;
          this.variantsExtension = gltf.userData.gltfExtensions['KHR_materials_variants'];
          this.variants = this.variantsExtension.variants.map((variant: any) => variant.name);
          this.selectVariant(this.scene, this.gltfParser, this.variantsExtension, this.variants[this.variantIndex]);
          this.render();
        });
      });
    window.addEventListener('resize', this.onWindowResize);
  }

  selectVariant(scene: any, parser: any, extension: any, variantName: any) {
    const variantIndex = extension.variants.findIndex((v: any) => v.name.includes(variantName));

    scene.traverse(async (object: any) => {
      if (!object.isMesh || !object.userData.gltfExtensions) return;
      const meshVariantDef = object.userData.gltfExtensions['KHR_materials_variants'];
      if (!meshVariantDef) return;
      if (!object.userData.originalMaterial) {
        object.userData.originalMaterial = object.material;
      }

      const mapping = meshVariantDef.mappings
        .find((mapping: any) => mapping.variants.includes(variantIndex));

      if (mapping) {
        object.material = await parser.getDependency('material', mapping.material);
        parser.assignFinalMaterial(object);
      } else {
        object.material = object.userData.originalMaterial;
      }
      this.render();
    });
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.render();
  }

  render() {
    this.renderer.setAnimationLoop(() => {
      this.controls.update();
      this.renderer.render(this.scene, this.camera)
    });
    // requestAnimationFrame( this.render.bind(this) );
    // this.controls.update();
    // this.renderer.render(this.scene, this.camera);
  }

  switchMaterial(){
    this.variantIndex += 1;
    if(this.variantIndex > this.variants.length){
      this.variantIndex = 0;
    }
    this.selectVariant(this.scene, this.gltfParser, this.variantsExtension, this.variants[this.variantIndex]);
  }
}
