import { PageHero } from "@/components/layout/PageHero";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
import { CTAButton } from "@/components/ui/CTAButton";
import { SeeAlso } from "@/components/ui/SeeAlso";
import { Reveal } from "@/components/motion/Reveal";
import Link from "next/link";

const clusters = [
  {
    title: "Local and recurring services",
    description:
      "Salons, cleaning, gyms, private clinics. Websites focused on fast booking, geolocated campaigns, follow-up automations, and dynamic pricing.",
    href: "/industries/cleaning",
  },
  {
    title: "B2B, construction, and facilities",
    description:
      "High-ticket projects with multiple decision-makers. Technical content, multi-channel nurture, and pipeline dashboards integrated with the CRM.",
    href: "/industries/construction",
  },
  {
    title: "Automotive and marine",
    description:
      "Dealers, specialized shops, and marinas. Market Twin™ tracks pricing and approvals; Bridge connects inventory and billing.",
    href: "/industries/automotive",
  },
  {
    title: "Education and healthcare",
    description:
      "LGPD, compliance, and multiple audiences. Segmented journeys, educational content, and integrations with academic ERPs or medical records.",
    href: "/industries/education",
  },
];

export default function IndustriesPage() {
  return (
    <div className="bg-white">
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Industries" },
        ]}
        subtitle="Industries"
        title="Complete playbooks for the niches that demand precision most."
        body="We operate with squads dedicated to sensitive segments. For local businesses, we deliver speed and volume. In B2B, we sustain long journeys with rich content and intelligent automations. In healthcare and education, we reinforce compliance and accessibility. For automotive/marine, we monitor the market in real time with Market Twin™."
        ctas={[
          {
            label: "Request industry diagnosis",
            href: "/contact?utm_source=industries&utm_campaign=cta-primary",
            ariaLabel: "Request diagnosis by industry",
            campaign: "cta-primary",
          },
          {
            label: "View projects",
            href: "/projects?utm_source=industries&utm_campaign=cta-secondary",
            ariaLabel: "View projects by industry",
            variant: "secondary",
            campaign: "cta-secondary",
          },
        ]}
        source="industries-hero"
      />

      <SectionSeparator />

      <section className="px-4 py-24">
        <div className="mx-auto grid max-w-screen-xl gap-6 lg:grid-cols-2 lg:px-8">
          {clusters.map((cluster, idx) => (
            <Reveal key={`${cluster.href}-${cluster.title}`} variant="fadeInUp" delay={60 * idx}>
              <div className="flex h-full flex-col justify-between rounded-[var(--radius-card)] border border-line bg-surface p-8 shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)]">
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-ink">{cluster.title}</h2>
                  <p className="text-sm text-muted">{cluster.description}</p>
                </div>
                <CTAButton
                  href={cluster.href}
                  label="View details"
                  ariaLabel={`View details for ${cluster.title}`}
                  variant="secondary"
                  source="industries-grid"
                  campaign="cta-secondary"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-surface px-4 py-24">
        <div className="mx-auto max-w-screen-xl space-y-6 rounded-[var(--radius-card)] border border-line bg-white p-8 shadow-[var(--shadow-soft)] lg:px-12">
          <h2 className="text-2xl font-semibold text-ink">Recurring pain points vs. solutions</h2>
          <div className="overflow-x-auto text-sm text-muted">
            <table className="min-w-full text-left">
              <thead className="text-xs uppercase tracking-[0.2em] text-muted">
                <tr>
                  <th className="border-b border-line px-4 py-2">Pain points</th>
                  <th className="border-b border-line px-4 py-2">CreAleph solution</th>
                  <th className="border-b border-line px-4 py-2">Modules</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b border-line px-4 py-2">Misaligned messaging and low conversion</td>
                  <td className="border-b border-line px-4 py-2">AQUA Insights plus redesign based on TechAI Pack</td>
                  <td className="border-b border-line px-4 py-2">
                    <Link href="/modules/aqua?utm_source=industries-table&utm_campaign=link" className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline">
                      AQUA
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td className="border-b border-line px-4 py-2">Manual funnel and lost opportunities</td>
                  <td className="border-b border-line px-4 py-2">Automation with Bridge and stage-based playbooks</td>
                  <td className="border-b border-line px-4 py-2">
                    <Link href="/modules/bridge?utm_source=industries-table&utm_campaign=link" className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline">
                      Bridge
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td className="border-b border-line px-4 py-2">Lack of revenue predictability</td>
                  <td className="border-b border-line px-4 py-2">Regional Pricing plus Market Twin™</td>
                  <td className="border-b border-line px-4 py-2">
                    <Link href="/modules/pricing?utm_source=industries-table&utm_campaign=link" className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline">
                      Pricing
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <CTAButton
            href="/services?utm_source=industries&utm_campaign=cta-secondary"
            label="View full services portfolio"
            ariaLabel="View full services portfolio"
            variant="secondary"
            source="industries-table"
            campaign="cta-secondary"
          />
        </div>
      </section>

      <SeeAlso
        source="industries-see-also"
        items={[
          {
            title: "Services",
            description: "Get to know the packages for websites, marketing, and automation.",
            href: "/services",
          },
          {
            title: "Projects",
            description: "Real cases by industry with numbers and learnings.",
            href: "/projects",
          },
          {
            title: "Blog",
            description: "In-depth content with segment analyses.",
            href: "/resources/blog",
          },
          {
            title: "Contact",
            description: "Request a dedicated diagnosis for your niche.",
            href: "/contact",
          },
        ]}
      />
    </div>
  );
}
