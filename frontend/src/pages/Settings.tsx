import { useState, useEffect } from "react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import {
  FaBell,
  FaShieldAlt,
  FaSave,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

function Settings() {

const navigate = useNavigate();

const [sidebarOpen, setSidebarOpen] = useState(() => {
  return localStorage.getItem("sidebarOpen") !== "false";
});

const [notifications, setNotifications] = useState(true);

const [sensitivity, setSensitivity] = useState("High");

  useEffect(() => {

  const saved = localStorage.getItem("guardianx_settings");

  if (saved) {

    const settings = JSON.parse(saved);

    
    setNotifications(settings.notifications);
    setSensitivity(settings.sensitivity);

  }

}, []);

useEffect(() => {
  localStorage.setItem(
    "sidebarOpen",
    String(sidebarOpen)
  );
}, [sidebarOpen]);
  const saveSettings = () => {

  localStorage.setItem(
    "guardianx_settings",
    JSON.stringify({
      notifications,
      sensitivity,
    })
  );

  alert("Settings Saved Successfully!");

};

const handleSwitchAccount = () => {

  const confirmSwitch = window.confirm(
    "Are you sure you want to switch accounts?\n\nYour current session will end and you will need to log in again."
  );

  if (!confirmSwitch) return;

  // Clear current user's session
  localStorage.removeItem("guardianx_user");
  localStorage.removeItem("userEmail");

  // Clear temporary session data
  sessionStorage.clear();

  // Redirect securely to login
  navigate("/login", { replace: true });

};

  return (

    <div className="flex min-h-screen bg-[#09090B] text-white">

      <button
  onClick={() => setSidebarOpen(!sidebarOpen)}
  className={`fixed top-6 z-50 w-10 h-10 rounded-full
  bg-cyan-500 hover:bg-cyan-600
  text-black shadow-lg
  flex items-center justify-center
  transition-all duration-300
  ${sidebarOpen ? "left-[210px]" : "left-4"}`}
>
  {sidebarOpen ? "◀" : "▶"}
</button>

      {sidebarOpen && <Sidebar />}

      <div className="flex-1 p-5">

        <Topbar />

        <div className="mt-6">

          <h1 className="text-3xl font-bold text-cyan-400">
            Settings
          </h1>

          <p className="text-zinc-400 mt-2">
            Customize your GuardianX experience.
          </p>

        </div>

        <div className="mt-8 bg-[#161616] rounded-xl p-8">

          

          {/* Notifications */}

          <div className="flex justify-between items-center py-5 border-b border-zinc-700">

            <div className="flex items-center gap-4">

              <FaBell className="text-cyan-400" />

              <span>Enable Notifications</span>

            </div>

            <input
              type="checkbox"
              checked={notifications}
              onChange={() =>
                setNotifications(!notifications)
              }
            />

          </div>

          

          {/* Scan Sensitivity */}

          <div className="flex justify-between items-center py-5 border-b border-zinc-700">

            <div className="flex items-center gap-4">

              <FaShieldAlt className="text-cyan-400" />

              <span>Scan Sensitivity</span>

            </div>

            <select
              value={sensitivity}
              onChange={(e) =>
                setSensitivity(e.target.value)
              }
              className="bg-[#202020] px-4 py-2 rounded-lg outline-none"
            >

              <option>Low</option>

              <option>Medium</option>

              <option>High</option>

            </select>

          </div>

          <div className="flex justify-between items-center py-5 border-b border-zinc-700">

  <div className="flex items-center gap-4">

    <span className="text-cyan-400 text-xl">

      🔄

    </span>

    <span>

      Switch Account

    </span>

  </div>

  <button

    onClick={handleSwitchAccount}

    className="bg-cyan-500 text-black px-4 py-2 rounded-lg font-bold"

  >

    Switch Account

  </button>

</div>


          {/* Buttons */}

          <div className="flex gap-4 mt-8">
                        <button
              onClick={saveSettings}
              className="bg-cyan-500 hover:bg-cyan-600 transition text-black px-6 py-3 rounded-lg font-bold flex items-center gap-2"
            >

              <FaSave />

              Save Settings

            </button>

            <button
              onClick={() => {

                setNotifications(true);
                setSensitivity("High");

                setNotifications(true);

                setSensitivity("High");
              }}
              className="bg-red-500 hover:bg-red-600 transition px-6 py-3 rounded-lg font-bold"
            >

              Reset

            </button>

          </div>

        </div>

        {/* Security Section */}

        <div className="mt-8 bg-[#161616] rounded-xl p-8">

          <h2 className="text-2xl font-bold text-cyan-400">

            Security Preferences

          </h2>

          <div className="grid md:grid-cols-3 gap-6 mt-6">

            <div className="bg-[#202020] rounded-xl p-5">

              <h3 className="font-bold text-green-400">
             🛡 Firewall


              </h3>

              <p className="mt-3 text-zinc-400">
                Protected
              </p>

            </div>

            <div className="bg-[#202020] rounded-xl p-5">

              <h3 className="font-bold text-green-400">
               🤖 AI Protection
              </h3>

              <p className="mt-3 text-zinc-400">
                Running
              </p>

            </div>

            <div className="bg-[#202020] rounded-xl p-5">

              <h3 className="font-bold text-green-400">
                🛰 Threat Feed
              </h3>

              <p className="mt-3 text-zinc-400">
               Live
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Settings;