import { PageHero } from "@/components/layout/PageHero";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
import { CTAButton } from "@/components/ui/CTAButton";
import { MiniQuoteForm } from "@/components/forms/MiniQuoteForm";
import { SeeAlso } from "@/components/ui/SeeAlso";
import Link from "next/link";

export default function HealthIndustryPage() {
  return (
    <div className="bg-white">
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Indústrias", href: "/industries" },
          { label: "Saúde" },
        ]}
        subtitle="Saúde"
        title="Sites e jornadas para clínicas, laboratórios e healthtechs."
        body="LGPD, compliance e empatia. Aplicamos AQUA para entender dúvidas dos pacientes, InsightScore™ para validar melhorias e Bridge para integrar sistemas de agendamento, faturamento e prontuário. Comunicamos autoridade com conteúdo educativo e provas sociais supervisionadas."
        ctas={[
          {
            label: "Solicitar avaliação LGPD",
            href: "/contact?utm_source=industries-health&utm_campaign=cta-primary",
            ariaLabel: "Solicitar avaliação LGPD",
            campaign: "cta-primary",
          },
          {
            label: "Ver projetos de saúde",
            href: "/projects?utm_source=industries-health&utm_campaign=cta-secondary",
            ariaLabel: "Ver projetos de saúde",
            variant: "secondary",
            campaign: "cta-secondary",
          },
        ]}
        source="industries-health-hero"
      />

      <SectionSeparator />

      <section className="px-4 py-16">
        <div className="mx-auto grid max-w-screen-xl gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div className="space-y-8">
            <div className="rounded-[calc(var(--radius)*1.5)] border border-line bg-surface p-8 shadow-md">
              <h2 className="text-2xl font-semibold text-ink">Fluxos de confiança</h2>
              <p className="mt-3 text-sm text-muted">
                Conteúdo nasce do
                <Link
                  href="/modules/aqua?utm_source=industries-health&utm_campaign=link"
                  className="ml-1 text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                >
                  AQUA Insights
                </Link>
                , campanhas são otimizadas com
                <Link
                  href="/services/marketing?utm_source=industries-health&utm_campaign=link"
                  className="ml-1 text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                >
                  marketing inteligente
                </Link>
                {" "}e automações Bridge garantem lembretes e pós-consulta consistentes.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                <li>Landing pages para especialidades com copy dedicada e Q&A.</li>
                <li>Integração com sistemas de agendamento (iClinic, ZenFisio, Memed).</li>
                <li>Automação de pós-consulta e programas de retenção.</li>
              </ul>
            </div>
            <div className="rounded-[calc(var(--radius)*1.5)] border border-line bg-white p-8 shadow-md text-sm text-muted">
              <h2 className="text-2xl font-semibold text-ink">Regulatório</h2>
              <p className="mt-3">
                Implementamos termos, políticas e logs conforme LGPD, CRM e conselhos específicos. Bridge garante trilha auditável de
                dados e integrações com ERPs hospitalares.
              </p>
            </div>
            <CTAButton
              href="/modules/bridge?utm_source=industries-health&utm_campaign=cta-secondary"
              label="Saiba mais sobre Bridge"
              ariaLabel="Saiba mais sobre Bridge"
              variant="secondary"
              source="industries-health-body"
              campaign="cta-secondary"
            />
          </div>
          <MiniQuoteForm context="Briefing — Saúde" />
        </div>
      </section>

      <SeeAlso
        source="industries-health-see-also"
        items={[
          {
            title: "Automação operacional",
            description: "Fluxos de atendimento, faturamento e relacionamento.",
            href: "/services/automation",
          },
          {
            title: "AQUA Insights",
            description: "Mapeie dúvidas e objeções reais dos pacientes.",
            href: "/modules/aqua",
          },
          {
            title: "FAQ LGPD",
            description: "Tire dúvidas sobre privacidade e segurança.",
            href: "/resources/faq",
          },
          {
            title: "Contato",
            description: "Fale com o squad saúde da CreAleph.",
            href: "/contact",
          },
        ]}
      />
    </div>
  );
}
