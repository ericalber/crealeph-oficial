# RFC: Builder Execution Contract v1

## 1) Scope
This RFC defines the immutable execution contract for Builder-driven execution in CreAleph. It specifies execution identity, state transitions, coherence gating, event schema, and validation rules. It does not define new features or endpoints.

## 2) Definitions
- execution: A single Builder run identified by tenantId, robotId, and executionId.
- execution_event: A ledger entry recording the state and outcome of an execution.
- executionId: Client-provided or server-generated identifier for one execution.
- workflowVersion: Version of the orchestration workflow used for the run.
- agentVersion: Version of the execution engine used for the run.
- idempotency: Guarantee that identical event writes do not create duplicate ledger entries.
- retry: A new attempt for the same executionId with incremented attempt.
- rerun: A new execution with a new executionId that MAY reference a prior executionId.
- lineage: Set of ledger ids required to justify the execution output.
- snapshotAt: Timestamp used to bind execution lineage to a snapshot window.
- coherenceStatus: One of coherent, partial, stale based on snapshot coherence rules.

## 3) Canonical execution identity and idempotency
The following rules are mandatory:
- Execution identity key is tenantId, robotId, executionId
- Event identity key is executionId, attempt, state
- For a given executionId, attempt MUST be strictly monotonically increasing across events.
- Duplicate event writes with identical payload and identical lineage are idempotent
- Duplicate event writes with any difference in payload or lineage are IDEMPOTENCY_CONFLICT

## 4) State machine
Valid states are: planned, running, succeeded, failed, cancelled.

Allowed transitions:
- planned MUST transition to running only.
- running MUST transition to succeeded, failed, or cancelled only.
- failed MAY transition to planned or running only with attempt increment.
- succeeded MUST be terminal.
- cancelled MUST be terminal.

## 5) Coherence gating matrix
The following matrix MUST be enforced exactly:
- coherent
  - dryRun true, allowed terminal state succeeded
  - dryRun false, allowed terminal state planned only, because external publishing is not implemented here
- partial
  - policy block, terminal state failed with error code COHERENCE_BLOCKED
  - policy draft_only
    - dryRun true, terminal state succeeded but artifacts remain draft
    - dryRun false, terminal state cancelled with cancelReason PARTIAL_REQUIRES_REVIEW
- stale
  - terminal state failed with error code COHERENCE_BLOCKED, retryable false

## 6) Execution event schema, normative
An execution_event entry MUST include the following fields:
- tenantId: string, MUST be non-empty
- robotId: string, MUST be non-empty
- module: "agent-builder" (literal)
- source: "agent-builder" (literal)
- type: "execution_event" (literal)
- state: planned | running | succeeded | failed | cancelled
- createdAt: ISO 8601 string
- payload: object with
  - executionId: string, MUST be non-empty
  - workflowVersion: string, MUST be non-empty
  - agentVersion: string, MUST be non-empty
  - executionContractVersion: "v1" (literal)
  - attempt: integer >= 1
  - target: string, MUST be non-empty
  - action: string, MUST be non-empty
  - snapshotAt: ISO 8601 string
  - coherenceStatus: coherent | partial | stale
  - dryRun: boolean
  - result: object, MAY be present
  - error: { code, message, retryable }, MAY be present
  - cancelReason: string, MAY be present
  - externalRefs: object, MAY be present
  - durationMs: number, MAY be present
- lineage: object with
  - dependsOnLedgerIds: array of non-empty strings, MUST be non-empty
  - rerunOfExecutionId: string, MAY be present

module, source, and type MUST NOT vary.

## 7) Validation rules
- payload.executionContractVersion MUST be present and MUST equal "v1".
- payload.snapshotAt MUST be a valid ISO 8601 timestamp.
- payload.snapshotAt MUST be less than or equal to createdAt.
- lineage.dependsOnLedgerIds MUST be non-empty and only contain non-empty strings.
- lineage.dependsOnLedgerIds MUST reference ledger entries created at or before snapshotAt.
- If state is failed, payload.error MUST be present.
- If state is cancelled, payload.cancelReason MUST be present.
- If state is succeeded, payload.result SHOULD be present.
- If state is failed or cancelled, payload.result MUST NOT be present.
- If coherenceStatus is stale, state MUST be failed and error.code MUST be COHERENCE_BLOCKED with retryable false.
- The event MUST be JSON safe (no functions, no undefined, no non-serializable values).

## 8) Non goals
- This RFC does NOT define new endpoints or tools.
- This RFC does NOT introduce asynchronous jobs, queues, or workers.
- This RFC does NOT define external publishing behavior.
- This RFC does NOT alter existing runtime behavior.

## 9) Examples, valid and invalid

Valid execution_event
```json
{
  "tenantId": "t-001",
  "robotId": "r-001",
  "module": "agent-builder",
  "source": "agent-builder",
  "type": "execution_event",
  "state": "planned",
  "createdAt": "2025-01-19T10:15:30.000Z",
  "payload": {
    "executionId": "exec-001",
    "workflowVersion": "v1",
    "agentVersion": "v1",
    "executionContractVersion": "v1",
    "attempt": 1,
    "target": "site_builder",
    "action": "plan_site_plan",
    "snapshotAt": "2025-01-19T10:00:00.000Z",
    "coherenceStatus": "coherent",
    "dryRun": false
  },
  "lineage": {
    "dependsOnLedgerIds": ["led-100", "led-200"]
  }
}
```

Invalid execution_event
```json
{
  "tenantId": "t-001",
  "robotId": "r-001",
  "module": "agent-builder",
  "source": "agent-builder",
  "type": "execution_event",
  "state": "failed",
  "createdAt": "2025-01-19T10:15:30.000Z",
  "payload": {
    "executionId": "exec-001",
    "workflowVersion": "v1",
    "agentVersion": "v1",
    "executionContractVersion": "v1",
    "attempt": 1,
    "target": "site_builder",
    "action": "plan_site_plan",
    "snapshotAt": "2025-01-19T10:00:00.000Z",
    "coherenceStatus": "stale",
    "dryRun": false,
    "error": { "code": "MODEL_OUTPUT_INVALID", "message": "bad", "retryable": true }
  },
  "lineage": { "dependsOnLedgerIds": [] }
}
```

Why invalid:
- coherenceStatus is stale but error.code is not COHERENCE_BLOCKED and retryable is true.
- lineage.dependsOnLedgerIds is empty.
