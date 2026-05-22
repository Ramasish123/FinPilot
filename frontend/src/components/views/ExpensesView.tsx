"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PieChart as PieChartIcon,
  TrendingDown,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  Plus,
  Download,
  X,
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

const colors = ["#4361ee", "#06d6a0", "#f59e0b", "#7c3aed", "#f43f5e", "#0ea5e9", "#64748b"];

export default function ExpensesView() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [expenseBreakdown, setExpenseBreakdown] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ category: "", description: "", amount: "", date: "" });
  const { success, error } = useToast();

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/expenses");
      const fetchedExpenses = res.expenses || [];
      setExpenses(fetchedExpenses);

      const breakdownMap: Record<string, number> = {};
      let totalAmt = 0;
      fetchedExpenses.forEach((e: any) => {
        breakdownMap[e.category] = (breakdownMap[e.category] || 0) + e.amount;
        totalAmt += e.amount;
      });

      const breakdown = Object.entries(breakdownMap)
        .map(([category, amount], index) => ({
          category,
          amount,
          percentage: totalAmt ? (((amount as number) / totalAmt) * 100).toFixed(1) : "0",
          color: colors[index % colors.length],
        }))
        .sort((a, b) => (b.amount as number) - (a.amount as number));

      setExpenseBreakdown(breakdown);
    } catch (err: any) {
      error("Failed to load expenses", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/expenses", {
        ...formData,
        amount: Number(formData.amount),
      });
      success("Expense added successfully");
      setShowAddModal(false);
      setFormData({ category: "", description: "", amount: "", date: "" });
      fetchExpenses();
    } catch (err: any) {
      error("Failed to add expense", err.message);
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      await exportData("expenses");
      success("Exported successfully");
    } catch (err: any) {
      error("Failed to export", err.message);
    }
  };

  const totalExpenses = expenseBreakdown.reduce((s, e) => s + (e.amount as number), 0);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="p-6 space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-[#f0f4ff]">Expenses Overview</h2>
        <div className="flex items-center gap-3">
          <button onClick={handleExport} className="btn-secondary py-2 px-4 flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={() => setShowAddModal(true)} className="btn-primary py-2 px-4 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Expense
          </button>
        </div>
      </div>

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
                <Pie data={expenseBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="amount" strokeWidth={0}>
                  {expenseBreakdown.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 flex-1 max-h-[200px] overflow-y-auto pr-2">
              {expenseBreakdown.map((item) => (
                <div key={item.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded flex-shrink-0" style={{ background: item.color }} />
                    <span className="text-xs text-[#94a3c8] truncate max-w-[120px]">{item.category}</span>
                  </div>
                  <span className="text-xs font-semibold text-[#f0f4ff]">{item.percentage}%</span>
                </div>
              ))}
              {expenseBreakdown.length === 0 && (
                <p className="text-xs text-[#5a6a8a]">No data available.</p>
              )}
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

      {/* Expense List */}
      <motion.div variants={itemVariants} className="glass-card p-5">
        <h3 className="text-sm font-semibold text-[#f0f4ff] mb-4">Recent Expenses</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#94a3c8]">
            <thead className="text-xs uppercase text-[#5a6a8a] bg-white/[0.02]">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Date</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 rounded-r-lg text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3 whitespace-nowrap">{expense.date}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded bg-[#4361ee]/10 text-[#4361ee] text-xs font-medium">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#f0f4ff]">{expense.description}</td>
                  <td className="px-4 py-3 text-right font-medium text-[#f0f4ff] whitespace-nowrap">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        expense.status === "tracked"
                          ? "bg-[#10b981]/10 text-[#10b981]"
                          : "bg-[#f59e0b]/10 text-[#f59e0b]"
                      }`}
                    >
                      {expense.status}
                    </span>
                  </td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-[#5a6a8a]">
                    No expenses found. Add one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

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
              <span className="inline-block px-2 py-1 bg-[#f59e0b]/10 text-[#f59e0b] rounded text-[10px] font-medium mt-2 capitalize">
                {alert.type} spending
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Add Expense Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-md p-6 relative"
            >
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-4 right-4 p-1 rounded-lg text-[#94a3c8] hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-semibold text-[#f0f4ff] mb-6">Add New Expense</h3>
              <form onSubmit={handleAddExpense} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#94a3c8] mb-1.5">Category</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Food & Dining"
                    className="w-full bg-[#0a0f1c]/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#4361ee] focus:bg-[#0a0f1c] transition-colors"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#94a3c8] mb-1.5">Description</label>
                  <input
                    type="text"
                    required
                    placeholder="Brief description"
                    className="w-full bg-[#0a0f1c]/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#4361ee] focus:bg-[#0a0f1c] transition-colors"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#94a3c8] mb-1.5">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full bg-[#0a0f1c]/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#4361ee] focus:bg-[#0a0f1c] transition-colors"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#94a3c8] mb-1.5">Date</label>
                  <input
                    type="date"
                    required
                    className="w-full bg-[#0a0f1c]/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#4361ee] focus:bg-[#0a0f1c] transition-colors"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div className="pt-4">
                  <button type="submit" className="btn-primary w-full py-2.5" disabled={loading}>
                    {loading ? "Saving..." : "Save Expense"}
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
