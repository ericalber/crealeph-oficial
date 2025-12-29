"use client";

import Link from "next/link";
import { Brain, Sparkles, PenTool, LineChart, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerChildren } from "@/components/motion/presets";

const steps = [
  { title: "Parasite", subtitle: "Observe", icon: Brain, copy: "Signals from customers, competitors, and local trends to see what already converts." },
  { title: "Ideator", subtitle: "Generate Angles", icon: Sparkles, copy: "Angles and campaigns tied to the signals so teams know what to test first." },
  { title: "Copywriter", subtitle: "Generate Long Form", icon: PenTool, copy: "Long-form pages, scripts, and ads tailored to each vertical and region." },
  { title: "Market Twin", subtitle: "Benchmark", icon: LineChart, copy: "Benchmarks by niche and city to adjust pricing, promises, and offers." },
  { title: "Playbooks", subtitle: "Recommended Actions", icon: Rocket, copy: "Recommended actions connected to squads, Bridge automations, and SLAs." },
] as const;

export function IntelligenceCycle() {
  return (
    <section className="relative isolate overflow-hidden px-4 py-20">
      <div className="absolute inset-0 bg-[var(--gradient-brand-charcoal)] opacity-90" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(224,32,32,0.14),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(224,32,32,0.22),transparent_40%)]" />
      <div className="relative mx-auto max-w-screen-xl space-y-10 rounded-[30px] border border-white/10 bg-white/5 p-8 shadow-[var(--depth-2)] backdrop-blur-xl lg:px-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3 text-white">
            <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
              Intelligence Cycle
            </span>
            <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">Parasite → Ideator → Copywriter → Market Twin → Playbooks</h2>
            <p className="max-w-2xl text-sm text-white/80">
              The loop that turns raw signals into live actions. Parasite captures signals, Ideator and Copywriter ship angles, Market Twin benchmarks, Playbooks assign the next move.
            </p>
          </div>
          <Link
            href="/app/robots"
            className="inline-flex h-11 items-center justify-center rounded-full border border-white/30 px-5 text-center text-sm font-semibold leading-none text-white transition hover:border-white hover:bg-white/10"
          >
            View in Dashboard
          </Link>
        </div>

        <motion.div
          variants={staggerChildren(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-5"
        >
          {steps.map((step) => (
            <motion.article
              key={step.title}
              variants={fadeInUp}
              className="group relative flex h-full flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-5 text-white shadow-[0_18px_38px_rgba(0,0,0,0.25)] ring-1 ring-white/10 transition hover:-translate-y-1 hover:shadow-[0_26px_64px_rgba(224,32,32,0.25)]"
            >
              <div className="pointer-events-none absolute -inset-1 -z-10 rounded-3xl bg-gradient-to-br from-[#E02020]/18 via-transparent to-[#E02020]/8 opacity-0 blur-2xl transition group-hover:opacity-100" />
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
                  <step.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-white/60">{step.subtitle}</p>
                  <p className="text-base font-semibold">{step.title}</p>
                </div>
              </div>
              <p className="text-sm text-white/80">{step.copy}</p>
              <Link
                href="/app/robots"
                className="mt-auto inline-flex items-center text-sm font-semibold text-white/90 underline decoration-white/30 underline-offset-4 transition hover:text-white"
              >
                View in Dashboard →
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
