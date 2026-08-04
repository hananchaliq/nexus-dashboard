import React, { useEffect, useState } from "react";
import { GlassPanel } from "../../common/GlassPanel";
import { fetchPrayerData } from "../../../services/prayer";
import { useAppStore } from "../../../store/appStore";
import { FaLocationDot, FaChevronRight } from "react-icons/fa6";
import { WiMoonrise, WiDaySunny, WiDayCloudy, WiSunset, WiNightClear } from "react-icons/wi";

const getPrayerIcon = name => {
   const lowerName = name.toLowerCase();
   if (lowerName.includes("subuh")) return <WiMoonrise className="text-indigo-400 text-lg" />;
   if (lowerName.includes("dhuha")) return <WiDaySunny className="text-amber-300 text-lg" />;
   if (lowerName.includes("dzuhur")) return <WiDaySunny className="text-purple-400 text-lg" />;
   if (lowerName.includes("ashar")) return <WiDayCloudy className="text-amber-400 text-lg" />;
   if (lowerName.includes("maghrib")) return <WiSunset className="text-orange-400 text-lg" />;
   return <WiNightClear className="text-cyan-400 text-lg" />;
};

const calculateCountdown = targetTimeStr => {
   if (!targetTimeStr) return "--:--:--";
   const now = new Date();
   const [hours, minutes] = targetTimeStr.split(":").map(Number);
   const target = new Date();
   target.setHours(hours, minutes, 0, 0);

   if (target < now) {
      target.setDate(target.getDate() + 1);
   }

   const diffMs = target - now;
   const diffSecs = Math.floor((diffMs / 1000) % 60);
   const diffMins = Math.floor((diffMs / (1000 * 60)) % 60);
   const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

   const pad = num => String(num).padStart(2, "0");
   return `${pad(diffHours)}:${pad(diffMins)}:${pad(diffSecs)}`;
};

export const PrayerWidget = () => {
   const [prayers, setPrayers] = useState([]);
   const [loading, setLoading] = useState(true);
   const [, setTime] = useState(new Date()); // State dummy untuk trigger re-render per detik
   const location = useAppStore(state => state.location);

   // 1. Fetch data sholat berdasarkan lokasi
   useEffect(() => {
      const loadPrayerData = async () => {
         if (!location?.lat || !location?.lon) return;
         setLoading(true);

         const cityName = location.regency || location.city || "Lokasi Anda";
         const data = await fetchPrayerData(location.lat, location.lon, cityName);

         if (data?.schedule) {
            setPrayers(data.schedule);
         }
         setLoading(false);
      };

      loadPrayerData();
   }, [location]);

   // 2. Real-time timer: update state tiap 1 detik agar countdown berjalan
   useEffect(() => {
      const timer = setInterval(() => {
         setTime(new Date());
      }, 1000);

      return () => clearInterval(timer);
   }, []);

   return (
      <GlassPanel className="p-3 text-xs font-sans flex-1 glass-card rounded-2xl">
         <div className="flex items-center justify-between mb-2">
            <h3 className="text-[10px] font-bold text-slate-100 tracking-wider uppercase">WAKTU SHOLAT</h3>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] text-slate-300">
               <FaLocationDot className="text-slate-400 text-[8px]" />
               <span className="truncate max-w-[80px]">{location.regency || location.city}</span>
            </div>
         </div>

         {loading ? (
            <div className="py-4 text-center text-slate-500 text-xs animate-pulse">Memuat...</div>
         ) : (
            <div className="space-y-1.5">
               {prayers.map(item => (
                  <div key={item.name} className="flex items-center justify-between py-0.5 border-b border-white/5 last:border-none">
                     <div className="flex items-center gap-2 min-w-[80px]">
                        <div className="w-5 h-5 rounded-md bg-black/20 flex items-center justify-center shrink-0">{getPrayerIcon(item.name)}</div>
                        <span className="text-slate-200 font-medium text-[11px]">{item.name}</span>
                     </div>
                     <span className="text-slate-100 font-medium text-[11px]">{item.time}</span>
                     <div className="bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] px-2 py-0.5 rounded-full min-w-[62px] text-center">{calculateCountdown(item.time)}</div>
                  </div>
               ))}
            </div>
         )}

         <div className="mt-2 pt-1 flex justify-center">
            <button type="button" className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-[10px] font-medium">
               <span>Jadwal Lengkap</span>
               <FaChevronRight className="text-[8px]" />
            </button>
         </div>
      </GlassPanel>
   );
};

export default PrayerWidget;
