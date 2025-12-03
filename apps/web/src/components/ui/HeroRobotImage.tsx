"use client";

import React, { useMemo, useState } from "react";

type HeroRobotImageProps = {
  className?: string;
  style?: React.CSSProperties;
  srcCandidates?: string[];
};

export function HeroRobotImage({ className, style, srcCandidates }: HeroRobotImageProps) {
  // Usa apenas os caminhos informados; sem fallback de repositório para evitar imagens indesejadas
  const candidates = useMemo(() => srcCandidates ?? [], [srcCandidates]);
  const [index, setIndex] = useState(0);
  const src = candidates[index];

  // Para SVG, <img> funciona sem otimização e evita warnings do Next Image
  if (!src) return null;
  return (
    <img
      src={src}
      alt=""
      className={className}
      style={{ transform: "scaleX(-1)", transformOrigin: "center", ...style }}
      onError={() => setIndex((i) => (i < candidates.length - 1 ? i + 1 : i))}
      decoding="async"
      loading="eager"
    />
  );
}
