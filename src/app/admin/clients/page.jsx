"use client";

import { useEffect, useState } from "react";
import { Loader2, Trash2, Eye, X } from "lucide-react";
import UserInfo from "@/app/web-components/user-info";

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    async function fetchClients() {
      try {
        const res = await fetch("/api/users");
        if (!res.ok) throw new Error("Failed to fetch clients");
        const data = await res.json();
        setClients(data);
      } catch (err) {
        console.error("❌ Error fetching clients:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchClients();
  }, []);

  const WatchUser = (id) => setSelectedUserId(id);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 dark:text-gray-300">
        <Loader2 className="animate-spin h-6 w-6 mr-2" />
        Loading clients...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-8 text-gray-900 dark:text-gray-100">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-4xl font-semibold text-center mb-8">
          👥 All Clients
        </h1>

        {clients.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 text-lg">
            No clients found.
          </p>
        ) : (
          <div className="overflow-hidden rounded-2xl shadow-lg bg-white dark:bg-gray-800">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 dark:bg-gray-700/50">
                <tr className="text-gray-700 dark:text-gray-200">
                  <th className="py-4 px-6 font-medium">#</th>
                  <th className="py-4 px-6 font-medium">Client Name</th>
                  <th className="py-4 px-6 font-medium">Email</th>
                  <th className="py-4 px-6 font-medium">Role</th>
                  <th className="py-4 px-6 font-medium">Created At</th>
                  <th className="py-4 px-6 font-medium text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client, index) => (
                  <tr
                    key={client.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200"
                  >
                    <td className="py-3 px-6 text-gray-700 dark:text-gray-300">
                      {index + 1}
                    </td>
                    <td className="py-3 px-6 font-medium">{client.full_name}</td>
                    <td className="py-3 px-6 text-sm">{client.email}</td>
                    <td className="py-3 px-6 capitalize">{client.role}</td>
                    <td className="py-3 px-6 text-sm">
                      {new Date(client.created_at).toLocaleString()}
                    </td>
                    <td className="py-3 px-6 flex justify-center gap-4">
                      <button
                        title="Delete"
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition"
                      >
                        <Trash2 className="h-5 w-5 text-red-500 hover:scale-110 transition-transform" />
                      </button>
                      <button
                        title="View Details"
                        onClick={() => WatchUser(client.id)}
                        className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 transition"
                      >
                        <Eye className="h-5 w-5 text-green-600 hover:scale-110 transition-transform" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- User Info Modal --- */}
        {selectedUserId && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
            <div className="relative rounded-2xl shadow-2xl p-6 w-full max-w-lg mx-4 dark:border-gray-700 animate-fadeIn">
              <button
                onClick={() => setSelectedUserId(null)}
                className="absolute top-8 right-10 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <X className="h-6 w-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
              </button>
              <UserInfo id={selectedUserId} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
