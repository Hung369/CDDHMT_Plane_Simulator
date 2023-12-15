import { GLTFLoader } from "three-stdlib";
import { useLoader } from '@react-three/fiber'

export default function Model() {
    const gltf = useLoader(GLTFLoader, '/model/F16.glb')
    return(
        <primitive object={gltf.scene} position={[0,-8,0]}/>
    );
}