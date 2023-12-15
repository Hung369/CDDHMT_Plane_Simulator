import { Canvas, useFrame } from '@react-three/fiber'
import './App.css'
import { useRef } from 'react'
import { OrbitControls } from '@react-three/drei'
import Model from './F16'

const App = () => {
  return (
    <>
      <directionalLight position={[0, 0, 4]} intensity={0.8} />
      <ambientLight intensity={1.0} />
      <Model/>
      <OrbitControls/>
    </>
  )
}

export default App;
