"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Link2, CheckCircle2, ArrowRight, RefreshCw, Settings, Loader2 } from "lucide-react";
import { useToast } from "@/components/Toast";

const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const erpSystems = [
  { name: "Tally Prime", category: "Accounting", status: "connected" as const, lastSync: "2 min ago", modules: ["Ledger", "Vouchers", "Balance Sheet"], color: "from-[#4361ee] to-[#0ea5e9]" },
  { name: "Zoho Books", category: "Accounting", status: "connected" as const, lastSync: "15 min ago", modules: ["Invoices", "Expenses", "Reports"], color: "from-[#06d6a0] to-[#10b981]" },
  { name: "SAP Business One", category: "ERP", status: "available" as const, lastSync: "", modules: ["Finance", "Sales", "Inventory", "HR"], color: "from-[#f59e0b] to-[#f97316]" },
  { name: "QuickBooks", category: "Accounting", status: "available" as const, lastSync: "", modules: ["Payroll", "Banking", "Invoicing"], color: "from-[#7c3aed] to-[#a855f7]" },
  { name: "Oracle NetSuite", category: "ERP", status: "available" as const, lastSync: "", modules: ["Finance", "CRM", "Commerce", "HR"], color: "from-[#f43f5e] to-[#ec4899]" },
  { name: "Microsoft Dynamics", category: "ERP", status: "available" as const, lastSync: "", modules: ["Finance", "Supply Chain", "HR"], color: "from-[#0ea5e9] to-[#06b6d4]" },
];

export default function ERPView() {
  const { success } = useToast();
  const [systems, setSystems] = useState(erpSystems);
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const handleConnect = (name: string) => {
    setConnectingId(name);
    setTimeout(() => {
      setSystems(prev => prev.map(s => s.name === name ? { ...s, status: "connected", lastSync: "just now" } : s));
      setConnectingId(null);
      success(`Successfully connected to ${name}`);
    }, 1500);
  };

  const handleSync = (name: string) => {
    setSyncingId(name);
    setTimeout(() => {
      setSystems(prev => prev.map(s => s.name === name ? { ...s, lastSync: "just now" } : s));
      setSyncingId(null);
      success(`Synced data with ${name}`);
    }, 1000);
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="p-6 space-y-6">
      <motion.div variants={itemVariants}>
        <h3 className="text-xl font-bold text-[var(--color-text-primary)]">ERP Integrations</h3>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">Connect your enterprise systems for automated data sync</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {systems.map((erp) => (
          <motion.div key={erp.name} variants={itemVariants} whileHover={{ scale: 1.02 }} className="glass-card p-5 cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${erp.color} flex items-center justify-center`}>
                <Building2 className="w-5 h-5 text-white" />
              </div>
              {erp.status === "connected" ? (
                <span className="badge badge-success text-[10px]"><CheckCircle2 className="w-3 h-3" />Connected</span>
              ) : (
                <span className="badge badge-info text-[10px]">Available</span>
              )}
            </div>
            <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-0.5">{erp.name}</h4>
            <p className="text-xs text-[var(--color-text-muted)] mb-3">{erp.category}</p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {erp.modules.map((m) => (
                <span key={m} className="text-[10px] px-2 py-0.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[var(--color-text-secondary)]">{m}</span>
              ))}
            </div>
            {erp.status === "connected" ? (
              <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
                <span className="text-[10px] text-[var(--color-text-muted)]">Synced: {erp.lastSync}</span>
                <button 
                  onClick={() => handleSync(erp.name)}
                  disabled={syncingId === erp.name}
                  className="flex items-center gap-1 text-xs text-[#4361ee] disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${syncingId === erp.name ? "animate-spin" : ""}`} />
                  {syncingId === erp.name ? "Syncing..." : "Sync"}
                </button>
              </div>
            ) : (
              <button 
                onClick={() => handleConnect(erp.name)}
                disabled={connectingId === erp.name}
                className="btn-primary w-full !text-xs flex items-center justify-center gap-1 disabled:opacity-50"
              >
                {connectingId === erp.name ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Link2 className="w-3 h-3" />
                    Connect
                  </>
                )}
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
