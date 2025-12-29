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

export default function AppSEOPage() {
  const kpis = [
    { label: "Organic Traffic", value: "28.4k", delta: "+6.1%", tone: "positive" as const },
    { label: "CWV Pass Rate", value: "72%", delta: "+2.3%", tone: "positive" as const },
    { label: "Keywords Top 3", value: "41", delta: "+4", tone: "positive" as const },
    { label: "Keywords Top 10", value: "128", delta: "+9", tone: "positive" as const },
  ];

  const columns = [
    { key: "keyword", label: "Keyword" },
    { key: "ctr", label: "CTR" },
    { key: "posicao", label: "Position" },
    { key: "cwv", label: "CWV" },
  ];

  const rows = [
    { keyword: "modular website", ctr: "3.1%", posicao: "#4", cwv: "Pass" },
    { keyword: "pricing regional", ctr: "2.4%", posicao: "#7", cwv: "Needs work" },
    { keyword: "market twin", ctr: "1.9%", posicao: "#11", cwv: "Pass" },
  ];

  const isLoading = false;
  const isEmpty = rows.length === 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="SEO Performance"
        subtitle="Organic traffic, CWV, keywords and routes"
        actions={
          <>
            <GhostButton>Create optimization</GhostButton>
            <GhostButton>Export</GhostButton>
          </>
        }
      />

      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[96px]" />)
          : kpis.map((kpi) => <KPICard key={kpi.label} label={kpi.label} value={kpi.value} delta={kpi.delta} tone={kpi.tone} />)}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Organic traffic (30 days)">
          {isLoading ? <Skeleton className="h-[160px] w-full" /> : <span className="text-xs text-[var(--muted)]">Chart coming soon</span>}
        </ChartCard>
        <ChartCard title="CWV Compliance">
          {isLoading ? <Skeleton className="h-[160px] w-full" /> : <span className="text-xs text-[var(--muted)]">Chart coming soon</span>}
        </ChartCard>
      </div>

      <SectionHeader
        title="Keywords"
        description="List of keywords with CTR, position and CWV"
        actions={<GhostButton>View all</GhostButton>}
      />

      <FilterBar />

      {isLoading ? (
        <Skeleton className="h-[200px] w-full rounded-[var(--radius-md)]" />
      ) : isEmpty ? (
        <EmptyState
          title="No keywords found"
          description="Connect Google Search Console or adjust integrations in Bridge."
          action={<GhostButton>Create optimization</GhostButton>}
        />
      ) : (
        <DataTable columns={columns} rows={rows} />
      )}

      <Divider />

      <SectionHeader title="Secondary blocks" description="Integrations with Paid, Builder and InsightScore" />
      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard>
          <p className="text-sm font-semibold text-[var(--ink)]">Cross-links</p>
          <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
            <li>Paid: align copy and LPs for campaigns.</li>
            <li>Builder: apply optimizations to templates and routes.</li>
            <li>InsightScore: prioritize SEO hypotheses.</li>
          </ul>
        </DashboardCard>
        <EmptyState title="No additional widgets" description="Include extra charts or tables in the next phase." />
      </div>
    </div>
  );
}
