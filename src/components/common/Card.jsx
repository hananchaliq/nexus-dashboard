import React from "react";

export const Card = ({ children, className = "" }) => <div className={`p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 ${className}`}>{children}</div>;

export default Card;
