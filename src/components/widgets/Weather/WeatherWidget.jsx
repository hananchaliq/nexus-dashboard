import React, { useEffect, useState } from "react";
import { GlassPanel } from "../../common/GlassPanel";
import { fetchWeatherData } from "../../../services/weather";
import { useAppStore } from "../../../store/appStore";
import { getWeatherIcon } from "../../../utils/weatherIcon";
import { getWeatherText } from "../../../utils/weatherText";
import { WiHumidity, WiStrongWind, WiBarometer } from "react-icons/wi";
import { FaLocationDot } from "react-icons/fa6"; // Fix Import Syntax

const Loading = () => (
   <GlassPanel className="p-4 animate-pulse">
      <div className="h-4 w-28 rounded bg-white/10 mb-4" />
      <div className="h-16 w-full rounded bg-white/10 mb-3" />
      <div className="h-16 w-full rounded bg-white/10 mb-3" />
      <div className="h-16 w-full rounded bg-white/10" />
   </GlassPanel>
);

export default function WeatherWidget() {
   const [weather, setWeather] = useState(null);
   const location = useAppStore(state => state.location);

   useEffect(() => {
      const loadWeather = async () => {
         if (!location?.lat || !location?.lon) return;

         const cityName = location.regency || location.city || "Lokasi Anda";
         const data = await fetchWeatherData(location.lat, location.lon, cityName);
         setWeather(data);
      };

      loadWeather();
   }, [location]);

   if (!weather) return <Loading />;

   // 🚀 Cari index jam saat ini dari array hourly Open-Meteo
   const now = new Date();
   const currentHour = now.getHours();

   let currentIndex = weather.hourly?.findIndex(item => {
      if (!item.time) return false;
      const itemDate = new Date(item.time);
      // Cocokkan tanggal dan jam lokal
      return itemDate.getDate() === now.getDate() && itemDate.getHours() === currentHour;
   });

   if (currentIndex === -1 || currentIndex === undefined) {
      currentIndex = 0;
   }

   // Ambil 12 jam dari jam sekarang ke depan
   const upcomingHourly = weather.hourly?.slice(currentIndex, currentIndex + 12) || [];

   return (
      <GlassPanel className="p-3 text-xs font-sans h-full flex flex-col justify-between glass-card rounded-2xl">
         {/* Header */}
         <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-bold tracking-wider text-slate-200 uppercase">CUACA SAAT INI</h3>
            <div className="flex items-center gap-1 text-cyan-400 font-medium text-[10px] max-w-[120px] truncate">
               <FaLocationDot className="shrink-0 text-[9px]" />
               <span className="truncate">{weather.location || location.regency}</span>
            </div>
         </div>

         {/* Suhu & Kondisi Utama */}
         <div className="flex items-center justify-between my-auto py-1 px-1">
            <div className="flex items-center gap-2">
               <div>{getWeatherIcon(weather.weatherCode, weather.isDay, 40)}</div>
               <span className="text-3xl font-normal text-white tracking-tight">{weather.temp}°C</span>
            </div>

            <div className="text-right">
               <p className="text-xs font-medium text-white">{getWeatherText(weather.weatherCode)}</p>
               <p className="text-[9px] text-slate-400">Feels like {weather.feelsLike}°C</p>
            </div>
         </div>

         {/* Stat Grid */}
         <div className="bg-black/20 backdrop-blur-md rounded-xl p-2.5 my-1 border border-white/5">
            <div className="grid grid-cols-3 gap-1 text-center">
               <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1 text-[9px] text-slate-400">
                     <WiHumidity size={14} className="text-cyan-400" />
                     <span>Humidity</span>
                  </div>
                  <span className="text-[11px] font-semibold text-white mt-0.5">{weather.humidity}%</span>
               </div>

               <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1 text-[9px] text-slate-400">
                     <WiStrongWind size={14} className="text-cyan-400" />
                     <span>Wind</span>
                  </div>
                  <span className="text-[11px] font-semibold text-white mt-0.5">{weather.windSpeed} km/h</span>
               </div>

               <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1 text-[9px] text-slate-400">
                     <WiBarometer size={14} className="text-cyan-400" />
                     <span>Pressure</span>
                  </div>
                  <span className="text-[11px] font-semibold text-white mt-0.5">{weather.pressure} hPa</span>
               </div>
            </div>
         </div>

         {/* Hourly Forecast */}
         <div className="bg-black/20 backdrop-blur-md rounded-xl p-2 border border-white/5">
            <div className="flex items-center overflow-x-auto gap-3 scrollbar-none">
               {upcomingHourly.length > 0 ? (
                  upcomingHourly.map((hour, index) => {
                     const hourDate = new Date(hour.time);
                     const displayTime = hourDate.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                     });

                     const hourNum = hourDate.getHours();
                     const isDayTime = hourNum >= 6 && hourNum < 18;

                     return (
                        <div key={index} className="flex flex-col items-center min-w-[36px] shrink-0">
                           <span className="text-[9px] text-slate-400">{displayTime}</span>
                           <div className="my-0.5">{getWeatherIcon(hour.weatherCode, isDayTime, 18)}</div>
                           <span className="text-[10px] font-medium text-white">{hour.temp}°C</span>
                        </div>
                     );
                  })
               ) : (
                  <div className="text-[10px] text-slate-500 py-1 text-center w-full">Memuat jam...</div>
               )}
            </div>
         </div>
      </GlassPanel>
   );
}
