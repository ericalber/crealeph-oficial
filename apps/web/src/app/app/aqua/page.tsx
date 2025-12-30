"use client";

import { ButtonHTMLAttributes, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
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
import type { ExecutionVisibilityOutput } from "@/lib/contracts/execution-visibility";

type GhostButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { hint?: string };

function GhostButton(props: GhostButtonProps) {
  const { hint, disabled, onClick, className, title, ...rest } = props;
  const resolvedTitle = disabled ? hint : title;
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

type AquaRow = {
  message: string;
  city: "San Francisco" | "San Jose" | "Oakland" | "Los Angeles" | "New York" | "Miami";
  theme: "Promise" | "Objection" | "CTA";
  impact: "High" | "Medium" | "Low";
  status: "Approved" | "Testing" | "New";
  origin: "Scout" | "Pricing" | "Internal";
  aiGenerated: boolean;
  date: string;
  dateValue: Date;
};

const baseRows: AquaRow[] = [
  {
    message: "Save time on every cleaning in the Bay Area.",
    city: "San Francisco",
    theme: "Promise",
    impact: "High",
    status: "Approved",
    origin: "Scout",
    aiGenerated: true,
    date: "2 days ago",
    dateValue: new Date("2025-01-11T10:00:00"),
  },
  {
    message: "No contracts. Cancel anytime, zero hidden fees.",
    city: "San Jose",
    theme: "Objection",
    impact: "High",
    status: "Testing",
    origin: "Internal",
    aiGenerated: true,
    date: "4 days ago",
    dateValue: new Date("2025-01-09T15:30:00"),
  },
  {
    message: "Book your cleaning in 60 seconds.",
    city: "Los Angeles",
    theme: "CTA",
    impact: "Medium",
    status: "Approved",
    origin: "Scout",
    aiGenerated: false,
    date: "1 week ago",
    dateValue: new Date("2025-01-06T09:00:00"),
  },
  {
    message: "Transparent pricing. See your final price before booking.",
    city: "New York",
    theme: "Promise",
    impact: "High",
    status: "New",
    origin: "Pricing",
    aiGenerated: true,
    date: "3 days ago",
    dateValue: new Date("2025-01-10T18:00:00"),
  },
  {
    message: "No stress. Licensed & insured cleaners in your area.",
    city: "Miami",
    theme: "Promise",
    impact: "Medium",
    status: "Testing",
    origin: "Internal",
    aiGenerated: false,
    date: "5 days ago",
    dateValue: new Date("2025-01-08T12:00:00"),
  },
  {
    message: "Click here and get your first cleaning scheduled.",
    city: "Oakland",
    theme: "CTA",
    impact: "Low",
    status: "New",
    origin: "Scout",
    aiGenerated: true,
    date: "1 day ago",
    dateValue: new Date("2025-01-12T11:00:00"),
  },
];

function impactColor(impact: AquaRow["impact"]) {
  if (impact === "High") return "var(--danger)";
  if (impact === "Medium") return "var(--warning)";
  return "var(--muted)";
}

function statusColor(status: AquaRow["status"]) {
  if (status === "Approved") return "var(--success)";
  if (status === "Testing") return "var(--info)";
  return "var(--brand)";
}

export default function AquaInsightsPage() {
  const searchParams = useSearchParams();
  const robotId = searchParams.get("robotId") ?? "";
  const missingRobotId = robotId.length === 0;
  const [chips, setChips] = useState<FilterChip[]>([
    { id: "highImpact", label: "High Impact", active: false },
    { id: "aiGenerated", label: "AI Generated", active: false },
    { id: "testing", label: "Testing", active: false },
  ]);
  const [city, setCity] = useState("All");
  const [theme, setTheme] = useState("All");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null,
  });
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

  type AquaActionKey = ExecutionVisibilityOutput["nextActions"][number]["action"];
  type AquaGateKey = ExecutionVisibilityOutput["gates"][number]["gateType"];
  type AquaModuleKey = keyof ExecutionVisibilityOutput["lastExecutionByModule"];

  const visibilityStatusMessage = missingRobotId
    ? "Select a robot to view execution state"
    : isLoadingVisibility
      ? "Loading execution state..."
      : "Execution state unavailable";

  const resolveAquaActionHint = (actionKey: AquaActionKey) => {
    if (missingRobotId || isLoadingVisibility || visibilityUnavailable || !visibility) {
      return { enabled: false, message: visibilityStatusMessage };
    }

    const recommendation = visibility.nextActions.find((item) => item.action === actionKey);
    if (recommendation) {
      return { enabled: true, message: recommendation.rationale };
    }

    const mapping: Record<AquaActionKey, { module: AquaModuleKey; gate?: AquaGateKey }> = {
      "robots.run": { module: "robots", gate: "robots_run_gate" },
      "competitors.run_insights": { module: "competitors" },
      "fusion.run": { module: "fusion", gate: "fusion_gate" },
      "ideator.run": { module: "ideator", gate: "ideator_gate" },
      "copywriter.run": { module: "copywriter", gate: "copywriter_gate" },
      "market_twin.run": { module: "market_twin", gate: "market_twin_gate" },
      "playbooks.v1.run": { module: "playbooks_v1", gate: "playbooks_v1_gate" },
      "playbooks.v2.run": { module: "playbooks_v2", gate: "playbooks_v2_gate" },
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

    if (actionKey === "builder.run") {
      if (visibility.builderReadiness?.blockedReason) {
        return { enabled: false, message: `Blocked: ${visibility.builderReadiness.blockedReason}` };
      }
      if (visibility.builderReadiness?.requiredMissing?.length) {
        return {
          enabled: false,
          message: `Missing required artifact: ${visibility.builderReadiness.requiredMissing.join(", ")}`,
        };
      }
    }

    return { enabled: false, message: "Not recommended right now" };
  };

  const createInsightHint = resolveAquaActionHint("ideator.run");
  const builderHint = resolveAquaActionHint("builder.run");

  const insightScoreRecommendation =
    visibility?.nextActions.find((item) => item.action === "ideator.run" || item.action === "copywriter.run") ?? null;
  const insightScoreHint =
    missingRobotId || isLoadingVisibility || visibilityUnavailable || !visibility
      ? { enabled: false, message: visibilityStatusMessage }
      : insightScoreRecommendation
        ? { enabled: true, message: insightScoreRecommendation.rationale }
        : { enabled: false, message: "InsightScore is UI-only in this build" };

  const paidRecommendation = visibility?.nextActions.find((item) =>
    item.action === "builder.run" || item.action === "playbooks.v1.run" || item.action === "playbooks.v2.run");
  const paidHint =
    missingRobotId || isLoadingVisibility || visibilityUnavailable || !visibility
      ? { enabled: false, message: visibilityStatusMessage }
      : paidRecommendation
        ? { enabled: true, message: `Paid execution is not enabled. ${paidRecommendation.rationale}` }
        : { enabled: false, message: "Paid execution is not enabled. Not recommended right now" };

  const cmsHint =
    missingRobotId || isLoadingVisibility || visibilityUnavailable || !visibility
      ? { enabled: false, message: visibilityStatusMessage }
      : paidRecommendation
        ? { enabled: true, message: `CMS connector is not enabled. ${paidRecommendation.rationale}` }
        : { enabled: false, message: "CMS connector is not enabled. Not recommended right now" };

  const kpis = [
    { label: "Active Messages", value: "34", delta: "+6%", tone: "positive" as const },
    { label: "High Impact", value: "9", delta: "+2", tone: "positive" as const },
    { label: "AI-Generated", value: "4", delta: "+1", tone: "neutral" as const },
    { label: "Cities Covered", value: "6", delta: "+2", tone: "positive" as const },
    { label: "Testing Variants", value: "7", delta: "+3", tone: "negative" as const },
  ];

  const columns = [
    { key: "message", label: "Message" },
    { key: "city", label: "City" },
    { key: "theme", label: "Theme" },
    { key: "impact", label: "Impact" },
    { key: "status", label: "Status" },
    { key: "origin", label: "Origin" },
    { key: "date", label: "Date" },
    { key: "actions", label: "Actions", align: "right" as const },
  ];

  const filteredRows = useMemo(() => {
    const activeChips = chips.filter((c) => c.active).map((c) => c.id);
    const q = search.trim().toLowerCase();

    return baseRows.filter((row) => {
      const matchHighImpact = activeChips.includes("highImpact") ? row.impact === "High" : true;
      const matchAIGenerated = activeChips.includes("aiGenerated") ? row.aiGenerated : true;
      const matchTesting = activeChips.includes("testing") ? row.status === "Testing" : true;

      const matchCity = city === "All" || row.city === city;
      const matchTheme = theme === "All" || row.theme === theme;

      const matchSearch =
        q.length === 0 ||
        row.message.toLowerCase().includes(q) ||
        row.city.toLowerCase().includes(q) ||
        row.theme.toLowerCase().includes(q) ||
        row.origin.toLowerCase().includes(q);

      const matchDate =
        !dateRange.from ||
        !dateRange.to ||
        (row.dateValue.getTime() >= dateRange.from.getTime() &&
          row.dateValue.getTime() <= dateRange.to.getTime());

      return matchHighImpact && matchAIGenerated && matchTesting && matchCity && matchTheme && matchSearch && matchDate;
    });
  }, [chips, city, theme, search, dateRange]);

  const isLoading = false;
  const isEmpty = filteredRows.length === 0 && !isLoading;

  const handleClear = () => {
    setChips((prev) => prev.map((c) => ({ ...c, active: false })));
    setCity("All");
    setTheme("All");
    setSearch("");
    setDateRange({ from: null, to: null });
  };

  const recentFromScout = filteredRows.filter((row) => row.origin === "Scout").slice(0, 3);
  const fromPricing = filteredRows.filter((row) => row.origin === "Pricing").slice(0, 3);

  return (
    <div className="space-y-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">Dashboard / Intelligence / AQUA</p>

      <PageHeader
        title="AQUA Insights"
        subtitle="Language insights by city, theme and impact — ready to turn into pages, campaigns and experiments."
        actions={
          <div className="flex flex-wrap gap-3">
            <div className="flex flex-col items-start gap-1">
              <GhostButton
                disabled={!createInsightHint.enabled}
                hint={createInsightHint.message}
                onClick={() =>
                  {
                    recordUiIntent();
                    eventBus.emit("insight.created", {
                      source: "AQUA",
                      pattern: "high_impact_cluster",
                      modules: ["Scout", "Pricing"],
                    });
                  }
                }
              >
                Create Insight
              </GhostButton>
              <span className="text-xs text-[var(--muted)]">{createInsightHint.message}</span>
            </div>
            <div className="flex flex-col items-start gap-1">
              <GhostButton
                disabled={!cmsHint.enabled}
                hint={cmsHint.message}
                onClick={() =>
                  {
                    recordUiIntent();
                    eventBus.emit("report.generated", {
                      source: "AQUA",
                      action: "export_to_cms",
                    });
                  }
                }
              >
                Export to CMS
              </GhostButton>
              <span className="text-xs text-[var(--muted)]">{cmsHint.message}</span>
            </div>
            <div className="flex flex-col items-start gap-1">
              <GhostButton
                disabled={!builderHint.enabled}
                hint={builderHint.message}
                onClick={() =>
                  {
                    recordUiIntent();
                    eventBus.emit("builder.page.published", {
                      source: "AQUA",
                      action: "apply_copy_to_builder",
                    });
                  }
                }
              >
                Apply to Builder
              </GhostButton>
              <span className="text-xs text-[var(--muted)]">{builderHint.message}</span>
            </div>
          </div>
        }
      />

      {(missingRobotId || isLoadingVisibility || visibilityUnavailable || !visibility) && (
        <p className="text-xs font-medium text-[var(--muted)]">{visibilityStatusMessage}</p>
      )}
      {uiIntentMessage && <p className="text-xs font-medium text-[var(--muted)]">{uiIntentMessage}</p>}

      <DashboardCard>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-[var(--ink)]">AI Signal</p>
            <p className="text-sm text-[var(--muted)]">
              AI detected clusters of high-impact messages in SF and NY from Scout and Pricing. Consider pushing to Builder, Paid and InsightScore.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              <GhostButton
                disabled={!insightScoreHint.enabled}
                hint={insightScoreHint.message}
                onClick={() =>
                  {
                    recordUiIntent();
                    eventBus.emit("insight.created", {
                      source: "AQUA",
                      type: "high_impact_cluster",
                      origins: ["Scout", "Pricing"],
                    });
                  }
                }
              >
                Send to InsightScore
              </GhostButton>
              <GhostButton
                disabled={!builderHint.enabled}
                hint={builderHint.message}
                onClick={() =>
                  {
                    recordUiIntent();
                    eventBus.emit("builder.template.used", {
                      source: "AQUA",
                      action: "apply_ai_copy",
                    });
                  }
                }
              >
                Apply AQUA Copy in Builder
              </GhostButton>
              <GhostButton
                disabled={!paidHint.enabled}
                hint={paidHint.message}
                onClick={() =>
                  {
                    recordUiIntent();
                    eventBus.emit("custom", {
                      source: "AQUA",
                      action: "test_headlines_in_paid",
                    });
                  }
                }
              >
                Test in Paid
              </GhostButton>
            </div>
            <div className="text-xs text-[var(--muted)]">
              <span>Send to InsightScore: {insightScoreHint.message}</span>
              <span className="mx-2">•</span>
              <span>Apply AQUA Copy in Builder: {builderHint.message}</span>
              <span className="mx-2">•</span>
              <span>Test in Paid: {paidHint.message}</span>
            </div>
          </div>
        </div>
      </DashboardCard>

      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-[96px]" />)
          : kpis.map((kpi) => <KPICard key={kpi.label} label={kpi.label} value={kpi.value} delta={kpi.delta} tone={kpi.tone} />)}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Impact vs Volume (last 30 days)">
          {isLoading ? <Skeleton className="h-[160px] w-full" /> : <Skeleton className="h-[160px] w-full rounded-[var(--radius-sm)]" />}
        </ChartCard>
        <ChartCard title="Themes by City">
          {isLoading ? <Skeleton className="h-[160px] w-full" /> : <Skeleton className="h-[160px] w-full rounded-[var(--radius-sm)]" />}
        </ChartCard>
      </div>

      <SectionHeader title="Messages by City" description="Impact, approval and themes extracted by AQUA." />

      <FilterBar
        chips={chips}
        onChipToggle={(id) => setChips((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)))}
        showSearch
        searchPlaceholder="Search by message, city, theme or origin"
        showDateRange
        onDateChange={setDateRange}
        selects={[
          {
            id: "city",
            label: "City",
            value: city,
            options: ["All", "San Francisco", "San Jose", "Oakland", "Los Angeles", "New York", "Miami"],
            onChange: setCity,
          },
          {
            id: "theme",
            label: "Theme",
            value: theme,
            options: ["All", "Promise", "Objection", "CTA"],
            onChange: setTheme,
          },
        ]}
        extra={
          <div className="flex flex-col items-start gap-1">
            <GhostButton
              disabled={!createInsightHint.enabled}
              hint={createInsightHint.message}
              onClick={() =>
                {
                  recordUiIntent();
                  eventBus.emit("insight.created", {
                    source: "AQUA",
                    action: "create_from_filter",
                  });
                }
              }
            >
              Create Insight
            </GhostButton>
            <span className="text-xs text-[var(--muted)]">{createInsightHint.message}</span>
          </div>
        }
        onClear={handleClear}
      />

      {isLoading ? (
        <Skeleton className="h-[260px] w-full rounded-[var(--radius-md)]" />
      ) : isEmpty ? (
        <EmptyState
          title="No messages found"
          description="Adjust filters or add new data sources."
          action={
            <div className="flex flex-col items-start gap-1">
              <GhostButton
                disabled={!createInsightHint.enabled}
                hint={createInsightHint.message}
                onClick={() =>
                  {
                    recordUiIntent();
                    eventBus.emit("aqua.message.created", {
                      source: "AQUA",
                      action: "empty_state_create",
                    });
                  }
                }
              >
                Create Insight
              </GhostButton>
              <span className="text-xs text-[var(--muted)]">{createInsightHint.message}</span>
            </div>
          }
        />
      ) : (
        <DataTable
          columns={columns}
          rows={filteredRows.map((row, index) => ({
            ...row,
            impact: (
              <span
                className="rounded-full px-2 py-1 text-xs font-semibold"
                style={{ backgroundColor: "var(--surface-muted)", color: impactColor(row.impact) }}
              >
                {row.impact}
              </span>
            ),
            status: (
              <span
                className="rounded-full px-2 py-1 text-xs font-semibold"
                style={{ backgroundColor: "var(--surface-muted)", color: statusColor(row.status) }}
              >
                {row.status}
              </span>
            ),
            actions: (
              <div className="flex flex-col items-end gap-1">
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <GhostButton
                    aria-label="Create Insight"
                    disabled={!createInsightHint.enabled}
                    hint={createInsightHint.message}
                    onClick={() =>
                      {
                        recordUiIntent();
                        eventBus.emit("insight.created", {
                          source: "AQUA",
                          origin: row.origin,
                          city: row.city,
                          theme: row.theme,
                          impact: row.impact,
                          message: row.message,
                        });
                      }
                    }
                  >
                    Create Insight
                  </GhostButton>
                  <GhostButton
                    aria-label="Apply in Builder"
                    disabled={!builderHint.enabled}
                    hint={builderHint.message}
                    onClick={() =>
                      {
                        recordUiIntent();
                        eventBus.emit("aqua.message.applied", {
                          source: "AQUA",
                          city: row.city,
                          message: row.message,
                        });
                      }
                    }
                  >
                    Apply in Builder
                  </GhostButton>
                  <GhostButton
                    aria-label="Test in Paid"
                    disabled={!paidHint.enabled}
                    hint={paidHint.message}
                    onClick={() =>
                      {
                        recordUiIntent();
                        eventBus.emit("custom", {
                          source: "AQUA",
                          action: "test_in_paid",
                          message: row.message,
                          city: row.city,
                        });
                      }
                    }
                  >
                    Test in Paid
                  </GhostButton>
                </div>
                <div className="text-[10px] text-[var(--muted)] text-right">
                  <span>Create Insight: {createInsightHint.message}</span>
                  <span className="mx-2">•</span>
                  <span>Apply in Builder: {builderHint.message}</span>
                  <span className="mx-2">•</span>
                  <span>Test in Paid: {paidHint.message}</span>
                </div>
              </div>
            ),
            key: `${row.message}-${index}`,
          }))}
        />
      )}

      <Divider />

      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard>
          <p className="text-sm font-semibold text-[var(--ink)]">Recent from Scout</p>
          <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
            {recentFromScout.map((item, i) => (
              <li key={i}>{item.message}</li>
            ))}
          </ul>
        </DashboardCard>

        <DashboardCard>
          <p className="text-sm font-semibold text-[var(--ink)]">From Pricing</p>
          <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
            {fromPricing.map((item, i) => (
              <li key={i}>{item.message}</li>
            ))}
          </ul>
        </DashboardCard>
      </div>

      <DashboardCard>
        <p className="text-sm font-semibold text-[var(--ink)]">Cross-links CREALEPH</p>
        <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
          <li
            onClick={() =>
              eventBus.emit("insight.created", {
                source: "AQUA",
                target: "InsightScore",
              })
            }
          >
            InsightScore → priorização de hipóteses
          </li>
          <li
            onClick={() =>
              eventBus.emit("builder.template.used", {
                source: "AQUA",
                target: "Builder",
              })
            }
          >
            Builder → criação de LPs com cópia gerada pelo AQUA
          </li>
          <li
            onClick={() =>
              eventBus.emit("scout.alert.created", {
                source: "AQUA",
                target: "Scout",
              })
            }
          >
            Scout → mensagens originadas de movimentos competitivos
          </li>
          <li
            onClick={() =>
              eventBus.emit("pricing.region.updated", {
                source: "AQUA",
                target: "Pricing",
              })
            }
          >
            Pricing → insights de valor percebido por região
          </li>
        </ul>
      </DashboardCard>
    </div>
  );
}
