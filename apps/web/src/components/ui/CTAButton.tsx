"use client";

import Link from "next/link";
import clsx from "clsx";

type CTAButtonProps = {
  href: string;
  label: string;
  ariaLabel: string;
  variant?: "primary" | "secondary" | "ghost" | "contrast";
  source: string;
  campaign: "cta-primary" | "cta-secondary" | "cta-ghost";
  className?: string;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

const variantStyles = {
  primary:
    "bg-[#E02020] hover:bg-[#A4161A] text-white shadow-[0_0_0_1px_rgba(224,32,32,.25),0_8px_24px_rgba(224,32,32,.20)] focus-visible:outline-[#E02020]",
  secondary:
    "border border-[#E02020] text-[#E02020] hover:border-[#A4161A] hover:text-[#A4161A] focus-visible:outline-[#E02020]",
  ghost:
    "border border-white/30 text-white/80 hover:border-white hover:text-white focus-visible:outline-white",
  contrast:
    "bg-white text-ink hover:bg-white/90 shadow-[0_8px_24px_rgba(0,0,0,.12)] focus-visible:outline-white",
};

export function CTAButton({
  href,
  label,
  ariaLabel,
  variant = "primary",
  source,
  campaign,
  className,
  children,
  onClick,
}: CTAButtonProps) {
  const url = buildTrackedUrl(href, source, campaign);
  return (
    <Link
      href={url}
      aria-label={ariaLabel}
      onClick={onClick}
      className={clsx(
        "inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        variantStyles[variant],
        className,
      )}
    >
      {children ?? label}
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
