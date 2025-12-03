"use client";
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

function GhostButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="inline-flex h-9 items-center justify-center rounded-[var(--radius-sm)] border px-3 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
      style={{ borderColor: "var(--line)" }}
    />
  );
}

type RegionRow = {
  region: string;
  leader: string;
  priceRange: string;
  sov: string;
  approval: string;
  status: "Strong" | "Neutral" | "Critical";
  lastUpdate: string;
  lastUpdateDate: Date;
};

const baseRows: RegionRow[] = [
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
    sov: "24%",
    approval: "76%",
    status: "Neutral",
    lastUpdate: "1d ago",
    lastUpdateDate: new Date("2025-01-12T11:00:00"),
  },
  {
    region: "New York",
    leader: "SparkleHome",
    priceRange: "$180–250",
    sov: "28%",
    approval: "69%",
    status: "Critical",
    lastUpdate: "3d ago",
    lastUpdateDate: new Date("2025-01-10T16:00:00"),
  },
  {
    region: "Los Angeles",
    leader: "CleanPro USA",
    priceRange: "$170–230",
    sov: "26%",
    approval: "80%",
    status: "Strong",
    lastUpdate: "2d ago",
    lastUpdateDate: new Date("2025-01-11T08:00:00"),
  },
  {
    region: "Miami",
    leader: "NovaClean",
    priceRange: "$140–200",
    sov: "22%",
    approval: "65%",
    status: "Critical",
    lastUpdate: "4d ago",
    lastUpdateDate: new Date("2025-01-09T14:00:00"),
  },
  {
    region: "Oakland",
    leader: "UltraClean America",
    priceRange: "$145–205",
    sov: "23%",
    approval: "78%",
    status: "Neutral",
    lastUpdate: "5d ago",
    lastUpdateDate: new Date("2025-01-08T10:00:00"),
  },
];

function parsePercent(value: string) {
  const num = parseFloat(value.replace("%", "").replace(",", "."));
  return Number.isFinite(num) ? num : 0;
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
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });

  const kpis = [
    { label: "Regions monitored", value: "6", delta: "+1", tone: "positive" as const },
    { label: "Top SOV leader", value: "CleanPro USA", delta: "31% SOV", tone: "positive" as const },
    { label: "Average approval", value: "75%", delta: "-1%", tone: "negative" as const },
    { label: "Critical regions", value: "2", delta: "+1", tone: "negative" as const },
    { label: "Growing regions", value: "3", delta: "+2", tone: "positive" as const },
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

      const regionMatch = region === "Todos" || row.region === region;
      const leaderMatch = leader === "Todos" || row.leader === leader;

      const q = search.trim().toLowerCase();
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
        (row.lastUpdateDate.getTime() >= dateRange.from.getTime() && row.lastUpdateDate.getTime() <= dateRange.to.getTime());

      return chipMatch && regionMatch && leaderMatch && searchMatch && dateMatch;
    });
  }, [chips, region, leader, search, dateRange]);

  const isLoading = false;
  const isEmpty = filteredRows.length === 0 && !isLoading;

  const handleClear = () => {
    setChips((prev) => prev.map((c) => ({ ...c, active: false })));
    setRegion("Todos");
    setLeader("Todos");
    setSearch("");
    setDateRange({ from: null, to: null });
  };

  const strongRegions = filteredRows.filter((row) => row.status === "Forte");
  const criticalRegions = filteredRows.filter((row) => row.status === "Crítico");

  return (
    <div className="space-y-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">Dashboard / Market / Market Twin</p>

      <PageHeader
        title="Market Twin"
        subtitle="Mapa de liderança regional, faixas de preço, Share of Voice e aprovação."
        actions={
          <>
            <GhostButton>Exportar CSV</GhostButton>
            <GhostButton>Simular Faixa</GhostButton>
            <GhostButton>Aplicar no Builder</GhostButton>
          </>
        }
      />

      <DashboardCard>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-[var(--ink)]">Sinal de IA</p>
            <p className="text-sm text-[var(--muted)]">
              Líderes ajustaram preço em regiões estratégicas mantendo aprovação acima da média.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <GhostButton>Gerar insight baseado</GhostButton>
            <GhostButton>Comparar regiões</GhostButton>
            <GhostButton>Ver impacto em campanhas</GhostButton>
          </div>
        </div>
      </DashboardCard>

      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-[96px]" />)
          : kpis.map((kpi) => <KPICard key={kpi.label} label={kpi.label} value={kpi.value} delta={kpi.delta} tone={kpi.tone} />)}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="SOV por Região">
          {isLoading ? <Skeleton className="h-[160px] w-full" /> : <Skeleton className="h-[160px] w-full rounded-[var(--radius-sm)]" />}
        </ChartCard>
        <ChartCard title="Aprovação por Faixa de Preço">
          {isLoading ? <Skeleton className="h-[160px] w-full" /> : <Skeleton className="h-[160px] w-full rounded-[var(--radius-sm)]" />}
        </ChartCard>
      </div>

      <SectionHeader title="Líderes por região" description="Faixas de preço, SOV e aprovação em cada área monitorada pelo CREALEPH." />

      <FilterBar
        chips={chips}
        onChipToggle={(id) => setChips((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)))}
        showSearch={false}
        showDateRange
        onDateChange={(range) => setDateRange(range)}
        selects={[
          {
            id: "region",
            label: "Região",
            value: region,
            options: ["Todos", "São Paulo", "Campinas", "Rio de Janeiro", "Sul", "Nordeste", "Interior SP"],
            onChange: setRegion,
          },
          {
            id: "leader",
            label: "Líder",
            value: leader,
            options: ["Todos", "CleanPro", "UltraClean", "PowerWash", "NovaClean"],
            onChange: setLeader,
          },
        ]}
        extra={
          <div className="flex flex-wrap items-center gap-2">
            <div
              className="inline-flex min-w-[200px] items-center gap-2 rounded-[var(--radius-sm)] border px-[var(--space-3)] py-[var(--space-2)] text-sm text-[var(--ink)]"
              style={{ borderColor: "var(--line)" }}
            >
              <input
                type="text"
                aria-label="Buscar por região ou faixa"
                placeholder="Buscar por região, líder, faixa, SOV ou aprovação"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-sm text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none"
              />
            </div>
            <GhostButton>Adicionar Região</GhostButton>
          </div>
        }
        onClear={handleClear}
      />

      {isLoading ? (
        <Skeleton className="h-[260px] w-full rounded-[var(--radius-md)]" />
      ) : isEmpty ? (
        <EmptyState
          title="Nenhuma região encontrada"
          description="Ajuste filtros ou adicione novas regiões."
          action={<GhostButton>Adicionar Região</GhostButton>}
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
                  color:
                    row.status === "Forte"
                      ? "var(--success)"
                      : row.status === "Crítico"
                        ? "var(--danger)"
                        : "var(--muted)",
                }}
              >
                {row.status}
              </span>
            ),
            actions: (
              <div className="flex flex-wrap items-center justify-end gap-2">
                <GhostButton aria-label="Simular">Simular</GhostButton>
                <GhostButton aria-label="Detalhes">Detalhes</GhostButton>
                <GhostButton aria-label="Aplicar no Builder">Aplicar no Builder</GhostButton>
              </div>
            ),
            key: `${row.region}-${index}`,
          }))}
        />
      )}

      <Divider />

      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard>
          <p className="text-sm font-semibold text-[var(--ink)]">Regiões Fortes</p>
          {strongRegions.length === 0 ? (
            <EmptyState title="Nenhuma região forte" description="Sem áreas com SOV e aprovação altas." />
          ) : (
            <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
              {strongRegions.map((item) => (
                <li key={item.region} className="flex items-center justify-between">
                  <span>{item.region}</span>
                  <span className="rounded-full bg-[var(--surface-muted)] px-2 py-1 text-xs font-semibold text-[var(--success)]">
                    {item.approval}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </DashboardCard>

        <DashboardCard>
          <p className="text-sm font-semibold text-[var(--ink)]">Regiões Críticas</p>
          {criticalRegions.length === 0 ? (
            <EmptyState title="Nenhuma região crítica" description="Sem áreas com aprovação baixa ou perda de SOV." />
          ) : (
            <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
              {criticalRegions.map((item) => (
                <li key={item.region} className="flex items-center justify-between">
                  <span>{item.region}</span>
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
          <li>Pricing Regional: sincronizar faixas e percentis.</li>
          <li>Scout: mudanças de preço e posicionamento dos concorrentes.</li>
          <li>InsightScore: hipóteses e priorização de ajustes regionais.</li>
          <li>Paid: campanhas orientadas pelos líderes regionais.</li>
          <li>Builder: LPs regionais com preço otimizado.</li>
        </ul>
      </DashboardCard>
    </div>
  );
}
