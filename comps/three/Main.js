import { useRef, useState, useEffect, useMemo, useContext, createRef } from 'react'
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useContextBridge } from '@react-three/drei'
import { EffectComposer, SelectiveBloom } from '@react-three/postprocessing'
import { BlurPass, Resizer, KernelSize } from 'postprocessing'
import * as THREE from 'three'
import MyCamera from '../three/MyCamera'
import MyGeometry from '../three/MyGeometry'
import MyDodecahedron from '../three/MyDodecahedron'
import { allContext } from '../../pages'

//import MyOrbitControls from '../three/MyOrbitControls'

export default function Main() { 

  const ContextBridge = useContextBridge(allContext);

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
  const objBloomRef = createRef();

  return (
    <div className="canvasContainer">

    <Canvas 
      linear = "true"
      //frameloop="demand" 
      shadows = "true"
      shadowMap
    > <ContextBridge>

      <MyCamera position={[0, 0, 30]} infLimit={-1000} supLimit ={0} />
      
      <ambientLight intensity={0.2} ref={ambientLightRef}/>

      <Background />

      <MyDodecahedron position={[0,0,0]} scale={1} id={1} ref={objBloomRef}/>

      <primitive object={dirLight} position={[30, 0, 30]} ref={dirLightRef}/>
      <primitive object={dirLight.target} position={[0, 0, 0]} />

      
      <mesh receiveShadow position={[0,0,-2]} >
        <boxGeometry attach="geometry" args={[2, 2, 2]} />
        <meshStandardMaterial attach="material" color={[250,0,20]} />
      </mesh>

      {/* <MyGeometry position={[0, 0, 0]} L={100} W={5} res={4} /> */}

      <EffectComposer>
      <SelectiveBloom
        lights={[dirLightRef, ambientLightRef]} // ⚠️ REQUIRED! all relevant lights
        selection={[objBloomRef]} // selection of objects that will have bloom effect
        selectionLayer={10} // selection layer
        intensity={2.0} // The bloom intensity.
        //blurPass={undefined} // A blur pass.
        //width={Resizer.AUTO_SIZE} // render width
        //height={Resizer.AUTO_SIZE} // render height
        //kernelSize={KernelSize.LARGE} // blur kernel size
        luminanceThreshold={0.25} // luminance threshold. Raise this value to mask out darker elements in the scene.
        luminanceSmoothing={0.025} // smoothness of the luminance threshold. Range is [0, 1]
      />
      </EffectComposer>

      </ContextBridge></Canvas>
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