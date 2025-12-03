const projects = [
  {
    category: "Logo Design",
    title: "Brand Identity for Totebag",
    description:
      "Criamos logos, paletas e tipografia que refletem sua história e conectam com o público ideal.",
  },
  {
    category: "Mobile App",
    title: "UI/UX para o Health Sync App",
    description:
      "Cada pixel com propósito: experiências intuitivas que guiam o usuário em jornadas complexas.",
  },
  {
    category: "Product Launch",
    title: "Marketing Brand para TechAI",
    description:
      "Do conceito à copy: lançamentos multicanal que constroem marca e conversa.",
  },
  {
    category: "Campaign Magic",
    title: "Website Development para GloKart",
    description:
      "Arquitetura headless, componentes reusáveis e performance para e-commerces ambiciosos.",
  },
];

export function ProjectsSection() {
  return (
    <section className="bg-ink py-24 text-white">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
              Recent Work Highlights
            </span>
            <h2 className="text-h2 font-semibold">
              <span className="text-white">Real Projects That Ignite </span>
              <span className="text-brand">Business Growth</span>
            </h2>
          </div>
          <a
            href="/projects"
            className="inline-flex h-11 items-center justify-center rounded-full border border-white/20 px-6 text-sm font-semibold text-white/80 transition hover:border-white hover:text-white"
          >
            See all projects →
          </a>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {projects.map((project, index) => (
            <article
              key={project.title}
              className="group relative overflow-hidden rounded-[calc(var(--radius)*1.5)] bg-gradient-to-br from-white/[0.05] via-white/[0.03] to-brand/10 p-8 shadow-[0_18px_46px_rgba(0,0,0,0.25)] transition hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(0,0,0,0.35)]"
            >
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/70">
                <span>{project.category}</span>
                <span className="font-mono text-white/30">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-white">
                {project.title}
              </h3>
              <p className="mt-4 text-sm text-white/70">{project.description}</p>
              <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand transition group-hover:text-brand-600">
                Veja o case
                <span aria-hidden>→</span>
              </div>
              <div className="pointer-events-none absolute inset-0 rounded-[calc(var(--radius)*1.5)] border border-white/10" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
