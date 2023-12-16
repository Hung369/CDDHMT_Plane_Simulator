import * as THREE from 'three'

export function sky_showroom(){
    var sky = new THREE.TextureLoader().load("./scene/sky.jpg");
    sky.name = 'showroom_sky';
    return sky;
}

export function base_showroom(){
    var base = new THREE.TextureLoader().load("./scene/base.jpg");
    base.name = 'showroom_base';
    return base;
}