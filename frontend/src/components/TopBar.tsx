"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Search,
  Sparkles,
  Sun,
  Moon,
  ChevronDown,
} from "lucide-react";
import { mockUser } from "@/lib/data";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export default function TopBar({ title, subtitle }: TopBarProps) {
  return (
    <header className="h-16 border-b border-white/[0.06] bg-[#0a0e1a]/60 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-6">
      {/* Left: Title */}
      <div>
        <h2 className="text-lg font-semibold text-[#f0f4ff]">{title}</h2>
        {subtitle && (
          <p className="text-xs text-[#5a6a8a] mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5a6a8a]" />
          <input
            type="text"
            placeholder="Search transactions, insights..."
            className="input-field pl-10 w-72 !py-2 !text-sm !bg-[#151d35]/60"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#5a6a8a] bg-[#1c2642] px-1.5 py-0.5 rounded">
            ⌘K
          </kbd>
        </div>

        {/* AI Quick Access */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4361ee]/20 to-[#06d6a0]/20 border border-[#4361ee]/20 flex items-center justify-center"
        >
          <Sparkles className="w-4 h-4 text-[#4361ee]" />
        </motion.button>

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-9 h-9 rounded-xl bg-[#151d35] border border-white/[0.06] flex items-center justify-center relative"
        >
          <Bell className="w-4 h-4 text-[#94a3c8]" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#f43f5e] rounded-full text-[9px] text-white flex items-center justify-center font-bold">
            3
          </span>
        </motion.button>

        {/* Divider */}
        <div className="w-px h-8 bg-white/[0.06]" />

        {/* User Profile */}
        <button className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-xl hover:bg-white/[0.03] transition-colors">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4361ee] to-[#7c3aed] flex items-center justify-center text-white text-sm font-bold">
            {mockUser.name.charAt(0)}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-sm font-medium text-[#f0f4ff] leading-tight">
              {mockUser.name}
            </p>
            <p className="text-[10px] text-[#5a6a8a] capitalize">
              {mockUser.role.replace("_", " ")}
            </p>
          </div>
          <ChevronDown className="w-3 h-3 text-[#5a6a8a] hidden lg:block" />
        </button>
      </div>
    </header>
  );
}
