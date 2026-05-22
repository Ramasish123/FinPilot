"use client";

import React from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, User, Shield, Bell, Palette, Database, Key, Globe } from "lucide-react";
import { mockUser } from "@/lib/data";

const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const settingsSections = [
  {
    title: "Profile",
    icon: User,
    fields: [
      { label: "Full Name", value: mockUser.name, type: "text" },
      { label: "Email", value: mockUser.email, type: "email" },
      { label: "Company", value: mockUser.company || "", type: "text" },
      { label: "Role", value: mockUser.role.replace("_", " "), type: "select" },
    ],
  },
  {
    title: "Security",
    icon: Shield,
    fields: [
      { label: "Two-Factor Authentication", value: "Enabled", type: "toggle" },
      { label: "Session Timeout", value: "30 minutes", type: "select" },
      { label: "API Key", value: "fp_sk_****...7a3f", type: "text" },
    ],
  },
  {
    title: "Notifications",
    icon: Bell,
    fields: [
      { label: "Email Notifications", value: "Enabled", type: "toggle" },
      { label: "Fraud Alerts", value: "Immediate", type: "select" },
      { label: "Weekly Reports", value: "Enabled", type: "toggle" },
      { label: "Tax Reminders", value: "Enabled", type: "toggle" },
    ],
  },
];

export default function SettingsView() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="p-6 space-y-6 max-w-4xl">
      <motion.div variants={itemVariants}>
        <h3 className="text-xl font-bold text-[#f0f4ff]">Settings</h3>
        <p className="text-sm text-[#5a6a8a] mt-1">Manage your account, security, and preferences</p>
      </motion.div>

      {settingsSections.map((section) => {
        const Icon = section.icon;
        return (
          <motion.div key={section.title} variants={itemVariants} className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Icon className="w-4 h-4 text-[#4361ee]" />
              <h4 className="text-sm font-semibold text-[#f0f4ff]">{section.title}</h4>
            </div>
            <div className="space-y-4">
              {section.fields.map((field) => (
                <div key={field.label} className="flex items-center justify-between">
                  <label className="text-sm text-[#94a3c8]">{field.label}</label>
                  {field.type === "toggle" ? (
                    <div className="w-10 h-5 bg-[#4361ee] rounded-full relative cursor-pointer">
                      <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full" />
                    </div>
                  ) : (
                    <input type="text" defaultValue={field.value} className="input-field !w-64 !py-2 !text-sm text-right" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        );
      })}

      <motion.div variants={itemVariants} className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-4 h-4 text-[#06d6a0]" />
          <h4 className="text-sm font-semibold text-[#f0f4ff]">Data & Privacy</h4>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#f0f4ff]">Data Encryption</p>
              <p className="text-xs text-[#5a6a8a]">AES-256 encryption for all financial data</p>
            </div>
            <span className="badge badge-success text-[10px]">Active</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#f0f4ff]">Audit Logging</p>
              <p className="text-xs text-[#5a6a8a]">Complete trail of all system actions</p>
            </div>
            <span className="badge badge-success text-[10px]">Active</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#f0f4ff]">Export All Data</p>
              <p className="text-xs text-[#5a6a8a]">Download a complete copy of your financial data</p>
            </div>
            <button className="btn-secondary !py-1.5 !text-xs">Export</button>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex justify-end gap-3">
        <button className="btn-secondary">Cancel</button>
        <button className="btn-primary">Save Changes</button>
      </motion.div>
    </motion.div>
  );
}
