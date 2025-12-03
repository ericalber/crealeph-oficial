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
      className="inline-flex h-9 items-center justify-center rounded-[var(--radius-sm)] border px-3 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--surface-muted)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
      style={{ borderColor: "var(--line)" }}
    />
  );
}

type PipelineRow = {
  name: string;
  source: "Paid" | "SEO" | "Direct" | "Referral";
  stage: "New" | "Qualified" | "Proposal" | "Won" | "Lost";
  region: "San Francisco" | "San Jose" | "Oakland" | "Los Angeles" | "New York" | "Miami";
  createdAt: string;
  createdAtDate: Date;
  value: number;
};

const baseRows: PipelineRow[] = [
  {
    name: "Lead — SF Home Cleaning",
    source: "Paid",
    stage: "New",
    region: "San Francisco",
    createdAt: "12min ago",
    createdAtDate: new Date("2025-01-13T09:10:00"),
    value: 220,
  },
  {
    name: "Lead — Silicon Valley Office",
    source: "SEO",
    stage: "Qualified",
    region: "San Jose",
    createdAt: "28min ago",
    createdAtDate: new Date("2025-01-13T08:55:00"),
    value: 480,
  },
  {
    name: "Lead — Oakland Condo",
    source: "Referral",
    stage: "Proposal",
    region: "Oakland",
    createdAt: "1h ago",
    createdAtDate: new Date("2025-01-13T08:05:00"),
    value: 360,
  },
  {
    name: "Lead — LA Commercial",
    source: "Paid",
    stage: "Won",
    region: "Los Angeles",
    createdAt: "3h ago",
    createdAtDate: new Date("2025-01-13T06:00:00"),
    value: 820,
  },
  {
    name: "Lead — Manhattan Loft",
    source: "SEO",
    stage: "Lost",
    region: "New York",
    createdAt: "6h ago",
    createdAtDate: new Date("2025-01-13T03:30:00"),
    value: 510,
  },
  {
    name: "Lead — Miami Beach",
    source: "Direct",
    stage: "Qualified",
    region: "Miami",
    createdAt: "12h ago",
    createdAtDate: new Date("2025-01-12T22:00:00"),
    value: 390,
  },
];

export default function PipelinePage() {
  const [chips, setChips] = useState<FilterChip[]>([
    { id: "highValue", label: "High Value", active: false },
    { id: "lost", label: "Lost", active: false },
    { id: "won", label: "Won", active: false },
  ]);
  const [source, setSource] = useState("All");
  const [stage, setStage] = useState("All");
  const [region, setRegion] = useState("All");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });

  const kpis = [
    { label: "Total Leads", value: "86", delta: "+12%", tone: "positive" },
    { label: "Qualified", value: "34", delta: "+5", tone: "positive" },
    { label: "Won Deals", value: "11", delta: "+2", tone: "positive" },
    { label: "Lost Deals", value: "7", delta: "+1", tone: "negative" },
    { label: "Avg. Deal Value", value: "$412", delta: "+3%", tone: "positive" },
  ];

  const columns = [
    { key: "name", label: "Lead" },
    { key: "source", label: "Source" },
    { key: "stage", label: "Stage" },
    { key: "region", label: "Region" },
    { key: "value", label: "Value" },
    { key: "createdAt", label: "Created At" },
    { key: "actions", label: "Actions", align: "right" as const },
  ];

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    const active = chips.filter((c) => c.active).map((c) => c.id);

    return baseRows.filter((row) => {
      const matchChip =
        active.length === 0 ||
        active.some((chip) => {
          if (chip === "highValue") return row.value >= 500;
          if (chip === "lost") return row.stage === "Lost";
          if (chip === "won") return row.stage === "Won";
          return true;
        });

      const matchSource = source === "All" || row.source === source;
      const matchStage = stage === "All" || row.stage === stage;
      const matchRegion = region === "All" || row.region === region;

      const matchSearch =
        q.length === 0 ||
        row.name.toLowerCase().includes(q) ||
        row.source.toLowerCase().includes(q) ||
        row.stage.toLowerCase().includes(q) ||
        row.region.toLowerCase().includes(q);

      const matchDate =
        !dateRange.from ||
        !dateRange.to ||
        (row.createdAtDate.getTime() >= dateRange.from.getTime() && row.createdAtDate.getTime() <= dateRange.to.getTime());

      return matchChip && matchSource && matchStage && matchRegion && matchSearch && matchDate;
    });
  }, [chips, source, stage, region, search, dateRange]);

  const isEmpty = filteredRows.length === 0;

  const handleClear = () => {
    setChips((prev) => prev.map((c) => ({ ...c, active: false })));
    setSource("All");
    setStage("All");
    setRegion("All");
    setSearch("");
    setDateRange({ from: null, to: null });
  };

  const wonRows = filteredRows.filter((r) => r.stage === "Won");
  const lostRows = filteredRows.filter((r) => r.stage === "Lost");

  return (
    <div className="space-y-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
        Dashboard / Operations / Pipeline
      </p>

      <PageHeader
        title="Pipeline"
        subtitle="Leads, qualification, proposals, wins and losses by source and region."
        actions={
          <>
            <GhostButton
              onClick={() => {
                eventBus.emit("custom", { source: "pipeline", action: "export" });
              }}
            >
              Export
            </GhostButton>
            <GhostButton
              onClick={() => {
                eventBus.emit("custom", { source: "pipeline", action: "bulk_move" });
              }}
            >
              Bulk Move
            </GhostButton>
            <GhostButton
              onClick={() => {
                eventBus.emit("pipeline.lead.created", { source: "pipeline", action: "create_lead" });
              }}
            >
              Create Lead
            </GhostButton>
          </>
        }
      />

      <DashboardCard>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-[var(--ink)]">AI Signal</p>
            <p className="text-sm text-[var(--muted)]">
              AI detected rising Paid→Qualified rates but increased losses in New York. Consider campaign optimization and hypothesis creation.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <GhostButton
              onClick={() => {
                eventBus.emit("insight.created", { source: "pipeline", action: "priority_insight" });
              }}
            >
              Create Priority Insight
            </GhostButton>

            <GhostButton
              onClick={() => {
                eventBus.emit("custom", { source: "pipeline", action: "lead_map" });
              }}
            >
              Open Lead Map
            </GhostButton>

            <GhostButton
              onClick={() => {
                eventBus.emit("custom", { source: "pipeline", action: "optimize_campaign" });
              }}
            >
              Optimize Campaign
            </GhostButton>
          </div>
        </div>
      </DashboardCard>

      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))" }}>
        {kpis.map((k) => (
          <KPICard key={k.label} label={k.label} value={k.value} delta={k.delta} tone={k.tone} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Leads by Stage (last 30 days)">
          <Skeleton className="h-[160px] w-full rounded-[var(--radius-sm)]" />
        </ChartCard>

        <ChartCard title="Lead Sources">
          <Skeleton className="h-[160px] w-full rounded-[var(--radius-sm)]" />
        </ChartCard>
      </div>

      <SectionHeader title="Leads by Stage" description="Filter by source, stage and region" />

      <FilterBar
        chips={chips}
        onChipToggle={(id) => setChips((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)))}
        showSearch
        searchPlaceholder="Search lead, source or region"
        showDateRange
        onDateChange={(range) => setDateRange(range)}
        selects={[
          { id: "source", label: "Source", value: source, options: ["All", "Paid", "SEO", "Direct", "Referral"], onChange: setSource },
          { id: "stage", label: "Stage", value: stage, options: ["All", "New", "Qualified", "Proposal", "Won", "Lost"], onChange: setStage },
          {
            id: "region",
            label: "Region",
            value: region,
            options: ["All", "San Francisco", "San Jose", "Oakland", "Los Angeles", "New York", "Miami"],
            onChange: setRegion,
          },
        ]}
        extra={
          <GhostButton
            onClick={() => {
              eventBus.emit("pipeline.lead.created", { source: "pipeline", action: "create_lead" });
            }}
          >
            Create Lead
          </GhostButton>
        }
        onClear={handleClear}
      />

      {isEmpty ? (
        <EmptyState
          title="No leads found"
          description="Adjust filters or import new leads."
          action={
            <GhostButton
              onClick={() => eventBus.emit("pipeline.lead.created", { source: "pipeline", action: "create_lead_empty" })}
            >
              Create Lead
            </GhostButton>
          }
        />
      ) : (
        <DataTable
          columns={columns}
          rows={filteredRows.map((row, i) => ({
            ...row,
            value: `$${row.value}`,
            actions: (
              <div className="flex flex-wrap items-center justify-end gap-2">
                <GhostButton
                  onClick={() =>
                    eventBus.emit("custom", { source: "pipeline", action: "view", row })
                  }
                >
                  View
                </GhostButton>

                <GhostButton
                  onClick={() =>
                    eventBus.emit("pipeline.stage.changed", { source: "pipeline", row })
                  }
                >
                  Move
                </GhostButton>

                <GhostButton
                  onClick={() =>
                    eventBus.emit("custom", { source: "pipeline", action: "delete", row })
                  }
                >
                  Delete
                </GhostButton>
              </div>
            ),
            key: `${row.name}-${i}`,
          }))}
        />
      )}

      <Divider />

      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard>
          <p className="text-sm font-semibold text-[var(--ink)]">Won Deals</p>
          {wonRows.length === 0 ? (
            <EmptyState title="No won deals" description="No deals marked as Won." />
          ) : (
            <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
              {wonRows.map((item, i) => (
                <li key={i} className="flex items-center justify-between">
                  <span>{item.name}</span>
                  <span className="rounded-full bg-[var(--surface-muted)] px-2 py-1 text-xs font-semibold text-[var(--success)]">
                    {`$${item.value}`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </DashboardCard>

        <DashboardCard>
          <p className="text-sm font-semibold text-[var(--ink)]">Lost Deals</p>
          {lostRows.length === 0 ? (
            <EmptyState title="No lost deals" description="No deals marked as Lost." />
          ) : (
            <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
              {lostRows.map((item, i) => (
                <li key={i} className="flex items-center justify-between">
                  <span>{item.name}</span>
                  <span className="rounded-full bg-[var(--surface-muted)] px-2 py-1 text-xs font-semibold text-[var(--danger)]">
                    {`$${item.value}`}
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
          <li>Paid → analyze which ads produce high-value leads</li>
          <li>SEO → understand which pages generate qualified traffic</li>
          <li>Bridge → check if sync issues impact lead creation</li>
          <li>InsightScore → create hypotheses about drop-offs by stage</li>
          <li>Reports → build full-funnel reports by period</li>
        </ul>
      </DashboardCard>
    </div>
  );
}
