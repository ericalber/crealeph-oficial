import { Shield, FileCheck, Lock, KeyRound } from "lucide-react";

export function SecurityComplianceSection() {
  const items = [
    { icon: Shield, title: "LGPD & governança", desc: "Políticas, DPA e controle de acessos com auditoria." },
    { icon: FileCheck, title: "Logs & observabilidade", desc: "Métricas, tracing e retenção segura de eventos." },
    { icon: Lock, title: "Criptografia", desc: "Em trânsito (TLS) e em repouso, com rotação de chaves." },
    { icon: KeyRound, title: "Assinatura HMAC", desc: "Webhooks com verificação, retries exponenciais." },
  ];
  return (
    <section className="bg-transparent py-24">
      <div className="mx-auto max-w-screen-xl space-y-8 px-4 lg:px-8">
        <div className="theme-invert space-y-3">
          <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white">
            Segurança & compliance
          </span>
          <h2 className="text-h2 font-semibold text-white">Confiança por padrão</h2>
          <p className="max-w-2xl text-white/75">
            Arquitetura pensada para setores regulados. Integrações seguras com Bridge e governança por função.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {items.map((i) => (
            <div key={i.title} className="theme-invert rounded-[--radius] border border-white/15 bg-white/5 p-6 text-white/90">
              <div className="flex items-center gap-2 text-white">
                <i.icon size={18} />
                <span className="text-sm font-semibold">{i.title}</span>
              </div>
              <p className="mt-2 text-sm text-white/75">{i.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

