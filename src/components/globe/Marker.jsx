import React from "react";
export const Marker = ({ position = [0, 0, 2] }) => (
   <mesh position={position}>
      <sphereGeometry args={[0.03, 16, 16]} />
      <meshBasicMaterial color="#00f0ff" />
   </mesh>
);
export default Marker;
