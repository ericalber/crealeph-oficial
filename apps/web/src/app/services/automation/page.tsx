import { PageHero } from "@/components/layout/PageHero";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
import { CTAButton } from "@/components/ui/CTAButton";
import { MiniQuoteForm } from "@/components/forms/MiniQuoteForm";
import { SeeAlso } from "@/components/ui/SeeAlso";
import Link from "next/link";

export default function AutomationServicePage() {
  return (
    <div className="bg-white">
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: "Automation" },
        ]}
        subtitle="Automation"
        title="Journeys, playbooks, and integrations that cut operational friction."
        body="We map every stage of sales, service, and post-sale to build automations that actually help people. We connect forms, CRM, billing, and support tools via CREALEPH Bridge. We monitor approvals, failures, and savings in real time. Regional Pricing tunes offers by city and InsightScore™ makes sure automation hypotheses are prioritized by impact."
        ctas={[
          {
            label: "Request diagnosis",
            href: "/contact?utm_source=services-automation&utm_campaign=cta-primary",
            ariaLabel: "Request automation diagnosis",
            campaign: "cta-primary",
          },
          {
            label: "View API docs",
            href: "/developers?utm_source=services-automation&utm_campaign=cta-secondary",
            ariaLabel: "View Bridge API documentation",
            variant: "secondary",
            campaign: "cta-secondary",
          },
        ]}
        source="services-automation-hero"
      />

      <SectionSeparator />

      <section className="px-4 py-16">
        <div className="mx-auto grid max-w-screen-xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div className="space-y-12">
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-ink">Complete flows for sales and service</h2>
              <p className="text-sm text-muted">
                We build playbooks with clear stages, triggers, and ownership. Each automation links to website forms
                and{" "}
                <Link
                  href="/services/marketing?utm_source=services-automation-body&utm_campaign=link"
                  className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                >
                  marketing
                </Link>
                campaigns. From the first touch, the lead receives relevant content, async qualification criteria, and offers aligned with Market Twin™.
              </p>
              <ul className="space-y-2 text-sm text-muted">
                <li className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-brand" />
                  <span>Email, SMS, WhatsApp, and voice sequences with governance.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-brand" />
                  <span>Integrations with HubSpot, Salesforce, RD, Zendesk, and custom platforms.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-brand" />
                  <span>Alerts and tasks generated automatically for internal squads.</span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-ink">CREALEPH Bridge</h2>
              <p className="text-sm text-muted">
                Bridge is our read-only integration layer with connectors for Stripe, PayPal, regional ERPs, and banking gateways.
                In e-commerce, we use the readings to project savings and avoid duplicate attempts.
              </p>
              <CTAButton
                href="/modules/bridge?utm_source=services-automation&utm_campaign=cta-secondary"
                label="Learn more about Bridge"
                ariaLabel="Learn more about Bridge"
                variant="secondary"
                source="services-automation-body"
                campaign="cta-secondary"
              />
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-ink">KPIs tracked</h2>
              <ul className="space-y-2 text-sm text-muted">
                <li>Average response time by channel.</li>
                <li>Qualification rate and funnel progression.</li>
                <li>Estimated savings from active automations.</li>
                <li>Critical errors or failed integrations.</li>
              </ul>
            </div>
          </div>
          <MiniQuoteForm context="Automation brief" />
        </div>
      </section>

      <SeeAlso
        source="services-automation-see-also"
        items={[
          {
            title: "Developers & API",
            description: "Read docs, generate keys, and see integration examples.",
            href: "/developers",
          },
          {
            title: "Regional Pricing",
            description: "Calibrate offers according to each city’s reality.",
            href: "/modules/pricing",
          },
          {
            title: "Market Twin™",
            description: "Discover price percentiles, approvals, and response speed.",
            href: "/modules/market-twin",
          },
          {
            title: "Case Construtora Norte",
            description: "See automations that lifted proposal rates.",
            href: "/projects/case-construtora-norte",
          },
        ]}
      />
    </div>
  );
}
