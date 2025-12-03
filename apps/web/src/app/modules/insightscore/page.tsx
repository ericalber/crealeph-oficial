import { PageHero } from "@/components/layout/PageHero";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
import { CTAButton } from "@/components/ui/CTAButton";
import { SeeAlso } from "@/components/ui/SeeAlso";
import Link from "next/link";

export default function InsightScoreModulePage() {
  return (
    <div className="bg-white">
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Módulos", href: "/modules/aqua" },
          { label: "InsightScore™" },
        ]}
        subtitle="Módulo de inteligência"
        title="InsightScore™: prioridade científica para cada insight ou hipótese."
        body="O InsightScore™ analisa novidade, correlação, consistência, sazonalidade e impacto histórico. Cada insight vindo do AQUA, Scout, Market Twin™ ou squads internos recebe uma nota entre 0 e 100. Assim, definimos o que vai para execução agora, o que fica em observação e o que deve ser descartado. Transparente, explicável e conectado ao dashboard, o score elimina discussões subjetivas e acelera a criação de roadmap."
        ctas={[
          {
            label: "Ver metodologia",
            href: "/resources/guides/insightscore?utm_source=module-insightscore&utm_campaign=cta-primary",
            ariaLabel: "Ver metodologia InsightScore",
            campaign: "cta-primary",
          },
          {
            label: "Integrar com AQUA",
            href: "/modules/aqua?utm_source=module-insightscore&utm_campaign=cta-secondary",
            ariaLabel: "Integrar InsightScore com AQUA",
            variant: "secondary",
            campaign: "cta-secondary",
          },
        ]}
        source="module-insightscore-hero"
      />

      <SectionSeparator />

      <section className="px-4 py-16">
        <div className="mx-auto grid max-w-screen-xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div className="space-y-8">
            <div className="rounded-[calc(var(--radius)*1.5)] border border-line bg-surface p-8 shadow-md">
              <h2 className="text-2xl font-semibold text-ink">Dimensões do score</h2>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                <li>
                  <strong>Novidade:</strong> Há quanto tempo algo semelhante apareceu? Quanto mais raro, maior o peso.
                </li>
                <li>
                  <strong>Correlação:</strong> O insight se conecta com dados do{" "}
                  <Link
                    href="/modules/market-twin?utm_source=module-insightscore-body&utm_campaign=link"
                    className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                  >
                    Market Twin™
                  </Link>{" "}
                  ou resultados de campanhas?
                </li>
                <li>
                  <strong>Consistência:</strong> Quantas fontes independentes reforçam o mesmo ponto?
                </li>
                <li>
                  <strong>Sazonalidade:</strong> Há impacto de época do ano ou eventos externos?
                </li>
                <li>
                  <strong>Impacto:</strong> Qual o potencial de mover métricas de receita, MQL ou satisfação?
                </li>
              </ul>
            </div>
            <CTAButton
              href="/app?utm_source=module-insightscore&utm_campaign=cta-secondary"
              label="Ver ranking no dashboard"
              ariaLabel="Ver ranking InsightScore no dashboard"
              variant="secondary"
              source="module-insightscore-body"
              campaign="cta-secondary"
            />
          </div>
          <div className="rounded-[calc(var(--radius)*1.5)] border border-line bg-white p-8 shadow-md text-sm text-muted">
            <h2 className="text-2xl font-semibold text-ink">Exemplo de output</h2>
            <ul className="mt-4 space-y-3">
              <li>
                #1 · Score 92 · “Testar CTA de orçamento instantâneo” — Alta novidade, forte correlação com dados de Scout,
                prova social disponível. Encaminhar para squad de websites.
              </li>
              <li>
                #4 · Score 68 · “Reduzir preço no combo premium” — Dados do Market Twin mostram elasticidade. Avaliar com pricing.
              </li>
              <li>
                #9 · Score 44 · “Campanha temática de inverno” — Insight sazonal com baixa consistência. Manter em observação.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <SeeAlso
        source="module-insightscore-see-also"
        items={[
          {
            title: "AQUA Insights",
            description: "Gere insumos ricos que alimentam o ranking automaticamente.",
            href: "/modules/aqua",
          },
          {
            title: "Scout",
            description: "Velocidade para detectar movimentos de concorrentes.",
            href: "/modules/scout",
          },
          {
            title: "Projetos",
            description: "Veja cases que usam o InsightScore™ nos rituais semanais.",
            href: "/projects",
          },
          {
            title: "Guia InsightScore™",
            description: "Artigo detalhado com metodologia e fórmulas.",
            href: "/resources/guides/insightscore",
          },
        ]}
      />
    </div>
  );
}
