import { useContext, useRef, useState, useMemo, forwardRef } from 'react'
import { useFrame } from "@react-three/fiber"
import { useSpring, a } from '@react-spring/three'
import { Plane, Dodecahedron } from '@react-three/drei'
import { allContext } from '../../pages';

const BookPeriod = forwardRef(
  ({item, scale, id}, ref) => {

    const {selectedObject, setSelectedObject, theme} = useContext(allContext);

    const [position, periodLenght, periodWidth] = useMemo(()=>{
      let [ox,oy] = theme.orientation;
      let initialPoint = Math.abs(ox) != 0 ? item.dates.initial[0].positioning[0] : item.dates.initial[0].positioning[1]; 
      let finalPoint = Math.abs(ox) != 0 ? item.dates.final[0].positioning[0] : item.dates.final[0].positioning[1];
      let len = Math.abs(finalPoint - initialPoint);
      let initPos = item.dates.initial[0].positioning;
      let pos = Math.abs(ox) != 0 ? [initPos[0] + ox*len/2, initPos[1], 0] : [initPos[0], initPos[1] + oy*len/2, 0]
      let w = 2;
      return [ pos, len, w ];
    }, [theme]);

    const type = item.type;

    const mesh = useRef();

    const [hovered, setHover] = useState(false);

    const [{ wobble, color }] = useSpring(
      {
        wobble: selectedObject == id ? 1.3*scale : hovered ? 1.1*scale : 1*scale,
        color: selectedObject == id ? 'cyan' : 'pink',
        config: (n) => n === 'wobble' && hovered && { mass: 2, tension: 1000, friction: 10 }
      },
      [hovered, selectedObject]
    );
  
    useFrame(() => {
      mesh.current.position.x = position[0] + 1*Math.sin(new Date().getTime()/1800*(id/2));
      mesh.current.position.y = position[1] + 1*Math.sin(new Date().getTime()/2000*(id*id/7));
      mesh.current.position.z = position[2] + 1*Math.sin(new Date().getTime()/600*(1+id*0.05));
      //mesh.current.rotation.y += 0.01 +id*id/2000 - id/200;
    });

    const handleClick = () => {
      selectedObject == id ? setSelectedObject(-1) : (setSelectedObject(id), console.log(position));
    }
  
    return (
      <a.group 
        position={position} 
        ref={mesh} 
        scale={wobble}
        onClick={handleClick}
        onPointerOver={(e) => setHover(true)}
        onPointerOut={(e) => setHover(false)}
      >
        <Plane args={[periodWidth, periodLenght, 2, 4]} ref={ref}>
          <a.meshStandardMaterial color={color} emissive={'white'} emissiveIntensity={(scale-1)*3}/>
        </Plane>
      </a.group>
    )
  }
);

export default BookPeriod