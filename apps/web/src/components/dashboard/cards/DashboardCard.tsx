import type { ReactNode } from "react";

type DashboardCardProps = {
  children: ReactNode;
  className?: string;
};

export function DashboardCard({ children, className }: DashboardCardProps) {
  return (
    <div
      className={`rounded-[var(--radius-md)] border bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)] ${className ?? ""}`}
      style={{ borderColor: "var(--line)" }}
    >
      {children}
    </div>
  );
}
