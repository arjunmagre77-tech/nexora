"use client";

import React, { useState, useRef, useEffect } from "react";
import { useWorkspace, Notification } from "@/context/WorkspaceContext";
import { 
  Bell, Search, Plus, Menu, X, FileText, CheckCircle, 
  AlertTriangle, Info, Check, Trash2, LayoutDashboard,
  Calendar, Kanban, Target, Handshake, Folder, Sparkles, Settings
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    user, 
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const createRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
      if (createRef.current && !createRef.current.contains(event.target as Node)) {
        setCreateOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotifIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-[#22C55E]" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-[#F59E0B]" />;
      case "danger":
        return <AlertTriangle className="h-4 w-4 text-[#EF4444]" />;
      default:
        return <Info className="h-4 w-4 text-[#6C63FF]" />;
    }
  };

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Content", icon: FileText },
    { name: "Calendar", icon: Calendar },
    { name: "Kanban", icon: Kanban },
    { name: "Notes", icon: FileText },
    { name: "Analytics", icon: Target },
    { name: "Sponsors", icon: Handshake },
    { name: "Goals", icon: Target },
    { name: "Assets", icon: Folder },
    { name: "AI Assistant", icon: Sparkles },
    { name: "Settings", icon: Settings },
  ];

  return (
    <header className="h-16 border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-md flex items-center justify-between px-4 md:px-6 w-full relative z-10 shrink-0">
      {/* Mobile Menu Toggle & Title */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden p-1.5 rounded-lg hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        <div className="flex items-center gap-2">
          {/* Decorative pulse glow on title */}
          <span className="h-2 w-2 rounded-full bg-[#6C63FF] hidden md:inline-block shadow-[0_0_10px_rgba(108,99,255,0.8)] animate-pulse"></span>
          <h1 className="text-base font-bold text-zinc-100 tracking-tight">{activeTab}</h1>
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="hidden sm:flex max-w-md w-full mx-4">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex items-center justify-between w-full px-3 py-1.5 rounded-lg bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-zinc-400 text-xs transition-all text-left"
        >
          <div className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5" />
            <span>Search or run actions...</span>
          </div>
          <kbd className="hidden md:inline-block px-1.5 py-0.5 rounded border border-zinc-800 bg-zinc-950 font-mono text-[9px] text-zinc-500 uppercase tracking-wider">
            Ctrl + K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Search trigger for mobile */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="sm:hidden p-2 rounded-lg hover:bg-zinc-900 text-zinc-400"
        >
          <Search className="h-4 w-4" />
        </button>

        {/* Quick Create Dropdown */}
        <div ref={createRef} className="relative">
          <button
            onClick={() => setCreateOpen(!createOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-tr from-[#6C63FF] to-[#8B5CF6] hover:from-[#5b52f0] hover:to-[#7c4df2] text-white shadow-md shadow-[#6C63FF]/20 active:scale-95 transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Create</span>
          </button>

          <AnimatePresence>
            {createOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-48 p-1 rounded-lg border border-zinc-800 bg-zinc-900/95 shadow-xl backdrop-blur-xl z-20"
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
                  className="flex items-center gap-2.5 w-full p-2 text-left text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 rounded-md transition-colors"
                >
                  <Plus className="h-3.5 w-3.5 text-[#6C63FF]" />
                  <span>Create Idea / Video</span>
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
                  className="flex items-center gap-2.5 w-full p-2 text-left text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 rounded-md transition-colors"
                >
                  <Plus className="h-3.5 w-3.5 text-[#22C55E]" />
                  <span>Create Note</span>
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
                    setActiveTab("Sponsors");
                  }}
                  className="flex items-center gap-2.5 w-full p-2 text-left text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 rounded-md transition-colors"
                >
                  <Plus className="h-3.5 w-3.5 text-[#F59E0B]" />
                  <span>Add Sponsor Lead</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications Center */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2 rounded-lg bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 relative transition-all"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-[#EF4444] text-[9px] font-bold text-white flex items-center justify-center border border-zinc-950 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 rounded-xl border border-zinc-800 bg-zinc-900/95 shadow-xl backdrop-blur-xl z-20 overflow-hidden"
              >
                {/* Header */}
                <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/40">
                  <h3 className="text-xs font-bold text-zinc-200">Notifications</h3>
                  <div className="flex gap-2">
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllNotificationsRead}
                        className="text-[10px] text-[#6C63FF] hover:underline flex items-center gap-0.5 font-medium"
                      >
                        <Check className="h-3 w-3" />
                        <span>Read All</span>
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button 
                        onClick={clearNotifications}
                        className="text-[10px] text-zinc-500 hover:text-zinc-300 flex items-center gap-0.5 font-medium"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Clear</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-[300px] overflow-y-auto divide-y divide-zinc-800">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-xs text-zinc-500">
                      No notifications yet.
                    </div>
                  ) : (
                    notifications.map((noti) => (
                      <div 
                        key={noti.id} 
                        className={`p-3 text-left transition-colors relative hover:bg-zinc-800/40 ${
                          !noti.read ? "bg-[#6C63FF]/5" : ""
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <span className="mt-0.5">{getNotifIcon(noti.type)}</span>
                          <div className="flex-1 min-w-0">
                            <h4 className={`text-xs ${!noti.read ? "font-semibold text-zinc-200" : "font-normal text-zinc-400"}`}>
                              {noti.title}
                            </h4>
                            <p className="text-[10px] text-zinc-500 mt-0.5 leading-relaxed">{noti.description}</p>
                            <span className="text-[9px] text-zinc-600 block mt-1">
                              {new Date(noti.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                          {!noti.read && (
                            <button
                              onClick={() => markNotificationRead(noti.id)}
                              className="text-zinc-600 hover:text-zinc-400 p-0.5 rounded transition-colors shrink-0"
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

        {/* Small avatar display for navbar */}
        <div 
          onClick={() => setActiveTab("Settings")}
          className="h-8 w-8 rounded-full border border-zinc-800 cursor-pointer overflow-hidden hover:opacity-80 transition-all shrink-0"
        >
          <img src={user.avatarUrl} alt={user.fullName} className="h-full w-full object-cover" />
        </div>
      </div>

      {/* Mobile Sidebar Overlay Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#09090B]/80 backdrop-blur-md z-40 md:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 w-64 bg-zinc-950 border-r border-zinc-900 flex flex-col z-50 md:hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-zinc-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded bg-gradient-to-tr from-[#6C63FF] to-[#8B5CF6] flex items-center justify-center font-bold text-white text-xs">
                    N
                  </div>
                  <span className="text-sm font-bold text-zinc-100">Nexora Studio</span>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-zinc-400 hover:text-zinc-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                {menuItems.map((item) => {
                  const isSelected = activeTab === item.name;
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        setActiveTab(item.name);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                        isSelected 
                          ? "bg-zinc-900 text-[#6C63FF] border border-zinc-800" 
                          : "text-zinc-400 hover:bg-zinc-900/30 hover:text-zinc-200"
                      }`}
                    >
                      <item.icon className={`h-4 w-4 ${isSelected ? "text-[#6C63FF]" : "text-zinc-500"}`} />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Footer Profile */}
              <div className="p-4 border-t border-zinc-900 flex items-center gap-2">
                <img 
                  src={user.avatarUrl} 
                  alt={user.fullName}
                  className="h-8 w-8 rounded-full border border-zinc-800 object-cover" 
                />
                <div className="min-w-0 flex-1">
                  <h5 className="text-xs font-semibold text-zinc-200 truncate">{user.fullName}</h5>
                  <p className="text-[9px] text-zinc-500 truncate">{user.email}</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
