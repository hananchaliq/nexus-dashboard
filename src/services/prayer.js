import { DEFAULT_CAPITAL } from "./location";

// Helper untuk menambahkan menit ke format HH:mm
const addMinutesToTime = (timeStr, minutesToAdd) => {
   if (!timeStr) return "--:--";
   const [hours, minutes] = timeStr.split(":").map(Number);
   const date = new Date();
   date.setHours(hours, minutes + minutesToAdd, 0, 0);

   const pad = num => String(num).padStart(2, "0");
   return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const fetchPrayerData = async (lat = DEFAULT_CAPITAL.lat, lon = DEFAULT_CAPITAL.lon, cityName = DEFAULT_CAPITAL.city) => {
   try {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, "0");
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const year = today.getFullYear();
      const dateStr = `${day}-${month}-${year}`;

      // Method 20 = Kemenag RI
      const url = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lon}&method=20`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Prayer API Error");

      const result = await response.json();
      const timings = result.data.timings;

      // Waktu Dhuha dimulai ~20 menit setelah Terbit (Sunrise)
      const dhuhaTime = addMinutesToTime(timings.Sunrise, 20);

      return {
         location: cityName,
         schedule: [
            { name: "Imsak", time: timings.Imsak },
            { name: "Subuh", time: timings.Fajr },
            { name: "Dhuha", time: dhuhaTime }, // Menampilkan Dhuha sebagai pengganti Terbit
            { name: "Dzuhur", time: timings.Dhuhr },
            { name: "Ashar", time: timings.Asr },
            { name: "Maghrib", time: timings.Maghrib },
            { name: "Isya", time: timings.Isha },
         ],
         rawTimings: timings,
      };
   } catch (error) {
      console.error("Prayer API Error:", error);
      return null;
   }
};
