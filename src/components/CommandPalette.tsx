"use client";

import React, { useState, useEffect, useRef } from "react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { 
  Search, LayoutDashboard, Calendar, Kanban, FileText, Target, 
  Handshake, Folder, Sparkles, Settings, Plus, X, CornerDownLeft
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export const CommandPalette: React.FC = () => {
  const { 
    isCommandPaletteOpen, 
    setIsCommandPaletteOpen, 
    setActiveTab, 
    contentItems, 
    notes, 
    sponsors,
    addContentItem,
    addNote,
    addSponsor
  } = useWorkspace();

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Toggle Command Palette with Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen(!isCommandPaletteOpen);
      } else if (e.key === "Escape") {
        setIsCommandPaletteOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  // Focus input when palette opens
  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  // Command items definitions
  const navigationCommands = [
    { label: "Go to Dashboard", icon: LayoutDashboard, action: () => setActiveTab("Dashboard") },
    { label: "Go to Content Manager", icon: FileText, action: () => setActiveTab("Content") },
    { label: "Go to Calendar", icon: Calendar, action: () => setActiveTab("Calendar") },
    { label: "Go to Kanban Board", icon: Kanban, action: () => setActiveTab("Kanban") },
    { label: "Go to Notes", icon: FileText, action: () => setActiveTab("Notes") },
    { label: "Go to Goals", icon: Target, action: () => setActiveTab("Goals") },
    { label: "Go to Sponsor CRM", icon: Handshake, action: () => setActiveTab("Sponsors") },
    { label: "Go to Asset Library", icon: Folder, action: () => setActiveTab("Assets") },
    { label: "Go to AI Assistant", icon: Sparkles, action: () => setActiveTab("AI Assistant") },
    { label: "Go to Settings", icon: Settings, action: () => setActiveTab("Settings") },
  ];

  const actionCommands = [
    { 
      label: "Create New Idea", 
      icon: Plus, 
      action: () => {
        addContentItem({
          title: "New Brainstormed Idea",
          description: "Outline your content details here.",
          platform: "YouTube",
          priority: "Medium",
          category: "Ideas",
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          status: "Ideas",
          tags: ["draft"],
          referenceLinks: [],
          isFavorite: false,
          isArchived: false
        });
        setActiveTab("Content");
      }
    },
    { 
      label: "Create New Note", 
      icon: Plus, 
      action: () => {
        const id = addNote({
          title: "Untitled Note",
          content: "# New Note\n\nStart writing here...",
          folder: "General",
          isPinned: false
        });
        setActiveTab("Notes");
      }
    },
    { 
      label: "Add Sponsor Lead", 
      icon: Plus, 
      action: () => {
        addSponsor({
          brandName: "New Brand Inc",
          contactPerson: "Name",
          email: "sponsor@brand.com",
          phone: "",
          offerAmount: 100000,
          campaignName: "Integration",
          status: "Lead",
          nextFollowUp: new Date().toISOString().split("T")[0],
          notes: ""
        });
        setActiveTab("Sponsors");
      }
    }
  ];

  // Filter commands and content items based on query
  const filteredNav = navigationCommands.filter(c => 
    c.label.toLowerCase().includes(query.toLowerCase())
  );
  const filteredActions = actionCommands.filter(c => 
    c.label.toLowerCase().includes(query.toLowerCase())
  );
  
  const filteredContent = contentItems
    .filter(c => c.title.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 3)
    .map(c => ({
      label: `Content: ${c.title} (${c.platform})`,
      icon: FileText,
      action: () => {
        setActiveTab("Content");
      }
    }));

  const filteredNotes = notes
    .filter(n => n.title.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 3)
    .map(n => ({
      label: `Note: ${n.title}`,
      icon: FileText,
      action: () => {
        setActiveTab("Notes");
      }
    }));

  const allFilteredItems = [
    ...filteredActions,
    ...filteredNav,
    ...filteredContent,
    ...filteredNotes
  ];

  const handleSelect = (index: number) => {
    const selected = allFilteredItems[index];
    if (selected) {
      selected.action();
      setIsCommandPaletteOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % allFilteredItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + allFilteredItems.length) % allFilteredItems.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSelect(selectedIndex);
    } else if (e.key === "Escape") {
      setIsCommandPaletteOpen(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#09090B]/80 backdrop-blur-md"
          onClick={() => setIsCommandPaletteOpen(false)}
        />

        {/* Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="relative w-full max-w-2xl overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/90 shadow-2xl backdrop-blur-xl"
        >
          {/* Input Area */}
          <div className="flex items-center border-b border-zinc-800 px-4 py-3">
            <Search className="h-5 w-5 text-zinc-400 mr-3 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search anything or run commands... (Ctrl+K)"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 outline-none"
            />
            <button 
              onClick={() => setIsCommandPaletteOpen(false)}
              className="text-zinc-500 hover:text-zinc-300 transition-colors shrink-0 ml-2"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Results List */}
          <div 
            ref={listRef}
            className="max-h-[350px] overflow-y-auto p-2"
          >
            {allFilteredItems.length === 0 ? (
              <div className="py-8 text-center text-sm text-zinc-500">
                No results found for &ldquo;{query}&rdquo;
              </div>
            ) : (
              <div>
                {/* Actions Section */}
                {filteredActions.length > 0 && query === "" && (
                  <div className="px-3 py-1.5 text-[11px] font-medium tracking-wider text-zinc-500 uppercase">
                    Quick Actions
                  </div>
                )}
                {allFilteredItems.map((item, index) => {
                  const Icon = item.icon;
                  const isSelected = index === selectedIndex;
                  return (
                    <div
                      key={index}
                      onMouseEnter={() => setSelectedIndex(index)}
                      onClick={() => handleSelect(index)}
                      className={`flex items-center justify-between rounded-lg px-3 py-2.5 cursor-pointer transition-colors ${
                        isSelected 
                          ? "bg-[#6C63FF]/10 text-[#6C63FF] border-l-2 border-[#6C63FF]" 
                          : "text-zinc-300 hover:bg-zinc-800/50 hover:text-zinc-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`h-4 w-4 ${isSelected ? "text-[#6C63FF]" : "text-zinc-400"}`} />
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                      
                      {isSelected && (
                        <div className="flex items-center gap-1 text-[10px] text-zinc-400 bg-zinc-800/80 px-1.5 py-0.5 rounded border border-zinc-700">
                          <CornerDownLeft className="h-3 w-3" />
                          <span>Enter</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Guide */}
          <div className="flex items-center justify-between border-t border-zinc-800 bg-zinc-950/40 px-4 py-2 text-[11px] text-zinc-500">
            <div className="flex gap-4">
              <span>↑↓ Navigation</span>
              <span>↵ Select</span>
              <span>Esc Close</span>
            </div>
            <div>Nexora Command Center</div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
