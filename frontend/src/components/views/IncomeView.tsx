"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Briefcase,
  Home,
  CreditCard,
  DollarSign,
  ArrowUpRight,
  Sparkles,
  PiggyBank,
  Plus,
  Download,
  X
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
import { formatCurrency, formatCurrencyShort } from "@/lib/data";
import { api, exportData } from "@/lib/api";
import { useToast } from "@/components/Toast";

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
  const { success, error: showError } = useToast();
  const [incomes, setIncomes] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    source: "",
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    is_recurring: false
  });

  const fetchIncomes = async () => {
    try {
      const data = await api.get("/income");
      setIncomes(data.income || []);
    } catch (err: any) {
      showError("Failed to fetch income data", err.message);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  const totalIncome = incomes.reduce((s, i) => s + Number(i.amount || 0), 0);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/income", {
        ...formData,
        amount: Number(formData.amount)
      });
      success("Income added successfully");
      setIsAddModalOpen(false);
      setFormData({
        source: "",
        description: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        is_recurring: false
      });
      fetchIncomes();
    } catch (err: any) {
      showError("Failed to add income", err.message);
    }
  };

  const handleExport = async () => {
    try {
      await exportData("income");
      success("Export successful");
    } catch (err: any) {
      showError("Failed to export", err.message);
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="p-6 space-y-6">
      
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Income Overview</h2>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--color-surface-800)] hover:bg-[var(--color-surface-700)] text-[var(--color-text-primary)] border border-[var(--color-glass-border)] rounded-lg transition-colors text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#4361ee] hover:bg-[#4361ee]/90 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Income
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants} className="glass-card metric-card green p-4">
          <p className="text-xs text-[var(--color-text-muted)] mb-1">Total Tracked Income</p>
          <p className="text-2xl font-bold text-[#10b981]">{formatCurrency(totalIncome)}</p>
          <span className="text-xs text-[#10b981]">Dynamic from data</span>
        </motion.div>
        <motion.div variants={itemVariants} className="glass-card metric-card blue p-4">
          <p className="text-xs text-[var(--color-text-muted)] mb-1">Primary Salary</p>
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">{formatCurrency(375000)}</p>
          <span className="text-xs text-[var(--color-text-secondary)]">TechNova Solutions</span>
        </motion.div>
        <motion.div variants={itemVariants} className="glass-card metric-card violet p-4">
          <p className="text-xs text-[var(--color-text-muted)] mb-1">Business Revenue</p>
          <p className="text-2xl font-bold text-[#7c3aed]">{formatCurrency(650000)}</p>
          <span className="text-xs text-[#10b981]">↑ 35.4% growth</span>
        </motion.div>
        <motion.div variants={itemVariants} className="glass-card metric-card amber p-4">
          <p className="text-xs text-[var(--color-text-muted)] mb-1">Passive Income</p>
          <p className="text-2xl font-bold text-[#f59e0b]">{formatCurrency(125000)}</p>
          <span className="text-xs text-[var(--color-text-secondary)]">Investments + Rental</span>
        </motion.div>
      </div>

      {/* Income Trend */}
      <motion.div variants={itemVariants} className="glass-card p-5">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">Income Breakdown by Source</h3>
        <p className="text-xs text-[var(--color-text-muted)] mb-4">Monthly stacked view</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyIncome}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-glass-border)" />
            <XAxis dataKey="month" tick={{ fill: "var(--color-text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "var(--color-text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCurrencyShort(v)} />
            <Tooltip contentStyle={{ background: "#151d35", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, fontSize: 12, color: "#f0f4ff" }} formatter={(value) => formatCurrency(Number(value ?? 0))} />
            <Bar dataKey="salary" stackId="income" fill="#4361ee" radius={[0, 0, 0, 0]} name="Salary" />
            <Bar dataKey="business" stackId="income" fill="#06d6a0" radius={[0, 0, 0, 0]} name="Business" />
            <Bar dataKey="freelance" stackId="income" fill="#7c3aed" radius={[0, 0, 0, 0]} name="Freelance" />
            <Bar dataKey="other" stackId="income" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Other" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Income List */}
      <motion.div variants={itemVariants} className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-[#f59e0b]" />
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Detected Income Sources</h3>
        </div>
        <div className="space-y-3">
          {incomes.length > 0 ? incomes.map((src: any, index) => (
            <div key={src.id || index} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="w-10 h-10 rounded-xl bg-[#4361ee]/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-[#4361ee]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--color-text-primary)]">{src.source || "Unknown Source"}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{src.description || (src.is_recurring ? "Recurring" : "One-time")}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-[var(--color-text-primary)]">{formatCurrency(Number(src.amount || 0))}</p>
                <span className="text-xs text-[var(--color-text-secondary)]">
                  {src.date ? new Date(src.date).toLocaleDateString() : ""}
                </span>
              </div>
            </div>
          )) : (
            <p className="text-sm text-[var(--color-text-muted)]">No income data found. Add some to get started.</p>
          )}
        </div>
      </motion.div>

      {/* Add Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-md p-6 relative"
            >
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/[0.05] transition-colors"
              >
                <X className="w-5 h-5 text-[var(--color-text-muted)]" />
              </button>
              
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-6">Add Income</h3>
              
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Source</label>
                  <input
                    type="text"
                    required
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="w-full bg-[var(--color-surface-900)] border border-[var(--color-glass-border)] rounded-xl px-4 py-2.5 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[#4361ee] transition-colors"
                    placeholder="e.g. Salary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-[var(--color-surface-900)] border border-[var(--color-glass-border)] rounded-xl px-4 py-2.5 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[#4361ee] transition-colors"
                    placeholder="e.g. Monthly salary from TechNova"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Amount</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full bg-[var(--color-surface-900)] border border-[var(--color-glass-border)] rounded-xl px-4 py-2.5 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[#4361ee] transition-colors"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-[var(--color-surface-900)] border border-[var(--color-glass-border)] rounded-xl px-4 py-2.5 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[#4361ee] transition-colors"
                  />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="is_recurring"
                    checked={formData.is_recurring}
                    onChange={(e) => setFormData({ ...formData, is_recurring: e.target.checked })}
                    className="rounded bg-[var(--color-surface-900)] border-[var(--color-glass-border)] text-[#4361ee] focus:ring-[#4361ee] w-4 h-4"
                  />
                  <label htmlFor="is_recurring" className="text-sm text-[var(--color-text-secondary)]">Recurring Income</label>
                </div>
                
                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 px-4 py-2.5 bg-[var(--color-surface-800)] hover:bg-[var(--color-surface-700)] text-[var(--color-text-primary)] rounded-xl transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-[#4361ee] hover:bg-[#4361ee]/90 text-white rounded-xl transition-colors text-sm font-medium"
                  >
                    Save Income
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
