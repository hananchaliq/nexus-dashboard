import { DEFAULT_CAPITAL } from "./location";

export const fetchWeatherData = async (lat = DEFAULT_CAPITAL.lat, lon = DEFAULT_CAPITAL.lon, cityName = DEFAULT_CAPITAL.city) => {
   try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,visibility,precipitation,cloud_cover,is_day&hourly=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&forecast_days=7&timezone=auto`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Weather API Error");

      const data = await response.json();

      return {
         location: cityName,
         temp: Math.round(data.current.temperature_2m),
         feelsLike: Math.round(data.current.apparent_temperature),
         humidity: data.current.relative_humidity_2m,
         pressure: Math.round(data.current.surface_pressure),
         windSpeed: Math.round(data.current.wind_speed_10m),
         windDirection: data.current.wind_direction_10m,
         visibility: Math.round(data.current.visibility / 1000),
         precipitation: data.current.precipitation,
         cloudCover: data.current.cloud_cover,
         weatherCode: data.current.weather_code,
         isDay: data.current.is_day === 1,
         sunrise: data.daily.sunrise[0],
         sunset: data.daily.sunset[0],
         uv: data.daily.uv_index_max[0],
         maxTemp: Math.round(data.daily.temperature_2m_max[0]),
         minTemp: Math.round(data.daily.temperature_2m_min[0]),
         // 🚀 JANGAN DI-SLICE DI SINI agar komponen bisa filter dari jam berjalan
         hourly: data.hourly.time.map((time, index) => ({
            time,
            temp: Math.round(data.hourly.temperature_2m[index]),
            weatherCode: data.hourly.weather_code[index],
         })),
      };
   } catch (error) {
      console.error(error);
      return null;
   }
};