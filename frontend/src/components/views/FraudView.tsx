"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  AlertTriangle,
  AlertOctagon,
  Eye,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  ShieldCheck,
  Activity,
  X,
} from "lucide-react";
import { formatCurrency, FraudAlert } from "@/lib/data";
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

const severityConfig = {
  low: { color: "text-[#0ea5e9]", bg: "bg-[#0ea5e9]/15", border: "border-[#0ea5e9]/20", icon: Eye },
  medium: { color: "text-[#f59e0b]", bg: "bg-[#f59e0b]/15", border: "border-[#f59e0b]/20", icon: AlertTriangle },
  high: { color: "text-[#f43f5e]", bg: "bg-[#f43f5e]/15", border: "border-[#f43f5e]/20", icon: ShieldAlert },
  critical: { color: "text-[#ef4444]", bg: "bg-[#ef4444]/15", border: "border-[#ef4444]/20", icon: AlertOctagon },
};

const statusConfig = {
  open: { color: "text-[#f43f5e]", bg: "bg-[#f43f5e]/10", label: "Open" },
  investigating: { color: "text-[#f59e0b]", bg: "bg-[#f59e0b]/10", label: "Investigating" },
  resolved: { color: "text-[#10b981]", bg: "bg-[#10b981]/10", label: "Resolved" },
};

export default function FraudView() {
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<FraudAlert | null>(null);
  const { success, error } = useToast();

  const fetchAlerts = async () => {
    try {
      const data = await api.get("/fraud/alerts");
      setAlerts(data.alerts || []);
    } catch (err) {
      error("Failed to fetch fraud alerts.");
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleResolve = async (id: string) => {
    try {
      await api.patch(`/fraud/alerts/${id}`, { status: "resolved" });
      success("Alert marked as resolved");
      fetchAlerts();
      setSelectedAlert(null);
    } catch (err) {
      error("Failed to resolve alert.");
    }
  };

  const openCount = alerts.filter((a) => a.status === "open").length;
  const criticalCount = alerts.filter((a) => a.severity === "critical" || a.severity === "high").length;

  return (
    <>
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="p-6 space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <motion.div variants={itemVariants} className="glass-card metric-card rose p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert className="w-4 h-4 text-[#f43f5e]" />
              <p className="text-xs text-[#5a6a8a]">Total Alerts</p>
            </div>
            <p className="text-2xl font-bold text-[#f0f4ff]">{alerts.length}</p>
          </motion.div>
          <motion.div variants={itemVariants} className="glass-card metric-card amber p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-[#f59e0b]" />
              <p className="text-xs text-[#5a6a8a]">Open</p>
            </div>
            <p className="text-2xl font-bold text-[#f59e0b]">{openCount}</p>
          </motion.div>
          <motion.div variants={itemVariants} className="glass-card metric-card blue p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertOctagon className="w-4 h-4 text-[#f43f5e]" />
              <p className="text-xs text-[#5a6a8a]">Critical/High</p>
            </div>
            <p className="text-2xl font-bold text-[#f43f5e]">{criticalCount}</p>
          </motion.div>
          <motion.div variants={itemVariants} className="glass-card metric-card green p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-[#10b981]" />
              <p className="text-xs text-[#5a6a8a]">Risk Score</p>
            </div>
            <p className="text-2xl font-bold text-[#f0f4ff]">72<span className="text-sm text-[#5a6a8a]">/100</span></p>
            <span className="badge badge-warning text-[10px] !py-0 mt-1">Moderate</span>
          </motion.div>
        </div>

        {/* Alert Cards */}
        <div className="space-y-3">
          {alerts.map((alert) => {
            const sev = severityConfig[alert.severity];
            const stat = statusConfig[alert.status];
            const SevIcon = sev.icon;

            return (
              <motion.div
                key={alert.id}
                variants={itemVariants}
                whileHover={{ x: 4 }}
                className={`glass-card p-5 cursor-pointer !border-l-4 ${sev.border}`}
                onClick={() => setSelectedAlert(alert)}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl ${sev.bg} flex items-center justify-center flex-shrink-0`}>
                    <SevIcon className={`w-5 h-5 ${sev.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-[#f0f4ff]">
                        {alert.type.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                      </h4>
                      <span className={`badge text-[10px] !py-0 ${
                        alert.severity === "critical" ? "badge-danger" :
                        alert.severity === "high" ? "badge-danger" :
                        alert.severity === "medium" ? "badge-warning" : "badge-info"
                      }`}>
                        {alert.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-[#94a3c8] mb-2">{alert.description}</p>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-[#5a6a8a]">Amount: <span className="font-semibold text-[#f0f4ff]">{formatCurrency(alert.amount)}</span></span>
                      <span className="text-xs text-[#5a6a8a]">Date: {alert.date}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`badge text-[10px] !py-0.5 ${
                      alert.status === "open" ? "badge-danger" :
                      alert.status === "investigating" ? "badge-warning" : "badge-success"
                    }`}>
                      {alert.status === "investigating" && <Clock className="w-3 h-3" />}
                      {alert.status === "resolved" && <CheckCircle2 className="w-3 h-3" />}
                      {stat.label}
                    </span>
                    <button 
                      className="text-xs text-[#4361ee] hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAlert(alert);
                      }}
                    >
                      {alert.status === "resolved" ? "View Details" : "Investigate"}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* AI Monitoring Status */}
        <motion.div variants={itemVariants} className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-[#06d6a0]" />
            <h3 className="text-sm font-semibold text-[#f0f4ff]">AI Monitoring Agents</h3>
            <div className="pulse-dot bg-[#06d6a0] text-[#06d6a0] ml-2" />
            <span className="text-[10px] text-[#06d6a0] font-semibold">Active</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { agent: "Transaction Monitor", status: "Active", scanned: "1,247" },
              { agent: "Invoice Validator", status: "Active", scanned: "89" },
              { agent: "Vendor Analyzer", status: "Active", scanned: "34" },
              { agent: "Pattern Detector", status: "Active", scanned: "2,891" },
            ].map((a) => (
              <div key={a.agent} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <p className="text-xs font-semibold text-[#f0f4ff] mb-1">{a.agent}</p>
                <div className="flex items-center gap-1 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                  <span className="text-[10px] text-[#10b981]">{a.status}</span>
                </div>
                <p className="text-[10px] text-[#5a6a8a]">{a.scanned} items scanned</p>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {selectedAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-lg p-6 relative"
            >
              <button
                onClick={() => setSelectedAlert(null)}
                className="absolute top-4 right-4 p-2 text-[#94a3c8] hover:text-white rounded-full hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-xl ${severityConfig[selectedAlert.severity].bg} flex items-center justify-center`}>
                  {React.createElement(severityConfig[selectedAlert.severity].icon, { className: `w-6 h-6 ${severityConfig[selectedAlert.severity].color}` })}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#f0f4ff]">Alert Details</h3>
                  <p className="text-sm text-[#94a3c8]">ID: {selectedAlert.id}</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <p className="text-sm text-[#f0f4ff] mb-4">{selectedAlert.description}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-[#5a6a8a] mb-1">Type</p>
                      <p className="text-sm font-medium text-[#f0f4ff] capitalize">{selectedAlert.type.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#5a6a8a] mb-1">Amount</p>
                      <p className="text-sm font-medium text-[#f0f4ff]">{formatCurrency(selectedAlert.amount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#5a6a8a] mb-1">Date</p>
                      <p className="text-sm font-medium text-[#f0f4ff]">{selectedAlert.date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#5a6a8a] mb-1">Status</p>
                      <p className="text-sm font-medium text-[#f0f4ff] capitalize">{selectedAlert.status}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="px-4 py-2 text-sm font-medium text-[#f0f4ff] bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  Close
                </button>
                {selectedAlert.status !== "resolved" && (
                  <button
                    onClick={() => handleResolve(selectedAlert.id)}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#10b981] hover:bg-[#059669] rounded-lg transition-colors flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Mark Resolved
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
