"use client";

import { createContext, useContext, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { Sidebar } from "./sidebar";
import { ToastProvider } from "./toast";
import { Role } from "@prisma/client";

const SidebarContext = createContext<{ toggleSidebar: () => void }>({ toggleSidebar: () => {} });
export const useSidebar = () => useContext(SidebarContext);

interface AdminShellProps {
  adminName: string;
  adminRole: string;
  userRole: Role;
  pendingCount: number;
  children: React.ReactNode;
}

export function AdminShell({ adminName, adminRole, userRole, pendingCount, children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SessionProvider>
      <ToastProvider>
        <SidebarContext.Provider value={{ toggleSidebar: () => setSidebarOpen((o) => !o) }}>
          <div className="min-h-screen flex">
            <Sidebar
              adminName={adminName}
              adminRole={adminRole}
              userRole={userRole}
              pendingCount={pendingCount}
              open={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
            <main className="flex-1 bg-cream min-h-screen lg:ml-0">
              {children}
            </main>
          </div>
        </SidebarContext.Provider>
      </ToastProvider>
    </SessionProvider>
  );
}
