import { useRef, useEffect, useLayoutEffect, useCallback } from 'react'
import { useFrame, useThree } from "@react-three/fiber"
import { a } from '@react-spring/three'
import useScroll from './useScroll'

export default function MyCamera(props) {
    const {position, posOne, posTwo, scrollSpeed, orientation} = props;
    const [ox,oy] = orientation;

    const pos = useScroll([posOne*scrollSpeed, posTwo*scrollSpeed], {config: { domTarget: window }});
    const cameraRef = useRef()
    const set = useThree(({ set }) => set)
    const size = useThree(({ size }) => size)

    useLayoutEffect(() => {
      if (cameraRef.current) {
        cameraRef.current.aspect = size.width / size.height
        cameraRef.current.updateProjectionMatrix()
      }
    }, [size, props])
    
    useLayoutEffect(() => {
      set({ camera: cameraRef.current })
    }, [])
    
    return (
        <a.group 
          position-x={Math.abs(ox)!=0 ? pos.to((pos) => (pos/scrollSpeed)) : position[0]} 
          position-y={Math.abs(oy)!=0 ? pos.to((pos) => (pos/scrollSpeed)) : position[1]}
        >
            <perspectiveCamera ref={cameraRef} {...props} />
            {/* <spotLight intensity={0.3} position={[30,10,50]} angle={0.2} penumbra={0.5}/> */}
        </ a.group>
    )
}