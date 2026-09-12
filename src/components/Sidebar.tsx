"use client";

import React from "react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { 
  Home, 
  BarChart2, 
  Video, 
  Users, 
  DollarSign, 
  Handshake, 
  Calendar, 
  Wrench, 
  Folder, 
  Settings
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    user 
  } = useWorkspace();

  if (!user) return null;

  const mainNavItems = [
    { name: "Dashboard", icon: Home, tabKey: "Dashboard" },
    { name: "Analytics", icon: BarChart2, tabKey: "Analytics" },
    { name: "Content", icon: Video, tabKey: "Content" },
    { name: "Audience", icon: Users, tabKey: "Audience" },
    { name: "Monetization", icon: DollarSign, tabKey: "Monetization" },
    { name: "Brand Deals", icon: Handshake, tabKey: "Brand Deals" },
    { name: "Calendar", icon: Calendar, tabKey: "Calendar" },
    { name: "Tools", icon: Wrench, tabKey: "Tools" },
    { name: "Resources", icon: Folder, tabKey: "Resources" },
  ];

  return (
    <aside className="w-56 bg-[#0B0F19] border-r border-[#171E31] flex flex-col h-screen shrink-0 hidden md:flex z-20 select-none">
      {/* Brand Logo */}
      <div className="px-5 pt-6 pb-5 flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center font-bold text-white text-base shadow-lg shadow-indigo-500/25">
          N
        </div>
        <span className="text-lg font-bold text-white tracking-tight">Nexora</span>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-1 space-y-1 overflow-y-auto scrollbar-none">
        {mainNavItems.map((item) => {
          const isActive = activeTab === item.tabKey || (item.name === "Monetization" && activeTab === "Sponsors");
          const Icon = item.icon;
          return (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.tabKey)}
              className={`flex items-center gap-3.5 w-full px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 ${
                isActive
                  ? "bg-[#4338CA] text-white shadow-md shadow-indigo-700/30 font-semibold"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
              }`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : "text-zinc-400"}`} />
              <span>{item.name}</span>
            </button>
          );
        })}

        {/* Separator / Spacer */}
        <div className="pt-2 pb-1">
          <button
            onClick={() => setActiveTab("Settings")}
            className={`flex items-center gap-3.5 w-full px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 ${
              activeTab === "Settings"
                ? "bg-[#4338CA] text-white shadow-md font-semibold"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
            }`}
          >
            <Settings className="h-4 w-4 shrink-0 text-zinc-400" />
            <span>Settings</span>
          </button>
        </div>
      </nav>

      {/* Bottom Promotional Card */}
      <div className="p-3 mb-1">
        <div className="relative rounded-2xl overflow-hidden border border-indigo-500/20 bg-[#11182B] p-4 group shadow-lg">
          {/* Wave Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen pointer-events-none"
            style={{ backgroundImage: "url('/thumbnails/sidebar-card-bg.jpg')" }}
          />
          
          {/* Subtle glow gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 flex flex-col justify-between min-h-[135px]">
            <div>
              <h3 className="text-white font-bold text-sm leading-snug tracking-tight">
                Create<br />
                Grow<br />
                Monetize
              </h3>
              <p className="text-[10px] text-zinc-400 mt-2 leading-snug">
                Everything you need<br />to be a creator.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-3">
              <div className="h-4.5 w-4.5 rounded bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center font-bold text-[9px] text-white shadow-sm">
                N
              </div>
              <span className="text-[11px] font-semibold text-zinc-300">Nexora</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
