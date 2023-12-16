import * as THREE from "three";
import skyjpg from "./scene/sky.jpg";
import basejpg from "./scene/base.jpg";

export function sky_showroom() {
  var sky = new THREE.TextureLoader().load(skyjpg);
  sky.name = "showroom_sky";
  return sky;
}

export function base_showroom() {
  var base = new THREE.TextureLoader().load(basejpg);
  base.name = "showroom_base";
  return base;
}
