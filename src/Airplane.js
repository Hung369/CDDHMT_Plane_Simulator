import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import * as THREE from 'three';

const planePosition = new THREE.Vector3(0,-4,7); // plane initial position

export function F16() {
  var jet = new THREE.Object3D();
  const loader = new GLTFLoader();

  loader.load('./src/model/F16_jet.glb', (gltf) => {
    gltf.scene.traverse(function (node) {
      if (node.isMesh) {
        // Enable shadow casting
        node.castShadow = true;

        // Swap the material
        node.material = new THREE.MeshPhongMaterial({ map: node.material.map });

      }
    });
    gltf.scene.scale.set(0.8, 0.8, 0.8);
    jet.add(gltf.scene);
  });

  jet.position.set(planePosition.x, planePosition.y, planePosition.z);
  // jet.matrixAutoUpdate = false;
  // jet.matrixWorldNeedsUpdate = true;

  return jet;
}
