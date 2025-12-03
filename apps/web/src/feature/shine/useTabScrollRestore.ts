"use client";

import { useEffect } from "react";

export function useTabScrollRestore(key: string, containerSelector?: string, tablistSelector?: string) {
  useEffect(() => {
    const storageKey = (suffix: string) => `tsr:${key}:${suffix}`;
    const container = containerSelector ? (document.querySelector(containerSelector) as HTMLElement | null) : null;
    const tablist = tablistSelector ? (document.querySelector(tablistSelector) as HTMLElement | null) : null;

    // Restore on mount
    const top = Number(sessionStorage.getItem(storageKey("scrollTop")) ?? 0);
    const left = Number(sessionStorage.getItem(storageKey("scrollLeft")) ?? 0);
    if (container && container.scrollHeight > container.clientHeight) {
      container.scrollTo({ top, behavior: "instant" as ScrollBehavior });
    } else {
      // fallback to window
      if (top > 0) window.scrollTo({ top, behavior: "instant" as ScrollBehavior });
    }
    if (tablist && left > 0) tablist.scrollTo({ left, behavior: "instant" as ScrollBehavior });

    // Track changes
    const onScroll = () => {
      const t = container ? container.scrollTop : window.scrollY;
      sessionStorage.setItem(storageKey("scrollTop"), String(Math.max(0, t)));
    };
    const onHScroll = () => {
      if (!tablist) return;
      sessionStorage.setItem(storageKey("scrollLeft"), String(Math.max(0, tablist.scrollLeft)));
    };

    (container ?? document).addEventListener("scroll", onScroll, { passive: true });
    if (tablist) tablist.addEventListener("scroll", onHScroll, { passive: true });
    return () => {
      (container ?? document).removeEventListener("scroll", onScroll as any);
      if (tablist) tablist.removeEventListener("scroll", onHScroll as any);
    };
  }, [key, containerSelector, tablistSelector]);
}

export function TabScrollRestoreMount(props: { keyId: string; containerSelector?: string; tablistSelector?: string }) {
  useTabScrollRestore(props.keyId, props.containerSelector, props.tablistSelector);
  return null;
}

