import Image from "next/image";

const blocks = [
  {
    eyebrow: "Who We Are",
    title:
      "We’re a passionate team of developers, designers e estrategistas construindo produtos prontos para o futuro.",
    description:
      "Combinamos pesquisa, branding e engenharia para transformar ideias em experiências escaláveis. Cada entrega nasce colaborativa, mensurável e com foco no impacto real para o negócio.",
    image: "/assets/figma/72c100367f0b3e6c29d3d46cb684f850e088aed5.svg",
  },
  {
    eyebrow: "Why it matters",
    title:
      "25k+ clientes construíram e lançaram mais rápido com automações CreAleph.",
    description:
      "“Working with TechAI felt like adicionar um motor de alto desempenho ao nosso startup. A clareza de UX e a execução limpa deram uma vantagem competitiva enorme.”",
    highlight: "Alex Morgan · CTO, BrightSync Technologies",
    image: "/assets/figma/3ed51a6b8ad5a74efa7f2430b962a2963e1ba47f.svg",
  },
];

export function AboutSection() {
  return (
    <section className="bg-surface py-24">
      <div className="mx-auto flex max-w-screen-xl flex-col gap-16 px-4 lg:px-8">
        {blocks.map((block, index) => {
          const isEven = index % 2 === 0;
          return (
            <div
              key={block.title}
              className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16"
            >
              <div
                className={`space-y-5 ${isEven ? "lg:col-span-6" : "lg:col-start-7 lg:col-span-6"}`}
              >
                <span className="inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand">
                  {block.eyebrow}
                </span>
                <h2 className="text-h3 font-semibold text-ink">{block.title}</h2>
                <p className="text-base text-muted">{block.description}</p>
                {block.highlight ? (
                  <p className="text-sm font-medium text-brand">
                    {block.highlight}
                  </p>
                ) : null}
              </div>

              <div
                className={`relative aspect-[4/3] overflow-hidden rounded-[calc(var(--radius)*1.5)] bg-white shadow-lg ${isEven ? "lg:col-start-7 lg:col-span-6" : "lg:col-span-6"}`}
              >
                <Image
                  src={block.image}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
