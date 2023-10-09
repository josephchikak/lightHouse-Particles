import simulationFragmentShader from '../Shaders/Particles/simulationFragmentShader.glsl'
import simulationVertexShader from '../Shaders/Particles/simulationVertexShader.glsl'
import * as THREE from 'three'
import {useLoader} from '@react-three/fiber'
import { useEffect } from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'


const parameters = {
  width: 512,
  size: 2,
  count: 1000,
}

//
const width = parameters.width
const height = parameters.width


const getFacePos =  (facePos, faceNumber) =>{
  var len = width * height * 4;
    var data = new Float32Array(len);

  for (let i = 0; i < facePos.length; i=i+4) {

    let rand = Math.floor(Math.random() * faceNumber)

    let x = facePos[rand * 3]
    let y = facePos[rand * 3 + 1]
    let z = facePos[rand * 3 + 2]

    data[i] = x
    data[i + 1] = y
    data[i + 2] = z /2
    data[i + 3] = 1.0
   
  }
  return data
}

   class SimulationMaterial extends THREE.ShaderMaterial {

    constructor(facePos, faceNumber) {

      //creating a Data Texture with the given postion data 
      const positionsTexture = new THREE.DataTexture(
        getFacePos(facePos, faceNumber),
        width,
        height,
        THREE.RGBAFormat,
        THREE.FloatType
      );
      positionsTexture.needsUpdate = true;
  
      const simulationUniforms = {
        //passing the positions Data Texture as uniform
        uPosition: { value: positionsTexture },
        uFrequency: { value: 0.25 },
        uTime: { value: 0 },
        uDisplacement: { value: null },
        uMouse: { value: new THREE.Vector3(0, 0, 0) },
      };
  
      super({
        uniforms: simulationUniforms,
        vertexShader: simulationVertexShader,
        fragmentShader: simulationFragmentShader,
      });
    }
}


export default SimulationMaterial