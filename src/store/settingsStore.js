import { create } from "zustand";

export const useSettingsStore = create(set => ({
   theme: "Cyber Blue",
   background: "Galaxy",

   glassSettings: {
      blur: 0.65,
      transparency: 0.35,
      saturation: 1.1,
      brightness: 0.9,
      glowStrength: 0.8,
      borderRadius: "14px",
   },

   setTheme: theme => set({ theme }),
   setBackground: background => set({ background }),
   setGlassConfig: (key, value) =>
      set(state => ({
         glassSettings: { ...state.glassSettings, [key]: value },
      })),
}));
