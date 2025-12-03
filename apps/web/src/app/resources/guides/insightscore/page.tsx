import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guia: InsightScore (placeholder)",
  description: "Guia InsightScore — placeholder.",
  robots: { index: false, follow: false },
};

export default function GuideInsightScore() {
  return (
    <section className="px-4 py-20">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm">
        <ol className="flex items-center gap-2 text-[hsl(var(--muted-foreground))]">
          <li>
            <Link href="/" className="underline-offset-4 hover:underline">Home</Link>
          </li>
          <li aria-hidden>›</li>
          <li>
            <Link href="/resources/guides" className="underline-offset-4 hover:underline">Guias</Link>
          </li>
          <li aria-hidden>›</li>
          <li className="text-ink">InsightScore</li>
        </ol>
      </nav>
      <div className="mx-auto max-w-screen-md">
        <h1 className="text-3xl font-semibold text-ink">InsightScore — guia em breve</h1>
        <p className="mt-3 text-[hsl(var(--muted-foreground))]">
          Em construção. Saiba mais sobre o <Link href="/modules/insightscore" className="text-brand underline-offset-4 hover:underline">módulo InsightScore</Link>.
        </p>
        <ul className="mt-6 list-disc pl-6 text-sm text-[hsl(var(--muted-foreground))]">
          <li>TODO: Metodologia e métricas.</li>
          <li>TODO: Exemplos práticos.</li>
        </ul>
      </div>
    </section>
  );
}

