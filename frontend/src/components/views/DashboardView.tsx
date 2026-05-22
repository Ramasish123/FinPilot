"use client";

import React, { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { api } from "@/lib/api";
import { useToast } from "@/components/Toast";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert,
  BrainCircuit,
  PiggyBank,
  CreditCard,
  IndianRupee,
  Sparkles,
  Eye,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  mockTransactions,
  mockRevenueData,
  mockExpenseBreakdown,
  mockInsights,
  mockFinancialHealth,
  mockCashFlowData,
  mockIncomeSourcesData,
  formatCurrency,
  formatCurrencyShort,
} from "@/lib/data";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeInOut" } },
};

const initialMetricCards = [
  {
    label: "Total Revenue",
    value: 4718230,
    change: "+18.2%",
    trend: "up",
    icon: TrendingUp,
    color: "blue",
    gradient: "from-[#4361ee] to-[#0ea5e9]",
  },
  {
    label: "Total Expenses",
    value: 1050000,
    change: "+5.1%",
    trend: "up",
    icon: CreditCard,
    color: "rose",
    gradient: "from-[#f43f5e] to-[#ec4899]",
  },
  {
    label: "Net Profit",
    value: 3668230,
    change: "+24.6%",
    trend: "up",
    icon: PiggyBank,
    color: "green",
    gradient: "from-[#06d6a0] to-[#10b981]",
  },
  {
    label: "Cash Flow",
    value: 2345000,
    change: "+12.8%",
    trend: "up",
    icon: Wallet,
    color: "violet",
    gradient: "from-[#7c3aed] to-[#a855f7]",
  },
  {
    label: "Tax Liability",
    value: 682500,
    change: "-3.2%",
    trend: "down",
    icon: IndianRupee,
    color: "amber",
    gradient: "from-[#f59e0b] to-[#f97316]",
  },
  {
    label: "Fraud Alerts",
    value: 3,
    change: "+2",
    trend: "up",
    icon: ShieldAlert,
    color: "cyan",
    gradient: "from-[#06b6d4] to-[#0ea5e9]",
    isCount: true,
  },
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;
  return (
    <div className="glass-card !p-3 !rounded-lg !border-white/10">
      <p className="text-xs text-[#94a3c8] mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-sm font-semibold" style={{ color: p.color }}>
          {p.name}: {formatCurrencyShort(p.value)}
        </p>
      ))}
    </div>
  );
}

export default function DashboardView({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const [liveMetrics, setLiveMetrics] = useState(initialMetricCards);
  const [recentTransactions, setRecentTransactions] = useState<any[]>(mockTransactions.slice(0, 7));
  const [cashFlowData, setCashFlowData] = useState<any[]>(mockCashFlowData);
  const [isAnalyzingCashFlow, setIsAnalyzingCashFlow] = useState(true);
  const { error } = useToast();

  // True Real-Time Backend Polling
  useEffect(() => {
    let isInitialFetch = true;
    
    async function fetchDashboardData() {
      try {
        const [txnsResponse, accountsResponse] = await Promise.all([
          api.get("/transactions?limit=20").catch(() => null),
          api.get("/accounts").catch(() => null)
        ]);
        
        let txns: any[] = [];
        if (txnsResponse) {
          txns = Array.isArray(txnsResponse) ? txnsResponse : txnsResponse.transactions || [];
          setRecentTransactions(txns.slice(0, 7));
          
          // Dynamically calculate metrics based on ALL fetched transactions
          const totalRevenue = txns.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
          const totalExpenses = txns.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);
          const netProfit = totalRevenue - totalExpenses;
          
          setLiveMetrics(prev => prev.map(card => {
            if (card.label === "Total Revenue") return { ...card, value: totalRevenue };
            if (card.label === "Total Expenses") return { ...card, value: totalExpenses };
            if (card.label === "Net Profit") return { ...card, value: netProfit };
            // Let the original CashFlow logic or backend handle cash flow
            return card;
          }));
        }

        if (isInitialFetch) {
          // Prepare context for AI Cash Flow
          const accounts = accountsResponse?.accounts || [];
          let contextString = "TRANSACTION CONTEXT:\\n";
          if (accounts.length > 0) {
            contextString += "\\nAccounts:\\n";
            accounts.forEach((acc: any) => {
              contextString += `- ${acc.name || acc.institution} ${acc.type}: ₹${acc.balance.toLocaleString('en-IN')}\\n`;
            });
          }
          if (txns.length > 0) {
            contextString += "\\nTransactions:\\n";
            txns.forEach((t: any) => {
              contextString += `- ${t.date}: ${t.merchant} (₹${t.amount.toLocaleString('en-IN')}) [${t.type}]\\n`;
            });
          }

          // Fetch AI Cash Flow Analysis ONCE on load
          const response = await fetch("http://localhost:8000/api/ai/cashflow", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: "Generate cash flow", user_id: "usr_001", context: contextString }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.cashflow && data.cashflow.length > 0) {
              setCashFlowData(data.cashflow);
            }
          }
          setIsAnalyzingCashFlow(false);
          isInitialFetch = false;
        }
      } catch (err) {
        console.error("Dashboard poll error:", err);
      }
    }
    
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, []);


  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-6 space-y-6"
    >
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {liveMetrics.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              variants={itemVariants}
              className={`glass-card metric-card ${card.color} p-4`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${card.gradient} flex items-center justify-center opacity-80`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span
                  className={`text-xs font-semibold flex items-center gap-1 ${
                    card.trend === "up" && card.label !== "Fraud Alerts"
                      ? "text-[#10b981]"
                      : card.label === "Fraud Alerts"
                      ? "text-[#f43f5e]"
                      : "text-[#10b981]"
                  }`}
                >
                  {card.trend === "up" ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {card.change}
                </span>
              </div>
              <p className="text-xl font-bold text-[#f0f4ff]">
                {card.isCount ? card.value : formatCurrency(card.value)}
              </p>
              <p className="text-xs text-[#5a6a8a] mt-1">{card.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div variants={itemVariants} className="glass-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[#f0f4ff]">Revenue vs Expenses</h3>
              <p className="text-xs text-[#5a6a8a] mt-0.5">Monthly comparison — FY 2025-26</p>
            </div>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#4361ee]" />
                Revenue
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#f43f5e]" />
                Expenses
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#06d6a0]" />
                Profit
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={mockRevenueData}>
              <defs>
                <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4361ee" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4361ee" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06d6a0" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06d6a0" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "#5a6a8a", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#5a6a8a", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCurrencyShort(v)} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#4361ee" fill="url(#gradRevenue)" strokeWidth={2} name="Revenue" />
              <Area type="monotone" dataKey="expenses" stroke="#f43f5e" fill="none" strokeWidth={2} strokeDasharray="5 5" name="Expenses" />
              <Area type="monotone" dataKey="profit" stroke="#06d6a0" fill="url(#gradProfit)" strokeWidth={2} name="Profit" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Expense Breakdown */}
        <motion.div variants={itemVariants} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-[#f0f4ff] mb-1">Expense Breakdown</h3>
          <p className="text-xs text-[#5a6a8a] mb-4">This month</p>
          <div className="flex justify-center mb-4">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie
                  data={mockExpenseBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  dataKey="amount"
                  strokeWidth={0}
                >
                  {mockExpenseBreakdown.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {mockExpenseBreakdown.slice(0, 5).map((item) => (
              <div key={item.category} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: item.color }}
                  />
                  <span className="text-xs text-[#94a3c8]">{item.category}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-[#f0f4ff]">
                    {formatCurrency(item.amount)}
                  </span>
                  <span className="text-[10px] text-[#5a6a8a] ml-2">
                    {item.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Health Score */}
        <motion.div variants={itemVariants} className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <BrainCircuit className="w-4 h-4 text-[#4361ee]" />
            <h3 className="text-sm font-semibold text-[#f0f4ff]">Financial Health</h3>
          </div>
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle
                  cx="60" cy="60" r="52" fill="none" stroke="url(#healthGrad)" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(mockFinancialHealth.score / 100) * 327} 327`}
                />
                <defs>
                  <linearGradient id="healthGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4361ee" />
                    <stop offset="100%" stopColor="#06d6a0" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-[#f0f4ff]">{mockFinancialHealth.score}</span>
                <span className="text-xs font-semibold text-[#06d6a0]">{mockFinancialHealth.grade}</span>
              </div>
            </div>
          </div>
          <div className="space-y-2.5">
            {mockFinancialHealth.factors.map((f) => (
              <div key={f.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-[#94a3c8]">{f.name}</span>
                  <span className="text-xs font-semibold text-[#f0f4ff]">{f.score}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${f.score}%`,
                      background:
                        f.score >= 80
                          ? "linear-gradient(90deg, #06d6a0, #10b981)"
                          : f.score >= 60
                          ? "linear-gradient(90deg, #4361ee, #0ea5e9)"
                          : f.score >= 40
                          ? "linear-gradient(90deg, #f59e0b, #f97316)"
                          : "linear-gradient(90deg, #f43f5e, #ef4444)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Cash Flow */}
        <motion.div variants={itemVariants} className="glass-card p-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-[#f0f4ff]">Cash Flow</h3>
            {isAnalyzingCashFlow && (
              <span className="flex items-center gap-1.5 text-[10px] text-[#06d6a0] bg-[#06d6a0]/10 px-2 py-0.5 rounded border border-[#06d6a0]/20">
                <Sparkles className="w-3 h-3 animate-pulse" /> AI Processing
              </span>
            )}
          </div>
          <p className="text-xs text-[#5a6a8a] mb-4">Inflow vs Outflow</p>
          {isAnalyzingCashFlow ? (
            <div className="flex flex-col items-center justify-center h-[220px]">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                <Sparkles className="w-6 h-6 text-[#06d6a0] mb-3" />
              </motion.div>
              <p className="text-xs text-[#94a3c8]">Analyzing transactions...</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={cashFlowData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: "#5a6a8a", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#5a6a8a", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCurrencyShort(v)} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="inflow" fill="#4361ee" radius={[4, 4, 0, 0]} name="Inflow" />
                <Bar dataKey="outflow" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Outflow" opacity={0.7} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Income Sources */}
        <motion.div variants={itemVariants} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-[#f0f4ff] mb-1">Income Sources</h3>
          <p className="text-xs text-[#5a6a8a] mb-4">AI-detected sources</p>
          <div className="space-y-3">
            {mockIncomeSourcesData.map((src) => (
              <div key={src.source} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium text-[#f0f4ff]">{src.source}</span>
                    <span className="text-xs font-semibold text-[#f0f4ff]">{formatCurrency(src.amount)}</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill bg-gradient-to-r from-[#4361ee] to-[#06d6a0]"
                      style={{ width: `${src.percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-[#5a6a8a]">{src.percentage}% of total</span>
                    <span
                      className={`text-[10px] font-semibold ${
                        src.trend === "up"
                          ? "text-[#10b981]"
                          : src.trend === "down"
                          ? "text-[#f43f5e]"
                          : "text-[#94a3c8]"
                      }`}
                    >
                      {src.trend === "up" ? "↑ Growing" : src.trend === "down" ? "↓ Declining" : "→ Stable"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* AI Insights & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Insights */}
        <motion.div variants={itemVariants} className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#f59e0b]" />
              <h3 className="text-sm font-semibold text-[#f0f4ff]">AI Insights</h3>
            </div>
            <span className="badge badge-warning">
              {mockInsights.filter((i) => i.priority === "high").length} High Priority
            </span>
          </div>
          <div className="space-y-3">
            {mockInsights.slice(0, 4).map((insight) => (
              <motion.div
                key={insight.id}
                whileHover={{ x: 4 }}
                onClick={() => onNavigate && onNavigate("strategy")}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] cursor-pointer transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      insight.priority === "high"
                        ? "bg-[#f43f5e]"
                        : insight.priority === "medium"
                        ? "bg-[#f59e0b]"
                        : "bg-[#10b981]"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#f0f4ff] mb-0.5">{insight.title}</p>
                    <p className="text-[11px] text-[#94a3c8] line-clamp-2">{insight.description}</p>
                    <p className="text-[10px] font-semibold text-[#06d6a0] mt-1">
                      Impact: {insight.impact}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div variants={itemVariants} className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#f0f4ff]">Recent Transactions</h3>
            <button
              onClick={() => onNavigate && onNavigate("transactions")}
              className="text-xs text-[#4361ee] hover:text-[#6381fc] font-medium flex items-center gap-1"
            >
              View All <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {recentTransactions.map((txn: any) => (
              <div
                key={txn.id || txn._id || Math.random()}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.02] transition-colors"
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    txn.type === "credit"
                      ? "bg-[#10b981]/15 text-[#10b981]"
                      : "bg-[#f43f5e]/15 text-[#f43f5e]"
                  }`}
                >
                  {txn.type === "credit" ? (
                    <ArrowDownRight className="w-4 h-4" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#f0f4ff] truncate">{txn.merchant}</p>
                  <p className="text-[10px] text-[#5a6a8a]">{txn.aiCategory || txn.category} • {txn.date}</p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-semibold ${
                      txn.type === "credit" ? "text-[#10b981]" : "text-[#f0f4ff]"
                    }`}
                  >
                    {txn.type === "credit" ? "+" : "-"}{formatCurrency(txn.amount)}
                  </p>
                  {txn.flagged && (
                    <span className="text-[9px] text-[#f59e0b] font-semibold">⚠ Flagged</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
