import { PageHero } from "@/components/layout/PageHero";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
import { CTAButton } from "@/components/ui/CTAButton";
import { SeeAlso } from "@/components/ui/SeeAlso";
import { Reveal } from "@/components/motion/Reveal";
import Link from "next/link";

const marketCards = [
  {
    title: "Pricing vs. market",
    description: "Percentiles P10, P50, and P90 reveal if you are below, balanced, or above market value.",
  },
  {
    title: "Approval vs. region",
    description: "Approval rate comparison by neighborhood or city, useful for sales and expansion squads.",
  },
  {
    title: "Response time",
    description: "Real SLA KPIs. When plugged into Bridge, it monitors and alerts critical delays instantly.",
  },
];

export default function MarketTwinModulePage() {
  return (
    <div className="bg-white">
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Modules", href: "/modules" },
          { label: "Market Twin™" },
        ]}
        subtitle="Intelligence module"
        title="Market Twin™: price, approval, and response percentiles for strategic positioning."
        body="With data from marketplaces, partner ERPs, and Bridge integrations, we calculate percentiles that show exactly where your operation sits compared to the market. You learn if you charge too little or too much, where to raise, how response time compares to leaders, and how approval changes by region. Marketing, sales, and product finally speak the same language."
        ctas={[
          {
            label: "Compare with my data",
            href: "/contact?utm_source=module-market-twin&utm_campaign=cta-primary",
            ariaLabel: "Request Market Twin comparison",
            campaign: "cta-primary",
          },
          {
            label: "See Regional Pricing",
            href: "/modules/pricing?utm_source=module-market-twin&utm_campaign=cta-secondary",
            ariaLabel: "View pricing module",
            variant: "secondary",
            campaign: "cta-secondary",
          },
        ]}
        source="module-market-twin-hero"
      />

      <SectionSeparator />

      <section className="px-4 py-24">
        <div className="mx-auto max-w-screen-xl space-y-12 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            {marketCards.map((card, idx) => (
              <Reveal key={card.title} variant="fadeInUp" delay={60 * idx}>
                <div className="h-full rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)]">
                  <h2 className="text-lg font-semibold text-ink">{card.title}</h2>
                  <p className="mt-3 text-sm text-muted">{card.description}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="rounded-[var(--radius-card)] border border-line bg-surface p-8 shadow-[var(--shadow-soft)] text-sm text-muted">
            <h2 className="text-2xl font-semibold text-ink">How we use the percentiles</h2>
            <p className="mt-3">
              • Marketing tunes promises and offers based on the gap between practiced price and the ideal percentile. •
              Sales receives arguments with concrete proof, aligning{" "}
              <Link
                href="/modules/aqua?utm_source=module-market-twin-body&utm_campaign=link"
                className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
              >
                AQUA language
              </Link>{" "}
              with the desired positioning. • Automation operations use percentiles to trigger new flows when the market
              shifts.
            </p>
          </div>

          <CTAButton
            href="/industries/automotive?utm_source=module-market-twin&utm_campaign=cta-secondary"
            label="See automotive application"
            ariaLabel="See automotive application"
            variant="secondary"
            source="module-market-twin-body"
            campaign="cta-secondary"
          />
        </div>
      </section>

      <SeeAlso
        source="module-market-twin-see-also"
        items={[
          {
            title: "Regional Pricing",
            description: "Receive suggested price ranges by positioning.",
            href: "/modules/pricing",
          },
          {
            title: "Bridge",
            description: "Integrate financial data and monitor approvals in real time.",
            href: "/modules/bridge",
          },
          {
            title: "Marine industries",
            description: "See how we use percentiles in marinas and charter.",
            href: "/industries/marinas",
          },
          {
            title: "Pricing Enterprise",
            description: "Plans with exclusive data and dedicated consulting.",
            href: "/pricing/enterprise",
          },
        ]}
      />
    </div>
  );
}
