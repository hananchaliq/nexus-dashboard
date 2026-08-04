import { useState, useEffect } from "react";

export const useWeather = (city = "Ende") => {
   const [weather, setWeather] = useState({
      temp: 26,
      condition: "Cerah",
      feelsLike: 27,
      humidity: "78%",
      wind: "12 km/h",
      pressure: "1012 hPa",
      forecast: [
         { time: "22:00", temp: "25°C" },
         { time: "23:00", temp: "25°C" },
         { time: "00:00", temp: "24°C" },
         { time: "01:00", temp: "24°C" },
         { time: "02:00", temp: "24°C" },
      ],
   });

   return { weather, loading: false };
};
