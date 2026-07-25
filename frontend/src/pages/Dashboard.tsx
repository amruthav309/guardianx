import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Navigate, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatsCard from "../components/StatsCard";
import { getAnalytics, getHistory, clearHistory, getCurrentUser } from "../services/auth";
import {
  FaEnvelope, FaGlobe, FaSms, FaBug, FaShieldAlt,
  FaTrash, FaArrowRight, FaChartBar, FaSearch, FaHistory,
  FaUserCircle, FaCog, FaLock, FaBolt, FaCheckCircle
} from "react-icons/fa";

function Dashboard() {
  const user = getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;

  const [currentUser, setCurrentUser] = useState(user);
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    localStorage.getItem("sidebarOpen") !== "false"
  );

  useEffect(() => {
    const handleUserUpdate = () => {
      setCurrentUser(getCurrentUser());
    };
    window.addEventListener("guardianx_user_updated", handleUserUpdate);
    return () => {
      window.removeEventListener("guardianx_user_updated", handleUserUpdate);
    };
  }, []);

  const [analytics, setAnalytics] = useState({
    emails: 0, urls: 0, sms: 0, threats: 0, total_scans: 0,
    security_score: 100, risk_level: "LOW",
    firewall_status: "PROTECTED", scanner_status: "READY",
    database_status: "ONLINE", session_status: "SECURE",
    last_sync: "", weekly_trend: [],
  });
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    loadDashboard();

    const handleUpdate = () => loadDashboard();
    window.addEventListener("guardianx_scan_completed", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    const interval = setInterval(loadDashboard, 3000);

    return () => {
      window.removeEventListener("guardianx_scan_completed", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebarOpen", String(sidebarOpen));
  }, [sidebarOpen]);

  const loadDashboard = async () => {
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

  const scoreColor =
    analytics.security_score >= 80 ? "text-emerald-400" :
    analytics.security_score >= 50 ? "text-amber-400" : "text-red-500";

  const statusBadge = (status: string) => {
    if (status === "Safe") return <span className="inline-flex items-center gap-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-2.5 py-0.5 rounded-full text-[10px] font-cyber font-bold">● Safe</span>;
    if (status === "Suspicious") return <span className="inline-flex items-center gap-1 bg-amber-500/15 text-amber-400 border border-amber-500/25 px-2.5 py-0.5 rounded-full text-[10px] font-cyber font-bold">● Suspicious</span>;
    if (status === "Phishing") return <span className="inline-flex items-center gap-1 bg-red-500/15 text-red-400 border border-red-500/25 px-2.5 py-0.5 rounded-full text-[10px] font-cyber font-bold">● Phishing</span>;
    return <span className="text-zinc-400 text-[10px]">{status}</span>;
  };

  // Module cards definition
  const moduleCards = [
    {
      name: "AI Security Scanner",
      desc: "Deep neural analysis for emails, URLs, SMS & passwords",
      icon: <FaSearch className="text-sky-400" />,
      path: "/scanner",
      tag: "Core Engine",
      color: "from-sky-500/20 to-blue-900/10 border-sky-500/30",
    },
    {
      name: "Threat Analytics",
      desc: "Comprehensive threat vectors & historical intelligence",
      icon: <FaChartBar className="text-cyan-400" />,
      path: "/analytics",
      tag: "Analytics",
      color: "from-sky-500/20 to-blue-900/10 border-sky-500/30",
    },
    {
      name: "Scan History",
      desc: "Isolated audit database & forensic scan reports",
      icon: <FaHistory className="text-sky-400" />,
      path: "/history",
      tag: "Audit Log",
      color: "from-sky-500/20 to-blue-900/10 border-sky-500/30",
    },
    {
      name: "User Profile",
      desc: "Identity clearance level, account details & credentials",
      icon: <FaUserCircle className="text-cyan-400" />,
      path: "/profile",
      tag: "Identity",
      color: "from-sky-500/20 to-blue-900/10 border-sky-500/30",
    },
    {
      name: "System Settings",
      desc: "Scan engine sensitivity & security clearance policy",
      icon: <FaCog className="text-sky-300" />,
      path: "/settings",
      tag: "Config",
      color: "from-sky-400/20 to-blue-950/10 border-sky-400/30",
    },
  ];

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

        {/* Hero Section */}
        <motion.div
          className="mt-6 glass-panel-cyan rounded-2xl border border-sky-500/25 p-6 relative overflow-hidden shadow-2xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Cyber ambient glow element */}
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="h-2 w-2 rounded-full bg-sky-400 animate-ping" />
                <span className="text-[10px] font-cyber uppercase text-sky-400 tracking-widest font-bold">
                  Cyber Security Expert Mode Active
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold font-serif-header text-slate-100">
                Guardian<span className="text-sky-400 glow-text-cyan">X</span> Cyber Portal
              </h1>
              <p className="text-xs sm:text-sm text-sky-200/70 mt-2 max-w-2xl font-sans">
                Real-time artificial intelligence proactive threat prevention & multi-vector security dashboard for{" "}
                <span className="text-cyan-300 font-mono font-semibold">{currentUser?.email}</span>
              </p>
              
              <div className="flex flex-wrap items-center gap-3 mt-4 text-xs font-mono text-sky-300/80">
                <span className="flex items-center gap-1.5 bg-[#111927] border border-sky-500/20 px-3 py-1 rounded-xl">
                  <FaBolt className="text-sky-400" /> Status: Safe & Protected
                </span>
                <span className="flex items-center gap-1.5 bg-[#111927] border border-sky-500/20 px-3 py-1 rounded-xl">
                  <FaLock className="text-sky-400" /> Session ID: #{currentUser?.id}
                </span>
                <span className={`font-cyber text-[10px] uppercase font-bold px-2.5 py-1 rounded-lg border tracking-wider ${
                  currentUser?.security_level === "Enhanced" ? "bg-amber-500/10 border-amber-500/30 text-amber-400" :
                  currentUser?.security_level === "Lockdown" ? "bg-rose-500/10 border-rose-500/30 text-rose-400 animate-pulse" :
                  "bg-sky-500/10 border-sky-500/30 text-sky-400"
                }`}>
                  {currentUser?.security_level || "Standard"} Clearance
                </span>
              </div>
            </div>

            <Link
              to="/scanner"
              className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-bold font-cyber px-5 py-3 rounded-xl glow-cyan transition-all shadow-lg cursor-pointer whitespace-nowrap"
            >
              <FaShieldAlt size={13} />
              <span>Launch AI Threat Scanner</span>
              <FaArrowRight size={11} />
            </Link>
          </div>
        </motion.div>

        {/* Module Dashboard Quick Launchpad Grid */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold font-serif-header text-sky-400 glow-text-cyan">
                Security Modules Launchpad
              </h2>
              <p className="text-xs text-sky-400/60 font-sans">
                Quick access to all GuardianX active security modules
              </p>
            </div>
            <span className="text-[10px] font-cyber px-2.5 py-1 rounded-lg bg-sky-500/10 border border-sky-500/25 text-sky-400">
              5 Modules Available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {moduleCards.map((m) => (
              <Link
                key={m.name}
                to={m.path}
                className={`bg-gradient-to-b ${m.color} bg-[#111927]/90 border rounded-2xl p-4 transition-all hover-card-trigger flex flex-col justify-between group shadow-lg`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#080e18] border border-sky-500/20 flex items-center justify-center text-lg shadow-inner group-hover:scale-110 transition-transform">
                      {m.icon}
                    </div>
                    <span className="text-[9px] font-cyber uppercase tracking-wider text-sky-300/70 px-2 py-0.5 rounded-md bg-[#080e18] border border-sky-500/15">
                      {m.tag}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold font-cyber text-slate-100 group-hover:text-sky-400 transition-colors">
                    {m.name}
                  </h3>
                  <p className="text-[11px] text-sky-400/60 mt-1 line-clamp-2 leading-relaxed">
                    {m.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-sky-500/10 flex items-center justify-between text-xs text-sky-400 font-cyber font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Open Module</span>
                  <FaArrowRight size={10} />
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Stats Telemetry Cards */}
        <motion.div
          className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4 mt-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <StatsCard title="Emails Scanned" value={analytics.emails} icon={<FaEnvelope />} subtext="Phishing & spam analysis" />
          <StatsCard title="URLs Scanned" value={analytics.urls} icon={<FaGlobe />} subtext="Malicious link inspection" />
          <StatsCard title="SMS Scanned" value={analytics.sms} icon={<FaSms />} subtext="Smishing text analysis" />
          <StatsCard title="Threats Blocked" value={analytics.threats} icon={<FaBug />} color="text-rose-400" subtext="Phishing threats neutralized" />
        </motion.div>

        {/* Threat Intelligence Panel */}
        <motion.div
          className="mt-8 grid lg:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* GuardianX Protection Metrics */}
          <div className="bg-[#111927]/90 border border-sky-500/20 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-sky-500/15">
              <div className="flex items-center gap-2">
                <FaShieldAlt className="text-sky-400 text-base" />
                <h2 className="text-base font-bold font-serif-header text-slate-100">GuardianX Protection Index</h2>
              </div>
              <span className="text-xs font-cyber text-sky-400">Score Telemetry</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Total Scans", value: totalScans, color: "text-slate-200" },
                { label: "Threats Isolated", value: analytics.threats, color: "text-rose-400" },
                { label: "Security Score", value: `${analytics.security_score}/100`, color: scoreColor },
                { label: "Firewall Status", value: analytics.firewall_status, color: "text-sky-400" },
              ].map((s) => (
                <div key={s.label} className="bg-[#080e18] border border-sky-500/15 rounded-xl p-4">
                  <p className="text-[9px] text-sky-400/60 font-cyber uppercase tracking-wider">{s.label}</p>
                  <p className={`text-xl font-bold font-cyber mt-1 ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Live System Component Monitor */}
          <div className="bg-[#111927]/90 border border-sky-500/20 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-sky-500/15">
              <h2 className="text-base font-bold font-serif-header text-slate-100">System Component Telemetry</h2>
              <span className={`text-xs font-cyber font-bold blink-text px-2.5 py-0.5 rounded border ${
                analytics.risk_level === "HIGH"
                  ? "bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.2)]"
                  : analytics.risk_level === "MEDIUM"
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.2)]"
                    : "bg-sky-500/10 border-sky-500/30 text-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.2)]"
              }`}>Risk: {analytics.risk_level}</span>
            </div>
            <div className="space-y-3">
              {[
                { label: "🛡 Neural Firewall", value: analytics.firewall_status },
                { label: "🤖 AI Threat Engine", value: analytics.scanner_status },
                { label: "🌐 Threat Intelligence Feed", value: "CONNECTED" },
                { label: "🔐 Identity Session", value: analytics.session_status },
                { label: "📊 Scan Records DB", value: analytics.database_status },
              ].map((s) => (
                <div key={s.label} className="flex justify-between items-center bg-[#080e18] px-3.5 py-2 rounded-xl border border-sky-500/10">
                  <span className="text-xs text-sky-200/70 font-cyber">{s.label}</span>
                  <span className="text-xs text-sky-400 font-cyber font-bold blink-text flex items-center gap-1">
                    <FaCheckCircle size={10} /> {s.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recent Activity Table */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold font-serif-header text-slate-100">Recent Security Activity</h2>
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 px-3 py-1.5 rounded-xl text-[10px] font-cyber transition-all cursor-pointer"
            >
              <FaTrash size={9} />
              Clear Records
            </button>
          </div>

          <div className="glass-panel-cyan rounded-2xl border border-sky-500/20 overflow-x-auto shadow-xl">
            <table className="w-full">
              <thead>
                <tr className="border-b border-sky-500/15 text-[9px] text-sky-400/60 font-cyber uppercase tracking-widest bg-[#080e18]">
                  <th className="text-left px-4 py-3">Vector</th>
                  <th className="text-left px-4 py-3">Content / File</th>
                  <th className="text-left px-4 py-3">Verdict</th>
                  <th className="text-left px-4 py-3">Confidence Score</th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <FaShieldAlt className="text-sky-900 text-4xl" />
                        <p className="font-cyber text-sky-400/60 text-xs">No scan activity recorded yet</p>
                        <Link to="/scanner" className="text-sky-400 text-xs font-cyber hover:underline">
                          Start your first AI scan →
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  history.slice(0, 8).map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-sky-500/10 hover:bg-[#131f33]/60 transition-all"
                    >
                      <td className="px-4 py-3 text-xs font-cyber text-slate-200">
                        {item.scan_type === "Email" ? "✉" : item.scan_type === "URL" ? "🌐" : item.scan_type === "SMS" ? "💬" : item.scan_type === "Password" ? "🔑" : "📄"}{" "}
                        {item.scan_type}
                      </td>
                      <td className="px-4 py-3 text-xs text-sky-300/70 font-mono max-w-[200px] truncate">
                        {item.filename || "—"}
                      </td>
                      <td className="px-4 py-3">{statusBadge(item.status)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-[#080e18] border border-sky-500/20 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${item.confidence >= 90 ? "bg-sky-400" : item.confidence >= 70 ? "bg-amber-400" : "bg-rose-500"}`}
                              style={{ width: `${item.confidence}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-cyber text-sky-400 font-bold">{item.confidence}%</span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {history.length > 8 && (
              <div className="px-4 py-3 border-t border-sky-500/15 bg-[#080e18]/50 text-right">
                <Link to="/history" className="text-xs text-sky-400 font-cyber hover:underline">
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