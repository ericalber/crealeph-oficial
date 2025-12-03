import { PageHero } from "@/components/layout/PageHero";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
import { CTAButton } from "@/components/ui/CTAButton";

export default function GuidesIndexPage() {
  const SHOW_INTERNAL = process.env.SHOW_INTERNAL_GUIDES === "true";
  const guides = [
    {
      title: "Guia InsightScore™",
      description: "Entenda metodologia, pontuação, exemplos e planilhas.",
      href: "/resources/guides/insightscore",
    },
    {
      title: "Guia CREALEPH Bridge",
      description: "Integrações, webhooks, segurança e melhores práticas.",
      href: "/resources/guides/bridge",
    },
  ] as const;
  const internalGuides = SHOW_INTERNAL
    ? ([
        {
          title: "Dossiê (interno)",
          description: "Inventário de ofertas, módulos, gaps e roadmap.",
          href: "/resources/guides/dossie",
          internal: true as const,
        },
      ] as const)
    : ([] as const);
  const allGuides = [...guides, ...internalGuides];
  return (
    <div className="bg-white">
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Recursos", href: "/resources" },
          { label: "Guias" },
        ]}
        subtitle="Guias"
        title="Guias aprofundados com passo a passo e materiais complementares."
        body="Materiais mais densos, perfeitos para quem quer implementar o playbook CreAleph internamente. Cada guia traz capítulos estruturados, checklists e referências."
        ctas={[
          {
            label: "Guia InsightScore™",
            href: "/resources/guides/insightscore?utm_source=guides&utm_campaign=cta-primary",
            ariaLabel: "Ler guia InsightScore",
            campaign: "cta-primary",
          },
          {
            label: "Guia Bridge",
            href: "/resources/guides/bridge?utm_source=guides&utm_campaign=cta-secondary",
            ariaLabel: "Ler guia Bridge",
            variant: "secondary",
            campaign: "cta-secondary",
          },
        ]}
        source="resources-guides-hero"
      />

      <SectionSeparator />

      <section className="px-4 py-16">
        <div className="mx-auto grid max-w-screen-xl gap-6 lg:grid-cols-2 lg:px-8">
          {allGuides.map((guide) => (
            <article
              key={guide.title}
              className="flex h-full flex-col justify-between rounded-[calc(var(--radius)*1.5)] border border-line bg-surface p-6 shadow-md transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-ink">
                  {guide.title}
                  {"internal" in guide ? (
                    <span className="ml-2 inline-flex items-center rounded-full bg-ink/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/70" aria-label="Guia interno">
                      Interno
                    </span>
                  ) : null}
                </h2>
                <p className="text-sm text-muted">{guide.description}</p>
              </div>
              <CTAButton
                href={`${guide.href}?utm_source=guides&utm_campaign=cta-secondary`}
                label="Acessar guia"
                ariaLabel={`Acessar ${guide.title}`}
                variant="secondary"
                source="guides-grid"
                campaign="cta-secondary"
              />
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
