import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getCurrentUser, updateSecurityLevel, clearHistory, default as API } from "../services/auth";
import {
  FaBell, FaShieldAlt, FaSave, FaTrash, FaUserMinus,
  FaDatabase, FaLock, FaExclamationTriangle, FaHome
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
  const [securityLevel, setSecurityLevel] = useState(user.security_level || "Standard");
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

  const handleSecurityLevelChange = async (level: string) => {
    try {
      await updateSecurityLevel(user.id, level);
      setSecurityLevel(level);
      // Update local storage user profile
      const updatedUser = { ...user, security_level: level };
      localStorage.setItem("guardianx_user", JSON.stringify(updatedUser));
      // Dispatch custom event to notify other UI elements immediately
      window.dispatchEvent(new Event("guardianx_user_updated"));
    } catch {
      alert("Failed to update security level.");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "This will permanently delete your account. Are you absolutely sure?"
    );
    if (!confirmed) return;
    try {
      const res = await API.delete(`/users/delete/${user.id}`);
      if (res.data || res.status === 200) {
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
      className={`text-3xl transition-all ${value ? "text-sky-400" : "text-slate-600"} cursor-pointer`}
    >
      {value ? <FiToggleRight /> : <FiToggleLeft />}
    </button>
  );

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
      <div className="flex-1 p-3 sm:p-5 overflow-y-auto min-w-0">
        <Topbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-serif-header text-sky-400 glow-text-cyan">System Settings</h1>
            <p className="text-sky-400/60 text-xs mt-1">
              Configure your GuardianX security preferences for{" "}
              <span className="text-cyan-300 font-mono">{user.email}</span>
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#111927] border border-sky-500/30 text-sky-400 hover:bg-sky-500/15 text-xs font-cyber transition-all cursor-pointer font-semibold shadow-md w-fit"
          >
            <FaHome size={12} />
            Return to Dashboard
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mt-8">

          {/* Scan Settings */}
          <div className="glass-panel-cyan rounded-2xl border border-sky-500/20 p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-sky-500/15">
              <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <FaShieldAlt size={14} />
              </div>
              <div>
                <h2 className="text-sm font-bold font-cyber text-slate-200">Scan Engine</h2>
                <p className="text-[10px] text-sky-400/60">Detection and sensitivity controls</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs font-cyber text-slate-300">Threat Notifications</p>
                  <p className="text-[10px] text-sky-400/50 mt-0.5">Alert on phishing detection</p>
                </div>
                <ToggleSwitch value={notifications} onChange={setNotifications} />
              </div>

              <div>
                <p className="text-xs font-cyber text-slate-300 mb-2">Detection Sensitivity</p>
                <select
                  value={sensitivity}
                  onChange={(e) => setSensitivity(e.target.value)}
                  className="w-full bg-[#080e18] border border-sky-500/20 rounded-xl px-3 py-2 text-xs text-slate-300 font-cyber outline-none focus:border-sky-400 cursor-pointer"
                >
                  <option value="Low">Low — Fewer false positives</option>
                  <option value="Medium">Medium — Balanced detection</option>
                  <option value="High">High — Maximum protection</option>
                </select>
              </div>
            </div>

            <button
              onClick={saveSettings}
              className={`mt-6 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-cyber font-bold transition-all cursor-pointer ${
                saved
                  ? "bg-sky-500/20 border border-sky-500/30 text-sky-400"
                  : "bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white glow-cyan shadow-lg shadow-sky-500/25"
              }`}
            >
              <FaSave size={11} />
              {saved ? "✓ Configuration Saved" : "Save Configuration"}
            </button>
          </div>

          {/* Security Controls */}
          <div className="glass-panel-cyan rounded-2xl border border-sky-500/20 p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-sky-500/15">
              <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <FaLock size={14} />
              </div>
              <div>
                <h2 className="text-sm font-bold font-cyber text-slate-200">Security Credentials</h2>
                <p className="text-[10px] text-sky-400/60">Credential and session management</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate("/profile", { state: { openPassword: true } })}
                className="w-full flex items-center justify-between p-3.5 bg-[#080e18] border border-sky-500/20 rounded-xl hover:border-sky-400 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <FaBell className="text-amber-400 text-sm" />
                  <div className="text-left">
                    <p className="text-xs font-cyber text-slate-200">Change Password</p>
                    <p className="text-[10px] text-sky-400/50">Update master security key</p>
                  </div>
                </div>
                <span className="text-sky-400/60 group-hover:text-sky-400 transition-colors">›</span>
              </button>
            </div>
          </div>

          {/* Security Levels Panel */}
          <div className="bg-[#111927]/90 border border-sky-500/20 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-sky-500/15">
              <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <FaShieldAlt size={14} />
              </div>
              <div>
                <h2 className="text-sm font-bold font-cyber text-slate-200">Security Clearance Level</h2>
                <p className="text-[10px] text-sky-400/60">Configure real-time terminal protection mechanisms</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { level: "Standard", desc: "Level 1 — Default protection. Enforces firewall rules and standard scan operations.", badge: "Standard Guard", activeColor: "border-sky-400 bg-sky-500/10 shadow-[0_0_12px_rgba(56,189,248,0.25)] text-sky-400 font-bold" },
                { level: "Enhanced", desc: "Level 2 — Elevated status. Performs deep heuristics on code analysis and blinks alert feeds.", badge: "Enhanced Shield", activeColor: "border-amber-500 bg-amber-500/10 shadow-[0_0_12px_rgba(245,158,11,0.2)] text-amber-400 font-bold" },
                { level: "Lockdown", desc: "Level 3 — Ultimate protection. Auto-encrypts sessions, restricts identity alterations, and enforces protocol lockdown.", badge: "Maximum Lockdown", activeColor: "border-rose-500 bg-rose-500/10 shadow-[0_0_12px_rgba(244,63,94,0.2)] text-rose-400 font-bold" },
              ].map((item) => {
                const isActive = securityLevel === item.level;
                return (
                  <button
                    key={item.level}
                    onClick={() => handleSecurityLevelChange(item.level)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex justify-between items-start gap-4 ${
                      isActive ? item.activeColor : "border-sky-500/15 bg-[#080e18] hover:bg-[#131f33]"
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-cyber tracking-wide uppercase">{item.badge}</span>
                        {isActive && <span className="text-[8px] font-cyber px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-400 border border-sky-500/30 animate-pulse">ACTIVE</span>}
                      </div>
                      <p className="text-[10px] text-sky-400/60 mt-1">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Database Panel */}
          <div className="bg-[#111927]/90 border border-sky-500/20 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-sky-500/15">
              <div className="w-9 h-9 rounded-xl bg-[#080e18] border border-sky-500/20 flex items-center justify-center text-sky-400">
                <FaDatabase size={14} />
              </div>
              <div>
                <h2 className="text-sm font-bold font-cyber text-slate-200">Database Management</h2>
                <p className="text-[10px] text-sky-400/60">Manage your isolated scan records</p>
              </div>
            </div>

            <div className="p-3 bg-sky-500/5 border border-sky-500/15 rounded-xl mb-4">
              <div className="flex justify-between text-xs">
                <span className="text-sky-400/60 font-cyber">Storage</span>
                <span className="text-sky-400 font-cyber">Isolated ✓</span>
              </div>
              <div className="flex justify-between text-xs mt-1.5">
                <span className="text-sky-400/60 font-cyber">User ID</span>
                <span className="text-slate-300 font-mono">#{user.id}</span>
              </div>
            </div>

            <button
              onClick={async () => {
                if (!window.confirm("Clear all your scan history?")) return;
                try {
                  await clearHistory();
                  alert("History cleared successfully.");
                } catch { alert("Error clearing history."); }
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#080e18] hover:bg-sky-500/15 border border-sky-500/20 text-slate-300 py-2.5 rounded-xl text-xs font-cyber transition-all cursor-pointer"
            >

              <FaTrash size={10} />
              Clear Scan Records
            </button>
          </div>

          {/* Danger Zone */}
          <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-6 lg:col-span-2 shadow-xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-rose-500/20">
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <FaExclamationTriangle size={14} />
              </div>
              <div>
                <h2 className="text-sm font-bold font-cyber text-rose-400">Danger Zone</h2>
                <p className="text-[10px] text-sky-400/60">Irreversible account actions</p>
              </div>
            </div>

            <p className="text-xs text-sky-400/60 mb-4">
              Deleting your account will permanently erase all data, scan records, and access credentials. This cannot be undone.
            </p>

            <button
              onClick={handleDeleteAccount}
              className="w-full sm:w-auto px-6 flex items-center justify-center gap-2 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 py-2.5 rounded-xl text-xs font-cyber transition-all cursor-pointer"
            >
              <FaUserMinus size={10} />
              Delete Account
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Settings;