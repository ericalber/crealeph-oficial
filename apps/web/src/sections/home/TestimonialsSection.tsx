import Image from "next/image";

export function TestimonialsSection() {
  return (
    <section className="bg-transparent py-24">
      <div className="mx-auto grid max-w-screen-xl grid-cols-1 items-center gap-12 px-4 lg:grid-cols-12 lg:px-8">
        <div className="theme-invert space-y-6 lg:col-span-6">
          <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white">
            Prova social
          </span>
          <p className="text-2xl font-semibold text-white">
            “Trabalhar com a CreAleph foi como acoplar um motor de alta
            performance. A clareza de UX e a execução limpa geraram vantagem
            real no mercado.”
          </p>
          <div>
            <p className="text-sm font-semibold text-white">Alex Morgan</p>
            <p className="text-sm text-white/75">CTO · BrightSync Technologies</p>
          </div>
        </div>

        <div className="relative lg:col-span-6">
          <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-[calc(var(--radius)*2)] bg-gradient-to-br from-brand/60 via-brand/20 to-transparent shadow-[var(--shadow-lg)]">
            <Image
              src="/assets/figma/0598d29665670843ee49bc78c93324c415427b65.svg"
              alt="Depoimento CreAleph"
              fill
              className="object-cover opacity-90"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
