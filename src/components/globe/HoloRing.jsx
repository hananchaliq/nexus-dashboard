// HoloRing.jsx
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export const HoloRing = () => {
   const ringRef = useRef();
   const arcRef = useRef();

   useFrame(() => {
      if (ringRef.current) ringRef.current.rotation.z += 0.002;
      if (arcRef.current) arcRef.current.rotation.z -= 0.005;
   });

   return (
      <group>
         {/* 1. Thin Outer Orbit Ring */}
         <mesh ref={ringRef} rotation={[Math.PI / 2.5, 0, 0]}>
            <ringGeometry args={[2.5, 2.51, 64]} />
            <meshBasicMaterial color="#8b5cf6" transparent opacity={0.3} side={2} />
         </mesh>

         {/* 2. Rotating Tech Arc */}
         <mesh ref={arcRef} rotation={[Math.PI / 2.3, 0.2, 0]}>
            <ringGeometry args={[2.65, 2.68, 64, 1, 0, Math.PI * 0.7]} />
            <meshBasicMaterial color="#00f2fe" transparent opacity={0.6} side={2} />
         </mesh>
      </group>
   );
};

export default HoloRing;
