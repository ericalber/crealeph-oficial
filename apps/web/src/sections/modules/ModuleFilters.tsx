"use client";

import { useEffect, useMemo, useState } from "react";
import type { Module } from "@/content/modules";

const CATEGORY_LIST: Module["category"][] = ["Intelligence", "Competition", "Pricing", "Integration"];

type ModuleFiltersProps = {
  modules: Module[];
  onChange: (modules: Module[]) => void;
};

export function ModuleFilters({ modules, onChange }: ModuleFiltersProps) {
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<Set<Module["category"]>>(new Set());

  const counts = useMemo(() => {
    const tally: Record<Module["category"], number> = {
      Intelligence: 0,
      Competition: 0,
      Pricing: 0,
      Integration: 0,
    };
    modules.forEach((m) => {
      tally[m.category] = (tally[m.category] ?? 0) + 1;
    });
    return tally;
  }, [modules]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return modules.filter((m) => {
      const matchesCategory = categories.size === 0 || categories.has(m.category);
      const inText =
        q.length === 0 ||
        m.title.toLowerCase().includes(q) ||
        m.summary.toLowerCase().includes(q) ||
        m.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && inText;
    });
  }, [categories, modules, query]);

  // Notify parent when filters change
  useEffect(() => {
    onChange(filtered);
  }, [filtered, onChange]);

  const toggleCategory = (cat: Module["category"]) => {
    setCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  };

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-[0_12px_28px_rgba(0,0,0,0.12)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="w-full md:max-w-md">
          <label className="sr-only" htmlFor="modules-search">
            Search modules
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 shadow-sm">
            <input
              id="modules-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, summary or tag"
              className="w-full bg-transparent text-sm text-[#0B0B0E] placeholder:text-[#0B0B0E]/50 focus:outline-none"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_LIST.map((cat) => {
            const active = categories.has(cat);
            return (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                  active
                    ? "border-[#D62828] bg-[#D62828] text-white"
                    : "border-black/10 bg-white text-[#0B0B0E]/80 hover:border-[#D62828]"
                }`}
                aria-pressed={active}
              >
                <span>{cat}</span>
                <span className="rounded-full bg-black/5 px-2 py-0.5 text-[11px]">
                  {counts[cat]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <p className="mt-3 text-xs text-[#0B0B0E]/60">
        Showing {filtered.length} of {modules.length} modules
      </p>
    </div>
  );
}
