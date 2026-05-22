"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  Building2,
  CreditCard,
  TrendingUp,
  Smartphone,
  RefreshCw,
  Plus,
  CheckCircle2,
  Link2,
  X,
  Trash2,
} from "lucide-react";
import { formatCurrency } from "@/lib/data";
import { api } from "@/lib/api";
import { useToast } from "@/components/Toast";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const accountIcons: Record<string, React.ElementType> = {
  savings: Building2,
  current: Wallet,
  credit_card: CreditCard,
  investment: TrendingUp,
  wallet: Smartphone,
};

const accountColors: Record<string, string> = {
  savings: "from-[#4361ee] to-[#0ea5e9]",
  current: "from-[#06d6a0] to-[#10b981]",
  credit_card: "from-[#f43f5e] to-[#ec4899]",
  investment: "from-[#7c3aed] to-[#a855f7]",
  wallet: "from-[#f59e0b] to-[#f97316]",
};

export default function AccountsView() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshingIds, setRefreshingIds] = useState<Set<string>>(new Set());
  
  const [formData, setFormData] = useState({
    institution: "",
    type: "savings",
    name: "",
    accountNumber: "",
  });
  
  const { success, error } = useToast();

  const fetchAccounts = async () => {
    try {
      const res = await api.get("/accounts");
      if (res) {
        setAccounts(res.accounts || []);
        setTotalBalance(res.totalBalance || 0);
      }
    } catch (err) {
      error("Failed to load accounts.");
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleLinkAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/accounts", formData);
      success("Account linked successfully!");
      setIsModalOpen(false);
      setFormData({ institution: "", type: "savings", name: "", accountNumber: "" });
      fetchAccounts();
    } catch (err) {
      error("Failed to link account.");
    }
  };

  const handleUnlink = async (id: string) => {
    try {
      await api.delete(`/accounts/${id}`);
      success("Account unlinked.");
      fetchAccounts();
    } catch (err) {
      error("Failed to unlink account.");
    }
  };

  const handleRefresh = async (id: string) => {
    setRefreshingIds((prev) => new Set(prev).add(id));
    await new Promise((res) => setTimeout(res, 1000));
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === id ? { ...acc, lastSync: "just now" } : acc))
    );
    setRefreshingIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="p-6 space-y-6 relative">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-[#f0f4ff]">Connected Accounts</h3>
          <p className="text-sm text-[#5a6a8a] mt-1">
            Total Balance: <span className="text-[#06d6a0] font-bold">{formatCurrency(totalBalance)}</span>
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Link Account
        </button>
      </motion.div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {accounts.map((account) => {
          const Icon = accountIcons[account.type] || Wallet;
          const gradient = accountColors[account.type] || "from-[#4361ee] to-[#0ea5e9]";
          const isRefreshing = refreshingIds.has(account.id);

          return (
            <motion.div
              key={account.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="glass-card p-5 group relative"
            >
              {/* Top */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  {account.connected && (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-[#10b981]">
                      <CheckCircle2 className="w-3 h-3" />
                      Connected
                    </span>
                  )}
                  <motion.button
                    onClick={() => handleRefresh(account.id)}
                    animate={isRefreshing ? { rotate: 360 } : {}}
                    transition={isRefreshing ? { repeat: Infinity, duration: 1, ease: "linear" } : {}}
                    whileHover={{ rotate: 180 }}
                    className="p-1.5 rounded-lg hover:bg-white/[0.05]"
                    title="Refresh Account"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "text-[#4361ee]" : "text-[#5a6a8a]"}`} />
                  </motion.button>
                  <motion.button
                    onClick={() => handleUnlink(account.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-[#5a6a8a] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Unlink Account"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </div>

              {/* Details */}
              <h4 className="text-sm font-semibold text-[#f0f4ff] mb-0.5">
                {account.name} {account.accountNumber && <span className="text-[#5a6a8a] text-xs font-normal">({account.accountNumber})</span>}
              </h4>
              <p className="text-xs text-[#5a6a8a] mb-3">{account.institution}</p>

              {/* Balance */}
              <p className={`text-2xl font-bold ${account.balance < 0 ? "text-[#f43f5e]" : "text-[#f0f4ff]"}`}>
                {formatCurrency(account.balance)}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.04]">
                <span className="text-[10px] text-[#5a6a8a]">
                  Last synced: {account.lastSync}
                </span>
                <span className="text-[10px] text-[#4361ee] font-medium capitalize">
                  {account.type.replace("_", " ")}
                </span>
              </div>
            </motion.div>
          );
        })}

        {/* Add Account Card */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          onClick={() => setIsModalOpen(true)}
          className="glass-card p-5 cursor-pointer flex flex-col items-center justify-center min-h-[200px] !border-dashed !border-white/10 hover:!border-[#4361ee]/30"
        >
          <div className="w-14 h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-3">
            <Plus className="w-6 h-6 text-[#5a6a8a]" />
          </div>
          <p className="text-sm font-medium text-[#94a3c8]">Link New Account</p>
          <p className="text-xs text-[#5a6a8a] mt-1">Bank, Credit Card, Wallet</p>
        </motion.div>
      </div>

      {/* Supported Banks */}
      <motion.div variants={itemVariants} className="glass-card p-5">
        <h4 className="text-sm font-semibold text-[#f0f4ff] mb-4 flex items-center gap-2">
          <Link2 className="w-4 h-4 text-[#4361ee]" />
          Supported Integrations
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {["HDFC Bank", "ICICI Bank", "SBI", "Axis Bank", "Kotak", "Yes Bank", "Paytm", "PhonePe", "Google Pay", "Zerodha", "Groww", "CRED"].map((bank) => (
            <div key={bank} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center hover:border-[#4361ee]/20 transition-colors cursor-pointer">
              <p className="text-xs font-medium text-[#94a3c8]">{bank}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Link Account Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card w-full max-w-md p-6 relative"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-[#5a6a8a] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h3 className="text-xl font-bold text-white mb-6">Link New Account</h3>
              
              <form onSubmit={handleLinkAccount} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#94a3c8] mb-1">Institution Name</label>
                  <input
                    type="text"
                    required
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className="w-full bg-[#0b0f19] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#4361ee]/50"
                    placeholder="e.g. HDFC Bank, Zerodha"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#94a3c8] mb-1">Account Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-[#0b0f19] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#4361ee]/50 appearance-none"
                  >
                    <option value="savings">Savings Account</option>
                    <option value="current">Current Account</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="investment">Investment</option>
                    <option value="wallet">Digital Wallet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#94a3c8] mb-1">Account Name (Optional)</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#0b0f19] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#4361ee]/50"
                    placeholder="e.g. Salary Account"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#94a3c8] mb-1">Account Number (Last 4 digits)</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    className="w-full bg-[#0b0f19] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#4361ee]/50"
                    placeholder="e.g. 1234"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-[#4361ee] to-[#48bfe3] text-white font-medium hover:opacity-90 transition-opacity"
                  >
                    Link Account
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
