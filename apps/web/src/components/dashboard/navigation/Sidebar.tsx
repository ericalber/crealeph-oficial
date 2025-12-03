"use client";

import Link from "next/link";
import { useState } from "react";
import {
  LayoutDashboard,
  Sparkles,
  Radar,
  BadgeDollarSign,
  LineChart,
  Brain,
  Cable,
  Bot,
  Search,
  Megaphone,
  Workflow,
  FileBarChart2,
  Settings,
  Code2,
  MonitorSmartphone,
  Bug,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

type NavItem = {
  label: string;
  href?: string;
  icon?: any;
  children?: NavItem[];
};

const navItems: NavItem[] = [
  { label: "Overview", href: "/app", icon: LayoutDashboard },
  { label: "AQUA", href: "/app/aqua", icon: Sparkles },
  { label: "Scout", href: "/app/scout", icon: Radar },
  { label: "Pricing", href: "/app/pricing-regional", icon: BadgeDollarSign },
  { label: "Market Twin", href: "/app/market-twin", icon: LineChart },
  { label: "InsightScore", href: "/app/insightscore", icon: Brain },
  { label: "Bridge", href: "/app/bridge", icon: Cable },
  { label: "Robots", href: "/app/robots", icon: Bot },
  { label: "Marketplace", href: "/app/marketplace", icon: FileBarChart2 },
  { label: "Parasite", href: "/app/parasite", icon: Bug },
  {
    label: "Marketing",
    icon: Megaphone,
    children: [
      { label: "SEO", href: "/app/marketing/seo", icon: Search },
      { label: "Paid", href: "/app/marketing/paid", icon: Megaphone },
    ],
  },
  { label: "Pipeline", href: "/app/pipeline", icon: Workflow },
  { label: "Reports", href: "/app/reports", icon: FileBarChart2 },
  { label: "Settings", href: "/app/settings", icon: Settings },
  { label: "Developers", href: "/app/developers", icon: Code2 },
  { label: "Site Builder", href: "/app/site-builder", icon: MonitorSmartphone },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <nav
      className="flex h-screen flex-col border-r"
      style={{
        width: collapsed ? 72 : 260,
        backgroundColor: "var(--surface)",
        borderColor: "var(--line)",
        boxShadow: "var(--shadow-sm)",
        transition: "width 200ms ease",
      }}
      aria-label="Dashboard sidebar"
    >
      <div className="flex items-center gap-2 px-3 py-4">
        {!collapsed ? (
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted)] transition-opacity">
            CREALEPH
          </span>
        ) : null}
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] text-[var(--muted)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <div className="flex-1 space-y-1 px-2">
        {navItems.map((item) => {
          if (item.children) {
            return (
              <div key={item.label} className="space-y-1">
                <div
                  className="flex items-center gap-2 rounded-[var(--radius-sm)] px-2 py-2 text-sm font-semibold text-[var(--muted)]"
                  style={{ backgroundColor: "transparent" }}
                >
                  {item.icon ? <item.icon className="text-[var(--muted)]" size={18} /> : null}
                  {!collapsed ? <span>{item.label}</span> : null}
                  {!collapsed ? <ChevronDown size={14} className="ml-auto text-[var(--muted)]" /> : null}
                </div>
                <div className="space-y-1 pl-3">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href ?? "#"}
                      className="group flex items-center gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--muted)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
                    >
                      {child.icon ? <child.icon size={18} className="text-[var(--muted)] group-hover:text-[var(--ink)]" /> : null}
                      {!collapsed ? <span>{child.label}</span> : null}
                    </Link>
                  ))}
                </div>
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href ?? "#"}
              className="group flex items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--muted)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
            >
              {item.icon ? <item.icon size={18} className="text-[var(--muted)] group-hover:text-[var(--ink)]" /> : null}
              {!collapsed ? <span>{item.label}</span> : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
