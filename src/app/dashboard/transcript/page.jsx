'use client'
import { useState, useEffect } from "react";

const Transcript = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [bot, setBot] = useState(null);

 

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

  // Clean up
  return () => {
    clearInterval(interval);
    window.removeEventListener("storage", handleStorage);
  };


  }, []);

  // Reset selectedIndex when data or search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search, data]);

  // Parse transcript text into array of { speaker, text }
  const parseTranscript = (transcript) =>
    transcript
      .split(/(?=AI:|User:)/g)
      .map(line => {
        const match = line.match(/^(AI|User):\s*(.*)$/s);
        if (!match) return null;
        return { speaker: match[1], text: match[2].trim() };
      })
      .filter(Boolean);

  // Format timestamp
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

  // Download transcript as TXT
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

  // Download transcript as JSON
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
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading transcripts...</p>
        </div>
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-slate-600 text-lg">No transcripts found</p>
        </div>
      </div>
    );
  }

  // Filter data based on search
  const filtered = data.filter((item) =>
    item.summary?.toLowerCase().includes(search.toLowerCase()) ||
    item.transcript?.toLowerCase().includes(search.toLowerCase())
  );

  const selected = filtered[selectedIndex] || filtered[0];
  const messages = selected ? parseTranscript(selected.transcript) : [];

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 relative">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`w-80 bg-white shadow-xl flex flex-col border-r border-slate-200 z-50
        fixed lg:relative inset-y-0 left-0 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Conversations</h1>
              <p className="text-blue-100 text-sm">{filtered.length} conversation{filtered.length !== 1 ? 's' : ''}</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-200">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="overflow-y-auto flex-1">
          {filtered.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                setSelectedIndex(index);
                setSidebarOpen(false);
              }}
              className={`p-4 cursor-pointer border-b border-slate-100 transition-all duration-200 ${
                index === selectedIndex ? "bg-blue-50 border-l-4 border-l-blue-600" : "hover:bg-slate-50 border-l-4 border-l-transparent"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <span className={`font-semibold ${index === selectedIndex ? 'text-blue-900' : 'text-slate-800'}`}>
                    Phone Number : {item?.customer?.number}
                  </span>
                  <p className="text-xs text-slate-500 mt-1">{formatDate(item.startedAt)}</p>
                  {item.summary && <p className="text-xs text-slate-600 mt-2 line-clamp-2">{item.summary}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Chat Panel */}
      <div className="flex-1 flex flex-col">

        {/* Chat Header */}
        <div className="bg-white border-b border-slate-200 px-4 lg:px-8 py-4 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden absolute right-2 text-slate-600 p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="max-sm:ml-16">
              <h2 className="text-lg lg:text-xl font-bold text-slate-800">Phone: {selected?.customer?.number}</h2>
              <p className="text-xs lg:text-sm text-slate-500 mt-1">{formatDate(selected?.startedAt)}</p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-4 lg:space-y-6">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.speaker === "AI" ? "justify-start" : "justify-end"} animate-fade-in`}
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className={`flex items-start space-x-2 lg:space-x-3 max-w-[85%] lg:max-w-[75%] ${msg.speaker === "User" ? "flex-row-reverse space-x-reverse" : ""}`}>
                <div className={`flex-shrink-0 w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-lg lg:text-xl shadow-md ${
                  msg.speaker === "AI" ? "bg-gradient-to-br from-blue-500 to-indigo-600" : "bg-gradient-to-br from-green-500 to-emerald-600"
                }`}>
                  {msg.speaker === "AI" ? "🤖" : "👤"}
                </div>
                <div className={`p-3 lg:p-4 rounded-2xl shadow-sm ${
                  msg.speaker === "AI" ? "bg-white border border-slate-200" : "bg-gradient-to-br from-blue-600 to-indigo-600 text-white"
                }`}>
                  <p className={`text-sm leading-relaxed ${msg.speaker === "AI" ? "text-slate-800" : "text-white"}`}>{msg.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer: Audio, Summary, Download */}
        <div className="border-t border-slate-200 bg-white">

          {/* Audio Player */}
          {selected?.recordingUrl && (
            <div className="px-4 lg:px-8 pt-4 lg:pt-6 pb-3 lg:pb-4">
              <div className="bg-slate-50 rounded-xl p-3 lg:p-4 border border-slate-200">
                <audio controls className="w-full" src={selected.recordingUrl}></audio>
              </div>
            </div>
          )}

          {/* Summary */}
          {selected?.summary && (
            <div className="px-4 lg:px-8 pb-3 lg:pb-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 lg:p-4">
                <p className="text-xs font-semibold text-amber-800 mb-1">Summary</p>
                <p className="text-xs lg:text-sm text-amber-900 leading-relaxed">{selected.summary}</p>
              </div>
            </div>
          )}

          {/* Download Buttons */}
          <div className="px-4 lg:px-8 py-3 lg:py-4 bg-slate-50 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row gap-2 lg:gap-3 sm:justify-end">
              <button
                onClick={() => downloadTXT(selectedIndex)}
                className="px-4 lg:px-5 py-2 lg:py-2.5 border border-slate-300 rounded-lg bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
              >
                Download TXT
              </button>
              <button
                onClick={() => downloadJSON(selectedIndex)}
                className="px-4 lg:px-5 py-2 lg:py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                Download JSON
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
          opacity: 0;
        }
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
