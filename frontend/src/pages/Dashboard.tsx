import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Navigate, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatsCard from "../components/StatsCard";
import DashboardCharts from "../components/dashboardcharts";
import { getAnalytics, getHistory, clearHistory, getCurrentUser } from "../services/auth";
import {
  FaEnvelope, FaGlobe, FaSms, FaBug, FaShieldAlt,
  FaTrash, FaArrowRight
} from "react-icons/fa";

function Dashboard() {
  const user = getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;

  const [sidebarOpen, setSidebarOpen] = useState(() =>
    localStorage.getItem("sidebarOpen") !== "false"
  );
  const [analytics, setAnalytics] = useState({
    emails: 0, urls: 0, sms: 0, threats: 0, total_scans: 0,
    security_score: 100, risk_level: "LOW",
    firewall_status: "PROTECTED", scanner_status: "READY",
    database_status: "ONLINE", session_status: "SECURE",
    last_sync: "", weekly_trend: [],
  });
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => { loadDashboard(); }, []);
  useEffect(() => {
    localStorage.setItem("sidebarOpen", String(sidebarOpen));
  }, [sidebarOpen]);

  const loadDashboard = async () => {
    const cache = localStorage.getItem("guardianx_dashboard");
    if (cache) {
      const data = JSON.parse(cache);
      setAnalytics(data.analytics);
      setHistory(data.history);
      localStorage.removeItem("guardianx_dashboard");
      return;
    }
    try {
      const analyticsData = await getAnalytics(user.id);
      setAnalytics(analyticsData);
      const historyData = await getHistory();
      setHistory(historyData);
    } catch (error) { console.log(error); }
  };

  const handleClearHistory = async () => {
    if (!window.confirm("Clear all scan history?")) return;
    try {
      await clearHistory();
      await loadDashboard();
    } catch { alert("Unable to clear history."); }
  };

  const totalScans = analytics.emails + analytics.urls + analytics.sms;

  const riskColor =
    analytics.risk_level === "HIGH" ? "text-red-500" :
    analytics.risk_level === "MEDIUM" ? "text-amber-400" : "text-emerald-400";

  const scoreColor =
    analytics.security_score >= 80 ? "text-emerald-400" :
    analytics.security_score >= 50 ? "text-amber-400" : "text-red-500";

  const statusBadge = (status: string) => {
    if (status === "Safe") return <span className="inline-flex items-center gap-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded-full text-[10px] font-cyber font-bold">● Safe</span>;
    if (status === "Suspicious") return <span className="inline-flex items-center gap-1 bg-amber-500/15 text-amber-400 border border-amber-500/25 px-2 py-0.5 rounded-full text-[10px] font-cyber font-bold">● Suspicious</span>;
    if (status === "Phishing") return <span className="inline-flex items-center gap-1 bg-red-500/15 text-red-400 border border-red-500/25 px-2 py-0.5 rounded-full text-[10px] font-cyber font-bold">● Phishing</span>;
    return <span className="text-zinc-500 text-[10px]">{status}</span>;
  };

  return (
    <div className="flex min-h-screen bg-[#070709] text-white page-enter">
      {sidebarOpen && <Sidebar />}
      <div className="flex-1 p-5 overflow-y-auto">
        <Topbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Welcome Banner */}
        <motion.div
          className="mt-8 glass-panel-cyan rounded-xl border border-cyan-500/15 p-5 flex flex-col lg:flex-row justify-between items-start gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <p className="text-[10px] font-cyber uppercase text-zinc-500 tracking-widest">Security Dashboard</p>
            <h1 className="text-xl font-bold font-cyber mt-1">
              Welcome back,{" "}
              <span className="text-cyan-400 glow-text-cyan">{user?.name || "Agent"}</span>
            </h1>
            <p className="text-xs text-zinc-500 mt-1 font-mono">
              {user?.email} · Last login:{" "}
              <span className="text-emerald-400">
                {user?.last_login ? new Date(user.last_login).toLocaleString() : "First session"}
              </span>
            </p>
          </div>
          <Link
            to="/scanner"
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold font-cyber px-4 py-2 rounded-lg glow-cyan transition-all"
          >
            <FaShieldAlt size={11} />
            New Threat Scan
            <FaArrowRight size={10} />
          </Link>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4 mt-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          <StatsCard title="Emails Scanned" value={analytics.emails} icon={<FaEnvelope />} />
          <StatsCard title="URLs Scanned" value={analytics.urls} icon={<FaGlobe />} />
          <StatsCard title="SMS Scanned" value={analytics.sms} icon={<FaSms />} />
          <StatsCard title="Threats Blocked" value={analytics.threats} icon={<FaBug />} color="text-red-500" />
        </motion.div>

        {/* Charts */}
        <motion.div
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <DashboardCharts analytics={analytics} />
        </motion.div>

        {/* Threat Intelligence Panel */}
        <motion.div
          className="mt-6 grid lg:grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
        >
          {/* Score & Status */}
          <div className="bg-[#0e0e11]/80 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-800">
              <FaShieldAlt className="text-emerald-400 text-sm" />
              <h2 className="text-sm font-bold font-cyber text-zinc-200">GuardianX Protection</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Total Scans", value: totalScans, color: "text-zinc-200" },
                { label: "Threats", value: analytics.threats, color: "text-red-400" },
                { label: "Security Score", value: `${analytics.security_score}/100`, color: scoreColor },
                { label: "Firewall", value: analytics.firewall_status, color: "text-emerald-400" },
              ].map((s) => (
                <div key={s.label} className="bg-[#080809] border border-zinc-800/50 rounded-lg p-3">
                  <p className="text-[9px] text-zinc-600 font-cyber uppercase">{s.label}</p>
                  <p className={`text-lg font-bold font-cyber mt-0.5 ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Level */}
          <div className="bg-[#0e0e11]/80 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
              <h2 className="text-sm font-bold font-cyber text-zinc-200">Live Risk Monitor</h2>
              <span className={`text-xs font-cyber font-bold ${riskColor}`}>{analytics.risk_level}</span>
            </div>
            <div className="space-y-2.5">
              {[
                { label: "🛡 Firewall", value: analytics.firewall_status },
                { label: "🤖 AI Scanner", value: analytics.scanner_status },
                { label: "🌐 Threat Feed", value: "CONNECTED" },
                { label: "🔐 Session", value: analytics.session_status },
                { label: "📊 Database", value: analytics.database_status },
              ].map((s) => (
                <div key={s.label} className="flex justify-between items-center">
                  <span className="text-xs text-zinc-500 font-cyber">{s.label}</span>
                  <span className="text-xs text-emerald-400 font-cyber font-bold">● {s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-bold font-cyber text-zinc-200">Recent Scan Activity</h2>
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 px-3 py-1.5 rounded-lg text-[10px] font-cyber transition-all cursor-pointer"
            >
              <FaTrash size={9} />
              Clear
            </button>
          </div>

          <div className="glass-panel-cyan rounded-xl border border-cyan-500/15 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800 text-[9px] text-zinc-600 font-cyber uppercase tracking-widest">
                  <th className="text-left px-4 py-3">Type</th>
                  <th className="text-left px-4 py-3">Source</th>
                  <th className="text-left px-4 py-3">Verdict</th>
                  <th className="text-left px-4 py-3">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <FaShieldAlt className="text-zinc-700 text-3xl" />
                        <p className="font-cyber text-zinc-500 text-xs">No security activity yet</p>
                        <Link to="/scanner" className="text-cyan-400 text-xs font-cyber hover:underline">
                          Start your first scan →
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  history.slice(0, 8).map((item, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-all"
                    >
                      <td className="px-4 py-3 text-xs font-cyber text-zinc-300">
                        {item.scan_type === "Email" ? "✉" : item.scan_type === "URL" ? "🌐" : item.scan_type === "SMS" ? "💬" : item.scan_type === "Password" ? "🔑" : "📄"}{" "}
                        {item.scan_type}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-500 font-mono max-w-[140px] truncate">
                        {item.filename || "—"}
                      </td>
                      <td className="px-4 py-3">{statusBadge(item.status)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-zinc-800 rounded-full h-1">
                            <div
                              className={`h-1 rounded-full ${item.confidence >= 90 ? "bg-emerald-500" : item.confidence >= 70 ? "bg-amber-400" : "bg-red-500"}`}
                              style={{ width: `${item.confidence}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-cyber text-cyan-400 font-bold">{item.confidence}%</span>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
            {history.length > 8 && (
              <div className="px-4 py-3 border-t border-zinc-800">
                <Link to="/history" className="text-xs text-cyan-400 font-cyber hover:underline">
                  View all {history.length} records →
                </Link>
              </div>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
}

export default Dashboard;