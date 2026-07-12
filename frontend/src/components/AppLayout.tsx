import { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-[#09090B]">

      {/* Desktop Sidebar */}
      <div
        className={`
          transition-all duration-300
          ${sidebarOpen ? "w-64" : "w-20"}
          hidden lg:block
        `}
      >
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">

          <div className="w-64">
            <Sidebar />
          </div>

          <div
            className="flex-1 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />

        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col">

        <Topbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>

      </div>

    </div>
  );
}