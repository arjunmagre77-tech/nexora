"use client";

import React, { useState } from "react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { 
  Sparkles, Kanban, Calendar, Handshake, Target, Folder, 
  ArrowRight, ShieldCheck, Zap, Users, Play, HelpCircle, ChevronDown, Check, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const LandingPage: React.FC = () => {
  const { setActiveTab } = useWorkspace();
  const [isYearly, setIsYearly] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const features = [
    {
      title: "Content Organizer",
      description: "Manage YouTube videos, Reels, TikToks, and blog posts in one database.",
      icon: Kanban,
      color: "text-[#6C63FF] bg-[#6C63FF]/10 border-[#6C63FF]/20"
    },
    {
      title: "AI Writing Assistant",
      description: "Generate high-converting scripts, hooks, SEO descriptions, and tags in seconds.",
      icon: Sparkles,
      color: "text-[#8B5CF6] bg-[#8B5CF6]/10 border-[#8B5CF6]/20"
    },
    {
      title: "Unified Calendar",
      description: "Drag and drop scheduled content with automatic color-coding for channels.",
      icon: Calendar,
      color: "text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20"
    },
    {
      title: "Sponsor CRM",
      description: "Track brand outreach pipeline, deal values, contracts, and payment stages.",
      icon: Handshake,
      color: "text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20"
    },
    {
      title: "Goal Tracking",
      description: "Monitor milestones, subscribers, revenue, and upload streaks in real time.",
      icon: Target,
      color: "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20"
    },
    {
      title: "Asset Vault",
      description: "Store logos, soundtracks, video hooks, and templates in categorized folders.",
      icon: Folder,
      color: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20"
    }
  ];

  const faqs = [
    {
      question: "Is Nexora suitable for single creators or teams?",
      answer: "Nexora is designed for both! Solo creators can plan and organize using our Free or Pro plans, while the Team plan introduces real-time shared workspaces and workspace administration."
    },
    {
      question: "How does the AI Assistant write scripts?",
      answer: "Nexora features custom-engineered prompts powered by advanced language models optimized specifically for content creation (viral structures, hooks, CTA positioning, and SEO keywords)."
    },
    {
      question: "Can I sync my actual YouTube and Instagram accounts?",
      answer: "Currently, Nexora is structured as a planner, calendar, and analytics notebook. API auto-publishing and live channel synchronization are currently in development as part of our Q4 Roadmap!"
    },
    {
      question: "Can I cancel my subscription at any time?",
      answer: "Yes, you can cancel your plan directly in your settings under the Billing section. You will retain access to your plan's benefits until the end of your billing cycle."
    }
  ];

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 flex flex-col selection:bg-[#6C63FF]/30 select-none">
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#6C63FF]/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-[#8B5CF6]/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#09090B]/70 backdrop-blur-lg border-b border-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-[#6C63FF] to-[#8B5CF6] flex items-center justify-center font-bold text-white shadow-lg shadow-[#6C63FF]/20">
              N
            </div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Nexora
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-zinc-200 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-zinc-200 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-zinc-200 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveTab("Login")}
              className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => setActiveTab("Signup")}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#6C63FF] hover:bg-[#5b52f0] text-white shadow-md shadow-[#6C63FF]/20 active:scale-95 transition-all"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 text-center max-w-5xl mx-auto flex flex-col items-center">
        {/* Banner Tag */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-[11px] text-[#8B5CF6] font-semibold tracking-wide uppercase mb-6"
        >
          <Sparkles className="h-3 w-3" />
          <span>Next-Gen Creator Workspace</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-b from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent leading-[1.1] mb-6"
        >
          Everything a Creator Needs.<br />
          <span className="bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] bg-clip-text text-transparent">One Beautiful Workspace.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-zinc-400 text-base sm:text-lg max-w-2xl leading-relaxed mb-10"
        >
          Plan content, manage sponsors, organize ideas, analyze growth and use AI to create faster—all in one place. Say goodbye to jumping between 10 different apps.
        </motion.p>

        {/* CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button 
            onClick={() => setActiveTab("Signup")}
            className="group px-6 py-3 rounded-lg bg-gradient-to-tr from-[#6C63FF] to-[#8B5CF6] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#6C63FF]/20 hover:shadow-[#6C63FF]/35 active:scale-98 transition-all"
          >
            <span>Start Creating Free</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button 
            onClick={() => setDemoOpen(true)}
            className="px-6 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors"
          >
            <Play className="h-4 w-4 text-[#8B5CF6] fill-[#8B5CF6]" />
            <span>Watch Demo</span>
          </button>
        </motion.div>
      </section>

      {/* Product Preview Mockup */}
      <section className="max-w-6xl mx-auto px-4 pb-24 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-2.5 shadow-2xl shadow-[#6C63FF]/5 relative overflow-hidden"
        >
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#6C63FF]/50 to-transparent" />
          <div className="relative rounded-lg overflow-hidden bg-zinc-950 border border-zinc-900">
            {/* Top window UI dots */}
            <div className="h-9 px-4 flex items-center gap-1.5 border-b border-zinc-900 bg-zinc-950/80">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/70"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/70"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]/70"></span>
              <span className="text-[10px] text-zinc-600 font-mono ml-4">nexora.app/dashboard</span>
            </div>
            
            {/* Inside mockup */}
            <div className="aspect-[16/9] relative bg-zinc-950 flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80" 
                alt="Nexora Dashboard Mockup" 
                className="w-full h-full object-cover opacity-60 filter blur-xs"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
              <button 
                onClick={() => setDemoOpen(true)}
                className="absolute h-16 w-16 rounded-full bg-[#6C63FF] hover:bg-[#5b52f0] flex items-center justify-center text-white shadow-xl shadow-[#6C63FF]/30 hover:scale-105 active:scale-95 transition-all z-10"
              >
                <Play className="h-6 w-6 ml-1 fill-white" />
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="max-w-7xl mx-auto px-4 py-20 w-full border-t border-zinc-900">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-white mb-4">
            Crafted for High-Impact Content Teams
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto text-sm">
            Tired of managing scripts in Notion, schedules in Google Calendar, and sponsorships in spreadsheets? Nexora does it all.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/60 hover:border-zinc-700/80 transition-all duration-200 group text-left"
              >
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center border ${feature.color} mb-5 group-hover:scale-105 transition-transform`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-zinc-100 mb-2">{feature.title}</h3>
                <p className="text-zinc-400 text-xs leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-6xl mx-auto px-4 py-20 w-full border-t border-zinc-900 text-center">
        <div className="mb-12">
          <h2 className="text-3xl font-extrabold text-white mb-4">Simple, Transparent Pricing</h2>
          <p className="text-zinc-400 text-sm max-w-md mx-auto">
            Choose the plan that fits your growth. Save 20% by billing annually.
          </p>
          
          {/* Monthly/Yearly toggle */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <span className={`text-xs font-semibold ${!isYearly ? "text-white" : "text-zinc-500"}`}>Monthly</span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="w-10 h-6 rounded-full bg-zinc-800 border border-zinc-700 p-0.5 relative transition-all duration-200"
            >
              <div 
                className={`h-4.5 w-4.5 rounded-full bg-[#6C63FF] transition-all duration-200 transform ${
                  isYearly ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
            <span className={`text-xs font-semibold flex items-center gap-1.5 ${isYearly ? "text-white" : "text-zinc-500"}`}>
              <span>Yearly</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 font-bold uppercase">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="p-8 rounded-xl border border-zinc-800 bg-zinc-900/20 flex flex-col justify-between text-left hover:border-zinc-800 transition-all">
            <div>
              <h3 className="text-base font-bold text-zinc-300">Free</h3>
              <p className="text-zinc-500 text-xs mt-1">For getting started.</p>
              
              <div className="my-6">
                <span className="text-4xl font-extrabold text-white">₹0</span>
                <span className="text-zinc-500 text-xs ml-1">/ forever</span>
              </div>

              <div className="border-t border-zinc-800 my-6"></div>
              
              <ul className="space-y-3.5 text-xs text-zinc-400">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#6C63FF] shrink-0" />
                  <span>Ideas Manager & Outline notes</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#6C63FF] shrink-0" />
                  <span>10 Content Items</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#6C63FF] shrink-0" />
                  <span>Interactive Kanban Board</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#6C63FF] shrink-0" />
                  <span>Goals tracker & Streak checklist</span>
                </li>
              </ul>
            </div>
            
            <button 
              onClick={() => setActiveTab("Signup")}
              className="mt-8 w-full py-2.5 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
            >
              Sign Up Free
            </button>
          </div>

          {/* Pro Plan */}
          <div className="p-8 rounded-xl border border-[#6C63FF] bg-[#6C63FF]/5 relative flex flex-col justify-between text-left shadow-lg shadow-[#6C63FF]/5">
            <div className="absolute top-0 right-6 transform -translate-y-1/2 px-2.5 py-0.5 rounded-full bg-gradient-to-tr from-[#6C63FF] to-[#8B5CF6] text-white text-[9px] font-bold uppercase tracking-wider">
              Most Popular
            </div>
            
            <div>
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <span>Pro</span>
                <Zap className="h-4 w-4 text-[#8B5CF6] fill-[#8B5CF6]" />
              </h3>
              <p className="text-zinc-400 text-xs mt-1">For professional creators.</p>
              
              <div className="my-6">
                <span className="text-4xl font-extrabold text-white">
                  {isYearly ? "₹319" : "₹399"}
                </span>
                <span className="text-zinc-500 text-xs ml-1">/ month</span>
              </div>

              <div className="border-t border-zinc-800/80 my-6"></div>
              
              <ul className="space-y-3.5 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#6C63FF] shrink-0" />
                  <span>Unlimited Content & Outlines</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#6C63FF] shrink-0" />
                  <span>Unlimited AI Credits (Scripts, Hooks, Tags)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#6C63FF] shrink-0" />
                  <span>Advanced Analytics (Growth insights)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#6C63FF] shrink-0" />
                  <span>Sponsor CRM deal pipeline</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#6C63FF] shrink-0" />
                  <span>Folder-based Asset Vault</span>
                </li>
              </ul>
            </div>
            
            <button 
              onClick={() => setActiveTab("Signup")}
              className="mt-8 w-full py-2.5 text-xs font-semibold rounded-lg bg-[#6C63FF] hover:bg-[#5b52f0] text-white shadow-md shadow-[#6C63FF]/20 transition-all"
            >
              Get Pro Now
            </button>
          </div>

          {/* Team Plan */}
          <div className="p-8 rounded-xl border border-zinc-800 bg-zinc-900/20 flex flex-col justify-between text-left hover:border-zinc-800 transition-all">
            <div>
              <h3 className="text-base font-bold text-zinc-300">Team</h3>
              <p className="text-zinc-500 text-xs mt-1">For agencies & groups.</p>
              
              <div className="my-6">
                <span className="text-4xl font-extrabold text-white">
                  {isYearly ? "₹1,199" : "₹1,499"}
                </span>
                <span className="text-zinc-500 text-xs ml-1">/ month</span>
              </div>

              <div className="border-t border-zinc-800 my-6"></div>
              
              <ul className="space-y-3.5 text-xs text-zinc-400">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#6C63FF] shrink-0" />
                  <span>Everything in Pro</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#6C63FF] shrink-0" />
                  <span>Unlimited Shared Workspaces</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#6C63FF] shrink-0" />
                  <span>Real-time Team Collaboration</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#6C63FF] shrink-0" />
                  <span>Admin permissions controls</span>
                </li>
              </ul>
            </div>
            
            <button 
              onClick={() => setActiveTab("Signup")}
              className="mt-8 w-full py-2.5 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
            >
              Start Team Trial
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-4xl mx-auto px-4 py-20 w-full border-t border-zinc-900">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-zinc-400 text-sm">Have details you need clarified? Browse our answers below.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div 
                key={index}
                className="rounded-lg border border-zinc-800 bg-zinc-900/10 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="flex items-center justify-between w-full p-5 text-left text-sm font-semibold text-zinc-200 hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-4.5 w-4.5 text-[#6C63FF]" />
                    <span>{faq.question}</span>
                  </div>
                  <ChevronDown className={`h-4.5 w-4.5 text-zinc-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="p-5 pt-0 text-xs text-zinc-400 leading-relaxed border-t border-zinc-800/50 mt-1">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-[#6C63FF] flex items-center justify-center font-bold text-white text-xs">
              N
            </div>
            <span className="text-sm font-bold text-zinc-200">Nexora App</span>
          </div>

          <p className="text-[11px] text-zinc-600">
            &copy; {new Date().getFullYear()} Nexora Inc. All rights reserved. Made for modern creators.
          </p>

          <div className="flex gap-6 text-xs text-zinc-500 font-medium">
            <a href="#" className="hover:text-zinc-300">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-300">Terms of Service</a>
            <a href="#" className="hover:text-zinc-300">Support</a>
          </div>
        </div>
      </footer>

      {/* Demo Video Modal Mockup */}
      <AnimatePresence>
        {demoOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#09090B]/90 backdrop-blur-md"
              onClick={() => setDemoOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl rounded-xl border border-zinc-800 bg-zinc-950 p-1 shadow-2xl z-10 overflow-hidden"
            >
              <div className="absolute top-2 right-2 z-20">
                <button 
                  onClick={() => setDemoOpen(false)}
                  className="p-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Video placeholder */}
              <div className="aspect-[16/9] w-full bg-zinc-900 flex flex-col items-center justify-center relative p-6">
                <div className="absolute inset-0 bg-cover opacity-20" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80')" }}></div>
                <div className="h-14 w-14 rounded-full bg-[#6C63FF] flex items-center justify-center text-white mb-4 animate-pulse">
                  <Play className="h-5 w-5 ml-0.5 fill-white" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-200 relative">Nexora Product Demo Video</h3>
                <p className="text-xs text-zinc-500 max-w-md text-center mt-2 relative">
                  Discover how Nexora integrates calendar planning, AI scriptwriters, CRM systems, and note outline structures to 10x your productivity.
                </p>
                <div className="mt-6 flex gap-3 relative">
                  <button 
                    onClick={() => {
                      setDemoOpen(false);
                      setActiveTab("Signup");
                    }}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#6C63FF] text-white"
                  >
                    Get Started Now
                  </button>
                  <button 
                    onClick={() => setDemoOpen(false)}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-800 text-zinc-300"
                  >
                    Close Demo
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
