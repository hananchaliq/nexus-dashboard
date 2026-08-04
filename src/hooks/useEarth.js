import { useGlobeStore } from "../store/globeStore";

export const useEarth = () => {
   const config = useGlobeStore();

   const getNTTCoordinates = () => ({
      lat: -8.8607,
      lon: 121.6605,
      name: "Nusa Tenggara Timur (NTT)",
      regency: "Ende",
   });

   return {
      ...config,
      getNTTCoordinates,
   };
};
