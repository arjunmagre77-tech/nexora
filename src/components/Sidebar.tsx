"use client";

import React, { useState } from "react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { 
  LayoutDashboard, Calendar, Kanban, FileText, Target, 
  Handshake, Folder, Sparkles, Settings, LogOut, ChevronDown, 
  Layers, Plus, Bell, Search, Menu
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    user, 
    logout, 
    notifications,
    setIsCommandPaletteOpen,
    addContentItem
  } = useWorkspace();

  const [workspaceOpen, setWorkspaceOpen] = useState(false);

  // If user is not logged in, sidebar should not be displayed (handled in app page)
  if (!user) return null;

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Content", icon: FileText },
    { name: "Calendar", icon: Calendar },
    { name: "Kanban", icon: Kanban },
    { name: "Notes", icon: FileText },
    { name: "Analytics", icon: Target }, // Changed target to BarChart2 later or keep Target for goals
    { name: "Sponsors", icon: Handshake },
    { name: "Goals", icon: Target },
    { name: "Assets", icon: Folder },
    { name: "AI Assistant", icon: Sparkles, badge: "AI" },
    { name: "Settings", icon: Settings },
  ];

  // Map naming differences for icons
  const getIcon = (name: string, IconComponent: any) => {
    return <IconComponent className="h-4.5 w-4.5 shrink-0" />;
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-900 flex flex-col h-screen shrink-0 hidden md:flex z-20">
      {/* Brand Logo & Switcher */}
      <div className="p-4 border-b border-zinc-900">
        <div className="relative">
          <button 
            onClick={() => setWorkspaceOpen(!workspaceOpen)}
            className="flex items-center justify-between w-full p-2 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-900 transition-colors text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-md bg-gradient-to-tr from-[#6C63FF] to-[#8B5CF6] flex items-center justify-center font-bold text-white text-sm shadow-md shadow-[#6C63FF]/20">
                N
              </div>
              <div>
                <h4 className="text-xs font-semibold text-zinc-200">Nexora Space</h4>
                <p className="text-[10px] text-zinc-500 font-medium">{user.fullName.split(" ")[0]}&apos;s Workspace</p>
              </div>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
          </button>
          
          {workspaceOpen && (
            <div className="absolute top-full left-0 right-0 mt-1.5 p-1 rounded-lg border border-zinc-800 bg-zinc-900/95 shadow-xl backdrop-blur-xl z-30">
              <div className="px-2.5 py-1.5 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                Workspaces
              </div>
              <button 
                onClick={() => setWorkspaceOpen(false)}
                className="flex items-center gap-2 w-full p-2 text-xs font-medium text-zinc-200 rounded-md hover:bg-zinc-800 transition-colors"
              >
                <Layers className="h-3.5 w-3.5 text-[#6C63FF]" />
                <span>Personal Studio</span>
              </button>
              <div className="border-t border-zinc-800 my-1"></div>
              <button 
                onClick={() => {
                  setWorkspaceOpen(false);
                  setActiveTab("Settings");
                }}
                className="flex items-center gap-2 w-full p-2 text-xs font-medium text-zinc-400 rounded-md hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
              >
                <Settings className="h-3.5 w-3.5" />
                <span>Workspace Settings</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin">
        {navItems.map((item) => {
          const isSelected = activeTab === item.name;
          return (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                isSelected 
                  ? "bg-gradient-to-r from-zinc-900 to-zinc-900/50 text-[#6C63FF] border border-zinc-800 shadow-sm" 
                  : "text-zinc-400 hover:bg-zinc-900/30 hover:text-zinc-200 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isSelected ? "text-[#6C63FF]" : "text-zinc-500"}>
                  {getIcon(item.name, item.icon)}
                </span>
                <span>{item.name}</span>
              </div>
              {item.badge ? (
                <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider bg-[#8B5CF6]/25 text-[#8B5CF6] border border-[#8B5CF6]/30">
                  {item.badge}
                </span>
              ) : item.name === "Sponsors" && unreadNotificationsCount > 0 ? (
                <span className="h-2 w-2 rounded-full bg-[#EF4444] animate-pulse"></span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* User Footer Profile */}
      <div className="p-4 border-t border-zinc-900 bg-zinc-950/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <img 
              src={user.avatarUrl} 
              alt={user.fullName}
              className="h-9 w-9 rounded-full border border-zinc-800 object-cover" 
            />
            <div className="min-w-0">
              <h5 className="text-xs font-semibold text-zinc-200 truncate">{user.fullName}</h5>
              <p className="text-[10px] text-zinc-500 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="p-1.5 rounded-md hover:bg-zinc-900 hover:text-zinc-200 text-zinc-500 transition-colors"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
