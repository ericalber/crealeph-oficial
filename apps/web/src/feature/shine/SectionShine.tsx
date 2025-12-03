"use client";

import React from "react";

type Tone = "crimson" | "sky";

export default function SectionShine({ tone = "crimson", className, children }: { tone?: Tone; className?: string; children: React.ReactNode }) {
  const hasShine = process.env.NEXT_PUBLIC_FEATURE_UI_SHINE === "true";
  if (!hasShine) return <>{children}</>;
  return <div className={`section-shine ${tone} ${className ?? ""}`.trim()}>{children}</div>;
}

