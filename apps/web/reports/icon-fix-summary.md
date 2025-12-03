# Correções de Ícones — Passo 01 (não-destrutivo)

Escopo: aplicar utilitários e ajustes mínimos em containers com ícone+texto, seguindo reports/icon-audit.md. Sem mudanças de layout, tokens, hero, copy, ou hierarquia.

## Utilitários adicionados
- `apps/web/src/styles/globals.css`
  - `.icon-row` → inline-flex, items-center, gap-2
  - `.icon` → inline-block, shrink-0, align-middle
  - `.icon-5`/`.icon-6` → tamanhos utilitários
  - `.prose :where(svg)` → inline-block align-middle

## Componentes tocados
- FloatingDemoButton (apps/web/src/components/ui/FloatingDemoButton.tsx)
  - Antes: `<Calendar className="h-4 w-4" aria-hidden/>`
  - Depois: `<Calendar className="icon h-4 w-4" aria-hidden/>`

- Hero CTA secundário (apps/web/src/app/page.tsx)
  - Antes: `<Calendar className="h-4 w-4" aria-hidden/>`
  - Depois: `<Calendar className="icon h-4 w-4" aria-hidden/>`

- Breadcrumbs (apps/web/src/components/ui/Breadcrumbs.tsx)
  - Antes: `<ChevronRight size={12} className="text-line"/>`
  - Depois: `<ChevronRight size={12} className="icon text-line"/>`

- IntegrationMosaicSection (apps/web/src/sections/home/IntegrationMosaicSection.tsx)
  - Antes: container `flex items-center gap-2` + `<item.icon size={16}/>`
  - Depois: container `.icon-row` + `<item.icon className="icon" size={16} aria-hidden/>`

## Ocorrências por página
- / (componentes compartilhados; CTA e breadcrumb visíveis nas internas também)
- /industries (Breadcrumbs no PageHero)
- Seções de integração (quando renderizadas) → containers padronizados

## Observações
- Não foram alterados tamanhos visuais dos ícones onde havia `h/w` explícitos (mantivemos `h-4 w-4`), apenas adicionamos `shrink-0` e `align-middle` via `.icon`.
- Em IntegrationMosaicSection mantivemos `size={16}` e adicionamos `.icon` (sem aumentar tamanho) para evitar regressão.
- Não tocamos em ícones grandes/ilustrações (ZigZagNarrativeSection, badges) por serem decorativos e não linha de texto.

## Validação
- Typecheck/Build: OK.
- Teste Playwright opcional disponível em `apps/web/tests/icon-layout.spec.ts` (não executado automaticamente em CI).

## Próximo passo sugerido
- Onde existirem rótulos com ícones dinâmicos (ex.: links "→" com ícone), aplicar `.icon-row` + `icon` localmente ao introduzir o ícone, mantendo o padrão editorial.

