import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guide: Bridge (placeholder)",
  description: "Bridge integration guide — placeholder.",
  robots: { index: false, follow: false },
};

export default function GuideBridge() {
  return (
    <section className="px-4 py-20">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm">
        <ol className="flex items-center gap-2 text-[hsl(var(--muted-foreground))]">
          <li>
            <Link href="/" className="underline-offset-4 hover:underline">Home</Link>
          </li>
          <li aria-hidden>›</li>
          <li>
            <Link href="/resources/guides" className="underline-offset-4 hover:underline">Guides</Link>
          </li>
          <li aria-hidden>›</li>
          <li className="text-ink">Bridge</li>
        </ol>
      </nav>
      <div className="mx-auto max-w-screen-md">
        <h1 className="text-3xl font-semibold text-ink">Bridge — guide coming soon</h1>
        <p className="mt-3 text-[hsl(var(--muted-foreground))]">
          Under construction. See also the <Link href="/modules/bridge" className="text-brand underline-offset-4 hover:underline">Bridge module</Link>.
        </p>
        <ul className="mt-6 list-disc pl-6 text-sm text-[hsl(var(--muted-foreground))]">
          <li>TODO: Introduction and requirements.</li>
          <li>TODO: Integration examples.</li>
        </ul>
      </div>
    </section>
  );
}
