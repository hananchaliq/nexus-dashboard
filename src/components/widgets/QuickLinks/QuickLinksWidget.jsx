import React, { useState, useEffect, useRef } from "react";
import { GlassPanel } from "../../common/GlassPanel";
import { Plus, ChevronLeft, ChevronRight, X, FolderPlus, Trash2, Edit2, AlertTriangle } from "lucide-react";

const STORAGE_KEY = "latansa_quick_links_data";

const BRAND_MAP = {
   "github.com": "https://cdn.simpleicons.org/github/ffffff",
   "vscode.dev": "https://cdn.simpleicons.org/visualstudiocode/007ACC",
   "laravel.com": "https://cdn.simpleicons.org/laravel/FF2D20",
   "stackoverflow.com": "https://cdn.simpleicons.org/stackoverflow/F48024",
   "chatgpt.com": "https://cdn.simpleicons.org/openai/ffffff",
   "openai.com": "https://cdn.simpleicons.org/openai/ffffff",
   "claude.ai": "https://cdn.simpleicons.org/anthropic/D97757",
   "blackbox.ai": "https://cdn.simpleicons.org/square/ffffff",
   "gemini.google.com": "https://cdn.simpleicons.org/google-gemini/8E75FF",
   "classroom.google.com": "https://cdn.simpleicons.org/googleclassroom/0F9D58",
   "drive.google.com": "https://cdn.simpleicons.org/googledrive/4285F4",
   "youtube.com": "https://cdn.simpleicons.org/youtube/FF0000",
   "spotify.com": "https://cdn.simpleicons.org/spotify/1ED760",
   "netflix.com": "https://cdn.simpleicons.org/netflix/E50914",
   "whatsapp.com": "https://cdn.simpleicons.org/whatsapp/25D366",
   "web.whatsapp.com": "https://cdn.simpleicons.org/whatsapp/25D366",
   "instagram.com": "https://cdn.simpleicons.org/instagram/E4405F",
   "facebook.com": "https://cdn.simpleicons.org/facebook/1877F2",
   "twitter.com": "https://cdn.simpleicons.org/x/ffffff",
   "x.com": "https://cdn.simpleicons.org/x/ffffff",
   "discord.com": "https://cdn.simpleicons.org/discord/5865F2",
   "telegram.org": "https://cdn.simpleicons.org/telegram/26A5E4",
   "tiktok.com": "https://cdn.simpleicons.org/tiktok/ffffff",
};

const getSmartIconUrl = url => {
   try {
      const cleanUrl = url.startsWith("http") ? url : `https://${url}`;
      const hostname = new URL(cleanUrl).hostname.replace("www.", "").toLowerCase();

      if (BRAND_MAP[hostname]) return BRAND_MAP[hostname];

      const parts = hostname.split(".");
      let brandSlug = parts[0];
      if (parts.length > 2) {
         brandSlug = parts[parts.length - 2];
      }

      const rootDomain = parts.slice(-2).join(".");
      if (BRAND_MAP[rootDomain]) return BRAND_MAP[rootDomain];

      return `https://cdn.simpleicons.org/${brandSlug}`;
   } catch {
      return null;
   }
};

const DEFAULT_CATEGORIES = [
   {
      id: 1,
      name: "Programming",
      links: [
         { id: 101, title: "GitHub", url: "https://github.com" },
         { id: 102, title: "VS Code", url: "https://vscode.dev" },
         { id: 103, title: "Laravel", url: "https://laravel.com" },
      ],
   },
   {
      id: 2,
      name: "AI Tools",
      links: [
         { id: 201, title: "ChatGPT", url: "https://chatgpt.com" },
         { id: 202, title: "Claude", url: "https://claude.ai" },
         { id: 203, title: "Blackbox", url: "https://blackbox.ai" },
         { id: 204, title: "Gemini", url: "https://gemini.google.com" },
      ],
   },
   {
      id: 3,
      name: "School",
      links: [
         { id: 301, title: "Google Classroom", url: "https://classroom.google.com" },
         { id: 302, title: "Google Drive", url: "https://drive.google.com" },
         { id: 303, title: "Student Portal", url: "https://sch.id" },
      ],
   },
   {
      id: 4,
      name: "Entertainment",
      links: [
         { id: 401, title: "YouTube", url: "https://youtube.com" },
         { id: 402, title: "Spotify", url: "https://spotify.com" },
         { id: 403, title: "Netflix", url: "https://netflix.com" },
      ],
   },
];

export const QuickLinksWidget = () => {
   const [categories, setCategories] = useState(() => {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
         try {
            return JSON.parse(savedData);
         } catch (e) {
            console.error("Gagal load data", e);
         }
      }
      return DEFAULT_CATEGORIES;
   });

   useEffect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
   }, [categories]);

   const [currentPage, setCurrentPage] = useState(0);
   const ITEMS_PER_PAGE = 4;

   // Context Menu State
   const [activeContextMenu, setActiveContextMenu] = useState(null); // { folderId, linkId }
   const menuRef = useRef(null);

   // Modal States
   const [isAddFolderOpen, setIsAddFolderOpen] = useState(false);
   const [isAddLinkOpen, setIsAddLinkOpen] = useState(false);
   const [isEditLinkOpen, setIsEditLinkOpen] = useState(false);
   const [confirmDeleteModal, setConfirmDeleteModal] = useState({ open: false, type: null, folderId: null, linkId: null, name: "" });

   const [selectedFolderId, setSelectedFolderId] = useState(null);

   // Form Inputs
   const [newFolderName, setNewFolderName] = useState("");
   const [linkFormTitle, setLinkFormTitle] = useState("");
   const [linkFormUrl, setLinkFormUrl] = useState("");
   const [editingLinkId, setEditingLinkId] = useState(null);

   const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE) || 1;
   const currentCategories = categories.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

   // Tutup Context Menu saat klik sembarang tempat
   useEffect(() => {
      const handleClickOutside = e => {
         if (menuRef.current && !menuRef.current.contains(e.target)) {
            setActiveContextMenu(null);
         }
      };
      window.addEventListener("mousedown", handleClickOutside);
      return () => window.removeEventListener("mousedown", handleClickOutside);
   }, []);

   const handleContextMenu = (e, folderId, linkId) => {
      e.preventDefault();
      e.stopPropagation();
      setActiveContextMenu({ folderId, linkId });
   };

   const handleAddFolder = e => {
      e.preventDefault();
      if (!newFolderName.trim()) return;

      const newFolder = { id: Date.now(), name: newFolderName, links: [] };
      setCategories(prev => [...prev, newFolder]);
      setNewFolderName("");
      setIsAddFolderOpen(false);

      const newTotalPages = Math.ceil((categories.length + 1) / ITEMS_PER_PAGE);
      setCurrentPage(newTotalPages - 1);
   };

   const handleAddLink = e => {
      e.preventDefault();
      if (!linkFormUrl.trim() || !selectedFolderId) return;

      let formattedUrl = linkFormUrl;
      if (!/^https?:\/\//i.test(formattedUrl)) {
         formattedUrl = `https://${formattedUrl}`;
      }

      setCategories(prev =>
         prev.map(cat => {
            if (cat.id === selectedFolderId) {
               return {
                  ...cat,
                  links: [...cat.links, { id: Date.now(), title: linkFormTitle || formattedUrl, url: formattedUrl }],
               };
            }
            return cat;
         })
      );

      setLinkFormTitle("");
      setLinkFormUrl("");
      setIsAddLinkOpen(false);
   };

   const handleOpenEditModal = (folderId, link) => {
      setSelectedFolderId(folderId);
      setEditingLinkId(link.id);
      setLinkFormTitle(link.title);
      setLinkFormUrl(link.url);
      setIsEditLinkOpen(true);
      setActiveContextMenu(null);
   };

   const handleSaveEditLink = e => {
      e.preventDefault();
      if (!linkFormUrl.trim()) return;

      let formattedUrl = linkFormUrl;
      if (!/^https?:\/\//i.test(formattedUrl)) {
         formattedUrl = `https://${formattedUrl}`;
      }

      setCategories(prev =>
         prev.map(cat => {
            if (cat.id === selectedFolderId) {
               return {
                  ...cat,
                  links: cat.links.map(l => (l.id === editingLinkId ? { ...l, title: linkFormTitle || formattedUrl, url: formattedUrl } : l)),
               };
            }
            return cat;
         })
      );

      setIsEditLinkOpen(false);
      setLinkFormTitle("");
      setLinkFormUrl("");
   };

   const triggerDeleteFolderConfirmation = folder => {
      setConfirmDeleteModal({
         open: true,
         type: "folder",
         folderId: folder.id,
         linkId: null,
         name: folder.name,
      });
   };

   const triggerDeleteLinkConfirmation = (folderId, link) => {
      setConfirmDeleteModal({
         open: true,
         type: "link",
         folderId,
         linkId: link.id,
         name: link.title || link.url,
      });
      setActiveContextMenu(null);
   };

   const handleConfirmDelete = () => {
      const { type, folderId, linkId } = confirmDeleteModal;

      if (type === "folder") {
         setCategories(prev => prev.filter(c => c.id !== folderId));
         if (currentPage >= Math.ceil((categories.length - 1) / ITEMS_PER_PAGE) && currentPage > 0) {
            setCurrentPage(currentPage - 1);
         }
      } else if (type === "link") {
         setCategories(prev =>
            prev.map(cat => {
               if (cat.id === folderId) {
                  return { ...cat, links: cat.links.filter(l => l.id !== linkId) };
               }
               return cat;
            })
         );
      }

      setConfirmDeleteModal({ open: false, type: null, folderId: null, linkId: null, name: "" });
   };

   return (
      <GlassPanel className="w-full h-full rounded-[20px] p-4 bg-[#050914]/80 border border-[#121d33] backdrop-blur-md flex flex-col justify-between flex-1 relative select-none">
         <div className="flex flex-col justify-between h-full flex-1">
            <div>
               {/* HEADER */}
               <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                     <h3 className="text-[11px] font-extrabold text-white tracking-wider uppercase font-sans">QUICK LINKS</h3>
                     {totalPages > 1 && (
                        <span className="text-[9px] text-cyan-400 font-mono px-1.5 py-0.2 bg-[#09152b] rounded-md border border-[#13264a]">
                           {currentPage + 1}/{totalPages}
                        </span>
                     )}
                  </div>

                  <div className="flex items-center gap-1">
                     {totalPages > 1 && (
                        <div className="flex items-center gap-0.5 mr-1">
                           <button disabled={currentPage === 0} onClick={() => setCurrentPage(p => p - 1)} className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30">
                              <ChevronLeft className="w-3.5 h-3.5" />
                           </button>
                           <button disabled={currentPage >= totalPages - 1} onClick={() => setCurrentPage(p => p + 1)} className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30">
                              <ChevronRight className="w-3.5 h-3.5" />
                           </button>
                        </div>
                     )}

                     <button onClick={() => setIsAddFolderOpen(true)} className="w-6 h-6 rounded-lg bg-[#0c1830] hover:bg-[#122347] border border-[#182c54] flex items-center justify-center text-slate-300 hover:text-white transition-all shadow-sm" title="Tambah Folder Baru">
                        <Plus className="w-3.5 h-3.5" />
                     </button>
                  </div>
               </div>

               {/* GRID FOLDER */}
               <div className="grid grid-cols-2 gap-2.5 content-start items-start">
                  {currentCategories.map(cat => (
                     <div key={cat.id} className="bg-[#070e1e]/90 p-2.5 rounded-xl border border-[#111e38] flex flex-col gap-2 group hover:border-[#1d335e] transition-all h-fit">
                        {/* Folder Header */}
                        <div className="flex justify-between items-center">
                           <p className="text-[11px] text-slate-200 font-semibold tracking-tight truncate pr-1">{cat.name}</p>
                           <div className="flex items-center gap-1">
                              <button
                                 onClick={() => {
                                    setSelectedFolderId(cat.id);
                                    setLinkFormTitle("");
                                    setLinkFormUrl("");
                                    setIsAddLinkOpen(true);
                                 }}
                                 className="text-slate-400 hover:text-cyan-400 p-0.5 transition-colors"
                                 title="Tambah Link">
                                 <Plus className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => triggerDeleteFolderConfirmation(cat)} className="text-slate-500 hover:text-rose-400 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity" title="Hapus Folder">
                                 <Trash2 className="w-3 h-3" />
                              </button>
                           </div>
                        </div>

                        {/* Link Icons */}
                        <div className="flex items-center gap-2 flex-wrap">
                           {cat.links.map(link => {
                              const isMenuOpen = activeContextMenu?.folderId === cat.id && activeContextMenu?.linkId === link.id;

                              return (
                                 <div key={link.id} className="relative flex items-center justify-center">
                                    <a href={link.url} target="_blank" rel="noopener noreferrer" onContextMenu={e => handleContextMenu(e, cat.id, link.id)} title={`${link.title || link.url} (Klik Kanan untuk Edit / Hapus)`} className="w-8 h-8 rounded-xl bg-[#0b162b]/80 hover:bg-[#132547] border border-[#1a2d52] hover:border-cyan-400/50 flex items-center justify-center hover:scale-110 transition-all shadow-md p-1.5 overflow-hidden">
                                       <img
                                          src={getSmartIconUrl(link.url)}
                                          alt={link.title}
                                          className="w-full h-full object-contain filter drop-shadow"
                                          onError={e => {
                                             try {
                                                const domain = new URL(link.url.startsWith("http") ? link.url : `https://${link.url}`).hostname;
                                                e.target.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
                                             } catch {
                                                e.target.style.display = "none";
                                             }

                                             e.target.onerror = () => {
                                                e.target.style.display = "none";
                                                if (e.target.nextSibling) {
                                                   e.target.nextSibling.style.display = "flex";
                                                }
                                             };
                                          }}
                                       />
                                       <span className="hidden w-full h-full text-[12px] font-extrabold text-cyan-400 font-sans uppercase items-center justify-center">{link.title ? link.title[0] : "L"}</span>
                                    </a>

                                    {/* CONTEXT MENU KLIK KANAN */}
                                    {isMenuOpen && (
                                       <div ref={menuRef} className="absolute bottom-9 left-1/2 -translate-x-1/2 z-50 bg-[#081329] border border-[#182c54] rounded-xl shadow-2xl p-1 min-w-[120px] flex flex-col gap-0.5 backdrop-blur-md animate-in fade-in zoom-in-95 duration-100">
                                          {/* OPSI 1: EDIT LINK */}
                                          <button onClick={() => handleOpenEditModal(cat.id, link)} className="flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] text-slate-200 hover:text-cyan-400 hover:bg-[#0f2142] rounded-lg transition-colors w-full text-left font-medium whitespace-nowrap">
                                             <Edit2 className="w-3 h-3 text-cyan-400 shrink-0" />
                                             <span>Edit Link</span>
                                          </button>

                                          {/* OPSI 2: HAPUS LINK */}
                                          <button onClick={() => triggerDeleteLinkConfirmation(cat.id, link)} className="flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 rounded-lg transition-colors w-full text-left font-medium whitespace-nowrap">
                                             <Trash2 className="w-3 h-3 text-rose-400 shrink-0" />
                                             <span>Hapus Link</span>
                                          </button>
                                       </div>
                                    )}
                                 </div>
                              );
                           })}
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* MODAL KONFIRMASI HAPUS */}
         {confirmDeleteModal.open && (
            <div className="absolute inset-0 bg-[#030712]/90 backdrop-blur-md z-50 p-4 flex flex-col justify-center items-center">
               <div className="w-full bg-[#081226] border border-[#162a52] rounded-xl p-4 shadow-2xl flex flex-col items-center text-center">
                  <div className="w-9 h-9 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mb-2">
                     <AlertTriangle className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1">Konfirmasi Hapus</h4>
                  <p className="text-[10px] text-slate-400 mb-4 px-2">
                     Apakah kamu yakin ingin menghapus {confirmDeleteModal.type === "folder" ? "folder" : "link"} <span className="text-white font-semibold">"{confirmDeleteModal.name}"</span>?
                  </p>
                  <div className="flex gap-2 w-full">
                     <button onClick={() => setConfirmDeleteModal({ open: false, type: null, folderId: null, linkId: null, name: "" })} className="flex-1 py-1.5 rounded-lg border border-[#162a52] text-[10px] font-medium text-slate-300 hover:bg-[#0f2142]">
                        Batal
                     </button>
                     <button onClick={handleConfirmDelete} className="flex-1 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-[10px] font-bold text-white transition-colors">
                        Hapus
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* MODAL TAMBAH FOLDER */}
         {isAddFolderOpen && (
            <div className="absolute inset-0 bg-[#030712]/90 backdrop-blur-md z-40 p-4 flex flex-col justify-center items-center">
               <div className="w-full bg-[#081226] border border-[#162a52] rounded-xl p-3.5 shadow-2xl">
                  <div className="flex justify-between items-center mb-2">
                     <h4 className="text-xs font-bold text-white">Folder Baru</h4>
                     <button onClick={() => setIsAddFolderOpen(false)} className="text-slate-400 hover:text-white">
                        <X className="w-3.5 h-3.5" />
                     </button>
                  </div>
                  <form onSubmit={handleAddFolder}>
                     <input type="text" placeholder="Nama Folder (misal: Sosmed)" value={newFolderName} onChange={e => setNewFolderName(e.target.value)} className="w-full bg-[#040914] border border-[#122347] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 mb-3" autoFocus />
                     <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setIsAddFolderOpen(false)} className="px-3 py-1 text-[10px] text-slate-400 hover:text-white">
                           Batal
                        </button>
                        <button type="submit" className="px-3 py-1 text-[10px] bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-lg transition-colors">
                           Simpan
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}

         {/* MODAL TAMBAH LINK */}
         {isAddLinkOpen && (
            <div className="absolute inset-0 bg-[#030712]/90 backdrop-blur-md z-40 p-4 flex flex-col justify-center items-center">
               <div className="w-full bg-[#081226] border border-[#162a52] rounded-xl p-3.5 shadow-2xl">
                  <div className="flex justify-between items-center mb-2">
                     <h4 className="text-xs font-bold text-white">Tambah Link Shortcut</h4>
                     <button onClick={() => setIsAddLinkOpen(false)} className="text-slate-400 hover:text-white">
                        <X className="w-3.5 h-3.5" />
                     </button>
                  </div>
                  <form onSubmit={handleAddLink} className="space-y-2">
                     <input type="text" placeholder="Judul (misal: WhatsApp)" value={linkFormTitle} onChange={e => setLinkFormTitle(e.target.value)} className="w-full bg-[#040914] border border-[#122347] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400" />
                     <input type="text" placeholder="URL (misal: web.whatsapp.com)" value={linkFormUrl} onChange={e => setLinkFormUrl(e.target.value)} className="w-full bg-[#040914] border border-[#122347] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400" autoFocus />
                     <div className="flex justify-end gap-2 pt-1">
                        <button type="button" onClick={() => setIsAddLinkOpen(false)} className="px-3 py-1 text-[10px] text-slate-400 hover:text-white">
                           Batal
                        </button>
                        <button type="submit" className="px-3 py-1 text-[10px] bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-lg transition-colors">
                           Tambah Link
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}

         {/* MODAL EDIT LINK */}
         {isEditLinkOpen && (
            <div className="absolute inset-0 bg-[#030712]/90 backdrop-blur-md z-40 p-4 flex flex-col justify-center items-center">
               <div className="w-full bg-[#081226] border border-[#162a52] rounded-xl p-3.5 shadow-2xl">
                  <div className="flex justify-between items-center mb-2">
                     <h4 className="text-xs font-bold text-white">Edit Link Shortcut</h4>
                     <button onClick={() => setIsEditLinkOpen(false)} className="text-slate-400 hover:text-white">
                        <X className="w-3.5 h-3.5" />
                     </button>
                  </div>
                  <form onSubmit={handleSaveEditLink} className="space-y-2">
                     <input type="text" placeholder="Judul" value={linkFormTitle} onChange={e => setLinkFormTitle(e.target.value)} className="w-full bg-[#040914] border border-[#122347] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400" />
                     <input type="text" placeholder="URL" value={linkFormUrl} onChange={e => setLinkFormUrl(e.target.value)} className="w-full bg-[#040914] border border-[#122347] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400" autoFocus />
                     <div className="flex justify-end gap-2 pt-1">
                        <button type="button" onClick={() => setIsEditLinkOpen(false)} className="px-3 py-1 text-[10px] text-slate-400 hover:text-white">
                           Batal
                        </button>
                        <button type="submit" className="px-3 py-1 text-[10px] bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-lg transition-colors">
                           Simpan Perubahan
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}
      </GlassPanel>
   );
};

export default QuickLinksWidget;
