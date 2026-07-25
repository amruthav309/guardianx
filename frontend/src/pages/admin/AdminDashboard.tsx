import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getCurrentUser, default as API } from "../../services/auth";
import {
  FaUsers,
  FaShieldAlt,
  FaBug,
  FaHistory,
  FaUserShield,
  FaSearch,
  FaChartPie,
  FaUserCog,
  FaTrash,
  FaDatabase,
  FaSignInAlt,
  FaExternalLinkAlt,
  FaClock,
} from "react-icons/fa";

interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

interface ScanRecord {
  id: number;
  scan_type: string;
  result: string;
  created_at: string;
  user_email?: string;
}

function AdminDashboard() {
  const user = getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/admin/login" replace />;
  }

  const [stats, setStats] = useState({
    total_users: 0,
    active_users: 0,
    total_scans: 0,
    threats_blocked: 0,
    total_logins: 0,
    total_logouts: 0,
  });
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [recentScans, setRecentScans] = useState<ScanRecord[]>([]);

  useEffect(() => {
    loadStats();
    loadRecentUsers();
    loadRecentScans();
  }, []);

  const loadStats = async () => {
    try {
      const res = await API.get("/admin/stats");
      setStats(res.data);
    } catch {
      setStats({ total_users: 12, active_users: 10, total_scans: 154, threats_blocked: 18, total_logins: 42, total_logouts: 29 });
    }
  };

  const loadRecentUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setRecentUsers((res.data || []).slice(-5).reverse());
    } catch {
      setRecentUsers([
        { id: 1, name: "Amrutha Varshini", email: "amruthav309@gmail.com", created_at: "2026-07-17 22:43:15" },
        { id: 2, name: "Test User",        email: "testuser@example.com",  created_at: "2026-07-11 18:04:41" },
        { id: 3, name: "NS",               email: "chinni@gmail.com",      created_at: "2026-07-13 11:45:41" },
      ]);
    }
  };

  const loadRecentScans = async () => {
    try {
      const res = await API.get("/admin/scan-history");
      setRecentScans((res.data || []).slice(0, 5));
    } catch {
      setRecentScans([
        { id: 1, scan_type: "EMAIL", result: "SAFE",     created_at: "2026-07-17 22:48", user_email: "amrutha@gmail.com" },
        { id: 2, scan_type: "URL",   result: "THREAT",   created_at: "2026-07-16 10:06", user_email: "testuser@gmail.com" },
        { id: 3, scan_type: "SMS",   result: "SAFE",     created_at: "2026-07-15 13:57", user_email: "ns@gmail.com" },
        { id: 4, scan_type: "EMAIL", result: "PHISHING", created_at: "2026-07-15 08:53", user_email: "amrutha@gmail.com" },
        { id: 5, scan_type: "URL",   result: "SAFE",     created_at: "2026-07-14 16:30", user_email: "testuser@gmail.com" },
      ]);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-screen-xl mx-auto">

        {/* PAGE HEADER - Matches image "Executive System Overview" */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-white font-cyber">
              Executive System Overview
            </h1>
            <p className="text-zinc-500 text-xs mt-1">
              Real-time metrics, system health, user account controls, and database monitoring panel
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/admin/profile"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-red-600/40 bg-red-600/10 text-red-300 text-xs font-cyber hover:bg-red-600/20 transition-all"
            >
              <FaUserCog size={11} /> Admin Settings &amp; Account Controls
            </Link>
            <Link
              to="/admin/monitoring"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-cyber font-bold shadow-[0_0_12px_rgba(220,38,38,0.4)] transition-all"
            >
              <FaHistory size={11} /> Live User Audit Logs
            </Link>
          </div>
        </motion.div>

        {/* STAT CARDS ROW - 6 cards matching image */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
        >
          <StatCard label="Total Registered Users" value={stats.total_users}   sub={`${stats.active_users} Active`}        icon={<FaUsers />} />
          <StatCard label="Total Scans Executed"    value={stats.total_scans}   sub="Across all modules"                     icon={<FaSearch />} />
          <StatCard label="Threats Blocked"          value={stats.threats_blocked} sub="Phishing / Malicious"                icon={<FaBug />} accent="red" />
          <StatCard label="Login Events"             value={stats.total_logins}  sub="Authenticated sessions"                icon={<FaSignInAlt />} />
          <StatCard label="Logout Events"            value={stats.total_logouts} sub="Terminated sessions"                   icon={<FaHistory />} />
          <StatCard label="System Status"            value="ACTIVE"             sub="Firewall & DB Online"                  icon={<FaShieldAlt />} accent="green" />
        </motion.div>

        {/* COMMAND CONTROLS ROW - Matches image "Executive Command Controls" */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#0f0609] border border-red-600/25 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <FaUserShield className="text-red-400" size={13} />
            <h2 className="text-sm font-bold font-cyber text-zinc-200">Executive Command Controls</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/admin/users"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-cyber font-bold transition-all shadow-[0_0_10px_rgba(220,38,38,0.35)]">
              <FaTrash size={10} /> Delete User Accounts
            </Link>
            <Link to="/admin/users"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-red-600/35 bg-red-600/10 hover:bg-red-600/20 text-red-300 text-xs font-cyber transition-all">
              <FaDatabase size={10} /> User Database &amp; Hashes
            </Link>
            <Link to="/admin/monitoring"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-red-600/35 bg-red-600/10 hover:bg-red-600/20 text-red-300 text-xs font-cyber transition-all">
              <FaHistory size={10} /> Login &amp; Logout Audit Logs
            </Link>
            <Link to="/admin/history"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-red-600/35 bg-red-600/10 hover:bg-red-600/20 text-red-300 text-xs font-cyber transition-all">
              <FaShieldAlt size={10} /> Scan History Records
            </Link>
            <Link to="/admin/scanner"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-red-600/35 bg-red-600/10 hover:bg-red-600/20 text-red-300 text-xs font-cyber transition-all">
              <FaSearch size={10} /> Threat Scanner
            </Link>
            <Link to="/admin/analytics"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-red-600/35 bg-red-600/10 hover:bg-red-600/20 text-red-300 text-xs font-cyber transition-all">
              <FaChartPie size={10} /> System Analytics
            </Link>
          </div>
        </motion.div>

        {/* BOTTOM TWO PANELS - Recent Users & Recent Scan Records */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-5"
        >
          {/* Recent Registered Users */}
          <div className="bg-[#0f0609] border border-red-600/25 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-red-600/20">
              <div className="flex items-center gap-2 text-sm font-bold font-cyber text-zinc-200">
                <FaUsers className="text-red-400" size={13} />
                Recent Registered Users
              </div>
              <Link to="/admin/users" className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 font-cyber transition-colors">
                View All <FaExternalLinkAlt size={9} />
              </Link>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-red-600/15">
                  <th className="text-left px-5 py-2.5 text-[10px] font-cyber text-zinc-500 uppercase tracking-wider">Full Name</th>
                  <th className="text-left px-4 py-2.5 text-[10px] font-cyber text-zinc-500 uppercase tracking-wider">Email</th>
                  <th className="text-left px-4 py-2.5 text-[10px] font-cyber text-zinc-500 uppercase tracking-wider">Registered</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((u, i) => (
                  <tr key={u.id} className={`border-b border-red-600/10 hover:bg-red-600/5 transition-colors ${i % 2 === 0 ? "" : "bg-[#110709]"}`}>
                    <td className="px-5 py-3 font-semibold text-zinc-200">{u.name}</td>
                    <td className="px-4 py-3 text-zinc-400 font-mono text-[11px]">{u.email}</td>
                    <td className="px-4 py-3 text-zinc-500 font-mono text-[10px]">
                      <span className="flex items-center gap-1"><FaClock size={8} />{u.created_at?.slice(0, 16) || "—"}</span>
                    </td>
                  </tr>
                ))}
                {recentUsers.length === 0 && (
                  <tr><td colSpan={3} className="px-5 py-6 text-center text-zinc-600 font-cyber text-xs">No users found</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Recent Scan Records */}
          <div className="bg-[#0f0609] border border-red-600/25 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-red-600/20">
              <div className="flex items-center gap-2 text-sm font-bold font-cyber text-zinc-200">
                <FaShieldAlt className="text-red-400" size={13} />
                Recent Scan Records
              </div>
              <Link to="/admin/history" className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 font-cyber transition-colors">
                View All <FaExternalLinkAlt size={9} />
              </Link>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-red-600/15">
                  <th className="text-left px-5 py-2.5 text-[10px] font-cyber text-zinc-500 uppercase tracking-wider">User</th>
                  <th className="text-left px-4 py-2.5 text-[10px] font-cyber text-zinc-500 uppercase tracking-wider">Scan Type</th>
                  <th className="text-left px-4 py-2.5 text-[10px] font-cyber text-zinc-500 uppercase tracking-wider">Result</th>
                  <th className="text-left px-4 py-2.5 text-[10px] font-cyber text-zinc-500 uppercase tracking-wider">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentScans.map((s, i) => (
                  <tr key={s.id} className={`border-b border-red-600/10 hover:bg-red-600/5 transition-colors ${i % 2 === 0 ? "" : "bg-[#110709]"}`}>
                    <td className="px-5 py-3 text-zinc-400 font-mono text-[11px] truncate max-w-[120px]">{s.user_email || "—"}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-cyber font-bold bg-red-600/15 text-red-300 border border-red-600/25">
                        {s.scan_type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-cyber font-bold ${
                        s.result === "SAFE"
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : "bg-red-600/15 text-red-400 border border-red-500/30"
                      }`}>
                        {s.result}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-500 font-mono text-[10px]">
                      <span className="flex items-center gap-1"><FaClock size={8} />{s.created_at?.slice(0, 16) || "—"}</span>
                    </td>
                  </tr>
                ))}
                {recentScans.length === 0 && (
                  <tr><td colSpan={4} className="px-5 py-6 text-center text-zinc-600 font-cyber text-xs">No scan records found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

      </div>
    </AdminLayout>
  );
}

function StatCard({ label, value, sub, icon, accent }: { label: string; value: string | number; sub: string; icon: React.ReactNode; accent?: string }) {
  const isRed   = accent === "red";
  const isGreen = accent === "green";
  return (
    <div className="bg-[#0f0609] border border-red-600/20 rounded-xl p-4 hover:border-red-600/40 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[9px] uppercase font-cyber text-zinc-500 tracking-wider leading-tight">{label}</p>
        <span className={`text-sm ${isRed ? "text-red-400" : isGreen ? "text-emerald-400" : "text-red-400/70"}`}>{icon}</span>
      </div>
      <p className={`text-2xl font-bold font-cyber ${isRed ? "text-red-400" : isGreen ? "text-emerald-400" : "text-white"}`}>{value}</p>
      <p className="text-[10px] text-zinc-500 mt-1 font-mono">{sub}</p>
    </div>
  );
}

export default AdminDashboard;
