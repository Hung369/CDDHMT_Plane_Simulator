import { Canvas, useFrame } from '@react-three/fiber'
import './App.css'
import { useRef } from 'react'
import { OrbitControls } from '@react-three/drei'

function Cube({ position, size, color }) {
  const ref = useRef();
  useFrame((state, delta) => {
    ref.current.rotation.x += delta;
    ref.current.rotation.y += delta * 2;
    ref.current.position.z = 2 * Math.cos(state.clock.elapsedTime);

  }); /* delta: time lapsed between 2 frames, state: status of all objects */
  return (
    <mesh position={position} ref={ref}>
      <boxGeometry args={size} /> {/*Geometry*/}
      <meshStandardMaterial color={color} /> {/*material*/}
    </mesh>
  );
};

const App = () => {
  return (
    <>
      <Canvas>
        <directionalLight position={[0, 0, 4]} intensity={0.8} />
        <ambientLight intensity={0.5} />
        <group position={[0, -1, 0]}> {/* gather all elements into a group, then we can setup position for all elements */}
          <Cube position={[1, 0, 0]} color={"green"} size={[1, 1, 1]} />
          <Cube position={[-1, 0, 0]} color={"hotpink"} size={[1, 1, 1]} />
          <Cube position={[-1, 2, 0]} color={"blue"} size={[1, 1, 1]} />
          <Cube position={[1, 2, 0]} color={"yellow"} size={[1, 1, 1]} />
        </group>
        <OrbitControls/>
      </Canvas>
    </>
  )
}

export default App;
