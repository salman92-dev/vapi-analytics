"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, BarChart3 } from "lucide-react";

export default function BotStatsPage() {
  const { id } = useParams();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`/api/bot-stats/${id}/`)
      .then((res) => res.json())
      .then(setStats);
  }, [id]);

  if (!stats)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        <Loader2 className="animate-spin w-6 h-6 mr-2" /> Loading bot stats...
      </div>
    );

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-4">
        <BarChart3 className="w-6 h-6 text-green-600" /> Bot Statistics
      </h1>
      {/* Display charts, usage, etc */}
      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl">
        {JSON.stringify(stats, null, 2)}
      </pre>
    </div>
  );
}
