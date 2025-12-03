import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import type { FilterBarProps } from "./FilterBar";
import { Chip } from "./Chip";

type FilterDrawerProps = FilterBarProps & {
  open: boolean;
  onClose: () => void;
};

export function FilterDrawer({
  open,
  onClose,
  chips,
  onChipToggle,
  showSearch,
  searchPlaceholder,
  showDateRange,
  onDateChange,
  selects,
  extra,
  onClear,
}: FilterDrawerProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      previousFocus.current = document.activeElement as HTMLElement;
      const focusable = panelRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      focusable?.focus();
    } else if (previousFocus.current) {
      previousFocus.current.focus();
    }
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Tab") {
        const focusables = Array.from(
          panelRef.current?.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          ) ?? []
        ).filter((el) => !el.hasAttribute("disabled"));
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex"
      role="dialog"
      aria-modal="true"
      aria-label="Filtros"
    >
      <div
        className="h-full w-full bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        className="flex h-full w-[88%] max-w-sm flex-col gap-[var(--space-4)] border-l bg-[var(--surface)] p-[var(--space-5)] shadow-[var(--shadow-md)] transition"
        style={{ borderColor: "var(--line)", transform: "translateX(0)" }}
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-[var(--ink)]">Filtros</p>
            <p className="text-xs text-[var(--muted)]">Ajuste e refine resultados</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] border text-[var(--muted)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
            style={{ borderColor: "var(--line)" }}
            aria-label="Fechar filtros"
          >
            <X size={16} />
          </button>
        </div>

        {chips && chips.length > 0 ? (
          <div className="space-y-[var(--space-2)]">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Chips</p>
            <div className="flex flex-wrap gap-[var(--space-2)]">
              {chips.map((chip) => (
                <Chip
                  key={chip.id}
                  label={chip.label}
                  active={chip.active}
                  onClick={() => onChipToggle?.(chip.id)}
                />
              ))}
            </div>
          </div>
        ) : null}

        {selects && selects.length > 0 ? (
          <div className="space-y-[var(--space-2)]">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Seleções</p>
            <div className="grid gap-[var(--space-2)]">
              {selects.map((select) => (
                <label key={select.id} className="space-y-1 text-sm text-[var(--ink)]">
                  <span className="text-xs font-semibold text-[var(--muted)]">{select.label}</span>
                  <select
                    value={select.value}
                    onChange={(e) => select.onChange(e.target.value)}
                    className="w-full rounded-[var(--radius-sm)] border px-[var(--space-3)] py-[var(--space-2)] text-sm text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:ring-offset-2 focus:ring-offset-[var(--surface)]"
                    style={{ borderColor: "var(--line)", backgroundColor: "var(--surface)" }}
                  >
                    {select.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </div>
        ) : null}

        {showSearch ? (
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Busca</p>
            <div
              className="inline-flex w-full items-center gap-2 rounded-[var(--radius-sm)] border px-[var(--space-3)] py-[var(--space-2)] text-sm text-[var(--ink)]"
              style={{ borderColor: "var(--line)" }}
            >
              <input
                type="text"
                aria-label="Buscar"
                placeholder={searchPlaceholder ?? "Buscar..."}
                className="w-full bg-transparent text-sm text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none"
              />
            </div>
          </div>
        ) : null}

        {showDateRange ? (
          <div className="space-y-[var(--space-2)]">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Intervalo</p>
            <div className="grid grid-cols-2 gap-[var(--space-2)]">
              <input
                type="date"
                aria-label="Data inicial"
                className="w-full rounded-[var(--radius-sm)] border px-[var(--space-3)] py-[var(--space-2)] text-sm text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:ring-offset-2 focus:ring-offset-[var(--surface)]"
                style={{ borderColor: "var(--line)", backgroundColor: "var(--surface)" }}
                onChange={(e) => onDateChange?.({ from: e.target.value ? new Date(e.target.value) : null, to: null })}
              />
              <input
                type="date"
                aria-label="Data final"
                className="w-full rounded-[var(--radius-sm)] border px-[var(--space-3)] py-[var(--space-2)] text-sm text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:ring-offset-2 focus:ring-offset-[var(--surface)]"
                style={{ borderColor: "var(--line)", backgroundColor: "var(--surface)" }}
                onChange={(e) => onDateChange?.({ from: null, to: e.target.value ? new Date(e.target.value) : null })}
              />
            </div>
          </div>
        ) : null}

        {extra ? <div className="space-y-1">{extra}</div> : null}

        <div className="mt-auto flex items-center justify-between">
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] border px-[var(--space-3)] py-[var(--space-2)] text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
            style={{ borderColor: "var(--line)" }}
          >
            Limpar tudo
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--brand)] px-[var(--space-4)] py-[var(--space-2)] text-sm font-semibold text-white transition hover:translate-y-[-1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
            aria-label="Aplicar filtros"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
}
