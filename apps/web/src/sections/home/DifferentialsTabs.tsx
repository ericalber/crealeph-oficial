"use client";
import { useState } from "react";

const tabs = [
  {
    id: "speed",
    label: "Speed",
    title: "Go live in 24h",
    description:
      "From briefing to the first deliverable in 24 business hours with a dedicated squad and conversion-ready components.",
    points: ["Modular design", "Automated pipelines", "Data-guided reviews"]
  },
  {
    id: "data",
    label: "Data",
    title: "Data-driven decisions",
    description:
      "AQUA and Market Twin™ feed hypotheses, pricing, and messages that actually move the needle.",
    points: ["InsightScore™", "Benchmarks by region", "Continuous A/B testing"]
  },
  {
    id: "scale",
    label: "Scale",
    title: "Grow without friction",
    description:
      "Content, campaigns, and integrations connect through Bridge with end-to-end observability.",
    points: ["Bridge integrations", "OTEL + logs", "Visible SLOs"]
  }
];

export function DifferentialsTabs() {
  const [active, setActive] = useState("speed");
  const current = tabs.find(t => t.id === active) ?? tabs[0];
  return (
    <section className="relative px-4 py-16">
      <div className="mx-auto max-w-screen-xl lg:px-8">
        <div className="mb-8 flex flex-wrap gap-2">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`group relative overflow-hidden rounded-full px-4 py-2 text-sm font-semibold transition ${
                active === t.id
                  ? "text-white shadow-[0_12px_34px_rgba(0,0,0,.35)] bg-gradient-to-r from-[#A4161A] via-[#E02020] to-[#A4161A]"
                  : "bg-black/85 text-white/85 hover:bg-black border border-white/10"
              }`}
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shine" />
              {t.label}
            </button>
          ))}
        </div>
        <div className="group relative overflow-hidden rounded-2xl p-[1px] bg-gradient-to-r from-[#A4161A] via-[#E02020] to-[#A4161A] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <div className="relative rounded-2xl bg-black/40 p-6 text-white backdrop-blur-xl ring-1 ring-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_44px_rgba(0,0,0,0.35)]">
            <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-r from-[#A4161A]/30 via-[#E02020]/20 to-[#A4161A]/10 blur-3xl" />
            <h3 className="text-2xl font-semibold">{current.title}</h3>
            <p className="mt-2 max-w-2xl text-sm text-white/85">{current.description}</p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {current.points.map(p => (
                <li key={p} className="inline-flex items-center gap-2 text-sm text-white/90">
                  <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-[#A4161A] to-[#E02020]" />
                  {p}
                </li>
              ))}
            </ul>
            <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shine" />
          </div>
        </div>
      </div>
    </section>
  );
}
