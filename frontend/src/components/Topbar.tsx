import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/auth";
import {
  FiMenu,
  FiX,
  FiBell,
  FiSettings,
  FiLogOut,
  FiHome,
  FiBarChart2,
  FiShield,
  FiClock,
  FiChevronDown,
} from "react-icons/fi";

interface TopbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Topbar({
  sidebarOpen,
  setSidebarOpen,
}: TopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

const navigate = useNavigate();
const location = useLocation();

const user = JSON.parse(
  localStorage.getItem("guardianx_user") || "{}"
);

const userName =
  user.name ||
  user.username ||
  localStorage.getItem("username") ||
  localStorage.getItem("name") ||
  "User";

const [notifications, setNotifications] = useState<any[]>([]);
const [notificationOpen, setNotificationOpen] = useState(false);

const openNotifications = () => {

  const updated = notifications.map((item) => ({
    ...item,
    read: true,
  }));

  setNotifications(updated);

  localStorage.setItem(
    "guardianx_notifications",
    JSON.stringify(updated)
  );

  setNotificationOpen(!notificationOpen);

};

const notificationCount = notifications.filter(
  (n) => !n.read
).length;

const markAsRead = (id: number) => {

  const updated = notifications.map((item) =>
    item.id === id
      ? { ...item, read: true }
      : item
  );

  setNotifications(updated);

  localStorage.setItem(
    "guardianx_notifications",
    JSON.stringify(updated)
  );

};

const markAllRead = () => {

  const updated = notifications.map((item) => ({
    ...item,
    read: true,
  }));

  setNotifications(updated);

  localStorage.setItem(
    "guardianx_notifications",
    JSON.stringify(updated)
  );

};

const clearNotifications = () => {

  setNotifications([]);

  localStorage.removeItem(
    "guardianx_notifications"
  );

};
const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <FiHome size={18} />,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: <FiBarChart2 size={18} />,
  },
  {
    name: "Threat History",
    href: "/history",
    icon: <FiClock size={18} />,
  },
  {
    name: "Scanner",
    href: "/scanner",
    icon: <FiShield size={18} />,
  },
];
const handleLogout = () => {
  logoutUser();
};

useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (
      profileRef.current &&
      !profileRef.current.contains(event.target as Node)
    ) {
      setProfileOpen(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

useEffect(() => {
  const saved = localStorage.getItem("guardianx_notifications");

  if (saved) {
    setNotifications(JSON.parse(saved));
  }
}, []);
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-700 bg-slate-900/95 backdrop-blur">

      <div className="flex h-20 items-center justify-between px-6 lg:px-10">

        {/* Left Side */}
        <div className="flex items-center gap-4">

          {/* Mobile Menu Button */}
          <button
  onClick={() => setSidebarOpen(!sidebarOpen)}
  className="rounded-lg p-2 text-gray-300 hover:bg-slate-800 lg:hidden"
>
  <FiMenu size={22} />
</button>

          {/* Logo */}
          <Link
            to="/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500 shadow-lg shadow-cyan-500/30">
              G
            </div>

            <div className="hidden sm:block">
              <h1 className="text-2xl font-extrabold tracking-wide text-white">
                GuardianX
              </h1>
              <p className="text-sm text-gray-400">
                AI Security Dashboard
              </p>
            </div>
          </Link>

        </div>

       
                {/* Right Side */}
   <div
  ref={profileRef}
  className="relative flex items-center gap-3"
>

          
{/* Notifications */}

<button
  onClick={openNotifications}
  className="relative rounded-xl p-3 transition hover:bg-slate-800" 
>

  <FiBell size={20} />

  {notificationCount > 0 && (

    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">

      {notificationCount}

    </span>

  )}

</button>

{notificationOpen && (

<div className="absolute right-0 top-14 w-96 rounded-xl border border-slate-700 bg-slate-900 shadow-2xl z-50">

<div className="border-b border-slate-700 p-4">

  <div className="flex items-center justify-between">

    <h2 className="font-bold text-lg text-white">
      Notifications
    </h2>

    <div className="flex gap-2">

      <button
        onClick={markAllRead}
        className="rounded bg-cyan-500 px-3 py-1 text-xs font-semibold text-black hover:bg-cyan-400"
      >
        Mark All
      </button>

      <button
        onClick={clearNotifications}
        className="rounded bg-red-500 px-3 py-1 text-xs font-semibold text-white hover:bg-red-600"
      >
        Clear
      </button>

    </div>

  </div>

</div>

<div className="max-h-80 overflow-y-auto">

{notifications.length === 0 ? (

<div className="p-6 text-center text-gray-400">

No notifications yet

</div>

) : (

notifications.map((item, index) => (

<div
  key={item.id}
  onClick={() => markAsRead(item.id)}
  className={`border-b border-slate-800 p-4 cursor-pointer hover:bg-slate-800
  ${!item.read ? "bg-cyan-500/10" : ""}`}
>

<p className="font-semibold text-white">

{item.title}

</p>

<p className="text-sm text-gray-400 mt-1">

{item.message}

</p>

<p className="text-xs text-cyan-400 mt-2">

{item.time}

</p>

</div>

))

)}

</div>

</div>

)}
<Link
  to="/switch-account"
  className="block px-4 py-3 hover:bg-slate-800 text-gray-300"
>
  🔄 Switch Account
</Link>

          {/* Settings */}
          <Link
  to="/settings"
  className="rounded-xl p-2 text-gray-300 transition hover:bg-slate-800 hover:text-white"
>
  <FiSettings size={20} />
</Link>

          <div className="relative">

  <button
    onClick={() => setProfileOpen(!profileOpen)}
    className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-800 px-4 py-2.5 shadow-lg hover:border-cyan-500/50 transition-all"
  >

    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-black font-bold">
      {userName.charAt(0).toUpperCase()}
    </div>

    <div className="hidden lg:flex items-center gap-2">

  <span className="font-semibold text-white">
    {userName}
</span>

  <FiChevronDown
    className={`transition ${
      profileOpen ? "rotate-180" : ""
    }`}
  />

</div>

  </button>
    {profileOpen && (

    <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">

      <Link
        to="/profile"
        className="block px-4 py-3 hover:bg-slate-800 text-gray-300"
      >
        👤 My Profile
      </Link>

      <Link
        to="/settings"
        className="block px-4 py-3 hover:bg-slate-800 text-gray-300"
      >
        ⚙ Settings
      </Link>

      <button
        onClick={handleLogout}
        className="flex w-full items-center gap-2 px-4 py-3 text-red-400 hover:bg-red-500/10"
      >
        <FiLogOut />
        Logout
           </button>

    </div>

  )}

        </div>   {/* closes <div className="relative"> */}

      </div>     {/* closes <div ref={profileRef}> */}

    </div>       {/* closes <div className="flex h-16 items-center justify-between ..."> */}

    {/* Mobile Navigation */}
            
      {menuOpen && (
        <div className="border-t border-slate-700 bg-slate-900 md:hidden">

          <nav className="flex flex-col p-4 space-y-2">

            {navigation.map((item) => {
              const active = location.pathname === item.href;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                    active
                      ? "bg-emerald-500 font-semibold text-black"
                      : "text-gray-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              );
            })}

            <div className="my-2 border-t border-slate-700"></div>



            {/* Mobile Actions */}
            <button className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-300 transition hover:bg-slate-800 hover:text-white">
              <FiSettings size={18} />
              <span>Settings</span>
            </button>

            <button className="flex items-center gap-3 rounded-lg px-4 py-3 text-red-400 transition hover:bg-red-500/10">
              <FiLogOut size={18} />
              <span>Logout</span>
            </button>

          </nav>

        </div>
      )}
          </header>
  );
}