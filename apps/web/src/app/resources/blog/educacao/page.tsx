import { PageHero } from "@/components/layout/PageHero";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
import { SeeAlso } from "@/components/ui/SeeAlso";
import Link from "next/link";

export default function BlogEducacaoPage() {
  return (
    <div className="bg-white">
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Recursos", href: "/resources" },
          { label: "Blog", href: "/resources/blog" },
          { label: "Captação de alunos" },
        ]}
        subtitle="Blog • Educação"
        title="Captação de alunos com automação inteligente"
        body="Como escolas e edtechs usam descobertas do AQUA, campanhas locais, Market Twin™ e Bridge para atrair, converter e reter alunos."
        ctas={[]}
        source="blog-educacao-hero"
      />

      <SectionSeparator />

      <section className="px-4 py-16">
        <article className="mx-auto max-w-screen-md space-y-6 text-base leading-7 text-muted">
          <p>
            Captar alunos exige comunicação empática. Use{" "}
            <Link href="/modules/aqua?utm_source=blog-educacao&utm_campaign=link" className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline">
              AQUA
            </Link>{" "}
            para entender preocupações de pais e alunos. Crie landing pages por curso, com depoimentos verificáveis e
            orientações claras.
          </p>
          <p>
            As campanhas combinam Google, Meta e mídia local. Scout monitora mudanças em concorrentes e{" "}
            <Link href="/modules/insightscore?utm_source=blog-educacao&utm_campaign=link" className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline">
              InsightScore™
            </Link>{" "}
            prioriza hipóteses para novos conteúdos.
          </p>
          <p>
            Bridge integra sistemas de matrícula, faturamento e EAD. Com isso, automações nutrem leads, cobram mensalidades,
            enviam alertas de rematrícula e reduzem inadimplência. Market Twin™ mostra mensalidades competitivas por região.
          </p>
        </article>
      </section>

      <SeeAlso
        source="blog-educacao-see-also"
        items={[
          {
            title: "Indústria Educação",
            description: "Playbook completo para escolas e edtechs.",
            href: "/industries/education",
          },
          {
            title: "Serviços de marketing",
            description: "Campanhas segmentadas para captação.",
            href: "/services/marketing",
          },
          {
            title: "Bridge",
            description: "Integração segura com ERPs acadêmicos.",
            href: "/modules/bridge",
          },
          {
            title: "Contato",
            description: "Fale com nosso squad educação.",
            href: "/contact",
          },
        ]}
      />
    </div>
  );
}
