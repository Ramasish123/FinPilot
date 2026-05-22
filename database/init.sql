-- ============================================
-- FinPilot AI — Database Schema
-- PostgreSQL Initialization Script
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- Users Table
-- ============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'individual'
        CHECK (role IN ('individual', 'accountant', 'employee', 'finance_manager', 'auditor', 'ceo', 'admin')),
    company VARCHAR(255),
    plan VARCHAR(20) NOT NULL DEFAULT 'free'
        CHECK (plan IN ('free', 'pro', 'enterprise')),
    phone VARCHAR(20),
    avatar_url TEXT,
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret VARCHAR(255),
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================
-- Accounts Table (Bank, Credit Card, Wallet)
-- ============================================
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL
        CHECK (type IN ('savings', 'current', 'credit_card', 'investment', 'wallet', 'loan')),
    institution VARCHAR(255) NOT NULL,
    account_number_encrypted TEXT,
    balance DECIMAL(18, 2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'INR',
    connected BOOLEAN DEFAULT FALSE,
    access_token_encrypted TEXT,
    last_synced TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_accounts_user ON accounts(user_id);
CREATE INDEX idx_accounts_type ON accounts(type);

-- ============================================
-- Transactions Table
-- ============================================
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_id UUID REFERENCES accounts(id),
    amount DECIMAL(18, 2) NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('credit', 'debit')),
    category VARCHAR(100),
    ai_category VARCHAR(100),
    merchant VARCHAR(255),
    description TEXT,
    date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'completed'
        CHECK (status IN ('completed', 'pending', 'failed', 'cancelled')),
    reference_id VARCHAR(255),
    is_recurring BOOLEAN DEFAULT FALSE,
    flagged BOOLEAN DEFAULT FALSE,
    flag_reason TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_category ON transactions(category);
CREATE INDEX idx_transactions_merchant ON transactions(merchant);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_flagged ON transactions(flagged) WHERE flagged = TRUE;

-- ============================================
-- Loans Table
-- ============================================
CREATE TABLE loans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL
        CHECK (type IN ('home', 'car', 'student', 'business', 'personal', 'credit_card')),
    lender VARCHAR(255),
    principal DECIMAL(18, 2) NOT NULL,
    remaining DECIMAL(18, 2) NOT NULL,
    interest_rate DECIMAL(5, 2) NOT NULL,
    emi DECIMAL(18, 2) NOT NULL,
    tenure_months INTEGER,
    start_date DATE,
    next_due_date DATE,
    status VARCHAR(20) DEFAULT 'active'
        CHECK (status IN ('active', 'closed', 'defaulted', 'restructured')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_loans_user ON loans(user_id);
CREATE INDEX idx_loans_status ON loans(status);

-- ============================================
-- Tax Records Table
-- ============================================
CREATE TABLE tax_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    fiscal_year VARCHAR(10) NOT NULL,
    total_income DECIMAL(18, 2),
    taxable_income DECIMAL(18, 2),
    tax_paid DECIMAL(18, 2),
    tax_due DECIMAL(18, 2),
    regime VARCHAR(10) DEFAULT 'old' CHECK (regime IN ('old', 'new')),
    deductions JSONB DEFAULT '[]',
    filing_status VARCHAR(20) DEFAULT 'pending'
        CHECK (filing_status IN ('pending', 'filed', 'processing', 'completed', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tax_user_year ON tax_records(user_id, fiscal_year);

-- ============================================
-- Fraud Alerts Table
-- ============================================
CREATE TABLE fraud_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES transactions(id),
    type VARCHAR(50) NOT NULL
        CHECK (type IN ('duplicate_invoice', 'suspicious_vendor', 'abnormal_amount', 'unusual_pattern', 'identity_theft')),
    severity VARCHAR(20) NOT NULL
        CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    description TEXT NOT NULL,
    amount DECIMAL(18, 2),
    risk_score INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'open'
        CHECK (status IN ('open', 'investigating', 'resolved', 'false_positive')),
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_fraud_user ON fraud_alerts(user_id);
CREATE INDEX idx_fraud_status ON fraud_alerts(status);
CREATE INDEX idx_fraud_severity ON fraud_alerts(severity);

-- ============================================
-- AI Insights Table
-- ============================================
CREATE TABLE ai_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL
        CHECK (category IN ('savings', 'spending', 'investment', 'tax', 'risk', 'strategy', 'growth')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    impact VARCHAR(255),
    priority VARCHAR(20) DEFAULT 'medium'
        CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    actionable BOOLEAN DEFAULT TRUE,
    dismissed BOOLEAN DEFAULT FALSE,
    agent VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_insights_user ON ai_insights(user_id);
CREATE INDEX idx_insights_priority ON ai_insights(priority);

-- ============================================
-- Forecasts Table
-- ============================================
CREATE TABLE forecasts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    metric VARCHAR(50) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    predicted_value DECIMAL(18, 2),
    lower_bound DECIMAL(18, 2),
    upper_bound DECIMAL(18, 2),
    confidence DECIMAL(5, 4),
    model VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_forecasts_user ON forecasts(user_id);

-- ============================================
-- Invoices Table (for OCR)
-- ============================================
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vendor_name VARCHAR(255),
    invoice_number VARCHAR(100),
    amount DECIMAL(18, 2),
    tax_amount DECIMAL(18, 2),
    gst_number VARCHAR(20),
    date DATE,
    due_date DATE,
    status VARCHAR(20) DEFAULT 'pending'
        CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
    file_url TEXT,
    ocr_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_invoices_user ON invoices(user_id);

-- ============================================
-- Audit Log Table
-- ============================================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_created ON audit_logs(created_at);

-- ============================================
-- Journal Entries (Double-Entry Accounting)
-- ============================================
CREATE TABLE journal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    entry_number VARCHAR(20) NOT NULL,
    date DATE NOT NULL,
    description TEXT NOT NULL,
    debit_account VARCHAR(255) NOT NULL,
    debit_amount DECIMAL(18, 2) NOT NULL,
    credit_account VARCHAR(255) NOT NULL,
    credit_amount DECIMAL(18, 2) NOT NULL,
    transaction_id UUID REFERENCES transactions(id),
    auto_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_journal_user ON journal_entries(user_id);
CREATE INDEX idx_journal_date ON journal_entries(date);

-- ============================================
-- Seed Data
-- ============================================

INSERT INTO users (id, name, email, password_hash, role, company, plan) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Arjun Sharma', 'arjun@finpilot.ai', '$2a$10$XYZ', 'ceo', 'TechNova Solutions Pvt. Ltd.', 'enterprise'),
    ('a0000000-0000-0000-0000-000000000002', 'Priya Verma', 'priya@finpilot.ai', '$2a$10$XYZ', 'admin', 'FinPilot AI', 'enterprise');
