import * as THREE from 'three';

export function plane_camera(scene, pos){
    var camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.01, 1500);
    camera.lookAt( scene.position );
    camera.position.set(pos.x, pos.y, pos.z);
    return camera;
}