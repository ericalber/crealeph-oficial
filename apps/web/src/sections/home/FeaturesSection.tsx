import { PromoCard } from "@/components/cards/PromoCard";
import { TechSection } from "@/components/ui/TechSection";
import { TechCard } from "@/components/ui/TechCard";

const services = [
  {
    pill: "Product Strategy",
    title: "Product Strategy",
    description:
      "Strategic planning to validate and launch digital ideas with safety and speed.",
  },
  {
    pill: "UI/UX Design",
    title: "UI/UX Design",
    description:
      "User-centered experiences that drive engagement and conversion.",
  },
  {
    pill: "App Development",
    title: "App Development",
    description:
      "Scalable, modern apps built with leading technologies.",
  },
  {
    pill: "Cloud & DevOps",
    title: "Cloud & DevOps",
    description:
      "From code to deploy: reliable pipelines and continuous delivery without friction.",
  },
];

export function FeaturesSection() {
  return (
    <TechSection className="bg-transparent py-20">
      <div className="mx-auto flex max-w-screen-xl flex-col gap-12 px-4 lg:flex-row lg:items-end lg:justify-between lg:px-8">
        <div className="theme-invert max-w-xl space-y-4">
          <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white">
            Differentials
          </span>
          <h2 className="text-h2 font-semibold">Why CreAleph</h2>
          <p className="text-base text-white/75">
            Operation built on real data, fast squads, and integrations that
            reduce friction. We connect strategy, UX, and engineering to deliver
            performance with predictability.
          </p>
        </div>
        <p className="max-w-sm text-sm text-white/80">
          From immersion to launch, everything is traceable in the dashboard with SLAs and rituals that keep continuous evolution moving.
        </p>
      </div>

      <div className="mx-auto grid max-w-screen-xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {services.map((service) => (
          <TechCard key={service.title}>
            <div className="p-6">
              <span className="inline-flex items-center rounded-full bg-[hsl(var(--accent)/0.15)] px-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[hsl(var(--accent))]">
                {service.pill}
              </span>
              <h3 className="mt-4 text-[22px] font-semibold text-brand">{service.title}</h3>
              <p className="mt-2 text-[15px] leading-6 text-[hsl(var(--muted-foreground))]">{service.description}</p>
            </div>
          </TechCard>
        ))}
      </div>
    </TechSection>
  );
}
