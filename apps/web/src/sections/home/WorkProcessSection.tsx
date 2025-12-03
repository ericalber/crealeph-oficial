const steps = [
  {
    title: "Discover – Understand Brand & Audience",
    description:
      "Exploramos visão, objetivos e público para revelar insights que orientam decisões e priorizações.",
    cta: "Start with Discovery",
  },
  {
    title: "Define – Set a Clear Creative Roadmap",
    description:
      "Com base nos aprendizados, estruturamos jornadas, mensagens e referências visuais com clareza.",
    cta: "Explore Our Designs",
  },
  {
    title: "Design – Turn Ideas into Visual Experiences",
    description:
      "Transformamos estratégia em interfaces vivas, protótipos navegáveis e microinterações consistentes.",
    cta: "View Strategy Samples",
  },
  {
    title: "Deliver – Launch with Confidence",
    description:
      "Refinamos cada detalhe, testamos a fundo e acompanhamos o lançamento para garantir adoção contínua.",
    cta: "See Final Deliverables",
  },
];

export function WorkProcessSection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto grid max-w-screen-xl grid-cols-1 gap-12 px-4 lg:grid-cols-12 lg:px-8">
        <div className="space-y-4 lg:col-span-4">
          <span className="inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand">
            How we work
          </span>
          <h2 className="text-h2 font-semibold text-ink">
            A Simple, Strategic Workflow
          </h2>
          <p className="text-base text-muted">
            Integramos pesquisa, design e engenharia em ciclos colaborativos.
            Cada etapa é transparente, validada e mensurável — para que você
            tenha clareza sobre o caminho e confiança nos resultados.
          </p>
        </div>

        <ol className="relative flex flex-col gap-8 border-l border-line pl-8 lg:col-span-8">
          {steps.map((step, index) => (
            <li
              key={`${step.title}-${index}`}
              className="relative rounded-[--radius] border border-line bg-surface/70 p-6 shadow-md transition hover:shadow-lgx"
            >
              <span className="absolute -left-12 flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white shadow-[var(--glow)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-xl font-semibold text-ink">{step.title}</h3>
              <p className="mt-3 text-sm text-muted">{step.description}</p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-brand">
                {step.cta} →
              </span>
            </li>
          ))}
          <span className="pointer-events-none absolute left-[-1px] top-3 h-[calc(100%-1.5rem)] w-[2px] bg-gradient-to-b from-brand via-line to-transparent" />
        </ol>
      </div>
    </section>
  );
}
