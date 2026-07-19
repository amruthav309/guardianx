import { type ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface Props {
  children: ReactNode;
}

export default function AppLayout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-[#09090B] text-white">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="fixed left-0 top-0 z-40 h-screen">
          <Sidebar />
        </div>
      )}

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : "ml-0"
        }`}
      >
        <Topbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="p-5">{children}</main>
      </div>
    </div>
  );
}