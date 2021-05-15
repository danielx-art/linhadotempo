import { useRef, useEffect, useLayoutEffect } from 'react'
import { useFrame, useThree } from "@react-three/fiber"
import { a } from '@react-spring/three'
import useYScroll from '../three/useYScroll'

export default function MyCamera(props) {
    const {infLimit, supLimit} = props;
    const y = useYScroll([infLimit, supLimit], { domTarget: window });
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
        <a.group position-y={y.to((y) => (y / 500) * 25)}>
            <perspectiveCamera ref={cameraRef} {...props} />
            {/* <spotLight intensity={0.3} position={[30,10,50]} angle={0.2} penumbra={0.5}/> */}
        </ a.group>
    )
}