import Link from "next/link";
import clsx from "clsx";

type PromoCardProps = {
  pill: string;
  title: string;
  description: string;
  href?: string;
};

export function PromoCard({ pill, title, description, href }: PromoCardProps) {
  const content = (
    <div
      className={clsx(
        "group relative overflow-hidden rounded-[--radius] p-[1px]",
        "bg-gradient-to-r from-[hsl(var(--accent)/0.6)] via-[hsl(var(--accent-2)/0.4)] to-[hsl(var(--accent)/0.6)]",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
      )}
    >
      <span className="absolute left-4 top-4 z-10 inline-flex items-center rounded-full bg-brand/10 px-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
        {pill}
      </span>

      <div className="relative flex h-full flex-col gap-4 rounded-[--radius] bg-[hsl(var(--card))]/80 px-6 pb-6 pt-16 text-[hsl(var(--card-foreground))] backdrop-blur-xl ring-1 ring-[var(--line)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_24px_rgba(0,0,0,0.12)]">
        <h3 className="text-[22px] font-semibold transition-colors group-hover:text-brand">
          {title}
        </h3>
        <p className="text-[15px] leading-6 text-[hsl(var(--muted-foreground))]">{description}</p>
        {href ? (
          <span className="mt-auto inline-flex h-9 items-center text-sm font-medium text-brand transition group-hover:text-brand-600">
            Saiba mais &rarr;
          </span>
        ) : null}
      </div>
      <span className="pointer-events-none absolute right-0 top-0 h-full w-[3px] bg-gradient-to-b from-brand to-brand-600 opacity-60 transition-opacity group-hover:opacity-100" />
      <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/15 to-transparent group-hover:animate-shine" />
    </div>
  );

  if (!href) {
    return content;
  }

  return <Link href={href}>{content}</Link>;
}
