import { useRef, useEffect, useLayoutEffect, useCallback } from 'react'
import { useFrame, useThree } from "@react-three/fiber"
import { a } from '@react-spring/three'
import { useSpring, config } from '@react-spring/core'
import { useGesture, useWheel } from '@use-gesture/react'

export default function MyCamera(props) {
    const {position, posOne, posTwo, scrollSpeed, orientation} = props;
    const [ox,oy] = orientation;
    const {viewport} = useThree();
    const {factor} = viewport;
    
    const [spring, api] = useSpring(() => ({ pos: 0, config: config.slow }))
  
    const fn = useCallback(
      ({ event, movement, offset, xy, memo = spring.pos.get()}) => {      
        if(event.type == "wheel"){
          const offsetTo = memo + movement[1]/(2*scrollSpeed);
          const newPosition = offsetTo > posTwo ? posTwo : offsetTo < posOne ? posOne : offsetTo
          api.start({pos: newPosition});
          return newPosition
        }else{
          const offsetTo = memo + movement[1]/(scrollSpeed/10);
          const newPosition = offsetTo > posTwo ? posTwo : offsetTo < posOne ? posOne : offsetTo
          api.start({pos: newPosition});
          return memo
        }
      },
      [spring, api]
    );

    const bind = useGesture(
      { 
        onWheel: fn,
        onDrag: fn
      }, 
      {
        target: window,
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