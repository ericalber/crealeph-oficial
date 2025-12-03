# UI Shine · Micro Sprint 7 — Apply Report

Context: Next.js (App Router) + Tailwind + shadcn — apps/web
Scope: Lightweight microinteractions gated by NEXT_PUBLIC_FEATURE_UI_SHINE. Default OFF. No LCP regressions.

## What was added
- Shine gate (client-only, gating + dev override):
  - src/feature/shine/ShineGate.tsx
    - isShineOn(): reads NEXT_PUBLIC_FEATURE_UI_SHINE === "true"; in dev, allows overrides via query (?shine=1|0) and localStorage.ui_shine ("on"|"off").
    - <ShineGate>{children}</ShineGate>: renders children only when ON to avoid hydration mismatch.

- Like-Burst (CSS-only + tiny JS):
  - src/feature/shine/LikeBurst.tsx — wires .like-burst class and click burst (400ms). Adds data-test="like-burst".
  - src/styles/shine.css — keyframes + .like-burst styles (@tailwind components + @layer components).

- Pull-to-Refresh Hint (mobile, one shot per session):
  - src/feature/shine/PullToRefreshHint.tsx — shows fixed chip at top; hides on scroll>24px or after 2s. data-test="ptr-hint".

- Tab Scroll-Restoration (hook):
  - src/feature/shine/useTabScrollRestore.ts — useTabScrollRestore(key, containerSelector?, tablistSelector?).
    - Export TabScrollRestoreMount for convenience.

- Mount points (behind ShineGate):
  - Home (src/app/page.tsx): PullToRefreshHint + LikeBurst on the “View Plans” (<a href="/pricing"]).
  - Pricing (src/app/pricing/page.tsx): TabScrollRestoreMount(keyId="pricing-tabs") + PullToRefreshHint + LikeBurst on plan CTAs and enterprise CTA.
  - FAQ (src/app/resources/faq/page.tsx): TabScrollRestoreMount(keyId="faq-tabs") + PullToRefreshHint.

- Tests (Playwright smoke):
  - tests/shine-flag.spec.ts
    - ON: localStorage ui_shine=on → expects [data-test="like-burst"] and soft check for [data-test="ptr-hint"] on mobile; checks pricing also.
    - OFF: ui_shine=off → expects none of the selectors present.

## Files touched
- M src/app/layout.tsx (import of src/styles/shine.css)
- M src/app/page.tsx (Home: ShineGate + LikeBurst + PullToRefreshHint)
- M src/app/pricing/page.tsx (ShineGate + LikeBurst + PullToRefreshHint + TabScrollRestoreMount, added data-scroll-key)
- M src/app/resources/faq/page.tsx (ShineGate + PullToRefreshHint + TabScrollRestoreMount, added data-scroll-key)
- A src/feature/shine/ShineGate.tsx
- A src/feature/shine/LikeBurst.tsx
- A src/feature/shine/PullToRefreshHint.tsx
- A src/feature/shine/useTabScrollRestore.ts
- A src/styles/shine.css
- A tests/shine-flag.spec.ts

## Toggle instructions
- Build-time (prod/stage): set NEXT_PUBLIC_FEATURE_UI_SHINE=true to enable. Default OFF recommended.
- Dev overrides (NODE_ENV!="production"):
  - URL: append ?shine=1 to enable, ?shine=0 to disable
  - localStorage: ui_shine = "on" | "off"

## Notes
- No changes to design tokens, theme globals or hero/copy. Only gated microinteractions.
- Like-Burst uses pure CSS keyframes and does not block LCP.
- PullToRefreshHint is mobile-only and self-dismissing; aria-live="polite".
- Tab scroll-restore stores positions in sessionStorage (keys "tsr:<key>:scrollTop/scrollLeft").

## Validation
- Typecheck, build: OK (pnpm -C apps/web typecheck && pnpm -C apps/web build)
- Manual QA: toggle the flag and verify presence/absence of data-test selectors and no CLS.

## Branch
- Suggested: chore/micro-sprint-7-shine (not created automatically).

