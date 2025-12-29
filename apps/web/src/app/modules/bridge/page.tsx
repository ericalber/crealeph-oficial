import { PageHero } from "@/components/layout/PageHero";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
import { CTAButton } from "@/components/ui/CTAButton";
import { SeeAlso } from "@/components/ui/SeeAlso";
import { Reveal } from "@/components/motion/Reveal";
import Link from "next/link";

export default function BridgeModulePage() {
  return (
    <div className="bg-white">
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Modules", href: "/modules" },
          { label: "Bridge" },
        ]}
        subtitle="Integration module"
        title="CREALEPH Bridge: the integration and financial read layer for digital squads."
        body="Bridge connects payment platforms, ERPs, CRMs, and proprietary tools without touching the money flow. It reads approvals, declines, refunds, and financial tickets, turning everything into signals for automations, dashboards, and internal teams. Ideal for reliability, detailed logs, and governance with audit trails."
        ctas={[
          {
            label: "Open documentation",
            href: "/developers?utm_source=module-bridge&utm_campaign=cta-primary",
            ariaLabel: "Open Bridge documentation",
            campaign: "cta-primary",
          },
          {
            label: "Talk with specialists",
            href: "/contact?utm_source=module-bridge&utm_campaign=cta-secondary",
            ariaLabel: "Talk with Bridge specialists",
            variant: "secondary",
            campaign: "cta-secondary",
          },
        ]}
        source="module-bridge-hero"
      />

      <SectionSeparator />

      <section className="px-4 py-24">
        <div className="mx-auto grid max-w-screen-xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div className="space-y-8">
            <div className="rounded-[var(--radius-card)] border border-line bg-surface p-8 shadow-[var(--shadow-soft)]">
              <h2 className="text-2xl font-semibold text-ink">Ready-made connectors</h2>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                <li>Stripe, PayPal, Pagar.me, Mercado Pago, Iugu.</li>
                <li>HubSpot, Salesforce, RD Station, Pipefy.</li>
                <li>SAP, Totvs, Omie, and proprietary systems via webhooks.</li>
              </ul>
              <p className="mt-4 text-sm text-muted">
                Each connector includes detailed logs and dashboards plus configurable alerts.
              </p>
            </div>
            <div className="rounded-[var(--radius-card)] border border-line bg-white p-8 shadow-[var(--shadow-soft)] text-sm text-muted">
              <h2 className="text-2xl font-semibold text-ink">Use with automation and pricing</h2>
              <p className="mt-3">
                When connected to{" "}
                <Link
                  href="/services/automation?utm_source=module-bridge-body&utm_campaign=link"
                  className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                >
                  journey automations
                </Link>{" "}
                and{" "}
                <Link
                  href="/modules/pricing?utm_source=module-bridge-body&utm_campaign=link"
                  className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                >
                  Regional Pricing
                </Link>
                , Bridge lets you adjust offers automatically and pause campaigns when necessary.
              </p>
              <CTAButton
                href="/developers?utm_source=module-bridge&utm_campaign=cta-secondary"
                label="Generate API key"
                ariaLabel="Generate Bridge API key"
                variant="secondary"
                source="module-bridge-body"
                campaign="cta-secondary"
                className="mt-6"
              />
            </div>
          </div>
          <div className="rounded-[var(--radius-card)] border border-line bg-white p-8 shadow-[var(--shadow-soft)] text-sm text-muted">
            <h2 className="text-2xl font-semibold text-ink">Direct benefits</h2>
            <ul className="mt-4 space-y-3">
              <li>Projected savings by avoiding failed attempts.</li>
              <li>Average approval time by gateway or payment method.</li>
              <li>Anomaly detection with alerts for technical squads.</li>
              <li>Audit-ready logs with 12 months retention.</li>
            </ul>
          </div>
        </div>
      </section>

      <SeeAlso
        source="module-bridge-see-also"
        items={[
          {
            title: "Developers",
            description: "Documentation, webhooks, and TypeScript examples.",
            href: "/developers",
          },
          {
            title: "Operational automation",
            description: "See how squads trigger Bridge in real time.",
            href: "/services/automation",
          },
          {
            title: "B2B cases",
            description: "Clients using Bridge for approval metrics.",
            href: "/projects/case-construtora-norte",
          },
          {
            title: "Pricing",
            description: "Plans with Bridge included and 24/7 support.",
            href: "/pricing",
          },
        ]}
      />
    </div>
  );
}
