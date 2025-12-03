"use client";

import { useEffect } from "react";
import { ShineGate } from "./ShineGate";

type LikeBurstProps = {
  selectors: string[];
};

/**
 * Adds a subtle radial-burst on click to targeted anchors/buttons.
 * CSS lives in styles/shine.css. This component only wires events.
 */
function LikeBurst({ selectors }: LikeBurstProps) {
  useEffect(() => {
    const els = selectors.flatMap((sel) => Array.from(document.querySelectorAll<HTMLElement>(sel)));
    els.forEach((el) => {
      el.classList.add("like-burst");
      el.setAttribute("data-test", "like-burst");
      const onClick = () => {
        el.classList.add("like-burst--active");
        window.setTimeout(() => el.classList.remove("like-burst--active"), 400);
      };
      el.addEventListener("click", onClick);
      (el as any).__lb = onClick;
    });
    return () => {
      els.forEach((el) => {
        const onClick = (el as any).__lb as EventListener | undefined;
        if (onClick) el.removeEventListener("click", onClick);
      });
    };
  }, [selectors.join("|")]);
  return null;
}

export default function LikeBurstShined(props: LikeBurstProps) {
  return (
    <ShineGate>
      <LikeBurst {...props} />
    </ShineGate>
  );
}

export { LikeBurstShined };
