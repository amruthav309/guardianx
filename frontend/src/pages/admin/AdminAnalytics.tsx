import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { getAnalytics, getCurrentUser } from "../../services/auth";
import DashboardCharts from "../../components/dashboardcharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  FaShieldAlt, FaExclamationTriangle, FaCheckCircle, FaRobot,
  FaFileExport, FaHistory, FaSearch,
} from "react-icons/fa";

function AdminAnalytics() {
  const user = getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/admin/login" replace />;
  }

  const [analytics, setAnalytics] = useState({
    emails: 0, urls: 0, sms: 0, threats: 0, total_scans: 0,
    security_score: 100, risk_level: "LOW",
    firewall_status: "PROTECTED", scanner_status: "READY",
    database_status: "ONLINE", session_status: "SECURE",
    last_sync: "", weekly_trend: [],
  });

  useEffect(() => {
    loadAnalytics();
    const interval = setInterval(loadAnalytics, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await getAnalytics(user.id);
      const computedTotal = data.total_scans || ((data.emails || 0) + (data.urls || 0) + (data.sms || 0));
      setAnalytics({ ...data, total_scans: computedTotal, accuracy: (data as any).accuracy || 96.4 });
    } catch { console.log("Analytics load error"); }
  };

  const total = analytics.total_scans || (analytics.emails + analytics.urls + analytics.sms);
  const safeScans = Math.max(0, total - analytics.threats);
  const safeRate = total > 0 ? ((safeScans / total) * 100).toFixed(1) : "100.0";

  const exportReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(220, 38, 38);
    doc.text("GuardianX Admin System Analytics Report", 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Admin Account: ${user.email}`, 14, 28);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 34);
    autoTable(doc, {
      startY: 42,
      head: [["Metric", "Value"]],
      body: [
        ["Total Scans", total],
        ["Email Scans", analytics.emails],
        ["URL Scans", analytics.urls],
        ["SMS Scans", analytics.sms],
        ["Threats Detected", analytics.threats],
        ["Safe Scans", safeScans],
        ["Safe Rate", `${safeRate}%`],
        ["AI Accuracy", "96.4%"],
        ["Security Score", `${analytics.security_score}/100`],
        ["Risk Level", analytics.risk_level],
      ],
      theme: "grid",
      headStyles: { fillColor: [220, 38, 38], textColor: [255, 255, 255] },
    });
    doc.save("GuardianX_Admin_Analytics_Report.pdf");
  };

  const kpis = [
    { icon: <FaShieldAlt />,          label: "Total Scans",       value: total,            sub: `${analytics.emails} Email · ${analytics.urls} URL · ${analytics.sms} SMS` },
    { icon: <FaExclamationTriangle />, label: "Threats Detected",  value: analytics.threats, sub: "Phishing & malicious inputs", accent: "red" },
    { icon: <FaCheckCircle />,         label: "Clean Scan Rate",   value: `${safeRate}%`,   sub: `${safeScans} verified clean` },
    { icon: <FaRobot />,               label: "AI Accuracy",       value: "96.4%",          sub: "Neural model confidence" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-screen-xl mx-auto">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0f0609] border border-red-600/25 rounded-xl p-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-cyber uppercase tracking-widest text-red-400 px-2 py-0.5 rounded bg-red-600/15 border border-red-600/30">
                Admin — Analytics
              </span>
            </div>
            <h1 className="text-2xl font-bold font-cyber text-white">System Analytics Overview</h1>
            <p className="text-zinc-500 text-xs mt-1">
              AI-driven multi-vector security telemetry — <span className="text-red-300 font-mono">{user.email}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/admin/history"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-red-600/30 bg-red-600/10 hover:bg-red-600/20 text-red-300 text-xs font-cyber transition-all">
              <FaHistory size={11} /> Scan History
            </Link>
            <Link to="/admin/scanner"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-red-600/30 bg-red-600/10 hover:bg-red-600/20 text-red-300 text-xs font-cyber transition-all">
              <FaSearch size={11} /> Scanner
            </Link>
            <button
              onClick={exportReport}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-cyber font-bold transition-all shadow-[0_0_10px_rgba(220,38,38,0.35)]"
            >
              <FaFileExport size={11} /> Export PDF
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, i) => (
            <div key={i} className="bg-[#0f0609] border border-red-600/20 rounded-xl p-5 hover:border-red-600/35 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-lg ${kpi.accent === "red" ? "text-red-400" : "text-red-400/70"}`}>{kpi.icon}</span>
                <span className="text-[10px] font-cyber text-zinc-600 uppercase">Telemetry</span>
              </div>
              <p className="text-[10px] text-zinc-500 font-cyber uppercase tracking-wider">{kpi.label}</p>
              <h2 className={`text-3xl font-bold font-cyber mt-1 ${kpi.accent === "red" ? "text-red-400" : "text-white"}`}>{kpi.value}</h2>
              <p className="text-[10px] text-zinc-500 mt-2 font-mono">{kpi.sub}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="bg-[#0f0609] border border-red-600/20 rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-red-600/15 flex items-center gap-2">
            <FaShieldAlt className="text-red-400" size={13} />
            <span className="text-sm font-bold font-cyber text-zinc-200">Threat Intelligence Charts</span>
            <span className="ml-auto text-[10px] bg-red-600/15 text-red-300 px-2 py-0.5 rounded border border-red-600/25 font-cyber">SYSTEM OVERVIEW</span>
          </div>
          <div className="p-4">
            <DashboardCharts analytics={analytics} />
          </div>
        </div>

        {/* Threat Vector Matrix */}
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-[#0f0609] border border-red-600/20 rounded-xl p-5">
            <h2 className="text-sm font-bold font-cyber text-zinc-200 mb-4 flex items-center gap-2">
              <FaShieldAlt className="text-red-400" size={13} /> Threat Vector Breakdown
            </h2>
            <div className="space-y-4">
              {[
                { vector: "Email Phishing Scanner", count: analytics.emails,  color: "bg-red-500" },
                { vector: "Malicious URL Inspector", count: analytics.urls,   color: "bg-red-400" },
                { vector: "Smishing SMS Engine",    count: analytics.sms,    color: "bg-rose-400" },
              ].map((v) => (
                <div key={v.vector} className="bg-[#0a0407] p-4 rounded-xl border border-red-600/15">
                  <div className="flex justify-between text-xs font-cyber mb-2">
                    <span className="text-zinc-200 font-semibold">{v.vector}</span>
                    <span className="text-red-300">{v.count} Scans</span>
                  </div>
                  <div className="w-full bg-[#130709] h-2 rounded-full overflow-hidden border border-red-600/15">
                    <div className={`h-full ${v.color} transition-all duration-500`}
                      style={{ width: `${Math.min(100, (v.count / (total || 1)) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Score */}
          <div className="bg-[#0f0609] border border-red-600/20 rounded-xl p-5">
            <h2 className="text-sm font-bold font-cyber text-zinc-200 mb-4">Security Score</h2>
            <div className="flex flex-col items-center justify-center p-6 bg-[#0a0407] rounded-xl border border-red-600/15 text-center">
              <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center text-3xl font-bold font-cyber shadow-[0_0_20px_rgba(220,38,38,0.3)] ${
                analytics.security_score >= 80 ? "border-emerald-500 text-emerald-400" : "border-red-500 text-red-400"
              }`}>
                {analytics.security_score}
              </div>
              <p className="text-sm font-cyber font-bold text-zinc-200 mt-4">System Clearance</p>
              <p className="text-xs text-zinc-500 mt-1">
                {analytics.security_score >= 80 ? "Optimal Protection Active" : "Action Recommended"}
              </p>
              <Link to="/admin/history"
                className="mt-5 text-xs text-red-400 font-cyber flex items-center gap-1 hover:underline">
                <FaHistory size={11} /> View Full Audit Log →
              </Link>
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}

export default AdminAnalytics;
