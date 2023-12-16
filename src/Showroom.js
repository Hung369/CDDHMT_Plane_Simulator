import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { F16 } from './Airplane';
import { sky_showroom, base_showroom } from './Texture_Loader';
import { createDirectionalLight } from './LightSource';

var camera, scene, renderer;
var cameraControls, lightSource;


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
    ground.position.set(0,0,0);
    scene.add(ground);

    // jet
    var jet_fighter = F16();
    jet_fighter.position.set(0,-6,0);
    scene.add(jet_fighter);
    
    // camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 2000);
    camera.position.set(8, 8, 8);
    camera.lookAt(new THREE.Vector3(0,0,0));
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
    renderer.render(scene, camera);
    cameraControls.update();
}

init();
animate();