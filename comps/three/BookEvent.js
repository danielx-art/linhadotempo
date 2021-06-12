import { useContext, useRef, useState, useEffect, forwardRef } from 'react'
import { useFrame } from "@react-three/fiber"
import { useSpring, a } from '@react-spring/three'
import { Dodecahedron } from '@react-three/drei'
import { allContext } from '../../pages';

const BookEvent = forwardRef(
  ({item, scale, id}, ref) => {

      const position = [...item.dates.initial[0].positioning, 0];

      const type = item.type;

      const mesh = useRef();

      const [hovered, setHover] = useState(false);

      const {selectedObject, setSelectedObject} = useContext(allContext);

      const [{ wobble, color }] = useSpring(
        {
          wobble: selectedObject == id ? 1.3*scale : hovered ? 1.1*scale : 1*scale,
          color: selectedObject == id ? 'cyan' : 'pink',
          config: (n) => n === 'wobble' && hovered && { mass: 2, tension: 1000, friction: 10 }
        },
        [hovered, selectedObject]
      );
    
      useFrame(() => {
        mesh.current.position.x = position[0] + 2*Math.sin(new Date().getTime()/1800*(id/2));
        mesh.current.position.y = position[1] + 2*Math.sin(new Date().getTime()/2000*(id*id/7));
        mesh.current.position.z = position[2] + 2*Math.sin(new Date().getTime()/600*(1+id*0.05));
        mesh.current.rotation.x = mesh.current.rotation.y += 0.01 +id*id/2000 - id/200;
      });

      const handleClick = () => {
        selectedObject == id ? setSelectedObject(-1) : (setSelectedObject(id), console.log(position));
      }
    
      return (
        <a.group 
          position={position} 
          ref={mesh} 
          scale={wobble}
          onClick={handleClick}      //here at setSelectedObject we jave to use !active, because it happens before the actual setActive
          onPointerOver={(e) => setHover(true)}
          onPointerOut={(e) => setHover(false)}
        >
          <Dodecahedron ref={ref}>
            <a.meshStandardMaterial color={color} emissive={'white'} emissiveIntensity={(scale-1)*3}/>
          </Dodecahedron>
        </a.group>

      )
  }
);

export default BookEvent;