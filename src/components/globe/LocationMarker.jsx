// LocationMarker.jsx
import React, { useMemo } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";

export const LocationMarker = ({ isHovered }) => {
   // Hitung koordinat posisi 3D di permukaan globe
   const position = useMemo(() => {
      const lat = -0.7893;
      const lon = 113.9213;
      const radius = 2.05;

      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);

      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);

      return new THREE.Vector3(x, y, z);
   }, []);

   return (
      <group position={position}>
         {/* 1. MESH POINTER SENSOR (Glow Ring & White Center) */}
         <mesh>
            <sphereGeometry args={[0.018, 16, 16]} />
            <meshBasicMaterial color="#ffffff" />
         </mesh>
         <mesh>
            <ringGeometry args={[0.028, 0.045, 32]} />
            <meshBasicMaterial color="#00f2fe" side={THREE.DoubleSide} transparent opacity={0.8} />
         </mesh>

         {/* 2. HUD HTML POINTER */}
         {isHovered && (
            <Html center className="pointer-events-none select-none">
               <div className="relative flex flex-col items-start translate-x-3 translate-y-2 scale-[0.6] origin-top-left transition-all duration-300">
                  {/* TULISAN INDONESIA (Di atas kanan kapsul) */}
                  <div className="w-full flex justify-end pr-1 mb-1">
                     <span className="text-[15px] font-sans font-bold text-white tracking-wide drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">INDONESIA</span>
                  </div>

                  {/* CONTAINER UTAMA / WRAPPER */}
                  <div className="relative pt-2">
                     {/* 3 GARIS CYAN MIRING (///) DI KIRI ATAS */}
                     <div className="absolute top-0 left-2 z-10 flex gap-[5px]">
                        <span className="w-2.5 h-3.5 bg-[#00f2fe] -skew-x-[30deg] rounded-[1px] shadow-[0_0_8px_#00f2fe]"></span>
                        <span className="w-2.5 h-3.5 bg-[#00f2fe] -skew-x-[30deg] rounded-[1px] shadow-[0_0_8px_#00f2fe]"></span>
                        <span className="w-2.5 h-3.5 bg-[#00f2fe] -skew-x-[30deg] rounded-[1px] shadow-[0_0_8px_#00f2fe]"></span>
                     </div>

                     {/* OUTLINE CAPSULE LUAR */}
                     <div className="relative p-[3px] rounded-full border-2 border-[#00f2fe] shadow-[0_0_15px_rgba(0,242,254,0.6)] bg-[#020b18]/40 backdrop-blur-sm">
                        {/* CAPSULE DALAM (BACKGROUND GRADIENT POPULASI) */}
                        <div className="flex items-center justify-center bg-gradient-to-r from-[#00b4d8] via-[#00d4e7] to-[#00f2fe] px-5 py-1 rounded-full shadow-[inset_0_0_6px_rgba(255,255,255,0.6)]">
                           {/* TEKS POPULASI INDONESIA */}
                           <span className="text-[20px] font-mono font-black text-white tracking-wider leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">278,696,000</span>
                        </div>
                     </div>
                  </div>
               </div>
            </Html>
         )}
      </group>
   );
};

export default LocationMarker;
