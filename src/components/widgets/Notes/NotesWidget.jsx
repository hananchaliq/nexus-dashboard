import React, { useState, useEffect } from "react";
import { GlassPanel } from "../../common/GlassPanel";
import { Plus, Edit2, Trash2, Check, X, GripVertical, ChevronRight, CheckSquare, Square } from "lucide-react";

const STORAGE_KEY = "latansa_quick_notes";

const DEFAULT_DATA = {
   title: "Rencana Belajar",
   items: [
      { id: 1, text: "Belajar React Advanced", done: true },
      { id: 2, text: "Tailwind Animations", done: false },
      { id: 3, text: "Three.js Globe", done: false },
      { id: 4, text: "Laravel Project", done: true },
   ],
};

export const NotesWidget = () => {
   const [noteData, setNoteData] = useState(() => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
         try {
            return JSON.parse(saved);
         } catch (e) {
            console.error(e);
         }
      }
      return DEFAULT_DATA;
   });

   const [isAdding, setIsAdding] = useState(false);
   const [newItemText, setNewItemText] = useState("");
   const [isFullModalOpen, setIsFullModalOpen] = useState(false);
   const [isEditingTitle, setIsEditingTitle] = useState(false);
   const [tempTitle, setTempTitle] = useState(noteData.title);

   // Sync ke LocalStorage
   useEffect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(noteData));
   }, [noteData]);

   // Toggle Done Status
   const toggleNote = id => {
      setNoteData(prev => ({
         ...prev,
         items: prev.items.map(item => (item.id === id ? { ...item, done: !item.done } : item)),
      }));
   };

   // Add Quick Item
   const handleAddItem = e => {
      e.preventDefault();
      if (!newItemText.trim()) return;

      setNoteData(prev => ({
         ...prev,
         items: [...prev.items, { id: Date.now(), text: newItemText, done: false }],
      }));
      setNewItemText("");
      setIsAdding(false);
   };

   // Delete Item
   const handleDeleteItem = id => {
      setNoteData(prev => ({
         ...prev,
         items: prev.items.filter(item => item.id !== id),
      }));
   };

   // Save Category Title
   const handleSaveTitle = () => {
      if (tempTitle.trim()) {
         setNoteData(prev => ({ ...prev, title: tempTitle }));
      }
      setIsEditingTitle(false);
   };

   return (
      <GlassPanel className="w-full h-full rounded-[20px] p-3.5 bg-[#050914]/80 border border-[#121d33] backdrop-blur-md flex flex-col justify-between select-none relative">
         <div>
            {/* HEADER */}
            <div className="flex justify-between items-center mb-2.5">
               <h3 className="text-[10px] font-black text-white tracking-widest uppercase">CATATAN CEPAT</h3>
               {/* TOP ACTIONS BUTTONS */}
               <div className="flex items-center gap-1">
                  <button onClick={() => setIsAdding(!isAdding)} className="p-1 hover:bg-[#0c1a38] text-slate-400 hover:text-cyan-400 rounded-md transition-colors" title="Tambah Item">
                     <Plus className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setIsEditingTitle(true)} className="p-1 hover:bg-[#0c1a38] text-slate-400 hover:text-cyan-400 rounded-md transition-colors" title="Edit Judul Category">
                     <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setIsFullModalOpen(true)} className="p-1 hover:bg-[#0c1a38] text-slate-400 hover:text-cyan-400 rounded-md transition-colors" title="Lihat Semua Detail">
                     <GripVertical className="w-3.5 h-3.5" />
                  </button>
               </div>
            </div>

            {/* INNER CONTAINER (FUTURISTIC BOX) */}
            <div className="bg-[#070e1e]/60 border border-[#16274a]/60 rounded-xl p-3 backdrop-blur-sm min-h-[140px] flex flex-col justify-between">
               <div>
                  {/* CATEGORY TITLE */}
                  <div className="flex items-center justify-between mb-2.5">
                     <span className="text-[11px] font-bold text-slate-200">{noteData.title}</span>
                     <span className="text-[9px] font-mono text-cyan-400/80 bg-cyan-950/40 border border-cyan-500/20 px-1.5 py-0.5 rounded">
                        {noteData.items.filter(i => i.done).length}/{noteData.items.length}
                     </span>
                  </div>

                  {/* QUICK ADD INPUT BOX */}
                  {isAdding && (
                     <form onSubmit={handleAddItem} className="mb-2 flex gap-1">
                        <input type="text" autoFocus placeholder="Catatan baru..." value={newItemText} onChange={e => setNewItemText(e.target.value)} className="flex-1 bg-[#040814] border border-cyan-500/40 rounded-md px-2 py-0.5 text-[10px] text-white focus:outline-none placeholder-slate-500" />
                        <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-black px-2 py-0.5 rounded-md text-[9px] font-bold">
                           <Check className="w-3 h-3" />
                        </button>
                     </form>
                  )}

                  {/* CHECKLIST ITEMS */}
                  <div className="space-y-2 max-h-[115px] overflow-y-auto pr-0.5">
                     {noteData.items.length > 0 ? (
                        noteData.items.slice(0, 4).map(item => (
                           <div key={item.id} onClick={() => toggleNote(item.id)} className="flex items-center gap-2 text.xs cursor-pointer group select-none">
                              {/* CUSTOM FUTURISTIC CHECKBOX */}
                              <div className={`w-4 h-4 rounded-md flex items-center justify-center transition-all shrink-0 ${item.done ? "bg-cyan-500 text-slate-950 shadow-[0_0_8px_rgba(6,182,212,0.6)]" : "border border-slate-600 bg-slate-900/40 group-hover:border-cyan-400"}`}>{item.done && <Check className="w-3 h-3 stroke-[3]" />}</div>

                              {/* ITEM TEXT */}
                              <span className={`text-[11px] transition-colors truncate ${item.done ? "line-through text-slate-500" : "text-slate-200 group-hover:text-white"}`}>{item.text}</span>
                           </div>
                        ))
                     ) : (
                        <p className="text-[10px] text-slate-500 italic py-2 text-center">Belum ada catatan</p>
                     )}
                  </div>
               </div>
            </div>
         </div>

         {/* FOOTER ACTION */}
         <button onClick={() => setIsFullModalOpen(true)} className="text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center justify-center gap-1 w-full pt-2 transition-colors group">
            <span>Lihat Semua Catatan</span>
            <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
         </button>

         {/* MODAL FULL MANAGER */}
         {isFullModalOpen && (
            <div className="absolute inset-0 bg-[#030712]/95 backdrop-blur-md z-50 p-3 flex flex-col justify-between rounded-[20px] animate-in fade-in duration-150">
               <div>
                  <div className="flex items-center justify-between mb-2 border-b border-[#162a52] pb-1.5">
                     <h4 className="text-[11px] font-bold text-white">Kelola Catatan</h4>
                     <button onClick={() => setIsFullModalOpen(false)} className="text-slate-400 hover:text-white">
                        <X className="w-3.5 h-3.5" />
                     </button>
                  </div>

                  {/* ALL ITEMS LIST */}
                  <div className="max-h-[140px] overflow-y-auto space-y-1.5 pr-0.5 mb-2">
                     {noteData.items.map(item => (
                        <div key={item.id} className="flex items-center justify-between bg-[#081329] border border-[#162a52] rounded-lg p-1.5 text-[10px]">
                           <div onClick={() => toggleNote(item.id)} className="flex items-center gap-2 cursor-pointer truncate mr-1">
                              {item.done ? <CheckSquare className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> : <Square className="w-3.5 h-3.5 text-slate-500 shrink-0" />}
                              <span className={item.done ? "line-through text-slate-500 truncate" : "text-slate-200 truncate"}>{item.text}</span>
                           </div>
                           <button onClick={() => handleDeleteItem(item.id)} className="text-slate-500 hover:text-rose-400 p-0.5 shrink-0">
                              <Trash2 className="w-3 h-3" />
                           </button>
                        </div>
                     ))}
                  </div>
               </div>

               {/* FORM TAMBAH ITEM DI MODAL */}
               <form onSubmit={handleAddItem} className="flex gap-1.5 border-t border-[#162a52] pt-2">
                  <input type="text" placeholder="Tambah catatan..." value={newItemText} onChange={e => setNewItemText(e.target.value)} className="flex-1 bg-[#040914] border border-[#122347] rounded-md px-2 py-1 text-[10px] text-white focus:outline-none focus:border-cyan-400" />
                  <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-black px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center gap-1">
                     <Plus className="w-3 h-3" />
                     <span>Tambah</span>
                  </button>
               </form>
            </div>
         )}

         {/* MODAL EDIT TITLE CATEGORY */}
         {isEditingTitle && (
            <div className="absolute inset-0 bg-[#030712]/95 backdrop-blur-md z-50 p-4 flex flex-col justify-center rounded-[20px] animate-in fade-in duration-150">
               <h4 className="text-xs font-bold text-white mb-2">Edit Nama Kategori</h4>
               <input type="text" value={tempTitle} onChange={e => setTempTitle(e.target.value)} className="bg-[#040914] border border-cyan-500/50 rounded-md px-2 py-1.5 text-xs text-white focus:outline-none mb-3" />
               <div className="flex justify-end gap-2">
                  <button onClick={() => setIsEditingTitle(false)} className="px-2.5 py-1 text-[10px] text-slate-400 hover:text-white">
                     Batal
                  </button>
                  <button onClick={handleSaveTitle} className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-md text-[10px]">
                     Simpan
                  </button>
               </div>
            </div>
         )}
      </GlassPanel>
   );
};

export default NotesWidget;
