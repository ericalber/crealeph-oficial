"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/dashboard/layout/PageHeader";
import { SectionHeader } from "@/components/dashboard/layout/SectionHeader";
import { DashboardCard } from "@/components/dashboard/cards/DashboardCard";

type Template = {
  id: string;
  name: string;
  type: string;
  description: string;
  config?: any;
  vertical?: { slug: string; name: string } | null;
};

export default function MarketplacePage() {
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/marketplace/templates");
      const json = await res.json().catch(() => null);
      setTemplates(json?.data ?? []);
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vertical Intelligence Marketplace"
        subtitle="Pick a template and start with a bot that already knows your niche."
        actions={
          <Link
            href="/app/robots/parasite/create"
            className="rounded-[var(--radius-sm)] bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Create Parasite Bot
          </Link>
        }
      />

      <SectionHeader
        title="Available templates"
        description="Choose a starting point for your next vertical bot."
      />

      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        {templates.map((tpl) => (
          <DashboardCard
            key={tpl.id}
            className="rounded-2xl border border-white/10 bg-white text-[#0B0B0E] p-5 transition-transform duration-200 hover:-translate-y-[2px] hover:shadow-[0_12px_28px_rgba(214,40,40,0.18)] min-h-[140px]"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold">{tpl.name}</p>
                <p className="text-xs text-[var(--muted)]">
                  {tpl.vertical?.name ?? tpl.vertical?.slug ?? "Universal"} • {tpl.type}
                </p>
              </div>
              <span className="rounded-full bg-[var(--surface-muted)] px-2 py-1 text-[11px] font-semibold text-[var(--brand)]">
                Template
              </span>
            </div>
            <p className="mt-2 text-sm text-[var(--muted)]">{tpl.description}</p>
            <div className="mt-3">
              <Link
                href={`/app/robots/parasite/create?templateId=${tpl.id}`}
                className="inline-flex items-center rounded-[var(--radius-sm)] border px-3 py-2 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--surface-muted)]"
                style={{ borderColor: "var(--line)" }}
              >
                Create from template
              </Link>
            </div>
          </DashboardCard>
        ))}
      </div>
    </div>
  );
}
