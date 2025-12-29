"use client";

import Link from "next/link";
import { useMemo } from "react";
import { PageHeader } from "@/components/dashboard/layout/PageHeader";
import { SectionHeader } from "@/components/dashboard/layout/SectionHeader";
import { KPICard } from "@/components/dashboard/cards/KPICard";
import { ChartCard } from "@/components/dashboard/cards/ChartCard";
import { DashboardCard } from "@/components/dashboard/cards/DashboardCard";
import { DataTable } from "@/components/dashboard/data/DataTable";
import { Divider } from "@/components/dashboard/sections/Divider";
import { EmptyState } from "@/components/dashboard/feedback/EmptyState";
import { Skeleton } from "@/components/dashboard/feedback/Skeleton";
import { eventBus } from "@/lib/crealeph/event-bus";

type ParasiteBot = {
  id: string;
  name: string;
  niche: string;
  region: string;
  modes: string[];
  nextScan: string;
  status: "Ready" | "Running" | "Scheduled";
};

type LiveSignal = {
  id: string;
  title: string;
  region: string;
  type: string;
  severity: "High" | "Medium" | "Low";
};

const bots: ParasiteBot[] = [
  { id: "bot-01", name: "Parasite SF", niche: "Cleaning", region: "San Francisco", modes: ["pricing", "conversion"], nextScan: "Today 6:00 PM", status: "Scheduled" },
  { id: "bot-02", name: "Parasite NY", niche: "Home Services", region: "New York", modes: ["trend", "experience"], nextScan: "Tomorrow 9:00 AM", status: "Ready" },
  { id: "bot-03", name: "Parasite LA", niche: "Retail", region: "Los Angeles", modes: ["pricing", "trend"], nextScan: "In 2 hours", status: "Running" },
];

const signals: LiveSignal[] = [
  { id: "sig-01", title: "Pricing shift detected in San Francisco", region: "San Francisco", type: "pricing", severity: "High" },
  { id: "sig-02", title: "New CTA outperforming by 31% in Cleaning", region: "Los Angeles", type: "conversion", severity: "Medium" },
  { id: "sig-03", title: "Competitor added 24h service in New York", region: "New York", type: "experience", severity: "High" },
  { id: "sig-04", title: "Review volume spiked in North Bay", region: "San Jose", type: "trend", severity: "Low" },
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

export default function ParasitePage() {
  const botColumns = useMemo(
    () => [
      { key: "name", label: "Bot" },
      { key: "niche", label: "Niche" },
      { key: "region", label: "Region" },
      { key: "modes", label: "Modes" },
      { key: "nextScan", label: "Next Scan" },
      { key: "status", label: "Status" },
      { key: "actions", label: "Actions", align: "right" as const },
    ],
    []
  );

  const botRows = bots.map((bot) => ({
    ...bot,
    modes: bot.modes.join(", "),
    actions: (
      <div className="flex flex-wrap items-center justify-end gap-2">
        <GhostButton onClick={() => eventBus.emit("parasite.scan.requested", { botId: bot.id, niche: bot.niche, region: bot.region, modes: bot.modes })}>
          Run Scan
        </GhostButton>
        <GhostButton onClick={() => eventBus.emit("parasite.signal.created", { botId: bot.id, region: bot.region, type: "manual_trigger" })}>
          Create Signal
        </GhostButton>
        <GhostButton
          onClick={async () => {
            try {
              const payload = {
                robotId: bot.id,
                objective_type: "site_plan",
                objective_payload: {
                  page: "home",
                  niche: bot.niche,
                  region: bot.region,
                  modes: bot.modes,
                },
                constraints: {
                  niche: bot.niche,
                  region: bot.region,
                },
                coherence_policy: { on_stale: "block", on_partial: "draft_only" },
                dryRun: true,
                workflowVersion: "builder-ui-1.0.0",
                agentVersion: "agent-bridge-v1",
                attempt: 1,
              };

              const res = await fetch("/api/builder/run", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
              });

              const json = await res.json().catch(() => null);
              if (!res.ok || !json?.ok) {
                const message =
                  json?.error ??
                  json?.blocking_reason ??
                  json?.message ??
                  `HTTP ${res.status}`;
                throw new Error(message);
              }

              const artifactIds = Array.isArray(json?.artifacts)
                ? json.artifacts
                    .map((artifact: { id?: string }) => artifact.id)
                    .filter((id): id is string => typeof id === "string")
                : [];

              console.log("builder.run", {
                executionId: json.executionId,
                state: json.state,
                artifacts: artifactIds,
              });
            } catch (error) {
              console.error("builder.run failed", error);
              throw error;
            }
          }}
        >
          Apply to Builder
        </GhostButton>
      </div>
    ),
    key: bot.id,
  }));

  const kpis = [
    { label: "Active Bots", value: "3", delta: "+1", tone: "positive" as const },
    { label: "Signals (24h)", value: "18", delta: "+5", tone: "positive" as const },
    { label: "Pending Scans", value: "2", delta: "+1", tone: "neutral" as const },
    { label: "High Severity", value: "6", delta: "+2", tone: "negative" as const },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Parasite Bots"
        subtitle="Your market observer agents, powered by Parasita."
        actions={
          <div className="flex gap-2">
            <GhostButton onClick={() => eventBus.emit("parasite.scan.requested", { botId: bots[0]?.id ?? "new-scan", region: bots[0]?.region ?? "San Francisco" })}>
              New Scan Now
            </GhostButton>
            <Link href="/app/parasite/create" className="inline-flex h-9 items-center justify-center rounded-[var(--radius-sm)] border px-3 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--surface-muted)]">
              Create New Bot
            </Link>
          </div>
        }
      />

      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        {kpis.map((kpi) => (
          <KPICard key={kpi.label} label={kpi.label} value={kpi.value} delta={kpi.delta} tone={kpi.tone} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Signals by severity" subtitle="Last 7 days">
          <Skeleton className="h-[160px] w-full rounded-[var(--radius-sm)]" />
        </ChartCard>
        <ChartCard title="Bots by niche" subtitle="Active bots per category">
          <Skeleton className="h-[160px] w-full rounded-[var(--radius-sm)]" />
        </ChartCard>
      </div>

      <SectionHeader title="Bots" description="Registered Parasite Bots and their next scans." />
      {botRows.length === 0 ? (
        <EmptyState title="No bots created" description="Create your first Parasite Bot to start scanning." action={<Link href="/app/parasite/create" className="text-[var(--brand)]">Create Bot</Link>} />
      ) : (
        <DataTable columns={botColumns} rows={botRows} />
      )}

      <Divider />

      <SectionHeader title="Parasite Console" description="Live signals detected by Parasita." />
      <div className="grid gap-4 md:grid-cols-2">
        {signals.map((signal) => (
          <DashboardCard key={signal.id} className="space-y-2">
            <p className="text-sm font-semibold text-[var(--ink)]">{signal.title}</p>
            <p className="text-xs text-[var(--muted)]">
              Region: {signal.region} • Type: {signal.type} • Severity: {signal.severity}
            </p>
            <div className="flex flex-wrap gap-2">
              <GhostButton onClick={() => eventBus.emit("builder.template.used", { source: "PARASITE", signalId: signal.id, region: signal.region })}>
                Apply (Builder)
              </GhostButton>
              <GhostButton onClick={() => eventBus.emit("insight.created", { source: "PARASITE", signalId: signal.id, type: "copy_improvement" })}>
                Improve (Copy)
              </GhostButton>
              <GhostButton onClick={() => eventBus.emit("markettwin.region.updated", { source: "PARASITE", region: signal.region })}>
                Benchmark
              </GhostButton>
              <GhostButton onClick={() => eventBus.emit("insight.created", { source: "PARASITE", origin: "signal", signalId: signal.id })}>
                Details
              </GhostButton>
            </div>
          </DashboardCard>
        ))}
      </div>

      <Divider />

      <DashboardCard>
        <p className="text-sm font-semibold text-[var(--ink)]">Cross-links CREALEPH</p>
        <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
          <li onClick={() => eventBus.emit("scout.alert.created", { source: "PARASITE", action: "forward_to_scout" })}>Scout → forward signals for continuous watch</li>
          <li onClick={() => eventBus.emit("pricing.region.updated", { source: "PARASITE", action: "align_pricing_from_signal" })}>Pricing → adjust price bands from signals</li>
          <li onClick={() => eventBus.emit("insight.created", { source: "PARASITE", action: "generate_hypothesis" })}>InsightScore → promote as hypothesis</li>
          <li onClick={() => eventBus.emit("builder.page.published", { source: "PARASITE", action: "publish_variant" })}>Builder → publish variant based on signal</li>
          <li onClick={() => eventBus.emit("report.generated", { source: "PARASITE", action: "attach_to_report" })}>Reports → attach signals to reports</li>
        </ul>
      </DashboardCard>
    </div>
  );
}
