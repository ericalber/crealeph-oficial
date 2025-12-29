"use client";

export function ShineTicker() {
  const maskStyle = {
    maskImage: "linear-gradient(90deg, transparent, black 15%, black 85%, transparent)",
    WebkitMaskImage: "linear-gradient(90deg, transparent, black 15%, black 85%, transparent)",
  };

  const Item = () => (
    <span className="mx-6 inline-flex shrink-0 items-baseline gap-2 whitespace-nowrap drop-shadow-[0_0_18px_rgba(0,0,0,0.35)]">
      <span className="font-extrabold text-white drop-shadow-[0_0_18px_rgba(255,255,255,.45)]">CREALEPH</span>
      <span className="font-bold text-white drop-shadow-[0_0_18px_rgba(0,0,0,.35)]">INTELLIGENT MARKETING</span>
    </span>
  );

  return (
    <section aria-label="crealeph-mkt-ticker" className="relative isolate overflow-hidden bg-[var(--gradient-brand-charcoal)] py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(255,255,255,0.08),transparent_32%),radial-gradient(circle_at_90%_10%,rgba(224,32,32,0.18),transparent_36%)] opacity-70" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.55),transparent,rgba(0,0,0,0.55))]" />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shine"
      />
      <div className="overflow-hidden">
        <div className="flex w-max animate-ticker will-change-transform [animation-duration:26s]" style={maskStyle}>
          <div className="flex shrink-0 items-center gap-12 pr-12 text-2xl uppercase tracking-[0.22em] text-white sm:text-3xl md:text-4xl">
            {Array.from({ length: 10 }).map((_, i) => (
              <Item key={`a-${i}`} />
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-12 pr-12 text-2xl uppercase tracking-[0.22em] text-white sm:text-3xl md:text-4xl" aria-hidden="true">
            {Array.from({ length: 10 }).map((_, i) => (
              <Item key={`b-${i}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
