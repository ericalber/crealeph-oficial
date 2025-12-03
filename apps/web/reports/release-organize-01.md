# Release — Organize 01

## Summary
- Dashboard /app with sidebar and topbar created (noindex) with mock data views.
- Marketing subtree aligned: SEO, Content, CRO, Paid (package) + paid children.
- Header updated with Services and Modules submenu (grid), Footer product links aligned.
- Redirect /services/paid-media → /services/marketing/paid added.
- Sitemap includes /services/marketing and excludes /app.*; robots disallow /app unchanged.
- QA assets added: smoke-nav test and check-404 script.

## Checklist
- [x] Sidebar /app navigable; routes noindex excluded from sitemap
- [x] /services/marketing overview indexable; children noindex
- [x] Header/Footer updated; no trailing slashes
- [x] Redirect set for paid-media → marketing/paid
- [x] Tests/scripts added (not wired to CI)

## Files
- app/app/layout.tsx, app/app/* pages
- services/marketing pages and paid/* children
- components/layout/Header.tsx, Footer.tsx
- next.config.mjs (redirects)
- app/sitemap.ts (routes list)
- tests/smoke-nav.spec.ts, scripts/check-404.mjs
- reports/routes.csv, routes.md

## Notes
- No changes to tokens, global colors, hero, or existing copy.
- All mock data rendered via server components.

