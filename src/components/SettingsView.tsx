"use client";

import React, { useState } from "react";
import { useWorkspace, UserSettings } from "@/context/WorkspaceContext";
import { 
  User, Laptop, Link2, CreditCard, Check, 
  Tv2, Camera, Hash, Terminal, Globe, Loader2
} from "lucide-react";

// Map platform icons to available lucide-react equivalents
const Youtube = Tv2;
const Instagram = Camera;
const Twitter = Hash;
const Github = Terminal;

export const SettingsView: React.FC = () => {
  const { settings, updateSettings } = useWorkspace();
  const [activeSubTab, setActiveSubTab] = useState<"profile" | "accounts" | "billing">("profile");

  // Local Form state
  const [formName, setFormName] = useState(settings.profileName);
  const [formEmail, setFormEmail] = useState(settings.profileEmail);
  const [formBio, setFormBio] = useState(settings.profileBio);
  const [formAvatar, setFormAvatar] = useState(settings.avatarUrl);
  
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    updateSettings({
      profileName: formName,
      profileEmail: formEmail,
      profileBio: formBio,
      avatarUrl: formAvatar
    });
    setSaving(false);
  };

  const handleToggleAccount = (platform: keyof UserSettings["connectedAccounts"]) => {
    const updatedAccounts = {
      ...settings.connectedAccounts,
      [platform]: !settings.connectedAccounts[platform]
    };
    updateSettings({ connectedAccounts: updatedAccounts });
  };

  const handleSelectPlan = (plan: "Free" | "Pro" | "Team") => {
    updateSettings({ subscriptionPlan: plan });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#09090B] scrollbar-thin select-none max-w-4xl mx-auto space-y-6">
      
      {/* Settings Navigation */}
      <div className="flex items-center gap-4 border-b border-zinc-900 pb-4 shrink-0">
        <button
          onClick={() => setActiveSubTab("profile")}
          className={`text-xs font-bold uppercase tracking-wider pb-1.5 border-b-2 transition-all ${
            activeSubTab === "profile" 
              ? "border-[#6C63FF] text-[#6C63FF]" 
              : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Creator Profile
        </button>
        <button
          onClick={() => setActiveSubTab("accounts")}
          className={`text-xs font-bold uppercase tracking-wider pb-1.5 border-b-2 transition-all ${
            activeSubTab === "accounts" 
              ? "border-[#6C63FF] text-[#6C63FF]" 
              : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Connected Accounts
        </button>
        <button
          onClick={() => setActiveSubTab("billing")}
          className={`text-xs font-bold uppercase tracking-wider pb-1.5 border-b-2 transition-all ${
            activeSubTab === "billing" 
              ? "border-[#6C63FF] text-[#6C63FF]" 
              : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Subscription & Billing
        </button>
      </div>

      {/* Profile Form */}
      {activeSubTab === "profile" && (
        <form onSubmit={handleSaveProfile} className="space-y-5 border border-zinc-900 bg-zinc-950/20 rounded-xl p-6">
          <h3 className="text-sm font-bold text-zinc-200 border-b border-zinc-900 pb-2 mb-4">Profile Information</h3>
          
          <div className="flex items-center gap-5">
            <img 
              src={formAvatar} 
              alt="Avatar Preview" 
              className="h-16 w-16 rounded-full border border-zinc-800 object-cover shrink-0" 
            />
            
            <div className="flex-1">
              <label className="block text-[9px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                Profile Avatar URL
              </label>
              <input
                type="text"
                value={formAvatar}
                onChange={(e) => setFormAvatar(e.target.value)}
                className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 focus:border-[#6C63FF]/60 rounded-lg text-xs text-zinc-300 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[9px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 focus:border-[#6C63FF]/60 rounded-lg text-xs text-zinc-150 outline-none"
              />
            </div>

            <div>
              <label className="block text-[9px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 focus:border-[#6C63FF]/60 rounded-lg text-xs text-zinc-150 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
              Creator Bio
            </label>
            <textarea
              rows={4}
              value={formBio}
              onChange={(e) => setFormBio(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 focus:border-[#6C63FF]/60 rounded-lg text-xs text-zinc-150 outline-none resize-none"
            />
          </div>

          <div className="flex justify-end pt-2 border-t border-zinc-900">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#6C63FF] hover:bg-[#5b52f0] text-white flex items-center gap-1.5 shadow-md shadow-[#6C63FF]/20 active:scale-95 transition-all disabled:opacity-60"
            >
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      )}

      {/* Connected Accounts */}
      {activeSubTab === "accounts" && (
        <div className="border border-zinc-900 bg-zinc-950/20 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-zinc-200 border-b border-zinc-900 pb-2 mb-4">Channel Integrations</h3>
          
          <div className="space-y-3.5">
            {/* YouTube */}
            <div className="flex items-center justify-between p-3.5 rounded-lg border border-zinc-900 bg-zinc-950/30">
              <div className="flex items-center gap-3">
                <div className="h-8.5 w-8.5 rounded-lg bg-red-500/10 text-red-500 border border-red-500/25 flex items-center justify-center">
                  <Youtube className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-200">YouTube Studio</h4>
                  <p className="text-[9px] text-zinc-500">Plan and fetch view/subscriber counts</p>
                </div>
              </div>
              <button
                onClick={() => handleToggleAccount("youtube")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  settings.connectedAccounts.youtube 
                    ? "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30" 
                    : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200"
                }`}
              >
                {settings.connectedAccounts.youtube ? "Connected" : "Connect"}
              </button>
            </div>

            {/* Instagram */}
            <div className="flex items-center justify-between p-3.5 rounded-lg border border-zinc-900 bg-zinc-950/30">
              <div className="flex items-center gap-3">
                <div className="h-8.5 w-8.5 rounded-lg bg-purple-500/10 text-purple-500 border border-purple-500/25 flex items-center justify-center">
                  <Instagram className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-200">Instagram Insights</h4>
                  <p className="text-[9px] text-zinc-500">Analyze reels and demographic metrics</p>
                </div>
              </div>
              <button
                onClick={() => handleToggleAccount("instagram")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  settings.connectedAccounts.instagram 
                    ? "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30" 
                    : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200"
                }`}
              >
                {settings.connectedAccounts.instagram ? "Connected" : "Connect"}
              </button>
            </div>

            {/* Twitter */}
            <div className="flex items-center justify-between p-3.5 rounded-lg border border-zinc-900 bg-zinc-950/30">
              <div className="flex items-center gap-3">
                <div className="h-8.5 w-8.5 rounded-lg bg-cyan-500/10 text-cyan-500 border border-cyan-500/25 flex items-center justify-center">
                  <Twitter className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-200">Twitter / X Developer</h4>
                  <p className="text-[9px] text-zinc-500">Sync text threads and graphics schedules</p>
                </div>
              </div>
              <button
                onClick={() => handleToggleAccount("twitter")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  settings.connectedAccounts.twitter 
                    ? "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30" 
                    : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200"
                }`}
              >
                {settings.connectedAccounts.twitter ? "Connected" : "Connect"}
              </button>
            </div>

            {/* GitHub */}
            <div className="flex items-center justify-between p-3.5 rounded-lg border border-zinc-900 bg-zinc-950/30">
              <div className="flex items-center gap-3">
                <div className="h-8.5 w-8.5 rounded-lg bg-zinc-900 text-white border border-zinc-800 flex items-center justify-center">
                  <Github className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-200">GitHub Developer Auth</h4>
                  <p className="text-[9px] text-zinc-500">Manage code repos for SaaS projects</p>
                </div>
              </div>
              <button
                onClick={() => handleToggleAccount("github")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  settings.connectedAccounts.github 
                    ? "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30" 
                    : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200"
                }`}
              >
                {settings.connectedAccounts.github ? "Connected" : "Connect"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subscription & Billing */}
      {activeSubTab === "billing" && (
        <div className="space-y-6">
          
          {/* Current plan detail */}
          <div className="border border-zinc-900 bg-zinc-950/20 rounded-xl p-6">
            <h3 className="text-sm font-bold text-zinc-200 border-b border-zinc-900 pb-2 mb-4">Current Subscription</h3>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-extrabold text-[#6C63FF]">Nexora {settings.subscriptionPlan}</h4>
                <p className="text-[10px] text-zinc-500 mt-0.5">
                  {settings.subscriptionPlan === "Free" && "Free tier active. Plan limits: 10 items."}
                  {settings.subscriptionPlan === "Pro" && "Professional Tier. Price: ₹399/mo. Renews: Aug 25, 2026."}
                  {settings.subscriptionPlan === "Team" && "Shared Workspace Team. Price: ₹1499/mo. Renews: Aug 25, 2026."}
                </p>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-white">
                  {settings.subscriptionPlan === "Free" ? "₹0" : settings.subscriptionPlan === "Pro" ? "₹399" : "₹1,499"}
                </span>
                <span className="text-zinc-500 text-xs ml-0.5">/ month</span>
              </div>
            </div>
          </div>

          {/* Pricing tiers selection */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Free */}
            <div className={`p-5 rounded-xl border flex flex-col justify-between text-left transition-all ${
              settings.subscriptionPlan === "Free" 
                ? "border-[#6C63FF] bg-[#6C63FF]/5 shadow-md shadow-[#6C63FF]/5" 
                : "border-zinc-900 bg-zinc-950/20 hover:border-zinc-800"
            }`}>
              <div>
                <h4 className="text-xs font-bold text-zinc-200">Free Tier</h4>
                <p className="text-[10px] text-zinc-500 mt-1">Plan, test, write outlines.</p>
                <div className="mt-4 text-xl font-bold text-white">₹0</div>
              </div>
              <button
                type="button"
                onClick={() => handleSelectPlan("Free")}
                disabled={settings.subscriptionPlan === "Free"}
                className="w-full py-1.5 mt-6 text-xs font-semibold rounded bg-zinc-900 border border-zinc-850 hover:border-zinc-700 text-zinc-300 disabled:opacity-40"
              >
                {settings.subscriptionPlan === "Free" ? "Active" : "Downgrade"}
              </button>
            </div>

            {/* Pro */}
            <div className={`p-5 rounded-xl border flex flex-col justify-between text-left transition-all ${
              settings.subscriptionPlan === "Pro" 
                ? "border-[#6C63FF] bg-[#6C63FF]/5 shadow-md shadow-[#6C63FF]/5" 
                : "border-zinc-900 bg-zinc-950/20 hover:border-zinc-800"
            }`}>
              <div>
                <h4 className="text-xs font-bold text-zinc-200">Pro Studio</h4>
                <p className="text-[10px] text-zinc-500 mt-1">Unlimited AI, analytics, CRM pipelines.</p>
                <div className="mt-4 text-xl font-bold text-white">₹399<span className="text-[10px] text-zinc-500 font-normal">/mo</span></div>
              </div>
              <button
                type="button"
                onClick={() => handleSelectPlan("Pro")}
                disabled={settings.subscriptionPlan === "Pro"}
                className="w-full py-1.5 mt-6 text-xs font-semibold rounded bg-zinc-900 border border-zinc-850 hover:border-zinc-700 text-zinc-300 disabled:opacity-40"
              >
                {settings.subscriptionPlan === "Pro" ? "Active" : "Switch Plan"}
              </button>
            </div>

            {/* Team */}
            <div className={`p-5 rounded-xl border flex flex-col justify-between text-left transition-all ${
              settings.subscriptionPlan === "Team" 
                ? "border-[#6C63FF] bg-[#6C63FF]/5 shadow-md shadow-[#6C63FF]/5" 
                : "border-zinc-900 bg-zinc-950/20 hover:border-zinc-800"
            }`}>
              <div>
                <h4 className="text-xs font-bold text-zinc-200">Team Scale</h4>
                <p className="text-[10px] text-zinc-500 mt-1">Shared workspace, permissions controls.</p>
                <div className="mt-4 text-xl font-bold text-white">₹1,499<span className="text-[10px] text-zinc-500 font-normal">/mo</span></div>
              </div>
              <button
                type="button"
                onClick={() => handleSelectPlan("Team")}
                disabled={settings.subscriptionPlan === "Team"}
                className="w-full py-1.5 mt-6 text-xs font-semibold rounded bg-zinc-900 border border-zinc-850 hover:border-zinc-700 text-zinc-300 disabled:opacity-40"
              >
                {settings.subscriptionPlan === "Team" ? "Active" : "Upgrade"}
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
