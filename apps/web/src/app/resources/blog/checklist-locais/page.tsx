import { PageHero } from "@/components/layout/PageHero";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
import { SeeAlso } from "@/components/ui/SeeAlso";
import Link from "next/link";

export default function BlogChecklistLocaisPage() {
  return (
    <div className="bg-white">
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Recursos", href: "/resources" },
          { label: "Blog", href: "/resources/blog" },
          { label: "Checklist Marketing Local" },
        ]}
        subtitle="Blog • Marketing"
        title="Checklist de marketing inteligente para negócios locais"
        body="Checklist completo para franquias, redes de limpeza, beleza e saúde. Une AQUA, Scout, Market Twin™ e automações Bridge."
        ctas={[]}
        source="blog-checklist-locais-hero"
      />

      <SectionSeparator />

      <section className="px-4 py-16">
        <article className="mx-auto max-w-screen-md space-y-6 text-base leading-7 text-muted">
          <ol className="space-y-3">
            <li>
              <strong>1. Linguagem apropriada:</strong> use{" "}
              <Link href="/modules/aqua?utm_source=blog-checklist&utm_campaign=link" className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline">
                AQUA
              </Link>{" "}
              para descobrir promessas, dores e provas sociais. Atualize website, anúncios e materiais offline com essas informações.
            </li>
            <li>
              <strong>2. Campanhas locais:</strong> configure keywords específicas, extensões de localização e segmentações por raio. Combine com{" "}
              <Link href="/services/marketing?utm_source=blog-checklist&utm_campaign=link" className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline">
                marketing inteligente
              </Link>{" "}
              para operações multi-loja.
            </li>
            <li>
              <strong>3. Preço coerente:</strong> use{" "}
              <Link href="/modules/pricing?utm_source=blog-checklist&utm_campaign=link" className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline">
                Precificação Regional
              </Link>{" "}
              e Market Twin™ para definir ofertas e combos.
            </li>
            <li>
              <strong>4. Automação omnichannel:</strong> Bridge + CRM para follow-up via WhatsApp, SMS e e-mail.
            </li>
            <li>
              <strong>5. Métricas:</strong> monitore leads, custo por ação e taxa de aprovação diretamente no dashboard /app.
            </li>
          </ol>
        </article>
      </section>

      <SeeAlso
        source="blog-checklist-locais-see-also"
        items={[
          {
            title: "Serviços para locais",
            description: "Playbook completo de limpeza, beleza e serviços recorrentes.",
            href: "/industries/cleaning",
          },
          {
            title: "Automação operacional",
            description: "Fluxos para agendamento e fidelização.",
            href: "/services/automation",
          },
          {
            title: "Template de campanha",
            description: "Baixe planilha com checklist pronto.",
            href: "/resources/templates",
          },
          {
            title: "Contato",
            description: "Solicite diagnóstico gratuito da sua franquia.",
            href: "/contact",
          },
        ]}
      />
    </div>
  );
}
