# RFC: Builder Contract v1

Status: Final
Owner: CreAleph Core
Last Updated: 2025-01-19

## 1) Definicao do Builder

### O que o Builder e
- O Builder e o orquestrador de geracao de artefatos de inteligencia (idea, copy, playbook, task e planos).
- Opera a partir de snapshots derivados do Ledger e gera saidas estruturadas.
- Registra tudo no Ledger por meio de entradas de artefatos e um execution_event.

### O que o Builder nao e
- Nao e sistema de registro (source of truth).
- Nao executa publicacao externa nem escreve direto em bancos de dominio.
- Nao modifica o Snapshot nem mantem estado proprio.

### Responsabilidade unica
Transformar snapshots coerentes em artefatos planejados, com lineage valida e persistencia Ledger-first.

## 2) Arquitetura

### Snapshot-only reads
- Leitura exclusivamente via Snapshot derivado do Ledger.
- Nenhum acesso direto a entidades de dominio para derivar contexto.

### Ledger-first writes
- Toda saida e persistida primeiro no Ledger.
- Artefatos e execution_event sao append-only.

### Coherence gating
- Se status=stale, a execucao e bloqueada.
- Se status=partial, aplica politica on_partial (block ou draft_only).
- Se status=coherent, a execucao pode prosseguir.

### Idempotencia por executionId
- Identidade de execucao: (tenantId, robotId, executionId).
- Repeticoes idempotentes nao geram novas escritas se payload + lineage forem identicos.
- Divergencias geram erro de conflito de idempotencia.

## 3) Contrato de Entrada

### BuilderRunRequest
Campos obrigatorios:
- robotId: string
- objective_type: "campaign_plan" | "landing_plan" | "seo_cluster" | "paid_media_plan" | "site_plan"
- objective_payload: objeto JSON
- constraints: objeto JSON
- coherence_policy: { on_stale: "block", on_partial: "block" | "draft_only" }
- dryRun: boolean
- workflowVersion: string
- agentVersion: string
- attempt: number (>= 1)

Campos opcionais:
- executionId: string (se ausente, gerado pelo servidor)

### Significado de objective.type e objective.action
- objective.type define o dominio-alvo do plano (site, paid media, seo).
- objective.action e derivado de objective.type com o prefixo plan_ (ex.: plan_campaign_plan).
- objective.action e deterministico e nao e fornecido pelo cliente.

### Politicas de coerencia
- on_stale: "block" (sempre bloqueia)
- on_partial:
  - "block": bloqueia execucao
  - "draft_only": permite gerar artefatos somente como rascunho

## 4) Contrato de Saida

### BuilderRunResponse
- ok: boolean
- executionId: string (pode ser ausente apenas em erro de request invalida)
- state: "planned" | "running" | "succeeded" | "failed" | "cancelled"
- coherence: { status: "coherent" | "partial" | "stale", outdated?: string[], reason?: string }
- artifacts: [{ id: string, type: ArtifactType }]
- error: BuilderErrorCode
- blocking_reason: BuilderErrorCode
- idempotent: boolean

### Estados validos
- planned: execucao planejada, sem aplicacao externa.
- running: reservado para fluxos assincronos futuros.
- succeeded: execucao concluida (dryRun permitido).
- failed: bloqueio ou erro irreversivel.
- cancelled: encerrado por politica (ex.: partial requires review).

### Erros possiveis e retryability
- INVALID_REQUEST: nao retryable.
- SNAPSHOT_EMPTY: retryable apenas apos entrada de novos dados.
- MISSING_LINEAGE: retryable apenas apos restaurar lineage.
- COHERENCE_BLOCKED: nao retryable ate nova coerencia.
- MODEL_OUTPUT_INVALID: retryable.
- IDEMPOTENCY_CONFLICT: nao retryable (requer novo executionId).

## 5) Artefatos

### Tipos de artefato
- idea | copy | playbook | task | site_plan | seo_cluster | paid_plan

### Estrutura de payload
- Objeto JSON arbitrario, sem esquema fixo.
- Deve ser JSON-safe (string | number | boolean | null | arrays | objetos).

### Lineage obrigatoria
- dependsOnLedgerIds: lista nao vazia de ids do Ledger.
- Deve referenciar apenas entradas existentes no snapshotAt usado.
- O execution_event deve conter a uniao de todos os dependsOnLedgerIds dos artefatos.

## 6) Integracao futura

### Compatibilidade com Agent Builder (OpenAI)
- Saidas JSON estruturadas com artifacts[] e dependsOnLedgerIds suportam tool calling e verificacao deterministica.
- O Builder permanece como orquestrador; o Agent Builder e apenas executor.

### Compatibilidade com Jobs assincronos
- execution_event.state="running" e reservado para job workers.
- attempt e workflowVersion suportam retries controlados.

### Versionamento do contrato
- Este contrato e versionado (v1).
- Alteracoes futuras DEVEM manter backward compatibility ou introduzir v2.

## Limitacoes explicitas
- A validacao de allowedLedgerIds depende do contexto do snapshot e e aplicada no endpoint, nao no validador puro.
