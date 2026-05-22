"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Home,
  Car,
  GraduationCap,
  Briefcase,
  CreditCard,
  Calendar,
  TrendingDown,
  AlertTriangle,
  ChevronRight,
  Calculator,
  ArrowDownRight,
} from "lucide-react";
import { mockLoans, formatCurrency } from "@/lib/data";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const loanIcons: Record<string, React.ElementType> = {
  home: Home,
  car: Car,
  student: GraduationCap,
  business: Briefcase,
  credit_card: CreditCard,
};

const loanColors: Record<string, string> = {
  home: "from-[#4361ee] to-[#0ea5e9]",
  car: "from-[#f59e0b] to-[#f97316]",
  student: "from-[#7c3aed] to-[#a855f7]",
  business: "from-[#06d6a0] to-[#10b981]",
  credit_card: "from-[#f43f5e] to-[#ec4899]",
};

export default function LoansView() {
  const totalEMI = mockLoans.reduce((s, l) => s + l.emi, 0);
  const totalOutstanding = mockLoans.reduce((s, l) => s + l.remaining, 0);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="p-6 space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div variants={itemVariants} className="glass-card metric-card rose p-4">
          <p className="text-xs text-[#5a6a8a] mb-1">Total Outstanding</p>
          <p className="text-2xl font-bold text-[#f43f5e]">{formatCurrency(totalOutstanding)}</p>
          <p className="text-xs text-[#94a3c8] mt-1">{mockLoans.length} active loans</p>
        </motion.div>
        <motion.div variants={itemVariants} className="glass-card metric-card amber p-4">
          <p className="text-xs text-[#5a6a8a] mb-1">Monthly EMI</p>
          <p className="text-2xl font-bold text-[#f59e0b]">{formatCurrency(totalEMI)}</p>
          <p className="text-xs text-[#94a3c8] mt-1">Combined EMI payment</p>
        </motion.div>
        <motion.div variants={itemVariants} className="glass-card metric-card blue p-4">
          <p className="text-xs text-[#5a6a8a] mb-1">Debt-to-Income</p>
          <p className="text-2xl font-bold text-[#4361ee]">28.3%</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="badge badge-warning text-[10px] !py-0 !px-2">Moderate</span>
          </div>
        </motion.div>
      </div>

      {/* Loan Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {mockLoans.map((loan) => {
          const Icon = loanIcons[loan.type] || CreditCard;
          const gradient = loanColors[loan.type] || "from-[#4361ee] to-[#0ea5e9]";
          const paidPercent = ((loan.principal - loan.remaining) / loan.principal) * 100;

          return (
            <motion.div
              key={loan.id}
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              className="glass-card p-5 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="badge badge-success">Active</span>
              </div>

              <h4 className="text-sm font-semibold text-[#f0f4ff] mb-1">{loan.name}</h4>
              <p className="text-xs text-[#5a6a8a] mb-4">Interest Rate: {loan.rate}% p.a.</p>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between mb-1.5">
                  <span className="text-[10px] text-[#94a3c8]">Paid: {paidPercent.toFixed(1)}%</span>
                  <span className="text-[10px] text-[#94a3c8]">{formatCurrency(loan.principal)}</span>
                </div>
                <div className="progress-bar !h-2">
                  <div
                    className={`progress-bar-fill bg-gradient-to-r ${gradient}`}
                    style={{ width: `${paidPercent}%` }}
                  />
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-2.5 rounded-xl bg-white/[0.02]">
                  <p className="text-[10px] text-[#5a6a8a] mb-0.5">Remaining</p>
                  <p className="text-sm font-bold text-[#f0f4ff]">{formatCurrency(loan.remaining)}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.02]">
                  <p className="text-[10px] text-[#5a6a8a] mb-0.5">Monthly EMI</p>
                  <p className="text-sm font-bold text-[#f59e0b]">{formatCurrency(loan.emi)}</p>
                </div>
              </div>

              {/* Next Due */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.04]">
                <div className="flex items-center gap-2 text-xs text-[#94a3c8]">
                  <Calendar className="w-3.5 h-3.5" />
                  Next: {new Date(loan.nextDue).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </div>
                <ChevronRight className="w-4 h-4 text-[#5a6a8a]" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* AI Recommendations */}
      <motion.div variants={itemVariants} className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-4 h-4 text-[#06d6a0]" />
          <h3 className="text-sm font-semibold text-[#f0f4ff]">AI Loan Recommendations</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div className="flex items-center gap-2 mb-2">
              <ArrowDownRight className="w-4 h-4 text-[#10b981]" />
              <span className="text-xs font-semibold text-[#f0f4ff]">Prepayment Opportunity</span>
            </div>
            <p className="text-[11px] text-[#94a3c8]">
              Making a ₹2L lump sum payment on your Car Loan will save ₹48,000 in interest and close it 8 months early.
            </p>
            <p className="text-xs font-semibold text-[#06d6a0] mt-2">Save ₹48,000</p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-[#4361ee]" />
              <span className="text-xs font-semibold text-[#f0f4ff]">Refinancing Option</span>
            </div>
            <p className="text-[11px] text-[#94a3c8]">
              Your Home Loan at 8.5% can be refinanced to 7.9% with SBI. Monthly savings of ₹3,200 over remaining tenure.
            </p>
            <p className="text-xs font-semibold text-[#4361ee] mt-2">Save ₹3,200/month</p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-[#f59e0b]" />
              <span className="text-xs font-semibold text-[#f0f4ff]">Debt Stress Alert</span>
            </div>
            <p className="text-[11px] text-[#94a3c8]">
              Your debt-to-income ratio of 28.3% is approaching the 30% threshold. Avoid taking additional debt for 6 months.
            </p>
            <p className="text-xs font-semibold text-[#f59e0b] mt-2">Caution Advised</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
