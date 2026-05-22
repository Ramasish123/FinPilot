/**
 * FinPilot AI — Backend API Server
 * Express.js REST API with JWT authentication
 */

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || "finpilot-ai-secret-key-2026";

// ==========================================
// Middleware
// ==========================================

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
  message: { error: "Too many requests, please try again later" },
});
app.use("/api/", limiter);

// ==========================================
// In-Memory Data Store
// ==========================================

const users = [
  {
    id: "usr_001",
    name: "Arjun Sharma",
    email: "arjun@finpilot.ai",
    password: bcrypt.hashSync("FinPilot@2026", 10),
    role: "ceo",
    company: "TechNova Solutions Pvt. Ltd.",
    plan: "enterprise",
    createdAt: "2026-01-15",
  },
  {
    id: "usr_002",
    name: "Priya Verma",
    email: "priya@finpilot.ai",
    password: bcrypt.hashSync("Admin@2026", 10),
    role: "admin",
    company: "FinPilot AI",
    plan: "enterprise",
    createdAt: "2026-01-01",
  },
];

const transactions = [
  { id: "txn_001", userId: "usr_001", amount: 375000, type: "credit", category: "Salary", merchant: "TechNova Solutions Payroll", date: "2026-05-01", account: "HDFC Savings", status: "completed", aiCategory: "Primary Salary Income" },
  { id: "txn_002", userId: "usr_001", amount: 45000, type: "credit", category: "Freelance", merchant: "Upwork Inc", date: "2026-05-03", account: "HDFC Savings", status: "completed", aiCategory: "Freelancing Income" },
  { id: "txn_003", userId: "usr_001", amount: 2499, type: "debit", category: "Subscription", merchant: "Netflix", date: "2026-05-05", account: "SBI Credit Card", status: "completed", aiCategory: "Entertainment Subscription" },
  { id: "txn_004", userId: "usr_001", amount: 12500, type: "debit", category: "Food", merchant: "Swiggy", date: "2026-05-06", account: "Paytm Wallet", status: "completed", aiCategory: "Food & Dining", flagged: true },
  { id: "txn_005", userId: "usr_001", amount: 89000, type: "debit", category: "Infrastructure", merchant: "Amazon Web Services", date: "2026-05-07", account: "ICICI Current", status: "completed", aiCategory: "Cloud Infrastructure" },
  { id: "txn_006", userId: "usr_001", amount: 15000, type: "debit", category: "Transport", merchant: "Uber India", date: "2026-05-08", account: "HDFC Savings", status: "completed", aiCategory: "Transportation" },
  { id: "txn_007", userId: "usr_001", amount: 200000, type: "credit", category: "Sales", merchant: "CloudSync Technologies", date: "2026-05-09", account: "ICICI Current", status: "completed", aiCategory: "Service Revenue" },
  { id: "txn_008", userId: "usr_001", amount: 34500, type: "debit", category: "Shopping", merchant: "Amazon India", date: "2026-05-10", account: "SBI Credit Card", status: "pending", aiCategory: "Electronics & Gadgets" },
  { id: "txn_009", userId: "usr_001", amount: 8750, type: "debit", category: "Healthcare", merchant: "Apollo Pharmacy", date: "2026-05-11", account: "HDFC Savings", status: "completed", aiCategory: "Healthcare & Medical" },
  { id: "txn_010", userId: "usr_001", amount: 150000, type: "debit", category: "Investment", merchant: "Zerodha MF", date: "2026-05-12", account: "HDFC Savings", status: "completed", aiCategory: "Mutual Fund Investment" },
  { id: "txn_011", userId: "usr_001", amount: 550000, type: "credit", category: "Sales", merchant: "DataVerse Analytics", date: "2026-05-14", account: "ICICI Current", status: "completed", aiCategory: "Product Sales Revenue" },
];

const accounts = [
  { id: "acc_001", userId: "usr_001", name: "HDFC Savings", type: "savings", balance: 847520, institution: "HDFC Bank", connected: true, lastSync: "2 min ago" },
  { id: "acc_002", userId: "usr_001", name: "ICICI Current", type: "current", balance: 2345000, institution: "ICICI Bank", connected: true, lastSync: "5 min ago" },
  { id: "acc_003", userId: "usr_001", name: "SBI Credit Card", type: "credit_card", balance: -67890, institution: "SBI Cards", connected: true, lastSync: "10 min ago" },
  { id: "acc_004", userId: "usr_001", name: "Zerodha Portfolio", type: "investment", balance: 1523400, institution: "Zerodha", connected: true, lastSync: "1 hr ago" },
];

const loans = [
  { id: "loan_001", userId: "usr_001", name: "Home Loan - HDFC", type: "home", principal: 7500000, remaining: 5234000, rate: 8.5, emi: 72500, nextDue: "2026-06-05", status: "active" },
  { id: "loan_002", userId: "usr_001", name: "Car Loan - ICICI", type: "car", principal: 1200000, remaining: 456000, rate: 9.2, emi: 24800, nextDue: "2026-06-01", status: "active" },
  { id: "loan_003", userId: "usr_001", name: "Business Loan - SBI", type: "business", principal: 5000000, remaining: 3200000, rate: 11.5, emi: 115000, nextDue: "2026-06-10", status: "active" },
];

const expenses = [
  { id: "exp_001", userId: "usr_001", category: "Food & Dining", description: "Swiggy monthly total", amount: 12500, date: "2026-05-06", status: "tracked" },
  { id: "exp_002", userId: "usr_001", category: "Entertainment", description: "Netflix Subscription", amount: 2499, date: "2026-05-05", status: "tracked" },
  { id: "exp_003", userId: "usr_001", category: "Cloud Infrastructure", description: "AWS Hosting", amount: 89000, date: "2026-05-07", status: "tracked" },
  { id: "exp_004", userId: "usr_001", category: "Transportation", description: "Uber India rides", amount: 15000, date: "2026-05-08", status: "tracked" },
  { id: "exp_005", userId: "usr_001", category: "Shopping", description: "Amazon electronics", amount: 34500, date: "2026-05-10", status: "pending" },
  { id: "exp_006", userId: "usr_001", category: "Healthcare", description: "Apollo Pharmacy", amount: 8750, date: "2026-05-11", status: "tracked" },
];

const incomeEntries = [
  { id: "inc_001", userId: "usr_001", source: "Primary Salary", description: "TechNova Solutions Payroll", amount: 375000, date: "2026-05-01", recurring: true, status: "received" },
  { id: "inc_002", userId: "usr_001", source: "Freelance", description: "Upwork Inc — Web Development", amount: 45000, date: "2026-05-03", recurring: false, status: "received" },
  { id: "inc_003", userId: "usr_001", source: "Business Revenue", description: "CloudSync Technologies", amount: 200000, date: "2026-05-09", recurring: false, status: "received" },
  { id: "inc_004", userId: "usr_001", source: "Business Revenue", description: "DataVerse Analytics", amount: 550000, date: "2026-05-14", recurring: false, status: "received" },
];

const journalEntries = [
  { id: "JE001", userId: "usr_001", date: "2026-05-01", description: "Salary Payment Received", debitAccount: "Bank - HDFC", debitAmount: 375000, creditAccount: "Salary Income", creditAmount: 375000 },
  { id: "JE002", userId: "usr_001", date: "2026-05-05", description: "Netflix Subscription", debitAccount: "Entertainment Expense", debitAmount: 2499, creditAccount: "Credit Card - SBI", creditAmount: 2499 },
  { id: "JE003", userId: "usr_001", date: "2026-05-07", description: "AWS Cloud Hosting", debitAccount: "Infrastructure Expense", debitAmount: 89000, creditAccount: "Bank - ICICI", creditAmount: 89000 },
  { id: "JE004", userId: "usr_001", date: "2026-05-09", description: "Client Payment - CloudSync", debitAccount: "Bank - ICICI", debitAmount: 200000, creditAccount: "Service Revenue", creditAmount: 200000 },
  { id: "JE005", userId: "usr_001", date: "2026-05-12", description: "Mutual Fund Investment", debitAccount: "Investment - MF", debitAmount: 150000, creditAccount: "Bank - HDFC", creditAmount: 150000 },
];

const fraudAlerts = [
  { id: "fraud_001", userId: "usr_001", type: "abnormal_amount", severity: "high", description: "Unusual spending spike — ₹12,500 at Swiggy in a single day (3x your average)", amount: 12500, date: "2026-05-06", status: "investigating" },
  { id: "fraud_002", userId: "usr_001", type: "duplicate_invoice", severity: "critical", description: "Duplicate vendor payment detected — CloudSync Technologies billed twice for same service", amount: 200000, date: "2026-05-09", status: "open" },
  { id: "fraud_003", userId: "usr_001", type: "suspicious_vendor", severity: "medium", description: "New vendor 'DataVerse Analytics' has similar name to existing vendor. Possible phishing.", amount: 550000, date: "2026-05-14", status: "open" },
  { id: "fraud_004", userId: "usr_001", type: "round_amount", severity: "low", description: "Multiple round-figure transactions detected from same merchant category", amount: 150000, date: "2026-05-12", status: "resolved" },
];

const settings = {};

// ==========================================
// Auth Middleware
// ==========================================

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access token required" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid or expired token" });
    req.user = user;
    next();
  });
}

// ==========================================
// AUTH ROUTES
// ==========================================

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = users.find((u) => u.email === email);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    const { password: _, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password, role = "individual", company } = req.body;
    if (users.find((u) => u.email === email)) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: `usr_${uuidv4().slice(0, 8)}`,
      name,
      email,
      password: hashedPassword,
      role,
      company: company || "",
      plan: "free",
      createdAt: new Date().toISOString().split("T")[0],
    };

    users.push(newUser);
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ token, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ==========================================
// TRANSACTION ROUTES
// ==========================================

app.get("/api/transactions", authenticateToken, (req, res) => {
  const { category, type, status, limit = 50, offset = 0 } = req.query;
  let filtered = transactions.filter((t) => t.userId === req.user.id);

  if (category) filtered = filtered.filter((t) => t.category === category);
  if (type) filtered = filtered.filter((t) => t.type === type);
  if (status) filtered = filtered.filter((t) => t.status === status);

  const total = filtered.length;
  filtered = filtered.slice(Number(offset), Number(offset) + Number(limit));

  res.json({ transactions: filtered, total, offset: Number(offset), limit: Number(limit) });
});

app.post("/api/transactions", authenticateToken, (req, res) => {
  const { amount, type, category, merchant, date, account, status = "completed" } = req.body;
  const txn = {
    id: `txn_${uuidv4().slice(0, 8)}`,
    userId: req.user.id,
    amount: Number(amount),
    type,
    category,
    merchant,
    date: date || new Date().toISOString().split("T")[0],
    account: account || "HDFC Savings",
    status,
    aiCategory: category,
  };
  transactions.push(txn);
  res.status(201).json(txn);
});

// ==========================================
// ACCOUNT ROUTES
// ==========================================

app.get("/api/accounts", authenticateToken, (req, res) => {
  const userAccounts = accounts.filter((a) => a.userId === req.user.id);
  const totalBalance = userAccounts.reduce((s, a) => s + a.balance, 0);
  res.json({ accounts: userAccounts, totalBalance });
});

app.post("/api/accounts", authenticateToken, (req, res) => {
  const { institution, type, name, accountNumber } = req.body;
  const acc = {
    id: `acc_${uuidv4().slice(0, 8)}`,
    userId: req.user.id,
    name: name || `${institution} ${type.charAt(0).toUpperCase() + type.slice(1)}`,
    type,
    balance: Math.floor(Math.random() * 500000) + 10000,
    institution,
    connected: true,
    lastSync: "just now",
    accountNumber: accountNumber ? `****${accountNumber.slice(-4)}` : undefined,
  };
  accounts.push(acc);
  res.status(201).json(acc);
});

app.delete("/api/accounts/:id", authenticateToken, (req, res) => {
  const idx = accounts.findIndex((a) => a.id === req.params.id && a.userId === req.user.id);
  if (idx === -1) return res.status(404).json({ error: "Account not found" });
  accounts.splice(idx, 1);
  res.json({ success: true });
});

// ==========================================
// EXPENSE ROUTES
// ==========================================

app.get("/api/expenses", authenticateToken, (req, res) => {
  const userExpenses = expenses.filter((e) => e.userId === req.user.id);
  const total = userExpenses.reduce((s, e) => s + e.amount, 0);
  res.json({ expenses: userExpenses, total });
});

app.post("/api/expenses", authenticateToken, (req, res) => {
  const { category, description, amount, date } = req.body;
  const exp = {
    id: `exp_${uuidv4().slice(0, 8)}`,
    userId: req.user.id,
    category,
    description,
    amount: Number(amount),
    date: date || new Date().toISOString().split("T")[0],
    status: "tracked",
  };
  expenses.push(exp);
  res.status(201).json(exp);
});

// ==========================================
// INCOME ROUTES
// ==========================================

app.get("/api/income", authenticateToken, (req, res) => {
  const userIncome = incomeEntries.filter((i) => i.userId === req.user.id);
  const total = userIncome.reduce((s, i) => s + i.amount, 0);
  res.json({ income: userIncome, total });
});

app.post("/api/income", authenticateToken, (req, res) => {
  const { source, description, amount, date, recurring = false } = req.body;
  const inc = {
    id: `inc_${uuidv4().slice(0, 8)}`,
    userId: req.user.id,
    source,
    description,
    amount: Number(amount),
    date: date || new Date().toISOString().split("T")[0],
    recurring,
    status: "received",
  };
  incomeEntries.push(inc);
  res.status(201).json(inc);
});

// ==========================================
// LOAN ROUTES
// ==========================================

app.get("/api/loans", authenticateToken, (req, res) => {
  const userLoans = loans.filter((l) => l.userId === req.user.id);
  const totalEMI = userLoans.reduce((s, l) => s + l.emi, 0);
  const totalOutstanding = userLoans.reduce((s, l) => s + l.remaining, 0);
  res.json({ loans: userLoans, totalEMI, totalOutstanding });
});

app.post("/api/loans/apply", authenticateToken, (req, res) => {
  const { name, type, amount, rate, term } = req.body;
  const principal = Number(amount);
  const monthlyRate = Number(rate) / 100 / 12;
  const months = Number(term);
  const emi = Math.round((principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1));

  const loan = {
    id: `loan_${uuidv4().slice(0, 8)}`,
    userId: req.user.id,
    name: name || `${type.charAt(0).toUpperCase() + type.slice(1)} Loan`,
    type,
    principal,
    remaining: principal,
    rate: Number(rate),
    emi,
    nextDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    status: "active",
  };
  loans.push(loan);
  res.status(201).json(loan);
});

app.patch("/api/loans/:id/payment", authenticateToken, (req, res) => {
  const loan = loans.find((l) => l.id === req.params.id && l.userId === req.user.id);
  if (!loan) return res.status(404).json({ error: "Loan not found" });

  const paymentAmount = req.body.amount || loan.emi;
  loan.remaining = Math.max(0, loan.remaining - paymentAmount);
  if (loan.remaining === 0) loan.status = "paid";

  // Move next due date forward
  const nextDue = new Date(loan.nextDue);
  nextDue.setMonth(nextDue.getMonth() + 1);
  loan.nextDue = nextDue.toISOString().split("T")[0];

  res.json(loan);
});

// ==========================================
// ACCOUNTING ROUTES
// ==========================================

app.get("/api/accounting/entries", authenticateToken, (req, res) => {
  const userEntries = journalEntries.filter((e) => e.userId === req.user.id);
  res.json({ entries: userEntries });
});

app.post("/api/accounting/entries", authenticateToken, (req, res) => {
  const { date, description, debitAccount, debitAmount, creditAccount, creditAmount } = req.body;
  const entry = {
    id: `JE${String(journalEntries.length + 1).padStart(3, "0")}`,
    userId: req.user.id,
    date: date || new Date().toISOString().split("T")[0],
    description,
    debitAccount,
    debitAmount: Number(debitAmount),
    creditAccount,
    creditAmount: Number(creditAmount),
  };
  journalEntries.push(entry);
  res.status(201).json(entry);
});

// ==========================================
// FRAUD ROUTES
// ==========================================

app.get("/api/fraud/alerts", authenticateToken, (req, res) => {
  const userAlerts = fraudAlerts.filter((a) => a.userId === req.user.id);
  const riskScore = userAlerts.filter((a) => a.status !== "resolved").length > 2 ? 72 : 35;
  res.json({ alerts: userAlerts, riskScore });
});

app.patch("/api/fraud/alerts/:id", authenticateToken, (req, res) => {
  const alert = fraudAlerts.find((a) => a.id === req.params.id && a.userId === req.user.id);
  if (!alert) return res.status(404).json({ error: "Alert not found" });
  
  const { status } = req.body;
  if (status) alert.status = status;
  res.json(alert);
});

// ==========================================
// TAX ROUTES
// ==========================================

app.get("/api/tax/estimate", authenticateToken, (req, res) => {
  const totalIncome = 4500000;
  const deductions = [
    { name: "Section 80C (PPF, ELSS)", amount: 150000 },
    { name: "Section 80D (Health Insurance)", amount: 75000 },
    { name: "HRA Exemption", amount: 240000 },
    { name: "Standard Deduction", amount: 50000 },
    { name: "NPS (80CCD)", amount: 50000 },
    { name: "Home Loan Interest (24b)", amount: 200000 },
  ];
  const totalDeductions = deductions.reduce((s, d) => s + d.amount, 0);
  const taxableIncome = totalIncome - totalDeductions;

  let tax = 0;
  if (taxableIncome > 1500000) tax += (taxableIncome - 1500000) * 0.3;
  if (taxableIncome > 1250000) tax += Math.min(taxableIncome - 1250000, 250000) * 0.25;
  if (taxableIncome > 1000000) tax += Math.min(taxableIncome - 1000000, 250000) * 0.2;
  if (taxableIncome > 750000) tax += Math.min(taxableIncome - 750000, 250000) * 0.15;
  if (taxableIncome > 500000) tax += Math.min(taxableIncome - 500000, 250000) * 0.1;
  if (taxableIncome > 300000) tax += Math.min(taxableIncome - 300000, 200000) * 0.05;

  res.json({
    totalIncome,
    taxableIncome,
    deductions,
    estimatedTax: Math.round(tax),
    regime: "old",
    savings: totalDeductions,
  });
});

// ==========================================
// AI ROUTES
// ==========================================

app.get("/api/ai/insights", authenticateToken, (req, res) => {
  res.json({
    insights: [
      { id: "ins_001", category: "spending", title: "Food Spending Alert", description: "Food expenses increased 34% this month", impact: "Save ₹8,000/month", priority: "high" },
      { id: "ins_002", category: "tax", title: "Tax Optimization", description: "₹85,000 unused in Section 80C", impact: "Save ₹26,520", priority: "high" },
      { id: "ins_003", category: "investment", title: "Portfolio Rebalancing", description: "Equity allocation at 78%, above target", impact: "Reduce risk 15%", priority: "medium" },
      { id: "ins_004", category: "strategy", title: "Revenue Growth", description: "Marketing ROI declining despite spend increase", impact: "Improve ROI 18%", priority: "high" },
    ],
  });
});

app.post("/api/ai/chat", authenticateToken, (req, res) => {
  const { message } = req.body;
  const responses = {
    default: "I've analyzed your financial data. Your current financial health score is 78/100 (B+). Your income is stable and growing. I recommend focusing on building your emergency fund and optimizing tax deductions. Would you like specific recommendations?",
  };

  res.json({
    response: responses.default,
    sources: ["transaction_db", "tax_records", "investment_portfolio"],
    confidence: 0.92,
  });
});

app.get("/api/ai/forecast", authenticateToken, (req, res) => {
  res.json({
    revenue: { current: 1780000, projected: 3100000, confidence: 0.87 },
    expenses: { current: 1050000, projected: 1150000, confidence: 0.91 },
    savings: { current: 700000, projected: 940000, confidence: 0.84 },
    bankruptcyRisk: 0.023,
    growthRate: 0.087,
  });
});

// ==========================================
// REPORTS ROUTES
// ==========================================

app.get("/api/reports", authenticateToken, (req, res) => {
  res.json({
    reports: [
      { id: "rpt_001", name: "Profit & Loss Statement", type: "financial", period: "May 2026", status: "ready" },
      { id: "rpt_002", name: "Balance Sheet", type: "financial", period: "Q1 FY26", status: "ready" },
      { id: "rpt_003", name: "Cash Flow Statement", type: "financial", period: "May 2026", status: "ready" },
      { id: "rpt_004", name: "Tax Filing Report", type: "tax", period: "FY 2025-26", status: "draft" },
    ],
  });
});

// ==========================================
// SETTINGS ROUTES
// ==========================================

app.get("/api/settings/profile", authenticateToken, (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  const { password: _, ...profile } = user;
  res.json(profile);
});

app.put("/api/settings/profile", authenticateToken, (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  const { name, email, company } = req.body;
  if (name) user.name = name;
  if (email) user.email = email;
  if (company) user.company = company;

  const { password: _, ...profile } = user;
  res.json(profile);
});

app.put("/api/settings/password", authenticateToken, async (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  const { currentPassword, newPassword } = req.body;
  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) return res.status(400).json({ error: "Current password is incorrect" });

  user.password = await bcrypt.hash(newPassword, 10);
  res.json({ success: true, message: "Password updated successfully" });
});

// ==========================================
// EXPORT ROUTES
// ==========================================

app.get("/api/export/:type", authenticateToken, (req, res) => {
  const { type } = req.params;
  let csv = "";

  switch (type) {
    case "transactions": {
      const data = transactions.filter((t) => t.userId === req.user.id);
      csv = "Date,Merchant,Category,Type,Amount,Account,Status\n";
      data.forEach((t) => {
        csv += `${t.date},"${t.merchant}",${t.category},${t.type},${t.amount},${t.account},${t.status}\n`;
      });
      break;
    }
    case "expenses": {
      const data = expenses.filter((e) => e.userId === req.user.id);
      csv = "Date,Category,Description,Amount,Status\n";
      data.forEach((e) => {
        csv += `${e.date},${e.category},"${e.description}",${e.amount},${e.status}\n`;
      });
      break;
    }
    case "income": {
      const data = incomeEntries.filter((i) => i.userId === req.user.id);
      csv = "Date,Source,Description,Amount,Recurring,Status\n";
      data.forEach((i) => {
        csv += `${i.date},${i.source},"${i.description}",${i.amount},${i.recurring},${i.status}\n`;
      });
      break;
    }
    case "accounting": {
      const data = journalEntries.filter((j) => j.userId === req.user.id);
      csv = "ID,Date,Description,Debit Account,Debit Amount,Credit Account,Credit Amount\n";
      data.forEach((j) => {
        csv += `${j.id},${j.date},"${j.description}",${j.debitAccount},${j.debitAmount},${j.creditAccount},${j.creditAmount}\n`;
      });
      break;
    }
    default:
      return res.status(400).json({ error: "Invalid export type" });
  }

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename=${type}_export.csv`);
  res.send(csv);
});

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    version: "1.0.0",
    services: { api: "online", aiEngine: "online", database: "online", cache: "online" },
    uptime: process.uptime(),
  });
});

app.get("/api", (req, res) => {
  res.json({
    name: "FinPilot AI API",
    version: "1.0.0",
    description: "AI-Powered Financial Operating System",
  });
});

// ==========================================
// Start Server
// ==========================================

app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════════╗
  ║         FinPilot AI — Backend API            ║
  ║         Running on port ${PORT}                ║
  ║         http://localhost:${PORT}/api             ║
  ╚══════════════════════════════════════════════╝
  `);
});
