import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { getHistory, clearHistory, deleteHistory, getCurrentUser } from "../../services/auth";
import { FaTrash, FaSearch, FaFilter, FaShieldAlt, FaExclamationTriangle, FaHistory, FaChartPie } from "react-icons/fa";

function AdminHistory() {
  const user = getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/admin/login" replace />;
  }

  const [history, setHistory] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    loadHistory();
    const handleUpdate = () => loadHistory();
    window.addEventListener("guardianx_scan_completed", handleUpdate);
    const interval = setInterval(loadHistory, 5000);
    return () => {
      window.removeEventListener("guardianx_scan_completed", handleUpdate);
      clearInterval(interval);
    };
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getHistory();
      setHistory(data);
    } catch { console.log("No history"); }
  };

  const handleClearHistory = async () => {
    if (!window.confirm("Clear all scan history records?")) return;
    try { await clearHistory(); setHistory([]); }
    catch { alert("Unable to clear history."); }
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

  const safeCount     = history.filter(h => h.status === "Safe").length;
  const suspiciousCount = history.filter(h => h.status === "Suspicious").length;
  const phishingCount = history.filter(h => h.status === "Phishing").length;

  const statusBadge = (status: string) => {
    if (status === "Safe")       return <span className="inline-flex items-center gap-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-2.5 py-0.5 rounded-full text-[10px] font-cyber font-bold">● Safe</span>;
    if (status === "Suspicious") return <span className="inline-flex items-center gap-1 bg-amber-500/15 text-amber-400 border border-amber-500/25 px-2.5 py-0.5 rounded-full text-[10px] font-cyber font-bold">● Suspicious</span>;
    if (status === "Phishing")   return <span className="inline-flex items-center gap-1 bg-red-600/20 text-red-400 border border-red-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-cyber font-bold">● Phishing</span>;
    return <span className="text-zinc-500 text-[10px]">{status}</span>;
  };

  const typeIcon = (type: string) => {
    const map: Record<string, string> = { Email: "✉", URL: "🌐", SMS: "💬", File: "📄", Password: "🔑" };
    return map[type] || "📋";
  };

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-screen-xl mx-auto">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0f0609] border border-red-600/25 rounded-xl p-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-cyber uppercase tracking-widest text-red-400 px-2 py-0.5 rounded bg-red-600/15 border border-red-600/30">
                Admin — Scan History
              </span>
            </div>
            <h1 className="text-2xl font-bold font-cyber text-white">Scan Audit History</h1>
            <p className="text-zinc-500 text-xs mt-1">
              System-wide threat incident audit — <span className="text-red-300 font-mono">{history.length} records</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/admin/analytics"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-red-600/30 bg-red-600/10 hover:bg-red-600/20 text-red-300 text-xs font-cyber transition-all">
              <FaChartPie size={11} /> Analytics
            </Link>
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-cyber font-bold transition-all shadow-[0_0_10px_rgba(220,38,38,0.3)]">
              <FaTrash size={10} /> Clear All Records
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Scans",    value: history.length, color: "text-white" },
            { label: "Safe",           value: safeCount,      color: "text-emerald-400" },
            { label: "Suspicious",     value: suspiciousCount,color: "text-amber-400" },
            { label: "Phishing",       value: phishingCount,  color: "text-red-400" },
          ].map((s) => (
            <div key={s.label} className="bg-[#0f0609] border border-red-600/20 rounded-xl p-4 hover:border-red-600/35 transition-colors">
              <p className="text-[9px] text-zinc-500 font-cyber uppercase tracking-wider">{s.label}</p>
              <h2 className={`text-2xl font-bold font-cyber mt-1 ${s.color}`}>{s.value}</h2>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-red-400/60 text-xs" />
            <input
              type="text"
              placeholder="Search by scan type, file or verdict..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0f0609] border border-red-600/20 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none focus:border-red-500/60 text-zinc-200 font-mono"
            />
          </div>
          <div className="relative">
            <FaFilter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-red-400/60 text-xs" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-[#0f0609] border border-red-600/20 rounded-xl pl-9 pr-4 py-2.5 text-xs text-zinc-200 font-cyber outline-none focus:border-red-500/60 cursor-pointer"
            >
              <option>All</option>
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
        </div>

        {/* History Table */}
        <div className="bg-[#0f0609] border border-red-600/20 rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-red-600/15 flex items-center gap-2">
            <FaHistory className="text-red-400" size={13} />
            <span className="text-sm font-bold font-cyber text-zinc-200">Incident Audit Log</span>
            <span className="ml-auto text-[10px] bg-red-600/15 text-red-300 px-2 py-0.5 rounded border border-red-600/25 font-cyber">AUDIT CLEARANCE</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-red-600/15 text-[10px] text-zinc-500 font-cyber uppercase tracking-wider bg-[#0a0407]">
                  <th className="text-left px-5 py-3">Vector</th>
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
                    <td colSpan={6} className="text-center py-14">
                      <div className="flex flex-col items-center gap-2">
                        <FaShieldAlt className="text-red-900 text-3xl" />
                        <p className="font-cyber text-zinc-600 text-sm">No scan records found</p>
                        <p className="text-zinc-700 text-xs">Run a security scan to populate audit logs</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((item, index) => (
                    <tr key={index} className={`border-b border-red-600/10 hover:bg-red-600/5 transition-colors ${index % 2 === 0 ? "" : "bg-[#110709]"}`}>
                      <td className="px-5 py-3 font-cyber font-semibold text-zinc-200">
                        <span className="mr-2">{typeIcon(item.scan_type)}</span>{item.scan_type}
                      </td>
                      <td className="px-4 py-3 text-zinc-400 font-mono max-w-[180px] truncate">{item.filename || "—"}</td>
                      <td className="px-4 py-3">{statusBadge(item.status)}</td>
                      <td className="px-4 py-3 font-bold font-cyber text-red-300">{item.confidence}%</td>
                      <td className="px-4 py-3 text-zinc-500 font-mono whitespace-nowrap">
                        {new Date(item.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={async () => { await deleteHistory(item.id); loadHistory(); }}
                          className="bg-red-600/15 hover:bg-red-600/30 border border-red-500/25 text-red-400 px-3 py-1 rounded-lg text-[10px] font-cyber transition-all cursor-pointer flex items-center gap-1"
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
        </div>

        {phishingCount > 0 && (
          <div className="p-4 bg-red-600/10 border border-red-600/25 rounded-xl flex items-center gap-3">
            <FaExclamationTriangle className="text-red-400 flex-shrink-0" />
            <p className="text-xs text-red-300 font-cyber">
              {phishingCount} phishing threat{phishingCount > 1 ? "s" : ""} detected. Review and clear if needed.
            </p>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}

export default AdminHistory;
