"use client";

import type { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard/layout/DashboardShell";
import { Sidebar } from "@/components/dashboard/navigation/Sidebar";
import Topbar from "@/components/dashboard/layout/Topbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell sidebar={<Sidebar />} topbar={<Topbar />}>
      {children}
    </DashboardShell>
  );
}
