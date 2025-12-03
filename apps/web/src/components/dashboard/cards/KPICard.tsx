type KPICardProps = {
  label: string;
  value: string | number;
  delta?: string;
  tone?: "positive" | "negative" | "neutral";
};

export function KPICard({ label, value, delta, tone = "neutral" }: KPICardProps) {
  const toneColor =
    tone === "positive"
      ? "var(--success)"
      : tone === "negative"
        ? "var(--danger)"
        : "var(--muted)";

  return (
    <div
      className="rounded-[var(--radius-md)] border bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)]"
      style={{ borderColor: "var(--line)" }}
    >
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--muted)]">{label}</p>
      <div className="mt-2 flex items-center justify-between gap-2">
        <p className="text-2xl font-semibold text-[var(--ink)]">{value}</p>
        {delta ? (
          <span
            className="rounded-full px-2 py-1 text-xs font-semibold"
            style={{
              backgroundColor: "var(--surface-muted)",
              color: toneColor,
            }}
          >
            {delta}
          </span>
        ) : null}
      </div>
    </div>
  );
}
