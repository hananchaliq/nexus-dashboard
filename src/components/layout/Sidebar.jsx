import React from "react";
import { Home, Globe, CircleDollarSign, MoonStar, CloudSun, Newspaper, Calendar, StickyNote, Link, Settings, Sparkles, SlidersHorizontal } from "lucide-react";
import { useAppStore } from "../../store/appStore";

const menuItems = [
   { id: "Home", label: "Home", icon: Home },
   { id: "Globe", label: "Globe", icon: Globe },
   { id: "Finance", label: "Finance", icon: CircleDollarSign },
   { id: "Prayer", label: "Prayer", icon: MoonStar },
   { id: "Weather", label: "Weather", icon: CloudSun },
   { id: "News", label: "News", icon: Newspaper },
   { id: "Calendar", label: "Calendar", icon: Calendar },
   { id: "Notes", label: "Notes", icon: StickyNote },
   { id: "QuickLinks", label: "Quick Links", icon: Link },
   { id: "Settings", label: "Settings", icon: Settings },
];

export const Sidebar = () => {
   const { activeTab, setActiveTab } = useAppStore();

   return (
      // w-52 diubah jadi w-20 agar jadi mini sidebar
      <aside className="w-20 h-screen glass-panel border-r flex flex-col justify-between p-4 z-20">
         <div>
            {/* Brand Header - Teks dihilangkan, sisa logo saja di tengah */}
            <div className="flex items-center justify-center py-2 mb-8">
               <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <Sparkles className="w-5 h-5 text-white" />
               </div>
            </div>

            {/* Menu Navigation - Teks dihilangkan, icon dicenter */}
            <nav className="space-y-2">
               {menuItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                     <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        title={item.label} // Menambah tooltip bawaan saat di-hover
                        className={`w-full flex items-center justify-center p-3 rounded-xl transition-all duration-200 ${isActive ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/30 shadow-lg shadow-cyan-500/10" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"}`}>
                        <Icon className={`w-5 h-5 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                     </button>
                  );
               })}
            </nav>
         </div>

         {/* Bottom Mode Switcher - Diubah jadi flex-col supaya berjejer rapi ke bawah */}
         <div className="pt-4 border-t border-slate-800/80 flex flex-col items-center gap-4 text-slate-400">
            <button className="p-2 hover:text-cyan-400 rounded-lg transition-colors" title="Dark Mode">
               <MoonStar className="w-5 h-5" />
            </button>
            <button className="p-2 hover:text-cyan-400 rounded-lg transition-colors" title="Effects">
               <Sparkles className="w-5 h-5" />
            </button>
            <button className="p-2 hover:text-cyan-400 rounded-lg transition-colors" title="Preferences">
               <SlidersHorizontal className="w-5 h-5" />
            </button>
         </div>
      </aside>
   );
};
