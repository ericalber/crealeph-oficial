# Rollback Report — Shine Home Expansion

Mode: No Git (fallback)

What was removed
- Deleted files created by the expansion:
  - `apps/web/src/feature/shine/SectionShine.tsx`
  - `apps/web/src/feature/shine/ShineIcons.tsx`
  - `apps/web/src/feature/brief/WebsiteBriefSheet.tsx`
  - `apps/web/reports/shine-home-expansion.md`

What was restored/edited
- `apps/web/src/styles/shine.css`
  - Removed `.section-shine` palette and wrapper rules; kept LikeBurst styles intact.
- `apps/web/src/sections/home/ServicesHub.tsx`
  - Removed `iconKey` support and ShineIcon usage.
  - Removed `data-brief="websites"`; card is a plain `<Link>` again.
- `apps/web/src/feature/shine/ShineGate.tsx`
  - Removed click listener for `[data-brief="websites"]`; ShineGate now only gates children.
- `apps/web/src/app/page.tsx`
  - Removed imports of `SectionShine` and `WebsiteBriefSheet`.
  - Restored ServicesHub without wrappers or icons.
  - Restored the earlier demo banner (home-banner-1) and removed added wrappers from other sections.
  - Kept existing Shine microinteractions (PullToRefreshHint + LikeBurstShined) after ServicesHub.

Validation
- Typecheck OK: `pnpm -C apps/web typecheck`
- Build OK: `pnpm -C apps/web build`

Checklist
- [x] Home shows the approved Shine block only right after the hero (ServicesHub + microinteractions).
- [x] No SectionShine wrappers in other sections.
- [x] No extra icons or WebsiteBriefSheet.
- [x] Typecheck/Build pass.

How to run locally
- `rm -rf apps/web/.next apps/web/.turbo && pnpm -C apps/web dev`

