import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { F16, Boeing, Propel, planePosition } from "./Airplane";
import { sky_showroom, base_showroom, terrain_showroom } from "./Texture_Loader";
import { createDirectionalLight } from "./LightSource";
import { plane_camera } from "./Cam";
import { BufferOfTargets, CheckHit } from "./TargetPoint";
import { updatePlaneAxis } from "./Controller";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setPlaying } from "./redux/gameSlice";

export const jet_translation = new THREE.Vector3(0, 8, 8);
export const boeing_translation = new THREE.Vector3(0, 7, 40);
export const prop_translation = new THREE.Vector3(0, 6, 20);

const ShowroomComponent = () => {
  const mountRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const score = useSelector((state) => state.game.score);
  const isPlaying = useSelector((state) => state.game.isPlaying);

  const x = new THREE.Vector3(1, 0, 0);
  const y = new THREE.Vector3(0, 1, 0);
  const z = new THREE.Vector3(0, 0, 1);

  const delayedRotMatrix = new THREE.Matrix4();
  const delayedQuaternion = new THREE.Quaternion();

  const [time, setTime] = useState(50);

  let isAnimating = useRef(true);
  let animationFrameId;
  const animateRef = useRef();

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
      setPlaying(false);
      setShow(true);
    }

    return () => clearInterval(timer);
  }, [isPlaying, time]); // add time and isPaused as dependencies

  const [show, setShow] = useState(false);

  const handleResume = () => {
    setShow(false);
    dispatch(setPlaying(true));
    if (!isAnimating.current) {
      isAnimating.current = true;
      animateRef.current(); // Khởi động lại animate
    }
  };
  const handleExit = () => {
    navigate("/");
  };

  const handlePause = (event) => {
    if (event.key === "Escape") {
      dispatch(setPlaying(false));
      setShow(true); // This will toggle the show state
      isAnimating.current = false;
      window.cancelAnimationFrame(animationFrameId);
    }
  };

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
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
    const lightSource = createDirectionalLight(0xf4e99b, 5.0);
    lightSource.position.set(15, 15, 15);
    scene.add(lightSource);

    BufferOfTargets(scene);

    function render() {
      // render function
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

      CheckHit(scene);

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
