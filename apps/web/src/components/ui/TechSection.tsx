"use client";

import clsx from "clsx";
import React from "react";

type TechSectionProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode;
  grid?: boolean;
  vignette?: boolean;
  glows?: boolean;
  noise?: boolean;
  intensity?: number; // 0..1 controls glows opacity
};

export function TechSection({
  children,
  className,
  grid = true,
  vignette = true,
  glows = true,
  noise = false,
  intensity = 1,
  ...rest
}: TechSectionProps) {
  const glowOpacity = Math.max(0, Math.min(1, intensity)) * 0.22; // cap
  return (
    <section
      className={clsx(
        "relative isolate overflow-hidden",
        grid && "ts-grid",
        vignette && "ts-vignette",
        noise && "ts-noise",
        className
      )}
      style={{
        // Optional noise source. Replace with an asset if desired.
        // Example: url('/assets/noise.png')
        // @ts-ignore -- CSS custom properties accepted
        "--noise-src": "none",
      }}
      {...rest}
    >
      {glows ? (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute -left-32 -top-24 h-[48vh] w-[48vh] rounded-full"
            style={{
              background: `radial-gradient(closest-side, hsl(var(--accent) / ${glowOpacity}) 0%, transparent 60%)`,
              filter: "blur(40px)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 top-1/4 h-[42vh] w-[42vh] rounded-full"
            style={{
              background: `radial-gradient(closest-side, hsl(var(--accent-2) / ${glowOpacity}) 0%, transparent 65%)`,
              filter: "blur(42px)",
            }}
          />
        </>
      ) : null}
      <div className="relative z-10">{children}</div>
    </section>
  );
}
