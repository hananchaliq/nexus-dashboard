// Earth.jsx
import React, { useRef, useMemo } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html, Stars } from "@react-three/drei";

import ProvinceBorder from "./ProvinceBorder";

import earthColorMap from "../../assets/textures/earth/earth_color.png";
import earthNightMap from "../../assets/textures/earth/earth_night.png";
import earthBumpMap from "../../assets/textures/earth/earth_bump.jpg";
import earthCloudsMap from "../../assets/textures/earth/earth_clouds.png";

export const Earth = ({ isHovered, isClicked, onBorderClick }) => {
   const earthRef = useRef();
   const atmosphereRef = useRef();
   const cloudsRef = useRef();
   const starsRef = useRef();

   const [colorMap, nightMap, bumpMap, cloudsMap] = useLoader(THREE.TextureLoader, [earthColorMap, earthNightMap, earthBumpMap, earthCloudsMap]);

   const isDaytime = useMemo(() => {
      const hours = new Date().getHours();
      return hours >= 6 && hours < 18;
   }, []);

   useFrame((_, delta) => {
      if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.05;
      if (starsRef.current) {
         starsRef.current.rotation.y -= delta * 0.01;
         starsRef.current.rotation.x += delta * 0.005;
      }
   });

   return (
      <>
         {/* Background Bintang */}
         <group ref={starsRef}>
            <Stars radius={300} depth={60} count={6000} factor={5} saturation={0} fade={true} speed={1.5} />
         </group>

         <group scale={[2.2, 2.2, 2.2]}>
            {/* Bola Bumi */}
            <mesh ref={earthRef}>
               <sphereGeometry args={[1, 64, 64]} />
               <meshStandardMaterial map={isDaytime ? colorMap : nightMap} bumpMap={bumpMap} bumpScale={0.02} color="#ffffff" emissive={isDaytime ? "#000000" : "#ffaa00"} emissiveMap={isDaytime ? null : nightMap} emissiveIntensity={isDaytime ? 0 : 0.8} roughness={0.7} metalness={0.1} />
            </mesh>

            {/* Line Border Indonesia */}
            <ProvinceBorder isDaytime={isDaytime} onClick={onBorderClick} isClicked={isClicked} />

            {/* Layer Awan */}
            <mesh ref={cloudsRef} scale={[1.012, 1.012, 1.012]}>
               <sphereGeometry args={[1, 64, 64]} />
               <meshStandardMaterial map={cloudsMap} transparent={true} opacity={isDaytime ? 0.35 : 0.1} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>

            {/* Atmosfer */}
            <mesh ref={atmosphereRef} scale={[1.03, 1.03, 1.03]}>
               <sphereGeometry args={[1, 64, 64]} />
               <meshBasicMaterial color={isDaytime ? "#4db8ff" : "#00d8ff"} transparent={true} opacity={0.12} side={THREE.BackSide} blending={THREE.AdditiveBlending} />
            </mesh>

            {/* Orbit Sci-Fi Rings */}
            <mesh rotation={[Math.PI / 3, 0, 0]}>
               <ringGeometry args={[1.35, 1.36, 64]} />
               <meshBasicMaterial color={isDaytime ? "#00e1ff" : "#ffaa00"} side={THREE.DoubleSide} transparent opacity={0.3} />
            </mesh>
            <mesh rotation={[Math.PI / 2.2, Math.PI / 4, 0]}>
               <ringGeometry args={[1.5, 1.51, 64]} />
               <meshBasicMaterial color={isDaytime ? "#ff007f" : "#ff5500"} side={THREE.DoubleSide} transparent opacity={0.2} />
            </mesh>
         </group>
      </>
   );
};

export default Earth;
