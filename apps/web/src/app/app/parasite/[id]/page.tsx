"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/dashboard/layout/PageHeader";
import { SectionHeader } from "@/components/dashboard/layout/SectionHeader";
import { DashboardCard } from "@/components/dashboard/cards/DashboardCard";
import { DataTable } from "@/components/dashboard/data/DataTable";
import { Divider } from "@/components/dashboard/sections/Divider";
import { eventBus } from "@/lib/crealeph/event-bus";

const liveSignals = [
  { id: "sig-01", title: "Pricing shift detected", region: "San Francisco", severity: "High" },
  { id: "sig-02", title: "New CTA outperforming by 31%", region: "Los Angeles", severity: "Medium" },
  { id: "sig-03", title: "Competitor added 24h service", region: "New York", severity: "High" },
  { id: "sig-04", title: "Review volume spike", region: "San Jose", severity: "Low" },
];

const experiments = [
  { id: "exp-01", title: "Test AQUA CTA variant", target: "Builder" },
  { id: "exp-02", title: "Adjust price band for SF", target: "Pricing" },
  { id: "exp-03", title: "Launch Paid retargeting", target: "Paid" },
];

const twinSnapshot = [
  { region: "San Francisco", leader: "CleanPro USA", sov: "31%", approval: "82%" },
  { region: "Los Angeles", leader: "UltraClean America", sov: "27%", approval: "78%" },
  { region: "New York", leader: "SparkleHome", sov: "22%", approval: "69%" },
];

function GhostButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="inline-flex h-9 items-center justify-center rounded-[var(--radius-sm)] border px-3 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
      style={{ borderColor: "var(--line)" }}
    />
  );
}

export default function ParasiteConsolePage() {
  const params = useParams();
  const botId = params?.id as string;

  const twinColumns = useMemo(
    () => [
      { key: "region", label: "Region" },
      { key: "leader", label: "Leader" },
      { key: "sov", label: "SOV" },
      { key: "approval", label: "Approval" },
    ],
    []
  );

  const experimentColumns = useMemo(
    () => [
      { key: "title", label: "Experiment" },
      { key: "target", label: "Target" },
      { key: "actions", label: "Actions", align: "right" as const },
    ],
    []
  );

  const experimentRows = experiments.map((exp) => ({
    ...exp,
    actions: (
      <div className="flex flex-wrap items-center justify-end gap-2">
        <GhostButton onClick={() => eventBus.emit("parasite.experiment.suggested", { botId, expId: exp.id, target: exp.target })}>
          Apply
        </GhostButton>
        <GhostButton onClick={() => eventBus.emit("insight.created", { source: "PARASITE", experiment: exp })}>
          Send to InsightScore
        </GhostButton>
      </div>
    ),
    key: exp.id,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Parasite Console"
        subtitle="Live signals and actions for your Parasite Bot."
        actions={
          <GhostButton onClick={() => eventBus.emit("parasite.scan.triggered", { botId, region: "San Francisco" })}>
            Scan Now
          </GhostButton>
        }
      />

      <SectionHeader title="Live Signals" description="Latest detections from Parasita." />
      <div className="grid gap-4 md:grid-cols-2">
        {liveSignals.map((signal) => (
          <DashboardCard key={signal.id} className="space-y-2">
            <p className="text-sm font-semibold text-[var(--ink)]">{signal.title}</p>
            <p className="text-xs text-[var(--muted)]">
              Region: {signal.region} • Severity: {signal.severity}
            </p>
            <div className="flex flex-wrap gap-2">
              <GhostButton onClick={() => eventBus.emit("builder.template.used", { source: "PARASITE", signalId: signal.id, region: signal.region })}>
                Apply (Builder)
              </GhostButton>
              <GhostButton onClick={() => eventBus.emit("insight.created", { source: "PARASITE", signalId: signal.id })}>
                Send to InsightScore
              </GhostButton>
              <GhostButton onClick={() => eventBus.emit("pricing.region.updated", { source: "PARASITE", region: signal.region })}>
                Align Pricing
              </GhostButton>
              <GhostButton onClick={() => eventBus.emit("parasite.signal.detected", { botId, signalId: signal.id, region: signal.region, severity: signal.severity })}>
                Log Signal
              </GhostButton>
            </div>
          </DashboardCard>
        ))}
      </div>

      <Divider />

      <SectionHeader title="Market Twin Feed" description="Snapshot of leadership and approval." />
      <DataTable columns={twinColumns} rows={twinSnapshot.map((row, idx) => ({ ...row, key: `${row.region}-${idx}` }))} />

      <Divider />

      <SectionHeader title="Recommended Experiments" description="Actions suggested by Parasita." />
      <DataTable columns={experimentColumns} rows={experimentRows} />

      <Divider />

      <DashboardCard>
        <p className="text-sm font-semibold text-[var(--ink)]">Cross-actions</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <GhostButton onClick={() => eventBus.emit("insight.created", { source: "PARASITE", action: "send_to_ideator", botId })}>
            Send to Ideator
          </GhostButton>
          <GhostButton onClick={() => eventBus.emit("insight.created", { source: "PARASITE", action: "send_to_copywriter", botId })}>
            Send to Copywriter
          </GhostButton>
          <GhostButton onClick={() => eventBus.emit("builder.page.published", { source: "PARASITE", action: "apply_to_builder", botId })}>
            Apply to Builder
          </GhostButton>
          <GhostButton onClick={() => eventBus.emit("insight.created", { source: "PARASITE", action: "send_to_insightscore", botId })}>
            Send to InsightScore
          </GhostButton>
          <GhostButton onClick={() => eventBus.emit("custom", { source: "PARASITE", action: "send_to_paid", botId })}>
            Send to Paid
          </GhostButton>
          <GhostButton onClick={() => eventBus.emit("pricing.region.updated", { source: "PARASITE", action: "send_to_pricing", botId })}>
            Send to Pricing
          </GhostButton>
        </div>
      </DashboardCard>
    </div>
  );
}
