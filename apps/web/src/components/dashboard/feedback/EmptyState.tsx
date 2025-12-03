import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 rounded-[var(--radius-md)] border bg-[var(--surface)] p-6 text-center shadow-[var(--shadow-sm)]"
      style={{ borderColor: "var(--line)" }}
    >
      <div
        className="flex h-12 w-12 items-center justify-center rounded-full"
        style={{ backgroundColor: "var(--surface-muted)", color: "var(--brand)" }}
        aria-hidden
      >
        ☼
      </div>
      <div className="space-y-1">
        <p className="text-base font-semibold text-[var(--ink)]">{title}</p>
        {description ? <p className="text-sm text-[var(--muted)]">{description}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
