import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { F16 } from './Airplane';
import { sky_showroom, base_showroom } from './Texture_Loader';
import { createDirectionalLight } from './LightSource';
import { plane_camera } from './Cam';
import { updatePlaneAxis } from './Controller'

let camera, scene, renderer;
let lightSource;
let jet_fighter;
export const planePosition = new THREE.Vector3(0, 3, 7);

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
    let groundGeometry = new THREE.BoxGeometry(580, 0.01, 580);
    let groundSurface = base_showroom();
    let groundMaterial = new THREE.MeshPhongMaterial({ map: groundSurface });
    let ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.receiveShadow = true;
    scene.add(ground);

    // jet
    jet_fighter = F16();
    scene.add(jet_fighter);

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

    jet_fighter.matrixAutoUpdate = false;
    jet_fighter.matrix.copy(matrix);

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
        .multiply(new THREE.Matrix4().makeTranslation(0, 8, 8)
        );

    camera.matrixAutoUpdate = false;
    camera.matrix.copy(cameraMatrix);
    camera.matrixWorldNeedsUpdate = true;

    renderer.render(scene, camera);
}

GameScene();
animate();