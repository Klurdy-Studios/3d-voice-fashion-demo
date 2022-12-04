import { Injectable } from '@angular/core';
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

@Injectable({
  providedIn: 'root'
})
export class ThreedService {
  camera!: THREE.PerspectiveCamera;
  scene!: THREE.Scene;
  renderer!: THREE.WebGLRenderer;
  controls!: any;

  state = { variant: 'midnight' };
  variants: any;


  constructor() {
  }

  init(container: any) {

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 20);
    this.camera.position.set(2.5, 1.5, 3.0);

    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(this.renderer.domElement);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    
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
          const parser = gltf.parser;
          const variantsExtension = gltf.userData.gltfExtensions['KHR_materials_variants'];
          this.variants = variantsExtension.variants.map((variant: any) => variant.name);

          this.selectVariant(this.scene, parser, variantsExtension, this.state.variant);

          // variantsCtrl.onChange( ( value ) => selectVariant( scene, parser, variantsExtension, value ) );

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
    // console.log('renderer')
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // console.log(this.renderer)
    this.render();

  }

  render() {
    requestAnimationFrame( this.render.bind(this) );
    // required if controls.enableDamping or controls.autoRotate are set to true
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }


}
