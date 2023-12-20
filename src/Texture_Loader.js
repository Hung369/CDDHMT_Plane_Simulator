import * as THREE from 'three'

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