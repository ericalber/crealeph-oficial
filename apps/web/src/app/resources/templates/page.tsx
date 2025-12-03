import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Templates (placeholder)",
  description: "Templates — placeholder.",
  robots: { index: false, follow: false },
};

export default function TemplatesPlaceholder() {
  return (
    <section className="px-4 py-20">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm">
        <ol className="flex items-center gap-2 text-[hsl(var(--muted-foreground))]">
          <li>
            <Link href="/" className="underline-offset-4 hover:underline">Home</Link>
          </li>
          <li aria-hidden>›</li>
          <li>
            <Link href="/resources" className="underline-offset-4 hover:underline">Recursos</Link>
          </li>
          <li aria-hidden>›</li>
          <li className="text-ink">Templates</li>
        </ol>
      </nav>
      <div className="mx-auto max-w-screen-md">
        <h1 className="text-3xl font-semibold text-ink">Templates (em breve)</h1>
        <p className="mt-3 text-[hsl(var(--muted-foreground))]">
          Em breve disponibilizaremos templates prontos. Fale com nosso time em
          <Link href="/contact" className="text-brand underline-offset-4 hover:underline">Contato</Link>.
        </p>
      </div>
    </section>
  );
}

