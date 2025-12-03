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

type RegionRow = {
  region: "San Francisco" | "San Jose" | "Oakland" | "Los Angeles" | "New York" | "Miami";
  product: "Home Cleaning" | "Office Cleaning" | "Deep Cleaning";
  p25: number;
  p50: number;
  p75: number;
  variation: string;
  lastUpdate: string;
  lastUpdateDate: Date;
};

const baseRows: RegionRow[] = [
  {
    region: "San Francisco",
    product: "Home Cleaning",
    p25: 140,
    p50: 165,
    p75: 210,
    variation: "+4.2%",
    lastUpdate: "12h ago",
    lastUpdateDate: new Date("2025-01-13T08:00:00"),
  },
  {
    region: "San Jose",
    product: "Office Cleaning",
    p25: 155,
    p50: 185,
    p75: 230,
    variation: "+3.1%",
    lastUpdate: "1d ago",
    lastUpdateDate: new Date("2025-01-12T10:30:00"),
  },
  {
    region: "Oakland",
    product: "Home Cleaning",
    p25: 125,
    p50: 150,
    p75: 190,
    variation: "+1.8%",
    lastUpdate: "2d ago",
    lastUpdateDate: new Date("2025-01-11T09:15:00"),
  },
  {
    region: "Los Angeles",
    product: "Deep Cleaning",
    p25: 180,
    p50: 210,
    p75: 260,
    variation: "+5.5%",
    lastUpdate: "3d ago",
    lastUpdateDate: new Date("2025-01-10T14:00:00"),
  },
  {
    region: "New York",
    product: "Home Cleaning",
    p25: 170,
    p50: 200,
    p75: 255,
    variation: "-1.2%",
    lastUpdate: "4d ago",
    lastUpdateDate: new Date("2025-01-09T16:30:00"),
  },
  {
    region: "Miami",
    product: "Office Cleaning",
    p25: 130,
    p50: 160,
    p75: 200,
    variation: "+0.6%",
    lastUpdate: "5d ago",
    lastUpdateDate: new Date("2025-01-08T11:45:00"),
  },
];

function parseVariation(value: string) {
  const num = parseFloat(value.replace("%", "").replace(",", "."));
  return Number.isFinite(num) ? num : 0;
}

export default function PricingRegionalPage() {
  const [chips, setChips] = useState<FilterChip[]>([
    { id: "p25", label: "Low P25", active: false },
    { id: "p50", label: "Mid P50", active: false },
    { id: "p75", label: "High P75", active: false },
    { id: "variation", label: "Positive variation", active: false },
  ]);
  const [region, setRegion] = useState("All");
  const [product, setProduct] = useState("All");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null,
  });

  const kpis = [
    { label: "Regions monitored", value: "6", delta: "+2", tone: "positive" as const },
    { label: "Average variation", value: "+2.3%", delta: "+0.4%", tone: "positive" as const },
    { label: "Median ticket (P50)", value: "$178", delta: "+$6", tone: "positive" as const },
    { label: "Highest P75", value: "$260", delta: "+$15", tone: "positive" as const },
    { label: "Lowest P25", value: "$125", delta: "-$4", tone: "neutral" as const },
  ];

  const columns = [
    { key: "region", label: "Region" },
    { key: "product", label: "Product" },
    { key: "p25", label: "P25" },
    { key: "p50", label: "P50 (Median)" },
    { key: "p75", label: "P75" },
    { key: "variation", label: "Variation (%)" },
    { key: "lastUpdate", label: "Last Update" },
    { key: "actions", label: "Actions", align: "right" as const },
  ];

  const filteredRows = useMemo(() => {
    const active = chips.filter((c) => c.active).map((c) => c.id);
    const q = search.trim().toLowerCase();

    return baseRows.filter((row) => {
      const varNum = parseVariation(row.variation);

      const chipMatch =
        active.length === 0 ||
        active.some((chip) => {
          if (chip === "p25") return row.p25 <= 140;
          if (chip === "p50") return row.p50 >= 160 && row.p50 <= 190;
          if (chip === "p75") return row.p75 >= 220;
          if (chip === "variation") return varNum > 0;
          return true;
        });

      const regionMatch = region === "All" || row.region === region;
      const productMatch = product === "All" || row.product === product;

      const searchMatch =
        q.length === 0 ||
        row.region.toLowerCase().includes(q) ||
        row.product.toLowerCase().includes(q) ||
        row.variation.toLowerCase().includes(q) ||
        row.p25.toString().includes(q) ||
        row.p50.toString().includes(q) ||
        row.p75.toString().includes(q);

      const dateMatch =
        !dateRange.from ||
        !dateRange.to ||
        (row.lastUpdateDate.getTime() >= dateRange.from.getTime() &&
          row.lastUpdateDate.getTime() <= dateRange.to.getTime());

      return chipMatch && regionMatch && productMatch && searchMatch && dateMatch;
    });
  }, [chips, region, product, search, dateRange]);

  const isLoading = false;
  const isEmpty = filteredRows.length === 0 && !isLoading;

  const handleClear = () => {
    setChips((prev) => prev.map((c) => ({ ...c, active: false })));
    setRegion("All");
    setProduct("All");
    setSearch("");
    setDateRange({ from: null, to: null });
  };

  const growthRegions = filteredRows.filter((row) => parseVariation(row.variation) > 0);
  const criticalRegions = filteredRows.filter((row) => parseVariation(row.variation) < 0);

  return (
    <div className="space-y-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
        Dashboard / Market / Pricing Regional
      </p>

      <PageHeader
        title="Pricing Regional"
        subtitle="Regional analysis of price bands (P25/P50/P75), variation and competitive impact across US markets."
        actions={
          <>
            <GhostButton onClick={() => console.log("pricing → export", { scope: "csv" })}>
              Export CSV
            </GhostButton>
            <GhostButton onClick={() => console.log("pricing → simulate", { source: "header" })}>
              Simulate Price
            </GhostButton>
            <GhostButton onClick={() => console.log("pricing → builder", { source: "header" })}>
              Apply in Builder
            </GhostButton>
          </>
        }
      />

      <DashboardCard>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-[var(--ink)]">AI Signal</p>
            <p className="text-sm text-[var(--muted)]">
              AI detected above-average price growth in San Francisco, San Jose and Los Angeles, while New York shows slight decline.
              Consider testing new price bands and updating LPs for these regions.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <GhostButton onClick={() => console.log("pricing → insightscore", { pattern: "growth_cluster" })}>
              Generate insight
            </GhostButton>
            <GhostButton onClick={() => console.log("pricing → market-twin", { pattern: "compare_regions" })}>
              Compare in Market Twin
            </GhostButton>
            <GhostButton onClick={() => console.log("pricing → builder", { pattern: "apply_suggested_price" })}>
              Apply suggested price
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
        <ChartCard title="P25/P50/P75 per region" subtitle="Distribution of price bands across metro areas">
          {isLoading ? (
            <Skeleton className="h-[160px] w-full" />
          ) : (
            <Skeleton className="h-[160px] w-full rounded-[var(--radius-sm)]" />
          )}
        </ChartCard>
        <ChartCard title="Price variation over time" subtitle="Last 30 days variation per region">
          {isLoading ? (
            <Skeleton className="h-[160px] w-full" />
          ) : (
            <Skeleton className="h-[160px] w-full rounded-[var(--radius-sm)]" />
          )}
        </ChartCard>
      </div>

      <SectionHeader
        title="Price bands by region"
        description="Percentile bands (P25/P50/P75) and variation monitored by CREALEPH."
        actions={
          <GhostButton onClick={() => console.log("pricing → simulate", { source: "section_header" })}>
            Quick simulate
          </GhostButton>
        }
      />

      <FilterBar
        chips={chips}
        onChipToggle={(id) =>
          setChips((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)))
        }
        showSearch
        searchPlaceholder="Search by region, product, band or variation"
        showDateRange
        onDateChange={(range) => setDateRange(range)}
        selects={[
          {
            id: "region",
            label: "Region",
            value: region,
            options: ["All", "San Francisco", "San Jose", "Oakland", "Los Angeles", "New York", "Miami"],
            onChange: setRegion,
          },
          {
            id: "product",
            label: "Product/Service",
            value: product,
            options: ["All", "Home Cleaning", "Office Cleaning", "Deep Cleaning"],
            onChange: setProduct,
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
                aria-label="Search by region or band"
                placeholder="Search by region, variation or percentile"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-sm text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none"
              />
            </div>
            <GhostButton onClick={() => console.log("pricing → add_region")}>Add region</GhostButton>
          </div>
        }
        onClear={handleClear}
      />

      {isLoading ? (
        <Skeleton className="h-[260px] w-full rounded-[var(--radius-md)]" />
      ) : isEmpty ? (
        <EmptyState
          title="No regions found"
          description="Adjust filters or add new areas manually."
          action={<GhostButton onClick={() => console.log("pricing → add_region")}>Add region</GhostButton>}
        />
      ) : (
        <DataTable
          columns={columns}
          rows={filteredRows.map((row, index) => {
            const variationNum = parseVariation(row.variation);
            const variationColor =
              variationNum > 0 ? "var(--success)" : variationNum < 0 ? "var(--danger)" : "var(--muted)";

            return {
              ...row,
              p25: `$${row.p25}`,
              p50: `$${row.p50}`,
              p75: `$${row.p75}`,
              variation: (
                <span
                  className="rounded-full px-2 py-1 text-xs font-semibold"
                  style={{ backgroundColor: "var(--surface-muted)", color: variationColor }}
                >
                  {row.variation}
                </span>
              ),
              actions: (
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <GhostButton
                    aria-label="Simulate"
                    onClick={() => console.log("pricing-row → simulate", row)}
                  >
                    Simulate
                  </GhostButton>
                  <GhostButton
                    aria-label="Details"
                    onClick={() => console.log("pricing-row → details", row)}
                  >
                    Details
                  </GhostButton>
                  <GhostButton
                    aria-label="Apply in Builder"
                    onClick={() => console.log("pricing-row → builder", row)}
                  >
                    Apply in Builder
                  </GhostButton>
                </div>
              ),
              key: `${row.region}-${row.product}-${index}`,
            };
          })}
        />
      )}

      <Divider />

      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard>
          <p className="text-sm font-semibold text-[var(--ink)]">Regions with strongest growth</p>
          {growthRegions.length === 0 ? (
            <EmptyState
              title="No growth regions"
              description="No regions with positive price variation in the selected period."
            />
          ) : (
            <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
              {growthRegions.map((item, i) => (
                <li key={`${item.region}-${i}`} className="flex items-center justify-between">
                  <span>
                    {item.region} — {item.product}
                  </span>
                  <span className="rounded-full bg-[var(--surface-muted)] px-2 py-1 text-xs font-semibold text-[var(--success)]">
                    {item.variation}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </DashboardCard>

        <DashboardCard>
          <p className="text-sm font-semibold text-[var(--ink)]">Critical regions</p>
          {criticalRegions.length === 0 ? (
            <EmptyState
              title="No critical regions"
              description="No regions with negative price variation in the selected period."
            />
          ) : (
            <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
              {criticalRegions.map((item, i) => (
                <li key={`${item.region}-${i}`} className="flex items-center justify-between">
                  <span>
                    {item.region} — {item.product}
                  </span>
                  <span className="rounded-full bg-[var(--surface-muted)] px-2 py-1 text-xs font-semibold text-[var(--danger)]">
                    {item.variation}
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
          <li>Market Twin → correlate price bands with SOV and approval per region.</li>
          <li>Scout → monitor competitor price changes that affect these bands.</li>
          <li>InsightScore → generate pricing hypotheses and prioritize tests.</li>
          <li>Paid → adjust campaign bidding and audience by region and ticket size.</li>
          <li>Site Builder → update landing pages with optimized prices for each market.</li>
        </ul>
      </DashboardCard>
    </div>
  );
}
