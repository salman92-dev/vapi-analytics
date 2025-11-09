"use client";

import { useEffect, useState } from "react";
import { Loader2, User, Mail, Shield } from "lucide-react";

export default function UserInfo({ id }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/client-detail/${id}`);
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("❌ Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48 text-gray-500 dark:text-gray-300">
        <Loader2 className="animate-spin mr-2 w-6 h-6" />
        Loading user details...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 font-medium">
          No user found with this ID.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-2xl rounded-3xl p-8 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-gray-400/30 dark:hover:shadow-gray-800/40">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-blue-500/10 flex justify-center items-center">
          <User className="w-7 h-7 text-blue-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {user.full_name}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">ID: {user.id}</p>
        </div>
      </div>

      <div className="space-y-4 text-gray-700 dark:text-gray-300">
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-blue-500" />
          <span>{user.email}</span>
        </div>

        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-green-500" />
          <span className="capitalize">{user.role}</span>
        </div>

        <div className="mt-6 border-t border-gray-300 dark:border-gray-700 pt-4 text-sm text-gray-500 dark:text-gray-400">
          Joined on:{" "}
          <span className="font-medium text-gray-700 dark:text-gray-200">
            {new Date(user.created_at).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
