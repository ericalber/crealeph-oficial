"use client";

import React from "react";

export const hubIcons = {
  websites: "MonitorSmartphone",
  marketing: "Megaphone",
  automation: "Workflow",
  modules: "Cpu",
  projects: "BarChart3",
  industries: "Factory",
} as const;

export type HubIconKey = keyof typeof hubIcons;

type HubIconProps = {
  name: HubIconKey;
  className?: string;
} & React.SVGProps<SVGSVGElement>;

export function HubIcon({ name, className, ...rest }: HubIconProps) {
  const [Cmp, setCmp] = React.useState<any>(null);
  React.useEffect(() => {
    let mounted = true;
    import("lucide-react").then((mod) => {
      const exportName = hubIcons[name];
      const Icon = (mod as any)[exportName];
      if (mounted) setCmp(() => Icon);
    });
    return () => {
      mounted = false;
    };
  }, [name]);
  if (!Cmp) return null;
  return <Cmp className={className ?? "h-6 w-6"} aria-hidden {...rest} />;
}

