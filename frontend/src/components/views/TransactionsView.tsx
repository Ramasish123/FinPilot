"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  Search,
  Eye,
  MoreHorizontal,
  AlertTriangle,
} from "lucide-react";
import { mockTransactions, formatCurrency } from "@/lib/data";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const categories = ["All", "Salary", "Freelance", "Sales", "Food", "Transport", "Shopping", "Subscription", "Healthcare", "Investment", "Bills", "Infrastructure"];
const statuses = ["All", "Completed", "Pending", "Failed"];

export default function TransactionsView() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = mockTransactions.filter((t) => {
    if (selectedCategory !== "All" && t.category !== selectedCategory) return false;
    if (selectedStatus !== "All" && t.status !== selectedStatus.toLowerCase()) return false;
    if (searchQuery && !t.merchant.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const totalCredits = filtered.filter((t) => t.type === "credit").reduce((s, t) => s + t.amount, 0);
  const totalDebits = filtered.filter((t) => t.type === "debit").reduce((s, t) => s + t.amount, 0);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div variants={itemVariants} className="glass-card metric-card green p-4">
          <p className="text-xs text-[#5a6a8a] mb-1">Total Income</p>
          <p className="text-2xl font-bold text-[#10b981]">+{formatCurrency(totalCredits)}</p>
          <p className="text-xs text-[#94a3c8] mt-1">{filtered.filter((t) => t.type === "credit").length} transactions</p>
        </motion.div>
        <motion.div variants={itemVariants} className="glass-card metric-card rose p-4">
          <p className="text-xs text-[#5a6a8a] mb-1">Total Expenses</p>
          <p className="text-2xl font-bold text-[#f43f5e]">-{formatCurrency(totalDebits)}</p>
          <p className="text-xs text-[#94a3c8] mt-1">{filtered.filter((t) => t.type === "debit").length} transactions</p>
        </motion.div>
        <motion.div variants={itemVariants} className="glass-card metric-card blue p-4">
          <p className="text-xs text-[#5a6a8a] mb-1">Net Flow</p>
          <p className={`text-2xl font-bold ${totalCredits - totalDebits >= 0 ? "text-[#10b981]" : "text-[#f43f5e]"}`}>
            {totalCredits - totalDebits >= 0 ? "+" : "-"}{formatCurrency(Math.abs(totalCredits - totalDebits))}
          </p>
          <p className="text-xs text-[#94a3c8] mt-1">{filtered.length} total transactions</p>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="glass-card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5a6a8a]" />
            <input
              type="text"
              placeholder="Search by merchant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10 !py-2.5"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#5a6a8a]" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field !w-auto !py-2 !pr-8 !text-sm"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input-field !w-auto !py-2 !pr-8 !text-sm"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <button className="btn-secondary !py-2 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </motion.div>

      {/* Transactions Table */}
      <motion.div variants={itemVariants} className="glass-card overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Merchant</th>
              <th>AI Category</th>
              <th>Account</th>
              <th>Status</th>
              <th className="text-right">Amount</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((txn, i) => (
              <motion.tr
                key={txn.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <td>
                  <span className="text-[#f0f4ff] font-medium text-sm">
                    {new Date(txn.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${txn.type === "credit" ? "bg-[#10b981]/15 text-[#10b981]" : "bg-[#f43f5e]/15 text-[#f43f5e]"}`}>
                      {txn.type === "credit" ? <ArrowDownRight className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#f0f4ff]">{txn.merchant}</p>
                      <p className="text-[10px] text-[#5a6a8a]">{txn.category}</p>
                    </div>
                    {txn.flagged && <AlertTriangle className="w-3.5 h-3.5 text-[#f59e0b]" />}
                  </div>
                </td>
                <td>
                  <span className="badge badge-info">{txn.aiCategory}</span>
                </td>
                <td className="text-sm">{txn.account}</td>
                <td>
                  <span className={`badge ${txn.status === "completed" ? "badge-success" : txn.status === "pending" ? "badge-warning" : "badge-danger"}`}>
                    {txn.status}
                  </span>
                </td>
                <td className="text-right">
                  <span className={`text-sm font-semibold ${txn.type === "credit" ? "text-[#10b981]" : "text-[#f0f4ff]"}`}>
                    {txn.type === "credit" ? "+" : "-"}{formatCurrency(txn.amount)}
                  </span>
                </td>
                <td className="text-center">
                  <button className="p-1.5 rounded-lg hover:bg-white/[0.05] transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-[#5a6a8a]" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
}
