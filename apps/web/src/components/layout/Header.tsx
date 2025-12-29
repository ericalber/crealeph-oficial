"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Modules", href: "/modules" },
  { label: "Industries", href: "/industries" },
  { label: "Projects", href: "/projects" },
  { label: "Resources", href: "/resources" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
] as const;

const servicesSub = [
  { label: "Websites", href: "/services/websites" },
  { label: "Marketing", href: "/services/marketing" },
  { label: "Automation", href: "/services/automation" },
  { label: "View all", href: "/services" },
] as const;

const marketingSub = [
  { label: "SEO", href: "/services/marketing/seo" },
  { label: "Content", href: "/services/marketing/content" },
  { label: "CRO", href: "/services/marketing/cro" },
  { label: "Paid (bundled)", href: "/services/marketing/paid" },
] as const;

const modulesSub = [
  { label: "AQUA", href: "/modules/aqua" },
  { label: "Scout", href: "/modules/scout" },
  { label: "InsightScore", href: "/modules/insightscore" },
  { label: "Market Twin", href: "/modules/market-twin" },
  { label: "Pricing", href: "/modules/pricing" },
  { label: "Bridge", href: "/modules/bridge" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/app");
  if (pathname?.startsWith("/app")) {
    return (
      <header
        className={clsx(
          "sticky top-0 z-[1000] w-full border-b border-white/10 backdrop-blur-xl transition-colors duration-300",
          "bg-[#0F0F12]/85"
        )}
      >
        <div className="mx-auto flex h-[72px] max-w-[1300px] items-center justify-between px-6">
          <Link href="/app" className="flex items-center gap-2">
            <Image src="/CreAleph.PNG" alt="CreAleph" width={32} height={32} className="h-8 w-8 rounded-full object-cover" priority />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/sign-out"
              className="rounded-full bg-[#D62828] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#B91C1C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Sign out
            </Link>
          </div>
        </div>
      </header>
    );
  }
  return (
    <header
      className={clsx(
        "sticky top-0 z-[1000] w-full border-b border-white/10 backdrop-blur-xl transition-colors duration-300",
        "bg-[#0F0F12]/85"
      )}
    >
      <div className="mx-auto max-w-[1300px] px-6 flex items-center justify-between h-[72px]">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/CreAleph.PNG" alt="CreAleph" width={32} height={32} className="h-8 w-8 rounded-full object-cover" priority />
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-white/85">
          {navItems.map((item) => {
            if (item.label === "Services") {
              return (
                <div key={item.href} className="relative group">
                  <Link
                    href={item.href}
                    className="transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    {item.label}
                  </Link>
                  <div
                    className="
                      absolute top-full left-0 mt-3
                      opacity-0 invisible translate-y-1
                      group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                      transition-all duration-150
                      z-[60]
                      bg-[#0B0B0E]
                      border border-white/10
                      rounded-xl
                      shadow-xl
                      w-56
                      py-3
                      pointer-events-auto
                    "
                  >
                    <div className="flex flex-col gap-2">
                      {servicesSub.map((s) => (
                        <Link
                          key={s.href}
                          href={s.href}
                          className="px-3 py-2 text-white/85 transition hover:text-white"
                        >
                          {s.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }
            if (item.label === "Modules") {
              return (
                <div key={item.href} className="relative group">
                  <Link
                    href={item.href}
                    className="transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    {item.label}
                  </Link>
                  <div
                    className="
                      absolute top-full left-0 mt-3
                      opacity-0 invisible translate-y-1
                      group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                      transition-all duration-150
                      z-[60]
                      bg-[#0B0B0E]
                      border border-white/10
                      rounded-xl
                      shadow-xl
                      w-56
                      py-3
                      pointer-events-auto
                    "
                  >
                    <div className="flex flex-col gap-2">
                      {modulesSub.map((m) => (
                        <Link
                          key={m.href}
                          href={m.href}
                          className="px-3 py-2 text-white/85 transition hover:text-white"
                        >
                          {m.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                className="transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/sign-in"
            className="text-sm font-semibold text-white/85 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Sign in
          </Link>
          <Link
            href="/pricing"
            className="
              rounded-full
              bg-[#D62828]
              hover:bg-[#B91C1C]
              px-5 py-2
              text-sm font-semibold
              text-white
              transition
            "
          >
            View plans
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-white md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open ? (
        <div className="md:hidden bg-[#0B0B0E] border-t border-white/10 z-[2000]">
          <nav className="flex flex-col gap-2 px-6 py-4 text-sm font-medium text-white/85">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-2 py-2 transition hover:bg-white/10 hover:text-white"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/sign-in"
              className="rounded-md px-2 py-2 transition hover:bg-white/10 hover:text-white"
              onClick={() => setOpen(false)}
            >
              Sign in
            </Link>
            <Link
              href="/pricing"
              className="
                mt-3
                rounded-full
                bg-[#D62828]
                hover:bg-[#B91C1C]
                px-5 py-2
                text-sm font-semibold
                transition
                text-white
                text-center
              "
              onClick={() => setOpen(false)}
            >
              View plans
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
