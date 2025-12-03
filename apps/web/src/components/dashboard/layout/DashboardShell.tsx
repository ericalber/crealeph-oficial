import type { ReactNode } from "react";

type DashboardShellProps = {
  sidebar: ReactNode;
  topbar: ReactNode;
  children: ReactNode;
};

export function DashboardShell({ sidebar, topbar, children }: DashboardShellProps) {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--ink)",
        fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <div className="flex min-h-screen">
        <aside className="hidden lg:flex" aria-label="Dashboard navigation">
          {sidebar}
        </aside>
        <div className="relative flex flex-1 flex-col bg-[var(--bg)]">
          <div className="sticky top-0 z-30">{topbar}</div>
          <main className="flex-1 px-4 pb-10 pt-4 lg:px-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
