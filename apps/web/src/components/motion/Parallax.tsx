"use client";

import { useEffect, useRef } from "react";

type ParallaxProps = {
  children: React.ReactNode;
  strength?: number; // 0.1 = sutil, 0.3 = forte
  className?: string;
  axis?: "y" | "x";
};

export function Parallax({ children, strength = 0.15, className, axis = "y" }: ParallaxProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      if (rafRef.current) return; // throttle via rAF
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const rect = el.getBoundingClientRect();
        const offset = axis === "y" ? rect.top : rect.left;
        const translate = offset * strength * -1; // move oposto ao scroll
        if (axis === "y") {
          el.style.transform = `translate3d(0, ${translate.toFixed(2)}px, 0)`;
        } else {
          el.style.transform = `translate3d(${translate.toFixed(2)}px, 0, 0)`;
        }
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [strength, axis]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}

