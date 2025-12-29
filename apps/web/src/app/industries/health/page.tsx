import { PageHero } from "@/components/layout/PageHero";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
import { CTAButton } from "@/components/ui/CTAButton";
import { SeeAlso } from "@/components/ui/SeeAlso";
import { MiniQuoteForm } from "@/components/forms/MiniQuoteForm";
import { Reveal } from "@/components/motion/Reveal";
import Link from "next/link";

export default function HealthIndustryPage() {
  return (
    <div className="bg-white">
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Industries", href: "/industries" },
          { label: "Health" },
        ]}
        subtitle="Health"
        title="Websites and journeys for clinics, labs, and healthtechs."
        body="LGPD, compliance, and empathy. We apply AQUA to learn patient doubts, InsightScore™ to validate improvements, and Bridge to integrate scheduling, billing, and medical records. We communicate authority with educational content and vetted social proof."
        ctas={[
          {
            label: "Request LGPD review",
            href: "/contact?utm_source=industries-health&utm_campaign=cta-primary",
            ariaLabel: "Request LGPD review",
            campaign: "cta-primary",
          },
          {
            label: "See health projects",
            href: "/projects?utm_source=industries-health&utm_campaign=cta-secondary",
            ariaLabel: "See health projects",
            variant: "secondary",
            campaign: "cta-secondary",
          },
        ]}
        source="industries-health-hero"
      />

      <SectionSeparator />

      <section className="px-4 py-24">
        <div className="mx-auto grid max-w-screen-xl gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div className="space-y-8">
            <div className="rounded-[var(--radius-card)] border border-line bg-surface p-8 shadow-[var(--shadow-soft)]">
              <h2 className="text-2xl font-semibold text-ink">Trust flows</h2>
              <p className="mt-3 text-sm text-muted">
                Content comes from{" "}
                <Link
                  href="/modules/aqua?utm_source=industries-health&utm_campaign=link"
                  className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                >
                  AQUA
                </Link>
                , campaigns are optimized with{" "}
                <Link
                  href="/modules/insightscore?utm_source=industries-health&utm_campaign=link"
                  className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                >
                  InsightScore™
                </Link>
                , and Bridge automations ensure consistent reminders and post-visit follow-up.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                <li>Integration with scheduling systems (iClinic, ZenFisio, Memed).</li>
                <li>Automation for post-visit and retention programs.</li>
                <li>Personalized flows for specialties, labs, and telemedicine.</li>
              </ul>
            </div>
            <div className="rounded-[var(--radius-card)] border border-line bg-white p-8 shadow-[var(--shadow-soft)] text-sm text-muted">
              <h2 className="text-2xl font-semibold text-ink">Regulatory</h2>
              <p className="mt-3">
                We implement terms, policies, and logs following LGPD and specific councils. Bridge guarantees an
                auditable trail of data and integrations with hospital ERPs.
              </p>
            </div>
            <CTAButton
              href="/modules/bridge?utm_source=industries-health&utm_campaign=cta-secondary"
              label="See Bridge for health"
              ariaLabel="See Bridge for health"
              variant="secondary"
              source="industries-health-body"
              campaign="cta-secondary"
            />
          </div>
          <MiniQuoteForm context="Briefing — Health" />
        </div>
      </section>

      <SeeAlso
        source="industries-health-see-also"
        items={[
          {
            title: "Operational automation",
            description: "Automations for scheduling, billing, and follow-up.",
            href: "/services/automation",
          },
          {
            title: "AQUA Insights",
            description: "Map real patient doubts and objections.",
            href: "/modules/aqua",
          },
          {
            title: "Privacy & security",
            description: "Clarify privacy and security questions.",
            href: "/contact",
          },
          {
            title: "Contact",
            description: "Talk to the health squad at CreAleph.",
            href: "/contact",
          },
        ]}
      />
    </div>
  );
}
