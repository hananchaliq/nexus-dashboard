import { create } from "zustand";
import { PresetLocations } from "../services/location";

export const useAppStore = create(set => ({
   activeTab: "Home",
   setActiveTab: tab => set({ activeTab: tab }),

   isGlobeClicked: false,
   setIsGlobeClicked: val => set({ isGlobeClicked: val }),

   user: {
      name: "Hanan Nurdin",
      role: "Premium User",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
   },

   // 📍 LOCATION STATE
   location: PresetLocations.WITA,

   // Mengganti seluruh objek location agar konsisten (lat, lon, regency, timeZone)
   setLocation: loc => set({ location: loc }),

   systemStats: {
      cpu: 23,
      ram: 48,
      ramText: "7.6 / 16 GB",
      storage: 62,
      storageText: "512 / 2 TB",
      netDown: "126 Mbps",
      netUp: "32 Mbps",
   },
}));
