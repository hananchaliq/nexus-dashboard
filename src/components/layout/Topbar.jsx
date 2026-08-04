import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, Sun, Cloud, CloudRain, ChevronDown, Menu, User, Settings, LogOut, Navigation, Loader2 } from "lucide-react";
import { useAppStore } from "../../store/appStore";
import { getUserLocation, PresetLocations } from "../../services/location";

export const Topbar = ({ onToggleSidebar }) => {
   const { location, setLocation, user } = useAppStore();

   const [time, setTime] = useState(new Date());
   const [searchQuery, setSearchQuery] = useState("");
   const [isProfileOpen, setIsProfileOpen] = useState(false);
   const [isLocationOpen, setIsLocationOpen] = useState(false);
   const [isDetecting, setIsDetecting] = useState(false);
   const [weather, setWeather] = useState({ temp: "--°C", condition: "Memuat...", icon: Sun });

   const searchInputRef = useRef(null);
   const profileRef = useRef(null);
   const locationRef = useRef(null);

   // 1. Auto detect geolocation saat awal mount
   useEffect(() => {
      getUserLocation().then(detectedLoc => {
         setLocation(detectedLoc);
      });
   }, [setLocation]);

   // 2. Real-time Clock
   useEffect(() => {
      const timer = setInterval(() => setTime(new Date()), 1000);
      return () => clearInterval(timer);
   }, []);

   // 3. Shortcuts & Click Outside
   useEffect(() => {
      const handleKeyDown = e => {
         if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
            e.preventDefault();
            searchInputRef.current?.focus();
         }
         if (e.key === "Escape") {
            setIsProfileOpen(false);
            setIsLocationOpen(false);
            searchInputRef.current?.blur();
         }
      };

      const handleClickOutside = e => {
         if (profileRef.current && !profileRef.current.contains(e.target)) setIsProfileOpen(false);
         if (locationRef.current && !locationRef.current.contains(e.target)) setIsLocationOpen(false);
      };

      window.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         window.removeEventListener("keydown", handleKeyDown);
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, []);

   // 4. Fetch Weather ringkas untuk Topbar berdasarkan koordinat di Store
   useEffect(() => {
      if (!location?.lat || !location?.lon) return;

      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current_weather=true`)
         .then(res => res.json())
         .then(data => {
            if (data?.current_weather) {
               const temp = Math.round(data.current_weather.temperature);
               const code = data.current_weather.weathercode;
               let cond = "Cerah";
               let IconComp = Sun;

               if (code >= 1 && code <= 3) {
                  cond = "Berawan";
                  IconComp = Cloud;
               } else if (code >= 51) {
                  cond = "Hujan";
                  IconComp = CloudRain;
               }

               setWeather({ temp: `${temp}°C`, condition: cond, icon: IconComp });
            }
         })
         .catch(() => {});
   }, [location.lat, location.lon]);

   // Handler untuk trigger manual lokasi GPS
   const handleGetGPS = async () => {
      setIsDetecting(true);
      try {
         const loc = await getUserLocation();
         if (loc) {
            setLocation(loc);
         }
      } catch (err) {
         console.error(err);
      } finally {
         setIsDetecting(false);
         setIsLocationOpen(false);
      }
   };

   const handleGoogleSearch = e => {
      e.preventDefault();
      if (!searchQuery.trim()) return;
      window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, "_blank", "noopener,noreferrer");
   };

   // Formatting Jam & Tanggal Sesuai Timezone Lokasi di Store
   const timeZone = location?.timeZone || "Asia/Jakarta";

   const formattedDate = new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone,
   }).format(time);

   const formattedTime = new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone,
   })
      .format(time)
      .replaceAll(".", ":");

   const WeatherIcon = weather.icon;

   return (
      <header className="relative z-50 h-14 px-4 m-3 flex items-center justify-between border border-[#16274a]/70 bg-[#050a18]/80 backdrop-blur-md rounded-2xl shadow-xl select-none">
         {/* LEFT */}
         <div className="flex items-center gap-3">
            <button onClick={onToggleSidebar} className="p-1.5 text-slate-400 hover:text-white hover:bg-[#0e1c38] rounded-lg transition-colors" title="Toggle Sidebar">
               <Menu className="w-4 h-4" />
            </button>

            <form onSubmit={handleGoogleSearch} className="relative w-64 md:w-72 group">
               <input ref={searchInputRef} type="text" placeholder="Search anything.." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-[#081226] text-slate-200 text-xs rounded-xl pl-8 pr-12 py-1.5 border border-[#16284d] group-hover:border-cyan-500/40 focus:border-cyan-400/80 transition-colors focus:outline-none" />
               <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2 group-hover:text-cyan-400 transition-colors" />
               <span className="absolute right-2 top-1.5 text-[9px] bg-[#0f1d38] text-slate-400 px-1.5 py-0.5 rounded font-mono border border-[#1e345e] pointer-events-none">Ctrl + K</span>
            </form>
         </div>

         {/* CENTER: TIME DENGAN TIMEZONE */}
         <div className="hidden lg:flex items-center gap-3 text-xs font-medium text-slate-300">
            <span className="capitalize text-slate-300 text-[11px]">{formattedDate}</span>
            <span className="text-base font-black font-mono tracking-wider text-white">{formattedTime}</span>
         </div>

         {/* RIGHT */}
         <div className="flex items-center gap-3 md:gap-4">
            {/* LOCATION DROPDOWN */}
            <div className="relative" ref={locationRef}>
               <button onClick={() => setIsLocationOpen(!isLocationOpen)} className="flex items-center gap-2 bg-[#081226] px-2.5 py-1.5 rounded-xl border border-[#16284d] hover:border-cyan-500/40 text-xs transition-colors">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center shrink-0">
                     <MapPin className="w-3 h-3 text-cyan-400" />
                  </div>
                  <div className="text-left hidden sm:block">
                     <div className="font-semibold text-white leading-tight text-[11px]">{location?.regency || "Pilih Lokasi"}</div>
                     <div className="text-[9px] text-slate-400">{location?.province || "Indonesia"}</div>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-500 ml-0.5" />
               </button>

               {isLocationOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#071124] border border-[#16284d] rounded-xl shadow-2xl p-2 z-[100] text-xs animate-in fade-in duration-100">
                     <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-[#16284d] mb-1">PILIH LOKASI / ZONA WAKTU</div>

                     {/* Opsi Deteksi Ulang GPS */}
                     <button onClick={handleGetGPS} disabled={isDetecting} className="w-full text-left px-2.5 py-1.5 text-[11px] text-cyan-400 hover:bg-[#0e1c38] rounded-lg transition-colors flex items-center gap-2 mb-1 border-b border-[#16284d]/50 disabled:opacity-50">
                        {isDetecting ? <Loader2 className="w-3 h-3 animate-spin text-cyan-400" /> : <Navigation className="w-3 h-3 text-cyan-400" />}
                        <span>{isDetecting ? "Mendeteksi Lokasi..." : "Gunakan Lokasi Presisi (GPS)"}</span>
                     </button>

                     {/* Opsi Preset 3 Zona Waktu */}
                     {Object.entries(PresetLocations).map(([key, item]) => (
                        <button
                           key={key}
                           onClick={() => {
                              setLocation(item);
                              setIsLocationOpen(false);
                           }}
                           className={`w-full text-left px-2.5 py-1.5 text-[11px] rounded-lg transition-colors flex justify-between items-center ${location.regency === item.regency ? "bg-cyan-500/10 text-cyan-400 font-bold" : "text-slate-300 hover:text-cyan-400 hover:bg-[#0e1c38]"}`}>
                           <span>{item.label}</span>
                           <span className="text-[9px] text-slate-500">{key}</span>
                        </button>
                     ))}
                  </div>
               )}
            </div>

            {/* WEATHER WIDGET (RINGKAS) */}
            <div className="flex items-center gap-2 text-xs border-r border-[#16284d] pr-3 md:pr-4">
               <WeatherIcon className="w-4 h-4 text-amber-400 shrink-0" />
               <div className="hidden sm:block">
                  <span className="font-bold text-white text-[11px]">{weather.temp}</span>
                  <span className="text-[9px] text-slate-400 block leading-none">{weather.condition}</span>
               </div>
            </div>

            {/* USER PROFILE */}
            <div className="relative" ref={profileRef}>
               <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 text-xs p-1 hover:bg-[#081226] rounded-xl transition-colors">
                  <div className="relative">
                     <img src={user?.avatar} alt="Avatar" className="w-7 h-7 rounded-full border border-cyan-400/50 object-cover" />
                     <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 border border-[#050a18] rounded-full" />
                  </div>
                  <div className="text-left hidden md:block">
                     <p className="font-semibold text-white leading-tight text-[11px]">{user?.name}</p>
                     <p className="text-[9px] text-cyan-400 leading-tight">{user?.role}</p>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-500 hidden md:block" />
               </button>

               {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#071124] border border-[#16284d] rounded-xl shadow-2xl p-1 z-[100]">
                     <div className="px-3 py-2 border-b border-[#16284d]">
                        <p className="font-bold text-white text-xs">{user?.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">developer@latansa.app</p>
                     </div>
                     <div className="py-1">
                        <button className="flex items-center gap-2 px-3 py-1.5 text-[11px] text-slate-300 hover:text-cyan-400 hover:bg-[#0e1c38] rounded-lg w-full text-left transition-colors">
                           <User className="w-3.5 h-3.5" />
                           <span>Profile Account</span>
                        </button>
                        <button className="flex items-center gap-2 px-3 py-1.5 text-[11px] text-slate-300 hover:text-cyan-400 hover:bg-[#0e1c38] rounded-lg w-full text-left transition-colors">
                           <Settings className="w-3.5 h-3.5" />
                           <span>Preferences</span>
                        </button>
                     </div>
                     <div className="pt-1 border-t border-[#16284d]">
                        <button className="flex items-center gap-2 px-3 py-1.5 text-[11px] text-rose-400 hover:bg-rose-950/30 rounded-lg w-full text-left transition-colors">
                           <LogOut className="w-3.5 h-3.5" />
                           <span>Logout</span>
                        </button>
                     </div>
                  </div>
               )}
            </div>
         </div>
      </header>
   );
};

export default Topbar;
