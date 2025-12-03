import { PageHero } from "@/components/layout/PageHero";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
import { CTAButton } from "@/components/ui/CTAButton";

const posts = [
  {
    title: "Como um site modular reduz 35% do tempo de implantação",
    excerpt:
      "Mostramos como o TechAI Pack organiza design e desenvolvimento, com checklists que você pode adaptar.",
    href: "/resources/blog/site-modular",
  },
  {
    title: "Checklist de marketing inteligente para negócios locais",
    excerpt:
      "Passo a passo para integrar AQUA, Scout, anúncios e automações. Ideal para franquias e serviços recorrentes.",
    href: "/resources/blog/checklist-locais",
  },
  {
    title: "Guia de precificação com Market Twin™",
    excerpt:
      "Aprenda a interpretar percentis e construir políticas de preço para cada posicionamento.",
    href: "/resources/blog/guia-precificacao",
  },
  {
    title: "ABM industrial: como nutrimos contas complexas",
    excerpt:
      "Playbook completo usado por construtoras, facilities e empresas de engenharia.",
    href: "/resources/blog/abm-industrial",
  },
  {
    title: "Captação de alunos com automação inteligente",
    excerpt:
      "Estudo sobre campanhas locais, conteúdo educativo e fluxos de retenção em educação.",
    href: "/resources/blog/educacao",
  },
];

export default function BlogIndexPage() {
  return (
    <div className="bg-white">
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Recursos", href: "/resources" },
          { label: "Blog" },
        ]}
        subtitle="Blog"
        title="Artigos com profundidade editorial e interlinks estratégicos."
        body="Estilo newsroom: agrupamos matérias por clusters de assunto, incluímos interlinks para serviços, módulos, indústrias e projetos. Assim, sua equipe encontra rapidamente tudo que precisa para tomar decisões."
        ctas={[
          {
            label: "Receber novidades",
            href: "/contact?utm_source=blog&utm_campaign=cta-primary",
            ariaLabel: "Receber novidades do blog",
            campaign: "cta-primary",
          },
          {
            label: "Ver guias completos",
            href: "/resources/guides?utm_source=blog&utm_campaign=cta-secondary",
            ariaLabel: "Ver guias completos",
            variant: "secondary",
            campaign: "cta-secondary",
          },
        ]}
        source="resources-blog-hero"
      />

      <SectionSeparator />

      <section className="px-4 py-16">
        <div className="mx-auto grid max-w-screen-xl gap-8 lg:grid-cols-3 lg:px-8">
          {posts.map((post) => (
            <article
              key={post.href}
              className="flex h-full flex-col justify-between rounded-[calc(var(--radius)*1.5)] border border-line bg-surface p-6 shadow-md transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-ink">{post.title}</h2>
                <p className="text-sm text-muted">{post.excerpt}</p>
              </div>
              <CTAButton
                href={`${post.href}?utm_source=blog&utm_campaign=cta-secondary`}
                label="Ler matéria"
                ariaLabel={`Ler matéria ${post.title}`}
                variant="secondary"
                source="resources-blog-grid"
                campaign="cta-secondary"
              />
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
