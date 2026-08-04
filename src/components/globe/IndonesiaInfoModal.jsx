// IndonesiaInfoModal.jsx
import React, { useState, useEffect } from "react";
import { FaXmark, FaEarthAsia, FaClock, FaMapLocationDot, FaUsers, FaBuildingColumns, FaCompass, FaCircleInfo, FaLandmark, FaMountainSun, FaNetworkWired, FaCoins, FaChartLine, FaShieldHalved, FaSatellite, FaChartPie, FaMagnifyingGlass, FaTerminal, FaBolt, FaTowerCell, FaServer, FaLightbulb, FaGlobe } from "react-icons/fa6";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart, Line, CartesianGrid } from "recharts";

import { fetchIndonesiaData, fetchLiveTelemetry } from "../../services/indonesiaService";

// Custom Tooltip Recharts Bergaya Sci-Fi Dark Mode
const CustomTooltip = ({ active, payload, label }) => {
   if (active && payload && payload.length) {
      return (
         <div className="bg-slate-950/95 border border-cyan-500/50 p-2.5 rounded-xl shadow-2xl backdrop-blur-md font-mono text-[10px] text-slate-100 min-w-[120px]">
            <p className="text-cyan-400 font-bold border-b border-slate-800 pb-1 mb-1">{label}</p>
            {payload.map((entry, index) => (
               <div key={`item-${index}`} className="flex justify-between items-center gap-3 my-0.5">
                  <span style={{ color: entry.color || entry.fill || "#22d3ee" }}>{entry.name || entry.dataKey}:</span>
                  <span className="font-bold text-white">
                     {typeof entry.value === "number" ? entry.value.toLocaleString("id-ID") : entry.value}
                     {entry.unit || ""}
                  </span>
               </div>
            ))}
         </div>
      );
   }
   return null;
};

export const IndonesiaInfoModal = ({ isOpen, onClose }) => {
   const [data, setData] = useState(null);
   const [telemetry, setTelemetry] = useState({ latency: 12, activeNodes: "99.8%" });
   const [loading, setLoading] = useState(true);

   const [activeTab, setActiveTab] = useState("overview"); // 'overview', 'ekonomi', 'geospasial'
   const [provinceSearch, setProvinceSearch] = useState("");
   const [logs, setLogs] = useState(["[SYSTEM] Geospatial mesh synchronized.", "[TELEMETRY] Latency optimized via regional edge nodes.", "[DATA] Macroeconomic metrics stream online."]);

   useEffect(() => {
      if (isOpen) {
         setLoading(true);
         fetchIndonesiaData()
            .then(res => {
               if (res) setData(res);
            })
            .catch(err => console.error("Error fetching data:", err))
            .finally(() => setLoading(false));
      }
   }, [isOpen]);

   useEffect(() => {
      if (!isOpen) return;
      const interval = setInterval(() => {
         const newTelemetry = fetchLiveTelemetry();
         setTelemetry(newTelemetry);

         const sampleLogs = [`[PING] Node regional latency: ${newTelemetry.latency || 14}ms`, `[CLUSTER] Active Mesh Load: ${newTelemetry.activeNodes || "99.9%"}`, "[SATELLITE] Syncing GeoJSON vector borders...", "[INFRASTRUCTURE] Palapa Ring fiber optic trunk nominal."];
         const randomLog = sampleLogs[Math.floor(Math.random() * sampleLogs.length)];
         setLogs(prev => [randomLog, ...prev.slice(0, 2)]);
      }, 3500);
      return () => clearInterval(interval);
   }, [isOpen]);

   if (!isOpen) return null;

   if (loading || !data) {
      return (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md">
            <div className="flex flex-col items-center gap-3 text-cyan-400 font-mono">
               <FaSatellite className="animate-spin text-4xl text-cyan-400" />
               <span className="tracking-widest text-xs animate-pulse">CONNECTING TO GEOSPATIAL COMMAND NETWORK...</span>
            </div>
         </div>
      );
   }

   const { ringkasan, pdbSektor, pertumbuhanEkonomi, pulauUtama, daftarProvinsi } = data;

   const filteredProvinces = daftarProvinsi ? daftarProvinsi.filter(p => p.toLowerCase().includes(provinceSearch.toLowerCase())) : [];

   const capabilityData = [
      { subject: "Maritim", A: 92 },
      { subject: "Agrikultur", A: 85 },
      { subject: "Energi", A: 78 },
      { subject: "Teknologi", A: 70 },
      { subject: "Demografi", A: 96 },
      { subject: "Infrastruktur", A: 82 },
   ];

   const tradeData = [
      { bulan: "Q1", ekspor: 62.4, impor: 54.1 },
      { bulan: "Q2", ekspor: 68.1, impor: 57.8 },
      { bulan: "Q3", ekspor: 71.3, impor: 60.2 },
      { bulan: "Q4", ekspor: 75.9, impor: 63.5 },
   ];

   return (
      <div className="fixed inset-0 z-50 pointer-events-none p-4 flex flex-col justify-between animate-fadeIn select-none font-sans">
         {/* TOP BAR */}
         <div className="flex justify-between items-center pointer-events-auto">
            <div className="flex items-center gap-3 bg-slate-900/95 border border-cyan-500/40 px-4 py-2 rounded-xl backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.15)]">
               <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
               </span>
               <span className="text-xs font-mono font-extrabold text-cyan-300 tracking-wider flex items-center gap-2">
                  <FaShieldHalved className="text-emerald-400" /> INDONESIA GEOSPATIAL COMMAND CENTER
               </span>
            </div>

            <button onClick={onClose} className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-300 border border-red-500/40 rounded-xl backdrop-blur-md transition-all duration-300 font-medium text-xs shadow-lg hover:shadow-red-500/20">
               <FaXmark className="text-sm" />
               <span>Tutup Terminal</span>
            </button>
         </div>

         {/* CONTAINER UTAMA */}
         <div className="flex-1 flex w-full h-[calc(100vh-80px)] pt-3 gap-4">
            {/* 1/2 LAYAR KIRI */}
            <div className="w-1/2 h-full flex flex-col justify-between">
               {/* Transparan Khusus Globe 3D View */}
               <div className="h-[40%] w-full pointer-events-none" />

               {/* Panel Informasi Kiri */}
               <div className="h-[58%] w-full bg-slate-900/95 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-4 pointer-events-auto shadow-2xl shadow-cyan-950/50 flex flex-col justify-between gap-2.5 overflow-hidden">
                  {/* Header Ringkasan */}
                  <div className="border-b border-slate-800/80 pb-2 flex justify-between items-center">
                     <div>
                        <h2 className="text-base font-bold text-cyan-100 flex items-center gap-2">
                           <FaEarthAsia className="text-cyan-400 animate-pulse" /> {ringkasan.nama}
                        </h2>
                        <span className="text-[10px] text-slate-400">Archipelagic State • Southeast Asia</span>
                     </div>
                     <div className="flex gap-1.5">
                        <span className="text-[9.5px] font-mono bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">{ringkasan.kode}</span>
                        <span className="text-[9.5px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">ONLINE</span>
                     </div>
                  </div>

                  {/* Profil Ringkas & Zona Waktu */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                     <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 flex flex-col justify-between">
                        <div className="flex items-center gap-1.5 font-semibold text-cyan-300 border-b border-slate-800 pb-1 mb-1 text-[11px]">
                           <FaCircleInfo className="text-cyan-400" /> Geostrategis
                        </div>
                        <p className="text-[10px] text-slate-300 leading-relaxed">Negara kepulauan terbesar di dunia (±17.000+ pulau) menguasai Selat Malaka & koridor maritim dunia.</p>
                     </div>

                     <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 space-y-1.5">
                        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1 font-mono">
                           <FaClock /> Sinkronisasi Waktu
                        </span>
                        <div className="grid grid-cols-3 gap-1 text-center font-mono text-[9.5px]">
                           <div className="bg-slate-900 p-1 rounded border border-slate-800">
                              <span className="text-cyan-300 font-bold block">WIB</span>
                              <span className="text-[8px] text-slate-400">UTC+7</span>
                           </div>
                           <div className="bg-slate-900 p-1 rounded border border-slate-800">
                              <span className="text-cyan-300 font-bold block">WITA</span>
                              <span className="text-[8px] text-slate-400">UTC+8</span>
                           </div>
                           <div className="bg-slate-900 p-1 rounded border border-slate-800">
                              <span className="text-cyan-300 font-bold block">WIT</span>
                              <span className="text-[8px] text-slate-400">UTC+9</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Filter & Grid 38 Provinsi */}
                  <div className="flex-1 bg-slate-950/60 rounded-xl p-2.5 border border-slate-800/80 flex flex-col justify-between overflow-hidden">
                     <div className="flex justify-between items-center text-[11px] mb-1.5">
                        <span className="font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                           <FaBuildingColumns /> Node Provinsi ({filteredProvinces.length})
                        </span>

                        <div className="relative flex items-center">
                           <FaMagnifyingGlass className="absolute left-2 text-slate-500 text-[9px]" />
                           <input type="text" placeholder="Cari provinsi..." value={provinceSearch} onChange={e => setProvinceSearch(e.target.value)} className="bg-slate-900 border border-slate-700/80 rounded-md pl-6 pr-2 py-0.5 text-[9.5px] text-cyan-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono w-32" />
                        </div>
                     </div>

                     <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-3 gap-1 text-[9px] text-slate-300 font-mono custom-scrollbar max-h-24">
                        {filteredProvinces.map((prov, index) => (
                           <div key={index} className="bg-slate-900/80 px-2 py-1 rounded border border-slate-800 hover:border-cyan-500/50 hover:text-cyan-200 transition truncate flex items-center justify-between">
                              <span className="truncate">{prov}</span>
                              <span className="text-slate-600 text-[8px] ml-1">#{(index + 1).toString().padStart(2, "0")}</span>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Terminal Console Output */}
                  <div className="bg-slate-950 rounded-lg p-2 border border-slate-800 font-mono text-[8.5px] text-slate-400 space-y-1">
                     <div className="flex items-center justify-between text-cyan-400 font-bold border-b border-slate-800/80 pb-0.5">
                        <span className="flex items-center gap-1">
                           <FaTerminal className="text-cyan-500 text-[9px]" /> GEOSPATIAL LOGS
                        </span>
                        <span className="text-[8px] text-emerald-400">LIVE FEED</span>
                     </div>
                     <div className="space-y-0.5">
                        {logs.map((log, i) => (
                           <div key={i} className="truncate text-slate-400 font-mono">
                              &gt; {log}
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            {/* 1/2 LAYAR KANAN */}
            <div className="w-1/2 h-full bg-slate-900/95 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-4 pointer-events-auto shadow-2xl shadow-cyan-950/50 flex flex-col justify-between overflow-y-auto custom-scrollbar gap-3">
               {/* Navigasi Tab */}
               <div className="border-b border-slate-800/80 pb-2 space-y-2">
                  <div className="flex justify-between items-center">
                     <div>
                        <h2 className="text-base font-bold text-cyan-100 flex items-center gap-2">
                           <FaMapLocationDot className="text-cyan-400" /> Dynamic Geospatial Dashboard
                        </h2>
                        <p className="text-[10px] text-slate-400">Integrasi telemetri ekonomi makro, infrastruktur, & statistik nasional.</p>
                     </div>
                     <div className="flex items-center gap-1 text-[9.5px] font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded-lg">
                        <FaSatellite className="animate-spin text-xs text-cyan-400" style={{ animationDuration: "8s" }} /> REALTIME SYNC
                     </div>
                  </div>

                  <div className="flex gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-[10px] font-mono">
                     <button onClick={() => setActiveTab("overview")} className={`flex-1 py-1 rounded-lg transition-all ${activeTab === "overview" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-md shadow-cyan-950" : "text-slate-400 hover:text-slate-200"}`}>
                        Ikhtisar Nasional
                     </button>
                     <button onClick={() => setActiveTab("ekonomi")} className={`flex-1 py-1 rounded-lg transition-all ${activeTab === "ekonomi" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-md shadow-cyan-950" : "text-slate-400 hover:text-slate-200"}`}>
                        Struktur Ekonomi
                     </button>
                     <button onClick={() => setActiveTab("geospasial")} className={`flex-1 py-1 rounded-lg transition-all ${activeTab === "geospasial" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-md shadow-cyan-950" : "text-slate-400 hover:text-slate-200"}`}>
                        Kapabilitas & Infra
                     </button>
                  </div>
               </div>

               {/* TAB 1: OVERVIEW */}
               {activeTab === "overview" && (
                  <div className="space-y-3 flex-1 flex flex-col justify-between">
                     <div className="grid grid-cols-4 gap-2 text-xs">
                        <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                           <span className="text-slate-400 text-[8.5px] uppercase block font-mono">Luas Total</span>
                           <span className="font-mono font-semibold text-cyan-300 text-[11px]">{ringkasan.luas}</span>
                        </div>
                        <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                           <span className="text-slate-400 text-[8.5px] uppercase block font-mono">Garis Pantai</span>
                           <span className="font-mono font-semibold text-cyan-300 text-[11px]">{ringkasan.garisPantai}</span>
                        </div>
                        <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800 truncate">
                           <span className="text-slate-400 text-[8.5px] uppercase block font-mono flex items-center gap-1">
                              <FaMountainSun className="text-amber-400" /> Puncak
                           </span>
                           <span className="font-mono font-semibold text-slate-200 text-[10px] truncate block">{ringkasan.puncak}</span>
                        </div>
                        <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                           <span className="text-slate-400 text-[8.5px] uppercase block font-mono">Mata Uang</span>
                           <span className="font-semibold text-amber-300 text-[10px] truncate block">{ringkasan.mataUang}</span>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 space-y-1">
                           <div className="flex justify-between items-center border-b border-slate-800 pb-1">
                              <span className="text-slate-400 text-[9.5px] uppercase flex items-center gap-1 font-mono">
                                 <FaCompass className="text-cyan-400" /> Koordinat
                              </span>
                              <span className="font-mono font-semibold text-cyan-200 text-[9.5px]">{ringkasan.koordinat}</span>
                           </div>
                           <div className="flex justify-between items-center">
                              <span className="text-slate-400 text-[9.5px] uppercase flex items-center gap-1 font-mono">
                                 <FaUsers className="text-cyan-400" /> Est. Populasi
                              </span>
                              <span className="font-mono font-bold text-emerald-400 text-[11px]">± {ringkasan.populasi.toLocaleString("id-ID")}</span>
                           </div>
                        </div>

                        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 space-y-1">
                           <div className="flex justify-between items-center border-b border-slate-800 pb-1">
                              <span className="text-slate-400 text-[9.5px] uppercase flex items-center gap-1 font-mono">
                                 <FaLandmark className="text-cyan-400" /> Ibu Kota
                              </span>
                              <span className="font-semibold text-cyan-200 text-[9.5px] truncate">{ringkasan.ibuKota}</span>
                           </div>
                           <div className="flex justify-between items-center">
                              <span className="text-slate-400 text-[9.5px] uppercase flex items-center gap-1 font-mono">
                                 <FaGlobe className="text-emerald-400" /> Iklim Wilayah
                              </span>
                              <span className="font-mono font-semibold text-emerald-300 text-[10px]">{ringkasan.iklim}</span>
                           </div>
                        </div>
                     </div>

                     {/* Area Chart Pertumbuhan PDB + Penjelasan Padat */}
                     <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/90 space-y-2">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-1">
                           <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                              <FaChartLine className="text-cyan-400" /> Tren Pertumbuhan PDB (%)
                           </span>
                           <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Stabil ±5.2%</span>
                        </div>

                        <div className="h-28 w-full">
                           <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={pertumbuhanEkonomi} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                                 <defs>
                                    <linearGradient id="colorPdb" x1="0" y1="0" x2="0" y2="1">
                                       <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.5} />
                                       <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                    </linearGradient>
                                 </defs>
                                 <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                 <XAxis dataKey="tahun" stroke="#64748b" tick={{ fontSize: 9 }} />
                                 <YAxis stroke="#64748b" tick={{ fontSize: 9 }} domain={[0, 7]} />
                                 <Tooltip content={<CustomTooltip />} />
                                 <Area type="monotone" dataKey="pdb" name="PDB YoY" unit="%" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorPdb)" />
                              </AreaChart>
                           </ResponsiveContainer>
                        </div>

                        {/* Text Fill Space */}
                        <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800 text-[9.5px] text-slate-300 flex items-start gap-2">
                           <FaLightbulb className="text-amber-400 text-xs shrink-0 mt-0.5" />
                           <p className="leading-normal">
                              Ekonomi Indonesia menunjukkan resiliensi pasca-2021 dengan rata-rata ekspansi <strong>&gt;5.0% per tahun</strong>, didorong konsumsi domestik yang kuat serta hilirisasi komoditas strategis.
                           </p>
                        </div>
                     </div>
                  </div>
               )}

               {/* TAB 2: EKONOMI */}
               {activeTab === "ekonomi" && (
                  <div className="space-y-3 flex-1 flex flex-col justify-between">
                     <div className="grid grid-cols-2 gap-2">
                        {/* Bar Chart Sektor PDB */}
                        <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 flex flex-col justify-between">
                           <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1 mb-1 font-mono">
                              <FaChartPie className="text-cyan-400" /> Sektor PDB Utama (%)
                           </span>
                           <div className="h-28 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                 <BarChart data={pdbSektor} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
                                    <XAxis dataKey="sektor" stroke="#64748b" tick={{ fontSize: 8 }} />
                                    <YAxis stroke="#64748b" tick={{ fontSize: 8 }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="persentase" name="Kontribusi" unit="%" radius={[4, 4, 0, 0]}>
                                       {pdbSektor.map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill={entry.fill || "#06b6d4"} />
                                       ))}
                                    </Bar>
                                 </BarChart>
                              </ResponsiveContainer>
                           </div>
                           <div className="text-[8.5px] text-slate-400 bg-slate-900 p-1.5 rounded border border-slate-800 mt-1">Manufaktur & Agrikultur menjadi tulang punggung perekonomian nasional.</div>
                        </div>

                        {/* Pie Chart Distribusi Server/Cluster Pulau */}
                        <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 flex flex-col justify-between">
                           <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1 font-mono">
                              <FaNetworkWired className="text-cyan-400" /> Beban Cluster Komputasi
                           </span>
                           <div className="h-28 w-full flex items-center justify-center">
                              <ResponsiveContainer width="100%" height="100%">
                                 <PieChart>
                                    <Pie data={pulauUtama} dataKey="load" nameKey="nama" cx="50%" cy="50%" innerRadius={22} outerRadius={38} paddingAngle={3}>
                                       <Cell fill="#06b6d4" />
                                       <Cell fill="#ef4444" />
                                       <Cell fill="#10b981" />
                                       <Cell fill="#f59e0b" />
                                       <Cell fill="#8b5cf6" />
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                 </PieChart>
                              </ResponsiveContainer>
                           </div>
                           <div className="text-[8.5px] text-slate-400 bg-slate-900 p-1.5 rounded border border-slate-800 mt-1 truncate">Jawa memegang &gt;50% traffic komputasi digital & ekonomi.</div>
                        </div>
                     </div>

                     {/* Composed Chart Neraca Dagang */}
                     <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 space-y-1.5">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-1">
                           <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1 font-mono">
                              <FaBolt className="text-amber-400" /> Volume Perdagangan Kuartalan (Miliar USD)
                           </span>
                           <span className="text-[8.5px] text-emerald-400 font-mono">SURPLUS TRADE</span>
                        </div>
                        <div className="h-28 w-full">
                           <ResponsiveContainer width="100%" height="100%">
                              <ComposedChart data={tradeData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                                 <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                 <XAxis dataKey="bulan" stroke="#64748b" tick={{ fontSize: 8 }} />
                                 <YAxis stroke="#64748b" tick={{ fontSize: 8 }} />
                                 <Tooltip content={<CustomTooltip />} />
                                 <Bar dataKey="ekspor" name="Ekspor" unit="B USD" fill="#06b6d4" radius={[3, 3, 0, 0]} />
                                 <Line type="monotone" dataKey="impor" name="Impor" unit="B USD" stroke="#f59e0b" strokeWidth={2} />
                              </ComposedChart>
                           </ResponsiveContainer>
                        </div>
                     </div>
                  </div>
               )}

               {/* TAB 3: GEOSPASIAL / INFRASTRUKTUR */}
               {activeTab === "geospasial" && (
                  <div className="space-y-3 flex-1 flex flex-col justify-between">
                     {/* Radar Chart Kapabilitas Sektor */}
                     <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 flex flex-col items-center">
                        <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1 self-start font-mono mb-1">
                           <FaTowerCell className="text-cyan-400" /> Profil Ketahanan & Kapabilitas Strategis
                        </span>
                        <div className="h-36 w-full">
                           <ResponsiveContainer width="100%" height="100%">
                              <RadarChart cx="50%" cy="50%" outerRadius="65%" data={capabilityData}>
                                 <PolarGrid stroke="#334155" />
                                 <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fontSize: 8 }} />
                                 <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={false} />
                                 <Radar name="Skor Kapabilitas" dataKey="A" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.4} />
                                 <Tooltip content={<CustomTooltip />} />
                              </RadarChart>
                           </ResponsiveContainer>
                        </div>
                     </div>

                     {/* Indikator Infrastruktur Digital */}
                     <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 space-y-2">
                        <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider block font-mono">Kesiapan Digital & Connectivitas</span>

                        <div className="space-y-1.5 text-[9px] font-mono">
                           <div>
                              <div className="flex justify-between text-slate-300 mb-0.5">
                                 <span>Palapa Ring Fiber Optic Backbone</span>
                                 <span className="text-cyan-400 font-bold">100% Active</span>
                              </div>
                              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                 <div className="bg-cyan-500 h-full w-[100%] rounded-full"></div>
                              </div>
                           </div>

                           <div>
                              <div className="flex justify-between text-slate-300 mb-0.5">
                                 <span>Cakupan Jaringan 5G Perkotaan</span>
                                 <span className="text-emerald-400 font-bold">78.4%</span>
                              </div>
                              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                 <div className="bg-emerald-500 h-full w-[78%] rounded-full"></div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {/* Telemetry Console Footer */}
               <div className="bg-slate-950 rounded-xl p-2 border border-slate-800 text-[9.5px] font-mono text-slate-400 space-y-1">
                  <div className="text-cyan-400 font-bold flex items-center justify-between border-b border-slate-800/80 pb-0.5">
                     <span className="flex items-center gap-1 text-[10px]">
                        <FaShieldHalved className="text-emerald-400" /> [SYSTEM TELEMETRY STATUS]
                     </span>
                     <span className="text-[8px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">CONNECTED</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[8.5px]">
                     <div>
                        &gt; Active Mesh Node: <span className="text-emerald-400">{telemetry.activeNodes}</span>
                     </div>
                     <div className="text-cyan-300">
                        &gt; Latency Ping: <span className="text-amber-300 font-bold">{telemetry.latency}ms</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default IndonesiaInfoModal;
