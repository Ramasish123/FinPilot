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

### Core AI Agents
| Agent | Function |
|-------|----------|
| 🧠 **Income Agent** | Auto-detects salary, freelance, business, rental & investment income |
| 💰 **Expense Agent** | AI categorization with emotional/wasteful spending alerts |
| 📊 **Tax Agent** | Tax estimation, slab analysis, deduction optimization |
| 🔍 **Audit Agent** | Fraud detection, duplicate invoices, suspicious patterns |
| 📈 **Forecast Agent** | Revenue, expense, savings & bankruptcy risk prediction |
| 🎯 **Strategy Agent** | CFO-level insights, pricing, hiring & expansion analysis |

### Platform Modules
- ✅ **Authentication** — JWT, OAuth2, Role-based access (7 roles)
- ✅ **Bank Integration** — Connect savings, current, credit cards, wallets
- ✅ **Transaction Engine** — AI-categorized with NLP classification
- ✅ **Accounting Engine** — Double-entry with journal, ledger, trial balance, P&L
- ✅ **Taxation Engine** — Old/New regime, deduction tracking, filing reminders
- ✅ **Loan & EMI Engine** — Debt tracking, prepayment simulation, refinancing
- ✅ **Fraud Detection** — Anomaly detection with risk scoring
- ✅ **AI Forecasting** — Prophet + LSTM time-series predictions
- ✅ **AI CFO Strategy** — Strategic recommendations for individuals & corporations
- ✅ **AI Chatbot** — RAG-powered conversational finance assistant
- ✅ **Report Generation** — P&L, Balance Sheet, Cash Flow, Tax reports
- ✅ **ERP Integration** — SAP, Tally, Zoho, QuickBooks connectors
- ✅ **OCR Pipeline** — Invoice, receipt, bank statement extraction

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
