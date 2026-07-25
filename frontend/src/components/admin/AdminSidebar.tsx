import {
  FaUserShield,
  FaChartLine,
  FaUsers,
  FaHistory,
  FaSignOutAlt,
  FaShieldAlt,
  FaSearch,
  FaChartPie,
  FaUserCog,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../services/auth";

interface AdminSidebarProps {
  onClose?: () => void;
}

function AdminSidebar({ onClose }: AdminSidebarProps) {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const userName = user?.name || "Master Security Admin";
  const userEmail = user?.email || "amruthav309@gmail.com";

  const handleLogout = () => {
    if (onClose) onClose();
    navigate("/admin/logout");
  };

  return (
    <div className="w-64 min-h-screen border-r border-red-600/30 flex flex-col justify-between bg-[#0a0507] shadow-2xl flex-shrink-0">

      {/* Brand Header */}
      <div>
        <div className="px-5 py-5 border-b border-red-600/25 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-red-600/25 border border-red-500/50 flex items-center justify-center shadow-lg shadow-red-600/30">
              <FaUserShield className="text-red-400 text-lg" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-wider text-red-400 font-cyber glow-text-red">
                GUARDIAN<span className="text-white">X</span>
              </h1>
              <p className="text-[10px] text-red-400/90 font-cyber font-bold uppercase tracking-widest">
                CRIMSON ADMIN
              </p>
            </div>
          </div>
        </div>

        {/* Admin Clearance Badge */}
        <div className="mx-3 mt-4 p-3 bg-[#13080b] border border-red-500/35 rounded-xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-600/25 border border-red-500/40 flex items-center justify-center text-red-400 text-sm font-bold font-cyber">
            A
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-zinc-100 font-cyber truncate">{userName}</p>
            <p className="text-[9px] text-red-400 font-mono truncate">{userEmail}</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-5 px-3 space-y-1">
          <p className="text-[10px] text-red-500/80 font-cyber uppercase tracking-widest px-3 mb-2 font-bold">ADMIN CORE</p>

          <AdminMenuItem to="/admin/dashboard" icon={<FaChartLine />} text="Command Dashboard" onClose={onClose} />
          <AdminMenuItem to="/admin/users" icon={<FaUsers />} text="User DB & Credentials" onClose={onClose} />
          <AdminMenuItem to="/admin/monitoring" icon={<FaHistory />} text="Login/Logout Audit Log" onClose={onClose} />
          <AdminMenuItem to="/admin/profile" icon={<FaUserCog />} text="Admin Security Profile" onClose={onClose} />

          <div className="my-3 border-t border-red-600/25"></div>
          <p className="text-[10px] text-red-500/80 font-cyber uppercase tracking-widest px-3 mb-2 font-bold">SCANNER & ANALYTICS</p>

          <AdminMenuItem to="/admin/scanner" icon={<FaSearch />} text="Threat Scanner Module" onClose={onClose} />
          <AdminMenuItem to="/admin/analytics" icon={<FaChartPie />} text="System Analytics" onClose={onClose} />
          <AdminMenuItem to="/admin/history" icon={<FaShieldAlt />} text="Scan History Logs" onClose={onClose} />
        </nav>
      </div>

      {/* Logout */}
      <div className="p-3 border-t border-red-600/25">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-600/20 border border-red-500/40 py-2.5 text-xs font-cyber font-bold text-red-300 transition hover:bg-red-600/30 hover:border-red-500/60 cursor-pointer shadow-[0_0_15px_rgba(220,38,38,0.2)]"
        >
          <FaSignOutAlt size={12} />
          Terminate Admin Session
        </button>
      </div>

    </div>
  );
}

interface AdminMenuItemProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  onClose?: () => void;
}

function AdminMenuItem({ to, icon, text, onClose }: AdminMenuItemProps) {
  return (
    <NavLink
      to={to}
      onClick={() => { if (onClose) onClose(); }}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-xs font-cyber ${
          isActive
            ? "bg-red-600/25 text-red-400 border border-red-500/45 font-bold shadow-[0_0_12px_rgba(220,38,38,0.2)]"
            : "text-zinc-400 hover:bg-red-950/40 hover:text-zinc-200 border border-transparent"
        }`
      }
    >
      <span className="text-base text-red-400/80">{icon}</span>
      <span>{text}</span>
    </NavLink>
  );
}

export default AdminSidebar;
