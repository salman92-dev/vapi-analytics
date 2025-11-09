"use client";
import { useEffect, useState } from "react";
import { Loader2, User, Bot, Menu, X,Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function Conversation() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false); // ✅ mobile toggle state


  useEffect(() => {
    const getSelectedBot = () => {
      const botStr = localStorage.getItem("selectedBot");
      return botStr ? JSON.parse(botStr) : null;
    };

    const currentBot = getSelectedBot();
  
    if (!currentBot) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/vapi-chats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bot_id: currentBot.id }),
        });

        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error fetching chats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🧹 Clean and format bot message
  const cleanMessage = (text = "") => {
    return text
      .replace(/{{firstName}}/gi, "dear")
      .replace(/<say-as[^>]*>/gi, "") // remove opening say-as tags
      .replace(/<\/say-as>/gi, "") // remove closing tags
      .replace(/<[^>]+>/g, "") // remove any other HTML-like tags
      .replace(/{{name}}/gi, "dear") // remove any other HTML-like tags
      .replace(/\[Your Name\]/g, "AI Assistant")// remove any other HTML-like tags
      .trim();
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 dark:text-white">
        <Loader2 className="animate-spin mr-2" /> Loading conversations...
      </div>
    );

  return (
    <div className="bg-gray-200  md:px-2 md:py-2 relative flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* ====== Hamburger Button (Mobile Only) ====== */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className={`md:hidden fixed top-3 right-4 z-30 bg-gray-600 text-white p-2 rounded-full shadow`}
      >
        <Plus size={20} className={`${showSidebar? "transition duration-300 rotate-45" : "transition duration-300 rotate-0" }`}/>
      </button>

      {/* ====== Sidebar ====== */}
      <div
        className={`fixed md:static top-0 md:rounded-md mr-2 left-0 h-full md:h-auto z-50 transform transition-transform duration-300 ease-in-out
        w-64 md:w-72 bg-white dark:bg-neutral-800 shadow-md overflow-y-auto border-r
        ${showSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white p-4 flex justify-between items-center border-b">
          <h2 className="font-bold text-lg text-gray-800 dark:text-white">
            Chats ({data.length})
          </h2>
          {/* Close Button on Mobile */}
          <button
            onClick={() => setShowSidebar(false)}
            className="md:hidden text-gray-600 dark:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        {/* Chat List */}
        {data.map((conv, i) => {
          const messages = Object.values(conv);
          return (
            <div
              key={i}
              onClick={() => {
                setSelectedIndex(i);
                setShowSidebar(false); // auto-close on mobile
              }}
              className={`p-4 cursor-pointer border-b hover:bg-gray-200 dark:hover:bg-neutral-700 ${
                i === selectedIndex ? "bg-gray-200 dark:bg-neutral-700" : ""
              }`}
            >
              <p className="font-semibold text-gray-800 dark:text-white">
                Conversation {i + 1}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {cleanMessage(messages[0]?.content) || "No preview"}
              </p>
            </div>
          );
        })}
      </div>

      {/* ====== Dark Overlay (Mobile) ====== */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm bg-opacity-40 md:hidden z-10"
          onClick={() => setShowSidebar(false)}
        ></div>
      )}

      {/* ====== Chat View ====== */}
      <div className="flex-1 flex flex-col rounded-md bg-gray-50 dark:bg-neutral-900 relative">
        <div className="sticky top-0 p-4 rounded-tl-md rounded-tr-md py-5 border-b bg-white dark:bg-neutral-800 shadow-md text-gray-800 dark:text-white font-semibold flex justify-center md:justify-start">
          Conversation {selectedIndex + 1}
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {Object.values(data[selectedIndex] || {}).map((msg, j) => {
            const cleaned = cleanMessage(msg.content);
            const isUser = msg.role === "user";

            return (
              <motion.div
                key={j}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex items-start gap-2 md:max-w-[80%] ${
                    isUser ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shadow ${
                      isUser
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 dark:bg-neutral-700 dark:text-white text-gray-800"
                    }`}
                  >
                    {isUser ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div
                    className={`px-4 py-2 rounded-2xl text-sm shadow-sm break-words ${
                      isUser
                        ? "bg-green-500 text-white rounded-br-none w-auto"
                        : "w-[80%] bg-white dark:bg-neutral-700 dark:text-white text-black rounded-bl-none"
                    }`}
                  >
                    {cleaned}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
