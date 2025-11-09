'use client'
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, FileJson, FileText, Menu, X, Search, Phone, Calendar, MessageSquare, Bot, User } from "lucide-react";
import AudioPlayer from "@/app/client-dashboard-components/audio-player";

const Transcript = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch transcripts when bot is available
  useEffect(() => {
    const getSelectedBot = () => {
      const botStr = localStorage.getItem("selectedBot");
      return botStr ? JSON.parse(botStr) : null;
    };

    let currentBot = getSelectedBot();
    const fetchData = async (bot) => {
      if (!bot) return;

      setLoading(true);
      try {
        const res = await fetch('/api/vapi-calls', {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bot_id: bot.id })
        });
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error fetching transcripts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData(currentBot);

    const handleStorage = () => {
      const newBot = getSelectedBot();
      if (JSON.stringify(newBot) !== JSON.stringify(currentBot)) {
        currentBot = newBot;
        fetchData(currentBot);
      }
    };
    window.addEventListener("storage", handleStorage);

    const interval = setInterval(() => {
      const newBot = getSelectedBot();
      if (JSON.stringify(newBot) !== JSON.stringify(currentBot)) {
        currentBot = newBot;
        fetchData(currentBot);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search, data]);

  const parseTranscript = (transcript) =>
    transcript
      .split(/(?=AI:|User:)/g)
      .map(line => {
        const match = line.match(/^(AI|User):\s*(.*)$/s);
        if (!match) return null;
        return { speaker: match[1], text: match[2].trim() };
      })
      .filter(Boolean);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return "";
    }
  };

  const downloadTXT = (chatIndex) => {
    const transcript = data[chatIndex]?.transcript || "";
    const element = document.createElement("a");
    const file = new Blob([transcript], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `transcript_${chatIndex + 1}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadJSON = (chatIndex) => {
    const chatData = data[chatIndex];
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(chatData, null, 2)], { type: "application/json" });
    element.href = URL.createObjectURL(file);
    element.download = `transcript_${chatIndex + 1}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-700 font-semibold">Loading conversations...</p>
        </motion.div>
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <MessageSquare className="text-green-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Conversations Yet</h2>
          <p className="text-gray-600">Conversations will appear here once {`they're`} available</p>
        </motion.div>
      </div>
    );
  }

  const filtered = data.filter((item) =>
    item.summary?.toLowerCase().includes(search.toLowerCase()) ||
    item.transcript?.toLowerCase().includes(search.toLowerCase())
  );

  const selected = filtered[selectedIndex] || filtered[0];
  const messages = selected ? parseTranscript(selected.transcript) : [];

  return (
    <div className="flex md:h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/20 relative">

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -320 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`w-80 bg-white shadow-2xl flex flex-col border-r border-gray-200 z-50 fixed lg:relative inset-y-0 left-0 md:left-80 lg:translate-x-0`}
      >
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-black/80 mb-1">Conversations</h1>
              <p className="text-black-70 text-sm font-medium">
                {filtered.length} conversation{filtered.length !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200 bg-gray-50/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="overflow-y-auto flex-1">
          {filtered.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => {
                setSelectedIndex(index);
                setSidebarOpen(false);
              }}
              className={`p-4 cursor-pointer border-b border-gray-100 transition-all duration-200 ${
                index === selectedIndex 
                  ? "bg-green-50 border-l-4 border-l-green-600" 
                  : "hover:bg-gray-50 border-l-4 border-l-transparent"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone size={14} className={index === selectedIndex ? 'text-green-600' : 'text-gray-500'} />
                    <span className={`font-semibold text-sm ${index === selectedIndex ? 'text-green-900' : 'text-gray-800'}`}>
                      {item?.customer?.number}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar size={12} className="text-gray-400" />
                    <p className="text-xs text-gray-500">{formatDate(item.startedAt)}</p>
                  </div>
                  {item.summary && (
                    <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                      {item.summary}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Right Chat Panel */}
      <div className="flex-1 flex flex-col">

        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-5 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden absolute right-4 text-gray-600 p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="max-sm:ml-16">
              <div className="flex items-center gap-2 mb-1">
                <Phone size={18} className="text-green-600" />
                <h2 className="text-lg lg:text-xl font-bold text-gray-900">
                  {selected?.customer?.number}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-gray-400" />
                <p className="text-xs lg:text-sm text-gray-500">{formatDate(selected?.startedAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-4 lg:space-y-6">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`flex ${msg.speaker === "AI" ? "justify-start" : "justify-end"}`}
            >
              <div className={`flex items-start space-x-2 lg:space-x-3 max-w-[85%] lg:max-w-[75%] ${msg.speaker === "User" ? "flex-row-reverse space-x-reverse" : ""}`}>
                <div className={`flex-shrink-0 w-9 h-9 lg:w-11 lg:h-11 rounded-xl flex items-center justify-center text-lg lg:text-xl shadow-lg ${
                  msg.speaker === "AI" 
                    ? "bg-gradient-to-br from-green-500 to-emerald-600" 
                    : "bg-gradient-to-br from-blue-500 to-indigo-600 ml-2"
                }`}>
                  {msg.speaker === "AI" ? <Bot size={20} className="text-white"/>: <User size={20}className="text-white"/>}
                </div>
                <div className={`p-3 lg:p-4 rounded-2xl shadow-md ${
                  msg.speaker === "AI" 
                    ? "bg-white border-2 border-gray-200" 
                    : "bg-gradient-to-br from-green-600 to-emerald-600 text-white"
                }`}>
                  <p className={`text-sm leading-relaxed ${msg.speaker === "AI" ? "text-gray-800" : "text-white"}`}>
                    {msg.text}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-white">

          {/* Audio Player */}
          {selected?.recordingUrl && (
            <div className="px-4 lg:px-8 pt-4 lg:pt-6 pb-3 lg:pb-4">
              <div className="bg-gradient-to-br from-gray-50 to-green-50/30 rounded-2xl p-4 border-2 border-gray-200">
                <audio controls className="w-full" src={selected.recordingUrl}></audio>
              </div>
            </div>
          )}

          {/* Summary */}
          {selected?.summary && (
            <div className="px-4 lg:px-8 pb-3 lg:pb-4">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-4">
                <p className="text-xs font-bold text-green-800 mb-2 uppercase tracking-wide">Summary</p>
                <p className="text-sm text-green-900 leading-relaxed">{selected.summary}</p>
              </div>
            </div>
          )}

          {/* Download Buttons */}
          <div className="px-4 lg:px-8 py-4 lg:py-5 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                onClick={() => downloadTXT(selectedIndex)}
                className="group px-5 lg:px-6 py-3 border-2 border-gray-300 rounded-xl bg-white text-gray-700 text-sm font-semibold hover:bg-gray-50 hover:border-green-300 hover:text-green-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
              >
                <FileText size={18} className="group-hover:text-green-600 transition-colors" />
                Download TXT
              </button>
              <button
                onClick={() => downloadJSON(selectedIndex)}
                className="group px-5 lg:px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl text-sm font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <FileJson size={18} />
                Download JSON
              </button>
            </div>
          </div>

        </div>

      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

    </div>
  );
};

export default Transcript;