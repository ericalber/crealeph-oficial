"use client";

import clsx from "clsx";
import Link from "next/link";

type TechCTAProps = {
  href: string;
  label: string;
  ariaLabel: string;
  source: string;
  campaign: string;
  className?: string;
  variant?: "accent" | "brand";
};

export function TechCTA({ href, label, ariaLabel, source, campaign, className, variant = "accent" }: TechCTAProps) {
  const url = buildTrackedUrl(href, source, campaign);
  const baseGradient =
    variant === "brand"
      ? "bg-gradient-to-r from-[#A4161A] via-[#E02020] to-[#A4161A]"
      : "bg-gradient-to-r from-[hsl(var(--accent))] via-[hsl(var(--accent-2))] to-[hsl(var(--accent))]";
  return (
    <Link
      href={url}
      aria-label={ariaLabel}
      className={clsx(
        "group relative inline-flex h-11 items-center justify-center gap-2 overflow-hidden rounded-full px-6 text-sm font-semibold",
        "text-white",
        baseGradient,
        // Subtle ring for contrast AA
        "ring-1 ring-white/20",
        // Hover/focus depth
        "shadow-[0_12px_34px_rgba(0,0,0,.25)] hover:shadow-[0_18px_44px_rgba(0,0,0,.32)]",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--accent))]",
        className,
      )}
    >
      <span className="relative z-10">{label}</span>
      {/* Shine sweep */}
      <span
        aria-hidden
        className={clsx(
          "pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg]",
          "bg-gradient-to-r from-transparent via-white/35 to-transparent",
          "group-hover:animate-shine",
        )}
      />
    </Link>
  );
}

function buildTrackedUrl(href: string, source: string, campaign: string) {
  try {
    const url = new URL(href, "https://example.com");
    url.searchParams.set("utm_source", source);
    url.searchParams.set("utm_campaign", campaign);
    const tracked =
      href.startsWith("http") || href.startsWith("https")
        ? url.toString()
        : `${href}${href.includes("?") ? "&" : "?"}utm_source=${source}&utm_campaign=${campaign}`;
    return tracked;
  } catch {
    return href;
  }
}
