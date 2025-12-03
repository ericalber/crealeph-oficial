import { PageHero } from "@/components/layout/PageHero";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
import { CTAButton } from "@/components/ui/CTAButton";
import { SeeAlso } from "@/components/ui/SeeAlso";
import Link from "next/link";

export default function ScoutModulePage() {
  return (
    <div className="bg-white">
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Módulos", href: "/modules/aqua" },
          { label: "Scout" },
        ]}
        subtitle="Módulo de inteligência"
        title="Scout: o observador que lê concorrentes e tendências em linguagem humana."
        body="Scout monitora páginas, anúncios, redes sociais, marketplaces e comunicados dos concorrentes. A cada variação detectada, gera resumos em linguagem clara, sinaliza mudanças relevantes e calcula impacto potencial. O módulo aprende preferências da sua equipe e do seu setor, destacando apenas o que vale discussão. Integrado aos rituais quinzenais, reduz tempo gasto com pesquisa manual e alimenta o backlog de marketing, produto e vendas."
        ctas={[
          {
            label: "Ver resumo de exemplo",
            href: "/projects?utm_source=module-scout&utm_campaign=cta-primary",
            ariaLabel: "Ver resumo gerado pelo Scout",
            campaign: "cta-primary",
          },
          {
            label: "Conectar com automação",
            href: "/services/automation?utm_source=module-scout&utm_campaign=cta-secondary",
            ariaLabel: "Conectar Scout com automações",
            variant: "secondary",
            campaign: "cta-secondary",
          },
        ]}
        source="module-scout-hero"
      />

      <SectionSeparator />

      <section className="px-4 py-16">
        <div className="mx-auto max-w-screen-xl space-y-12 lg:px-8">
          <div className="rounded-[calc(var(--radius)*1.5)] border border-line bg-surface p-8 shadow-md">
            <h2 className="text-2xl font-semibold text-ink">O que o Scout captura</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {[
                {
                  title: "Concorrentes monitorados",
                  description:
                    "URLs e domínios priorizados. Mapas de tags para saber quais ofertas ganharam destaque.",
                },
                {
                  title: "Padrões detectados",
                  description:
                    "Mudanças de copy, novos preços, bundles, depoimentos e posicionamentos em anúncios.",
                },
                {
                  title: "Mudanças relevantes",
                  description:
                    "Alertas sobre entrada de novos players, parcerias anunciadas e shifts de tom de voz.",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="rounded-[--radius] border border-line bg-white p-6 text-sm text-muted shadow-sm transition hover:-translate-y-1 hover:shadow-mdx"
                >
                  <h3 className="text-lg font-semibold text-ink">{card.title}</h3>
                  <p className="mt-3">{card.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[calc(var(--radius)*1.5)] border border-line bg-white p-8 shadow-md">
              <h2 className="text-2xl font-semibold text-ink">Aplicações práticas</h2>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                <li className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-brand" />
                  <span>Briefings semanais para squads de{" "}
                    <Link
                      href="/services/marketing?utm_source=module-scout-body&utm_campaign=link"
                      className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                    >
                      marketing
                    </Link>{" "}
                    com contextos e ações sugeridas.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-brand" />
                  <span>Atualizações nos roteiros de{" "}
                    <Link
                      href="/services/websites?utm_source=module-scout-body&utm_campaign=link"
                      className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                    >
                      websites
                    </Link>{" "}
                    e landing pages quando concorrentes mudam narrativa.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-brand" />
                  <span>Fornecimento de insumos para automações de{" "}
                    <Link
                      href="/services/automation?utm_source=module-scout-body&utm_campaign=link"
                      className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                    >
                      nurture
                    </Link>{" "}
                    e follow-up.</span>
                </li>
              </ul>
              <CTAButton
                href="/modules/insightscore?utm_source=module-scout&utm_campaign=cta-ghost"
                label="Enviar insights para InsightScore™"
                ariaLabel="Enviar insights do Scout para o InsightScore"
                variant="ghost"
                source="module-scout-body"
                campaign="cta-ghost"
              />
            </div>
            <div className="rounded-[calc(var(--radius)*1.5)] border border-line bg-surface p-8 shadow-md text-sm text-muted">
              <h2 className="text-2xl font-semibold text-ink">Rituais recomendados</h2>
              <p className="mt-3">
                • Segunda: leitura rápida (15 min) dos alertas.{" "}
                • Quarta: reunião tática com insights priorizados.{" "}
                • Sexta: atualização do backlog com ações aprovadas.
              </p>
              <p className="mt-4">
                Tudo fica registrado no dashboard com histórico, anexos e campos personalizados para squads internos.
              </p>
            </div>
          </div>
        </div>
      </section>

      <SeeAlso
        source="module-scout-see-also"
        items={[
          {
            title: "AQUA Insights",
            description: "Conecte linguagens do mercado com os sinais do Scout.",
            href: "/modules/aqua",
          },
          {
            title: "InsightScore™",
            description: "Transforme observações em ações priorizadas.",
            href: "/modules/insightscore",
          },
          {
            title: "Marketing inteligente",
            description: "Veja como squads usam Scout no dia a dia.",
            href: "/services/marketing",
          },
          {
            title: "Dashboard /app",
            description: "Monitore KPIs e histórico de insights em um só lugar.",
            href: "/app",
          },
        ]}
      />
    </div>
  );
}
