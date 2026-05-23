# FinPilot AI 🚀

### AI-Powered Financial Operating System

> Your AI Chartered Accountant, CFO, Auditor, Tax Consultant & Financial Strategist — all in one platform.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Express.js](https://img.shields.io/badge/Express.js-4.18-green?style=for-the-badge&logo=express)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-teal?style=for-the-badge&logo=fastapi)
![Docker](https://img.shields.io/badge/Docker-Ready-blue?style=for-the-badge&logo=docker)

---

## 🌟 Features

### 🧠 Core AI Agents
FinPilot's intelligence is powered by 6 specialized AI agents working together:
- **Income Agent**: Auto-detects and classifies salary, freelance, business, rental, and investment income streams.
- **Expense Agent**: Categorizes expenses automatically and provides emotional/wasteful spending alerts to help users save.
- **Tax Agent**: Performs real-time tax estimation, slab analysis, and offers strategies for maximum deduction optimization under both old and new regimes.
- **Audit Agent**: Acts as an automated auditor to detect fraud, duplicate invoices, and suspicious spending patterns.
- **Forecast Agent**: Uses advanced time-series forecasting to predict future revenue, expenses, savings trajectories, and potential bankruptcy risks.
- **Strategy Agent**: Delivers CFO-level strategic insights on pricing, hiring, and expansion for businesses, and personalized wealth strategies for individuals.

### 🏢 Platform Modules
A complete suite of financial tools built for scale and accuracy:
- **Authentication & Security**: Role-based access control (7 distinct roles), JWT/OAuth2 login, and AES-256 encryption.
- **Bank Integration**: Securely connect savings, current accounts, credit cards, and digital wallets.
- **Transaction Engine**: Process transactions with high accuracy using NLP classification for auto-categorization.
- **Accounting Engine**: Professional-grade double-entry accounting featuring automated journal entries, ledger, trial balance, and P&L.
- **Taxation Engine**: Track deductions, simulate tax liabilities, and get automated filing reminders.
- **Loan & EMI Engine**: Track debt, simulate prepayment scenarios, and evaluate refinancing options.
- **Fraud Detection**: Proactive anomaly detection system with risk scoring for all transactions.
- **AI Forecasting**: Prophet + LSTM-based time-series predictions for hyper-accurate financial modeling.
- **AI CFO Strategy**: Automated generation of strategic recommendations for both individuals and corporations.
- **AI Chatbot**: A RAG-powered conversational finance assistant that can answer queries about your financial data.
- **Report Generation**: Export comprehensive P&L, Balance Sheet, Cash Flow, and Tax reports in multiple formats.
- **ERP Integration**: Seamlessly connect with enterprise software like SAP, Tally, Zoho, and QuickBooks.
- **OCR Pipeline**: Extract line-item data from invoices, receipts, and bank statements automatically.

### 🎨 Design & Experience
- **Dark Mode Toggle**: Seamlessly switch between light and premium dark interfaces based on user preference.
- **Glassmorphism UI**: Modern frosted glass card effects and layered interfaces.
- **Dynamic Visualizations**: Interactive Recharts for intuitive financial data analysis.
- **Fluid Animations**: Smooth micro-animations powered by Framer Motion to enhance the user experience.

---

## 🏗️ Architecture

```
finpilot-ai/
├── frontend/              # Next.js 15 + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── app/           # Pages & layout
│   │   ├── components/    # UI components
│   │   │   ├── views/     # Module views (Dashboard, Tax, etc.)
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TopBar.tsx
│   │   │   └── AuthPage.tsx
│   │   └── lib/           # Data, types, utilities
│   ├── Dockerfile
│   └── package.json
│
├── backend/               # Express.js REST API
│   ├── src/
│   │   └── index.js       # API server with all routes
│   ├── Dockerfile
│   └── package.json
│
├── ai-services/           # FastAPI AI Microservice
│   ├── main.py            # AI agents & ML endpoints
│   ├── requirements.txt
│   └── Dockerfile
│
├── database/
│   └── init.sql           # PostgreSQL schema (14 tables)
│
├── docker-compose.yml     # Full stack orchestration
├── .env.example           # Environment configuration
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10.20
- Docker & Docker Compose (optional)

### One-Click Startup

```bash
./run.sh
```

This starts PostgreSQL, MongoDB, Redis, AI services, backend, and frontend sequentially with Docker Compose.

### Option 1: Run Locally

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend (new terminal)
cd backend
npm install
npm run dev

# AI Services (new terminal)
cd ai-services
pip install -r requirements.txt
uvicorn main:app --reload
```

### Option 2: Docker Compose

```bash
docker-compose up --build
```

### Access
| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5050/api |
| AI Services | http://localhost:8000/docs |
| PostgreSQL | localhost:5432 |
| MongoDB | localhost:27017 |
| Redis | localhost:6379 |

### Demo Credentials
```
Email: arjun@finpilot.ai
Password: FinPilot@2026
```

---

## 📡 API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with email/password |
| POST | `/api/auth/signup` | Register new user |

### Finance
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | List transactions with filters |
| GET | `/api/accounts` | Connected accounts & balances |
| GET | `/api/loans` | Loans & EMI details |
| GET | `/api/tax/estimate` | AI tax estimation |
| GET | `/api/fraud/alerts` | Fraud detection alerts |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/chat` | Conversational AI assistant |
| GET | `/api/ai/insights` | AI-generated insights |
| GET | `/api/ai/forecast` | Financial forecasting |
| POST | `/api/ai/classify` | Transaction classification |
| POST | `/api/ai/fraud-check` | Real-time fraud check |
| GET | `/api/ai/tax-optimize` | Tax optimization suggestions |
| GET | `/api/ai/strategy` | CFO strategy insights |

---

## 🗃️ Database Schema

14 tables covering:
- `users` — Multi-role authentication
- `accounts` — Bank/wallet connections
- `transactions` — Financial transactions with AI metadata
- `loans` — Debt tracking
- `tax_records` — Tax filing history
- `fraud_alerts` — Anomaly detection
- `ai_insights` — AI-generated recommendations
- `forecasts` — Prediction data
- `invoices` — OCR-extracted documents
- `journal_entries` — Double-entry accounting
- `audit_logs` — Complete audit trail

---

## 🛡️ Security

- AES-256 encryption for sensitive data
- JWT with refresh tokens
- Role-based access control (RBAC)
- API rate limiting
- Helmet.js security headers
- CORS configuration
- Complete audit logging
- Secure bank token storage

---

## 🎨 Design

- **Dark Mode** — Premium dark interface
- **Glassmorphism** — Frosted glass card effects
- **Micro-animations** — Framer Motion throughout
- **Responsive** — Mobile-first design
- **Recharts** — Interactive financial visualizations
- **Custom Design System** — Purpose-built tokens & components

---

## 📋 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React, TypeScript, Tailwind CSS, Framer Motion, Recharts |
| Backend | Node.js, Express.js |
| AI Services | Python, FastAPI, LangChain, OpenAI |
| Databases | PostgreSQL, MongoDB, Redis |
| Auth | JWT, OAuth2, bcrypt |
| DevOps | Docker, Docker Compose |
| Security | Helmet, CORS, Rate Limiting, AES-256 |

---

## 📄 License

MIT License — Built for Innofusion 3.0 Hackathon

---

<div align="center">
  <b>FinPilot AI</b> — The AI Financial Operating System<br/>
  <sub>ChatGPT + SAP + QuickBooks + AI CFO + AI Accountant</sub>
</div>
