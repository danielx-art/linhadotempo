import { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from 'three'
import MyCamera from '../three/MyCamera'
//import MyGeometry from '../three/MyGeometry'
import MyDodecahedron from '../three/MyDodecahedron'
//import MyOrbitControls from '../three/MyOrbitControls'

export default function Main() { 

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
  
  },[])

  return (
    <div className="canvasContainer">

    <Canvas 
      linear = "true"
      //frameloop="demand" 
      shadows = "true"
      shadowMap
    >
      
      <MyCamera position={[0, 0, 30]} infLimit={-1000} supLimit ={0} />
      
      <ambientLight intensity={0.2}/>

      <Background />

      <MyDodecahedron position={[0,0,0]} scale={1} />

      <primitive object={dirLight} position={[30, 0, 30]} />
      <primitive object={dirLight.target} position={[0, 0, 0]} />

      {/* //PLANE
      <mesh receiveShadow position={[0,0,-2]}>
        <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
        <meshStandardMaterial attach="material" color="gray" />
      </mesh> */}

      {/* <MyGeometry position={[0, 0, 0]} L={100} W={5} res={4} /> */}

    </Canvas>
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