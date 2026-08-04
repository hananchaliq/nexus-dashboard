import React from "react";
import { X } from "lucide-react";

export const Modal = ({ isOpen, onClose, title, children }) => {
   if (!isOpen) return null;
   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
         <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 relative">
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-sm font-bold text-white uppercase">{title}</h3>
               <button onClick={onClose} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
               </button>
            </div>
            {children}
         </div>
      </div>
   );
};

export default Modal;
