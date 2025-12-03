export type Module = {
  slug: string;
  title: string;
  summary: string;
  category: "Intelligence" | "Competition" | "Pricing" | "Integration";
  tags: string[];
  icon: string;
  href: string;
  outcomes: string[];
  worksWith: string[];
};

export const MODULES: Module[] = [
  {
    slug: "aqua",
    title: "AQUA Insights",
    summary: "Language that converts by city: promises, objections and CTAs extracted from real demand.",
    category: "Intelligence",
    tags: ["Copy Intelligence", "Local Language", "Conversion"],
    icon: "Sparkles",
    href: "/modules/aqua",
    outcomes: ["Higher CTR and CVR on landings", "Localized messaging at scale"],
    worksWith: ["Websites", "Marketing"],
  },
  {
    slug: "scout",
    title: "Scout",
    summary: "Watcher bots scan competitors’ pages, ads and listings to surface shifts and threats.",
    category: "Competition",
    tags: ["Monitoring", "Alerts", "Market"],
    icon: "Binoculars",
    href: "/modules/scout",
    outcomes: ["Timely alerts on competitor moves", "Faster reaction on offers and copy"],
    worksWith: ["Marketing", "Bridge"],
  },
  {
    slug: "insightscore",
    title: "InsightScore™",
    summary: "A prioritization engine that scores hypotheses by impact, effort and seasonality.",
    category: "Intelligence",
    tags: ["Prioritization", "Hypotheses", "Experiments"],
    icon: "Brain",
    href: "/modules/insightscore",
    outcomes: ["Roadmaps that focus on ROI", "Clear trade-offs for execs"],
    worksWith: ["Websites", "Marketing", "Automation"],
  },
  {
    slug: "market-twin",
    title: "Market Twin™",
    summary: "Regional positioning and price bands mapped by neighborhood and competitor density.",
    category: "Pricing",
    tags: ["Positioning", "SOV", "Benchmarks"],
    icon: "LineChart",
    href: "/modules/market-twin",
    outcomes: ["Right price ranges by area", "Visibility on who dominates each zone"],
    worksWith: ["Pricing", "Marketing"],
  },
  {
    slug: "pricing",
    title: "Regional Pricing",
    summary: "Recommended price per neighborhood with medians and percentiles that update over time.",
    category: "Pricing",
    tags: ["Percentiles", "Recommendations"],
    icon: "BadgeDollarSign",
    href: "/modules/pricing",
    outcomes: ["Consistent quotes across teams", "Faster approvals"],
    worksWith: ["Pricing", "Websites", "Pipeline"],
  },
  {
    slug: "bridge",
    title: "Bridge (API)",
    summary: "Billing & CRM connectors (Stripe/PayPal/HubSpot etc.), event pipeline and SLA tracking.",
    category: "Integration",
    tags: ["Connectors", "Events", "SLA"],
    icon: "Cable",
    href: "/modules/bridge",
    outcomes: ["Leads, deals and payments in one stream", "Auditable logs and webhooks"],
    worksWith: ["Websites", "Marketing", "Automation"],
  },
];
