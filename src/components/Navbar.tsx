"use client";

import React, { useState, useRef, useEffect } from "react";
import { useWorkspace, Notification } from "@/context/WorkspaceContext";
import { 
  Bell, 
  Search, 
  Plus, 
  Sun, 
  Moon, 
  ChevronDown, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Check, 
  Trash2, 
  Menu, 
  X,
  FileText,
  Calendar,
  Sparkles,
  LogOut,
  Settings
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    user, 
    logout,
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead, 
    clearNotifications,
    setIsCommandPaletteOpen,
    addContentItem,
    addNote,
    addSponsor
  } = useWorkspace();

  const [notifOpen, setNotifOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark");

  const notifRef = useRef<HTMLDivElement>(null);
  const createRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
      if (createRef.current && !createRef.current.contains(event.target as Node)) {
        setCreateOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleTheme = () => {
    setThemeMode(prev => (prev === "dark" ? "light" : "dark"));
  };

  const getNotifIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-[#22C55E]" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-[#F59E0B]" />;
      case "danger":
        return <AlertTriangle className="h-4 w-4 text-[#EF4444]" />;
      default:
        return <Info className="h-4 w-4 text-[#6366F1]" />;
    }
  };

  return (
    <header className="h-16 border-b border-[#171E31] bg-[#0B0F19] flex items-center justify-between px-6 w-full relative z-10 shrink-0 select-none">
      {/* Mobile Menu Button & Brand indicator */}
      <div className="flex items-center gap-3 md:hidden">
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="p-1.5 rounded-lg hover:bg-white/[0.05] text-zinc-400 hover:text-zinc-200"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="text-sm font-bold text-white">Nexora</span>
      </div>

      {/* Center/Left Search Input */}
      <div className="flex-1 max-w-sm">
        <div 
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#11182B] border border-[#1E293B] text-zinc-400 hover:text-zinc-300 hover:border-zinc-700 text-xs cursor-pointer transition-all shadow-inner"
        >
          <Search className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
          <span className="truncate">Search anything...</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Notifications Icon Button */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2 rounded-xl hover:bg-white/[0.05] text-zinc-400 hover:text-zinc-200 relative transition-colors"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#EF4444] shadow-[0_0_6px_#EF4444]"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 rounded-2xl border border-[#1E293B] bg-[#11182B] shadow-2xl backdrop-blur-xl z-30 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-[#1E293B] flex items-center justify-between bg-[#0B0F19]/60">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-white">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-indigo-500/20 text-indigo-400 font-semibold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllNotificationsRead}
                        className="text-[10px] text-indigo-400 hover:underline flex items-center gap-1 font-medium"
                      >
                        <Check className="h-3 w-3" />
                        <span>Mark all read</span>
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button 
                        onClick={clearNotifications}
                        className="text-[10px] text-zinc-500 hover:text-zinc-300 flex items-center gap-0.5"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="max-h-[320px] overflow-y-auto divide-y divide-[#1E293B]/60 scrollbar-thin">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-xs text-zinc-500">
                      No notifications yet.
                    </div>
                  ) : (
                    notifications.map((noti) => (
                      <div 
                        key={noti.id} 
                        className={`p-3 text-left transition-colors hover:bg-white/[0.03] ${
                          !noti.read ? "bg-indigo-500/[0.05]" : ""
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <span className="mt-0.5 shrink-0">{getNotifIcon(noti.type)}</span>
                          <div className="flex-1 min-w-0">
                            <h4 className={`text-xs ${!noti.read ? "font-semibold text-zinc-200" : "font-normal text-zinc-400"}`}>
                              {noti.title}
                            </h4>
                            <p className="text-[11px] text-zinc-500 mt-0.5 leading-snug">{noti.description}</p>
                            <span className="text-[9px] text-zinc-600 block mt-1">
                              {new Date(noti.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                          {!noti.read && (
                            <button
                              onClick={() => markNotificationRead(noti.id)}
                              className="text-zinc-500 hover:text-zinc-300 p-0.5 rounded transition-colors shrink-0"
                              title="Mark as read"
                            >
                              <Check className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl hover:bg-white/[0.05] text-zinc-400 hover:text-zinc-200 transition-colors"
          title="Toggle Theme"
        >
          <Sun className="h-4 w-4" />
        </button>

        {/* User Profile Chip: [AM] Alex Mercer v */}
        <div ref={userRef} className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-white/[0.05] transition-colors"
          >
            <div className="h-7 w-7 rounded-full bg-[#3B82F6] flex items-center justify-center font-bold text-white text-xs shadow-sm">
              AM
            </div>
            <span className="text-xs font-semibold text-zinc-200 hidden sm:inline">
              Alex Mercer
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
          </button>

          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-48 rounded-xl border border-[#1E293B] bg-[#11182B] shadow-2xl backdrop-blur-xl z-30 p-1"
              >
                <div className="px-3 py-2 border-b border-[#1E293B]/80">
                  <p className="text-xs font-semibold text-zinc-200">Alex Mercer</p>
                  <p className="text-[10px] text-zinc-500 truncate">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    setActiveTab("Settings");
                  }}
                  className="flex items-center gap-2 w-full p-2 text-xs text-zinc-300 hover:bg-white/[0.06] rounded-lg transition-colors mt-1"
                >
                  <Settings className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Account Settings</span>
                </button>
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    logout();
                  }}
                  className="flex items-center gap-2 w-full p-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Log Out</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Primary "+ Create" Button with Dropdown Chevron */}
        <div ref={createRef} className="relative">
          <button
            onClick={() => setCreateOpen(!createOpen)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#6366F1] hover:from-[#4338CA] hover:to-[#4F46E5] text-white text-xs font-semibold shadow-md shadow-indigo-600/30 active:scale-95 transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create</span>
            <ChevronDown className="h-3.5 w-3.5 ml-0.5 text-indigo-200" />
          </button>

          <AnimatePresence>
            {createOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-52 p-1 rounded-xl border border-[#1E293B] bg-[#11182B] shadow-2xl backdrop-blur-xl z-30"
              >
                <button
                  onClick={() => {
                    setCreateOpen(false);
                    addContentItem({
                      title: "New Video Concept",
                      description: "Enter script or outline details here.",
                      platform: "YouTube",
                      priority: "Medium",
                      category: "Long Form",
                      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                      status: "Ideas",
                      tags: [],
                      referenceLinks: [],
                      isFavorite: false,
                      isArchived: false
                    });
                    setActiveTab("Content");
                  }}
                  className="flex items-center gap-2.5 w-full p-2.5 text-left text-xs font-medium text-zinc-300 hover:bg-white/[0.06] hover:text-white rounded-lg transition-colors"
                >
                  <Plus className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Create Content Card</span>
                </button>
                
                <button
                  onClick={() => {
                    setCreateOpen(false);
                    addNote({
                      title: "Untitled Note",
                      content: "# Untitled Note\n\nStart typing...",
                      folder: "General",
                      isPinned: false
                    });
                    setActiveTab("Notes");
                  }}
                  className="flex items-center gap-2.5 w-full p-2.5 text-left text-xs font-medium text-zinc-300 hover:bg-white/[0.06] hover:text-white rounded-lg transition-colors"
                >
                  <FileText className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Create Note / Script</span>
                </button>

                <button
                  onClick={() => {
                    setCreateOpen(false);
                    addSponsor({
                      brandName: "Acme Corp",
                      contactPerson: "Marketing Lead",
                      email: "marketing@acme.com",
                      phone: "",
                      offerAmount: 50000,
                      campaignName: "Q3 Sponsor",
                      status: "Lead",
                      nextFollowUp: new Date().toISOString().split("T")[0],
                      notes: ""
                    });
                    setActiveTab("Brand Deals");
                  }}
                  className="flex items-center gap-2.5 w-full p-2.5 text-left text-xs font-medium text-zinc-300 hover:bg-white/[0.06] hover:text-white rounded-lg transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span>Add Brand Deal Lead</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Sidebar Overlay Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 w-64 bg-[#0B0F19] border-r border-[#171E31] flex flex-col z-50 md:hidden p-4"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#171E31]">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center font-bold text-white text-xs">
                    N
                  </div>
                  <span className="text-base font-bold text-white">Nexora</span>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-zinc-400 hover:text-zinc-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
                {[
                  "Dashboard", "Analytics", "Content", "Audience", 
                  "Monetization", "Brand Deals", "Calendar", "Tools", "Resources", "Settings"
                ].map((name) => (
                  <button
                    key={name}
                    onClick={() => {
                      setActiveTab(name);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center w-full px-3 py-2 rounded-xl text-xs font-medium ${
                      activeTab === name
                        ? "bg-[#4338CA] text-white"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
