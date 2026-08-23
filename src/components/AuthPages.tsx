"use client";

import React, { useState } from "react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { 
  Sparkles, Mail, Lock, User, ArrowRight, Terminal,
  Globe, ArrowLeft, Eye, EyeOff, Loader2
} from "lucide-react";

// Brand icon aliases
const Github = Terminal;
const Chrome = Globe;
import { motion } from "framer-motion";

interface AuthPagesProps {
  initialMode?: "login" | "signup" | "forgot";
}

export const AuthPages: React.FC<AuthPagesProps> = ({ initialMode = "login" }) => {
  const { login, signup, setActiveTab } = useWorkspace();
  const [mode, setMode] = useState<"login" | "signup" | "forgot">(initialMode);
  
  // Form fields
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email) {
      setError("Email address is required.");
      return;
    }
    
    if (mode === "signup" && !name) {
      setError("Full name is required.");
      return;
    }
    
    if (mode !== "forgot" && !password) {
      setError("Password is required.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else if (mode === "signup") {
        await signup(email, name, password);
      } else {
        // Forgot password simulation
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert(`Reset link has been dispatched to ${email}`);
        setMode("login");
      }
    } catch (err) {
      setError("Authentication failed. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  // Mock social logins
  const handleSocialLogin = async (provider: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setLoading(false);
    const mockEmail = `${provider.toLowerCase()}@nexora.app`;
    const mockName = provider === "Google" ? "Google User" : "GitHub Developer";
    await signup(mockEmail, mockName);
  };

  return (
    <div className="min-h-screen bg-[#09090B] flex flex-col md:flex-row relative overflow-hidden select-none">
      {/* Background Orbs */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-[#6C63FF]/10 rounded-full blur-[80px]" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[350px] h-[350px] bg-[#8B5CF6]/10 rounded-full blur-[100px]" />

      {/* Left Pane - Form Panel */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 xl:px-24 z-10 bg-zinc-950/20 backdrop-blur-xs">
        <div className="max-w-md w-full mx-auto">
          {/* Back button */}
          <button 
            onClick={() => setActiveTab("LandingPage")}
            className="group flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 mb-8 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to landing page</span>
          </button>

          {/* Logo header */}
          <div className="flex items-center gap-2.5 mb-6">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-[#6C63FF] to-[#8B5CF6] flex items-center justify-center font-bold text-white shadow-md shadow-[#6C63FF]/20">
              N
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Nexora</span>
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            {mode === "login" && "Welcome Back"}
            {mode === "signup" && "Create Your Account"}
            {mode === "forgot" && "Reset Password"}
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            {mode === "login" && "Unlock your creative workspace dashboard."}
            {mode === "signup" && "Start planning, writing, and organizing today."}
            {mode === "forgot" && "We will email you a password recovery link."}
          </p>

          {error && (
            <div className="mt-4 p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-xs text-[#EF4444] font-medium">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 focus:border-[#6C63FF]/60 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 focus:border-[#6C63FF]/60 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 outline-none transition-colors"
                />
              </div>
            </div>

            {mode !== "forgot" && (
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    Password
                  </label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => setMode("forgot")}
                      className="text-[10px] text-[#6C63FF] hover:underline font-medium"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 bg-zinc-900 border border-zinc-800 focus:border-[#6C63FF]/60 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 rounded-lg bg-gradient-to-tr from-[#6C63FF] to-[#8B5CF6] text-white font-semibold text-xs flex items-center justify-center gap-1.5 hover:shadow-lg hover:shadow-[#6C63FF]/15 active:scale-98 transition-all disabled:opacity-55"
            >
              {loading ? (
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === "login" && "Sign In"}
                    {mode === "signup" && "Sign Up"}
                    {mode === "forgot" && "Send Reset Link"}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Social login divider */}
          {mode !== "forgot" && (
            <>
              <div className="relative flex items-center justify-center my-6">
                <div className="border-t border-zinc-900 w-full"></div>
                <span className="absolute bg-[#09090B] px-3 text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                  Or continue with
                </span>
              </div>

              {/* Social login buttons */}
              <div className="grid grid-cols-2 gap-3.5">
                <button
                  onClick={() => handleSocialLogin("Google")}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-zinc-800 hover:bg-zinc-900 text-zinc-300 hover:text-white text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  <Chrome className="h-4 w-4 text-red-500" />
                  <span>Google</span>
                </button>
                <button
                  onClick={() => handleSocialLogin("GitHub")}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-zinc-800 hover:bg-zinc-900 text-zinc-300 hover:text-white text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  <Github className="h-4 w-4 text-white" />
                  <span>GitHub</span>
                </button>
              </div>
            </>
          )}

          {/* Mode Switcher */}
          <div className="mt-8 text-center text-xs text-zinc-500">
            {mode === "login" ? (
              <span>
                Don&apos;t have an account?{" "}
                <button 
                  onClick={() => setMode("signup")}
                  className="text-[#6C63FF] hover:underline font-semibold"
                >
                  Sign Up
                </button>
              </span>
            ) : mode === "signup" ? (
              <span>
                Already have an account?{" "}
                <button 
                  onClick={() => setMode("login")}
                  className="text-[#6C63FF] hover:underline font-semibold"
                >
                  Sign In
                </button>
              </span>
            ) : (
              <button 
                onClick={() => setMode("login")}
                className="text-[#6C63FF] hover:underline font-semibold flex items-center justify-center gap-1 mx-auto"
              >
                <ArrowLeft className="h-3 w-3" />
                <span>Return to Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right Pane - Feature Showcase */}
      <div className="hidden md:flex flex-1 bg-zinc-950 items-center justify-center relative p-8 border-l border-zinc-900">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-zinc-950 via-zinc-950/40 to-transparent" />
        
        {/* Glow effect */}
        <div className="absolute w-[300px] h-[300px] bg-[#6C63FF]/10 rounded-full blur-[100px]" />

        <div className="relative max-w-sm w-full text-left">
          {/* Glass Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-xl shadow-2xl relative overflow-hidden"
          >
            {/* Soft top gradient */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#6C63FF]/30 to-transparent" />
            
            <div className="inline-flex h-7 w-7 rounded-lg bg-[#8B5CF6]/15 text-[#8B5CF6] items-center justify-center border border-[#8B5CF6]/30 mb-4">
              <Sparkles className="h-4 w-4" />
            </div>

            <h3 className="text-sm font-bold text-zinc-100 mb-1.5">Join high-volume creators</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              &ldquo;Nexora helped me outline scripts and track sponsorships in half the time. It consolidated all my workflow tools.&rdquo;
            </p>

            <div className="border-t border-zinc-800/80 my-4"></div>

            <div className="flex items-center gap-2">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80" 
                alt="Testimonial Creator Avatar" 
                className="h-7 w-7 rounded-full border border-zinc-800 object-cover"
              />
              <div>
                <h5 className="text-[10px] font-bold text-zinc-200">Clara Sterling</h5>
                <p className="text-[9px] text-zinc-500 font-medium">YouTube Creator (120k subs)</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
