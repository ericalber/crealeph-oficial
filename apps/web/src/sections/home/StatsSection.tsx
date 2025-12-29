import { MetricCard } from "@/components/cards/MetricCard";
import { Reveal } from "@/components/motion/Reveal";

export function StatsSection() {
  const metrics = [
    { value: "+37%", label: "Avg approval rate on new pages" },
    { value: "24h", label: "First deliverable shipped" },
    { value: "4.9/5", label: "Average satisfaction" },
    { value: "12%", label: "Avg CPL reduction in 60 days" },
  ];

  return (
    <section className="bg-white py-24">
      <div className="mx-auto flex max-w-screen-xl flex-col gap-10 px-4 text-center lg:px-8">
        <div className="space-y-3">
          <span className="inline-flex items-center justify-center rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand">
            Proof in motion
          </span>
          <p className="mx-auto max-w-3xl text-2xl font-semibold text-ink">
            Vertical intelligence, multiple industries. Each robot specializes in a vertical, CreAleph orchestrates all of them in one stack.
          </p>
          <p className="text-sm text-muted">
            Numbers from active pilots and live customers using AQUA, Market Twin, Bridge, and Playbooks.
          </p>
        </div>
        <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
          {metrics.map((metric, idx) => (
            <Reveal key={metric.label} variant="fadeInUp" delay={80 * idx}>
              <MetricCard value={metric.value} label={metric.label} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
