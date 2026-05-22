"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  Target,
  Lightbulb,
  ArrowRight,
  BarChart3,
  Users,
  Rocket,
  ShieldCheck,
  PiggyBank,
  Briefcase,
} from "lucide-react";
import { mockInsights, formatCurrency } from "@/lib/data";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const categoryIcons: Record<string, React.ElementType> = {
  savings: PiggyBank,
  spending: TrendingDown,
  investment: TrendingUp,
  tax: ShieldCheck,
  risk: ShieldCheck,
  strategy: Rocket,
};

const categoryColors: Record<string, { text: string; bg: string; border: string }> = {
  savings: { text: "text-[#06d6a0]", bg: "bg-[#06d6a0]/10", border: "border-[#06d6a0]/20" },
  spending: { text: "text-[#f43f5e]", bg: "bg-[#f43f5e]/10", border: "border-[#f43f5e]/20" },
  investment: { text: "text-[#4361ee]", bg: "bg-[#4361ee]/10", border: "border-[#4361ee]/20" },
  tax: { text: "text-[#f59e0b]", bg: "bg-[#f59e0b]/10", border: "border-[#f59e0b]/20" },
  risk: { text: "text-[#f43f5e]", bg: "bg-[#f43f5e]/10", border: "border-[#f43f5e]/20" },
  strategy: { text: "text-[#7c3aed]", bg: "bg-[#7c3aed]/10", border: "border-[#7c3aed]/20" },
};

import { api } from "@/lib/api";

export default function StrategyView({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const [insights, setInsights] = React.useState<any[]>([]);
  const [strategies, setStrategies] = React.useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = React.useState(true);

  React.useEffect(() => {
    async function fetchAiStrategy() {
      try {
        setIsAnalyzing(true);
        // 1. Fetch live data context from Node.js backend
        const [accountsData, txnsData, tax] = await Promise.all([
          api.get("/accounts").catch(() => null),
          api.get("/transactions").catch(() => null),
          api.get("/tax/estimate").catch(() => null)
        ]);

        const accounts = accountsData?.accounts || [];
        const txns = txnsData?.transactions || [];

        let contextString = "USER FINANCIAL CONTEXT:\\n";
        
        if (accounts.length > 0) {
          contextString += "\\nAccounts:\\n";
          accounts.forEach((acc: any) => {
            contextString += `- ${acc.name || acc.institution} ${acc.type}: ₹${acc.balance.toLocaleString('en-IN')}\\n`;
          });
        }
        
        if (txns.length > 0) {
          contextString += "\\nRecent Transactions:\\n";
          txns.slice(0, 10).forEach((t: any) => {
            contextString += `- ${t.date}: ${t.merchant} (₹${t.amount.toLocaleString('en-IN')}) [${t.type}]\\n`;
          });
        }

        if (tax) {
          contextString += "\\nTax Profile:\\n";
          if (tax.totalIncome !== undefined) contextString += `- Total Income: ₹${tax.totalIncome.toLocaleString('en-IN')}\\n`;
          if (tax.taxableIncome !== undefined) contextString += `- Taxable Income: ₹${tax.taxableIncome.toLocaleString('en-IN')}\\n`;
          if (tax.estimatedTax !== undefined) contextString += `- Estimated Tax: ₹${tax.estimatedTax.toLocaleString('en-IN')}\\n`;
          if (tax.regime) contextString += `- Regime: ${tax.regime}\\n`;
        }

        // 2. Send context to AI microservice
        const response = await fetch("http://localhost:8000/api/ai/strategy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: "Generate strategy", user_id: "usr_001", context: contextString }),
        });
        
        if (response.ok) {
          const data = await response.json();
          setInsights(data.insights || []);
          
          // Map backend category strings to icons/colors for strategies
          const mappedStrategies = (data.strategies || []).map((s: any) => ({
            ...s,
            icon: s.category.toLowerCase().includes("cost") ? BarChart3 :
                  s.category.toLowerCase().includes("team") ? Users :
                  s.category.toLowerCase().includes("revenue") ? Target : Rocket,
            color: s.category.toLowerCase().includes("cost") ? "from-[#4361ee] to-[#0ea5e9]" :
                   s.category.toLowerCase().includes("team") ? "from-[#06d6a0] to-[#10b981]" :
                   s.category.toLowerCase().includes("revenue") ? "from-[#f59e0b] to-[#f97316]" :
                   "from-[#7c3aed] to-[#a855f7]"
          }));
          setStrategies(mappedStrategies);
        }
      } catch (err) {
        console.error("Failed to fetch strategy", err);
      } finally {
        setIsAnalyzing(false);
      }
    }
    fetchAiStrategy();
  }, []);
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="glass-card p-6 !bg-gradient-to-r from-[#4361ee]/10 via-[#7c3aed]/10 to-[#06d6a0]/10 !border-[#4361ee]/15"
      >
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4361ee] to-[#06d6a0] flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#f0f4ff] mb-1">AI CFO Strategy Engine</h3>
            <p className="text-sm text-[#94a3c8] max-w-2xl">
              Your AI-powered Chief Financial Officer continuously analyzes your financial data to provide actionable strategic insights for growth, cost optimization, and risk management.
            </p>
            <div className="flex items-center gap-2 mt-3">
              <div className="pulse-dot bg-[#06d6a0] text-[#06d6a0]" />
              <span className="text-xs font-semibold text-[#06d6a0]">Analyzing 2,847 data points in real-time</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* AI Insights Grid */}
      <div>
        <motion.div variants={itemVariants} className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-4 h-4 text-[#f59e0b]" />
          <h3 className="text-sm font-semibold text-[#f0f4ff]">Priority Insights</h3>
          {!isAnalyzing && (
            <span className="badge badge-danger text-[10px] !py-0.5">
              {insights.filter((i: any) => i.priority === "high").length} High Priority
            </span>
          )}
        </motion.div>
        
        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center py-12 glass-card">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
              <Sparkles className="w-8 h-8 text-[#06d6a0] mb-4" />
            </motion.div>
            <h3 className="text-sm font-bold text-[#f0f4ff]">AI is analyzing your live data...</h3>
            <p className="text-xs text-[#94a3c8] mt-2">Processing transactions, identifying patterns, generating insights</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {insights.map((insight: any) => {
            const Icon = categoryIcons[insight.category] || Lightbulb;
            const colors = categoryColors[insight.category] || categoryColors.strategy;

            return (
              <motion.div
                key={insight.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className={`glass-card p-5 cursor-pointer !border-t-2 ${colors.border}`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-9 h-9 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${colors.text}`} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#f0f4ff]">{insight.title}</h4>
                    <span className={`text-[10px] font-semibold capitalize ${colors.text}`}>
                      {insight.category}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[#94a3c8] mb-3 leading-relaxed">{insight.description}</p>
                <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
                  <span className="text-xs font-bold text-[#06d6a0]">
                    Impact: {insight.impact}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    insight.priority === "high" ? "bg-[#f43f5e]/10 text-[#f43f5e]" :
                    "bg-[#f59e0b]/10 text-[#f59e0b]"
                  }`}>
                    {insight.priority.toUpperCase()}
                  </span>
                </div>
              </motion.div>
            );
          })}
          </div>
        )}
      </div>

      {/* Corporate Strategy */}
      <div>
        <motion.div variants={itemVariants} className="flex items-center gap-2 mb-4">
          <Briefcase className="w-4 h-4 text-[#7c3aed]" />
          <h3 className="text-sm font-semibold text-[#f0f4ff]">Corporate Strategy Recommendations</h3>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isAnalyzing ? null : strategies.map((strategy: any) => {
            const Icon = strategy.icon;
            return (
              <motion.div
                key={strategy.title}
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                className="glass-card p-5 cursor-pointer"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${strategy.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#f0f4ff]">{strategy.title}</h4>
                    <span className="text-[10px] text-[#5a6a8a]">{strategy.category}</span>
                  </div>
                </div>
                <p className="text-xs text-[#94a3c8] mb-3 leading-relaxed">{strategy.description}</p>
                <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
                  <span className="text-xs font-bold text-[#06d6a0]">{strategy.impact}</span>
                  <button
                    onClick={() => onNavigate && onNavigate("dashboard")}
                    className="flex items-center gap-1 text-xs text-[#4361ee] hover:underline"
                  >
                    Explore <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
