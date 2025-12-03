import Link from "next/link";

export default function MarketingOverviewPage() {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-screen-xl space-y-8 lg:px-8">
        <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.3em] text-muted">
          <Link href="/" className="underline-offset-4 hover:underline">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/services" className="underline-offset-4 hover:underline">Services</Link>
          <span className="mx-2">›</span>
          <span className="text-ink">Marketing</span>
        </nav>
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold text-ink">Marketing — overview</h1>
          <p className="text-sm text-muted">Packages: SEO · Paid (Search/Social/Display/YouTube) · Content · CRO</p>
        </header>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/services/marketing/seo", title: "SEO", desc: "Technical, on-page, pSEO, Local, PR" },
            { href: "/services/marketing/paid", title: "Paid (bundle)", desc: "Search · Social · Display · YouTube" },
            { href: "/services/marketing/content", title: "Content", desc: "Calendar, topical maps, LPs" },
            { href: "/services/marketing/cro", title: "CRO", desc: "Hypotheses and A/B tests" },
          ].map((card) => (
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
