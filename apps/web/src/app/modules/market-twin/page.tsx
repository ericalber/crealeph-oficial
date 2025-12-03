import { PageHero } from "@/components/layout/PageHero";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
import { CTAButton } from "@/components/ui/CTAButton";
import { SeeAlso } from "@/components/ui/SeeAlso";
import Link from "next/link";

export default function MarketTwinModulePage() {
  return (
    <div className="bg-white">
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Módulos", href: "/modules/aqua" },
          { label: "Market Twin™" },
        ]}
        subtitle="Módulo de inteligência"
        title="Market Twin™: percentis de preço, aprovação e resposta para posicionamento estratégico."
        body="Com dados de Marketplaces, ERPs parceiros e integrações via Bridge, calculamos percentis que mostram exatamente onde sua operação se posiciona em relação ao mercado. Você descobre se está cobrando demais, se poderia cobrar mais, quanto tempo demora para responder em comparação aos líderes e como a aprovação de propostas varia por região. Assim, marketing, vendas e produto falam a mesma língua."
        ctas={[
          {
            label: "Comparar com meus dados",
            href: "/contact?utm_source=module-market-twin&utm_campaign=cta-primary",
            ariaLabel: "Solicitar comparação com Market Twin",
            campaign: "cta-primary",
          },
          {
            label: "Ver precificação regional",
            href: "/modules/pricing?utm_source=module-market-twin&utm_campaign=cta-secondary",
            ariaLabel: "Ver módulo de precificação",
            variant: "secondary",
            campaign: "cta-secondary",
          },
        ]}
        source="module-market-twin-hero"
      />

      <SectionSeparator />

      <section className="px-4 py-16">
        <div className="mx-auto max-w-screen-xl space-y-12 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Preço vs. mercado",
                description:
                  "Percentis P10, P50 e P90 mostram se você está abaixo, equilibrado ou acima do valor praticado.",
              },
              {
                title: "Aprovação vs. região",
                description:
                  "Comparativo de taxas de aprovação por bairro ou cidade, útil para squads de vendas e expansão.",
              },
              {
                title: "Tempo de resposta",
                description:
                  "KPIs de SLA real. Quando plugado ao Bridge, monitora e alerta atrasos críticos imediatamente.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-[--radius] border border-line bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-mdx"
              >
                <h2 className="text-lg font-semibold text-ink">{card.title}</h2>
                <p className="mt-3 text-sm text-muted">{card.description}</p>
              </div>
            ))}
          </div>

          <div className="rounded-[calc(var(--radius)*1.5)] border border-line bg-surface p-8 shadow-md text-sm text-muted">
            <h2 className="text-2xl font-semibold text-ink">Como usamos os percentis</h2>
            <p className="mt-3">
              • Marketing ajusta promessas e ofertas com base na distância entre o preço praticado e o percentil ideal.{" "}
              • Vendas recebem argumentos com provas concretas, alinhando{" "}
              <Link
                href="/modules/aqua?utm_source=module-market-twin-body&utm_campaign=link"
                className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
              >
                linguagem do AQUA
              </Link>{" "}
              ao posicionamento desejado. • Operações de automação usam os percentis para disparar novos fluxos quando
              o mercado muda.
            </p>
          </div>

          <CTAButton
            href="/industries/automotive?utm_source=module-market-twin&utm_campaign=cta-secondary"
            label="Aplicação no setor automotivo"
            ariaLabel="Ver aplicação no setor automotivo"
            variant="secondary"
            source="module-market-twin-body"
            campaign="cta-secondary"
          />
        </div>
      </section>

      <SeeAlso
        source="module-market-twin-see-also"
        items={[
          {
            title: "Precificação Regional",
            description: "Receba faixas de preço sugeridas por posicionamento.",
            href: "/modules/pricing",
          },
          {
            title: "Bridge",
            description: "Integre dados financeiros e acompanhe aprovação em tempo real.",
            href: "/modules/bridge",
          },
          {
            title: "Indústrias Marinas",
            description: "Veja como usamos percentis em marinas e charter.",
            href: "/industries/marinas",
          },
          {
            title: "Pricing Enterprise",
            description: "Planos dedicados para redes de grande porte.",
            href: "/pricing/enterprise",
          },
        ]}
      />
    </div>
  );
}
