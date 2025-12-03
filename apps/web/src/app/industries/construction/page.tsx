import { PageHero } from "@/components/layout/PageHero";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
import { CTAButton } from "@/components/ui/CTAButton";
import { MiniQuoteForm } from "@/components/forms/MiniQuoteForm";
import { SeeAlso } from "@/components/ui/SeeAlso";
import Link from "next/link";

export default function ConstructionIndustryPage() {
  return (
    <div className="bg-white">
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Indústrias", href: "/industries" },
          { label: "Construção & B2B" },
        ]}
        subtitle="B2B e projetos complexos"
        title="Funil completo para construtoras, facilities e serviços de projeto."
        body="Sites modulares com catálogos, bibliotecas técnicas e calculadoras de ROI. Marketing ABM com conteúdo consultivo. Automação de pipeline integrada ao CRM. O Market Twin™ aponta regiões com maior aprovação e a Precificação Regional sugere faixas para pacotes e manutenção."
        ctas={[
          {
            label: "Ver case Construtora Norte",
            href: "/projects/case-construtora-norte?utm_source=industries-construction&utm_campaign=cta-primary",
            ariaLabel: "Ver case Construtora Norte",
            campaign: "cta-primary",
          },
          {
            label: "Baixar one-pager",
            href: "/resources/templates/b2b?utm_source=industries-construction&utm_campaign=cta-secondary",
            ariaLabel: "Baixar one-pager B2B",
            variant: "secondary",
            campaign: "cta-secondary",
          },
        ]}
        source="industries-construction-hero"
      />

      <SectionSeparator />

      <section className="px-4 py-16">
        <div className="mx-auto grid max-w-screen-xl gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div className="space-y-8">
            <div className="rounded-[calc(var(--radius)*1.5)] border border-line bg-surface p-8 shadow-md">
              <h2 className="text-2xl font-semibold text-ink">Pilares do playbook</h2>
              <p className="mt-3 text-sm text-muted">
                Insights do
                <Link
                  href="/modules/aqua?utm_source=industries-construction&utm_campaign=link"
                  className="ml-1 text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                >
                  AQUA
                </Link>
                {" "}alimentam conteúdo consultivo, enquanto
                <Link
                  href="/modules/scout?utm_source=industries-construction&utm_campaign=link"
                  className="ml-1 text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                >
                  Scout
                </Link>
                {" "}monitora concorrentes e
                <Link
                  href="/modules/market-twin?utm_source=industries-construction&utm_campaign=link"
                  className="ml-1 text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                >
                  Market Twin™
                </Link>
                {" "}prioriza praças com maior aprovação.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                <li>Landing pages para setores (indústria, varejo, logística, governo).</li>
                <li>Biblioteca técnica com guias, vídeos, cases e comparativos.</li>
                <li>Sequências de nurture multicanal e rotinas de pré-venda.</li>
              </ul>
            </div>
            <div className="rounded-[calc(var(--radius)*1.5)] border border-line bg-white p-8 shadow-md text-sm text-muted">
              <h2 className="text-2xl font-semibold text-ink">Dores x soluções</h2>
              <table className="mt-3 min-w-full text-left">
                <tbody>
                  <tr>
                    <th className="border-b border-line px-3 py-2">Problema</th>
                    <th className="border-b border-line px-3 py-2">Solução</th>
                  </tr>
                  <tr>
                    <td className="border-b border-line px-3 py-2">Funil pouco confiável</td>
                    <td className="border-b border-line px-3 py-2">Integração CRM + automações Bridge</td>
                  </tr>
                  <tr>
                    <td className="border-b border-line px-3 py-2">Conteúdo genérico</td>
                    <td className="border-b border-line px-3 py-2">AQUA Insights + guia técnico completo</td>
                  </tr>
                  <tr>
                    <td className="border-b border-line px-3 py-2">Precificação obscura</td>
                    <td className="border-b border-line px-3 py-2">Market Twin™ + pricing custom por escopo</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <CTAButton
              href="/modules/scout?utm_source=industries-construction&utm_campaign=cta-secondary"
              label="Ativar monitoramento de concorrentes"
              ariaLabel="Ativar monitoramento de concorrentes"
              variant="secondary"
              source="industries-construction-body"
              campaign="cta-secondary"
            />
          </div>
          <MiniQuoteForm context="Briefing — Construção & B2B" />
        </div>
      </section>

      <SeeAlso
        source="industries-construction-see-also"
        items={[
          {
            title: "Automação B2B",
            description: "Jornadas sofisticadas para ciclos longos.",
            href: "/services/automation",
          },
          {
            title: "Market Twin™",
            description: "Acompanhe tempos de resposta e aprovação por região.",
            href: "/modules/market-twin",
          },
          {
            title: "Blog B2B",
            description: "Leituras profundas para times comerciais.",
            href: "/resources/blog/abm-industrial",
          },
          {
            title: "Contato",
            description: "Converse com consultores especialistas em B2B.",
            href: "/contact",
          },
        ]}
      />
    </div>
  );
}
