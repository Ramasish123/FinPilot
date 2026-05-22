"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Briefcase,
  Home,
  CreditCard,
  DollarSign,
  ArrowUpRight,
  Sparkles,
  PiggyBank,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { mockIncomeSourcesData, formatCurrency, formatCurrencyShort } from "@/lib/data";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const monthlyIncome = [
  { month: "Jan", salary: 375000, freelance: 45000, business: 280000, other: 50000 },
  { month: "Feb", salary: 375000, freelance: 60000, business: 310000, other: 55000 },
  { month: "Mar", salary: 375000, freelance: 35000, business: 420000, other: 48000 },
  { month: "Apr", salary: 375000, freelance: 75000, business: 480000, other: 62000 },
  { month: "May", salary: 375000, freelance: 45000, business: 650000, other: 80000 },
];

export default function IncomeView() {
  const totalIncome = mockIncomeSourcesData.reduce((s, i) => s + i.amount, 0);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants} className="glass-card metric-card green p-4">
          <p className="text-xs text-[#5a6a8a] mb-1">Total Monthly Income</p>
          <p className="text-2xl font-bold text-[#10b981]">{formatCurrency(totalIncome)}</p>
          <span className="text-xs text-[#10b981]">↑ 18.2% from last month</span>
        </motion.div>
        <motion.div variants={itemVariants} className="glass-card metric-card blue p-4">
          <p className="text-xs text-[#5a6a8a] mb-1">Primary Salary</p>
          <p className="text-2xl font-bold text-[#f0f4ff]">{formatCurrency(375000)}</p>
          <span className="text-xs text-[#94a3c8]">TechNova Solutions</span>
        </motion.div>
        <motion.div variants={itemVariants} className="glass-card metric-card violet p-4">
          <p className="text-xs text-[#5a6a8a] mb-1">Business Revenue</p>
          <p className="text-2xl font-bold text-[#7c3aed]">{formatCurrency(650000)}</p>
          <span className="text-xs text-[#10b981]">↑ 35.4% growth</span>
        </motion.div>
        <motion.div variants={itemVariants} className="glass-card metric-card amber p-4">
          <p className="text-xs text-[#5a6a8a] mb-1">Passive Income</p>
          <p className="text-2xl font-bold text-[#f59e0b]">{formatCurrency(125000)}</p>
          <span className="text-xs text-[#94a3c8]">Investments + Rental</span>
        </motion.div>
      </div>

      {/* Income Trend */}
      <motion.div variants={itemVariants} className="glass-card p-5">
        <h3 className="text-sm font-semibold text-[#f0f4ff] mb-1">Income Breakdown by Source</h3>
        <p className="text-xs text-[#5a6a8a] mb-4">Monthly stacked view</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyIncome}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" tick={{ fill: "#5a6a8a", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#5a6a8a", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCurrencyShort(v)} />
            <Tooltip contentStyle={{ background: "#151d35", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, fontSize: 12, color: "#f0f4ff" }} formatter={(value) => formatCurrency(Number(value ?? 0))} />
            <Bar dataKey="salary" stackId="income" fill="#4361ee" radius={[0, 0, 0, 0]} name="Salary" />
            <Bar dataKey="business" stackId="income" fill="#06d6a0" radius={[0, 0, 0, 0]} name="Business" />
            <Bar dataKey="freelance" stackId="income" fill="#7c3aed" radius={[0, 0, 0, 0]} name="Freelance" />
            <Bar dataKey="other" stackId="income" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Other" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* AI Detected Income */}
      <motion.div variants={itemVariants} className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-[#f59e0b]" />
          <h3 className="text-sm font-semibold text-[#f0f4ff]">AI-Detected Income Sources</h3>
        </div>
        <div className="space-y-3">
          {mockIncomeSourcesData.map((src) => (
            <div key={src.source} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="w-10 h-10 rounded-xl bg-[#4361ee]/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-[#4361ee]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#f0f4ff]">{src.source}</p>
                <p className="text-xs text-[#5a6a8a]">{src.percentage}% of total income</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-[#f0f4ff]">{formatCurrency(src.amount)}</p>
                <span className={`text-xs font-semibold ${src.trend === "up" ? "text-[#10b981]" : src.trend === "down" ? "text-[#f43f5e]" : "text-[#94a3c8]"}`}>
                  {src.trend === "up" ? "↑ Growing" : src.trend === "down" ? "↓ Declining" : "→ Stable"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
