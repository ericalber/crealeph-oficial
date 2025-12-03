import Image from "next/image";

export function ProLeadForm() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute -inset-0.5 rounded-md bg-gradient-to-br from-white/10 to-white/0 blur-sm" />
      <form className="relative grid gap-3 rounded-md border border-white/15 bg-zinc-900/70 p-5 text-left text-white shadow-[0_18px_46px_rgba(0,0,0,.20)] backdrop-blur-md">
        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
          Request proposal
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
            Full name
            <input
              name="name"
              required
              autoComplete="name"
              placeholder="Your name"
              className="h-10 rounded-md border border-white/15 bg-black/30 px-3 text-sm text-white placeholder:text-white/40 focus:border-white focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
            E-mail
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="voce@empresa.com"
              className="h-10 rounded-md border border-white/15 bg-black/30 px-3 text-sm text-white placeholder:text-white/40 focus:border-white focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
            Company
            <input
              name="company"
              required
              placeholder="Company name"
              className="h-10 rounded-md border border-white/15 bg-black/30 px-3 text-sm text-white placeholder:text-white/40 focus:border-white focus:outline-none"
            />
          </label>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
            Phone
            <input
              name="phone"
              autoComplete="tel"
              placeholder="Country/area code + number"
              className="h-10 rounded-md border border-white/15 bg-black/30 px-3 text-sm text-white placeholder:text-white/40 focus:border-white focus:outline-none"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
              Size
              <select
                name="size"
                className="h-10 rounded-md border border-white/15 bg-black/30 px-3 text-sm text-white focus:border-white focus:outline-none"
              >
                <option className="bg-ink text-white" value="1-10">1–10</option>
                <option className="bg-ink text-white" value="11-50">11–50</option>
                <option className="bg-ink text-white" value="51-200">51–200</option>
                <option className="bg-ink text-white" value=">200">200+</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
              Budget
              <select
                name="budget"
                className="h-10 rounded-md border border-white/15 bg-black/30 px-3 text-sm text-white focus:border-white focus:outline-none"
              >
                <option className="bg-ink text-white" value="starter">Up to BRL 5k/mo</option>
                <option className="bg-ink text-white" value="pro">BRL 5k-15k/mo</option>
                <option className="bg-ink text-white" value="enterprise">15k+/mo</option>
              </select>
            </label>
          </div>
        </div>

        <label className="flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
          Website (optional)
          <input
            name="website"
            type="url"
            placeholder="https://yourcompany.com"
            className="h-10 rounded-md border border-white/15 bg-black/30 px-3 text-sm text-white placeholder:text-white/40 focus:border-white focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
          Main objective
          <textarea
            name="message"
            rows={3}
            placeholder="Share goals, timelines, and required integrations"
            className="rounded-md border border-white/15 bg-black/30 px-3 py-3 text-sm text-white placeholder:text-white/40 focus:border-white focus:outline-none"
          />
        </label>

        <button
          type="submit"
          className="mt-1 inline-flex h-11 items-center justify-center rounded-md bg-white px-5 text-sm font-semibold text-ink shadow-[var(--glow)] transition hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label="Request quote in 24h"
        >
          See demo with my data
        </button>

        <div className="flex items-center justify-between text-[11px] text-white/70">
          <span className="inline-flex items-center gap-1"><span aria-hidden>🔒</span> Dados seguros • LGPD</span>
          <span className="inline-flex items-center gap-1">★★★★★ <span className="text-white/50">Clientes satisfeitos</span></span>
        </div>
      </form>
    </div>
  );
}
