import type { MetadataRoute } from "next";

const routes: string[] = [
  "/",
  "/contact",
  "/developers",
  "/industries",
  "/industries/automotive",
  "/industries/cleaning",
  "/industries/construction",
  "/industries/education",
  "/industries/health",
  "/industries/marinas",
  "/modules/aqua",
  "/modules/bridge",
  "/modules/insightscore",
  "/modules/market-twin",
  "/modules/pricing",
  "/modules/scout",
  "/modules",
  "/pricing",
  "/pricing/enterprise",
  "/projects",
  "/projects/case-marina-vox",
  "/projects/case-clingroup",
  "/projects/case-construtora-norte",
  "/resources",
  "/resources/blog",
  "/resources/blog/site-modular",
  "/resources/blog/checklist-locais",
  "/resources/blog/educacao",
  "/resources/blog/abm-industrial",
  "/resources/guides",
  "/resources/guides/bridge",
  "/resources/guides/insightscore",
  "/resources/templates",
  "/resources/faq",
  "/services/marketing",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const now = new Date();
  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.6,
  }));
}
