import * as Lucide from "lucide-react";
import { createElement, type ComponentType } from "react";

export function ModuleIcon({ name, className }: { name: string; className?: string }) {
  const lookup = Lucide as Record<string, ComponentType<{ className?: string }>>;
  const Icon = lookup[name] ?? Lucide.Cpu;
  return createElement(Icon, { "aria-hidden": true, className: className ?? "h-6 w-6" });
}
