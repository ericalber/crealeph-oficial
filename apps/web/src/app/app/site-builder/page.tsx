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
import { eventBus, publishEvent } from "@/lib/crealeph/event-bus";

function GhostButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="inline-flex h-9 items-center justify-center rounded-[var(--radius-sm)] border px-3 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
      style={{ borderColor: "var(--line)" }}
    />
  );
}

type TemplateCard = {
  title: string;
  tags: string[];
  category: "Landing" | "Pricing" | "Hero" | "Testimonials" | "CTAs";
  device: "Desktop" | "Mobile";
  badge: "High CTR" | "AI-Optimized" | null;
  createdAtDate: Date;
};

type DraftRow = {
  draftName: string;
  updatedAt: string;
  updatedAtDate: Date;
  templateUsed: string;
};

type PublishRow = {
  page: string;
  template: string;
  publishedAt: string;
  publishedAtDate: Date;
  status: "success" | "warning" | "failed";
};

const templateCards: TemplateCard[] = [
  {
    title: "SF High-CTR Landing",
    tags: ["Landing", "US Market", "Bay Area"],
    category: "Landing",
    device: "Desktop",
    badge: "High CTR",
    createdAtDate: new Date("2025-01-10"),
  },
  {
    title: "Pricing Matrix Pro",
    tags: ["Pricing", "Commercial"],
    category: "Pricing",
    device: "Desktop",
    badge: "AI-Optimized",
    createdAtDate: new Date("2025-01-08"),
  },
  {
    title: "Hero AQUA Variant",
    tags: ["Hero", "AQUA", "Copy"],
    category: "Hero",
    device: "Mobile",
    badge: "AI-Optimized",
    createdAtDate: new Date("2025-01-11"),
  },
  {
    title: "Testimonials Grid",
    tags: ["Testimonials", "Social Proof"],
    category: "Testimonials",
    device: "Desktop",
    badge: null,
    createdAtDate: new Date("2025-01-09"),
  },
  {
    title: "CTA Bay Area",
    tags: ["CTAs", "Bay Area", "Conversion"],
    category: "CTAs",
    device: "Mobile",
    badge: "High CTR",
    createdAtDate: new Date("2025-01-12"),
  },
];

const drafts: DraftRow[] = [
  {
    draftName: "LA Landing v2",
    updatedAt: "2h ago",
    updatedAtDate: new Date("2025-01-13T07:30:00"),
    templateUsed: "SF High-CTR Landing",
  },
  {
    draftName: "NY Pricing Pack",
    updatedAt: "8h ago",
    updatedAtDate: new Date("2025-01-13T01:00:00"),
    templateUsed: "Pricing Matrix Pro",
  },
  {
    draftName: "Mobile Hero Revamp",
    updatedAt: "1d ago",
    updatedAtDate: new Date("2025-01-12T10:00:00"),
    templateUsed: "Hero AQUA Variant",
  },
];

const publishHistory: PublishRow[] = [
  {
    page: "SF Home Cleaning",
    template: "SF High-CTR Landing",
    publishedAt: "Jan 12, 2025",
    publishedAtDate: new Date("2025-01-12"),
    status: "success",
  },
  {
    page: "LA Commercial",
    template: "Pricing Matrix Pro",
    publishedAt: "Jan 10, 2025",
    publishedAtDate: new Date("2025-01-10"),
    status: "warning",
  },
  {
    page: "NY Loft Landing",
    template: "Hero AQUA Variant",
    publishedAt: "Jan 8, 2025",
    publishedAtDate: new Date("2025-01-08"),
    status: "failed",
  },
];

function publishStatusColor(status: PublishRow["status"]) {
  if (status === "success") return "var(--success)";
  if (status === "warning") return "var(--warning)";
  return "var(--danger)";
}

export default function SiteBuilderPage() {
  const [chips, setChips] = useState<FilterChip[]>([
    { id: "Landing", label: "Landing", active: false },
    { id: "Pricing", label: "Pricing", active: false },
    { id: "Hero", label: "Hero", active: false },
    { id: "Testimonials", label: "Testimonials", active: false },
    { id: "CTAs", label: "CTAs", active: false },
  ]);
  const [category, setCategory] = useState("All");
  const [device, setDevice] = useState("All");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });
  const [previewDevice, setPreviewDevice] = useState<"Desktop" | "Mobile">("Desktop");

  const kpis = [
    { label: "Live Pages", value: "18", delta: "+3", tone: "positive" as const },
    { label: "Avg. Publish Time", value: "11s", delta: "-2s", tone: "positive" as const },
    { label: "CTR Boost (AQUA)", value: "+12%", delta: "+4%", tone: "positive" as const },
    { label: "Templates Available", value: "36", delta: "=", tone: "neutral" as const },
    { label: "Pending Drafts", value: "7", delta: "+1", tone: "negative" as const },
  ];

  const templateColumns = [
    { key: "draftName", label: "Draft" },
    { key: "templateUsed", label: "Template" },
    { key: "updatedAt", label: "Updated At" },
    { key: "actions", label: "Actions", align: "right" as const },
  ];

  const historyColumns = [
    { key: "page", label: "Page" },
    { key: "template", label: "Template" },
    { key: "publishedAt", label: "Published At" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions", align: "right" as const },
  ];

  const filteredTemplates = useMemo(() => {
    const activeChips = chips.filter((c) => c.active).map((c) => c.id);
    const q = search.trim().toLowerCase();

    return templateCards.filter((tpl) => {
      const matchChip = activeChips.length === 0 || activeChips.includes(tpl.category);
      const matchCategory = category === "All" || tpl.tags.includes(category);
      const matchDevice = device === "All" || tpl.device === device;
      const matchSearch =
        q.length === 0 ||
        tpl.title.toLowerCase().includes(q) ||
        tpl.tags.some((t) => t.toLowerCase().includes(q));
      const matchDate =
        !dateRange.from ||
        !dateRange.to ||
        (tpl.createdAtDate.getTime() >= dateRange.from.getTime() &&
          tpl.createdAtDate.getTime() <= dateRange.to.getTime());

      return matchChip && matchCategory && matchDevice && matchSearch && matchDate;
    });
  }, [chips, category, device, search, dateRange]);

  const isLoading = false;
  const emptyTemplates = filteredTemplates.length === 0;

  const handleClearFilters = () => {
    setChips((prev) => prev.map((c) => ({ ...c, active: false })));
    setCategory("All");
    setDevice("All");
    setSearch("");
    setDateRange({ from: null, to: null });
  };

  const draftsRows = drafts.map((draft, index) => ({
    ...draft,
    actions: (
      <div className="flex flex-wrap items-center justify-end gap-2">
        <GhostButton aria-label="Continue Editing" onClick={() => publishEvent({ type: "builder.template.used", source: "site-builder", payload: { action: "draft_continue", draft } })}>
          Continue Editing
        </GhostButton>
        <GhostButton aria-label="Publish Draft" onClick={() => publishEvent({ type: "builder.page.published", source: "site-builder", payload: { action: "draft_publish", draft } })}>
          Publish
        </GhostButton>
        <GhostButton aria-label="Delete Draft" onClick={() => publishEvent({ type: "custom", source: "site-builder", payload: { action: "draft_delete", draft } })}>
          Delete
        </GhostButton>
      </div>
    ),
    key: `${draft.draftName}-${index}`,
  }));

  const historyRows = publishHistory.map((item, index) => ({
    ...item,
    status: (
      <span
        className="rounded-full px-2 py-1 text-xs font-semibold"
        style={{ backgroundColor: "var(--surface-muted)", color: publishStatusColor(item.status) }}
      >
        {item.status}
      </span>
    ),
    actions: (
      <div className="flex flex-wrap items-center justify-end gap-2">
        <GhostButton aria-label="View Logs" onClick={() => publishEvent({ type: "report.generated", source: "site-builder", payload: { action: "view_logs", item } })}>
          View Logs
        </GhostButton>
        <GhostButton aria-label="Revert" onClick={() => publishEvent({ type: "builder.page.published", source: "site-builder", payload: { action: "revert_publish", item } })}>
          Revert
        </GhostButton>
      </div>
    ),
    key: `${item.page}-${index}`,
  }));

  return (
    <div className="space-y-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
        Dashboard / Builder / Site Builder
      </p>

      <PageHeader
        title="Site Builder"
        subtitle="Modular page creation with templates, blocks and AI-assisted publishing."
        actions={
          <>
            <GhostButton onClick={() => publishEvent({ type: "builder.page.published", source: "site-builder", payload: { action: "create_page" } })}>
              Create Page
            </GhostButton>
            <GhostButton onClick={() => publishEvent({ type: "builder.template.used", source: "site-builder", payload: { action: "new_template" } })}>
              New Template
            </GhostButton>
            <GhostButton onClick={() => publishEvent({ type: "builder.page.published", source: "site-builder", payload: { action: "publish_changes" } })}>
              Publish Changes
            </GhostButton>
          </>
        }
      />

      <DashboardCard>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-[var(--ink)]">AI Signal</p>
            <p className="text-sm text-[var(--muted)]">
              AI detected that templates using AQUA-based copy and Bay Area targeting increased CTR by +12%. Consider applying these patterns to new pages and testing in Paid/SEO.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <GhostButton onClick={() => publishEvent({ type: "builder.template.used", source: "site-builder", payload: { action: "apply_aqua_copy" } })}>
              Apply AQUA Copy
            </GhostButton>
            <GhostButton onClick={() => publishEvent({ type: "builder.template.used", source: "site-builder", payload: { action: "generate_template_variant" } })}>
              Generate Template Variant
            </GhostButton>
            <GhostButton onClick={() => publishEvent({ type: "markettwin.region.updated", source: "site-builder", payload: { action: "compare_regions" } })}>
              Compare Regions
            </GhostButton>
          </div>
        </div>
      </DashboardCard>

      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-[96px]" />)
          : kpis.map((kpi) => (
              <KPICard key={kpi.label} label={kpi.label} value={kpi.value} delta={kpi.delta} tone={kpi.tone} />
            ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Performance by Template" subtitle="CTR/CVR by template category">
          {isLoading ? (
            <Skeleton className="h-[160px] w-full" />
          ) : (
            <Skeleton className="h-[160px] w-full rounded-[var(--radius-sm)]" />
          )}
        </ChartCard>
        <ChartCard title="CTR/CVR (last 30d)" subtitle="AI-assisted uplift from AQUA-driven copy">
          {isLoading ? (
            <Skeleton className="h-[160px] w-full" />
          ) : (
            <Skeleton className="h-[160px] w-full rounded-[var(--radius-sm)]" />
          )}
        </ChartCard>
      </div>

      <SectionHeader
        title="Templates & Blocks Library"
        description="Modular templates, components and blocks ready for cross-channel experiments."
        actions={
          <div className="flex flex-wrap gap-2">
            <GhostButton onClick={() => publishEvent({ type: "custom", source: "site-builder", payload: { action: "new_category" } })}>
              New Category
            </GhostButton>
            <GhostButton onClick={() => publishEvent({ type: "custom", source: "site-builder", payload: { action: "import_template_pack" } })}>
              Import Template Pack
            </GhostButton>
          </div>
        }
      />

      <FilterBar
        chips={chips}
        onChipToggle={(id) => setChips((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)))}
        showSearch
        searchPlaceholder="Search by title, tags or components"
        showDateRange
        onDateChange={setDateRange}
        selects={[
          {
            id: "category",
            label: "Category",
            value: category,
            options: ["All", "Cleaning", "Commercial", "Residential", "US Market", "Bay Area"],
            onChange: setCategory,
          },
          {
            id: "device",
            label: "Device",
            value: device,
            options: ["All", "Desktop", "Mobile"],
            onChange: setDevice,
          },
        ]}
        extra={<GhostButton onClick={() => publishEvent({ type: "builder.template.used", source: "site-builder", payload: { action: "create_template" } })}>Create Template</GhostButton>}
        onClear={handleClearFilters}
      />

      {isLoading ? (
        <Skeleton className="h-[260px] w-full rounded-[var(--radius-md)]" />
      ) : emptyTemplates ? (
        <EmptyState
          title="No templates found"
          description="Try a different filter or create your first template."
          action={<GhostButton onClick={() => publishEvent({ type: "builder.template.used", source: "site-builder", payload: { action: "create_template" } })}>Create Template</GhostButton>}
        />
      ) : (
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
        >
          {filteredTemplates.map((tpl) => (
            <DashboardCard key={tpl.title} className="space-y-3">
              <div className="h-32 w-full rounded-[var(--radius-sm)] bg-[var(--surface-muted)]" />
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-[var(--ink)]">{tpl.title}</p>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-[var(--muted)]">
                    {tpl.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-[var(--radius-sm)] bg-[var(--surface-muted)] px-2 py-1"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                {tpl.badge ? (
                  <span className="rounded-full bg-[var(--surface-muted)] px-2 py-1 text-xs font-semibold text-[var(--brand)]">
                    {tpl.badge}
                  </span>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2">
                <GhostButton onClick={() => publishEvent({ type: "builder.template.used", source: "site-builder", payload: { action: "edit_template", tpl } })}>Edit</GhostButton>
                <GhostButton onClick={() => publishEvent({ type: "builder.template.used", source: "site-builder", payload: { action: "duplicate_template", tpl } })}>Duplicate</GhostButton>
                <GhostButton onClick={() => publishEvent({ type: "builder.page.published", source: "site-builder", payload: { action: "publish_template", tpl } })}>Publish</GhostButton>
              </div>
            </DashboardCard>
          ))}
        </div>
      )}

      <Divider />

      <SectionHeader title="Editor" description="Assemble pages with blocks and preview in real time." />

      <div className="grid gap-4 lg:grid-cols-2">
        <DashboardCard>
          <p className="text-sm font-semibold text-[var(--ink)]">Blocks</p>
          <div className="mt-2 space-y-2 text-sm text-[var(--muted)]">
            {["Hero blocks", "Feature blocks", "Testimonials", "Pricing blocks", "Footer"].map((block) => (
              <div
                key={block}
                className="flex items-center justify-between rounded-[var(--radius-sm)] border px-3 py-2"
                style={{ borderColor: "var(--line)" }}
              >
                <span>{block}</span>
                <div className="flex gap-2">
                  <GhostButton onClick={() => publishEvent({ type: "builder.template.used", source: "site-builder", payload: { action: "block_edit", block } })} aria-label="Edit">
                    Edit
                  </GhostButton>
                  <GhostButton onClick={() => publishEvent({ type: "builder.template.used", source: "site-builder", payload: { action: "block_move", block } })} aria-label="Move">
                    Move
                  </GhostButton>
                  <GhostButton onClick={() => publishEvent({ type: "builder.template.used", source: "site-builder", payload: { action: "block_replace", block } })} aria-label="Replace">
                    Replace
                  </GhostButton>
                  <GhostButton onClick={() => publishEvent({ type: "builder.template.used", source: "site-builder", payload: { action: "block_delete", block } })} aria-label="Delete">
                    Delete
                  </GhostButton>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[var(--ink)]">Preview</p>
            <div className="flex gap-2">
              <GhostButton
                onClick={() => {
                  setPreviewDevice("Desktop");
                  publishEvent({ type: "builder.template.used", source: "site-builder", payload: { action: "preview_desktop" } });
                }}
                aria-label="Desktop"
              >
                Desktop
              </GhostButton>
              <GhostButton
                onClick={() => {
                  setPreviewDevice("Mobile");
                  publishEvent({ type: "builder.template.used", source: "site-builder", payload: { action: "preview_mobile" } });
                }}
                aria-label="Mobile"
              >
                Mobile
              </GhostButton>
            </div>
          </div>
          <div
            className="mt-3 rounded-[var(--radius-md)] border bg-[var(--surface-muted)] p-4"
            style={{ borderColor: "var(--line)" }}
          >
            <p className="text-sm text-[var(--muted)]">Preview ({previewDevice})</p>
            <div className="mt-2 h-40 rounded-[var(--radius-sm)] border border-dashed" style={{ borderColor: "var(--line)" }} />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <GhostButton onClick={() => publishEvent({ type: "builder.template.used", source: "site-builder", payload: { action: "apply_aqua_copy_preview" } })}>
              Apply AQUA Copy
            </GhostButton>
            <GhostButton onClick={() => publishEvent({ type: "builder.template.used", source: "site-builder", payload: { action: "save_draft" } })}>
              Save Draft
            </GhostButton>
            <GhostButton onClick={() => publishEvent({ type: "builder.page.published", source: "site-builder", payload: { action: "publish_preview" } })}>
              Publish
            </GhostButton>
          </div>
        </DashboardCard>
      </div>

      <Divider />

      <SectionHeader title="Drafts" description="Continue where you left off." />

      {drafts.length === 0 ? (
        <EmptyState
          title="No drafts found"
          description="Try a different filter or create your first template."
          action={<GhostButton onClick={() => publishEvent({ type: "builder.template.used", source: "site-builder", payload: { action: "create_template" } })}>Create Template</GhostButton>}
        />
      ) : (
        <DataTable columns={templateColumns} rows={draftsRows} />
      )}

      <SectionHeader title="Publish History" description="Publication history and status." />

      <DataTable columns={historyColumns} rows={historyRows} />

      <Divider />

      <DashboardCard>
        <p className="text-sm font-semibold text-[var(--ink)]">Cross-links CREALEPH</p>
        <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
          <li onClick={() => publishEvent({ type: "aqua.message.applied", source: "site-builder", payload: { action: "crosslink_aqua" } })}>AQUA → generate city-based copy</li>
          <li onClick={() => publishEvent({ type: "scout.alert.created", source: "site-builder", payload: { action: "crosslink_scout" } })}>Scout → competitors changing landing pages</li>
          <li onClick={() => publishEvent({ type: "pricing.region.updated", source: "site-builder", payload: { action: "crosslink_pricing" } })}>Pricing → update LP pricing automatically</li>
          <li onClick={() => publishEvent({ type: "paid.campaign.updated", source: "site-builder", payload: { action: "crosslink_paid" } })}>Paid → connect campaigns to published LPs</li>
          <li onClick={() => publishEvent({ type: "seo.keyword.updated", source: "site-builder", payload: { action: "crosslink_seo" } })}>SEO → apply CWV-friendly structure</li>
        </ul>
      </DashboardCard>
    </div>
  );
}
