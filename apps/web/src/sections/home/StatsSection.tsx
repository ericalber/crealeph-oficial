import { MetricCard } from "@/components/cards/MetricCard";

const metrics = [
  { value: "4.8", label: "Customer Rating" },
  { value: "450+", label: "Especialistas cuidando dos projetos" },
  { value: "100+", label: "Projetos concluídos com nossos clientes" },
];

export function StatsSection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto flex max-w-screen-xl flex-col items-center gap-10 px-4 text-center lg:px-8">
        <p className="max-w-2xl text-2xl font-semibold text-ink">
          25k+ clientes constroem, lançam e escalam mais rápido com as
          automações e frameworks da CreAleph.
        </p>
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
          {metrics.map((metric) => (
            <MetricCard
              key={metric.label}
              value={metric.value}
              label={metric.label}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
