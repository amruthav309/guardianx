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
    <aside
      className={`
        w-72
        lg:w-56
        min-h-screen
        border-r
        flex
        flex-col
        justify-between
        transition-all
        duration-300
        ${
          isDark
            ? "bg-[#111111] border-cyan-500/20 text-white"
            : "bg-white border-gray-300 text-gray-900"
        }
      `}
    >
      {/* Logo */}

      <div>
        <div className="flex items-center gap-3 px-5 py-6">

          <div className="bg-cyan-500 rounded-xl p-2 shadow-lg">

            <FaShieldAlt
              className="text-black"
              size={22}
            />

          </div>

          <div>

            <h1 className="text-xl md:text-2xl font-bold text-cyan-400">
              GuardianX
            </h1>

            <p
              className={`text-xs ${
                isDark
                  ? "text-zinc-500"
                  : "text-gray-500"
              }`}
            >
              Cyber Security
            </p>

          </div>

        </div>

        {/* Menu */}

        <div className="mt-5 space-y-2 px-3 lg:px-4">

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
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-all duration-300 hover:scale-105"
        >

          <FaSignOutAlt />

          Logout

        </button>

      </div>

    </aside>
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
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
          isActive
            ? "bg-cyan-500 text-black font-bold shadow-lg"
            : isDark
            ? "text-white hover:bg-[#1D1D1D]"
            : "text-gray-900 hover:bg-gray-200"
        }`
      }
    >

      <span className="text-lg">
        {icon}
      </span>

      <span className="text-sm md:text-base">
        {text}
      </span>

    </NavLink>

  );
}

export default Sidebar;