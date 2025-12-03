import Link from "next/link";
import type { Module } from "@/content/modules";
import { ModuleIcon } from "./icons";

export function ModuleCard({ mod }: { mod: Module }) {
  const tag = mod.tags[0] ?? mod.category;
  return (
    <article className="flex h-full flex-col justify-between rounded-2xl border border-black/10 bg-white p-5 shadow-[0_12px_28px_rgba(0,0,0,0.12)]">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFE3E3]">
            <ModuleIcon name={mod.icon} className="h-6 w-6 text-[#0B0B0E]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#0B0B0E]/60">
              {mod.category}
            </span>
            <h3 className="text-lg font-semibold text-[#0B0B0E]">{mod.title}</h3>
          </div>
        </div>
        <p className="text-sm text-[#0B0B0E]/75 line-clamp-2">{mod.summary}</p>
        <div className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0B0B0E]/70">
          <span className="rounded-full bg-black/5 px-3 py-1">{mod.category}</span>
          {tag ? <span className="rounded-full bg-black/5 px-3 py-1">{tag}</span> : null}
        </div>
        <ul className="space-y-1 text-sm text-[#0B0B0E]/75">
          {mod.outcomes.slice(0, 3).map((item, index) => (
            <li key={`${mod.slug}-${index}`} className="flex items-start gap-2">
              <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-[#D62828]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold text-[#D62828]">
        <Link
          href={mod.href}
          className="link-cta"
          aria-label={`View ${mod.title}`}
        >
          View module →
        </Link>
        <Link
          href="/contact"
          data-um={`modules.card.${mod.slug}.demo`}
          className="link-cta"
        >
          Request demo →
        </Link>
      </div>
    </article>
  );
}
