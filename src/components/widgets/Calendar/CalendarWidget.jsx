import React, { useState, useEffect } from "react";
import { GlassPanel } from "../../common/GlassPanel";
import { ChevronLeft, ChevronRight, Plus, Trash2, Edit2, X, Calendar as CalendarIcon } from "lucide-react";

const STORAGE_KEY = "latansa_calendar_agendas";

const DEFAULT_AGENDAS = {
   "2026-08-02": [
      { id: 1, time: "21:00", text: "Belajar Project" },
      { id: 2, time: "23:00", text: "Review Code" },
   ],
};

export const CalendarWidget = () => {
   const [currentDate, setCurrentDate] = useState(new Date());
   const [selectedDate, setSelectedDate] = useState(new Date());

   // State Hari Libur dari API
   const [holidays, setHolidays] = useState({});

   // State Agendas
   const [agendas, setAgendas] = useState(() => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
         try {
            return JSON.parse(saved);
         } catch (e) {
            console.error(e);
         }
      }
      return DEFAULT_AGENDAS;
   });

   // Modal State
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [timeInput, setTimeInput] = useState("08:00");
   const [textInput, setTextInput] = useState("");
   const [editingAgendaId, setEditingAgendaId] = useState(null);

   // Fetch API Hari Libur Nasional Indonesia
   useEffect(() => {
      const year = currentDate.getFullYear();
      fetch(`https://dayoffapi.vercel.app/api?year=${year}`)
         .then(res => res.json())
         .then(data => {
            if (Array.isArray(data)) {
               const holidayMap = {};
               data.forEach(item => {
                  if (item.is_holiday) {
                     holidayMap[item.holiday_date] = item.holiday_name;
                  }
               });
               setHolidays(holidayMap);
            }
         })
         .catch(err => console.error("Gagal load hari libur:", err));
   }, [currentDate.getFullYear()]);

   useEffect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(agendas));
   }, [agendas]);

   // Helper Format Key Tanggal (YYYY-MM-DD)
   const formatDateKey = date => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
   };

   const currentKey = formatDateKey(selectedDate);
   const currentAgendas = agendas[currentKey] || [];

   // Calendar Calculations
   const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
   const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

   const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

   const prevMonth = () => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
   };

   const nextMonth = () => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
   };

   const handleSaveAgenda = e => {
      e.preventDefault();
      if (!textInput.trim()) return;

      setAgendas(prev => {
         const list = prev[currentKey] || [];
         let updatedList;

         if (editingAgendaId) {
            updatedList = list.map(item => (item.id === editingAgendaId ? { ...item, time: timeInput, text: textInput } : item));
         } else {
            updatedList = [...list, { id: Date.now(), time: timeInput, text: textInput }];
         }

         updatedList.sort((a, b) => a.time.localeCompare(b.time));
         return { ...prev, [currentKey]: updatedList };
      });

      setTextInput("");
      setTimeInput("08:00");
      setEditingAgendaId(null);
   };

   const handleEditClick = item => {
      setEditingAgendaId(item.id);
      setTimeInput(item.time);
      setTextInput(item.text);
   };

   const handleDeleteAgenda = id => {
      setAgendas(prev => {
         const list = prev[currentKey] || [];
         const updatedList = list.filter(item => item.id !== id);
         return { ...prev, [currentKey]: updatedList };
      });
   };

   return (
      <GlassPanel className="w-full h-full rounded-[20px] p-3 bg-[#050914]/80 border border-[#121d33] backdrop-blur-md select-none relative flex flex-col justify-between">
         <div>
            {/* HEADER */}
            <div className="flex items-center justify-between mb-2">
               <h3 className="text-[10px] font-black text-white tracking-widest uppercase">KALENDER</h3>
               <button className="text-cyan-400 hover:text-cyan-300 transition-colors">
                  <CalendarIcon className="w-3.5 h-3.5" />
               </button>
            </div>

            {/* MONTH NAVIGATOR */}
            <div className="flex items-center justify-between mb-2 px-0.5">
               <span className="text-[11px] font-bold text-slate-200">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
               </span>
               <div className="flex items-center gap-0.5">
                  <button onClick={prevMonth} className="p-0.5 text-slate-400 hover:text-white transition-colors">
                     <ChevronLeft className="w-3 h-3" />
                  </button>
                  <button onClick={nextMonth} className="p-0.5 text-slate-400 hover:text-white transition-colors">
                     <ChevronRight className="w-3 h-3" />
                  </button>
               </div>
            </div>

            {/* DAY NAMES (M S S R K J S) */}
            <div className="grid grid-cols-7 text-center text-[10px] font-semibold text-slate-400 mb-1">
               <span className="text-rose-500">M</span>
               <span>S</span>
               <span>S</span>
               <span>R</span>
               <span>K</span>
               <span>J</span>
               <span>S</span>
            </div>

            {/* DATES GRID */}
            <div className="grid grid-cols-7 gap-y-0.5 gap-x-0.5 text-center text-[10px] mb-2">
               {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`empty-${i}`} />
               ))}

               {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                  const dateKey = formatDateKey(dateObj);

                  const isSunday = dateObj.getDay() === 0;
                  const isNationalHoliday = Boolean(holidays[dateKey]);
                  const isRedDay = isSunday || isNationalHoliday;

                  const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === currentDate.getMonth() && selectedDate.getFullYear() === currentDate.getFullYear();

                  const hasAgenda = agendas[dateKey] && agendas[dateKey].length > 0;

                  return (
                     <button key={day} onClick={() => setSelectedDate(dateObj)} title={holidays[dateKey] ? `Hari Libur: ${holidays[dateKey]}` : undefined} className={`h-5 w-5 mx-auto flex items-center justify-center rounded-full transition-all relative ${isSelected ? "border-2 border-fuchsia-500 text-white font-bold shadow-[0_0_10px_rgba(217,70,239,0.6)] bg-fuchsia-500/20" : isRedDay ? "text-rose-500 font-semibold hover:bg-rose-500/10" : "text-slate-300 hover:bg-slate-800/50"}`}>
                        {day}
                        {hasAgenda && !isSelected && <span className="absolute -bottom-0.5 w-0.5 h-0.5 bg-cyan-400 rounded-full" />}
                     </button>
                  );
               })}
            </div>
         </div>

         {/* SEPARATOR & AGENDA HARI INI */}
         <div>
            <div className="w-full h-[1px] bg-[#122347]/60 mb-2" />

            <div className="flex items-center justify-between mb-1.5">
               <h4 className="text-[10px] font-medium text-slate-400">Agenda Hari Ini</h4>
               <button onClick={() => setIsModalOpen(true)} className="text-[9px] text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                  + Tambah / Selengkapnya
               </button>
            </div>

            {/* Agendas List (Limit 2) */}
            <div className="space-y-1 min-h-[36px]">
               {currentAgendas.length > 0 ? (
                  currentAgendas.slice(0, 2).map(agenda => (
                     <div key={agenda.id} className="flex items-center gap-2 text-[10px]">
                        <span className="text-slate-400 font-mono text-[9px] w-8">{agenda.time}</span>
                        <span className="w-1 h-1 rounded-full border border-slate-500 shrink-0" />
                        <span className="text-slate-200 truncate">{agenda.text}</span>
                     </div>
                  ))
               ) : (
                  <p className="text-[9px] text-slate-500 italic py-0.5">Tidak ada kegiatan</p>
               )}
            </div>
         </div>

         {/* MODAL EDIT / TAMBAH AGENDA LENGKAP */}
         {isModalOpen && (
            <div className="absolute inset-0 bg-[#030712]/95 backdrop-blur-md z-50 p-3 flex flex-col justify-between rounded-[20px] animate-in fade-in duration-150">
               <div>
                  <div className="flex items-center justify-between mb-2 border-b border-[#162a52] pb-1.5">
                     <div>
                        <h4 className="text-[11px] font-bold text-white">Kelola Agenda</h4>
                        <p className="text-[9px] text-cyan-400 font-mono">
                           {selectedDate.getDate()} {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                        </p>
                     </div>
                     <button
                        onClick={() => {
                           setIsModalOpen(false);
                           setEditingAgendaId(null);
                           setTextInput("");
                        }}
                        className="text-slate-400 hover:text-white">
                        <X className="w-3.5 h-3.5" />
                     </button>
                  </div>

                  {/* LIST ALL AGENDAS */}
                  <div className="max-h-[105px] overflow-y-auto space-y-1 pr-0.5 mb-2">
                     {currentAgendas.length > 0 ? (
                        currentAgendas.map(item => (
                           <div key={item.id} className="flex items-center justify-between bg-[#081329] border border-[#162a52] rounded-md p-1.5 text-[10px]">
                              <div className="flex items-center gap-1.5 overflow-hidden mr-1">
                                 <span className="text-cyan-400 font-mono text-[9px] font-semibold shrink-0">{item.time}</span>
                                 <span className="text-slate-200 truncate">{item.text}</span>
                              </div>
                              <div className="flex items-center gap-0.5 shrink-0">
                                 <button onClick={() => handleEditClick(item)} className="p-0.5 text-slate-400 hover:text-cyan-400">
                                    <Edit2 className="w-3 h-3" />
                                 </button>
                                 <button onClick={() => handleDeleteAgenda(item.id)} className="p-0.5 text-slate-400 hover:text-rose-400">
                                    <Trash2 className="w-3 h-3" />
                                 </button>
                              </div>
                           </div>
                        ))
                     ) : (
                        <p className="text-[9px] text-slate-500 text-center py-2">Belum ada agenda tersimpan</p>
                     )}
                  </div>
               </div>

               {/* FORM ADD / EDIT */}
               <form onSubmit={handleSaveAgenda} className="space-y-1.5 border-t border-[#162a52] pt-1.5">
                  <div className="flex gap-1.5">
                     <input type="time" value={timeInput} onChange={e => setTimeInput(e.target.value)} className="bg-[#040914] border border-[#122347] rounded-md px-1.5 py-0.5 text-[10px] text-white focus:outline-none focus:border-cyan-400 w-20 font-mono" />
                     <input type="text" placeholder="Nama kegiatan..." value={textInput} onChange={e => setTextInput(e.target.value)} className="flex-1 bg-[#040914] border border-[#122347] rounded-md px-2 py-0.5 text-[10px] text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400" />
                  </div>
                  <div className="flex justify-end gap-1.5">
                     {editingAgendaId && (
                        <button
                           type="button"
                           onClick={() => {
                              setEditingAgendaId(null);
                              setTextInput("");
                           }}
                           className="px-2 py-0.5 text-[9px] text-slate-400 hover:text-white">
                           Batal Edit
                        </button>
                     )}
                     <button type="submit" className="px-2.5 py-0.5 text-[9px] bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-md transition-colors flex items-center gap-1">
                        <Plus className="w-2.5 h-2.5" />
                        <span>{editingAgendaId ? "Simpan" : "Tambah"}</span>
                     </button>
                  </div>
               </form>
            </div>
         )}
      </GlassPanel>
   );
};

export default CalendarWidget;
