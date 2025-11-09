'use client'
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Phone, Calendar, Menu, X, Download, 
  FileText, FileJson, PlayCircle, PauseCircle,
  ChevronLeft, Clock, User, Bot,
  MessageSquare, CheckCircle2, Shield,
  LayoutDashboard, BarChart2
} from "lucide-react";
import Link from "next/link";

const TranscriptRedesigned = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [role, setRole] = useState(null);

  // Load role from localStorage
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setRole(JSON.parse(user).role);
    }
  }, []);

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
      ?.split(/(?=AI:|User:)/g)
      .map(line => {
        const match = line.match(/^(AI|User):\s*(.*)$/s);
        if (!match) return null;
        return { speaker: match[1], text: match[2].trim() };
      })
      .filter(Boolean) || [];

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

  const calculateDuration = (startedAt, endedAt) => {
    if (!startedAt || !endedAt) return "0:00";
    const start = new Date(startedAt);
    const end = new Date(endedAt);
    const diffMs = end - start;
    const minutes = Math.floor(diffMs / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'voicemail': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'missed': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCallStatus = (call) => {
    if (!call) return 'unknown';
    if (call.endedReason === 'voicemail') return 'voicemail';
    if (call.endedReason === 'customer-ended-call' || call.status === 'ended') return 'completed';
    return 'completed';
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
    item.transcript?.toLowerCase().includes(search.toLowerCase()) ||
    item.customer?.number?.toLowerCase().includes(search.toLowerCase())
  );

  const selected = filtered[selectedIndex] || filtered[0];
  const messages = selected ? parseTranscript(selected.transcript) : [];

  // Calculate stats
  const completedCalls = data.filter(call => getCallStatus(call) === 'completed').length;
  const voicemailCalls = data.filter(call => getCallStatus(call) === 'voicemail').length;
  const missedCalls = data.filter(call => !call.endedAt).length;

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/20 overflow-hidden">
      
      {/* Left Sidebar - Slim Navigation */}
      {/* <div className="hidden lg:flex flex-col w-20 bg-white border-r border-gray-200 shadow-sm">
        <div className="flex items-center justify-center h-20 border-b border-gray-200 bg-gradient-to-br from-green-600 to-emerald-600">
          <span className="text-2xl font-bold text-white">E</span>
        </div>
        
        <nav className="flex-1 py-6 space-y-2 px-3">
          <Link href="/dashboard">
            <motion.button
              whileHover={{ x: 2 }}
              className="w-full p-3 rounded-xl flex items-center justify-center transition-all text-gray-600 hover:bg-gray-100"
              title="Dashboard"
            >
              <LayoutDashboard size={22} />
            </motion.button>
          </Link>
          <Link href="/dashboard/analytics">
            <motion.button
              whileHover={{ x: 2 }}
              className="w-full p-3 rounded-xl flex items-center justify-center transition-all text-gray-600 hover:bg-gray-100"
              title="Analytics"
            >
              <BarChart2 size={22} />
            </motion.button>
          </Link>
          <Link href="/dashboard/conversation">
            <motion.button
              whileHover={{ x: 2 }}
              className="w-full p-3 rounded-xl flex items-center justify-center transition-all bg-green-100 text-green-700"
              title="Conversations"
            >
              <Phone size={22} />
            </motion.button>
          </Link>
          {role === "admin" && (
            <Link href="/admin">
              <motion.button
                whileHover={{ x: 2 }}
                className="w-full p-3 rounded-xl flex items-center justify-center transition-all text-gray-600 hover:bg-gray-100"
                title="Admin"
              >
                <Shield size={22} />
              </motion.button>
            </Link>
          )}
        </nav>

        <div className="p-3 border-t border-gray-200">
          <button className="w-full p-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div> */}

      {/* Conversations List Panel */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -400 }}
            animate={{ x: 0 }}
            exit={{ x: -400 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full lg:w-96 bg-white border-r border-gray-200 flex flex-col shadow-xl z-40 fixed lg:relative inset-y-0 left-0"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Conversations</h1>
                  <p className="text-sm text-gray-500 mt-1">{filtered.length} total calls</p>
                </div>
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                />
              </div>
            </div>

            {/* Stats Overview */}
            {/* <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">{completedCalls}</div>
                  <div className="text-xs text-gray-600 mt-0.5">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-amber-600">{voicemailCalls}</div>
                  <div className="text-xs text-gray-600 mt-0.5">Voicemail</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-red-600">{missedCalls}</div>
                  <div className="text-xs text-gray-600 mt-0.5">Missed</div>
                </div>
              </div>
            </div> */}

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              {filtered.map((conv, index) => {
                const status = getCallStatus(conv);
                const duration = calculateDuration(conv.startedAt, conv.endedAt);
                
                return (
                  <motion.div
                    key={conv.id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      setSelectedIndex(index);
                      setSidebarOpen(false);
                    }}
                    className={`p-4 cursor-pointer border-b border-gray-100 transition-all ${
                      index === selectedIndex 
                        ? "bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-l-green-600" 
                        : "hover:bg-gray-50 border-l-4 border-l-transparent"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                        index === selectedIndex ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <Phone size={20} className={index === selectedIndex ? 'text-green-600' : 'text-gray-600'} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-semibold text-sm truncate ${
                            index === selectedIndex ? 'text-green-900' : 'text-gray-900'
                          }`}>
                            {conv.customer?.number || 'Unknown'}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(status)}`}>
                            {status}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <Calendar size={12} className="text-gray-400" />
                          <span className="text-xs text-gray-500">{formatDate(conv.startedAt)}</span>
                          <Clock size={12} className="text-gray-400 ml-2" />
                          <span className="text-xs text-gray-500">{duration}</span>
                        </div>

                        {conv.summary && (
                          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                            {conv.summary}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-white">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-white to-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                {sidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
              </button>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Phone size={18} className="text-green-600" />
                  <h2 className="text-xl font-bold text-gray-900">{selected?.customer?.number || 'Unknown'}</h2>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{formatDate(selected?.startedAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{calculateDuration(selected?.startedAt, selected?.endedAt)}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(getCallStatus(selected))}`}>
                    {getCallStatus(selected)}
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <button 
                onClick={() => downloadTXT(selectedIndex)}
                className="px-4 py-2 text-sm font-medium text-gray-700 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2"
              >
                <FileText size={16} />
                TXT
              </button>
              <button 
                onClick={() => downloadJSON(selectedIndex)}
                className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all flex items-center gap-2 shadow-lg"
              >
                <FileJson size={16} />
                JSON
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50/50 to-white">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.length > 0 ? (
              messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`flex ${msg.speaker === "AI" ? "justify-start" : "justify-end"}`}
                >
                  <div className={`flex items-start gap-3 max-w-[75%] ${msg.speaker === "User" ? "flex-row-reverse" : ""}`}>
                    {/* Avatar */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${
                      msg.speaker === "AI" 
                        ? "bg-gradient-to-br from-green-500 to-emerald-600" 
                        : "bg-gradient-to-br from-blue-500 to-indigo-600"
                    }`}>
                      {msg.speaker === "AI" ? <Bot size={20} className="text-white" /> : <User size={20} className="text-white" />}
                    </div>

                    {/* Message Bubble */}
                    <div className={`relative ${msg.speaker === "AI" ? "" : "items-end"}`}>
                      <div className={`px-4 py-3 rounded-2xl shadow-sm ${
                        msg.speaker === "AI" 
                          ? "bg-white border border-gray-200" 
                          : "bg-gradient-to-br from-green-600 to-emerald-600 text-white"
                      }`}>
                        <p className={`text-sm leading-relaxed ${msg.speaker === "AI" ? "text-gray-800" : "text-white"}`}>
                          {msg.text}
                        </p>
                      </div>
                      {msg.speaker === "AI" && (
                        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-white border-l border-b border-gray-200 transform rotate-45"></div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No messages in this conversation</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-white">
          
          {/* Audio Player */}
          {selected?.recordingUrl && (
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-green-50/30 rounded-2xl border border-gray-200">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center text-white hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
                  >
                    {isPlaying ? <PauseCircle size={24} /> : <PlayCircle size={24} />}
                  </button>
                  <div className="flex-1">
                    <audio 
                      controls 
                      className="w-full" 
                      src={selected.recordingUrl}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    />
                  </div>
                  <a 
                    href={selected.recordingUrl} 
                    download
                    className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Download size={20} />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Summary */}
          {selected?.summary && (
            <div className="px-6 py-4">
              <div className="max-w-4xl mx-auto">
                <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 border-2 border-green-200 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                      <CheckCircle2 size={18} className="text-white" />
                    </div>
                    <h3 className="text-sm font-bold text-green-900 uppercase tracking-wide">Call Summary</h3>
                  </div>
                  <p className="text-sm text-green-900 leading-relaxed">
                    {selected.summary}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Download Buttons */}
          <div className="px-6 py-4 md:hidden bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col gap-3">
              <button
                onClick={() => downloadTXT(selectedIndex)}
                className="px-5 py-3 border-2 border-gray-300 rounded-xl bg-white text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                <FileText size={18} />
                Download TXT
              </button>
              <button
                onClick={() => downloadJSON(selectedIndex)}
                className="px-5 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl text-sm font-semibold hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg"
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

export default TranscriptRedesigned;