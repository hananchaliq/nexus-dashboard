import React from "react";
import { FinanceWidget } from "../widgets/Finance/FinanceWidget";
import { QuickLinksWidget } from "../widgets/QuickLinks/QuickLinksWidget";
import { CalendarWidget } from "../widgets/Calendar/CalendarWidget";
import { NotesWidget } from "../widgets/Notes/NotesWidget";

export const RightPanel = () => {
   return (
      <div className="grid grid-cols-2 gap-3.5 w-full items-stretch font-sans">
         {/* KOLOM KIRI */}
         <div className="flex flex-col gap-3.5 w-full min-w-0">
            <div className="w-full flex">
               <FinanceWidget />
            </div>
            {/* NotesWidget dibuat flex-1 biar ngisi sisa ruang & sejajar bawahnya */}
            <div className="w-full flex flex-1">
               <NotesWidget />
            </div>
         </div>

         {/* KOLOM KANAN */}
         <div className="flex flex-col gap-3.5 w-full min-w-0">
            {/* QuickLinksWidget dibuat flex-1 biar melar sejajar sama Finance */}
            <div className="w-full flex flex-1">
               <QuickLinksWidget />
            </div>
            <div className="w-full flex">
               <CalendarWidget />
            </div>
         </div>
      </div>
   );
};

export default RightPanel;
