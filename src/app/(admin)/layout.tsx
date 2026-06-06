import React from "react";
import AdminSidebar from "@/components/layout/admin-sidebar";

// We will implement full Supabase Auth checking inside this layout in Phase 3.
// For Phase 1 & 2, this acts as a visual structural shell.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-surface-subtle">
      <AdminSidebar />
      <main className="flex-1 p-md sm:p-xl min-w-0">{children}</main>
    </div>
  );
}
