"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, WifiOff, Phone, Clock, DollarSign, Globe } from "lucide-react";
import { motion } from "framer-motion";
import CallsPerDayChart from "@/app/client-dashboard-components/calls-per-day";
import MinutesPerDayChart from "@/app/client-dashboard-components/min-per-day";
import CancellationReasonChart from "@/app/client-dashboard-components/cancelation-reason-chart";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [selectedBot, setSelectedBot] = useState("null");

  useEffect(() => {
    const getSelectedBot = () => {
      const botStr = localStorage.getItem("selectedBot");
      return botStr ? JSON.parse(botStr) : null;
    };

    let currentBot = getSelectedBot();

    const fetchData = async (bot) => {
      if (!bot) return;

      setLoading(true);
      try {
        const res = await fetch("/api/vapi-calls", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bot_id: currentBot.id,
          }),
        });

        if (!res.ok) throw new Error("Failed to fetch Vapi usage");
        const json = await res.json();
        setData(json);
        setOffline(!navigator.onLine);
      } catch (err) {
        console.error("Error fetching Vapi usage:", err);
        setOffline(true);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchData(currentBot);

    // Listen for storage events (other tabs)
    const handleStorage = () => {
      const newBot = getSelectedBot();
      if (JSON.stringify(newBot) !== JSON.stringify(currentBot)) {
        currentBot = newBot;
        fetchData(currentBot);
      }
    };
    window.addEventListener("storage", handleStorage);

    // Optional: poll localStorage every 1 second (to catch changes in the same tab)
    const interval = setInterval(() => {
      const newBot = getSelectedBot();
      if (JSON.stringify(newBot) !== JSON.stringify(currentBot)) {
        currentBot = newBot;
        fetchData(currentBot);
      }
    }, 1000);

    // Clean up
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  // ✅ Defensive: handle both array and object responses
  const calls = Array.isArray(data)
    ? data
    : Array.isArray(data?.cached)
    ? data.cached
    : [];

  let totalMinutes = 0;

  for (let i = 0; i < calls.length; i++) {
    const start = new Date(calls[i].createdAt);
    const end = new Date(calls[i].endedAt);
    if (isNaN(start) || isNaN(end)) continue;

    const diffMs = end - start;
    const minutes = diffMs / (1000 * 60);

    totalMinutes += minutes;
  }

  if (loading)
    return (
      <div className="container flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-green-600" size={40} />
          <p className="text-gray-600 font-medium">Loading analytics...</p>
        </div>
      </div>
    );

  if (calls.length === 0)
    return (
      <div className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
            <Phone className="text-red-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Data Available</h2>
          <p className="text-gray-600 mb-6">
            {offline ? "You're offline and no cached data is available." : "No calls have been recorded yet."}
          </p>
          {offline && (
            <div className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-yellow-100 border border-yellow-300 text-yellow-700">
              <WifiOff size={18} />
              <span className="font-medium">Check your internet connection</span>
            </div>
          )}
        </motion.div>
      </div>
    );

  const stats = [
    {
      title: "Total Minutes",
      value: totalMinutes.toFixed(2),
      icon: Clock,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Number of Calls",
      value: calls.length,
      icon: Phone,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Web Calls",
      value: calls.filter((c) => c.type === "webCall").length,
      icon: Globe,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Total Cost",
      value: `$${calls.reduce((sum, c) => sum + (c.cost || 0), 0).toFixed(2)}`,
      icon: DollarSign,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="container mx-auto py-16 px-6 pt-24 bg-gradient-to-br from-gray-50 via-white to-green-50/20 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-gray-900 to-green-800 bg-clip-text text-transparent">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600">Track your call metrics and performance insights</p>
      </motion.div>

      {/* 📴 Offline Banner */}
      {offline && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-8 p-4 rounded-xl bg-yellow-100 border-2 border-yellow-300 text-yellow-800 shadow-md"
        >
          <div className="p-2 bg-yellow-200 rounded-lg">
            <WifiOff size={20} />
          </div>
          <span className="font-semibold">{`You're`} offline — showing cached data</span>
        </motion.div>
      )}

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <Card className="border border-gray-200 bg-white/80 backdrop-blur-sm hover:shadow-xl hover:border-green-200 transition-all duration-300 rounded-2xl group overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 ${stat.bgColor} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`${stat.iconColor}`} size={24} />
                    </div>
                  </div>
                  <h3 className="text-sm text-gray-600 font-medium mb-1">{stat.title}</h3>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="space-y-6"
      >
        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6">
            <CallsPerDayChart data={data} />
          
            <MinutesPerDayChart data={data} />
        </div>

        {/* Cancellation Chart */}
        <div className="">
          <CancellationReasonChart data={data} />
        </div>
      </motion.div>
    </div>
  );
}