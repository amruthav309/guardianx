import {
  FaShieldAlt,
  FaHome,
  FaHistory,
  FaChartBar,
  FaUserCircle,
  FaCog,
  FaSearch,
  FaSignOutAlt,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/auth";

interface SidebarProps {
  onClose?: () => void;
}

function Sidebar({ onClose }: SidebarProps) {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const profilePic = user?.profile_pic || "";
  const userName = user?.name || user?.username || "User";

  const handleLogout = () => {
    if (onClose) onClose();
    navigate("/logout", { state: { username: user?.username || user?.name || user?.email?.split("@")[0] || "User", email: user?.email } });
  };

  return (
    <div className="w-60 min-h-screen border-r border-sky-500/20 flex flex-col justify-between bg-[#0b1320] shadow-2xl flex-shrink-0">

      {/* Logo */}
      <div>
        <div className="px-5 py-5 border-b border-sky-500/15 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-sky-500/25">
              <FaShieldAlt className="text-slate-950 text-lg" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-wider text-sky-400 font-serif-header glow-text-cyan">
                GUARDIAN<span className="text-white">X</span>
              </h1>
              <p className="text-[10px] text-sky-400/70 font-cyber uppercase tracking-widest">
                AI Security
              </p>
            </div>
          </div>
        </div>

        {/* User Mini Card */}
        <div className="mx-3 mt-4 p-3 bg-[#111927] border border-sky-500/20 rounded-xl flex items-center gap-3">
          {profilePic ? (
            <img src={profilePic} alt={userName} className="w-8 h-8 rounded-lg object-cover border border-sky-500/30" />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 text-sm font-bold font-cyber">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-200 font-cyber truncate">{userName}</p>
            <p className="text-[10px] text-sky-400 font-cyber">● Active</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-5 px-3 space-y-1">
          <p className="text-[10px] text-sky-400/50 font-cyber uppercase tracking-widest px-3 mb-2">Navigation</p>

          <MenuItem to="/dashboard" icon={<FaHome />} text="Dashboard" onClose={onClose} />
          <MenuItem to="/analytics" icon={<FaChartBar />} text="Analytics" onClose={onClose} />
          <MenuItem to="/scanner" icon={<FaSearch />} text="AI Scanner" onClose={onClose} />
          <MenuItem to="/history" icon={<FaHistory />} text="Scan History" onClose={onClose} />

          <div className="my-3 border-t border-sky-500/15"></div>
          <p className="text-[10px] text-sky-400/50 font-cyber uppercase tracking-widest px-3 mb-2">Account</p>

          <MenuItem to="/profile" icon={<FaUserCircle />} text="My Profile" onClose={onClose} />
          <MenuItem to="/settings" icon={<FaCog />} text="Settings" onClose={onClose} />
        </nav>
      </div>

      {/* Logout */}
      <div className="p-3 border-t border-sky-500/15">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 py-2.5 text-xs font-cyber font-semibold text-rose-400 transition hover:bg-rose-500/20 hover:border-rose-500/40 cursor-pointer"
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
  onClose?: () => void;
}

function MenuItem({ to, icon, text, onClose }: MenuItemProps) {
  return (
    <NavLink
      to={to}
      onClick={() => { if (onClose) onClose(); }}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-xs font-cyber ${
          isActive
            ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white border border-sky-400/40 font-bold shadow-lg shadow-sky-500/25"
            : "text-slate-400 hover:bg-[#131f33] hover:text-slate-200 border border-transparent"
        }`
      }
    >
      <span className="text-base">{icon}</span>
      <span>{text}</span>
    </NavLink>
  );
}

export default Sidebar;