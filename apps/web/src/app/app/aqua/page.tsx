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
          <>
            <GhostButton
              onClick={() =>
                eventBus.emit("insight.created", {
                  source: "AQUA",
                  pattern: "high_impact_cluster",
                  modules: ["Scout", "Pricing"],
                })
              }
            >
              Create Insight
            </GhostButton>
            <GhostButton
              onClick={() =>
                eventBus.emit("report.generated", {
                  source: "AQUA",
                  action: "export_to_cms",
                })
              }
            >
              Export to CMS
            </GhostButton>
            <GhostButton
              onClick={() =>
                eventBus.emit("builder.page.published", {
                  source: "AQUA",
                  action: "apply_copy_to_builder",
                })
              }
            >
              Apply to Builder
            </GhostButton>
          </>
        }
      />

      <DashboardCard>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-[var(--ink)]">AI Signal</p>
            <p className="text-sm text-[var(--muted)]">
              AI detected clusters of high-impact messages in SF and NY from Scout and Pricing. Consider pushing to Builder, Paid and InsightScore.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <GhostButton
              onClick={() =>
                eventBus.emit("insight.created", {
                  source: "AQUA",
                  type: "high_impact_cluster",
                  origins: ["Scout", "Pricing"],
                })
              }
            >
              Send to InsightScore
            </GhostButton>
            <GhostButton
              onClick={() =>
                eventBus.emit("builder.template.used", {
                  source: "AQUA",
                  action: "apply_ai_copy",
                })
              }
            >
              Apply AQUA Copy in Builder
            </GhostButton>
            <GhostButton
              onClick={() =>
                eventBus.emit("custom", {
                  source: "AQUA",
                  action: "test_headlines_in_paid",
                })
              }
            >
              Test in Paid
            </GhostButton>
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
          <GhostButton
            onClick={() =>
              eventBus.emit("insight.created", {
                source: "AQUA",
                action: "create_from_filter",
              })
            }
          >
            Create Insight
          </GhostButton>
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
            <GhostButton
              onClick={() =>
                eventBus.emit("aqua.message.created", {
                  source: "AQUA",
                  action: "empty_state_create",
                })
              }
            >
              Create Insight
            </GhostButton>
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
              <div className="flex flex-wrap items-center justify-end gap-2">
                <GhostButton
                  aria-label="Create Insight"
                  onClick={() =>
                    eventBus.emit("insight.created", {
                      source: "AQUA",
                      origin: row.origin,
                      city: row.city,
                      theme: row.theme,
                      impact: row.impact,
                      message: row.message,
                    })
                  }
                >
                  Create Insight
                </GhostButton>
                <GhostButton
                  aria-label="Apply in Builder"
                  onClick={() =>
                    eventBus.emit("aqua.message.applied", {
                      source: "AQUA",
                      city: row.city,
                      message: row.message,
                    })
                  }
                >
                  Apply in Builder
                </GhostButton>
                <GhostButton
                  aria-label="Test in Paid"
                  onClick={() =>
                    eventBus.emit("custom", {
                      source: "AQUA",
                      action: "test_in_paid",
                      message: row.message,
                      city: row.city,
                    })
                  }
                >
                  Test in Paid
                </GhostButton>
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
