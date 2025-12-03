import { LineChart, ListChecks, Workflow } from "lucide-react";

const zig = [
  {
    title: "Observe com dados vivos",
    body:
      "AQUA e Scout revelam promessas vencedoras e objeções reais por cidade.",
    icon: LineChart,
  },
  {
    title: "Entenda e priorize",
    body:
      "InsightScore™ define o que fazer primeiro, balanceando impacto e esforço.",
    icon: ListChecks,
  },
  {
    title: "Aja com automação",
    body:
      "Bridge integra CRM, billing e squads — do lead ao faturamento.",
    icon: Workflow,
  },
];

export function ZigZagNarrativeSection() {
  return (
    <section className="bg-transparent py-24">
      <div className="mx-auto max-w-screen-xl space-y-10 px-4 lg:px-8">
        {zig.map((item, idx) => (
          <div
            key={item.title}
            className={`grid items-center gap-8 rounded-[calc(var(--radius)*1.5)] border border-white/15 bg-white/5 p-8 shadow-md transition hover:-translate-y-1 hover:shadow-[0_18px_46px_rgba(0,0,0,.20)] md:grid-cols-2 ${
              idx % 2 === 1 ? "md:grid-flow-dense" : ""
            }`}
          >
            <div className="theme-invert space-y-3">
              <h3 className="text-2xl font-semibold text-white">{item.title}</h3>
              <p className="text-sm text-white/80">{item.body}</p>
            </div>
            <div className="theme-invert flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-[--radius] border border-white/15 bg-gradient-to-br from-brand/25 via-transparent to-brand/15">
              <div className="relative flex h-40 w-40 items-center justify-center rounded-2xl bg-white/10 shadow-[inset_0_0_0_1px_rgba(255,255,255,.2)]">
                <item.icon size={96} className="text-white" />
                <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/15" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
