import { PageHero } from "@/components/layout/PageHero";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
import { CTAButton } from "@/components/ui/CTAButton";
import { SeeAlso } from "@/components/ui/SeeAlso";
import { MiniQuoteForm } from "@/components/forms/MiniQuoteForm";
import Link from "next/link";

export default function MarinasIndustryPage() {
  return (
    <div className="bg-white">
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Industries", href: "/industries" },
          { label: "Marinas & Marine" },
        ]}
        subtitle="Marinas & Marine"
        title="Omnichannel experience for boat rentals and maintenance."
        body="We integrate marina management, reservations, maintenance, and support in a single flow. Websites show real-time availability, automations confirm check-in/out, and Bridge connects billing. Market Twin™ compares rates by marina, and Scout monitors seasonal promotions."
        ctas={[
          {
            label: "Request demo",
            href: "/contact?utm_source=industries-marinas&utm_campaign=cta-primary",
            ariaLabel: "Request marina demo",
            campaign: "cta-primary",
          },
          {
            label: "See marine projects",
            href: "/projects?utm_source=industries-marinas&utm_campaign=cta-secondary",
            ariaLabel: "See marine projects",
            variant: "secondary",
            campaign: "cta-secondary",
          },
        ]}
        source="industries-marinas-hero"
      />

      <SectionSeparator />

      <section className="px-4 py-24">
        <div className="mx-auto grid max-w-screen-xl gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div className="space-y-8">
            <div className="rounded-[var(--radius-card)] border border-line bg-surface p-8 shadow-[var(--shadow-soft)]">
              <h2 className="text-2xl font-semibold text-ink">Core solutions</h2>
              <p className="mt-3 text-sm text-muted">
                Websites synchronized with{" "}
                <Link
                  href="/modules/bridge?utm_source=industries-marinas&utm_campaign=link"
                  className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                >
                  Bridge
                </Link>{" "}
                and{" "}
                <Link
                  href="/modules/market-twin?utm_source=industries-marinas&utm_campaign=link"
                  className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                >
                  Market Twin™
                </Link>{" "}
                keep availability, pricing, and approvals in sync.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                <li>Portal with availability, photos, specs, and dynamic pricing.</li>
                <li>Reservation and billing automation with Bridge + marine ERPs.</li>
                <li>Preventive maintenance flows with dashboards for technical teams.</li>
              </ul>
            </div>
            <div className="rounded-[var(--radius-card)] border border-line bg-white p-8 shadow-[var(--shadow-soft)] text-sm text-muted">
              <h2 className="text-2xl font-semibold text-ink">Operations</h2>
              <p className="mt-3">
                We work alongside operations, marketing, and concierge teams to guarantee a consistent experience from
                first click to post-trip.
              </p>
            </div>
            <CTAButton
              href="/modules/market-twin?utm_source=industries-marinas&utm_campaign=cta-secondary"
              label="See Market Twin™ for marine"
              ariaLabel="See Market Twin for marine"
              variant="secondary"
              source="industries-marinas-body"
              campaign="cta-secondary"
            />
          </div>
          <MiniQuoteForm context="Briefing — Marinas" />
        </div>
      </section>

      <SeeAlso
        source="industries-marinas-see-also"
        items={[
          {
            title: "Market Twin™",
            description: "Understand price percentiles by season.",
            href: "/modules/market-twin",
          },
          {
            title: "Operational automation",
            description: "Flows for reservations, maintenance, and billing.",
            href: "/services/automation",
          },
          {
            title: "Bridge + ERPs",
            description: "Connect billing and approvals.",
            href: "/modules/bridge",
          },
          {
            title: "Contact",
            description: "Talk to the marine squad.",
            href: "/contact",
          },
        ]}
      />
    </div>
  );
}
