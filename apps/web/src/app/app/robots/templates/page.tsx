"use client";

import { PageHeader } from "@/components/dashboard/layout/PageHeader";
import { DashboardCard } from "@/components/dashboard/cards/DashboardCard";
import { Divider } from "@/components/dashboard/sections/Divider";
import { GhostButton } from "@/components/ui/GhostButton";

const templates = [
  { name: "Parasite Extraction", desc: "Scan competitors and extract signals.", type: "Parasite" },
  { name: "CTA Pattern Recognition", desc: "Identify outperforming CTAs by region.", type: "Conversion" },
  { name: "Pricing Window Scanner", desc: "Track price bands and anomalies.", type: "Pricing" },
  { name: "Trend Cluster Analyzer", desc: "Surface trend drifts and spikes.", type: "Trend" },
  { name: "Competitor Delta Diff", desc: "Diff landing pages and offers.", type: "Scout" },
  { name: "Review Sentiment Extractor", desc: "Summarize review clusters and intent.", type: "Sentiment" },
];

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Robots Templates"
        subtitle="Apply templates to accelerate Parasite, Ideator, Copywriter or custom bots."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((tpl) => (
          <DashboardCard key={tpl.name} className="space-y-2">
            <p className="text-sm font-semibold text-[var(--ink)]">{tpl.name}</p>
            <p className="text-sm text-[var(--muted)]">{tpl.desc}</p>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{tpl.type}</p>
            <div className="flex gap-2">
              <GhostButton>Preview</GhostButton>
              <GhostButton>Use This Template</GhostButton>
            </div>
          </DashboardCard>
        ))}
      </div>

      <Divider />

      <DashboardCard>
        <p className="text-sm font-semibold text-[var(--ink)]">Need a custom template?</p>
        <p className="text-sm text-[var(--muted)]">Create a custom extractor or executor for your robot.</p>
        <div className="mt-2 flex gap-2">
          <GhostButton>Create custom template</GhostButton>
          <GhostButton>Apply to robot</GhostButton>
        </div>
      </DashboardCard>
    </div>
  );
}
