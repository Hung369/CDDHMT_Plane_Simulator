import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { F16 } from "./Airplane";
import { sky_showroom, base_showroom } from "./Texture_Loader";
import { createDirectionalLight } from "./LightSource";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setPlaying } from "./redux/gameSlice";

const ShowroomComponent = () => {
  const mountRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const score = useSelector((state) => state.game.score);
  const isPlaying = useSelector((state) => state.game.isPlaying);

  const [time, setTime] = useState(5);

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
  };
  const handleExit = () => {
    navigate("/");
  };

  const handlePause = (event) => {
    if (event.key === "Escape") {
      if (isPlaying) {
        dispatch(setPlaying(false));
        setShow(true); // Show the pause menu when the game is paused
      } else {
        dispatch(setPlaying(true));
      }
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
    var groundGeometry = new THREE.BoxGeometry(80, 0.01, 80);
    var groundSurface = base_showroom();
    var groundMaterial = new THREE.MeshPhongMaterial({ map: groundSurface });
    var ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.receiveShadow = true;
    ground.position.set(0, 0, 0);
    scene.add(ground);

    // Jet setup
    const jet_fighter = F16();
    jet_fighter.position.set(0, -6, 0);
    scene.add(jet_fighter);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.01,
      2000
    );
    camera.position.set(8, 8, 8);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(camera);

    // Controller setup
    const cameraControls = new OrbitControls(camera, renderer.domElement);

    // Lightsource setup
    const lightSource = createDirectionalLight(0xf4e99b, 5.0);
    lightSource.position.set(15, 15, 15);
    scene.add(lightSource);

    // Axes helper
    const axesHelper = new THREE.AxesHelper(500);
    axesHelper.setColors(
      new THREE.Color("rgb(255,0,0)"),
      new THREE.Color("rgb(0,255,0)"),
      new THREE.Color("rgb(0,0,255)")
    );
    scene.add(axesHelper);

    // Animation loop
    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
      cameraControls.update();
    };

    animate();

    // Clean up
    return () => {
      if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      cancelAnimationFrame(frameId); // Stop the animation loop
      // Additional cleanup for Three.js objects
    };
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handlePause);

    // Clean up
    return () => {
      window.removeEventListener("keydown", handlePause);
      if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [location]);

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
