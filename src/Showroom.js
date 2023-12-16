import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { F16 } from './Airplane';
import { sky_showroom, base_showroom } from './Texture_Loader';
import { createDirectionalLight } from './LightSource';

var camera, scene, renderer;
var cameraControls, lightSource;
var planePosition = new THREE.Vector3(0,3,7);
var cam_matrix = new THREE.Matrix4().makeTranslation(planePosition)
                .multiply(new THREE.Matrix4().makeRotationX(-0.2))
                .multiply(new THREE.Matrix4().makeTranslation(0, 0.015, 0.3));

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
    var jet_fighter = F16();
    scene.add(jet_fighter);
    
    // camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 2000);
    camera.lookAt(planePosition);
    camera.position.set(planePosition.x, planePosition.y, planePosition.z);
    camera.rotateX(-0.2);
    camera.position.y += 0.015;
    camera.position.z += 0.3; 
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