"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  PieChart as PieChartIcon,
  TrendingDown,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { mockExpenseBreakdown, formatCurrency, formatCurrencyShort } from "@/lib/data";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const monthlyExpenses = [
  { month: "Jan", amount: 890000 },
  { month: "Feb", amount: 920000 },
  { month: "Mar", amount: 870000 },
  { month: "Apr", amount: 980000 },
  { month: "May", amount: 1050000 },
];

const spendingAlerts = [
  { category: "Food & Dining", amount: 12500, alert: "3x above average", type: "emotional" as const },
  { category: "Subscriptions", amount: 8700, alert: "3 unused subscriptions", type: "wasteful" as const },
  { category: "Cloud Infrastructure", amount: 89000, alert: "Spike: +22% MoM", type: "spike" as const },
];

export default function ExpensesView() {
  const totalExpenses = mockExpenseBreakdown.reduce((s, e) => s + e.amount, 0);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div variants={itemVariants} className="glass-card metric-card rose p-4">
          <p className="text-xs text-[#5a6a8a] mb-1">Total Expenses</p>
          <p className="text-2xl font-bold text-[#f43f5e]">{formatCurrency(totalExpenses)}</p>
          <span className="text-xs text-[#f43f5e]">↑ 7.1% from last month</span>
        </motion.div>
        <motion.div variants={itemVariants} className="glass-card metric-card green p-4">
          <p className="text-xs text-[#5a6a8a] mb-1">Savings Rate</p>
          <p className="text-2xl font-bold text-[#10b981]">25.3%</p>
          <span className="text-xs text-[#94a3c8]">Target: 30%</span>
        </motion.div>
        <motion.div variants={itemVariants} className="glass-card metric-card amber p-4">
          <p className="text-xs text-[#5a6a8a] mb-1">Wasteful Spending</p>
          <p className="text-2xl font-bold text-[#f59e0b]">{formatCurrency(21200)}</p>
          <span className="text-xs text-[#f59e0b]">AI detected 3 items</span>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <motion.div variants={itemVariants} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-[#f0f4ff] mb-4">Category Breakdown</h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie data={mockExpenseBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="amount" strokeWidth={0}>
                  {mockExpenseBreakdown.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 flex-1">
              {mockExpenseBreakdown.map((item) => (
                <div key={item.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded" style={{ background: item.color }} />
                    <span className="text-xs text-[#94a3c8]">{item.category}</span>
                  </div>
                  <span className="text-xs font-semibold text-[#f0f4ff]">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Monthly Trend */}
        <motion.div variants={itemVariants} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-[#f0f4ff] mb-4">Monthly Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyExpenses}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "#5a6a8a", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#5a6a8a", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCurrencyShort(v)} />
              <Tooltip contentStyle={{ background: "#151d35", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, fontSize: 12, color: "#f0f4ff" }} formatter={(value) => formatCurrency(Number(value ?? 0))} />
              <Bar dataKey="amount" fill="#f43f5e" radius={[6, 6, 0, 0]} name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* AI Spending Alerts */}
      <motion.div variants={itemVariants} className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-[#f59e0b]" />
          <h3 className="text-sm font-semibold text-[#f0f4ff]">AI Spending Alerts</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {spendingAlerts.map((alert) => (
            <div key={alert.category} className="p-4 rounded-xl bg-white/[0.02] border border-[#f59e0b]/15">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-[#f59e0b]" />
                <span className="text-xs font-semibold text-[#f0f4ff]">{alert.category}</span>
              </div>
              <p className="text-lg font-bold text-[#f0f4ff] mb-1">{formatCurrency(alert.amount)}</p>
              <p className="text-xs text-[#f59e0b]">{alert.alert}</p>
              <span className="badge badge-warning text-[10px] !py-0 mt-2 capitalize">{alert.type} spending</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
