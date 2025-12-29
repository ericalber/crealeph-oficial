import * as Lucide from "lucide-react";
import { createElement } from "react";

type IconProps = { className?: string; "aria-hidden"?: boolean };
type IconComponent = (props: IconProps) => ReturnType<typeof createElement> | null;

function isIconComponent(value: unknown): value is IconComponent {
  return typeof value === "function";
}

export function ModuleIcon({ name, className }: { name: string; className?: string }) {
  const lookup: Record<string, unknown> = Lucide;
  const iconCandidate = lookup[name];
  const Icon = isIconComponent(iconCandidate) ? iconCandidate : Lucide.Cpu;
  return createElement(Icon, { "aria-hidden": true, className: className ?? "h-6 w-6" });
}
