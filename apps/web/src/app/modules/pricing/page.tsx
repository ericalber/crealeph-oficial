import { PageHero } from "@/components/layout/PageHero";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
import { CTAButton } from "@/components/ui/CTAButton";
import { SeeAlso } from "@/components/ui/SeeAlso";
import { Reveal } from "@/components/motion/Reveal";
import Link from "next/link";

const pricingTable = [
  { tier: "Premium", median: "USD 95", p25: "USD 82", p75: "USD 110" },
  { tier: "Standard", median: "USD 72", p25: "USD 60", p75: "USD 86" },
  { tier: "Economy", median: "USD 52", p25: "USD 44", p75: "USD 61" },
];

export default function PricingModulePage() {
  return (
    <div className="bg-white">
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Modules", href: "/modules" },
          { label: "Regional Pricing" },
        ]}
        subtitle="Intelligence module"
        title="Regional Pricing: what to charge in each city for every service."
        body="We collect public prices, ads, marketplaces, and partner financial data to deliver averages, medians, and price ranges by region. The module recommends adjustments by positioning (premium, standard, economy), shows where you are above or below competition, and highlights bundle opportunities. Integrated with Market Twin™ and Bridge, it follows real approvals and projected margins."
        ctas={[
          {
            label: "Request pricing analysis",
            href: "/contact?utm_source=module-pricing&utm_campaign=cta-primary",
            ariaLabel: "Request pricing analysis",
            campaign: "cta-primary",
          },
          {
            label: "See Market Twin™",
            href: "/modules/market-twin?utm_source=module-pricing&utm_campaign=cta-secondary",
            ariaLabel: "See Market Twin",
            variant: "secondary",
            campaign: "cta-secondary",
          },
        ]}
        source="module-pricing-hero"
      />

      <SectionSeparator />

      <section className="px-4 py-24">
        <div className="mx-auto max-w-screen-xl space-y-10 lg:px-8">
          <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[var(--radius-card)] border border-line bg-surface p-8 shadow-[var(--shadow-soft)]">
              <h2 className="text-2xl font-semibold text-ink">How we deliver pricing</h2>
              <p className="mt-3 text-sm text-muted">
                We consolidate market data, agreements, catalogs, and public references. After cleaning outliers, the
                model calculates percentiles by region, offers benchmarking with{" "}
                <Link
                  href="/modules/market-twin?utm_source=module-pricing-body&utm_campaign=link"
                  className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                >
                  Market Twin™
                </Link>{" "}
                and suggests ranges aligned to the desired positioning. Everything flows to the{" "}
                <Link
                  href="/services/marketing?utm_source=module-pricing-body&utm_campaign=link"
                  className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                >
                  marketing
                </Link>{" "}
                and{" "}
                <Link
                  href="/services/automation?utm_source=module-pricing-body&utm_campaign=link"
                  className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                >
                  automation
                </Link>{" "}
                squads so websites, offers, and journeys update automatically.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                <li>Recommended ranges by positioning (premium, standard, economy).</li>
                <li>Price elasticity based on historical approvals.</li>
                <li>Alerts when competitors cross your interval.</li>
              </ul>
            </div>
            <div className="rounded-[var(--radius-card)] border border-line bg-white p-8 shadow-[var(--shadow-soft)] text-sm text-muted">
              <h2 className="text-2xl font-semibold text-ink">Sample table — Residential cleaning (São Paulo)</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead className="text-xs uppercase tracking-[0.2em] text-muted">
                    <tr>
                      <th className="border-b border-line px-4 py-2">Positioning</th>
                      <th className="border-b border-line px-4 py-2">Median</th>
                      <th className="border-b border-line px-4 py-2">P25</th>
                      <th className="border-b border-line px-4 py-2">P75</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pricingTable.map((row) => (
                      <tr key={row.tier}>
                        <td className="border-b border-line px-4 py-2">{row.tier}</td>
                        <td className="border-b border-line px-4 py-2">{row.median}</td>
                        <td className="border-b border-line px-4 py-2">{row.p25}</td>
                        <td className="border-b border-line px-4 py-2">{row.p75}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4">
                Data is refreshed weekly. Check the dashboard for filters by neighborhood, time of day, or service
                bundles.
              </p>
            </div>
          </div>
          <CTAButton
            href="/industries/cleaning?utm_source=module-pricing&utm_campaign=cta-secondary"
            label="See cleaning industry application"
            ariaLabel="See cleaning industry application"
            variant="secondary"
            source="module-pricing-body"
            campaign="cta-secondary"
          />
        </div>
      </section>

      <SeeAlso
        source="module-pricing-see-also"
        items={[
          {
            title: "Market Twin™",
            description: "Compare positioning percentiles by niche and region.",
            href: "/modules/market-twin",
          },
          {
            title: "Bridge API",
            description: "Read real approvals and connect financial data.",
            href: "/modules/bridge",
          },
          {
            title: "Automation services",
            description: "Update prices automatically across every channel.",
            href: "/services/automation",
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
