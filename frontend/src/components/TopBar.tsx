"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Search,
  Sparkles,
  Sun,
  Moon,
  ChevronDown,
  X,
} from "lucide-react";
import { mockUser } from "@/lib/data";
import { useNotificationStore } from "@/lib/store";

interface TopBarProps {
  title: string;
  subtitle?: string;
  user?: any;
  onLogout?: () => void;
  onNavigate?: (tab: string) => void;
}



const dummySearchResults = [
  { id: 1, title: "Q1 Revenue Report", type: "Document" },
  { id: 2, title: "AWS Hosting Expenses", type: "Transaction" },
  { id: 3, title: "Marketing Budget 2024", type: "Insight" },
];

const dropdownVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 10, scale: 0.95 },
};

export default function TopBar({ title, subtitle, user, onLogout, onNavigate }: TopBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showAllNotificationsModal, setShowAllNotificationsModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  const notifications = useNotificationStore((state) => state.notifications);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const unreadCount = notifications.filter(n => !n.read).length;

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    setMounted(true);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredResults = searchQuery
    ? dummySearchResults.filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : dummySearchResults;

  return (
    <header className="h-16 border-b border-white/[0.06] bg-[#0a0e1a]/60 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-6">
      {/* Left: Title */}
      <div>
        <h2 className="text-lg font-semibold text-[#f0f4ff]">{title}</h2>
        {subtitle && (
          <p className="text-xs text-[#5a6a8a] mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block" ref={searchRef}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5a6a8a]" />
          <input
            type="text"
            placeholder="Search transactions, insights..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            className="input-field pl-10 w-72 !py-2 !text-sm !bg-[#151d35]/60"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#5a6a8a] bg-[#1c2642] px-1.5 py-0.5 rounded">
            ⌘K
          </kbd>

          <AnimatePresence>
            {isSearchFocused && searchQuery.length > 0 && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="absolute left-0 mt-2 w-full rounded-xl bg-[#151d35] border border-white/[0.06] shadow-xl py-2 overflow-hidden z-50"
              >
                {filteredResults.length > 0 ? (
                  filteredResults.map((result) => (
                    <div key={result.id} className="px-4 py-2 hover:bg-white/[0.03] cursor-pointer flex flex-col">
                      <span className="text-sm text-[#f0f4ff]">{result.title}</span>
                      <span className="text-[10px] text-[#5a6a8a]">{result.type}</span>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-[#5a6a8a] text-center">
                    No results found
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* AI Quick Access */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4361ee]/20 to-[#06d6a0]/20 border border-[#4361ee]/20 flex items-center justify-center"
        >
          <Sparkles className="w-4 h-4 text-[#4361ee]" />
        </motion.button>

        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-xl bg-[#151d35] border border-white/[0.06] flex items-center justify-center relative"
          >
            <Bell className="w-4 h-4 text-[#94a3c8]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#f43f5e] rounded-full text-[9px] text-white flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-80 rounded-xl bg-[#151d35] border border-white/[0.06] shadow-xl py-2 z-50"
              >
                <div className="px-4 py-2 border-b border-white/[0.06]">
                  <h3 className="text-sm font-semibold text-[#f0f4ff]">Notifications</h3>
                </div>
                <div className="flex flex-col">
                  {notifications.slice(0, 4).map((notif) => (
                    <div 
                      key={notif.id} 
                      onClick={() => markAsRead(notif.id)}
                      className={`px-4 py-3 hover:bg-white/[0.03] cursor-pointer flex flex-col gap-1 border-b border-white/[0.02] last:border-0 ${!notif.read ? 'bg-white/[0.02]' : ''}`}
                    >
                      <span className={`text-sm ${!notif.read ? 'text-[#f0f4ff] font-medium' : 'text-[#94a3c8]'}`}>{notif.title}</span>
                      <span className="text-[10px] text-[#5a6a8a]">{notif.time}</span>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div className="px-4 py-3 text-sm text-[#5a6a8a] text-center">No notifications</div>
                  )}
                </div>
                <div className="px-4 pt-2 mt-1 border-t border-white/[0.06]">
                  <button onClick={() => { setShowNotifications(false); setShowAllNotificationsModal(true); }} className="text-xs text-[#4361ee] hover:text-[#f0f4ff] w-full text-center py-1">View all</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-white/[0.06]" />

        {/* User Profile */}
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-xl hover:bg-white/[0.03] transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4361ee] to-[#7c3aed] flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-medium text-[#f0f4ff] leading-tight">
                {user?.name || "User"}
              </p>
              <p className="text-[10px] text-[#5a6a8a] capitalize">
                {user?.role?.replace("_", " ") || "Member"}
              </p>
            </div>
            <ChevronDown className={`w-3 h-3 text-[#5a6a8a] hidden lg:block transition-transform duration-200 ${showProfile ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-48 rounded-xl bg-[#151d35] border border-white/[0.06] shadow-xl py-1 z-50"
              >
                <button
                  onClick={() => {
                    setShowProfile(false);
                    onNavigate && onNavigate("settings");
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-[#94a3c8] hover:text-[#f0f4ff] hover:bg-white/[0.03]"
                >
                  Settings
                </button>
                <button
                  onClick={() => {
                    setShowProfile(false);
                    onLogout && onLogout();
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-[#f43f5e] hover:bg-white/[0.03]"
                >
                  Sign out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* All Notifications Modal */}
      {mounted && createPortal(
        <AnimatePresence>
          {showAllNotificationsModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setShowAllNotificationsModal(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="glass-card w-full max-w-2xl p-6 relative flex flex-col max-h-[80vh] z-10"
              >
                <button 
                  onClick={() => setShowAllNotificationsModal(false)}
                  className="absolute top-4 right-4 text-[#5a6a8a] hover:text-[#f0f4ff] transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-xl font-bold text-[#f0f4ff] mb-6 flex items-center gap-2">
                  <Bell className="w-5 h-5" /> All Notifications
                </h3>
                
                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      onClick={() => markAsRead(notif.id)}
                      className={`p-4 rounded-xl border border-white/[0.06] cursor-pointer transition-colors ${!notif.read ? 'bg-[#1e293b]/50 hover:bg-[#1e293b]/70' : 'bg-transparent hover:bg-white/[0.02]'}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`text-sm ${!notif.read ? 'text-[#f0f4ff] font-semibold' : 'text-[#94a3c8] font-medium'}`}>{notif.title}</h4>
                        <span className="text-xs text-[#5a6a8a]">{notif.time}</span>
                      </div>
                      <p className="text-xs text-[#94a3c8]">{notif.read ? "Marked as read." : "Action required."}</p>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div className="p-4 text-center text-[#5a6a8a]">You're all caught up!</div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </header>
  );
}
