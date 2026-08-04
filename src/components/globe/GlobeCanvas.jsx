// GlobeCanvas.jsx
import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import GlobeScene from "./GlobeScene";
import { IndonesiaInfoModal } from "./IndonesiaInfoModal";

export const GlobeCanvas = () => {
   const [isClicked, setIsClicked] = useState(false);

   return (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center relative rounded-2xl overflow-hidden pointer-events-auto z-10">
         <Canvas
            camera={{ position: [0, 0, 7.2], fov: 45 }}
            gl={{
               antialias: true,
               toneMapping: THREE.NoToneMapping,
               alpha: true,
            }}
            // Event pointer-events bawaan React Three Fiber
            eventSource={document.getElementById("root")}
            eventPrefix="client">
            <GlobeScene isClicked={isClicked} onBorderClick={() => setIsClicked(true)} />
         </Canvas>

         {/* Modal Informasi Indonesia saat Border Diklik */}
         <IndonesiaInfoModal isOpen={isClicked} onClose={() => setIsClicked(false)} />
      </div>
   );
};

export default GlobeCanvas;
