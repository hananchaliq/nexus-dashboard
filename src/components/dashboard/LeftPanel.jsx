import React from "react";
import WeatherWidget from "../widgets/Weather/WeatherWidget";
import { PrayerWidget } from "../widgets/Prayer/PrayerWidget";

export const LeftPanel = () => {
   return (
      <div className="flex flex-col h-full gap-3">
         {/* PrayerWidget tetap ukuran alaminya */}
         <PrayerWidget />

         {/* WeatherWidget dipaksa membesar ngisi sisa ruang ke bawah */}
         <div className="flex-1 flex flex-col">
            <WeatherWidget />
         </div>
      </div>
   );
};
export default LeftPanel;
