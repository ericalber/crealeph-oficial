"use client";

import { useMemo, useState } from "react";
import type { Module } from "@/content/modules";
import { ModuleCard } from "./ModuleCard";
import { ModuleFilters } from "./ModuleFilters";

export function ModulesExplorer({ modules }: { modules: Module[] }) {
  const [visible, setVisible] = useState<Module[]>(modules);

  const bestForRows = useMemo(() => {
    return visible.map((mod) => ({
      name: mod.title,
      bestFor: mod.outcomes[0] ?? "",
      worksWith: mod.worksWith.join(", "),
    }));
  }, [visible]);

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-ink">Filters</h2>
        <ModuleFilters modules={modules} onChange={setVisible} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((mod) => (
          <ModuleCard key={mod.slug} mod={mod} />
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-ink">Compare &amp; choose</h2>
        <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white shadow-[0_12px_28px_rgba(0,0,0,0.12)]">
          <table className="min-w-full text-left text-sm text-[#0B0B0E]/80">
            <thead className="text-xs uppercase tracking-[0.2em] text-[#0B0B0E]/60">
              <tr>
                <th className="border-b border-black/10 px-4 py-3">Module</th>
                <th className="border-b border-black/10 px-4 py-3">Best for</th>
                <th className="border-b border-black/10 px-4 py-3">Works with</th>
              </tr>
            </thead>
            <tbody>
              {bestForRows.map((row) => (
                <tr key={`${row.name}-${row.bestFor}-${row.worksWith}`} className="hover:bg-black/5">
                  <td className="border-b border-black/10 px-4 py-3 font-semibold text-[#0B0B0E]">
                    {row.name}
                  </td>
                  <td className="border-b border-black/10 px-4 py-3">{row.bestFor}</td>
                  <td className="border-b border-black/10 px-4 py-3">{row.worksWith}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
