import { useContext, useRef, useState } from 'react'
import { useFrame } from "@react-three/fiber"
import { useSpring, a } from '@react-spring/three'
import { Dodecahedron } from '@react-three/drei'
import { allContext } from '../../pages';

export default function MyDodecahedron({position, scale, id}) {

    const mesh = useRef();

    const [hovered, setHover] = useState(false);
    const [active, setActive] = useState(false);

    const {selectedObject, setSelectedObject} = useContext(allContext);

    const [{ wobble, color }] = useSpring(
      {
        wobble: active ? 1.1*scale : hovered ? 1.02*scale : 1*scale,
        color: hovered ? [250,0,20] : [100,0,250], //not working
        config: (n) => n === 'wobble' && hovered && { mass: 2, tension: 1000, friction: 10 }
      },
      [hovered, active]
    );
  
    useFrame(() => {
        mesh.current.position.x = position[0] + 2*Math.sin(new Date().getTime()/1800);
        mesh.current.position.y = position[1] + 2*Math.sin(new Date().getTime()/2000);
        mesh.current.position.z = position[2] + 2*Math.sin(new Date().getTime()/600);
        mesh.current.rotation.x = mesh.current.rotation.y += 0.01;
    });
  
    return (
      <a.group 
        position={position} 
        ref={mesh} 
        scale={wobble}
        onClick={(e) => {setActive(!active); setSelectedObject((!active && id)|| -1 )}}      //here at setSelectedObject we jave to use !active, because it happens before the actual setActive
        onPointerOver={(e) => setHover(true)}
        onPointerOut={(e) => setHover(false)}
      >
        <Dodecahedron>
          <a.meshStandardMaterial emissive={color} emissiveIntensity={0.2} />
        </Dodecahedron>
      </a.group>
    )
}