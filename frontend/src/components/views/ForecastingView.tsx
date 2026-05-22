"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BrainCircuit,
  TrendingUp,
  AlertTriangle,
  Target,
  Zap,
  ArrowUpRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { mockForecastData, formatCurrency, formatCurrencyShort } from "@/lib/data";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function ForecastTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;
  return (
    <div className="glass-card !p-3 !rounded-lg !border-white/10">
      <p className="text-xs text-[#94a3c8] mb-1.5">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-xs" style={{ color: p.color }}>
          <span className="font-semibold">{p.name}:</span> {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
}

const expenseForecast = [
  { month: "Jan 26", actual: 890000, forecast: 890000 },
  { month: "Feb 26", actual: 920000, forecast: 910000 },
  { month: "Mar 26", actual: 870000, forecast: 930000 },
  { month: "Apr 26", actual: 980000, forecast: 960000 },
  { month: "May 26", actual: 1050000, forecast: 990000 },
  { month: "Jun 26", forecast: 1020000 },
  { month: "Jul 26", forecast: 1060000 },
  { month: "Aug 26", forecast: 1100000 },
  { month: "Sep 26", forecast: 1150000 },
];

const savingsForecast = [
  { month: "Jan", current: 450000, projected: 450000, target: 600000 },
  { month: "Feb", current: 520000, projected: 520000, target: 600000 },
  { month: "Mar", current: 580000, projected: 580000, target: 600000 },
  { month: "Apr", current: 650000, projected: 650000, target: 600000 },
  { month: "May", current: 700000, projected: 700000, target: 600000 },
  { month: "Jun", projected: 770000, target: 600000 },
  { month: "Jul", projected: 850000, target: 600000 },
  { month: "Aug", projected: 940000, target: 600000 },
];

export default function ForecastingView() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <motion.div variants={itemVariants} className="glass-card metric-card blue p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-[#4361ee]" />
            <p className="text-xs text-[#5a6a8a]">Projected Revenue (Dec)</p>
          </div>
          <p className="text-xl font-bold text-[#f0f4ff]">{formatCurrency(3100000)}</p>
          <span className="text-xs text-[#10b981]">↑ 73% YoY growth</span>
        </motion.div>
        <motion.div variants={itemVariants} className="glass-card metric-card green p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-[#06d6a0]" />
            <p className="text-xs text-[#5a6a8a]">Confidence Level</p>
          </div>
          <p className="text-xl font-bold text-[#06d6a0]">87%</p>
          <span className="text-xs text-[#94a3c8]">Based on 12m data</span>
        </motion.div>
        <motion.div variants={itemVariants} className="glass-card metric-card amber p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-[#f59e0b]" />
            <p className="text-xs text-[#5a6a8a]">Bankruptcy Risk</p>
          </div>
          <p className="text-xl font-bold text-[#10b981]">Low</p>
          <span className="text-xs text-[#94a3c8]">2.3% probability</span>
        </motion.div>
        <motion.div variants={itemVariants} className="glass-card metric-card violet p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-[#7c3aed]" />
            <p className="text-xs text-[#5a6a8a]">Growth Rate</p>
          </div>
          <p className="text-xl font-bold text-[#7c3aed]">+8.7%</p>
          <span className="text-xs text-[#94a3c8]">Month-over-month</span>
        </motion.div>
      </div>

      {/* Revenue Forecast Chart */}
      <motion.div variants={itemVariants} className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-[#4361ee]" />
            <div>
              <h3 className="text-sm font-semibold text-[#f0f4ff]">Revenue Forecast</h3>
              <p className="text-xs text-[#5a6a8a]">Prophet + LSTM Model · 87% Confidence</p>
            </div>
          </div>
          <div className="flex gap-4 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#4361ee]" />Actual</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#06d6a0]" />Forecast</span>
            <span className="flex items-center gap-1.5"><span className="w-6 h-2 rounded bg-[#4361ee]/20" />Confidence Band</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={mockForecastData}>
            <defs>
              <linearGradient id="gradConfidence" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4361ee" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#4361ee" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gradForecast" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06d6a0" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06d6a0" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" tick={{ fill: "#5a6a8a", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#5a6a8a", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCurrencyShort(v)} />
            <Tooltip content={<ForecastTooltip />} />
            <Area type="monotone" dataKey="upper" stroke="none" fill="url(#gradConfidence)" name="Upper Bound" />
            <Area type="monotone" dataKey="lower" stroke="none" fill="#0a0e1a" name="Lower Bound" />
            <Line type="monotone" dataKey="actual" stroke="#4361ee" strokeWidth={2.5} dot={{ r: 4, fill: "#4361ee" }} name="Actual" connectNulls={false} />
            <Line type="monotone" dataKey="forecast" stroke="#06d6a0" strokeWidth={2} strokeDasharray="6 4" dot={{ r: 3, fill: "#06d6a0" }} name="Forecast" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Forecast */}
        <motion.div variants={itemVariants} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-[#f0f4ff] mb-1">Expense Forecast</h3>
          <p className="text-xs text-[#5a6a8a] mb-4">Predicted monthly burn rate</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={expenseForecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "#5a6a8a", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#5a6a8a", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCurrencyShort(v)} />
              <Tooltip content={<ForecastTooltip />} />
              <Line type="monotone" dataKey="actual" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3 }} name="Actual" connectNulls={false} />
              <Line type="monotone" dataKey="forecast" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 3" dot={{ r: 3 }} name="Forecast" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Savings Forecast */}
        <motion.div variants={itemVariants} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-[#f0f4ff] mb-1">Savings Projection</h3>
          <p className="text-xs text-[#5a6a8a] mb-4">On track to exceed target</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={savingsForecast}>
              <defs>
                <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06d6a0" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06d6a0" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "#5a6a8a", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#5a6a8a", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCurrencyShort(v)} />
              <Tooltip content={<ForecastTooltip />} />
              <Area type="monotone" dataKey="projected" stroke="#06d6a0" fill="url(#savingsGrad)" strokeWidth={2} name="Projected" />
              <Line type="monotone" dataKey="current" stroke="#4361ee" strokeWidth={2} dot={{ r: 3 }} name="Current" connectNulls={false} />
              <Line type="monotone" dataKey="target" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="8 4" dot={false} name="Target" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </motion.div>
  );
}
