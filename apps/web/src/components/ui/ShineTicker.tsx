export function ShineTicker() {
  const Item = () => (
    <span className="mx-6 inline-flex shrink-0 items-baseline gap-2 whitespace-nowrap">
      <span className="font-extrabold text-white drop-shadow-[0_0_15px_rgba(255,255,255,.35)]">CREALEPH</span>
      <span className="font-bold text-ink drop-shadow-[0_0_12px_rgba(0,0,0,.15)]">INTELLIGENT MARKETING</span>
    </span>
  );
  return (
    <section aria-label="crealeph-mkt-ticker" className="relative isolate overflow-hidden py-10">
      {/* subtle shine overlay */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shine"
      />
      <div className="overflow-hidden">
        <div className="flex w-max animate-ticker will-change-transform [animation-duration:26s]">
          <div className="flex shrink-0 items-center gap-12 pr-12 text-2xl uppercase tracking-[0.2em] sm:text-3xl md:text-4xl">
            {Array.from({ length: 10 }).map((_, i) => (
              <Item key={`a-${i}`} />
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-12 pr-12 text-2xl uppercase tracking-[0.2em] sm:text-3xl md:text-4xl" aria-hidden="true">
            {Array.from({ length: 10 }).map((_, i) => (
              <Item key={`b-${i}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
