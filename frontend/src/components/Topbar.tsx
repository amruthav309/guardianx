import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiBell,
  FiSettings,
  FiLogOut,
  FiChevronDown,
  FiRefreshCw,
} from "react-icons/fi";
import { FaShieldAlt, FaUserCircle } from "react-icons/fa";

interface TopbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Topbar({ sidebarOpen, setSidebarOpen }: TopbarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("guardianx_user") || "{}");
  const userName = user.name || user.username || "Agent";
  const profilePic = user.profile_pic || "";

  const notificationCount = notifications.filter((n) => !n.read).length;

  const openNotifications = () => {
    const updated = notifications.map((item) => ({ ...item, read: true }));
    setNotifications(updated);
    localStorage.setItem("guardianx_notifications", JSON.stringify(updated));
    setNotificationOpen(!notificationOpen);
    setProfileOpen(false);
  };

  const markAllRead = () => {
    const updated = notifications.map((item) => ({ ...item, read: true }));
    setNotifications(updated);
    localStorage.setItem("guardianx_notifications", JSON.stringify(updated));
  };

  const clearNotifications = () => {
    setNotifications([]);
    localStorage.removeItem("guardianx_notifications");
  };

  const handleLogout = () => {
    setProfileOpen(false);
    navigate("/logout");
  };

  useEffect(() => {
    const saved = localStorage.getItem("guardianx_notifications");
    if (saved) setNotifications(JSON.parse(saved));
  }, [location]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
        setNotificationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const pageTitle: Record<string, string> = {
    "/dashboard": "Security Dashboard",
    "/analytics": "Threat Analytics",
    "/history": "Scan History",
    "/scanner": "AI Scanner",
    "/profile": "Agent Profile",
    "/settings": "System Settings",
    "/switch-account": "Identity Matrix",
  };

  const currentTitle = pageTitle[location.pathname] || "GuardianX";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-[#070709]/90 backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">

        {/* Left Side */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-cyan-400 transition-all"
          >
            <FiMenu size={20} />
          </button>

          <div className="hidden md:block">
            <p className="text-xs text-zinc-500 font-cyber uppercase tracking-widest">GuardianX</p>
            <h2 className="text-sm font-bold text-zinc-200 font-cyber">{currentTitle}</h2>
          </div>

          {/* Logo - visible when sidebar closed */}
          {!sidebarOpen && (
            <Link to="/dashboard" className="flex items-center gap-2 md:hidden">
              <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center">
                <FaShieldAlt className="text-black text-sm" />
              </div>
              <span className="font-cyber font-bold text-cyan-400 text-lg">GX</span>
            </Link>
          )}
        </div>

        {/* Right Side */}
        <div ref={profileRef} className="relative flex items-center gap-2">

          {/* Notification Bell */}
          <button
            onClick={openNotifications}
            className="relative p-2 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-cyan-400 transition-all"
          >
            <FiBell size={18} />
            {notificationCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-bold">
                {notificationCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {notificationOpen && (
            <div className="absolute right-0 top-12 w-80 rounded-xl border border-zinc-800 bg-[#0e0e11] shadow-2xl z-50">
              <div className="border-b border-zinc-800 p-3 flex items-center justify-between">
                <h2 className="font-bold text-sm font-cyber text-zinc-200">Threat Alerts</h2>
                <div className="flex gap-2">
                  <button onClick={markAllRead} className="text-[10px] bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-2 py-1 rounded font-cyber">
                    Mark All
                  </button>
                  <button onClick={clearNotifications} className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-1 rounded font-cyber">
                    Clear
                  </button>
                </div>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-zinc-500 text-xs font-cyber">
                    No active threat alerts
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`border-b border-zinc-800 p-3 cursor-pointer hover:bg-zinc-800/50 ${!item.read ? "bg-cyan-500/5" : ""}`}
                    >
                      <p className="font-semibold text-xs text-zinc-200">{item.title}</p>
                      <p className="text-[11px] text-zinc-500 mt-1">{item.message}</p>
                      <p className="text-[10px] text-cyan-400 mt-1 font-mono">{item.time}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Switch Account shortcut */}
          <Link
            to="/switch-account"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:bg-zinc-800 hover:text-cyan-400 transition-all font-cyber"
          >
            <FiRefreshCw size={12} />
            Switch
          </Link>

          {/* Settings */}
          <Link
            to="/settings"
            className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-cyan-400 transition-all"
          >
            <FiSettings size={18} />
          </Link>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setProfileOpen(!profileOpen); setNotificationOpen(false); }}
              className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-[#111113] px-2 py-1.5 hover:border-cyan-500/40 transition-all"
            >
              {profilePic ? (
                <img src={profilePic} alt={userName} className="w-7 h-7 rounded-lg object-cover border border-cyan-500/30" />
              ) : (
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xs font-bold font-cyber">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="hidden lg:block text-xs font-semibold text-zinc-200 font-cyber max-w-[90px] truncate">
                {userName}
              </span>
              <FiChevronDown
                size={12}
                className={`hidden lg:block text-zinc-500 transition-transform ${profileOpen ? "rotate-180" : ""}`}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-zinc-800 bg-[#0e0e11] shadow-2xl z-50 overflow-hidden">
                <div className="px-3 py-2.5 border-b border-zinc-800">
                  <p className="text-xs text-zinc-300 font-bold font-cyber truncate">{userName}</p>
                  <p className="text-[10px] text-zinc-600 font-mono truncate mt-0.5">{user.email}</p>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-cyan-400 transition-all font-cyber"
                >
                  <FaUserCircle size={12} />
                  My Profile
                </Link>
                <Link
                  to="/switch-account"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-cyan-400 transition-all font-cyber"
                >
                  <FiRefreshCw size={12} />
                  Switch Identity
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-cyan-400 transition-all font-cyber"
                >
                  <FiSettings size={12} />
                  Settings
                </Link>
                <div className="border-t border-zinc-800">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-3 py-2.5 text-xs text-red-400 hover:bg-red-500/10 transition-all font-cyber"
                  >
                    <FiLogOut size={12} />
                    Secure Logout
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}