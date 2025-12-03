"use client";

import { ButtonHTMLAttributes, useMemo, useState } from "react";
import { PageHeader } from "@/components/dashboard/layout/PageHeader";
import { SectionHeader } from "@/components/dashboard/layout/SectionHeader";
import { KPICard } from "@/components/dashboard/cards/KPICard";
import { ChartCard } from "@/components/dashboard/cards/ChartCard";
import { FilterBar, type FilterChip } from "@/components/dashboard/data/FilterBar";
import { DataTable } from "@/components/dashboard/data/DataTable";
import { Divider } from "@/components/dashboard/sections/Divider";
import { DashboardCard } from "@/components/dashboard/cards/DashboardCard";
import { EmptyState } from "@/components/dashboard/feedback/EmptyState";
import { Skeleton } from "@/components/dashboard/feedback/Skeleton";
import { eventBus } from "@/lib/crealeph/event-bus";

function GhostButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="inline-flex h-9 items-center justify-center rounded-[var(--radius-sm)] border px-3 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
      style={{ borderColor: "var(--line)" }}
    />
  );
}

type IntegrationRow = {
  provider: string;
  type: "SaaS" | "Webhook" | "Marketing";
  env: "Production" | "Sandbox";
  status: "Operational" | "Degraded" | "Error";
  latency: string;
  lastEvent: string;
  lastEventDate: Date;
};

const baseRows: IntegrationRow[] = [
  {
    provider: "Stripe",
    type: "SaaS",
    env: "Production",
    status: "Operational",
    latency: "120ms",
    lastEvent: "charge.succeeded",
    lastEventDate: new Date("2025-01-13T09:10:00"),
  },
  {
    provider: "Meta Ads",
    type: "Marketing",
    env: "Production",
    status: "Degraded",
    latency: "280ms",
    lastEvent: "lead_sync",
    lastEventDate: new Date("2025-01-13T08:45:00"),
  },
  {
    provider: "Google Ads",
    type: "Marketing",
    env: "Production",
    status: "Operational",
    latency: "190ms",
    lastEvent: "conversion_upload",
    lastEventDate: new Date("2025-01-12T17:30:00"),
  },
  {
    provider: "Google Search Console",
    type: "SaaS",
    env: "Production",
    status: "Operational",
    latency: "210ms",
    lastEvent: "seo_sync",
    lastEventDate: new Date("2025-01-12T10:05:00"),
  },
  {
    provider: "HubSpot",
    type: "SaaS",
    env: "Sandbox",
    status: "Degraded",
    latency: "320ms",
    lastEvent: "contact_updated",
    lastEventDate: new Date("2025-01-11T14:20:00"),
  },
  {
    provider: "CREALEPH Webhook: lead_created",
    type: "Webhook",
    env: "Production",
    status: "Operational",
    latency: "95ms",
    lastEvent: "lead_created",
    lastEventDate: new Date("2025-01-13T09:20:00"),
  },
  {
    provider: "CREALEPH Webhook: page_published",
    type: "Webhook",
    env: "Production",
    status: "Operational",
    latency: "110ms",
    lastEvent: "page_published",
    lastEventDate: new Date("2025-01-13T07:55:00"),
  },
  {
    provider: "CREALEPH Webhook: insight_approved",
    type: "Webhook",
    env: "Sandbox",
    status: "Error",
    latency: "—",
    lastEvent: "delivery_failed",
    lastEventDate: new Date("2025-01-12T22:10:00"),
  },
];

function statusColor(status: IntegrationRow["status"]) {
  if (status === "Operational") return "var(--success)";
  if (status === "Degraded") return "var(--warning)";
  return "var(--danger)";
}

export default function BridgePage() {
  const [chips, setChips] = useState<FilterChip[]>([
    { id: "operational", label: "Operational", active: false },
    { id: "degraded", label: "Degraded", active: false },
    { id: "error", label: "Error", active: false },
  ]);
  const [type, setType] = useState<"All" | "SaaS" | "Webhook" | "Marketing">("All");
  const [env, setEnv] = useState<"All" | "Production" | "Sandbox">("All");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });

  const kpis = [
    { label: "Active integrations", value: "8", delta: "+2", tone: "positive" as const },
    { label: "Uptime (30d)", value: "99.3%", delta: "-0.4%", tone: "negative" as const },
    { label: "Avg. latency", value: "210ms", delta: "+35ms", tone: "negative" as const },
    { label: "Errors (24h)", value: "3", delta: "+1", tone: "negative" as const },
    { label: "Webhooks processed", value: "1.2k", delta: "+18%", tone: "positive" as const },
  ];

  const columns = [
    { key: "provider", label: "Provider" },
    { key: "type", label: "Type" },
    { key: "env", label: "Env" },
    { key: "status", label: "Status" },
    { key: "latency", label: "Latency" },
    { key: "lastEvent", label: "Last Event" },
    { key: "lastUpdate", label: "Last Update" },
    { key: "actions", label: "Actions", align: "right" as const },
  ];

  const filteredRows = useMemo(() => {
    const active = chips.filter((c) => c.active).map((c) => c.id);
    const q = search.trim().toLowerCase();

    return baseRows.filter((row) => {
      const matchChip =
        active.length === 0 ||
        active.some((id) => {
          if (id === "operational") return row.status === "Operational";
          if (id === "degraded") return row.status === "Degraded";
          if (id === "error") return row.status === "Error";
          return true;
        });

      const matchType = type === "All" || row.type === type;
      const matchEnv = env === "All" || row.env === env;

      const matchSearch =
        q.length === 0 ||
        row.provider.toLowerCase().includes(q) ||
        row.type.toLowerCase().includes(q) ||
        row.env.toLowerCase().includes(q) ||
        row.status.toLowerCase().includes(q) ||
        row.lastEvent.toLowerCase().includes(q);

      const matchDate =
        !dateRange.from ||
        !dateRange.to ||
        (row.lastEventDate.getTime() >= dateRange.from.getTime() &&
          row.lastEventDate.getTime() <= dateRange.to.getTime());

      return matchChip && matchType && matchEnv && matchSearch && matchDate;
    });
  }, [chips, type, env, search, dateRange]);

  const isLoading = false;
  const isEmpty = filteredRows.length === 0;

  const handleClear = () => {
    setChips((prev) => prev.map((c) => ({ ...c, active: false })));
    setType("All");
    setEnv("All");
    setSearch("");
    setDateRange({ from: null, to: null });
  };

  const errorIntegrations = filteredRows.filter((row) => row.status === "Error");
  const degradedIntegrations = filteredRows.filter((row) => row.status === "Degraded");

  return (
    <div className="space-y-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
        Dashboard / Operations / Bridge
      </p>

      <PageHeader
        title="Bridge Integrations"
        subtitle="Status of integrations, webhooks and connection health across CREALEPH."
        actions={
          <>
            <GhostButton onClick={() => eventBus.emit("bridge.integration.event", { source: "Bridge", action: "generate_key" })}>
              Generate key
            </GhostButton>
            <GhostButton onClick={() => eventBus.emit("bridge.integration.event", { source: "Bridge", action: "test_webhook" })}>
              Test webhook
            </GhostButton>
            <GhostButton onClick={() => eventBus.emit("bridge.integration.event", { source: "Bridge", action: "reconnect_providers" })}>
              Reconnect providers
            </GhostButton>
          </>
        }
      />

      <DashboardCard>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-[var(--ink)]">AI Signal</p>
            <p className="text-sm text-[var(--muted)]">
              AI detected increased webhook errors and latency peaks in Meta Ads & HubSpot Sandbox. Retry strategies and secret validation are recommended.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <GhostButton onClick={() => eventBus.emit("bridge.integration.event", { source: "Bridge", action: "generate_insight" })}>
              Generate Insight
            </GhostButton>
            <GhostButton onClick={() => eventBus.emit("bridge.integration.event", { source: "Bridge", action: "review_error_pattern" })}>
              Review error pattern
            </GhostButton>
            <GhostButton onClick={() => eventBus.emit("bridge.integration.event", { source: "Bridge", action: "open_playbook" })}>
              Open Playbook
            </GhostButton>
          </div>
        </div>
      </DashboardCard>

      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}
      >
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-[96px]" />)
          : kpis.map((kpi) => <KPICard key={kpi.label} label={kpi.label} value={kpi.value} delta={kpi.delta} tone={kpi.tone} />)}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Latency by Provider" subtitle="Webhook processing time (ms)">
          {isLoading ? (
            <Skeleton className="h-[160px] w-full" />
          ) : (
            <Skeleton className="h-[160px] w-full rounded-[var(--radius-sm)]" />
          )}
        </ChartCard>

        <ChartCard title="Errors (24h)" subtitle="Distribution of failures">
          {isLoading ? (
            <Skeleton className="h-[160px] w-full" />
          ) : (
            <Skeleton className="h-[160px] w-full rounded-[var(--radius-sm)]" />
          )}
        </ChartCard>
      </div>

      <SectionHeader
        title="Active Integrations"
        description="Operational status, latency and recent events"
        actions={
          <GhostButton onClick={() => eventBus.emit("bridge.integration.event", { source: "Bridge", action: "add_integration" })}>
            Add Integration
          </GhostButton>
        }
      />

      <FilterBar
        chips={chips}
        onChipToggle={(id) => setChips((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)))}
        showSearch
        searchPlaceholder="Search provider, status, env or event"
        showDateRange
        onDateChange={setDateRange}
        selects={[
          { id: "type", label: "Type", value: type, options: ["All", "SaaS", "Webhook", "Marketing"], onChange: (v) => setType(v as typeof type) },
          { id: "env", label: "Env", value: env, options: ["All", "Production", "Sandbox"], onChange: (v) => setEnv(v as typeof env) },
        ]}
        extra={
          <GhostButton onClick={() => eventBus.emit("bridge.integration.event", { source: "Bridge", action: "new_webhook" })}>
            New Webhook
          </GhostButton>
        }
        onClear={handleClear}
      />

      {isEmpty ? (
        <EmptyState
          title="No integrations found"
          description="Adjust filters or add new integrations."
          action={<GhostButton onClick={() => eventBus.emit("bridge.integration.event", { source: "Bridge", action: "add_integration" })}>Add Integration</GhostButton>}
        />
      ) : (
        <DataTable
          columns={columns}
          rows={filteredRows.map((row, index) => ({
            ...row,
            status: (
              <span
                className="rounded-full px-2 py-1 text-xs font-semibold"
                style={{ backgroundColor: "var(--surface-muted)", color: statusColor(row.status) }}
              >
                {row.status}
              </span>
            ),
            lastUpdate: row.lastEventDate.toLocaleString("en-US", {
              month: "short",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            }),
            actions: (
              <div className="flex flex-wrap items-center justify-end gap-2">
                <GhostButton
                  aria-label="Details"
                  onClick={() => eventBus.emit("bridge.integration.event", { source: "Bridge", action: "details", row })}
                >
                  Details
                </GhostButton>

                <GhostButton
                  aria-label="Test"
                  onClick={() => eventBus.emit("bridge.integration.event", { source: "Bridge", action: "test_webhook", row })}
                >
                  Test
                </GhostButton>

                <GhostButton
                  aria-label="Reconnect"
                  onClick={() => eventBus.emit("bridge.integration.event", { source: "Bridge", action: "reconnect", row })}
                >
                  Reconnect
                </GhostButton>
              </div>
            ),
            key: `${row.provider}-${index}`,
          }))}
        />
      )}

      <Divider />

      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard>
          <p className="text-sm font-semibold text-[var(--ink)]">Error Integrations (last 24h)</p>
          {errorIntegrations.length === 0 ? (
            <EmptyState
              title="No recent errors"
              description="No integrations reporting delivery errors in the last 24h."
            />
          ) : (
            <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
              {errorIntegrations.map((item) => (
                <li key={item.provider} className="flex items-center justify-between">
                  <span>{item.provider}</span>
                  <span className="rounded-full bg-[var(--surface-muted)] px-2 py-1 text-xs font-semibold text-[var(--danger)]">{item.lastEvent}</span>
                </li>
              ))}
            </ul>
          )}
        </DashboardCard>

        <DashboardCard>
          <p className="text-sm font-semibold text-[var(--ink)]">Degraded Integrations</p>
          {degradedIntegrations.length === 0 ? (
            <EmptyState
              title="No degraded integrations"
              description="All integrations operating within expected thresholds."
            />
          ) : (
            <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
              {degradedIntegrations.map((item) => (
                <li key={item.provider} className="flex items-center justify-between">
                  <span>{item.provider}</span>
                  <span className="rounded-full bg-[var(--surface-muted)] px-2 py-1 text-xs font-semibold text-[var(--warning)]">{item.latency}</span>
                </li>
              ))}
            </ul>
          )}
        </DashboardCard>
      </div>

      <DashboardCard>
        <p className="text-sm font-semibold text-[var(--ink)]">Cross-links CREALEPH</p>
        <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
          <li onClick={() => eventBus.emit("pipeline.lead.created", { source: "Bridge", action: "check_leads" })}>
            Pipeline → analyze leads impacted by failed webhooks
          </li>
          <li onClick={() => eventBus.emit("report.generated", { source: "Bridge", action: "open_uptime_report" })}>
            Reports → consolidate logs and uptime
          </li>
          <li onClick={() => eventBus.emit("developers.webhook.tested", { source: "Bridge", action: "review_logs" })}>
            Developers → review delivery logs and secrets
          </li>
          <li onClick={() => eventBus.emit("insight.created", { source: "Bridge", action: "failure_pattern" })}>
            InsightScore → hypotheses from repeated failures
          </li>
          <li onClick={() => eventBus.emit("builder.page.published", { source: "Bridge", action: "validate_publish_hook" })}>
            Builder → validate LP publish webhook stability
          </li>
        </ul>
      </DashboardCard>
    </div>
  );
}
