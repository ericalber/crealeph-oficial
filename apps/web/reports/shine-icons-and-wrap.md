# Shine — Icons in ServicesHub + Wrappers Below

## ServicesHub Icons (always on)
- Map file: `src/sections/home/servicesHubIcons.tsx`
- Icons mapped:
  - websites → MonitorSmartphone
  - marketing → Megaphone
  - automation → Workflow
  - modules → Cpu
  - projects → BarChart3
  - industries → Factory
- Usage: `<HubIcon name={item.icon} className="icon icon-6 text-[#0B0B0E]" />`
- Applied to all 6 items in Home `ServicesHub`.

## Shine Wrappers (flagged)
- Component: `src/feature/shine/SectionShine.tsx` (client)
  - Early return children when `NEXT_PUBLIC_FEATURE_UI_SHINE !== "true"`.
- CSS additions: `src/styles/shine.css` (.section-shine + tones crimson/sky)
- Wrapped blocks on Home:
  - Por que a CreAleph (Diferenciais) — crimson
  - Problema (Onde times perdem performance) — crimson (rounded-2xl)
  - Como funciona — crimson
  - Core Suite / Módulos — crimson
  - KPIs ribbon — sky
  - Resultados (cases) — crimson
  - Demonstração guiada (final) — sky

## Deduplication (flagged)
- When Shine ON: initial "Demonstração guiada em 30 minutos" banner is not rendered; final banner remains.
- No removal of copy; only conditional render.

## Toggle
- ON: `NEXT_PUBLIC_FEATURE_UI_SHINE=true` (build) or dev override via localStorage/ui_shine.
- OFF: wrappers do not render; ServicesHub icons remain since they are not gated.

## QA
- Update tests to verify:
  - 6 icons in ServicesHub (`[data-um^="home.servicesHub.card."] svg`).
  - `.section-shine` presence when flag ON, absence when flag OFF.
  - Only one demo banner when flag ON.

