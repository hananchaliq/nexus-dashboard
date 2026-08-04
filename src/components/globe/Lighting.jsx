// Lighting.jsx
import React from "react";

export const Lighting = () => {
   return (
      <>
         <ambientLight intensity={0.25} />
         {/* Lampu Utama Cyan Terang dari Kanan */}
         <directionalLight position={[5, 3, 5]} intensity={3} color="#06b6d4" />
         {/* Backlight Magenta/Ungu Terang dari Kiri */}
         <pointLight position={[-5, -4, -3]} intensity={5} color="#d946ef" />
      </>
   );
};

export default Lighting;
