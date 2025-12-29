import { PageHero } from "@/components/layout/PageHero";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
import { CTAButton } from "@/components/ui/CTAButton";
import { SeeAlso } from "@/components/ui/SeeAlso";
import { Reveal } from "@/components/motion/Reveal";
import Link from "next/link";

const highlightCards = [
  {
    title: "Most repeated promises",
    description: "See the arguments that convince buyers and adapt your copy with confidence.",
  },
  {
    title: "Objections by sector",
    description: "Map fears and barriers per industry and plan which social proof to deploy.",
  },
  {
    title: "Winning CTAs",
    description: "List the calls that trigger action in each channel and tune microcopy quickly.",
  },
];

export default function AquaModulePage() {
  return (
    <div className="bg-white">
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Modules", href: "/modules" },
          { label: "AQUA Insights" },
        ]}
        subtitle="Intelligence module"
        title="AQUA Insights: promises, objections, and CTAs from your market in real time."
        body="AQUA reads ads, landing pages, forums, marketplaces, and competitor sites, extracting the dominant promises, recurring objections, social proof, and calls to action. Data is classified by city, service, persona, and intent. In a few hours you learn how the market speaks, what words trigger desire, and which blockers must be neutralized. Integrated with the TechAI Pack, it generates ready-to-use copy blocks for websites, campaigns, and sales decks."
        ctas={[
          {
            label: "Request AQUA demo",
            href: "/contact?utm_source=module-aqua&utm_campaign=cta-primary",
            ariaLabel: "Request an AQUA demo",
            campaign: "cta-primary",
          },
          {
            label: "See InsightScore™",
            href: "/modules/insightscore?utm_source=module-aqua&utm_campaign=cta-secondary",
            ariaLabel: "View InsightScore module",
            variant: "secondary",
            campaign: "cta-secondary",
          },
        ]}
        source="module-aqua-hero"
      />

      <SectionSeparator />

      <section className="px-4 py-24">
        <div className="mx-auto max-w-screen-xl space-y-12 lg:px-8">
          <div className="space-y-4 rounded-[var(--radius-card)] border border-line bg-surface p-8 shadow-[var(--shadow-soft)]">
            <h2 className="text-2xl font-semibold text-ink">How AQUA works</h2>
            <p className="text-sm text-muted">
              A mesh of crawlers collects ads, pages, and testimonials. NLP highlights promises, pains, objections, and
              social proof. We then cluster the signals and score their intensity. Those clusters feed the squads of{" "}
              <Link
                href="/services/websites?utm_source=module-aqua-body&utm_campaign=link"
                className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
              >
                websites
              </Link>
              ,{" "}
              <Link
                href="/services/marketing?utm_source=module-aqua-body&utm_campaign=link"
                className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
              >
                intelligent marketing
              </Link>{" "}
              and{" "}
              <Link
                href="/services/automation?utm_source=module-aqua-body&utm_campaign=link"
                className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
              >
                automations
              </Link>
              , keeping language aligned with what buyers actually say.
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              <ul className="space-y-2 text-sm text-muted">
                <li className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-brand" />
                  <span>Promise maps by region, service, and persona.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-brand" />
                  <span>Objection ranking and needed social proof.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-brand" />
                  <span>Top CTAs and highlighted creative formats.</span>
                </li>
              </ul>
              <div className="rounded-[var(--radius-card)] border border-line bg-white p-6 text-sm text-muted shadow-[var(--shadow-soft)]">
                <p className="font-semibold text-ink">Exports and integrations</p>
                <p className="mt-2">
                  Generate CSV reports, send blocks directly to the dashboard or CMS. APIs let you push data into
                  internal tools or dynamic sheets.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {highlightCards.map((item, idx) => (
              <Reveal key={item.title} variant="fadeInUp" delay={60 * idx}>
                <div className="h-full rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)]">
                  <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
                  <p className="mt-3 text-sm text-muted">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <CTAButton
            href="/projects?utm_source=module-aqua&utm_campaign=cta-secondary"
            label="See projects using AQUA"
            ariaLabel="See projects using AQUA"
            variant="secondary"
            source="module-aqua-body"
            campaign="cta-secondary"
          />
        </div>
      </section>

      <SeeAlso
        source="module-aqua-see-also"
        items={[
          {
            title: "InsightScore™",
            description: "Prioritize hypotheses from AQUA with explainable data science.",
            href: "/modules/insightscore",
          },
          {
            title: "Regional Pricing",
            description: "Combine language with competitive pricing by city.",
            href: "/modules/pricing",
          },
          {
            title: "Local industries",
            description: "See how we adapt copy for cleaning, health, and education.",
            href: "/industries/cleaning",
          },
          {
            title: "Contact",
            description: "Talk to the intelligence squad at CreAleph.",
            href: "/contact",
          },
        ]}
      />
    </div>
  );
}
