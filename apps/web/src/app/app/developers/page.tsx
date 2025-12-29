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
import { eventBus, publishEvent } from "@/lib/crealeph/event-bus";

function GhostButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="inline-flex h-9 items-center justify-center rounded-[var(--radius-sm)] border px-3 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
      style={{ borderColor: "var(--line)" }}
    />
  );
}

type ApiKeyRow = {
  keyName: string;
  owner: string;
  env: "Production" | "Sandbox";
  permissions: string;
  createdAt: string;
  createdAtDate: Date;
  lastRotated: string;
  lastRotatedDate: Date;
};

type WebhookRow = {
  provider: string;
  endpoint: string;
  status: "Operational" | "Degraded" | "Error";
  latency: string;
  lastEvent: string;
  lastUpdate: string;
  lastUpdateDate: Date;
};

type DeliveryLogRow = {
  provider: string;
  event: string;
  status: "Success" | "Retry" | "Failed";
  payload: string;
  timestamp: string;
  timestampDate: Date;
};

const apiKeyRows: ApiKeyRow[] = [
  {
    keyName: "prod_public_key",
    owner: "Alice",
    env: "Production",
    permissions: "read:all",
    createdAt: "Dec 10, 2024",
    createdAtDate: new Date("2024-12-10"),
    lastRotated: "Jan 12, 2025",
    lastRotatedDate: new Date("2025-01-12"),
  },
  {
    keyName: "prod_admin_key",
    owner: "Bruno",
    env: "Production",
    permissions: "read/write",
    createdAt: "Nov 4, 2024",
    createdAtDate: new Date("2024-11-04"),
    lastRotated: "Jan 8, 2025",
    lastRotatedDate: new Date("2025-01-08"),
  },
  {
    keyName: "sandbox_dev_key",
    owner: "Carla",
    env: "Sandbox",
    permissions: "read:all",
    createdAt: "Jan 2, 2025",
    createdAtDate: new Date("2025-01-02"),
    lastRotated: "Jan 10, 2025",
    lastRotatedDate: new Date("2025-01-10"),
  },
  {
    keyName: "sandbox_ci_key",
    owner: "David",
    env: "Sandbox",
    permissions: "write:webhooks",
    createdAt: "Dec 22, 2024",
    createdAtDate: new Date("2024-12-22"),
    lastRotated: "Jan 5, 2025",
    lastRotatedDate: new Date("2025-01-05"),
  },
];

const webhookRows: WebhookRow[] = [
  {
    provider: "Stripe",
    endpoint: "https://api.crealeph.com/webhooks/stripe",
    status: "Operational",
    latency: "180ms",
    lastEvent: "charge.succeeded",
    lastUpdate: "10m ago",
    lastUpdateDate: new Date("2025-01-13T09:20:00"),
  },
  {
    provider: "Meta Ads",
    endpoint: "https://api.crealeph.com/webhooks/meta",
    status: "Degraded",
    latency: "320ms",
    lastEvent: "lead_sync",
    lastUpdate: "35m ago",
    lastUpdateDate: new Date("2025-01-13T08:55:00"),
  },
  {
    provider: "Google Ads",
    endpoint: "https://api.crealeph.com/webhooks/gads",
    status: "Operational",
    latency: "210ms",
    lastEvent: "conversion_upload",
    lastUpdate: "1h ago",
    lastUpdateDate: new Date("2025-01-13T08:00:00"),
  },
  {
    provider: "CREALEPH Internal",
    endpoint: "https://api.crealeph.com/webhooks/lead_created",
    status: "Error",
    latency: "—",
    lastEvent: "delivery_failed",
    lastUpdate: "2h ago",
    lastUpdateDate: new Date("2025-01-13T07:00:00"),
  },
];

const deliveryLogs: DeliveryLogRow[] = [
  {
    provider: "Stripe",
    event: "charge.succeeded",
    status: "Success",
    payload: "charge_id=ch_123...",
    timestamp: "12m ago",
    timestampDate: new Date("2025-01-13T09:18:00"),
  },
  {
    provider: "CREALEPH Internal",
    event: "lead_created",
    status: "Retry",
    payload: "lead_id=ld_456...",
    timestamp: "32m ago",
    timestampDate: new Date("2025-01-13T08:58:00"),
  },
  {
    provider: "Meta Ads",
    event: "lead_sync",
    status: "Failed",
    payload: "adset=meta_789...",
    timestamp: "50m ago",
    timestampDate: new Date("2025-01-13T08:40:00"),
  },
  {
    provider: "Google Ads",
    event: "conversion_upload",
    status: "Success",
    payload: "gclid=XYZ...",
    timestamp: "1h ago",
    timestampDate: new Date("2025-01-13T08:10:00"),
  },
  {
    provider: "CREALEPH Internal",
    event: "page_published",
    status: "Success",
    payload: "page_id=pg_101...",
    timestamp: "2h ago",
    timestampDate: new Date("2025-01-13T07:15:00"),
  },
  {
    provider: "Stripe",
    event: "charge.refunded",
    status: "Retry",
    payload: "charge_id=ch_999...",
    timestamp: "3h ago",
    timestampDate: new Date("2025-01-13T06:20:00"),
  },
];

function envBadgeColor(env: ApiKeyRow["env"]) {
  return env === "Production" ? "var(--success)" : "var(--info)";
}

function webhookStatusColor(status: WebhookRow["status"]) {
  if (status === "Operational") return "var(--success)";
  if (status === "Degraded") return "var(--warning)";
  return "var(--danger)";
}

function deliveryStatusColor(status: DeliveryLogRow["status"]) {
  if (status === "Success") return "var(--success)";
  if (status === "Retry") return "var(--warning)";
  return "var(--danger)";
}

export default function DevelopersPage() {
  const [keyChips, setKeyChips] = useState<FilterChip[]>([
    { id: "production", label: "Production", active: false },
    { id: "sandbox", label: "Sandbox", active: false },
    { id: "active", label: "Active", active: false },
    { id: "disabled", label: "Disabled", active: false },
  ]);
  const [keyOwner, setKeyOwner] = useState("All");
  const [keyEnv, setKeyEnv] = useState("All");
  const [keySearch, setKeySearch] = useState("");
  const [keyDateRange, setKeyDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });

  const [hookChips, setHookChips] = useState<FilterChip[]>([
    { id: "operational", label: "Operational", active: false },
    { id: "degraded", label: "Degraded", active: false },
    { id: "error", label: "Error", active: false },
  ]);
  const [hookProvider, setHookProvider] = useState("All");
  const [hookSearch, setHookSearch] = useState("");
  const [hookDateRange, setHookDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });

  const [logChips, setLogChips] = useState<FilterChip[]>([
    { id: "success", label: "Success", active: false },
    { id: "retry", label: "Retry", active: false },
    { id: "failed", label: "Failed", active: false },
  ]);
  const [logSearch, setLogSearch] = useState("");
  const [logDateRange, setLogDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });

  const kpis = [
    { label: "Active Keys", value: "14", delta: "+2", tone: "positive" as const },
    { label: "Webhooks Today", value: "1.284", delta: "+12%", tone: "positive" as const },
    { label: "Failed Deliveries", value: "7", delta: "+3", tone: "negative" as const },
    { label: "Avg. Latency", value: "182ms", delta: "+22ms", tone: "negative" as const },
    { label: "Environments", value: "2", delta: "=", tone: "neutral" as const },
  ];

  const apiColumns = [
    { key: "keyName", label: "Key" },
    { key: "owner", label: "Owner" },
    { key: "env", label: "Env" },
    { key: "permissions", label: "Permissions" },
    { key: "createdAt", label: "Created At" },
    { key: "lastRotated", label: "Last Rotated" },
    { key: "actions", label: "Actions", align: "right" as const },
  ];

  const webhookColumns = [
    { key: "provider", label: "Provider" },
    { key: "endpoint", label: "Endpoint" },
    { key: "status", label: "Status" },
    { key: "latency", label: "Latency" },
    { key: "lastEvent", label: "Last Event" },
    { key: "lastUpdate", label: "Last Update" },
    { key: "actions", label: "Actions", align: "right" as const },
  ];

  const logColumns = [
    { key: "provider", label: "Provider" },
    { key: "event", label: "Event" },
    { key: "status", label: "Status" },
    { key: "payload", label: "Payload" },
    { key: "timestamp", label: "Timestamp" },
  ];

  const filteredKeys = useMemo(() => {
    const active = keyChips.filter((c) => c.active).map((c) => c.id);
    const q = keySearch.trim().toLowerCase();

    return apiKeyRows.filter((row) => {
      const matchChips =
        active.length === 0 ||
        active.some((chip) => {
          if (chip === "production") return row.env === "Production";
          if (chip === "sandbox") return row.env === "Sandbox";
          if (chip === "active") return true;
          if (chip === "disabled") return false;
          return true;
        });

      const matchOwner = keyOwner === "All" || row.owner === keyOwner;
      const matchEnv = keyEnv === "All" || row.env === keyEnv;

      const matchSearch =
        q.length === 0 ||
        row.keyName.toLowerCase().includes(q) ||
        row.owner.toLowerCase().includes(q) ||
        row.env.toLowerCase().includes(q);

      const matchDate =
        !keyDateRange.from ||
        !keyDateRange.to ||
        (row.createdAtDate.getTime() >= keyDateRange.from.getTime() &&
          row.createdAtDate.getTime() <= keyDateRange.to.getTime()) ||
        (row.lastRotatedDate.getTime() >= keyDateRange.from.getTime() &&
          row.lastRotatedDate.getTime() <= keyDateRange.to.getTime());

      return matchChips && matchOwner && matchEnv && matchSearch && matchDate;
    });
  }, [keyChips, keyOwner, keyEnv, keySearch, keyDateRange]);

  const filteredHooks = useMemo(() => {
    const active = hookChips.filter((c) => c.active).map((c) => c.id);
    const q = hookSearch.trim().toLowerCase();

    return webhookRows.filter((row) => {
      const matchChip =
        active.length === 0 ||
        active.some((chip) => {
          if (chip === "operational") return row.status === "Operational";
          if (chip === "degraded") return row.status === "Degraded";
          if (chip === "error") return row.status === "Error";
          return true;
        });

      const matchProvider = hookProvider === "All" || row.provider === hookProvider;

      const matchSearch =
        q.length === 0 ||
        row.endpoint.toLowerCase().includes(q) ||
        row.provider.toLowerCase().includes(q) ||
        row.status.toLowerCase().includes(q);

      const matchDate =
        !hookDateRange.from ||
        !hookDateRange.to ||
        (row.lastUpdateDate.getTime() >= hookDateRange.from.getTime() &&
          row.lastUpdateDate.getTime() <= hookDateRange.to.getTime());

      return matchChip && matchProvider && matchSearch && matchDate;
    });
  }, [hookChips, hookProvider, hookSearch, hookDateRange]);

  const filteredLogs = useMemo(() => {
    const active = logChips.filter((c) => c.active).map((c) => c.id);
    const q = logSearch.trim().toLowerCase();

    return deliveryLogs.filter((row) => {
      const matchChip =
        active.length === 0 ||
        active.some((chip) => {
          if (chip === "success") return row.status === "Success";
          if (chip === "retry") return row.status === "Retry";
          if (chip === "failed") return row.status === "Failed";
          return true;
        });

      const matchSearch =
        q.length === 0 ||
        row.payload.toLowerCase().includes(q) ||
        row.provider.toLowerCase().includes(q) ||
        row.event.toLowerCase().includes(q);

      const matchDate =
        !logDateRange.from ||
        !logDateRange.to ||
        (row.timestampDate.getTime() >= logDateRange.from.getTime() &&
          row.timestampDate.getTime() <= logDateRange.to.getTime());

      return matchChip && matchSearch && matchDate;
    });
  }, [logChips, logSearch, logDateRange]);

  const isLoading = false;
  const isEmptyKeys = filteredKeys.length === 0 && !isLoading;
  const isEmptyHooks = filteredHooks.length === 0 && !isLoading;
  const isEmptyLogs = filteredLogs.length === 0 && !isLoading;

  const failedDeliveries = filteredHooks.filter((hook) => hook.status === "Error");
  const highLatencyProviders = filteredHooks.filter((hook) => {
    const num = parseFloat(hook.latency.replace("ms", ""));
    return Number.isFinite(num) && num > 300;
  });

  const handleKeyClear = () => {
    setKeyChips((prev) => prev.map((c) => ({ ...c, active: false })));
    setKeyOwner("All");
    setKeyEnv("All");
    setKeySearch("");
    setKeyDateRange({ from: null, to: null });
  };

  const handleHookClear = () => {
    setHookChips((prev) => prev.map((c) => ({ ...c, active: false })));
    setHookProvider("All");
    setHookSearch("");
    setHookDateRange({ from: null, to: null });
  };

  const handleLogClear = () => {
    setLogChips((prev) => prev.map((c) => ({ ...c, active: false })));
    setLogSearch("");
    setLogDateRange({ from: null, to: null });
  };

  return (
    <div className="space-y-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
        Dashboard / Admin / Developers
      </p>

      <PageHeader
        title="Developers – API Keys & Webhooks"
        subtitle="Manage keys, environments, webhooks and delivery logs for CREALEPH."
        actions={
          <>
            <GhostButton
              onClick={() => {
                publishEvent({ type: "bridge.integration.event", source: "developers", payload: { action: "generate_key" } });
              }}
            >
              Generate Key
            </GhostButton>
            <GhostButton
              onClick={() => {
                publishEvent({ type: "bridge.integration.event", source: "developers", payload: { action: "rotate_key" } });
              }}
            >
              Rotate Key
            </GhostButton>
            <GhostButton
              onClick={() => {
                publishEvent({ type: "bridge.integration.event", source: "developers", payload: { action: "test_webhook" } });
              }}
            >
              Test Webhook
            </GhostButton>
            <GhostButton
              onClick={() => {
                publishEvent({ type: "custom", source: "developers", payload: { action: "open_docs" } });
              }}
            >
              View Docs
            </GhostButton>
          </>
        }
      />

      <DashboardCard>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-[var(--ink)]">AI Signal</p>
            <p className="text-sm text-[var(--muted)]">
              AI detected failing webhooks in Sandbox and rising latency for Meta Ads. Review retries and rotate stale keys.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <GhostButton
              onClick={() => {
                publishEvent({ type: "insight.created", source: "developers", payload: { action: "review_failure_pattern" } });
              }}
            >
              Review failure pattern
            </GhostButton>
            <GhostButton
              onClick={() => {
                publishEvent({ type: "report.generated", source: "developers", payload: { action: "open_logs_report" } });
              }}
            >
              Open logs report
            </GhostButton>
            <GhostButton
              onClick={() => {
                publishEvent({ type: "bridge.integration.event", source: "developers", payload: { action: "open_playbook" } });
              }}
            >
              Apply fix in Builder
            </GhostButton>
          </div>
        </div>
      </DashboardCard>

      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}
      >
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-[96px]" />
            ))
          : kpis.map((kpi) => (
              <KPICard key={kpi.label} label={kpi.label} value={kpi.value} delta={kpi.delta} tone={kpi.tone} />
            ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Webhook Latency (last 30 days)">
          {isLoading ? (
            <Skeleton className="h-[160px] w-full" />
          ) : (
            <Skeleton className="h-[160px] w-full rounded-[var(--radius-sm)]" />
          )}
        </ChartCard>
        <ChartCard title="Delivery Failures by Provider">
          {isLoading ? (
            <Skeleton className="h-[160px] w-full" />
          ) : (
            <Skeleton className="h-[160px] w-full rounded-[var(--radius-sm)]" />
          )}
        </ChartCard>
      </div>

      <SectionHeader
        title="API Keys"
        description="Env, owner, permissions and rotation history."
        actions={
          <GhostButton
            onClick={() => {
              publishEvent({ type: "bridge.integration.event", source: "developers", payload: { action: "generate_key" } });
            }}
          >
            Generate Key
          </GhostButton>
        }
      />

      <FilterBar
        chips={keyChips}
        onChipToggle={(id) =>
          setKeyChips((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)))
        }
        showSearch
        searchPlaceholder="Search by key or owner"
        showDateRange
        onDateChange={setKeyDateRange}
        selects={[
          { id: "owner", label: "Owner", value: keyOwner, options: ["All", "Alice", "Bruno", "Carla", "David"], onChange: setKeyOwner },
          { id: "env", label: "Env", value: keyEnv, options: ["All", "Production", "Sandbox"], onChange: setKeyEnv },
        ]}
        extra={
          <GhostButton
            onClick={() => {
              publishEvent({ type: "bridge.integration.event", source: "developers", payload: { action: "add_key" } });
            }}
          >
            Add Key
          </GhostButton>
        }
        onClear={handleKeyClear}
      />

      {isLoading ? (
        <Skeleton className="h-[260px] w-full rounded-[var(--radius-md)]" />
      ) : isEmptyKeys ? (
        <EmptyState
          title="No keys found"
          description="Adjust filters or create a new key."
          action={
            <GhostButton
              onClick={() => {
                publishEvent({ type: "bridge.integration.event", source: "developers", payload: { action: "add_key" } });
              }}
            >
              Create key
            </GhostButton>
          }
        />
      ) : (
        <DataTable
          columns={apiColumns}
          rows={filteredKeys.map((row, index) => ({
            ...row,
            env: (
              <span
                className="rounded-full px-2 py-1 text-xs font-semibold"
                style={{ backgroundColor: "var(--surface-muted)", color: envBadgeColor(row.env) }}
              >
                {row.env}
              </span>
            ),
            actions: (
              <div className="flex flex-wrap items-center justify-end gap-2">
                <GhostButton
                  aria-label="Copy"
                  onClick={() => {
                    publishEvent({ type: "bridge.integration.event", source: "developers", payload: { action: "copy_key", row } });
                  }}
                >
                  Copy
                </GhostButton>
                <GhostButton
                  aria-label="Rotate"
                  onClick={() => {
                    publishEvent({ type: "bridge.integration.event", source: "developers", payload: { action: "rotate_key", row } });
                  }}
                >
                  Rotate
                </GhostButton>
                <GhostButton
                  aria-label="Disable"
                  onClick={() => {
                    publishEvent({ type: "bridge.integration.event", source: "developers", payload: { action: "disable_key", row } });
                  }}
                >
                  Disable
                </GhostButton>
                <GhostButton
                  aria-label="Delete"
                  onClick={() => {
                    publishEvent({ type: "bridge.integration.event", source: "developers", payload: { action: "delete_key", row } });
                  }}
                >
                  Delete
                </GhostButton>
              </div>
            ),
            key: `${row.keyName}-${index}`,
          }))}
        />
      )}

      <Divider />

      <SectionHeader
        title="Active Webhooks"
        description="Endpoints, status, latency and last delivery."
        actions={
          <GhostButton
            onClick={() => {
              publishEvent({ type: "bridge.integration.event", source: "developers", payload: { action: "test_webhook" } });
            }}
          >
            Test Webhook
          </GhostButton>
        }
      />

      <FilterBar
        chips={hookChips}
        onChipToggle={(id) =>
          setHookChips((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)))
        }
        showSearch
        searchPlaceholder="Search endpoint or provider"
        showDateRange
        onDateChange={setHookDateRange}
        selects={[
          { id: "provider", label: "Provider", value: hookProvider, options: ["All", "Stripe", "Meta Ads", "Google Ads", "CREALEPH Internal"], onChange: setHookProvider },
        ]}
        extra={
          <GhostButton
            onClick={() => {
              publishEvent({ type: "bridge.integration.event", source: "developers", payload: { action: "add_webhook" } });
            }}
          >
            Add Webhook
          </GhostButton>
        }
        onClear={handleHookClear}
      />

      {isLoading ? (
        <Skeleton className="h-[260px] w-full rounded-[var(--radius-md)]" />
      ) : isEmptyHooks ? (
        <EmptyState
          title="No webhook activity"
          description="No endpoints match the current filters."
          action={
            <GhostButton
              onClick={() => {
                publishEvent({ type: "bridge.integration.event", source: "developers", payload: { action: "add_webhook" } });
              }}
            >
              Add Webhook
            </GhostButton>
          }
        />
      ) : (
        <DataTable
          columns={webhookColumns}
          rows={filteredHooks.map((row, index) => ({
            ...row,
            status: (
              <span
                className="rounded-full px-2 py-1 text-xs font-semibold"
                style={{ backgroundColor: "var(--surface-muted)", color: webhookStatusColor(row.status) }}
              >
                {row.status}
              </span>
            ),
            actions: (
              <div className="flex flex-wrap items-center justify-end gap-2">
                <GhostButton
                  aria-label="Test"
                  onClick={() => {
                    publishEvent({ type: "bridge.integration.event", source: "developers", payload: { action: "test_webhook", row } });
                  }}
                >
                  Test
                </GhostButton>
                <GhostButton
                  aria-label="View Logs"
                  onClick={() => {
                    publishEvent({ type: "report.generated", source: "developers", payload: { action: "open_webhook_logs", row } });
                  }}
                >
                  View Logs
                </GhostButton>
                <GhostButton
                  aria-label="Disable"
                  onClick={() => {
                    publishEvent({ type: "bridge.integration.event", source: "developers", payload: { action: "disable_webhook", row } });
                  }}
                >
                  Disable
                </GhostButton>
              </div>
            ),
            key: `${row.endpoint}-${index}`,
          }))}
        />
      )}

      <Divider />

      <SectionHeader title="Webhook Delivery Logs" description="Historical deliveries, retries and payloads." />

      <FilterBar
        chips={logChips}
        onChipToggle={(id) =>
          setLogChips((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)))
        }
        showSearch
        searchPlaceholder="Search provider, payload or event"
        showDateRange
        onDateChange={setLogDateRange}
        selects={[]}
        extra={
          <GhostButton
            onClick={() => {
              publishEvent({ type: "custom", source: "developers", payload: { action: "open_logs" } });
            }}
          >
            Open Logs
          </GhostButton>
        }
        onClear={handleLogClear}
      />

      {isLoading ? (
        <Skeleton className="h-[240px] w-full rounded-[var(--radius-md)]" />
      ) : isEmptyLogs ? (
        <EmptyState
          title="No delivery logs found"
          description="Adjust filters or wait for new events."
          action={
            <GhostButton
              onClick={() => {
                publishEvent({ type: "custom", source: "developers", payload: { action: "refresh_logs" } });
              }}
            >
              Refresh
            </GhostButton>
          }
        />
      ) : (
        <DataTable
          columns={logColumns}
          rows={filteredLogs.map((row, index) => ({
            ...row,
            status: (
              <span
                className="rounded-full px-2 py-1 text-xs font-semibold"
                style={{ backgroundColor: "var(--surface-muted)", color: deliveryStatusColor(row.status) }}
              >
                {row.status}
              </span>
            ),
            timestamp: row.timestamp,
            actions: undefined,
            key: `${row.provider}-${row.event}-${index}`,
          }))}
        />
      )}

      <Divider />

      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard>
          <p className="text-sm font-semibold text-[var(--ink)]">Failed Deliveries (last 24h)</p>
          {failedDeliveries.length === 0 ? (
            <EmptyState title="No failed deliveries" description="No failed webhooks in the selected period." />
          ) : (
            <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
              {failedDeliveries.map((item, i) => (
                <li key={`${item.endpoint}-${i}`} className="flex items-center justify-between">
                  <span>{item.provider}</span>
                  <span className="rounded-full bg-[var(--surface-muted)] px-2 py-1 text-xs font-semibold text-[var(--danger)]">
                    {item.lastEvent}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </DashboardCard>

        <DashboardCard>
          <p className="text-sm font-semibold text-[var(--ink)]">High Latency Providers</p>
          {highLatencyProviders.length === 0 ? (
            <EmptyState title="No high latency" description="No providers above latency thresholds." />
          ) : (
            <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
              {highLatencyProviders.map((item, i) => (
                <li key={`${item.endpoint}-${i}`} className="flex items-center justify-between">
                  <span>{item.provider}</span>
                  <span className="rounded-full bg-[var(--surface-muted)] px-2 py-1 text-xs font-semibold text-[var(--warning)]">
                    {item.latency}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </DashboardCard>
      </div>

      <DashboardCard>
        <p className="text-sm font-semibold text-[var(--ink)]">Cross-links CREALEPH</p>
        <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
          <li>Bridge → manage providers and webhook health.</li>
          <li>Reports → integration latency and error dashboards.</li>
          <li>Pipeline → verify if webhook failures impact lead creation.</li>
          <li>InsightScore → generate hypotheses on technical risk and impact.</li>
          <li>Site Builder → test LP webhooks and form submissions.</li>
        </ul>
      </DashboardCard>
    </div>
  );
}
