import { Reveal } from "@/components/motion/Reveal";

const reasons = [
  {
    pill: "Intelligence",
    title: "Signals stitched into every decision",
    description: "Parasite + Ideator feed pages, ads, and automations with the language that already works in your regions.",
  },
  {
    pill: "Execution",
    title: "Squads that move in 24h",
    description: "Copy, design, and dev inside a single SLA with ready-to-ship components and monitored automations.",
  },
  {
    pill: "Observability",
    title: "Transparent dashboards",
    description: "Market Twin + Bridge show pricing, approvals, and integration health with alerts before they break.",
  },
  {
    pill: "Playbooks",
    title: "Actions that compound",
    description: "Playbooks recommend the next moves by impact and effort, closing the loop every week.",
  },
];

export function FeaturesSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[var(--gradient-brand-charcoal)] py-24 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(224,32,32,0.2),transparent_36%)] opacity-80" />
      <div className="relative mx-auto max-w-screen-xl space-y-12 px-4 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl space-y-3">
            <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
              Why CreAleph
            </span>
            <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">The intelligence-first operating system</h2>
            <p className="text-base text-white/80">
              Data from the field, squads with a 24h clock, and playbooks that never stop. We stack depth, speed, and clarity.
            </p>
          </div>
          <p className="max-w-md text-sm text-white/75">
            Each card is a promise the dashboard can prove: signals, execution, observability, and actions in one loop.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((item, idx) => (
            <Reveal key={item.title} variant="fadeInUp" delay={60 * idx} className="h-full">
              <article className="group relative flex h-full flex-col gap-3 rounded-[var(--radius-card)] border border-white/10 bg-white/5 p-6 shadow-[var(--depth-2)] backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-[var(--depth-3)]">
                <div className="pointer-events-none absolute -inset-1 -z-10 rounded-3xl bg-gradient-to-br from-[#E02020]/18 via-transparent to-[#E02020]/10 opacity-0 blur-2xl transition group-hover:opacity-100" />
                <span className="inline-flex w-fit items-center rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/80">
                  {item.pill}
                </span>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-sm text-white/80">{item.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
