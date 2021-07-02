import { useRef, useEffect, useLayoutEffect, useCallback } from 'react'
import { useFrame, useThree } from "@react-three/fiber"
import { a } from '@react-spring/three'
//import useMyScroll from './useMyScroll'
import { useSpring, config } from '@react-spring/core'
import { useGesture, useWheel } from '@use-gesture/react'

export default function MyCamera(props) {
    const {position, posOne, posTwo, scrollSpeed, orientation} = props;
    const [ox,oy] = orientation;
    
    const [spring, api] = useSpring(() => ({ pos: 0, config: config.slow }))
  
    const fn = useCallback(
      ({ offset }) => {
        api.start({pos: offset[1]/scrollSpeed});
      },
      [spring, api]
    );

    const bind = useGesture(
      { 
        onWheel: fn
      }, 
      {
        target: window,
        wheel: { 
          bounds: {
            top: posOne*scrollSpeed,
            bottom: posTwo*scrollSpeed
          }
        }
      }
    );

    useEffect(() => spring.config && spring.config.target && bind(), [bind])

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
         position-x={ Math.abs(ox)!=0 ? spring.pos : position[0]}
         position-y={ Math.abs(oy)!=0 ? spring.pos : position[1]}
        >
            <perspectiveCamera ref={cameraRef} {...props} />
        </ a.group>
    )
}