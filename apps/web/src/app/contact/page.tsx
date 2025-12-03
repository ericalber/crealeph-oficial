import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { HeroLeadForm } from "@/components/forms/HeroLeadForm";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
import { SeeAlso } from "@/components/ui/SeeAlso";

export default function ContactPage() {
  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink/80 to-brand/30" />
        <div className="relative mx-auto grid min-h-[80vh] max-w-screen-xl grid-cols-1 items-center gap-12 px-4 py-24 lg:grid-cols-12 lg:px-8">
          <div className="space-y-6 lg:col-span-5">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
            <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
              Contact
            </span>
            <h1 className="text-h1 font-semibold leading-tight">
              Ready to map your next sprint?
            </h1>
            <p className="text-base text-white/70">
              Share goals, current pain points, and your target horizon. Within 24 business hours we send a proposal, suggested squad, and initial estimate.
              We can also schedule a free diagnosis to analyze your segment data with AQUA, Scout, and Market Twin™.
            </p>
            <div className="space-y-2 text-sm text-white/70">
              <p>📞 +55 11 99999-1234 · WhatsApp and phone</p>
              <p>✉️ contato@crealeph.com</p>
              <p>📍 Sao Paulo · Brasilia · Madrid (global remote coverage)</p>
              <p>🕘 Monday to Friday, 9am to 7pm (BRT)</p>
            </div>
          </div>
          <div className="lg:col-span-7">
            <HeroLeadForm />
          </div>
        </div>
      </section>

      <SectionSeparator />

      <section className="px-4 py-16">
        <div className="mx-auto grid max-w-screen-xl gap-8 lg:grid-cols-2 lg:px-8">
          <div className="rounded-[calc(var(--radius)*1.5)] border border-line bg-surface p-8 shadow-md">
            <h2 className="text-2xl font-semibold text-ink">Next steps</h2>
            <ol className="mt-4 space-y-2 text-sm text-muted">
              <li>1. Automatic confirmation with contact ETA.</li>
              <li>2. Free diagnosis using AQUA + Market Twin™ inputs.</li>
              <li>3. Alignment call to define squad, goals, and timeline.</li>
              <li>4. Formal proposal with investment and roadmap within 48h.</li>
            </ol>
          </div>
          <div className="rounded-[calc(var(--radius)*1.5)] border border-line bg-white p-8 shadow-md">
            <h2 className="text-2xl font-semibold text-ink">Support and developers</h2>
            <p className="mt-3 text-sm text-muted">
              Developers can access Bridge docs, generate keys, and open priority tickets in
              <a
                href="/developers?utm_source=contact&utm_campaign=cta-secondary"
                className="ml-1 text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
              >
                Developers
              </a>
              . For general questions, check our
              <a
                href="/resources/faq?utm_source=contact&utm_campaign=cta-secondary"
                className="ml-1 text-brand underline-offset-4 transition hover:text-brand-600 hover:underline"
              >
                FAQ
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <SeeAlso
        source="contact-see-also"
        items={[
          {
            title: "Services",
            description: "See the full package of sites, marketing, and automation.",
            href: "/services",
          },
          {
            title: "Modules",
            description: "Explore the plug-in intelligence modules.",
            href: "/modules/aqua",
          },
          {
            title: "Projects",
            description: "Case studies with real metrics.",
            href: "/projects",
          },
          {
            title: "Pricing",
            description: "Compare plans and find the best fit for your operation.",
            href: "/pricing",
          },
        ]}
      />
    </div>
  );
}
