import {
  FaShieldAlt,
  FaHome,
  FaHistory,
  FaChartBar,
  FaUserCircle,
  FaCog,
  FaSearch,
  FaSignOutAlt,
  FaExchangeAlt,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/auth";

function Sidebar() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const profilePic = user?.profile_pic || "";
  const userName = user?.name || user?.username || "Agent";

  return (
    <div className="w-60 min-h-screen border-r border-zinc-800/60 flex flex-col justify-between bg-[#080809] shadow-2xl flex-shrink-0">

      {/* Logo */}
      <div>
        <div className="px-5 py-5 border-b border-zinc-800/60">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <FaShieldAlt className="text-black text-lg" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-wider text-cyan-400 font-cyber glow-text-cyan">
                GUARDIAN<span className="text-white">X</span>
              </h1>
              <p className="text-[10px] text-zinc-600 font-cyber uppercase tracking-widest">
                AI Security
              </p>
            </div>
          </div>
        </div>

        {/* User Mini Card */}
        <div className="mx-3 mt-4 p-3 bg-[#0e0e12] border border-zinc-800 rounded-xl flex items-center gap-3">
          {profilePic ? (
            <img src={profilePic} alt={userName} className="w-8 h-8 rounded-lg object-cover border border-cyan-500/30" />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-sm font-bold font-cyber">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-xs font-bold text-zinc-200 font-cyber truncate">{userName}</p>
            <p className="text-[10px] text-emerald-400 font-cyber">● Active</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-5 px-3 space-y-1">
          <p className="text-[10px] text-zinc-600 font-cyber uppercase tracking-widest px-3 mb-2">Navigation</p>

          <MenuItem to="/dashboard" icon={<FaHome />} text="Dashboard" />
          <MenuItem to="/analytics" icon={<FaChartBar />} text="Analytics" />
          <MenuItem to="/scanner" icon={<FaSearch />} text="AI Scanner" />
          <MenuItem to="/history" icon={<FaHistory />} text="Scan History" />

          <div className="my-3 border-t border-zinc-800/60"></div>
          <p className="text-[10px] text-zinc-600 font-cyber uppercase tracking-widest px-3 mb-2">Account</p>

          <MenuItem to="/profile" icon={<FaUserCircle />} text="My Profile" />
          <MenuItem to="/switch-account" icon={<FaExchangeAlt />} text="Switch Identity" />
          <MenuItem to="/settings" icon={<FaCog />} text="Settings" />
        </nav>
      </div>

      {/* Logout */}
      <div className="p-3 border-t border-zinc-800/60">
        <button
          onClick={() => navigate("/logout")}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 py-2.5 text-xs font-cyber font-semibold text-red-400 transition hover:bg-red-500/20 hover:border-red-500/40 cursor-pointer"
        >
          <FaSignOutAlt size={12} />
          Secure Logout
        </button>
      </div>

    </div>
  );
}

interface MenuItemProps {
  to: string;
  icon: React.ReactNode;
  text: string;
}

function MenuItem({ to, icon, text }: MenuItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-xs font-cyber ${
          isActive
            ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/25 font-bold shadow-[0_0_10px_rgba(6,182,212,0.08)]"
            : "text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300 border border-transparent"
        }`
      }
    >
      <span className="text-base">{icon}</span>
      <span>{text}</span>
    </NavLink>
  );
}

export default Sidebar;