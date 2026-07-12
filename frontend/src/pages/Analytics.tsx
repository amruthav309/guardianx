import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getAnalytics } from "../services/auth";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import DashboardCharts from "../components/dashboardcharts";

function Analytics() {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
  return localStorage.getItem("sidebarOpen") !== "false";
});
  useEffect(() => {

    loadAnalytics();

}, []);

useEffect(() => {
  localStorage.setItem(
    "sidebarOpen",
    String(sidebarOpen)
  );
}, [sidebarOpen]);
const loadAnalytics = async () => {

    try {

        const user = JSON.parse(
            localStorage.getItem("guardianx_user") || "{}"
        );

        const data = await getAnalytics(user.id);

        setAnalytics(data);

    }

    catch (error) {

        console.log(error);

    }

};

  const [analytics, setAnalytics] = useState({
  total_scans: 0,
  emails: 0,
  urls: 0,
  sms: 0,
  threats: 0,
});

  const total = analytics.total_scans;

  const safeScans = total - analytics.threats;

  const safeRate =
    total > 0
      ? ((safeScans / total) * 100).toFixed(1)
      : "0";

  const exportReport = () => {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.setTextColor(0, 170, 255);

    doc.text(
      "GuardianX Analytics Report",
      14,
      20
    );

    doc.setFontSize(11);

    doc.setTextColor(100);

    doc.text(
      `Generated: ${new Date().toLocaleString()}`,
      14,
      30
    );

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
        ["Average Scan Time", "0.42 sec"],
        ["System Status", "Protected"],
      ],

      theme: "grid",

      headStyles: {
        fillColor: [0, 180, 255],
      },
    });

    doc.save(
      "GuardianX_Analytics_Report.pdf"
    );
  };

  return (
    <div className="flex min-h-screen bg-[#09090B] text-white">

      <button
  onClick={() => setSidebarOpen(!sidebarOpen)}
  className={`fixed top-6 z-50 w-10 h-10 rounded-full
  bg-cyan-500 hover:bg-cyan-600
  text-black shadow-lg
  flex items-center justify-center
  transition-all duration-300
  ${sidebarOpen ? "left-[210px]" : "left-4"}`}
>
  {sidebarOpen ? "◀" : "▶"}
</button>

      {sidebarOpen && <Sidebar />}

      <div className="flex-1 p-4 max-w-[1450px] mx-auto overflow-x-hidden">

        <Topbar />

        {/* Header */}

        <div className="mt-6 flex flex-col lg:flex-row justify-between items-center">

          <div>

            <h1 className="text-3xl font-bold text-cyan-400">
              Analytics Dashboard
            </h1>

            <p className="text-zinc-400 mt-2">
              AI Powered Security Intelligence Center
            </p>

          </div>

          <button
            onClick={exportReport}
            className="mt-2 lg:mt-0 px-4 py-2 rounded-xl bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition"
          >
            Export Report
          </button>

        </div>

        {/* KPI Cards */}

        <div className="grid xl:grid-cols-4 lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4 mt-6">

          <div className="bg-[#161616] border border-cyan-500/20 rounded-xl p-5">

            <div className="text-4xl">
              📊
            </div>

            <p className="text-zinc-400 mt-4">
              Total Scans
            </p>

            <h2 className="text-4xl font-bold text-cyan-400 mt-2">
              {total}
            </h2>

            <p className="text-green-400 mt-3 text-sm">
              +12 Today
            </p>

          </div>

          <div className="bg-[#161616] border border-red-500/20 rounded-xl p-5">

            <div className="text-3xl">
              🚨
            </div>

            <p className="text-zinc-400 mt-4">
              Threats Blocked
            </p>

            <h2 className="text-4xl font-bold text-red-500 mt-2">
              {analytics.threats}
            </h2>

            <p className="text-red-400 mt-3 text-sm">
              High Priority
            </p>

          </div>

          <div className="bg-[#161616] border border-green-500/20 rounded-2xl p-5">

            <div className="text-4xl">
              ✅
            </div>

            <p className="text-zinc-400 mt-4">
              Safe Scans
            </p>

            <h2 className="text-4xl font-bold text-green-400 mt-2">
              {safeScans}
            </h2>

            <p className="text-green-400 mt-3 text-sm">
              {safeRate}% Safe
            </p>

          </div>

          <div className="bg-[#161616] border border-yellow-500/20 rounded-2xl p-5">

            <div className="text-4xl">
              🤖
            </div>

            <p className="text-zinc-400 mt-4">
              AI Confidence
            </p>

            <h2 className="text-4xl font-bold text-yellow-400 mt-2">
              95%
            </h2>

            <p className="text-yellow-300 mt-3 text-sm">
              Excellent Detection
            </p>

          </div>

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
        