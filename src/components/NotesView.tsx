"use client";

import React, { useState, useEffect } from "react";
import { useWorkspace, Note } from "@/context/WorkspaceContext";
import { 
  Folder, FolderPlus, Pin, Plus, Search, Trash2, 
  FileText, Eye, Edit2, ChevronRight, CheckCircle2, AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";

export const NotesView: React.FC = () => {
  const { 
    notes, 
    folders, 
    addNote, 
    updateNote, 
    deleteNote, 
    addFolder, 
    deleteFolder 
  } = useWorkspace();

  const [selectedFolder, setSelectedFolder] = useState("Scripts");
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editorMode, setEditorMode] = useState<"edit" | "preview">("edit");
  const [newFolderName, setNewFolderName] = useState("");
  const [showFolderModal, setShowFolderModal] = useState(false);

  // Auto select first note in the folder when folder changes
  useEffect(() => {
    const folderNotes = notes.filter(n => n.folder === selectedFolder);
    if (folderNotes.length > 0) {
      setSelectedNoteId(folderNotes[0].id);
    } else {
      setSelectedNoteId(null);
    }
  }, [selectedFolder, notes]);

  const activeNote = notes.find(n => n.id === selectedNoteId);

  // Parse markdown content to custom JSX/HTML preview
  const renderMarkdown = (text: string) => {
    if (!text) return <p className="text-zinc-500 italic text-xs">Empty note. Start writing...</p>;

    const lines = text.split("\n");
    let inCodeBlock = false;
    let codeContent: string[] = [];

    return lines.map((line, idx) => {
      // Code Block Detection
      if (line.trim().startsWith("```")) {
        if (inCodeBlock) {
          inCodeBlock = false;
          const displayCode = codeContent.join("\n");
          codeContent = [];
          return (
            <pre key={idx} className="p-3.5 my-3 rounded-lg border border-zinc-800 bg-zinc-950 font-mono text-[11px] text-zinc-300 overflow-x-auto">
              <code>{displayCode}</code>
            </pre>
          );
        } else {
          inCodeBlock = true;
          return null;
        }
      }

      if (inCodeBlock) {
        codeContent.push(line);
        return null;
      }

      // Headers
      if (line.startsWith("# ")) {
        return <h1 key={idx} className="text-lg font-black text-white mt-5 mb-2.5 pb-1.5 border-b border-zinc-900">{line.substring(2)}</h1>;
      }
      if (line.startsWith("## ")) {
        return <h2 key={idx} className="text-sm font-bold text-zinc-150 mt-4 mb-2">{line.substring(3)}</h2>;
      }
      if (line.startsWith("### ")) {
        return <h3 key={idx} className="text-xs font-semibold text-zinc-200 mt-3 mb-1.5">{line.substring(4)}</h3>;
      }

      // Checklist Items
      if (line.trim().startsWith("- [ ]")) {
        return (
          <div key={idx} className="flex items-center gap-2 my-1 text-xs text-zinc-350">
            <input type="checkbox" readOnly checked={false} className="rounded bg-zinc-900 border-zinc-800 text-[#6C63FF] pointer-events-none" />
            <span>{line.replace("- [ ]", "").trim()}</span>
          </div>
        );
      }
      if (line.trim().startsWith("- [x]")) {
        return (
          <div key={idx} className="flex items-center gap-2 my-1 text-xs text-zinc-550 line-through">
            <input type="checkbox" readOnly checked={true} className="rounded bg-zinc-900 border-zinc-800 text-[#6C63FF] pointer-events-none" />
            <span>{line.replace("- [x]", "").trim()}</span>
          </div>
        );
      }

      // Bullet list items
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        return (
          <ul key={idx} className="list-disc pl-5 my-1 text-xs text-zinc-350">
            <li>{line.trim().substring(2)}</li>
          </ul>
        );
      }

      // Divider line
      if (line.trim() === "---") {
        return <hr key={idx} className="border-zinc-900 my-4" />;
      }

      // Paragraph Line with bold parsing
      if (line.trim() === "") {
        return <div key={idx} className="h-2.5" />;
      }

      // Bold text parser replacement `**text**`
      const boldRegex = /\*\*(.*?)\*\*/g;
      const formattedLine = line.replace(boldRegex, "<strong>$1</strong>");

      return (
        <p 
          key={idx} 
          className="text-xs text-zinc-300 leading-relaxed my-1.5"
          dangerouslySetInnerHTML={{ __html: formattedLine }}
        />
      );
    });
  };

  // Add Folder action
  const handleAddFolderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      addFolder(newFolderName.trim());
      setSelectedFolder(newFolderName.trim());
      setNewFolderName("");
      setShowFolderModal(false);
    }
  };

  // Create quick note inside active folder
  const handleCreateNote = () => {
    const id = addNote({
      title: "New Script / Draft Notes",
      content: "# Title\n\nStart outlining your content script structure here...\n\n- [ ] Hook idea:\n- [ ] Body explanation:\n- [ ] Outro call to action:",
      folder: selectedFolder,
      isPinned: false
    });
    setSelectedNoteId(id);
  };

  // Filter notes inside selected folder and match search queries
  const folderNotes = notes.filter(note => {
    const matchesFolder = note.folder === selectedFolder;
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          note.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  // Sort notes: pinned first, then updated date
  const sortedNotes = [...folderNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <div className="flex-1 flex overflow-hidden h-[calc(100vh-64px)] select-none">
      
      {/* 1. Folders Pane (Left Column) */}
      <div className="w-52 border-r border-zinc-900 bg-zinc-950 flex flex-col justify-between shrink-0">
        <div className="p-3.5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-wider">Notebooks</h3>
            <button 
              onClick={() => setShowFolderModal(true)}
              className="p-1 rounded text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 transition-colors"
            >
              <FolderPlus className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-1">
            {folders.map(f => {
              const active = selectedFolder === f;
              const count = notes.filter(n => n.folder === f).length;
              return (
                <button
                  key={f}
                  onClick={() => setSelectedFolder(f)}
                  className={`flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    active 
                      ? "bg-zinc-900 text-[#6C63FF]" 
                      : "text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Folder className={`h-4 w-4 shrink-0 ${active ? "text-[#6C63FF]" : "text-zinc-500"}`} />
                    <span className="truncate max-w-[100px]">{f}</span>
                  </div>
                  <span className="text-[9px] bg-zinc-900 border border-zinc-850 px-1 py-0.5 rounded text-zinc-500 font-mono">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Delete Active Folder */}
        {selectedFolder !== "General" && (
          <div className="p-3">
            <button
              onClick={() => {
                if (confirm(`Delete folder "${selectedFolder}"? Notes inside will default to General.`)) {
                  deleteFolder(selectedFolder);
                  setSelectedFolder("General");
                }
              }}
              className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded text-[10px] font-bold text-red-500 hover:bg-red-500/10 border border-red-500/20 transition-all"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete Notebook</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Notes List Pane (Middle Column) */}
      <div className="w-64 border-r border-zinc-900 bg-zinc-950/20 flex flex-col shrink-0">
        {/* Search */}
        <div className="p-3 border-b border-zinc-900 flex items-center gap-2">
          <div className="flex items-center gap-2 bg-zinc-900/50 border border-zinc-850 px-2.5 py-1.5 rounded-lg w-full">
            <Search className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
            <input
              type="text"
              placeholder="Search notebook..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-[11px] text-zinc-200 placeholder-zinc-500 outline-none w-full"
            />
          </div>
        </div>

        {/* Notes Items */}
        <div className="flex-1 overflow-y-auto divide-y divide-zinc-900/60 scrollbar-thin">
          <div className="p-3">
            <button
              onClick={handleCreateNote}
              className="flex items-center justify-center gap-1.5 w-full py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-200 rounded-lg transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Draft Note</span>
            </button>
          </div>

          {sortedNotes.length === 0 ? (
            <div className="py-20 text-center text-xs text-zinc-600">No notes in this notebook.</div>
          ) : (
            sortedNotes.map(n => {
              const active = selectedNoteId === n.id;
              const dateStr = new Date(n.updatedAt).toLocaleDateString([], { month: "short", day: "numeric" });
              const cleanContent = n.content.replace(/[#*`\-]/g, "").trim().substring(0, 40);

              return (
                <div
                  key={n.id}
                  onClick={() => setSelectedNoteId(n.id)}
                  className={`p-3.5 text-left cursor-pointer transition-colors relative ${
                    active ? "bg-[#6C63FF]/5 border-l-2 border-[#6C63FF]" : "hover:bg-zinc-900/25"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className={`text-xs truncate ${active ? "font-bold text-zinc-100" : "font-semibold text-zinc-300"}`}>
                      {n.title}
                    </h4>
                    {n.isPinned && <Pin className="h-3.5 w-3.5 text-[#6C63FF] fill-[#6C63FF]/20 shrink-0 mt-0.5" />}
                  </div>
                  <p className="text-[10px] text-zinc-500 truncate mt-1">{cleanContent || "No content outlines..."}</p>
                  <span className="text-[9px] text-zinc-600 block mt-2 font-mono font-bold">{dateStr}</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 3. Text Editor Pane (Right Column) */}
      <div className="flex-1 flex flex-col bg-zinc-950/10">
        {activeNote ? (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Note Editor Header Controls */}
            <div className="h-14 px-5 border-b border-zinc-900 flex items-center justify-between shrink-0 bg-zinc-950/40">
              <input
                type="text"
                value={activeNote.title}
                onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
                className="bg-transparent border-none text-sm font-bold text-zinc-100 outline-none w-1/2 focus:border-b focus:border-zinc-800"
              />
              
              <div className="flex items-center gap-3.5">
                {/* Pin note button */}
                <button
                  onClick={() => updateNote(activeNote.id, { isPinned: !activeNote.isPinned })}
                  className={`p-1.5 rounded border transition-colors ${
                    activeNote.isPinned 
                      ? "bg-[#6C63FF]/15 border-[#6C63FF]/30 text-[#6C63FF]" 
                      : "bg-zinc-900 border-zinc-850 text-zinc-500 hover:text-zinc-300"
                  }`}
                  title={activeNote.isPinned ? "Unpin note" : "Pin note"}
                >
                  <Pin className="h-4 w-4" />
                </button>

                {/* Edit / Preview Tabs */}
                <div className="flex items-center rounded bg-zinc-900 p-0.5 border border-zinc-850">
                  <button
                    onClick={() => setEditorMode("edit")}
                    className={`p-1 rounded text-xs font-semibold flex items-center gap-1 ${
                      editorMode === "edit" ? "bg-zinc-800 text-[#6C63FF]" : "text-zinc-500"
                    }`}
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Write</span>
                  </button>
                  <button
                    onClick={() => setEditorMode("preview")}
                    className={`p-1 rounded text-xs font-semibold flex items-center gap-1 ${
                      editorMode === "preview" ? "bg-zinc-800 text-[#6C63FF]" : "text-zinc-500"
                    }`}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Preview</span>
                  </button>
                </div>

                {/* Delete Note */}
                <button
                  onClick={() => {
                    if (confirm("Permanently delete this note?")) {
                      deleteNote(activeNote.id);
                      setSelectedNoteId(null);
                    }
                  }}
                  className="p-1.5 rounded bg-zinc-900 border border-zinc-850 text-zinc-500 hover:text-[#EF4444] transition-colors"
                  title="Delete note"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Note Editor Workspace body */}
            <div className="flex-1 overflow-hidden p-5">
              {editorMode === "edit" ? (
                <textarea
                  value={activeNote.content}
                  onChange={(e) => updateNote(activeNote.id, { content: e.target.value })}
                  placeholder="# Write title here... Markdown supports: headers, lists, code fences..."
                  className="w-full h-full bg-transparent text-xs text-zinc-200 placeholder-zinc-600 outline-none border-none resize-none font-mono leading-relaxed"
                />
              ) : (
                <div className="w-full h-full overflow-y-auto pr-2 scrollbar-thin select-text">
                  {renderMarkdown(activeNote.content)}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <AlertCircle className="h-10 w-10 text-zinc-700 mb-3" />
            <h4 className="text-xs font-bold text-zinc-400">No Draft Selected</h4>
            <p className="text-[10px] text-zinc-500 max-w-xs mt-1">
              Select an existing note outline from the column list, or create a brand new draft in notebook folder.
            </p>
          </div>
        )}
      </div>

      {/* New Folder Modal (Popup overlay) */}
      {showFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#09090B]/80 backdrop-blur-md" onClick={() => setShowFolderModal(false)} />
          <div className="relative w-full max-w-xs rounded-xl border border-zinc-800 bg-zinc-900 p-5 z-10">
            <h3 className="text-xs font-bold text-zinc-200 mb-3.5">New Notebook Folder</h3>
            <form onSubmit={handleAddFolderSubmit} className="space-y-4">
              <input
                type="text"
                required
                placeholder="Folder title (e.g. Finance)"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 focus:border-[#6C63FF]/60 rounded-lg text-xs text-zinc-150 outline-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowFolderModal(false)}
                  className="px-3 py-1.5 text-xs font-semibold rounded bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-semibold rounded bg-[#6C63FF] text-white hover:bg-[#5b52f0]"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
