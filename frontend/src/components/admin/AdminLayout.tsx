import { type ReactNode } from "react";
import AdminTopbar from "./AdminTopbar";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0a0609] text-white">
      <AdminTopbar />
      <main className="p-4 sm:p-6">{children}</main>
    </div>
  );
}
