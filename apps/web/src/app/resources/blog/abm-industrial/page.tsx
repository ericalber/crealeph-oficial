import { PageHero } from "@/components/layout/PageHero";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
import { SeeAlso } from "@/components/ui/SeeAlso";
import Link from "next/link";

export default function BlogAbmIndustrialPage() {
  return (
    <div className="bg-white">
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Recursos", href: "/resources" },
          { label: "Blog", href: "/resources/blog" },
          { label: "ABM industrial" },
        ]}
        subtitle="Blog • ABM"
        title="ABM industrial: como nutrimos contas complexas"
        body="Compartilhamos o playbook usado em construtoras, facilities e indústrias. Estratégia ABM com squads integrados, conteúdo consultivo, Market Twin™ e automações Bridge."
        ctas={[]}
        source="blog-abm-industrial-hero"
      />

      <SectionSeparator />

      <section className="px-4 py-16">
        <article className="mx-auto max-w-screen-md space-y-6 text-base leading-7 text-muted">
          <p>
            ABM exige foco em contas prioritárias. Criamos matrizes que cruzam segmentos, regiões e gatilhos de compra.
            Scout monitora movimentos dos concorrentes, Market Twin™ indica regiões com maior aprovação e{" "}
            <Link href="/services/automation?utm_source=blog-abm&utm_campaign=link" className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline">
              automação
            </Link>{" "}
            garante que a jornada seja personalizada.
          </p>
          <p>
            Conteúdo é o eixo central. Publicamos guias técnicos, calculadoras, webinars e estudos. Cada peça é escrita
            com dados do{" "}
            <Link href="/modules/aqua?utm_source=blog-abm&utm_campaign=link" className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline">
              AQUA
            </Link>{" "}
            e priorizada com InsightScore™. Landing pages têm formulários inteligentes e provas sociais customizadas.
          </p>
          <p>
            No CRM, Bridge integra interações em tempo real. O time comercial recebe alertas quando uma conta atinge
            o score ideal e o conteúdo certo é enviado automaticamente. Em ciclos longos, esse alinhamento gera previsibilidade
            e confiança na diretoria.
          </p>
        </article>
      </section>

      <SeeAlso
        source="blog-abm-see-also"
        items={[
          {
            title: "Serviços B2B",
            description: "Conheça o pacote completo para projetos complexos.",
            href: "/services/marketing",
          },
          {
            title: "Case Construtora Norte",
            description: "Aplicação real do playbook ABM.",
            href: "/projects/case-construtora-norte",
          },
          {
            title: "InsightScore™",
            description: "Priorize insights de ABM com dados.",
            href: "/modules/insightscore",
          },
          {
            title: "Contato",
            description: "Fale com o squad B2B para personalizar o playbook.",
            href: "/contact",
          },
        ]}
      />
    </div>
  );
}
