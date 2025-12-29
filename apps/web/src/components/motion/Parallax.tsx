"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

type ParallaxProps = {
  children: React.ReactNode;
  strength?: number; // 0.1 = sutil, 0.3 = forte
  className?: string;
  axis?: "y" | "x";
};

// Legacy imperative parallax (kept for compatibility)
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

type ParallaxLayerProps = {
  children: React.ReactNode;
  speed?: number; // px of travel through viewport
  className?: string;
};

export function ParallaxLayer({ children, speed = 40, className }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);

  return (
    <motion.div ref={ref} style={{ y, willChange: "transform" }} className={className}>
      {children}
    </motion.div>
  );
}
