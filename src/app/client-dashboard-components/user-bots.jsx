"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function UserBots() {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBot, setSelectedBot] = useState(null);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState(null);
  const dropdownRef = useRef(null);

  // 🔹 Load email from localStorage
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setEmail(user.email);
    }
  }, []);

  // 🔹 Load bots immediately from localStorage (instant)
  useEffect(() => {
    const cached = localStorage.getItem("user-bots");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setBots(parsed);
        setLoading(false);
      } catch {
        console.warn("⚠️ Corrupted user-bots cache");
      }
    }
  }, []);

  // 🔹 Fetch latest bots when email is ready (updates cache)
  useEffect(() => {
    if (!email) return;

    const fetchBots = async () => {
      try {
        const res = await fetch(`/api/user-bots/${email}`);
        if (!res.ok) throw new Error("Failed to fetch bots");
        const data = await res.json();

        const userBots = data.map((bot) => ({
          id: bot.id,
          bot_name: bot.bot_name,
          email: bot.email,
        }));

        setBots(userBots);
        localStorage.setItem("user-bots", JSON.stringify(userBots));

        // Set selected bot (prefer saved one)
        const savedBot = localStorage.getItem("selectedBot");
        if (savedBot) {
          setSelectedBot(JSON.parse(savedBot));
        } else if (userBots.length > 0) {
          setSelectedBot(userBots[0]);
        }
      } catch (error) {
        console.error("❌ Error fetching bots:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBots();
  }, [email]);

  // 🔹 Save selected bot to localStorage
  useEffect(() => {
    if (selectedBot) {
      localStorage.setItem("selectedBot", JSON.stringify(selectedBot));
    }
  }, [selectedBot]);

  // 🔹 Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🧠 If cache was loaded, show instantly (no "loading" spinner)
  if (!bots.length && loading) {
    return (
      <div className="flex justify-center items-center text-gray-500 dark:text-gray-300">
        <Loader2 className="animate-spin mr-2 w-6 h-6" />
        Loading your bots...
      </div>
    );
  }

  if (bots.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 dark:text-gray-400">
        You have no bots assigned yet
      </div>
    );
  }

  return (
    <div
      ref={dropdownRef}
      className="p-4 pl-6 text-gray-900 dark:text-gray-100 flex flex-col items-center w-full"
    >
      <div className="w-full max-w-xs relative">
        {/* Selected Box */}
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
        >
          <span className="truncate text-sm font-medium capitalize">
            {selectedBot ? `Assistant : ${selectedBot.bot_name}` : "Select Bot"}
          </span>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Options */}
        <AnimatePresence>
          {open && (
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute mt-2 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 max-h-56 overflow-y-auto"
            >
              {bots.map((bot) => (
                <li
                  key={bot.id}
                  onClick={() => {
                    setSelectedBot(bot);
                    setOpen(false);
                  }}
                  className={`flex items-center justify-between px-4 py-2 cursor-pointer text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition capitalize ${
                    selectedBot?.id === bot.id ? "bg-gray-100 dark:bg-gray-800" : ""
                  }`}
                >
                  <span>{bot.bot_name}</span>
                  {selectedBot?.id === bot.id && (
                    <Check className="w-4 h-4 text-green-500" />
                  )}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
