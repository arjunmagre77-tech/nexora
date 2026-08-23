"use client";

import React, { useState } from "react";
import { useWorkspace, ContentItem, ContentStatus, Platform, Priority, ContentCategory } from "@/context/WorkspaceContext";
import { 
  Plus, Calendar, MoreHorizontal, ArrowLeft, ArrowRight, Star,
  Folder, Edit3, Trash2, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const KanbanView: React.FC = () => {
  const { contentItems, updateContentItem, deleteContentItem, addContentItem } = useWorkspace();
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  
  // Modal for quick adding card to specific column
  const [modalOpen, setModalOpen] = useState(false);
  const [targetColumn, setTargetColumn] = useState<ContentStatus>("Ideas");
  const [newTitle, setNewTitle] = useState("");
  const [newPlatform, setNewPlatform] = useState<Platform>("YouTube");

  const columns: ContentStatus[] = [
    "Ideas", "Research", "Writing", "Editing", "Thumbnail", "Review", "Scheduled", "Published"
  ];

  const getColumnColor = (status: ContentStatus) => {
    switch (status) {
      case "Ideas": return "bg-zinc-600";
      case "Research": return "bg-blue-500";
      case "Writing": return "bg-yellow-500";
      case "Editing": return "bg-pink-500";
      case "Thumbnail": return "bg-purple-500";
      case "Review": return "bg-cyan-500";
      case "Scheduled": return "bg-green-500";
      case "Published": return "bg-[#6C63FF]";
      default: return "bg-zinc-500";
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    setDraggedItemId(id);
  };

  const handleDragEnd = () => {
    setDraggedItemId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: ContentStatus) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData("text/plain") || draggedItemId;
    if (itemId) {
      updateContentItem(itemId, { status: targetStatus });
    }
    setDraggedItemId(null);
  };

  // Keyboard/button alternatives to move cards (useful on mobile)
  const moveCard = (id: string, currentStatus: ContentStatus, direction: "left" | "right") => {
    const currentIndex = columns.indexOf(currentStatus);
    let nextIndex = direction === "right" ? currentIndex + 1 : currentIndex - 1;
    
    if (nextIndex >= 0 && nextIndex < columns.length) {
      updateContentItem(id, { status: columns[nextIndex] });
    }
  };

  // Quick Create inside a column
  const openQuickCreate = (col: ContentStatus) => {
    setTargetColumn(col);
    setNewTitle("");
    setNewPlatform("YouTube");
    setModalOpen(true);
  };

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    addContentItem({
      title: newTitle,
      description: "Quick concept created from Kanban board.",
      platform: newPlatform,
      priority: "Medium",
      category: targetColumn === "Ideas" ? "Ideas" : "Long Form",
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: targetColumn,
      tags: [],
      referenceLinks: [],
      isFavorite: false,
      isArchived: false
    });
    setModalOpen(false);
  };

  return (
    <div className="flex-1 overflow-x-auto p-4 md:p-6 bg-[#09090B] flex flex-col select-none h-full">
      
      {/* Board Layout Container */}
      <div className="flex gap-4 flex-1 items-start min-h-[calc(100vh-140px)] pb-4 overflow-y-hidden">
        {columns.map((col) => {
          const colItems = contentItems.filter(item => item.status === col && !item.isArchived);
          
          return (
            <div
              key={col}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col)}
              className="w-72 shrink-0 flex flex-col h-full max-h-[78vh] rounded-xl border border-zinc-900 bg-zinc-950/20 backdrop-blur-xs p-3 space-y-3"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${getColumnColor(col)}`} />
                  <h3 className="text-xs font-extrabold text-zinc-200">{col}</h3>
                  <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-500 font-bold px-1.5 py-0.5 rounded-full">
                    {colItems.length}
                  </span>
                </div>
                
                <button 
                  onClick={() => openQuickCreate(col)}
                  className="p-1 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 transition-colors"
                  title="Create quick item"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Column Cards Container */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
                {colItems.length === 0 ? (
                  <div className="py-12 text-center text-[10px] text-zinc-600 border border-dashed border-zinc-900 rounded-lg">
                    Drop concepts here
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {colItems.map((item) => (
                      <motion.div key={item.id} layout>
                        <div
                          draggable
                          onDragStart={(e: React.DragEvent) => handleDragStart(e, item.id)}
                          onDragEnd={handleDragEnd}
                          className={`p-3.5 rounded-lg border border-zinc-900 bg-zinc-900/10 hover:bg-zinc-900/30 hover:border-zinc-850 transition-all cursor-grab active:cursor-grabbing group relative ${
                            draggedItemId === item.id ? "opacity-35" : ""
                          }`}
                        >
                        {/* Priority side indicator */}
                        <div className={`absolute top-0 bottom-0 left-0 w-1 rounded-l-lg ${
                          item.priority === "High" ? "bg-[#EF4444]" :
                          item.priority === "Medium" ? "bg-[#F59E0B]" : "bg-zinc-700"
                        }`} />

                        {/* Card Header info */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[8px] px-1.5 py-0.5 rounded font-black uppercase tracking-wide bg-zinc-900 border border-zinc-850/80 text-zinc-400">
                            {item.platform}
                          </span>
                          
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => moveCard(item.id, item.status, "left")}
                              disabled={col === "Ideas"}
                              className="p-0.5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 disabled:opacity-30"
                              title="Move left"
                            >
                              <ArrowLeft className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => moveCard(item.id, item.status, "right")}
                              disabled={col === "Published"}
                              className="p-0.5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 disabled:opacity-30"
                              title="Move right"
                            >
                              <ArrowRight className="h-3 w-3" />
                            </button>
                          </div>
                        </div>

                        {/* Title */}
                        <h4 className="text-xs font-bold text-zinc-200 leading-normal line-clamp-2">
                          {item.title}
                        </h4>

                        {/* Footer Details */}
                        <div className="flex items-center justify-between mt-3.5 pt-2.5 border-t border-zinc-900/80 text-[9px] text-zinc-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span className="font-mono">{item.deadline.split("-").slice(1).join("-")}</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {item.isFavorite && <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />}
                            <button 
                              onClick={() => deleteContentItem(item.id)}
                              className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-red-500 transition-all"
                              title="Delete Item"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
              
              {/* Bottom Quick Add Action */}
              <button
                onClick={() => openQuickCreate(col)}
                className="w-full py-1.5 text-[10px] font-bold text-zinc-500 hover:text-zinc-300 bg-zinc-900/10 hover:bg-zinc-900/30 border border-zinc-900 border-dashed rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Card</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Quick Add Modal Dialog */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 bg-[#09090B]/80 backdrop-blur-md"
            />
            {/* Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-900/95 shadow-2xl p-5 z-10"
            >
              <div className="flex justify-between items-center pb-3 border-b border-zinc-800 mb-4">
                <h3 className="text-xs font-bold text-zinc-200">Quick Add: {targetColumn}</h3>
                <button onClick={() => setModalOpen(false)} className="text-zinc-500 hover:text-zinc-300">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCreateCard} className="space-y-4">
                <div>
                  <label className="block text-[9px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                    Card Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Brief headline..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 focus:border-[#6C63FF]/60 rounded-lg text-xs text-zinc-100 placeholder-zinc-650 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                    Platform
                  </label>
                  <select
                    value={newPlatform}
                    onChange={(e) => setNewPlatform(e.target.value as Platform)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 focus:border-[#6C63FF]/60 rounded-lg text-xs text-zinc-300 outline-none cursor-pointer"
                  >
                    <option value="YouTube">YouTube</option>
                    <option value="Instagram">Instagram</option>
                    <option value="TikTok">TikTok</option>
                    <option value="Twitter">Twitter</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2.5 pt-2 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-3.5 py-1.5 text-xs font-semibold rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 text-xs font-semibold rounded bg-[#6C63FF] hover:bg-[#5b52f0] text-white"
                  >
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
