"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/dashboard/layout/PageHeader";
import { SectionHeader } from "@/components/dashboard/layout/SectionHeader";
import { KPICard } from "@/components/dashboard/cards/KPICard";
import { DashboardCard } from "@/components/dashboard/cards/DashboardCard";
import { DataTable } from "@/components/dashboard/data/DataTable";
import { FilterBar, type FilterChip } from "@/components/dashboard/data/FilterBar";
import { Divider } from "@/components/dashboard/sections/Divider";
import { GhostButton } from "@/components/ui/GhostButton";

type Robot = {
  id: string;
  name: string;
  type: string;
  status: string;
  createdAt?: string;
};

const kpis = [
  { label: "Active robots", value: "—", delta: "", tone: "neutral" as const },
  { label: "Runs today", value: "—", delta: "", tone: "neutral" as const },
  { label: "Errors", value: "—", delta: "", tone: "neutral" as const },
  { label: "Templates applied", value: "—", delta: "", tone: "neutral" as const },
];

export default function RobotsPage() {
  const [chips, setChips] = useState<FilterChip[]>([
    { id: "active", label: "Active", active: false },
    { id: "paused", label: "Paused", active: false },
    { id: "deleted", label: "Deleted", active: false },
  ]);
  const [search, setSearch] = useState("");
  const [robots, setRobots] = useState<Robot[]>([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    { key: "name", label: "Name" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Created At" },
    { key: "actions", label: "Actions", align: "right" as const },
  ];

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await fetch("/api/robots/list");
      const json = await res.json().catch(() => null);
      setRobots(json?.data ?? []);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const active = chips.filter((c) => c.active).map((c) => c.id);
    const q = search.trim().toLowerCase();
    return robots.filter((r) => {
      const statusKey = r.status.toLowerCase();
      const statusMatch = active.length === 0 || active.includes(statusKey);
      const searchMatch =
        q.length === 0 ||
        r.name.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q);
      return statusMatch && searchMatch;
    });
  }, [chips, search, robots]);

  const handleRun = async (id: string) => {
    await fetch("/api/robots/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  };

  const handleDelete = async (id: string) => {
    await fetch("/api/robots/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setRobots((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Robots"
        subtitle="Manage Parasite, Ideator, Copywriter and custom agents."
        actions={
          <>
            <Link href="/app/robots/parasite/create" className="btn btn-primary">
              New Parasite Bot
            </Link>
            <Link href="/app/robots/templates" className="btn btn-secondary">
              Templates
            </Link>
          </>
        }
      />

      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}
      >
        {kpis.map((kpi) => (
          <KPICard key={kpi.label} label={kpi.label} value={kpi.value} delta={kpi.delta} tone={kpi.tone} />
        ))}
      </div>

      <SectionHeader
        title="Robots list"
        description="All active and paused robots in your workspace."
      />

      <FilterBar
        chips={chips}
        onChipToggle={(id) => setChips((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)))}
        showSearch
        searchPlaceholder="Search by name or type"
        selects={[]}
        onClear={() => {
          setChips((prev) => prev.map((c) => ({ ...c, active: false })));
          setSearch("");
        }}
        extra={<GhostButton asChild><Link href="/app/robots/parasite/create">Create bot</Link></GhostButton>}
      />

      <DataTable
        columns={columns}
        rows={filtered.map((row) => ({
          ...row,
          createdAt: row.createdAt ? new Date(row.createdAt).toLocaleString() : "",
          actions: (
            <div className="flex flex-wrap items-center justify-end gap-2">
              <GhostButton asChild>
                <Link href={`/app/robots/${row.id}`}>Open</Link>
              </GhostButton>
              <GhostButton onClick={() => handleRun(row.id)}>Run</GhostButton>
              <GhostButton onClick={() => handleDelete(row.id)} className="text-[var(--danger)]">
                Delete
              </GhostButton>
            </div>
          ),
        }))}
      />

      {loading ? <p className="text-sm text-[var(--muted)]">Loading...</p> : null}

      <Divider />

      <DashboardCard>
        <p className="text-sm font-semibold text-[var(--ink)]">Templates hub</p>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Browse extraction and execution templates to accelerate your robots.
        </p>
        <div className="mt-3 flex gap-2">
          <GhostButton asChild>
            <Link href="/app/robots/templates">Open templates</Link>
          </GhostButton>
          <GhostButton asChild>
            <Link href="/app/robots/parasite/create">Create Parasite Bot</Link>
          </GhostButton>
        </div>
      </DashboardCard>
    </div>
  );
}
