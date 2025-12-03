"use client";
import Link from "next/link";
import { useState } from "react";

const core = [
  {
    id: "aqua",
    title: "AQUA Insights",
    excerpt: "Promises that sell by city.",
    details:
      "Map language, objections, and winning CTAs with continuous market collection by region and niche.",
    href: "/modules/aqua",
    gradient: "from-[#22D3EE] via-[#3B82F6] to-[#7C3AED]"
  },
  {
    id: "twin",
    title: "Market Twin™",
    excerpt: "Dynamic pricing by region.",
    details:
      "Compare prices, response, and conversion to calibrate margins without losing volume.",
    href: "/modules/market-twin",
    gradient: "from-[#F59E0B] via-[#F43F5E] to-[#EF4444]"
  },
  {
    id: "bridge",
    title: "Bridge API",
    excerpt: "Reliable integrations",
    details:
      "Connect CRM, payments, and automations with observability and smart retries.",
    href: "/modules/bridge",
    gradient: "from-[#7C3AED] via-[#F43F5E] to-[#F59E0B]"
  }
];

export function CoreModules() {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <section className="relative px-4 py-16">
      {/* Soft background image to give material to the blur */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/20 via-black/30 to-black/40" />
      <div className="mx-auto max-w-screen-xl lg:px-8">
        <div className="mb-6">
          <h2 className="text-3xl font-semibold text-white">Core Suite</h2>
          <p className="text-sm text-white/85">Clickable cards with more details</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {core.map((m) => (
            <button
              key={m.id}
              onClick={() => setExpanded(expanded === m.id ? null : m.id)}
              className={`group relative overflow-hidden rounded-xl border border-white/15 bg-black/30 p-5 text-left shadow-lg backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-black/40`}
            >
              <div className={"pointer-events-none absolute -inset-1 -z-10 bg-gradient-to-br from-[#A4161A] via-[#E02020] to-[#A4161A] opacity-25 blur-2xl transition group-hover:opacity-40"} />
              <h3 className="text-lg font-semibold text-white">{m.title}</h3>
              <p className="mt-1 text-sm text-white/85">{m.excerpt}</p>
              <div
                className={`grid transition-all duration-300 ${
                  expanded === m.id ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="text-sm text-white/85">{m.details}</p>
                  <Link
                    href={m.href}
                    className="mt-2 inline-block text-sm text-white underline underline-offset-4 decoration-white/30 hover:decoration-white"
                  >
                    See details →
                  </Link>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
