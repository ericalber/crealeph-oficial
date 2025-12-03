# Dossiê CreAleph — Ofertas, Módulos, Gaps e Roadmap

## Resumo Executivo
- Posicionamento: site de serviços “full‑stack” (websites, marketing e automação) com módulos técnicos plugáveis (AQUA, Scout, InsightScore, Market Twin™, Pricing, Bridge/API).
- Ponto forte: arquitetura editorial coerente, CTAs rastreáveis, módulos nomeados, boa base de rotas (services, industries, modules, projects, resources).
- Gaps: ausência de uma trilha clara para “Paid Media” (rota e narrativa dedicadas), paridade incompleta do “Dashboard /app” (placeholder), e algumas seções com conteúdo descritivo que dependem de dados futuros (promessas).
- Oportunidade: empacotar módulos em bundles (Aquisição, Conversão, Retenção) e lançar um “FQS Dashboard” mínimo que cumpra o que a landing promete (acquisition, pricing regional, concorrência/Market Twin, pipeline/Bridge, insights/InsightScore).
- Prioridade 90 dias: rotas e narrativa de Paid Media, guias/templates (SEO), mais estudos de caso, camada mínima do dashboard, e padronização de CTAs/ícones (já iniciada).

---

## 1) Inventário das Ofertas (rotas reais)
Escopo varrido (App Router): `apps/web/src/app`

- Serviços (/services)
  - /services (hub de serviços)
  - /services/marketing (marketing)
  - /services/automation (automação)
  - /services/websites (websites)
- Módulos (/modules)
  - /modules/aqua (AQUA Insights)
  - /modules/scout (Scout)
  - /modules/insightscore (InsightScore™)
  - /modules/market-twin (Market Twin™)
  - /modules/pricing (Precificação/Regional Pricing)
  - /modules/bridge (Bridge/API)
  - /modules (index — placeholder, noindex)
- Indústrias (/industries)
  - /industries (hub)
  - /industries/automotive, /industries/cleaning, /industries/construction, /industries/education, /industries/health, /industries/marinas
- Projetos/Estudos (/projects)
  - /projects (listagem com cards)
  - Cases: /projects/case-marina-vox, /projects/case-clingroup, /projects/case-construtora-norte
- Recursos (/resources)
  - /resources (hub)
  - Blog: /resources/blog (+ posts)
  - Guias: /resources/guides (hub) e placeholders: /resources/guides/bridge, /resources/guides/insightscore
  - FAQ/Templates: /resources/faq, /resources/templates (placeholders)
- Outras
  - /developers, /contact, /pricing (+ enterprise), /app (placeholder/noindex)

Menus e CTAs (coerência)
- Header: Home, Serviços, Indústrias, Projetos, Recursos, Preços, Contato; botões “Entrar” (/app) e “Conhecer serviços”.
- Footer: Produto (Serviços, Módulos de IA, Dashboard, Preços), Recursos (Blog, Guias, FAQ, Templates), Empresa (Projetos, Indústrias, Contato), Legal.
- Landing e seções: CTAs com utms por fonte/campanha; cards e blocos com links para módulos e serviços.

---

## 2) Paridade Técnica (ofertas → módulos/execução)
- Websites/Conversão (Services → Websites)
  - Entrega: páginas modulares; “TechAI Pack”.
  - Módulos: AQUA, InsightScore™, Scout, Bridge.
  - Status: viável hoje.
- Marketing Inteligente (Services → Marketing)
  - Entrega: campanhas multi‑canal, editorial, ABM.
  - Módulos: AQUA, Scout, Market Twin™, InsightScore™, Bridge.
  - Gap: “Paid Media” carece de rota/narrativa dedicada.
- Automação (Services → Automation)
  - Entrega: playbooks e integrações (Bridge).
  - Módulos: Bridge/API (core), InsightScore™, Scout.
  - Status: viável hoje.
- Precificação/Posicionamento (Market Twin™, Pricing)
  - Entrega: percentis, tarifas regionais, posicionamento.
  - Integrações: Bridge → gateways/ERPs.
  - Status: viável hoje.
- Inteligência (AQUA, Scout, InsightScore™)
  - AQUA: linguagem por praça; Scout: concorrência; InsightScore™: priorização.
  - Status: viável; exige dados operacionais.

“Promessas” que dependem de evolução
- Dashboard /app: placeholder.
- “LGPD/logs exportáveis”: requer Bridge + auditoria.
- ABM completo: faltam rotas e cases.

---

## 3) Gaps e Riscos
- Gaps
  - Paid Media sem rota: /services/paid-media (+ filhos: search/social/display/retargeting/youtube-podcast).
  - Dashboard /app sem paridade com a landing.
  - Guias/Templates placeholders (SEO a capturar).
- Riscos UX/SEO
  - Consistência de ícones e texturas (em andamento).
  - “Indústrias” precisa manter cases atualizados por segmento.
  - Metas/metadata por módulo a revisar quando o dashboard nascer.

---

## 4) SWOT + Bundles
- Forças: módulos claros; narrativa forte de pricing/concor­rência; CTAs rastreáveis.
- Fraquezas: falta Paid Media; /app incompleto; placeholders.
- Oportunidades: bundles (Aquisição/Conversão/Retenção) e ladder Starter/Pro/Enterprise; novos cases.
- Ameaças: concorrentes com suites consolidadas; risco de “promessas” sem entrega rápida.

Bundles sugeridos
- Aquisição: Paid Media + Websites (landing); AQUA/Scout/InsightScore™; Bridge (tracking).
- Conversão: Websites (CRO) + Market Twin™/Pricing; AQUA/InsightScore™.
- Retenção/RevOps: Automação + Bridge; Scout (alerts); dashboards.

Ladder (Starter/Pro/Enterprise)
- Starter: Websites + AQUA básico + Bridge leve + 1 canal.
- Pro: + Market Twin™ + Scout + 2–3 canais + automações padrão.
- Enterprise: + Pricing avançado + integrações + SLAs.

---

## 5) Paridade de Dashboard (MVP)
- Aquisição: sessões, leads, CPL, aprovação, tempo de resposta (pageview, form_submit, lead_created/approved; fontes web + Bridge→CRM).
- Pricing Regional/Market Twin™: preço médio por área/categoria, percentis, variações (Twin + CRM).
- Concorrência (Scout): mudanças relevantes, alerts, promessas dominantes.
- Pipeline/Bridge: MQL/SQL, aging, ganho/perda, estágios (Bridge→CRM).
- InsightScore™: hipóteses por impacto/esforço/sazonalidade, % aprovadas, ciclos.
- RBAC: Admin, Marketing, Vendas, Exec (escopos por visão/coluna).

---

## 6) Backlog 90 dias (impacto × esforço)
- [H/M] Paid Media: /services/paid-media (+ filhos)
- [H/M] Dashboard MVP: aquisi­ção/pipeline/pricing/concorrência/InsightScore™
- [H/L] Guias/Templates SEO
- [H/M] Novos cases (3–4 por indústria)
- [M/L] Padronizações (ícones/CTAs), naming visual estável
- [M/L] Observabilidade/SEO técnico (canônicos/meta)

---

## 7) Anexos
- Rotas principais: services, modules, industries (+ filhos), projects (+ cases), resources (+ blog/guides/faq/templates), pricing, app (placeholder/noindex), contact, developers.
- CTAs: header/footer; hero; módulos/serviços/indústrias; projects grid (“Ler estudo completo”).

*** End of Report ***

