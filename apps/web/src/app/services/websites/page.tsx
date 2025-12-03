import { PageHero } from "@/components/layout/PageHero";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
import { CTAButton } from "@/components/ui/CTAButton";
import { MiniQuoteForm } from "@/components/forms/MiniQuoteForm";
import { SeeAlso } from "@/components/ui/SeeAlso";
import Link from "next/link";

export default function WebsitesServicePage() {
  return (
    <div className="bg-white">
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: "Websites" },
        ]}
        subtitle="Websites"
        title="Sites that ship fast and are built for conversion."
        body="We design and build websites with the TechAI Pack, ensuring responsive layouts, Tailwind-synced tokens, and a headless CMS. Before writing code, we analyze dominant promises with AQUA Insights, pinpoint ideal pricing with Market Twin™, and simulate CTAs with InsightScore™. The result is a site launched in days, with AA page speed, solid technical SEO, and data tied to the dashboard."
        ctas={[
          {
            label: "See deliverables",
            href: "/projects?utm_source=services-websites&utm_campaign=cta-primary",
            ariaLabel: "View website deliverables",
            campaign: "cta-primary",
          },
          {
            label: "Request proposal",
            href: "/contact?utm_source=services-websites&utm_campaign=cta-secondary",
            ariaLabel: "Request a website proposal",
            variant: "secondary",
            campaign: "cta-secondary",
          },
        ]}
        source="services-websites-hero"
      />

      <SectionSeparator />

      <section className="px-4 py-16">
        <div className="mx-auto grid max-w-screen-xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div className="space-y-10">
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-ink">Stack and visual governance</h2>
              <p className="text-sm text-muted">
                The default architecture uses Next.js 15, Tailwind with tokens, headless CMS (Sanity/Contentful),
                and Vercel deploy. Each component starts in Figma with variants tuned to banner, grid, and card metrics
                pulled from the TechAI Pack. We create copy and accessibility guidelines to keep AA/AAA. Critical layouts are tested with{" "}
                <Link href="/modules/insightscore?utm_source=services-websites-body&utm_campaign=link" className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline">
                  InsightScore™
                </Link>{" "}
                before go-live.
              </p>
              <ul className="space-y-2 text-sm text-muted">
                <li className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-brand" />
                  <span>Design system with dynamic components and living documentation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-brand" />
                  <span>Content automation with CMS + Scout integration to detect updates.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-brand" />
                  <span>Structured schemas, technical SEO, and Core Web Vitals optimization.</span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-ink">Layouts built to convert</h2>
              <p className="text-sm text-muted">
                We run a library of Molly Maid heroes, service grids, project mosaics, pricing,
                and collapsible FAQ. Each block includes variants for local businesses, B2B, and health/education.
                CTAs already include UTMs and automation triggers connected to{" "}
                <Link href="/services/automation?utm_source=services-websites-body&utm_campaign=link" className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline">
                  automation services
                </Link>
                .
              </p>
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-ink">Process in four sprints</h2>
              <ol className="space-y-2 text-sm text-muted">
                <li>Week 1 · Discovery with AQUA plus customer interviews.</li>
                <li>Week 2 · Prototyping, copy testing, CMS selection.</li>
                <li>Week 3 · Front/back implementation with Bridge automations.</li>
                <li>Week 4 · Final adjustments, QA, training, and assisted go-live.</li>
              </ol>
              <p className="text-sm text-muted">
                In parallel, we run CRO experiments with{" "}
                <Link href="/services/marketing?utm_source=services-websites-body&utm_campaign=link" className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline">
                  intelligent marketing
                </Link>{" "}
                to feed future releases.
              </p>
            </div>
            <CTAButton
              href="/projects/case-marina-vox?utm_source=services-websites&utm_campaign=cta-secondary"
              label="See real case"
              ariaLabel="See Marina Vox case"
              variant="secondary"
              source="services-websites-body"
              campaign="cta-secondary"
            />
          </div>
          <MiniQuoteForm context="Briefing Website" />
        </div>
      </section>

      <SeeAlso
        source="services-websites-see-also"
        items={[
          {
            title: "Marketing with Scout",
            description: "Combine the website with intelligent campaigns and CRO effort.",
            href: "/services/marketing",
          },
          {
            title: "Operational automation",
            description: "Integrate forms, CRM, and billing with CREALEPH Bridge.",
            href: "/services/automation",
          },
          {
            title: "Regional pricing",
            description: "Use Market Twin™ to set offers by city.",
            href: "/modules/market-twin",
          },
          {
            title: "Contact",
            description: "Talk to the squad in charge and receive a detailed schedule.",
            href: "/contact",
          },
        ]}
      />
    </div>
  );
}
