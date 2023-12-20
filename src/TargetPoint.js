import * as THREE from "three";
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

const TARGET_RAD = 8;

function RandomPoints(scaling){
    let val = new THREE.Vector3(Math.random() * 501 - 200, Math.random() * 201, Math.random() * 501 - 200)
    .multiply(scaling || new THREE.Vector3(1, 1, 1));
    return val;
}

function Targets(){
    const arr = [];
    for (let i = 0; i < 30; i++) {
        arr.push({
          center: RandomPoints(new THREE.Vector3(4, 1, 4)).add(new THREE.Vector3(0, 8, 0)),
          direction: RandomPoints().normalize()
        });
    }
    return arr;
}

export function BufferOfTargets(){
    let geo; 
    let targets = Targets();

    targets.forEach((target) => {
        const torusGeo = new THREE.TorusGeometry(TARGET_RAD, 1.52, 12, 25);
        torusGeo.applyQuaternion(
            new THREE.Quaternion().setFromUnitVectors(
            new THREE.Vector3(0, 0, 1),
            target.direction
            )
        );
        torusGeo.translate(target.center.x, target.center.y, target.center.z);

        if (!geo) geo = torusGeo;
        else geo = BufferGeometryUtils.mergeBufferGeometries([geo, torusGeo]);
    });

    const result = geo;
    return result;
}