"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Landmark,
  IndianRupee,
  ShieldCheck,
  Lightbulb,
  TrendingDown,
  Calendar,
  FileText,
  Calculator,
  ArrowRight,
  X,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { mockTaxEstimate, formatCurrency } from "@/lib/data";
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

const taxBreakdownData = [
  { slab: "Up to ₹3L", rate: "0%", amount: 0, color: "#10b981" },
  { slab: "₹3L - ₹6L", rate: "5%", amount: 15000, color: "#4361ee" },
  { slab: "₹6L - ₹9L", rate: "10%", amount: 30000, color: "#0ea5e9" },
  { slab: "₹9L - ₹12L", rate: "15%", amount: 45000, color: "#7c3aed" },
  { slab: "₹12L - ₹15L", rate: "20%", amount: 60000, color: "#f59e0b" },
  { slab: "Above ₹15L", rate: "30%", amount: 532500, color: "#f43f5e" },
];

export default function TaxView() {
  const { success, error } = useToast();
  const [taxEstimate, setTaxEstimate] = useState(mockTaxEstimate);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<"elss" | "nps" | "regime" | null>(null);

  useEffect(() => {
    const fetchTaxEstimate = async () => {
      try {
        setLoading(true);
        const data = await api.get("/tax/estimate");
        setTaxEstimate(data);
      } catch (err: any) {
        error("Failed to fetch tax estimate", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTaxEstimate();
  }, []);

  const handleAction = async (actionType: string) => {
    try {
      success(`${actionType} action initiated successfully!`);
      setActiveModal(null);
    } catch (err: any) {
      error(`Failed to execute ${actionType} action`, err.message);
    }
  };

  const deductionPieData = taxEstimate.deductions.map((d, i) => ({
    ...d,
    color: ["#4361ee", "#06d6a0", "#f59e0b", "#7c3aed", "#0ea5e9", "#f43f5e"][i],
  }));

  return (
    <>
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="p-6 space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div variants={itemVariants} className="glass-card metric-card blue p-4">
            <div className="flex items-center gap-2 mb-2">
              <IndianRupee className="w-4 h-4 text-[#4361ee]" />
              <p className="text-xs text-[#5a6a8a]">Total Income</p>
            </div>
            <p className="text-2xl font-bold text-[#f0f4ff]">{formatCurrency(taxEstimate.totalIncome)}</p>
          </motion.div>
          <motion.div variants={itemVariants} className="glass-card metric-card green p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-[#06d6a0]" />
              <p className="text-xs text-[#5a6a8a]">Deductions Claimed</p>
            </div>
            <p className="text-2xl font-bold text-[#06d6a0]">
              {formatCurrency(taxEstimate.deductions.reduce((s, d) => s + d.amount, 0))}
            </p>
          </motion.div>
          <motion.div variants={itemVariants} className="glass-card metric-card amber p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="w-4 h-4 text-[#f59e0b]" />
              <p className="text-xs text-[#5a6a8a]">Estimated Tax</p>
            </div>
            <p className="text-2xl font-bold text-[#f59e0b]">{formatCurrency(taxEstimate.estimatedTax)}</p>
          </motion.div>
          <motion.div variants={itemVariants} className="glass-card metric-card violet p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-[#7c3aed]" />
              <p className="text-xs text-[#5a6a8a]">Tax Savings</p>
            </div>
            <p className="text-2xl font-bold text-[#7c3aed]">{formatCurrency(taxEstimate.savings)}</p>
          </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tax Slab Breakdown */}
        <motion.div variants={itemVariants} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-[#f0f4ff] mb-1">Tax Slab Breakdown</h3>
          <p className="text-xs text-[#5a6a8a] mb-4">New Regime — FY 2025-26</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={taxBreakdownData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#5a6a8a", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
              <YAxis type="category" dataKey="slab" tick={{ fill: "#94a3c8", fontSize: 10 }} axisLine={false} tickLine={false} width={100} />
              <Tooltip formatter={(value) => formatCurrency(Number(value ?? 0))} contentStyle={{ background: "#151d35", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, fontSize: 12, color: "#f0f4ff" }} />
              <Bar dataKey="amount" radius={[0, 4, 4, 0]} name="Tax">
                {taxBreakdownData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Deductions */}
        <motion.div variants={itemVariants} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-[#f0f4ff] mb-1">Deductions Summary</h3>
          <p className="text-xs text-[#5a6a8a] mb-4">Claimed under Old Regime</p>
          <div className="flex justify-center mb-4">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={deductionPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="amount" strokeWidth={0}>
                  {deductionPieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {taxEstimate.deductions.map((d: any, i: number) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: deductionPieData[i]?.color }} />
                  <span className="text-xs text-[#94a3c8]">{d.name}</span>
                </div>
                <span className="text-xs font-semibold text-[#f0f4ff]">{formatCurrency(d.amount)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* AI Tax Suggestions */}
      <motion.div variants={itemVariants} className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-4 h-4 text-[#f59e0b]" />
          <h3 className="text-sm font-semibold text-[#f0f4ff]">AI Tax Optimization Suggestions</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#4361ee]/10 to-[#4361ee]/5 border border-[#4361ee]/15">
            <h4 className="text-xs font-semibold text-[#f0f4ff] mb-2">Invest in ELSS</h4>
            <p className="text-[11px] text-[#94a3c8] mb-2">
              You have ₹85,000 remaining in 80C limit. Investing in tax-saving ELSS funds before March will save ₹26,520.
            </p>
            <button
              onClick={() => setActiveModal("elss")}
              className="mt-2 flex items-center gap-1 text-[#4361ee] hover:opacity-80 transition-opacity"
            >
              <span className="text-xs font-semibold">Take Action</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#06d6a0]/10 to-[#06d6a0]/5 border border-[#06d6a0]/15">
            <h4 className="text-xs font-semibold text-[#f0f4ff] mb-2">NPS Additional Benefit</h4>
            <p className="text-[11px] text-[#94a3c8] mb-2">
              You can claim an additional ₹50,000 under 80CCD(1B) for NPS investment, saving ₹15,600 in taxes.
            </p>
            <button
              onClick={() => setActiveModal("nps")}
              className="mt-2 flex items-center gap-1 text-[#06d6a0] hover:opacity-80 transition-opacity"
            >
              <span className="text-xs font-semibold">Explore NPS</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#f59e0b]/10 to-[#f59e0b]/5 border border-[#f59e0b]/15">
            <h4 className="text-xs font-semibold text-[#f0f4ff] mb-2">Regime Comparison</h4>
            <p className="text-[11px] text-[#94a3c8] mb-2">
              Old Regime saves you ₹1,95,000 more than New Regime with your current deductions. Recommended: Old Regime.
            </p>
            <button
              onClick={() => setActiveModal("regime")}
              className="mt-2 flex items-center gap-1 text-[#f59e0b] hover:opacity-80 transition-opacity"
            >
              <span className="text-xs font-semibold">Compare Regimes</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Tax Calendar */}
        <div className="mt-4 pt-4 border-t border-white/[0.04]">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-[#0ea5e9]" />
            <h4 className="text-xs font-semibold text-[#f0f4ff]">Upcoming Tax Deadlines</h4>
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              { date: "15 Jun 2026", event: "Advance Tax (Q1)", status: "upcoming" },
              { date: "15 Sep 2026", event: "Advance Tax (Q2)", status: "upcoming" },
              { date: "15 Dec 2026", event: "Advance Tax (Q3)", status: "upcoming" },
              { date: "31 Mar 2027", event: "Tax Filing Deadline", status: "upcoming" },
            ].map((item) => (
              <div key={item.event} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center gap-3">
                <div className="text-center">
                  <p className="text-xs font-bold text-[#f0f4ff]">{item.date.split(" ")[0]}</p>
                  <p className="text-[10px] text-[#5a6a8a]">{item.date.split(" ").slice(1).join(" ")}</p>
                </div>
                <div className="w-px h-6 bg-white/[0.06]" />
                <p className="text-xs text-[#94a3c8]">{item.event}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
      </motion.div>

      {/* Action Modals */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-md p-6 relative border border-white/10 shadow-2xl"
              style={{ background: "#0f1428" }}
            >
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-[#94a3c8]" />
              </button>
              
              {activeModal === "elss" && (
                <>
                  <h3 className="text-xl font-bold text-[#f0f4ff] mb-2">Invest in ELSS</h3>
                  <p className="text-sm text-[#94a3c8] mb-6">
                    You have ₹85,000 remaining in your 80C limit. Investing in tax-saving ELSS funds before March will save ₹26,520 in taxes. ELSS funds have a lock-in period of 3 years.
                  </p>
                  <button
                    onClick={() => handleAction("ELSS Investment")}
                    className="w-full py-3 bg-[#4361ee] text-white rounded-xl font-medium hover:bg-[#4361ee]/90 transition-colors"
                  >
                    Invest via Zerodha
                  </button>
                </>
              )}

              {activeModal === "nps" && (
                <>
                  <h3 className="text-xl font-bold text-[#f0f4ff] mb-2">NPS Additional Benefit</h3>
                  <p className="text-sm text-[#94a3c8] mb-6">
                    You can claim an additional ₹50,000 under Section 80CCD(1B) for NPS investment. This is over and above the ₹1.5L limit under 80C, saving you an extra ₹15,600.
                  </p>
                  <button
                    onClick={() => handleAction("NPS Contribution")}
                    className="w-full py-3 bg-[#06d6a0] text-gray-900 rounded-xl font-medium hover:bg-[#06d6a0]/90 transition-colors"
                  >
                    Contribute to NPS
                  </button>
                </>
              )}

              {activeModal === "regime" && (
                <>
                  <h3 className="text-xl font-bold text-[#f0f4ff] mb-2">Regime Comparison</h3>
                  <p className="text-sm text-[#94a3c8] mb-6">
                    Based on your declared deductions, the Old Regime saves you ₹1,95,000 more than the New Regime. Would you like to switch your default preference to the Old Regime?
                  </p>
                  <button
                    onClick={() => handleAction("Regime Switch")}
                    className="w-full py-3 bg-[#f59e0b] text-gray-900 rounded-xl font-medium hover:bg-[#f59e0b]/90 transition-colors"
                  >
                    Switch to Old Regime
                  </button>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
