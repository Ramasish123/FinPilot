"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Receipt,
  BookOpen,
  FileSpreadsheet,
  ArrowLeftRight,
  Download,
  Plus,
  ChevronRight,
} from "lucide-react";
import { formatCurrency } from "@/lib/data";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const journalEntries = [
  { id: "JE001", date: "2026-05-01", description: "Salary Payment Received", debit: { account: "Bank - HDFC", amount: 375000 }, credit: { account: "Salary Income", amount: 375000 } },
  { id: "JE002", date: "2026-05-05", description: "Netflix Subscription", debit: { account: "Entertainment Expense", amount: 2499 }, credit: { account: "Credit Card - SBI", amount: 2499 } },
  { id: "JE003", date: "2026-05-07", description: "AWS Cloud Hosting", debit: { account: "Infrastructure Expense", amount: 89000 }, credit: { account: "Bank - ICICI", amount: 89000 } },
  { id: "JE004", date: "2026-05-09", description: "Client Payment - CloudSync", debit: { account: "Bank - ICICI", amount: 200000 }, credit: { account: "Service Revenue", amount: 200000 } },
  { id: "JE005", date: "2026-05-12", description: "Mutual Fund Investment", debit: { account: "Investment - MF", amount: 150000 }, credit: { account: "Bank - HDFC", amount: 150000 } },
];

const trialBalance = [
  { account: "Cash & Bank", debit: 3192520, credit: 0 },
  { account: "Accounts Receivable", debit: 450000, credit: 0 },
  { account: "Investments", debit: 1523400, credit: 0 },
  { account: "Equipment", debit: 350000, credit: 0 },
  { account: "Accounts Payable", debit: 0, credit: 280000 },
  { account: "Loans", debit: 0, credit: 8890000 },
  { account: "Revenue", debit: 0, credit: 4718230 },
  { account: "Expenses", debit: 1050000, credit: 0 },
  { account: "Owner's Equity", debit: 0, credit: 2500000 },
];

const tabs = ["Journal", "Ledger", "Trial Balance", "P&L", "Balance Sheet"];

export default function AccountingView() {
  const [activeTab, setActiveTab] = useState("Journal");

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="p-6 space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <motion.div variants={itemVariants} className="glass-card metric-card green p-4">
          <p className="text-xs text-[#5a6a8a] mb-1">Total Assets</p>
          <p className="text-xl font-bold text-[#10b981]">{formatCurrency(5515920)}</p>
        </motion.div>
        <motion.div variants={itemVariants} className="glass-card metric-card rose p-4">
          <p className="text-xs text-[#5a6a8a] mb-1">Total Liabilities</p>
          <p className="text-xl font-bold text-[#f43f5e]">{formatCurrency(9170000)}</p>
        </motion.div>
        <motion.div variants={itemVariants} className="glass-card metric-card blue p-4">
          <p className="text-xs text-[#5a6a8a] mb-1">Net Revenue</p>
          <p className="text-xl font-bold text-[#4361ee]">{formatCurrency(4718230)}</p>
        </motion.div>
        <motion.div variants={itemVariants} className="glass-card metric-card amber p-4">
          <p className="text-xs text-[#5a6a8a] mb-1">Net Profit</p>
          <p className="text-xl font-bold text-[#f59e0b]">{formatCurrency(3668230)}</p>
        </motion.div>
      </div>

      {/* Tabs */}
      <motion.div variants={itemVariants} className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.02] border border-white/[0.04] w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === tab
                ? "bg-[#4361ee]/15 text-[#4361ee] border border-[#4361ee]/20"
                : "text-[#94a3c8] hover:text-[#f0f4ff] hover:bg-white/[0.03]"
            }`}
          >
            {tab}
          </button>
        ))}
      </motion.div>

      {/* Content */}
      {activeTab === "Journal" && (
        <motion.div variants={itemVariants} className="glass-card overflow-hidden">
          <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#4361ee]" />
              <h3 className="text-sm font-semibold text-[#f0f4ff]">Journal Entries</h3>
            </div>
            <div className="flex gap-2">
              <button className="btn-secondary !py-1.5 !text-xs flex items-center gap-1"><Download className="w-3 h-3" />Export</button>
              <button className="btn-primary !py-1.5 !text-xs flex items-center gap-1"><Plus className="w-3 h-3" />New Entry</button>
            </div>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Description</th>
                <th>Debit Account</th>
                <th className="text-right">Debit (₹)</th>
                <th>Credit Account</th>
                <th className="text-right">Credit (₹)</th>
              </tr>
            </thead>
            <tbody>
              {journalEntries.map((entry) => (
                <tr key={entry.id}>
                  <td className="text-[#4361ee] font-mono text-xs">{entry.id}</td>
                  <td className="text-sm">{new Date(entry.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</td>
                  <td className="text-sm font-medium text-[#f0f4ff]">{entry.description}</td>
                  <td className="text-sm">{entry.debit.account}</td>
                  <td className="text-right text-sm font-semibold text-[#10b981]">{formatCurrency(entry.debit.amount)}</td>
                  <td className="text-sm">{entry.credit.account}</td>
                  <td className="text-right text-sm font-semibold text-[#f43f5e]">{formatCurrency(entry.credit.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {activeTab === "Trial Balance" && (
        <motion.div variants={itemVariants} className="glass-card overflow-hidden">
          <div className="p-4 border-b border-white/[0.06]">
            <h3 className="text-sm font-semibold text-[#f0f4ff]">Trial Balance — As of May 2026</h3>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Account</th>
                <th className="text-right">Debit (₹)</th>
                <th className="text-right">Credit (₹)</th>
              </tr>
            </thead>
            <tbody>
              {trialBalance.map((row) => (
                <tr key={row.account}>
                  <td className="text-sm font-medium text-[#f0f4ff]">{row.account}</td>
                  <td className="text-right text-sm">{row.debit ? formatCurrency(row.debit) : "—"}</td>
                  <td className="text-right text-sm">{row.credit ? formatCurrency(row.credit) : "—"}</td>
                </tr>
              ))}
              <tr className="!bg-white/[0.02]">
                <td className="text-sm font-bold text-[#f0f4ff]">Total</td>
                <td className="text-right text-sm font-bold text-[#10b981]">{formatCurrency(trialBalance.reduce((s, r) => s + r.debit, 0))}</td>
                <td className="text-right text-sm font-bold text-[#f43f5e]">{formatCurrency(trialBalance.reduce((s, r) => s + r.credit, 0))}</td>
              </tr>
            </tbody>
          </table>
        </motion.div>
      )}

      {(activeTab === "Ledger" || activeTab === "P&L" || activeTab === "Balance Sheet") && (
        <motion.div variants={itemVariants} className="glass-card p-8 text-center">
          <FileSpreadsheet className="w-12 h-12 text-[#5a6a8a] mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-[#f0f4ff] mb-1">{activeTab} Statement</h3>
          <p className="text-xs text-[#5a6a8a] mb-4">AI is auto-generating your {activeTab} from transaction data</p>
          <div className="flex justify-center gap-2">
            <button className="btn-primary !text-xs">Generate Now</button>
            <button className="btn-secondary !text-xs">Download Template</button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
