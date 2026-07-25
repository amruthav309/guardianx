import { useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { getCurrentUser } from "../../services/auth";
import {
  FaUserShield,
  FaShieldAlt,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaChartLine,
  FaUsers,
  FaHistory,
  FaSearch,
  FaChartPie,
  FaUserCog,
  FaExternalLinkAlt,
} from "react-icons/fa";

function AdminTopbar() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const adminName = user?.name || user?.username || "Admin";
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    navigate("/admin/logout");
  };

  const navLinks = [
    { to: "/admin/dashboard", label: "Dashboard", icon: <FaChartLine size={12} /> },
    { to: "/admin/users",     label: "User Monitoring", icon: <FaUsers size={12} /> },
    { to: "/admin/monitoring",label: "Audit Logs", icon: <FaHistory size={12} /> },
    { to: "/admin/scanner",   label: "Scanner", icon: <FaSearch size={12} /> },
    { to: "/admin/analytics", label: "Analytics", icon: <FaChartPie size={12} /> },
    { to: "/admin/history",   label: "Scan History", icon: <FaShieldAlt size={12} /> },
    { to: "/admin/profile",   label: "Settings", icon: <FaUserCog size={12} /> },
  ];

  return (
    <header className="bg-[#0d0608] border-b border-red-600/30 shadow-[0_2px_20px_rgba(220,38,38,0.15)] sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 h-14">

        {/* Brand */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="h-8 w-8 rounded-lg bg-red-600/30 border border-red-500/50 flex items-center justify-center">
            <FaUserShield className="text-red-400 text-sm" />
          </div>
          <div className="leading-tight">
            <h1 className="text-sm font-extrabold tracking-wider text-red-400 font-cyber">
              Admin Command Portal
            </h1>
            <p className="text-[10px] text-zinc-500 font-mono">
              Logged in: <span className="text-red-300">{adminName}</span>
            </p>
          </div>
        </div>

        {/* Horizontal Nav (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-cyber font-semibold transition-all ${
                  isActive
                    ? "bg-red-600 text-white shadow-[0_0_12px_rgba(220,38,38,0.5)]"
                    : "text-zinc-400 hover:text-white hover:bg-red-600/15"
                }`
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden lg:flex items-center gap-2">
          <Link
            to="/login?mode=user"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800/60 border border-zinc-700/50 text-zinc-300 text-[11px] font-cyber font-semibold hover:bg-zinc-700/60 transition-all"
          >
            <FaExternalLinkAlt size={10} /> User Portal
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/90 hover:bg-red-500 text-white text-[11px] font-cyber font-bold transition-all shadow-[0_0_12px_rgba(220,38,38,0.35)]"
          >
            <FaSignOutAlt size={10} /> Logout
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="lg:hidden text-zinc-400 hover:text-red-400 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {menuOpen && (
        <div className="lg:hidden bg-[#0d0608] border-t border-red-600/20 px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-cyber font-semibold transition-all ${
                  isActive
                    ? "bg-red-600 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-red-600/15"
                }`
              }
            >
              {link.icon} {link.label}
            </NavLink>
          ))}
          <div className="flex gap-2 pt-2 border-t border-red-600/20">
            <Link
              to="/login?mode=user"
              onClick={() => setMenuOpen(false)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-cyber"
            >
              <FaExternalLinkAlt size={10} /> User Portal
            </Link>
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-600 text-white text-xs font-cyber font-bold"
            >
              <FaSignOutAlt size={10} /> Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default AdminTopbar;
