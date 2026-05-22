"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Sparkles,
  Bot,
  User,
  Lightbulb,
  TrendingUp,
  Calculator,
  ShieldCheck,
  Mic,
  Paperclip,
  RotateCcw,
} from "lucide-react";
import { ChatMessage } from "@/lib/data";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const suggestedQuestions = [
  { icon: Calculator, text: "Can I afford a ₹50L home loan?", category: "Planning" },
  { icon: TrendingUp, text: "Why did profits drop last quarter?", category: "Analysis" },
  { icon: ShieldCheck, text: "How can I save more on taxes this year?", category: "Tax" },
  { icon: Lightbulb, text: "What's my financial health score?", category: "Health" },
];

const mockResponses: Record<string, string> = {
  default: `Based on your current financial profile, here's my analysis:

**📊 Key Metrics:**
- Monthly Income: ₹4,20,000
- Monthly Expenses: ₹1,05,000
- Savings Rate: 25%
- Debt-to-Income: 28.3%

**💡 Recommendation:**
Your financial position is strong with consistent income growth. However, I notice your emergency fund only covers 2.3 months. I'd recommend prioritizing building this to 6 months before taking on new financial commitments.

Would you like me to create a detailed savings plan?`,

  "can i afford": `# 🏠 Home Loan Affordability Analysis

Based on your financial profile:

| Parameter | Value |
|-----------|-------|
| Monthly Income | ₹4,20,000 |
| Existing EMIs | ₹2,12,300 |
| Available for EMI | ₹1,26,000 |
| Max Loan (8.5%, 20yr) | ₹52,00,000 |

**✅ Verdict: Yes, you can afford a ₹50L home loan**

Your post-EMI disposable income would be ₹78,500/month, which maintains a comfortable living standard.

**⚠️ However, I recommend:**
1. Building 6-month emergency fund first (₹12.6L)
2. Keeping total EMI below 40% of income
3. Putting down at least 20% (₹10L) to reduce EMI burden

Shall I simulate different down payment scenarios?`,

  "why did profits": `# 📉 Profit Analysis — Q1 vs Q4

Your profits dropped by **12.3%** last quarter. Here's the breakdown:

**Root Causes:**
1. **Marketing Spend ↑ 35%** — Google Ads CPC increased but conversions only improved 3%
2. **Infrastructure Cost ↑ 18%** — AWS spending spiked due to new microservices deployment
3. **Hiring Costs** — Onboarding 4 new employees added ₹2.8L in one-time costs

**Revenue was actually UP 8%**, so this isn't a demand problem — it's a cost management issue.

**🎯 My Recommendations:**
- Reallocate 40% of Google Ads budget to LinkedIn (better B2B ROI)
- Implement AWS Reserved Instances (save ~30%)
- Stagger hiring to spread onboarding costs

Expected impact: **Restore margins within 2 months**`,

  "save more": `# 🏦 Tax Optimization Strategy

Based on your FY 2025-26 profile, here are **₹1,95,000 in potential tax savings**:

**Unused Deductions:**
| Section | Available | Utilized | Gap |
|---------|-----------|----------|-----|
| 80C | ₹1,50,000 | ₹65,000 | ₹85,000 |
| 80CCD(1B) | ₹50,000 | ₹0 | ₹50,000 |
| 80D | ₹75,000 | ₹25,000 | ₹50,000 |

**Quick Actions:**
1. ✅ Invest ₹85,000 in ELSS mutual funds → Save ₹26,520
2. ✅ Open NPS account with ₹50,000 → Save ₹15,600
3. ✅ Get Super Top-up Health Insurance → Save ₹15,600

**Old vs New Regime:**
Staying on Old Regime saves you ₹1,95,000 more with your current deductions.

Want me to auto-calculate your optimal investment allocation?`,

  "financial health": `# 🏥 Financial Health Score: **78/100 (B+)**

**Detailed Breakdown:**

| Factor | Score | Status |
|--------|-------|--------|
| Income Stability | 92 | 🟢 Excellent |
| Debt-to-Income | 68 | 🟡 Good |
| Savings Rate | 55 | 🟠 Fair |
| Investment Diversity | 82 | 🟡 Good |
| Emergency Fund | 45 | 🔴 Needs Attention |
| Tax Efficiency | 73 | 🟡 Good |

**🔑 Top Priority: Emergency Fund**
You currently have 2.3 months covered. Target: 6 months (₹6.3L needed).

**Action Plan to reach 90+:**
1. Automate ₹25,000/month to emergency savings
2. Diversify into debt funds for stability
3. Max out tax-saving investments
4. Review and consolidate insurance coverage

At this rate, you'll reach **85+ by December 2026** 🚀`,
};

function getAIResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("afford") || lower.includes("loan") || lower.includes("home")) return mockResponses["can i afford"];
  if (lower.includes("profit") || lower.includes("drop") || lower.includes("why")) return mockResponses["why did profits"];
  if (lower.includes("tax") || lower.includes("save")) return mockResponses["save more"];
  if (lower.includes("health") || lower.includes("score")) return mockResponses["financial health"];
  return mockResponses["default"];
}

export default function ChatbotView() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "👋 Hello! I'm your AI Financial Assistant powered by FinPilot AI. I have access to all your financial data and can help you with:\n\n- **Financial planning** & affordability analysis\n- **Tax optimization** strategies\n- **Investment** recommendations\n- **Expense analysis** & budgeting\n- **Business strategy** insights\n\nWhat would you like to know?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: "user",
      content: messageText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:8000/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText, user_id: "usr_001" }),
      });
      
      if (!response.ok) {
        throw new Error("API response was not ok");
      }
      
      const data = await response.json();
      
      const aiResponse: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        role: "assistant",
        content: data.response,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      // Fallback to mock response
      const aiResponse: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        role: "assistant",
        content: getAIResponse(messageText),
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="p-6 h-[calc(100vh-64px)] flex gap-6">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col glass-card overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-white/[0.06] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4361ee] to-[#06d6a0] flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#f0f4ff]">FinPilot AI Assistant</h3>
            <div className="flex items-center gap-1.5">
              <div className="pulse-dot bg-[#06d6a0] text-[#06d6a0] !w-2 !h-2" />
              <span className="text-[10px] text-[#06d6a0]">Online • RAG + LangChain</span>
            </div>
          </div>
          <div className="ml-auto">
            <button
              onClick={() => setMessages([messages[0]])}
              className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors"
              title="Reset chat"
            >
              <RotateCcw className="w-4 h-4 text-[#5a6a8a]" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex items-start gap-2.5 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-[#4361ee] to-[#7c3aed]"
                      : "bg-gradient-to-br from-[#06d6a0] to-[#4361ee]"
                  }`}>
                    {msg.role === "user" ? (
                      <User className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    )}
                  </div>
                  <div className={msg.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"}>
                    <div
                      className="text-sm leading-relaxed prose prose-invert prose-sm max-w-none
                        [&_h1]:text-base [&_h1]:font-bold [&_h1]:mb-2 [&_h1]:mt-0
                        [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:mb-1.5
                        [&_strong]:text-[#f0f4ff] [&_strong]:font-semibold
                        [&_table]:w-full [&_table]:text-xs [&_table]:my-2
                        [&_th]:text-left [&_th]:px-2 [&_th]:py-1.5 [&_th]:border-b [&_th]:border-white/10 [&_th]:text-[#94a3c8] [&_th]:font-semibold
                        [&_td]:px-2 [&_td]:py-1.5 [&_td]:border-b [&_td]:border-white/5
                        [&_li]:text-[#94a3c8] [&_li]:text-xs
                        [&_code]:text-[#06d6a0] [&_code]:bg-white/5 [&_code]:px-1 [&_code]:rounded
                        [&_p]:mb-2 [&_p:last-child]:mb-0"
                      dangerouslySetInnerHTML={{
                        __html: msg.content
                          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                          .replace(/\n/g, "<br>")
                          .replace(/\|(.*?)\|/g, (match) => {
                            if (match.includes("---")) return "";
                            return match;
                          }),
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-start gap-2.5"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#06d6a0] to-[#4361ee] flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="chat-bubble-ai flex items-center gap-1.5 py-3">
                  <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0 }} className="w-2 h-2 rounded-full bg-[#4361ee]" />
                  <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="w-2 h-2 rounded-full bg-[#4361ee]" />
                  <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} className="w-2 h-2 rounded-full bg-[#4361ee]" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-2">
            <button className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors">
              <Paperclip className="w-4 h-4 text-[#5a6a8a]" />
            </button>
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about your finances..."
                className="input-field !pr-12"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-white/[0.05] transition-colors">
                <Mic className="w-4 h-4 text-[#5a6a8a]" />
              </button>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => sendMessage()}
              disabled={!input.trim() || isTyping}
              className="p-2.5 rounded-xl bg-gradient-to-r from-[#4361ee] to-[#06d6a0] text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Sidebar — Suggestions */}
      <motion.div variants={itemVariants} className="w-72 hidden xl:flex flex-col gap-4">
        <div className="glass-card p-4">
          <h4 className="text-xs font-semibold text-[#f0f4ff] mb-3 flex items-center gap-2">
            <Lightbulb className="w-3.5 h-3.5 text-[#f59e0b]" />
            Suggested Questions
          </h4>
          <div className="space-y-2">
            {suggestedQuestions.map((q) => {
              const Icon = q.icon;
              return (
                <motion.button
                  key={q.text}
                  whileHover={{ x: 4 }}
                  onClick={() => sendMessage(q.text)}
                  className="w-full text-left p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-[#4361ee]/20 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-3.5 h-3.5 text-[#4361ee]" />
                    <span className="text-[10px] text-[#5a6a8a]">{q.category}</span>
                  </div>
                  <p className="text-xs text-[#94a3c8]">{q.text}</p>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* AI Agents Status */}
        <div className="glass-card p-4">
          <h4 className="text-xs font-semibold text-[#f0f4ff] mb-3">Active AI Agents</h4>
          <div className="space-y-2">
            {[
              { name: "Income Agent", status: "active" },
              { name: "Expense Agent", status: "active" },
              { name: "Tax Agent", status: "active" },
              { name: "Audit Agent", status: "idle" },
              { name: "Forecast Agent", status: "active" },
              { name: "Strategy Agent", status: "active" },
            ].map((agent) => (
              <div key={agent.name} className="flex items-center justify-between py-1">
                <span className="text-xs text-[#94a3c8]">{agent.name}</span>
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${agent.status === "active" ? "bg-[#10b981]" : "bg-[#5a6a8a]"}`} />
                  <span className={`text-[10px] ${agent.status === "active" ? "text-[#10b981]" : "text-[#5a6a8a]"}`}>
                    {agent.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
