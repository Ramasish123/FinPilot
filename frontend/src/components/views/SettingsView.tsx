"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Shield, Bell, Database, Key, X } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/components/Toast";

const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <div 
    className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${checked ? 'bg-[#4361ee]' : 'bg-[#2a3441]'}`}
    onClick={onChange}
  >
    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${checked ? 'right-0.5' : 'left-0.5'}`} />
  </div>
);

export default function SettingsView() {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(true);
  
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
  });

  const [toggles, setToggles] = useState({
    twoFactor: true,
    emailNotif: true,
    weeklyReports: true,
    taxReminders: true,
  });

  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const fetchProfile = async () => {
    try {
      const res = await api.get("/settings/profile");
      setProfile({
        name: res.name || "",
        email: res.email || "",
        company: res.company || "",
        role: res.role || "",
      });
    } catch (err) {
      error("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggle = (key: keyof typeof toggles) => setToggles((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSaveChanges = async () => {
    try {
      await api.put("/settings/profile", profile);
      success("Profile updated successfully");
    } catch (err) {
      error("Failed to update profile");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      error("New passwords do not match");
      return;
    }
    try {
      await api.put("/settings/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      success("Password changed successfully");
      setPasswordModalOpen(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      error("Failed to change password");
    }
  };

  return (
    <>
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="p-6 space-y-6 max-w-4xl">
        <motion.div variants={itemVariants}>
          <h3 className="text-xl font-bold text-[#f0f4ff]">Settings</h3>
          <p className="text-sm text-[#5a6a8a] mt-1">Manage your account, security, and preferences</p>
        </motion.div>

        {/* Profile Section */}
        <motion.div variants={itemVariants} className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-4 h-4 text-[#4361ee]" />
            <h4 className="text-sm font-semibold text-[#f0f4ff]">Profile</h4>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm text-[#94a3c8]">Full Name</label>
              <input 
                type="text" 
                value={profile.name} 
                onChange={(e) => setProfile({ ...profile, name: e.target.value })} 
                className="input-field !w-64 !py-2 !text-sm text-right" 
                disabled={loading}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-[#94a3c8]">Email</label>
              <input 
                type="email" 
                value={profile.email} 
                onChange={(e) => setProfile({ ...profile, email: e.target.value })} 
                className="input-field !w-64 !py-2 !text-sm text-right" 
                disabled={loading}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-[#94a3c8]">Company</label>
              <input 
                type="text" 
                value={profile.company} 
                onChange={(e) => setProfile({ ...profile, company: e.target.value })} 
                className="input-field !w-64 !py-2 !text-sm text-right" 
                disabled={loading}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-[#94a3c8]">Role</label>
              <input 
                type="text" 
                value={profile.role} 
                onChange={(e) => setProfile({ ...profile, role: e.target.value })} 
                className="input-field !w-64 !py-2 !text-sm text-right" 
                disabled={loading}
              />
            </div>
          </div>
        </motion.div>

        {/* Security Section */}
        <motion.div variants={itemVariants} className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-[#4361ee]" />
            <h4 className="text-sm font-semibold text-[#f0f4ff]">Security</h4>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm text-[#94a3c8]">Two-Factor Authentication</label>
              <Toggle checked={toggles.twoFactor} onChange={() => handleToggle('twoFactor')} />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-[#94a3c8]">Session Timeout</label>
              <input type="text" defaultValue="30 minutes" className="input-field !w-64 !py-2 !text-sm text-right" />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-[#94a3c8]">API Key</label>
              <input type="text" defaultValue="fp_sk_****...7a3f" className="input-field !w-64 !py-2 !text-sm text-right" />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[#1e293b]">
              <div>
                <p className="text-sm text-[#f0f4ff]">Password</p>
                <p className="text-xs text-[#5a6a8a]">Change your account password</p>
              </div>
              <button onClick={() => setPasswordModalOpen(true)} className="btn-secondary !py-1.5 !text-xs">Change Password</button>
            </div>
          </div>
        </motion.div>

        {/* Notifications Section */}
        <motion.div variants={itemVariants} className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-[#4361ee]" />
            <h4 className="text-sm font-semibold text-[#f0f4ff]">Notifications</h4>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm text-[#94a3c8]">Email Notifications</label>
              <Toggle checked={toggles.emailNotif} onChange={() => handleToggle('emailNotif')} />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-[#94a3c8]">Fraud Alerts</label>
              <input type="text" defaultValue="Immediate" className="input-field !w-64 !py-2 !text-sm text-right" />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-[#94a3c8]">Weekly Reports</label>
              <Toggle checked={toggles.weeklyReports} onChange={() => handleToggle('weeklyReports')} />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-[#94a3c8]">Tax Reminders</label>
              <Toggle checked={toggles.taxReminders} onChange={() => handleToggle('taxReminders')} />
            </div>
          </div>
        </motion.div>

        {/* Data & Privacy Section */}
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

        {/* Actions */}
        <motion.div variants={itemVariants} className="flex justify-end gap-3">
          <button className="btn-secondary" onClick={fetchProfile} disabled={loading}>Cancel</button>
          <button className="btn-primary" onClick={handleSaveChanges} disabled={loading}>Save Changes</button>
        </motion.div>
      </motion.div>

      {/* Password Modal */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-md p-6 relative"
            >
              <button
                onClick={() => setPasswordModalOpen(false)}
                className="absolute top-4 right-4 text-[#5a6a8a] hover:text-[#f0f4ff] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#4361ee]/20 flex items-center justify-center">
                  <Key className="w-5 h-5 text-[#4361ee]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#f0f4ff]">Change Password</h3>
                  <p className="text-xs text-[#5a6a8a]">Update your security credentials</p>
                </div>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-[#94a3c8] mb-1">Current Password</label>
                  <input
                    type="password"
                    className="input-field w-full"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#94a3c8] mb-1">New Password</label>
                  <input
                    type="password"
                    className="input-field w-full"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#94a3c8] mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    className="input-field w-full"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#1e293b]">
                  <button
                    type="button"
                    onClick={() => setPasswordModalOpen(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Update Password
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
