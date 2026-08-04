import React from "react";

export const GlassPanel = ({ children, className = "", interactive = false, ...props }) => {
   return (
      <div className={`glass-panel rounded-2xl p-4 border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl relative overflow-hidden ${interactive ? "glass-panel-interactive cursor-pointer hover:border-cyan-500/30" : ""} ${className}`} {...props}>
         {children}
      </div>
   );
};

export default GlassPanel;
