import { PageHero } from "@/components/layout/PageHero";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
import { CTAButton } from "@/components/ui/CTAButton";
import { SeeAlso } from "@/components/ui/SeeAlso";

export default function ResourcesPage() {
  return (
    <div className="bg-white">
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Recursos" },
        ]}
        subtitle="Recursos"
        title="Blog, guias, FAQ e templates para times digitais."
        body="Reunimos conhecimento produzido pelos squads da CreAleph. Aprenda como aplicamos nossos módulos, veja checklists, templates editáveis e respostas para dúvidas frequentes. Cada material traz interlinks para serviços, indústrias e cases relacionados."
        ctas={[
          {
            label: "Ver blog",
            href: "/resources/blog?utm_source=resources&utm_campaign=cta-primary",
            ariaLabel: "Ir para seção de blog",
            campaign: "cta-primary",
          },
          {
            label: "Guia InsightScore™",
            href: "/resources/guides/insightscore?utm_source=resources&utm_campaign=cta-secondary",
            ariaLabel: "Ler guia InsightScore",
            variant: "secondary",
            campaign: "cta-secondary",
          },
        ]}
        source="resources-hero"
      />

      <SectionSeparator />

      <section className="px-4 py-16">
        <div className="mx-auto max-w-screen-xl grid gap-6 lg:grid-cols-4 lg:px-8">
          {[
            {
              title: "Blog",
              description: "Artigos com análises de mercado, guias práticos e bastidores dos squads.",
              href: "/resources/blog",
            },
            {
              title: "Guias",
              description: "Materiais aprofundados com capítulos, checklists e frameworks.",
              href: "/resources/guides",
            },
            {
              title: "FAQ",
              description: "Perguntas e respostas sobre serviços, módulos e integrações.",
              href: "/resources/faq",
            },
            {
              title: "Templates",
              description: "Modelos de briefing, roteiros de discovery e dashboards.",
              href: "/resources/templates",
            },
          ].map((card) => (
            <article
              key={card.title}
              className="flex h-full flex-col justify-between rounded-[calc(var(--radius)*1.5)] border border-line bg-surface p-6 shadow-md transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-ink">{card.title}</h2>
                <p className="text-sm text-muted">{card.description}</p>
              </div>
              <CTAButton
                href={`${card.href}?utm_source=resources&utm_campaign=cta-secondary`}
                label="Explorar"
                ariaLabel={`Explorar ${card.title}`}
                variant="secondary"
                source="resources-grid"
                campaign="cta-secondary"
              />
            </article>
          ))}
        </div>
      </section>

      <SeeAlso
        source="resources-see-also"
        items={[
          {
            title: "Serviços",
            description: "Descubra como aplicamos o conhecimento na prática.",
            href: "/services",
          },
          {
            title: "Indústrias",
            description: "Conteúdo adaptado a cada segmento.",
            href: "/industries",
          },
          {
            title: "Projetos",
            description: "Cases detalhados que complementam os recursos.",
            href: "/projects",
          },
          {
            title: "Contato",
            description: "Solicite materiais exclusivos para sua operação.",
            href: "/contact",
          },
        ]}
      />
    </div>
  );
}
