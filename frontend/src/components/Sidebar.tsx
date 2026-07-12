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
import { useTheme } from "../context/ThemeContext";

function Sidebar() {

  const navigate = useNavigate();

  const { theme } = useTheme();

  const isDark = theme === "dark";

  return (
    <div
      className={`w-64 min-h-screen border-r flex flex-col justify-between transition-all duration-500 shadow-xl ${
        isDark
          ? "bg-[#111111] border-cyan-500/20 text-white"
          : "bg-white border-gray-300 text-gray-900"
      }`}
    >

      {/* Logo */}
      <div>

        <div className="px-6 py-7 border-b border-cyan-500/20">

    <div className="flex items-center gap-4">

        <div className="h-12 w-12 rounded-xl bg-cyan-500 flex items-center justify-center shadow-lg">

            <FaShieldAlt
                className="text-black text-2xl"
            />

        </div>

        <div>

            <h1 className="text-2xl font-extrabold tracking-wide text-cyan-400">
                GuardianX
            </h1>

            <p className="text-xs text-zinc-500">
                AI Security Platform
            </p>

        </div>

    </div>

</div>


        {/* Menu */}

        <div className="mt-6 space-y-3 px-4">

          <MenuItem
            to="/dashboard"
            icon={<FaHome />}
            text="Dashboard"
          />

          <MenuItem
            to="/analytics"
            icon={<FaChartBar />}
            text="Analytics"
          />

          <MenuItem
  to="/scanner"
  icon={<FaSearch />}
  text="Scanner"
/>

          <MenuItem
            to="/history"
            icon={<FaHistory />}
            text="History"
          />

          <MenuItem
            to="/profile"
            icon={<FaUserCircle />}
            text="Profile"
          />

          <MenuItem
            to="/settings"
            icon={<FaCog />}
            text="Settings"
          />

        </div>

      </div>

      {/* Logout */}

      <div className="p-4 border-t border-cyan-500/20">

        <button
          onClick={() => navigate("/logout")}
          className="w-full flex items-center justify-center gap-3 rounded-xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700 hover:shadow-lg"
        >
          <FaSignOutAlt />
          Logout
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

function MenuItem({
  to,
  icon,
  text,
}: MenuItemProps) {

  const { theme } = useTheme();

  const isDark = theme === "dark";

  return (

    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-5 py-3.5 rounded-lg transition ${
          isActive
            ? "bg-cyan-500 text-black font-semibold shadow-lg"
            : isDark
            ? "text-white hover:bg-cyan-500/10 hover:text-cyan-400"
            : "text-gray-900 hover:bg-gray-200"
        }`
      }
    >

      <span className="text-xl">
        {icon}
      </span>

      <span className="text-[15px] font-medium">
        {text}
      </span>

    </NavLink>

  );
}

export default Sidebar;