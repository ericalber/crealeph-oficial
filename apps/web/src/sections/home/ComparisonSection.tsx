export function ComparisonSection() {
  const rows = [
    {
      label: "Velocidade de entrega (primeiro entregável)",
      crealeph: "Até 24h úteis",
      agency: "1–3 semanas",
      freelancer: "Variável",
      tool: "Você monta sozinho",
    },
    {
      label: "Dados de mercado (AQUA, Scout, Market Twin™)",
      crealeph: "Incluso (módulos)",
      agency: "Parcial/terceiros",
      freelancer: "Não",
      tool: "Não",
    },
    {
      label: "Automação e integrações (Bridge)",
      crealeph: "Nativo",
      agency: "Sob demanda",
      freelancer: "Limitado",
      tool: "Não",
    },
    {
      label: "SLA e governança (LGPD, auditoria)",
      crealeph: "Definidos",
      agency: "Parcial",
      freelancer: "Não",
      tool: "Não",
    },
    {
      label: "ROI e relatórios claros",
      crealeph: "Dashboard /app",
      agency: "Relatórios manuais",
      freelancer: "Pontual",
      tool: "Não",
    },
  ];

  return (
    <section className="bg-transparent py-24">
      <div className="mx-auto max-w-screen-xl space-y-8 px-4 lg:px-8">
        <div className="theme-invert space-y-3">
          <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white">
            Comparativo
          </span>
          <h2 className="text-h2 font-semibold text-white">CreAleph vs alternativas</h2>
          <p className="max-w-2xl text-white/75">
            Entenda rapidamente o que muda na sua operação ao escolher squads
            conectados a dados, automação e SLAs claros.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="text-xs uppercase tracking-[0.2em] text-white/70">
              <tr>
                <th className="border-b border-white/15 px-4 py-3">Critério</th>
                <th className="border-b border-white/15 px-4 py-3 text-brand">CreAleph</th>
                <th className="border-b border-white/15 px-4 py-3">Agência genérica</th>
                <th className="border-b border-white/15 px-4 py-3">Freelancer</th>
                <th className="border-b border-white/15 px-4 py-3">Ferramenta pura</th>
              </tr>
            </thead>
            <tbody className="text-sm text-white/85">
              {rows.map((row) => (
                <tr key={`${row.label}-${row.crealeph}-${row.agency}-${row.freelancer}-${row.tool}`} className="hover:bg-white/5">
                  <td className="border-b border-white/10 px-4 py-3">{row.label}</td>
                  <td className="border-b border-white/10 px-4 py-3 font-semibold text-brand">{row.crealeph}</td>
                  <td className="border-b border-white/10 px-4 py-3">{row.agency}</td>
                  <td className="border-b border-white/10 px-4 py-3">{row.freelancer}</td>
                  <td className="border-b border-white/10 px-4 py-3">{row.tool}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
