"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Receipt,
  BookOpen,
  FileSpreadsheet,
  ArrowLeftRight,
  Download,
  Plus,
  ChevronRight,
  X,
} from "lucide-react";
import { formatCurrency } from "@/lib/data";
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
  const [entries, setEntries] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    debitAccount: "",
    debitAmount: "",
    creditAccount: "",
    creditAmount: "",
  });

  const fetchEntries = async () => {
    try {
      const data = await api.get("/accounting/entries");
      setEntries(data.entries || []);
    } catch (err: any) {
      error("Failed to fetch entries", err.message);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleExport = async () => {
    try {
      await exportData("accounting");
      success("Export Successful", "Your accounting data has been downloaded.");
    } catch (err: any) {
      error("Export Failed", err.message);
    }
  };

  const handleNewEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post("/accounting/entries", formData);
      success("Entry Added", "Journal entry has been recorded successfully.");
      setShowModal(false);
      setFormData({
        date: new Date().toISOString().split("T")[0],
        description: "",
        debitAccount: "",
        debitAmount: "",
        creditAccount: "",
        creditAmount: "",
      });
      fetchEntries();
    } catch (err: any) {
      error("Failed to add entry", err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerate = () => {
    success("Generated successfully", `Your ${activeTab} statement is ready.`);
  };

  return (
    <>
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="p-6 space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <motion.div variants={itemVariants} className="glass-card metric-card green p-4">
          <p className="text-xs text-[var(--color-text-muted)] mb-1">Total Assets</p>
          <p className="text-xl font-bold text-[#10b981]">{formatCurrency(5515920)}</p>
        </motion.div>
        <motion.div variants={itemVariants} className="glass-card metric-card rose p-4">
          <p className="text-xs text-[var(--color-text-muted)] mb-1">Total Liabilities</p>
          <p className="text-xl font-bold text-[#f43f5e]">{formatCurrency(9170000)}</p>
        </motion.div>
        <motion.div variants={itemVariants} className="glass-card metric-card blue p-4">
          <p className="text-xs text-[var(--color-text-muted)] mb-1">Net Revenue</p>
          <p className="text-xl font-bold text-[#4361ee]">{formatCurrency(4718230)}</p>
        </motion.div>
        <motion.div variants={itemVariants} className="glass-card metric-card amber p-4">
          <p className="text-xs text-[var(--color-text-muted)] mb-1">Net Profit</p>
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
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/[0.03]"
            }`}
          >
            {tab}
          </button>
        ))}
      </motion.div>

      {/* Content */}
      {activeTab === "Journal" && (
        <motion.div variants={itemVariants} className="glass-card overflow-hidden">
          <div className="p-4 border-b border-[var(--color-glass-border)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#4361ee]" />
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Journal Entries</h3>
            </div>
            <div className="flex gap-2">
              <button onClick={handleExport} className="btn-secondary !py-1.5 !text-xs flex items-center gap-1"><Download className="w-3 h-3" />Export</button>
              <button onClick={() => setShowModal(true)} className="btn-primary !py-1.5 !text-xs flex items-center gap-1"><Plus className="w-3 h-3" />New Entry</button>
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
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td className="text-[#4361ee] font-mono text-xs">{entry.id}</td>
                  <td className="text-sm">{new Date(entry.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</td>
                  <td className="text-sm font-medium text-[var(--color-text-primary)]">{entry.description}</td>
                  <td className="text-sm">{entry.debitAccount}</td>
                  <td className="text-right text-sm font-semibold text-[#10b981]">{formatCurrency(entry.debitAmount)}</td>
                  <td className="text-sm">{entry.creditAccount}</td>
                  <td className="text-right text-sm font-semibold text-[#f43f5e]">{formatCurrency(entry.creditAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {activeTab === "Trial Balance" && (
        <motion.div variants={itemVariants} className="glass-card overflow-hidden">
          <div className="p-4 border-b border-[var(--color-glass-border)]">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Trial Balance — As of May 2026</h3>
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
                  <td className="text-sm font-medium text-[var(--color-text-primary)]">{row.account}</td>
                  <td className="text-right text-sm">{row.debit ? formatCurrency(row.debit) : "—"}</td>
                  <td className="text-right text-sm">{row.credit ? formatCurrency(row.credit) : "—"}</td>
                </tr>
              ))}
              <tr className="!bg-white/[0.02]">
                <td className="text-sm font-bold text-[var(--color-text-primary)]">Total</td>
                <td className="text-right text-sm font-bold text-[#10b981]">{formatCurrency(trialBalance.reduce((s, r) => s + r.debit, 0))}</td>
                <td className="text-right text-sm font-bold text-[#f43f5e]">{formatCurrency(trialBalance.reduce((s, r) => s + r.credit, 0))}</td>
              </tr>
            </tbody>
          </table>
        </motion.div>
      )}

      {(activeTab === "Ledger" || activeTab === "P&L" || activeTab === "Balance Sheet") && (
        <motion.div variants={itemVariants} className="glass-card p-8 text-center">
          <FileSpreadsheet className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">{activeTab} Statement</h3>
          <p className="text-xs text-[var(--color-text-muted)] mb-4">AI is auto-generating your {activeTab} from transaction data</p>
          <div className="flex justify-center gap-2">
            <button onClick={handleGenerate} className="btn-primary !text-xs">Generate Now</button>
            <button className="btn-secondary !text-xs">Download Template</button>
          </div>
        </motion.div>
      )}
    </motion.div>

      {/* New Entry Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-md p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">New Journal Entry</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleNewEntry} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-[var(--color-surface-900)] border border-[var(--color-glass-border)] rounded-xl px-4 py-2 text-[var(--color-text-primary)] focus:outline-none focus:border-[#4361ee] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Description</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Office Rent"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-[var(--color-surface-900)] border border-[var(--color-glass-border)] rounded-xl px-4 py-2 text-[var(--color-text-primary)] focus:outline-none focus:border-[#4361ee] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Debit Account</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rent Expense"
                      value={formData.debitAccount}
                      onChange={(e) => setFormData({ ...formData, debitAccount: e.target.value })}
                      className="w-full bg-[var(--color-surface-900)] border border-[var(--color-glass-border)] rounded-xl px-4 py-2 text-[var(--color-text-primary)] focus:outline-none focus:border-[#4361ee] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Debit Amount (₹)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.debitAmount}
                      onChange={(e) => setFormData({ ...formData, debitAmount: e.target.value })}
                      className="w-full bg-[var(--color-surface-900)] border border-[var(--color-glass-border)] rounded-xl px-4 py-2 text-[var(--color-text-primary)] focus:outline-none focus:border-[#4361ee] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Credit Account</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bank Account"
                      value={formData.creditAccount}
                      onChange={(e) => setFormData({ ...formData, creditAccount: e.target.value })}
                      className="w-full bg-[var(--color-surface-900)] border border-[var(--color-glass-border)] rounded-xl px-4 py-2 text-[var(--color-text-primary)] focus:outline-none focus:border-[#4361ee] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Credit Amount (₹)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.creditAmount}
                      onChange={(e) => setFormData({ ...formData, creditAmount: e.target.value })}
                      className="w-full bg-[var(--color-surface-900)] border border-[var(--color-glass-border)] rounded-xl px-4 py-2 text-[var(--color-text-primary)] focus:outline-none focus:border-[#4361ee] transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full justify-center mt-2"
                >
                  {isSubmitting ? "Saving..." : "Save Entry"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
