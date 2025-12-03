"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/dashboard/layout/PageHeader";
import { SectionHeader } from "@/components/dashboard/layout/SectionHeader";
import { DashboardCard } from "@/components/dashboard/cards/DashboardCard";
import { Divider } from "@/components/dashboard/sections/Divider";
import { eventBus } from "@/lib/crealeph/event-bus";

const NICHES = [
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
] as const;

const MODES = [
  { id: "conversion", label: "Sinais de Conversão" },
  { id: "pricing", label: "Sinais de Preço" },
  { id: "trend", label: "Sinais de Tendência" },
  { id: "experience", label: "Sinais de Experiência" },
] as const;

function GhostButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="inline-flex h-10 items-center justify-center rounded-[var(--radius-sm)] border px-4 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
      style={{ borderColor: "var(--line)" }}
    />
  );
}

export default function ParasiteCreatePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    niche: "Cleaning",
    companyName: "",
    location: "",
    website: "",
    icp: "",
    products: "",
    priceRange: "",
    tone: "Direct",
    botName: "",
    modes: new Set<string>(),
  });

  const toggleMode = (id: string) => {
    setForm((prev) => {
      const next = new Set(prev.modes);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return { ...prev, modes: next };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const botId = crypto.randomUUID();
    const payload = {
      botId,
      niche: form.niche,
      companyName: form.companyName,
      region: form.location,
      website: form.website,
      icp: form.icp,
      products: form.products,
      priceRange: form.priceRange,
      tone: form.tone,
      botName: form.botName || "Parasite Bot",
      modes: Array.from(form.modes),
    };
    eventBus.emit("parasite.bot.created", payload);
    eventBus.emit("parasite.scan.requested", { botId, niche: form.niche, region: form.location, modes: Array.from(form.modes) });
    router.push("/app/parasite");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Parasite Bot"
        subtitle="Configure the niche, company context and observation modes for your Parasite Bot."
        actions={null}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <DashboardCard>
          <SectionHeader title="Niche" description="Select the market the Parasite Bot will monitor." />
          <div className="mt-3 grid max-w-xl gap-3">
            <label className="text-sm text-[var(--ink)]">
              <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Niche</span>
              <select
                value={form.niche}
                onChange={(e) => setForm((prev) => ({ ...prev, niche: e.target.value }))}
                className="mt-1 w-full rounded-[var(--radius-sm)] border px-3 py-2 text-sm text-[var(--ink)]"
                style={{ borderColor: "var(--line)", backgroundColor: "var(--surface)" }}
              >
                {NICHES.map((niche) => (
                  <option key={niche} value={niche}>
                    {niche}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </DashboardCard>

        <DashboardCard>
          <SectionHeader title="Company / Context" description="Describe the business the Parasite Bot will observe." />
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="text-sm text-[var(--ink)]">
              <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Company Name</span>
              <input
                value={form.companyName}
                onChange={(e) => setForm((prev) => ({ ...prev, companyName: e.target.value }))}
                className="mt-1 w-full rounded-[var(--radius-sm)] border px-3 py-2 text-sm"
                style={{ borderColor: "var(--line)", backgroundColor: "var(--surface)" }}
                required
              />
            </label>
            <label className="text-sm text-[var(--ink)]">
              <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Location (city / region)</span>
              <input
                value={form.location}
                onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                className="mt-1 w-full rounded-[var(--radius-sm)] border px-3 py-2 text-sm"
                style={{ borderColor: "var(--line)", backgroundColor: "var(--surface)" }}
              />
            </label>
            <label className="text-sm text-[var(--ink)]">
              <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Website</span>
              <input
                value={form.website}
                onChange={(e) => setForm((prev) => ({ ...prev, website: e.target.value }))}
                className="mt-1 w-full rounded-[var(--radius-sm)] border px-3 py-2 text-sm"
                style={{ borderColor: "var(--line)", backgroundColor: "var(--surface)" }}
              />
            </label>
            <label className="text-sm text-[var(--ink)]">
              <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Bot Name / Avatar</span>
              <input
                value={form.botName}
                onChange={(e) => setForm((prev) => ({ ...prev, botName: e.target.value }))}
                className="mt-1 w-full rounded-[var(--radius-sm)] border px-3 py-2 text-sm"
                style={{ borderColor: "var(--line)", backgroundColor: "var(--surface)" }}
              />
            </label>
          </div>

          <div className="mt-4 grid gap-4">
            <label className="text-sm text-[var(--ink)]">
              <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Ideal Customer Profile</span>
              <textarea
                value={form.icp}
                onChange={(e) => setForm((prev) => ({ ...prev, icp: e.target.value }))}
                className="mt-1 w-full rounded-[var(--radius-sm)] border px-3 py-2 text-sm"
                style={{ borderColor: "var(--line)", backgroundColor: "var(--surface)" }}
                rows={3}
              />
            </label>
            <label className="text-sm text-[var(--ink)]">
              <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Main Products/Services</span>
              <textarea
                value={form.products}
                onChange={(e) => setForm((prev) => ({ ...prev, products: e.target.value }))}
                className="mt-1 w-full rounded-[var(--radius-sm)] border px-3 py-2 text-sm"
                style={{ borderColor: "var(--line)", backgroundColor: "var(--surface)" }}
                rows={3}
              />
            </label>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <label className="text-sm text-[var(--ink)]">
              <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Current Price Range</span>
              <input
                value={form.priceRange}
                onChange={(e) => setForm((prev) => ({ ...prev, priceRange: e.target.value }))}
                className="mt-1 w-full rounded-[var(--radius-sm)] border px-3 py-2 text-sm"
                style={{ borderColor: "var(--line)", backgroundColor: "var(--surface)" }}
              />
            </label>
            <label className="text-sm text-[var(--ink)]">
              <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Tone of Voice</span>
              <select
                value={form.tone}
                onChange={(e) => setForm((prev) => ({ ...prev, tone: e.target.value }))}
                className="mt-1 w-full rounded-[var(--radius-sm)] border px-3 py-2 text-sm"
                style={{ borderColor: "var(--line)", backgroundColor: "var(--surface)" }}
              >
                <option value="Direct">Direct</option>
                <option value="Warm">Warm</option>
                <option value="Premium">Premium</option>
              </select>
            </label>
          </div>
        </DashboardCard>

        <DashboardCard>
          <SectionHeader title="Observation Modes" description="Choose which signals the Parasite Bot will monitor." />
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {MODES.map((mode) => (
              <label
                key={mode.id}
                className="flex cursor-pointer items-start gap-3 rounded-[var(--radius-sm)] border px-3 py-3 text-sm"
                style={{ borderColor: "var(--line)", backgroundColor: form.modes.has(mode.id) ? "var(--surface-muted)" : "var(--surface)" }}
              >
                <input
                  type="checkbox"
                  checked={form.modes.has(mode.id)}
                  onChange={() => toggleMode(mode.id)}
                  className="mt-1 h-4 w-4"
                />
                <span className="text-[var(--ink)]">{mode.label}</span>
              </label>
            ))}
          </div>
        </DashboardCard>

        <Divider />

        <div className="flex flex-wrap gap-3">
          <GhostButton type="submit">Generate Parasite Bot</GhostButton>
          <GhostButton type="button" onClick={() => router.push("/app/parasite")}>
            Cancel
          </GhostButton>
        </div>
      </form>
    </div>
  );
}
