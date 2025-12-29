"use client";

import Link from "next/link";
import Image from "next/image";
import { Sparkles, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { ParallaxLayer } from "@/components/motion/Parallax";
import { CTAButton } from "@/components/ui/CTAButton";

const heroStagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const heroItem = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export function HeroCinematic() {
  return (
    <section className="relative isolate flex min-h-[92vh] items-center overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        <ParallaxLayer speed={10} className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(224,32,32,0.2),transparent_40%),linear-gradient(140deg,#0b0b0e,#0f1118)] opacity-90" />
        </ParallaxLayer>
        <ParallaxLayer speed={14} className="pointer-events-none absolute inset-0">
          <div className="absolute right-[-6%] top-16 h-[360px] w-[520px] opacity-85">
            <Image src="/assets/brand/hero/shape-1.svg" alt="Cinematic shape 1" fill className="object-contain" priority />
          </div>
        </ParallaxLayer>
        <ParallaxLayer speed={20} className="pointer-events-none absolute inset-0">
          <div className="absolute right-[2%] top-48 h-[420px] w-[420px] opacity-80 blur-sm">
            <Image src="/assets/brand/hero/shape-2.svg" alt="Cinematic shape 2" fill className="object-contain" priority />
          </div>
        </ParallaxLayer>
        <ParallaxLayer speed={26} className="pointer-events-none absolute inset-0">
          <div className="absolute right-[12%] top-24 h-[360px] w-[360px] opacity-75">
            <Image src="/assets/brand/hero/shape-3.svg" alt="Cinematic shape 3" fill className="object-contain" priority />
          </div>
        </ParallaxLayer>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:44px_44px] opacity-15" />
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "url('/assets/brand/hero/noise.png')" }} />
        <div className="pointer-events-none absolute right-[-10%] top-1/2 h-[580px] w-[580px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_40%_40%,rgba(224,32,32,0.22),rgba(12,12,18,0.2),transparent_70%)] blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/35" />
      </div>
      <div className="relative z-10 mx-auto grid w-full max-w-screen-xl grid-cols-1 items-center gap-12 px-4 py-28 lg:grid-cols-12 lg:px-8">
        <motion.div
          variants={heroStagger}
          initial="hidden"
          animate="show"
          className="space-y-6 rounded-3xl bg-black/30 p-6 shadow-[var(--depth-2)] ring-1 ring-white/10 backdrop-blur-xl lg:col-span-8 lg:p-8"
        >
          <motion.span
            variants={heroItem}
            className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/90 shadow-[var(--glow)] ring-1 ring-white/10"
          >
            <span className="bg-gradient-to-r from-[#F59E0B] via-[#F43F5E] to-[#7C3AED] bg-clip-text text-transparent">Sites that convert</span>
            <span className="mx-2">+</span>
            <span className="underline decoration-[#F43F5E]/70 underline-offset-4">intelligent marketing</span>
          </motion.span>
          <motion.h1 variants={heroItem} className="text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
            Grow with
            <span className="mx-2 rounded-lg bg-white/10 px-2 py-1 text-white shadow-[var(--glow)]">pages that sell</span>
            and
            <span className="ml-2 bg-gradient-to-r from-[#34D399] via-[#06B6D4] to-[#6366F1] bg-clip-text text-transparent">data that decides</span>.
          </motion.h1>
          <motion.p variants={heroItem} className="text-base text-white/85">
            Vertical intelligence, multiple industries. Each robot specializes in a vertical, and CreAleph orchestrates all of them in one stack.
            From AQUA and Parasite signals to Market Twin™ pricing and Bridge automations, every launch is backed by live data.
          </motion.p>
          <motion.div variants={heroItem} className="flex flex-wrap gap-3">
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.98 }}>
              <CTAButton
                href="/contact"
                label="View demo"
                ariaLabel="View a live demo"
                variant="primary"
                source="home-hero"
                campaign="cta-primary"
              />
            </motion.div>
            <CTAButton
              href="#how-it-works"
              label="See how it works"
              ariaLabel="Jump to How it works section"
              variant="secondary"
              source="home-hero"
              campaign="cta-secondary"
            />
          </motion.div>
          <motion.div variants={heroItem} className="flex flex-wrap items-center gap-3 text-xs text-white/60">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1">
              <span aria-hidden>🔐</span> SSL badge • Daily backups • LGPD ready
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1">
              <Sparkles className="h-3.5 w-3.5" aria-hidden /> Response within 24 business hours
            </span>
          </motion.div>
        </motion.div>
        <div className="pointer-events-auto absolute bottom-6 right-6 z-20">
          <Link
            href="/contact?utm_source=hero-bottom-right&utm_campaign=demo"
            className="group inline-flex items-center gap-2 rounded-md bg-[#E02020] px-5 py-3 text-sm font-semibold text-white shadow-xl ring-1 ring-white/20 transition hover:-translate-y-1 hover:bg-[#C11B1B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <Calendar className="icon h-4 w-4" aria-hidden />
            <span>Schedule a Demo</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
