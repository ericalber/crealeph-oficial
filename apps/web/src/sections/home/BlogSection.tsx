const posts = [
  {
    category: "Campaign Magic",
    title: "Discover – Understand Your Brand & Audience",
    date: "27 July 2025",
    excerpt:
      "Refine os detalhes, teste com ciclos curtos e lance seu projeto com análises em tempo real.",
  },
  {
    category: "Campaign Magic",
    title: "Design Systems que escalam com a sua equipe",
    date: "22 July 2025",
    excerpt:
      "Como padronizar tokens, componentes e automatizar handoffs entre design e código.",
  },
  {
    category: "Campaign Magic",
    title: "AI copilots para operações criativas",
    date: "15 July 2025",
    excerpt:
      "Estudos de caso de automações que reduzem tempo de aprovação em até 35%.",
  },
];

export function BlogSection() {
  return (
    <section className="bg-surface py-24">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <span className="inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand">
              Insights & Ideas
            </span>
            <h2 className="text-h2 font-semibold text-ink">
              Where Strategy Meets Imagination
            </h2>
          </div>
          <a
            href="/blog"
            className="inline-flex h-11 items-center justify-center rounded-full border border-line px-6 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand"
          >
            View all blogs →
          </a>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.title}
              className="flex h-full flex-col rounded-[--radius] border border-line bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <span className="text-xs uppercase tracking-[0.3em] text-brand">
                {post.category}
              </span>
              <h3 className="mt-4 text-xl font-semibold text-ink">
                {post.title}
              </h3>
              <p className="mt-2 text-sm text-muted">{post.excerpt}</p>
              <div className="mt-auto flex items-center justify-between pt-6 text-sm text-muted">
                <span>{post.date}</span>
                <a
                  href="/blog"
                  className="font-semibold text-brand transition hover:text-brand-600"
                >
                  Read more →
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
