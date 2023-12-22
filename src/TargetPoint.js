import * as THREE from "three";
import { planePosition } from "./Airplane";

const TARGET_RAD = 6;
let targets;
let loopes = [];

function RandomPoints(scaling) {
  let val = new THREE.Vector3(Math.random() * 401 - 200, Math.random() * 101 + 500, Math.random() * 401 - 200)
    .multiply(scaling || new THREE.Vector3(1, 1, 1));
  return val;
}

function Targets() {
  const arr = [];
  for (let i = 0; i < 5; i++) {
    arr.push({
      center: RandomPoints(new THREE.Vector3(4, 1, 4)).add(new THREE.Vector3(0, 8, 0)),
      direction: RandomPoints().normalize(), name: i.toString()
    });
  }
  return arr;
}

export function BufferOfTargets(scene) {
  let i = 0;
  targets = Targets();

  targets.forEach((target) => {
    const torusGeo = new THREE.TorusGeometry(TARGET_RAD, 1.52, 12, 25);
    torusGeo.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), target.direction));
    torusGeo.translate(target.center.x, target.center.y, target.center.z);
    let loope = new THREE.Mesh(torusGeo, new THREE.MeshStandardMaterial({ roughness: 0.5, metalness: 0.5 }));
    loope.name = target.name;
    loopes.push(loope);
    scene.add(loope);
    i += 1;
  });
}

function RemoveLoops(scene, object) {
  var selectedObject = scene.getObjectByName(object.name);

  // Remove the object from the scene
  scene.remove(selectedObject);

  // Clear any reference to the object for garbage collection
  selectedObject = undefined;
  object = undefined;
}

export function CheckHit(scene) {
  targets.forEach((target) => {
    const v = planePosition.clone().sub(target.center);
    const dist = target.direction.dot(v);
    const projected = planePosition.clone().sub(target.direction.clone().multiplyScalar(dist));

    const hitDist = projected.distanceTo(target.center);
    // console.log(hitDist, dist)
    if (hitDist <= TARGET_RAD + 0.8 && Math.abs(dist) <= 1.0) {
      let gotItem = loopes.find((loope) => loope.name == target.name)
      if(gotItem) {
        RemoveLoops(scene, gotItem);
        const index = loopes.indexOf(gotItem);
        if (index > -1) { loopes.splice(index, 1); }
      }
    }
    console.log(loopes.length);
  });
}

export function resetAll(){
  targets = undefined;
  loopes = [];
}