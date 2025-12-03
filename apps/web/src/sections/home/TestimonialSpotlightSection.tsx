import Image from "next/image";

export function TestimonialSpotlightSection() {
  return (
    <section className="bg-transparent py-24">
      <div className="mx-auto grid max-w-screen-xl grid-cols-1 items-center gap-10 px-4 lg:grid-cols-12 lg:px-8">
        <div className="theme-invert space-y-4 lg:col-span-7">
          <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white">
            Depoimento
          </span>
          <h3 className="text-2xl font-semibold text-white">
            “Com a CreAleph, saímos de páginas paradas para um workflow que
            entrega e aprende em ciclos curtos. O Market Twin™ ajudou a capturar
            margem sem perder aprovação.”
          </h3>
          <p className="text-sm text-white/80">Camila Duarte · Head de Growth · Fluxo&Co</p>
          <div className="text-brand">★★★★★</div>
        </div>
        <div className="relative lg:col-span-5">
          <div className="relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-[calc(var(--radius)*2)] bg-gradient-to-br from-brand/40 via-brand/10 to-transparent shadow-[var(--shadow-lg)]">
            <Image
              src="/assets/figma/18d6f29be35948162a938b7e6089936554f47aab.svg"
              alt="Cliente CreAleph"
              fill
              className="object-cover opacity-95"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

