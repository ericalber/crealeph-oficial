import Link from "next/link";
import { CTAButton } from "@/components/ui/CTAButton";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
import { ShineTicker } from "@/components/ui/ShineTicker";
import { PromoCard } from "@/components/cards/PromoCard";
import { MetricCard } from "@/components/cards/MetricCard";
import { DarkCard } from "@/components/cards/DarkCard";
import { BannerDark } from "@/sections/shared/BannerDark";
import { SeeAlso } from "@/components/ui/SeeAlso";
import { MiniQuoteForm } from "@/components/forms/MiniQuoteForm";
import { DifferentialsTabs } from "@/sections/home/DifferentialsTabs";
import SectionShine from "@/feature/shine/SectionShine";
import { FeaturesSection } from "@/sections/home/FeaturesSection";
import { MicroCTASticky } from "@/components/ui/MicroCTASticky";
import { TechSection } from "@/components/ui/TechSection";
import { TechCard } from "@/components/ui/TechCard";
import { TechCTA } from "@/components/ui/TechCTA";
import { ServicesHub } from "@/sections/home/ServicesHub";
import ShineGate from "@/feature/shine/ShineGate";
import LikeBurstShined from "@/feature/shine/LikeBurst";
import PullToRefreshHint from "@/feature/shine/PullToRefreshHint";
import { IntelligenceCycle } from "@/sections/home/IntelligenceCycle";
import { HowCreAlephWorks } from "@/sections/home/HowCreAlephWorks";
import { HeroCinematic } from "@/sections/home/HeroCinematic";
import { StatsSection } from "@/sections/home/StatsSection";
import { BlogSection } from "@/sections/home/BlogSection";
import { Reveal } from "@/components/motion/Reveal";

const modules = [
  {
    type: "promo",
    pill: "Module",
    title: "AQUA Insights",
    description:
      "See the promises, objections, and CTAs dominating your market in each city. Know what to say before writing the first line.",
    href: "/modules/aqua",
  },
  {
    type: "metric",
    value: "87%",
    label: "Projects approved in under 24h using Scout + InsightScore™",
  },
  {
    type: "promo",
    pill: "Module",
    title: "Market Twin™",
    description:
      "Compare pricing, response, and conversion by niche or region. Find where your positioning wins with live data.",
    href: "/modules/market-twin",
  },
  {
    type: "dark",
    title: "CREALEPH Bridge (API)",
    bullets: [
      "Integrates with Stripe, PayPal, and local gateways",
      "Simulates savings with automated approvals",
      "Real-time failure alerts",
    ],
  },
  {
    type: "promo",
    pill: "Module",
    title: "Regional Pricing",
    description:
      "How much to charge per neighborhood? Get mean, median, and suggested ranges based on your desired positioning.",
    href: "/modules/pricing",
  },
  {
    type: "metric",
    value: "6",
    label: "Pluggable modules that evolve with your operation",
  },
];

const faqItems = [
  {
    question: "How long to launch the first site or campaign?",
    answer:
      "With the immersion sprint and TechAI Pack layout library, we deliver the first version within 24 business hours. Every week we iterate using Scout data and real customer interviews.",
  },
  {
    question: "Are the modules optional or bundled?",
    answer:
      "You can use modules like AQUA Insights or Regional Pricing on their own. When connected to the site and campaigns, performance gains grow exponentially.",
  },
  {
    question: "Do you work with internal teams or only external squads?",
    answer:
      "Our squads can operate as a full unit or co-create with your marketing and tech teams. Bridge lets everyone follow insights, tickets, and integrations in real time.",
  },
  {
    question: "Which industries do you support most?",
    answer:
      "We support healthcare, education, mobility, local services, and B2B. Each robot specializes in a vertical while the platform keeps everything orchestrated.",
  },
  {
    question: "How can I track results?",
    answer:
      "The /app dashboard consolidates KPIs like new insights, winning promises, average pricing, and response percentiles. You can export reports or connect through the Bridge API.",
  },
];

export default function Home() {
  return (
    <div className="page-red flex flex-col">
      <HeroCinematic />

      <ServicesHub
        ctaPrimaryHref="/pricing"
        ctaSecondaryHref="/app"
        items={[
          { title: "Websites", icon: "websites", href: "/services/websites", desc: "Conversion-grade sites and landing pages with modular components and CRO baked in." },
          { title: "Marketing", icon: "marketing", href: "/services/marketing", desc: "SEO, paid, and content squads guided by signals from AQUA, Parasite, and Market Twin." },
          { title: "Automation", icon: "automation", href: "/services/automation", desc: "Lifecycle playbooks and Bridge automations that tie CRM, billing, and notifications together." },
          { title: "Projects & Modules", icon: "projects", href: "/modules", desc: "Vertical robots and special projects proven in healthcare, education, mobility, and local services." }
        ]}
      />

      <IntelligenceCycle />

      {/* Shine microinteractions (gated) */}
      <ShineGate>
        <PullToRefreshHint />
        <LikeBurstShined selectors={['a[href="/pricing"]']} />
      </ShineGate>

      <div id="how-it-works">
        <HowCreAlephWorks />
      </div>

      <FeaturesSection />

      <SectionSeparator />

      <ShineTicker />

      <SectionShine tone="crimson">
      <TechSection className="px-4 py-20">
        <div className="mx-auto max-w-screen-xl space-y-10 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl space-y-3">
              <span className="inline-flex items-center rounded-full bg-black/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white ring-1 ring-white/10">
                Core Suite
              </span>
              <h2 className="text-h2 font-semibold text-ink">The intelligence-first operating system</h2>
              <p className="text-base text-ink">
                Modules that move the numbers. Write promises that convert, adjust pricing by market, and monitor impact. Every module connects to the{" "}
                <Link
                  href="/modules/bridge?utm_source=home-modulos&utm_campaign=link"
                  className="text-ink underline underline-offset-4 decoration-black/30 transition hover:decoration-black"
                >
                  CREALPH Bridge
                </Link>{" "}
                and our{" "}
                <Link
                  href="/services/websites?utm_source=home-modulos&utm_campaign=link"
                  className="text-ink underline underline-offset-4 decoration-black/30 transition hover:decoration-black"
                >
                  website squads
                </Link>
                .
              </p>
            </div>
            <TechCTA
              href="/modules/aqua"
              label="View all modules"
              ariaLabel="View module list"
              source="home-modulos"
              campaign="cta-secondary"
              variant="secondary"
            />
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {modules.map((module, index) => (
              <div key={`${module.type}-${module.title || index}`} className="h-full">
                {module.type === "promo" ? (
                  <PromoCard
                    pill={module.pill!}
                    title={module.title!}
                    description={module.description!}
                    href={module.href}
                  />
                ) : null}
                {module.type === "metric" ? (
                  <MetricCard value={module.value!} label={module.label!} />
                ) : null}
                {module.type === "dark" ? (
                  <DarkCard title={module.title!} items={module.bullets!} />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </TechSection>
      </SectionShine>

      <SectionSeparator />

      <StatsSection />

      <section className="px-4 py-24">
        <div className="mx-auto max-w-screen-xl space-y-10 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-ink">
                Transparent plans
              </span>
              <h2 className="mt-2 text-h2 font-semibold text-ink">
                Choose the right plan or talk to sales
              </h2>
            </div>
            <TechCTA
              href="/pricing"
              label="Compare plans"
              ariaLabel="Go to pricing page"
              source="home-pricing"
              campaign="cta-secondary"
              variant="brand"
            />
          </div>
          <PricingColumns />
        </div>
      </section>

      <SectionSeparator />

      <BlogSection />

      <SectionSeparator />

      <section className="px-4 py-20">
        <div className="mx-auto max-w-screen-xl space-y-10 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-ink">
                Frequently asked questions
              </span>
              <h2 className="text-h2 font-semibold text-ink">FAQ CreAleph</h2>
            </div>
            <MiniQuoteForm context="Quick quote" />
          </div>
          <div className="space-y-4">
            {faqItems.map((faq, index) => (
              <details
                key={faq.question}
                className="group rounded-[--radius] border border-[#E5E7EB] bg-white p-6 transition hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,.08)]"
                open={index === 0}
              >
                <summary className="flex cursor-pointer items-center justify-between text-base font-semibold text-ink">
                  {faq.question}
                  <span className="text-brand group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm text-muted">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <SectionShine tone="sky">
        <BannerDark
          title="Ready to run a site that truly sells?"
          subtitle="Enter the dashboard, follow insights, and invite your team to collaborate."
          primary={{
            label: "Enter the dashboard",
            href: "/app",
            ariaLabel: "Go to the CreAleph dashboard",
            campaign: "cta-primary",
          }}
          source="home-banner-2"
        />
      </SectionShine>

      <SeeAlso
        source="home-see-also"
        items={[
          {
            title: "CreAleph services",
            description:
              "See how we combine websites, marketing, and automation in tailored packages.",
            href: "/services",
          },
          {
            title: "Intelligence modules",
            description:
              "Access AQUA, Scout, Market Twin™, and other modules ready to plug into your operation.",
            href: "/modules/aqua",
          },
          {
            title: "Industries served",
            description:
              "Explore playbooks for local segments, B2B, healthcare, education, automotive, and more.",
            href: "/industries",
          },
          {
            title: "Proven projects",
            description:
              "Read full studies with real numbers from CreAleph clients.",
            href: "/projects",
          },
        ]}
      />
    </div>
  );
}

function PricingColumns() {
  const plans = [
    {
      name: "Starter",
      price: "USD 4,900/mo",
      description: "For local businesses that need a site and integrated media.",
      features: [
        "Modular website (up to 8 pages)",
        "Managed Google & Meta campaigns",
        "Access to AQUA Insights",
        "Automated weekly reports",
      ],
    },
    {
      name: "Pro",
      price: "USD 8,900/mo",
      description: "For regional or multi-location operations seeking scale.",
      features: [
        "Website plus unlimited landing pages",
        "Scout + Market Twin™ included",
        "Dedicated CRO and automation squad",
        "/app dashboard with up to 10 seats",
      ],
      featured: true,
    },
    {
      name: "Enterprise",
      price: "Custom quote",
      description: "For national networks, marketplaces, and regulated companies.",
      features: [
        "Custom projects in the CMS/tool of your choice",
        "Advanced integrations via Bridge",
        "24/7 support and continuous innovation squad",
        "Unlimited InsightScore™",
      ],
    },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {plans.map((plan, idx) => (
        <Reveal key={plan.name} variant="fadeInUp" delay={80 * idx}>
          <TechCard>
            <article className="flex h-full flex-col p-6">
              <div className="space-y-2">
                <span className="text-sm font-semibold uppercase tracking-[0.3em] text-brand">
                  {plan.name}
                </span>
                <p className="text-2xl font-semibold">{plan.price}</p>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">{plan.description}</p>
              </div>
              <ul className="mt-6 flex flex-1 flex-col gap-2 text-sm">
                {plan.features.map((feature) => (
                  <li key={`${plan.name}-${feature}`} className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-brand" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <TechCTA
                href={plan.name === "Enterprise" ? "/pricing/enterprise" : "/contact"}
                label={plan.name === "Enterprise" ? "Contact Sales" : "Choose this plan"}
                ariaLabel={`Select plan ${plan.name}`}
                source={`home-pricing-${plan.name.toLowerCase()}`}
                campaign="cta-primary"
                className="mt-8"
                variant="brand"
              />
            </article>
          </TechCard>
        </Reveal>
      ))}
    </div>
  );
}
