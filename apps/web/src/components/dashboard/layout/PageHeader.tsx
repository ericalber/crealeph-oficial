import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
};

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <header
      className="flex flex-col gap-3 rounded-[var(--radius-md)] bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)] md:flex-row md:items-center md:justify-between"
      style={{ border: "1px solid var(--line)" }}
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-[var(--ink)]">{title}</h1>
        {subtitle ? <p className="text-sm text-[var(--muted)]">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}
