type MiniQuoteFormProps = {
  context: string;
};

export function MiniQuoteForm({ context }: MiniQuoteFormProps) {
  return (
    <form className="grid gap-4 rounded-[--radius] border border-line bg-white p-5 shadow-md">
      <legend className="text-sm font-semibold uppercase tracking-[0.3em] text-brand">
        {context}
      </legend>
      <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
        Name
        <input
          name="name"
          required
          placeholder="Your name"
          className="h-11 rounded-[--radius] border border-line px-4 text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none"
        />
      </label>
      <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
        E-mail
        <input
          name="email"
          type="email"
          required
          placeholder="voce@empresa.com"
          className="h-11 rounded-[--radius] border border-line px-4 text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none"
        />
      </label>
      <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
        Message
        <textarea
          name="message"
          rows={3}
          placeholder="Describe the scope"
          className="rounded-[--radius] border border-line px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none"
        />
      </label>
      <button
        type="submit"
        className="inline-flex h-11 items-center justify-center rounded-full bg-brand px-5 text-sm font-semibold text-white shadow-[var(--glow)] transition hover:bg-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        aria-label="Request quick quote"
      >
        Request quote
      </button>
    </form>
  );
}
