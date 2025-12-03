// Glossário: "robôs parasitas" = watchers/crawlers (Scout). "pontes p/ pagamentos" = Billing Connectors (Bridge/Stripe/PayPal).
import Link from "next/link";

export const metadata = { robots: { index: false, follow: false } } as const;

export default function MarketingPaidPage() {
  const items = [
    { href: "/services/marketing/paid/search", title: "Search", desc: "Google Ads (search & performance)" },
    { href: "/services/marketing/paid/social", title: "Social", desc: "Meta/LinkedIn with ABM" },
    { href: "/services/marketing/paid/display-remarketing", title: "Display & Remarketing", desc: "Awareness and re-engagement" },
    { href: "/services/marketing/paid/youtube-podcast", title: "YouTube & Podcast", desc: "Video and audio formats" },
  ];
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
          <span className="text-ink">Paid (bundle)</span>
        </nav>
        <h1 className="text-3xl font-semibold text-ink">Paid (bundle)</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {items.map((card) => (
            <Link key={card.href} href={card.href} className="rounded-[--radius] border border-line bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <h2 className="text-lg font-semibold text-ink">{card.title}</h2>
              <p className="text-sm text-muted">{card.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
