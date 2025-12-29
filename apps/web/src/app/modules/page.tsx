import type { Metadata } from "next";
import Link from "next/link";
import { MODULES } from "@/content/modules";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
import { CTAButton } from "@/components/ui/CTAButton";
import { ModulesExplorer } from "@/sections/modules/ModulesExplorer";

export const metadata: Metadata = {
  title: "AI Modules — CreAleph",
  description: "Plug-in modules for growth: AQUA, Scout, InsightScore, Market Twin, Pricing and Bridge.",
};

export default function ModulesIndexPage() {
  return (
    <div className="bg-white">
      <section className="px-4 py-24">
        <div className="mx-auto max-w-screen-xl space-y-4 lg:px-8">
          <h1 className="text-4xl font-extrabold text-ink sm:text-5xl">AI Modules</h1>
          <p className="text-base text-muted">
            Choose the building blocks that power your Websites, Marketing and Operations.
          </p>
        </div>
      </section>

      <SectionSeparator />

      <section className="px-4 py-24">
        <div className="mx-auto max-w-screen-xl space-y-10 lg:px-8">
          <ModulesExplorer modules={MODULES} />
        </div>
      </section>

      <section className="px-4 pb-24">
        <div className="mx-auto max-w-screen-xl rounded-[var(--radius-card)] border border-line bg-white p-8 shadow-[var(--shadow-soft)] lg:px-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-ink">See the modules in action</h3>
              <p className="text-sm text-muted">
                Schedule a guided walkthrough or jump to case studies with live KPIs.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <CTAButton
                href="/contact"
                label="Schedule a demo"
                ariaLabel="Schedule a demo"
                variant="primary"
                source="modules-index"
                campaign="cta-primary"
              />
              <CTAButton
                href="/projects"
                label="All case studies"
                ariaLabel="All case studies"
                variant="secondary"
                source="modules-index"
                campaign="cta-secondary"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
