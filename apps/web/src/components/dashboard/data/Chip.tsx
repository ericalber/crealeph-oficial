import type { ButtonHTMLAttributes } from "react";

export type ChipProps = {
  label: string;
  active?: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

export function Chip({ label, active, ...rest }: ChipProps) {
  return (
    <button
      type="button"
      {...rest}
      aria-pressed={active}
      role="button"
      className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] border px-[var(--space-3)] py-[var(--space-2)] text-sm font-semibold transition"
      style={{
        borderColor: active ? "var(--brand)" : "var(--line)",
        backgroundColor: active ? "var(--brand)" : "transparent",
        color: active ? "#ffffff" : "var(--muted)",
        boxShadow: active ? "var(--shadow-xs)" : "none",
        transform: "translateY(0)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
      onFocus={(e) => {
        e.currentTarget.style.outline = "none";
        e.currentTarget.style.boxShadow = `0 0 0 2px var(--brand)`;
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = active ? "var(--shadow-xs)" : "none";
      }}
    >
      {label}
    </button>
  );
}
