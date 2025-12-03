import React from "react";
import Link from "next/link";

export type Crumb = { label: string; href?: string };

export const Breadcrumbs: React.FC<{ items: Crumb[] }> = ({ items }) => {
  return (
    <div className="mb-3 text-sm text-zinc-600">
      {items.map((c, i) => (
        <span key={i}>
          {c.href ? <Link className="hover:underline" href={c.href}>{c.label}</Link> : <span>{c.label}</span>}
          {i < items.length - 1 ? " / " : ""}
        </span>
      ))}
    </div>
  );
};

