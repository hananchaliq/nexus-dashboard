export const getWeatherText = code => {
   const weather = {
      0: "Clear Sky",

      1: "Mainly Clear",

      2: "Partly Cloudy",

      3: "Overcast",

      45: "Fog",

      48: "Dense Fog",

      51: "Light Drizzle",

      53: "Drizzle",

      55: "Heavy Drizzle",

      56: "Freezing Drizzle",

      57: "Heavy Freezing Drizzle",

      61: "Light Rain",

      63: "Rain",

      65: "Heavy Rain",

      66: "Freezing Rain",

      67: "Heavy Freezing Rain",

      71: "Light Snow",

      73: "Snow",

      75: "Heavy Snow",

      77: "Snow Grains",

      80: "Rain Shower",

      81: "Heavy Shower",

      82: "Violent Shower",

      85: "Snow Shower",

      86: "Heavy Snow Shower",

      95: "Thunderstorm",

      96: "Storm & Hail",

      99: "Severe Thunderstorm",
   };

   return weather[code] || "Unknown";
};
