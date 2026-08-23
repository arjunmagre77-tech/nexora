"use client";

import React, { useState } from "react";
import { useWorkspace, ContentItem } from "@/context/WorkspaceContext";
import { 
  Sparkles, Eye, Users, DollarSign, Video, Play, 
  Flame, CheckSquare, Plus, ArrowUpRight, BarChart2,
  Calendar, Handshake, ChevronRight, Check
} from "lucide-react";
import { motion } from "framer-motion";

export const DashboardView: React.FC = () => {
  const { 
    contentItems, 
    sponsors, 
    goals, 
    notifications,
    setActiveTab, 
    addContentItem,
    updateContentItem
  } = useWorkspace();

  const [newTaskText, setNewTaskText] = useState("");

  // Statistics Calculation
  const publishedVideos = contentItems.filter(item => item.status === "Published" && item.platform === "YouTube").length;
  const totalPublished = contentItems.filter(item => item.status === "Published").length;
  const activeSponsorsCount = sponsors.filter(s => s.status !== "Completed" && s.status !== "Paid").length;
  const pendingRevenue = sponsors
    .filter(s => s.status === "Accepted" || s.status === "Completed")
    .reduce((acc, curr) => acc + curr.offerAmount, 0);

  // Filter Tasks (Ideas/Research/Writing/Editing that are in progress)
  const todoItems = contentItems.filter(item => item.status !== "Published" && item.status !== "Scheduled").slice(0, 5);

  // Upcoming Scheduled upload
  const upcomingUpload = contentItems
    .filter(item => item.status === "Scheduled")
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())[0];

  // Goals
  const activeGoals = goals.slice(0, 2);

  // Quick Action triggers
  const handleQuickIdea = () => {
    addContentItem({
      title: "New Video Idea: " + new Date().toLocaleDateString(),
      description: "Brainstorming hooks, titles, and structure.",
      platform: "YouTube",
      priority: "Medium",
      category: "Ideas",
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "Ideas",
      tags: [],
      referenceLinks: [],
      isFavorite: false,
      isArchived: false
    });
    setActiveTab("Content");
  };

  const handleToggleTaskStatus = (task: ContentItem) => {
    const statusSequence: ContentItem["status"][] = [
      "Ideas", "Research", "Writing", "Editing", "Thumbnail", "Review", "Scheduled", "Published"
    ];
    const currentIndex = statusSequence.indexOf(task.status);
    if (currentIndex < statusSequence.length - 1) {
      updateContentItem(task.id, { status: statusSequence[currentIndex + 1] });
    }
  };

  // Sparkline generator
  const drawSparkline = (points: number[]) => {
    const width = 100;
    const height = 30;
    const max = Math.max(...points);
    const min = Math.min(...points);
    const range = max - min || 1;
    
    const coordinates = points.map((p, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - ((p - min) / range) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    
    return `M ${coordinates.join(" L ")}`;
  };

  const stats = [
    {
      title: "YouTube Videos",
      value: "89",
      subText: `+${publishedVideos} published this month`,
      icon: Video,
      sparkPoints: [78, 80, 81, 84, 85, 87, 89],
      color: "from-red-500/10 to-transparent text-red-500 border-red-500/20"
    },
    {
      title: "Monthly Views",
      value: "2.4M",
      subText: "+18.2% vs last month",
      icon: Eye,
      sparkPoints: [12, 15, 18, 14, 21, 23, 24],
      color: "from-[#6C63FF]/10 to-transparent text-[#6C63FF] border-[#6C63FF]/20"
    },
    {
      title: "Subscribers",
      value: "42,500",
      subText: "+2.4k this month",
      icon: Users,
      sparkPoints: [38, 39, 39.5, 40.2, 41, 42, 42.5],
      color: "from-[#8B5CF6]/10 to-transparent text-[#8B5CF6] border-[#8B5CF6]/20"
    },
    {
      title: "Revenue (Q3)",
      value: "₹3,50,000",
      subText: `₹${pendingRevenue.toLocaleString()} pending in pipeline`,
      icon: DollarSign,
      sparkPoints: [18, 20, 22, 28, 27, 32, 35],
      color: "from-[#22C55E]/10 to-transparent text-[#22C55E] border-[#22C55E]/20"
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-[#09090B] scrollbar-thin select-none">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border border-zinc-900 bg-zinc-950/40 rounded-xl p-5 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#6C63FF]/25 to-transparent" />
        <div className="relative">
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <span>Welcome Back, Alex Mercer</span>
            <Sparkles className="h-4.5 w-4.5 text-[#8B5CF6] fill-[#8B5CF6]/30" />
          </h2>
          <p className="text-xs text-zinc-400 mt-1">Here is a summary of your workspace activities and milestones for today.</p>
        </div>

        {/* Streak Counter */}
        <div className="flex items-center gap-3 bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-2 self-start md:self-auto shrink-0 shadow-sm">
          <div className="h-8 w-8 rounded-full bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-500">
            <Flame className="h-4.5 w-4.5 fill-orange-500/30" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-200">14 Day Upload Streak</h4>
            <p className="text-[10px] text-zinc-500 font-semibold">Milestone: Reach 30 Days</p>
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div 
              key={idx}
              className={`p-5 rounded-xl border bg-zinc-900/10 backdrop-blur-xs flex flex-col justify-between hover:bg-zinc-900/20 transition-all ${stat.color}`}
            >
              <div className="flex items-start justify-between w-full">
                <div>
                  <h4 className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">{stat.title}</h4>
                  <h3 className="text-2xl font-black text-white mt-1.5">{stat.value}</h3>
                </div>
                <div className="p-2 rounded-lg bg-zinc-900/50 border border-zinc-800 shrink-0">
                  <Icon className="h-4.5 w-4.5" />
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <span className="text-[10px] text-zinc-400 font-semibold truncate max-w-[130px]">{stat.subText}</span>
                {/* SVG sparkline */}
                <svg className="h-6 w-20 text-[#6C63FF] overflow-visible shrink-0" viewBox="0 0 100 30">
                  <path
                    d={drawSparkline(stat.sparkPoints)}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={idx === 0 ? "text-red-500" : idx === 2 ? "text-[#8B5CF6]" : idx === 3 ? "text-[#22C55E]" : "text-[#6C63FF]"}
                  />
                </svg>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 parts wide) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Today's Tasks */}
          <div className="border border-zinc-900 bg-zinc-950/40 rounded-xl p-5">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-zinc-200">Current Work-in-Progress</h3>
                <p className="text-[10px] text-zinc-500">Fast checklist of your active content steps</p>
              </div>
              <button 
                onClick={() => setActiveTab("Content")}
                className="text-xs font-semibold text-[#6C63FF] hover:underline flex items-center gap-0.5"
              >
                <span>View Database</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              {todoItems.length === 0 ? (
                <div className="py-6 text-center text-xs text-zinc-500">No active work in progress. Get writing!</div>
              ) : (
                todoItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-center justify-between p-3 rounded-lg border border-zinc-900 bg-zinc-900/10 hover:bg-zinc-900/35 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleToggleTaskStatus(item)}
                        className="h-4.5 w-4.5 rounded border border-zinc-800 bg-zinc-950 text-[#6C63FF] flex items-center justify-center hover:border-[#6C63FF] transition-colors shrink-0"
                        title="Move to next workflow stage"
                      >
                        <Check className="h-3 w-3 opacity-0 hover:opacity-100 transition-opacity" />
                      </button>
                      <div>
                        <h4 className="text-xs font-semibold text-zinc-200">{item.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider bg-zinc-900 border border-zinc-800 text-zinc-400">
                            {item.platform}
                          </span>
                          <span className="text-[9px] font-semibold text-zinc-500">
                            Current Stage: <span className="text-[#6C63FF]">{item.status}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                      item.priority === "High" ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                      item.priority === "Medium" ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20" :
                      "bg-zinc-800 text-zinc-400 border border-zinc-700"
                    }`}>
                      {item.priority}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions & Goals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Quick Actions */}
            <div className="border border-zinc-900 bg-zinc-950/40 rounded-xl p-5">
              <h3 className="text-sm font-bold text-zinc-200 border-b border-zinc-900 pb-3 mb-4">Quick Studio Tools</h3>
              <div className="grid grid-cols-2 gap-3.5">
                <button 
                  onClick={handleQuickIdea}
                  className="p-3 rounded-lg border border-zinc-850 hover:border-zinc-700 bg-zinc-900/20 text-left hover:bg-zinc-900/50 transition-all flex flex-col gap-2"
                >
                  <div className="h-7 w-7 rounded-md bg-[#6C63FF]/15 border border-[#6C63FF]/30 flex items-center justify-center text-[#6C63FF]">
                    <Plus className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-bold text-zinc-200">New Idea</h4>
                  <p className="text-[9px] text-zinc-500 leading-tight">Create workspace content card</p>
                </button>
                
                <button 
                  onClick={() => setActiveTab("AI Assistant")}
                  className="p-3 rounded-lg border border-zinc-850 hover:border-zinc-700 bg-zinc-900/20 text-left hover:bg-zinc-900/50 transition-all flex flex-col gap-2"
                >
                  <div className="h-7 w-7 rounded-md bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6]">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-bold text-zinc-200">Write Script</h4>
                  <p className="text-[9px] text-zinc-500 leading-tight">Open AI writer hook panel</p>
                </button>

                <button 
                  onClick={() => setActiveTab("Calendar")}
                  className="p-3 rounded-lg border border-zinc-850 hover:border-zinc-700 bg-zinc-900/20 text-left hover:bg-zinc-900/50 transition-all flex flex-col gap-2"
                >
                  <div className="h-7 w-7 rounded-md bg-[#22C55E]/15 border border-[#22C55E]/30 flex items-center justify-center text-[#22C55E]">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-bold text-zinc-200">Plan Uploads</h4>
                  <p className="text-[9px] text-zinc-500 leading-tight">Browse scheduler calendar</p>
                </button>

                <button 
                  onClick={() => setActiveTab("Sponsors")}
                  className="p-3 rounded-lg border border-zinc-850 hover:border-zinc-700 bg-zinc-900/20 text-left hover:bg-zinc-900/50 transition-all flex flex-col gap-2"
                >
                  <div className="h-7 w-7 rounded-md bg-[#F59E0B]/15 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B]">
                    <Handshake className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-bold text-zinc-200">Add Sponsor</h4>
                  <p className="text-[9px] text-zinc-500 leading-tight">Create new outreach lead</p>
                </button>
              </div>
            </div>

            {/* Active Goals tracking */}
            <div className="border border-zinc-900 bg-zinc-950/40 rounded-xl p-5">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-4">
                <h3 className="text-sm font-bold text-zinc-200">Active Goals</h3>
                <button 
                  onClick={() => setActiveTab("Goals")}
                  className="text-[10px] font-semibold text-[#8B5CF6] hover:underline"
                >
                  Configure
                </button>
              </div>
              <div className="space-y-4">
                {activeGoals.map((goal) => {
                  const percent = Math.min(Math.round((goal.current / goal.target) * 100), 100);
                  return (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-zinc-300 truncate max-w-[140px]">{goal.title}</span>
                        <span className="text-zinc-500 font-mono">{goal.current.toLocaleString()}/{goal.target.toLocaleString()}</span>
                      </div>
                      
                      <div className="h-2 w-full rounded-full bg-zinc-900 border border-zinc-850 relative overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6]" 
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[9px] text-zinc-500">
                        <span>Progress: {percent}%</span>
                        <span>Due: {goal.deadline}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

        {/* Right Column (1 part wide) */}
        <div className="space-y-6">
          
          {/* Upcoming Upload Banner */}
          <div className="border border-zinc-900 bg-zinc-950/40 rounded-xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 text-[#6C63FF] opacity-10">
              <Calendar className="h-16 w-16" />
            </div>
            
            <h3 className="text-sm font-bold text-zinc-200 border-b border-zinc-900 pb-3 mb-4">Next Release</h3>
            
            {upcomingUpload ? (
              <div className="space-y-4">
                <div className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800">
                  <span className="text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-[#6C63FF]/15 text-[#6C63FF] border border-[#6C63FF]/30">
                    {upcomingUpload.platform}
                  </span>
                  <h4 className="text-xs font-bold text-zinc-200 mt-2 leading-relaxed">{upcomingUpload.title}</h4>
                  <p className="text-[10px] text-zinc-500 mt-1 line-clamp-2">{upcomingUpload.description}</p>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400 font-semibold">Publish Date:</span>
                  <span className="text-zinc-200 font-mono font-bold">{upcomingUpload.deadline}</span>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-zinc-500">
                No uploads currently scheduled.
              </div>
            )}
          </div>

          {/* Recent Activity stream */}
          <div className="border border-zinc-900 bg-zinc-950/40 rounded-xl p-5">
            <h3 className="text-sm font-bold text-zinc-200 border-b border-zinc-900 pb-3 mb-4">Recent Studio Activity</h3>
            
            <div className="space-y-4">
              {notifications.slice(0, 4).map((activity) => (
                <div key={activity.id} className="flex gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#8B5CF6] mt-2 shrink-0 shadow-[0_0_6px_rgba(139,92,246,0.6)]"></span>
                  <div className="min-w-0">
                    <h5 className="text-xs font-semibold text-zinc-300">{activity.title}</h5>
                    <p className="text-[10px] text-zinc-500 mt-0.5 leading-relaxed">{activity.description}</p>
                    <span className="text-[9px] text-zinc-600 block mt-1">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
