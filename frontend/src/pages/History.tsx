import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getHistory, clearHistory, deleteHistory, getCurrentUser } from "../services/auth";
import { FaTrash, FaSearch, FaFilter, FaShieldAlt, FaExclamationTriangle, FaHome } from "react-icons/fa";

function History() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;

  const [sidebarOpen, setSidebarOpen] = useState(() =>
    localStorage.getItem("sidebarOpen") !== "false"
  );
  const [history, setHistory] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    loadHistory();

    const handleUpdate = () => loadHistory();
    window.addEventListener("guardianx_scan_completed", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    const interval = setInterval(loadHistory, 3000);

    return () => {
      window.removeEventListener("guardianx_scan_completed", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
      clearInterval(interval);
    };
  }, []);

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
    return <span className="text-teal-400/60 text-[10px]">{status}</span>;
  };

  const typeIcon = (type: string) => {
    const map: Record<string, string> = { Email: "✉", URL: "🌐", SMS: "💬", File: "📄", Password: "🔑" };
    return map[type] || "📋";
  };

  const safeCount = history.filter(h => h.status === "Safe").length;
  const suspiciousCount = history.filter(h => h.status === "Suspicious").length;
  const phishingCount = history.filter(h => h.status === "Phishing").length;

  return (
    <div className="flex min-h-screen bg-[#080e18] text-white page-enter">
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed lg:static top-0 left-0 h-screen z-50 flex-shrink-0">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}
      <div className="flex-1 p-3 sm:p-6 overflow-y-auto min-w-0">
        <Topbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#111927]/90 border border-sky-500/20 rounded-2xl p-5 shadow-xl">
          <div>
            <h1 className="text-3xl font-bold font-serif-header text-sky-400 glow-text-cyan">Scan Audit History</h1>
            <p className="text-sky-400/60 text-xs mt-1">
              Isolated audit database for <span className="text-cyan-300 font-mono">{user.email}</span> — {history.length} records isolated
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#111927] border border-sky-500/30 text-sky-400 hover:bg-sky-500/20 text-xs font-cyber transition-all cursor-pointer font-semibold shadow-md"
            >
              <FaHome size={12} /> Dashboard
            </button>
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-2 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/25 text-rose-400 px-4 py-2 rounded-xl text-xs font-cyber transition-all cursor-pointer"
            >
              <FaTrash size={10} />
              Clear Records
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            { label: "Total Scans", value: history.length, color: "text-sky-400", bg: "border-sky-500/30" },
            { label: "Safe", value: safeCount, color: "text-emerald-400", bg: "border-emerald-500/30" },
            { label: "Suspicious", value: suspiciousCount, color: "text-amber-400", bg: "border-amber-500/30" },
            { label: "Phishing Threat", value: phishingCount, color: "text-rose-400", bg: "border-rose-500/30" },
          ].map((s) => (
            <div key={s.label} className={`bg-[#111927]/90 border ${s.bg} rounded-2xl p-4 hover-card-trigger shadow-lg`}>
              <p className="text-sky-400/60 text-[10px] font-cyber uppercase">{s.label}</p>
              <h2 className={`text-2xl font-bold font-cyber mt-1 ${s.color}`}>{s.value}</h2>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-400/60 text-xs" />
            <input
              type="text"
              placeholder="Search by filename, vector or verdict status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#111927] border border-sky-500/20 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none focus:border-sky-400 text-slate-200 font-mono"
            />
          </div>
          <div className="relative">
            <FaFilter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-400/60 text-xs" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-[#111927] border border-sky-500/20 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 font-cyber outline-none focus:border-sky-400 cursor-pointer"
            >
              <option>All</option>
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
        </div>

        {/* History Table */}
        <div className="glass-panel-cyan rounded-2xl border border-sky-500/20 mt-6 overflow-x-auto shadow-xl">
          <table className="w-full">
            <thead>
              <tr className="border-b border-sky-500/15 text-[10px] text-sky-400/60 font-cyber uppercase tracking-widest bg-[#080e18]">
                <th className="text-left px-4 py-3">Vector</th>
                <th className="text-left px-4 py-3">Source / File</th>
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
                      <FaShieldAlt className="text-emerald-900 text-4xl" />
                      <p className="font-cyber text-emerald-400/60 text-sm">No scan records found</p>
                      <p className="text-emerald-400/40 text-xs">Run a security scan to populate audit logs</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item, index) => (
                  <tr key={index} className="border-b border-emerald-500/10 hover:bg-[#0d1c15]/60 transition-all">
                    <td className="px-4 py-3 text-xs font-cyber font-semibold text-zinc-200">
                      <span className="mr-2">{typeIcon(item.scan_type)}</span>{item.scan_type}
                    </td>
                    <td className="px-4 py-3 text-xs text-emerald-300/70 font-mono max-w-[180px] truncate">
                      {item.filename || "—"}
                    </td>
                    <td className="px-4 py-3">{statusBadge(item.status)}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-bold font-cyber text-emerald-400">{item.confidence}%</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-emerald-400/60 font-mono whitespace-nowrap">
                      {new Date(item.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
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