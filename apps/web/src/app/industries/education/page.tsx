import { PageHero } from "@/components/layout/PageHero";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
import { CTAButton } from "@/components/ui/CTAButton";
import { SeeAlso } from "@/components/ui/SeeAlso";
import { MiniQuoteForm } from "@/components/forms/MiniQuoteForm";
import { Reveal } from "@/components/motion/Reveal";
import Link from "next/link";

export default function EducationIndustryPage() {
  return (
    <div className="bg-white">
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Industries", href: "/industries" },
          { label: "Education" },
        ]}
        subtitle="Education"
        title="Acquisition, enrollment, and retention for schools and edtechs."
        body="Strategies for student acquisition, digital enrollment, content tracks, and relationships with guardians. We respect LGPD, WCAG accessibility, and integrate with academic ERPs. Market Twin™ and Regional Pricing indicate competitive tuitions by neighborhood."
        ctas={[
          {
            label: "Book diagnosis",
            href: "/contact?utm_source=industries-education&utm_campaign=cta-primary",
            ariaLabel: "Book education diagnosis",
            campaign: "cta-primary",
          },
          {
            label: "See education projects",
            href: "/projects?utm_source=industries-education&utm_campaign=cta-secondary",
            ariaLabel: "See education projects",
            variant: "secondary",
            campaign: "cta-secondary",
          },
        ]}
        source="industries-education-hero"
      />

      <SectionSeparator />

      <section className="px-4 py-24">
        <div className="mx-auto grid max-w-screen-xl gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div className="space-y-8">
            <div className="rounded-[var(--radius-card)] border border-line bg-surface p-8 shadow-[var(--shadow-soft)]">
              <h2 className="text-2xl font-semibold text-ink">Enrollment machine</h2>
              <p className="mt-3 text-sm text-muted">
                Websites and campaigns aligned with{" "}
                <Link
                  href="/modules/aqua?utm_source=industries-education&utm_campaign=link"
                  className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                >
                  AQUA
                </Link>{" "}
                language, automated follow-up with{" "}
                <Link
                  href="/services/automation?utm_source=industries-education&utm_campaign=link"
                  className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                >
                  Bridge automations
                </Link>
                , and pricing policies set by{" "}
                <Link
                  href="/modules/pricing?utm_source=industries-education&utm_campaign=link"
                  className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                >
                  Regional Pricing
                </Link>
                .
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                <li>Automation for leads, guardians, and alumni using Bridge.</li>
                <li>Editorial content (blog, podcasts, events) with Scout monitoring competitors.</li>
                <li>Personalized nurture for undergraduate, graduate, and short courses.</li>
              </ul>
            </div>
            <div className="rounded-[var(--radius-card)] border border-line bg-white p-8 shadow-[var(--shadow-soft)] text-sm text-muted">
              <h2 className="text-2xl font-semibold text-ink">Compliance</h2>
              <p className="mt-3">
                We process sensitive data following LGPD. We create transparent policies, consent banners, access logs,
                and on-demand reports. Integration with{" "}
                <Link
                  href="/modules/bridge?utm_source=industries-education&utm_campaign=link"
                  className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                >
                  Bridge
                </Link>{" "}
                ensures observability on enrollments and payments.
              </p>
            </div>
            <CTAButton
              href="/modules/market-twin?utm_source=industries-education&utm_campaign=cta-secondary"
              label="See Market Twin™ for education"
              ariaLabel="See Market Twin for education"
              variant="secondary"
              source="industries-education-body"
              campaign="cta-secondary"
            />
          </div>
          <MiniQuoteForm context="Briefing — Education" />
        </div>
      </section>

      <SeeAlso
        source="industries-education-see-also"
        items={[
          {
            title: "Segmented acquisition",
            description: "Multichannel acquisition with segmented messages.",
            href: "/services/marketing",
          },
          {
            title: "Regional Pricing",
            description: "Set fair tuition by neighborhood.",
            href: "/modules/pricing",
          },
          {
            title: "Education blog",
            description: "Specialized content for academic teams.",
            href: "/resources/blog",
          },
          {
            title: "Contact",
            description: "Talk to the education squad.",
            href: "/contact",
          },
        ]}
      />
    </div>
  );
}
