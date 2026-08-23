"use client";

import React, { useState, useEffect } from "react";
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";
import { 
  TrendingUp, Eye, Users, DollarSign, Percent, 
  Clock, ArrowUpRight, BarChart2, Star, Play
} from "lucide-react";

// Mock Charting Data
const subGrowthData = [
  { month: "Jan", YouTube: 22000, Instagram: 18000 },
  { month: "Feb", YouTube: 24500, Instagram: 22000 },
  { month: "Mar", YouTube: 28000, Instagram: 25000 },
  { month: "Apr", YouTube: 32000, Instagram: 29000 },
  { month: "May", YouTube: 35000, Instagram: 34000 },
  { month: "Jun", YouTube: 39500, Instagram: 38000 },
  { month: "Jul", YouTube: 42500, Instagram: 41000 }
];

const viewsRevenueData = [
  { month: "Jan", Views: 450000, Revenue: 62000 },
  { month: "Feb", Views: 520000, Revenue: 75000 },
  { month: "Mar", Views: 610000, Revenue: 90000 },
  { month: "Apr", Views: 580000, Revenue: 85000 },
  { month: "May", Views: 720000, Revenue: 110000 },
  { month: "Jun", Views: 810000, Revenue: 135000 },
  { month: "Jul", Views: 890000, Revenue: 150000 }
];

const engagementData = [
  { month: "Jan", CTR: 5.2, Engagement: 6.8 },
  { month: "Feb", CTR: 5.8, Engagement: 7.2 },
  { month: "Mar", CTR: 6.1, Engagement: 6.9 },
  { month: "Apr", CTR: 5.9, Engagement: 7.5 },
  { month: "May", CTR: 6.5, Engagement: 7.9 },
  { month: "Jun", CTR: 7.2, Engagement: 8.2 },
  { month: "Jul", CTR: 7.8, Engagement: 8.5 }
];

export const AnalyticsView: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [metricTab, setMetricTab] = useState<"overview" | "growth" | "engagement">("overview");

  // SSR Hydration Guard for Recharts
  useEffect(() => {
    setMounted(true);
  }, []);

  const topVideos = [
    { title: "Building a $10k/month SaaS in 24 Hours", views: "145,000", revenue: "₹35,000", ctr: "9.2%", duration: "18:42" },
    { title: "React Server Components: The Complete Guide", views: "98,000", revenue: "₹24,000", ctr: "7.8%", duration: "24:15" },
    { title: "Why I Abandoned Tailwind CSS (And why I went back)", views: "82,000", revenue: "₹18,500", ctr: "8.1%", duration: "12:30" },
    { title: "How to animate with Framer Motion in 30s", views: "75,000", revenue: "₹12,000", ctr: "6.9%", duration: "0:30" }
  ];

  if (!mounted) {
    return (
      <div className="flex-1 h-[70vh] flex flex-col items-center justify-center text-zinc-500">
        <BarChart2 className="h-8 w-8 animate-pulse text-[#6C63FF] mb-2" />
        <span className="text-xs font-semibold">Loading interactive analytics panels...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#09090B] scrollbar-thin select-none space-y-6">
      
      {/* Analytics Tabs Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-zinc-900 pb-5 shrink-0">
        <div>
          <h3 className="text-sm font-bold text-zinc-200">Workspace Analytics</h3>
          <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Monitor growth curves, click-through rates, and earnings</p>
        </div>

        <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-950 p-0.5 text-xs font-semibold">
          <button
            onClick={() => setMetricTab("overview")}
            className={`px-3.5 py-1.5 rounded-md ${metricTab === "overview" ? "bg-zinc-900 text-[#6C63FF]" : "text-zinc-500"}`}
          >
            Performance Overview
          </button>
          <button
            onClick={() => setMetricTab("growth")}
            className={`px-3.5 py-1.5 rounded-md ${metricTab === "growth" ? "bg-zinc-900 text-[#6C63FF]" : "text-zinc-500"}`}
          >
            Subscribers Growth
          </button>
          <button
            onClick={() => setMetricTab("engagement")}
            className={`px-3.5 py-1.5 rounded-md ${metricTab === "engagement" ? "bg-zinc-900 text-[#6C63FF]" : "text-zinc-500"}`}
          >
            CTR & Engagement
          </button>
        </div>
      </div>

      {/* Grid statistics summary widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Views */}
        <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/20">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
            <span className="uppercase text-[9px] tracking-wider">Views</span>
            <Eye className="h-4 w-4" />
          </div>
          <h3 className="text-xl font-black text-white mt-2">2.4M</h3>
          <span className="text-[9px] text-[#22C55E] font-bold flex items-center mt-1">
            <TrendingUp className="h-3 w-3 mr-0.5" />
            +18.2% vs last month
          </span>
        </div>

        {/* Total Subscribers */}
        <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/20">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
            <span className="uppercase text-[9px] tracking-wider">Subscribers</span>
            <Users className="h-4 w-4" />
          </div>
          <h3 className="text-xl font-black text-white mt-2">42,500</h3>
          <span className="text-[9px] text-[#22C55E] font-bold flex items-center mt-1">
            <TrendingUp className="h-3 w-3 mr-0.5" />
            +12.4% vs last month
          </span>
        </div>

        {/* Avg CTR */}
        <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/20">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
            <span className="uppercase text-[9px] tracking-wider">Avg CTR</span>
            <Percent className="h-4 w-4" />
          </div>
          <h3 className="text-xl font-black text-white mt-2">7.8%</h3>
          <span className="text-[9px] text-[#22C55E] font-bold flex items-center mt-1">
            <TrendingUp className="h-3 w-3 mr-0.5" />
            +1.5% vs last month
          </span>
        </div>

        {/* Revenue */}
        <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/20">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
            <span className="uppercase text-[9px] tracking-wider">Revenue</span>
            <DollarSign className="h-4 w-4" />
          </div>
          <h3 className="text-xl font-black text-white mt-2">₹1.5L</h3>
          <span className="text-[9px] text-[#22C55E] font-bold flex items-center mt-1">
            <TrendingUp className="h-3 w-3 mr-0.5" />
            +22.4% vs last month
          </span>
        </div>

      </div>

      {/* Recharts Graphical Chart Frame */}
      <div className="p-5 rounded-xl border border-zinc-900 bg-zinc-950/30">
        
        {/* Performance Overview (Views & Revenue) */}
        {metricTab === "overview" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-900/60">
              <h4 className="text-xs font-bold text-zinc-200">Views & Sponsorship Revenue Curves</h4>
              <div className="flex items-center gap-4 text-[10px] text-zinc-500 font-semibold">
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-[#6C63FF]" />
                  <span>Views</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
                  <span>Revenue (INR)</span>
                </div>
              </div>
            </div>

            <div className="h-64 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={viewsRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6C63FF" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#18181B" vertical={false} />
                  <XAxis dataKey="month" stroke="#3F3F46" tickLine={false} />
                  <YAxis yAxisId="left" stroke="#3F3F46" tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke="#3F3F46" tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#18181B", borderColor: "#27272A", color: "#F4F4F5" }} />
                  <Area yAxisId="left" type="monotone" dataKey="Views" stroke="#6C63FF" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
                  <Area yAxisId="right" type="monotone" dataKey="Revenue" stroke="#22C55E" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Subscribers Growth (YouTube vs Instagram) */}
        {metricTab === "growth" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-900/60">
              <h4 className="text-xs font-bold text-zinc-200">Subscriber Acquisition curves</h4>
              <div className="flex items-center gap-4 text-[10px] text-zinc-500 font-semibold">
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  <span>YouTube</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-purple-500" />
                  <span>Instagram</span>
                </div>
              </div>
            </div>

            <div className="h-64 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={subGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="#18181B" vertical={false} />
                  <XAxis dataKey="month" stroke="#3F3F46" tickLine={false} />
                  <YAxis stroke="#3F3F46" tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#18181B", borderColor: "#27272A", color: "#F4F4F5" }} />
                  <Line type="monotone" dataKey="YouTube" stroke="#EF4444" strokeWidth={2.5} dot={false} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="Instagram" stroke="#A855F7" strokeWidth={2.5} dot={false} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* CTR & Engagement */}
        {metricTab === "engagement" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-900/60">
              <h4 className="text-xs font-bold text-zinc-200">Click-Through-Rate & Engagement trends</h4>
              <div className="flex items-center gap-4 text-[10px] text-zinc-500 font-semibold">
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  <span>CTR (%)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-orange-400" />
                  <span>Engagement (%)</span>
                </div>
              </div>
            </div>

            <div className="h-64 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={engagementData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="#18181B" vertical={false} />
                  <XAxis dataKey="month" stroke="#3F3F46" tickLine={false} />
                  <YAxis stroke="#3F3F46" tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#18181B", borderColor: "#27272A", color: "#F4F4F5" }} />
                  <Bar dataKey="CTR" fill="#22D3EE" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Engagement" fill="#FB923C" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

      </div>

      {/* Top Performing Content table */}
      <div className="border border-zinc-900 bg-zinc-950/40 rounded-xl p-5">
        <h4 className="text-xs font-bold text-zinc-200 border-b border-zinc-900 pb-3 mb-4">Top Performing Videos</h4>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-400">
            <thead className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="pb-3.5 pr-4">Video Concept Title</th>
                <th className="pb-3.5">Views</th>
                <th className="pb-3.5">Ad Revenue</th>
                <th className="pb-3.5">CTR</th>
                <th className="pb-3.5 text-right">Watch Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {topVideos.map((video, index) => (
                <tr key={index}>
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="h-6.5 w-6.5 rounded bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                        <Play className="h-3.5 w-3.5 fill-red-500" />
                      </div>
                      <span className="font-semibold text-zinc-200 truncate max-w-[200px] sm:max-w-xs">{video.title}</span>
                    </div>
                  </td>
                  <td className="py-3.5 font-mono text-zinc-300">{video.views}</td>
                  <td className="py-3.5 font-mono font-bold text-[#22C55E]">{video.revenue}</td>
                  <td className="py-3.5 font-mono text-zinc-400">{video.ctr}</td>
                  <td className="py-3.5 font-mono text-zinc-500 text-right">{video.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
