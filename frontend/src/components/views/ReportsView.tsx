"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, Download, Calendar, TrendingUp, Receipt, ShieldCheck, BarChart3, FileSpreadsheet } from "lucide-react";

const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const reports = [
  { name: "Profit & Loss Statement", type: "Financial", period: "May 2026", icon: TrendingUp, color: "from-[#4361ee] to-[#0ea5e9]", status: "Ready" },
  { name: "Balance Sheet", type: "Financial", period: "Q1 FY26", icon: BarChart3, color: "from-[#06d6a0] to-[#10b981]", status: "Ready" },
  { name: "Cash Flow Statement", type: "Financial", period: "May 2026", icon: FileSpreadsheet, color: "from-[#7c3aed] to-[#a855f7]", status: "Ready" },
  { name: "Tax Filing Report", type: "Tax", period: "FY 2025-26", icon: ShieldCheck, color: "from-[#f59e0b] to-[#f97316]", status: "Draft" },
  { name: "Expense Audit Report", type: "Audit", period: "May 2026", icon: Receipt, color: "from-[#f43f5e] to-[#ec4899]", status: "Ready" },
  { name: "Fraud Analysis Report", type: "Security", period: "May 2026", icon: ShieldCheck, color: "from-[#0ea5e9] to-[#06b6d4]", status: "Generating" },
];

export default function ReportsView() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="p-6 space-y-6">
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-[#f0f4ff]">Financial Reports</h3>
          <p className="text-sm text-[#5a6a8a] mt-1">AI-generated financial statements and analysis reports</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Generate Custom Report
        </button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <motion.div key={report.name} variants={itemVariants} whileHover={{ scale: 1.02 }} className="glass-card p-5 cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${report.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className={`badge text-[10px] !py-0.5 ${report.status === "Ready" ? "badge-success" : report.status === "Draft" ? "badge-warning" : "badge-info"}`}>
                  {report.status}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-[#f0f4ff] mb-1">{report.name}</h4>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs text-[#5a6a8a]">{report.type}</span>
                <span className="text-xs text-[#5a6a8a]">•</span>
                <div className="flex items-center gap-1 text-xs text-[#94a3c8]">
                  <Calendar className="w-3 h-3" />
                  {report.period}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn-secondary !py-1.5 !text-xs flex items-center gap-1 flex-1 justify-center"><Download className="w-3 h-3" />PDF</button>
                <button className="btn-secondary !py-1.5 !text-xs flex items-center gap-1 flex-1 justify-center"><Download className="w-3 h-3" />Excel</button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
