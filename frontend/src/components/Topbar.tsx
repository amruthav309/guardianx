import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiBell,
  FiSettings,
  FiLogOut,
  FiChevronDown,
  FiUsers,
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
  const userName = user.name || user.username || "User";
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
    navigate("/logout", { state: { username: user?.username || user?.name || user?.email?.split("@")[0] || "User", email: user?.email } });
  };

  useEffect(() => {
    const loadNotifications = () => {
      const saved = localStorage.getItem("guardianx_notifications");
      if (saved) {
        setNotifications(JSON.parse(saved));
      } else {
        setNotifications([]);
      }
    };

    loadNotifications();

    window.addEventListener("guardianx_notification_added", loadNotifications);
    return () => {
      window.removeEventListener("guardianx_notification_added", loadNotifications);
    };
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
    "/scanner": "AI Security Scanner",
    "/profile": "User Profile",
    "/settings": "System Settings",
    "/switch-account": "Switch Account",
  };

  const currentTitle = pageTitle[location.pathname] || "GuardianX Module";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-sky-500/20 bg-[#0b1320]/95 backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">

        {/* Left Side */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="rounded-lg p-2 text-sky-400 hover:bg-[#131f33] hover:text-sky-300 transition-all cursor-pointer"
          >
            <FiMenu size={20} />
          </button>

          <div className="hidden md:block">
            <p className="text-[10px] text-sky-400/60 font-cyber uppercase tracking-widest">GuardianX Portal</p>
            <h2 className="text-sm font-bold text-slate-100 font-cyber">{currentTitle}</h2>
          </div>

          {/* Logo - visible when sidebar closed */}
          {!sidebarOpen && (
            <Link to="/dashboard" className="flex items-center gap-2 md:hidden">
              <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center shadow-[0_0_12px_rgba(56,189,248,0.5)]">
                <FaShieldAlt className="text-slate-950 text-sm" />
              </div>
              <span className="font-serif-header font-bold text-sky-400 text-lg">GX</span>
            </Link>
          )}
        </div>

        {/* Right Side */}
        <div ref={profileRef} className="relative flex items-center gap-2">

          {/* Re-added Switch Account Button exclusively on Topbar */}
          <Link
            to="/switch-account"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-cyber transition-all ${
              location.pathname === "/switch-account"
                ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white border border-sky-400/40 font-bold shadow-lg shadow-sky-500/25"
                : "bg-[#111927] text-sky-300 border border-sky-500/25 hover:bg-sky-500/15 hover:text-sky-200 hover:border-sky-500/40"
            }`}
            title="Switch Accounts / Identities"
          >
            <FiUsers size={13} />
            <span>Switch Account</span>
          </Link>

          {/* Notification Bell */}
          <button
            onClick={openNotifications}
            className="relative p-2 rounded-lg text-slate-400 hover:bg-[#131f33] hover:text-sky-400 transition-all cursor-pointer"
          >
            <FiBell size={18} />
            {notificationCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] text-white font-bold">
                {notificationCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {notificationOpen && (
            <div className="absolute right-0 top-12 w-80 rounded-xl border border-sky-500/20 bg-[#111927] shadow-2xl z-50">
              <div className="border-b border-sky-500/15 p-3 flex items-center justify-between">
                <h2 className="font-bold text-sm font-cyber text-slate-200">Notifications</h2>
                <div className="flex gap-2">
                  <button onClick={markAllRead} className="text-[10px] bg-sky-500/20 text-sky-400 border border-sky-500/30 px-2 py-1 rounded font-cyber cursor-pointer">
                    Mark All
                  </button>
                  <button onClick={clearNotifications} className="text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-1 rounded font-cyber cursor-pointer">
                    Clear
                  </button>
                </div>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-sky-400/60 text-xs font-cyber">
                    No active notifications
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`border-b border-sky-500/10 p-3 cursor-pointer hover:bg-[#131f33] ${!item.read ? "bg-sky-500/5" : ""}`}
                    >
                      <p className="font-semibold text-xs text-slate-200">{item.title}</p>
                      <p className="text-[11px] text-slate-400 mt-1">{item.message}</p>
                      <p className="text-[10px] text-sky-400 mt-1 font-mono">{item.time}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Settings Icon */}
          <Link
            to="/settings"
            className="p-2 rounded-lg text-slate-400 hover:bg-[#131f33] hover:text-sky-400 transition-all"
          >
            <FiSettings size={18} />
          </Link>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setProfileOpen(!profileOpen); setNotificationOpen(false); }}
              className="flex items-center gap-2 rounded-xl border border-sky-500/20 bg-[#111927] px-2.5 py-1.5 hover:border-sky-500/40 transition-all cursor-pointer"
            >
              {profilePic ? (
                <img src={profilePic} alt={userName} className="w-7 h-7 rounded-lg object-cover border border-sky-500/30" />
              ) : (
                <div className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 text-xs font-bold font-cyber">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="hidden lg:block text-xs font-semibold text-slate-200 font-cyber max-w-[90px] truncate">
                {userName}
              </span>
              <FiChevronDown
                size={12}
                className={`hidden lg:block text-slate-500 transition-transform ${profileOpen ? "rotate-180" : ""}`}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl border border-sky-500/20 bg-[#111927] shadow-2xl z-50 overflow-hidden">
                <div className="px-3.5 py-2.5 border-b border-sky-500/15">
                  <p className="text-xs text-slate-200 font-bold font-cyber truncate">{userName}</p>
                  <p className="text-[10px] text-sky-400/60 font-mono truncate mt-0.5">{user.email}</p>
                </div>
                <Link
                  to="/switch-account"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-3.5 py-2.5 text-xs text-sky-400 hover:bg-sky-500/15 transition-all font-cyber font-semibold"
                >
                  <FiUsers size={12} />
                  Switch Account
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-3.5 py-2.5 text-xs text-slate-300 hover:bg-[#131f33] hover:text-sky-400 transition-all font-cyber"
                >
                  <FaUserCircle size={12} />
                  My Profile
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-3.5 py-2.5 text-xs text-slate-300 hover:bg-[#131f33] hover:text-sky-400 transition-all font-cyber"
                >
                  <FiSettings size={12} />
                  Settings
                </Link>
                <div className="border-t border-sky-500/15">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-3.5 py-2.5 text-xs text-rose-400 hover:bg-rose-500/10 transition-all font-cyber cursor-pointer"
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