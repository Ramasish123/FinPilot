"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  TrendingUp,
  Receipt,
  Landmark,
  ShieldAlert,
  BrainCircuit,
  MessageSquareText,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  PieChart,
  CreditCard,
  Building2,
  Sun,
  Moon,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navSections = [
  {
    title: "Overview",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "transactions", label: "Transactions", icon: ArrowLeftRight },
      { id: "accounts", label: "Accounts", icon: Wallet },
    ],
  },
  {
    title: "Finance",
    items: [
      { id: "income", label: "Income", icon: TrendingUp },
      { id: "expenses", label: "Expenses", icon: PieChart },
      { id: "accounting", label: "Accounting", icon: Receipt },
      { id: "loans", label: "Loans & EMI", icon: CreditCard },
      { id: "tax", label: "Taxation", icon: Landmark },
    ],
  },
  {
    title: "AI Intelligence",
    items: [
      { id: "fraud", label: "Fraud Detection", icon: ShieldAlert },
      { id: "forecasting", label: "Forecasting", icon: BrainCircuit },
      { id: "strategy", label: "AI CFO", icon: Sparkles },
      { id: "chatbot", label: "AI Assistant", icon: MessageSquareText },
    ],
  },
  {
    title: "System",
    items: [
      { id: "reports", label: "Reports", icon: FileText },
      { id: "erp", label: "ERP Connect", icon: Building2 },
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
];

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(true);

  React.useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="h-screen sticky top-0 flex flex-col border-r border-[var(--color-glass-border)] bg-[var(--color-surface-900)]/80 backdrop-blur-xl z-40 transition-colors duration-500 ease-in-out"
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-[var(--color-glass-border)] transition-colors duration-500 ease-in-out">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4361ee] to-[#06d6a0] flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="overflow-hidden"
              >
                <h1 className="text-base font-bold gradient-text whitespace-nowrap">
                  FinPilot AI
                </h1>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <AnimatePresence>
          {!collapsed && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleTheme}
              className="p-1.5 rounded-lg hover:bg-[var(--color-glass-white)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              title="Toggle Theme"
            >
              {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {navSections.map((section) => (
          <div key={section.title}>
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--color-text-muted)]"
                >
                  {section.title}
                </motion.p>
              )}
            </AnimatePresence>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`sidebar-link w-full relative ${isActive ? "active" : ""}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="whitespace-nowrap"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {isActive && (
                      <motion.div
                        layoutId="active-sidebar"
                        className="absolute inset-0 rounded-[10px] bg-gradient-to-r from-[#4361ee]/15 to-[#4361ee]/5 border border-[#4361ee]/20"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-[var(--color-glass-border)] space-y-2 transition-colors duration-500 ease-in-out">
        {/* AI Status */}
        {!collapsed && (
          <div className="glass-card p-3 mb-2 !bg-gradient-to-r from-[#4361ee]/10 to-[#06d6a0]/10 !border-[#4361ee]/20">
            <div className="flex items-center gap-2 mb-1">
              <div className="pulse-dot bg-[#06d6a0] text-[#06d6a0]" />
              <span className="text-xs font-semibold text-[#06d6a0]">AI Engine Active</span>
            </div>
            <p className="text-[10px] text-[var(--color-text-secondary)]">
              6 agents monitoring your finances
            </p>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="sidebar-link w-full justify-center"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
