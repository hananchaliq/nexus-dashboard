// DashboardGrid.jsx
import React from "react";
import { LeftPanel } from "./LeftPanel";
import { CenterPanel } from "./CenterPanel";
import { RightPanel } from "./RightPanel";
import { SystemStats } from "./SystemStats";

export const DashboardGrid = () => {
   return (
      // CONTAINER UTAMA MUSTI pointer-events-none
      <div className="flex flex-col gap-4 p-6 pt-2 h-[calc(100vh-4rem)] overflow-y-auto pointer-events-none">
         <div className="grid grid-cols-20 gap-4 items-stretch pointer-events-none">
            {/* LEFT (4 Grid) - BISA DIKLIK */}
            <div className="col-span-4 pointer-events-auto z-10">
               <LeftPanel />
            </div>

            {/* CENTER / GLOBE (6 Grid) - WAJIB pointer-events-none SUPAYA TEMBUS KE GLOBE */}
            <div className="col-span-6 flex items-center justify-center pointer-events-none">
               <CenterPanel />
            </div>

            {/* RIGHT (10 Grid) - BISA DIKLIK */}
            <div className="col-span-10 pointer-events-auto z-10">
               <RightPanel />
            </div>
         </div>

         <div className="grid grid-cols-1 gap-4 pointer-events-none">
            <div className="col-span-8 pointer-events-auto z-10">
               <SystemStats />
            </div>
         </div>
      </div>
   );
};

export default DashboardGrid;
