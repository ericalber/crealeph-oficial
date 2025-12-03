"use client";

import { useEffect, useState } from "react";
import { ShineGate } from "./ShineGate";

function PullToRefreshHintInner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = sessionStorage.getItem("ptr_seen") === "1";
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (!seen && isMobile && window.scrollY === 0) {
      setShow(true);
      const hideTimeout = window.setTimeout(() => setShow(false), 2000);
      const onScroll = () => {
        if (window.scrollY > 24) setShow(false);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      sessionStorage.setItem("ptr_seen", "1");
      return () => {
        window.removeEventListener("scroll", onScroll);
        window.clearTimeout(hideTimeout);
      };
    }
  }, []);
  if (!show) return null;
  return (
    <div
      data-test="ptr-hint"
      aria-live="polite"
      className="fixed left-1/2 top-2 z-[60] -translate-x-1/2 select-none rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white shadow"
    >
      ↓ Pull to refresh
    </div>
  );
}

export default function PullToRefreshHint() {
  return (
    <ShineGate>
      <PullToRefreshHintInner />
    </ShineGate>
  );
}

export { PullToRefreshHint };
