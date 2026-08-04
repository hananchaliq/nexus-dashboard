import { WiDaySunny, WiNightClear, WiDayCloudy, WiCloudy, WiCloud, WiFog, WiShowers, WiRain, WiSnow, WiThunderstorm } from "react-icons/wi";

export const getWeatherIcon = (code, isDay = true, size = 64) => {
   if (code === 0) return isDay ? <WiDaySunny size={size} className="text-yellow-400" /> : <WiNightClear size={size} className="text-indigo-300" />;

   if ([1, 2].includes(code)) return <WiDayCloudy size={size} className="text-yellow-300" />;

   if (code === 3) return <WiCloudy size={size} className="text-slate-300" />;

   if ([45, 48].includes(code)) return <WiFog size={size} className="text-slate-400" />;

   if ([51, 53, 55, 56, 57].includes(code)) return <WiShowers size={size} className="text-cyan-300" />;

   if ([61, 63, 65, 80, 81, 82].includes(code)) return <WiRain size={size} className="text-blue-300" />;

   if ([66, 67, 71, 73, 75, 77, 85, 86].includes(code)) return <WiSnow size={size} className="text-white" />;

   if ([95, 96, 99].includes(code)) return <WiThunderstorm size={size} className="text-purple-300" />;

   return <WiCloud size={size} className="text-slate-300" />;
};
