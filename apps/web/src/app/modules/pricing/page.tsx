import { PageHero } from "@/components/layout/PageHero";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
import { CTAButton } from "@/components/ui/CTAButton";
import { SeeAlso } from "@/components/ui/SeeAlso";
import Link from "next/link";

const pricingTable = [
  { tier: "Premium", median: "R$ 420", p25: "R$ 360", p75: "R$ 485" },
  { tier: "Standard", median: "R$ 310", p25: "R$ 260", p75: "R$ 355" },
  { tier: "Econômico", median: "R$ 220", p25: "R$ 190", p75: "R$ 245" },
];

export default function PricingModulePage() {
  return (
    <div className="bg-white">
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Módulos", href: "/modules/aqua" },
          { label: "Precificação Regional" },
        ]}
        subtitle="Módulo de inteligência"
        title="Precificação Regional: quanto cobrar em cada cidade por cada serviço."
        body="Coletamos preços públicos, anúncios, marketplaces e dados de parceiros financeiros para entregar médias, medianas e faixas de preço por região. O módulo recomenda ajustes conforme posicionamento (premium, standard, econômico), mostra onde você está acima ou abaixo da concorrência e aponta oportunidades de bundles. Integrado ao Market Twin™ e ao Bridge, acompanha aprovação real e margens projetadas."
        ctas={[
          {
            label: "Solicitar análise de preços",
            href: "/contact?utm_source=module-pricing&utm_campaign=cta-primary",
            ariaLabel: "Solicitar análise de precificação",
            campaign: "cta-primary",
          },
          {
            label: "Ver Market Twin™",
            href: "/modules/market-twin?utm_source=module-pricing&utm_campaign=cta-secondary",
            ariaLabel: "Ver Market Twin",
            variant: "secondary",
            campaign: "cta-secondary",
          },
        ]}
        source="module-pricing-hero"
      />

      <SectionSeparator />

      <section className="px-4 py-16">
        <div className="mx-auto max-w-screen-xl space-y-10 lg:px-8">
          <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[calc(var(--radius)*1.5)] border border-line bg-surface p-8 shadow-md">
              <h2 className="text-2xl font-semibold text-ink">Como entregamos a precificação</h2>
              <p className="mt-3 text-sm text-muted">
                Consolidamos dados de mercado, acordos, catálogos e referências públicas. Após limpar outliers,
                o modelo calcula percentis por região, oferece benchmarking com{" "}
                <Link
                  href="/modules/market-twin?utm_source=module-pricing-body&utm_campaign=link"
                  className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                >
                  Market Twin™
                </Link>{" "}
                e sugere faixas alinhadas ao posicionamento desejado. Tudo segue para squads de{" "}
                <Link
                  href="/services/marketing?utm_source=module-pricing-body&utm_campaign=link"
                  className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                >
                  marketing
                </Link>{" "}
                e{" "}
                <Link
                  href="/services/automation?utm_source=module-pricing-body&utm_campaign=link"
                  className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                >
                  automação
                </Link>
                , que atualizam websites, ofertas e jornadas automaticamente.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                <li>Faixa recomendada por posicionamento (premium, standard, econômico).</li>
                <li>Elasticidade de preço com base em aprovação histórica.</li>
                <li>Alertas quando concorrentes cruzam seu intervalo.</li>
              </ul>
            </div>
            <div className="rounded-[calc(var(--radius)*1.5)] border border-line bg-white p-8 shadow-md text-sm text-muted">
              <h2 className="text-2xl font-semibold text-ink">Tabela exemplo — Limpeza residencial (São Paulo)</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead className="text-xs uppercase tracking-[0.2em] text-muted">
                    <tr>
                      <th className="border-b border-line px-4 py-2">Posicionamento</th>
                      <th className="border-b border-line px-4 py-2">Mediana</th>
                      <th className="border-b border-line px-4 py-2">P25</th>
                      <th className="border-b border-line px-4 py-2">P75</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pricingTable.map((row) => (
                      <tr key={row.tier}>
                        <td className="border-b border-line px-4 py-2">{row.tier}</td>
                        <td className="border-b border-line px-4 py-2">{row.median}</td>
                        <td className="border-b border-line px-4 py-2">{row.p25}</td>
                        <td className="border-b border-line px-4 py-2">{row.p75}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4">
                Dados atualizados semanalmente. Consulte o dashboard para filtros por bairro, turno ou combo de serviços.
              </p>
            </div>
          </div>
          <CTAButton
            href="/industries/cleaning?utm_source=module-pricing&utm_campaign=cta-secondary"
            label="Ver aplicação na indústria de limpeza"
            ariaLabel="Ver aplicação na indústria de limpeza"
            variant="secondary"
            source="module-pricing-body"
            campaign="cta-secondary"
          />
        </div>
      </section>

      <SeeAlso
        source="module-pricing-see-also"
        items={[
          {
            title: "Market Twin™",
            description: "Compare percentis de posicionamento por nicho e região.",
            href: "/modules/market-twin",
          },
          {
            title: "Bridge API",
            description: "Leia aprovação real e conecte dados financeiros.",
            href: "/modules/bridge",
          },
          {
            title: "Serviços de automação",
            description: "Atualize preços automaticamente em todos os canais.",
            href: "/services/automation",
          },
          {
            title: "Pricing Enterprise",
            description: "Planos com dados exclusivos e consultoria dedicada.",
            href: "/pricing/enterprise",
          },
        ]}
      />
    </div>
  );
}
