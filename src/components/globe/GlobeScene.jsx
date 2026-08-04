// GlobeScene.jsx
import React, { useRef, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Earth } from "./Earth";
import { Atmosphere } from "./Atmosphere";
import { Lighting } from "./Lighting";
import { Effects } from "./Effects";
import { HoloRing } from "./HoloRing";

export const GlobeScene = ({ isClicked, onBorderClick }) => {
   const groupRef = useRef();

   // Posisi & Nilai Zoom Asli Kamu
   const DEFAULT_POS = new THREE.Vector3(-2, 0, -5);
   const CLICKED_POS = new THREE.Vector3(-1.25, 0.4, -0.8);

   useFrame((state, delta) => {
      if (!groupRef.current) return;

      const TWO_PI = Math.PI * 2;

      if (isClicked) {
         // --- MODE CLICK: KAMERA MAJU & GLOBE ROTASI KE INDONESIA ---
         state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 3.5, delta * 4);

         groupRef.current.position.lerp(CLICKED_POS, delta * 4);

         let currentRotY = groupRef.current.rotation.y % TWO_PI;
         if (currentRotY > Math.PI) currentRotY -= TWO_PI;
         if (currentRotY < -Math.PI) currentRotY += TWO_PI;
         groupRef.current.rotation.y = currentRotY;

         const TARGET_ROT_Y = 2.85;
         const TARGET_ROT_X = -0.05;

         groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, TARGET_ROT_Y, delta * 5);
         groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, TARGET_ROT_X, delta * 5);
      } else {
         // --- MODE DEFAULT: KAMERA DIAM & MUTER SLOW ---
         state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 7.2, delta * 3);

         groupRef.current.position.lerp(DEFAULT_POS, delta * 3);

         groupRef.current.rotation.y += delta * 0.15;

         if (groupRef.current.rotation.y > TWO_PI) {
            groupRef.current.rotation.y %= TWO_PI;
         }

         groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0.1, delta * 2);
      }
   });

   return (
      <>
         <Lighting />
         <Suspense fallback={null}>
            <group ref={groupRef} position={[-2, 0, -5]}>
               <Earth isClicked={isClicked} onBorderClick={onBorderClick} />
               <Atmosphere />
            </group>
            <HoloRing />
            <Effects />
         </Suspense>
      </>
   );
};

export default GlobeScene;
