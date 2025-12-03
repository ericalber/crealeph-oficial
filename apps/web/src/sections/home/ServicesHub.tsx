import Link from "next/link";
import { HubIcon, type HubIconKey } from "./servicesHubIcons";

type Item = {
  title: string;
  href: string;
  desc: string;
  icon?: HubIconKey;
};

type ServicesHubProps = {
  items: Item[];
  ctaPrimaryHref: string;
  ctaSecondaryHref: string;
};

function slugifyLabel(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function ServicesHub({ items, ctaPrimaryHref, ctaSecondaryHref }: ServicesHubProps) {
  return (
    <section className="px-4 py-12" aria-labelledby="services-hub">
      <div className="mx-auto max-w-[1100px] px-6 py-12">
        <div className="rounded-2xl bg-white shadow-[0_12px_28px_rgba(0,0,0,0.12)] p-6 md:p-8">
          <div className="space-y-2">
            <h2 id="services-hub" className="text-[#0B0B0E] text-2xl md:text-3xl font-semibold">Build with a product first team</h2>
            <p className="text-[#0B0B0E]/80 text-sm md:text-base">Choose what you need now and extend modules as you grow.</p>
          </div>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {items.map((item) => {
              const um = `home.servicesHub.card.${slugifyLabel(item.title)}`;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-label={item.title}
                  data-um={um}
                  className="group block rounded-2xl border border-black/10 bg-white p-5 transition-transform duration-200 hover:-translate-y-[2px] hover:shadow-[0_12px_28px_rgba(214,40,40,0.18)] min-h-[140px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D62828] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#FFE3E3] flex items-center justify-center mb-3">
                    {item.icon ? (
                      <HubIcon name={item.icon} className="icon icon-6 text-[#0B0B0E]" />
                    ) : null}
                  </div>
                  <div className="text-[#0B0B0E] text-base md:text-lg font-semibold">{item.title}</div>
                  <div className="text-[#0B0B0E]/70 text-sm">{item.desc}</div>
                </Link>
              );
            })}
          </div>

          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href={ctaPrimaryHref} className="inline-flex h-10 items-center px-5 rounded-full bg-[#D62828] hover:bg-[#B91C1C] transition-transform duration-150 hover:scale-[1.02] active:scale-[0.99] text-white" aria-label="View Plans">
              View Plans
            </Link>
            <Link href={ctaSecondaryHref} className="inline-flex h-10 items-center px-5 rounded-full border border-[#0B0B0E]/20 hover:bg-[#0B0B0E]/5 text-[#0B0B0E]" aria-label="Enter Dashboard">
              Enter Dashboard
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
