import Link from "next/link";
import { TechCard } from "@/components/ui/TechCard";

type SeeAlsoItem = {
  title: string;
  description: string;
  href: string;
};

type SeeAlsoProps = {
  items: SeeAlsoItem[];
  source: string;
};

export function SeeAlso({ items, source }: SeeAlsoProps) {
  return (
    <section aria-labelledby="see-also" className="py-16">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <h2 id="see-also" className="text-2xl font-bold text-ink sm:text-3xl">
            See also
          </h2>
          <span className="text-[11px] uppercase tracking-[0.3em] text-muted">
            Supplemental navigation
          </span>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <TechCard key={`${source}-${item.href}`}>
              <Link
                href={`${item.href}${item.href.includes("?") ? "&" : "?"}utm_source=${source}&utm_campaign=see-also`}
                aria-label={`Open ${item.title}`}
                className="block p-5 focus-visible:outline-none"
              >
                <h3 className="text-base font-semibold group-hover:text-brand">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">{item.description}</p>
                <span className="mt-4 inline-flex items-center text-sm font-semibold text-brand">
                  Explore →
                </span>
              </Link>
            </TechCard>
          ))}
        </div>
      </div>
    </section>
  );
}
