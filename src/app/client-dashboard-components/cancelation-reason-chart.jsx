"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function CancellationReasonChart({ data = [] }) {
  // === Count end reason occurrences ===
  const reasonCounts = data.reduce((acc, call) => {
    const reason = call.endedReason || "Unknown";
    acc[reason] = (acc[reason] || 0) + 1;
    return acc;
  }, {});

  const total = Object.values(reasonCounts).reduce((a, b) => a + b, 0);

  // Convert to percentage representation
  const chartData = Object.entries(reasonCounts).map(([reason, count]) => ({
    name: reason,
    value: parseFloat(((count / total) * 100).toFixed(2)),
    count,
  }));

  // Aesthetic color palette
  const COLORS = [
    "#3b82f6", // blue
    "#22c55e", // green
    "#f97316", // orange
    "#e11d48", // rose
    "#a855f7", // purple
    "#14b8a6", // teal
    "#facc15", // yellow
  ];

  return (
    <div className="w-full h-[700px] md:h-[380px] pb-24 md:pb-16 p-5 border rounded-xl shadow-sm bg-white dark:bg-neutral-900">
      <div className="flex flex-col md:flex-row gap-2 justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">Cancellation Reasons (%)</h2>

        {/* Display Total Calls */}
        <p className="text-sm bg-blue-600 text-white px-3 py-1 rounded-md">
          Total Calls: <span className="font-semibold">{total}</span>
        </p>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={65}
            outerRadius={105}
            paddingAngle={4}
            stroke="none"
          >
            {chartData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip
            formatter={(value, _, props) => [
              `${value}% (${props.payload.count} calls)`,
              props.payload.name,
            ]}
            contentStyle={{
              background: "rgba(15, 223, 255, 0.8)",
              color: "#000000ff",
              borderRadius: "8px",
              border: "none",
              padding: "8px 12px",
            }}
          />

          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ paddingTop: "10px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
