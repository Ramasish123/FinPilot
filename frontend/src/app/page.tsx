"use client";

import React, { useState, useEffect } from "react";
import AuthPage from "@/components/AuthPage";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { ToastProvider } from "@/components/Toast";
import { getToken, getStoredUser, setToken, setStoredUser, logout as doLogout } from "@/lib/api";
import DashboardView from "@/components/views/DashboardView";
import TransactionsView from "@/components/views/TransactionsView";
import AccountsView from "@/components/views/AccountsView";
import IncomeView from "@/components/views/IncomeView";
import ExpensesView from "@/components/views/ExpensesView";
import AccountingView from "@/components/views/AccountingView";
import LoansView from "@/components/views/LoansView";
import TaxView from "@/components/views/TaxView";
import FraudView from "@/components/views/FraudView";
import ForecastingView from "@/components/views/ForecastingView";
import StrategyView from "@/components/views/StrategyView";
import ChatbotView from "@/components/views/ChatbotView";
import ReportsView from "@/components/views/ReportsView";
import ERPView from "@/components/views/ERPView";
import SettingsView from "@/components/views/SettingsView";

const tabConfig: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: "Dashboard", subtitle: "Overview of your financial operating system" },
  transactions: { title: "Transactions", subtitle: "AI-categorized transaction history" },
  accounts: { title: "Accounts", subtitle: "Connected bank accounts & wallets" },
  income: { title: "Income Detection", subtitle: "AI-detected income sources & trends" },
  expenses: { title: "Expense Tracking", subtitle: "Smart expense categorization & alerts" },
  accounting: { title: "Accounting Engine", subtitle: "Double-entry ledger & financial statements" },
  loans: { title: "Loans & EMI", subtitle: "Debt management & repayment tracking" },
  tax: { title: "Taxation Engine", subtitle: "Tax estimation, optimization & filing" },
  fraud: { title: "Fraud Detection", subtitle: "AI-powered anomaly & fraud monitoring" },
  forecasting: { title: "AI Forecasting", subtitle: "Revenue, expense & savings predictions" },
  strategy: { title: "AI CFO Strategy", subtitle: "Strategic financial intelligence & recommendations" },
  chatbot: { title: "AI Assistant", subtitle: "Conversational financial advisor" },
  reports: { title: "Reports", subtitle: "Generated financial statements & analysis" },
  erp: { title: "ERP Connect", subtitle: "Enterprise system integrations" },
  settings: { title: "Settings", subtitle: "Account, security & preferences" },
};

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const token = getToken();
    const storedUser = getStoredUser();
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(storedUser);
    }
    setCheckingAuth(false);
  }, []);

  const handleLogin = (token: string, userData: any) => {
    setToken(token);
    setStoredUser(userData);
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    doLogout();
    setIsAuthenticated(false);
    setUser(null);
    setActiveTab("dashboard");
  };

  const config = tabConfig[activeTab] || tabConfig.dashboard;

  // Show nothing while checking auth to prevent flash
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#4361ee]/30 border-t-[#4361ee] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage onLogin={handleLogin} />;
  }

  const renderView = () => {
    switch (activeTab) {
      case "dashboard": return <DashboardView onNavigate={setActiveTab} />;
      case "transactions": return <TransactionsView />;
      case "accounts": return <AccountsView />;
      case "income": return <IncomeView />;
      case "expenses": return <ExpensesView />;
      case "accounting": return <AccountingView />;
      case "loans": return <LoansView />;
      case "tax": return <TaxView />;
      case "fraud": return <FraudView />;
      case "forecasting": return <ForecastingView />;
      case "strategy": return <StrategyView onNavigate={setActiveTab} />;
      case "chatbot": return <ChatbotView />;
      case "reports": return <ReportsView />;
      case "erp": return <ERPView />;
      case "settings": return <SettingsView />;
      default: return <DashboardView onNavigate={setActiveTab} />;
    }
  };

  return (
    <ToastProvider>
      <div className="flex min-h-screen relative z-10">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar
            title={config.title}
            subtitle={config.subtitle}
            user={user}
            onLogout={handleLogout}
            onNavigate={setActiveTab}
          />
          <main className="flex-1 overflow-y-auto">
            {renderView()}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
