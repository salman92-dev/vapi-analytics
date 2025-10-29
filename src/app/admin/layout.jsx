"use client";
import { useState,useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";

export default function AdminLayout({children}) {
  const [darkMode, setDarkMode] = useState(false);

    // ✅ Load theme from localStorage on mount
   useEffect(() => {
  const savedTheme = localStorage.getItem("theme");

  queueMicrotask(() => {
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  });
}, []);


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
        <>
          {/* <div className="fixed inset-0 z-30" /> */}
          <div className="fixed z-40">
            <Sidebar />
          </div>
        </>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Page Content */}
        <main className="flex-1 w-[100%] md:w-[80%] ml-auto bg-white dark:bg-black">{children}</main>
      </div>
    </div>
  );
}