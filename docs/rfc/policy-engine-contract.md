# RFC: Policy Engine Contract v1

## 1) Scope
This RFC defines the immutable contract for the Policy Engine v1 in CreAleph. The Policy Engine is a deterministic, advisory decision layer that consumes a provided input snapshot and returns a decision object. It does not execute actions and does not write to the ledger.

## 2) Definitions
- Policy Engine: A deterministic decision layer that evaluates a provided input snapshot.
- PolicyInput: The immutable input payload provided by CreAleph for evaluation.
- PolicyOutput: The decision object returned by the Policy Engine.
- PolicyDecision: One of ALLOW, BLOCK, DEFER.
- PolicyActionType: A string identifier for an action under policy evaluation.
- PolicyRuleId: A stable string identifier for a decision rule.

## 3) Authority model
- CreAleph Orchestrator remains the sole executor and ledger writer.
- The Policy Engine is advisory and deterministic; it returns decisions only.
- The Policy Engine consumes only the provided input; it MUST NOT perform hidden reads.
- The Policy Engine MUST NOT modify any input data.

## 4) Input contract, normative
PolicyInput MUST include:
- tenantId: string, MUST be non-empty
- robotId: string, MUST be non-empty
- policyContractVersion: "v1" (literal)
- evaluatedAt: ISO 8601 string
- coherenceStatus: coherent | partial | stale
- snapshotAt: ISO 8601 string
- intelligenceSnapshot: JSON object, full snapshot computed by CreAleph
- ledgerRecency: JSON object with timestamps per module type, for example:
  - signalsAt
  - fusionAt
  - ideaAt
  - copyAt
  - benchmarkAt
  - playbookAt
- requestedAction: PolicyActionType, MAY be present
- requestedObjective: object with type and action strings, MAY be present
- thresholds: JSON object containing deterministic numeric thresholds, including:
  - minConfidence: number between 0 and 1
  - maxStalenessMinutes: number >= 0
  - minLineageCount: number >= 0

PolicyInput MUST be treated as frozen and read-only.

## 5) Output contract, normative
PolicyOutput MUST include ONLY these top-level keys:
- ok: boolean
- decision: PolicyDecision
- allowedActions: PolicyActionType[]
- blockedActions: PolicyActionType[]
- deferredActions: PolicyActionType[]
- reasons: PolicyReason[], MUST be non-empty
- confidence: number between 0 and 1
- policyContractVersion: "v1" (literal)
- evaluatedAt: ISO 8601 string

PolicyReason MUST include:
- ruleId: PolicyRuleId
- message: string, MUST be non-empty
- severity: info | warn | critical
- evidence: JSON object, JSON safe only

## 6) Deterministic rules, normative
The Policy Engine MUST apply deterministic rules in this order:
1) If coherenceStatus is stale, decision MUST be BLOCK. blockedActions MUST include at least
   builder.run and robots.run. The engine MAY block additional execution actions.
2) If coherenceStatus is partial, decision MUST be DEFER unless thresholds explicitly allow
   draft-only execution. If allowed, the engine MUST allow only builder.run, and the
   orchestrator MUST enforce dry-run semantics.
3) If coherenceStatus is coherent, the engine MAY ALLOW the requestedAction only if all
   ledgerRecency timestamps required for the requestedAction are present and within
   thresholds.maxStalenessMinutes relative to evaluatedAt. Otherwise, the engine MUST DEFER.

Policy Engine decisions MUST be deterministic for the same input.

## 7) Validation rules
- policyContractVersion MUST be present and MUST equal "v1".
- PolicyOutput MUST NOT include extra top-level keys.
- If decision is ALLOW, allowedActions MUST be non-empty.
- If decision is BLOCK, blockedActions MUST be non-empty.
- reasons MUST be non-empty.
- confidence MUST be between 0 and 1 inclusive.
- If coherenceStatus is stale, decision MUST be BLOCK and blockedActions MUST include
  builder.run and robots.run.

## 8) Non goals
- This RFC does NOT define execution logic.
- This RFC does NOT define schedulers, queues, or workers.
- This RFC does NOT define any ledger write behavior.

## 9) Examples, valid and invalid

Valid PolicyOutput
```json
{
  "ok": true,
  "decision": "ALLOW",
  "allowedActions": ["builder.run"],
  "blockedActions": [],
  "deferredActions": [],
  "reasons": [
    {
      "ruleId": "coherence.coherent",
      "message": "Snapshot is coherent and recency thresholds are met.",
      "severity": "info",
      "evidence": { "signalsAt": "2025-01-19T10:00:00.000Z" }
    }
  ],
  "confidence": 0.82,
  "policyContractVersion": "v1",
  "evaluatedAt": "2025-01-19T10:05:00.000Z"
}
```

Invalid PolicyOutput
```json
{
  "ok": true,
  "decision": "ALLOW",
  "allowedActions": [],
  "blockedActions": [],
  "deferredActions": [],
  "reasons": [],
  "confidence": 1.2,
  "policyContractVersion": "v1",
  "evaluatedAt": "2025-01-19T10:05:00.000Z",
  "extra": "not allowed"
}
```

Why invalid:
- allowedActions is empty while decision is ALLOW.
- reasons is empty.
- confidence is out of range.
- extra is an unsupported top-level key.
