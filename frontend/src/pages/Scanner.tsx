import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import QuickScanner from "../components/QuickScanner";
import { getCurrentUser } from "../services/auth";
import { FaShieldAlt, FaRobot, FaBolt } from "react-icons/fa";

function Scanner() {
  const user = getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;

  const [sidebarOpen, setSidebarOpen] = useState(() =>
    localStorage.getItem("sidebarOpen") !== "false"
  );

  useEffect(() => {
    localStorage.setItem("sidebarOpen", String(sidebarOpen));
  }, [sidebarOpen]);

  return (
    <div className="flex min-h-screen bg-[#070709] text-white page-enter">
      {sidebarOpen && <Sidebar />}
      <div className="flex-1 p-5 overflow-y-auto">
        <Topbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Header */}
        <div className="mt-8 flex flex-col lg:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold font-cyber text-cyan-400 glow-text-cyan">
              AI Security Scanner
            </h1>
            <p className="text-zinc-500 text-xs mt-1">
              Powered by GuardianX Neural Engine — scanning for{" "}
              <span className="text-cyan-400 font-mono">{user.email}</span>
            </p>
          </div>

          {/* Status Chips */}
          <div className="flex gap-3">
            <div className="flex items-center gap-2 bg-[#0e0e11] border border-cyan-500/20 rounded-lg px-3 py-2">
              <FaRobot className="text-cyan-400 text-xs" />
              <div>
                <p className="text-[9px] text-zinc-600 font-cyber uppercase">Engine</p>
                <p className="text-[10px] text-cyan-400 font-cyber font-bold">GuardianX AI</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-[#0e0e11] border border-emerald-500/20 rounded-lg px-3 py-2">
              <FaBolt className="text-emerald-400 text-xs" />
              <div>
                <p className="text-[9px] text-zinc-600 font-cyber uppercase">Status</p>
                <p className="text-[10px] text-emerald-400 font-cyber font-bold">● READY</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-[#0e0e11] border border-violet-500/20 rounded-lg px-3 py-2">
              <FaShieldAlt className="text-violet-400 text-xs" />
              <div>
                <p className="text-[9px] text-zinc-600 font-cyber uppercase">Threat DB</p>
                <p className="text-[10px] text-violet-400 font-cyber font-bold">ONLINE</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scanner Grid — scan types info */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
          {[
            { label: "Email", icon: "✉", desc: "Phishing analysis" },
            { label: "URL", icon: "🌐", desc: "Link safety check" },
            { label: "SMS", icon: "💬", desc: "Text threat scan" },
            { label: "Password", icon: "🔑", desc: "Strength analysis" },
            { label: "File", icon: "📄", desc: "Malware scan" },
          ].map((t) => (
            <div key={t.label} className="bg-[#0e0e11] border border-zinc-800 hover:border-cyan-500/30 rounded-xl p-3 text-center transition-all hover-card-trigger cursor-default">
              <div className="text-2xl mb-1">{t.icon}</div>
              <p className="text-[11px] font-bold font-cyber text-zinc-200">{t.label}</p>
              <p className="text-[9px] text-zinc-600">{t.desc}</p>
            </div>
          ))}
        </div>

        {/* Main Scanner */}
        <div className="mt-6 glass-panel-cyan rounded-xl border border-cyan-500/20">
          <QuickScanner />
        </div>
      </div>
    </div>
  );
}

export default Scanner;