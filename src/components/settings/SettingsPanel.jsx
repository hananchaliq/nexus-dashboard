import React from "react";
import { useGlobeStore } from "../../store/globeStore";
import { useSettingsStore } from "../../store/settingsStore";
import { Sliders, RotateCcw, Save, Globe, Palette, Layers, Bell, Shield, Database } from "lucide-react";

export const SettingsPanel = () => {
   const globe = useGlobeStore();
   const settings = useSettingsStore();

   return (
      <div className="p-6 grid grid-cols-12 gap-6 h-[calc(100vh-4rem)] overflow-y-auto">
         {/* Sidebar Settings Menu */}
         <div className="col-span-2 space-y-1">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
               <Sliders className="w-4 h-4 text-cyan-400" /> SETTINGS
            </h2>
            {[
               { label: "General", icon: Sliders },
               { label: "Globe", icon: Globe, active: true },
               { label: "Theme & Colors", icon: Palette },
               { label: "Glassmorphism", icon: Layers },
               { label: "Notifications", icon: Bell },
               { label: "Security", icon: Shield },
               { label: "Backup & Restore", icon: Database },
            ].map(item => (
               <button key={item.label} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${item.active ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"}`}>
                  <item.icon className="w-4 h-4" />
                  {item.label}
               </button>
            ))}
         </div>

         {/* Globe Controls & Live Preview Panel */}
         <div className="col-span-6 bg-slate-900/40 border border-slate-800 rounded-2xl p-5 space-y-5 backdrop-blur-xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
               <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">GLOBE SETTINGS</h3>
               <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">Preview Globe ON</span>
            </div>

            {/* Location Dropdowns */}
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Provinsi</label>
                  <select className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500">
                     <option>Nusa Tenggara Timur (NTT)</option>
                  </select>
               </div>
               <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Kabupaten</label>
                  <select className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500">
                     <option>Ende</option>
                  </select>
               </div>
            </div>

            {/* Range Sliders for Globe Config */}
            <div className="space-y-3 pt-2">
               <p className="text-[11px] font-bold text-cyan-400">Pengaturan Globe</p>
               {[
                  { label: "Rotation Speed", key: "rotationSpeed", min: 0, max: 2, step: 0.05 },
                  { label: "Zoom Speed", key: "zoomSpeed", min: 0.5, max: 3, step: 0.1 },
                  { label: "Glow Intensity", key: "glowIntensity", min: 0, max: 1, step: 0.05 },
                  { label: "Cloud Opacity", key: "cloudOpacity", min: 0, max: 1, step: 0.05 },
                  { label: "Atmosphere Intensity", key: "atmosphereIntensity", min: 0, max: 1, step: 0.05 },
               ].map(slider => (
                  <div key={slider.key} className="flex items-center justify-between text-xs text-slate-300">
                     <span className="w-36 text-[11px] text-slate-400">{slider.label}</span>
                     <input type="range" min={slider.min} max={slider.max} step={slider.step} value={globe[slider.key]} onChange={e => globe.setGlobeConfig(slider.key, parseFloat(e.target.value))} className="w-full mx-3 accent-cyan-400 bg-slate-800 h-1 rounded-lg cursor-pointer" />
                     <span className="w-10 text-right font-mono text-cyan-400 text-[11px]">{globe[slider.key].toFixed(2)}x</span>
                  </div>
               ))}
            </div>

            {/* Coordinates */}
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-800 text-xs font-mono">
               <div>
                  <span className="text-slate-500 text-[10px] block">Latitude</span> <span className="text-cyan-300">-8.8607°</span>
               </div>
               <div>
                  <span className="text-slate-500 text-[10px] block">Longitude</span> <span className="text-cyan-300">121.6605°</span>
               </div>
            </div>
         </div>

         {/* Theme & Glass Settings (Right Side Settings) */}
         <div className="col-span-4 space-y-4">
            {/* Theme Selector Grid */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 backdrop-blur-xl">
               <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">THEME PREVIEW</h3>
               <div className="grid grid-cols-2 gap-2 text-xs">
                  {["Cyber Blue", "Purple Haze", "Matrix Green", "Sunset Orange"].map(t => (
                     <button key={t} onClick={() => settings.setTheme(t)} className={`p-2.5 rounded-xl border text-center transition-all ${settings.theme === t ? "border-cyan-400 bg-cyan-500/10 text-cyan-300 shadow-md shadow-cyan-500/20" : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700"}`}>
                        {t}
                     </button>
                  ))}
               </div>
            </div>

            {/* Glassmorphism Range Controls */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 backdrop-blur-xl space-y-3">
               <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">GLASS SETTINGS</h3>
               {[
                  { label: "Blur", val: "0.65" },
                  { label: "Transparency", val: "0.35" },
                  { label: "Brightness", val: "0.90" },
                  { label: "Border Radius", val: "14px" },
               ].map(g => (
                  <div key={g.label} className="flex items-center justify-between text-xs">
                     <span className="text-slate-400 text-[11px]">{g.label}</span>
                     <input type="range" className="w-28 accent-cyan-400 bg-slate-800 h-1 rounded" />
                     <span className="font-mono text-cyan-400 text-[10px]">{g.val}</span>
                  </div>
               ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
               <button onClick={() => globe.resetGlobeConfig()} className="flex-1 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center justify-center gap-1.5 transition-all">
                  <RotateCcw className="w-3.5 h-3.5" /> Reset Default
               </button>
               <button className="flex-1 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-xs font-bold text-white shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-1.5 transition-all">
                  <Save className="w-3.5 h-3.5" /> Simpan Perubahan
               </button>
            </div>
         </div>
      </div>
   );
};
