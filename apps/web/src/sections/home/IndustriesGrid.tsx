import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";

const industries = [
  { title: "Negócios locais", href: "/industries/cleaning", color: "from-[#34D399] to-[#06B6D4]" },
  { title: "B2B e projetos", href: "/industries/construction", color: "from-[#F59E0B] to-[#F43F5E]" },
  { title: "Automotivo e náutico", href: "/industries/automotive", color: "from-[#7C3AED] to-[#22D3EE]" },
  { title: "Educação", href: "/industries/education", color: "from-[#0EA5E9] to-[#7C3AED]" },
  { title: "Saúde", href: "/industries/health", color: "from-[#F43F5E] to-[#F59E0B]" },
  { title: "Marinas", href: "/industries/marinas", color: "from-[#22D3EE] to-[#34D399]" }
];

export function IndustriesGrid() {
  return (
    <section className="px-4 py-12">
      <div className="mx-auto grid max-w-screen-xl gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:px-8">
        {industries.map((i, idx) => (
          <Reveal key={i.href} variant="slideUp" delay={60 + idx * 70}>
            <Link
              href={i.href}
              className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 p-5 text-white transition hover:scale-[1.01] hover:shadow-xl`}
            >
              <div className={`pointer-events-none absolute -inset-1 -z-10 bg-gradient-to-br ${i.color} opacity-20 blur-2xl transition group-hover:opacity-30`} />
              <h3 className="text-lg font-semibold">{i.title}</h3>
              <p className="mt-1 text-sm text-white/80">Casos, layouts e benchmarks por nicho</p>
              <span className="mt-4 inline-block text-sm underline underline-offset-4 decoration-white/30 group-hover:decoration-white">Explorar →</span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
