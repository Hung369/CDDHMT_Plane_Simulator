import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import * as THREE from 'three';

export let planePosition = new THREE.Vector3(0,300,7);

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

  return jet;
}

export function Boeing() {
  var boeing = new THREE.Object3D();
  const loader = new GLTFLoader();

  loader.load('./src/model/boeing_52.glb', (gltf) => {
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

  boeing.position.set(planePosition.x, planePosition.y, planePosition.z);
  return boeing;
}

export function Propel() {
  var propel = new THREE.Object3D();
  const loader = new GLTFLoader();

  loader.load('./src/model/halifax.glb', (gltf) => {
    gltf.scene.traverse(function (node) {
      if (node.isMesh) {
        // Enable shadow casting
        node.castShadow = true;

        // Swap the material
        node.material = new THREE.MeshPhongMaterial({ map: node.material.map });

      }
    });
    gltf.scene.scale.set(0.8, 0.8, 0.8);
    propel.add(gltf.scene);
  });
  propel.position.set(planePosition.x, planePosition.y, planePosition.z);
  return propel;
}


export function resetPlane(){
  planePosition = new THREE.Vector3(0,300,7);
}