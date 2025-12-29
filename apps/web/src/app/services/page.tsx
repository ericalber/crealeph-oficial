import { PageHero } from "@/components/layout/PageHero";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
import { CTAButton } from "@/components/ui/CTAButton";
import { MiniQuoteForm } from "@/components/forms/MiniQuoteForm";
import { SeeAlso } from "@/components/ui/SeeAlso";
import Link from "next/link";
import { Monitor, Megaphone, Workflow } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

const serviceStacks = [
  {
    title: "Websites built for conversion",
    description:
      "TechAI Pack layout and component libraries let us deliver a high-performance site in days. Each block brings variants proven in 112 projects and integrations with CRM, chat, and analytics to measure everything in real time.",
    bullets: [
      "Discovery with AQUA Insights mapping winning promises",
      "Living design system in Figma plus code with shared tokens",
      "Technical SEO, web vitals performance, and scalable infra",
    ],
    href: "/services/websites",
  },
  {
    title: "Intelligent marketing with Scout + InsightScore™",
    description:
      "We run multi-channel campaigns with message matrices per audience, manage paid media and editorial content. Scout monitors competitors daily and InsightScore™ turns insights into prioritized actions.",
    bullets: [
      "Google, Meta, LinkedIn, and local network campaigns with sector playbooks",
      "Editorial calendar tied to Market Twin™ to tune prices and CTAs",
      "CRO and growth dashboards with continuous A/B experiments",
    ],
    href: "/services/marketing",
  },
  {
    title: "Operational automation and Bridge API",
    description:
      "We build full journeys for sales, service, and post-sale. We integrate CRM, billing, support tools, and notifications. With Bridge, we monitor approvals, savings, and failures in real time.",
    bullets: [
      "Qualification and nurture playbooks connected to CRM and telephony",
      "Billing workflows with Regional Pricing by city",
      "Smart alerts and webhooks for internal squads",
    ],
    href: "/services/automation",
  },
];

export default function ServicesPage() {
  return (
    <div className="bg-white">
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services" },
        ]}
        subtitle="Services"
        title="We build sites that convert and run marketing with intelligence."
        body="Our squads combine strategy, UX, engineering, and automation in biweekly cycles. In a single project, you get a site built with the TechAI Pack, campaigns with Scout and InsightScore™, automations with Bridge, and reports showing real impact. We collaborate with internal teams or operate as a full unit, always with clear SLAs and data accessible in the dashboard."
        ctas={[
          {
            label: "Request proposal",
            href: "/contact",
            ariaLabel: "Request a CreAleph services proposal",
            campaign: "cta-primary",
          },
          {
            label: "See plans and pricing",
            href: "/pricing",
            ariaLabel: "Visit the pricing page",
            variant: "secondary",
            campaign: "cta-secondary",
          },
        ]}
        source="services-hero"
      />

      <SectionSeparator />

      <section className="px-4 py-24">
        <div className="mx-auto grid max-w-screen-xl gap-10 lg:px-8">
          {serviceStacks.map((stack, index) => (
            <Reveal key={`${stack.title}-${index}`} variant="fadeInUp" delay={40 * index}>
              <div className="group grid gap-8 rounded-[var(--radius-card)] border border-line bg-white p-8 shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)] md:grid-cols-[1.2fr_0.8fr]">
                <div className="relative space-y-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand ring-1 ring-brand/20 transition group-hover:shadow-[var(--glow)] group-hover:bg-brand/20">
                    {stack.title.includes("Website") ? (
                      <Monitor size={22} />
                    ) : stack.title.includes("Marketing") ? (
                      <Megaphone size={22} />
                    ) : (
                      <Workflow size={22} />
                    )}
                  </div>
                  <h2 className="text-2xl font-semibold text-ink">{stack.title}</h2>
                  <p className="text-sm text-muted">
                    {stack.description} See how we use{" "}
                    <Link
                      href="/modules/aqua?utm_source=services-body&utm_campaign=link"
                      className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                    >
                      AQUA Insights
                    </Link>
                    , the percentiles from{" "}
                    <Link
                      href="/modules/market-twin?utm_source=services-body&utm_campaign=link"
                      className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                    >
                      Market Twin™
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/services/automation?utm_source=services-body&utm_campaign=link"
                      className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                    >
                      tailored automations
                    </Link>{" "}
                    for each sector.
                  </p>
                  <ul className="space-y-2 text-sm text-muted">
                    {stack.bullets.map((bullet, idx) => (
                      <li key={`${stack.title}-${idx}`} className="flex items-start gap-2">
                        <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-brand" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  <CTAButton
                    href={stack.href}
                    label="View details"
                    ariaLabel={`View details for service ${stack.title}`}
                    variant="secondary"
                    source="services-stack"
                    campaign="cta-secondary"
                  />
                </div>
                <MiniQuoteForm context={`Quick quote • ${index + 1}`} />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <SectionSeparator />

      <section className="px-4 py-24">
        <div className="mx-auto max-w-screen-xl space-y-6 rounded-[var(--radius-card)] border border-line bg-white p-8 shadow-[var(--shadow-soft)] lg:px-12">
          <h2 className="text-2xl font-semibold text-ink">
            Connected operation from briefing to performance
          </h2>
          <p className="text-sm text-muted">
            Discovery in 48h with interviews, desk research, and Scout readouts.
            Planning with a biweekly roadmap, goals, and owners. Execution with dedicated
            website, marketing, and automation squads. Daily follow-up via the /app dashboard,
            weekly reports, and continuous improvement rituals. When needed, we connect internal
            teams to Bridge APIs to sync data with ERPs, CRMs, or proprietary platforms.
          </p>
          <div className="flex flex-wrap gap-3">
            <CTAButton
              href="/projects"
              label="See case studies"
              ariaLabel="Open case studies"
              variant="secondary"
              source="services-overview"
              campaign="cta-secondary"
            />
            <CTAButton
              href="/industries"
              label="Explore by industry"
              ariaLabel="Explore services by industry"
              variant="ghost"
              source="services-overview"
              campaign="cta-ghost"
            />
          </div>
        </div>
      </section>

      <SeeAlso
        source="services-see-also"
        items={[
          {
            title: "Websites that sell",
            description: "Understand the stack, processes, and delivery examples at high speed.",
            href: "/services/websites",
          },
          {
            title: "Intelligent marketing",
            description: "Data-driven campaigns with Scout, InsightScore™, and Market Twin™.",
            href: "/services/marketing",
          },
          {
            title: "Operational automation",
            description: "From lead capture to billing, all tracked with CREALEPH Bridge.",
            href: "/services/automation",
          },
          {
            title: "Plans and pricing",
            description: "Compare deliverables and find the right mix of modules.",
            href: "/pricing",
          },
        ]}
      />
    </div>
  );
}
