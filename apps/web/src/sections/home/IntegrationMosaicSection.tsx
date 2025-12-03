import { Database, CreditCard, MessageSquare, Phone } from "lucide-react";

export function IntegrationMosaicSection() {
  const items = [
    { icon: CreditCard, label: "Stripe" },
    { icon: CreditCard, label: "PayPal" },
    { icon: Database, label: "Salesforce" },
    { icon: Database, label: "HubSpot" },
    { icon: MessageSquare, label: "Intercom" },
    { icon: Phone, label: "Twilio" },
  ];
  return (
    <section className="bg-transparent py-24">
      <div className="mx-auto max-w-screen-xl space-y-8 px-4 lg:px-8">
        <div className="theme-invert space-y-3">
          <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white">
            Integrações
          </span>
          <h2 className="text-h2 font-semibold text-white">Pluga com sua stack</h2>
          <p className="max-w-2xl text-white/75">
            Bridge conecta CRM, billing, chat e telefonia. Webhooks assinados, retries e observabilidade.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {items.map((item) => (
            <div
              key={item.label}
              className="theme-invert icon-row justify-center rounded-[--radius] border border-white/15 bg-white/5 p-4 text-white/90"
            >
              <item.icon size={16} aria-hidden className="icon" />
              <span className="text-sm">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
