import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getCurrentUser } from "../services/auth";
import {
  FaBell, FaShieldAlt, FaSave, FaTrash, FaUserMinus,
  FaDatabase, FaLock, FaExclamationTriangle
} from "react-icons/fa";
import { FiToggleLeft, FiToggleRight } from "react-icons/fi";

function Settings() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;

  const [sidebarOpen, setSidebarOpen] = useState(() =>
    localStorage.getItem("sidebarOpen") !== "false"
  );
  const [notifications, setNotifications] = useState(true);
  const [sensitivity, setSensitivity] = useState("High");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user.id) return;
    const savedStr = localStorage.getItem(`guardianx_settings_${user.id}`);
    if (savedStr) {
      const s = JSON.parse(savedStr);
      setNotifications(s.notifications ?? true);
      setSensitivity(s.sensitivity ?? "High");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebarOpen", String(sidebarOpen));
  }, [sidebarOpen]);

  const saveSettings = () => {
    localStorage.setItem(
      `guardianx_settings_${user.id}`,
      JSON.stringify({ notifications, sensitivity })
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "This will permanently delete your account. Are you absolutely sure?"
    );
    if (!confirmed) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/users/delete/${user.id}`, { method: "DELETE" });
      if (res.ok) {
        localStorage.clear();
        navigate("/login");
      } else {
        alert("Unable to delete account. Try again.");
      }
    } catch { alert("Server error. Try again later."); }
  };

  const ToggleSwitch = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!value)}
      className={`text-3xl transition-all ${value ? "text-cyan-400" : "text-zinc-600"} cursor-pointer`}
    >
      {value ? <FiToggleRight /> : <FiToggleLeft />}
    </button>
  );

  return (
    <div className="flex min-h-screen bg-[#070709] text-white page-enter">
      {sidebarOpen && <Sidebar />}
      <div className="flex-1 p-5 overflow-y-auto">
        <Topbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="mt-8">
          <h1 className="text-2xl font-bold font-cyber text-cyan-400 glow-text-cyan">System Settings</h1>
          <p className="text-zinc-500 text-xs mt-1">
            Configure your GuardianX security preferences for{" "}
            <span className="text-cyan-400 font-mono">{user.email}</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mt-8">

          {/* Scan Settings */}
          <div className="glass-panel-cyan rounded-xl border border-cyan-500/20 p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <FaShieldAlt size={14} />
              </div>
              <div>
                <h2 className="text-sm font-bold font-cyber text-zinc-200">Scan Engine</h2>
                <p className="text-[10px] text-zinc-500">Detection and sensitivity controls</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs font-cyber text-zinc-300">Threat Notifications</p>
                  <p className="text-[10px] text-zinc-600 mt-0.5">Alert on phishing detection</p>
                </div>
                <ToggleSwitch value={notifications} onChange={setNotifications} />
              </div>

              <div>
                <p className="text-xs font-cyber text-zinc-300 mb-2">Detection Sensitivity</p>
                <select
                  value={sensitivity}
                  onChange={(e) => setSensitivity(e.target.value)}
                  className="w-full bg-[#0e0e11] border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 font-cyber outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="Low">Low — Fewer false positives</option>
                  <option value="Medium">Medium — Balanced detection</option>
                  <option value="High">High — Maximum protection</option>
                </select>
              </div>
            </div>

            <button
              onClick={saveSettings}
              className={`mt-6 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-cyber font-bold transition-all cursor-pointer ${
                saved
                  ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
                  : "bg-cyan-500 hover:bg-cyan-400 text-black glow-cyan"
              }`}
            >
              <FaSave size={11} />
              {saved ? "✓ Configuration Saved" : "Save Configuration"}
            </button>
          </div>

          {/* Security Controls */}
          <div className="glass-panel-violet rounded-xl border border-violet-500/20 p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
              <div className="w-9 h-9 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                <FaLock size={14} />
              </div>
              <div>
                <h2 className="text-sm font-bold font-cyber text-zinc-200">Security Controls</h2>
                <p className="text-[10px] text-zinc-500">Session and data management</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate("/switch-account")}
                className="w-full flex items-center justify-between p-3 bg-[#0e0e11] border border-zinc-800 rounded-lg hover:border-cyan-500/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <FaDatabase className="text-cyan-400 text-sm" />
                  <div className="text-left">
                    <p className="text-xs font-cyber text-zinc-300">Identity Matrix</p>
                    <p className="text-[10px] text-zinc-600">Switch between accounts</p>
                  </div>
                </div>
                <span className="text-zinc-600 group-hover:text-cyan-400 transition-colors">›</span>
              </button>

              <button
                onClick={() => navigate("/profile")}
                className="w-full flex items-center justify-between p-3 bg-[#0e0e11] border border-zinc-800 rounded-lg hover:border-cyan-500/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <FaBell className="text-amber-400 text-sm" />
                  <div className="text-left">
                    <p className="text-xs font-cyber text-zinc-300">Change Password</p>
                    <p className="text-[10px] text-zinc-600">Update security key</p>
                  </div>
                </div>
                <span className="text-zinc-600 group-hover:text-cyan-400 transition-colors">›</span>
              </button>
            </div>
          </div>

          {/* Database Panel */}
          <div className="bg-[#0e0e11]/80 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
              <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400">
                <FaDatabase size={14} />
              </div>
              <div>
                <h2 className="text-sm font-bold font-cyber text-zinc-200">Database Management</h2>
                <p className="text-[10px] text-zinc-500">Manage your isolated scan records</p>
              </div>
            </div>

            <div className="p-3 bg-emerald-500/5 border border-emerald-500/15 rounded-lg mb-4">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500 font-cyber">Storage</span>
                <span className="text-emerald-400 font-cyber">Isolated ✓</span>
              </div>
              <div className="flex justify-between text-xs mt-1.5">
                <span className="text-zinc-500 font-cyber">User ID</span>
                <span className="text-zinc-300 font-mono">#{user.id}</span>
              </div>
            </div>

            <button
              onClick={async () => {
                if (!window.confirm("Clear all your scan history?")) return;
                try {
                  await fetch(`http://127.0.0.1:8000/history/clear?user_id=${user.id}`, { method: "DELETE" });
                  alert("History cleared successfully.");
                } catch { alert("Error clearing history."); }
              }}
              className="w-full flex items-center justify-center gap-2 bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 py-2.5 rounded-lg text-xs font-cyber transition-all cursor-pointer"
            >
              <FaTrash size={10} />
              Clear Scan Records
            </button>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-red-500/20">
              <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                <FaExclamationTriangle size={14} />
              </div>
              <div>
                <h2 className="text-sm font-bold font-cyber text-red-400">Danger Zone</h2>
                <p className="text-[10px] text-zinc-500">Irreversible account actions</p>
              </div>
            </div>

            <p className="text-xs text-zinc-500 mb-4">
              Deleting your account will permanently erase all data, scan records, and access credentials. This cannot be undone.
            </p>

            <button
              onClick={handleDeleteAccount}
              className="w-full flex items-center justify-center gap-2 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 py-2.5 rounded-lg text-xs font-cyber transition-all cursor-pointer"
            >
              <FaUserMinus size={10} />
              Terminate Account Permanently
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Settings;