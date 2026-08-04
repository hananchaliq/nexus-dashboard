// SystemStats.jsx
import React, { useState, useEffect } from "react";
import { Cpu, HardDrive, Database, Activity, ArrowDown, ArrowUp } from "lucide-react";

export const SystemStats = () => {
   const [time, setTime] = useState(new Date());

   useEffect(() => {
      const timer = setInterval(() => setTime(new Date()), 1000);
      return () => clearInterval(timer);
   }, []);

   const getTimeInZone = timeZone => {
      return new Intl.DateTimeFormat("id-ID", {
         timeZone,
         hour: "2-digit",
         minute: "2-digit",
         hour12: false,
      }).format(time);
   };

   const worldCities = [
      { name: "Jakarta", zone: "Asia/Jakarta" },
      { name: "Mekkah", zone: "Asia/Riyadh" },
      { name: "Tokyo", zone: "Asia/Tokyo" },
      { name: "New York", zone: "America/New_York" },
   ];

   return (
      <div className="flex items-center gap-4 w-full select-none">
         {/* CONTAINER 1: SYSTEM STATS (KIRI) */}
         <div className="relative flex-1 flex items-center bg-[#070d24]/60 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-2.5 px-4 shadow-[inset_0_0_15px_rgba(0,242,254,0.05)] overflow-hidden">
            {/* Blue Glow Accent di Ujung Kiri Container */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-cyan-400 rounded-r-full blur-[3px] shadow-[0_0_12px_#00f2fe]" />

            {/* ITEM 1: CPU USAGE */}
            <div className="flex items-center gap-3 pr-6 border-r border-slate-800/80 flex-1">
               <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.2)] shrink-0">
                  <Cpu className="w-5 h-5" />
               </div>
               <div className="flex flex-col min-w-0">
                  <span className="text-[11px] text-slate-400 font-medium leading-none mb-1">CPU Usage</span>
                  <span className="text-lg font-bold text-white leading-none">23%</span>

                  {/* Mini Sparkline Graph */}
                  <svg className="w-16 h-3 mt-1 text-emerald-400 overflow-visible" viewBox="0 0 50 10">
                     <path d="M 0,8 Q 5,9 10,6 T 20,7 T 30,3 T 40,9 T 50,2" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
               </div>
            </div>

            {/* ITEM 2: RAM USAGE */}
            <div className="flex items-center gap-3 px-6 border-r border-slate-800/80 flex-1">
               <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.2)] shrink-0">
                  <HardDrive className="w-5 h-5" />
               </div>
               <div className="flex flex-col min-w-0">
                  <span className="text-[11px] text-slate-400 font-medium leading-none mb-1">RAM Usage</span>
                  <span className="text-lg font-bold text-white leading-none">48%</span>
                  <span className="text-[10px] text-slate-400 font-mono mt-1">7.6 / 16 GB</span>
               </div>
            </div>

            {/* ITEM 3: STORAGE */}
            <div className="flex items-center gap-3 px-6 border-r border-slate-800/80 flex-1">
               <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)] shrink-0">
                  <Database className="w-5 h-5" />
               </div>
               <div className="flex flex-col min-w-0">
                  <span className="text-[11px] text-slate-400 font-medium leading-none mb-1">Storage</span>
                  <span className="text-lg font-bold text-white leading-none">62%</span>
                  <span className="text-[10px] text-slate-400 font-mono mt-1">512 / 1 TB</span>
               </div>
            </div>

            {/* ITEM 4: NETWORK */}
            <div className="flex items-center gap-3 pl-6 flex-1">
               <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)] shrink-0">
                  <Activity className="w-5 h-5" />
               </div>
               <div className="flex flex-col min-w-0">
                  <span className="text-[11px] text-slate-400 font-medium leading-none mb-1.5">Network</span>
                  <div className="flex items-center gap-1 text-[11px] font-mono font-medium text-emerald-400 leading-none">
                     <ArrowDown className="w-3 h-3" />
                     <span>126 Mbps</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-mono font-medium text-purple-400 leading-none mt-1">
                     <ArrowUp className="w-3 h-3" />
                     <span>32 Mbps</span>
                  </div>
               </div>
            </div>
         </div>

         {/* CONTAINER 2: WORLD CLOCKS (KANAN) */}
         <div className="flex items-center justify-between bg-[#070d24]/60 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-3 px-6 w-[420px] shadow-[inset_0_0_15px_rgba(0,242,254,0.05)]">
            {worldCities.map((city, idx) => (
               <React.Fragment key={city.name}>
                  <div className="flex flex-col items-center">
                     <span className="text-[12px] text-slate-400 font-medium mb-1">{city.name}</span>
                     <span className="text-xl font-light text-white font-mono tracking-tight">{getTimeInZone(city.zone)}</span>
                  </div>

                  {/* Vertical Divider antara jam */}
                  {idx < worldCities.length - 1 && <div className="w-[1px] h-8 bg-slate-800/80" />}
               </React.Fragment>
            ))}
         </div>
      </div>
   );
};

export default SystemStats;
