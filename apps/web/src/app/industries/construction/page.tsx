import { PageHero } from "@/components/layout/PageHero";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
import { CTAButton } from "@/components/ui/CTAButton";
import { SeeAlso } from "@/components/ui/SeeAlso";
import { MiniQuoteForm } from "@/components/forms/MiniQuoteForm";
import { Reveal } from "@/components/motion/Reveal";
import Link from "next/link";

export default function ConstructionIndustryPage() {
  return (
    <div className="bg-white">
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Industries", href: "/industries" },
          { label: "Construction & B2B" },
        ]}
        subtitle="Construction & B2B"
        title="Full funnel for construction, facilities, and project services."
        body="Modular sites with catalogs, technical libraries, and ROI calculators. ABM marketing with consultative content. Pipeline automation integrated to the CRM. Market Twin™ points to regions with higher approval while Regional Pricing suggests ranges for packages and maintenance."
        ctas={[
          {
            label: "Request proposal",
            href: "/contact?utm_source=industries-construction&utm_campaign=cta-primary",
            ariaLabel: "Request proposal for construction",
            campaign: "cta-primary",
          },
          {
            label: "See projects",
            href: "/projects?utm_source=industries-construction&utm_campaign=cta-secondary",
            ariaLabel: "See construction projects",
            variant: "secondary",
            campaign: "cta-secondary",
          },
        ]}
        source="industries-construction-hero"
      />

      <SectionSeparator />

      <section className="px-4 py-24">
        <div className="mx-auto grid max-w-screen-xl gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div className="space-y-8">
            <div className="rounded-[var(--radius-card)] border border-line bg-surface p-8 shadow-[var(--shadow-soft)]">
              <h2 className="text-2xl font-semibold text-ink">How we operate</h2>
              <p className="mt-3 text-sm text-muted">
                Technical assets from{" "}
                <Link
                  href="/modules/aqua?utm_source=industries-construction&utm_campaign=link"
                  className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                >
                  AQUA Insights
                </Link>{" "}
                feed consultative content, while{" "}
                <Link
                  href="/modules/market-twin?utm_source=industries-construction&utm_campaign=link"
                  className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                >
                  Market Twin™
                </Link>{" "}
                prioritizes areas with higher approval.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                <li>Landing pages by sector (industry, retail, logistics, government).</li>
                <li>Technical library with guides, videos, cases, and comparisons.</li>
                <li>Multichannel nurture sequences and pre-sales routines.</li>
              </ul>
            </div>
            <div className="rounded-[var(--radius-card)] border border-line bg-white p-8 shadow-[var(--shadow-soft)] text-sm text-muted">
              <h2 className="text-2xl font-semibold text-ink">Pain points vs. solutions</h2>
              <table className="mt-3 min-w-full text-left">
                <tbody>
                  <tr>
                    <th className="border-b border-line px-3 py-2">Pain point</th>
                    <th className="border-b border-line px-3 py-2">Solution</th>
                  </tr>
                  <tr>
                    <td className="border-b border-line px-3 py-2">Unreliable funnel</td>
                    <td className="border-b border-line px-3 py-2">CRM integration + Bridge automations</td>
                  </tr>
                  <tr>
                    <td className="border-b border-line px-3 py-2">Generic content</td>
                    <td className="border-b border-line px-3 py-2">AQUA Insights + full technical guide</td>
                  </tr>
                  <tr>
                    <td className="border-b border-line px-3 py-2">Opaque pricing</td>
                    <td className="border-b border-line px-3 py-2">Regional Pricing + Market Twin™</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <CTAButton
              href="/services/marketing?utm_source=industries-construction&utm_campaign=cta-secondary"
              label="See ABM approach"
              ariaLabel="See ABM approach"
              variant="secondary"
              source="industries-construction-body"
              campaign="cta-secondary"
            />
          </div>
          <MiniQuoteForm context="Briefing — Construction & B2B" />
        </div>
      </section>

      <SeeAlso
        source="industries-construction-see-also"
        items={[
          {
            title: "B2B automation",
            description: "Track response time and approval by region.",
            href: "/services/automation",
          },
          {
            title: "Market Twin™",
            description: "Compare approval across territories.",
            href: "/modules/market-twin",
          },
          {
            title: "Projects",
            description: "Real cases with published KPIs.",
            href: "/projects",
          },
          {
            title: "Contact",
            description: "Talk to the construction squad.",
            href: "/contact",
          },
        ]}
      />
    </div>
  );
}
