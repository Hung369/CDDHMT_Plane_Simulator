import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export function sky_showroom(){
    var sky = new THREE.TextureLoader().load("./src/scene/sky.jpg");
    sky.name = 'showroom_sky';
    return sky;
}

export function base_showroom(){
    var base = new THREE.TextureLoader().load("./src/scene/base.jpg");
    base.wrapS = THREE.RepeatWrapping;
    base.wrapT = THREE.RepeatWrapping;
    base.repeat.set(20, 20);
    base.name = 'showroom_base';
    return base;
}

export function terrain_showroom(){
    var terrain = new THREE.Object3D();
    const loader = new GLTFLoader();

    loader.load('./src/model/GrassPlain.glb', (gltf) => {
        gltf.scene.scale.set(100, 100, 100);
        terrain.add(gltf.scene);
    });

    terrain.name = "grass_plain"
    return terrain;
}