"use client";

import React, { useState } from "react";
import { useWorkspace, ContentItem, Platform, Priority, ContentCategory, ContentStatus } from "@/context/WorkspaceContext";
import { 
  Search, Grid, List, Star, Archive, Trash2, Edit3, Plus, 
  ExternalLink, X, Filter, Sparkles, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const ContentView: React.FC = () => {
  const { 
    contentItems, 
    addContentItem, 
    updateContentItem, 
    deleteContentItem 
  } = useWorkspace();

  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  
  // Filters
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | "All">("All");
  const [selectedPriority, setSelectedPriority] = useState<Priority | "All">("All");
  const [selectedCategory, setSelectedCategory] = useState<ContentCategory | "All">("All");
  const [selectedStatus, setSelectedStatus] = useState<ContentStatus | "All">("All");
  const [viewFavorites, setViewFavorites] = useState(false);
  const [viewArchived, setViewArchived] = useState(false);

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);

  // Form Fields for Create / Edit
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formPlatform, setFormPlatform] = useState<Platform>("YouTube");
  const [formPriority, setFormPriority] = useState<Priority>("Medium");
  const [formCategory, setFormCategory] = useState<ContentCategory>("Long Form");
  const [formDeadline, setFormDeadline] = useState("");
  const [formStatus, setFormStatus] = useState<ContentStatus>("Ideas");
  const [formTags, setFormTags] = useState("");
  const [formLinks, setFormLinks] = useState("");

  const platforms: (Platform | "All")[] = ["All", "YouTube", "Instagram", "TikTok", "Twitter", "LinkedIn", "Other"];
  const priorities: (Priority | "All")[] = ["All", "High", "Medium", "Low"];
  const categories: (ContentCategory | "All")[] = ["All", "Long Form", "Scripts", "Reels", "Shorts", "Posts", "Live Streams", "Community Posts", "Ideas"];
  const statuses: (ContentStatus | "All")[] = ["All", "Ideas", "Research", "Writing", "Editing", "Thumbnail", "Review", "Scheduled", "Published"];

  // Open creation modal
  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormTitle("");
    setFormDesc("");
    setFormPlatform("YouTube");
    setFormPriority("Medium");
    setFormCategory("Long Form");
    setFormDeadline(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
    setFormStatus("Ideas");
    setFormTags("");
    setFormLinks("");
    setModalOpen(true);
  };

  // Open edit modal
  const handleOpenEdit = (item: ContentItem) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormDesc(item.description);
    setFormPlatform(item.platform);
    setFormPriority(item.priority);
    setFormCategory(item.category);
    setFormDeadline(item.deadline);
    setFormStatus(item.status);
    setFormTags(item.tags.join(", "));
    setFormLinks(item.referenceLinks.join(", "));
    setModalOpen(true);
  };

  // Save Modal Submit
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle) return;

    const parsedTags = formTags.split(",").map(t => t.trim()).filter(t => t.length > 0);
    const parsedLinks = formLinks.split(",").map(l => l.trim()).filter(l => l.length > 0);

    const payload = {
      title: formTitle,
      description: formDesc,
      platform: formPlatform,
      priority: formPriority,
      category: formCategory,
      deadline: formDeadline,
      status: formStatus,
      tags: parsedTags,
      referenceLinks: parsedLinks,
      isFavorite: editingItem ? editingItem.isFavorite : false,
      isArchived: editingItem ? editingItem.isArchived : false,
    };

    if (editingItem) {
      updateContentItem(editingItem.id, payload);
    } else {
      addContentItem(payload);
    }
    setModalOpen(false);
  };

  // Filtered List
  const filteredItems = contentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                          item.description.toLowerCase().includes(search.toLowerCase()) ||
                          item.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    
    const matchesPlatform = selectedPlatform === "All" || item.platform === selectedPlatform;
    const matchesPriority = selectedPriority === "All" || item.priority === selectedPriority;
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesStatus = selectedStatus === "All" || item.status === selectedStatus;
    const matchesFavorite = !viewFavorites || item.isFavorite;
    const matchesArchived = item.isArchived === viewArchived;

    return matchesSearch && matchesPlatform && matchesPriority && matchesCategory && matchesStatus && matchesFavorite && matchesArchived;
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-[#09090B] scrollbar-thin select-none">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div className="flex items-center gap-3 w-full sm:max-w-xs relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search items, descriptions, tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 focus:border-[#6C63FF]/60 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
          {/* Favorites Filter Button */}
          <button
            onClick={() => setViewFavorites(!viewFavorites)}
            className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              viewFavorites 
                ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/30" 
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Star className={`h-4 w-4 ${viewFavorites ? "fill-yellow-500" : ""}`} />
            <span className="hidden sm:inline">Favorites</span>
          </button>

          {/* Archived Filter Button */}
          <button
            onClick={() => setViewArchived(!viewArchived)}
            className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              viewArchived 
                ? "bg-zinc-800 text-white border-zinc-700" 
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Archive className="h-4 w-4" />
            <span className="hidden sm:inline">Archived</span>
          </button>

          {/* Layout switches */}
          <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-900 p-0.5">
            <button 
              onClick={() => setLayout("grid")}
              className={`p-1.5 rounded-md ${layout === "grid" ? "bg-zinc-800 text-[#6C63FF]" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setLayout("list")}
              className={`p-1.5 rounded-md ${layout === "list" ? "bg-zinc-800 text-[#6C63FF]" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {/* Add Content Button */}
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-gradient-to-tr from-[#6C63FF] to-[#8B5CF6] text-white shadow-md shadow-[#6C63FF]/20 hover:shadow-[#6C63FF]/30 active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Create Item</span>
          </button>
        </div>
      </div>

      {/* Filter Row Section */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-zinc-900 bg-zinc-950/20">
        <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-semibold uppercase tracking-wider shrink-0 mr-2">
          <Filter className="h-3.5 w-3.5" />
          <span>Filters</span>
        </div>

        {/* Platform Filter */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-zinc-500 font-semibold">Platform:</span>
          <select 
            value={selectedPlatform} 
            onChange={(e) => setSelectedPlatform(e.target.value as Platform | "All")}
            className="bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 rounded px-2 py-1 outline-none focus:border-[#6C63FF]/60 cursor-pointer"
          >
            {platforms.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-zinc-500 font-semibold">Type:</span>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value as ContentCategory | "All")}
            className="bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 rounded px-2 py-1 outline-none focus:border-[#6C63FF]/60 cursor-pointer"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-zinc-500 font-semibold">Priority:</span>
          <select 
            value={selectedPriority} 
            onChange={(e) => setSelectedPriority(e.target.value as Priority | "All")}
            className="bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 rounded px-2 py-1 outline-none focus:border-[#6C63FF]/60 cursor-pointer"
          >
            {priorities.map(pr => <option key={pr} value={pr}>{pr}</option>)}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-zinc-500 font-semibold">Status:</span>
          <select 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value as ContentStatus | "All")}
            className="bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 rounded px-2 py-1 outline-none focus:border-[#6C63FF]/60 cursor-pointer"
          >
            {statuses.map(st => <option key={st} value={st}>{st}</option>)}
          </select>
        </div>
      </div>

      {/* Database Listing (Grid or List Layout) */}
      <div>
        {filteredItems.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-zinc-850 rounded-xl bg-zinc-950/10 flex flex-col items-center justify-center p-6">
            <AlertCircle className="h-10 w-10 text-zinc-650 mb-3" />
            <h4 className="text-sm font-bold text-zinc-350">No Content Items Match Filters</h4>
            <p className="text-xs text-zinc-500 max-w-sm mt-1">Try resetting the filters or create a new item to get started in this workspace section.</p>
            <button 
              onClick={handleOpenCreate}
              className="mt-4 px-3.5 py-1.5 text-xs font-semibold rounded bg-[#6C63FF]/15 hover:bg-[#6C63FF]/25 border border-[#6C63FF]/30 text-[#6C63FF] transition-all"
            >
              Create First Item
            </button>
          </div>
        ) : layout === "grid" ? (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map((item) => (
              <div 
                key={item.id}
                className="p-5 rounded-xl border border-zinc-900 bg-zinc-900/10 hover:bg-zinc-900/30 hover:border-zinc-850 transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Accent glow line on top of card */}
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#6C63FF]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider bg-zinc-900 border border-zinc-800 text-zinc-400">
                      {item.platform}
                    </span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => updateContentItem(item.id, { isFavorite: !item.isFavorite })}
                        className="text-zinc-650 hover:text-yellow-500 transition-colors"
                      >
                        <Star className={`h-4 w-4 ${item.isFavorite ? "text-yellow-500 fill-yellow-500" : ""}`} />
                      </button>
                      
                      <button 
                        onClick={() => updateContentItem(item.id, { isArchived: !item.isArchived })}
                        className="text-zinc-650 hover:text-zinc-300 transition-colors"
                      >
                        <Archive className={`h-4 w-4 ${item.isArchived ? "text-[#6C63FF]" : ""}`} />
                      </button>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 
                    onClick={() => handleOpenEdit(item)}
                    className="text-sm font-bold text-zinc-200 group-hover:text-white cursor-pointer transition-colors leading-relaxed line-clamp-1"
                  >
                    {item.title}
                  </h3>
                  <p className="text-zinc-400 text-xs mt-1.5 leading-relaxed line-clamp-2">{item.description}</p>

                  {/* Tags */}
                  {item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3.5">
                      {item.tags.map((tag) => (
                        <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-850/80 text-zinc-400">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="border-t border-zinc-900 mt-5 pt-4 flex items-center justify-between">
                  <div className="text-[10px] text-zinc-500 font-semibold">
                    Due: <span className="text-zinc-350 font-mono">{item.deadline}</span>
                  </div>
                  
                  <div className="flex items-center gap-2.5">
                    <span className="text-[9px] font-bold uppercase text-[#6C63FF] bg-[#6C63FF]/10 border border-[#6C63FF]/20 px-2 py-0.5 rounded">
                      {item.status}
                    </span>
                    <button 
                      onClick={() => handleOpenEdit(item)}
                      className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors"
                      title="Edit Item"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button 
                      onClick={() => deleteContentItem(item.id)}
                      className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-[#EF4444] transition-colors"
                      title="Delete Item"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="rounded-xl border border-zinc-900 bg-zinc-950/20 overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs text-zinc-400">
              <thead className="border-b border-zinc-900 bg-zinc-950/50 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Platform</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Deadline</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-900/20 transition-colors">
                    <td className="p-4 font-semibold text-zinc-300 shrink-0">
                      <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 font-bold uppercase tracking-wider text-[9px]">
                        {item.platform}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 max-w-xs sm:max-w-md truncate">
                        <button 
                          onClick={() => updateContentItem(item.id, { isFavorite: !item.isFavorite })}
                          className="text-zinc-650 hover:text-yellow-500"
                        >
                          <Star className={`h-3.5 w-3.5 ${item.isFavorite ? "text-yellow-500 fill-yellow-500" : ""}`} />
                        </button>
                        <span 
                          onClick={() => handleOpenEdit(item)}
                          className="font-bold text-zinc-200 hover:text-white cursor-pointer truncate"
                        >
                          {item.title}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-zinc-400 font-semibold">{item.category}</td>
                    <td className="p-4">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                        item.priority === "High" ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                        item.priority === "Medium" ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20" :
                        "bg-zinc-800 text-zinc-400 border border-zinc-700"
                      }`}>
                        {item.priority}
                      </span>
                    </td>
                    <td className="p-4 text-[#6C63FF] font-bold">{item.status}</td>
                    <td className="p-4 font-mono font-semibold text-zinc-500">{item.deadline}</td>
                    <td className="p-4 text-right">
                      <div className="inline-flex gap-2.5">
                        <button 
                          onClick={() => handleOpenEdit(item)}
                          className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => deleteContentItem(item.id)}
                          className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-[#EF4444] transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Editor & Creation Modal Dialog overlay */}
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

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-xl rounded-xl border border-zinc-800 bg-zinc-900/90 shadow-2xl backdrop-blur-xl z-10 overflow-hidden"
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/40">
                <h3 className="text-sm font-bold text-zinc-200">
                  {editingItem ? "Edit Content Card" : "New Content Concept"}
                </h3>
                <button 
                  onClick={() => setModalOpen(false)}
                  className="text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSave} className="p-5 space-y-4 max-h-[500px] overflow-y-auto">
                <div>
                  <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                    Concept Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter catchy headline or title"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 focus:border-[#6C63FF]/60 rounded-lg text-xs text-zinc-100 placeholder-zinc-600 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                    Description & Concept Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe what this concept is about, target hook ideas, outline details..."
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 focus:border-[#6C63FF]/60 rounded-lg text-xs text-zinc-100 placeholder-zinc-650 outline-none transition-colors resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                      Platform Channel
                    </label>
                    <select
                      value={formPlatform}
                      onChange={(e) => setFormPlatform(e.target.value as Platform)}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 focus:border-[#6C63FF]/60 rounded-lg text-xs text-zinc-300 outline-none cursor-pointer"
                    >
                      {platforms.filter(p => p !== "All").map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                      Content Category
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as ContentCategory)}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 focus:border-[#6C63FF]/60 rounded-lg text-xs text-zinc-300 outline-none cursor-pointer"
                    >
                      {categories.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                      Priority Level
                    </label>
                    <select
                      value={formPriority}
                      onChange={(e) => setFormPriority(e.target.value as Priority)}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 focus:border-[#6C63FF]/60 rounded-lg text-xs text-zinc-300 outline-none cursor-pointer"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                      Workflow Status
                    </label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as ContentStatus)}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 focus:border-[#6C63FF]/60 rounded-lg text-xs text-zinc-300 outline-none cursor-pointer"
                    >
                      {statuses.filter(s => s !== "All").map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                      Deadline / Release Date
                    </label>
                    <input
                      type="date"
                      value={formDeadline}
                      onChange={(e) => setFormDeadline(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 focus:border-[#6C63FF]/60 rounded-lg text-xs text-zinc-300 outline-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                      Tags (Comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. tutorial, design, nextjs"
                      value={formTags}
                      onChange={(e) => setFormTags(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 focus:border-[#6C63FF]/60 rounded-lg text-xs text-zinc-100 placeholder-zinc-600 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                    Reference URLs (Comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="https://example.com/source, https://news.ycombinator.com"
                    value={formLinks}
                    onChange={(e) => setFormLinks(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 focus:border-[#6C63FF]/60 rounded-lg text-xs text-zinc-100 placeholder-zinc-600 outline-none transition-colors"
                  />
                </div>

                {/* Footer Buttons */}
                <div className="border-t border-zinc-850 pt-4 flex justify-end gap-3.5">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-tr from-[#6C63FF] to-[#8B5CF6] text-white shadow-md shadow-[#6C63FF]/20 hover:shadow-[#6C63FF]/30 transition-all"
                  >
                    {editingItem ? "Update Item" : "Create Item"}
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
