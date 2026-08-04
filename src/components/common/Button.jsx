import React from "react";

export const Button = ({ children, variant = "primary", size = "md", className = "", ...props }) => {
   const base = "rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 active:scale-95";
   const variants = {
      primary: "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20",
      secondary: "bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/50",
      ghost: "bg-transparent hover:bg-slate-800/40 text-slate-400 hover:text-white",
   };
   const sizes = { sm: "px-2.5 py-1 text-xs", md: "px-4 py-2 text-sm", lg: "px-6 py-3 text-base" };

   return (
      <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
         {children}
      </button>
   );
};

export default Button;
