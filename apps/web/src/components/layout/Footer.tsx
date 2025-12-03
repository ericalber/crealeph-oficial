"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Linkedin, Twitter, Instagram } from "lucide-react";
import { usePathname } from "next/navigation";

const productLinks = [
  { label: "Websites", href: "/services/websites" },
  { label: "Marketing", href: "/services/marketing" },
  { label: "Automação", href: "/services/automation" },
  { label: "Módulos", href: "/modules" },
  { label: "Dashboard", href: "/app" },
  { label: "Preços", href: "/pricing" },
];

const resourcesLinks = [
  { label: "Blog", href: "/resources/blog" },
  { label: "Guias", href: "/resources/guides" },
  { label: "FAQ", href: "/resources/faq" },
  { label: "Templates", href: "/resources/templates" },
];

const companyLinks = [
  { label: "Projetos", href: "/projects" },
  { label: "Indústrias", href: "/industries" },
  { label: "Contato", href: "/contact" },
  { label: "Trabalhe conosco", href: "/contact?utm_source=footer&utm_campaign=careers" },
];

const legalLinks = [
  { label: "Política de privacidade", href: "#" },
  { label: "Termos de uso", href: "#" },
  { label: "Cookies", href: "#" },
  { label: "LGPD", href: "#" },
];

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/app")) return null;
  return (
    <footer className="relative z-0 text-white bg-[#A4161A] before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#E02020]/90 before:to-[#A4161A]/70 before:pointer-events-none before:z-0">
      <div className="relative z-10 mx-auto grid max-w-screen-xl gap-12 px-4 py-16 sm:grid-cols-2 lg:grid-cols-[1.2fr_repeat(4,1fr)] lg:px-8">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <Image
              src="/CreAleph.PNG"
              alt="Logotipo CreAleph"
              width={44}
              height={44}
              className="h-11 w-11 rounded-full border border-white/20 object-cover"
            />
            <span className="text-xl font-semibold">CreAleph</span>
          </div>
          <p className="text-lg font-semibold leading-snug">
            Let’s Build What’s Next
          </p>
          <p className="text-sm text-white/70">
            Experiências digitais que aceleram negócios, conectam pessoas e
            ampliam resultados com inteligência e automação.
          </p>

          <div className="space-y-3">
            <span className="text-sm font-semibold text-white/80">
              Newsletter
            </span>
            <form className="flex flex-col gap-3 sm:flex-row">
              <label className="sr-only" htmlFor="newsletter-email">
                Email
              </label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="Enter your email address"
                className="h-11 flex-1 rounded-full border border-white/10 bg-white/5 px-5 text-sm text-white placeholder:text-white/50 focus:border-brand focus:outline-none"
                required
              />
              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand px-5 text-sm font-semibold text-white shadow-[var(--glow)] transition hover:bg-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <Mail size={16} aria-hidden />
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <Column title="Produto" links={productLinks} />
        <Column title="Recursos" links={resourcesLinks} />
        <Column title="Empresa" links={companyLinks} />
        <Column title="Legal" links={legalLinks} />
      </div>

      <div className="relative z-10 border-t border-white/10">
        <div className="relative z-10 mx-auto flex max-w-screen-xl flex-col gap-4 px-4 py-6 text-sm text-white/70 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>© 2025 TechAI Agency. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Terms &amp; Conditions
            </Link>
            <Link
              href="#"
              className="transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Privacy Policy
            </Link>
          </div>
          <div className="flex items-center gap-3 text-white/80">
            <Link
              href="#"
              aria-label="LinkedIn"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 transition hover:border-brand hover:text-white"
            >
              <Linkedin size={18} />
            </Link>
            <Link
              href="#"
              aria-label="Twitter"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 transition hover:border-brand hover:text-white"
            >
              <Twitter size={18} />
            </Link>
            <Link
              href="#"
              aria-label="Instagram"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 transition hover:border-brand hover:text-white"
            >
              <Instagram size={18} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

type ColumnProps = {
  title: string;
  links: { label: string; href: string }[];
};

function Column({ title, links }: ColumnProps) {
  return (
    <div className="space-y-5">
      <span className="text-base font-semibold text-white/90">{title}</span>
      <ul className="space-y-2 text-sm text-white/65">
       {links.map((link) => (
          <li key={`${title}-${link.label}`}>
            <Link
              href={`${link.href}${link.href.includes("?") ? "&" : "?"}utm_source=footer&utm_campaign=${encodeURIComponent(title.toLowerCase())}`}
              className="transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
