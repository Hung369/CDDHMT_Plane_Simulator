import { Canvas } from '@react-three/fiber'
import './App.css'

function Cube({position, size, color}){
  return (
    <mesh position={position}>
      <boxGeometry args={size}/> {/*Geometry*/}
      <meshStandardMaterial color={color}/> {/*material*/}
    </mesh>
  );
};

const App = () => {
  return (
    <>
      <Canvas>
        <directionalLight position={[0,0,4]} intensity={0.8}/>
        <ambientLight intensity={0.5}/>
        <group position={[0, -1, 0]}> {/* gather all elements into a group, then we can setup position for all elements */}
          <Cube position={[1, 0, 0]} color={"green"} args={1} />
          <Cube position={[-1, 0, 0]} color={"hotpink"} args={1} />
          <Cube position={[-1, 2, 0]} color={"blue"} args={1} />
          <Cube position={[1, 2, 0]} color={"yellow"} args={1} />
        </group>
      </Canvas>
    </>
  )
}

export default App
