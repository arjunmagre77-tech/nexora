"use client";

import React, { useState } from "react";
import { useWorkspace, Sponsor, SponsorStatus } from "@/context/WorkspaceContext";
import { 
  Plus, Handshake, Mail, Phone, DollarSign, Calendar, 
  Trash2, Edit3, X, ArrowLeft, ArrowRight, TrendingUp, DollarSign as DollarIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const SponsorsView: React.FC = () => {
  const { sponsors, addSponsor, updateSponsor, deleteSponsor } = useWorkspace();
  const [draggedSponsorId, setDraggedSponsorId] = useState<string | null>(null);
  
  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);

  // Form Fields
  const [formBrand, setFormBrand] = useState("");
  const [formContact, setFormContact] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formAmount, setFormAmount] = useState(0);
  const [formCampaign, setFormCampaign] = useState("");
  const [formStatus, setFormStatus] = useState<SponsorStatus>("Lead");
  const [formFollowUp, setFormFollowUp] = useState("");
  const [formNotes, setFormNotes] = useState("");

  const stages: SponsorStatus[] = [
    "Lead", "Cold Email", "Waiting", "Negotiating", "Accepted", "Completed", "Paid"
  ];

  // Pipeline metrics
  const totalPipelineValue = sponsors.reduce((acc, curr) => acc + curr.offerAmount, 0);
  const closedRevenue = sponsors
    .filter(s => s.status === "Paid")
    .reduce((acc, curr) => acc + curr.offerAmount, 0);
  
  const getStageColor = (status: SponsorStatus) => {
    switch (status) {
      case "Lead": return "bg-zinc-600";
      case "Cold Email": return "bg-blue-500";
      case "Waiting": return "bg-yellow-500";
      case "Negotiating": return "bg-orange-500";
      case "Accepted": return "bg-cyan-500";
      case "Completed": return "bg-emerald-500";
      case "Paid": return "bg-[#6C63FF]";
      default: return "bg-zinc-500";
    }
  };

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    setDraggedSponsorId(id);
  };

  const handleDragEnd = () => {
    setDraggedSponsorId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: SponsorStatus) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData("text/plain") || draggedSponsorId;
    if (itemId) {
      updateSponsor(itemId, { status: targetStatus });
    }
    setDraggedSponsorId(null);
  };

  // Move manual buttons
  const moveDeal = (id: string, currentStatus: SponsorStatus, direction: "left" | "right") => {
    const currentIndex = stages.indexOf(currentStatus);
    let nextIndex = direction === "right" ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex >= 0 && nextIndex < stages.length) {
      updateSponsor(id, { status: stages[nextIndex] });
    }
  };

  // Add / Edit Modal openers
  const openAddSponsor = () => {
    setEditingSponsor(null);
    setFormBrand("");
    setFormContact("");
    setFormEmail("");
    setFormPhone("");
    setFormAmount(50000);
    setFormCampaign("Integrated Sponsorship Segment");
    setFormStatus("Lead");
    setFormFollowUp(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
    setFormNotes("");
    setModalOpen(true);
  };

  const openEditSponsor = (sponsor: Sponsor) => {
    setEditingSponsor(sponsor);
    setFormBrand(sponsor.brandName);
    setFormContact(sponsor.contactPerson);
    setFormEmail(sponsor.email);
    setFormPhone(sponsor.phone);
    setFormAmount(sponsor.offerAmount);
    setFormCampaign(sponsor.campaignName);
    setFormStatus(sponsor.status);
    setFormFollowUp(sponsor.nextFollowUp);
    setFormNotes(sponsor.notes);
    setModalOpen(true);
  };

  const handleSaveSponsor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formBrand || !formContact) return;

    const payload = {
      brandName: formBrand,
      contactPerson: formContact,
      email: formEmail,
      phone: formPhone,
      offerAmount: Number(formAmount),
      campaignName: formCampaign,
      status: formStatus,
      nextFollowUp: formFollowUp,
      notes: formNotes
    };

    if (editingSponsor) {
      updateSponsor(editingSponsor.id, payload);
    } else {
      addSponsor(payload);
    }
    setModalOpen(false);
  };

  return (
    <div className="flex-1 overflow-x-auto p-4 md:p-6 bg-[#09090B] flex flex-col select-none h-full space-y-6">
      
      {/* CRM Statistics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 shrink-0">
        
        {/* Total Pipeline */}
        <div className="p-4 border border-zinc-900 bg-zinc-950/40 rounded-xl flex items-center justify-between">
          <div>
            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Pipeline Value</h4>
            <h3 className="text-xl font-black text-white mt-1">₹{totalPipelineValue.toLocaleString()}</h3>
          </div>
          <div className="h-8.5 w-8.5 rounded-lg bg-[#6C63FF]/15 border border-[#6C63FF]/30 flex items-center justify-center text-[#6C63FF]">
            <TrendingUp className="h-4.5 w-4.5" />
          </div>
        </div>

        {/* Collected Revenue */}
        <div className="p-4 border border-zinc-900 bg-zinc-950/40 rounded-xl flex items-center justify-between">
          <div>
            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Closed Earnings</h4>
            <h3 className="text-xl font-black text-[#22C55E] mt-1">₹{closedRevenue.toLocaleString()}</h3>
          </div>
          <div className="h-8.5 w-8.5 rounded-lg bg-[#22C55E]/15 border border-[#22C55E]/30 flex items-center justify-center text-[#22C55E]">
            <DollarIcon className="h-4.5 w-4.5" />
          </div>
        </div>

        {/* Add Lead button container */}
        <div className="p-1 border border-zinc-900 bg-zinc-950/40 rounded-xl flex items-center justify-center">
          <button
            onClick={openAddSponsor}
            className="flex items-center justify-center gap-1.5 w-full h-full py-3 text-xs font-semibold rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-850 hover:border-zinc-700 transition-all"
          >
            <Plus className="h-4 w-4 text-[#6C63FF]" />
            <span>Add Sponsor Lead</span>
          </button>
        </div>

      </div>

      {/* Kanban Pipeline Columns */}
      <div className="flex gap-4 flex-1 items-start min-h-[500px] pb-4 overflow-y-hidden">
        {stages.map((stage) => {
          const stageSponsors = sponsors.filter(s => s.status === stage);
          const stageValue = stageSponsors.reduce((acc, curr) => acc + curr.offerAmount, 0);

          return (
            <div
              key={stage}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage)}
              className="w-72 shrink-0 flex flex-col h-full max-h-[70vh] rounded-xl border border-zinc-900 bg-zinc-950/20 backdrop-blur-xs p-3 space-y-3"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${getStageColor(stage)}`} />
                  <h3 className="text-xs font-extrabold text-zinc-200">{stage}</h3>
                  <span className="text-[9px] bg-zinc-900 border border-zinc-850 text-zinc-500 font-bold px-1.5 rounded-full">
                    {stageSponsors.length}
                  </span>
                </div>
                <span className="text-[9px] font-mono font-bold text-zinc-500">
                  ₹{(stageValue / 1000).toFixed(0)}k
                </span>
              </div>

              {/* Deal Cards list */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
                {stageSponsors.length === 0 ? (
                  <div className="py-12 text-center text-[10px] text-zinc-650 border border-dashed border-zinc-900 rounded-lg">
                    No sponsor deals
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {stageSponsors.map((deal) => (
                      <motion.div key={deal.id} layout>
                        <div
                          draggable
                          onDragStart={(e: React.DragEvent) => handleDragStart(e, deal.id)}
                          onDragEnd={handleDragEnd}
                          className={`p-3.5 rounded-lg border border-zinc-900 bg-zinc-900/10 hover:bg-zinc-900/35 hover:border-zinc-850 cursor-grab active:cursor-grabbing group relative ${
                            draggedSponsorId === deal.id ? "opacity-35" : ""
                          }`}
                        >
                        {/* Status border left */}
                        <div className={`absolute top-0 bottom-0 left-0 w-1 rounded-l-lg ${getStageColor(deal.status)}`} />

                        {/* Title & Amount */}
                        <div className="flex items-start justify-between gap-1">
                          <h4 
                            onClick={() => openEditSponsor(deal)}
                            className="text-xs font-bold text-zinc-200 hover:text-white cursor-pointer transition-colors leading-relaxed truncate max-w-[120px]"
                          >
                            {deal.brandName}
                          </h4>
                          <span className="text-xs font-bold text-[#22C55E] font-mono shrink-0">
                            ₹{deal.offerAmount.toLocaleString()}
                          </span>
                        </div>

                        {/* Campaign Name */}
                        <p className="text-[10px] text-zinc-400 mt-1 line-clamp-1">{deal.campaignName}</p>

                        {/* Contact details */}
                        <div className="flex items-center gap-1.5 text-[9px] text-zinc-500 mt-3 pt-2.5 border-t border-zinc-900/80">
                          <Mail className="h-3 w-3 shrink-0 text-zinc-600" />
                          <span className="truncate max-w-[100px]">{deal.contactPerson}</span>
                        </div>

                        {/* Footer & navigation */}
                        <div className="flex justify-between items-center text-[9px] text-zinc-550 mt-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 shrink-0 text-zinc-600" />
                            <span className="font-mono">{deal.nextFollowUp.split("-").slice(1).join("-")}</span>
                          </div>

                          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => moveDeal(deal.id, deal.status, "left")}
                              disabled={stage === "Lead"}
                              className="p-0.5 rounded hover:bg-zinc-850 text-zinc-500 disabled:opacity-30"
                            >
                              <ArrowLeft className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => moveDeal(deal.id, deal.status, "right")}
                              disabled={stage === "Paid"}
                              className="p-0.5 rounded hover:bg-zinc-850 text-zinc-500 disabled:opacity-30"
                            >
                              <ArrowRight className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => deleteSponsor(deal.id)}
                              className="p-0.5 rounded hover:bg-zinc-850 text-zinc-500 hover:text-red-500"
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
            </div>
          );
        })}
      </div>

      {/* Add / Edit Deal Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 bg-[#09090B]/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900/90 shadow-2xl backdrop-blur-xl p-5 z-10"
            >
              <div className="flex justify-between items-center pb-3 border-b border-zinc-800 mb-4 bg-zinc-950/20">
                <h3 className="text-xs font-bold text-zinc-200">
                  {editingSponsor ? "Edit Sponsor Deal" : "New Sponsor outreach"}
                </h3>
                <button onClick={() => setModalOpen(false)} className="text-zinc-500 hover:text-zinc-300">
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <form onSubmit={handleSaveSponsor} className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vercel, Notion"
                      value={formBrand}
                      onChange={(e) => setFormBrand(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 focus:border-[#6C63FF]/60 rounded-lg text-xs text-zinc-100 placeholder-zinc-650 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                      Deal Value (INR)
                    </label>
                    <input
                      type="number"
                      required
                      value={formAmount}
                      onChange={(e) => setFormAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 focus:border-[#6C63FF]/60 rounded-lg text-xs text-zinc-100 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                    Campaign Scope Details
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dedicated video review, 60s midroll integration"
                    value={formCampaign}
                    onChange={(e) => setFormCampaign(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 focus:border-[#6C63FF]/60 rounded-lg text-xs text-zinc-100 placeholder-zinc-650 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                      Primary Contact Person
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Name"
                      value={formContact}
                      onChange={(e) => setFormContact(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 focus:border-[#6C63FF]/60 rounded-lg text-xs text-zinc-100 placeholder-zinc-650 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="marketing@brand.com"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 focus:border-[#6C63FF]/60 rounded-lg text-xs text-zinc-100 placeholder-zinc-650 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                      Pipeline Stage
                    </label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as SponsorStatus)}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 focus:border-[#6C63FF]/60 rounded-lg text-xs text-zinc-300 outline-none cursor-pointer"
                    >
                      {stages.map(st => <option key={st} value={st}>{st}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                      Next Follow Up Date
                    </label>
                    <input
                      type="date"
                      value={formFollowUp}
                      onChange={(e) => setFormFollowUp(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 focus:border-[#6C63FF]/60 rounded-lg text-xs text-zinc-300 outline-none cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                    Deal Notes / Negotiation progress
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Offer limits, messaging guidelines, past sponsor history..."
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 focus:border-[#6C63FF]/60 rounded-lg text-xs text-zinc-100 placeholder-zinc-650 outline-none transition-colors resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-3.5 py-1.5 text-xs font-semibold rounded bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 text-xs font-semibold rounded bg-[#6C63FF] hover:bg-[#5b52f0] text-white"
                  >
                    {editingSponsor ? "Update Lead" : "Add Lead"}
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
