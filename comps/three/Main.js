import { useRef, useState, useEffect, useMemo, useContext, useCallback } from 'react'
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useContextBridge } from '@react-three/drei'
//import { EffectComposer, SelectiveBloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import MyCamera from '../three/MyCamera'
import BookEvent from './BookEvent'
import BookPersona from './BookPersona'
import BookPeriod from './BookPeriod'
import { allContext } from '../../pages'
import {sortedTimestamps, findPositioning} from '../../helpers'
import { Dodecahedron } from '@react-three/drei'
import { useSpring, config } from '@react-spring/core'
import { a } from '@react-spring/three'
import { useGesture } from '@use-gesture/react'


export default function Main() { 

  const ContextBridge = useContextBridge(allContext);
  const {selectedObject, book, theme} = useContext(allContext);
  const [ox,oy] = theme.orientation;
  
  const dirLight = useMemo(()=>{
    const light = new THREE.DirectionalLight('white');
    light.castShadow=true;
    //Set up shadow properties for the light
    light.shadow.mapSize.width = 10240 // default
    light.shadow.mapSize.height = 10240 // default
    light.shadow.camera.near = 0.1 // default
    light.shadow.camera.far = 5000 // default
    light.shadow.camera.top = -100 // default
    light.shadow.camera.right = 100 // default
    light.shadow.camera.left = -100 // default
    light.shadow.camera.bottom = 100 // default
    return light
  },[]);

  const ambientLightRef = useRef();
  const dirLightRef = useRef();

  const bookRefs = useRef();
  bookRefs.current = [];

  const addToRefs = (item) => {
    if (item && !bookRefs.current.includes(item)) {
      bookRefs.current.push(item);
    }
  };

  const initializePositions = useMemo(()=>{
    let initialPositions = [];
    book.forEach((item)=>{
      //let [ox, oy] = theme.orientation;
      for(let date in item.dates){
        item.dates[date].forEach((thisDate)=>{
          let [mainAxis, crossAxis] = thisDate.positioning;         
          let px = ox*mainAxis + (1-Math.abs(ox))*crossAxis;
          let py = oy*mainAxis + (1-Math.abs(oy))*crossAxis;
          thisDate.positioning = [px, py];
        })
      }
    });
  }, [theme, book]);

  const [firstPos, lastPos] = useMemo(()=>{
    //let [ox, oy] = theme.orientation;
    let firstP = Math.abs(ox)*book[0].dates.initial[0].positioning[0] + Math.abs(oy)*book[0].dates.initial[0].positioning[1];

    let sortedTimestampsArray = sortedTimestamps(book);    
    let lastTimestamp = sortedTimestampsArray[sortedTimestampsArray.length -1];
    let lastPosition = findPositioning(book, lastTimestamp);
    
    let lastP = Math.abs(ox)*lastPosition[0] + Math.abs(oy)*lastPosition[1];

    return [Math.min(firstP, lastP),Math.max(firstP, lastP)]
  }, [initializePositions]);

  const scrollingTarget = useRef(null);
  // const [scrollSpring, api] = useSpring(() => ({ pos: 0, config: config.slow }))
  
  // const fn = useCallback(
  //   ({ event, movement, memo = scrollSpring.pos.get()}) => {      
  //     const posOne = firstPos;
  //     const posTwo = lastPos;
  //     const scrollSpeed = 160;

  //     if(event.type == "wheel"){
  //       const offsetTo = memo + movement[1]/(2*scrollSpeed);
  //       const newPosition = offsetTo > posTwo ? posTwo : offsetTo < posOne ? posOne : offsetTo
  //       api.start({pos: newPosition});
  //       return newPosition
  //     }else{
  //       const offsetTo = memo + movement[1]/(scrollSpeed/10);
  //       const newPosition = offsetTo > posTwo ? posTwo : offsetTo < posOne ? posOne : offsetTo
  //       api.start({pos: newPosition});
  //       return memo
  //     }
  //   },
  //   [scrollSpring, api]
  // );

  // const bind = useGesture(
  //   { 
  //     onWheel: fn,
  //     onDrag: fn
  //   },
  //   {

  //   }
  // );

  return (
    <div className="canvasContainer" ref={scrollingTarget}>

    <Canvas 
      linear = "true"
      //frameloop="demand" 
      shadows = "true"
      shadowMap
    > <ContextBridge>
      
      {/* <a.group
        position-x={ Math.abs(ox)!=0 ? scrollSpring.pos : 0}
        position-y={ Math.abs(oy)!=0 ? scrollSpring.pos : 0}
      >
        <MyCamera position={[0, 0, 30]}/> 
      </a.group> */}
      
      <MyCamera position={[0, 0, 30]} posOne={firstPos} posTwo ={lastPos} scrollSpeed={160} orientation={theme.orientation} scrollingTarget={scrollingTarget} />
      
      <ambientLight intensity={0.2} ref={ambientLightRef}/>

      {/*object for testing and debugging: */}
      <Dodecahedron radius={5} position={[0,0]}>
        <meshStandardMaterial color={'white'}/>
      </Dodecahedron>

      <Background />

      {book.map((item, index)=>{ 

        if(item.type == 'event') return <BookEvent item={item} scale={1} id={index} key={index} ref={addToRefs}/>
        if(item.type == 'persona') return <BookPersona item={item} scale={1} id={index} key={index} ref={addToRefs}/>
        if(item.type == 'period') return <BookPeriod item={item} scale={1} id={index} key={index} ref={addToRefs}/>

      })}

      <primitive object={dirLight} position={[30, 0, 30]} ref={dirLightRef}/>
      <primitive object={dirLight.target} position={[0, 0, 0]} />

      </ContextBridge></Canvas>

      <div className="selectedTest">{selectedObject}</div>
    </div>
  )
}

function Background() {
  const { scene } = useThree()

  useEffect(() => {

    scene.background = new THREE.Color('rgb(50,50,100)');

    return () => (scene.environment = scene.background = null)
  }, [])
  return null
}