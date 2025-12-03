import { ShieldCheck, Zap, Gauge } from "lucide-react";

export function ValueRibbonSection() {
  const items = [
    { icon: Zap, title: "Primeiro entregável em 24h", desc: "Sprint inicial com layout + copy validados pelo AQUA." },
    { icon: Gauge, title: "ROI observável", desc: "KPIs no /app: aprovação, resposta e custo por lead." },
    { icon: ShieldCheck, title: "LGPD + confiança", desc: "Governança, auditoria e backups diários." },
  ];

  return (
    <section className="bg-[#0C0C0E] py-12">
      <div className="mx-auto grid max-w-screen-xl grid-cols-1 gap-4 px-4 sm:grid-cols-3 lg:px-8">
        {items.map((item) => (
          <div
            key={item.title}
            className="group relative rounded-[--radius] p-[1px]"
            style={{
              background: "linear-gradient(135deg, rgba(164,22,26,0.55), rgba(224,32,32,0.55))",
            }}
          >
            <div className="relative aspect-square rounded-[--radius] p-6 text-white backdrop-blur-xl ring-1 ring-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_44px_rgba(224,32,32,.35)]" style={{ background: "rgba(224, 32, 32, 0.92)" }}>
              <div className="flex h-full w-full flex-col items-center justify-center text-center">
                <span aria-hidden className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 transition group-hover:bg-white/15 group-hover:ring-white/40">
                  <item.icon size={28} />
                </span>
                <p className="text-sm font-semibold leading-snug">{item.title}</p>
                <p className="mt-1 max-w-[22ch] text-xs text-white/90">{item.desc}</p>
              </div>
              <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shine" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
