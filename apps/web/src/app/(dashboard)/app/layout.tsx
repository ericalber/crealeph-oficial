import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { DashboardShell } from "@/components/dashboard/layout/DashboardShell";
import { Sidebar } from "@/components/dashboard/navigation/Sidebar";
import Topbar from "@/components/dashboard/layout/Topbar";
import { authOptions } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/sign-in");
  }

  return (
    <DashboardShell sidebar={<Sidebar />} topbar={<Topbar />}>
      {children}
    </DashboardShell>
  );
}
