import { PageHero } from "@/components/layout/PageHero";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
import { SeeAlso } from "@/components/ui/SeeAlso";
import Link from "next/link";
import { CaseReadLink } from "@/components/cases/CaseReadLink";

const studyUrl = "";

export default function CaseMarinaVoxPage() {
  return (
    <div className="bg-white">
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Projetos", href: "/projects" },
          { label: "Marina Vox" },
        ]}
        subtitle="Case"
        title="Marina Vox: ocupação recorde com Market Twin™, Bridge e automações omnichannel."
        body="Marina Vox precisava reduzir cancelamentos e aumentar a previsibilidade das reservas de embarcações. Criamos um site com vitrine dinâmica, reservas em tempo real e copy baseada em dados do AQUA. Conectamos Market Twin™ para ajustar tarifas por clima, data e categoria. Bridge integrou ERP náutico e pagamentos, disparando alertas e automações de concierge."
        ctas={[
          {
            label: "Falar com especialista náutico",
            href: "/contact?utm_source=case-marina-vox&utm_campaign=cta-primary",
            ariaLabel: "Falar com especialista náutico",
            campaign: "cta-primary",
          },
          {
            label: "Ver módulo Market Twin™",
            href: "/modules/market-twin?utm_source=case-marina-vox&utm_campaign=cta-secondary",
            ariaLabel: "Ver módulo Market Twin",
            variant: "secondary",
            campaign: "cta-secondary",
          },
        ]}
        source="case-marina-vox-hero"
      />

      <SectionSeparator />

      <section className="px-4 py-16">
        <div className="mx-auto max-w-screen-xl space-y-10 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-[calc(var(--radius)*1.5)] border border-line bg-surface p-8 shadow-md">
              <h2 className="text-2xl font-semibold text-ink">Contexto e desafio</h2>
              <p className="mt-3 text-sm text-muted">
                Marina Vox opera 48 embarcações premium. Em alta temporada, perdia reservas por respostas lentas.
                Em baixa temporada, não conseguia ajustar preço e campanhas rapidamente. Falta de integração entre site,
                ERP náutico, gateways e equipe concierge gerava ruído e clientes pouco satisfeitos.
              </p>
            </div>
            <div className="rounded-[calc(var(--radius)*1.5)] border border-line bg-white p-8 shadow-md text-sm text-muted">
              <h2 className="text-2xl font-semibold text-ink">Solução CREALEPH</h2>
              <ul className="mt-4 space-y-2">
                <li>Website com vitrine dinâmica, agenda e formulários Molly Maid.</li>
                <li>Market Twin™ ajustando tarifa por categoria, período e clima.</li>
                <li>Bridge integrado ao ERP e gateway para alertas e automações.</li>
                <li>Campanhas de marketing com Scout e retargeting automatizado.</li>
              </ul>
              <p className="mt-3">
                Todo insight foi priorizado com{" "}
                <Link
                  href="/modules/insightscore?utm_source=case-marina-vox&utm_campaign=link"
                  className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                >
                  InsightScore™
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="rounded-[calc(var(--radius)*1.5)] border border-line bg-surface p-8 shadow-md">
            <h2 className="text-2xl font-semibold text-ink">Impacto</h2>
            <ul className="mt-4 grid gap-4 text-sm text-muted md:grid-cols-2">
              <li>
                <strong>41%</strong> de aumento na ocupação média em três meses.
              </li>
              <li>
                <strong>27%</strong> de redução no tempo de resposta médio graças às automações Bridge.
              </li>
              <li>
                <strong>22%</strong> de aumento no ticket médio com combos sugeridos pelo Market Twin™.
              </li>
              <li>
                <strong>95%</strong> de satisfação pós-reserva com fluxos omnichannel.
              </li>
            </ul>
          </div>
        </div>
      </section>
      {/* Link textual opcional (condicional por env e href) */}
      <section className="px-4 py-2">
        <div className="mx-auto max-w-screen-xl lg:px-8">
          <CaseReadLink href={studyUrl} />
        </div>
      </section>
      <SeeAlso
        source="case-marina-vox-see-also"
        items={[
          {
            title: "Automação operacional",
            description: "Conheça o serviço que sustenta as jornadas omnichannel.",
            href: "/services/automation",
          },
          {
            title: "Market Twin™",
            description: "Percentis e posicionamento por nicho.",
            href: "/modules/market-twin",
          },
          {
            title: "Módulo Bridge",
            description: "Integrações financeiras auditáveis.",
            href: "/modules/bridge",
          },
          {
            title: "Marinas & Charter",
            description: "Playbook completo para o setor.",
            href: "/industries/marinas",
          },
        ]}
      />
    </div>
  );
}
