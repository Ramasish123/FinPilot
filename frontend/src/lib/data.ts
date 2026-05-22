// FinPilot AI — Mock Data & Types
// This simulates what would come from the backend APIs

// ==========================================
// Types
// ==========================================

export interface User {
  id: string;
  name: string;
  email: string;
  role: "individual" | "accountant" | "finance_manager" | "ceo" | "admin";
  avatar?: string;
  company?: string;
  plan: "free" | "pro" | "enterprise";
}

export interface Transaction {
  id: string;
  amount: number;
  type: "credit" | "debit";
  category: string;
  merchant: string;
  date: string;
  account: string;
  status: "completed" | "pending" | "failed";
  aiCategory?: string;
  flagged?: boolean;
}

export interface Account {
  id: string;
  name: string;
  type: "savings" | "current" | "credit_card" | "investment" | "wallet";
  balance: number;
  institution: string;
  lastSync: string;
  connected: boolean;
}

export interface Loan {
  id: string;
  name: string;
  type: "home" | "car" | "student" | "business" | "credit_card";
  principal: number;
  remaining: number;
  rate: number;
  emi: number;
  nextDue: string;
  status: "active" | "closed";
}

export interface TaxEstimate {
  totalIncome: number;
  taxableIncome: number;
  deductions: { name: string; amount: number }[];
  estimatedTax: number;
  regime: "old" | "new";
  savings: number;
}

export interface FraudAlert {
  id: string;
  type: "duplicate_invoice" | "suspicious_vendor" | "abnormal_amount" | "unusual_pattern";
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  amount: number;
  date: string;
  status: "open" | "investigating" | "resolved";
}

export interface AIInsight {
  id: string;
  category: "savings" | "spending" | "investment" | "tax" | "risk" | "strategy";
  title: string;
  description: string;
  impact: string;
  priority: "low" | "medium" | "high";
  actionable: boolean;
}

export interface ForecastPoint {
  month: string;
  actual?: number;
  forecast: number;
  lower: number;
  upper: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

// ==========================================
// Mock Data
// ==========================================

export const mockUser: User = {
  id: "usr_001",
  name: "Arjun Sharma",
  email: "arjun@finpilot.ai",
  role: "ceo",
  company: "TechNova Solutions Pvt. Ltd.",
  plan: "enterprise",
};

export const mockAccounts: Account[] = [
  {
    id: "acc_001",
    name: "HDFC Savings",
    type: "savings",
    balance: 847520,
    institution: "HDFC Bank",
    lastSync: "2 min ago",
    connected: true,
  },
  {
    id: "acc_002",
    name: "ICICI Current",
    type: "current",
    balance: 2345000,
    institution: "ICICI Bank",
    lastSync: "5 min ago",
    connected: true,
  },
  {
    id: "acc_003",
    name: "SBI Credit Card",
    type: "credit_card",
    balance: -67890,
    institution: "SBI Cards",
    lastSync: "1 hr ago",
    connected: true,
  },
  {
    id: "acc_004",
    name: "Zerodha Portfolio",
    type: "investment",
    balance: 1523400,
    institution: "Zerodha",
    lastSync: "15 min ago",
    connected: true,
  },
  {
    id: "acc_005",
    name: "Paytm Wallet",
    type: "wallet",
    balance: 3200,
    institution: "Paytm",
    lastSync: "30 min ago",
    connected: true,
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: "txn_001",
    amount: 375000,
    type: "credit",
    category: "Salary",
    merchant: "TechNova Solutions Payroll",
    date: "2026-05-01",
    account: "HDFC Savings",
    status: "completed",
    aiCategory: "Primary Salary Income",
  },
  {
    id: "txn_002",
    amount: 45000,
    type: "credit",
    category: "Freelance",
    merchant: "Upwork Inc",
    date: "2026-05-03",
    account: "HDFC Savings",
    status: "completed",
    aiCategory: "Freelancing Income",
  },
  {
    id: "txn_003",
    amount: 2499,
    type: "debit",
    category: "Subscription",
    merchant: "Netflix",
    date: "2026-05-05",
    account: "SBI Credit Card",
    status: "completed",
    aiCategory: "Entertainment Subscription",
  },
  {
    id: "txn_004",
    amount: 12500,
    type: "debit",
    category: "Food",
    merchant: "Swiggy",
    date: "2026-05-06",
    account: "Paytm Wallet",
    status: "completed",
    aiCategory: "Food & Dining",
    flagged: true,
  },
  {
    id: "txn_005",
    amount: 89000,
    type: "debit",
    category: "Infrastructure",
    merchant: "Amazon Web Services",
    date: "2026-05-07",
    account: "ICICI Current",
    status: "completed",
    aiCategory: "Cloud Infrastructure",
  },
  {
    id: "txn_006",
    amount: 15000,
    type: "debit",
    category: "Transport",
    merchant: "Uber India",
    date: "2026-05-08",
    account: "HDFC Savings",
    status: "completed",
    aiCategory: "Transportation",
  },
  {
    id: "txn_007",
    amount: 200000,
    type: "credit",
    category: "Sales",
    merchant: "CloudSync Technologies",
    date: "2026-05-09",
    account: "ICICI Current",
    status: "completed",
    aiCategory: "Service Revenue",
  },
  {
    id: "txn_008",
    amount: 34500,
    type: "debit",
    category: "Shopping",
    merchant: "Amazon India",
    date: "2026-05-10",
    account: "SBI Credit Card",
    status: "pending",
    aiCategory: "Electronics & Gadgets",
  },
  {
    id: "txn_009",
    amount: 8750,
    type: "debit",
    category: "Healthcare",
    merchant: "Apollo Pharmacy",
    date: "2026-05-11",
    account: "HDFC Savings",
    status: "completed",
    aiCategory: "Healthcare & Medical",
  },
  {
    id: "txn_010",
    amount: 150000,
    type: "debit",
    category: "Investment",
    merchant: "Zerodha MF",
    date: "2026-05-12",
    account: "HDFC Savings",
    status: "completed",
    aiCategory: "Mutual Fund Investment",
  },
  {
    id: "txn_011",
    amount: 25000,
    type: "debit",
    category: "Bills",
    merchant: "Tata Power",
    date: "2026-05-12",
    account: "HDFC Savings",
    status: "completed",
    aiCategory: "Utility Bills",
  },
  {
    id: "txn_012",
    amount: 550000,
    type: "credit",
    category: "Sales",
    merchant: "DataVerse Analytics",
    date: "2026-05-14",
    account: "ICICI Current",
    status: "completed",
    aiCategory: "Product Sales Revenue",
  },
];

export const mockLoans: Loan[] = [
  {
    id: "loan_001",
    name: "Home Loan - HDFC",
    type: "home",
    principal: 7500000,
    remaining: 5234000,
    rate: 8.5,
    emi: 72500,
    nextDue: "2026-06-05",
    status: "active",
  },
  {
    id: "loan_002",
    name: "Car Loan - ICICI",
    type: "car",
    principal: 1200000,
    remaining: 456000,
    rate: 9.2,
    emi: 24800,
    nextDue: "2026-06-01",
    status: "active",
  },
  {
    id: "loan_003",
    name: "Business Loan - SBI",
    type: "business",
    principal: 5000000,
    remaining: 3200000,
    rate: 11.5,
    emi: 115000,
    nextDue: "2026-06-10",
    status: "active",
  },
];

export const mockTaxEstimate: TaxEstimate = {
  totalIncome: 4500000,
  taxableIncome: 3850000,
  deductions: [
    { name: "Section 80C (PPF, ELSS)", amount: 150000 },
    { name: "Section 80D (Health Insurance)", amount: 75000 },
    { name: "HRA Exemption", amount: 240000 },
    { name: "Standard Deduction", amount: 50000 },
    { name: "NPS (80CCD)", amount: 50000 },
    { name: "Home Loan Interest (24b)", amount: 200000 },
  ],
  estimatedTax: 682500,
  regime: "old",
  savings: 195000,
};

export const mockFraudAlerts: FraudAlert[] = [
  {
    id: "fraud_001",
    type: "abnormal_amount",
    severity: "high",
    description: "Unusual spending spike: ₹12,500 at Swiggy in single day (3x average)",
    amount: 12500,
    date: "2026-05-06",
    status: "investigating",
  },
  {
    id: "fraud_002",
    type: "duplicate_invoice",
    severity: "critical",
    description: "Duplicate vendor payment detected: CloudSync Technologies billed twice",
    amount: 200000,
    date: "2026-05-09",
    status: "open",
  },
  {
    id: "fraud_003",
    type: "suspicious_vendor",
    severity: "medium",
    description: "New vendor with similar name to existing: 'Amaz0n Web Services'",
    amount: 45000,
    date: "2026-05-08",
    status: "open",
  },
  {
    id: "fraud_004",
    type: "unusual_pattern",
    severity: "low",
    description: "Multiple small transactions (₹99-₹499) from unknown UPI IDs in last 2 hours",
    amount: 2340,
    date: "2026-05-11",
    status: "resolved",
  },
];

export const mockInsights: AIInsight[] = [
  {
    id: "ins_001",
    category: "spending",
    title: "Food Spending Alert",
    description:
      "Your food expenses increased 34% this month. Swiggy orders alone account for ₹12,500. Consider meal planning to reduce costs.",
    impact: "Save ₹8,000/month",
    priority: "high",
    actionable: true,
  },
  {
    id: "ins_002",
    category: "tax",
    title: "Tax Optimization Opportunity",
    description:
      "You have ₹85,000 unused in Section 80C limit. Investing in ELSS before March could save ₹26,520 in taxes.",
    impact: "Save ₹26,520 in tax",
    priority: "high",
    actionable: true,
  },
  {
    id: "ins_003",
    category: "investment",
    title: "Portfolio Rebalancing",
    description:
      "Your equity allocation is at 78%, above your target of 65%. Consider shifting ₹2L to debt funds for better risk management.",
    impact: "Reduce risk by 15%",
    priority: "medium",
    actionable: true,
  },
  {
    id: "ins_004",
    category: "strategy",
    title: "Revenue Growth Trend",
    description:
      "Service revenue grew 22% QoQ. Marketing spend increased 35% but conversion improved only 3%. Recommend optimizing ad spend.",
    impact: "Improve ROI by 18%",
    priority: "high",
    actionable: true,
  },
  {
    id: "ins_005",
    category: "risk",
    title: "Cash Flow Warning",
    description:
      "At current burn rate, operating cash will be depleted by August 2026. Recommend reducing discretionary spending by 20%.",
    impact: "Extend runway by 3 months",
    priority: "high",
    actionable: true,
  },
  {
    id: "ins_006",
    category: "savings",
    title: "Emergency Fund Gap",
    description:
      "Your emergency fund covers only 2.3 months of expenses. Target is 6 months. Automate ₹25,000/month transfer to build reserves.",
    impact: "Reach 6-month target by Dec 2026",
    priority: "medium",
    actionable: true,
  },
];

export const mockRevenueData = [
  { month: "Jan", revenue: 1250000, expenses: 890000, profit: 360000 },
  { month: "Feb", revenue: 1380000, expenses: 920000, profit: 460000 },
  { month: "Mar", revenue: 1420000, expenses: 870000, profit: 550000 },
  { month: "Apr", revenue: 1650000, expenses: 980000, profit: 670000 },
  { month: "May", revenue: 1780000, expenses: 1050000, profit: 730000 },
  { month: "Jun", revenue: 1920000, expenses: 1100000, profit: 820000 },
  { month: "Jul", revenue: 2050000, expenses: 1150000, profit: 900000 },
  { month: "Aug", revenue: 2200000, expenses: 1200000, profit: 1000000 },
  { month: "Sep", revenue: 2380000, expenses: 1280000, profit: 1100000 },
  { month: "Oct", revenue: 2500000, expenses: 1350000, profit: 1150000 },
  { month: "Nov", revenue: 2650000, expenses: 1400000, profit: 1250000 },
  { month: "Dec", revenue: 2800000, expenses: 1450000, profit: 1350000 },
];

export const mockExpenseBreakdown = [
  { category: "Infrastructure", amount: 267000, percentage: 25.4, color: "#4361ee" },
  { category: "Payroll", amount: 315000, percentage: 30.0, color: "#06d6a0" },
  { category: "Marketing", amount: 147000, percentage: 14.0, color: "#f59e0b" },
  { category: "Operations", amount: 105000, percentage: 10.0, color: "#7c3aed" },
  { category: "Food & Travel", amount: 73500, percentage: 7.0, color: "#f43f5e" },
  { category: "Subscriptions", amount: 42000, percentage: 4.0, color: "#0ea5e9" },
  { category: "Others", amount: 100500, percentage: 9.6, color: "#64748b" },
];

export const mockForecastData: ForecastPoint[] = [
  { month: "Jan 26", actual: 1250000, forecast: 1250000, lower: 1100000, upper: 1400000 },
  { month: "Feb 26", actual: 1380000, forecast: 1350000, lower: 1180000, upper: 1520000 },
  { month: "Mar 26", actual: 1420000, forecast: 1450000, lower: 1260000, upper: 1640000 },
  { month: "Apr 26", actual: 1650000, forecast: 1580000, lower: 1370000, upper: 1790000 },
  { month: "May 26", actual: 1780000, forecast: 1720000, lower: 1490000, upper: 1950000 },
  { month: "Jun 26", forecast: 1890000, lower: 1620000, upper: 2160000 },
  { month: "Jul 26", forecast: 2060000, lower: 1750000, upper: 2370000 },
  { month: "Aug 26", forecast: 2240000, lower: 1890000, upper: 2590000 },
  { month: "Sep 26", forecast: 2430000, lower: 2030000, upper: 2830000 },
  { month: "Oct 26", forecast: 2640000, lower: 2190000, upper: 3090000 },
  { month: "Nov 26", forecast: 2860000, lower: 2350000, upper: 3370000 },
  { month: "Dec 26", forecast: 3100000, lower: 2530000, upper: 3670000 },
];

export const mockCashFlowData = [
  { month: "Jan", inflow: 1450000, outflow: 1090000 },
  { month: "Feb", inflow: 1580000, outflow: 1120000 },
  { month: "Mar", inflow: 1620000, outflow: 1070000 },
  { month: "Apr", inflow: 1850000, outflow: 1180000 },
  { month: "May", inflow: 1980000, outflow: 1250000 },
  { month: "Jun", inflow: 2120000, outflow: 1300000 },
];

export const mockIncomeSourcesData = [
  { source: "Primary Salary", amount: 375000, percentage: 32.6, trend: "stable" as const },
  { source: "Service Revenue", amount: 400000, percentage: 34.8, trend: "up" as const },
  { source: "Product Sales", amount: 250000, percentage: 21.7, trend: "up" as const },
  { source: "Freelancing", amount: 75000, percentage: 6.5, trend: "down" as const },
  { source: "Investment Returns", amount: 50000, percentage: 4.4, trend: "up" as const },
];

export const mockFinancialHealth = {
  score: 78,
  grade: "B+",
  factors: [
    { name: "Income Stability", score: 92, status: "excellent" as const },
    { name: "Debt-to-Income", score: 68, status: "good" as const },
    { name: "Savings Rate", score: 55, status: "fair" as const },
    { name: "Investment Diversity", score: 82, status: "good" as const },
    { name: "Emergency Fund", score: 45, status: "needs_attention" as const },
    { name: "Tax Efficiency", score: 73, status: "good" as const },
  ],
};

// Helper functions
export function formatCurrency(amount: number): string {
  const absAmount = Math.abs(amount);
  if (absAmount >= 10000000) {
    return `₹${(absAmount / 10000000).toFixed(2)} Cr`;
  } else if (absAmount >= 100000) {
    return `₹${(absAmount / 100000).toFixed(2)} L`;
  } else {
    return `₹${absAmount.toLocaleString("en-IN")}`;
  }
}

export function formatCurrencyShort(amount: number): string {
  const absAmount = Math.abs(amount);
  if (absAmount >= 10000000) return `₹${(absAmount / 10000000).toFixed(1)}Cr`;
  if (absAmount >= 100000) return `₹${(absAmount / 100000).toFixed(1)}L`;
  if (absAmount >= 1000) return `₹${(absAmount / 1000).toFixed(1)}K`;
  return `₹${absAmount}`;
}
