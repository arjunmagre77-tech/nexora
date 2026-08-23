"use client";

import React, { useState } from "react";
import { useWorkspace, CalendarEvent, Platform } from "@/context/WorkspaceContext";
import { 
  ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, 
  Clock, MapPin, X, Trash2, Edit3, HelpCircle, Users
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const CalendarView: React.FC = () => {
  const { calendarEvents, addCalendarEvent, updateCalendarEvent, deleteCalendarEvent } = useWorkspace();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 25)); // Set baseline date to July 25, 2026
  const [activeView, setActiveView] = useState<"month" | "week" | "day">("month");
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedDateStr, setSelectedDateStr] = useState("");

  // Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formType, setFormType] = useState<CalendarEvent["type"]>("upload");
  const [formPlatform, setFormPlatform] = useState<Platform>("YouTube");
  const [formStart, setFormStart] = useState("");
  const [formEnd, setFormEnd] = useState("");
  const [formNotes, setFormNotes] = useState("");

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Helper date calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrev = () => {
    if (activeView === "month") {
      setCurrentDate(new Date(year, month - 1, 1));
    } else if (activeView === "week") {
      setCurrentDate(new Date(year, month, currentDate.getDate() - 7));
    } else {
      setCurrentDate(new Date(year, month, currentDate.getDate() - 1));
    }
  };

  const handleNext = () => {
    if (activeView === "month") {
      setCurrentDate(new Date(year, month + 1, 1));
    } else if (activeView === "week") {
      setCurrentDate(new Date(year, month, currentDate.getDate() + 7));
    } else {
      setCurrentDate(new Date(year, month, currentDate.getDate() + 1));
    }
  };

  // Get start/end of active week
  const getWeekDates = (date: Date) => {
    const currentDay = date.getDay();
    const week = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(date);
      d.setDate(date.getDate() - currentDay + i);
      week.push(d);
    }
    return week;
  };

  // Format Helper: YYYY-MM-DD
  const formatYYYYMMDD = (d: Date) => {
    const monthStr = String(d.getMonth() + 1).padStart(2, "0");
    const dayStr = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${monthStr}-${dayStr}`;
  };

  const getPlatformClass = (platform: Platform, type: CalendarEvent["type"]) => {
    if (type === "meeting") return "bg-green-500/10 text-green-400 border border-green-500/25";
    if (type === "filming") return "bg-blue-500/10 text-blue-400 border border-blue-500/25";
    
    switch (platform) {
      case "YouTube": return "bg-red-500/10 text-red-400 border border-red-500/25";
      case "Instagram": return "bg-purple-500/10 text-purple-400 border border-purple-500/25";
      case "TikTok": return "bg-pink-500/10 text-pink-400 border border-pink-500/25";
      case "Twitter": return "bg-cyan-500/10 text-cyan-400 border border-cyan-500/25";
      default: return "bg-zinc-800 text-zinc-300 border border-zinc-700";
    }
  };

  // Grid Month Builder
  const getMonthDays = () => {
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevTotalDays = new Date(year, month, 0).getDate();
    
    const days = [];
    
    // Fill Leading Days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevTotalDays - i),
        isCurrentMonth: false
      });
    }
    
    // Current Month Days
    for (let i = 1; i <= totalDays; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }

    // Fill Trailing Days
    const remainingCells = 42 - days.length; // standard 6 rows
    for (let i = 1; i <= remainingCells; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }

    return days;
  };

  const handleOpenAddModal = (dateStr: string) => {
    setSelectedEvent(null);
    setSelectedDateStr(dateStr);
    setFormTitle("");
    setFormType("upload");
    setFormPlatform("YouTube");
    setFormStart(`${dateStr}T10:00`);
    setFormEnd(`${dateStr}T11:00`);
    setFormNotes("");
    setModalOpen(true);
  };

  const handleOpenEditModal = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setFormTitle(event.title);
    setFormType(event.type);
    setFormPlatform(event.platform);
    setFormStart(event.start.substring(0, 16));
    setFormEnd(event.end.substring(0, 16));
    setFormNotes(event.notes || "");
    setModalOpen(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formStart || !formEnd) return;

    const payload = {
      title: formTitle,
      type: formType,
      platform: formPlatform,
      start: formStart,
      end: formEnd,
      notes: formNotes
    };

    if (selectedEvent) {
      updateCalendarEvent(selectedEvent.id, payload);
    } else {
      addCalendarEvent(payload);
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (selectedEvent) {
      deleteCalendarEvent(selectedEvent.id);
      setModalOpen(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-[#09090B] scrollbar-thin select-none">
      
      {/* Calendar Header Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        
        {/* Navigation Arrows */}
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold text-zinc-100 min-w-[140px]">
            {currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}
          </h2>
          <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-950 p-0.5">
            <button 
              onClick={handlePrev} 
              className="p-1 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button 
              onClick={handleNext} 
              className="p-1 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* View Switches & Add Button */}
        <div className="flex items-center gap-3">
          
          <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-950 p-0.5 text-xs font-semibold">
            {["month", "week", "day"].map((v) => (
              <button
                key={v}
                onClick={() => setActiveView(v as any)}
                className={`px-3 py-1.5 rounded-md capitalize ${
                  activeView === v 
                    ? "bg-zinc-900 text-[#6C63FF]" 
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleOpenAddModal(formatYYYYMMDD(new Date()))}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-gradient-to-tr from-[#6C63FF] to-[#8B5CF6] text-white shadow-md shadow-[#6C63FF]/20 active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Schedule</span>
          </button>
        </div>
      </div>

      {/* Main Calendar Space */}
      <div className="bg-zinc-950/20 rounded-xl border border-zinc-900 p-1 overflow-hidden">
        
        {/* Month View */}
        {activeView === "month" && (
          <div>
            {/* Days Header */}
            <div className="grid grid-cols-7 text-center border-b border-zinc-900 bg-zinc-950/30 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              {weekDays.map(d => <div key={d}>{d}</div>)}
            </div>
            
            {/* Grid cells */}
            <div className="grid grid-cols-7 divide-x divide-y divide-zinc-900 border-l border-t border-zinc-900">
              {getMonthDays().map((cell, idx) => {
                const dateKey = formatYYYYMMDD(cell.date);
                const dayEvents = calendarEvents.filter(e => e.start.startsWith(dateKey));
                const isToday = formatYYYYMMDD(new Date()) === dateKey;
                
                return (
                  <div
                    key={idx}
                    className={`min-h-[100px] p-2 flex flex-col justify-between hover:bg-zinc-900/10 cursor-pointer transition-colors relative ${
                      cell.isCurrentMonth ? "text-zinc-200" : "text-zinc-650 bg-zinc-950/20"
                    }`}
                    onClick={() => handleOpenAddModal(dateKey)}
                  >
                    {/* Day number */}
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-mono font-bold ${
                        isToday 
                          ? "h-5 w-5 rounded-full bg-[#6C63FF] text-white flex items-center justify-center font-bold" 
                          : ""
                      }`}>
                        {cell.date.getDate()}
                      </span>
                    </div>

                    {/* Day events capsule list */}
                    <div className="mt-2 space-y-1.5 flex-1 overflow-y-auto">
                      {dayEvents.map(e => (
                        <div
                          key={e.id}
                          onClick={(ev) => {
                            ev.stopPropagation(); // prevent opening empty add modal
                            handleOpenEditModal(e);
                          }}
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold truncate ${getPlatformClass(e.platform, e.type)}`}
                          title={`${e.title} (${e.platform})`}
                        >
                          {e.type === "meeting" ? "👥 " : e.type === "filming" ? "🎥 " : ""}
                          {e.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Week View */}
        {activeView === "week" && (
          <div className="grid grid-cols-7 divide-x divide-zinc-900">
            {getWeekDates(currentDate).map((day, idx) => {
              const dateKey = formatYYYYMMDD(day);
              const dayEvents = calendarEvents.filter(e => e.start.startsWith(dateKey));
              const isToday = formatYYYYMMDD(new Date()) === dateKey;

              return (
                <div key={idx} className="min-h-[400px] flex flex-col bg-zinc-950/10">
                  {/* Column Header */}
                  <div className={`p-4 border-b border-zinc-900 text-center ${isToday ? "bg-[#6C63FF]/5" : "bg-zinc-950/40"}`}>
                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase">{weekDays[idx]}</h4>
                    <h3 className={`text-base font-extrabold font-mono mt-1 ${isToday ? "text-[#6C63FF]" : "text-zinc-200"}`}>
                      {day.getDate()}
                    </h3>
                  </div>

                  {/* Body Event List */}
                  <div 
                    className="p-3.5 space-y-2 flex-1 overflow-y-auto cursor-pointer"
                    onClick={() => handleOpenAddModal(dateKey)}
                  >
                    {dayEvents.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-[10px] text-zinc-700 text-center">
                        No events
                      </div>
                    ) : (
                      dayEvents.map(e => (
                        <div
                          key={e.id}
                          onClick={(ev) => {
                            ev.stopPropagation();
                            handleOpenEditModal(e);
                          }}
                          className={`p-2.5 rounded-lg text-[10px] font-bold space-y-1 ${getPlatformClass(e.platform, e.type)}`}
                        >
                          <div className="truncate">{e.title}</div>
                          <div className="text-[9px] text-zinc-500 font-medium flex items-center gap-1 font-mono">
                            <Clock className="h-3 w-3 shrink-0" />
                            <span>{e.start.substring(11, 16)}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Day View */}
        {activeView === "day" && (
          <div className="divide-y divide-zinc-900">
            {/* Focused day header */}
            <div className="p-4 bg-zinc-950/40 border-b border-zinc-900 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-zinc-200">
                  {currentDate.toLocaleDateString("default", { weekday: 'long', month: 'long', day: 'numeric' })}
                </h3>
                <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Hourly Schedule Grid</p>
              </div>
              <span className="text-[10px] font-bold bg-[#6C63FF]/15 text-[#6C63FF] border border-[#6C63FF]/20 px-2 py-0.5 rounded-full">
                Today
              </span>
            </div>

            {/* Event list focused */}
            <div className="p-4 space-y-3.5">
              {calendarEvents.filter(e => e.start.startsWith(formatYYYYMMDD(currentDate))).length === 0 ? (
                <div className="py-20 text-center text-xs text-zinc-500 border border-dashed border-zinc-900 rounded-xl">
                  No tasks or events scheduled for this day. Click &ldquo;Schedule&rdquo; to add one.
                </div>
              ) : (
                calendarEvents
                  .filter(e => e.start.startsWith(formatYYYYMMDD(currentDate)))
                  .sort((a, b) => a.start.localeCompare(b.start))
                  .map(e => (
                    <div 
                      key={e.id}
                      onClick={() => handleOpenEditModal(e)}
                      className={`p-4 rounded-xl cursor-pointer hover:opacity-90 transition-opacity flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${getPlatformClass(e.platform, e.type)}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-zinc-950/30 flex items-center justify-center shrink-0">
                          {e.type === "meeting" ? <Users className="h-4.5 w-4.5" /> : <CalendarIcon className="h-4.5 w-4.5" />}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-zinc-100">{e.title}</h4>
                          <p className="text-[10px] text-zinc-500 mt-0.5">{e.notes || "No extra descriptions added."}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs shrink-0 self-end sm:self-auto">
                        <div className="flex items-center gap-1 font-mono font-bold text-zinc-400">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{e.start.substring(11, 16)} - {e.end.substring(11, 16)}</span>
                        </div>
                        
                        <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-zinc-950/50 border border-zinc-800">
                          {e.platform}
                        </span>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}

      </div>

      {/* Schedule Edit / Add Dialog */}
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
              className="relative w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-900/90 shadow-2xl backdrop-blur-xl p-5 z-10"
            >
              <div className="flex justify-between items-center pb-3 border-b border-zinc-800 mb-4 bg-zinc-950/20">
                <h3 className="text-xs font-bold text-zinc-200">
                  {selectedEvent ? "Edit Scheduled Event" : "Schedule New Event"}
                </h3>
                <button onClick={() => setModalOpen(false)} className="text-zinc-500 hover:text-zinc-300">
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <form onSubmit={handleSaveEvent} className="space-y-4">
                <div>
                  <label className="block text-[9px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                    Event Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Upload Youtube video, Filming segment"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 focus:border-[#6C63FF]/60 rounded-lg text-xs text-zinc-100 placeholder-zinc-650 outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                      Event Type
                    </label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value as any)}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 focus:border-[#6C63FF]/60 rounded-lg text-xs text-zinc-300 outline-none cursor-pointer"
                    >
                      <option value="upload">Upload</option>
                      <option value="filming">Filming</option>
                      <option value="meeting">Meeting</option>
                      <option value="deadline">Deadline</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                      Target Channel
                    </label>
                    <select
                      value={formPlatform}
                      onChange={(e) => setFormPlatform(e.target.value as Platform)}
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
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                      Start Date / Time
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formStart}
                      onChange={(e) => setFormStart(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 focus:border-[#6C63FF]/60 rounded-lg text-xs text-zinc-300 outline-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                      End Date / Time
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formEnd}
                      onChange={(e) => setFormEnd(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 focus:border-[#6C63FF]/60 rounded-lg text-xs text-zinc-300 outline-none cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                    Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Locations, call links, draft scripts..."
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 focus:border-[#6C63FF]/60 rounded-lg text-xs text-zinc-100 placeholder-zinc-650 outline-none transition-colors resize-none"
                  />
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-zinc-800">
                  {selectedEvent ? (
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="px-3 py-1.5 text-xs font-semibold rounded bg-red-500/10 border border-red-500/20 text-[#EF4444] hover:bg-red-500/20 transition-all flex items-center gap-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  <div className="flex gap-2">
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
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
