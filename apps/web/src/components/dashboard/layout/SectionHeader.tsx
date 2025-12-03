import type { ReactNode } from "react";

type SectionHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function SectionHeader({ title, description, actions }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-[var(--ink)]">{title}</h2>
        {description ? <p className="text-sm text-[var(--muted)]">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
