"use client";

import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";

type RevealProps = {
  children: React.ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  variant?: "fade" | "slideUp" | "zoom";
  delay?: number; // ms
  threshold?: number;
  once?: boolean;
};

export function Reveal({
  children,
  as: Tag = "div",
  className,
  variant = "slideUp",
  delay = 0,
  threshold = 0.2,
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            if (once) obs.disconnect();
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, once]);

  const base = "transition duration-700 ease-out will-change-transform";
  const reduce = "motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100";

  const initialByVariant = {
    fade: "opacity-0",
    slideUp: "opacity-0 translate-y-4",
    zoom: "opacity-0 scale-95",
  } as const;

  const finalByVariant = {
    fade: "opacity-100",
    slideUp: "opacity-100 translate-y-0",
    zoom: "opacity-100 scale-100",
  } as const;

  const Comp: any = Tag;
  const initialClass = (initialByVariant as Record<string, string>)[variant];
  const finalClass = (finalByVariant as Record<string, string>)[variant];

  return (
    <Comp
      ref={ref as any}
      className={clsx(base, reduce, visible ? finalClass : initialClass, className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Comp>
  );
}
