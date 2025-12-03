"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Crumb = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: Crumb[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Caminho de navegação"
      className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted"
    >
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-2">
          {item.href ? (
            <Link
              href={`${item.href}?utm_source=breadcrumb&utm_campaign=navigation`}
              className="transition hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-ink">{item.label}</span>
          )}
          {index < items.length - 1 ? (
            <ChevronRight size={12} aria-hidden className="icon text-line" />
          ) : null}
        </span>
      ))}
    </nav>
  );
}
