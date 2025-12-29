import { PageHero } from "@/components/layout/PageHero";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
import { CTAButton } from "@/components/ui/CTAButton";
import { SeeAlso } from "@/components/ui/SeeAlso";
import { Reveal } from "@/components/motion/Reveal";
import Link from "next/link";

export default function InsightScoreModulePage() {
  return (
    <div className="bg-white">
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Modules", href: "/modules" },
          { label: "InsightScore™" },
        ]}
        subtitle="Intelligence module"
        title="InsightScore™: scientific priority for every insight or hypothesis."
        body="InsightScore™ analyzes novelty, correlation, consistency, seasonality, and historic impact. Every insight coming from AQUA, Scout, Market Twin™, or internal squads receives a score from 0 to 100. It tells us what should go to execution now, what stays under observation, and what is discarded. Transparent, explainable, and connected to the dashboard, the score eliminates subjective debates and speeds up roadmaps."
        ctas={[
          {
            label: "See methodology",
            href: "/resources/guides/insightscore?utm_source=module-insightscore&utm_campaign=cta-primary",
            ariaLabel: "See InsightScore methodology",
            campaign: "cta-primary",
          },
          {
            label: "Integrate with AQUA",
            href: "/modules/aqua?utm_source=module-insightscore&utm_campaign=cta-secondary",
            ariaLabel: "Integrate InsightScore with AQUA",
            variant: "secondary",
            campaign: "cta-secondary",
          },
        ]}
        source="module-insightscore-hero"
      />

      <SectionSeparator />

      <section className="px-4 py-24">
        <div className="mx-auto grid max-w-screen-xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div className="space-y-8">
            <div className="rounded-[var(--radius-card)] border border-line bg-surface p-8 shadow-[var(--shadow-soft)]">
              <h2 className="text-2xl font-semibold text-ink">Score dimensions</h2>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                <li>
                  <strong>Novelty:</strong> How rare is the pattern? The less frequent, the higher the weight.
                </li>
                <li>
                  <strong>Correlation:</strong> Does the insight connect with data from{" "}
                  <Link
                    href="/modules/market-twin?utm_source=module-insightscore-body&utm_campaign=link"
                    className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                  >
                    Market Twin™
                  </Link>{" "}
                  or campaign results?
                </li>
                <li>
                  <strong>Consistency:</strong> How many independent sources reinforce the same point?
                </li>
                <li>
                  <strong>Seasonality:</strong> Is there impact from the time of year or external events?
                </li>
                <li>
                  <strong>Impact:</strong> What is the potential to move revenue, MQLs, or satisfaction metrics?
                </li>
              </ul>
            </div>
            <CTAButton
              href="/app?utm_source=module-insightscore&utm_campaign=cta-secondary"
              label="See ranking in the dashboard"
              ariaLabel="See InsightScore ranking in the dashboard"
              variant="secondary"
              source="module-insightscore-body"
              campaign="cta-secondary"
            />
          </div>
          <div className="rounded-[var(--radius-card)] border border-line bg-white p-8 shadow-[var(--shadow-soft)] text-sm text-muted">
            <h2 className="text-2xl font-semibold text-ink">Sample output</h2>
            <ul className="mt-4 space-y-3">
              <li>
                #1 · Score 92 · “Test instant quote CTA” — High novelty, strong correlation with Scout data, social proof
                available. Send to the websites squad.
              </li>
              <li>
                #4 · Score 68 · “Reduce price on premium bundle” — Market Twin shows elasticity. Evaluate with pricing.
              </li>
              <li>
                #9 · Score 44 · “Winter themed campaign” — Seasonal insight with low consistency. Keep under observation.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <SeeAlso
        source="module-insightscore-see-also"
        items={[
          {
            title: "AQUA Insights",
            description: "Generate rich signals that feed the ranking automatically.",
            href: "/modules/aqua",
          },
          {
            title: "Scout",
            description: "Speed to detect competitor moves.",
            href: "/modules/scout",
          },
          {
            title: "Projects",
            description: "Cases that use InsightScore™ in weekly rituals.",
            href: "/projects",
          },
          {
            title: "InsightScore™ guide",
            description: "Detailed article with methodology and formulas.",
            href: "/resources/guides/insightscore",
          },
        ]}
      />
    </div>
  );
}
