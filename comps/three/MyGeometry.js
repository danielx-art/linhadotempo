import * as THREE from 'three'
import {useMemo} from 'react'

export default function MyGeometry({ position, L, W, res }) {

    const [vertices, faces, normals, uvs] = useMemo( () => 
    {
        const arr = [];
        const facesArr = [];
        const normsArr = [];
        const uvArr = []
        const triangle_pairs = Math.floor(L/res);
        const upper_left_corner = [
            position[0] - W/2,
            position[1] - L/2,
            position[2]
        ];

        const numVertices = Math.floor(L/res)*2 + 2
        const vertArr = [];

        for(let i=0; i<numVertices; i++) {
            
            const v0 = new THREE.Vector3 (
                upper_left_corner[0] + Math.random()*(res/3),
                upper_left_corner[1] + i*res + Math.random()*(res/3),
                upper_left_corner[2] + Math.random()*(res/3)
            );

            const v1 = new THREE.Vector3 (
                upper_left_corner[0] + W + Math.random()*(res/3),
                upper_left_corner[1] + i*res + Math.random()*(res/3),
                upper_left_corner[2] + Math.random()*(res/3)
            );

            vertArr.push(v0, v1);

        }

        for(let i=0; i<triangle_pairs; i++) {

            //v0
            const v0 = vertArr[i];
            //v1
            const v1 = vertArr[i+1];
            //v2
            const v2 = vertArr[i+2];
            //v3
            const v3 = vertArr[i+3];

            //UPPER triangle - 0,1,2

            //positions

            arr.push(v0.x, v0.y, v0.z, v1.x, v1.y, v1.z, v2.x, v2.y, v2.z);

            //face, or indices

            facesArr.push(2*i, 2*i+1, 2*i+2);

            //normals

            const s21 = new THREE.Vector3();
            s21.copy(v2).sub(v1);
            const s01 = new THREE.Vector3();
            s01.copy(v0).sub(v1);
            const n1 = new THREE.Vector3();
            n1.copy(s21).cross(s01).normalize();
            normsArr.push(n1.x, n1.y, n1.z);
            normsArr.push(n1.x, n1.y, n1.z);
            normsArr.push(n1.x, n1.y, n1.z);

            //uvs
            uvArr.push(0,0, 1,0, 0,1)

            //LOWER triangle - 2,1,3
            
            //positions

            arr.push(v2.x, v2.y, v2.z, v1.x, v1.y, v1.z, v3.x, v3.y, v3.z);

            //face, or indices

            facesArr.push(2*i+2, 2*i+1, 2*i+3);

            //normals

            const s31 = new THREE.Vector3();
            s31.copy(v3).sub(v1);
            const n2 = new THREE.Vector3();
            n2.copy(s31).cross(s21).normalize();
            normsArr.push(n2.x, n2.y, n2.z);
            normsArr.push(n2.x, n2.y, n2.z);
            normsArr.push(n2.x, n2.y, n2.z);

            //uvs
            uvArr.push(0,1, 1,0, 1,1);

        }        

        const vertices = new Float32Array(arr);
        const faces = new Uint16Array(facesArr);
        const normals = new Float32Array(normsArr);
        const uvs = new Float32Array(uvs);

        return [vertices, faces, normals, uvs];

    } 
    , []);

    return (
      <mesh castShadow={true} receiveShadow={true} position={position}>

        <bufferGeometry 
            attach="geometry"
        >
            <bufferAttribute
                attachObject={["attributes", "position"]}
                count={vertices.length / 3}
                array={vertices}
                itemSize={3}
            />

            <bufferAttribute
                attachObject={["attributes", "normal"]}
                count={normals.length / 3}
                array={normals}
                itemSize={3}
            />

            <bufferAttribute
                attachObject={["attributes", "uv"]}
                count={uvs.length / 2}
                array={uvs}
                itemSize={2}
            />


        </bufferGeometry>

        <meshPhongMaterial attach="material" color="blue" side={THREE.DoubleSide} />

      </mesh>
    )
}