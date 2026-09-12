"use client";

import React, { useState, useEffect } from "react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { 
  Eye, 
  Users, 
  DollarSign, 
  Clock, 
  Calendar, 
  Folder, 
  BarChart2, 
  Handshake, 
  ChevronRight, 
  ChevronDown,
  Flame, 
  Rocket, 
  Zap, 
  Bell, 
  Mic, 
  Briefcase, 
  Star, 
  Upload, 
  MessageSquare,
  ArrowRight,
  TrendingUp,
  X,
  Play
} from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

export const DashboardView: React.FC = () => {
  const { 
    user, 
    setActiveTab,
    notifications,
    calendarEvents
  } = useWorkspace();

  const [mounted, setMounted] = useState(false);
  const [showTipBanner, setShowTipBanner] = useState(true);
  const [timeframe, setTimeframe] = useState<"Last 7 days" | "Last 30 days" | "Last 90 days">("Last 30 days");
  const [timeframeOpen, setTimeframeOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Growth Overview multi-line chart data based on timeframe
  const chartDatasets = {
    "Last 7 days": [
      { date: "Day 1", views: 1.8, watchTime: 1.2, subscribers: 0.8 },
      { date: "Day 2", views: 2.1, watchTime: 1.4, subscribers: 1.0 },
      { date: "Day 3", views: 2.0, watchTime: 1.5, subscribers: 1.1 },
      { date: "Day 4", views: 2.4, watchTime: 1.8, subscribers: 1.3 },
      { date: "Day 5", views: 2.7, watchTime: 2.1, subscribers: 1.5 },
      { date: "Day 6", views: 2.5, watchTime: 2.0, subscribers: 1.6 },
      { date: "Day 7", views: 3.1, watchTime: 2.5, subscribers: 1.9 },
    ],
    "Last 30 days": [
      { date: "Aug 1", views: 0.8, watchTime: 0.5, subscribers: 0.3 },
      { date: "Aug 7", views: 1.4, watchTime: 1.1, subscribers: 0.7 },
      { date: "Aug 14", views: 1.6, watchTime: 1.3, subscribers: 0.9 },
      { date: "Aug 21", views: 2.2, watchTime: 1.7, subscribers: 1.4 },
      { date: "Aug 26", views: 3.0, watchTime: 2.4, subscribers: 1.9 },
    ],
    "Last 90 days": [
      { date: "Jun 1", views: 0.5, watchTime: 0.3, subscribers: 0.2 },
      { date: "Jun 20", views: 1.1, watchTime: 0.8, subscribers: 0.5 },
      { date: "Jul 10", views: 1.5, watchTime: 1.1, subscribers: 0.8 },
      { date: "Jul 30", views: 2.1, watchTime: 1.6, subscribers: 1.2 },
      { date: "Aug 26", views: 3.2, watchTime: 2.6, subscribers: 2.0 },
    ]
  };

  const currentChartData = chartDatasets[timeframe];

  // 4 KPI Cards
  const kpiStats = [
    {
      id: "subscribers",
      title: "Subscribers",
      value: "89",
      change: "↑ +12% vs last month",
      icon: (
        <div className="h-7 w-7 rounded-lg bg-[#EF4444]/15 border border-[#EF4444]/30 flex items-center justify-center text-[#EF4444]">
          <Play className="h-3.5 w-3.5 fill-[#EF4444]" />
        </div>
      ),
      sparkColor: "#EF4444",
      sparkPath: "M0,22 Q20,24 40,18 T80,12 T120,6"
    },
    {
      id: "views",
      title: "Total Views",
      value: "2.4M",
      change: "↑ +18.2% vs last month",
      icon: (
        <div className="h-7 w-7 rounded-lg bg-[#38BDF8]/15 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
          <Eye className="h-3.5 w-3.5" />
        </div>
      ),
      sparkColor: "#38BDF8",
      sparkPath: "M0,24 Q25,26 45,15 T85,18 T120,4"
    },
    {
      id: "watch-time",
      title: "Watch Time (Hours)",
      value: "42,500",
      change: "↑ +24% vs last month",
      icon: (
        <div className="h-7 w-7 rounded-lg bg-[#A855F7]/15 border border-[#A855F7]/30 flex items-center justify-center text-[#A855F7]">
          <Clock className="h-3.5 w-3.5" />
        </div>
      ),
      sparkColor: "#A855F7",
      sparkPath: "M0,25 Q30,22 55,20 T90,14 T120,5"
    },
    {
      id: "revenue",
      title: "Estimated Revenue",
      value: "₹3,50,000",
      change: "↑ +16% vs last month",
      icon: (
        <div className="h-7 w-7 rounded-lg bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
          <DollarSign className="h-3.5 w-3.5" />
        </div>
      ),
      sparkColor: "#2DD4BF",
      sparkPath: "M0,24 Q25,23 50,21 T90,15 T120,6"
    }
  ];

  // Work in Progress items
  const workInProgressItems = [
    {
      id: "wip-1",
      title: "10 Next.js 15 Tips I Wish I Knew Sooner",
      platform: "YouTube",
      stage: "Editing",
      priority: "Medium",
      priorityColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      thumbnail: "/thumbnails/nextjs-tips.jpg",
      description: "Deep dive into React 19 canary features, hydration optimization, and App Router v15 best practices."
    },
    {
      id: "wip-2",
      title: "How to animate with Framer Motion in 30s",
      platform: "Instagram",
      stage: "Content Stage",
      priority: "High",
      priorityColor: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      thumbnail: "/thumbnails/framer-motion.jpg",
      description: "Fast-paced reel tutorial demonstrating spring physics and interactive gesture dragging."
    },
    {
      id: "wip-3",
      title: "Designing the Ultimate Sponsor Pitch Deck",
      platform: "LinkedIn",
      stage: "Content Stage",
      priority: "Medium",
      priorityColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      thumbnail: "/thumbnails/pitch-deck.jpg",
      description: "Slide-by-slide structure, media kit data, and sponsorship pricing guidelines for creators."
    }
  ];

  // Recent Activity stream
  const recentActivities = [
    {
      id: "act-1",
      title: "New subscriber",
      description: "Someone subscribed to your channel",
      time: "2m ago",
      icon: (
        <div className="h-7 w-7 rounded-lg bg-[#EF4444] flex items-center justify-center text-white shrink-0 shadow-sm">
          <Play className="h-3.5 w-3.5 fill-white" />
        </div>
      )
    },
    {
      id: "act-2",
      title: "Monetization update",
      description: "Your estimated revenue increased by 12%",
      time: "1h ago",
      icon: (
        <div className="h-7 w-7 rounded-lg bg-[#10B981] flex items-center justify-center text-white shrink-0 shadow-sm">
          <DollarSign className="h-4 w-4" />
        </div>
      )
    },
    {
      id: "act-3",
      title: "Brand deal inquiry",
      description: "New message from a potential sponsor",
      time: "3h ago",
      icon: (
        <div className="h-7 w-7 rounded-lg bg-[#6366F1] flex items-center justify-center text-white shrink-0 shadow-sm">
          <MessageSquare className="h-3.5 w-3.5" />
        </div>
      )
    },
    {
      id: "act-4",
      title: "Video published",
      description: 'Your video "Next.js 15 Tips" is live!',
      time: "5h ago",
      icon: (
        <div className="h-7 w-7 rounded-lg bg-[#0284C7] flex items-center justify-center text-white shrink-0 shadow-sm">
          <Upload className="h-3.5 w-3.5" />
        </div>
      )
    }
  ];

  // Upcoming Schedule Items
  const upcomingEvents = [
    {
      id: "up-1",
      title: "Collab with @techwitharjun",
      subtext: "Aug 28 • YouTube",
      icon: (
        <div className="h-7 w-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
          <Play className="h-3.5 w-3.5 fill-indigo-400" />
        </div>
      )
    },
    {
      id: "up-2",
      title: "Podcast Recording",
      subtext: "Aug 30 • Online",
      icon: (
        <div className="h-7 w-7 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
          <Mic className="h-3.5 w-3.5" />
        </div>
      )
    },
    {
      id: "up-3",
      title: "Brand Deal Meeting",
      subtext: "Sep 2 • Google Meet",
      icon: (
        <div className="h-7 w-7 rounded-lg bg-slate-500/20 border border-slate-500/30 flex items-center justify-center text-slate-300 shrink-0">
          <Briefcase className="h-3.5 w-3.5" />
        </div>
      )
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-5 md:p-7 space-y-6 bg-[#0B0F19] text-[#F4F4F5] scrollbar-thin select-none">
      {/* Top Welcome & Tip Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Welcome Back, {user?.fullName || "Alex Mercer"}</span>
            <span className="text-xl">🚀</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Here&apos;s what&apos;s happening with your content, audience and growth today.
          </p>
        </div>

        {showTipBanner && (
          <div className="flex items-center gap-3 bg-[#11182B] border border-[#1E293B] rounded-2xl px-4 py-2.5 shadow-sm text-xs text-zinc-300 max-w-xl self-start lg:self-auto">
            <Star className="h-4 w-4 text-amber-400 fill-amber-400/20 shrink-0" />
            <span className="leading-snug text-[11px] sm:text-xs">
              Continue where you left off: Chrome can restore your tabs every time you restart. To turn this off, go to Settings.
            </span>
            <button 
              onClick={() => setShowTipBanner(false)}
              className="p-1 hover:bg-white/[0.06] rounded-lg text-zinc-400 hover:text-zinc-200 transition-colors shrink-0"
              title="Dismiss notice"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiStats.map((stat) => (
          <div
            key={stat.id}
            className="p-4 rounded-2xl border border-[#1A2238] bg-[#10172A] flex flex-col justify-between hover:border-[#2A3554] transition-all shadow-sm group"
          >
            <div>
              <div className="flex items-center gap-2.5">
                {stat.icon}
                <span className="text-xs font-semibold text-zinc-400">{stat.title}</span>
              </div>
              <h3 className="text-2xl font-bold text-white mt-3.5 tracking-tight">{stat.value}</h3>
            </div>

            <div className="flex items-end justify-between mt-3 pt-1">
              <span className="text-[11px] font-medium text-emerald-400">{stat.change}</span>
              {/* Sparkline curve */}
              <div className="w-24 h-7 overflow-visible">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 120 28">
                  <path
                    d={stat.sparkPath}
                    fill="none"
                    stroke={stat.sparkColor}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3-Column Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Column 1: Left (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Current Work-in-Progress */}
          <div className="rounded-2xl border border-[#1A2238] bg-[#10172A] p-4 shadow-sm">
            <div className="flex items-center justify-between pb-3.5 mb-1">
              <div className="flex items-center gap-2">
                <Rocket className="h-4 w-4 text-indigo-400" />
                <h3 className="text-xs font-bold text-white">Current Work-in-Progress</h3>
              </div>
            </div>

            <div className="space-y-3">
              {workInProgressItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedTask(item)}
                  className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-white/[0.04] border border-transparent hover:border-[#1E293B] cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img 
                      src={item.thumbnail} 
                      alt={item.title}
                      className="w-14 h-10 rounded-lg object-cover border border-[#1E293B] shrink-0" 
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-zinc-100 truncate">{item.title}</h4>
                      <p className="text-[10px] text-zinc-400 mt-0.5">
                        {item.platform} • <span className={item.stage === "Editing" ? "text-sky-400" : "text-zinc-400"}>{item.stage}</span>
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium border shrink-0 ${item.priorityColor}`}>
                    {item.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="rounded-2xl border border-[#1A2238] bg-[#10172A] p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3.5">
              <Zap className="h-4 w-4 text-indigo-400" />
              <h3 className="text-xs font-bold text-white">Quick Links</h3>
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              <button
                onClick={() => setActiveTab("Calendar")}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#141C34] border border-[#1E293B] hover:border-indigo-500/40 hover:bg-[#182342] text-center transition-all group"
              >
                <Calendar className="h-4 w-4 text-indigo-400 group-hover:scale-110 transition-transform mb-2" />
                <span className="text-[10px] font-medium text-zinc-300 leading-tight">Content Calendar</span>
              </button>

              <button
                onClick={() => setActiveTab("Analytics")}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#141C34] border border-[#1E293B] hover:border-indigo-500/40 hover:bg-[#182342] text-center transition-all group"
              >
                <BarChart2 className="h-4 w-4 text-sky-400 group-hover:scale-110 transition-transform mb-2" />
                <span className="text-[10px] font-medium text-zinc-300 leading-tight">Analytics</span>
                <ArrowRight className="h-3 w-3 text-zinc-500 group-hover:text-zinc-300 mt-1" />
              </button>

              <button
                onClick={() => setActiveTab("Brand Deals")}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#141C34] border border-[#1E293B] hover:border-indigo-500/40 hover:bg-[#182342] text-center transition-all group"
              >
                <Handshake className="h-4 w-4 text-amber-400 group-hover:scale-110 transition-transform mb-2" />
                <span className="text-[10px] font-medium text-zinc-300 leading-tight">Brand Deals</span>
                <ArrowRight className="h-3 w-3 text-zinc-500 group-hover:text-zinc-300 mt-1" />
              </button>

              <button
                onClick={() => setActiveTab("Resources")}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#141C34] border border-[#1E293B] hover:border-indigo-500/40 hover:bg-[#182342] text-center transition-all group"
              >
                <Folder className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform mb-2" />
                <span className="text-[10px] font-medium text-zinc-300 leading-tight">Resources</span>
                <ArrowRight className="h-3 w-3 text-zinc-500 group-hover:text-zinc-300 mt-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Column 2: Center (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Growth Overview */}
          <div className="rounded-2xl border border-[#1A2238] bg-[#10172A] p-4 shadow-sm">
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-sky-400" />
                <h3 className="text-xs font-bold text-white">Growth Overview</h3>
              </div>

              {/* Timeframe Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setTimeframeOpen(!timeframeOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141C34] border border-[#1E293B] text-[11px] font-medium text-zinc-300 hover:text-white transition-colors"
                >
                  <span>{timeframe}</span>
                  <ChevronDown className="h-3 w-3 text-zinc-400" />
                </button>

                {timeframeOpen && (
                  <div className="absolute right-0 mt-1.5 w-32 rounded-xl bg-[#141C34] border border-[#1E293B] shadow-xl z-20 py-1">
                    {(["Last 7 days", "Last 30 days", "Last 90 days"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => {
                          setTimeframe(t);
                          setTimeframeOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                          timeframe === t ? "text-indigo-400 font-semibold bg-white/[0.04]" : "text-zinc-400 hover:text-zinc-200"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-[11px] text-zinc-400 mb-4 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#0284C7]"></span>
                <span>Views</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#8B5CF6]"></span>
                <span>Watch Time</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#06B6D4]"></span>
                <span>Subscribers</span>
              </div>
            </div>

            {/* Chart */}
            <div className="h-44 w-full">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={currentChartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1A2238" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#475569" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="#475569" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false}
                      domain={[0, 3]}
                      ticks={[0, 1, 2, 3]}
                      tickFormatter={(val) => (val === 0 ? "0" : `${val}M`)}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "#0B0F19", 
                        borderColor: "#1E293B", 
                        borderRadius: "12px",
                        fontSize: "11px",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.5)"
                      }}
                      itemStyle={{ padding: "1px 0" }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="views" 
                      stroke="#0284C7" 
                      strokeWidth={2.5} 
                      dot={false}
                      activeDot={{ r: 4, stroke: "#38BDF8", strokeWidth: 2 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="watchTime" 
                      stroke="#8B5CF6" 
                      strokeWidth={2.5} 
                      dot={false}
                      activeDot={{ r: 4, stroke: "#A855F7", strokeWidth: 2 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="subscribers" 
                      stroke="#06B6D4" 
                      strokeWidth={2.5} 
                      dot={false}
                      activeDot={{ r: 4, stroke: "#22D3EE", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-zinc-500">
                  Loading growth trends...
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-2xl border border-[#1A2238] bg-[#10172A] p-4 shadow-sm">
            <div className="flex items-center justify-between pb-3.5 mb-1">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-indigo-400" />
                <h3 className="text-xs font-bold text-white">Recent Activity</h3>
              </div>
              <button 
                onClick={() => setActiveTab("Content")}
                className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5"
              >
                <span>View all</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            <div className="space-y-3">
              {recentActivities.map((act) => (
                <div key={act.id} className="flex items-center justify-between gap-3 p-1.5">
                  <div className="flex items-center gap-3 min-w-0">
                    {act.icon}
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-zinc-100">{act.title}</h4>
                      <p className="text-[10px] text-zinc-400 mt-0.5 truncate">{act.description}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-zinc-500 shrink-0">{act.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 3: Right (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Notification Alert Banner */}
          <div 
            onClick={() => setActiveTab("Content")}
            className="flex items-center justify-between px-4 py-2.5 rounded-2xl border border-[#1A2238] bg-[#10172A] hover:border-zinc-700 cursor-pointer transition-colors shadow-sm group"
          >
            <div className="flex items-center gap-2.5">
              <Flame className="h-4 w-4 text-red-500" />
              <span className="text-xs font-semibold text-zinc-200">2 new notifications</span>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
          </div>

          {/* Next Release Card */}
          <div className="rounded-2xl border border-[#1A2238] bg-[#10172A] p-4 shadow-sm">
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <Rocket className="h-4 w-4 text-indigo-400" />
                <h3 className="text-xs font-bold text-white">Next Release</h3>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-zinc-500" />
            </div>

            <div className="p-3.5 rounded-xl bg-[#141B34] border border-indigo-500/20 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-md bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center font-bold text-white text-[10px] shadow-sm">
                    N
                  </div>
                  <span className="text-xs font-bold text-white">NEXORA v2.0</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
              </div>

              <h4 className="text-xs font-bold text-zinc-200 mt-3">Nexora v2.0</h4>
              <p className="text-[10px] text-zinc-400 mt-0.5">Better tools. Bigger opportunities.</p>

              {/* Progress bar */}
              <div className="flex items-center gap-2.5 mt-3 pt-1">
                <div className="flex-1 h-1.5 rounded-full bg-zinc-800/80 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#4F46E5] to-[#8B5CF6] w-[70%]" />
                </div>
                <span className="text-[10px] font-bold text-zinc-300">70%</span>
              </div>
            </div>
          </div>

          {/* Upcoming Schedule */}
          <div className="rounded-2xl border border-[#1A2238] bg-[#10172A] p-4 shadow-sm">
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-indigo-400" />
                <h3 className="text-xs font-bold text-white">Upcoming</h3>
              </div>
              <button 
                onClick={() => setActiveTab("Calendar")}
                className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5"
              >
                <span>View all</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            <div className="space-y-3">
              {upcomingEvents.map((evt) => (
                <div key={evt.id} className="flex items-center gap-3 p-1">
                  {evt.icon}
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-zinc-200 truncate">{evt.title}</h4>
                    <p className="text-[10px] text-zinc-400 mt-0.5">{evt.subtext}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="rounded-2xl border border-[#1A2238] bg-[#10172A] p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-4 w-4 text-indigo-400" />
              <h3 className="text-xs font-bold text-white">Quick Stats</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-2.5 rounded-xl bg-[#141C34] border border-[#1E293B]">
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <Eye className="h-3.5 w-3.5" />
                  <span className="text-[10px]">Total Views</span>
                </div>
                <h4 className="text-sm font-bold text-white mt-1">2.4M</h4>
              </div>

              <div className="p-2.5 rounded-xl bg-[#141C34] border border-[#1E293B]">
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <Clock className="h-3.5 w-3.5" />
                  <span className="text-[10px]">Watch Time</span>
                </div>
                <h4 className="text-sm font-bold text-white mt-1">42.5K</h4>
              </div>

              <div className="p-2.5 rounded-xl bg-[#141C34] border border-[#1E293B]">
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <Users className="h-3.5 w-3.5" />
                  <span className="text-[10px]">Subscribers</span>
                </div>
                <h4 className="text-sm font-bold text-white mt-1">89</h4>
              </div>

              <div className="p-2.5 rounded-xl bg-[#141C34] border border-[#1E293B]">
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <DollarSign className="h-3.5 w-3.5" />
                  <span className="text-[10px]">Revenue</span>
                </div>
                <h4 className="text-sm font-bold text-white mt-1">₹3.5L</h4>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Task Preview Modal */}
      <AnimatePresence>
        {selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg rounded-2xl bg-[#10172A] border border-[#1E293B] shadow-2xl p-6 overflow-hidden"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#1E293B]">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  Work in Progress Details
                </span>
                <button 
                  onClick={() => setSelectedTask(null)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <img 
                  src={selectedTask.thumbnail} 
                  alt={selectedTask.title}
                  className="w-full h-44 rounded-xl object-cover border border-[#1E293B]"
                />

                <div>
                  <h3 className="text-base font-bold text-white">{selectedTask.title}</h3>
                  <p className="text-xs text-zinc-400 mt-1">{selectedTask.description}</p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <div className="px-3 py-1.5 rounded-lg bg-[#141C34] border border-[#1E293B] text-xs">
                    <span className="text-zinc-500">Platform: </span>
                    <span className="font-semibold text-zinc-200">{selectedTask.platform}</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-[#141C34] border border-[#1E293B] text-xs">
                    <span className="text-zinc-500">Stage: </span>
                    <span className="font-semibold text-sky-400">{selectedTask.stage}</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-[#141C34] border border-[#1E293B] text-xs">
                    <span className="text-zinc-500">Priority: </span>
                    <span className="font-semibold text-amber-400">{selectedTask.priority}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1E293B]">
                  <button
                    onClick={() => setSelectedTask(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTask(null);
                      setActiveTab("Content");
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/25 transition-colors"
                  >
                    Open in Content Studio
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
