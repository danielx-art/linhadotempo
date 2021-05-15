import { useRef } from 'react'
import { useFrame } from "@react-three/fiber"
import { Dodecahedron } from '@react-three/drei'

export default function MyDodecahedron({position, scale}) {

    const mesh = useRef();
  
    useFrame(() => {
        mesh.current.position.x = position[0] + 2*Math.sin(new Date().getTime()/1800);
        mesh.current.position.y = position[1] + 2*Math.sin(new Date().getTime()/2000);
        mesh.current.position.z = position[2] + 2*Math.sin(new Date().getTime()/600);
        mesh.current.rotation.x = mesh.current.rotation.y += 0.01;
    });
  
    return (
      <Dodecahedron position={position} ref={mesh} scale={scale}>
        <meshStandardMaterial emissive={[250,0,20]} emissiveIntensity={0.2} />
      </Dodecahedron>
    )
}