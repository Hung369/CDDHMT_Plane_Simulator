import * as THREE from 'three';
import { F16, Boeing, Propel, planePosition } from './Airplane';
import { sky_showroom, base_showroom, terrain_showroom } from './Texture_Loader';
import { createDirectionalLight } from './LightSource';
import { plane_camera } from './Cam';
import { updatePlaneAxis } from './Controller';
import {BufferOfTargets, CheckHit} from './TargetPoint';

let camera, scene, renderer;
let lightSource;
let aircraft, ground;

const jet_translation = new THREE.Vector3(0, 8, 8);
const boeing_translation = new THREE.Vector3(0, 7, 40);
const prop_translation = new THREE.Vector3(0, 6, 20);

const x = new THREE.Vector3(1, 0, 0);
const y = new THREE.Vector3(0, 1, 0);
const z = new THREE.Vector3(0, 0, 1);

const delayedRotMatrix = new THREE.Matrix4();
const delayedQuaternion = new THREE.Quaternion();

function collision() {
    let raycaster = new THREE.Raycaster();
    let pos = new THREE.Vector3(); 
    aircraft.getWorldPosition(pos);
    let direction = new THREE.Vector3();

    // Update the direction vector with the direction of the aircraft
    direction.subVectors(pos, ground.position).normalize();

    // Set the raycaster to the position of the aircraft and point it in the direction of the terrain
    raycaster.set(pos, direction);

    // Check if the ray intersects the terrain
    let intersects = raycaster.intersectObject(ground);

    if (intersects.length > 0) {
        console.log("Hit");
    }
}   


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
    ground = terrain_showroom();
    scene.add(ground);

    // jet
    aircraft = F16();
    scene.add(aircraft);

    // camera
    camera = plane_camera(scene, planePosition);
    scene.add(camera)

    scene = BufferOfTargets(scene);

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
    render();
}

function render() {
    collision();
    CheckHit(scene);
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
        .multiply(new THREE.Matrix4().makeTranslation(jet_translation.x, jet_translation.y, jet_translation.z)
    );

    camera.matrixAutoUpdate = false;
    camera.matrix.copy(cameraMatrix);
    camera.matrixWorldNeedsUpdate = true;

    renderer.render(scene, camera);
}

GameScene();
animate();