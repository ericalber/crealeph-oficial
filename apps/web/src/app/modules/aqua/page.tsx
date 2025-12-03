import { PageHero } from "@/components/layout/PageHero";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
import { CTAButton } from "@/components/ui/CTAButton";
import { SeeAlso } from "@/components/ui/SeeAlso";
import Link from "next/link";

export default function AquaModulePage() {
  return (
    <div className="bg-white">
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Módulos", href: "/modules/aqua" },
          { label: "AQUA Insights" },
        ]}
        subtitle="Módulo de inteligência"
        title="AQUA Insights: promessas, objeções e CTAs do seu mercado em tempo real."
        body="AQUA lê anúncios, landing pages, fóruns, marketplaces e próprios sites de concorrentes, extraindo promessas principais, objeções recorrentes, provas sociais e chamadas para ação. Os dados são classificados por cidade, serviço, persona e intenção. Em poucas horas você sabe como o mercado fala, quais palavras despertam desejo e quais bloqueios precisam ser neutralizados. Integrado ao TechAI Pack, gera blocos de copy prontos para seus websites, campanhas e sales decks."
        ctas={[
          {
            label: "Solicitar demo do AQUA",
            href: "/contact?utm_source=module-aqua&utm_campaign=cta-primary",
            ariaLabel: "Solicitar demonstração do AQUA",
            campaign: "cta-primary",
          },
          {
            label: "Ver InsightScore™",
            href: "/modules/insightscore?utm_source=module-aqua&utm_campaign=cta-secondary",
            ariaLabel: "Ver módulo InsightScore",
            variant: "secondary",
            campaign: "cta-secondary",
          },
        ]}
        source="module-aqua-hero"
      />

      <SectionSeparator />

      <section className="px-4 py-16">
        <div className="mx-auto max-w-screen-xl space-y-12 lg:px-8">
          <div className="space-y-4 rounded-[calc(var(--radius)*1.5)] border border-line bg-surface p-8 shadow-md">
            <h2 className="text-2xl font-semibold text-ink">Como o AQUA funciona</h2>
            <p className="text-sm text-muted">
              Uma malha de crawlers coleta dados de anúncios, páginas e depoimentos. Algoritmos de NLP destacam promessas,
              dores, objeções e provas sociais. Em seguida, criamos clusters semânticos e atribuímos notas de intensidade.
              Esses clusters abastecem as squads de{" "}
              <Link
                href="/services/websites?utm_source=module-aqua-body&utm_campaign=link"
                className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
              >
                websites
              </Link>
              ,{" "}
              <Link
                href="/services/marketing?utm_source=module-aqua-body&utm_campaign=link"
                className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
              >
                marketing inteligente
              </Link>{" "}
              e{" "}
              <Link
                href="/services/automation?utm_source=module-aqua-body&utm_campaign=link"
                className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
              >
                automações
              </Link>
              , garantindo consistência e linguagem alinhada à realidade do cliente final.
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              <ul className="space-y-2 text-sm text-muted">
                <li className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-brand" />
                  <span>Mapas de promessas por região, serviço e personas.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-brand" />
                  <span>Ranking de objeções e necessidades de prova social.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-brand" />
                  <span>CTAs mais usados e formatos criativos destacados.</span>
                </li>
              </ul>
              <div className="rounded-[--radius] border border-line bg-white p-6 text-sm text-muted">
                <p className="font-semibold text-ink">Exportações e integrações</p>
                <p className="mt-2">
                  Gere relatórios em CSV, conecte direto no dashboard ou envie os blocos para o seu CMS.
                  APIs permitem enviar dados para ferramentas internas ou planilhas dinâmicas.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Promessas mais repetidas",
                description:
                  "Descubra quais argumentos convencem o mercado e adapte sua copy com confiança.",
              },
              {
                title: "Objeções por setor",
                description:
                  "Mapeie medos e barreiras por indústria e defina assets de prova social e garantia.",
              },
              {
                title: "CTAs vencedores",
                description:
                  "Liste as chamadas que geram mais ação em cada canal e ajuste microcopy rapidamente.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[--radius] border border-line bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-mdx"
              >
                <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
                <p className="mt-3 text-sm text-muted">{item.description}</p>
              </div>
            ))}
          </div>

          <CTAButton
            href="/projects?utm_source=module-aqua&utm_campaign=cta-secondary"
            label="Ver cases que usam AQUA"
            ariaLabel="Ver cases com AQUA"
            variant="secondary"
            source="module-aqua-body"
            campaign="cta-secondary"
          />
        </div>
      </section>

      <SeeAlso
        source="module-aqua-see-also"
        items={[
          {
            title: "InsightScore™",
            description: "Priorize hipóteses vindas do AQUA com ciência de dados explicável.",
            href: "/modules/insightscore",
          },
          {
            title: "Precificação Regional",
            description: "Combine linguagem com preços competitivos por cidade.",
            href: "/modules/pricing",
          },
          {
            title: "Indústrias locais",
            description: "Veja como adaptamos copy para limpeza, saúde e educação.",
            href: "/industries/cleaning",
          },
          {
            title: "Contato",
            description: "Fale com o time de inteligência da CreAleph.",
            href: "/contact",
          },
        ]}
      />
    </div>
  );
}
