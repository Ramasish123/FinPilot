"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  Building2,
  CreditCard,
  TrendingUp,
  Smartphone,
  RefreshCw,
  Plus,
  ArrowUpRight,
  CheckCircle2,
  Link2,
} from "lucide-react";
import { mockAccounts, formatCurrency } from "@/lib/data";

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
  const totalBalance = mockAccounts.reduce((s, a) => s + a.balance, 0);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="p-6 space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-[#f0f4ff]">Connected Accounts</h3>
          <p className="text-sm text-[#5a6a8a] mt-1">
            Total Balance: <span className="text-[#06d6a0] font-bold">{formatCurrency(totalBalance)}</span>
          </p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Link Account
        </button>
      </motion.div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {mockAccounts.map((account) => {
          const Icon = accountIcons[account.type] || Wallet;
          const gradient = accountColors[account.type] || "from-[#4361ee] to-[#0ea5e9]";

          return (
            <motion.div
              key={account.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="glass-card p-5 cursor-pointer group"
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
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.5 }}
                    className="p-1.5 rounded-lg hover:bg-white/[0.05]"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#5a6a8a]" />
                  </motion.button>
                </div>
              </div>

              {/* Details */}
              <h4 className="text-sm font-semibold text-[#f0f4ff] mb-0.5">{account.name}</h4>
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
    </motion.div>
  );
}
