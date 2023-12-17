import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { F16 } from './Airplane';
import { sky_showroom, base_showroom } from './Texture_Loader';
import { createDirectionalLight } from './LightSource';
import { plane_camera } from './Cam';

var camera, scene, renderer;
var cameraControls, lightSource;
var jet_fighter;
const camplanePosition = new THREE.Vector3(0,3,7);

function init(){
    scene = new THREE.Scene();
    var skyscene = sky_showroom();
    scene.background = skyscene;

    // renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    // ground
    var groundGeometry = new THREE.BoxGeometry(80, 0.01, 80);
    var groundSurface = base_showroom();
    var groundMaterial = new THREE.MeshPhongMaterial({ map: groundSurface });
    var ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.receiveShadow = true;
    scene.add(ground);

    // jet
    jet_fighter = F16();
    scene.add(jet_fighter);
    
    // camera
    camera = plane_camera(scene, camplanePosition);
    scene.add(camera)

    // controller cam
    cameraControls = new OrbitControls(camera, renderer.domElement);

    // lightsource
    lightSource = createDirectionalLight(0xF4E99B, 5.0);
    lightSource.position.set(15, 15, 15);
    scene.add(lightSource);

    var axesHelper = new THREE.AxesHelper(500);
    axesHelper.setColors(new THREE.Color("rgb(255,0,0)"), new THREE.Color("rgb(0,255,0)"), new THREE.Color("rgb(0,0,255)"));
    scene.add(axesHelper);
}

function animate(){
    requestAnimationFrame(animate);
    cameraControls.update();
    render()
}

function render(){
    renderer.render(scene, camera);
}

init();
animate();