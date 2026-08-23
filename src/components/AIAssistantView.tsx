"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Sparkles, Send, Copy, Check, FileText, 
  Handshake, HelpCircle, MessageSquare, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessage {
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

export const AIAssistantView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "ai",
      text: "Hello! I am your Nexora AI Creative Coach. 🚀\n\nI can help you write scripts, optimize tags, draft sponsor outreach templates, or brainstorm video concepts. Select a tool on the left or type your prompt below to start.",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const prompts = [
    { 
      label: "Viral Video Titles", 
      prompt: "Generate 5 high-CTR titles for a video about building a SaaS in 24 hours.",
      response: `Here are 5 high-CTR titles for a video about building a SaaS in 24 hours:

1. **I Built a SaaS in 24 Hours (And Made My First Sale)**
   - *Hook:* Curiosity & Proof. Showcases immediate monetization.
2. **24 Hours. One Developer. A $10,000/mo SaaS App?**
   - *Hook:* High stakes challenge. Extreme speed focus.
3. **The 24-Hour SaaS Challenge: Zero to Production**
   - *Hook:* Structured journey. Relatable struggle.
4. **I Recreated my Favorite Software in 1 Day (Under budget)**
   - *Hook:* Comparative appeal. Authority build.
5. **How to Build a Startup in 24 Hours (Without burnout)**
   - *Hook:* High value tutorial. Solves a major developer pain point.`
    },
    { 
      label: "Sponsor Pitch Email", 
      prompt: "Draft a cold sponsor outreach email for a database company.",
      response: `Subject: Partnership: [My Channel Name] x [Brand Name]

Hey [Brand Contact Name],

I hope this email finds you well.

I've been using [Product/Brand] for my database clustering in my production builds, and my audience regularly asks about scalable database design.

I'm currently outlining an upcoming YouTube video: **"Building a Resilient Backend Stack in 2026."**

My audience consists of **42,000+ developers, tech enthusiasts, and SaaS builders** with an average engagement rate of **6.2%**. I would love to showcase a dedicated 60-second segment explaining how developers can set up [Product] cluster schemas in under 5 minutes.

Here are my details:
- **Average Views:** 15,000 - 30,000 per video
- **Audience Location:** US, India, UK, Germany
- **Past sponsors:** Vercel, Stripe, Supabase

Let me know if you have budget for integrations in Q3/Q4.

Best,
Alex Mercer`
    },
    { 
      label: "High-Retention Hooks", 
      prompt: "Write 3 high-retention hooks for a video about Next.js 15 tips.",
      response: `Here are 3 high-retention hooks for a video about Next.js 15:

* **Hook 1: The Fear Hook (Best for broad devs)**
  > "Stop using standard layout schemas in Next.js. With version 15, they actually slow down your hydration by up to 40%. Here is the correct way to handle dynamic routing without breaking your pages."

* **Hook 2: The Proof Hook (Best for advanced devs)**
  > "I cut my bundle size in half by changing exactly three parameters in my next.config file. No extra packages, no server restructuring. Today, I'm showing you the three lines of config you need to add."

* **Hook 3: The Challenge Hook (Best for engagement)**
  > "Everyone is complaining about hydration errors in Next.js 15, but it's actually not Next's fault. It's because of this single mistake developers make in React Server Components. Let's fix it in 2 minutes."`
    },
    {
      label: "SEO Descriptions & Tags",
      prompt: "Create an SEO-optimized description and tags for a Next.js 15 video.",
      response: `### SEO Description:
Learn the top 10 Next.js 15 optimization tips that every modern developer needs to know. In this video, we deep dive into React Server Components, hydration improvements, static exports, and performance tweaks in Next.js 15 to make your SaaS apps extremely fast.

Timestamps:
0:00 - Introduction
1:30 - Async Layout Parameters
5:00 - Server Action Form Pending
9:00 - Production Build Tweaks

### Meta Tags:
nextjs 15, react server components, next.js tutorial, web development 2026, typescript saas, vercel deployment, nextjs build optimization`
    }
  ];

  // Simulating AI Streaming Output
  const streamAIResponse = (text: string) => {
    setIsTyping(true);
    let currentText = "";
    const words = text.split(" ");
    let wordIdx = 0;

    const interval = setInterval(() => {
      if (wordIdx >= words.length) {
        clearInterval(interval);
        setIsTyping(false);
        return;
      }
      currentText += (wordIdx === 0 ? "" : " ") + words[wordIdx];
      
      setMessages(prev => {
        const history = [...prev];
        const lastMsg = history[history.length - 1];
        if (lastMsg && lastMsg.sender === "ai" && lastMsg !== prev[0]) {
          // Edit last AI message in-place
          history[history.length - 1] = {
            ...lastMsg,
            text: currentText
          };
          return history;
        } else {
          return [...history, { sender: "ai", text: currentText, timestamp: new Date() }];
        }
      });
      wordIdx++;
    }, 40);
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg: ChatMessage = {
      sender: "user",
      text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");

    // Simulate thinking delay
    setIsTyping(true);
    setTimeout(() => {
      // Check if prompt matches any pre-made prompt
      const matchedPrompt = prompts.find(p => p.prompt.toLowerCase().includes(text.toLowerCase()) || text.toLowerCase().includes(p.label.toLowerCase()));
      
      if (matchedPrompt) {
        streamAIResponse(matchedPrompt.response);
      } else {
        // Generic fallback script generator response
        const genericResponse = `I can help you with that! Here is a structured layout outline for your concept:

### Content Brief & Structure
* **Objective:** Capture audience attention under 3 seconds using contrast.
* **Core Hook:** Challenge the traditional approach to solving this topic.
* **Body Argument:** Show, don't tell. Present 3 real-world code blocks or designs.
* **Outro:** Push users to bookmark this page and check out Nexora.

Feel free to ask me to write the full script segment or generate titles for this outline!`;
        streamAIResponse(genericResponse);
      }
    }, 800);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(index);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="flex-1 flex overflow-hidden h-[calc(100vh-64px)] select-none">
      
      {/* Left Column: Preset Prompts list */}
      <div className="w-52 border-r border-zinc-900 bg-zinc-950 flex flex-col shrink-0">
        <div className="p-3.5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-wider">Creator Tools</h3>
            <Sparkles className="h-4 w-4 text-[#8B5CF6]" />
          </div>

          <div className="space-y-1.5">
            {prompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p.prompt)}
                disabled={isTyping}
                className="flex items-start gap-2 w-full p-2.5 rounded-lg text-left text-xs font-semibold text-zinc-450 hover:bg-zinc-900/60 hover:text-zinc-200 transition-colors border border-transparent hover:border-zinc-900 disabled:opacity-50"
              >
                <FileText className="h-4 w-4 text-zinc-650 shrink-0 mt-0.5" />
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 border-t border-zinc-900 mt-auto text-[10px] text-zinc-600 leading-normal bg-zinc-950/40">
          <HelpCircle className="h-3.5 w-3.5 text-zinc-650 mb-1" />
          Select a creator action tool to auto-generate outline parameters.
        </div>
      </div>

      {/* Right Column: Chat Interface */}
      <div className="flex-1 flex flex-col bg-zinc-950/10 overflow-hidden">
        
        {/* Chat Messages Frame */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin select-text">
          {messages.map((msg, idx) => {
            const isAi = msg.sender === "ai";
            return (
              <div 
                key={idx} 
                className={`flex gap-3 max-w-3xl ${isAi ? "mr-auto" : "ml-auto flex-row-reverse"}`}
              >
                {/* Profile Icon */}
                <div className={`h-8 w-8 rounded-lg shrink-0 flex items-center justify-center border font-bold text-xs ${
                  isAi 
                    ? "bg-[#8B5CF6]/15 border-[#8B5CF6]/30 text-[#8B5CF6]" 
                    : "bg-zinc-900 border-zinc-800 text-zinc-400"
                }`}>
                  {isAi ? "AI" : "ME"}
                </div>

                {/* Message Box */}
                <div className={`p-4 rounded-xl border relative group ${
                  isAi 
                    ? "bg-zinc-900/40 border-zinc-900 text-zinc-200" 
                    : "bg-[#6C63FF]/10 border-[#6C63FF]/20 text-zinc-100"
                }`}>
                  <p className="text-xs whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  
                  {/* Copy Button */}
                  {isAi && (
                    <button
                      onClick={() => copyToClipboard(msg.text, idx)}
                      className="absolute right-2 top-2 p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Copy response"
                    >
                      {copiedId === idx ? <Check className="h-3 w-3 text-[#22C55E]" /> : <Copy className="h-3 w-3" />}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 max-w-lg mr-auto">
              <div className="h-8 w-8 rounded-lg shrink-0 bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center font-bold text-xs text-[#8B5CF6]">
                AI
              </div>
              <div className="p-3 bg-zinc-900/30 border border-zinc-900 rounded-xl flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-650 animate-bounce"></span>
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-650 animate-bounce delay-100"></span>
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-650 animate-bounce delay-200"></span>
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-zinc-900 bg-zinc-950/40">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(inputText); }}
            className="flex items-center gap-2.5 max-w-3xl mx-auto bg-zinc-900/60 border border-zinc-850 px-3 py-2 rounded-xl focus-within:border-[#6C63FF]/50 transition-colors"
          >
            <input
              type="text"
              placeholder="Ask AI scriptwriter to generate video hooks, outlines, email copies..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="bg-transparent border-none text-xs text-zinc-100 placeholder-zinc-500 outline-none w-full"
            />
            
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="h-8 w-8 rounded-lg bg-gradient-to-tr from-[#6C63FF] to-[#8B5CF6] text-white flex items-center justify-center shrink-0 disabled:opacity-50 active:scale-95 transition-all"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
