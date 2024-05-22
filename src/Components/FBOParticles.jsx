import { OrbitControls, useFBO, useTexture} from "@react-three/drei";
import { Canvas, useFrame, extend, createPortal, useLoader, useThree, } from "@react-three/fiber";
import {useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import SimulationMaterial from './SimulationMaterial'
import vertexParticles from "../Shaders/Particles/vertexParticles.glsl";
import fragmentParticles from "../Shaders/Particles/fragmentParticles.glsl"; 
import lighthouse from './LighthouseFull3.glb'
import ray from './rayCopy.glb'
import brush from '../assets/brush.png'
import { useControls } from "leva";
import { Perf } from "r3f-perf";


// making the simulation material available aa a JSX element
extend({ SimulationMaterial: SimulationMaterial });


const FBOParticles = () => {

    //leva controls
    const parameters = {
        width: 256,
        size: 2,
        count: 1000,
    }

    const raycaster = new THREE.Raycaster()

    let mouse = new THREE.Vector2()
    window.addEventListener('mousemove', (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 0.7
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
    })

  
    const planeRef = useRef()

    const model = useLoader(GLTFLoader, lighthouse)

    // console.log(model.scene.children[1].children[0])

    const max = 20
    const brushMeshes = []
  

    for (let i = 0; i < max; i++) {

    const brushMaterial =  new THREE.TextureLoader().load(brush)
    brushMeshes.push(brushMaterial)
    
    }

    //positions of lighhouse faces
    const facePos = model.scene.children[0].geometry.attributes.position.array
    const faceNumber = facePos.length / 3

   
    //create reference to points 
    const points = useRef()
    const simulationMaterialRef = useRef()

    //create a camera and a scene for our FBO
    const FBOscene = new THREE.Scene();
    const FBOcamera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );  

    //create a buffer to store the positions of the particles, a simple square gemoetry with a custom uv and position attributes 
    const positions = new Float32Array([   -1,-1,0, 1,-1,0, 1,1,0, -1,-1, 0, 1, 1, 0, -1,1,0 ] );
    const uvs =  new Float32Array([   0,1, 1,1, 1,0,  0,1, 1,0, 0,0 ]  );

    const reference =  new Float32Array(parameters.width * parameters.width * 2 );

    function generateParticles(){
        for(let i = 0; i < parameters.width * parameters.width; i++){
      
            let xx = (i % parameters.width) / parameters.width
            let yy = (i / parameters.width) / parameters.width
            
            reference.set([xx, yy], i * 2)

        
        }}
     generateParticles()


    //creating the FBO rnder target
    const renderTarget = useFBO(parameters.width, parameters.width, {
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        wrapS: THREE.RepeatWrapping,
        wrapT: THREE.RepeatWrapping,
        type: THREE.FloatType,
        stencilBuffer: false,
        format: THREE.RGBAFormat,
       })

    const particlePosition = useMemo(() => {
       const particles = new Float32Array(parameters.width * parameters.width * 3)   
        for(let i = 0; i < parameters.width * parameters.width; i++){
           
            let i3 = i * 3
            particles[ i3 ] = (i % parameters.width) / parameters.width
            particles[ i3 + 1] = (i / parameters.width) / parameters.width
            particles[ i3 + 2] = 0.0
           
        }

        return particles

    },[parameters.width])

  
    const uniforms = useMemo(() => ({
        uPositions: {
          value: null,
        },
        uMouse: {
            value: new THREE.Vector2(),
          },
      }), [])



    useEffect(() => {

        points.current.material.uniforms.uPositions.value = renderTarget.texture
                   
        },[renderTarget.texture, uniforms.uPositions.value])

        
    
        //viewport is the size of the canvas
    //    const {viewport} = useThree()
               
        const plane = new THREE.PlaneGeometry(20,10,1,1)
        const planeMaterial = new THREE.MeshBasicMaterial({color: 'red'})
        

        

    useFrame((state) => {

        const {gl, clock, scene, camera, } = state;

        // gl.setClearColor('black')

       

        //set the current render target to the FBO
        gl.setRenderTarget(renderTarget);
        //render the simulation material with square geometry in the render target
        gl.render(FBOscene, FBOcamera);
         //reading the position data from the FBO and send data to the final shaderMaterial via a uPosition uniform
        points.current.material.uniforms.uPositions.value = renderTarget.texture
        //revert to the default render target
        gl.setRenderTarget(null);
        gl.clear();



        //getting mouse positions]
        // mouse.x *=  viewport.width  / 2
        // mouse.y *=  viewport.height  /2
     

        raycaster.setFromCamera(mouse, camera)

        const intersects = raycaster.intersectObject(planeRef.current)

       
        if(intersects.length > 0){
        
        //passing the mouse position to the simulation material
            simulationMaterialRef.current.uniforms.uMouse.value = intersects[0].point
        }

        simulationMaterialRef.current.uniforms.uTime.value = clock.elapsedTime

    })


  return (
    <>
     {/* <Perf position="top-left" />s */}
    {/* rendering the off-screen simulation material and square geometry*/}
    {createPortal(
        <mesh  >
            <simulationMaterial ref={simulationMaterialRef}  args={[facePos, faceNumber]}  />
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" 
                count={positions.length/ 3} 
                array={positions} 
                itemSize={3} />
                 <bufferAttribute attach="attributes-uvs"
                count={uvs.length/ 2}
                array={uvs}
                itemSize={2} /> 
            </bufferGeometry>
        </mesh>,
        FBOscene
    )}
        
        {/* rendering the final shaderMaterial and the points */}
    <points ref={points} position={[-5,0,-10]} >
        <bufferGeometry >
       
          <bufferAttribute
            attach="attributes-position"
            count={particlePosition.length / 3}
            array={particlePosition}
            itemSize={3}
          />
           <bufferAttribute
            attach="attributes-reference"
            count={reference.length / 2}
            array={reference}
            itemSize={2}
          />
        </bufferGeometry>
        
        <shaderMaterial
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          fragmentShader={fragmentParticles}
          vertexShader={vertexParticles}
          uniforms={uniforms}
        />
      </points>
      <mesh ref={planeRef} geometry={plane} material={planeMaterial} position={[0,0,2]} visible={false}/>
   
 
    </>
  )
}

export default FBOParticles