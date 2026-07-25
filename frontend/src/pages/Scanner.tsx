import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import QuickScanner from "../components/QuickScanner";
import { getCurrentUser } from "../services/auth";
import { FaShieldAlt, FaRobot, FaBolt, FaHome, FaHistory } from "react-icons/fa";

function Scanner() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;

  const [sidebarOpen, setSidebarOpen] = useState(() =>
    localStorage.getItem("sidebarOpen") !== "false"
  );

  useEffect(() => {
    localStorage.setItem("sidebarOpen", String(sidebarOpen));
  }, [sidebarOpen]);

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

        {/* Top Header with Dashboard Jump Button */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#111927]/90 border border-sky-500/20 rounded-2xl p-5 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-cyber uppercase tracking-widest text-sky-400 px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20">
                Core Protection Engine
              </span>
            </div>
            <h1 className="text-3xl font-bold font-serif-header text-slate-100">
              AI Security Threat Scanner
            </h1>
            <p className="text-sky-400/60 text-xs mt-1">
              Powered by GuardianX Neural Engine — scanning for{" "}
              <span className="text-cyan-300 font-mono">{user.email}</span>
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
              onClick={() => navigate("/history")}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#111927] border border-sky-500/30 text-sky-300 hover:bg-sky-500/20 text-xs font-cyber font-semibold transition-all cursor-pointer shadow-md"
            >
              <FaHistory size={12} />
              <span>Scan Logs</span>
            </button>
          </div>
        </div>

        {/* Status Chips Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="flex items-center gap-3 bg-[#111927]/90 border border-sky-500/20 rounded-2xl p-3.5 shadow-lg">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <FaRobot size={15} />
            </div>
            <div>
              <p className="text-[9px] text-sky-400/60 font-cyber uppercase tracking-wider">Detection Model</p>
              <p className="text-xs text-sky-400 font-cyber font-bold">GuardianX AI v4.2</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#111927]/90 border border-sky-500/20 rounded-2xl p-3.5 shadow-lg">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <FaBolt size={15} />
            </div>
            <div>
              <p className="text-[9px] text-sky-400/60 font-cyber uppercase tracking-wider">Engine Status</p>
              <p className="text-xs text-sky-400 font-cyber font-bold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-ping" /> ● READY FOR SCAN
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#111927]/90 border border-sky-500/20 rounded-2xl p-3.5 shadow-lg">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-300">
              <FaShieldAlt size={15} />
            </div>
            <div>
              <p className="text-[9px] text-sky-400/60 font-cyber uppercase tracking-wider">Active Clearance</p>
              <p className="text-xs text-slate-200 font-cyber font-bold uppercase">{user.security_level || "Standard"}</p>
            </div>
          </div>
        </div>

        {/* Quick Scanner Core */}
        <div className="mt-8">
          <QuickScanner />
        </div>
      </div>
    </div>
  );
}

export default Scanner;