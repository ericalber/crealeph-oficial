export function MetricStripSection() {
  const metrics = [
    { value: "24h", label: "1º entregável" },
    { value: "+37%", label: "Aprovação média" },
    { value: "↓12%", label: "CPL em 60 dias" },
    { value: "99,9%", label: "SLA Bridge" },
  ];

  return (
    <section className="bg-transparent py-12">
      <div className="mx-auto grid max-w-screen-xl grid-cols-2 gap-6 px-4 text-center text-white lg:grid-cols-4 lg:px-8">
        {metrics.map((m) => (
          <div
            key={`${m.label}-${m.value}`}
            className="rounded-[--radius] border border-white/15 bg-white/5 p-6 shadow-sm"
          >
            <p className="text-3xl font-semibold">{m.value}</p>
            <p className="mt-1 text-sm text-white/75">{m.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
