"use client";

import { useEffect, useMemo, useState } from "react";

export function isShineOn(): boolean {
  const base = process.env.NEXT_PUBLIC_FEATURE_UI_SHINE === "true";
  if (typeof window === "undefined") return base;
  // Dev overrides only
  if (process.env.NODE_ENV !== "production") {
    const params = new URLSearchParams(window.location.search);
    if (params.has("shine")) {
      const v = params.get("shine");
      const on = v === "1" || v === "true";
      window.localStorage.setItem("ui_shine", on ? "on" : "off");
    }
    const ls = window.localStorage.getItem("ui_shine");
    if (ls === "on") return true;
    if (ls === "off") return false;
  }
  return base;
}

type Props = { children: React.ReactNode };

export default function ShineGate({ children }: Props) {
  const [mounted, setMounted] = useState(false);
  const on = useMemo(() => isShineOn(), []);
  useEffect(() => setMounted(true), []);
  // No side-effects when Shine is on, only gating for mounted children
  if (!mounted) return null;
  return on ? <>{children}</> : null;
}

export { ShineGate };
