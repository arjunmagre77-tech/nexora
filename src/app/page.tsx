"use client";

import React from "react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { LandingPage } from "@/components/LandingPage";
import { AuthPages } from "@/components/AuthPages";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { CommandPalette } from "@/components/CommandPalette";

// Views
import { DashboardView } from "@/components/DashboardView";
import { ContentView } from "@/components/ContentView";
import { CalendarView } from "@/components/CalendarView";
import { KanbanView } from "@/components/KanbanView";
import { NotesView } from "@/components/NotesView";
import { AnalyticsView } from "@/components/AnalyticsView";
import { SponsorsView } from "@/components/SponsorsView";
import { GoalsView } from "@/components/GoalsView";
import { AssetView } from "@/components/AssetView";
import { AIAssistantView } from "@/components/AIAssistantView";
import { SettingsView } from "@/components/SettingsView";

export default function Home() {
  const { user, activeTab } = useWorkspace();

  // 1. Render Public Landing Page
  if (activeTab === "LandingPage" && !user) {
    return (
      <>
        <LandingPage />
        <CommandPalette />
      </>
    );
  }

  // 2. Render Auth Flows
  if ((activeTab === "Login" || activeTab === "Signup") && !user) {
    return (
      <>
        <AuthPages initialMode={activeTab === "Login" ? "login" : "signup"} />
        <CommandPalette />
      </>
    );
  }

  // Fallback: If user is not logged in but tries to access workspace tabs, force landing page
  if (!user) {
    return (
      <>
        <LandingPage />
        <CommandPalette />
      </>
    );
  }

  // 3. Render Private SaaS Workspace Layout
  const renderActiveView = () => {
    switch (activeTab) {
      case "Dashboard":
        return <DashboardView />;
      case "Content":
        return <ContentView />;
      case "Calendar":
        return <CalendarView />;
      case "Kanban":
        return <KanbanView />;
      case "Notes":
        return <NotesView />;
      case "Analytics":
        return <AnalyticsView />;
      case "Sponsors":
        return <SponsorsView />;
      case "Goals":
        return <GoalsView />;
      case "Assets":
        return <AssetView />;
      case "AI Assistant":
        return <AIAssistantView />;
      case "Settings":
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#09090B] text-[#F4F4F5] font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Workspace Panel */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        <Navbar />
        
        {/* Core Inner Page View */}
        <main className="flex-1 overflow-hidden min-h-0 relative bg-zinc-950/20">
          {renderActiveView()}
        </main>
      </div>

      {/* Global overlay command palette Ctrl+K */}
      <CommandPalette />
    </div>
  );
}
