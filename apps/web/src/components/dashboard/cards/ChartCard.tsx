import type { ReactNode } from "react";

type ChartCardProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children?: ReactNode;
};

export function ChartCard({ title, subtitle, actions, children }: ChartCardProps) {
  return (
    <div
      className="flex flex-col gap-3 rounded-[var(--radius-md)] border bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)]"
      style={{ borderColor: "var(--line)" }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-[var(--ink)]">{title}</h3>
          {subtitle ? <p className="text-xs text-[var(--muted)]">{subtitle}</p> : null}
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
      <div
        className="flex min-h-[220px] items-center justify-center rounded-[var(--radius-sm)]"
        style={{ backgroundColor: "var(--surface-muted)", border: "1px dashed var(--line)" }}
      >
        {children ?? <span className="text-xs text-[var(--muted)]">Placeholder de gráfico</span>}
      </div>
    </div>
  );
}
