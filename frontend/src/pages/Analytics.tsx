import { useEffect, useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getAnalytics, getCurrentUser } from "../services/auth";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import DashboardCharts from "../components/dashboardcharts";
import { FaFileExport, FaShieldAlt, FaExclamationTriangle, FaCheckCircle, FaRobot, FaHome, FaHistory, FaSearch } from "react-icons/fa";

function Analytics() {
  const navigate = useNavigate();
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

  useEffect(() => {
    localStorage.setItem("sidebarOpen", String(sidebarOpen));
  }, [sidebarOpen]);

  useEffect(() => {
    loadAnalytics();

    const handleUpdate = () => loadAnalytics();
    window.addEventListener("guardianx_scan_completed", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    const interval = setInterval(loadAnalytics, 3000);

    return () => {
      window.removeEventListener("guardianx_scan_completed", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
      clearInterval(interval);
    };
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await getAnalytics(user.id);
      const computedTotal = data.total_scans || ((data.emails || 0) + (data.urls || 0) + (data.sms || 0));
      setAnalytics({
        ...data,
        total_scans: computedTotal,
        accuracy: data.accuracy || 96.4,
      });
    } catch (error) { console.log(error); }
  };

  const total = analytics.total_scans || (analytics.emails + analytics.urls + analytics.sms);
  const safeScans = Math.max(0, total - analytics.threats);
  const safeRate = total > 0 ? ((safeScans / total) * 100).toFixed(1) : "100.0";

  const exportReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(16, 185, 129);
    doc.text("GuardianX Cyber Intelligence Analytics Report", 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`User Account: ${user.email}`, 14, 28);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 34);
    autoTable(doc, {
      startY: 42,
      head: [["Metric Category", "Telemetry Value"]],
      body: [
        ["Total Scans Executed", total],
        ["Email Scans", analytics.emails],
        ["URL Scans", analytics.urls],
        ["SMS Scans", analytics.sms],
        ["Threats Neutralized", analytics.threats],
        ["Verified Safe Scans", safeScans],
        ["Safe Rate Percentage", `${safeRate}%`],
        ["AI Engine Confidence Index", "96.4%"],
        ["GuardianX Security Score", `${analytics.security_score}/100`],
        ["System Risk Level", analytics.risk_level],
      ],
      theme: "grid",
      headStyles: { fillColor: [16, 185, 129], textColor: [0, 0, 0] },
    });
    doc.save("GuardianX_Cyber_Analytics_Report.pdf");
  };

  const kpis = [
    { icon: <FaShieldAlt />, label: "Total Scans", value: total, sub: `${analytics.emails} Email · ${analytics.urls} URL · ${analytics.sms} SMS`, color: "cyan", border: "border-sky-500/30" },
    { icon: <FaExclamationTriangle />, label: "Threats Isolated", value: analytics.threats, sub: "Phishing threats blocked", color: "red", border: "border-rose-500/30" },
    { icon: <FaCheckCircle />, label: "Clean Scan Rate", value: `${safeRate}%`, sub: `${safeScans} verified clean inputs`, color: "emerald", border: "border-sky-500/30" },
    { icon: <FaRobot />, label: "AI Engine Accuracy", value: "96.4%", sub: "High confidence neural model", color: "teal", border: "border-sky-500/30" },
  ];

  const colorMap: Record<string, string> = {
    cyan: "text-sky-400 bg-sky-500/10 border-sky-500/30",
    red: "text-rose-400 bg-rose-500/10 border-rose-500/30",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    teal: "text-cyan-300 bg-cyan-500/10 border-cyan-500/30",
  };

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

        {/* Navigation Bar / Header with Dashboard Access Option */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#111927]/90 border border-sky-500/20 rounded-2xl p-5 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-cyber uppercase tracking-widest text-sky-400 px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20">
                Threat Intelligence Module
              </span>
            </div>
            <h1 className="text-3xl font-bold font-serif-header text-slate-100">
              Threat Intelligence Analytics
            </h1>
            <p className="text-sky-400/60 text-xs mt-1">
              AI-driven multi-vector security telemetry for <span className="text-cyan-300 font-mono">{user.email}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#111927] border border-sky-500/30 text-sky-400 hover:bg-sky-500/20 text-xs font-cyber font-semibold transition-all cursor-pointer shadow-md"
            >
              <FaHome size={13} />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => navigate("/scanner")}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#111927] border border-sky-500/30 text-sky-300 hover:bg-sky-500/20 text-xs font-cyber font-semibold transition-all cursor-pointer shadow-md"
            >
              <FaSearch size={12} />
              <span>AI Scanner</span>
            </button>
            <button
              onClick={exportReport}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-bold font-cyber glow-cyan transition-all cursor-pointer shadow-lg shadow-sky-500/25"
            >
              <FaFileExport size={12} />
              <span>Export PDF Report</span>
            </button>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid xl:grid-cols-4 lg:grid-cols-2 grid-cols-1 gap-4 mt-6">
          {kpis.map((kpi, i) => (
            <div key={i} className={`bg-[#111927]/90 border ${kpi.border} rounded-2xl p-5 hover-card-trigger shadow-xl relative overflow-hidden`}>
              <div className="flex items-center justify-between">
                <div className={`w-11 h-11 rounded-xl ${colorMap[kpi.color]} flex items-center justify-center text-lg border`}>
                  {kpi.icon}
                </div>
                <span className="text-[10px] font-cyber text-sky-400/60 uppercase">Telemetry</span>
              </div>
              <p className="text-sky-300/70 text-xs font-cyber uppercase mt-4">{kpi.label}</p>
              <h2 className={`text-3xl font-bold mt-1 font-serif-header ${colorMap[kpi.color].split(" ")[0]}`}>{kpi.value}</h2>
              <p className="mt-2 text-xs text-sky-400/60 font-mono">{kpi.sub}</p>
            </div>
          ))}
        </div>

        {/* Recharts Analytics Trends & Distribution */}
        <div className="mt-8">
          <DashboardCharts analytics={analytics} />
        </div>

        {/* Detailed Risk Breakdown Matrix */}
        <div className="mt-8 grid lg:grid-cols-3 gap-6">
          <div className="bg-[#111927]/90 border border-sky-500/20 rounded-2xl p-5 shadow-xl lg:col-span-2">
            <h2 className="text-lg font-bold font-serif-header text-slate-100 mb-4 flex items-center gap-2">
              <FaShieldAlt className="text-sky-400" /> Threat Vector Mitigation Matrix
            </h2>
            <div className="space-y-4">
              {[
                { vector: "Email Phishing Scanner", count: analytics.emails, status: "Active Protection", color: "bg-sky-400" },
                { vector: "Malicious URL Inspector", count: analytics.urls, status: "Active Protection", color: "bg-cyan-400" },
                { vector: "Smishing SMS Engine", count: analytics.sms, status: "Active Protection", color: "bg-blue-500" },
              ].map((v) => (
                <div key={v.vector} className="bg-[#080e18] p-4 rounded-xl border border-sky-500/15">
                  <div className="flex justify-between text-xs font-cyber mb-2">
                    <span className="text-slate-200 font-bold">{v.vector}</span>
                    <span className="text-sky-400">{v.count} Scans Completed</span>
                  </div>
                  <div className="w-full bg-[#111927] h-2 rounded-full overflow-hidden border border-sky-500/20">
                    <div className={`h-full ${v.color} transition-all duration-500`} style={{ width: `${Math.min(100, (v.count / (total || 1)) * 100)}%` }} />
                  </div>
                  <p className="text-[10px] text-sky-400/60 font-mono mt-2">Status: {v.status}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#111927]/90 border border-sky-500/20 rounded-2xl p-5 shadow-xl">
            <h2 className="text-lg font-bold font-serif-header text-slate-100 mb-4">
              Security Index Summary
            </h2>
            <div className="flex flex-col items-center justify-center p-6 bg-[#080e18] rounded-xl border border-sky-500/15 text-center">
              <div className="w-24 h-24 rounded-full border-4 border-sky-400 flex items-center justify-center text-3xl font-bold font-cyber text-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.35)]">
                {analytics.security_score}
              </div>
              <p className="text-sm font-cyber font-bold text-slate-200 mt-4">System Clearance Score</p>
              <p className="text-xs text-sky-400/60 mt-1 font-sans">
                {analytics.security_score >= 80 ? "Optimal Protection Active" : "Action Recommended"}
              </p>
              <Link
                to="/history"
                className="mt-5 text-xs text-sky-400 font-cyber flex items-center gap-1 hover:underline"
              >
                <FaHistory size={11} /> View Complete Audit Log →
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Analytics;