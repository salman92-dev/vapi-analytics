"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function CallsPerDayChart({ data = [] }) {

  // === Calculate calls per day ===
  const callsPerDayMap = data.reduce((acc, call) => {
    if (!call.createdAt) return acc;

    const date = new Date(call.createdAt).toISOString().split("T")[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(callsPerDayMap).map(([date, count]) => ({
    date,
    count
  }));

  return (
    <div className="w-full h-[380px] pb-22 pt-4 pr-4 border rounded-xl shadow-sm bg-white dark:bg-neutral-900">
      <div className="pl-10 mb-4">
        <h2 className="text-lg font-semibold mb-3">Calls Per Day</h2>
        <p className="text-gray-600 text-sm mb-2">Total Number of calls made each day.</p>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 25, bottom: 5, left: -10 }}>

          {/* Softer Grid */}
          <CartesianGrid strokeDasharray="4 4" className="opacity-30" />

          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />

          {/* Clean Tooltip */}
          <Tooltip
            formatter={(value) => `${value} calls`}
            contentStyle={{
              background: "rgba(0,0,0,0.8)",
              color: "#fff",
              borderRadius: "8px",
              border: "none",
              padding: "8px 12px"
            }}
          />

          {/* Line with Gradient */}
          <defs>
            <linearGradient id="lineGradient2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="1" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          <Line
            type="monotone"
            dataKey="count"
            stroke="url(#lineGradient2)"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />

        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
