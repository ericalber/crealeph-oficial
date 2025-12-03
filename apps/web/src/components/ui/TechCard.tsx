import clsx from "clsx";
import React from "react";

type TechCardProps = {
  children: React.ReactNode;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
};

export function TechCard({ children, className, as: Tag = "div" }: TechCardProps) {
  const Comp: any = Tag;
  return (
    // Gradient border wrapper
    // Use p-[1px] so inner keeps backdrop + glass
    // Respect tokens for bg/fg
    <Comp
      className={clsx(
        "relative rounded-[--radius] p-[1px]",
        "bg-gradient-to-r from-[hsl(var(--accent)/0.6)] via-[hsl(var(--accent-2)/0.4)] to-[hsl(var(--accent)/0.6)]",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
        className,
      )}
    >
      <div
        className={clsx(
          "rounded-[--radius] bg-[hsl(var(--card))]/75 backdrop-blur-xl",
          "text-[hsl(var(--card-foreground))]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_24px_rgba(0,0,0,0.12)]",
          "ring-1 ring-[var(--line)]",
          "transition",
          "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_16px_40px_rgba(0,0,0,0.18)]",
          "focus-within:ring-[hsl(var(--accent)/0.6)]",
        )}
      >
        {children}
      </div>
    </Comp>
  );
}
