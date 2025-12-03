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

type MarketTwinRow = {
  region: "San Francisco" | "San Jose" | "Oakland" | "Los Angeles" | "New York" | "Miami";
  leader: "CleanPro USA" | "UltraClean America" | "PowerWash Co." | "SparkleHome";
  priceRange: string;
  sov: string;
  approval: string;
  status: "Strong" | "Neutral" | "Critical";
  lastUpdate: string;
  lastUpdateDate: Date;
};

const baseRows: MarketTwinRow[] = [
  {
    region: "San Francisco",
    leader: "CleanPro USA",
    priceRange: "$160–220",
    sov: "31%",
    approval: "82%",
    status: "Strong",
    lastUpdate: "10h ago",
    lastUpdateDate: new Date("2025-01-13T09:00:00"),
  },
  {
    region: "San Jose",
    leader: "UltraClean America",
    priceRange: "$150–210",
    sov: "26%",
    approval: "78%",
    status: "Neutral",
    lastUpdate: "1d ago",
    lastUpdateDate: new Date("2025-01-12T11:00:00"),
  },
  {
    region: "Oakland",
    leader: "PowerWash Co.",
    priceRange: "$145–205",
    sov: "23%",
    approval: "73%",
    status: "Neutral",
    lastUpdate: "2d ago",
    lastUpdateDate: new Date("2025-01-11T16:00:00"),
  },
  {
    region: "Los Angeles",
    leader: "CleanPro USA",
    priceRange: "$170–240",
    sov: "29%",
    approval: "81%",
    status: "Strong",
    lastUpdate: "3d ago",
    lastUpdateDate: new Date("2025-01-10T14:00:00"),
  },
  {
    region: "New York",
    leader: "SparkleHome",
    priceRange: "$180–260",
    sov: "27%",
    approval: "66%",
    status: "Critical",
    lastUpdate: "4d ago",
    lastUpdateDate: new Date("2025-01-09T15:30:00"),
  },
  {
    region: "Miami",
    leader: "UltraClean America",
    priceRange: "$140–200",
    sov: "22%",
    approval: "69%",
    status: "Critical",
    lastUpdate: "5d ago",
    lastUpdateDate: new Date("2025-01-08T10:30:00"),
  },
];

function parsePercent(value: string) {
  const num = parseFloat(value.replace("%", "").replace(",", "."));
  return Number.isFinite(num) ? num : 0;
}

function statusColor(status: MarketTwinRow["status"]) {
  if (status === "Strong") return "var(--success)";
  if (status === "Critical") return "var(--danger)";
  return "var(--muted)";
}

export default function MarketTwinPage() {
  const [chips, setChips] = useState<FilterChip[]>([
    { id: "highApproval", label: "High approval", active: false },
    { id: "lowApproval", label: "Low approval", active: false },
    { id: "highSOV", label: "High SOV", active: false },
  ]);
  const [region, setRegion] = useState("All");
  const [leader, setLeader] = useState("All");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null,
  });

  const kpis = [
    { label: "Regions monitored", value: "6", delta: "+2", tone: "positive" as const },
    { label: "Top SOV Leader", value: "CleanPro USA", delta: "31% SOV", tone: "positive" as const },
    { label: "Avg. approval", value: "75%", delta: "-1%", tone: "negative" as const },
    { label: "Critical regions", value: "2", delta: "+1", tone: "negative" as const },
    { label: "Strong regions", value: "2", delta: "=", tone: "neutral" as const },
  ];

  const columns = [
    { key: "region", label: "Region" },
    { key: "leader", label: "Leader" },
    { key: "priceRange", label: "Price Range" },
    { key: "sov", label: "SOV" },
    { key: "approval", label: "Approval" },
    { key: "status", label: "Status" },
    { key: "lastUpdate", label: "Last Update" },
    { key: "actions", label: "Actions", align: "right" as const },
  ];

  const filteredRows = useMemo(() => {
    const active = chips.filter((c) => c.active).map((c) => c.id);
    const q = search.trim().toLowerCase();

    return baseRows.filter((row) => {
      const sovNum = parsePercent(row.sov);
      const approvalNum = parsePercent(row.approval);

      const chipMatch =
        active.length === 0 ||
        active.some((chip) => {
          if (chip === "highApproval") return approvalNum >= 80;
          if (chip === "lowApproval") return approvalNum < 70;
          if (chip === "highSOV") return sovNum >= 25;
          return true;
        });

      const regionMatch = region === "All" || row.region === region;
      const leaderMatch = leader === "All" || row.leader === leader;

      const searchMatch =
        q.length === 0 ||
        row.region.toLowerCase().includes(q) ||
        row.leader.toLowerCase().includes(q) ||
        row.priceRange.toLowerCase().includes(q) ||
        row.status.toLowerCase().includes(q) ||
        row.sov.toLowerCase().includes(q) ||
        row.approval.toLowerCase().includes(q);

      const dateMatch =
        !dateRange.from ||
        !dateRange.to ||
        (row.lastUpdateDate.getTime() >= dateRange.from.getTime() &&
          row.lastUpdateDate.getTime() <= dateRange.to.getTime());

      return chipMatch && regionMatch && leaderMatch && searchMatch && dateMatch;
    });
  }, [chips, region, leader, search, dateRange]);

  const isLoading = false;
  const isEmpty = filteredRows.length === 0 && !isLoading;

  const handleClear = () => {
    setChips((prev) => prev.map((c) => ({ ...c, active: false })));
    setRegion("All");
    setLeader("All");
    setSearch("");
    setDateRange({ from: null, to: null });
  };

  const strongRegions = filteredRows.filter((row) => row.status === "Strong");
  const criticalRegions = filteredRows.filter((row) => row.status === "Critical");

  return (
    <div className="space-y-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
        Dashboard / Market / Market Twin
      </p>

      <PageHeader
        title="Market Twin"
        subtitle="Regional leadership map with price ranges, Share of Voice and approval for each US market."
        actions={
          <>
            <GhostButton onClick={() => eventBus.emit("report.generated", { source: "MarketTwin", action: "export_csv" })}>
              Export CSV
            </GhostButton>
            <GhostButton onClick={() => eventBus.emit("markettwin.region.updated", { source: "MarketTwin", action: "simulate_header" })}>
              Simulate Range
            </GhostButton>
            <GhostButton onClick={() => eventBus.emit("builder.template.used", { source: "MarketTwin", action: "apply_builder_header" })}>
              Apply in Builder
            </GhostButton>
          </>
        }
      />

      <DashboardCard>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-[var(--ink)]">AI Signal</p>
            <p className="text-sm text-[var(--muted)]">
              AI detected price band increases from leaders in San Francisco and Los Angeles with approval still above 80%, while New York shows
              lower approval with similar price ranges. Consider positioning tests and pricing experiments.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <GhostButton onClick={() => eventBus.emit("insight.created", { source: "MarketTwin", pattern: "positioning_cluster" })}>
              Generate insight
            </GhostButton>
            <GhostButton onClick={() => eventBus.emit("pricing.region.updated", { source: "MarketTwin", pattern: "align_bands" })}>
              Align with Pricing
            </GhostButton>
            <GhostButton onClick={() => eventBus.emit("custom", { source: "MarketTwin", pattern: "campaign_focus" })}>
              Focus Paid campaigns
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
        <ChartCard title="SOV by region" subtitle="Share of Voice per leader and metro">
          {isLoading ? (
            <Skeleton className="h-[160px] w-full" />
          ) : (
            <Skeleton className="h-[160px] w-full rounded-[var(--radius-sm)]" />
          )}
        </ChartCard>
        <ChartCard title="Approval by price range" subtitle="Correlation between approval and price bands">
          {isLoading ? (
            <Skeleton className="h-[160px] w-full" />
          ) : (
            <Skeleton className="h-[160px] w-full rounded-[var(--radius-sm)]" />
          )}
        </ChartCard>
      </div>

      <SectionHeader
        title="Leaders by region"
        description="Price ranges, Share of Voice and approval for each monitored area."
        actions={
          <GhostButton onClick={() => eventBus.emit("markettwin.region.updated", { source: "MarketTwin", action: "compare_regions" })}>
            Compare regions
          </GhostButton>
        }
      />

      <FilterBar
        chips={chips}
        onChipToggle={(id) =>
          setChips((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)))
        }
        showSearch
        searchPlaceholder="Search by region, leader, price range, SOV or approval"
        showDateRange
        onDateChange={(range) => setDateRange(range)}
        selects={[
          {
            id: "region",
            label: "Region",
            value: region,
            options: ["All", "San Francisco", "San Jose", "Oakland", "Los Angeles", "New York", "Miami"],
            onChange: setRegion,
          },
          {
            id: "leader",
            label: "Leader",
            value: leader,
            options: ["All", "CleanPro USA", "UltraClean America", "PowerWash Co.", "SparkleHome"],
            onChange: setLeader,
          },
        ]}
        extra={
          <GhostButton onClick={() => eventBus.emit("markettwin.region.updated", { source: "MarketTwin", action: "add_region" })}>
            Add region
          </GhostButton>
        }
        onClear={handleClear}
      />

      {isLoading ? (
        <Skeleton className="h-[260px] w-full rounded-[var(--radius-md)]" />
      ) : isEmpty ? (
        <EmptyState
          title="No regions found"
          description="Adjust filters or add new regions."
          action={<GhostButton onClick={() => eventBus.emit("markettwin.region.updated", { source: "MarketTwin", action: "add_region" })}>Add region</GhostButton>}
        />
      ) : (
        <DataTable
          columns={columns}
          rows={filteredRows.map((row, index) => ({
            ...row,
            status: (
              <span
                className="rounded-full px-2 py-1 text-xs font-semibold"
                style={{
                  backgroundColor: "var(--surface-muted)",
                  color: statusColor(row.status),
                }}
              >
                {row.status}
              </span>
            ),
            actions: (
              <div className="flex flex-wrap items-center justify-end gap-2">
                <GhostButton
                  aria-label="Simulate"
                  onClick={() => eventBus.emit("markettwin.region.updated", { source: "MarketTwin", action: "simulate_row", row })}
                >
                  Simulate
                </GhostButton>
                <GhostButton
                  aria-label="Details"
                  onClick={() => eventBus.emit("markettwin.region.updated", { source: "MarketTwin", action: "details_row", row })}
                >
                  Details
                </GhostButton>
                <GhostButton
                  aria-label="Apply in Builder"
                  onClick={() => eventBus.emit("builder.template.used", { source: "MarketTwin", action: "apply_row_builder", row })}
                >
                  Apply in Builder
                </GhostButton>
              </div>
            ),
            key: `${row.region}-${row.leader}-${index}`,
          }))}
        />
      )}

      <Divider />

      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard>
          <p className="text-sm font-semibold text-[var(--ink)]">Strong regions</p>
          {strongRegions.length === 0 ? (
            <EmptyState
              title="No strong regions"
              description="No areas with high SOV and approval above target."
            />
          ) : (
            <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
              {strongRegions.map((item, i) => (
                <li key={`${item.region}-${i}`} className="flex items-center justify-between">
                  <span>
                    {item.region} — {item.leader}
                  </span>
                  <span className="rounded-full bg-[var(--surface-muted)] px-2 py-1 text-xs font-semibold text-[var(--success)]">
                    {item.approval}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </DashboardCard>

        <DashboardCard>
          <p className="text-sm font-semibold text-[var(--ink)]">Critical regions</p>
          {criticalRegions.length === 0 ? (
            <EmptyState
              title="No critical regions"
              description="No areas with low approval or loss of SOV."
            />
          ) : (
            <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
              {criticalRegions.map((item, i) => (
                <li key={`${item.region}-${i}`} className="flex items-center justify-between">
                  <span>
                    {item.region} — {item.leader}
                  </span>
                  <span className="rounded-full bg-[var(--surface-muted)] px-2 py-1 text-xs font-semibold text-[var(--danger)]">
                    {item.approval}
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
          <li onClick={() => eventBus.emit("pricing.region.updated", { source: "MarketTwin", target: "Pricing" })}>
            Pricing Regional → align price bands after Market Twin positioning analysis.
          </li>
          <li onClick={() => eventBus.emit("scout.alert.created", { source: "MarketTwin", target: "Scout" })}>
            Scout → correlate leader movements with SOV shifts by region.
          </li>
          <li onClick={() => eventBus.emit("insight.created", { source: "MarketTwin", target: "InsightScore" })}>
            InsightScore → generate hypotheses about positioning and price by region.
          </li>
          <li onClick={() => eventBus.emit("custom", { source: "MarketTwin", target: "Paid" })}>
            Paid → focus campaigns on regions where leadership and approval support higher bids.
          </li>
          <li onClick={() => eventBus.emit("builder.template.used", { source: "MarketTwin", target: "Builder" })}>
            Site Builder → adapt LP messaging for each region based on Market Twin insights.
          </li>
        </ul>
      </DashboardCard>
    </div>
  );
}
