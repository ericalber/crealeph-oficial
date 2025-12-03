import { AlertTriangle, Ban, Clock } from "lucide-react";
import { TechSection } from "@/components/ui/TechSection";

export function ProblemSnapshotSection() {
  const problems = [
    {
      icon: AlertTriangle,
      title: "Misaligned messaging",
      desc: "Generic promises that do not resonate by city or neighborhood.",
    },
    { icon: Clock, title: "Slow to test", desc: "Without a 24h first deliverable, momentum is lost." },
    { icon: Ban, title: "Fragile integrations", desc: "Without Bridge/API, data stays loose and untracked." },
  ];

  return (
    <TechSection className="py-20">
      <div className="mx-auto max-w-screen-xl space-y-8 px-4 lg:px-8">
        <div className="space-y-3">
          <span className="inline-flex items-center rounded-full bg-brand px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white">
            Problem
          </span>
          <h2 className="text-h2 font-semibold text-white">Where teams lose performance</h2>
          <p className="max-w-2xl text-white/80">
            Messaging alignment, speed, and integrations are critical.
            Without them, cost per lead rises and conversion drops.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {problems.map((item) => (
            <div
              key={item.title}
              className="rounded-[--radius] p-[1px] bg-gradient-to-r from-brand/40 via-brand/20 to-brand/40"
            >
              <div className="rounded-[--radius] bg-black/30 p-6 text-white backdrop-blur-xl ring-1 ring-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_12px_34px_rgba(0,0,0,0.25)]">
                <div className="flex items-center gap-3 text-sm font-semibold">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand/25 text-white ring-1 ring-brand/40">
                    <item.icon size={28} />
                  </span>
                  <span className="text-base font-semibold">{item.title}</span>
                </div>
                <p className="mt-2 text-sm text-white/85">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </TechSection>
  );
}
