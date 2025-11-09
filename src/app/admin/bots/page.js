"use client";

import { useEffect, useState } from "react";
import { Bot, Loader2 } from "lucide-react";
import Link from "next/link"; 

export default function AllBotsPage() {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBots() {
      try {
        const res = await fetch("/api/bots");
        if (!res.ok) throw new Error("Failed to fetch bots");
        const data = await res.json();
        setBots(data);
      } catch (error) {
        console.error("❌ Error fetching bots:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBots();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 dark:text-gray-300">
        <Loader2 className="animate-spin w-6 h-6 mr-2" />
        Loading bots...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8 text-gray-900 dark:text-gray-100">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold text-center mb-6 flex items-center justify-center gap-2">
          <Bot className="w-7 h-7 text-green-600" /> All Assigned Bots
        </h1>

        {bots.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No bots assigned yet.
          </p>
        ) : (
          <div className="overflow-x-auto shadow-lg rounded-xl bg-white dark:bg-gray-800">
            <table className="w-full border-collapse">
              <thead className="bg-gray-200 dark:bg-gray-700">
                <tr>
                  <th className="py-3 px-4 text-left">#</th>
                  <th className="py-3 px-4 text-left">User Name</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Assistant ID</th>
                  <th className="py-3 px-4 text-left">Vapi API Key</th>
                  <th className="py-3 px-4 text-left">Created</th>
                  <th className="py-3 px-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {bots.map((bot, index) => (
                  <tr
                    key={bot.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className="py-2 px-4">{bot.full_name}</td>
                    <td className="py-2 px-4">{bot.email}</td>
                    <td className="py-2 px-4">{bot.assistant_id}</td>
                    <td className="py-2 px-4 truncate max-w-[200px]">
                      <span className="text-xs text-gray-400">{bot.vapi_private_api_key}</span>
                    </td>
                    <td className="py-2 px-4">
                      {new Date(bot.created_at).toLocaleString()}
                    </td>
                    <td className="py-2 px-4">
                      <Link href={`/admin/bot-stats/${bot.id}`} >
                        See Stats
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
