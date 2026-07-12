import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import {
  getHistory,
  clearHistory,
  deleteHistory,
} from "../services/auth";

function History() {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
  return localStorage.getItem("sidebarOpen") !== "false";
});

  const [history, setHistory] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
  localStorage.setItem(
    "sidebarOpen",
    String(sidebarOpen)
  );
}, [sidebarOpen]);

  const loadHistory = async () => {
    try {
      const data = await getHistory();
      setHistory(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClearHistory = async () => {
    const ok = window.confirm(
      "Are you sure you want to clear all history?"
    );

    if (!ok) return;

    try {
      await clearHistory();
      setHistory([]);
      alert("History cleared successfully.");
    } catch (error) {
      alert("Unable to clear history.");
    }
  };

  const filteredHistory = history.filter((item) => {
    const matchSearch =
      item.filename
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      item.scan_type
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      item.status
        ?.toLowerCase()
        .includes(search.toLowerCase());

    if (!matchSearch) return false;

    if (filter === "All") return true;

    const itemDate = new Date(item.created_at);
    const today = new Date();

    if (filter === "Today") {
      return (
        itemDate.toDateString() ===
        today.toDateString()
      );
    }

    if (filter === "This Week") {
      const weekAgo = new Date();

      weekAgo.setDate(today.getDate() - 7);

      return itemDate >= weekAgo;
    }

    if (filter === "This Month") {
      return (
        itemDate.getMonth() ===
          today.getMonth() &&
        itemDate.getFullYear() ===
          today.getFullYear()
      );
    }

    return true;
  });

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

        {/* Header */}

        <div className="flex justify-between items-center mt-6">

          <div>

            <h1 className="text-4xl font-bold text-cyan-400">
              📜 Scan History
            </h1>

            <p className="text-zinc-400 mt-2">
              View and manage all previous
              GuardianX scans.
            </p>

          </div>

          <button
            onClick={handleClearHistory}
            className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl font-semibold transition"
          >
            🗑 Clear History
          </button>

        </div>

        {/* Search & Filter */}

        <div className="mt-8 flex flex-col lg:flex-row gap-5 justify-between">

          <input
            type="text"
            placeholder="🔍 Search by file, type or status..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="lg:w-96 bg-[#161616] border border-zinc-700 rounded-xl px-5 py-4 outline-none focus:border-cyan-400"
          />

          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
            className="bg-[#161616] border border-zinc-700 rounded-xl px-5 py-4"
          >
            <option>All</option>
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>

        </div>

        {/* Statistics */}

        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-6 mt-8">

          <div className="bg-[#161616] rounded-2xl p-6 border border-cyan-500/20 hover:border-cyan-400 transition">

            <p className="text-4xl">
              📊
            </p>

            <h3 className="text-zinc-400 mt-4">
              Total Scans
            </h3>

            <h2 className="text-4xl font-bold text-cyan-400 mt-2">
              {history.length}
            </h2>

          </div>

          <div className="bg-[#161616] rounded-2xl p-6 border border-green-500/20 hover:border-green-400 transition">

            <p className="text-4xl">
              🟢
            </p>

            <h3 className="text-zinc-400 mt-4">
              Safe
            </h3>

            <h2 className="text-4xl font-bold text-green-400 mt-2">
              {
                history.filter(
                  (h) =>
                    h.status === "Safe"
                ).length
              }
            </h2>

          </div>

          <div className="bg-[#161616] rounded-2xl p-6 border border-yellow-500/20 hover:border-yellow-400 transition">

            <p className="text-4xl">
              🟡
            </p>

            <h3 className="text-zinc-400 mt-4">
              Suspicious
            </h3>

            <h2 className="text-4xl font-bold text-yellow-400 mt-2">
              {
                history.filter(
                  (h) =>
                    h.status ===
                    "Suspicious"
                ).length
              }
            </h2>

          </div>

          <div className="bg-[#161616] rounded-2xl p-6 border border-red-500/20 hover:border-red-400 transition">

            <p className="text-4xl">
              🔴
            </p>

            <h3 className="text-zinc-400 mt-4">
              Phishing
            </h3>

            <h2 className="text-4xl font-bold text-red-400 mt-2">
              {
                history.filter(
                  (h) =>
                    h.status ===
                    "Phishing"
                ).length
              }
            </h2>

          </div>

        </div>

        {/* History Table */}

        <div className="bg-[#161616] rounded-2xl p-6 mt-10 shadow-xl overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b border-zinc-700 text-cyan-400">
                                <th className="text-left py-4">
                  Type
                </th>

                <th className="text-left py-4">
                  File
                </th>

                <th className="text-left py-4">
                  Status
                </th>

                <th className="text-left py-4">
                  Confidence
                </th>

                <th className="text-left py-4">
                  Date & Time
                </th>

                <th className="text-left py-4">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredHistory.length === 0 ? (

                <tr>

                  <td
                    colSpan={6}
                    className="text-center py-16 text-zinc-500"
                  >

                    <div className="flex flex-col items-center">

                      <div className="text-6xl">
                        📂
                      </div>

                      <h2 className="text-2xl font-bold mt-4 text-white">
                        No Scan History Yet
                      </h2>

                      <p className="mt-2">
                        Start scanning Emails,
                        URLs or SMS to see
                        them here.
                      </p>

                    </div>

                  </td>

                </tr>

              ) : (

                filteredHistory.map((item, index) => (

                  <tr
                    key={index}
                    className="border-b border-zinc-800 hover:bg-[#202020] transition"
                  >

                    <td className="py-5 font-semibold capitalize">
                      {item.scan_type}
                    </td>

                    <td className="py-5">
                      {item.filename || "-"}
                    </td>

                    <td className="py-5">

                      {item.status === "Safe" && (

                        <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full">

                          🟢 Safe

                        </span>

                      )}

                      {item.status === "Suspicious" && (

                        <span className="bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full">

                          🟡 Suspicious

                        </span>

                      )}

                      {item.status === "Phishing" && (

                        <span className="bg-red-500/20 text-red-400 px-4 py-2 rounded-full">

                          🔴 Phishing

                        </span>

                      )}

                    </td>

                    <td className="py-5">

                      <span className="font-bold text-cyan-400">

                        {item.confidence}%

                      </span>

                    </td>

                    <td className="py-5">

                      {new Date(
                        item.created_at
                      ).toLocaleString()}

                    </td>

                    <td className="py-5">

                      <button
                        onClick={async () => {

                          await deleteHistory(item.id);

                          loadHistory();

                        }}
                        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
                      >

                        🗑 Delete

                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

}

export default History;