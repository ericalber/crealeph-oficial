type MetricCardProps = {
  value: string;
  label: string;
};

export function MetricCard({ value, label }: MetricCardProps) {
  return (
    <div className="relative rounded-[--radius] p-[1px] bg-gradient-to-r from-[hsl(var(--accent)/0.6)] via-[hsl(var(--accent-2)/0.4)] to-[hsl(var(--accent)/0.6)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <div className="rounded-[--radius] bg-[hsl(var(--card))]/80 p-6 text-[hsl(var(--card-foreground))] backdrop-blur-xl ring-1 ring-[var(--line)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_24px_rgba(0,0,0,0.12)]">
        <span className="text-4xl font-extrabold text-brand md:text-5xl">
          {value}
        </span>
        <p className="mt-2 text-base font-medium">{label}</p>
      </div>
      <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/12 to-transparent hover:animate-shine" />
    </div>
  );
}
