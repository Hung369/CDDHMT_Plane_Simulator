import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { F16, Boeing, Propel, planePosition, resetPlane } from "./Airplane";
import { sky_showroom, terrain_showroom } from "./Texture_Loader";
import { createDirectionalLight } from "./LightSource";
import { plane_camera } from "./Cam";
import { BufferOfTargets, CheckHit, resetAll } from "./TargetPoint";
import { reset, updatePlaneAxis } from "./Controller";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setPlaying } from "./redux/gameSlice";
import backgroundAudio from "./Audio/PlaneSoundTrack.mp4";

export const jet_translation = new THREE.Vector3(0, 8, 8);
export const boeing_translation = new THREE.Vector3(0, 7, 40);
export const prop_translation = new THREE.Vector3(0, 6, 20);

const ShowroomComponent = () => {
  const mountRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [audio] = useState(new Audio(backgroundAudio));

  const score = useSelector((state) => state.game.score);
  const isPlaying = useSelector((state) => state.game.isPlaying);

  let x = new THREE.Vector3(1, 0, 0);
  let y = new THREE.Vector3(0, 1, 0);
  let z = new THREE.Vector3(0, 0, 1);

  const delayedRotMatrix = new THREE.Matrix4();
  const delayedQuaternion = new THREE.Quaternion();

  const [time, setTime] = useState(50);

  let isAnimating = useRef(true);
  let animationFrameId;
  const animateRef = useRef();
  const scene = new THREE.Scene();

  var translation = jet_translation;

  useEffect(() => {
    dispatch(setPlaying(true));
  }, []);

  useEffect(() => {
    let timer;
    if (isPlaying && time > 0) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (!isPlaying) {
      clearInterval(timer);
    }
    if (time == 0) {
      audio.pause();
      setPlaying(false);
      setShow(true);
      isAnimating.current = false;
      window.cancelAnimationFrame(animationFrameId);
    }

    return () => clearInterval(timer);
  }, [isPlaying, time]); // add time and isPaused as dependencies

  const [show, setShow] = useState(false);

  const handleResume = () => {
    setShow(false);
    dispatch(setPlaying(true));
    if (!isAnimating.current) {
      isAnimating.current = true;
      animateRef.current(); // Resume animation
      audio.play().catch((error) => console.log("Error playing audio:", error)); // Attempt to play audio
    }
  };
  const handleExit = () => {
    for (var i = scene.children.length - 1; i >= 0; i--) {
      obj = scene.children[i];
      scene.remove(obj);
    }
    reset();
    resetAll();
    x.set(1, 0, 0);
    y.set(0, 1, 0);
    z.set(0, 0, 1);
    resetPlane();
    navigate("/");
  };

  const handlePause = (event) => {
    if (event.key === "Escape") {
      dispatch(setPlaying(false));
      setShow(true);
      isAnimating.current = false;
      window.cancelAnimationFrame(animationFrameId);
      audio.pause();
    }
  };

  useEffect(() => {
    // Scene setup

    const skyscene = sky_showroom();
    scene.background = skyscene;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    // Ground setup
    const ground = terrain_showroom();
    scene.add(ground);

    // Fog setup
    scene.fog = new THREE.Fog(0xABAEB0, 1000, 1500);

    // Jet setup
    var jet_fighter = F16();
    switch (location.state.model) {
      case "F16":
        jet_fighter = F16();
        translation = jet_translation;
        break;
      case "Boeing":
        jet_fighter = Boeing();
        translation = boeing_translation;
        break;
      case "Propel":
        jet_fighter = Propel();
        translation = prop_translation;
        break;
      default:
        break;
    }
    scene.add(jet_fighter);

    // Camera setup
    var camera = plane_camera(scene, planePosition);
    scene.add(camera);

    // Lightsource setup
    const lightSource = createDirectionalLight(0xf4e99b, 2.0);
    lightSource.position.set(100000, 100000, 100000);
    scene.add(lightSource);

    BufferOfTargets(scene);

    function collision() {
      let raycaster = new THREE.Raycaster();
      let pos = new THREE.Vector3();
      jet_fighter.getWorldPosition(pos);
      let direction = new THREE.Vector3();

      // Update the direction vector with the direction of the aircraft
      direction.subVectors(pos, ground.position).normalize();

      // Set the raycaster to the position of the aircraft and point it in the direction of the terrain
      raycaster.set(pos, direction);

      // Check if the ray intersects the terrain
      let intersects = raycaster.intersectObject(ground);

      if (intersects.length > 0) {
        console.log("Hit");
        // update end game
      }

      if(pos.x < -1509.96 || pos.z < -1505.18 || pos.x > 1509.73 || pos.z > 1509.20){
        console.log("Out of Range");
      }
    }

    function render() {
      // render function
      collision();
      CheckHit(scene);
      updatePlaneAxis(x, y, z, planePosition, camera);
      const rotMatrix = new THREE.Matrix4().makeBasis(x, y, z);
      const matrix = new THREE.Matrix4()
        .multiply(
          new THREE.Matrix4().makeTranslation(
            planePosition.x,
            planePosition.y,
            planePosition.z
          )
        )
        .multiply(rotMatrix);

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

      const cameraMatrix = new THREE.Matrix4()
        .multiply(
          new THREE.Matrix4().makeTranslation(
            planePosition.x,
            planePosition.y,
            planePosition.z
          )
        )
        .multiply(delayedRotMatrix)
        .multiply(new THREE.Matrix4().makeRotationX(-0.2))
        .multiply(
          new THREE.Matrix4().makeTranslation(
            translation.x,
            translation.y,
            translation.z
          )
        );

      camera.matrixAutoUpdate = false;
      camera.matrix.copy(cameraMatrix);
      camera.matrixWorldNeedsUpdate = true;

      renderer.render(scene, camera);
    }

    // Animation loop
    animateRef.current = () => {
      if (!isAnimating.current) return; // Sử dụng current để truy cập giá trị của useRef
      animationFrameId = requestAnimationFrame(animateRef.current);
      render();
    };
    animateRef.current();

    // Clean up
    return () => {
      window.cancelAnimationFrame(animationFrameId);
      if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handlePause);

    return () => {
      window.removeEventListener("keydown", handlePause);
    };
  }, [isPlaying]);

  useEffect(() => {
    // Configure audio properties
    audio.loop = true;
    audio.volume = 1;

    // Try to play the audio
    audio.play().catch((error) => console.error("Audio play failed:", error));

    // Cleanup function to pause audio when component unmounts
    return () => {
      audio.pause();
    };
  }, [audio]);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <div id="GameController">
        <div>Score: {score}</div>
        <div>Time: {time}</div>
      </div>
      {show && (
        <div id="Modal">
          <h1>Score: {score}</h1>
          <div className="controller">
            {time > 0 && <button onClick={handleResume}>Resume</button>}
            <button onClick={handleExit}>Exit</button>
          </div>
        </div>
      )}
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default ShowroomComponent;
