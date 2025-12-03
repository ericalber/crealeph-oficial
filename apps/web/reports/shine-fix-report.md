# Shine Fix Report — imports/exports normalization

Scope: Normalize Shine feature exports/imports, ensure CSS path is relative, and confirm Home uses only <ServicesHub /> (no inline duplicate). No UI/token/hero/copy changes.

## 1) Imports found and normalized
- apps/web/src/app/page.tsx
  - Before: `import { ShineGate } from "@/feature/shine/ShineGate";`, `import { LikeBurstShined } from "@/feature/shine/LikeBurst";`, `import { PullToRefreshHint } from "@/feature/shine/PullToRefreshHint";`
  - After:  `import ShineGate from "@/feature/shine/ShineGate";`, `import LikeBurstShined from "@/feature/shine/LikeBurst";`, `import PullToRefreshHint from "@/feature/shine/PullToRefreshHint";`

- apps/web/src/app/pricing/page.tsx
  - Before: named imports for all 3
  - After: default imports for ShineGate, LikeBurstShined, PullToRefreshHint; named for `{ TabScrollRestoreMount }` remains.

- apps/web/src/app/resources/faq/page.tsx
  - Before: named imports for ShineGate, PullToRefreshHint
  - After: default imports for both; named `{ TabScrollRestoreMount }` remains.

## 2) Exports set per file
- ShineGate.tsx
  - Now: `export default function ShineGate(...)` + `export function isShineOn()` + `export { ShineGate }` (alias).
- LikeBurst.tsx
  - Now: `export default function LikeBurstShined(...)` + `export { LikeBurstShined }` (named) and internal helper `LikeBurst`.
- PullToRefreshHint.tsx
  - Now: `export default function PullToRefreshHint(...)` + `export { PullToRefreshHint }` (named).
- useTabScrollRestore.ts
  - Named exports unchanged: `useTabScrollRestore`, `TabScrollRestoreMount`.

## 3) CSS import (relative)
- apps/web/src/app/layout.tsx
  - Changed: `import "../styles/shine.css";` (was alias path). Other CSS imports unchanged.

## 4) Home duplication check
- Confirmed no old inline block remains: no match for `/* Services Hub (white block) */`.
- Home uses only `<ServicesHub ... />` under the hero.

## 5) Validation
- Typecheck OK: `pnpm -C apps/web typecheck`
- Build OK: `pnpm -C apps/web build`

## 6) Suggested local command
- Clear cache and run dev: `rm -rf apps/web/.next && pnpm -C apps/web dev`

