"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
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
import type { ExecutionVisibilityOutput } from "@/lib/contracts/execution-visibility";

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

type GhostButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { hint?: string };

function GhostButton(props: GhostButtonProps) {
  const { hint, disabled, onClick, className, title, ...rest } = props;
  const resolvedTitle = hint ?? title;
  const resolvedClick = disabled ? undefined : onClick;

  return (
    <button
      {...rest}
      title={resolvedTitle}
      disabled={disabled}
      onClick={resolvedClick}
      className={`inline-flex h-9 items-center justify-center rounded-[var(--radius-sm)] border px-3 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)] ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className ?? ""}`}
      style={{ borderColor: "var(--line)" }}
    />
  );
}

export default function ParasitePage() {
  const searchParams = useSearchParams();
  const robotId = searchParams.get("robotId") ?? "";
  const missingRobotId = robotId.length === 0;
  const [visibility, setVisibility] = useState<ExecutionVisibilityOutput | null>(null);
  const [isLoadingVisibility, setIsLoadingVisibility] = useState(false);
  const [visibilityUnavailable, setVisibilityUnavailable] = useState(false);
  const [uiIntentMessage, setUiIntentMessage] = useState<string | null>(null);
  const DEBUG_UI_INTENT_LOG = false;
  const UI_INTENT_MESSAGE = "UI intent recorded — no execution in this build";

  const recordUiIntent = () => {
    if (DEBUG_UI_INTENT_LOG) {
      console.info(UI_INTENT_MESSAGE);
    }
    setUiIntentMessage(UI_INTENT_MESSAGE);
  };

  useEffect(() => {
    if (missingRobotId) {
      setVisibility(null);
      setVisibilityUnavailable(false);
      setIsLoadingVisibility(false);
      setUiIntentMessage(null);
      return;
    }

    let active = true;
    setIsLoadingVisibility(true);
    setVisibilityUnavailable(false);

    fetch(`/api/robots/${encodeURIComponent(robotId)}/visibility`)
      .then(async (response) => {
        if (!response.ok) throw new Error("visibility");
        const data = (await response.json()) as ExecutionVisibilityOutput;
        if (!data?.ok) throw new Error("visibility");
        if (active) {
          setVisibility(data);
          setVisibilityUnavailable(false);
        }
      })
      .catch(() => {
        if (active) {
          setVisibility(null);
          setVisibilityUnavailable(true);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoadingVisibility(false);
        }
      });

    return () => {
      active = false;
    };
  }, [missingRobotId, robotId]);

  type ParasiteActionKey = "robots.run" | "builder.run";
  type ParasiteGateKey = ExecutionVisibilityOutput["gates"][number]["gateType"];
  type ParasiteModuleKey = keyof ExecutionVisibilityOutput["lastExecutionByModule"];

  const visibilityStatusMessage = missingRobotId
    ? "Select a robot to view execution state"
    : isLoadingVisibility
      ? "Loading execution state..."
      : "Execution state unavailable";

  const resolveParasiteActionHint = (actionKey: ParasiteActionKey) => {
    if (missingRobotId || isLoadingVisibility || visibilityUnavailable || !visibility) {
      return { enabled: false, message: visibilityStatusMessage };
    }

    const recommendation = visibility.nextActions.find((item) => item.action === actionKey);
    if (recommendation) {
      return { enabled: true, message: recommendation.rationale };
    }

    const mapping: Record<ParasiteActionKey, { module: ParasiteModuleKey; gate?: ParasiteGateKey }> = {
      "robots.run": { module: "robots", gate: "robots_run_gate" },
      "builder.run": { module: "builder" },
    };

    const { module, gate } = mapping[actionKey];
    if (gate) {
      const gateEntry = visibility.gates.find((entry) => entry.gateType === gate);
      if (gateEntry) {
        return { enabled: false, message: `Blocked by Policy: ${gateEntry.message}` };
      }
    }

    const last = visibility.lastExecutionByModule[module];
    if (last?.status === "failed") {
      return { enabled: true, message: `Last run failed: ${last.lastReason ?? "unknown"}` };
    }
    if (last?.status === "cancelled") {
      return { enabled: true, message: `Last run cancelled: ${last.lastReason ?? "unknown"}` };
    }

    return { enabled: false, message: "Not recommended right now" };
  };

  const robotsHint = resolveParasiteActionHint("robots.run");
  const builderHint = resolveParasiteActionHint("builder.run");
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
      <div className="flex flex-col items-end gap-1">
        <div className="flex flex-wrap items-center justify-end gap-2">
          <GhostButton
            disabled={!robotsHint.enabled}
            hint={robotsHint.message}
            onClick={() => {
              recordUiIntent();
              eventBus.emit("parasite.scan.requested", { botId: bot.id, niche: bot.niche, region: bot.region, modes: bot.modes });
            }}
          >
            Run Scan
          </GhostButton>
          <GhostButton
            disabled={!robotsHint.enabled}
            hint={robotsHint.message}
            onClick={() => {
              recordUiIntent();
              eventBus.emit("parasite.signal.created", { botId: bot.id, region: bot.region, type: "manual_trigger" });
            }}
          >
            Create Signal
          </GhostButton>
          <GhostButton
            disabled={!builderHint.enabled}
            hint={builderHint.message}
            onClick={async () => {
              recordUiIntent();
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
        <div className="text-[10px] text-[var(--muted)] text-right">
          <span>Run Scan: {robotsHint.message}</span>
          <span className="mx-2">•</span>
          <span>Create Signal: {robotsHint.message}</span>
          <span className="mx-2">•</span>
          <span>Apply to Builder: {builderHint.message}</span>
        </div>
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
          <div className="flex flex-col items-start gap-1">
            <GhostButton
              disabled={!robotsHint.enabled}
              hint={robotsHint.message}
              onClick={() => {
                recordUiIntent();
                eventBus.emit("parasite.scan.requested", { botId: bots[0]?.id ?? "new-scan", region: bots[0]?.region ?? "San Francisco" });
              }}
            >
              New Scan Now
            </GhostButton>
            <span className="text-xs text-[var(--muted)]">{robotsHint.message}</span>
            <Link href="/app/parasite/create" className="inline-flex h-9 items-center justify-center rounded-[var(--radius-sm)] border px-3 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--surface-muted)]">
              Create New Bot
            </Link>
          </div>
        }
      />

      {(missingRobotId || isLoadingVisibility || visibilityUnavailable || !visibility) && (
        <p className="text-xs font-medium text-[var(--muted)]">{visibilityStatusMessage}</p>
      )}
      {uiIntentMessage && <p className="text-xs font-medium text-[var(--muted)]">{uiIntentMessage}</p>}

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
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap gap-2">
                <GhostButton
                  disabled={!builderHint.enabled}
                  hint={builderHint.message}
                  onClick={() => {
                    recordUiIntent();
                    eventBus.emit("builder.template.used", { source: "PARASITE", signalId: signal.id, region: signal.region });
                  }}
                >
                  Apply (Builder)
                </GhostButton>
                <GhostButton
                  disabled={!builderHint.enabled}
                  hint={builderHint.message}
                  onClick={() => {
                    recordUiIntent();
                    eventBus.emit("insight.created", { source: "PARASITE", signalId: signal.id, type: "copy_improvement" });
                  }}
                >
                  Improve (Copy)
                </GhostButton>
                <GhostButton
                  disabled={!robotsHint.enabled}
                  hint={robotsHint.message}
                  onClick={() => {
                    recordUiIntent();
                    eventBus.emit("markettwin.region.updated", { source: "PARASITE", region: signal.region });
                  }}
                >
                  Benchmark
                </GhostButton>
                <GhostButton
                  disabled={!robotsHint.enabled}
                  hint={robotsHint.message}
                  onClick={() => {
                    recordUiIntent();
                    eventBus.emit("insight.created", { source: "PARASITE", origin: "signal", signalId: signal.id });
                  }}
                >
                  Details
                </GhostButton>
              </div>
              <div className="text-[10px] text-[var(--muted)]">
                <span>Apply (Builder): {builderHint.message}</span>
                <span className="mx-2">•</span>
                <span>Improve (Copy): {builderHint.message}</span>
                <span className="mx-2">•</span>
                <span>Benchmark: {robotsHint.message}</span>
                <span className="mx-2">•</span>
                <span>Details: {robotsHint.message}</span>
              </div>
            </div>
          </DashboardCard>
        ))}
      </div>

      <Divider />

      <DashboardCard>
        <p className="text-sm font-semibold text-[var(--ink)]">Cross-links CREALEPH</p>
        <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
          <li
            className={`flex flex-col gap-1 ${robotsHint.enabled ? "" : "opacity-50 cursor-not-allowed"}`}
            title={robotsHint.message}
            onClick={
              robotsHint.enabled
                ? () => {
                    recordUiIntent();
                    eventBus.emit("scout.alert.created", { source: "PARASITE", action: "forward_to_scout" });
                  }
                : undefined
            }
          >
            <span>Scout → forward signals for continuous watch</span>
            <span className="text-[10px] text-[var(--muted)]">{robotsHint.message}</span>
          </li>
          <li
            className={`flex flex-col gap-1 ${robotsHint.enabled ? "" : "opacity-50 cursor-not-allowed"}`}
            title={robotsHint.message}
            onClick={
              robotsHint.enabled
                ? () => {
                    recordUiIntent();
                    eventBus.emit("pricing.region.updated", { source: "PARASITE", action: "align_pricing_from_signal" });
                  }
                : undefined
            }
          >
            <span>Pricing → adjust price bands from signals</span>
            <span className="text-[10px] text-[var(--muted)]">{robotsHint.message}</span>
          </li>
          <li
            className={`flex flex-col gap-1 ${robotsHint.enabled ? "" : "opacity-50 cursor-not-allowed"}`}
            title={robotsHint.message}
            onClick={
              robotsHint.enabled
                ? () => {
                    recordUiIntent();
                    eventBus.emit("insight.created", { source: "PARASITE", action: "generate_hypothesis" });
                  }
                : undefined
            }
          >
            <span>InsightScore → promote as hypothesis</span>
            <span className="text-[10px] text-[var(--muted)]">{robotsHint.message}</span>
          </li>
          <li
            className={`flex flex-col gap-1 ${builderHint.enabled ? "" : "opacity-50 cursor-not-allowed"}`}
            title={builderHint.message}
            onClick={
              builderHint.enabled
                ? () => {
                    recordUiIntent();
                    eventBus.emit("builder.page.published", { source: "PARASITE", action: "publish_variant" });
                  }
                : undefined
            }
          >
            <span>Builder → publish variant based on signal</span>
            <span className="text-[10px] text-[var(--muted)]">{builderHint.message}</span>
          </li>
          <li
            className={`flex flex-col gap-1 ${robotsHint.enabled ? "" : "opacity-50 cursor-not-allowed"}`}
            title={robotsHint.message}
            onClick={
              robotsHint.enabled
                ? () => {
                    recordUiIntent();
                    eventBus.emit("report.generated", { source: "PARASITE", action: "attach_to_report" });
                  }
                : undefined
            }
          >
            <span>Reports → attach signals to reports</span>
            <span className="text-[10px] text-[var(--muted)]">{robotsHint.message}</span>
          </li>
        </ul>
      </DashboardCard>
    </div>
  );
}
