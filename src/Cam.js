import * as THREE from 'three';

export function plane_camera(scene, pos){
    var camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.01, 2000);
    camera.lookAt( scene.position );
    camera.position.set(pos.x, pos.y, pos.z);
    camera.rotation.x = -0.2;
    camera.position.y += 4;
    camera.position.z += 4;
    return camera;
}