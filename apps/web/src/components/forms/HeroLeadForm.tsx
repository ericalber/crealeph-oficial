export function HeroLeadForm() {
  return (
    <form className="grid gap-4 rounded-2xl border border-white/10 bg-white/10 p-6 text-left text-white shadow-[0_18px_46px_rgba(0,0,0,.20)] backdrop-blur-md">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
          Full name
          <input
            name="name"
            required
            autoComplete="name"
            placeholder="Your name"
            className="h-11 rounded-[--radius] border border-white/15 bg-white/10 px-4 text-sm text-white placeholder:text-white/40 focus:border-brand focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
          E-mail
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="voce@empresa.com"
            className="h-11 rounded-[--radius] border border-white/15 bg-white/10 px-4 text-sm text-white placeholder:text-white/40 focus:border-brand focus:outline-none"
          />
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
          Phone
          <input
            name="phone"
            required
            autoComplete="tel"
            placeholder="Country/area code + number"
            className="h-11 rounded-[--radius] border border-white/15 bg-white/10 px-4 text-sm text-white placeholder:text-white/40 focus:border-brand focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
          Service
          <select
            name="service"
            className="h-11 rounded-[--radius] border border-white/15 bg-white/10 px-4 text-sm text-white focus:border-brand focus:outline-none"
          >
            <option value="websites">Website builds</option>
            <option value="marketing">Intelligent marketing</option>
            <option value="automation">Operational automation</option>
            <option value="modules">Intelligence modules</option>
          </select>
        </label>
      </div>
      <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
        City
        <input
          name="city"
          placeholder="City / State"
          autoComplete="address-level2"
          className="h-11 rounded-[--radius] border border-white/15 bg-white/10 px-4 text-sm text-white placeholder:text-white/40 focus:border-brand focus:outline-none"
        />
      </label>
      <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
        Message
        <textarea
          name="message"
          rows={3}
          placeholder="Tell us the challenge, timelines, and goals..."
          className="rounded-[--radius] border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-brand focus:outline-none"
        />
      </label>
      <button
        type="submit"
        className="mt-2 inline-flex h-12 items-center justify-center rounded-full bg-brand px-6 text-sm font-semibold text-white shadow-[var(--glow)] transition hover:bg-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        aria-label="Request quote in 24h"
      >
        Request quote in 24h
      </button>
      <p className="flex items-center gap-2 text-xs text-white/60">
        <span aria-hidden="true">🔒</span> Your data is secure and we do not share it with third parties.
      </p>
    </form>
  );
}
