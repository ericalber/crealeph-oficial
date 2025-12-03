type DarkCardProps = {
  title: string;
  items: string[];
};

export function DarkCard({ title, items }: DarkCardProps) {
  return (
    <div className="relative rounded-[--radius] p-[1px] bg-gradient-to-r from-[hsl(var(--accent)/0.5)] via-[hsl(var(--accent-2)/0.4)] to-[hsl(var(--accent)/0.5)]">
      <div className="rounded-[--radius] bg-black/40 p-6 text-white backdrop-blur-xl ring-1 ring-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_12px_34px_rgba(0,0,0,0.25)]">
        <h3 className="text-[20px] font-semibold">{title}</h3>
        <ul className="mt-4 space-y-1 text-sm text-white/80">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/12 to-transparent hover:animate-shine" />
    </div>
  );
}
