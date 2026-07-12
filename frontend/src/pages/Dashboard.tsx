import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Navigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatsCard from "../components/StatsCard";
import DashboardCharts from "../components/dashboardcharts";


import { useTheme } from "../context/ThemeContext";

import {
  getAnalytics,
  getHistory,
  clearHistory,
  getCurrentUser,
} from "../services/auth";

import {
  FaEnvelope,
  FaGlobe,
  FaSms,
  FaBug,
  FaShieldAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

function Dashboard() {
  const { theme } = useTheme();

  const isDark = theme === "dark";

  const [sidebarOpen, setSidebarOpen] = useState(() => {
  return localStorage.getItem("sidebarOpen") !== "false";
});

  const [analytics, setAnalytics] = useState({
    emails: 0,
    urls: 0,
    sms: 0,
    threats: 0,
  });

  const [history, setHistory] = useState<any[]>([]);

  const user = getCurrentUser();
  console.log(user);
  

  if (!user) {
  return <Navigate to="/login" replace />;
}

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
  localStorage.setItem(
    "sidebarOpen",
    String(sidebarOpen)
  );
}, [sidebarOpen]);

  const loadDashboard = async () => {
    try {
      const analyticsData = await getAnalytics(user.id);
      setAnalytics(analyticsData);
      const historyData = await getHistory();

console.log(historyData);

setHistory(historyData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClearHistory = async () => {
    const ok = window.confirm("Clear all scan history?");

    if (!ok) return;

    try {
      await clearHistory();

      await loadDashboard();

      alert("History cleared successfully.");
    } catch {
      alert("Unable to clear history.");
    }
  };

  const totalScans =
    analytics.emails +
    analytics.urls +
    analytics.sms;

  const riskLevel =
    analytics.threats > 10
      ? "HIGH"
      : analytics.threats > 5
      ? "MEDIUM"
      : "LOW";
      return (
    <div
      className={`flex min-h-screen transition-all duration-500 ${
        isDark
          ? "bg-[#09090B] text-white"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Floating Hamburger */}

    

      {/* Sidebar */}

      {sidebarOpen && <Sidebar />}

      {/* Main */}

      <div className="flex-1 p-5 transition-all duration-300">

        <Topbar />

        {/* Welcome */}

        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >

          <div className="flex flex-col lg:flex-row justify-between gap-6">

  {/* Left */}

  <div>

    <h1 className="text-3xl md:text-5xl font-extrabold">

      Welcome back,

      <span className="text-cyan-400">
        {" "}
        {user?.name || "User"} 👋
      </span>

    </h1>

    <p className="text-zinc-400 text-base md:text-lg mt-3">

      GuardianX Enterprise Security Dashboard

    </p>

    <p className="text-zinc-500 mt-3">

      Last Login

      <span className="text-green-400 font-semibold ml-2">

        {user?.last_login
          ? new Date(user.last_login).toLocaleString()
          : "First Login"}

      </span>

    </p>

  </div>


</div>
        </motion.div>

        {/* Stats */}

        <motion.div
          className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5 mt-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >

 <StatsCard
  title="Emails Scanned"
  value={analytics.emails}
  icon={<FaEnvelope />}
/>

<StatsCard
  title="URLs Scanned"
  value={analytics.urls}
  icon={<FaGlobe />}
/>

<StatsCard
  title="SMS Scanned"
  value={analytics.sms}
  icon={<FaSms />}
/>

<StatsCard
  title="Threats Blocked"
  value={analytics.threats}
  icon={<FaBug />}
  color="text-red-500"
/>

        </motion.div>

        {/* Charts */}

        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >

          <DashboardCharts
            analytics={analytics}
          />

        </motion.div>
  
        {/* Threat Intelligence */}

        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >

          <h2 className="text-3xl font-bold text-cyan-400 mb-5">
            Threat Intelligence
          </h2>

          <div
            className={`rounded-xl p-6 shadow-lg border border-cyan-500/20 transition-all duration-500 ${
              isDark ? "bg-[#161616]" : "bg-white"
            }`}
          >

            <div className="grid lg:grid-cols-2 gap-8 items-center">

              <div>

                <div className="flex items-center gap-3">
                  <FaShieldAlt className="text-green-400" size={30} />
                  <h2 className="text-2xl font-bold text-green-400">
                    GuardianX Protection
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">

                  <div className="bg-[#202020] rounded-lg p-5">
                    <p className="text-zinc-400 text-sm">Total Scans</p>
                    <h3 className="text-3xl font-bold mt-2">
                      {totalScans}
                    </h3>
                  </div>

                  <div className="bg-[#202020] rounded-lg p-5">
                    <p className="text-zinc-400 text-sm">Threats Detected</p>
                    <h3 className="text-3xl font-bold text-red-500 mt-2">
                      {analytics.threats}
                    </h3>
                  </div>

                  <div className="bg-[#202020] rounded-lg p-5">
                    <p className="text-zinc-400 text-sm">Protection</p>
                    <h3 className="text-xl font-bold text-green-400 mt-2">
                      ACTIVE
                    </h3>
                  </div>

                  <div className="bg-[#202020] rounded-lg p-5">
                    <p className="text-zinc-400 text-sm">Firewall</p>
                    <h3 className="text-xl font-bold text-green-400 mt-2">
                      ENABLED
                    </h3>
                  </div>

                </div>

              </div>

              <div className="space-y-6">

  <div className="text-center">

    <h2 className="text-2xl font-bold text-cyan-400">

      Overall Risk Level

    </h2>

    <h1
      className={`text-5xl md:text-7xl font-bold mt-4 ${
        riskLevel === "HIGH"
          ? "text-red-500"
          : riskLevel === "MEDIUM"
          ? "text-yellow-400"
          : "text-green-400"
      }`}
    >
      {riskLevel}
    </h1>

  </div>

  <div className="bg-[#202020] rounded-xl p-5 border border-cyan-500/20">

    <h3 className="text-cyan-400 font-bold mb-4">

      Live Security Status

    </h3>

    <div className="space-y-3">

      <div className="flex justify-between">

        <span>🛡 Firewall</span>

        <span className="text-green-400">

          ACTIVE

        </span>

      </div>

      <div className="flex justify-between">

        <span>🤖 AI Scanner</span>

        <span className="text-green-400">

          RUNNING

        </span>

      </div>

      <div className="flex justify-between">

        <span>🌐 Threat Feed</span>

        <span className="text-green-400">

          CONNECTED

        </span>

      </div>

      <div className="flex justify-between">

        <span>🔐 Session</span>

        <span className="text-green-400">

          SECURE

        </span>

      </div>

      <div className="flex justify-between">

        <span>📊 Database</span>

        <span className="text-green-400">

          ONLINE

        </span>

      </div>

      <div className="flex justify-between">

        <span>⏱ Last Sync</span>

        <span className="text-cyan-400">

          Just Now

        </span>

      </div>

    </div>

  </div>

</div>

            </div>

          </div>

        </motion.div>

        {/* Recent Activity */}

        <motion.div
          className="mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >

          <div className="flex justify-between items-center mb-5">

            <h2 className="text-3xl font-bold text-cyan-400">
              Recent Activity
            </h2>

            <button
              onClick={handleClearHistory}
              className="bg-red-600 hover:bg-red-700 transition px-5 py-2 rounded-lg font-semibold"
            >
              🗑 Clear History
            </button>

          </div>

          <div
            className={`rounded-xl p-6 shadow-lg ${
              isDark ? "bg-[#161616]" : "bg-white"
            }`}
          >

            <div className="overflow-x-auto">
            <table className="min-w-full">

              <thead>

                <tr className="border-b border-zinc-700 text-cyan-400">

                  <th className="text-left py-3">Scan Type</th>
                  <th className="text-left py-3">File</th>
                  <th className="text-left py-3">Status</th>
                  <th className="text-left py-3">Confidence</th>

                </tr>

              </thead>

              <tbody>

{history.length === 0 ? (

<tr>

<td
colSpan={4}
className="text-center py-12 text-zinc-500"
>

<div className="flex flex-col items-center">

<div className="text-6xl">
🛡
</div>

<p className="mt-4 text-xl">

No Security Activity Yet

</p>

<p className="text-zinc-500 mt-2">

Start scanning emails, URLs or SMS.

</p>

</div>

</td>

</tr>

) : (

history.map((item, index) => (

<motion.tr

key={index}

initial={{ opacity: 0, x: -20 }}

animate={{ opacity: 1, x: 0 }}

transition={{ delay: index * 0.08 }}

className="border-b border-zinc-800 hover:bg-[#202020] transition"

>

<td className="py-5">

<div className="flex items-center gap-3">

<span className="text-2xl">

{item.scan_type === "Email"
? "📧"
: item.scan_type === "URL"
? "🌐"
: "💬"}

</span>

<span>

{item.scan_type}

</span>

</div>

</td>

<td className="py-5">

{item.filename}

</td>

<td className="py-5">

<span
className={`px-4 py-2 rounded-full text-sm font-bold

${item.status === "Phishing"

? "bg-red-500/20 text-red-400"

: item.status === "Suspicious"

? "bg-yellow-500/20 text-yellow-400"

: "bg-green-500/20 text-green-400"

}`}

>

{item.status}

</span>

</td>

<td className="py-5">

<div className="flex items-center gap-3">

<div className="w-full bg-zinc-700 rounded-full h-2">

<div

className={`h-2 rounded-full

${item.confidence >= 90

? "bg-green-500"

: item.confidence >= 70

? "bg-yellow-400"

: "bg-red-500"

}`}

style={{

width: `${item.confidence}%`

}}

></div>

</div>

<span className="font-bold">

{item.confidence}%

</span>

</div>

</td>

</motion.tr>

))

)}

</tbody>

            </table>

            </div>

          </div>

        </motion.div>

      </div>

    </div>

  );

}

export default Dashboard;