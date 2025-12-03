# Relatório — Último Passo Aplicado (Auditoria não-destrutiva)

## 1) Resumo executivo
O estado atual mantém o Hero da Home com os textos originais no lado esquerdo e um visual de marca reforçado: fundo com arte/gradiente e textura técnica (ts-grid + ts-vignette). A imagem do robô do lado direito é gerenciada por um componente dedicado (HeroRobotImage) que prioriza o asset em `/brand/robo.png` (servido de `apps/web/public/brand/robo.png`), sem alterar o copy.

Foi introduzido um “Lighting System” leve via utilitários CSS (grid sutil, vinheta, ajustes de ícones e link-cta) e a textura foi aplicada, alternadamente, em seções-chave da home (“Resultados que falam por si” e “Blog & recursos”). A auditoria também confirma o guia interno “Dossiê” (noindex) renderizando Markdown por import estático, além de redirects técnicos para normalizar URLs. O dashboard `/app` existe como placeholder (noindex); as visões detalhadas e a sidebar ainda não foram criadas.

---

## 2) Mapa de rotas ATUAL (App Router)
Escopo analisado: `apps/web/src/app`

- Serviços (/services)
  - /services (hub)
  - /services/marketing (overview; noindex)
  - /services/automation
  - /services/websites
  - (não existem no momento): /services/marketing/seo, /marketing/paid e filhos, /marketing/content, /marketing/cro

- Módulos (/modules)
  - /modules (index; placeholder)
  - /modules/aqua
  - /modules/scout
  - /modules/insightscore
  - /modules/market-twin
  - /modules/pricing
  - /modules/bridge

- Indústrias (/industries)
  - /industries (hub)
  - /industries/automotive
  - /industries/cleaning
  - /industries/construction
  - /industries/education
  - /industries/health
  - /industries/marinas

- Projetos (/projects)
  - /projects (listagem)
  - /projects/case-marina-vox
  - /projects/case-clingroup
  - /projects/case-construtora-norte

- Recursos (/resources)
  - /resources (hub)
  - Blog: /resources/blog (+ posts: site-modular, checklist-locais, educacao, abm-industrial, guia-precificacao)
  - Guias: /resources/guides (hub)
    - /resources/guides/bridge
    - /resources/guides/insightscore
    - /resources/guides/dossie (noindex; importa Markdown)
  - FAQ/Templates: /resources/faq, /resources/templates

- Outras
  - / (Home)
  - /contact
  - /developers
  - /pricing, /pricing/enterprise
  - /app (placeholder; noindex)

---

## 3) Navegação (Header/Mega-menu e Footer)
- Header: arquivo `apps/web/src/components/layout/Header.tsx:23` (elemento `<header>`), com navegação simples (não-mega menu) e UTMs em todos os itens.
  - Lista de itens: Home, Serviços, Indústrias, Projetos, Recursos, Preços, Contato `apps/web/src/components/layout/Header.tsx:12–20`.
  - UTMs nas âncoras: `apps/web/src/components/layout/Header.tsx:44` e mobile `:89`.
  - CTAs (Entrar → /app, Conhecer serviços → /services): `apps/web/src/components/layout/Header.tsx:54, 63`.
- Footer: arquivo `apps/web/src/components/layout/Footer.tsx:35` (gradiente/brand no fundo). Colunas e UTMs em links: `apps/web/src/components/layout/Footer.tsx:147`.
- Mega-menu: não foi implementado; header mantém navegação simples.

Referências:
- Header: apps/web/src/components/layout/Header.tsx:23
- Footer: apps/web/src/components/layout/Footer.tsx:35, apps/web/src/components/layout/Footer.tsx:147

---

## 4) Dashboard (/app)
- Existência de `/app`: Sim, como placeholder em `apps/web/src/app/app/page.tsx` com `robots: { index: false }` e breadcrumb.
- `/app/layout.tsx` (sidebar/topbar): Não existe. O layout global atual é `apps/web/src/app/layout.tsx` (site inteiro), sem sidebar dedicada ao dashboard.
- Visões detalhadas (SEO, Paid, Pipeline, Pricing regional, Competition, InsightScore, MarketTwin, Reports, Settings): não existem no momento.
- RBAC simples por cookie: não implementado neste passo.
- SEO do dashboard: placeholder com `noindex` no metadata.

Referências:
- apps/web/src/app/app/page.tsx:1
- apps/web/src/app/layout.tsx:1

---

## 5) SEO técnico
- Redirects permanentes (308 equivalentes via Next): `apps/web/next.config.mjs`
  - `/resources/blog/ → /resources/blog`
  - `/modules/ → /modules`

```js
// apps/web/next.config.mjs (trecho)
async redirects() {
  return [
    { source: "/resources/blog/", destination: "/resources/blog", permanent: true },
    { source: "/modules/", destination: "/modules", permanent: true },
  ];
},
// Suporte a import de .md como string (Edge-safe)
webpack: (config) => {
  config.module.rules.push({ test: /\.md$/, type: "asset/source" });
  return config;
},
```

- Sitemap (inclui `lastModified` e `changeFrequency`): `apps/web/src/app/sitemap.ts`
```ts
const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const now = new Date();
return routes.map((path) => ({
  url: `${base}${path}`,
  lastModified: now,
  changeFrequency: path === "/" ? "weekly" : "monthly",
  priority: path === "/" ? 1 : 0.6,
}));
```

- Robots (disallow `/app`; aponta para sitemap): `apps/web/src/app/robots.ts`
```ts
export default function robots() {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return { rules: [{ userAgent: "*", disallow: ["/app"] }], sitemap: [`${base}/sitemap.xml`] };
}
```

- Canonicals: herdados via `metadataBase` (não há canônicos específicos adicionados nesta auditoria).

---

## 6) Arquivos tocados (simulado; sem Git)
Sem repositório Git detectado, o status A/M/D não é rastreável. Abaixo, arquivos relevantes ao último passo e suas contagens de linhas:

- apps/web/src/app/page.tsx — 783 linhas (Home; Hero com ts-grid/ts-vignette e HeroRobotImage)
- apps/web/src/components/ui/HeroRobotImage.tsx — 30 linhas (componente do robô, prioriza `/brand/robo.png`)
- apps/web/src/styles/globals.css — 129 linhas (inclui `.icon-*`, `.link-cta`, `.ts-grid`, `.ts-vignette`)
- apps/web/next.config.mjs — 24 linhas (redirects + loader de `.md`)
- apps/web/src/app/resources/guides/dossie/page.tsx — 162 linhas (guia interno noindex; import estático de `.md`)
- apps/web/reports/site-services-audit.md — 132 linhas (dossiê interno)
- apps/web/src/app/sitemap.ts — 44 linhas (sitemap com lastModified/changeFrequency)
- apps/web/src/app/robots.ts — 20 linhas (disallow `/app`)

---

## 7) DIFF (simulado) — trechos relevantes

```diff
--- a/apps/web/src/app/page.tsx
+++ b/apps/web/src/app/page.tsx
@@
- <section className="relative isolate ts-grid ts-vignette flex min-h-[92vh] items-center overflow-hidden bg-black text-white">
+ <section className="relative isolate ts-grid ts-vignette flex min-h-[92vh] items-center overflow-hidden bg-black text-white">
   <Image src="/assets/brand/hero-bg.svg" alt="Fundo de marca CreAleph" fill priority className="object-cover opacity-80 z-0" />
   <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-black/70 via-black/45 to-black/25" />
   <div className="pointer-events-none absolute inset-y-0 right-0 z-[2] hidden items-center pr-6 md:flex">
-    {/* Visual à direita */}
+    {/* Visual à direita: prioriza /brand/robo.png */}
     <HeroRobotImage
       className="h-auto w-[42vw] max-w-[540px] md:w-[42vw] lg:w-[44vw] lg:max-w-[560px] drop-shadow-[0_20px_80px_rgba(224,32,32,.35)]"
       srcCandidates={[
         "/brand/robo.png",
         "/brand/—Pngtree—robotic cyberpunk artwork_16198298.png",
       ]}
     />
   </div>
@@  // seções com textura alternada
- <section className="relative isolate px-4 py-20 ts-grid ts-vignette">
+ <section className="relative isolate px-4 py-20 ts-grid ts-vignette">
   <h2>Resultados que falam por si</h2>
@@
- <section className="relative isolate px-4 py-20 ts-grid ts-vignette">
+ <section className="relative isolate px-4 py-20 ts-grid ts-vignette">
   <h2>Conteúdo premium para times digitais</h2>
```

```diff
--- a/apps/web/src/components/ui/HeroRobotImage.tsx
+++ b/apps/web/src/components/ui/HeroRobotImage.tsx
@@
+export function HeroRobotImage({ className, style, srcCandidates }: HeroRobotImageProps) {
+  const candidates = useMemo(() => srcCandidates ?? [], [srcCandidates]);
+  const [index, setIndex] = useState(0);
+  const src = candidates[index];
+  if (!src) return null;
+  return (
+    <img src={src} alt="" className={className} style={{ transform: "scaleX(-1)", transformOrigin: "center", ...style }}
+         onError={() => setIndex((i) => (i < candidates.length - 1 ? i + 1 : i))} decoding="async" loading="eager" />
+  );
+}
```

```diff
--- a/apps/web/src/styles/globals.css
+++ b/apps/web/src/styles/globals.css
@@  /* Icon utilities + link-cta */
.icon-row { @apply inline-flex items-center gap-2 align-middle; }
.icon { @apply inline-block shrink-0 align-middle; }
.icon-5 { @apply h-5 w-5; }
.icon-6 { @apply h-6 w-6; }
.link-cta { @apply underline underline-offset-4 decoration-white/30 hover:decoration-white; }
.link-cta:has(svg) { @apply inline-flex items-center gap-2 align-middle; }
.link-cta svg { @apply icon icon-5; }
@@  /* Lighting System */
.ts-grid::before { background-image: repeating-linear-gradient(0deg, hsl(var(--foreground)/0.06) 0 1px, transparent 1px 48px), repeating-linear-gradient(90deg, hsl(var(--foreground)/0.06) 0 1px, transparent 1px 48px); }
.ts-vignette::after { background: radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,.55)); }
```

```diff
--- a/apps/web/next.config.mjs
+++ b/apps/web/next.config.mjs
@@
 async redirects() {
   return [
     { source: "/resources/blog/", destination: "/resources/blog", permanent: true },
     { source: "/modules/", destination: "/modules", permanent: true },
   ];
 },
@@  // loader .md para import estático
 config.module.rules.push({ test: /\.md$/, type: "asset/source" });
```

```diff
--- a/apps/web/src/app/resources/guides/dossie/page.tsx
+++ b/apps/web/src/app/resources/guides/dossie/page.tsx
@@
+import dossie from "@/reports/site-services-audit.md";
+export const metadata = { title: "Dossiê de Serviços — CreAleph", robots: { index: false, follow: false } };
+// Parser leve + TOC; renderiza string Markdown no Edge (sem fs)
```

```diff
--- a/apps/web/src/app/sitemap.ts
+++ b/apps/web/src/app/sitemap.ts
@@
- const now = new Date();
+ const now = new Date(); // usado como lastModified
@@
- changeFrequency: path === "/" ? "weekly" : "monthly",
+ changeFrequency: path === "/" ? "weekly" : "monthly",
```

```diff
--- a/apps/web/src/app/robots.ts
+++ b/apps/web/src/app/robots.ts
@@
- disallow: ["/app"],
+ disallow: ["/app"], // dashboard fora do índice
```

> Observação: diffs acima são “simulados” (sem Git) e mostram apenas os blocos relevantes existentes hoje.

---

## 8) Scripts de verificação (propostos; não aplicados)

- Smoke-nav (Playwright): valida header/footer e H1 das rotas principais
```ts
// tests/smoke-nav.spec.ts (exemplo)
import { test, expect } from '@playwright/test';
const paths = ['/', '/services', '/industries', '/projects', '/resources', '/pricing', '/contact'];
for (const p of paths) {
  test(`200 + H1 em ${p}`, async ({ page }) => {
    await page.goto(`http://localhost:3003${p}`);
    await expect(page).toHaveTitle(/CreAleph|Serviços|Projetos|Recursos|Preços|Contato/i);
    const h1 = page.locator('h1');
    await expect(h1.first()).toBeVisible();
  });
}
```

- Impressão de rotas (Node): lista page.tsx sob `src/app`
```js
// scripts/print-routes.mjs (exemplo)
import { globby } from 'globby';
import { relative } from 'node:path';
const root = 'apps/web/src/app';
const pages = await globby([`${root}/**/page.tsx`]);
for (const f of pages.sort()) {
  const route = '/' + relative(root, f).replace(/\/page\.tsx$/, '').replace(/\\/g, '/');
  console.log(route || '/');
}
```

---

## 9) Checklist manual pós-execução (QA) e rollback
- QA
  - Abrir Home e conferir: textos do Hero (esquerda) intactos e imagem à direita.
  - Verificar `/brand/robo.png` sendo servido (acessar `/brand/robo.png`).
  - Conferir textura (micro‑quadrados + vinheta) em “Resultados…” e “Blog & recursos”.
  - Checar links do Header/Footer (sem barras finais duplicadas) — todos 200.
  - Garantir “Dossiê” aparece no /resources/guides só com `SHOW_INTERNAL_GUIDES=true` (server‑side).
  - Acessar `/resources/guides/dossie` e validar TOC, âncoras e noindex.
  - Rodar Lighthouse/Axe rapidamente (contraste em blocos claros/escuros).
  - Validar redirects de `/resources/blog/` e `/modules/` → sem trailing slash.
  - Verificar sitemap.xml e robots.txt no ambiente (base de `NEXT_PUBLIC_SITE_URL`).
  - Confirmar `/app` permanece placeholder (noindex) e não aparece no sitemap em produção, se desejado.

- Rollback (sem Git)
  - Reverter somente removendo/ajustando os arquivos afetados citados na Seção 6.
  - Para testar, limpe cache local do Next: `rm -rf apps/web/.next apps/web/.turbo` e suba dev novamente.

- Rollback (com Git)
  - `git restore -SW -- <arquivos>` para restaurar individuais.
  - `git reset --hard <commit_anterior>` para reverter tudo (cuidado).

---

## 10) Saída dos comandos (Git)
```
$ git rev-parse --is-inside-work-tree
no

$ git status -s
(n/a)

$ git diff --name-status
(n/a)

$ git diff
(n/a)
```

---

## 11) Observações finais
- Imagem do robô: o componente prioriza `/brand/robo.png`. Certifique-se de que o arquivo exista em `apps/web/public/brand/robo.png` e que o nome/caixa coincida (evitar espaços/acentos). Depois, limpe `.next/.turbo` se a imagem tiver sido trocada.
- As visões do dashboard e o mega‑menu não foram implementados neste passo; permanecem pendências conhecidas.

