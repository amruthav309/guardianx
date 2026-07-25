import { Navigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import QuickScanner from "../../components/QuickScanner";
import { getCurrentUser } from "../../services/auth";
import { FaShieldAlt, FaRobot, FaBolt, FaHistory, FaChartPie } from "react-icons/fa";
import { Link } from "react-router-dom";

function AdminScanner() {
  const user = getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-screen-xl mx-auto">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0f0609] border border-red-600/25 rounded-xl p-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-cyber uppercase tracking-widest text-red-400 px-2 py-0.5 rounded bg-red-600/15 border border-red-600/30">
                Admin — Threat Scanner
              </span>
            </div>
            <h1 className="text-2xl font-bold font-cyber text-white">AI Security Threat Scanner</h1>
            <p className="text-zinc-500 text-xs mt-1">
              Executing with super-admin clearance — <span className="text-red-300 font-mono">{user.email}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/admin/history"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-red-600/30 bg-red-600/10 hover:bg-red-600/20 text-red-300 text-xs font-cyber transition-all">
              <FaHistory size={11} /> Scan History
            </Link>
            <Link to="/admin/analytics"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-red-600/30 bg-red-600/10 hover:bg-red-600/20 text-red-300 text-xs font-cyber transition-all">
              <FaChartPie size={11} /> Analytics
            </Link>
          </div>
        </div>

        {/* Status Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 bg-[#0f0609] border border-red-600/20 rounded-xl p-3.5">
            <div className="w-9 h-9 rounded-lg bg-red-600/15 border border-red-600/25 flex items-center justify-center text-red-400">
              <FaRobot size={15} />
            </div>
            <div>
              <p className="text-[9px] text-zinc-500 font-cyber uppercase tracking-wider">Detection Model</p>
              <p className="text-xs font-bold font-cyber text-red-400">GuardianX Neural AI v2</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-[#0f0609] border border-red-600/20 rounded-xl p-3.5">
            <div className="w-9 h-9 rounded-lg bg-red-600/15 border border-red-600/25 flex items-center justify-center text-red-400">
              <FaShieldAlt size={15} />
            </div>
            <div>
              <p className="text-[9px] text-zinc-500 font-cyber uppercase tracking-wider">Protection Status</p>
              <p className="text-xs font-bold font-cyber text-emerald-400">● ACTIVE</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-[#0f0609] border border-red-600/20 rounded-xl p-3.5">
            <div className="w-9 h-9 rounded-lg bg-red-600/15 border border-red-600/25 flex items-center justify-center text-red-400">
              <FaBolt size={15} />
            </div>
            <div>
              <p className="text-[9px] text-zinc-500 font-cyber uppercase tracking-wider">AI Confidence</p>
              <p className="text-xs font-bold font-cyber text-red-400">96.4% Accuracy</p>
            </div>
          </div>
        </div>

        {/* Scanner Component - Embedded with Red Theme Wrapper */}
        <div className="bg-[#0f0609] border border-red-600/20 rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-red-600/15 flex items-center gap-2">
            <FaShieldAlt className="text-red-400" size={13} />
            <span className="text-sm font-bold font-cyber text-zinc-200">Multi-Vector Threat Scanner</span>
            <span className="ml-auto text-[10px] bg-red-600/20 text-red-300 px-2 py-0.5 rounded border border-red-600/30 font-cyber">LOCKDOWN MODE</span>
          </div>
          <div className="p-4">
            <QuickScanner theme="red" />
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}

export default AdminScanner;
