"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  TrendingUp,
  BrainCircuit,
  AlertCircle,
  User,
} from "lucide-react";
import { login, signup } from "@/lib/api";

interface AuthPageProps {
  onLogin: (token: string, user: any) => void;
}

export default function AuthPage({ onLogin }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("arjun@finpilot.ai");
  const [password, setPassword] = useState("FinPilot@2026");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        const data = await login(email, password);
        onLogin(data.token, data.user);
      } else {
        if (!name.trim()) {
          setError("Please enter your full name");
          setLoading(false);
          return;
        }
        const data = await signup(name, email, password);
        onLogin(data.token, data.user);
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: BrainCircuit, title: "AI-Powered Analysis", desc: "6 AI agents monitor your finances 24/7" },
    { icon: Shield, title: "Enterprise Security", desc: "AES-256 encryption, OAuth2, RBAC" },
    { icon: TrendingUp, title: "Smart Forecasting", desc: "Prophet + LSTM financial predictions" },
  ];

  return (
    <div className="min-h-screen flex relative z-10">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 relative overflow-hidden">
        {/* Floating Orbs */}
        <div className="floating-orb w-64 h-64 bg-[#4361ee]/30 top-20 -left-20" style={{ animationDelay: "0s" }} />
        <div className="floating-orb w-48 h-48 bg-[#06d6a0]/25 bottom-40 right-10" style={{ animationDelay: "3s" }} />
        <div className="floating-orb w-32 h-32 bg-[#7c3aed]/20 top-1/2 left-1/3" style={{ animationDelay: "5s" }} />

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 mb-16"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4361ee] to-[#06d6a0] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">FinPilot AI</h1>
              <p className="text-xs text-[var(--color-text-muted)]">AI Financial Operating System</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-4xl font-bold text-[var(--color-text-primary)] leading-tight mb-4">
              Your AI CFO,<br />
              <span className="gradient-text">Accountant</span> &{" "}
              <span className="gradient-text-gold">Tax Advisor</span>
            </h2>
            <p className="text-lg text-[var(--color-text-secondary)] max-w-md">
              The next-generation financial platform that replaces your expense tracker, accounting software, and financial advisor — all powered by AI.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative z-10 space-y-4"
        >
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.15 }}
                className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]"
              >
                <div className="w-10 h-10 rounded-xl bg-[#4361ee]/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#4361ee]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">{f.title}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{f.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Right Panel — Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4361ee] to-[#06d6a0] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold gradient-text">FinPilot AI</h1>
          </div>

          <div className="glass-card p-8">
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-1">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h3>
            <p className="text-sm text-[var(--color-text-muted)] mb-6">
              {isLogin ? "Sign in to your AI financial dashboard" : "Start your financial intelligence journey"}
            </p>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-[#f43f5e]/10 border border-[#f43f5e]/20"
              >
                <AlertCircle className="w-4 h-4 text-[#f43f5e] flex-shrink-0" />
                <p className="text-xs text-[#f43f5e]">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Arjun Sharma"
                      className="input-field pl-10"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="input-field pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className="btn-primary w-full !py-3 flex items-center justify-center gap-2 relative overflow-hidden"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <>
                    {isLogin ? "Sign In" : "Create Account"}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Toggle */}
            <p className="text-center mt-6 text-sm text-[var(--color-text-secondary)]">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
                className="text-[#4361ee] font-semibold hover:underline"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>

          <p className="text-center mt-4 text-[10px] text-[var(--color-text-muted)]">
            By continuing, you agree to FinPilot AI&apos;s Terms of Service and Privacy Policy
          </p>
        </motion.div>
      </div>
    </div>
  );
}
