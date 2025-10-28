"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/vapi-usage");
        const json = await res.json();
        console.log(json)
        setData(json);
      } catch (err) {
        console.error("Error fetching Vapi usage:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="2xl:container flex items-center justify-center h-screen bg-white/80 dark:bg-gray-900/50 text-gray-500 dark:text-white">
        <Loader2 className="animate-spin mr-2" /> Loading data...
      </div>
    );

  if (!data)
    return (
      <div className="text-center py-20 text-red-500">
        Failed to load data.
      </div>
    );


  return (
    <div className="2xl:container mx-auto py-16 px-6">
        <Navbar/>
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
        Vapi Usage Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-10">
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-sm text-gray-500">Total Calls</h3>
            <p className="text-2xl font-semibold">{data.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-sm text-gray-500">Inbound</h3>
            <p className="text-2xl font-semibold">{data.filter((c) => c.type === "inboundPhoneCall").length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-sm text-gray-500">Web Calls</h3>
            <p className="text-2xl font-semibold">{data.filter((c) => c.type === "webCall").length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-sm text-gray-500">Total Cost</h3>
            <p className="text-2xl font-semibold">${data.reduce((sum, c) => sum + (c.cost || 0), 0)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Calls Table */}
      <div className="overflow-x-auto h-[100vh]">
        <table className="w-[400%] md:w-[150%] border-collapse border border-gray-300 dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="border p-3 text-left">Type</th>
              <th className="border p-3 text-left">Start Time</th>
              <th className="border p-3 text-left">End Time</th>
              <th className="border p-3 text-left">Status</th>
              <th className="border p-3 text-left">Assistant</th>
              <th className="border p-3 text-left">Reason</th>
              <th className="border p-3 text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {data.map((call) => (
              <tr key={call.id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900">
                <td className="p-3">{call.type}</td>
                <td className="p-3">{call.startedAt ? new Date(call.startedAt).toLocaleString() : "—"}</td>
                <td className="p-3">{call.endedAt? new Date(call.endedAt).toLocaleString() : "—"}</td>
                <td className="p-3">{call.status}</td>
                <td className="p-3">{call.assistantOverrides?.name || "—"}</td>
                <td className="p-3">{call.endedReason || "—"}</td>
                <td className="p-3">
                  {new Date(call.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
