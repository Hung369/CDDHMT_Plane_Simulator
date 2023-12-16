import * as THREE from 'three';

export function createDirectionalLight(color, intensity){
    var lightSource = new THREE.DirectionalLight(color, intensity);
    lightSource.castShadow = true;
    lightSource.shadow.mapSize.width = 1024;
    lightSource.shadow.mapSize.height = 1024;
    lightSource.shadow.camera.left = -20;
    lightSource.shadow.camera.right = 20;
    lightSource.shadow.camera.top = 20;
    lightSource.shadow.camera.bottom = -20;
    lightSource.shadow.camera.updateProjectionMatrix();
    return lightSource;
}