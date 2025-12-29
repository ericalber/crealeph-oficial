# Execution Visibility Contract v1

## Scope
This contract defines a deterministic, read-only visibility model for reporting the current execution status of a robot. It standardizes inputs and outputs used by the dashboard to explain what executed, what was blocked, and what prerequisites exist, strictly derived from the Ledger and Snapshot.

## Non-goals
- This contract MUST NOT initiate execution, scheduling, retries, or automation.
- This contract MUST NOT write to the Ledger or database.
- This contract MUST NOT alter existing orchestration, policy, or execution behavior.

## Input Schema (Normative)
ExecutionVisibilityInput v1 MUST include:
- tenantId: string, non-empty
- robotId: string, non-empty
- contractVersion: "v1"
- evaluatedAt: ISO 8601 string

Optional fields:
- includeHistory: boolean, default false
- historyLimit: integer 1..200, only used when includeHistory is true

## Output Schema (Normative)
ExecutionVisibilityOutput v1 MUST include only the following top-level keys:
- ok: boolean
- contractVersion: "v1"
- evaluatedAt: ISO 8601 string
- tenantId: string
- robotId: string
- coherenceStatus: "coherent" | "partial" | "stale"
- snapshotAt: ISO 8601 string
- artifactsPresent: object with boolean keys:
  - signal, insight, fusion, idea, copy, benchmark, playbook, task, builder_artifact
- lastExecutionByModule: object keyed by module:
  - robots, competitors, fusion, ideator, copywriter, market_twin, playbooks_v1, playbooks_v2, builder
  Each value MUST include:
  - status: "never_ran" | "succeeded" | "failed" | "cancelled" | "unknown"
  - lastEventAt: ISO 8601 string or null
  - lastEventType: string or null
  - lastReason: string or null
- gates: array of gate summaries, most recent per gate type:
  - gateType: "robots_run_gate" | "market_twin_gate" | "fusion_gate" | "ideator_gate" | "copywriter_gate" | "playbooks_v1_gate" | "playbooks_v2_gate"
  - state: "failed" | "cancelled"
  - message: string (error.code or cancelReason)
  - createdAt: ISO 8601 string
- builderReadiness:
  - canDryRun: boolean
  - blockedReason: string or null
  - requiredMissing: string[]
- nextActions: array of read-only recommendations:
  - action: "robots.run" | "competitors.run_insights" | "fusion.run" | "ideator.run" | "copywriter.run" | "market_twin.run" | "playbooks.v1.run" | "playbooks.v2.run" | "builder.run"
  - rationale: string, non-empty
  - priority: "low" | "medium" | "high"
- history: optional array, only present when includeHistory is true:
  - createdAt, module, type, state, summary, id (all strings, non-empty)

## Determinism Rules
- Output MUST be deterministic for identical Ledger and Snapshot state.
- Output MUST NOT include randomness or time-window heuristics beyond evaluatedAt and snapshotAt reporting.

## Source-of-Truth Mapping Rules
- coherenceStatus and snapshotAt MUST be derived from the Snapshot.
- artifactsPresent MUST be derived from Snapshot payload presence, with Ledger used only when Snapshot does not include the artifact type.
- lastExecutionByModule MUST be derived from the latest relevant Ledger entry:
  - robots: latest type "signal" or "robots_run_gate"
  - market_twin: latest type "benchmark" or "market_twin_gate"
  - fusion: latest type "fusion" or "fusion_gate"
  - ideator: latest type "idea" or "ideator_gate"
  - copywriter: latest type "copy" or "copywriter_gate"
  - playbooks_v1: latest type "playbook" (source playbooks v1) or "playbooks_v1_gate"
  - playbooks_v2: latest type "playbook" or "task" (source playbooks v2) or "playbooks_v2_gate"
  - builder: latest type "execution_event" (module=agent-builder) or artifacts (module=builder)
- gates MUST include only the latest event per gate type.

## Example (Valid)
{
  "ok": true,
  "contractVersion": "v1",
  "evaluatedAt": "2025-01-10T12:00:00.000Z",
  "tenantId": "demo-tenant",
  "robotId": "robot_123",
  "coherenceStatus": "partial",
  "snapshotAt": "2025-01-10T11:58:00.000Z",
  "artifactsPresent": {
    "signal": true,
    "insight": false,
    "fusion": true,
    "idea": false,
    "copy": false,
    "benchmark": true,
    "playbook": false,
    "task": false,
    "builder_artifact": false
  },
  "lastExecutionByModule": {
    "robots": { "status": "succeeded", "lastEventAt": "2025-01-10T11:50:00.000Z", "lastEventType": "signal", "lastReason": null },
    "competitors": { "status": "never_ran", "lastEventAt": null, "lastEventType": null, "lastReason": null },
    "fusion": { "status": "succeeded", "lastEventAt": "2025-01-10T11:55:00.000Z", "lastEventType": "fusion", "lastReason": null },
    "ideator": { "status": "never_ran", "lastEventAt": null, "lastEventType": null, "lastReason": null },
    "copywriter": { "status": "never_ran", "lastEventAt": null, "lastEventType": null, "lastReason": null },
    "market_twin": { "status": "succeeded", "lastEventAt": "2025-01-10T11:52:00.000Z", "lastEventType": "benchmark", "lastReason": null },
    "playbooks_v1": { "status": "never_ran", "lastEventAt": null, "lastEventType": null, "lastReason": null },
    "playbooks_v2": { "status": "never_ran", "lastEventAt": null, "lastEventType": null, "lastReason": null },
    "builder": { "status": "never_ran", "lastEventAt": null, "lastEventType": null, "lastReason": null }
  },
  "gates": [],
  "builderReadiness": {
    "canDryRun": true,
    "blockedReason": null,
    "requiredMissing": ["idea", "copy", "playbook"]
  },
  "nextActions": [
    { "action": "ideator.run", "rationale": "No idea artifact found.", "priority": "high" }
  ]
}

## Example (Invalid)
{
  "ok": true,
  "contractVersion": "v1",
  "evaluatedAt": "not-a-date",
  "tenantId": "demo-tenant",
  "robotId": "robot_123",
  "coherenceStatus": "partial",
  "snapshotAt": "2025-01-10T11:58:00.000Z",
  "artifactsPresent": { "signal": true }
}

Why invalid:
- evaluatedAt is not a valid ISO 8601 string.
- artifactsPresent is missing required keys.
- Output is missing required top-level keys.
