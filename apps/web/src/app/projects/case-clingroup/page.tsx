import { PageHero } from "@/components/layout/PageHero";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
import { SeeAlso } from "@/components/ui/SeeAlso";
import Link from "next/link";
import { CaseReadLink } from "@/components/cases/CaseReadLink";

const studyUrl = "";

export default function CaseClingroupPage() {
  return (
    <div className="bg-white">
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Projetos", href: "/projects" },
          { label: "ClinGroup" },
        ]}
        subtitle="Case"
        title="ClinGroup: marketing local + automação que reduziu o custo por consulta em 32%."
        body="ClinGroup precisava padronizar a presença digital das unidades e controlar agendamentos. Recriamos o site com páginas por especialidade, usamos AQUA para atualizar a linguagem e Implantamos Market Twin™ para definir faixas de preço. As campanhas locais, automações Bridge e InsightScore™ mantiveram o time alinhado."
        ctas={[
          {
            label: "Falar com squad saúde",
            href: "/contact?utm_source=case-clingroup&utm_campaign=cta-primary",
            ariaLabel: "Falar com squad saúde",
            campaign: "cta-primary",
          },
          {
            label: "Ver playbook saúde",
            href: "/industries/health?utm_source=case-clingroup&utm_campaign=cta-secondary",
            ariaLabel: "Ver playbook saúde",
            variant: "secondary",
            campaign: "cta-secondary",
          },
        ]}
        source="case-clingroup-hero"
      />

      <SectionSeparator />

      <section className="px-4 py-16">
        <div className="mx-auto max-w-screen-xl space-y-10 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-[calc(var(--radius)*1.5)] border border-line bg-surface p-8 shadow-md">
              <h2 className="text-2xl font-semibold text-ink">Desafio</h2>
              <p className="mt-3 text-sm text-muted">
                Havia discrepâncias de copy, preços e formulários entre as unidades. O time comercial tinha pouco insight
                sobre as dores dos pacientes — mapeamos tudo com
                <Link
                  href="/modules/aqua?utm_source=case-clingroup&utm_campaign=link"
                  className="ml-1 text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                >
                  AQUA
                </Link>
                . Também precisavam padronizar valores com
                <Link
                  href="/modules/pricing?utm_source=case-clingroup&utm_campaign=link"
                  className="ml-1 text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                >
                  Precificação Regional
                </Link>
                {" "}sem ferir LGPD.
              </p>
            </div>
            <div className="rounded-[calc(var(--radius)*1.5)] border border-line bg-white p-8 shadow-md text-sm text-muted">
              <h2 className="text-2xl font-semibold text-ink">Solução implementada</h2>
              <ul className="mt-4 space-y-2">
                <li>Website modular com páginas de especialidade e agenda integrada.</li>
                <li>Campanhas geolocalizadas com
                  <Link
                    href="/modules/scout?utm_source=case-clingroup&utm_campaign=link"
                    className="ml-1 text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                  >
                    Scout
                  </Link>
                  alimentando novos testes de copy.</li>
                <li>Automação Bridge para confirmação e pós-consulta em múltiplos canais.</li>
                <li>Relatórios InsightScore™ para priorizar melhorias mensais.</li>
              </ul>
              <p className="mt-3">
                LGPD reforçada com termos, consentimento e logs exportáveis.
              </p>
            </div>
          </div>

          <div className="rounded-[calc(var(--radius)*1.5)] border border-line bg-surface p-8 shadow-md">
            <h2 className="text-2xl font-semibold text-ink">Resultados</h2>
            <ul className="mt-4 grid gap-4 text-sm text-muted md:grid-cols-2">
              <li>↓32% no custo por consulta em 90 dias.</li>
              <li>↑4.9/5 na pesquisa de satisfação pós-atendimento.</li>
              <li>↑38% no volume de leads qualificados via automação.</li>
              <li>Tempo de resposta médio caiu de 2h15 para 32 minutos.</li>
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
        source="case-clingroup-see-also"
        items={[
          {
            title: "Indústria Saúde",
            description: "Veja o playbook completo para clínicas e healthtechs.",
            href: "/industries/health",
          },
          {
            title: "Bridge",
            description: "Integrações seguras e auditáveis.",
            href: "/modules/bridge",
          },
          {
            title: "AQUA Insights",
            description: "Mapeamento contínuo de dores e objeções.",
            href: "/modules/aqua",
          },
          {
            title: "Contato",
            description: "Agende uma conversa com o squad saúde.",
            href: "/contact",
          },
        ]}
      />
    </div>
  );
}
