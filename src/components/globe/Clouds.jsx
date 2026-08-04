import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const Clouds = () => {
   const cloudsRef = useRef();
   useFrame((_, delta) => {
      if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.12;
   });

   return (
      <mesh ref={cloudsRef} scale={2.03}>
         <sphereGeometry args={[1, 64, 64]} />
         <meshStandardMaterial color="#38bdf8" transparent opacity={0.2} blending={THREE.AdditiveBlending} />
      </mesh>
   );
};

export default Clouds;
