import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getAnalytics, getCurrentUser } from "../services/auth";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import DashboardCharts from "../components/dashboardcharts";
import { FaFileExport, FaShieldAlt, FaExclamationTriangle, FaCheckCircle, FaRobot } from "react-icons/fa";

function Analytics() {
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

  useEffect(() => { loadAnalytics(); }, []);

  const loadAnalytics = async () => {
    try {
      const data = await getAnalytics(user.id);
      setAnalytics(data);
    } catch (error) { console.log(error); }
  };

  const total = analytics.total_scans;
  const safeScans = total - analytics.threats;
  const safeRate = total > 0 ? ((safeScans / total) * 100).toFixed(1) : "0";

  const exportReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(0, 170, 255);
    doc.text("GuardianX Analytics Report", 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
    autoTable(doc, {
      startY: 40,
      head: [["Metric", "Value"]],
      body: [
        ["Total Scans", total],
        ["Email Scans", analytics.emails],
        ["URL Scans", analytics.urls],
        ["SMS Scans", analytics.sms],
        ["Threats Blocked", analytics.threats],
        ["Safe Scans", safeScans],
        ["Safe Rate", `${safeRate}%`],
        ["AI Confidence", "95%"],
        ["Security Score", `${analytics.security_score}/100`],
        ["Risk Level", analytics.risk_level],
      ],
      theme: "grid",
      headStyles: { fillColor: [0, 180, 255] },
    });
    doc.save("GuardianX_Analytics_Report.pdf");
  };

  const kpis = [
    { icon: <FaShieldAlt />, label: "Total Scans", value: total, sub: `${analytics.emails}E · ${analytics.urls}U · ${analytics.sms}S`, color: "cyan", border: "border-cyan-500/20" },
    { icon: <FaExclamationTriangle />, label: "Threats Blocked", value: analytics.threats, sub: "Phishing detected", color: "red", border: "border-red-500/20" },
    { icon: <FaCheckCircle />, label: "Safe Scans", value: safeScans, sub: `${safeRate}% clean rate`, color: "emerald", border: "border-emerald-500/20" },
    { icon: <FaRobot />, label: "AI Confidence", value: "95%", sub: "Excellent accuracy", color: "amber", border: "border-amber-500/20" },
  ];

  const colorMap: Record<string, string> = {
    cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/25",
    red: "text-red-400 bg-red-500/10 border-red-500/25",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/25",
  };

  return (
    <div className="flex min-h-screen bg-[#070709] text-white page-enter">
      {sidebarOpen && <Sidebar />}
      <div className="flex-1 p-5 overflow-y-auto">
        <Topbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="mt-8 flex flex-col lg:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold font-cyber text-cyan-400 glow-text-cyan">
              Threat Intelligence
            </h1>
            <p className="text-zinc-500 text-xs mt-1">
              AI-powered security analytics for identity <span className="text-cyan-400 font-mono">{user.email}</span>
            </p>
          </div>
          <button
            onClick={exportReport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold font-cyber glow-cyan transition-all cursor-pointer"
          >
            <FaFileExport size={12} />
            Export PDF Report
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid xl:grid-cols-4 lg:grid-cols-2 grid-cols-1 gap-4 mt-6">
          {kpis.map((kpi, i) => (
            <div key={i} className={`bg-[#0e0e11]/80 border ${kpi.border} rounded-xl p-5 hover-card-trigger`}>
              <div className={`w-10 h-10 rounded-lg ${colorMap[kpi.color]} flex items-center justify-center text-base border mb-4`}>
                {kpi.icon}
              </div>
              <p className="text-zinc-500 text-xs font-cyber uppercase">{kpi.label}</p>
              <h2 className={`text-3xl font-bold mt-1 font-cyber ${colorMap[kpi.color].split(" ")[0]}`}>{kpi.value}</h2>
              <p className={`mt-2 text-xs ${colorMap[kpi.color].split(" ")[0]} opacity-70`}>{kpi.sub}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="mt-6">
          <DashboardCharts analytics={analytics} />
        </div>
      </div>
    </div>
  );
}

export default Analytics;