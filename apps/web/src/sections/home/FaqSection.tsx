"use client";

import { useState } from "react";
import { Reveal } from "@/components/motion/Reveal";

const faqs = [
  {
    question: "Which industries do you support most?",
    answer: "We serve healthcare, education, mobility, local services, and B2B. Each robot specializes in a vertical while the platform keeps everything orchestrated.",
  },
  {
    question: "How do squads work?",
    answer: "We scale multidisciplinary squads as needed: strategists, product designers, fullstack engineers, and data specialists. All linked to clear SLAs.",
  },
  {
    question: "How long does a typical project take?",
    answer: "Discovery sprints take 2–4 weeks. Full products range from 8–16 weeks with fortnightly releases and continuous iteration.",
  },
  {
    question: "Do you offer development services?",
    answer: "Yes. We build web and mobile apps with DevOps pipelines, automated testing, and post-launch observability through Bridge.",
  },
  {
    question: "Can you improve my design system and UX?",
    answer: "We run UX audits, evolve your design system, and provide sustainment squads to keep interfaces consistent and current.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-surface py-24">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <span className="inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand">
            Frequently Asked Questions
          </span>
          <h2 className="text-h2 font-semibold text-ink">
            FAQ CreAleph
          </h2>
          <p className="text-base text-muted">
            If you do not find what you need, talk to us directly. We respond within 24 business hours.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl space-y-4">
          {faqs.map((item, index) => {
            const open = openIndex === index;
            return (
              <Reveal key={item.question} variant="fadeInUp" delay={60 * index}>
                <div
                  className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-[var(--shadow-soft)] transition hover:-translate-y-[2px] hover:shadow-[var(--shadow-elevated)]"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? null : index)}
                    className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left"
                    aria-expanded={open}
                  >
                    <span className="text-base font-semibold text-ink">
                      {item.question}
                    </span>
                    <span className="text-brand">
                      {open ? "−" : "+"}
                    </span>
                  </button>
                  {open ? (
                    <div className="border-t border-line/60 px-6 py-5 text-sm text-muted">
                      {item.answer}
                    </div>
                  ) : null}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
