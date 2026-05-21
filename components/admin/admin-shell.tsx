"use client";

import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import { Sidebar } from "./sidebar";
import { ToastProvider } from "./toast";

interface AdminShellProps {
  adminName: string;
  adminRole: string;
  pendingCount: number;
  children: React.ReactNode;
}

export function AdminShell({ adminName, adminRole, pendingCount, children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SessionProvider>
      <ToastProvider>
        <div className="min-h-screen flex">
          <Sidebar
            adminName={adminName}
            adminRole={adminRole}
            pendingCount={pendingCount}
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          <main className="flex-1 bg-cream min-h-screen lg:ml-0">
            {children}
          </main>
        </div>
      </ToastProvider>
    </SessionProvider>
  );
}
