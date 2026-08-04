import React from "react";
import { OrbitControls } from "@react-three/drei";
export const OrbitController = () => <OrbitControls enableZoom={true} enablePan={false} autoRotate autoRotateSpeed={0.5} />;
export default OrbitController;
