import { useThree, extend } from "@react-three/fiber"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
extend({ OrbitControls });

export default function MyOrbitControls (){

    const {
        camera,
        gl: { domElement }
    } = useThree()

    return(
        <orbitControls args={[camera, domElement]} />
    )

}