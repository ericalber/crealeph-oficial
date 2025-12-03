"use client";
import { useEffect, useMemo, useState } from "react";
import { Calendar, Filter, Search as SearchIcon, X } from "lucide-react";
import type { ReactNode } from "react";

import { Chip } from "./Chip";
import { FilterDrawer } from "./FilterDrawer";

export type FilterChip = {
  id: string;
  label: string;
  active?: boolean;
};

export type FilterBarProps = {
  chips?: FilterChip[];
  onChipToggle?: (id: string) => void;

  showSearch?: boolean;
  searchPlaceholder?: string;

  showDateRange?: boolean;
  onDateChange?: (range: { from: Date | null; to: Date | null }) => void;

  selects?: {
    id: string;
    label: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
  }[];

  extra?: ReactNode;

  onClear?: () => void;
};

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const match = window.matchMedia(`(max-width:${breakpoint}px)`);
    const update = () => setIsMobile(match.matches);
    update();
    match.addEventListener("change", update);
    return () => match.removeEventListener("change", update);
  }, [breakpoint]);
  return isMobile;
}

export function FilterBar(props: FilterBarProps) {
  const {
    chips,
    onChipToggle,
    showSearch = false,
    searchPlaceholder,
    showDateRange = false,
    onDateChange,
    selects,
    extra,
    onClear,
  } = props;
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const hasFilters =
    (chips && chips.length > 0) ||
    (selects && selects.length > 0) ||
    showSearch ||
    showDateRange ||
    !!extra;

  const chipItems = chips ?? [];
  const selectItems = selects ?? [];

  const content = useMemo(
    () => (
      <>
        {chipItems.length > 0 ? (
          <div className="flex flex-wrap items-center gap-[var(--space-2)]">
            <span className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] border px-[var(--space-3)] py-[var(--space-2)] text-sm font-semibold text-[var(--ink)]" style={{ borderColor: "var(--line)" }}>
              <Filter size={16} />
              Filtros
            </span>
            {chipItems.map((chip) => (
              <Chip key={chip.id} label={chip.label} active={chip.active} onClick={() => onChipToggle?.(chip.id)} />
            ))}
          </div>
        ) : null}

        {selectItems.length > 0 ? (
          <div className="flex flex-wrap items-center gap-[var(--space-2)]">
            {selectItems.map((select) => (
              <label key={select.id} className="flex items-center gap-[var(--space-2)] text-sm text-[var(--ink)]">
                <span className="text-xs font-semibold text-[var(--muted)]">{select.label}</span>
                <select
                  value={select.value}
                  onChange={(e) => select.onChange(e.target.value)}
                  className="rounded-[var(--radius-sm)] border px-[var(--space-3)] py-[var(--space-2)] text-sm text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:ring-offset-2 focus:ring-offset-[var(--surface)]"
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
        ) : null}

        {showSearch ? (
          <div
            className="inline-flex min-w-[200px] flex-1 items-center gap-2 rounded-[var(--radius-sm)] border px-[var(--space-3)] py-[var(--space-2)] text-sm text-[var(--ink)]"
            style={{ borderColor: "var(--line)" }}
          >
            <SearchIcon size={16} className="text-[var(--muted)]" />
            <input
              type="text"
              aria-label="Buscar"
              placeholder={searchPlaceholder ?? "Buscar..."}
              className="w-full bg-transparent text-sm text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none"
            />
          </div>
        ) : null}

        {showDateRange ? (
          <div className="flex items-center gap-[var(--space-2)]">
            <div
              className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] border px-[var(--space-3)] py-[var(--space-2)] text-sm text-[var(--ink)]"
              style={{ borderColor: "var(--line)" }}
            >
              <Calendar size={16} className="text-[var(--muted)]" />
              <input
                type="date"
                aria-label="Data inicial"
                className="bg-transparent text-sm text-[var(--ink)] focus:outline-none"
                onChange={(e) => onDateChange?.({ from: e.target.value ? new Date(e.target.value) : null, to: null })}
              />
              <span className="text-[var(--muted)]">–</span>
              <input
                type="date"
                aria-label="Data final"
                className="bg-transparent text-sm text-[var(--ink)] focus:outline-none"
                onChange={(e) => onDateChange?.({ from: null, to: e.target.value ? new Date(e.target.value) : null })}
              />
            </div>
          </div>
        ) : null}

        {extra ? <div className="flex items-center gap-[var(--space-2)]">{extra}</div> : null}

        {onClear ? (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] border px-[var(--space-3)] py-[var(--space-2)] text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
            style={{ borderColor: "var(--line)" }}
          >
            <X size={16} />
            Limpar
          </button>
        ) : null}
      </>
    ),
    [chipItems, onChipToggle, selectItems, showSearch, searchPlaceholder, showDateRange, onDateChange, extra, onClear]
  );

  if (!hasFilters) return null;

  if (isMobile) {
    return (
      <>
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] border px-[var(--space-3)] py-[var(--space-2)] text-sm font-semibold text-[var(--ink)] transition hover:translate-y-[-1px] hover:bg-[var(--surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
          style={{ borderColor: "var(--line)", boxShadow: "var(--shadow-xs)" }}
        >
          <Filter size={16} />
          Filtros
        </button>
        <FilterDrawer {...props} open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      </>
    );
  }

  return (
    <div
      className="flex flex-wrap items-center gap-[var(--space-3)] rounded-[var(--radius-md)] border bg-[var(--surface)] p-[var(--space-4)] shadow-[var(--shadow-sm)]"
      style={{ borderColor: "var(--line)" }}
    >
      {content}
    </div>
  );
}
