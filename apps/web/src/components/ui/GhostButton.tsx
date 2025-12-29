"use client";

import React, { ButtonHTMLAttributes, ReactElement } from "react";
import clsx from "clsx";

type GhostButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  children: React.ReactNode;
};

export function GhostButton({ asChild = false, children, className, ...rest }: GhostButtonProps) {
  const base =
    "inline-flex h-9 items-center justify-center rounded-[var(--radius-sm)] border px-3 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]";
  const merged = clsx(base, className);

  if (asChild && React.isValidElement(children)) {
    const child = children as ReactElement<any>;
    return React.cloneElement(child, {
      className: clsx(child.props.className, merged),
      ...rest,
    });
  }

  return (
    <button {...rest} className={merged} style={{ borderColor: "var(--line)" }}>
      {children}
    </button>
  );
}
