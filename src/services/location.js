// src/services/location.js

export const PresetLocations = {
   WIB: {
      regency: "Jakarta",
      province: "DKI Jakarta",
      country: "Indonesia",
      lat: -6.2088,
      lon: 106.8456,
      timeZone: "Asia/Jakarta",
      label: "WIB (Jakarta)",
   },
   WITA: {
      regency: "Ende",
      province: "Nusa Tenggara Timur (NTT)",
      country: "Indonesia",
      lat: -8.8607,
      lon: 121.6605,
      timeZone: "Asia/Makassar",
      label: "WITA (Ende)",
   },
   WIT: {
      regency: "Jayapura",
      province: "Papua",
      country: "Indonesia",
      lat: -2.5489,
      lon: 140.7181,
      timeZone: "Asia/Jayapura",
      label: "WIT (Jayapura)",
   },
};

export const DEFAULT_LOCATION = PresetLocations.WITA;
export const DEFAULT_CAPITAL = DEFAULT_LOCATION;

export const getUserLocation = () => {
   return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
         alert("Browser Anda tidak mendukung Geolocation.");
         return resolve(DEFAULT_LOCATION);
      }

      navigator.geolocation.getCurrentPosition(
         async position => {
            const { latitude: lat, longitude: lon } = position.coords;
            try {
               // Reverse Geocoding via OpenStreetMap Nominatim
               const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
               const data = await res.json();

               const address = data.address || {};
               // Ambil nama kota/kabupaten terdekat
               const city = address.city || address.regency || address.town || address.municipality || address.county || "Lokasi Anda";

               const state = address.state || "Indonesia";
               const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

               const result = {
                  regency: city,
                  city: city,
                  province: state,
                  country: "Indonesia",
                  lat: lat,
                  lon: lon,
                  timeZone: userTz,
                  isGPS: true,
               };

               resolve(result);
            } catch (error) {
               console.error("Geocoding failed:", error);
               // Tetap kirim lat & lon koordinat presisi meskipun nama kota gagal di-fetch
               resolve({
                  ...DEFAULT_LOCATION,
                  lat,
                  lon,
                  regency: "Lokasi GPS",
               });
            }
         },
         error => {
            console.warn("Geolocation Error:", error.message);
            if (error.code === error.PERMISSION_DENIED) {
               alert("Izin lokasi ditolak. Silakan izinkan akses lokasi di pengaturan browser Anda.");
            }
            resolve(DEFAULT_LOCATION);
         },
         {
            enableHighAccuracy: true, // Memaksa sensor GPS presisi
            timeout: 10000,
            maximumAge: 0, // Jangan gunakan cache lokasi lama
         }
      );
   });
};
