import { PageHero } from "@/components/layout/PageHero";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
import { SeeAlso } from "@/components/ui/SeeAlso";
import Link from "next/link";
import { CaseReadLink } from "@/components/cases/CaseReadLink";

const studyUrl = "";

export default function CaseConstrutoraNortePage() {
  return (
    <div className="bg-white">
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Projetos", href: "/projects" },
          { label: "Construtora Norte" },
        ]}
        subtitle="Case"
        title="Construtora Norte: pipeline previsível com conteúdo técnico e automação Bridge."
        body="A construtora atuava em todo o Brasil e precisava organizar um funil consultivo. Implementamos site modular com hubs técnicos, automações complexas, Market Twin™ para priorizar praças e InsightScore™ para guiar o roadmap. Resultado: mais propostas qualificadas e ciclo de vendas encurtado."
        ctas={[
          {
            label: "Conversar com squad B2B",
            href: "/contact?utm_source=case-construtora&utm_campaign=cta-primary",
            ariaLabel: "Conversar com squad B2B",
            campaign: "cta-primary",
          },
          {
            label: "Ver playbook construção",
            href: "/industries/construction?utm_source=case-construtora&utm_campaign=cta-secondary",
            ariaLabel: "Ver playbook construção",
            variant: "secondary",
            campaign: "cta-secondary",
          },
        ]}
        source="case-construtora-hero"
      />

      <SectionSeparator />

      <section className="px-4 py-16">
        <div className="mx-auto max-w-screen-xl space-y-10 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-[calc(var(--radius)*1.5)] border border-line bg-surface p-8 shadow-md">
              <h2 className="text-2xl font-semibold text-ink">Desafios</h2>
              <p className="mt-3 text-sm text-muted">
                Funil dependente de indicações, pouca visibilidade sobre status de propostas e ausência de conteúdo técnico atualizado.
                A diretoria queria controlar previsibilidade e justificar investimentos em novas praças.
              </p>
            </div>
            <div className="rounded-[calc(var(--radius)*1.5)] border border-line bg-white p-8 shadow-md text-sm text-muted">
              <h2 className="text-2xl font-semibold text-ink">Soluções</h2>
              <ul className="mt-4 space-y-2">
                <li>Hub de conteúdo com guias, calculadoras e comparativos.</li>
                <li>Campanhas ABM usando dados do{" "}
                  <Link
                    href="/modules/aqua?utm_source=case-construtora&utm_campaign=link"
                    className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                  >
                    AQUA
                  </Link>
                  .</li>
                <li>Automação Bridge conectada ao Salesforce com alertas para pré-venda.</li>
                <li>InsightScore™ para priorizar hipóteses e novos materiais.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-[calc(var(--radius)*1.5)] border border-line bg-surface p-8 shadow-md">
            <h2 className="text-2xl font-semibold text-ink">Resultados atingidos</h2>
            <ul className="mt-4 grid gap-4 text-sm text-muted md:grid-cols-2">
              <li>↑28% na taxa de propostas apresentadas em seis meses.</li>
              <li>↑18% no ticket médio graças aos bundles sugeridos pelo Market Twin™.</li>
              <li>Ciclo de vendas 15 dias mais curto em comparação ao ano anterior.</li>
              <li>Dashboards em tempo real para diretoria e squad comercial.</li>
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
        source="case-construtora-see-also"
        items={[
          {
            title: "Serviços B2B",
            description: "Veja como estruturamos websites e marketing para vendas complexas.",
            href: "/services/marketing",
          },
          {
            title: "Automação operacional",
            description: "Playbooks com Bridge para pré-venda, vendas e pós-venda.",
            href: "/services/automation",
          },
          {
            title: "InsightScore™",
            description: "Priorize ideias com ciência de dados.",
            href: "/modules/insightscore",
          },
          {
            title: "Contato",
            description: "Planeje o próximo ciclo de crescimento com a CreAleph.",
            href: "/contact",
          },
        ]}
      />
    </div>
  );
}
