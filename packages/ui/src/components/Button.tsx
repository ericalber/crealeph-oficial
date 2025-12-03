import React from "react";
import { clsx } from "clsx";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
};

export const Button: React.FC<Props> = ({
  variant = "primary",
  size = "md",
  className,
  ...props
}) => {
  const base = "inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50";
  const variants = {
    primary: "bg-black text-white hover:bg-zinc-800 focus:ring-black",
    secondary: "bg-white border border-zinc-200 text-black hover:bg-zinc-50 focus:ring-zinc-300",
    ghost: "bg-transparent hover:bg-zinc-100 text-black"
  } as const;
  const sizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4",
    lg: "h-12 px-6 text-lg"
  } as const;
  return (
    <button className={clsx(base, variants[variant], sizes[size], className)} {...props} />
  );
};

