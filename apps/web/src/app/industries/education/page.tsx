import { PageHero } from "@/components/layout/PageHero";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
import { MiniQuoteForm } from "@/components/forms/MiniQuoteForm";
import { SeeAlso } from "@/components/ui/SeeAlso";
import Link from "next/link";

export default function EducationIndustryPage() {
  return (
    <div className="bg-white">
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Indústrias", href: "/industries" },
          { label: "Educação" },
        ]}
        subtitle="Educação"
        title="Experiências digitais para escolas, universidades e edtechs."
        body="Estratégias para captação de alunos, matrículas digitais, trilhas de conteúdo e relacionamento com responsáveis. Respeitamos LGPD, acessibilidade WCAG e integrações com ERPs acadêmicos. Market Twin™ e Precificação Regional indicam mensalidades competitivas por bairro."
        ctas={[
          {
            label: "Agendar diagnóstico",
            href: "/contact?utm_source=industries-education&utm_campaign=cta-primary",
            ariaLabel: "Agendar diagnóstico educação",
            campaign: "cta-primary",
          },
          {
            label: "Ver FAQ LGPD",
            href: "/resources/faq?utm_source=industries-education&utm_campaign=cta-secondary",
            ariaLabel: "Ver FAQ LGPD",
            variant: "secondary",
            campaign: "cta-secondary",
          },
        ]}
        source="industries-education-hero"
      />

      <SectionSeparator />

      <section className="px-4 py-16">
        <div className="mx-auto grid max-w-screen-xl gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div className="space-y-8">
            <div className="rounded-[calc(var(--radius)*1.5)] border border-line bg-surface p-8 shadow-md">
              <h2 className="text-2xl font-semibold text-ink">Componentes do playbook</h2>
              <p className="mt-3 text-sm text-muted">
                Combinamos campanhas de
                <Link
                  href="/services/marketing?utm_source=industries-education&utm_campaign=link"
                  className="ml-1 text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                >
                  marketing inteligente
                </Link>
                {" "}com automações de
                <Link
                  href="/services/automation?utm_source=industries-education&utm_campaign=link"
                  className="ml-1 text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                >
                  relacionamento
                </Link>
                {" "}e políticas de preço definidas via
                <Link
                  href="/modules/pricing?utm_source=industries-education&utm_campaign=link"
                  className="ml-1 text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                >
                  Precificação Regional
                </Link>
                .
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                <li>Landing pages por curso com microcopy validado com AQUA.</li>
                <li>Automação para leads, responsáveis e ex-alunos com Bridge.</li>
                <li>Conteúdo editorial (blog, podcasts, eventos) com Scout monitorando concorrentes.</li>
              </ul>
            </div>
            <div className="rounded-[calc(var(--radius)*1.5)] border border-line bg-white p-8 shadow-md text-sm text-muted">
              <h2 className="text-2xl font-semibold text-ink">Compliance</h2>
              <p className="mt-3">
                Processamos dados sensíveis seguindo LGPD. Criamos políticas transparentes, banners de consentimento,
                logs de acesso e relatórios sob demanda. Integração com{" "}
                <Link
                  href="/modules/bridge?utm_source=industries-education&utm_campaign=link"
                  className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                >
                  Bridge
                </Link>{" "}
                garante observabilidade sobre matrículas e pagamentos.
              </p>
            </div>
          </div>
          <MiniQuoteForm context="Briefing — Educação" />
        </div>
      </section>

      <SeeAlso
        source="industries-education-see-also"
        items={[
          {
            title: "Marketing inteligente",
            description: "Captação multicanal com mensagens segmentadas.",
            href: "/services/marketing",
          },
          {
            title: "Precificação Regional",
            description: "Defina mensalidades competitivas em cada campus.",
            href: "/modules/pricing",
          },
          {
            title: "Blog Educação",
            description: "Conteúdo especializado para equipes acadêmicas.",
            href: "/resources/blog/educacao",
          },
          {
            title: "Contato",
            description: "Fale com o squad educação da CreAleph.",
            href: "/contact",
          },
        ]}
      />
    </div>
  );
}
