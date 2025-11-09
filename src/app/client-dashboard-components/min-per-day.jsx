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

export default function MinutesPerDayChart({ data = [] }) {

  // === Calculate total call minutes per day ===
  const minutesPerDayMap = data.reduce((acc, call) => {
    if (!call.createdAt || !call.endedAt) return acc;

    const start = new Date(call.createdAt);
    const end = new Date(call.endedAt);

    const diffMs = end - start;
    const minutes = diffMs / (1000 * 60);

    const date = start.toISOString().split("T")[0];
    acc[date] = (acc[date] || 0) + minutes;
    return acc;
  }, {});

  const chartData = Object.entries(minutesPerDayMap).map(([date, minutes]) => ({
    date,
    minutes: Number(minutes.toFixed(2)) // cleaner values
  }));

  return (
    <div className="w-full h-[380px] pb-26 md:pb-22 pt-4 pr-4 border rounded-xl shadow-sm bg-white dark:bg-neutral-900">
      <div className="pl-10 mb-4">
        <h2 className="text-lg font-semibold mb-3">Minutes of Calls Per Day</h2>
        <p className="text-gray-600 text-sm mb-2">The Total number of minutes spent on call each day</p>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 25, bottom: 5, left: -10 }}>
          
          {/* Smooth Grid */}
          <CartesianGrid strokeDasharray="4 4" className="opacity-30" />

          {/* Date Labels */}
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />

          {/* Y Axis */}
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />

          <Tooltip
  formatter={(value) => `${value} min`} // ✅ correct for this chart
  contentStyle={{
    background: "#1f2937",
    border: "none",
    borderRadius: "8px",
    padding: "8px 12px",
  }}
  itemStyle={{ color: "#ffffff" }}  // ✅ applies to values
  labelStyle={{ color: "#ffffff" }} // ✅ applies to label (date)
/>


          {/* Line with Gradient */}
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="1" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          <Line
            type="monotone"
            dataKey="minutes"
            stroke="url(#lineGradient)"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />

        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
