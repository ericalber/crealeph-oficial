import Image from "next/image";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";

export function IndustriesHero() {
  return (
    <section className="relative isolate overflow-hidden bg-black text-white">
      <Parallax strength={0.1} className="absolute inset-0">
        <Image
          src="/assets/figma/236c1b00844da687203920e5202684f4a26845dd.svg"
          alt="Indústrias"
          fill
          className="object-cover opacity-50"
        />
      </Parallax>
      <Parallax strength={0.06} className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/40" />
      </Parallax>
      <div className="relative z-10 mx-auto flex min-h-[40vh] max-w-screen-xl flex-col items-start justify-center gap-3 px-4 py-16 lg:px-8">
        <Reveal as="span" variant="fade" delay={60} className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/90">
          Indústrias atendidas
        </Reveal>
        <Reveal as="h2" variant="slideUp" delay={140} className="text-3xl font-extrabold sm:text-4xl md:text-5xl">
          Presença vibrante para quem compete por região
        </Reveal>
        <Reveal as="p" variant="fade" delay={220} className="max-w-2xl text-sm text-white/80">
          Cards e conteúdos que destacam benefícios por nicho, com cores vibrantes e textos que lideram a atenção.
        </Reveal>
      </div>
    </section>
  );
}
