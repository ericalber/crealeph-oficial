import { cookies } from "next/headers";
import { ButtonHTMLAttributes } from "react";
import { PageHeader } from "@/components/dashboard/layout/PageHeader";
import { SectionHeader } from "@/components/dashboard/layout/SectionHeader";
import { KPICard } from "@/components/dashboard/cards/KPICard";
import { ChartCard } from "@/components/dashboard/cards/ChartCard";
import { DataTable } from "@/components/dashboard/data/DataTable";
import { FilterBar } from "@/components/dashboard/data/FilterBar";
import { Divider } from "@/components/dashboard/sections/Divider";
import { DashboardCard } from "@/components/dashboard/cards/DashboardCard";
import { EmptyState } from "@/components/dashboard/feedback/EmptyState";
import { Skeleton } from "@/components/dashboard/feedback/Skeleton";

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

export default function AppOverviewPage() {
  const role = cookies().get("role")?.value ?? "admin";

  const kpis = [
    { label: "Sessions", value: "12.8k", delta: "+5.2%", tone: "positive" as const },
    { label: "Leads", value: "482", delta: "+3.1%", tone: "positive" as const },
    { label: "CPL", value: "USD 19.20", delta: "-4.0%", tone: "positive" as const },
    { label: "Approval", value: "37%", delta: "-1.2%", tone: "negative" as const },
    { label: "MQL/SQL", value: "62/31", delta: "=", tone: "neutral" as const },
  ];

  const columns = [
    { key: "event", label: "Event" },
    { key: "module", label: "Module" },
    { key: "status", label: "Status" },
    { key: "time", label: "Time" },
  ];

  const rows = [
    { event: "New price variation applied", module: "Pricing", status: "Success", time: "12m ago" },
    { event: "Insight approved for LP", module: "InsightScore", status: "Pending", time: "35m ago" },
    { event: "Scout alert: competitor X", module: "Scout", status: "New", time: "1h ago" },
    { event: "Bridge webhook processed", module: "Bridge", status: "Success", time: "2h ago" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Overview"
        subtitle={`Integrated view. Current role: ${role}.`}
        actions={
          <>
            <GhostButton>Export</GhostButton>
            <GhostButton>Create insight</GhostButton>
            <GhostButton>Invite team</GhostButton>
          </>
        }
      />

      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        {kpis.map((kpi) => (
          <KPICard key={kpi.label} label={kpi.label} value={kpi.value} delta={kpi.delta} tone={kpi.tone} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Spend vs ROAS" subtitle="Last 30 days">
          <Skeleton className="h-[160px] w-full" />
        </ChartCard>
        <ChartCard title="Alerts per day" subtitle="Scout / Bridge / AQUA">
          <Skeleton className="h-[160px] w-full" />
        </ChartCard>
      </div>

      <SectionHeader title="Recent events" description="Pricing, intelligence, and automation activity" actions={<GhostButton>View all</GhostButton>} />
      <FilterBar />
      <DataTable
        columns={columns}
        rows={rows.map((row) => ({
          ...row,
          status: (
            <span
              className="rounded-full px-2 py-1 text-xs font-semibold"
              style={{ backgroundColor: "var(--surface-muted)", color: "var(--muted)" }}
            >
              {row.status}
            </span>
          ),
        }))}
      />

      <Divider />

      <SectionHeader title="Secondary blocks" description="Use this space for supporting metrics" />
      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard>
          <p className="text-sm font-semibold text-[var(--ink)]">Health summary</p>
          <p className="mt-2 text-sm text-[var(--muted)]">Placeholder for additional Bridge and Pipeline indicators.</p>
        </DashboardCard>
        <EmptyState title="No additional items" description="Add widgets or secondary cards in the next phase." />
      </div>
    </div>
  );
}
