import { useRef, useState, useEffect, useMemo, useContext } from 'react'
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useContextBridge } from '@react-three/drei'
import { EffectComposer, SelectiveBloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import MyCamera from '../three/MyCamera'
import MyDodecahedron from '../three/MyDodecahedron'
import { allContext } from '../../pages'
import {sortedTimestamps, findPositioning} from '../../helpers'


export default function Main() { 

  const ContextBridge = useContextBridge(allContext);
  const {selectedObject, book, theme} = useContext(allContext);
  
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

  const [showBloom, setShowBloom] = useState(false);
  const refSelectedObject = useRef();
  const bookRefs = useRef();
  bookRefs.current = [];

  const addToRefs = (item) => {
    if (item && !bookRefs.current.includes(item)) {
      bookRefs.current.push(item);
    }
  };

  useEffect(() => {
    
    if(selectedObject != -1 && bookRefs.current.length > 0) {
      refSelectedObject.current = bookRefs.current[selectedObject];
      setShowBloom(true);
    } else {
      setShowBloom(false);
    }
    
  }, [selectedObject]);

  useEffect(()=>{
    !showBloom ? refSelectedObject.current = undefined : null
  }, [showBloom]);

  const initialPositions = useMemo(()=>{
    let initialPositions = [];
    book.forEach((item)=>{
      let [ox, oy] = theme.orientation;
      for(let date in item.dates){
        item.dates[date].forEach((thisDate)=>{
          let [mainAxis, crossAxis] = thisDate.positioning;         
          let px = ox*mainAxis + (1-Math.abs(ox))*crossAxis;
          let py = oy*mainAxis + (1-Math.abs(oy))*crossAxis;
          thisDate.positioning = [px, py];
          initialPositions.push([px, py, 0]);
        })
      }
    });
    
    return initialPositions;
  }, [theme, book]);

  const [firstPos, lastPos] = useMemo(()=>{
    let [ox, oy] = theme.orientation;
    let firstP = Math.abs(ox)*book[0].dates.initial[0].positioning[0] + Math.abs(oy)*book[0].dates.initial[0].positioning[1];

    let sortedTimestampsArray = sortedTimestamps(book);    
    let lastTimestamp = sortedTimestampsArray[sortedTimestampsArray.length -1];
    let lastPosition = findPositioning(book, lastTimestamp);
    
    let lastP = Math.abs(ox)*lastPosition[0] + Math.abs(oy)*lastPosition[1];

    return [Math.min(firstP, lastP),Math.max(firstP, lastP)]
  }, [initialPositions]);

  return (
    <div className="canvasContainer">

    <Canvas 
      linear = "true"
      //frameloop="demand" 
      shadows = "true"
      shadowMap
    > <ContextBridge>

      <MyCamera position={[0, 0, 30]} posOne={firstPos} posTwo ={lastPos} scrollSpeed={120} orientation={theme.orientation} />
      
      <ambientLight intensity={0.2} ref={ambientLightRef}/>

      <Background />

      {book.map((item, index)=>{ 
        return(
          <MyDodecahedron position={initialPositions[index]} scale={1} id={index} key={index} ref={addToRefs}/>
        )
      })}

      <primitive object={dirLight} position={[30, 0, 30]} ref={dirLightRef}/>
      <primitive object={dirLight.target} position={[0, 0, 0]} />


      <EffectComposer>
      {false && <SelectiveBloom
        lights={[dirLightRef, ambientLightRef]} // ⚠️ REQUIRED! all relevant lights
        selection={refSelectedObject} // selection of objects that will have bloom effect
        selectionLayer={10} // selection layer
        intensity={2.0} // The bloom intensity.
        //blurPass={undefined} // A blur pass.
        //width={Resizer.AUTO_SIZE} // render width
        //height={Resizer.AUTO_SIZE} // render height
        //kernelSize={KernelSize.LARGE} // blur kernel size
        luminanceThreshold={0.25} // luminance threshold. Raise this value to mask out darker elements in the scene.
        luminanceSmoothing={0.025} // smoothness of the luminance threshold. Range is [0, 1]
      />}
      </EffectComposer>

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