"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, Calendar, TrendingUp, Receipt, ShieldCheck, BarChart3, FileSpreadsheet, X } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/components/Toast";

const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const getReportStyle = (name: string, type: string) => {
  const t = type.toLowerCase();
  const n = name.toLowerCase();
  if (n.includes("profit")) return { icon: TrendingUp, color: "from-[#4361ee] to-[#0ea5e9]" };
  if (n.includes("balance")) return { icon: BarChart3, color: "from-[#06d6a0] to-[#10b981]" };
  if (n.includes("cash")) return { icon: FileSpreadsheet, color: "from-[#7c3aed] to-[#a855f7]" };
  if (t.includes("tax")) return { icon: ShieldCheck, color: "from-[#f59e0b] to-[#f97316]" };
  if (t.includes("audit")) return { icon: Receipt, color: "from-[#f43f5e] to-[#ec4899]" };
  if (t.includes("security") || n.includes("fraud")) return { icon: ShieldCheck, color: "from-[#0ea5e9] to-[#06b6d4]" };
  return { icon: FileText, color: "from-[#64748b] to-[#94a3b8]" };
};

export default function ReportsView() {
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { success, error, info } = useToast();

  const [newReport, setNewReport] = useState({
    name: "",
    type: "Financial",
    period: "Q2 2026"
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const data = await api.get("/reports");
      if (data && data.reports) {
        setReports(data.reports);
      } else {
        setReports([]);
      }
    } catch (err: any) {
      error(err.message || "Failed to fetch reports");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (format: string, reportName: string) => {
    const content = `Simulated ${format} report data for ${reportName}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${reportName.replace(/\s+/g, "_")}.${format.toLowerCase()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    success(`${format} downloaded successfully`);
  };

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
    info("Report generating...");
    
    // Simulate generation delay
    setTimeout(() => {
      const generatedReport = {
        id: `rpt_${Math.random().toString(36).substr(2, 9)}`,
        name: newReport.name,
        type: newReport.type,
        period: newReport.period,
        status: "ready"
      };
      setReports((prev) => [generatedReport, ...prev]);
      success("Report generated successfully");
      setNewReport({ name: "", type: "Financial", period: "Q2 2026" });
    }, 2000);
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="p-6 space-y-6 relative">
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-[#f0f4ff]">Financial Reports</h3>
          <p className="text-sm text-[#5a6a8a] mt-1">AI-generated financial statements and analysis reports</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
          <FileText className="w-4 h-4" />
          Generate Custom Report
        </button>
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#4361ee] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {reports.map((report) => {
            const { icon: Icon, color } = getReportStyle(report.name, report.type);
            const statusDisplay = report.status ? report.status.charAt(0).toUpperCase() + report.status.slice(1) : "Ready";
            const typeDisplay = report.type ? report.type.charAt(0).toUpperCase() + report.type.slice(1) : "Unknown";

            return (
              <motion.div key={report.id} variants={itemVariants} whileHover={{ scale: 1.02 }} className="glass-card p-5 cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className={`badge text-[10px] !py-0.5 ${statusDisplay === "Ready" ? "badge-success" : statusDisplay === "Draft" ? "badge-warning" : "badge-info"}`}>
                    {statusDisplay}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-[#f0f4ff] mb-1">{report.name}</h4>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs text-[#5a6a8a]">{typeDisplay}</span>
                  <span className="text-xs text-[#5a6a8a]">•</span>
                  <div className="flex items-center gap-1 text-xs text-[#94a3c8]">
                    <Calendar className="w-3 h-3" />
                    {report.period}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={(e) => { e.stopPropagation(); handleDownload("PDF", report.name); }} className="btn-secondary !py-1.5 !text-xs flex items-center gap-1 flex-1 justify-center"><Download className="w-3 h-3" />PDF</button>
                  <button onClick={(e) => { e.stopPropagation(); handleDownload("Excel", report.name); }} className="btn-secondary !py-1.5 !text-xs flex items-center gap-1 flex-1 justify-center"><Download className="w-3 h-3" />Excel</button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Generate Custom Report Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-md p-6 relative"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-[#5a6a8a] hover:text-[#f0f4ff] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-[#f0f4ff] mb-4">Generate Custom Report</h3>
              
              <form onSubmit={handleGenerateReport} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#94a3c8] mb-1">Report Name</label>
                  <input
                    type="text"
                    required
                    value={newReport.name}
                    onChange={(e) => setNewReport({ ...newReport, name: e.target.value })}
                    className="w-full bg-[#0b1120]/50 border border-[#1e293b] rounded-lg px-4 py-2.5 text-sm text-[#f0f4ff] focus:outline-none focus:border-[#4361ee] focus:ring-1 focus:ring-[#4361ee] transition-all"
                    placeholder="e.g. Q2 Performance Review"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#94a3c8] mb-1">Type</label>
                    <select
                      value={newReport.type}
                      onChange={(e) => setNewReport({ ...newReport, type: e.target.value })}
                      className="w-full bg-[#0b1120]/50 border border-[#1e293b] rounded-lg px-4 py-2.5 text-sm text-[#f0f4ff] focus:outline-none focus:border-[#4361ee] focus:ring-1 focus:ring-[#4361ee] transition-all"
                    >
                      <option value="Financial">Financial</option>
                      <option value="Tax">Tax</option>
                      <option value="Audit">Audit</option>
                      <option value="Security">Security</option>
                      <option value="Operational">Operational</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-[#94a3c8] mb-1">Period</label>
                    <input
                      type="text"
                      required
                      value={newReport.period}
                      onChange={(e) => setNewReport({ ...newReport, period: e.target.value })}
                      className="w-full bg-[#0b1120]/50 border border-[#1e293b] rounded-lg px-4 py-2.5 text-sm text-[#f0f4ff] focus:outline-none focus:border-[#4361ee] focus:ring-1 focus:ring-[#4361ee] transition-all"
                      placeholder="e.g. Q2 2026"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="btn-primary flex-1"
                  >
                    Generate
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
