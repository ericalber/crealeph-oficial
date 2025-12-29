"use client";

import { Reveal } from "@/components/motion/Reveal";

const posts = [
  {
    category: "Campaign Magic",
    title: "Discover: know your audience before launching",
    date: "July 27, 2025",
    excerpt: "How we combine Parasite signals, AQUA research, and interviews to define angles before writing a single page.",
  },
  {
    category: "Systems",
    title: "Design systems that scale squads",
    date: "July 22, 2025",
    excerpt: "Tokens, components, and automation that keep shipping consistent across vertical squads.",
  },
  {
    category: "Automation",
    title: "AI copilots for creative ops",
    date: "July 15, 2025",
    excerpt: "Playbooks and automations that cut approval time by up to 35% with Bridge and Market Twin™.",
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
              Premium content for digital teams
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
          {posts.map((post, idx) => (
            <Reveal key={post.title} variant="fadeInUp" delay={70 * idx}>
              <article
                className="flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)]"
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
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
