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

export default function AppPaidPage() {
  const kpis = [
    { label: "Spend", value: "USD 6,900", delta: "+4.8%", tone: "positive" as const },
    { label: "CPC", value: "USD 1.10", delta: "-3.2%", tone: "positive" as const },
    { label: "CTR", value: "2.8%", delta: "+0.6%", tone: "positive" as const },
    { label: "CVR", value: "3.5%", delta: "-0.4%", tone: "negative" as const },
    { label: "ROAS", value: "2.2x", delta: "+0.3x", tone: "positive" as const },
  ];

  const columns = [
    { key: "campanha", label: "Campaign" },
    { key: "canal", label: "Channel" },
    { key: "spend", label: "Spend" },
    { key: "cpc", label: "CPC" },
    { key: "ctr", label: "CTR" },
    { key: "cvr", label: "CVR" },
    { key: "cpl", label: "CPL" },
    { key: "roas", label: "ROAS" },
  ];

  const rows = [
    { campanha: "Lead Gen Acquisition", canal: "Search", spend: "USD 3,200", cpc: "USD 1.20", ctr: "3.4%", cvr: "4.1%", cpl: "USD 29", roas: "2.9x" },
    { campanha: "Q3 Retargeting", canal: "Social", spend: "USD 2,600", cpc: "USD 0.90", ctr: "1.9%", cvr: "2.3%", cpl: "USD 33", roas: "1.8x" },
    { campanha: "Display Awareness", canal: "Display", spend: "USD 1,200", cpc: "USD 0.40", ctr: "0.7%", cvr: "0.9%", cpl: "USD 41", roas: "1.2x" },
  ];

  const isLoading = false;
  const isEmpty = rows.length === 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Paid Performance"
        subtitle="Spend, CPC, CTR, CVR, CPL, ROAS"
        actions={
          <>
            <GhostButton>Create campaign</GhostButton>
            <GhostButton>Export</GhostButton>
          </>
        }
      />

      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-[96px]" />)
          : kpis.map((kpi) => <KPICard key={kpi.label} label={kpi.label} value={kpi.value} delta={kpi.delta} tone={kpi.tone} />)}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Spend vs ROAS" subtitle="Last 30 days">
          {isLoading ? <Skeleton className="h-[160px] w-full" /> : <span className="text-xs text-[var(--muted)]">Chart coming soon</span>}
        </ChartCard>
        <ChartCard title="Channel distribution" subtitle="Channels mix">
          {isLoading ? <Skeleton className="h-[160px] w-full" /> : <span className="text-xs text-[var(--muted)]">Chart coming soon</span>}
        </ChartCard>
      </div>

      <SectionHeader
        title="Campaigns"
        description="Performance by channel and campaign"
        actions={<GhostButton>View all</GhostButton>}
      />

      <FilterBar />

      {isLoading ? (
        <Skeleton className="h-[200px] w-full rounded-[var(--radius-md)]" />
      ) : isEmpty ? (
        <EmptyState
          title="No campaigns found"
          description="Create a new campaign or connect integrations in Bridge."
          action={<GhostButton>Create campaign</GhostButton>}
        />
      ) : (
        <DataTable columns={columns} rows={rows} />
      )}

      <Divider />

      <SectionHeader title="Secondary blocks" description="Pipeline, InsightScore and Bridge (text only)" />
      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard>
          <p className="text-sm font-semibold text-[var(--ink)]">Cross-links</p>
          <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
            <li>Pipeline: lead origin and conversion from campaigns.</li>
            <li>InsightScore: hypotheses and A/B tests coming from Paid.</li>
            <li>Bridge: billing and integrations for campaigns.</li>
          </ul>
        </DashboardCard>
        <EmptyState title="No additional widgets" description="Add more panels in the next phase." />
      </div>
    </div>
  );
}
