# RFC: Agent Boundary Contract v1

## 1) Scope
This RFC defines the immutable boundary contract between CreAleph and external execution engines. It specifies what the external agent receives, what it may return, and what it MUST NOT do. It does not define implementation details or runtime behavior inside CreAleph.

## 2) Definitions
- agent: External, stateless execution runtime that generates artifacts only.
- boundary contract: The strict input/output schema exchanged between CreAleph and the agent.
- executionId: Stable identifier for one execution as defined by CreAleph.
- attempt: Integer attempt counter for the same executionId.
- snapshotAt: ISO timestamp for the frozen intelligence snapshot.
- coherenceStatus: coherent | partial | stale, computed by CreAleph.
- allowedLineage: Set of ledger ids allowed as dependencies for artifacts.

## 3) Authority model
- CreAleph decides, agent executes.
- The snapshot is frozen input; the agent MUST NOT modify or reinterpret it.
- Coherence is enforced upstream; the agent MUST NOT decide or override coherence.
- Lineage is provided by CreAleph; the agent MUST NOT introduce new dependency ids.
- CreAleph is the sole authority for validation, idempotency, and ledger writes.

## 4) Input contract, normative
AgentInput MUST include:
- tenantId: string, MUST be non-empty
- robotId: string, MUST be non-empty
- executionId: string, MUST be non-empty
- attempt: integer >= 1
- workflowVersion: string, MUST be non-empty
- agentVersion: string, MUST be non-empty
- boundaryContractVersion: "v1" (literal)
- runMode: "dry_run" | "execute"
- snapshotAt: ISO 8601 string
- coherenceStatus: coherent | partial | stale
- constraints: JSON object
- objective: object with
  - type: site_plan | landing_plan | paid_media_plan | seo_cluster | campaign_plan
  - action: plan | draft | apply
  - payload: JSON object
- intelligenceSnapshot: JSON object, full snapshot computed by CreAleph
- allowedLineage: object with
  - dependsOnLedgerIds: array of non-empty strings, MUST be non-empty
- allowedArtifactTypes: array of AgentArtifactType, MUST be non-empty
- outputSchemaVersion: string, MUST be non-empty

The agent MUST treat AgentInput as a frozen, read-only payload.

## 5) Output contract, normative
AgentOutput MUST include:
- ok: boolean
- executionId: string, MUST be non-empty
- status: succeeded | blocked | failed
- artifacts: array of AgentArtifact, MAY be absent for blocked or failed
- error: AgentError, MAY be present
- diagnostics: JSON object, MAY be present

AgentArtifact MUST include:
- type: AgentArtifactType
- payload: JSON object
- dependsOnLedgerIds: array of non-empty strings
- metadata: object with
  - generatedAt: ISO 8601 string
  - model: string, MAY be present
  - tokensUsed: number, MAY be present

Critical rule: AgentArtifact.dependsOnLedgerIds MUST be a subset of
AgentInput.allowedLineage.dependsOnLedgerIds. The agent MUST NOT introduce new dependency ids.

## 6) Validation rules
- boundaryContractVersion MUST be present and MUST equal "v1".
- allowedLineage.dependsOnLedgerIds MUST be non-empty.
- allowedArtifactTypes MUST be non-empty.
- runMode execute MUST be blocked if coherenceStatus is stale.
- If status is succeeded, artifacts MUST be present and non-empty.
- Every artifact type MUST be in allowedArtifactTypes.
- Every artifact dependsOnLedgerIds MUST be non-empty and a subset of allowedLineage.
- AgentOutput MUST NOT include any top-level keys beyond the defined contract fields.
- All payloads MUST be JSON safe (no functions, undefined, or non-serializable values).

## 7) Security and privacy constraints
- The agent MUST NOT read any database.
- The agent MUST NOT write to the Ledger directly.
- The agent MUST NOT decide or override coherence.
- The agent MUST NOT invent lineage or dependencies.
- The agent MUST NOT use chat history or memory.
- The agent MUST operate only on the provided frozen input payload.
- The agent MUST NOT persist or exfiltrate snapshot data outside the execution scope.

## 8) Non goals
- This RFC does NOT define endpoints or tools.
- This RFC does NOT define internal CreAleph orchestration logic.
- This RFC does NOT define external publishing behavior.

## 9) Examples, valid and invalid

Valid AgentInput
```json
{
  "tenantId": "t-001",
  "robotId": "r-001",
  "executionId": "exec-001",
  "attempt": 1,
  "workflowVersion": "v1",
  "agentVersion": "v1",
  "boundaryContractVersion": "v1",
  "runMode": "dry_run",
  "snapshotAt": "2025-01-19T10:00:00.000Z",
  "coherenceStatus": "coherent",
  "constraints": { "tone": "professional" },
  "objective": {
    "type": "site_plan",
    "action": "plan",
    "payload": { "site": "example.com" }
  },
  "intelligenceSnapshot": { "signals": [], "fusion": {} },
  "allowedLineage": { "dependsOnLedgerIds": ["led-100", "led-200"] },
  "allowedArtifactTypes": ["site_plan"],
  "outputSchemaVersion": "v1"
}
```

Invalid AgentOutput
```json
{
  "ok": true,
  "executionId": "exec-001",
  "status": "succeeded",
  "artifacts": [
    {
      "type": "site_plan",
      "payload": { "plan": "..." },
      "dependsOnLedgerIds": ["led-999"],
      "metadata": { "generatedAt": "2025-01-19T10:05:00.000Z" }
    }
  ],
  "extra": "not allowed"
}
```

Why invalid:
- dependsOnLedgerIds contains "led-999" which is not allowed.
- extra is an unsupported top-level key.
