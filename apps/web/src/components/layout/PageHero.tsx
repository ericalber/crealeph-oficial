import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CTAButton } from "@/components/ui/CTAButton";

type HeroCta = {
  label: string;
  href: string;
  ariaLabel: string;
  variant?: "primary" | "secondary" | "ghost";
  campaign: "cta-primary" | "cta-secondary" | "cta-ghost";
};

type PageHeroProps = {
  breadcrumbs: { label: string; href?: string }[];
  title: string;
  subtitle: string;
  body: string;
  ctas: HeroCta[];
  source: string;
};

export function PageHero({
  breadcrumbs,
  title,
  subtitle,
  body,
  ctas,
  source,
}: PageHeroProps) {
  return (
    <section className="bg-ink text-white">
      <div className="mx-auto flex max-w-screen-xl flex-col gap-8 px-4 py-20 lg:px-8">
        <Breadcrumbs items={breadcrumbs} />
        <div className="space-y-4">
          <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
            {subtitle}
          </span>
          <h1 className="text-h1 font-semibold leading-tight">{title}</h1>
          <p className="max-w-3xl text-base text-white/70">{body}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {ctas.map((cta) => (
            <CTAButton
              key={cta.label}
              href={cta.href}
              label={cta.label}
              ariaLabel={cta.ariaLabel}
              variant={cta.variant}
              source={source}
              campaign={cta.campaign}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
