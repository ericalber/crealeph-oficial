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

type ScoutRow = {
  event: string;
  type: "Price" | "Offer" | "Creative" | "LP";
  competitor: "CleanPro USA" | "UltraClean America" | "PowerWash Co." | "SparkleHome";
  severity: "High" | "Medium" | "Low";
  region: "San Francisco" | "San Jose" | "Oakland" | "Los Angeles" | "New York" | "Miami";
  time: string;
  timeDate: Date;
};

const baseRows: ScoutRow[] = [
  {
    event: "Aggressive discount for first cleaning",
    type: "Price",
    competitor: "CleanPro USA",
    severity: "High",
    region: "San Francisco",
    time: "12min ago",
    timeDate: new Date("2025-01-13T09:10:00"),
  },
  {
    event: "Free deep-clean add-on for annual plan",
    type: "Offer",
    competitor: "UltraClean America",
    severity: "Medium",
    region: "San Jose",
    time: "35min ago",
    timeDate: new Date("2025-01-13T08:47:00"),
  },
  {
    event: "New creative with strong social proof",
    type: "Creative",
    competitor: "PowerWash Co.",
    severity: "Low",
    region: "Los Angeles",
    time: "1h ago",
    timeDate: new Date("2025-01-13T08:05:00"),
  },
  {
    event: "Landing page updated with price calculator",
    type: "LP",
    competitor: "SparkleHome",
    severity: "High",
    region: "New York",
    time: "2h ago",
    timeDate: new Date("2025-01-13T07:15:00"),
  },
  {
    event: "Bundle pricing for recurring visits",
    type: "Price",
    competitor: "UltraClean America",
    severity: "Medium",
    region: "Oakland",
    time: "3h ago",
    timeDate: new Date("2025-01-13T06:20:00"),
  },
  {
    event: "LP headline shift: focus on time-saving",
    type: "LP",
    competitor: "CleanPro USA",
    severity: "Low",
    region: "Miami",
    time: "5h ago",
    timeDate: new Date("2025-01-13T04:30:00"),
  },
];

function severityColors(severity: ScoutRow["severity"]) {
  if (severity === "High") return "var(--danger)";
  if (severity === "Medium") return "var(--warning)";
  return "var(--success)";
}

export default function ScoutPage() {
  const [chips, setChips] = useState<FilterChip[]>([
    { id: "price", label: "Price", active: false },
    { id: "offer", label: "Offer", active: false },
    { id: "creative", label: "Creative", active: false },
    { id: "lp", label: "LP", active: false },
  ]);
  const [competitor, setCompetitor] = useState("All");
  const [region, setRegion] = useState("All");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null,
  });

  const kpis = [
    { label: "Weekly Alerts", value: "41", delta: "+3", tone: "positive" as const },
    { label: "Reaction Time", value: "12min", delta: "-12%", tone: "positive" as const },
    { label: "High Severity", value: "5", delta: undefined, tone: "neutral" as const },
    { label: "Medium Severity", value: "12", delta: undefined, tone: "neutral" as const },
    { label: "Low Severity", value: "21", delta: undefined, tone: "neutral" as const },
  ];

  const columns = [
    { key: "event", label: "Event" },
    { key: "type", label: "Type" },
    { key: "competitor", label: "Competitor" },
    { key: "severity", label: "Severity" },
    { key: "region", label: "Region" },
    { key: "time", label: "Time" },
    { key: "actions", label: "Actions", align: "right" as const },
  ];

  const filteredRows = useMemo(() => {
    const activeChips = chips.filter((c) => c.active).map((c) => c.id);
    const q = search.trim().toLowerCase();

    return baseRows.filter((row) => {
      const matchType =
        activeChips.length === 0 ||
        activeChips.some((chip) => {
          if (chip === "price") return row.type === "Price";
          if (chip === "offer") return row.type === "Offer";
          if (chip === "creative") return row.type === "Creative";
          if (chip === "lp") return row.type === "LP";
          return true;
        });

      const matchCompetitor = competitor === "All" || row.competitor === competitor;
      const matchRegion = region === "All" || row.region === region;

      const matchSearch =
        q.length === 0 ||
        row.event.toLowerCase().includes(q) ||
        row.competitor.toLowerCase().includes(q) ||
        row.type.toLowerCase().includes(q) ||
        row.region.toLowerCase().includes(q);

      const matchDate =
        !dateRange.from ||
        !dateRange.to ||
        (row.timeDate.getTime() >= dateRange.from.getTime() && row.timeDate.getTime() <= dateRange.to.getTime());

      return matchType && matchCompetitor && matchRegion && matchSearch && matchDate;
    });
  }, [chips, competitor, region, search, dateRange]);

  const isLoading = false;
  const isEmpty = filteredRows.length === 0 && !isLoading;

  const handleClear = () => {
    setChips((prev) => prev.map((c) => ({ ...c, active: false })));
    setCompetitor("All");
    setRegion("All");
    setSearch("");
    setDateRange({ from: null, to: null });
  };

  const criticalEvents = filteredRows.filter((row) => row.severity === "High");
  const recentPriceMoves = filteredRows.filter((row) => row.type === "Price").slice(0, 4);

  return (
    <div className="space-y-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
        Dashboard / Market / Scout
      </p>

      <PageHeader
        title="Competitive Feed"
        subtitle="Competitive monitoring — price, offers, creatives and LPs across key US regions."
        actions={
          <>
            <GhostButton
              onClick={() =>
                eventBus.emit("insight.created", {
                  source: "SCOUT",
                  action: "create_from_feed",
                })
              }
            >
              Create Insight
            </GhostButton>
            <GhostButton
              onClick={() =>
                eventBus.emit("pricing.region.updated", {
                  source: "SCOUT",
                  action: "open_pricing_regional",
                })
              }
            >
              Open Pricing
            </GhostButton>
            <GhostButton
              onClick={() =>
                eventBus.emit("custom", {
                  source: "SCOUT",
                  action: "open_paid_from_scout",
                })
              }
            >
              Open Paid
            </GhostButton>
          </>
        }
      />

      <DashboardCard>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-[var(--ink)]">AI Signal</p>
            <p className="text-sm text-[var(--muted)]">
              AI detected price and LP shifts from competitors in San Francisco and New York in the last 24h. Consider
              creating insights, aligning Pricing Regional and testing new LPs in Builder.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <GhostButton
              onClick={() =>
                eventBus.emit("scout.alert.created", {
                  source: "SCOUT",
                  pattern: "price_and_lp_cluster",
                })
              }
            >
              Generate Insight
            </GhostButton>
            <GhostButton
              onClick={() =>
                eventBus.emit("builder.template.used", {
                  source: "SCOUT",
                  pattern: "lp_update_suggestion",
                })
              }
            >
              Suggest LP in Builder
            </GhostButton>
            <GhostButton
              onClick={() =>
                eventBus.emit("markettwin.region.updated", {
                  source: "SCOUT",
                  pattern: "sov_shift",
                })
              }
            >
              View in Market Twin
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
          : kpis.map((kpi) => (
              <KPICard key={kpi.label} label={kpi.label} value={kpi.value} delta={kpi.delta} tone={kpi.tone} />
            ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Alerts per day (last 30 days)" subtitle="Price, offers, creatives and LP">
          {isLoading ? (
            <Skeleton className="h-[160px] w-full" />
          ) : (
            <Skeleton className="h-[160px] w-full rounded-[var(--radius-sm)]" />
          )}
        </ChartCard>
        <ChartCard title="Distribution by Category" subtitle="Price, offer, creative, LP">
          {isLoading ? (
            <Skeleton className="h-[160px] w-full" />
          ) : (
            <Skeleton className="h-[160px] w-full rounded-[var(--radius-sm)]" />
          )}
        </ChartCard>
      </div>

      <SectionHeader
        title="Events Feed"
        description="Recent competitor events grouped by type, severity and region."
        actions={
          <GhostButton
            onClick={() =>
              eventBus.emit("custom", { source: "SCOUT", action: "alerts_config" })
            }
          >
            Manage Alerts
          </GhostButton>
        }
      />

      <FilterBar
        chips={chips}
        onChipToggle={(id) =>
          setChips((prev) =>
            prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
          )
        }
        showSearch
        searchPlaceholder="Search by event, competitor, type or region"
        showDateRange
        onDateChange={setDateRange}
        selects={[
          {
            id: "competitor",
            label: "Competitor",
            value: competitor,
            options: ["All", "CleanPro USA", "UltraClean America", "PowerWash Co.", "SparkleHome"],
            onChange: setCompetitor,
          },
          {
            id: "region",
            label: "Region",
            value: region,
            options: [
              "All",
              "San Francisco",
              "San Jose",
              "Oakland",
              "Los Angeles",
              "New York",
              "Miami",
            ],
            onChange: setRegion,
          },
        ]}
        extra={
          <GhostButton
            onClick={() =>
              eventBus.emit("custom", { source: "SCOUT", action: "alerts_new" })
            }
          >
            Create alert
          </GhostButton>
        }
        onClear={handleClear}
      />

      {isLoading ? (
        <Skeleton className="h-[260px] w-full rounded-[var(--radius-md)]" />
      ) : isEmpty ? (
        <EmptyState
          title="No alerts found"
          description="Adjust filters or add competitors to monitor."
          action={
            <GhostButton
              onClick={() =>
                eventBus.emit("custom", { source: "SCOUT", action: "add_competitor" })
              }
            >
              Add competitor
            </GhostButton>
          }
        />
      ) : (
        <DataTable
          columns={columns}
          rows={filteredRows.map((row, index) => ({
            ...row,
            severity: (
              <span
                className="rounded-full px-2 py-1 text-xs font-semibold"
                style={{
                  backgroundColor: "var(--surface-muted)",
                  color: severityColors(row.severity),
                }}
              >
                {row.severity}
              </span>
            ),
            actions: (
              <div className="flex flex-wrap items-center justify-end gap-2">
                <GhostButton
                  aria-label="Create Insight"
                  onClick={() =>
                    eventBus.emit("insight.created", {
                      source: "SCOUT",
                      payload: row,
                    })
                  }
                >
                  Create Insight
                </GhostButton>
                <GhostButton
                  aria-label="Apply in Builder"
                  onClick={() =>
                    eventBus.emit("builder.template.used", {
                      source: "SCOUT",
                      payload: row,
                    })
                  }
                >
                  Apply in Builder
                </GhostButton>
                <GhostButton
                  aria-label="View Region"
                  onClick={() =>
                    eventBus.emit("markettwin.region.updated", {
                      source: "SCOUT",
                      region: row.region,
                    })
                  }
                >
                  View Region
                </GhostButton>
              </div>
            ),
            key: `${row.competitor}-${row.event}-${index}`,
          }))}
        />
      )}

      <Divider />

      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard>
          <p className="text-sm font-semibold text-[var(--ink)]">Recent high-severity alerts</p>
          {criticalEvents.length === 0 ? (
            <EmptyState title="No critical alerts" description="No high-severity events in the last hours." />
          ) : (
            <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
              {criticalEvents.map((row, i) => (
                <li key={i} className="flex items-center justify-between">
                  <span>{row.event}</span>
                  <span className="text-xs text-[var(--muted)]">
                    {row.competitor} — {row.region}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </DashboardCard>

        <DashboardCard>
          <p className="text-sm font-semibold text-[var(--ink)]">Price moves (last 24h)</p>
          {recentPriceMoves.length === 0 ? (
            <EmptyState title="No price movements" description="No relevant price changes in the period." />
          ) : (
            <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
              {recentPriceMoves.map((row, i) => (
                <li key={i} className="flex items-center justify-between">
                  <span>{row.event}</span>
                  <span className="text-xs text-[var(--muted)]">
                    {row.competitor} — {row.region}
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
          <li
            onClick={() =>
              eventBus.emit("insight.created", {
                source: "SCOUT",
                target: "InsightScore",
              })
            }
          >
            InsightScore → prioritize hypotheses from competitive alerts.
          </li>
          <li
            onClick={() =>
              eventBus.emit("pricing.region.updated", {
                source: "SCOUT",
                target: "Pricing",
              })
            }
          >
            Pricing Regional → align price bands after detected movements.
          </li>
          <li
            onClick={() =>
              eventBus.emit("markettwin.region.updated", {
                source: "SCOUT",
                target: "MarketTwin",
              })
            }
          >
            Market Twin → review SOV/leadership in alerted regions.
          </li>
          <li
            onClick={() =>
              eventBus.emit("builder.template.used", {
                source: "SCOUT",
                target: "Builder",
              })
            }
          >
            Site Builder → adjust LPs based on offers/differentiators detected.
          </li>
          <li
            onClick={() =>
              eventBus.emit("custom", {
                source: "SCOUT",
                target: "Paid",
              })
            }
          >
            Paid → test creatives and copy against competitive moves.
          </li>
        </ul>
      </DashboardCard>
    </div>
  );
}
