"use client";

import React, { useState } from "react";
import { useWorkspace, Goal } from "@/context/WorkspaceContext";
import { 
  Plus, Target, CheckCircle2, Circle, Trash2, 
  X, Calendar, Sparkles, Award, Flame, TrendingUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const GoalsView: React.FC = () => {
  const { goals, addGoal, updateGoal, deleteGoal } = useWorkspace();
  const [modalOpen, setModalOpen] = useState(false);

  // Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formTarget, setFormTarget] = useState(0);
  const [formCurrent, setFormCurrent] = useState(0);
  const [formUnit, setFormUnit] = useState("subscribers");
  const [formCategory, setFormCategory] = useState<Goal["category"]>("Subscribers");
  const [formDeadline, setFormDeadline] = useState("");
  const [formMilestoneInput, setFormMilestoneInput] = useState("");

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formTarget) return;

    const parsedMilestones = formMilestoneInput
      .split(",")
      .map(m => m.trim())
      .filter(m => m.length > 0)
      .map(m => ({ text: m, completed: false }));

    addGoal({
      title: formTitle,
      target: Number(formTarget),
      current: Number(formCurrent),
      unit: formUnit,
      category: formCategory,
      deadline: formDeadline,
      milestones: parsedMilestones
    });

    setModalOpen(false);
  };

  const handleToggleMilestone = (goalId: string, index: number) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const updatedMilestones = [...goal.milestones];
    updatedMilestones[index] = {
      ...updatedMilestones[index],
      completed: !updatedMilestones[index].completed
    };

    updateGoal(goalId, { milestones: updatedMilestones });
  };

  const drawProgressCircle = (percent: number) => {
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percent / 100) * circumference;

    return {
      circumference,
      strokeDashoffset
    };
  };

  // General achievements summaries
  const completedGoals = goals.filter(g => g.current >= g.target).length;

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#09090B] scrollbar-thin select-none space-y-6">
      
      {/* Top Banner Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 shrink-0">
        
        {/* Goals Progress */}
        <div className="p-4 border border-zinc-900 bg-zinc-950/40 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-[#6C63FF]/15 border border-[#6C63FF]/30 flex items-center justify-center text-[#6C63FF]">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Achievements</h4>
              <h3 className="text-base font-extrabold text-white mt-0.5">{completedGoals} of {goals.length} Goals Met</h3>
            </div>
          </div>
        </div>

        {/* Upload Streak */}
        <div className="p-4 border border-zinc-900 bg-zinc-950/40 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-500">
              <Flame className="h-5 w-5 fill-orange-500/10" />
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Active Streak</h4>
              <h3 className="text-base font-extrabold text-white mt-0.5">14 Days Consistent</h3>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-1 border border-zinc-900 bg-zinc-950/40 rounded-xl flex items-center justify-center">
          <button
            onClick={() => {
              setFormTitle("");
              setFormTarget(10000);
              setFormCurrent(0);
              setFormUnit("followers");
              setFormCategory("Followers");
              setFormDeadline(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
              setFormMilestoneInput("");
              setModalOpen(true);
            }}
            className="flex items-center justify-center gap-1.5 w-full h-full py-3 text-xs font-semibold rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-850 hover:border-zinc-700 transition-all"
          >
            <Plus className="h-4 w-4 text-[#6C63FF]" />
            <span>Set New Target</span>
          </button>
        </div>

      </div>

      {/* Target Progress Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => {
          const percent = Math.min(Math.round((goal.current / goal.target) * 100), 100);
          const circleConfig = drawProgressCircle(percent);

          return (
            <div 
              key={goal.id} 
              className="p-5 rounded-xl border border-zinc-900 bg-zinc-950/20 backdrop-blur-xs flex flex-col justify-between hover:bg-zinc-950/40 transition-colors group relative overflow-hidden"
            >
              {/* Card top gradient indicator */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#8B5CF6]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex items-start justify-between gap-4">
                {/* Text and stats */}
                <div className="space-y-1">
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider bg-zinc-900 border border-zinc-850/80 text-[#8B5CF6]">
                    {goal.category}
                  </span>
                  
                  <h3 className="text-sm font-bold text-zinc-200 mt-2.5 leading-relaxed">{goal.title}</h3>
                  
                  <div className="flex items-baseline gap-1 mt-1 text-xs">
                    <span className="font-mono font-bold text-white text-base">{goal.current.toLocaleString()}</span>
                    <span className="text-zinc-500 font-semibold">/ {goal.target.toLocaleString()} {goal.unit}</span>
                  </div>
                </div>

                {/* SVG Progress Circle Ring */}
                <div className="relative h-20 w-20 flex items-center justify-center shrink-0">
                  <svg className="h-full w-full transform -rotate-90">
                    {/* Background track circle */}
                    <circle
                      cx="40"
                      cy="40"
                      r="35"
                      stroke="#18181B"
                      strokeWidth="6"
                      fill="transparent"
                      className="border border-zinc-800"
                    />
                    {/* Colored percentage track */}
                    <circle
                      cx="40"
                      cy="40"
                      r="35"
                      stroke="url(#purpleGradient)"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray={circleConfig.circumference}
                      strokeDashoffset={circleConfig.strokeDashoffset}
                      strokeLinecap="round"
                    />
                    
                    {/* Gradient definition */}
                    <defs>
                      <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6C63FF" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {/* Inside Text percent */}
                  <span className="absolute text-[10px] font-mono font-black text-zinc-350">{percent}%</span>
                </div>
              </div>

              {/* Milestones checklists */}
              {goal.milestones.length > 0 && (
                <div className="mt-5 pt-4 border-t border-zinc-900/60 space-y-2">
                  <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Milestones Checkpoints</h4>
                  
                  <div className="space-y-1.5">
                    {goal.milestones.map((ms, idx) => (
                      <div 
                        key={idx}
                        onClick={() => handleToggleMilestone(goal.id, idx)}
                        className="flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer py-0.5"
                      >
                        {ms.completed ? (
                          <CheckCircle2 className="h-4 w-4 text-[#22C55E] shrink-0" />
                        ) : (
                          <Circle className="h-4 w-4 text-zinc-700 hover:text-zinc-500 shrink-0" />
                        )}
                        <span className={ms.completed ? "line-through text-zinc-600" : ""}>{ms.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Card Footer controls */}
              <div className="mt-6 pt-4 border-t border-zinc-900 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-semibold">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Target: {goal.deadline}</span>
                </div>

                <button
                  onClick={() => {
                    if (confirm("Delete this goal?")) deleteGoal(goal.id);
                  }}
                  className="p-1 rounded bg-zinc-900 border border-zinc-850 text-zinc-650 hover:text-[#EF4444] transition-colors"
                  title="Delete Goal"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Set New Goal Modal Dialog */}
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
            {/* Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-900/90 shadow-2xl backdrop-blur-xl p-5 z-10"
            >
              <div className="flex justify-between items-center pb-3 border-b border-zinc-800 mb-4 bg-zinc-950/20">
                <h3 className="text-xs font-bold text-zinc-200">Set Workspace Target</h3>
                <button onClick={() => setModalOpen(false)} className="text-zinc-500 hover:text-zinc-300">
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <form onSubmit={handleSaveGoal} className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
                <div>
                  <label className="block text-[9px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                    Goal Name / Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pass 50k subscribers"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 focus:border-[#6C63FF]/60 rounded-lg text-xs text-zinc-100 placeholder-zinc-650 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                      Goal Category
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as any)}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 focus:border-[#6C63FF]/60 rounded-lg text-xs text-zinc-300 outline-none cursor-pointer"
                    >
                      <option value="Subscribers">Subscribers</option>
                      <option value="Followers">Followers</option>
                      <option value="Videos">Videos</option>
                      <option value="Streak">Streak</option>
                      <option value="Revenue">Revenue</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                      Unit (Plural)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. views, INR"
                      value={formUnit}
                      onChange={(e) => setFormUnit(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 focus:border-[#6C63FF]/60 rounded-lg text-xs text-zinc-100 placeholder-zinc-650 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                      Current Value
                    </label>
                    <input
                      type="number"
                      value={formCurrent}
                      onChange={(e) => setFormCurrent(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 focus:border-[#6C63FF]/60 rounded-lg text-xs text-zinc-100 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                      Target Goal
                    </label>
                    <input
                      type="number"
                      required
                      value={formTarget}
                      onChange={(e) => setFormTarget(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 focus:border-[#6C63FF]/60 rounded-lg text-xs text-zinc-100 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                    Deadline Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formDeadline}
                    onChange={(e) => setFormDeadline(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 focus:border-[#6C63FF]/60 rounded-lg text-xs text-zinc-300 outline-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                    Milestones (Comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hit 10k first, Hit 25k, Get to 50k"
                    value={formMilestoneInput}
                    onChange={(e) => setFormMilestoneInput(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 focus:border-[#6C63FF]/60 rounded-lg text-xs text-zinc-100 placeholder-zinc-650 outline-none"
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
                    Set Target
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
