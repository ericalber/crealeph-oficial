import { PageHero } from "@/components/layout/PageHero";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
import { CTAButton } from "@/components/ui/CTAButton";
import { MiniQuoteForm } from "@/components/forms/MiniQuoteForm";
import { SeeAlso } from "@/components/ui/SeeAlso";
import Link from "next/link";

export default function MarinasIndustryPage() {
  return (
    <div className="bg-white">
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Indústrias", href: "/industries" },
          { label: "Marinas & Charter" },
        ]}
        subtitle="Marinas & Charter"
        title="Experiência omnichannel para aluguel de embarcações e manutenção."
        body="Integramos gestão de marina, reservas, manutenção e atendimento em um único fluxo. Websites exibem disponibilidade em tempo real, automações confirmam check-in/out e Bridge conecta faturamento. Market Twin™ compara tarifas por marina e Scout monitora promoções sazonais."
        ctas={[
          {
            label: "Ver case Marina Vox",
            href: "/projects/case-marina-vox?utm_source=industries-marinas&utm_campaign=cta-primary",
            ariaLabel: "Ver case Marina Vox",
            campaign: "cta-primary",
          },
          {
            label: "Solicitar proposta",
            href: "/contact?utm_source=industries-marinas&utm_campaign=cta-secondary",
            ariaLabel: "Solicitar proposta para marinas",
            variant: "secondary",
            campaign: "cta-secondary",
          },
        ]}
        source="industries-marinas-hero"
      />

      <SectionSeparator />

      <section className="px-4 py-16">
        <div className="mx-auto grid max-w-screen-xl gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div className="space-y-8">
            <div className="rounded-[calc(var(--radius)*1.5)] border border-line bg-surface p-8 shadow-md">
              <h2 className="text-2xl font-semibold text-ink">Soluções principais</h2>
              <p className="mt-3 text-sm text-muted">
                Market Twin™ sugere tarifas por temporada, enquanto
                <Link
                  href="/services/automation?utm_source=industries-marinas&utm_campaign=link"
                  className="ml-1 text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                >
                  automações CreAleph
                </Link>
                {" "}sincronizam reservas e manutenção. O
                <Link
                  href="/modules/bridge?utm_source=industries-marinas&utm_campaign=link"
                  className="ml-1 text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                >
                  Bridge
                </Link>
                {" "}integra faturamento e estoque em tempo real.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                <li>Portal com disponibilidade, fotos, especificações e precificação dinâmica.</li>
                <li>Automação de reserva e cobrança com Bridge + ERPs náuticos.</li>
                <li>Fluxos de manutenção preventiva com dashboards para times técnicos.</li>
              </ul>
            </div>
            <CTAButton
              href="/modules/market-twin?utm_source=industries-marinas&utm_campaign=cta-secondary"
              label="Aplicar Market Twin™"
              ariaLabel="Aplicar Market Twin nas marinas"
              variant="secondary"
              source="industries-marinas-body"
              campaign="cta-secondary"
            />
            <p className="text-sm text-muted">
              Trabalhamos lado a lado com equipes de operações, marketing e concierge para garantir experiência
              consistente do primeiro clique ao pós-viagem.
            </p>
          </div>
          <MiniQuoteForm context="Briefing — Marinas & Charter" />
        </div>
      </section>

      <SeeAlso
        source="industries-marinas-see-also"
        items={[
          {
            title: "Market Twin™",
            description: "Compreenda percentis de preço por temporada.",
            href: "/modules/market-twin",
          },
          {
            title: "Automação operacional",
            description: "Fluxos para reservas, manutenção e billing.",
            href: "/services/automation",
          },
          {
            title: "Projetos",
            description: "Cases de turismo e hospitalidade premium.",
            href: "/projects",
          },
          {
            title: "Contato",
            description: "Converse com o squad náutico.",
            href: "/contact",
          },
        ]}
      />
    </div>
  );
}
