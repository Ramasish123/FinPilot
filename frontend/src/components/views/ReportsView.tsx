"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, Calendar, TrendingUp, Receipt, ShieldCheck, BarChart3, FileSpreadsheet, X } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/components/Toast";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

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

  const handleDownload = async (format: string, reportName: string) => {
    info(`Generating ${format} for ${reportName}...`);
    try {
      let csvContent = "";
      let pdfDoc = new jsPDF();
      
      const isProfitAndLoss = reportName.toLowerCase().includes("profit") || reportName.toLowerCase().includes("p&l");
      const isBalanceSheet = reportName.toLowerCase().includes("balance");
      const isCashFlow = reportName.toLowerCase().includes("cash");
      const isTaxReport = reportName.toLowerCase().includes("tax");

      if (isProfitAndLoss) {
        const res = await api.get("/transactions");
        const txns = res.transactions || [];
        const income = txns.filter((t: any) => t.type === "credit").reduce((s: number, t: any) => s + t.amount, 0);
        const expenses = txns.filter((t: any) => t.type === "debit").reduce((s: number, t: any) => s + t.amount, 0);
        const net = income - expenses;

        if (format === "CSV") {
          csvContent = `Category,Amount\nTotal Income,${income}\nTotal Expenses,${expenses}\nNet Profit,${net}\n\n`;
          csvContent += `Date,Merchant,Category,Amount\n`;
          txns.forEach((t: any) => {
            csvContent += `${t.date},"${t.merchant}",${t.category},${t.type === 'credit' ? '+' : '-'}${t.amount}\n`;
          });
        } else {
          pdfDoc.setFontSize(20);
          pdfDoc.text("Profit & Loss Statement", 14, 22);
          pdfDoc.setFontSize(12);
          pdfDoc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);
          
          autoTable(pdfDoc, {
            startY: 40,
            head: [['Metric', 'Amount']],
            body: [
              ['Total Income', `Rs. ${income}`],
              ['Total Expenses', `Rs. ${expenses}`],
              ['Net Profit', `Rs. ${net}`],
            ],
          });

          autoTable(pdfDoc, {
            startY: (pdfDoc as any).lastAutoTable.finalY + 10,
            head: [['Date', 'Merchant', 'Category', 'Amount']],
            body: txns.map((t: any) => [
              t.date, t.merchant, t.category, `${t.type === 'credit' ? '+' : '-'}${t.amount}`
            ]),
          });
        }
      } else if (isBalanceSheet) {
        const [accRes, loanRes] = await Promise.all([
          api.get("/accounts"),
          api.get("/loans")
        ]);
        const assets = accRes.accounts || [];
        const totalAssets = accRes.totalBalance || 0;
        const liabilities = loanRes.loans || [];
        const totalLiabilities = loanRes.totalOutstanding || 0;
        const equity = totalAssets - totalLiabilities;

        if (format === "CSV") {
          csvContent = `Type,Name,Amount\n`;
          assets.forEach((a: any) => csvContent += `Asset,"${a.name}",${a.balance}\n`);
          liabilities.forEach((l: any) => csvContent += `Liability,"${l.name}",-${l.remaining}\n`);
          csvContent += `\nSummary,Amount\nTotal Assets,${totalAssets}\nTotal Liabilities,${totalLiabilities}\nTotal Equity,${equity}\n`;
        } else {
          pdfDoc.setFontSize(20);
          pdfDoc.text("Balance Sheet", 14, 22);
          
          autoTable(pdfDoc, {
            startY: 35,
            head: [['Assets', 'Amount']],
            body: assets.map((a: any) => [a.name, `Rs. ${a.balance}`]),
            foot: [['Total Assets', `Rs. ${totalAssets}`]],
          });

          autoTable(pdfDoc, {
            startY: (pdfDoc as any).lastAutoTable.finalY + 10,
            head: [['Liabilities', 'Amount']],
            body: liabilities.map((l: any) => [l.name, `Rs. ${l.remaining}`]),
            foot: [['Total Liabilities', `Rs. ${totalLiabilities}`]],
          });

          autoTable(pdfDoc, {
            startY: (pdfDoc as any).lastAutoTable.finalY + 10,
            head: [['Equity', 'Amount']],
            body: [['Total Equity', `Rs. ${equity}`]],
          });
        }
      } else if (isCashFlow) {
        const res = await api.get("/transactions");
        const txns = res.transactions || [];
        const inflows = txns.filter((t: any) => t.type === "credit");
        const outflows = txns.filter((t: any) => t.type === "debit");
        const totalIn = inflows.reduce((s: number, t: any) => s + t.amount, 0);
        const totalOut = outflows.reduce((s: number, t: any) => s + t.amount, 0);
        const netCash = totalIn - totalOut;

        if (format === "CSV") {
          csvContent = `Type,Amount\nCash Inflows,${totalIn}\nCash Outflows,${totalOut}\nNet Cash Flow,${netCash}\n`;
        } else {
          pdfDoc.setFontSize(20);
          pdfDoc.text("Cash Flow Statement", 14, 22);
          autoTable(pdfDoc, {
            startY: 35,
            head: [['Cash Flow', 'Amount']],
            body: [
              ['Cash Inflows', `Rs. ${totalIn}`],
              ['Cash Outflows', `Rs. ${totalOut}`],
              ['Net Cash Flow', `Rs. ${netCash}`]
            ],
          });
        }
      } else if (isTaxReport) {
        const taxRes = await api.get("/tax/estimate");
        if (format === "CSV") {
          csvContent = `Metric,Amount\nTotal Income,${taxRes.totalIncome}\nTaxable Income,${taxRes.taxableIncome}\nEstimated Tax,${taxRes.estimatedTax}\nTax Savings,${taxRes.savings}\n\nDeductions:\n`;
          taxRes.deductions.forEach((d: any) => csvContent += `"${d.name}",${d.amount}\n`);
        } else {
          pdfDoc.setFontSize(20);
          pdfDoc.text("Tax Filing Report", 14, 22);
          autoTable(pdfDoc, {
            startY: 35,
            head: [['Metric', 'Amount']],
            body: [
              ['Total Income', `Rs. ${taxRes.totalIncome}`],
              ['Taxable Income', `Rs. ${taxRes.taxableIncome}`],
              ['Estimated Tax', `Rs. ${taxRes.estimatedTax}`],
              ['Tax Savings', `Rs. ${taxRes.savings}`],
            ],
          });
          autoTable(pdfDoc, {
            startY: (pdfDoc as any).lastAutoTable.finalY + 10,
            head: [['Deduction Name', 'Amount']],
            body: taxRes.deductions.map((d: any) => [d.name, `Rs. ${d.amount}`]),
          });
        }
      } else {
        // Generic fallback
        if (format === "CSV") {
          csvContent = `Report Name,Format,Status\n"${reportName}",${format},Generated`;
        } else {
          pdfDoc.setFontSize(20);
          pdfDoc.text(reportName, 14, 22);
          pdfDoc.setFontSize(12);
          pdfDoc.text("This custom report was dynamically generated.", 14, 30);
        }
      }

      // Finalize and download
      if (format === "CSV") {
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${reportName.replace(/\s+/g, "_")}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        pdfDoc.save(`${reportName.replace(/\s+/g, "_")}.pdf`);
      }
      success(`${format} report generated successfully!`);
    } catch (err: any) {
      error(`Failed to generate ${format} report`, err.message);
    }
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
                  <button onClick={(e) => { e.stopPropagation(); handleDownload("CSV", report.name); }} className="btn-secondary !py-1.5 !text-xs flex items-center gap-1 flex-1 justify-center"><Download className="w-3 h-3" />CSV</button>
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
