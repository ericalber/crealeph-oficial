import type {
  JsonObject,
  JsonValue,
  PolicyActionType,
  PolicyDecision,
  PolicyInput,
  PolicyOutput,
  PolicyReason,
} from "./policy-engine";

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

function fail(message: string): ValidationError {
  return { ok: false, error: { code: "VALIDATION_ERROR", message, retryable: false } };
}

export function computePolicyIdentityKey(tenantId: string, robotId: string): string {
  return `${tenantId}:${robotId}`;
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

export function assertDeterministicDecision(
  output: PolicyOutput,
  input?: PolicyInput,
): ValidationOk | ValidationError {
  if (output.decision === "ALLOW" && output.allowedActions.length === 0) {
    return fail("allowedActions required for ALLOW");
  }
  if (output.decision === "BLOCK" && output.blockedActions.length === 0) {
    return fail("blockedActions required for BLOCK");
  }
  if (!output.reasons.length) return fail("reasons must be non-empty");

  if (input && input.coherenceStatus === "stale") {
    if (output.decision !== "BLOCK") return fail("stale must be BLOCK");
    if (!output.blockedActions.includes("builder.run")) {
      return fail("stale must block builder.run");
    }
    if (!output.blockedActions.includes("robots.run")) {
      return fail("stale must block robots.run");
    }
  }

  return { ok: true };
}

export function validatePolicyInput(input: unknown): ValidationOk | ValidationError {
  if (!isRecord(input)) return fail("input must be an object");

  if (!isNonEmptyString(input.tenantId)) return fail("tenantId required");
  if (!isNonEmptyString(input.robotId)) return fail("robotId required");
  if (input.policyContractVersion !== "v1") {
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

export function validatePolicyOutput(
  output: unknown,
  input?: PolicyInput,
): ValidationOk | ValidationError {
  if (!isRecord(output)) return fail("output must be an object");

  const extraKeysCheck = assertNoExtraTopLevelKeys(output);
  if (!extraKeysCheck.ok) return extraKeysCheck;

  if (typeof output.ok !== "boolean") return fail("ok invalid");
  if (!isPolicyDecision(output.decision)) return fail("decision invalid");
  if (output.policyContractVersion !== "v1") return fail("policyContractVersion invalid");
  if (!isIsoDateString(output.evaluatedAt)) return fail("evaluatedAt invalid");
  if (!isNumber(output.confidence) || output.confidence < 0 || output.confidence > 1) {
    return fail("confidence invalid");
  }

  if (!Array.isArray(output.allowedActions)) return fail("allowedActions invalid");
  if (!Array.isArray(output.blockedActions)) return fail("blockedActions invalid");
  if (!Array.isArray(output.deferredActions)) return fail("deferredActions invalid");

  if (!output.allowedActions.every(isPolicyActionType)) return fail("allowedActions invalid");
  if (!output.blockedActions.every(isPolicyActionType)) return fail("blockedActions invalid");
  if (!output.deferredActions.every(isPolicyActionType)) return fail("deferredActions invalid");

  if (!Array.isArray(output.reasons) || output.reasons.length === 0) {
    return fail("reasons invalid");
  }

  for (const reason of output.reasons as PolicyReason[]) {
    if (!isRecord(reason)) return fail("reason invalid");
    if (!isNonEmptyString(reason.ruleId)) return fail("reason.ruleId invalid");
    if (!isNonEmptyString(reason.message)) return fail("reason.message invalid");
    if (reason.severity !== "info" && reason.severity !== "warn" && reason.severity !== "critical") {
      return fail("reason.severity invalid");
    }
    if (!isJsonObject(reason.evidence)) return fail("reason.evidence invalid");
  }

  const deterministicCheck = assertDeterministicDecision(output as PolicyOutput, input);
  if (!deterministicCheck.ok) return deterministicCheck;

  return { ok: true };
}
