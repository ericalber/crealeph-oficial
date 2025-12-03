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

type InsightRow = {
  title: string;
  description: string;
  origin: "AQUA" | "Scout" | "Pricing" | "Market Twin" | "Paid" | "SEO";
  impact: "High" | "Medium" | "Low";
  effort: "High" | "Medium" | "Low";
  status: "New" | "Approved" | "Testing" | "Done";
  createdAt: string;
  createdAtDate: Date;
  aiGenerated: boolean;
};

const baseRows: InsightRow[] = [
  {
    title: "Pricing uplift for SF metro",
    description: "Adjust price bands to match competitor uplift detected by Scout.",
    origin: "Pricing",
    impact: "High",
    effort: "Medium",
    status: "Testing",
    createdAt: "2025-01-13",
    createdAtDate: new Date("2025-01-13T09:00:00"),
    aiGenerated: true,
  },
  {
    title: "CTA localized for Oakland",
    description: "AQUA suggests CTA variant for local language nuances.",
    origin: "AQUA",
    impact: "Medium",
    effort: "Low",
    status: "Approved",
    createdAt: "2025-01-12",
    createdAtDate: new Date("2025-01-12T15:00:00"),
    aiGenerated: true,
  },
  {
    title: "Competitor SOV spike LA",
    description: "Scout flagged spike; test counter-creative.",
    origin: "Scout",
    impact: "High",
    effort: "Low",
    status: "New",
    createdAt: "2025-01-11",
    createdAtDate: new Date("2025-01-11T08:30:00"),
    aiGenerated: false,
  },
  {
    title: "SEO schema update",
    description: "Improve FAQ schema for Paid/SEO landing pages.",
    origin: "SEO",
    impact: "Medium",
    effort: "Medium",
    status: "Done",
    createdAt: "2025-01-10",
    createdAtDate: new Date("2025-01-10T10:00:00"),
    aiGenerated: false,
  },
  {
    title: "Paid headline A/B",
    description: "New headline targeting approval concerns.",
    origin: "Paid",
    impact: "Low",
    effort: "Low",
    status: "Testing",
    createdAt: "2025-01-09",
    createdAtDate: new Date("2025-01-09T13:00:00"),
    aiGenerated: true,
  },
  {
    title: "Market Twin competitive block",
    description: "Show leader and approval per region to increase trust.",
    origin: "Market Twin",
    impact: "High",
    effort: "High",
    status: "New",
    createdAt: "2025-01-08",
    createdAtDate: new Date("2025-01-08T09:00:00"),
    aiGenerated: false,
  },
];

function impactColor(impact: InsightRow["impact"]) {
  if (impact === "High") return "var(--danger)";
  if (impact === "Medium") return "var(--warning)";
  return "var(--muted)";
}

function effortColor(effort: InsightRow["effort"]) {
  if (effort === "Low") return "var(--success)";
  if (effort === "Medium") return "var(--warning)";
  return "var(--muted)";
}

function statusColor(status: InsightRow["status"]) {
  if (status === "New") return "var(--brand)";
  if (status === "Approved") return "var(--success)";
  if (status === "Testing") return "var(--info)";
  return "var(--muted)";
}

export default function InsightScorePage() {
  const [chips, setChips] = useState<FilterChip[]>([
    { id: "highImpact", label: "High Impact", active: false },
    { id: "lowEffort", label: "Low Effort", active: false },
    { id: "aiGenerated", label: "AI Generated", active: false },
  ]);
  const [origin, setOrigin] = useState("All");
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null,
  });

  const kpis = [
    { label: "Active Insights", value: "34", delta: "+6%", tone: "positive" as const },
    { label: "Approved Insights", value: "12", delta: "+2", tone: "positive" as const },
    { label: "Avg. Time to Action", value: "11h", delta: "-1.2h", tone: "positive" as const },
    { label: "High Impact", value: "9", delta: undefined, tone: "neutral" as const },
    { label: "AI-Generated Insights", value: "4", delta: undefined, tone: "neutral" as const },
  ];

  const columns = [
    { key: "title", label: "Title" },
    { key: "origin", label: "Origin" },
    { key: "impact", label: "Impact" },
    { key: "effort", label: "Effort" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Created At" },
    { key: "actions", label: "Actions", align: "right" as const },
  ];

  const filteredRows = useMemo(() => {
    const activeChips = chips.filter((c) => c.active).map((c) => c.id);
    const query = search.trim().toLowerCase();

    return baseRows.filter((row) => {
      const matchHighImpact = activeChips.includes("highImpact") ? row.impact === "High" : true;
      const matchLowEffort = activeChips.includes("lowEffort") ? row.effort === "Low" : true;
      const matchAIGenerated = activeChips.includes("aiGenerated") ? row.aiGenerated : true;

      const matchOrigin = origin === "All" || row.origin === origin;
      const matchStatus = status === "All" || row.status === status;

      const matchSearch =
        query.length === 0 ||
        row.title.toLowerCase().includes(query) ||
        row.description.toLowerCase().includes(query) ||
        row.origin.toLowerCase().includes(query) ||
        row.status.toLowerCase().includes(query);

      const matchDate =
        !dateRange.from ||
        !dateRange.to ||
        (row.createdAtDate.getTime() >= dateRange.from.getTime() &&
          row.createdAtDate.getTime() <= dateRange.to.getTime());

      return matchHighImpact && matchLowEffort && matchAIGenerated && matchOrigin && matchStatus && matchSearch && matchDate;
    });
  }, [chips, origin, status, search, dateRange]);

  const isLoading = false;
  const isEmpty = filteredRows.length === 0 && !isLoading;

  const handleClear = () => {
    setChips((prev) => prev.map((c) => ({ ...c, active: false })));
    setOrigin("All");
    setStatus("All");
    setSearch("");
    setDateRange({ from: null, to: null });
  };

  const recentApprovals = [
    { title: "CTA localized for Oakland", time: "Approved 1d ago" },
    { title: "Pricing uplift for SF metro", time: "Approved 2d ago" },
  ];

  const iaOpportunities: { title: string; desc: string }[] = [];

  return (
    <div className="space-y-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
        Dashboard / Intelligence / InsightScore
      </p>

      <PageHeader
        title="InsightScore — Hypotheses Backlog"
        subtitle="Priorização inteligente de hipóteses através de impacto, esforço, origem e evidência IA."
        actions={
          <>
            <GhostButton onClick={() => console.log("insight → new")}>Create Insight</GhostButton>
            <GhostButton onClick={() => console.log("insight → export")}>Export</GhostButton>
            <GhostButton onClick={() => console.log("insight → ai_suggestions")}>AI Suggestions</GhostButton>
          </>
        }
      />

      <DashboardCard>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-[var(--ink)]">AI Signal</p>
            <p className="text-sm text-[var(--muted)]">
              A IA detectou um padrão: hipóteses de alto impacto vindas de Scout e Pricing aumentaram nas últimas 48h, principalmente em SF e NY.
              Considere priorizar estes testes em Paid e Builder.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <GhostButton onClick={() => console.log("insightscore → paid")}>
              Test in Paid
            </GhostButton>
            <GhostButton onClick={() => console.log("insightscore → builder")}>
              Apply in Builder
            </GhostButton>
            <GhostButton onClick={() => console.log("insightscore → market-twin")}>
              Compare Regions
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
        <ChartCard title="Impact vs Effort (last 30 days)">
          {isLoading ? (
            <Skeleton className="h-[160px] w-full" />
          ) : (
            <Skeleton className="h-[160px] w-full rounded-[var(--radius-sm)]" />
          )}
        </ChartCard>
        <ChartCard title="Insights by Status">
          {isLoading ? (
            <Skeleton className="h-[160px] w-full" />
          ) : (
            <Skeleton className="h-[160px] w-full rounded-[var(--radius-sm)]" />
          )}
        </ChartCard>
      </div>

      <SectionHeader
        title="Hypotheses Backlog"
        description="Insights priorizados por impacto, esforço, origem e status."
      />

      <FilterBar
        chips={chips}
        onChipToggle={(id) =>
          setChips((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)))
        }
        showSearch
        searchPlaceholder="Buscar por título, origem ou status"
        showDateRange
        onDateChange={(range) => setDateRange(range)}
        selects={[
          {
            id: "origin",
            label: "Origin",
            value: origin,
            options: ["All", "Scout", "AQUA", "Pricing", "Market Twin", "Paid", "SEO"],
            onChange: setOrigin,
          },
          {
            id: "status",
            label: "Status",
            value: status,
            options: ["All", "New", "Approved", "Testing", "Done"],
            onChange: setStatus,
          },
        ]}
        extra={<GhostButton onClick={() => console.log("insight → new")}>Create Insight</GhostButton>}
        onClear={handleClear}
      />

      {isLoading ? (
        <Skeleton className="h-[260px] w-full rounded-[var(--radius-md)]" />
      ) : isEmpty ? (
        <EmptyState
          title="Nenhum insight encontrado"
          description="Ajuste filtragem ou crie insights manuais."
          action={<GhostButton onClick={() => console.log("insight → new")}>Create Insight</GhostButton>}
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
            effort: (
              <span
                className="rounded-full px-2 py-1 text-xs font-semibold"
                style={{ backgroundColor: "var(--surface-muted)", color: effortColor(row.effort) }}
              >
                {row.effort}
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
            createdAt: row.createdAt,
            actions: (
              <div className="flex flex-wrap items-center justify-end gap-2">
                <GhostButton aria-label="View" onClick={() => console.log("insight → view", row)}>
                  View
                </GhostButton>
                <GhostButton aria-label="Approve" onClick={() => console.log("insight → approve", row)}>
                  Approve
                </GhostButton>
                <GhostButton aria-label="Apply in Builder" onClick={() => console.log("insight → builder", row)}>
                  Apply in Builder
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
          <p className="text-sm font-semibold text-[var(--ink)]">Recent Approvals</p>
          <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
            {recentApprovals.map((item) => (
              <li key={item.title} className="flex itemscenter justify-between">
                <span>{item.title}</span>
                <span className="rounded-full bg-[var(--surface-muted)] px-2 py-1 text-xs font-semibold text-[var(--success)]">
                  {item.time}
                </span>
              </li>
            ))}
          </ul>
        </DashboardCard>

        <DashboardCard>
          <p className="text-sm font-semibold text-[var(--ink)]">IA Opportunities</p>
          {iaOpportunities.length === 0 ? (
            <EmptyState
              title="Nenhuma oportunidade detectada"
              description="Gere novos insights ou aguarde mais sinais."
              action={<GhostButton onClick={() => console.log("insight → new")}>Generate Insight</GhostButton>}
            />
          ) : (
            <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
              {iaOpportunities.map((item) => (
                <li key={item.title} className="flex items-center justify-between">
                  <span>{item.title}</span>
                  <span className="text-xs text-[var(--muted)]">{item.desc}</span>
                </li>
              ))}
            </ul>
          )}
        </DashboardCard>
      </div>

      <DashboardCard>
        <p className="text-sm font-semibold text-[var(--ink)]">Cross-links CREALEPH</p>
        <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
          <li>AQUA → aplicar copy sugerida em LPs.</li>
          <li>Scout → usar eventos que originaram hipóteses.</li>
          <li>Pricing Regional → testar faixas de preço sugeridas.</li>
          <li>Market Twin → validar posicionamento por região.</li>
          <li>Builder → aplicar hipóteses em páginas reais.</li>
          <li>Paid/SEO → medir impacto das hipóteses em campanhas.</li>
        </ul>
      </DashboardCard>
    </div>
  );
}
