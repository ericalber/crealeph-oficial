import type {
  JsonObject,
  JsonValue,
  PolicyActionType,
  PolicyDecision,
  PolicyInputV1_1,
  PolicyMissingPrerequisite,
  PolicyOutputV1_1,
  PolicyPrerequisiteKey,
  PolicyReason,
  PolicyRecommendationV1_1,
} from "./policy-engine-v1_1";

type ValidationOk = { ok: true };
type ValidationError = {
  ok: false;
  error: { code: "VALIDATION_ERROR"; message: string; retryable: false };
};

const allowedOutputKeys = new Set([
  "ok",
  "decision",
  "allowedActions",
  "blockedActions",
  "deferredActions",
  "reasons",
  "confidence",
  "readinessScore",
  "missingPrerequisites",
  "recommendedNextActions",
  "recommendedRunMode",
  "policyContractVersion",
  "evaluatedAt",
]);

const allowedActionTypes: PolicyActionType[] = [
  "builder.run",
  "robots.run",
  "ideator.run",
  "copywriter.run",
  "fusion.run",
  "market_twin.run",
  "playbooks.v1.run",
  "playbooks.v2.run",
  "competitors.run_insights",
];

const allowedPrerequisiteKeys: PolicyPrerequisiteKey[] = [
  "signalsAt",
  "benchmarkAt",
  "fusionAt",
  "ideaAt",
  "copyAt",
  "playbookAt",
];

const priorityRank: Record<PolicyRecommendationV1_1["priority"], number> = {
  high: 3,
  medium: 2,
  low: 1,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isIsoDateString(value: unknown): value is string {
  return isNonEmptyString(value) && !Number.isNaN(Date.parse(value));
}

function isJsonValue(value: unknown): value is JsonValue {
  if (value === null) return true;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return true;
  }
  if (Array.isArray(value)) {
    return value.every(isJsonValue);
  }
  if (isRecord(value)) {
    return Object.values(value).every(isJsonValue);
  }
  return false;
}

function isJsonObject(value: unknown): value is JsonObject {
  return isRecord(value) && Object.values(value).every(isJsonValue);
}

function isPolicyActionType(value: unknown): value is PolicyActionType {
  return typeof value === "string" && allowedActionTypes.includes(value as PolicyActionType);
}

function isPolicyDecision(value: unknown): value is PolicyDecision {
  return value === "ALLOW" || value === "BLOCK" || value === "DEFER";
}

function isPrerequisiteKey(value: unknown): value is PolicyPrerequisiteKey {
  return typeof value === "string" && allowedPrerequisiteKeys.includes(value as PolicyPrerequisiteKey);
}

function isPriority(value: unknown): value is PolicyRecommendationV1_1["priority"] {
  return value === "low" || value === "medium" || value === "high";
}

function fail(message: string): ValidationError {
  return { ok: false, error: { code: "VALIDATION_ERROR", message, retryable: false } };
}

export function assertNoExtraTopLevelKeys(output: unknown): ValidationOk | ValidationError {
  if (!isRecord(output)) return fail("output must be an object");
  for (const key of Object.keys(output)) {
    if (!allowedOutputKeys.has(key)) {
      return fail("output has unsupported top-level key");
    }
  }
  return { ok: true };
}

export function validatePolicyInputV1_1(input: unknown): ValidationOk | ValidationError {
  if (!isRecord(input)) return fail("input must be an object");

  if (!isNonEmptyString(input.tenantId)) return fail("tenantId required");
  if (!isNonEmptyString(input.robotId)) return fail("robotId required");
  if (input.policyContractVersion !== "v1.1") {
    return fail("policyContractVersion invalid");
  }
  if (!isIsoDateString(input.evaluatedAt)) return fail("evaluatedAt invalid");
  if (!isIsoDateString(input.snapshotAt)) return fail("snapshotAt invalid");
  if (
    input.coherenceStatus !== "coherent" &&
    input.coherenceStatus !== "partial" &&
    input.coherenceStatus !== "stale"
  ) {
    return fail("coherenceStatus invalid");
  }
  if (!isJsonObject(input.intelligenceSnapshot)) {
    return fail("intelligenceSnapshot invalid");
  }
  if (!isJsonObject(input.ledgerRecency)) return fail("ledgerRecency invalid");

  const recency = input.ledgerRecency;
  const recencyFields = [
    "signalsAt",
    "fusionAt",
    "ideaAt",
    "copyAt",
    "benchmarkAt",
    "playbookAt",
  ];
  for (const key of recencyFields) {
    const value = recency[key];
    if (value !== undefined && value !== null && !isIsoDateString(value)) {
      return fail(`ledgerRecency.${key} invalid`);
    }
  }

  if (!isJsonObject(input.thresholds)) return fail("thresholds invalid");
  const thresholds = input.thresholds;
  if (!isNumber(thresholds.minConfidence) || thresholds.minConfidence < 0 || thresholds.minConfidence > 1) {
    return fail("thresholds.minConfidence invalid");
  }
  if (!isNumber(thresholds.maxStalenessMinutes) || thresholds.maxStalenessMinutes < 0) {
    return fail("thresholds.maxStalenessMinutes invalid");
  }
  if (!isNumber(thresholds.minLineageCount) || thresholds.minLineageCount < 0) {
    return fail("thresholds.minLineageCount invalid");
  }

  if (input.requestedAction !== undefined && !isPolicyActionType(input.requestedAction)) {
    return fail("requestedAction invalid");
  }

  if (input.requestedObjective !== undefined) {
    if (!isRecord(input.requestedObjective)) return fail("requestedObjective invalid");
    if (!isNonEmptyString(input.requestedObjective.type)) return fail("requestedObjective.type invalid");
    if (!isNonEmptyString(input.requestedObjective.action)) return fail("requestedObjective.action invalid");
  }

  return { ok: true };
}

function validateReasons(reasons: unknown): ValidationOk | ValidationError {
  if (!Array.isArray(reasons) || reasons.length === 0) {
    return fail("reasons invalid");
  }

  for (const reason of reasons as PolicyReason[]) {
    if (!isRecord(reason)) return fail("reason invalid");
    if (!isNonEmptyString(reason.ruleId)) return fail("reason.ruleId invalid");
    if (!isNonEmptyString(reason.message)) return fail("reason.message invalid");
    if (reason.severity !== "info" && reason.severity !== "warn" && reason.severity !== "critical") {
      return fail("reason.severity invalid");
    }
    if (!isJsonObject(reason.evidence)) return fail("reason.evidence invalid");
  }

  return { ok: true };
}

function validateMissingPrerequisites(value: unknown): ValidationOk | ValidationError {
  if (!Array.isArray(value)) return fail("missingPrerequisites invalid");
  for (const item of value as PolicyMissingPrerequisite[]) {
    if (!isRecord(item)) return fail("missingPrerequisite invalid");
    if (!isPrerequisiteKey(item.key)) return fail("missingPrerequisite.key invalid");
    if (!isNonEmptyString(item.message)) return fail("missingPrerequisite.message invalid");
    if (item.severity !== "info" && item.severity !== "warn" && item.severity !== "critical") {
      return fail("missingPrerequisite.severity invalid");
    }
    if (!isJsonObject(item.evidence)) return fail("missingPrerequisite.evidence invalid");
  }
  return { ok: true };
}

function validateRecommendedActions(value: unknown, decision: PolicyDecision): ValidationOk | ValidationError {
  if (!Array.isArray(value)) return fail("recommendedNextActions invalid");
  const actions = value as PolicyRecommendationV1_1[];
  if (decision === "DEFER" && actions.length === 0) {
    return fail("recommendedNextActions required for DEFER");
  }

  for (const action of actions) {
    if (!isRecord(action)) return fail("recommendedNextAction invalid");
    if (!isPolicyActionType(action.action)) return fail("recommendedNextAction.action invalid");
    if (!isPriority(action.priority)) return fail("recommendedNextAction.priority invalid");
    if (!isNonEmptyString(action.rationale)) return fail("recommendedNextAction.rationale invalid");
  }

  for (let i = 1; i < actions.length; i += 1) {
    const prev = priorityRank[actions[i - 1].priority];
    const current = priorityRank[actions[i].priority];
    if (current > prev) {
      return fail("recommendedNextActions order invalid");
    }
  }

  return { ok: true };
}

export function validatePolicyOutputV1_1(
  output: unknown,
  input?: PolicyInputV1_1,
): ValidationOk | ValidationError {
  if (!isRecord(output)) return fail("output must be an object");

  const extraKeysCheck = assertNoExtraTopLevelKeys(output);
  if (!extraKeysCheck.ok) return extraKeysCheck;

  if (typeof output.ok !== "boolean") return fail("ok invalid");
  if (!isPolicyDecision(output.decision)) return fail("decision invalid");
  if (output.policyContractVersion !== "v1.1") return fail("policyContractVersion invalid");
  if (!isIsoDateString(output.evaluatedAt)) return fail("evaluatedAt invalid");
  if (!isNumber(output.confidence) || output.confidence < 0 || output.confidence > 1) {
    return fail("confidence invalid");
  }
  if (!isNumber(output.readinessScore) || output.readinessScore < 0 || output.readinessScore > 1) {
    return fail("readinessScore invalid");
  }

  if (!Array.isArray(output.allowedActions)) return fail("allowedActions invalid");
  if (!Array.isArray(output.blockedActions)) return fail("blockedActions invalid");
  if (!Array.isArray(output.deferredActions)) return fail("deferredActions invalid");

  if (!output.allowedActions.every(isPolicyActionType)) return fail("allowedActions invalid");
  if (!output.blockedActions.every(isPolicyActionType)) return fail("blockedActions invalid");
  if (!output.deferredActions.every(isPolicyActionType)) return fail("deferredActions invalid");

  const reasonsCheck = validateReasons(output.reasons);
  if (!reasonsCheck.ok) return reasonsCheck;

  const missingCheck = validateMissingPrerequisites(output.missingPrerequisites);
  if (!missingCheck.ok) return missingCheck;

  if (output.recommendedRunMode !== "dry_run" && output.recommendedRunMode !== "planned") {
    return fail("recommendedRunMode invalid");
  }

  const recommendationsCheck = validateRecommendedActions(output.recommendedNextActions, output.decision);
  if (!recommendationsCheck.ok) return recommendationsCheck;

  if (output.decision === "ALLOW" && output.allowedActions.length === 0) {
    return fail("allowedActions required for ALLOW");
  }
  if (output.decision === "BLOCK" && output.blockedActions.length === 0) {
    return fail("blockedActions required for BLOCK");
  }

  if (input && input.coherenceStatus === "stale") {
    if (output.decision !== "BLOCK") return fail("stale must be BLOCK");
    if (output.recommendedRunMode !== "dry_run") return fail("stale must set recommendedRunMode dry_run");
  }

  return { ok: true };
}
