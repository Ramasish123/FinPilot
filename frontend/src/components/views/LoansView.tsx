"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Plus,
  X,
} from "lucide-react";
import { formatCurrency, Loan } from "@/lib/data";
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
  const { success, error } = useToast();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [totalEMI, setTotalEMI] = useState(0);
  const [totalOutstanding, setTotalOutstanding] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Apply Modal state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyForm, setApplyForm] = useState({ name: "", type: "home", amount: "", rate: "", term: "" });

  // Payment Modal state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentLoanId, setPaymentLoanId] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");

  const fetchLoans = async () => {
    try {
      const res = await api.get("/loans");
      setLoans(res.loans || []);
      setTotalEMI(res.totalEMI || 0);
      setTotalOutstanding(res.totalOutstanding || 0);
    } catch (err) {
      error("Failed to fetch loans");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/loans/apply", {
        name: applyForm.name,
        type: applyForm.type,
        amount: Number(applyForm.amount),
        rate: Number(applyForm.rate),
        term: Number(applyForm.term),
      });
      success("Loan application submitted successfully");
      setIsApplyModalOpen(false);
      setApplyForm({ name: "", type: "home", amount: "", rate: "", term: "" });
      fetchLoans();
    } catch (err) {
      error("Failed to submit application");
    }
  };

  const openPaymentModal = (loanId: string) => {
    setPaymentLoanId(loanId);
    setPaymentAmount("");
    setIsPaymentModalOpen(true);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentLoanId) return;
    try {
      await api.patch(`/loans/${paymentLoanId}/payment`, {
        amount: Number(paymentAmount),
      });
      success("Payment processed successfully");
      setIsPaymentModalOpen(false);
      setPaymentAmount("");
      setPaymentLoanId(null);
      fetchLoans();
    } catch (err) {
      error("Failed to process payment");
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Loans & Credit</h2>
        <button
          onClick={() => setIsApplyModalOpen(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Apply for Loan
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div variants={itemVariants} className="glass-card metric-card rose p-4">
          <p className="text-xs text-[var(--color-text-muted)] mb-1">Total Outstanding</p>
          <p className="text-2xl font-bold text-[#f43f5e]">{formatCurrency(totalOutstanding)}</p>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">{loans.length} active loans</p>
        </motion.div>
        <motion.div variants={itemVariants} className="glass-card metric-card amber p-4">
          <p className="text-xs text-[var(--color-text-muted)] mb-1">Monthly EMI</p>
          <p className="text-2xl font-bold text-[#f59e0b]">{formatCurrency(totalEMI)}</p>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">Combined EMI payment</p>
        </motion.div>
        <motion.div variants={itemVariants} className="glass-card metric-card blue p-4">
          <p className="text-xs text-[var(--color-text-muted)] mb-1">Debt-to-Income</p>
          <p className="text-2xl font-bold text-[#4361ee]">28.3%</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="badge badge-warning text-[10px] !py-0 !px-2">Moderate</span>
          </div>
        </motion.div>
      </div>

      {/* Loan Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full py-12 flex justify-center">
            <div className="w-8 h-8 border-2 border-[#4361ee] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : loans.length === 0 ? (
          <div className="col-span-full py-12 text-center">
            <p className="text-[var(--color-text-muted)]">No active loans found.</p>
          </div>
        ) : (
          loans.map((loan) => {
            const Icon = loanIcons[loan.type] || CreditCard;
            const gradient = loanColors[loan.type] || "from-[#4361ee] to-[#0ea5e9]";
            const paidPercent = loan.principal > 0 ? ((loan.principal - loan.remaining) / loan.principal) * 100 : 0;

            return (
              <motion.div
                key={loan.id}
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                className="glass-card p-5 flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className={`badge ${loan.status === 'active' ? 'badge-success' : 'badge-neutral'}`}>
                    {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                  </span>
                </div>

                <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">{loan.name}</h4>
                <p className="text-xs text-[var(--color-text-muted)] mb-4">Interest Rate: {loan.rate}% p.a.</p>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[10px] text-[var(--color-text-secondary)]">Paid: {paidPercent.toFixed(1)}%</span>
                    <span className="text-[10px] text-[var(--color-text-secondary)]">{formatCurrency(loan.principal)}</span>
                  </div>
                  <div className="progress-bar !h-2">
                    <div
                      className={`progress-bar-fill bg-gradient-to-r ${gradient}`}
                      style={{ width: `${Math.min(paidPercent, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 text-center flex-grow">
                  <div className="p-2.5 rounded-xl bg-white/[0.02]">
                    <p className="text-[10px] text-[var(--color-text-muted)] mb-0.5">Remaining</p>
                    <p className="text-sm font-bold text-[var(--color-text-primary)]">{formatCurrency(loan.remaining)}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.02]">
                    <p className="text-[10px] text-[var(--color-text-muted)] mb-0.5">Monthly EMI</p>
                    <p className="text-sm font-bold text-[#f59e0b]">{formatCurrency(loan.emi)}</p>
                  </div>
                </div>

                {/* Next Due and Payment Button */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.04]">
                  <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                    <Calendar className="w-3.5 h-3.5" />
                    Next: {new Date(loan.nextDue).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                  {loan.status === 'active' && (
                    <button
                      onClick={() => openPaymentModal(loan.id)}
                      className="text-xs font-medium text-[#4361ee] hover:text-[#0ea5e9] transition-colors"
                    >
                      Make Payment
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* AI Recommendations */}
      <motion.div variants={itemVariants} className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-4 h-4 text-[#06d6a0]" />
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">AI Loan Recommendations</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div className="flex items-center gap-2 mb-2">
              <ArrowDownRight className="w-4 h-4 text-[#10b981]" />
              <span className="text-xs font-semibold text-[var(--color-text-primary)]">Prepayment Opportunity</span>
            </div>
            <p className="text-[11px] text-[var(--color-text-secondary)]">
              Making a ₹2L lump sum payment on your Car Loan will save ₹48,000 in interest and close it 8 months early.
            </p>
            <p className="text-xs font-semibold text-[#06d6a0] mt-2">Save ₹48,000</p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-[#4361ee]" />
              <span className="text-xs font-semibold text-[var(--color-text-primary)]">Refinancing Option</span>
            </div>
            <p className="text-[11px] text-[var(--color-text-secondary)]">
              Your Home Loan at 8.5% can be refinanced to 7.9% with SBI. Monthly savings of ₹3,200 over remaining tenure.
            </p>
            <p className="text-xs font-semibold text-[#4361ee] mt-2">Save ₹3,200/month</p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-[#f59e0b]" />
              <span className="text-xs font-semibold text-[var(--color-text-primary)]">Debt Stress Alert</span>
            </div>
            <p className="text-[11px] text-[var(--color-text-secondary)]">
              Your debt-to-income ratio of 28.3% is approaching the 30% threshold. Avoid taking additional debt for 6 months.
            </p>
            <p className="text-xs font-semibold text-[#f59e0b] mt-2">Caution Advised</p>
          </div>
        </div>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {isApplyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-md p-6 relative"
            >
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/10 text-[var(--color-text-secondary)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">Apply for Loan</h2>
              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Loan Name</label>
                  <input
                    required
                    type="text"
                    value={applyForm.name}
                    onChange={(e) => setApplyForm({ ...applyForm, name: e.target.value })}
                    className="w-full bg-[var(--color-surface-900)] border border-[var(--color-glass-border)] rounded-xl px-4 py-2.5 text-[var(--color-text-primary)] focus:outline-none focus:border-[#4361ee] transition-colors"
                    placeholder="e.g. Home Renovation"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Type</label>
                  <select
                    value={applyForm.type}
                    onChange={(e) => setApplyForm({ ...applyForm, type: e.target.value })}
                    className="w-full bg-[var(--color-surface-900)] border border-[var(--color-glass-border)] rounded-xl px-4 py-2.5 text-[var(--color-text-primary)] focus:outline-none focus:border-[#4361ee] transition-colors appearance-none"
                  >
                    <option value="home">Home</option>
                    <option value="car">Car</option>
                    <option value="student">Student</option>
                    <option value="business">Business</option>
                    <option value="credit_card">Credit Card</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Amount</label>
                  <input
                    required
                    type="number"
                    value={applyForm.amount}
                    onChange={(e) => setApplyForm({ ...applyForm, amount: e.target.value })}
                    className="w-full bg-[var(--color-surface-900)] border border-[var(--color-glass-border)] rounded-xl px-4 py-2.5 text-[var(--color-text-primary)] focus:outline-none focus:border-[#4361ee] transition-colors"
                    placeholder="e.g. 500000"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Interest Rate (%)</label>
                    <input
                      required
                      type="number"
                      step="0.1"
                      value={applyForm.rate}
                      onChange={(e) => setApplyForm({ ...applyForm, rate: e.target.value })}
                      className="w-full bg-[var(--color-surface-900)] border border-[var(--color-glass-border)] rounded-xl px-4 py-2.5 text-[var(--color-text-primary)] focus:outline-none focus:border-[#4361ee] transition-colors"
                      placeholder="e.g. 8.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Term (Months)</label>
                    <input
                      required
                      type="number"
                      value={applyForm.term}
                      onChange={(e) => setApplyForm({ ...applyForm, term: e.target.value })}
                      className="w-full bg-[var(--color-surface-900)] border border-[var(--color-glass-border)] rounded-xl px-4 py-2.5 text-[var(--color-text-primary)] focus:outline-none focus:border-[#4361ee] transition-colors"
                      placeholder="e.g. 60"
                    />
                  </div>
                </div>
                <button type="submit" className="w-full btn btn-primary py-2.5 mt-2">
                  Submit Application
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {isPaymentModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-sm p-6 relative"
            >
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/10 text-[var(--color-text-secondary)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">Make Payment</h2>
              <form onSubmit={handlePayment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Amount</label>
                  <input
                    required
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full bg-[var(--color-surface-900)] border border-[var(--color-glass-border)] rounded-xl px-4 py-2.5 text-[var(--color-text-primary)] focus:outline-none focus:border-[#4361ee] transition-colors"
                    placeholder="Enter amount"
                  />
                </div>
                <button type="submit" className="w-full btn btn-primary py-2.5 mt-2">
                  Confirm Payment
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
