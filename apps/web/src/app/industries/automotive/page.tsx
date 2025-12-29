import { PageHero } from "@/components/layout/PageHero";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
import { CTAButton } from "@/components/ui/CTAButton";
import { SeeAlso } from "@/components/ui/SeeAlso";
import { MiniQuoteForm } from "@/components/forms/MiniQuoteForm";
import { Reveal } from "@/components/motion/Reveal";
import Link from "next/link";

export default function AutomotiveIndustryPage() {
  return (
    <div className="bg-white">
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Industries", href: "/industries" },
          { label: "Automotive & Marine" },
        ]}
        subtitle="Automotive & Marine"
        title="Marketing and automation for premium dealers, shops, and marinas."
        body="Positioning sensitive to price and availability. Market Twin™ shows percentiles by region and vehicle type, Bridge integrates inventory and billing, and Scout alerts you to new competitor campaigns. Websites display dynamic showcases and instant quote forms."
        ctas={[
          {
            label: "Request diagnosis",
            href: "/contact?utm_source=industries-automotive&utm_campaign=cta-primary",
            ariaLabel: "Request automotive diagnosis",
            campaign: "cta-primary",
          },
          {
            label: "View projects",
            href: "/projects?utm_source=industries-automotive&utm_campaign=cta-secondary",
            ariaLabel: "View automotive projects",
            variant: "secondary",
            campaign: "cta-secondary",
          },
        ]}
        source="industries-automotive-hero"
      />

      <SectionSeparator />

      <section className="px-4 py-24">
        <div className="mx-auto grid max-w-screen-xl gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div className="space-y-8">
            <div className="rounded-[var(--radius-card)] border border-line bg-surface p-8 shadow-[var(--shadow-soft)]">
              <h2 className="text-2xl font-semibold text-ink">Digital storefronts</h2>
              <p className="mt-3 text-sm text-muted">
                We connect dynamic showcases to{" "}
                <Link
                  href="/modules/market-twin?utm_source=industries-automotive&utm_campaign=link"
                  className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                >
                  Market Twin™
                </Link>{" "}
                so pricing reflects real positioning. Automations trigger follow-up and booking flows with Bridge
                keeping approvals visible.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                <li>Catalog with filters by type, year, mileage, and price range.</li>
                <li>Molly Maid hero form adapted to quotes or test-drive booking.</li>
                <li>CRM integration for automatic follow-up and scoring.</li>
              </ul>
            </div>
            <div className="rounded-[var(--radius-card)] border border-line bg-white p-8 shadow-[var(--shadow-soft)] text-sm text-muted">
              <h2 className="text-2xl font-semibold text-ink">Metrics monitored</h2>
              <ul className="mt-3 space-y-2">
                <li>Average response time per consultant (Bridge).</li>
                <li>Approval rate by channel (Scout + InsightScore™).</li>
                <li>Price percentiles by region and vehicle type.</li>
                <li>Inventory turnover and abandoned quotes.</li>
              </ul>
            </div>
            <CTAButton
              href="/modules/bridge?utm_source=industries-automotive&utm_campaign=cta-secondary"
              label="Bridge for inventory + billing"
              ariaLabel="Bridge for inventory and billing"
              variant="secondary"
              source="industries-automotive-body"
              campaign="cta-secondary"
            />
          </div>
          <MiniQuoteForm context="Briefing — Automotive & Marine" />
        </div>
      </section>

      <SeeAlso
        source="industries-automotive-see-also"
        items={[
          {
            title: "Market Twin™",
            description: "Combine Market Twin™ with Regional Pricing.",
            href: "/modules/market-twin",
          },
          {
            title: "Operational automation",
            description: "KPIs to track daily performance.",
            href: "/services/automation",
          },
          {
            title: "Developers",
            description: "Bridge docs and examples.",
            href: "/developers",
          },
          {
            title: "Contact",
            description: "Talk to the automotive squad.",
            href: "/contact",
          },
        ]}
      />
    </div>
  );
}
