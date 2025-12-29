const articles = [
  {
    title: "Como automatizar o handoff entre Figma e código",
    date: "Jun 2025",
    tags: ["Design Ops", "Automation"],
    href: "#",
  },
  {
    title: "Framework de discovery em 4 semanas",
    date: "May 2025",
    tags: ["Product Strategy"],
    href: "#",
  },
  {
    title: "Copilotos de IA para marketing de performance",
    date: "Apr 2025",
    tags: ["AI", "Growth"],
    href: "#",
  },
];

export default function BlogPage() {
  return (
    <div className="bg-white py-24">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
        <span className="inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand">
          Blog
        </span>
        <h1 className="mt-6 text-h2 font-semibold text-ink">
          Insights práticos para construir produtos inteligentes
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted">
          Notícias, frameworks e estudos de caso que usamos no dia a dia. Sem
          fluff, apenas aprendizados aplicáveis.
        </p>

        <div className="mt-12 space-y-6">
          {articles.map((article) => (
            <article
              key={`${article.title}-${article.href}`}
              className="rounded-[--radius] border border-line bg-surface p-6 transition hover:border-brand hover:shadow-mdx"
            >
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted">
                <span>{article.date}</span>
                <span className="h-px w-8 bg-line" />
                {article.tags.map((tag, idx) => (
                  <span key={`${article.title}-${tag}-${idx}`} className="text-brand">
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="mt-4 text-xl font-semibold text-ink">
                {article.title}
              </h2>
              <a
                href="#"
                className="mt-4 inline-flex items-center text-sm font-semibold text-brand hover:text-brand-600"
              >
                Ler artigo →
              </a>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
