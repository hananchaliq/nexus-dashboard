import React from "react";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { Home } from "./pages/Home";
import { Settings } from "./pages/Settings";
import { useAppStore } from "./store/appStore";

export default function App() {
   const { activeTab } = useAppStore();

   return <DashboardLayout>{activeTab === "Settings" ? <Settings /> : <Home />}</DashboardLayout>;
}
