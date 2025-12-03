import type { Metadata } from "next";
import Link from "next/link";
import { MODULES } from "@/content/modules";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
import { ModulesExplorer } from "@/sections/modules/ModulesExplorer";

export const metadata: Metadata = {
  title: "AI Modules — CreAleph",
  description: "Plug-in modules for growth: AQUA, Scout, InsightScore, Market Twin, Pricing and Bridge.",
};

export default function ModulesIndexPage() {
  return (
    <div className="bg-white">
      <section className="px-4 py-16">
        <div className="mx-auto max-w-screen-xl space-y-4 lg:px-8">
          <h1 className="text-4xl font-extrabold text-ink sm:text-5xl">AI Modules</h1>
          <p className="text-base text-muted">
            Choose the building blocks that power your Websites, Marketing and Operations.
          </p>
        </div>
      </section>

      <SectionSeparator />

      <section className="px-4 py-12">
        <div className="mx-auto max-w-screen-xl space-y-10 lg:px-8">
          <ModulesExplorer modules={MODULES} />
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="mx-auto max-w-screen-xl rounded-2xl border border-black/10 bg-white p-8 shadow-[0_12px_28px_rgba(0,0,0,0.12)] lg:px-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-ink">See the modules in action</h3>
              <p className="text-sm text-muted">
                Schedule a guided walkthrough or jump to case studies with live KPIs.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex h-11 items-center justify-center rounded-full bg-[#D62828] px-5 text-sm font-semibold text-white transition hover:bg-[#B91C1C]"
              >
                Schedule a demo
              </Link>
              <Link
                href="/projects"
                className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 bg-white px-5 text-sm font-semibold text-[#0B0B0E] hover:bg-black/5"
              >
                All case studies
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
