"use client";

import React from "react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { fadeIn, fadeInUp, zoomIn } from "./presets";

type RevealVariant = "fade" | "slideUp" | "zoom" | "fadeInUp";

type RevealProps = {
  children: React.ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  variant?: RevealVariant;
  delay?: number; // ms
  threshold?: number;
  once?: boolean;
};

const variantMap: Record<RevealVariant, any> = {
  fade: fadeIn,
  fadeInUp,
  slideUp: fadeInUp,
  zoom: zoomIn,
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
  const MotionTag: any = motion.create(Tag as any);
  const reduce = "motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100";

  return (
    <MotionTag
      variants={variantMap[variant]}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: threshold }}
      transition={{ delay: delay / 1000 }}
      className={clsx("will-change-transform", reduce, className)}
    >
      {children}
    </MotionTag>
  );
}
