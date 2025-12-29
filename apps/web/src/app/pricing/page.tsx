import { PageHero } from "@/components/layout/PageHero";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
import { CTAButton } from "@/components/ui/CTAButton";
import { SeeAlso } from "@/components/ui/SeeAlso";

type Plan = {
  name: string;
  price: string;
  description: string;
  features: string[];
  featured?: boolean;
};

const plans: Plan[] = [
  {
    name: "Starter",
    price: "USD 4,900/mo",
    description: "For local businesses that need a site and integrated media.",
    features: [
      "Modular website (up to 8 pages)",
      "Managed Google & Meta campaigns",
      "Access to AQUA Insights",
      "Automated weekly reports",
    ],
  },
  {
    name: "Pro",
    price: "USD 8,900/mo",
    description: "For regional or multi-location operations seeking scale.",
    features: [
      "Website plus unlimited landing pages",
      "Scout + Market Twin™ included",
      "Dedicated CRO and automation squad",
      "/app dashboard with up to 10 seats",
    ],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom quote",
    description: "For national networks, marketplaces, and regulated companies.",
    features: [
      "Custom projects in the CMS/tool of your choice",
      "Advanced integrations via Bridge",
      "24/7 support and continuous innovation squad",
      "Unlimited InsightScore™",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="bg-white" data-scroll-key="pricing-tabs">
      {/* Shine microinteractions (gated) */}
      <ShineGate>
        <TabScrollRestoreMount keyId="pricing-tabs" />
        <PullToRefreshHint />
        <LikeBurstShined selectors={[
          'a[href="/pricing"]',
          'a[aria-label^="Select plan"]',
          'a[href="/pricing/enterprise"]'
        ]} />
      </ShineGate>
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Pricing" },
        ]}
        subtitle="Plans and pricing"
        title="Choose the right plan for your operation."
        body="All plans include design system, optimized infrastructure, and squads connected to live data. Combine modules like AQUA, Scout, Market Twin™, and Bridge according to your maturity."
        ctas={[
          {
            label: "Talk to a specialist",
            href: "/contact?utm_source=pricing-hero&utm_campaign=cta-primary",
            ariaLabel: "Talk to a CreAleph specialist",
            campaign: "cta-primary",
          },
          {
            label: "See case studies",
            href: "/projects?utm_source=pricing-hero&utm_campaign=cta-secondary",
            ariaLabel: "See case studies",
            variant: "secondary",
            campaign: "cta-secondary",
          },
        ]}
        source="pricing-hero"
      />

      <SectionSeparator />

      <section className="px-4 py-16">
        <div className="mx-auto max-w-screen-xl space-y-8 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={`flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)] ${plan.featured ? "border-brand" : ""}`}
              >
                <div className="space-y-2">
                  <span className="text-sm font-semibold uppercase tracking-[0.3em] text-brand">
                    {plan.name}
                  </span>
                  <p className="text-2xl font-semibold text-ink">{plan.price}</p>
                  <p className="text-sm text-muted">{plan.description}</p>
                </div>
                <ul className="mt-6 flex flex-1 flex-col gap-2 text-sm text-ink">
                  {plan.features.map((feature) => (
                    <li key={`${plan.name}-${feature}`} className="flex items-start gap-2">
                      <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-brand" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <CTAButton
                  href={plan.name === "Enterprise" ? "/pricing/enterprise" : "/contact"}
                  label={plan.name === "Enterprise" ? "Contact Sales" : "Choose this plan"}
                  ariaLabel={`Select plan ${plan.name}`}
                  source={`pricing-plan-${plan.name.toLowerCase()}`}
                  campaign="cta-primary"
                  className="mt-8"
                />
              </article>
            ))}
          </div>
        </div>
      </section>

      <SectionSeparator />

      <section className="px-4 py-16">
        <div className="mx-auto grid max-w-screen-xl gap-8 lg:grid-cols-2 lg:px-8">
          <div className="rounded-[calc(var(--radius)*1.5)] border border-line bg-surface p-8 shadow-md">
            <h2 className="text-2xl font-semibold text-ink">What’s included</h2>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              <li>TechAI Pack library with high-converting components and layouts.</li>
              <li>Infrastructure optimized for performance and technical SEO.</li>
              <li>Weekly reports and tracking in the /app dashboard.</li>
              <li>Email and WhatsApp support during business hours.</li>
            </ul>
          </div>
          <div className="rounded-[calc(var(--radius)*1.5)] border border-line bg-white p-8 shadow-md">
            <h2 className="text-2xl font-semibold text-ink">Add-ons and modules</h2>
            <p className="mt-3 text-sm text-muted">
              Accelerate outcomes with plug-in modules:
              AQUA (messaging), Scout (competition), Market Twin™ (pricing), and Bridge (integrations and automation).
              You can start light and attach modules as you grow.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <CTAButton
                href="/modules/aqua"
                label="See AQUA"
                ariaLabel="See AQUA"
                variant="secondary"
                source="pricing-addons"
                campaign="cta-secondary"
              />
              <CTAButton
                href="/modules/market-twin"
                label="See Market Twin™"
                ariaLabel="See Market Twin"
                variant="ghost"
                source="pricing-addons"
                campaign="cta-ghost"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="mx-auto max-w-screen-xl space-y-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-ink">Frequently asked questions</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                q: "Is there a minimum term?",
                a: "No. We work with monthly contracts and a 30-day notice to end.",
              },
              {
                q: "When is the first deliverable ready?",
                a: "Within 24 business hours, we deliver the first version of the site or sprint campaign.",
              },
              {
                q: "Can I customize the scope?",
                a: "Yes. In Enterprise, we define custom scope, integrations, and advanced SLAs.",
              },
              {
                q: "How do I track results?",
                a: "Through the /app dashboard, with clear KPIs and weekly reports.",
              },
            ].map((faq, i) => (
              <details
                key={faq.q}
                className="group rounded-[--radius] border border-line bg-white p-6 transition hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,.08)]"
                open={i === 0}
              >
                <summary className="flex cursor-pointer items-center justify-between text-base font-semibold text-ink">
                  {faq.q}
                  <span className="text-brand group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm text-muted">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <SeeAlso
        source="pricing-see-also"
        items={[
          {
            title: "Proven projects",
            description: "Cases with real numbers and results by segment.",
            href: "/projects",
          },
          {
            title: "Intelligence modules",
            description: "AQUA, Scout, Market Twin™, and Bridge in detail.",
            href: "/modules/aqua",
          },
          {
            title: "CreAleph services",
            description: "Understand the end-to-end operation of sites, marketing, and automation.",
            href: "/services",
          },
          {
            title: "Enterprise",
            description: "Advanced plans with exclusive data and consulting.",
            href: "/pricing/enterprise",
          },
        ]}
      />
    </div>
  );
}
import ShineGate from "@/feature/shine/ShineGate";
import LikeBurstShined from "@/feature/shine/LikeBurst";
import PullToRefreshHint from "@/feature/shine/PullToRefreshHint";
import { TabScrollRestoreMount } from "@/feature/shine/useTabScrollRestore";
