const plans = [
  {
    name: "Starter",
    price: "USD 4,900/mo",
    description: "For local operations that need a modular site and managed media.",
    features: [
      "Modular website (up to 8 pages)",
      "Managed Google & Meta campaigns",
      "Access to AQUA Insights",
      "Automated weekly reports",
    ],
  },
  {
    name: "Pro",
    price: "USD 8,900/mo",
    description: "For multi-location teams that need velocity and visibility.",
    featured: true,
    features: [
      "Unlimited landing pages",
      "Scout + Market Twin™ included",
      "Dedicated CRO and automation squad",
      "/app dashboard with up to 10 seats",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom quote",
    description: "For national networks and regulated industries.",
    features: [
      "Custom projects in the CMS/tool of your choice",
      "Advanced integrations via Bridge",
      "24/7 support and continuous innovation squad",
      "Unlimited InsightScore™",
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
            Pricing for momentum
          </h2>
          <p className="text-base text-muted">
            No surprises. Pick the plan that matches your stage and scale with clear SLAs.
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
              className={`flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)] ${plan.featured ? "border-brand" : ""}`}
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
