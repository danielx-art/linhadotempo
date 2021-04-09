import { useRef, useState } from 'react'
import { Canvas, useFrame, extend, useThree } from 'react-three-fiber'
import { Box } from '@react-three/drei'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
extend({ OrbitControls });

export default function Main() { 

    return (
        <div className="canvasContainer">
        <Canvas>
            <ambientLight intensity={2}/>
            <MyBox position={[10, 0, 0]} />
            {typeof window !== 'undefined' && <MyControls />}
        </Canvas>
        </div>
    )
}

const MyControls = function(){

    const {
        camera,
        gl: { domElement }
    } = useThree()

    return(
        <orbitControls args={[camera, domElement]} />
    )

}

const MyBox = function (props) {
    const mesh = useRef()
  
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)
  
    useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01))
  
    return (
      <Box
        args={[1, 1, 1]}
        {...props}
        ref={mesh}
        scale={active ? [6, 6, 6] : [5, 5, 5]}
        onClick={() => setActive(!active)}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <meshStandardMaterial
          attach="material"
          color={hovered ? '#2b6c76' : '#720b23'}
        />
      </Box>
    )
  }