import { create } from "zustand";

export const useGlobeStore = create(set => ({
   rotationSpeed: 0.45,
   zoomSpeed: 1.2,
   glowIntensity: 0.8,
   cloudOpacity: 0.65,
   atmosphereIntensity: 0.9,
   nightLightBrightness: 0.7,
   particleDensity: 0.6,
   starDensity: 0.75,

   autoRotate: true,
   focusedRegion: "Nusa Tenggara Timur",

   setGlobeConfig: (key, value) => set(state => ({ ...state, [key]: value })),
   resetGlobeConfig: () =>
      set({
         rotationSpeed: 0.45,
         zoomSpeed: 1.2,
         glowIntensity: 0.8,
         cloudOpacity: 0.65,
         atmosphereIntensity: 0.9,
         nightLightBrightness: 0.7,
         particleDensity: 0.6,
         starDensity: 0.75,
      }),
}));
