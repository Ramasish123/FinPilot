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

const corporateStrategies = [
  {
    title: "Optimize Marketing ROI",
    description: "Marketing spend increased 35% but conversions improved only 3%. AI recommends reallocating 40% of Google Ads budget to LinkedIn targeting for B2B clients.",
    impact: "Save ₹5.2L/quarter",
    category: "Cost Optimization",
    icon: BarChart3,
    color: "from-[#4361ee] to-[#0ea5e9]",
  },
  {
    title: "Hiring Recommendation",
    description: "Revenue per employee increased 12% QoQ. Current team is at 92% capacity. AI recommends hiring 3 senior developers and 1 sales lead by Q3.",
    impact: "Projected +₹18L revenue",
    category: "Team Growth",
    icon: Users,
    color: "from-[#06d6a0] to-[#10b981]",
  },
  {
    title: "Expansion Analysis",
    description: "Bangalore market shows 34% higher demand for your services. Competitors are underserving this segment. Recommended entry cost: ₹12L.",
    impact: "New market: ₹45L potential",
    category: "Growth Strategy",
    icon: Rocket,
    color: "from-[#7c3aed] to-[#a855f7]",
  },
  {
    title: "Pricing Optimization",
    description: "Price elasticity analysis shows 15% price increase on premium tier will only reduce subscribers by 3%, netting ₹8L additional annual revenue.",
    impact: "+₹8L annual revenue",
    category: "Revenue",
    icon: Target,
    color: "from-[#f59e0b] to-[#f97316]",
  },
];

export default function StrategyView() {
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
          <span className="badge badge-danger text-[10px] !py-0.5">
            {mockInsights.filter((i) => i.priority === "high").length} High Priority
          </span>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {mockInsights.map((insight) => {
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
      </div>

      {/* Corporate Strategy */}
      <div>
        <motion.div variants={itemVariants} className="flex items-center gap-2 mb-4">
          <Briefcase className="w-4 h-4 text-[#7c3aed]" />
          <h3 className="text-sm font-semibold text-[#f0f4ff]">Corporate Strategy Recommendations</h3>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {corporateStrategies.map((strategy) => {
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
                  <button className="flex items-center gap-1 text-xs text-[#4361ee] hover:underline">
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
