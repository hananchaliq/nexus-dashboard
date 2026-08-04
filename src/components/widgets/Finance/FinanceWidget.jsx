import React, { useState, useEffect, useMemo } from "react";
import { GlassPanel } from "../../common/GlassPanel";
import { fetchHistoricalRates } from "../../../services/finance";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, Tooltip, YAxis } from "recharts";
import { ChevronRight, Triangle } from "lucide-react";

const RANGES = ["1H", "24H", "7D", "30D", "1Y"];

const CustomTooltip = ({ active, payload }) => {
   if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
         <div className="bg-[#030816]/95 border border-[#00f6ff]/40 px-2.5 py-1 rounded-lg text-xs shadow-[0_0_15px_rgba(0,246,255,0.3)] backdrop-blur-md">
            <p className="text-[9px] text-slate-400 font-medium mb-0.5">{data.timeLabel}</p>
            <p className="text-[#00f6ff] font-bold font-mono text-[11px]">IDR {new Intl.NumberFormat("id-ID").format(data.rate)},00</p>
         </div>
      );
   }
   return null;
};

export const FinanceWidget = () => {
   const [activeRange, setActiveRange] = useState("24H");
   const [financeData, setFinanceData] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      let isMounted = true;
      setLoading(true);

      fetchHistoricalRates(activeRange).then(result => {
         if (isMounted) {
            setFinanceData(result);
            setLoading(false);
         }
      });

      return () => {
         isMounted = false;
      };
   }, [activeRange]);

   const { minRate, maxRate } = useMemo(() => {
      if (!financeData || !financeData.chartData || financeData.chartData.length === 0) {
         return { minRate: 16100, maxRate: 16400 };
      }
      const rates = financeData.chartData.map(d => d.rate);
      const min = Math.min(...rates);
      const max = Math.max(...rates);
      const padding = Math.max(8, Math.round((max - min) * 0.08));

      return {
         minRate: min - padding,
         maxRate: max + padding,
      };
   }, [financeData]);

   const stats = financeData?.stats;
   const chartData = financeData?.chartData || [];

   return (
      <GlassPanel className="w-full h-full rounded-[20px] p-4 bg-[#050914]/80 border border-[#121d33] backdrop-blur-md flex flex-col justify-between">
         {/* HEADER & VALUE */}
         <div>
            <div className="flex justify-between items-center mb-1">
               <h3 className="text-[11px] font-extrabold text-white tracking-wider">KURS USD / IDR</h3>
               <div className="flex items-center gap-1 bg-[#091326] border border-[#162747] px-2 py-0.5 rounded-full text-[9px] text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00e6a8] shadow-[0_0_6px_#00e6a8]" />
                  <span>Live</span>
                  <ChevronRight className="w-3 h-3 text-slate-500" />
               </div>
            </div>

            <div className="flex justify-between items-start mb-1">
               <div>
                  <span className="text-xs font-bold text-white block">USD</span>
                  <span className="text-[10px] text-slate-400">1 USD</span>
               </div>
               <div className="text-right">
                  <div className="text-lg font-bold font-sans text-white leading-tight">{loading ? "..." : `IDR ${new Intl.NumberFormat("id-ID").format(stats?.latest)},00`}</div>
                  {!loading && stats && (
                     <div className={`flex items-center justify-end gap-1 text-[10px] font-semibold ${stats.isPositive ? "text-[#00e6a8]" : "text-rose-400"}`}>
                        <Triangle className={`w-2 h-2 ${stats.isPositive ? "fill-[#00e6a8] text-[#00e6a8]" : "fill-rose-400 text-rose-400 rotate-180"}`} />
                        <span>
                           {stats.changePercent}% ({new Intl.NumberFormat("id-ID").format(Math.abs(stats.changeNominal))},00)
                        </span>
                     </div>
                  )}
               </div>
            </div>
         </div>

         {/* CHART AREA - Di-set fixed h-[115px] biar Recharts PASTI muncul & nggak hilang! */}
         <div className="w-full h-[115px] my-1 relative">
            {loading ? (
               <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-500">Loading...</div>
            ) : chartData.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                     <defs>
                        <linearGradient id="compactLandscapeGlow" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="0%" stopColor="#00f6ff" stopOpacity={0.35} />
                           <stop offset="100%" stopColor="#0077b6" stopOpacity={0.0} />
                        </linearGradient>
                     </defs>
                     <YAxis hide domain={[minRate, maxRate]} />
                     <CartesianGrid strokeDasharray="1 3" vertical={false} stroke="#101e38" opacity={0.5} />
                     <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#00f6ff", strokeWidth: 1, strokeDasharray: "2 2" }} />
                     <Area type="linear" dataKey="rate" stroke="#00f6ff" strokeWidth={1.5} fill="url(#compactLandscapeGlow)" isAnimationActive={false} />
                  </AreaChart>
               </ResponsiveContainer>
            ) : null}
         </div>

         {/* FOOTER & RANGES */}
         <div>
            <div className="flex items-center justify-between px-1 my-2">
               {RANGES.map(range => {
                  const isActive = activeRange === range;
                  return (
                     <button key={range} onClick={() => setActiveRange(range)} className={`px-2.5 py-0.5 text-[9px] font-semibold rounded-full transition-all ${isActive ? "bg-[#0b2149] text-cyan-300 border border-[#00f6ff]/40 shadow-[0_0_8px_rgba(0,246,255,0.3)]" : "text-slate-400 hover:text-slate-200"}`}>
                        {range}
                     </button>
                  );
               })}
            </div>

            <div className="grid grid-cols-4 gap-1 pt-1.5 border-t border-[#101b30] text-center">
               <div>
                  <span className="text-[8px] text-slate-400 block">Low</span>
                  <span className="text-[10px] font-bold text-white">{loading ? "-" : new Intl.NumberFormat("id-ID").format(stats?.low)}</span>
               </div>
               <div>
                  <span className="text-[8px] text-slate-400 block">High</span>
                  <span className="text-[10px] font-bold text-white">{loading ? "-" : new Intl.NumberFormat("id-ID").format(stats?.high)}</span>
               </div>
               <div>
                  <span className="text-[8px] text-slate-400 block">Open</span>
                  <span className="text-[10px] font-bold text-white">{loading ? "-" : new Intl.NumberFormat("id-ID").format(stats?.open)}</span>
               </div>
               <div>
                  <span className="text-[8px] text-slate-400 block">Prev</span>
                  <span className="text-[10px] font-bold text-white">{loading ? "-" : new Intl.NumberFormat("id-ID").format(stats?.prev)}</span>
               </div>
            </div>
         </div>
      </GlassPanel>
   );
};

export default FinanceWidget;
