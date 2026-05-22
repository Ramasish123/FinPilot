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
  max: 100,
  message: { error: "Too many requests, please try again later" },
});
app.use("/api/", limiter);

// ==========================================
// In-Memory Data Store (replace with DB)
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
  { id: "acc_001", userId: "usr_001", name: "HDFC Savings", type: "savings", balance: 847520, institution: "HDFC Bank", connected: true },
  { id: "acc_002", userId: "usr_001", name: "ICICI Current", type: "current", balance: 2345000, institution: "ICICI Bank", connected: true },
  { id: "acc_003", userId: "usr_001", name: "SBI Credit Card", type: "credit_card", balance: -67890, institution: "SBI Cards", connected: true },
  { id: "acc_004", userId: "usr_001", name: "Zerodha Portfolio", type: "investment", balance: 1523400, institution: "Zerodha", connected: true },
];

const loans = [
  { id: "loan_001", userId: "usr_001", name: "Home Loan - HDFC", type: "home", principal: 7500000, remaining: 5234000, rate: 8.5, emi: 72500, nextDue: "2026-06-05", status: "active" },
  { id: "loan_002", userId: "usr_001", name: "Car Loan - ICICI", type: "car", principal: 1200000, remaining: 456000, rate: 9.2, emi: 24800, nextDue: "2026-06-01", status: "active" },
  { id: "loan_003", userId: "usr_001", name: "Business Loan - SBI", type: "business", principal: 5000000, remaining: 3200000, rate: 11.5, emi: 115000, nextDue: "2026-06-10", status: "active" },
];

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

function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
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

    const refreshToken = jwt.sign(
      { id: user.id },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: _, ...userWithoutPassword } = user;
    res.json({ token, refreshToken, user: userWithoutPassword });
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

app.get("/api/transactions/:id", authenticateToken, (req, res) => {
  const txn = transactions.find((t) => t.id === req.params.id && t.userId === req.user.id);
  if (!txn) return res.status(404).json({ error: "Transaction not found" });
  res.json(txn);
});

// ==========================================
// ACCOUNT ROUTES
// ==========================================

app.get("/api/accounts", authenticateToken, (req, res) => {
  const userAccounts = accounts.filter((a) => a.userId === req.user.id);
  const totalBalance = userAccounts.reduce((s, a) => s + a.balance, 0);
  res.json({ accounts: userAccounts, totalBalance });
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

  // Simplified old regime calculation
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
// FRAUD ROUTES
// ==========================================

app.get("/api/fraud/alerts", authenticateToken, (req, res) => {
  res.json({
    alerts: [
      { id: "fraud_001", type: "abnormal_amount", severity: "high", description: "Unusual spending spike at Swiggy", amount: 12500, date: "2026-05-06", status: "investigating" },
      { id: "fraud_002", type: "duplicate_invoice", severity: "critical", description: "Duplicate vendor payment detected", amount: 200000, date: "2026-05-09", status: "open" },
      { id: "fraud_003", type: "suspicious_vendor", severity: "medium", description: "New vendor with similar name detected", amount: 45000, date: "2026-05-08", status: "open" },
    ],
    riskScore: 72,
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
  // In production, this would call OpenAI/LangChain
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
// HEALTH CHECK
// ==========================================

app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    version: "1.0.0",
    services: {
      api: "online",
      aiEngine: "online",
      database: "online",
      cache: "online",
    },
    uptime: process.uptime(),
  });
});

// ==========================================
// API Documentation
// ==========================================

app.get("/api", (req, res) => {
  res.json({
    name: "FinPilot AI API",
    version: "1.0.0",
    description: "AI-Powered Financial Operating System",
    endpoints: {
      auth: {
        "POST /api/auth/login": "Login with email/password",
        "POST /api/auth/signup": "Register new user",
      },
      transactions: {
        "GET /api/transactions": "List transactions (auth required)",
        "GET /api/transactions/:id": "Get transaction details",
      },
      accounts: {
        "GET /api/accounts": "List connected accounts",
      },
      loans: {
        "GET /api/loans": "List loans & EMI",
      },
      tax: {
        "GET /api/tax/estimate": "Get tax estimation",
      },
      fraud: {
        "GET /api/fraud/alerts": "Get fraud alerts",
      },
      ai: {
        "GET /api/ai/insights": "Get AI insights",
        "POST /api/ai/chat": "Chat with AI assistant",
        "GET /api/ai/forecast": "Get financial forecasts",
      },
      reports: {
        "GET /api/reports": "List generated reports",
      },
    },
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
