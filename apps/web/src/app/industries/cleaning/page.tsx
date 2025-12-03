import { PageHero } from "@/components/layout/PageHero";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
import { CTAButton } from "@/components/ui/CTAButton";
import { SeeAlso } from "@/components/ui/SeeAlso";
import { MiniQuoteForm } from "@/components/forms/MiniQuoteForm";
import Link from "next/link";

export default function CleaningIndustryPage() {
  return (
    <div className="bg-white">
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Indústrias", href: "/industries" },
          { label: "Negócios locais" },
        ]}
        subtitle="Negócios locais"
        title="Playbook CREALEPH para limpeza, beleza e serviços recorrentes."
        body="Sites com hero Molly Maid, formulários estilo budget, CTAs de agendamento e automações de follow-up. Com AQUA descobrimos promessas que convertem no bairro, Scout monitora concorrentes e Market Twin™ define preço ideal por região. Tudo integrado ao CRM e canais de atendimento."
        ctas={[
          {
            label: "Ver exemplos de sites",
            href: "/projects?utm_source=industries-cleaning&utm_campaign=cta-primary",
            ariaLabel: "Ver exemplos de sites para limpeza",
            campaign: "cta-primary",
          },
          {
            label: "Solicitar proposta",
            href: "/contact?utm_source=industries-cleaning&utm_campaign=cta-secondary",
            ariaLabel: "Solicitar proposta para negócios locais",
            variant: "secondary",
            campaign: "cta-secondary",
          },
        ]}
        source="industries-cleaning-hero"
      />

      <SectionSeparator />

      <section className="px-4 py-16">
        <div className="mx-auto grid max-w-screen-xl gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div className="space-y-8">
            <div className="rounded-[calc(var(--radius)*1.5)] border border-line bg-surface p-8 shadow-md">
              <h2 className="text-2xl font-semibold text-ink">Pilares do playbook</h2>
              <p className="mt-3 text-sm text-muted">
                Combine o site modular com
                <Link
                  href="/services/marketing?utm_source=industries-cleaning&utm_campaign=link"
                  className="ml-1 text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                >
                  campanhas locais
                </Link>
                , ajuste preços com
                <Link
                  href="/modules/pricing?utm_source=industries-cleaning&utm_campaign=link"
                  className="ml-1 text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                >
                  Precificação Regional
                </Link>
                {" "}e automatize follow-up usando
                <Link
                  href="/services/automation?utm_source=industries-cleaning&utm_campaign=link"
                  className="ml-1 text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                >
                  automações CreAleph
                </Link>
                .
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                <li>Landing pages com prova social, tabelas de preço e CTAs de orçamento instantâneo.</li>
                <li>Campanhas locais segmentadas por raio e palavras-chave específicas.</li>
                <li>Automação de agendamento com rotas para WhatsApp, telefone e e-mail.</li>
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
                    <td className="border-b border-line px-3 py-2">Leads frios sem retorno</td>
                    <td className="border-b border-line px-3 py-2">Automação com Bridge + SMS/WhatsApp</td>
                  </tr>
                  <tr>
                    <td className="border-b border-line px-3 py-2">Preço desalinhado</td>
                    <td className="border-b border-line px-3 py-2">Precificação Regional + Market Twin™</td>
                  </tr>
                  <tr>
                    <td className="border-b border-line px-3 py-2">Descrições pouco atrativas</td>
                    <td className="border-b border-line px-3 py-2">AQUA Insights atualizados mensalmente</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <CTAButton
              href="/modules/aqua?utm_source=industries-cleaning&utm_campaign=cta-secondary"
              label="Ver detalhes do AQUA"
              ariaLabel="Ver detalhes do AQUA"
              variant="secondary"
              source="industries-cleaning-body"
              campaign="cta-secondary"
            />
          </div>
          <MiniQuoteForm context="Briefing — Limpeza & Locais" />
        </div>
      </section>

      <SeeAlso
        source="industries-cleaning-see-also"
        items={[
          {
            title: "Marketing inteligente",
            description: "Campanhas locais e SEO que mantêm agenda cheia.",
            href: "/services/marketing",
          },
          {
            title: "Precificação Regional",
            description: "Calibre sua oferta por bairro.",
            href: "/modules/pricing",
          },
          {
            title: "Case Marina Vox",
            description: "Exemplo de automação omnichannel.",
            href: "/projects/case-marina-vox",
          },
          {
            title: "Contato",
            description: "Fale com o time dedicado a negócios locais.",
            href: "/contact",
          },
        ]}
      />
    </div>
  );
}
