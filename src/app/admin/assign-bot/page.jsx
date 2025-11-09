"use client";

import { useState } from "react";
import { Bot, Link2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AssignBotPage() {
  const [formData, setFormData] = useState({
    bot_name: "",
    email: "",
    vapi_private_api_key: "",
    assistant_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/add-bot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to assign bot");

      setMessage({ type: "success", text: data.message });
      setFormData({ email: "", vapi_private_api_key: "", assistant_id: "", bot_name: "" });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 w-full max-w-md text-gray-900 dark:text-gray-100">
        <h1 className="text-2xl font-semibold text-center mb-6 flex items-center justify-center gap-2">
          <Bot className="w-6 h-6 text-green-600" /> Assign Bot to User
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Bot Name</label>
            <input
              type="text"
              name="bot_name"
              value={formData.bot_name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Julie"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">User Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="user@example.com"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Vapi Private API Key</label>
            <input
              type="text"
              name="vapi_private_api_key"
              value={formData.vapi_private_api_key}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="xxxxxx"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Assistant ID</label>
            <input
              type="text"
              name="assistant_id"
              value={formData.assistant_id}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="xxxxxx"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" /> Assigning...
              </>
            ) : (
              <>
                <Link2 className="w-4 h-4" /> Assign Bot
              </>
            )}
          </Button>
        </form>

        {message && (
          <div
            className={`mt-4 text-center text-sm font-medium ${
              message.type === "success"
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}
