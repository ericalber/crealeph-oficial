const plans = [
  {
    name: "Basic",
    price: "$19/Month",
    description: "Perfect for startups & small websites",
    features: [
      "1 Website",
      "Basic Keyword Research",
      "Monthly SEO Audit",
      "5 Keywords Tracked",
      "Standard Reporting",
    ],
  },
  {
    name: "Standard",
    price: "$49/Month",
    description: "Best for growing businesses",
    featured: true,
    features: [
      "5 Websites",
      "In-depth Keyword Analysis",
      "On-page Optimization",
      "20 Keywords Tracked",
      "Performance Report",
    ],
  },
  {
    name: "Premium",
    price: "$99/Month",
    description: "All-in SEO solution for scale",
    features: [
      "Unlimited Websites",
      "Full Technical SEO",
      "Competitor Analysis",
      "50+ Keywords Tracked",
      "Dedicated SEO Manager",
    ],
  },
];

export function PricingSection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <span className="inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand">
            Simple & Transparent
          </span>
          <h2 className="text-h2 font-semibold text-ink">
            Flexible Pricing Plans
          </h2>
          <p className="text-base text-muted">
            No surprises: escolha o plano que combina com o estágio do seu
            produto e evolua conforme precisar escalar.
          </p>
        </div>

        <div className="mt-12 flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-muted">
          <span>Monthly</span>
          <span className="inline-flex h-6 w-12 items-center rounded-full bg-brand/20 p-1">
            <span className="h-4 w-4 rounded-full bg-brand" />
          </span>
          <span>Yearly</span>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`flex h-full flex-col rounded-[--radius] border border-line bg-surface p-6 transition hover:shadow-lg ${plan.featured ? "border-brand shadow-[var(--shadow-lg)]" : ""}`}
            >
              <div className="space-y-3">
                <span className="text-sm font-semibold uppercase tracking-[0.3em] text-brand">
                  {plan.name}
                </span>
                <h3 className="text-2xl font-semibold text-ink">
                  {plan.price}
                </h3>
                <p className="text-sm text-muted">{plan.description}</p>
              </div>
              <ul className="mt-6 flex flex-1 flex-col gap-2 text-sm text-ink">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <span className="inline-flex h-2 w-2 rounded-full bg-brand" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <a
                href="/contact"
                className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-brand px-4 text-sm font-semibold text-white shadow-[var(--glow)] transition hover:bg-brand-600"
              >
                Buy This Plan
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
