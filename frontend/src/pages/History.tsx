import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getHistory, clearHistory, deleteHistory, getCurrentUser } from "../services/auth";
import { FaTrash, FaSearch, FaFilter, FaShieldAlt, FaExclamationTriangle } from "react-icons/fa";

function History() {
  const user = getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;

  const [sidebarOpen, setSidebarOpen] = useState(() =>
    localStorage.getItem("sidebarOpen") !== "false"
  );
  const [history, setHistory] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => { loadHistory(); }, []);
  useEffect(() => {
    localStorage.setItem("sidebarOpen", String(sidebarOpen));
  }, [sidebarOpen]);

  const loadHistory = async () => {
    try {
      const data = await getHistory();
      setHistory(data);
    } catch (error) { console.log(error); }
  };

  const handleClearHistory = async () => {
    if (!window.confirm("Are you sure you want to clear all history?")) return;
    try {
      await clearHistory();
      setHistory([]);
    } catch { alert("Unable to clear history."); }
  };

  const filteredHistory = history.filter((item) => {
    const matchSearch =
      item.filename?.toLowerCase().includes(search.toLowerCase()) ||
      item.scan_type?.toLowerCase().includes(search.toLowerCase()) ||
      item.status?.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (filter === "All") return true;
    const itemDate = new Date(item.created_at);
    const today = new Date();
    if (filter === "Today") return itemDate.toDateString() === today.toDateString();
    if (filter === "This Week") { const w = new Date(); w.setDate(today.getDate() - 7); return itemDate >= w; }
    if (filter === "This Month") return itemDate.getMonth() === today.getMonth() && itemDate.getFullYear() === today.getFullYear();
    return true;
  });

  const statusBadge = (status: string) => {
    if (status === "Safe") return <span className="inline-flex items-center gap-1.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-2.5 py-1 rounded-full text-[10px] font-cyber font-bold">● Safe</span>;
    if (status === "Suspicious") return <span className="inline-flex items-center gap-1.5 bg-amber-500/15 text-amber-400 border border-amber-500/25 px-2.5 py-1 rounded-full text-[10px] font-cyber font-bold">● Suspicious</span>;
    if (status === "Phishing") return <span className="inline-flex items-center gap-1.5 bg-red-500/15 text-red-400 border border-red-500/25 px-2.5 py-1 rounded-full text-[10px] font-cyber font-bold">● Phishing</span>;
    return <span className="text-zinc-500 text-[10px]">{status}</span>;
  };

  const typeIcon = (type: string) => {
    const map: Record<string, string> = { Email: "✉", URL: "🌐", SMS: "💬", File: "📄", Password: "🔑" };
    return map[type] || "📋";
  };

  const safeCount = history.filter(h => h.status === "Safe").length;
  const suspiciousCount = history.filter(h => h.status === "Suspicious").length;
  const phishingCount = history.filter(h => h.status === "Phishing").length;

  return (
    <div className="flex min-h-screen bg-[#070709] text-white page-enter">
      {sidebarOpen && <Sidebar />}
      <div className="flex-1 p-5 overflow-y-auto">
        <Topbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="mt-8 flex flex-col lg:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold font-cyber text-cyan-400 glow-text-cyan">Scan History</h1>
            <p className="text-zinc-500 text-xs mt-1">
              Isolated database for <span className="text-cyan-400 font-mono">{user.email}</span> — {history.length} records
            </p>
          </div>
          <button
            onClick={handleClearHistory}
            className="flex items-center gap-2 bg-red-500/15 hover:bg-red-500/25 border border-red-500/25 text-red-400 px-4 py-2 rounded-lg text-xs font-cyber transition-all cursor-pointer"
          >
            <FaTrash size={10} />
            Clear All Records
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            { label: "Total", value: history.length, color: "text-cyan-400", bg: "border-cyan-500/20" },
            { label: "Safe", value: safeCount, color: "text-emerald-400", bg: "border-emerald-500/20" },
            { label: "Suspicious", value: suspiciousCount, color: "text-amber-400", bg: "border-amber-500/20" },
            { label: "Phishing", value: phishingCount, color: "text-red-400", bg: "border-red-500/20" },
          ].map((s) => (
            <div key={s.label} className={`bg-[#0e0e11]/80 border ${s.bg} rounded-xl p-4 hover-card-trigger`}>
              <p className="text-zinc-500 text-[10px] font-cyber uppercase">{s.label}</p>
              <h2 className={`text-2xl font-bold font-cyber mt-1 ${s.color}`}>{s.value}</h2>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs" />
            <input
              type="text"
              placeholder="Search by file, type or status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0e0e11] border border-zinc-800 rounded-lg pl-8 pr-4 py-2.5 text-xs outline-none focus:border-cyan-500 text-zinc-300 font-mono"
            />
          </div>
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-[#0e0e11] border border-zinc-800 rounded-lg pl-8 pr-4 py-2.5 text-xs text-zinc-300 font-cyber outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option>All</option>
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
        </div>

        {/* History Table */}
        <div className="glass-panel-cyan rounded-xl border border-cyan-500/15 mt-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800 text-[10px] text-zinc-500 font-cyber uppercase tracking-widest">
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-left px-4 py-3">Source</th>
                <th className="text-left px-4 py-3">Verdict</th>
                <th className="text-left px-4 py-3">Confidence</th>
                <th className="text-left px-4 py-3">Timestamp</th>
                <th className="text-left px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <FaShieldAlt className="text-zinc-700 text-4xl" />
                      <p className="font-cyber text-zinc-500 text-sm">No scan records found</p>
                      <p className="text-zinc-600 text-xs">Run a scan to see results here</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item, index) => (
                  <tr key={index} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-all">
                    <td className="px-4 py-3 text-xs font-cyber font-semibold text-zinc-300">
                      <span className="mr-2">{typeIcon(item.scan_type)}</span>{item.scan_type}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-500 font-mono max-w-[180px] truncate">
                      {item.filename || "—"}
                    </td>
                    <td className="px-4 py-3">{statusBadge(item.status)}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-bold font-cyber text-cyan-400">{item.confidence}%</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-500 font-mono whitespace-nowrap">
                      {new Date(item.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={async () => { await deleteHistory(item.id); loadHistory(); }}
                        className="bg-red-500/10 hover:bg-red-500/25 border border-red-500/20 text-red-400 px-3 py-1.5 rounded-lg text-[10px] font-cyber transition-all cursor-pointer flex items-center gap-1"
                      >
                        <FaTrash size={9} /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {phishingCount > 0 && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
            <FaExclamationTriangle className="text-red-400" />
            <p className="text-xs text-red-300 font-cyber">
              {phishingCount} phishing threat{phishingCount > 1 ? "s" : ""} detected in this session. Review and clear if needed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default History;