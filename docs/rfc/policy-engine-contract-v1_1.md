# Policy Engine Contract v1.1

## 1) Scope
Policy Engine v1.1 defines a deterministic, read-only decision contract that produces readiness and recommendations alongside ALLOW/BLOCK/DEFER. It MUST NOT execute actions, write to the ledger, or perform any side effects.

## 2) Definitions
- readinessScore: A deterministic number in the range 0..1 indicating readiness based on recency and coherence.
- missingPrerequisites: A list of missing module timestamps for signals, benchmark, fusion, idea, copy, and playbook.
- recommendedNextActions: An ordered list of recommended PolicyActionType values with priority and rationale.
- recommendedRunMode: A run mode recommendation of `dry_run` or `planned` only; `execute` is not permitted.
- decision: One of ALLOW, BLOCK, or DEFER.

## 3) Authority model
- CreAleph Orchestrator is the sole executor and ledger writer.
- Policy Engine is advisory only and MUST return decisions without performing execution.
- Policy Engine consumes only the provided input and MUST NOT read external state.

## 4) Input contract, normative
PolicyInputV1_1 MUST include:
- tenantId: non-empty string.
- robotId: non-empty string.
- policyContractVersion: MUST be "v1.1".
- evaluatedAt: ISO 8601 timestamp string.
- coherenceStatus: "coherent" | "partial" | "stale".
- snapshotAt: ISO 8601 timestamp string.
- intelligenceSnapshot: JSON object (read-only snapshot).
- ledgerRecency: JSON object containing optional ISO timestamps: signalsAt, fusionAt, ideaAt, copyAt, benchmarkAt, playbookAt.
- requestedAction: optional PolicyActionType.
- requestedObjective: optional object with `type` and `action` strings.
- thresholds: JSON object with numeric values:
  - minConfidence (0..1)
  - maxStalenessMinutes (>= 0)
  - minLineageCount (>= 0)

## 5) Output contract, normative
PolicyOutputV1_1 MUST include only these top-level keys:
- ok: boolean.
- decision: "ALLOW" | "BLOCK" | "DEFER".
- allowedActions: PolicyActionType array.
- blockedActions: PolicyActionType array.
- deferredActions: PolicyActionType array.
- reasons: non-empty array of PolicyReason.
- confidence: number in 0..1.
- readinessScore: number in 0..1.
- missingPrerequisites: array of missing module prerequisites.
- recommendedNextActions: ordered array of recommended actions with priority and rationale.
- recommendedRunMode: "dry_run" | "planned".
- policyContractVersion: MUST be "v1.1".
- evaluatedAt: ISO 8601 timestamp string.

## 6) Deterministic rules, normative
- Decisions MUST be derived only from coherenceStatus, snapshotAt, ledgerRecency timestamps, and thresholds.
- If coherenceStatus is "stale":
  - decision MUST be BLOCK.
  - readinessScore MUST be 0.
  - missingPrerequisites MUST include signalsAt and benchmarkAt if missing.
  - recommendedNextActions MUST include "robots.run" followed by "market_twin.run".
  - recommendedRunMode MUST be "dry_run".
- If coherenceStatus is "partial":
  - decision MUST be DEFER unless thresholds.minConfidence is satisfied.
  - recommendedNextActions MUST list the exact missing or stale module steps.
  - recommendedRunMode MUST be "dry_run".
- If coherenceStatus is "coherent":
  - If requestedAction is present and recency requirements are met, decision MAY be ALLOW and readinessScore MUST be high.
  - If required recency is missing or stale, decision MUST be DEFER and recommendedNextActions MUST list the stale upstream step(s).

## 7) Validation rules
- policyContractVersion MUST equal "v1.1".
- No extra top-level keys are permitted in PolicyOutputV1_1.
- reasons MUST be non-empty.
- readinessScore MUST be within 0..1.
- recommendedNextActions MUST be ordered by priority and MUST be non-empty when decision is DEFER.
- If coherenceStatus is "stale", decision MUST be BLOCK and recommendedRunMode MUST be "dry_run".

## 8) Non goals
- No execution, scheduling, or automation is defined.
- No ledger writes or database writes are performed.
- No external API calls are allowed.

## 9) Examples, valid and invalid

Valid example (PolicyOutputV1_1):
```json
{
  "ok": true,
  "decision": "DEFER",
  "allowedActions": [],
  "blockedActions": [],
  "deferredActions": ["builder.run"],
  "reasons": [
    {
      "ruleId": "coherence.partial.defer",
      "message": "Coherence is partial; execution is deferred pending missing prerequisites.",
      "severity": "warn",
      "evidence": { "coherenceStatus": "partial", "missing": ["fusionAt"] }
    }
  ],
  "confidence": 0.6,
  "readinessScore": 0.5,
  "missingPrerequisites": [
    {
      "key": "fusionAt",
      "message": "fusionAt missing",
      "severity": "warn",
      "evidence": { "observed": null }
    }
  ],
  "recommendedNextActions": [
    {
      "action": "fusion.run",
      "priority": "high",
      "rationale": "Fusion timestamp is missing; run fusion to refresh it."
    }
  ],
  "recommendedRunMode": "dry_run",
  "policyContractVersion": "v1.1",
  "evaluatedAt": "2025-01-01T00:00:00.000Z"
}
```

Invalid example (PolicyOutputV1_1):
```json
{
  "ok": true,
  "decision": "DEFER",
  "allowedActions": [],
  "blockedActions": [],
  "deferredActions": ["builder.run"],
  "reasons": [],
  "confidence": 0.6,
  "readinessScore": 0.5,
  "missingPrerequisites": [],
  "recommendedNextActions": [],
  "recommendedRunMode": "planned",
  "policyContractVersion": "v1.1",
  "evaluatedAt": "2025-01-01T00:00:00.000Z"
}
```
This is invalid because reasons is empty and recommendedNextActions is empty while decision is DEFER.
