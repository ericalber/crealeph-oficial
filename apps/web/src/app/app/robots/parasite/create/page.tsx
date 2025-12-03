"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { PageHeader } from "@/components/dashboard/layout/PageHeader";
import { DashboardCard } from "@/components/dashboard/cards/DashboardCard";
import { Divider } from "@/components/dashboard/sections/Divider";

type Template = {
  id: string;
  name: string;
  type: string;
  description?: string;
  config?: any;
  vertical?: { slug: string; name: string } | null;
};

const niches = [
  "Cleaning",
  "Delivery",
  "Real Estate",
  "Retail",
  "Startups",
  "SaaS",
  "Health & Wellness",
  "Legal",
  "Home Services",
  "Finance",
  "Automotive",
  "Other",
];

const modes = ["Conversion signals", "Price signals", "Trend signals", "Experience signals"];

export default function ParasiteCreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("templateId");
  const [template, setTemplate] = useState<Template | null>(null);
  const [templateConfig, setTemplateConfig] = useState<any>({});
  const prefilledRef = useRef(false);
  const [form, setForm] = useState({
    name: "Parasite Bot",
    niche: niches[0],
    region: "",
    website: "",
    frequency: "manual",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!templateId) return;
    const loadTemplate = async () => {
      const res = await fetch("/api/marketplace/templates").catch(() => null);
      const json = await res?.json().catch(() => null);
      const data: Template[] = json?.data ?? [];
      const found = data.find((tpl) => tpl.id === templateId);
      if (found) {
        setTemplate(found);
        setTemplateConfig(found.config ?? {});
        if (!prefilledRef.current) {
          setForm((prev) => ({
            ...prev,
            name: found.name || prev.name,
            niche: found.vertical?.slug ? found.vertical.slug : prev.niche,
          }));
          prefilledRef.current = true;
        }
      }
    };
    loadTemplate();
  }, [templateId]);

  const templateBanner = useMemo(() => {
    if (!template) return null;
    return (
      <div
        className="rounded-[var(--radius-sm)] border px-3 py-2 text-sm"
        style={{ borderColor: "var(--line)", backgroundColor: "var(--surface-muted)" }}
      >
        Using template: <span className="font-semibold text-[var(--ink)]">{template.name}</span>{" "}
        {template.vertical?.name ? `(${template.vertical.name})` : null}
      </div>
    );
  }, [template]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const mergedConfig = {
      ...(templateConfig ?? {}),
      niche: form.niche,
      region: form.region,
      website: form.website,
      frequency: form.frequency,
      modes,
    };
    const nameToUse = form.name?.trim() || template?.name || "Parasite Bot";
    const res = await fetch("/api/robots/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nameToUse, type: "parasite", config: mergedConfig }),
    });
    const json = await res.json().catch(() => null);
    setLoading(false);
    const id = json?.data?.id;
    if (id) {
      router.push(`/app/robots/${id}`);
    } else {
      router.push("/app/robots");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Parasite Bot"
        subtitle="Set up a Parasite observer for your niche, region and company."
      />

      {templateBanner}

      <form onSubmit={handleSubmit} className="space-y-6">
        <DashboardCard className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <label className="text-sm text-[var(--muted)]">
              Bot name
              <input
                className="mt-1 w-full rounded-[var(--radius-sm)] border px-3 py-2 text-sm"
                style={{ borderColor: "var(--line)", backgroundColor: "var(--surface)" }}
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </label>
            <label className="text-sm text-[var(--muted)]">
              Niche
              <select
                className="mt-1 w-full rounded-[var(--radius-sm)] border px-3 py-2 text-sm"
                style={{ borderColor: "var(--line)", backgroundColor: "var(--surface)" }}
                value={form.niche}
                onChange={(e) => setForm((prev) => ({ ...prev, niche: e.target.value }))}
              >
                {niches.map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </label>
            <label className="text-sm text-[var(--muted)]">
              Region
              <input
                className="mt-1 w-full rounded-[var(--radius-sm)] border px-3 py-2 text-sm"
                style={{ borderColor: "var(--line)", backgroundColor: "var(--surface)" }}
                value={form.region}
                onChange={(e) => setForm((prev) => ({ ...prev, region: e.target.value }))}
                required
              />
            </label>
            <label className="text-sm text-[var(--muted)]">
              Website
              <input
                className="mt-1 w-full rounded-[var(--radius-sm)] border px-3 py-2 text-sm"
                style={{ borderColor: "var(--line)", backgroundColor: "var(--surface)" }}
                value={form.website}
                onChange={(e) => setForm((prev) => ({ ...prev, website: e.target.value }))}
              />
            </label>
            <label className="text-sm text-[var(--muted)]">
              Scan frequency
              <select
                className="mt-1 w-full rounded-[var(--radius-sm)] border px-3 py-2 text-sm"
                style={{ borderColor: "var(--line)", backgroundColor: "var(--surface)" }}
                value={form.frequency}
                onChange={(e) => setForm((prev) => ({ ...prev, frequency: e.target.value }))}
              >
                <option value="manual">Manual</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </label>
          </div>
        </DashboardCard>

        <Divider />

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-[var(--radius-sm)] bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Parasite Bot"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/app/robots")}
            className="rounded-[var(--radius-sm)] border px-4 py-2 text-sm font-semibold text-[var(--ink)]"
            style={{ borderColor: "var(--line)" }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
