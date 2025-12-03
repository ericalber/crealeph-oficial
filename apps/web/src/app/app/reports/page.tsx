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
import { publishEvent } from "@/lib/crealeph/event-bus";

export const metadata = { robots: { index: false, follow: false } } as const;

function GhostButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="inline-flex h-9 items-center justify-center rounded-[var(--radius-sm)] border px-3 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
      style={{ borderColor: "var(--line)" }}
    />
  );
}

type ReportRow = {
  module: "Paid" | "SEO" | "Bridge" | "InsightScore" | "Pipeline" | "Builder";
  title: string;
  status: "Ready" | "Pending" | "Error";
  createdAt: string;
  createdAtDate: Date;
};

const baseRows: ReportRow[] = [
  {
    module: "Paid",
    title: "Paid Performance – Last 30 days",
    status: "Ready",
    createdAt: "5h ago",
    createdAtDate: new Date("2025-01-13T06:00:00"),
  },
  {
    module: "SEO",
    title: "SEO Health & CWV Report",
    status: "Pending",
    createdAt: "12h ago",
    createdAtDate: new Date("2025-01-12T23:30:00"),
  },
  {
    module: "Bridge",
    title: "Integration Status – 24h",
    status: "Error",
    createdAt: "1d ago",
    createdAtDate: new Date("2025-01-12T10:00:00"),
  },
  {
    module: "InsightScore",
    title: "Insights Summary – Weekly",
    status: "Ready",
    createdAt: "2d ago",
    createdAtDate: new Date("2025-01-11T15:00:00"),
  },
  {
    module: "Pipeline",
    title: "Funnel Conversion – Last 30 days",
    status: "Ready",
    createdAt: "3d ago",
    createdAtDate: new Date("2025-01-10T16:30:00"),
  },
  {
    module: "Builder",
    title: "LP Performance & CTR Boost",
    status: "Pending",
    createdAt: "6h ago",
    createdAtDate: new Date("2025-01-13T03:30:00"),
  },
];

function statusColor(status: ReportRow["status"]) {
  if (status === "Ready") return "var(--success)";
  if (status === "Pending") return "var(--warning)";
  return "var(--danger)";
}

export default function ReportsPage() {
  const [chips, setChips] = useState<FilterChip[]>([
    { id: "ready", label: "Ready", active: false },
    { id: "pending", label: "Pending", active: false },
    { id: "error", label: "Error", active: false },
  ]);

  const [moduleFilter, setModuleFilter] = useState<"All" | "Paid" | "SEO" | "Bridge" | "InsightScore" | "Pipeline" | "Builder">("All");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null,
  });

  const kpis = [
    { label: "Reports Generated", value: "48", delta: "+12%", tone: "positive" as const },
    { label: "Pending", value: "7", delta: "+2", tone: "negative" as const },
    { label: "Errors (7d)", value: "3", delta: "-1", tone: "positive" as const },
    { label: "Exports (30d)", value: "122", delta: "+18%", tone: "positive" as const },
    { label: "Avg. Generation Time", value: "14s", delta: "-2s", tone: "positive" as const },
  ];

  const columns = [
    { key: "module", label: "Module" },
    { key: "title", label: "Report" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Created At" },
    { key: "actions", label: "Actions", align: "right" as const },
  ];

  const filteredRows = useMemo(() => {
    const active = chips.filter((c) => c.active).map((c) => c.id);
    const q = search.trim().toLowerCase();

    return baseRows.filter((row) => {
      const matchChip =
        active.length === 0 ||
        active.some((chip) => {
          if (chip === "ready") return row.status === "Ready";
          if (chip === "pending") return row.status === "Pending";
          if (chip === "error") return row.status === "Error";
          return true;
        });

      const matchModule = moduleFilter === "All" || row.module === moduleFilter;

      const matchSearch =
        q.length === 0 ||
        row.title.toLowerCase().includes(q) ||
        row.module.toLowerCase().includes(q);

      const matchDate =
        !dateRange.from ||
        !dateRange.to ||
        (row.createdAtDate.getTime() >= dateRange.from.getTime() && row.createdAtDate.getTime() <= dateRange.to.getTime());

      return matchChip && matchModule && matchSearch && matchDate;
    });
  }, [chips, moduleFilter, search, dateRange]);

  const isLoading = false;
  const isEmpty = filteredRows.length === 0;

  const handleClear = () => {
    setChips((p) => p.map((c) => ({ ...c, active: false })));
    setModuleFilter("All");
    setSearch("");
    setDateRange({ from: null, to: null });
  };

  const scheduledReports = filteredRows.filter((r) => r.status === "Pending");
  const failedReports = filteredRows.filter((r) => r.status === "Error");

  return (
    <div className="space-y-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
        Dashboard / Intelligence / Reports
      </p>

      <PageHeader
        title="Reports"
        subtitle="Centralized reporting across marketing, pricing, pipeline and integrations."
        actions={
          <>
            <GhostButton
              onClick={() => {
                console.log("reports → new");
                publishEvent({ type: "report.generated", source: "reports", payload: { action: "new_report" } });
              }}
            >
              New report
            </GhostButton>
            <GhostButton
              onClick={() => {
                console.log("reports → schedule");
                publishEvent({ type: "report.generated", source: "reports", payload: { action: "schedule_report" } });
              }}
            >
              Schedule
            </GhostButton>
            <GhostButton
              onClick={() => {
                console.log("reports → export_all");
                publishEvent({ type: "report.generated", source: "reports", payload: { action: "export_all" } });
              }}
            >
              Export all
            </GhostButton>
          </>
        }
      />

      <DashboardCard>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-[var(--ink)]">AI Signal</p>
            <p className="text-sm text-[var(--muted)]">
              AI detected recurring failures in NY funnel reports and a gap between Spend and ROAS in Paid. Consider linking these to InsightScore and Pipeline.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <GhostButton
              onClick={() => {
                console.log("reports → insightscore", { pattern: "report_failures" });
                publishEvent({ type: "insight.created", source: "reports", payload: { action: "from_failures" } });
              }}
            >
              Create Insight from failures
            </GhostButton>
            <GhostButton
              onClick={() => {
                console.log("reports → paid", { pattern: "open_roas_report" });
                publishEvent({ type: "paid.campaign.updated", source: "reports", payload: { action: "open_roas_report" } });
              }}
            >
              Open Paid report
            </GhostButton>
            <GhostButton
              onClick={() => {
                console.log("reports → pipeline", { pattern: "open_funnel_report" });
                publishEvent({ type: "pipeline.stage.changed", source: "reports", payload: { action: "open_funnel_report" } });
              }}
            >
              Open Pipeline report
            </GhostButton>
          </div>
        </div>
      </DashboardCard>

      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-[96px]" />
            ))
          : kpis.map((kpi) => (
              <KPICard key={kpi.label} label={kpi.label} value={kpi.value} delta={kpi.delta} tone={kpi.tone} />
            ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Reports by module" subtitle="Volume of generated reports per domain">
          <Skeleton className="h-[160px] w-full rounded-[var(--radius-sm)]" />
        </ChartCard>
        <ChartCard title="Success vs Failure" subtitle="Completion rate over the last 30 days">
          <Skeleton className="h-[160px] w-full rounded-[var(--radius-sm)]" />
        </ChartCard>
      </div>

      <SectionHeader title="Reports queue" description="Status, period and latest run per report." />

      <FilterBar
        chips={chips}
        onChipToggle={(id) => setChips((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)))}
        showSearch
        searchPlaceholder="Search by report name or module"
        showDateRange
        onDateChange={(range) => setDateRange(range)}
        selects={[
          {
            id: "module",
            label: "Module",
            value: moduleFilter,
            options: ["All", "Paid", "SEO", "Bridge", "InsightScore", "Pipeline", "Builder"],
            onChange: (v) => setModuleFilter(v as typeof moduleFilter),
          },
        ]}
        extra={
          <GhostButton
            onClick={() => {
              console.log("reports → new");
              publishEvent({ type: "report.generated", source: "reports", payload: { action: "new_report" } });
            }}
          >
            Add report
          </GhostButton>
        }
        onClear={handleClear}
      />

      {isEmpty ? (
        <EmptyState
          title="No reports found"
          description="Adjust filters or create a new report."
          action={<GhostButton onClick={() => console.log("reports → new")}>Create report</GhostButton>}
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
            actions: (
              <div className="flex flex-wrap items-center justify-end gap-2">
                <GhostButton
                  aria-label="Run now"
                  onClick={() => {
                    console.log("reports-row → run_now", row);
                    publishEvent({ type: "report.generated", source: "reports", payload: { action: "run_now", row } });
                  }}
                >
                  Run now
                </GhostButton>
                <GhostButton
                  aria-label="View"
                  onClick={() => {
                    console.log("reports-row → view", row);
                    publishEvent({ type: "custom", source: "reports", payload: { action: "view", row } });
                  }}
                >
                  View
                </GhostButton>
                <GhostButton
                  aria-label="Open module"
                  onClick={() => {
                    console.log("reports-row → open_module", { module: row.module, row });
                    publishEvent({ type: "custom", source: "reports", payload: { action: "open_module", module: row.module, row } });
                  }}
                >
                  Open in module
                </GhostButton>
              </div>
            ),
            key: `${row.title}-${index}`,
          }))}
        />
      )}

      <Divider />

      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard>
          <p className="text-sm font-semibold text-[var(--ink)]">Scheduled reports</p>
          {scheduledReports.length === 0 ? (
            <EmptyState
              title="No scheduled reports"
              description="You don't have any scheduled reports. Set up recurring reports to keep your team aligned."
              action={
                <GhostButton
                  onClick={() => {
                    console.log("reports → schedule");
                    publishEvent({ type: "report.generated", source: "reports", payload: { action: "schedule_report" } });
                  }}
                >
                  Schedule report
                </GhostButton>
              }
            />
          ) : (
            <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
              {scheduledReports.map((item, i) => (
                <li key={`${item.title}-${i}`} className="flex items-center justify-between">
                  <span>
                    {item.title} — {item.createdAt}
                  </span>
                  <span className="rounded-full bg-[var(--surface-muted)] px-2 py-1 text-xs font-semibold text-[var(--warning)]">
                    Pending
                  </span>
                </li>
              ))}
            </ul>
          )}
        </DashboardCard>

        <DashboardCard>
          <p className="text-sm font-semibold text-[var(--ink)]">Failed reports</p>
          {failedReports.length === 0 ? (
            <EmptyState
              title="No failed reports"
              description="All reports completed successfully in the selected period."
            />
          ) : (
            <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
              {failedReports.map((item, i) => (
                <li key={`${item.title}-${i}`} className="flex items-center justify-between">
                  <span>
                    {item.title} — {item.createdAt}
                  </span>
                  <span className="rounded-full bg-[var(--surface-muted)] px-2 py-1 text-xs font-semibold text-[var(--danger)]">
                    Error
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
          <li>Bridge → open integration health and error logs.</li>
          <li>Pipeline → connect report insights to funnel performance.</li>
          <li>Paid & SEO → jump to campaign and traffic reports directly.</li>
          <li>InsightScore → turn report anomalies into hypotheses.</li>
          <li>Site Builder → validate LP performance from report results.</li>
        </ul>
      </DashboardCard>
    </div>
  );
}
