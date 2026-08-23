"use client";

import React, { useState } from "react";
import { useWorkspace, Asset } from "@/context/WorkspaceContext";
import { 
  Folder, FolderPlus, UploadCloud, FileVideo, FileImage, 
  FileAudio, FileText, Trash2, Grid, List, Plus, X, Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const AssetView: React.FC = () => {
  const { assets, assetFolders, addAsset, deleteAsset, addAssetFolder } = useWorkspace();
  const [activeFolder, setActiveFolder] = useState("Brand Kit");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // New folder dialog
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const getFileIcon = (type: Asset["type"]) => {
    switch (type) {
      case "video": return <FileVideo className="h-5 w-5 text-red-400" />;
      case "image": return <FileImage className="h-5 w-5 text-blue-400" />;
      case "audio": return <FileAudio className="h-5 w-5 text-green-400" />;
      default: return <FileText className="h-5 w-5 text-zinc-400" />;
    }
  };

  const folderAssets = assets.filter(a => a.folder === activeFolder);

  // Simulated Upload
  const triggerSimulatedUpload = (name: string, sizeBytes: number, type: Asset["type"]) => {
    setUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            addAsset({
              name,
              size: (sizeBytes / (1024 * 1024)).toFixed(1) + " MB",
              type,
              folder: activeFolder,
              url: `/assets/${name}`
            });
            setUploading(false);
          }, 300);
          return 100;
        }
        return prev + 25;
      });
    }, 150);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      let type: Asset["type"] = "document";
      if (file.type.startsWith("image/")) type = "image";
      else if (file.type.startsWith("video/")) type = "video";
      else if (file.type.startsWith("audio/")) type = "audio";

      triggerSimulatedUpload(file.name, file.size, type);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      let type: Asset["type"] = "document";
      if (file.type.startsWith("image/")) type = "image";
      else if (file.type.startsWith("video/")) type = "video";
      else if (file.type.startsWith("audio/")) type = "audio";

      triggerSimulatedUpload(file.name, file.size, type);
    }
  };

  const handleAddFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      addAssetFolder(newFolderName.trim());
      setActiveFolder(newFolderName.trim());
      setNewFolderName("");
      setShowFolderModal(false);
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden h-[calc(100vh-64px)] select-none">
      
      {/* Left Column: Folders */}
      <div className="w-52 border-r border-zinc-900 bg-zinc-950 flex flex-col justify-between shrink-0">
        <div className="p-3.5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-wider">Asset Vault</h3>
            <button 
              onClick={() => setShowFolderModal(true)}
              className="p-1 rounded text-zinc-500 hover:text-zinc-350 hover:bg-zinc-900 transition-colors"
            >
              <FolderPlus className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-1">
            {assetFolders.map(f => {
              const active = activeFolder === f;
              const count = assets.filter(a => a.folder === f).length;
              return (
                <button
                  key={f}
                  onClick={() => setActiveFolder(f)}
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
      </div>

      {/* Right Column: Files Grid & Uploader */}
      <div className="flex-1 flex flex-col p-5 space-y-5 bg-zinc-950/10 overflow-y-auto">
        
        {/* Top Control Header */}
        <div className="flex justify-between items-center shrink-0 border-b border-zinc-900 pb-4">
          <div>
            <h3 className="text-sm font-bold text-zinc-200">{activeFolder} Files</h3>
            <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Store brand and raw content resources</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Layout switch */}
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

            {/* Quick Upload Action */}
            <label className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-gradient-to-tr from-[#6C63FF] to-[#8B5CF6] text-white shadow-md shadow-[#6C63FF]/20 cursor-pointer active:scale-95 transition-all">
              <UploadCloud className="h-4 w-4" />
              <span>Upload File</span>
              <input 
                type="file" 
                onChange={handleFileChange} 
                className="hidden" 
              />
            </label>
          </div>
        </div>

        {/* Drag and Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all ${
            dragOver 
              ? "border-[#6C63FF] bg-[#6C63FF]/5" 
              : "border-zinc-900 bg-zinc-900/10 hover:bg-zinc-900/20 hover:border-zinc-800"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 text-[#6C63FF] animate-spin" />
              <h4 className="text-xs font-bold text-zinc-200">Uploading Assets... {uploadProgress}%</h4>
              <div className="h-1.5 w-48 rounded-full bg-zinc-900 border border-zinc-800 relative overflow-hidden">
                <div className="h-full bg-[#6C63FF] rounded-full transition-all duration-150" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          ) : (
            <>
              <UploadCloud className="h-8 w-8 text-zinc-500 mb-3" />
              <h4 className="text-xs font-bold text-zinc-300">Drag & drop files here to upload</h4>
              <p className="text-[10px] text-zinc-500 mt-1 max-w-xs">Supports videos, thumbnails, overlays, script outlines, and music tracks</p>
            </>
          )}
        </div>

        {/* Asset Listing */}
        <div className="flex-1">
          {folderAssets.length === 0 ? (
            <div className="py-20 text-center text-xs text-zinc-600">No files in this folder.</div>
          ) : layout === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {folderAssets.map((asset) => (
                <div 
                  key={asset.id}
                  className="p-4 rounded-xl border border-zinc-900 bg-zinc-900/10 hover:bg-zinc-900/30 hover:border-zinc-850 flex flex-col justify-between group transition-all"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="h-9 w-9 rounded-lg bg-zinc-950/40 flex items-center justify-center shrink-0">
                      {getFileIcon(asset.type)}
                    </div>
                    
                    <button
                      onClick={() => deleteAsset(asset.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-red-500 transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-xs font-bold text-zinc-200 truncate leading-relaxed" title={asset.name}>
                      {asset.name}
                    </h4>
                    <div className="flex justify-between items-center text-[9px] text-zinc-500 mt-1.5 font-mono">
                      <span>{asset.size}</span>
                      <span>{new Date(asset.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-zinc-900 bg-zinc-950/20 overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs text-zinc-400">
                <thead className="border-b border-zinc-900 bg-zinc-950/50 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Type</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">File Size</th>
                    <th className="p-4">Upload Date</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {folderAssets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-zinc-900/20 transition-colors">
                      <td className="p-4 shrink-0">{getFileIcon(asset.type)}</td>
                      <td className="p-4 font-semibold text-zinc-200 truncate max-w-xs">{asset.name}</td>
                      <td className="p-4 text-zinc-400 font-mono font-bold">{asset.size}</td>
                      <td className="p-4 text-zinc-500 font-mono">{new Date(asset.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => deleteAsset(asset.id)}
                          className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-red-500"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* New Folder Modal */}
      {showFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#09090B]/80 backdrop-blur-md" onClick={() => setShowFolderModal(false)} />
          <div className="relative w-full max-w-xs rounded-xl border border-zinc-800 bg-zinc-900 p-5 z-10">
            <h3 className="text-xs font-bold text-zinc-200 mb-3.5">New Asset Folder</h3>
            <form onSubmit={handleAddFolder} className="space-y-4">
              <input
                type="text"
                required
                placeholder="Folder title (e.g. SFX overlays)"
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
