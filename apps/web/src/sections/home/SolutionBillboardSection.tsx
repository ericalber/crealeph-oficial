import { CTAButton } from "@/components/ui/CTAButton";

export function SolutionBillboardSection() {
  return (
    <section className="bg-transparent py-24">
      <div className="mx-auto max-w-screen-xl rounded-[calc(var(--radius)*1.5)] border border-white/15 bg-white/5 px-6 py-16 text-center shadow-[var(--shadow-lg)] backdrop-blur-sm lg:px-8">
        <div className="theme-invert mx-auto max-w-3xl space-y-4">
          <h2 className="text-h2 font-semibold text-white">
            Uma operação que aprende e melhora toda semana
          </h2>
          <p className="text-white/80">
            AQUA + Scout escrevem melhor copy. Market Twin™ ajusta preços por
            região. Bridge integra CRM, billing e squads. Tudo com SLAs e
            dashboards claros.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <CTAButton
              href="/contact"
              label="Solicitar orçamento"
              ariaLabel="Solicitar orçamento"
              source="solution-billboard"
              campaign="cta-primary"
            />
            <CTAButton
              href="/modules/aqua"
              label="Ver módulos"
              ariaLabel="Ver módulos CreAleph"
              variant="ghost"
              source="solution-billboard"
              campaign="cta-secondary"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

