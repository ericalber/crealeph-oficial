"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeInUp, staggerChildren } from "@/components/motion/presets";
import { CTAButton } from "@/components/ui/CTAButton";

const steps = [
  {
    title: "Listen & Map",
    body: "Parasite + Scout capture language, objections, and pricing signals by region to frame the opportunity map.",
    link: "/modules/aqua",
  },
  {
    title: "Design & Launch",
    body: "Squads ship pages, ads, and automations in 24h with templates and Bridge-ready integrations.",
    link: "/services/websites",
  },
  {
    title: "Measure & Evolve",
    body: "Market Twin benchmarks results; Playbooks recommend the next sprint with clear ownership and SLAs.",
    link: "/app",
  },
] as const;

export function HowCreAlephWorks() {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-[#0B0B0E] via-[#0B0B0E] to-[#0F1118] px-4 py-24 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.06),transparent_26%),radial-gradient(circle_at_80%_0%,rgba(224,32,32,0.2),transparent_38%)] opacity-70" />
      <div className="relative mx-auto max-w-screen-xl space-y-10 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
              How CreAleph Works
            </span>
            <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">From signals to actions, without friction</h2>
            <p className="max-w-2xl text-base text-white/80">
              A clean loop: listen, launch, learn. Each step is visible in the dashboard with ownership, SLAs, and Bridge-ready automations, across every vertical you operate.
            </p>
          </div>
          <CTAButton
            href="/contact"
            label="Start a project"
            ariaLabel="Start a project with CreAleph"
            campaign="cta-primary"
            variant="primary"
            source="home-how-crealeph"
          />
        </div>

        <motion.div
          variants={staggerChildren(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-6 md:grid-cols-3"
        >
          {steps.map((step) => (
            <motion.article
              key={step.title}
              variants={fadeInUp}
              className="group relative h-full rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[var(--depth-2)] backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-[var(--depth-3)]"
            >
              <div className="pointer-events-none absolute -inset-1 -z-10 rounded-3xl bg-gradient-to-br from-[#E02020]/18 via-transparent to-[#E02020]/10 opacity-0 blur-2xl transition group-hover:opacity-100" />
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <span className="text-sm font-semibold text-white/70">{String(steps.indexOf(step) + 1).padStart(2, "0")}</span>
              </div>
              <p className="mt-3 text-sm text-white/80">{step.body}</p>
              <Link
                href={step.link}
                className="mt-5 inline-flex items-center text-sm font-semibold text-white underline decoration-white/30 underline-offset-4 transition hover:text-white"
              >
                View details →
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
