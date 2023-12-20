import * as THREE from 'three';
import { F16, Boeing, Propel } from './Airplane';
import { sky_showroom, base_showroom, terrain_showroom } from './Texture_Loader';
import { createDirectionalLight } from './LightSource';
import { plane_camera } from './Cam';
import { updatePlaneAxis } from './Controller'

let camera, scene, renderer;
let lightSource;
let aircraft;
const planePosition = new THREE.Vector3(0, 300, 7);

const jet_translation = new THREE.Vector3(0, 8, 8);
const boeing_translation = new THREE.Vector3(0, 7, 40);
const prop_translation = new THREE.Vector3(0, 6, 20);

const x = new THREE.Vector3(1, 0, 0);
const y = new THREE.Vector3(0, 1, 0);
const z = new THREE.Vector3(0, 0, 1);

const delayedRotMatrix = new THREE.Matrix4();
const delayedQuaternion = new THREE.Quaternion();

function GameScene() {
    scene = new THREE.Scene();
    let skyscene = sky_showroom();
    scene.background = skyscene;

    // renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    // ground
    var ground = terrain_showroom();
    scene.add(ground);

    // jet
    aircraft = Propel();
    scene.add(aircraft);

    // camera
    camera = plane_camera(scene, planePosition);
    scene.add(camera)

    // // controller cam
    // cameraControls = new OrbitControls(camera, renderer.domElement);

    // lightsource
    lightSource = createDirectionalLight(0xF4E99B, 5.0);
    lightSource.position.set(15, 15, 15);
    scene.add(lightSource);

    let axesHelper = new THREE.AxesHelper(500);
    axesHelper.setColors(new THREE.Color("rgb(255,0,0)"), new THREE.Color("rgb(0,255,0)"), new THREE.Color("rgb(0,0,255)"));
    scene.add(axesHelper);
}

function animate() {
    requestAnimationFrame(animate);
    // cameraControls.update();
    render()
}

function render() {
    updatePlaneAxis(x, y, z, planePosition, camera);
    const rotMatrix = new THREE.Matrix4().makeBasis(x, y, z);
    const matrix = new THREE.Matrix4().multiply(
        new THREE.Matrix4().makeTranslation(planePosition.x, planePosition.y, planePosition.z)
    ).multiply(rotMatrix);

    aircraft.matrixAutoUpdate = false;
    aircraft.matrix.copy(matrix);

    var quaternionA = new THREE.Quaternion().copy(delayedQuaternion);
    var quaternionB = new THREE.Quaternion();
    quaternionB.setFromRotationMatrix(rotMatrix);

    var interpolationFactor = 0.175;
    var interpolatedQuaternion = new THREE.Quaternion().copy(quaternionA);
    interpolatedQuaternion.slerp(quaternionB, interpolationFactor);
    delayedQuaternion.copy(interpolatedQuaternion);

    delayedRotMatrix.identity();
    delayedRotMatrix.makeRotationFromQuaternion(delayedQuaternion);

    const cameraMatrix = new THREE.Matrix4().multiply(
        new THREE.Matrix4().makeTranslation(planePosition.x, planePosition.y, planePosition.z))
        .multiply(delayedRotMatrix).multiply(new THREE.Matrix4().makeRotationX(-0.2))
        .multiply(new THREE.Matrix4().makeTranslation(prop_translation.x, prop_translation.y, prop_translation.z)
        );

    camera.matrixAutoUpdate = false;
    camera.matrix.copy(cameraMatrix);
    camera.matrixWorldNeedsUpdate = true;

    renderer.render(scene, camera);
}

GameScene();
animate();