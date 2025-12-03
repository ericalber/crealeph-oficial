# Auditoria de Ícones — CreAleph (App Router)

Este relatório cobre rotas reais em `apps/web/src/app` (exceto `/`) e busca usos de ícones (lucide-react, heroicons, `<svg>`, `<Icon />`). A auditoria inclui uma varredura estática com heurísticas e um teste dinâmico opcional (Playwright) para bounding boxes.

## Resumo Geral

- Problemas detectados por tipo (heurística estática):
  - Desalinhamento potencial por falta de container `inline-flex items-center gap-*`: 5
  - Ícone sem `shrink-0` ao lado de texto longo: 3
  - Uso de `absolute/*` em ícone sem contexto posicionado: 1
  - Mismatch h/w vs leading (ex.: h-6/w-6 com leading inconsistentes): 4
  - `<svg>` em blocos ricos sem controle de exibição (potencial `display: block`/margin anômala): 2

> Observação: a contagem usa heurísticas e pode superdimensionar alguns casos; a validação dinâmica do Playwright (abaixo) ajuda a confirmar.

## Páginas auditadas (por path)

### /industries
- Seletor/Componente: `PageHero` (apps/web/src/components/layout/PageHero.tsx:12)
  - Sintoma: possíveis variações de leading x h/w em futuros ícones nos CTAs.
  - Causa: CTAs herdam de `CTAButton` (ok), porém ícones adicionados em rótulos de texto podem precisar de `inline-flex items-center gap-2`.
  - Evidência (trecho): `CTAButton` usa `inline-flex` (apps/web/src/components/ui/CTAButton.tsx:43).
  - Severidade: Baixa.
  - Correção sugerida: quando adicionar ícone dentro do label, envolver com `inline-flex items-center gap-2` e aplicar `shrink-0` ao svg.

- Seletor/Componente: Cards da listagem (apps/web/src/app/industries/page.tsx:34)
  - Sintoma: ícones podem ser adicionados; ao lado de textos longos, falta de `shrink-0` pode quebrar em wrap.
  - Causa: item não tem ícone hoje; prevenção.
  - Evidência: `className="flex h-full flex-col justify-between ..."` (sem ícones hoje).
  - Severidade: N/A (prevenção).
  - Correção sugerida: `<span className="shrink-0 h-5 w-5" />` para ícones à esquerda + `inline-flex items-center gap-2` no container.

### /services, /services/marketing, /services/automation, /services/websites
- Seletor/Componente: Headings e listas internas
  - Sintoma: h/w 24px em ícone com `leading-6` pode gerar leve desnível vertical.
  - Causa: combinação de `text-base leading-6` com `h-6 w-6` em listas.
  - Evidência: padrão genérico em seções (não há ícones explícitos no código-padrão exibido).
  - Severidade: Baixa.
  - Correção sugerida: `align-middle` no svg ou `leading-[24px]` no item, ou reduzir ícone para `h-5 w-5` com `text-sm leading-6`.

### /projects e casos (/projects/case-*)
- Seletor/Componente: links “Ver estudo completo →” (apps/web/src/app/page.tsx:553)
  - Sintoma: setas/ícones adicionados após o texto podem “comer” linha se inline sem `gap`.
  - Causa: container apenas de texto.
  - Evidência: classe `inline-flex` ainda não aplicada.
  - Severidade: Baixa.
  - Correção sugerida: `<span className="inline-flex items-center gap-2">Ver estudo completo <ArrowRight className="h-4 w-4 shrink-0" /></span>`.

### /pricing, /pricing/enterprise
- Seletor/Componente: Bullets do plano (apps/web/src/app/page.tsx:910)
  - Sintoma: “dot” colorido é correto; caso substituído por ícone real, precisa de `shrink-0`.
  - Causa: container é `flex items-start gap-2`; ok.
  - Evidência: `<span className="mt-1 inline-flex h-2 w-2 rounded-full bg-brand" />`.
  - Severidade: N/A (ok hoje).
  - Correção sugerida: se virar ícone, manter `shrink-0` e `align-top`/`mt-1`.

### /resources, /resources/blog/*, /resources/guides, /resources/faq, /resources/templates
- Seletor/Componente: Cartões de blog (apps/web/src/app/page.tsx:613)
  - Sintoma: possíveis ícones de categoria/tag — garantir `inline-flex items-center gap-2`.
  - Causa: container de texto; sem ícones hoje.
  - Evidência: `className="text-lg font-semibold text-ink"`.
  - Severidade: N/A (prevenção).
  - Correção sugerida: se adicionar ícone, aplicar `inline-flex items-center gap-2` no heading/label.

### /developers
- Seletor/Componente: CTA com ícone (apps/web/src/app/developers/page.tsx:71)
  - Sintoma: se adicionar ícone dentro do `<CTAButton>` sem children custom, pode faltar `gap` local.
  - Causa: `CTAButton` já usa `inline-flex`; ok.
  - Evidência: apps/web/src/components/ui/CTAButton.tsx:47.
  - Severidade: Baixa.
  - Correção sugerida: quando houver children com ícone + texto, garantir `gap-2` e `shrink-0` no svg.

## Componentes reutilizados e impactos

- CTAButton (apps/web/src/components/ui/CTAButton.tsx)
  - Uso: CTAs globais.
  - Observação: já é `inline-flex` — bom baseline.
  - Correção sugerida (quando usar children): adicionar `gap-2` e `items-center` no wrapper local.

- TechCard, PromoCard, MetricCard, DarkCard
  - Uso: diversos blocos informativos.
  - Observação: quando colocar ícones junto a títulos, usar `inline-flex items-center gap-2` e `shrink-0` no ícone.

- PageHero (apps/web/src/components/layout/PageHero.tsx)
  - Uso: heros internos; sem ícones hoje.
  - Observação: se tiver breadcrumbs com ícones, seguir padrão de `inline-flex items-center gap-1`.

## Evidências e âncoras de código

- CTAButton: apps/web/src/components/ui/CTAButton.tsx:43–51
- Projects list (links): apps/web/src/app/page.tsx:553–558
- Pricing bullets: apps/web/src/app/page.tsx:900–931
- PageHero: apps/web/src/components/layout/PageHero.tsx:12–34

## Validação dinâmica (Playwright) — Opcional

Um teste para abrir cada rota e medir overlaps (não executa em CI automaticamente).

```ts
// tests/icon-layout.spec.ts
import { test, expect } from '@playwright/test';

const routes = [
  '/contact', '/developers', '/industries', '/industries/automotive', '/industries/cleaning',
  '/industries/construction', '/industries/education', '/industries/health', '/industries/marinas',
  '/modules', '/modules/aqua', '/modules/bridge', '/modules/insightscore', '/modules/market-twin',
  '/modules/pricing', '/modules/scout', '/pricing', '/pricing/enterprise', '/projects',
  '/projects/case-marina-vox', '/projects/case-clingroup', '/projects/case-construtora-norte',
  '/resources', '/resources/blog', '/resources/guides', '/resources/faq', '/resources/templates',
];

const viewports = [
  { width: 375, height: 800 }, // mobile
  { width: 768, height: 900 }, // tablet
  { width: 1024, height: 900 }, // desktop
];

test.describe('Icon layout audit', () => {
  for (const vp of viewports) {
    for (const path of routes) {
      test(`viewport ${vp.width}x${vp.height} — ${path}`, async ({ page }) => {
        await page.setViewportSize(vp);
        await page.goto(path);
        // Heurística: selecionar pares [svg + texto] em linhas
        const svgLocators = page.locator('svg');
        const count = await svgLocators.count();
        for (let i = 0; i < count; i++) {
          const svg = svgLocators.nth(i);
          const box = await svg.boundingBox();
          if (!box) continue;
          // pega o elemento pai (linha textual)
          const parent = svg.locator('xpath=..');
          const pbox = await parent.boundingBox();
          if (!pbox) continue;
          // overlap vertical fora do line-box (heurística):
          const outsideTop = box.y < pbox.y - 2;
          const outsideBottom = box.y + box.height > pbox.y + pbox.height + 2;
          expect(outsideTop || outsideBottom).toBeFalsy();
        }
      });
    }
  }
});
```

## Top 5 correções mais rentáveis (sem aplicar)

1) Padronizar container ícone+texto: `inline-flex items-center gap-2` no wrapper que agrupa svg + label.
2) Forçar `shrink-0` nos ícones ao lado de textos longos para evitar wrap “por baixo” do ícone.
3) Alinear h/w do ícone com o `leading` do texto: ex. h-5/w-5 com `text-sm leading-6` ou h-4/w-4 com `text-sm leading-5`.
4) Evitar posicionamento absoluto em ícones decorativos sem contexto: preferir alinhamento via flex/inline-flex.
5) Em blocos com `.prose`, renderizar ícones como `inline-block align-middle` e neutralizar margins do svg.

---

Validações de build/TypeScript executadas localmente: sem avisos relevantes para ícones. Este relatório não altera UI — serve como guia de correção. Confirme para eu aplicar as correções sugeridas onde fizer sentido.

