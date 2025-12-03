import { CTAButton } from "@/components/ui/CTAButton";

type BannerDarkProps = {
  title: string;
  subtitle?: string;
  primary: {
    label: string;
    href: string;
    ariaLabel: string;
    campaign: "cta-primary" | "cta-secondary" | "cta-ghost";
  };
  source: string;
};

export function BannerDark({ title, subtitle, primary, source }: BannerDarkProps) {
  return (
    <section className="bg-transparent px-4 py-16 text-center text-white">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6">
        <h2 className="text-4xl font-bold tracking-tight md:text-5xl">{title}</h2>
        {subtitle ? <p className="max-w-2xl text-sm text-white/70">{subtitle}</p> : null}
        <CTAButton
          href={primary.href}
          label={primary.label}
          ariaLabel={primary.ariaLabel}
          variant="ghost"
          source={source}
          campaign={primary.campaign}
        />
      </div>
    </section>
  );
}
