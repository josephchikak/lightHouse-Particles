import { OrbitControls, PointMaterial, useTexture} from "@react-three/drei"
import * as THREE from "three"
import { useEffect } from "react";
import FBOParticles from "./Components/FBOParticles";





const Experience = () => {
    
    return(
        <>

        {/* <OrbitControls />    */}
        <FBOParticles />
        </>
        
    )
}

export default Experience;
