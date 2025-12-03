"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useState } from "react";

type MicroCTAStickyProps = {
  label?: string;
  href?: string;
};

export function MicroCTASticky({
  label = "Request Demo",
  href = "/contact",
}: MicroCTAStickyProps) {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <div className="fixed bottom-20 left-0 right-0 z-40 mx-auto w-[min(92%,840px)]">
      <div className="mx-3 flex items-center justify-between gap-3 rounded-md border border-white/10 bg-black/90 px-3 py-2 text-white shadow-[0_10px_30px_rgba(0,0,0,.25)] backdrop-blur-md">
        <span className="text-sm">Ready to see it with your data?</span>
        <div className="flex items-center gap-2">
          <Link
            href={`${href}?utm_source=micro-cta&utm_campaign=sticky`}
            className="inline-flex h-9 items-center justify-center rounded-md bg-brand px-4 text-sm font-semibold text-white transition hover:bg-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {label}
          </Link>
          <button
            aria-label="Close notice"
            onClick={() => setOpen(false)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/20 text-white/80 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
