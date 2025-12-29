"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HubIcon, type HubIconKey } from "./servicesHubIcons";
import { fadeInUp, staggerChildren } from "@/components/motion/presets";

type Item = {
  title: string;
  href: string;
  desc: string;
  icon?: HubIconKey;
};

type ServicesHubProps = {
  items: Item[];
  ctaPrimaryHref: string;
  ctaSecondaryHref: string;
};

function slugifyLabel(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function ServicesHub({ items, ctaPrimaryHref, ctaSecondaryHref }: ServicesHubProps) {
  return (
    <section className="relative isolate px-4 py-24" aria-labelledby="services-hub">
      <div className="pointer-events-none absolute inset-0 bg-[var(--gradient-brand-charcoal)] opacity-80" />
      <div className="relative mx-auto max-w-[1150px] px-6">
        <div className="rounded-[var(--radius-lg)] bg-white/98 p-10 shadow-[var(--shadow-soft)] ring-1 ring-black/5 backdrop-blur">
          <div className="space-y-2">
            <h2 id="services-hub" className="text-[#0B0B0E] text-2xl md:text-3xl font-semibold">
              Build with a product-first team
            </h2>
            <p className="text-[#0B0B0E]/80 text-sm md:text-base">
              Websites, marketing, automation, and special projects orchestrated by vertical intelligence—without losing speed.
            </p>
          </div>

          <motion.div
            className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6"
            variants={staggerChildren(0.08)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {items.map((item) => {
              const um = `home.servicesHub.card.${slugifyLabel(item.title)}`;
              return (
                <motion.div key={item.href} variants={fadeInUp}>
                  <Link
                    href={item.href}
                    aria-label={item.title}
                    data-um={um}
                    className="group block min-h-[150px] rounded-[var(--radius-card)] border border-black/8 bg-white/95 p-5 shadow-[var(--depth-1)] transition duration-200 hover:-translate-y-[6px] hover:shadow-[var(--shadow-elevated)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D62828] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  >
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFE3E3] ring-1 ring-[#D62828]/20 transition duration-200 group-hover:scale-[1.05]">
                      {item.icon ? <HubIcon name={item.icon} className="icon icon-6 text-[#0B0B0E]" /> : null}
                    </div>
                    <div className="text-[#0B0B0E] text-base md:text-lg font-semibold">{item.title}</div>
                    <div className="text-[#0B0B0E]/70 text-sm">{item.desc}</div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={ctaPrimaryHref}
              className="inline-flex h-11 items-center rounded-full bg-[#D62828] px-6 text-sm font-semibold text-white shadow-[0_16px_42px_rgba(214,40,40,0.35)] transition duration-200 hover:-translate-y-[2px] hover:bg-[#B91C1C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D62828]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              aria-label="View Plans"
            >
              View Plans
            </Link>
            <Link
              href={ctaSecondaryHref}
              className="inline-flex h-11 items-center rounded-full border border-[#D62828] bg-[#D62828] px-6 text-sm font-semibold text-white transition duration-200 hover:-translate-y-[2px] hover:bg-[#B91C1C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D62828]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              aria-label="Enter Dashboard"
            >
              Enter Dashboard
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-11 items-center rounded-full border border-[#0B0B0E]/12 px-6 text-sm font-bold text-[#0B0B0E] transition duration-200 hover:-translate-y-[2px] hover:bg-black/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B0B0E]/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              aria-label="Talk with a specialist"
            >
              Talk with a specialist
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
