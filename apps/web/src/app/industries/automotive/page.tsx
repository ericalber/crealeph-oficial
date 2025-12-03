import { PageHero } from "@/components/layout/PageHero";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
import { CTAButton } from "@/components/ui/CTAButton";
import { MiniQuoteForm } from "@/components/forms/MiniQuoteForm";
import { SeeAlso } from "@/components/ui/SeeAlso";
import Link from "next/link";

export default function AutomotiveIndustryPage() {
  return (
    <div className="bg-white">
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Indústrias", href: "/industries" },
          { label: "Automotivo & Náutico" },
        ]}
        subtitle="Automotivo & Náutico"
        title="Marketing e automação para revendas premium, oficinas e marinas."
        body="Posicionamento sensível a preço e disponibilidade. Market Twin™ mostra percentis por região e tipo de veículo, Bridge integra estoque e faturamento, enquanto Scout alerta sobre novas campanhas dos concorrentes. Websites exibem vitrines dinâmicas e formulários com orçamento instantâneo."
        ctas={[
          {
            label: "Ver case Marina Vox",
            href: "/projects/case-marina-vox?utm_source=industries-automotive&utm_campaign=cta-primary",
            ariaLabel: "Ver case Marina Vox",
            campaign: "cta-primary",
          },
          {
            label: "Solicitar diagnóstico",
            href: "/contact?utm_source=industries-automotive&utm_campaign=cta-secondary",
            ariaLabel: "Solicitar diagnóstico automotivo",
            variant: "secondary",
            campaign: "cta-secondary",
          },
        ]}
        source="industries-automotive-hero"
      />

      <SectionSeparator />

      <section className="px-4 py-16">
        <div className="mx-auto grid max-w-screen-xl gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div className="space-y-8">
            <div className="rounded-[calc(var(--radius)*1.5)] border border-line bg-surface p-8 shadow-md">
              <h2 className="text-2xl font-semibold text-ink">Componentes essenciais</h2>
              <p className="mt-3 text-sm text-muted">
                Conectamos vitrines dinâmicas a
                <Link
                  href="/modules/market-twin?utm_source=industries-automotive&utm_campaign=link"
                  className="ml-1 text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                >
                  Market Twin™
                </Link>
                , campanhas inteligentes com
                <Link
                  href="/services/marketing?utm_source=industries-automotive&utm_campaign=link"
                  className="ml-1 text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                >
                  marketing CreAleph
                </Link>
                {" "}e follow-up automatizado via
                <Link
                  href="/modules/bridge?utm_source=industries-automotive&utm_campaign=link"
                  className="ml-1 text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
                >
                  Bridge
                </Link>
                .
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                <li>Catálogo com filtros por tipo, ano, quilometragem e faixa de preço.</li>
                <li>Form hero Molly Maid adaptado para cotação ou reserva de test-drive.</li>
                <li>Integração com CRM para follow-up automático e scoring.</li>
              </ul>
            </div>
            <div className="rounded-[calc(var(--radius)*1.5)] border border-line bg-white p-8 shadow-md text-sm text-muted">
              <h2 className="text-2xl font-semibold text-ink">Métricas monitoradas</h2>
              <ul className="mt-4 space-y-2">
                <li>Tempo médio de resposta por consultor (Bridge).</li>
                <li>Giro de estoque por categoria (Market Twin™).</li>
                <li>Taxa de aprovação X canal (Scout + InsightScore™).</li>
              </ul>
              <CTAButton
                href="/modules/market-twin?utm_source=industries-automotive&utm_campaign=cta-secondary"
                label="Entender Market Twin™"
                ariaLabel="Entender Market Twin"
                variant="secondary"
                source="industries-automotive-body"
                campaign="cta-secondary"
              />
            </div>
          </div>
          <MiniQuoteForm context="Briefing — Automotivo & Náutico" />
        </div>
      </section>

      <SeeAlso
        source="industries-automotive-see-also"
        items={[
          {
            title: "Pricing automotivo",
            description: "Combine Market Twin™ com precificação regional.",
            href: "/modules/pricing",
          },
          {
            title: "Bridge",
            description: "Integre ERPs de estoque e billing.",
            href: "/modules/bridge",
          },
          {
            title: "Marketing inteligente",
            description: "Campanhas multicanal para venda de alto ticket.",
            href: "/services/marketing",
          },
          {
            title: "Dashboard",
            description: "KPIs para acompanhar performance diária.",
            href: "/app",
          },
        ]}
      />
    </div>
  );
}
