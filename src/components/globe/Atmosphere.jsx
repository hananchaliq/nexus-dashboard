// Atmosphere.jsx
import React from "react";
import * as THREE from "three";

export const Atmosphere = () => {
   const atmosphereShader = {
      vertexShader: `
         varying vec3 vNormal;
         void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
         }
      `,
      fragmentShader: `
         varying vec3 vNormal;
         void main() {
            // Formula Rim Light tebal di pinggir bola
            float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
            vec3 glowColor = vec3(0.65, 0.15, 0.95); // Warna Magenta-Ungu
            gl_FragColor = vec4(glowColor, 1.0) * intensity * 2.5;
         }
      `,
   };

   return (
      <mesh scale={[1.03, 1.03, 1.03]}>
         <sphereGeometry args={[2, 64, 64]} />
         <shaderMaterial args={[atmosphereShader]} blending={THREE.AdditiveBlending} side={THREE.BackSide} transparent={true} depthWrite={false} />
      </mesh>
   );
};

export default Atmosphere;
