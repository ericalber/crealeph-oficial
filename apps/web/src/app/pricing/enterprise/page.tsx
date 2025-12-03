import { PageHero } from "@/components/layout/PageHero";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
import { CTAButton } from "@/components/ui/CTAButton";
import { SeeAlso } from "@/components/ui/SeeAlso";
import Link from "next/link";

export default function PricingEnterprisePage() {
  return (
    <div className="bg-white">
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Pricing", href: "/pricing" },
          { label: "Enterprise" },
        ]}
        subtitle="Enterprise"
        title="Pricing Enterprise: exclusive data, advanced integrations, and tailored SLAs."
        body="Projects for national networks, marketplaces, and regulated industries. Includes dedicated squads, data governance, complex Bridge integrations, reinforced security (HSTS, mTLS, audits), and 24/7 support."
        ctas={[
          {
            label: "Talk to Sales",
            href: "/contact?utm_source=pricing-enterprise&utm_campaign=cta-primary",
            ariaLabel: "Talk to Sales Enterprise",
            campaign: "cta-primary",
          },
          {
            label: "See modules",
            href: "/modules/aqua?utm_source=pricing-enterprise&utm_campaign=cta-secondary",
            ariaLabel: "See modules",
            variant: "secondary",
            campaign: "cta-secondary",
          },
        ]}
        source="pricing-enterprise-hero"
      />

      <SectionSeparator />

      <section className="px-4 py-16">
        <div className="mx-auto grid max-w-screen-xl gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div className="rounded-[calc(var(--radius)*1.5)] border border-line bg-surface p-8 shadow-md">
            <h2 className="text-2xl font-semibold text-ink">How it works</h2>
            <p className="mt-3 text-sm text-muted">
              We design a continuous evolution program in sprints. Each squad combines strategy, product, and engineering,
              connected to market and operational data. We integrate your tools via
              <Link
                href="/modules/bridge?utm_source=pricing-enterprise&utm_campaign=link"
                className="ml-1 text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
              >
                Bridge
              </Link>
              , give visibility in the /app dashboard, and guarantee end-to-end security.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              <li>Custom architecture (headless CMS, commerce, local gateways).</li>
              <li>Bidirectional integrations with ERPs/CRMs (webhooks, queues, retries).</li>
              <li>Observability (metrics, logs, tracing) and compliance (LGPD, audits).</li>
              <li>24/7 support, defined RTO/RPO, and incident playbooks.</li>
            </ul>
          </div>
          <div className="rounded-[calc(var(--radius)*1.5)] border border-line bg-white p-8 shadow-md text-sm text-muted">
            <h2 className="text-2xl font-semibold text-ink">Enterprise packages</h2>
            <ul className="mt-4 space-y-2">
              <li><strong>Growth</strong> · website + marketing + automation squads.</li>
              <li><strong>Data+</strong> · exclusive data, advanced Market Twin™, and executive reports.</li>
              <li><strong>Bridge Pro</strong> · integrations, webhooks, technical dashboards, and developer support.</li>
            </ul>
            <CTAButton
              href="/contact?utm_source=pricing-enterprise&utm_campaign=cta-secondary"
              label="Request proposal"
              ariaLabel="Request Enterprise proposal"
              variant="secondary"
              source="pricing-enterprise-body"
              campaign="cta-secondary"
              className="mt-6"
            />
          </div>
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="mx-auto max-w-screen-xl space-y-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-ink">Enterprise FAQ</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                q: "How do you estimate?",
                a: "We run a diagnosis and POC when needed. We present roadmap, resources, and investment per sprint.",
              },
              {
                q: "Do you work with internal tools?",
                a: "Yes. We adapt the stack to your context (CMS, CRM, ERPs) with Bridge and custom connectors.",
              },
              {
                q: "What availability guarantees?",
                a: "SLA up to 99.9%, defined RTO/RPO, and full production observability.",
              },
              {
                q: "How about security?",
                a: "Encryption, HSTS, optional mTLS, access audits, and periodic reviews.",
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
        source="pricing-enterprise-see-also"
        items={[
          {
            title: "Bridge API",
            description: "Integrations, webhooks, and governance for your operation.",
            href: "/modules/bridge",
          },
          {
            title: "Market Twin™",
            description: "Advanced data for pricing and real approvals.",
            href: "/modules/market-twin",
          },
          {
            title: "Services",
            description: "Websites, marketing, and automation connected to data.",
            href: "/services",
          },
          {
            title: "Contact",
            description: "Talk to Sales for a tailored diagnosis.",
            href: "/contact",
          },
        ]}
      />
    </div>
  );
}
