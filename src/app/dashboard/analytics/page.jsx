"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, WifiOff } from "lucide-react";
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
  const minutes = diffMs / (1000 * 60); // round UP to full minute

  totalMinutes += minutes;
}





  if (loading)
    return (
      <div className="2xl:container flex items-center justify-center h-screen bg-white/80 dark:bg-gray-900/50 text-gray-500 dark:text-white">
        <Loader2 className="animate-spin mr-2" /> Loading data...
      </div>
    );

  if (calls.length === 0)
    return (
      <div className="text-center py-20 text-red-500">
        No data available {(
        <div className="ml-10 flex items-center gap-2 mb-8 p-3 rounded-lg bg-yellow-100 border border-yellow-400 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300">
          <WifiOff size={18} />
          <span>You’re offline</span>
        </div>
      )}.
      </div>
    );

  return (
    <div className="2xl:container mx-auto py-16 px-6 pt-24">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white uppercase">
        Analytics
      </h1>

      {/* 📴 Offline Banner */}
      {offline && (
        <div className="flex items-center gap-2 mb-8 p-3 rounded-lg bg-yellow-100 border border-yellow-400 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300">
          <WifiOff size={18} />
          <span>You’re offline — showing cached data</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-10">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm text-gray-500">Total Calls min</h3>
            <p className="text-2xl font-semibold">{totalMinutes.toFixed(2)}{ calls.legth}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm text-gray-500">Number of Calls</h3>
            <p className="text-2xl font-semibold">
              {calls.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm text-gray-500">Web Calls</h3>
            <p className="text-2xl font-semibold">
              {calls.filter((c) => c.type === "webCall").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm text-gray-500">Total Cost</h3>
            <p className="text-2xl font-semibold">
              ${calls.reduce((sum, c) => sum + (c.cost || 0), 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Calls Table */}
      <div className="space-y-2 scrollar rounded-xl">
        <div className="flex flex-col md:flex-row items-center gap-2">
          <CallsPerDayChart data={data} />
          <MinutesPerDayChart data={data} />
        </div>
          <div className="text-white">
            <CancellationReasonChart data={data}/>
          </div>

      </div>
    </div>
  );
}
