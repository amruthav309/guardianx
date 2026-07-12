import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import QuickScanner from "../components/QuickScanner";
import { useEffect, useState } from "react";

function Scanner() {

 const [sidebarOpen, setSidebarOpen] = useState(() => {
  return localStorage.getItem("sidebarOpen") !== "false";
});

useEffect(() => {
  localStorage.setItem(
    "sidebarOpen",
    String(sidebarOpen)
  );
}, [sidebarOpen]);

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

        <div className="mt-8 rounded-2xl bg-[#161616] border border-cyan-500/20 p-8">

  <div className="flex flex-col lg:flex-row justify-between items-center">

    <div>

      <h1 className="text-4xl font-bold text-cyan-400">
        🔍 AI Security Scanner
      </h1>

      <p className="text-zinc-400 mt-3 text-lg">
        Scan Emails, URLs, SMS, Passwords and Files using GuardianX AI Engine.
      </p>

    </div>

    <div className="mt-6 lg:mt-0 flex gap-4">

      <div className="bg-[#202020] rounded-xl px-5 py-4 border border-cyan-500/20">

        <p className="text-zinc-500 text-sm">
          Engine
        </p>

        <h3 className="text-cyan-400 font-bold">
          GuardianX AI
        </h3>

      </div>

      <div className="bg-[#202020] rounded-xl px-5 py-4 border border-green-500/20">

        <p className="text-zinc-500 text-sm">
          Status
        </p>

        <h3 className="text-green-400 font-bold">
          ● Ready
        </h3>

      </div>

    </div>

  </div>

</div>

<QuickScanner />

      </div>

    </div>

  );

}

export default Scanner;