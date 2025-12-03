// Glossário: "robôs parasitas" = watchers/crawlers (Scout). "pontes p/ pagamentos" = Billing Connectors (Bridge/Stripe/PayPal).
import Link from "next/link";

export const metadata = { robots: { index: false, follow: false } } as const;

export default function MarketingPaidSocialPage() {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-screen-xl space-y-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.3em] text-muted">
          <Link href="/" className="underline-offset-4 hover:underline">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/services" className="underline-offset-4 hover:underline">Services</Link>
          <span className="mx-2">›</span>
          <Link href="/services/marketing" className="underline-offset-4 hover:underline">Marketing</Link>
          <span className="mx-2">›</span>
          <Link href="/services/marketing/paid" className="underline-offset-4 hover:underline">Paid</Link>
          <span className="mx-2">›</span>
          <span className="text-ink">Social</span>
        </nav>
        <h1 className="text-3xl font-semibold text-ink">Social</h1>
        <div className="grid gap-8 md:grid-cols-2">
          <article className="rounded-[--radius] border border-line bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-ink">What we deliver</h2>
            <ul className="mt-3 list-disc pl-6 text-sm text-muted">
              <li>Account-level targeting and ABM</li>
              <li>Creatives and copy variations</li>
              <li>Pixel and events with Bridge</li>
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
