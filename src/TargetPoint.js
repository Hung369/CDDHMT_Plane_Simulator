import * as THREE from "three";
import { planePosition } from "./Airplane";
import { getScore } from "./redux/gameSlice";

const TARGET_RAD = 8;
let targets;
let loopes = [];

function RandomPoints(scaling) {
  // position
  let val = new THREE.Vector3(
    Math.random() * 400 - 200,
    Math.random() * 101 + 500,
    Math.random() * 400 - 200
  ).multiply(scaling || new THREE.Vector3(1, 1, 1));
  return val;
}

function RandomDirection() {
  // direction
  return new THREE.Vector3(
    Math.random() * 2 - 1,
    Math.random() * 2 - 1,
    Math.random() * 2 - 1
  ).multiply(new THREE.Vector3(1, 1, 1));
}

function Targets() {
  const arr = [];
  for (let i = 0; i < 15; i++) {
    arr.push({
      center: RandomPoints(new THREE.Vector3(4, 1, 4)).add(
        new THREE.Vector3(0, 2 + Math.random() * 2, 0)
      ),
      direction: RandomDirection().normalize(),
      name: i.toString(),
    });
  }
  return arr;
}

export function BufferOfTargets(scene) {
  targets = Targets();

  targets.forEach((target) => {
    const torusGeo = new THREE.TorusGeometry(TARGET_RAD, 1.52, 12, 25);
    torusGeo.applyQuaternion(
      new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        target.direction
      )
    );
    torusGeo.translate(target.center.x, target.center.y, target.center.z);
    let loope = new THREE.Mesh(
      torusGeo,
      new THREE.MeshStandardMaterial({ roughness: 0.5, metalness: 0.5 })
    );
    loope.name = target.name;
    loopes.push(loope);
    scene.add(loope);
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

export function CheckHit(scene, dispatch, getScoreAction) {
  targets.forEach((target) => {
    const v = planePosition.clone().sub(target.center);
    const dist = target.direction.dot(v);
    const projected = planePosition
      .clone()
      .sub(target.direction.clone().multiplyScalar(dist));

    const hitDist = projected.distanceTo(target.center);
    if (hitDist <= TARGET_RAD) {
      let gotItem = loopes.find((loope) => loope.name == target.name);
      if (gotItem) {
        RemoveLoops(scene, gotItem);
        const index = loopes.indexOf(gotItem);
        if (index > -1) {
          loopes.splice(index, 1);

          dispatch(getScoreAction(50));
        }
      }
    }
    // console.log(loopes.length);
  });
}

export function resetAll() {
  targets = undefined;
  loopes = [];
}
