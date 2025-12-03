import Link from "next/link";
import Image from "next/image";
import { Car, Briefcase, Hammer, GraduationCap, Stethoscope, Ship, Sparkles, Calendar } from "lucide-react";
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
import { CoreModules } from "@/sections/home/CoreModules";
// Removed industries sections per request
import { FeaturesSection } from "@/sections/home/FeaturesSection";
import { ProblemSnapshotSection } from "@/sections/home/ProblemSnapshotSection";
import { MicroCTASticky } from "@/components/ui/MicroCTASticky";
import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { HeroRobotImage } from "@/components/ui/HeroRobotImage";
import { TechSection } from "@/components/ui/TechSection";
import { TechCard } from "@/components/ui/TechCard";
import { TechCTA } from "@/components/ui/TechCTA";
import { ServicesHub } from "@/sections/home/ServicesHub";
import ShineGate from "@/feature/shine/ShineGate";
import LikeBurstShined from "@/feature/shine/LikeBurst";
import PullToRefreshHint from "@/feature/shine/PullToRefreshHint";

const steps = [
  {
    title: "Observe",
    description:
      "We gather market, competitor, and local demand data with Scout and AQUA to build the opportunity map for your segment.",
    href: "/services?utm_source=home-how&utm_campaign=cta-secondary",
  },
  {
    title: "Understand",
    description:
      "We turn insights into actionable hypotheses. InsightScore™ prioritizes by impact, effort, and seasonality for your niche.",
    href: "/modules/insightscore?utm_source=home-how&utm_campaign=cta-secondary",
  },
  {
    title: "Act",
    description:
      "We launch pages, campaigns, and automations with a 24h SLA to the first deliverable plus dashboards with live results.",
    href: "/app?utm_source=home-how&utm_campaign=cta-primary",
  },
];

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

const industries = [
  {
    title: "Local businesses",
    description:
      "Beauty salons, professional cleaning, clinics, gyms. We run digital presence, geolocated ads, and booking automations.",
    href: "/industries/cleaning",
    image: "/assets/figma/48c24fdaef377d8af271479c82bff80122ef1eb1.svg",
  },
  {
    title: "B2B and project-based companies",
    description:
      "Construction, facilities, and technical consultancies. We offer modular websites, ABM marketing, and automated qualification playbooks.",
    href: "/industries/construction",
    image: "/assets/figma/236c1b00844da687203920e5202684f4a26845dd.svg",
  },
  {
    title: "Automotive and marine",
    description:
      "Dealers, premium shops, and marinas rely on Market Twin™ to adjust prices, score leads tied to inventory, and run multi-channel campaigns.",
    href: "/industries/automotive",
    image: "/assets/figma/451e29cc595f33ef6fe7e9d50ad7df00cb82c299.svg",
  },
  {
    title: "Digital education",
    description:
      "Schools, edtechs, and universities across regions with enrollment automation, local SEO, and retention dashboards.",
    href: "/industries/education",
    image: "/assets/figma/690bf37cfa9a864b4e2d21acd285d958a7fcc803.svg",
  },
  {
    title: "Healthcare",
    description:
      "Clinics, practices, and healthtechs with strict LGPD flows, secure portals, and integrations with scheduling and billing ERPs.",
    href: "/industries/health",
    image: "/assets/figma/72c100367f0b3e6c29d3d46cb684f850e088aed5.svg",
  },
  {
    title: "Marinas and charters",
    description:
      "We streamline omnichannel experiences for fleets, reservations, and maintenance with Bridge plus automations that avoid lost opportunities.",
    href: "/industries/marinas",
    image: "/assets/figma/18d6f29be35948162a938b7e6089936554f47aab.svg",
  },
];

const metrics = [
  { value: "+37%", label: "Average approval rate on new pages" },
  { value: "24h", label: "First deliverable validated by a dedicated squad" },
  { value: "4.9/5", label: "Average satisfaction after launch" },
  { value: "12%", label: "Average cost-per-lead reduction in 60 days" },
];

const projectStories = [
  {
    name: "Marina Vox",
    challenge: "Low predictability for boat rentals.",
    solution:
      "Dynamic website with Market Twin™, Scout connected to competitors, and Bridge follow-up automations.",
    result: "41% increase in average occupancy for the quarter.",
    href: "/projects/case-marina-vox",
  },
  {
    name: "ClinGroup Saúde Integrada",
    challenge: "Dispersed scheduling and offline channels without tracking.",
    solution:
      "Localized landing pages, integrated campaigns, and InsightScore™ validating messages by neighborhood.",
    result: "32% drop in cost per appointment and a digital waitlist in 7 days.",
    href: "/projects/case-clingroup",
  },
  {
    name: "Construtora Norte",
    challenge: "B2B funnel without nurture and low lead utilization.",
    solution:
      "Rich content hub, stage-based automations, and CRM-connected dashboards with Bridge.",
    result: "28% lift in proposal presentation rate.",
    href: "/projects/case-construtora-norte",
  },
];

const blogPosts = [
  {
    title: "How a modular site cuts 35% of launch time",
    href: "/resources/blog/site-modular",
    excerpt:
      "See the workflow that links discovery to launch with synchronized squads and components built for conversion.",
  },
  {
    title: "Smart marketing checklist for local businesses",
    href: "/resources/blog/checklist-locais",
    excerpt:
      "Combine regional SEO, responsible paid media, and service automations to keep cost per lead healthy all year.",
  },
  {
    title: "Pricing guide with Market Twin™",
    href: "/resources/blog/guia-precificacao",
    excerpt:
      "Learn to adjust prices in real time, avoid lost revenue, and protect margin with data from nearby cities.",
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
    question: "Do you support regulated industries like Healthcare and Education?",
    answer:
      "Yes. We work with LGPD protocols, auditing, and access control. In healthcare we integrate medical records and CRMs; in education we connect academic ERPs and LMS platforms.",
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
      <section className="relative isolate ts-grid ts-vignette flex min-h-[92vh] items-center overflow-hidden bg-black text-white">
        {/* Background de marca (gradiente + arte leve) */}
        <Image
          src="/assets/brand/hero-bg.svg"
          alt="CreAleph brand background"
          fill
          priority
          className="object-cover opacity-80 z-0"
        />
        {/* Overlay para legibilidade */}
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-black/70 via-black/45 to-black/25" />
        {/* Decorative visual on the right (does not affect grid/text) */}
        <div className="pointer-events-none absolute inset-y-0 right-0 z-[2] hidden items-center pr-6 md:flex">
          <HeroRobotImage
            className="h-auto w-[42vw] max-w-[540px] md:w-[42vw] lg:w-[44vw] lg:max-w-[560px] drop-shadow-[0_20px_80px_rgba(224,32,32,.35)]"
            srcCandidates={[
              "/brand/robo.png",
              "/brand/-Pngtree-robotic%20cyberpunk%20artwork_16198298.png", // variation with simple hyphen
              "/brand/Pngtree-robotic%20cyberpunk%20artwork_16198298.png",
              "/brand/robotic%20cyberpunk%20artwork_16198298.png",
            ]}
          />
        </div>
        <div className="relative z-10 mx-auto grid w-full max-w-screen-xl grid-cols-1 items-center gap-12 px-4 py-28 lg:grid-cols-12 lg:px-8">
          <div className="space-y-6 lg:col-span-8">
            <Reveal as="span" variant="fade" delay={50} className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/90 shadow-[var(--glow)] ring-1 ring-white/10">
              <span className="bg-gradient-to-r from-[#F59E0B] via-[#F43F5E] to-[#7C3AED] bg-clip-text text-transparent">Sites that convert</span>
              <span className="mx-2">+</span>
              <span className="underline decoration-[#F43F5E]/70 underline-offset-4">intelligent marketing</span>
            </Reveal>
            <Reveal as="h1" variant="slideUp" delay={120} className="text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
              Grow with
              <span className="mx-2 rounded-lg bg-white/10 px-2 py-1 text-white shadow-[var(--glow)]">pages that sell</span>
              and
              <span className="ml-2 bg-gradient-to-r from-[#34D399] via-[#06B6D4] to-[#6366F1] bg-clip-text text-transparent">data that decides</span>.
            </Reveal>
            <Reveal as="p" variant="fade" delay={220} className="text-base text-white/85">
              We operate modular websites, performance marketing, and automations
              with real market data. With{" "}
              <Link
                href="/modules/aqua?utm_source=home-hero&utm_campaign=link"
                className="underline underline-offset-4 transition hover:text-white"
              >
                AQUA Insights
              </Link>
              , we learn how your customers speak. With{" "}
              <Link
                href="/modules/market-twin?utm_source=home-hero&utm_campaign=link"
                className="underline underline-offset-4 transition hover:text-white"
              >
                Market Twin™
              </Link>{" "}
              we calibrate prices by region. And with{" "}
              <Link
                href="/services/automation?utm_source=home-hero&utm_campaign=link"
                className="underline underline-offset-4 transition hover:text-white"
              >
                CreAleph automations
              </Link>{" "}
              we ship the first version in 24h while keeping squads and continuous evolution active.
            </Reveal>
            <Reveal as="div" variant="zoom" delay={300} className="flex flex-wrap gap-3">
              <CTAButton
                href="/industries"
                label="View services"
                ariaLabel="Explore the industries we serve"
                variant="ghost"
                source="home-hero"
                campaign="cta-secondary"
              />
              <CTAButton
                href="#how-it-works"
                label="See how it works"
                ariaLabel="Jump to How it works section"
                variant="ghost"
                source="home-hero"
                campaign="cta-ghost"
              />
            </Reveal>
            <Reveal as="div" variant="fade" delay={380} className="flex items-center gap-4 text-xs text-white/60">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1">
                <span aria-hidden>🔐</span> SSL badge • Daily backups • LGPD ready
              </span>
              <span>Response within 24 business hours</span>
            </Reveal>
          </div>
          {/* Right column removed; visual stays absolute to avoid shifting text */}
          {/* CTA absoluto permanece */}
          <div className="pointer-events-auto absolute bottom-6 right-6 z-20">
            <Link
              href="/contact?utm_source=hero-bottom-right&utm_campaign=demo"
              className="group inline-flex items-center gap-2 rounded-md bg-[#E02020] px-5 py-3 text-sm font-semibold text-white shadow-xl ring-1 ring-white/20 transition hover:bg-[#C11B1B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <Calendar className="icon h-4 w-4" aria-hidden />
              <span>Schedule a Demo</span>
            </Link>
          </div>
        </div>
      </section>

      <ServicesHub
        ctaPrimaryHref="/pricing"
        ctaSecondaryHref="/app"
        items={[
          { title: "Websites", icon: "websites", href: "/services/websites", desc: "High-quality sites with performance and CRO in mind." },
          { title: "Marketing", icon: "marketing", href: "/services/marketing", desc: "SEO, Paid (package), Content and CRO under one plan." },
          { title: "Automation", icon: "automation", href: "/services/automation", desc: "Lifecycle playbooks and ‘robot’ jobs wired to your stack." },
          { title: "AI Modules", icon: "modules", href: "/modules", desc: "AQUA, Scout, InsightScore, Market Twin, Pricing, Bridge." },
          { title: "Projects", icon: "projects", href: "/projects", desc: "Case studies by industry with measurable outcomes." },
          { title: "Industries", icon: "industries", href: "/industries", desc: "Sector-specific playbooks and positioning." }
        ]}
      />

      {/* Shine microinteractions (gated) */}
      <ShineGate>
        <PullToRefreshHint />
        <LikeBurstShined selectors={['a[href="/pricing"]']} />
      </ShineGate>

      <SectionSeparator />

      <SectionShine tone="crimson" className="px-0 py-0">
        <DifferentialsTabs />
      </SectionShine>
      <SectionSeparator />

      {/* Main problem framed as anti-patterns */}
      <SectionShine tone="crimson" className="rounded-2xl">
        <ProblemSnapshotSection />
      </SectionShine>

      <SectionShine tone="crimson">
      <TechSection id="how-it-works" className="px-4 py-20">
        <div className="mx-auto max-w-screen-xl space-y-8 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl space-y-3">
              <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-ink">
                How it works
              </span>
              <h2 className="text-h2 font-extrabold text-white leading-tight max-w-3xl">From insight to action without friction</h2>
              <p className="text-base text-white/85">
                We turn data into momentum. While our squad executes,
                you track the funnel in real time on the dashboard with practical
                indicators and direct links to{" "}
                <Link
                  href="/services/marketing?utm_source=home-how&utm_campaign=link"
                  className="underline underline-offset-4 transition hover:text-white"
                >
                  intelligent marketing
                </Link>{" "}
                and{" "}
                <Link
                  href="/modules/scout?utm_source=home-how&utm_campaign=link"
                  className="underline underline-offset-4 transition hover:text-white"
                >
                  competitor monitoring
                </Link>
                .
              </p>
            </div>
            <TechCTA
              href="/app"
              label="View dashboard"
              ariaLabel="Open dashboard preview"
              source="home-how"
              campaign="cta-secondary"
              variant="brand"
            />
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, idx) => (
              <Reveal key={step.title} variant="slideUp" delay={80 + idx * 80}>
                <TechCard>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                    <p className="mt-3 text-sm text-[hsl(var(--muted-foreground))]">{step.description}</p>
                    <Link
                      href={step.href}
                      className="mt-6 inline-flex text-sm font-semibold text-brand hover:text-brand-600"
                      aria-label={`Learn more about ${step.title}`}
                    >
                      Learn more →
                    </Link>
                  </div>
                </TechCard>
              </Reveal>
            ))}
          </div>
        </div>
      </TechSection>
      </SectionShine>

      <CoreModules />

      {/* Block 2 - Differentials */}
      <FeaturesSection />

      <ShineTicker />

      <SectionShine tone="crimson">
      <TechSection className="px-4 py-20">
        <div className="mx-auto max-w-screen-xl space-y-10 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl space-y-3">
              <span className="inline-flex items-center rounded-full bg-black/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white ring-1 ring-white/10">
                Core Suite
              </span>
              <h2 className="text-h2 font-semibold text-ink">Modules that move the numbers</h2>
              <p className="text-base text-ink">
                Write promises that convert, adjust pricing by market, and
                monitor impact. Every module connects to the{" "}
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
              variant="brand"
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

      <SectionShine tone="sky">
      <section className="px-4 py-20">
        <div className="mx-auto max-w-screen-xl lg:px-8">
          <div className="grid gap-6 md:grid-cols-4">
            {metrics.map((metric) => (
              <MetricCard key={`${metric.label}-${metric.value}`} value={metric.value} label={metric.label} />
            ))}
          </div>
          <div className="theme-invert mt-10 flex flex-wrap items-center justify-between gap-4">
            <p className="max-w-2xl text-sm text-white/80">
              Consolidated data from 112 active projects with continuous KPI monitoring.
              See how we apply these indicators on{" "}
              <Link
                href="/projects?utm_source=home-metricas&utm_campaign=link"
                className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
              >
                project pages
              </Link>{" "}
              and choose the best fit in{" "}
              <Link
                href="/pricing?utm_source=home-metricas&utm_campaign=link"
                className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
              >
                pricing
              </Link>
              .
            </p>
            <CTAButton
              href="/projects"
              label="See full case studies"
              ariaLabel="Open projects page"
              variant="ghost"
              source="home-metricas"
              campaign="cta-secondary"
            />
          </div>
        </div>
      </section>
      </SectionShine>

      {process.env.NEXT_PUBLIC_FEATURE_UI_SHINE === "true" ? null : (
        <BannerDark
          title="Guided demo in 30 minutes."
          subtitle="See the full dashboard flow, watch automations live, and get an adoption plan with estimated investments."
          primary={{
            label: "Schedule demo",
            href: "/contact",
            ariaLabel: "Schedule a demo with a CreAleph specialist",
            campaign: "cta-primary",
          }}
          source="home-banner-1"
        />
      )}

      {/* Fixed micro-CTA on the footer */}
      <MicroCTASticky label="View demo" href="/contact" />

      <SectionSeparator />

      <SectionShine tone="crimson">
      <section className="relative isolate px-4 py-20 ts-grid ts-vignette">
        <div className="mx-auto max-w-screen-xl space-y-12 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="theme-invert space-y-3">
              <span className="inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand">
                Featured projects
              </span>
              <h2 className="text-h2 font-semibold text-ink">Results that speak for themselves</h2>
              <p className="text-base text-muted">Objective, action, and impact for every case with real dashboard numbers.</p>
            </div>
            <CTAButton
              href="/projects"
              label="All projects"
              ariaLabel="Go to all projects"
              variant="ghost"
              source="home-projetos"
              campaign="cta-secondary"
            />
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {projectStories.map((project) => (
              <article
                key={project.name}
                className="flex h-full flex-col justify-between rounded-[--radius] border border-[#E5E7EB] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,.08)]"
              >
                <header className="space-y-2">
                  <h3 className="text-xl font-semibold text-ink">{project.name}</h3>
                  <p className="text-sm text-muted">
                    <strong>Challenge:</strong> {project.challenge}
                  </p>
                </header>
                <p className="mt-4 text-sm text-muted">
                  <strong>Solution:</strong> {project.solution}
                </p>
                <p className="mt-4 text-sm font-semibold text-brand">
                  {project.result}
                </p>
                <Link
                  href={`${project.href}?utm_source=home-projetos&utm_campaign=cta-secondary`}
                  className="link-cta mt-4 inline-flex text-sm font-semibold text-brand hover:text-brand-600"
                >
                  See full study →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      </SectionShine>

      <SectionSeparator />

      <section className="px-4 py-20">
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

      <SectionShine tone="crimson">
      <section className="relative isolate px-4 py-20 ts-grid ts-vignette">
        <div className="mx-auto max-w-screen-xl space-y-8 lg:px-8">
          <div className="theme-invert flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand">
                Blog &amp; resources
              </span>
              <h2 className="mt-2 text-h2 font-semibold text-ink">
                Premium content for digital teams
              </h2>
            </div>
            <CTAButton
              href="/resources"
              label="View resources"
              ariaLabel="Open resources hub"
              variant="ghost"
              source="home-recursos"
              campaign="cta-secondary"
            />
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {blogPosts.map((post) => (
              <article
                key={post.href}
                className="rounded-[--radius] border border-[#E5E7EB] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,.08)]"
              >
                <h3 className="text-lg font-semibold text-ink">{post.title}</h3>
                <p className="mt-3 text-sm text-muted">{post.excerpt}</p>
                <Link
                  href={`${post.href}?utm_source=home-recursos&utm_campaign=cta-secondary`}
                  className="mt-4 inline-flex text-sm font-semibold text-brand hover:text-brand-600"
                  aria-label={`Read ${post.title}`}
                >
                  Read now →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      </SectionShine>

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
      price: "BRL 4,900/mo",
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
      price: "BRL 8,900/mo",
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
      {plans.map((plan) => (
        <TechCard key={plan.name}>
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
      ))}
    </div>
  );
}
