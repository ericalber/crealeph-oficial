import { PageHero } from "@/components/layout/PageHero";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
import { CTAButton } from "@/components/ui/CTAButton";
import { SeeAlso } from "@/components/ui/SeeAlso";

export default function DevelopersPage() {
  return (
    <div className="bg-white">
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Developers" },
        ]}
        subtitle="Developers"
        title="Portal de developers: chaves, webhooks e quickstart para CREALPH Bridge."
        body="Integre o Bridge à sua stack com SDKs em TypeScript e Python, APIs REST seguras e webhooks que notificam alterações financeiras ou operacionais. Receba métricas em tempo quase real, sem mover dinheiro e com controle de acesso granular."
        ctas={[
          {
            label: "Gerar API key",
            href: "/contact?utm_source=developers&utm_campaign=cta-primary",
            ariaLabel: "Gerar API key Bridge",
            campaign: "cta-primary",
          },
          {
            label: "Ver guia de integração",
            href: "/resources/guides/bridge?utm_source=developers&utm_campaign=cta-secondary",
            ariaLabel: "Ver guia de integração Bridge",
            variant: "secondary",
            campaign: "cta-secondary",
          },
        ]}
        source="developers-hero"
      />

      <SectionSeparator />

      <section className="px-4 py-16">
        <div className="mx-auto grid max-w-screen-xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div className="rounded-[calc(var(--radius)*1.5)] border border-line bg-surface p-8 shadow-md text-sm text-muted">
            <h2 className="text-2xl font-semibold text-ink">Quickstart (TypeScript)</h2>
            <pre className="mt-4 overflow-x-auto rounded-[--radius] bg-ink p-4 text-xs text-white">
{`import { createClient } from "@crealph/bridge";

const client = createClient({
  apiKey: process.env.CREALPH_KEY!,
});

const approvals = await client.payments.list({
  timeframe: "last_7_days",
});

console.log(approvals.summary());`}
            </pre>
          </div>
          <div className="space-y-6">
            <div className="rounded-[calc(var(--radius)*1.5)] border border-line bg-white p-8 shadow-md text-sm text-muted">
              <h2 className="text-2xl font-semibold text-ink">Webhooks disponíveis</h2>
              <ul className="mt-4 space-y-2">
                <li>payments.approved</li>
                <li>payments.failed</li>
                <li>automation.triggered</li>
                <li>insightscore.updated</li>
              </ul>
              <p className="mt-3">
                Todos com assinatura HMAC, retries exponenciais e logs acessíveis pelo dashboard.
              </p>
            </div>
            <div className="rounded-[calc(var(--radius)*1.5)] border border-line bg-white p-8 shadow-md text-sm text-muted">
              <h2 className="text-2xl font-semibold text-ink">Ambientes</h2>
              <p className="mt-2">Sandbox gratuito com dados sintéticos e produção com SLA de 99,9%.</p>
              <CTAButton
                href="/modules/bridge?utm_source=developers&utm_campaign=cta-secondary"
                label="Ver Bridge"
                ariaLabel="Ver detalhes do Bridge"
                variant="secondary"
                source="developers-body"
                campaign="cta-secondary"
              />
            </div>
          </div>
        </div>
      </section>

      <SeeAlso
        source="developers-see-also"
        items={[
          {
            title: "Bridge",
            description: "Saiba como o módulo funciona para squads de produto.",
            href: "/modules/bridge",
          },
          {
            title: "Automação operacional",
            description: "Conecte fluxos de vendas e atendimento ao Bridge.",
            href: "/services/automation",
          },
          {
            title: "Recursos técnicos",
            description: "Acesse guias, templates e scripts prontos.",
            href: "/resources/templates",
          },
          {
            title: "Contato técnico",
            description: "Fale com nosso suporte de engenharia.",
            href: "/contact",
          },
        ]}
      />
    </div>
  );
}
