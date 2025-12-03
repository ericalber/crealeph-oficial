import { PageHero } from "@/components/layout/PageHero";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
import { SeeAlso } from "@/components/ui/SeeAlso";
import Link from "next/link";

export default function BlogGuiaPrecificacaoPage() {
  return (
    <div className="bg-white">
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Recursos", href: "/resources" },
          { label: "Blog", href: "/resources/blog" },
          { label: "Guia de precificação" },
        ]}
        subtitle="Blog • Pricing"
        title="Guia de precificação com Market Twin™"
        body="Aprenda a interpretar percentis de preço, executar testes controlados e alinhar squads de marketing, vendas e finanças."
        ctas={[]}
        source="blog-guia-precificacao-hero"
      />

      <SectionSeparator />

      <section className="px-4 py-16">
        <article className="mx-auto max-w-screen-md space-y-6 text-base leading-7 text-muted">
          <p>
            Os percentis mostram onde você está em relação ao mercado. P50 é o meio, P75 indica posicionamento premium.
            Conecte Market Twin™ ao{" "}
            <Link href="/modules/pricing?utm_source=blog-precificacao&utm_campaign=link" className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline">
              módulo de Precificação Regional
            </Link>{" "}
            para sugerir faixas específicas.
          </p>
          <p>
            Rode experimentos segmentando regiões. Use{" "}
            <Link href="/modules/insightscore?utm_source=blog-precificacao&utm_campaign=link" className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline">
              InsightScore™
            </Link>{" "}
            para priorizar ajustes. Quando um preço muda, automações Bridge atualizam sites, campanhas e propostas.
          </p>
          <p>
            Documente cada mudança no dashboard. Após 30 dias, compare margens, taxas de aprovação e volume de leads.
            Caso os resultados não sejam ideais, utilize{" "}
            <Link href="/modules/aqua?utm_source=blog-precificacao&utm_campaign=link" className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline">
              AQUA
            </Link>{" "}
            para ajustar argumento de valor e evitar guerra de preço.
          </p>
        </article>
      </section>

      <SeeAlso
        source="blog-precificacao-see-also"
        items={[
          {
            title: "Market Twin™",
            description: "Percentis em tempo real.",
            href: "/modules/market-twin",
          },
          {
            title: "Pricing Enterprise",
            description: "Planos para redes de grande porte.",
            href: "/pricing/enterprise",
          },
          {
            title: "Case Construtora Norte",
            description: "Exemplo de pricing em B2B.",
            href: "/projects/case-construtora-norte",
          },
          {
            title: "Contato",
            description: "Solicite estudo de precificação.",
            href: "/contact",
          },
        ]}
      />
    </div>
  );
}
