"use client";

import Image from "next/image";
import Link from "next/link";

const heroShapes = [
  {
    src: "/assets/figma/6bf506cfa1f96d999b96d1070e08315cc6e5f349.svg",
    alt: "Hero gradient backdrop",
  },
  {
    src: "/assets/figma/579869384c2c404efa3370d5c0db095c19c4c1c2.svg",
    alt: "Hero decorative vector",
  },
];

const partnerLogos = [
  "/assets/figma/5d4185fac90902b151f7d607a3509c0a75379b4d.svg",
  "/assets/figma/236c1b00844da687203920e5202684f4a26845dd.svg",
  "/assets/figma/9f66bf25d69b548f91eda06543f246a824983ee8.svg",
  "/assets/figma/208b416459095487c77587156525076d48d92ece.svg",
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-ink pb-24 pt-24 text-white sm:pt-28">
      <div className="absolute inset-0">
        {heroShapes.map((shape) => (
          <Image
            key={shape.src}
            src={shape.src}
            alt={shape.alt}
            fill
            priority
            className="object-cover opacity-80"
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-br from-ink/50 via-ink/30 to-brand/10" />
      </div>

      <div className="relative mx-auto grid max-w-screen-xl grid-cols-1 items-center gap-16 px-4 lg:grid-cols-12 lg:gap-12 lg:px-8">
        <div className="space-y-8 lg:col-span-6">
          <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
            Build Brands
          </span>
          <h1 className="text-h1 font-semibold leading-tight">
            <span className="text-white">
              Design That Sparks Change{" "}
            </span>
            <span className="text-white/80">
              Ideas That Make Noise
            </span>
          </h1>
          <p className="max-w-lg text-lg text-white/70">
            Continually formulate B2C partnerships orthogonal SaaS tools using
            maintainable quality through low business friction. Experiências
            digitais com automação inteligente para crescer com impacto.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/contact"
              className="inline-flex h-11 items-center justify-center rounded-full bg-brand px-6 text-sm font-semibold text-white shadow-[var(--glow)] transition hover:bg-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Iniciar projeto
            </Link>
            <Link
              href="/projects"
              className="inline-flex h-11 items-center justify-center rounded-full border border-white/20 px-6 text-sm font-semibold text-white/80 transition hover:border-white/60 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Ver portfólio
            </Link>
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
            <div className="flex items-center gap-3">
              <Image
                src="/assets/figma/4f9492f686624f7338767e050b85fa627ff0fb44.svg"
                alt="Avaliação"
                width={32}
                height={32}
              />
              <div>
                <p className="text-2xl font-semibold">4.7</p>
                <p className="text-xs uppercase tracking-wide text-white/60">
                  reviewed on Clutch
                </p>
              </div>
            </div>
            <div className="h-px w-full bg-white/10 sm:h-10 sm:w-px" />
            <div className="flex flex-wrap items-center gap-6 opacity-80">
              {partnerLogos.map((logo) => (
                <Image
                  key={logo}
                  src={logo}
                  alt="Partner logo"
                  width={96}
                  height={32}
                  className="h-8 w-auto"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="relative lg:col-span-6">
          <div className="relative mx-auto aspect-square w-full max-w-lg">
            <Image
              src="/assets/figma/690bf37cfa9a864b4e2d21acd285d958a7fcc803.svg"
              alt="Interface preview"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
