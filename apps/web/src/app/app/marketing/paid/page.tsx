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
    { label: "Spend", value: "R$ 6.900", delta: "+4.8%", tone: "positive" as const },
    { label: "CPC", value: "R$ 1,10", delta: "-3.2%", tone: "positive" as const },
    { label: "CTR", value: "2,8%", delta: "+0.6%", tone: "positive" as const },
    { label: "CVR", value: "3,5%", delta: "-0.4%", tone: "negative" as const },
    { label: "ROAS", value: "2.2x", delta: "+0.3x", tone: "positive" as const },
  ];

  const columns = [
    { key: "campanha", label: "Campanha" },
    { key: "canal", label: "Canal" },
    { key: "spend", label: "Spend" },
    { key: "cpc", label: "CPC" },
    { key: "ctr", label: "CTR" },
    { key: "cvr", label: "CVR" },
    { key: "cpl", label: "CPL" },
    { key: "roas", label: "ROAS" },
  ];

  const rows = [
    { campanha: "Aquisição Lead Gen", canal: "Search", spend: "R$ 3.200", cpc: "R$ 1,20", ctr: "3,4%", cvr: "4,1%", cpl: "R$ 29", roas: "2.9x" },
    { campanha: "Retargeting Q3", canal: "Social", spend: "R$ 2.600", cpc: "R$ 0,90", ctr: "1,9%", cvr: "2,3%", cpl: "R$ 33", roas: "1.8x" },
    { campanha: "Display Awareness", canal: "Display", spend: "R$ 1.200", cpc: "R$ 0,40", ctr: "0,7%", cvr: "0,9%", cpl: "R$ 41", roas: "1.2x" },
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
            <GhostButton>Criar campanha</GhostButton>
            <GhostButton>Exportar</GhostButton>
          </>
        }
      />

      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-[96px]" />)
          : kpis.map((kpi) => <KPICard key={kpi.label} label={kpi.label} value={kpi.value} delta={kpi.delta} tone={kpi.tone} />)}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Spend vs ROAS" subtitle="Últimos 30 dias">
          {isLoading ? <Skeleton className="h-[160px] w-full" /> : <span className="text-xs text-[var(--muted)]">Gráfico em breve</span>}
        </ChartCard>
        <ChartCard title="Distribuição por Canal" subtitle="Channels mix">
          {isLoading ? <Skeleton className="h-[160px] w-full" /> : <span className="text-xs text-[var(--muted)]">Gráfico em breve</span>}
        </ChartCard>
      </div>

      <SectionHeader
        title="Campanhas"
        description="Desempenho por canal e campanha"
        actions={<GhostButton>Ver tudo</GhostButton>}
      />

      <FilterBar />

      {isLoading ? (
        <Skeleton className="h-[200px] w-full rounded-[var(--radius-md)]" />
      ) : isEmpty ? (
        <EmptyState
          title="Nenhuma campanha encontrada"
          description="Crie uma nova campanha ou conecte integrações no Bridge."
          action={<GhostButton>Criar campanha</GhostButton>}
        />
      ) : (
        <DataTable columns={columns} rows={rows} />
      )}

      <Divider />

      <SectionHeader title="Blocos secundários" description="Pipeline, InsightScore e Bridge (texto somente)" />
      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard>
          <p className="text-sm font-semibold text-[var(--ink)]">Cross-links</p>
          <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
            <li>Pipeline: origem e conversão de leads de campanhas.</li>
            <li>InsightScore: hipóteses e testes A/B derivados de Paid.</li>
            <li>Bridge: billing e integrações para campanhas.</li>
          </ul>
        </DashboardCard>
        <EmptyState title="Sem widgets adicionais" description="Adicione mais painéis na próxima fase." />
      </div>
    </div>
  );
}
