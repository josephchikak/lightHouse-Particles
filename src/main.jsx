
import ReactDOM from 'react-dom/client'
import './index.css'
import Experience from './Experience.jsx'
import { Canvas } from '@react-three/fiber'
import { StrictMode } from 'react'

//import canvs


ReactDOM.createRoot(document.getElementById('root')).render(
    <StrictMode>  
    <Canvas
      camera={{
        fov: 45,
        near: 1,
        far: 1000,
        position: [ 0, 0, 20 ]
      }}
    >  
       <Experience />
    </Canvas>
    </StrictMode>
)
