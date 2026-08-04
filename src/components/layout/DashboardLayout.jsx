// DashboardLayout.jsx
import React from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { BottomBar } from "./BottomBar";
import GlobeScene from "../globe/GlobeScene";
import  IndonesiaInfoModal  from "../globe/IndonesiaInfoModal";
import { useAppStore } from "../../store/appStore";

export const DashboardLayout = ({ children }) => {
   const isGlobeClicked = useAppStore(state => state.isGlobeClicked);
   const setIsGlobeClicked = useAppStore(state => state.setIsGlobeClicked);

   return (
      <div className="relative h-screen w-screen overflow-hidden bg-[#050714] text-slate-100">
         {/* CANVAS BACKGROUND */}
         <div className="absolute inset-0 z-0 pointer-events-auto">
            <Canvas
               camera={{ position: [0, 0, 7.2], fov: 45 }}
               style={{ pointerEvents: "auto" }}
               gl={{
                  antialias: true,
                  toneMapping: THREE.NoToneMapping,
                  alpha: true,
               }}>
               <GlobeScene isClicked={isGlobeClicked} onBorderClick={() => setIsGlobeClicked(true)} />
            </Canvas>
         </div>

         {/* OVERLAY UI (Sembunyi otomatis saat Globe diklik) */}
         <div className={`absolute inset-0 z-10 flex h-full w-full overflow-hidden transition-all duration-500 ease-in-out ${isGlobeClicked ? "opacity-0 pointer-events-none scale-95" : "opacity-100 pointer-events-none scale-100"}`}>
            <div className="pointer-events-auto h-full">
               <Sidebar />
            </div>

            <div className="flex-1 flex flex-col h-full overflow-hidden pointer-events-none">
               <div className="pointer-events-auto">
                  <Topbar />
               </div>

               {/* MAIN AREA */}
               <main className="flex-1 overflow-hidden pointer-events-none">{children}</main>

               <div className="pointer-events-auto">
                  <BottomBar />
               </div>
            </div>
         </div>

         {/* MODAL HUD (Samping kanan & kiri bawah) */}
         <IndonesiaInfoModal isOpen={isGlobeClicked} onClose={() => setIsGlobeClicked(false)} />
      </div>
   );
};

export default DashboardLayout;
