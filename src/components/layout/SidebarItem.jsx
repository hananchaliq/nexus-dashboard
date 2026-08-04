import React from "react";

export const SidebarItem = ({ icon: Icon, label, isActive, onClick }) => (
   <button onClick={onClick} className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/30" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"}`}>
      <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
      <span>{label}</span>
   </button>
);

export default SidebarItem;
