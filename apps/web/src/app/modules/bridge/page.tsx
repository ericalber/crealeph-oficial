import { PageHero } from "@/components/layout/PageHero";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
import { CTAButton } from "@/components/ui/CTAButton";
import { SeeAlso } from "@/components/ui/SeeAlso";
import Link from "next/link";

export default function BridgeModulePage() {
  return (
    <div className="bg-white">
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Módulos", href: "/modules/aqua" },
          { label: "Bridge" },
        ]}
        subtitle="Módulo de integração"
        title="CREALEPH Bridge: layer de integração e leitura financeira para squads digitais."
        body="Bridge conecta plataformas de pagamento, ERPs, CRMs e ferramentas proprietárias sem tocar no dinheiro. Ele lê aprovações, recusas, reembolsos e tickets financeiros, transformando tudo em sinais para automações, dashboards e times internos. Ideal para quem precisa de confiabilidade, logs detalhados e governança com auditoria."
        ctas={[
          {
            label: "Abrir documentação",
            href: "/developers?utm_source=module-bridge&utm_campaign=cta-primary",
            ariaLabel: "Abrir documentação Bridge",
            campaign: "cta-primary",
          },
          {
            label: "Falar com especialistas",
            href: "/contact?utm_source=module-bridge&utm_campaign=cta-secondary",
            ariaLabel: "Falar com especialistas Bridge",
            variant: "secondary",
            campaign: "cta-secondary",
          },
        ]}
        source="module-bridge-hero"
      />

      <SectionSeparator />

      <section className="px-4 py-16">
        <div className="mx-auto grid max-w-screen-xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div className="space-y-8">
            <div className="rounded-[calc(var(--radius)*1.5)] border border-line bg-surface p-8 shadow-md">
              <h2 className="text-2xl font-semibold text-ink">Conectores prontas</h2>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                <li>Stripe, PayPal, Pagar.me, Mercado Pago, Iugu.</li>
                <li>HubSpot, Salesforce, RD Station, Pipefy.</li>
                <li>SAP, Totvs, Omie, sistemas proprietários via webhooks.</li>
              </ul>
              <p className="mt-4">
                Cada conector possui logs e dashboards específicos, além de alertas configuráveis.
              </p>
            </div>
            <div className="rounded-[calc(var(--radius)*1.5)] border border-line bg-white p-8 shadow-md text-sm text-muted">
              <h2 className="text-2xl font-semibold text-ink">Uso com automação e pricing</h2>
              <p className="mt-3">
                Quando conectado às automações de{" "}
                <Link
                  href="/services/automation?utm_source=module-bridge-body&utm_campaign=link"
                  className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                >
                  jornada
                </Link>{" "}
                e à{" "}
                <Link
                  href="/modules/pricing?utm_source=module-bridge-body&utm_campaign=link"
                  className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                >
                  Precificação Regional
                </Link>
                , Bridge permite ajustar ofertas automaticamente e pausar campanhas quando necessário.
              </p>
              <CTAButton
                href="/developers?utm_source=module-bridge&utm_campaign=cta-secondary"
                label="Gerar API key"
                ariaLabel="Gerar chave da API Bridge"
                variant="secondary"
                source="module-bridge-body"
                campaign="cta-secondary"
              />
            </div>
          </div>
          <div className="rounded-[calc(var(--radius)*1.5)] border border-line bg-white p-8 shadow-md text-sm text-muted">
            <h2 className="text-2xl font-semibold text-ink">Benefícios diretos</h2>
            <ul className="mt-4 space-y-3">
              <li>Economia acumulada estimada por evitar tentativas perdidas.</li>
              <li>Tempo médio de aprovação por gateway ou método de pagamento.</li>
              <li>Detecção de anomalias com alertas para squads técnicos.</li>
              <li>Logs para auditoria com retenção de 12 meses.</li>
            </ul>
          </div>
        </div>
      </section>

      <SeeAlso
        source="module-bridge-see-also"
        items={[
          {
            title: "Developers",
            description: "Documentação, webhooks e exemplos em TypeScript.",
            href: "/developers",
          },
          {
            title: "Automação operacional",
            description: "Veja como squads acionam Bridge em tempo real.",
            href: "/services/automation",
          },
          {
            title: "Cases B2B",
            description: "Clientes que usam Bridge para métricas de aprovação.",
            href: "/projects/case-construtora-norte",
          },
          {
            title: "Preços",
            description: "Planos com Bridge incluso e suporte 24/7.",
            href: "/pricing",
          },
        ]}
      />
    </div>
  );
}
