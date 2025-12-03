import { PageHero } from "@/components/layout/PageHero";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
import { CTAButton } from "@/components/ui/CTAButton";
import { SeeAlso } from "@/components/ui/SeeAlso";

const cases = [
  {
    title: "Marina Vox",
    industry: "Marinas & Charter",
    challenge: "Low predictability of bookings and high cancellation rate.",
    solution:
      "Website with dynamic showcase, Market Twin™ for rates, Bridge integrated with the marine ERP, and concierge automations.",
    result: "41% increase in average occupancy and 27% faster response time.",
    href: "/projects/case-marina-vox",
  },
  {
    title: "ClinGroup Health Integrated",
    industry: "Healthcare",
    challenge: "Dispersed scheduling, limited LGPD control, and outdated copy.",
    solution:
      "Specialty-based landing pages, monthly AQUA Insights, local campaigns, and integrations with scheduling systems.",
    result: "32% reduction in cost per appointment and 4.9/5 satisfaction.",
    href: "/projects/case-clingroup",
  },
  {
    title: "Construtora Norte",
    industry: "B2B Construction",
    challenge: "Pipeline without nurture, misaligned proposals, and an overloaded sales team.",
    solution:
      "Technical content hub, Bridge automations, Market Twin™ to prioritize regions, and executive dashboards.",
    result: "28% lift in proposal rate and a cycle 15 days shorter.",
    href: "/projects/case-construtora-norte",
  },
];

export default function ProjectsPage() {
  return (
    <div className="bg-white">
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Projects" },
        ]}
        subtitle="Projects"
        title="Case studies with real metrics and actionable learnings."
        body="We curated projects from different industries to show how we blend websites, marketing, automation, and intelligence modules. Each case brings context, challenges, solutions, activated modules, KPIs, implementation time, and next steps."
        ctas={[
          {
            label: "Request tailored study",
            href: "/contact?utm_source=projects&utm_campaign=cta-primary",
            ariaLabel: "Request a tailored study",
            campaign: "cta-primary",
          },
          {
            label: "View industries",
            href: "/industries?utm_source=projects&utm_campaign=cta-secondary",
            ariaLabel: "View served industries",
            variant: "secondary",
            campaign: "cta-secondary",
          },
        ]}
        source="projects-hero"
      />

      <SectionSeparator />

      <section className="px-4 py-16">
        <div className="mx-auto grid max-w-screen-xl gap-6 lg:grid-cols-3 lg:px-8">
          {cases.map((caseItem) => (
            <article
              key={caseItem.href}
              className="flex h-full flex-col justify-between rounded-[calc(var(--radius)*1.5)] border border-line bg-surface p-6 shadow-md transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-[0.3em] text-brand">
                  {caseItem.industry}
                </span>
                <h2 className="text-xl font-semibold text-ink">{caseItem.title}</h2>
                <p className="text-sm text-muted">
                  <strong>Challenge:</strong> {caseItem.challenge}
                </p>
                <p className="text-sm text-muted">
                  <strong>Solution:</strong> {caseItem.solution}
                </p>
                <p className="text-sm font-semibold text-brand">{caseItem.result}</p>
              </div>
              <CTAButton
                href={`${caseItem.href}?utm_source=projects&utm_campaign=cta-secondary`}
                label="Read full study"
                ariaLabel={`Read full study ${caseItem.title}`}
                variant="secondary"
                source="projects-grid"
                campaign="cta-secondary"
              />
            </article>
          ))}
        </div>
      </section>

      <SeeAlso
        source="projects-see-also"
        items={[
          {
            title: "Services",
            description: "Understand how we combine website, marketing, and automation squads.",
            href: "/services",
          },
          {
            title: "Modules",
            description: "Explore AQUA, Scout, Market Twin™, and other intelligence modules.",
            href: "/modules/aqua",
          },
          {
            title: "Industries",
            description: "See playbooks tailored to each segment.",
            href: "/industries",
          },
          {
            title: "Contact",
            description: "Talk to specialists and receive a free diagnosis.",
            href: "/contact",
          },
        ]}
      />
    </div>
  );
}
