import { PageHero } from "@/components/layout/PageHero";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
import { SeeAlso } from "@/components/ui/SeeAlso";
import Link from "next/link";

export default function BlogSiteModularPage() {
  return (
    <div className="bg-white">
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Recursos", href: "/resources" },
          { label: "Blog", href: "/resources/blog" },
          { label: "Site modular" },
        ]}
        subtitle="Blog • Website"
        title="Como um site modular reduz 35% do tempo de implantação"
        body="Descrevemos o fluxo que liga discovery, design e desenvolvimento com o TechAI Pack. Tokens, componentes e automações garantem consistência e velocidade. Ideal para negócios locais e B2B."
        ctas={[]}
        source="blog-site-modular-hero"
      />

      <SectionSeparator />

      <section className="px-4 py-16">
        <article className="mx-auto max-w-screen-md space-y-6 text-base leading-7 text-muted">
          <p>
            Começamos com um kickoff de discovery. Usamos{" "}
            <Link href="/modules/aqua?utm_source=blog-site-modular&utm_campaign=link" className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline">
              AQUA
            </Link>{" "}
            para entender linguagem, promessas e objeções reais. Em seguida, montamos estrutura de navegação utilizando o
            grid 12 colunas do TechAI Pack. Copys são priorizadas com{" "}
            <Link href="/modules/insightscore?utm_source=blog-site-modular&utm_campaign=link" className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline">
              InsightScore™
            </Link>{" "}
            e as variações de layout já possuem tokens aplicados para tipografia, cores e espaçamento.
          </p>
          <p>
            No desenvolvimento, a sincronização entre Figma e código ocorre via tokens exportados, componentes React e
            Tailwind com safelist para classes mais específicas. Automação CI/CD garante preview a cada PR. Quando o site
            sobe, conectamos formulários a{" "}
            <Link href="/services/automation?utm_source=blog-site-modular&utm_campaign=link" className="text-brand underline-offset-4 transition hover:text-brand-600 hover:underline">
              automações CreAleph
            </Link>
            , disparando fluxos de nurturing e alertas com Bridge. Resultado: primeira versão em 5 dias úteis, com
            performance AA e SEO técnico já configurado.
          </p>
          <p>
            Use este fluxo para lançar novos produtos ou versões regionais sem retrabalho de design. Combine com Market
            Twin™ e Precificação Regional para oferecer valores coerentes e com Scout para monitorar se concorrentes copiam seus movimentos.
          </p>
        </article>
      </section>

      <SeeAlso
        source="blog-site-modular-see-also"
        items={[
          {
            title: "Serviço de websites",
            description: "Veja como aplicamos o processo em clientes reais.",
            href: "/services/websites",
          },
          {
            title: "Marketing inteligente",
            description: "Conecte o site modular com campanhas contínuas.",
            href: "/services/marketing",
          },
          {
            title: "Case ClinGroup",
            description: "Exemplo de site modular em saúde.",
            href: "/projects/case-clingroup",
          },
          {
            title: "Templates",
            description: "Baixe checklists de implantação e handoff.",
            href: "/resources/templates",
          },
        ]}
      />
    </div>
  );
}
