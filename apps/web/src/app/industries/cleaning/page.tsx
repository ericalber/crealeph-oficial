import { PageHero } from "@/components/layout/PageHero";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
import { CTAButton } from "@/components/ui/CTAButton";
import { SeeAlso } from "@/components/ui/SeeAlso";
import { MiniQuoteForm } from "@/components/forms/MiniQuoteForm";
import { Reveal } from "@/components/motion/Reveal";
import Link from "next/link";

const pillars = [
  "Landing pages with social proof, price tables, and instant quote CTAs.",
  "Local campaigns segmented by radius and specific keywords.",
  "Scheduling automation routed to WhatsApp, phone, and email.",
];

export default function CleaningIndustryPage() {
  return (
    <div className="bg-white">
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Industries", href: "/industries" },
          { label: "Local businesses" },
        ]}
        subtitle="Local businesses"
        title="CreAleph playbook for cleaning, beauty, and recurring services."
        body="Websites with Molly Maid heroes, budget-style forms, scheduling CTAs, and follow-up automations. AQUA reveals the promises that convert in each neighborhood, Scout monitors competitors, and Market Twin™ sets the ideal price per region. Everything is integrated with CRM and service channels."
        ctas={[
          {
            label: "See website examples",
            href: "/projects?utm_source=industries-cleaning&utm_campaign=cta-primary",
            ariaLabel: "See website examples for cleaning",
            campaign: "cta-primary",
          },
          {
            label: "Request proposal",
            href: "/contact?utm_source=industries-cleaning&utm_campaign=cta-secondary",
            ariaLabel: "Request proposal for local businesses",
            variant: "secondary",
            campaign: "cta-secondary",
          },
        ]}
        source="industries-cleaning-hero"
      />

      <SectionSeparator />

      <section className="px-4 py-24">
        <div className="mx-auto grid max-w-screen-xl gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div className="space-y-8">
            <div className="rounded-[var(--radius-card)] border border-line bg-surface p-8 shadow-[var(--shadow-soft)]">
              <h2 className="text-2xl font-semibold text-ink">Playbook pillars</h2>
              <p className="mt-3 text-sm text-muted">
                Combine the modular site with
                <Link
                  href="/services/marketing?utm_source=industries-cleaning&utm_campaign=link"
                  className="ml-1 text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                >
                  local campaigns
                </Link>
                , adjust prices with
                <Link
                  href="/modules/pricing?utm_source=industries-cleaning&utm_campaign=link"
                  className="ml-1 text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                >
                  Regional Pricing
                </Link>
                , and automate follow-up using
                <Link
                  href="/services/automation?utm_source=industries-cleaning&utm_campaign=link"
                  className="ml-1 text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                >
                  CreAleph automations
                </Link>
                .
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                {pillars.map((item, idx) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-brand" />
                    <Reveal as="span" variant="fadeInUp" delay={40 * idx}>
                      {item}
                    </Reveal>
                  </li>
                ))}
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
                    <td className="border-b border-line px-3 py-2">Cold leads with no return</td>
                    <td className="border-b border-line px-3 py-2">Automation with Bridge + SMS/WhatsApp</td>
                  </tr>
                  <tr>
                    <td className="border-b border-line px-3 py-2">Misaligned pricing</td>
                    <td className="border-b border-line px-3 py-2">Regional Pricing + Market Twin™</td>
                  </tr>
                  <tr>
                    <td className="border-b border-line px-3 py-2">Unappealing descriptions</td>
                    <td className="border-b border-line px-3 py-2">Monthly AQUA Insights refresh</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <CTAButton
              href="/modules/aqua?utm_source=industries-cleaning&utm_campaign=cta-secondary"
              label="See AQUA details"
              ariaLabel="See AQUA details"
              variant="secondary"
              source="industries-cleaning-body"
              campaign="cta-secondary"
            />
          </div>
          <MiniQuoteForm context="Briefing — Cleaning & Local" />
        </div>
      </section>

      <SeeAlso
        source="industries-cleaning-see-also"
        items={[
          {
            title: "Intelligent marketing",
            description: "Local campaigns and SEO that keep the calendar full.",
            href: "/services/marketing",
          },
          {
            title: "Regional Pricing",
            description: "Calibrate your offer by neighborhood.",
            href: "/modules/pricing",
          },
          {
            title: "Marina Vox case",
            description: "Example of omnichannel automation.",
            href: "/projects/case-marina-vox",
          },
          {
            title: "Contact",
            description: "Talk to the squad dedicated to local businesses.",
            href: "/contact",
          },
        ]}
      />
    </div>
  );
}
