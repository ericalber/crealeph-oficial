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
    { label: "CPL", value: "R$ 19,20", delta: "-4.0%", tone: "positive" as const },
    { label: "Approval", value: "37%", delta: "-1.2%", tone: "negative" as const },
    { label: "MQL/SQL", value: "62/31", delta: "=", tone: "neutral" as const },
  ];

  const columns = [
    { key: "event", label: "Evento" },
    { key: "module", label: "Módulo" },
    { key: "status", label: "Status" },
    { key: "time", label: "Tempo" },
  ];

  const rows = [
    { event: "Nova variação de preço aplicada", module: "Pricing", status: "Sucesso", time: "Há 12m" },
    { event: "Insight aprovado para LP", module: "InsightScore", status: "Aguardando", time: "Há 35m" },
    { event: "Alerta Scout: concorrente X", module: "Scout", status: "Novo", time: "Há 1h" },
    { event: "Webhook Bridge processado", module: "Bridge", status: "Sucesso", time: "Há 2h" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Overview"
        subtitle={`Visão integrada. Role atual: ${role}.`}
        actions={
          <>
            <GhostButton>Exportar</GhostButton>
            <GhostButton>Criar insight</GhostButton>
            <GhostButton>Convidar time</GhostButton>
          </>
        }
      />

      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        {kpis.map((kpi) => (
          <KPICard key={kpi.label} label={kpi.label} value={kpi.value} delta={kpi.delta} tone={kpi.tone} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Spend vs ROAS" subtitle="Últimos 30 dias">
          <Skeleton className="h-[160px] w-full" />
        </ChartCard>
        <ChartCard title="Alertas por dia" subtitle="Scout / Bridge / AQUA">
          <Skeleton className="h-[160px] w-full" />
        </ChartCard>
      </div>

      <SectionHeader title="Eventos recentes" description="Atividades de pricing, inteligência e automação" actions={<GhostButton>Ver tudo</GhostButton>} />
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

      <SectionHeader title="Blocos secundários" description="Use este espaço para métricas auxiliares" />
      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard>
          <p className="text-sm font-semibold text-[var(--ink)]">Resumo de saúde</p>
          <p className="mt-2 text-sm text-[var(--muted)]">Placeholder para indicadores adicionais de Bridge e Pipeline.</p>
        </DashboardCard>
        <EmptyState title="Nenhum item adicional" description="Adicione widgets ou cards secundários conforme a evolução da fase 2." />
      </div>
    </div>
  );
}
