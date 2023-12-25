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
        gltf.scene.scale.set(200, 200, 200);
        terrain.add(gltf.scene);
        // let bbox = new THREE.Box3().setFromObject(gltf.scene);
        // console.log('bounding box coordinates: ' + bbox.min.x + ', ' + bbox.min.y + ', ' + bbox.min.z + '), ' + 
        // '(' + bbox.max.x + ', ' + bbox.max.y + ', ' + bbox.max.z + ')' );
    });

    terrain.name = "grass_plain"
    return terrain;
}