import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import * as THREE from 'three';

const jetPosition = new THREE.Vector3(0,-4,7); // plane initial position
const boeingPosition = new THREE.Vector3(0,200,7); // plane initial position

export function F16() {
  var jet = new THREE.Object3D();
  const loader = new GLTFLoader();

  loader.load('./model/F16_jet.glb', (gltf) => {
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

  jet.position.set(jetPosition.x, jetPosition.y, jetPosition.z);

  return jet;
}

export function Boeing() {
  var boeing = new THREE.Object3D();
  const loader = new GLTFLoader();

  loader.load('./model/boeing_52.glb', (gltf) => {
    gltf.scene.traverse(function (node) {
      if (node.isMesh) {
        // Enable shadow casting
        node.castShadow = true;

        // Swap the material
        node.material = new THREE.MeshPhongMaterial({ map: node.material.map });

      }
    });
    gltf.scene.scale.set(0.8, 0.8, 0.8);
    boeing.add(gltf.scene);
  });

  boeing.position.set(boeingPosition.x, boeingPosition.y, boeingPosition.z);
  return boeing;
}

export function Propel() {
  var jet = new THREE.Object3D();
  const loader = new GLTFLoader();

  loader.load('./model/halifax.glb', (gltf) => {
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

  jet.position.set(boeingPosition.x, boeingPosition.y, boeingPosition.z);
  return jet;
}
