import type {
  ExecutionVisibilityArtifactsPresent,
  ExecutionVisibilityCoherenceStatus,
  ExecutionVisibilityContractVersion,
  ExecutionVisibilityGateSummary,
  ExecutionVisibilityGateType,
  ExecutionVisibilityHistoryEntry,
  ExecutionVisibilityInput,
  ExecutionVisibilityLastExecutionByModule,
  ExecutionVisibilityModuleStatus,
  ExecutionVisibilityNextAction,
  ExecutionVisibilityNextActionType,
  ExecutionVisibilityOutput,
} from "./execution-visibility";

type ValidationOk = { ok: true };
type ValidationError = {
  ok: false;
  error: { code: "VALIDATION_ERROR"; message: string; retryable: false };
};

const allowedOutputKeys = new Set([
  "ok",
  "contractVersion",
  "evaluatedAt",
  "tenantId",
  "robotId",
  "coherenceStatus",
  "snapshotAt",
  "artifactsPresent",
  "lastExecutionByModule",
  "gates",
  "builderReadiness",
  "nextActions",
  "history",
]);

const artifactsKeys = [
  "signal",
  "insight",
  "fusion",
  "idea",
  "copy",
  "benchmark",
  "playbook",
  "task",
  "builder_artifact",
];

const moduleKeys = [
  "robots",
  "competitors",
  "fusion",
  "ideator",
  "copywriter",
  "market_twin",
  "playbooks_v1",
  "playbooks_v2",
  "builder",
];

const gateTypes: ExecutionVisibilityGateType[] = [
  "robots_run_gate",
  "market_twin_gate",
  "competitors_insights_gate",
  "fusion_gate",
  "ideator_gate",
  "copywriter_gate",
  "playbooks_v1_gate",
  "playbooks_v2_gate",
];

const nextActionTypes: ExecutionVisibilityNextActionType[] = [
  "robots.run",
  "competitors.run_insights",
  "fusion.run",
  "ideator.run",
  "copywriter.run",
  "market_twin.run",
  "playbooks.v1.run",
  "playbooks.v2.run",
  "builder.run",
];

function fail(message: string): ValidationError {
  return { ok: false, error: { code: "VALIDATION_ERROR", message, retryable: false } };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isIsoDateString(value: unknown): value is string {
  return isNonEmptyString(value) && !Number.isNaN(Date.parse(value));
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isInteger(value: unknown): value is number {
  return isNumber(value) && Number.isInteger(value);
}

function isExecutionVisibilityContractVersion(
  value: unknown,
): value is ExecutionVisibilityContractVersion {
  return value === "v1";
}

function isCoherenceStatus(value: unknown): value is ExecutionVisibilityCoherenceStatus {
  return value === "coherent" || value === "partial" || value === "stale";
}

function isGateType(value: unknown): value is ExecutionVisibilityGateType {
  return typeof value === "string" && gateTypes.includes(value as ExecutionVisibilityGateType);
}

function isNextActionType(value: unknown): value is ExecutionVisibilityNextActionType {
  return typeof value === "string" && nextActionTypes.includes(value as ExecutionVisibilityNextActionType);
}

function assertExactKeys(
  value: Record<string, unknown>,
  keys: string[],
  message: string,
): ValidationOk | ValidationError {
  const valueKeys = Object.keys(value);
  if (valueKeys.length !== keys.length) return fail(message);
  for (const key of keys) {
    if (!(key in value)) return fail(message);
  }
  return { ok: true };
}

export function assertNoExtraTopLevelKeys(output: unknown): ValidationOk | ValidationError {
  if (!isRecord(output)) return fail("output must be an object");
  for (const key of Object.keys(output)) {
    if (!allowedOutputKeys.has(key)) return fail("output has unsupported top-level key");
  }
  return { ok: true };
}

export function validateExecutionVisibilityInput(input: unknown): ValidationOk | ValidationError {
  if (!isRecord(input)) return fail("input must be an object");
  if (!isNonEmptyString(input.tenantId)) return fail("tenantId required");
  if (!isNonEmptyString(input.robotId)) return fail("robotId required");
  if (!isExecutionVisibilityContractVersion(input.contractVersion)) {
    return fail("contractVersion invalid");
  }
  if (!isIsoDateString(input.evaluatedAt)) return fail("evaluatedAt invalid");

  if (input.includeHistory !== undefined && !isBoolean(input.includeHistory)) {
    return fail("includeHistory invalid");
  }
  const historyLimit = input.historyLimit;
  if (historyLimit !== undefined) {
    if (!isInteger(historyLimit)) return fail("historyLimit invalid");
    if (input.includeHistory !== true) return fail("historyLimit requires includeHistory");
    if (historyLimit < 1 || historyLimit > 200) return fail("historyLimit out of range");
  }

  return { ok: true };
}

function validateArtifactsPresent(value: unknown): value is ExecutionVisibilityArtifactsPresent {
  if (!isRecord(value)) return false;
  const exactCheck = assertExactKeys(value, artifactsKeys, "artifactsPresent invalid");
  if (!exactCheck.ok) return false;
  return artifactsKeys.every((key) => isBoolean(value[key]));
}

function validateModuleStatus(value: unknown): value is ExecutionVisibilityModuleStatus {
  if (!isRecord(value)) return false;
  const status = value.status;
  if (
    status !== "never_ran" &&
    status !== "succeeded" &&
    status !== "failed" &&
    status !== "cancelled" &&
    status !== "unknown"
  ) {
    return false;
  }
  if (value.lastEventAt !== null && value.lastEventAt !== undefined && !isIsoDateString(value.lastEventAt)) {
    return false;
  }
  if (value.lastEventType !== null && value.lastEventType !== undefined && !isNonEmptyString(value.lastEventType)) {
    return false;
  }
  if (value.lastReason !== null && value.lastReason !== undefined && !isNonEmptyString(value.lastReason)) {
    return false;
  }
  return true;
}

function validateLastExecutionByModule(
  value: unknown,
): value is ExecutionVisibilityLastExecutionByModule {
  if (!isRecord(value)) return false;
  const exactCheck = assertExactKeys(value, moduleKeys, "lastExecutionByModule invalid");
  if (!exactCheck.ok) return false;
  return moduleKeys.every((key) => validateModuleStatus(value[key]));
}

function validateGateSummary(value: unknown): value is ExecutionVisibilityGateSummary {
  if (!isRecord(value)) return false;
  if (!isGateType(value.gateType)) return false;
  if (value.state !== "failed" && value.state !== "cancelled") return false;
  if (!isNonEmptyString(value.message)) return false;
  if (!isIsoDateString(value.createdAt)) return false;
  return true;
}

function validateNextAction(value: unknown): value is ExecutionVisibilityNextAction {
  if (!isRecord(value)) return false;
  if (!isNextActionType(value.action)) return false;
  if (!isNonEmptyString(value.rationale)) return false;
  if (value.priority !== "low" && value.priority !== "medium" && value.priority !== "high") return false;
  return true;
}

function validateHistoryEntry(value: unknown): value is ExecutionVisibilityHistoryEntry {
  if (!isRecord(value)) return false;
  if (!isIsoDateString(value.createdAt)) return false;
  if (!isNonEmptyString(value.module)) return false;
  if (!isNonEmptyString(value.type)) return false;
  if (!isNonEmptyString(value.state)) return false;
  if (!isNonEmptyString(value.summary)) return false;
  if (!isNonEmptyString(value.id)) return false;
  return true;
}

export function validateExecutionVisibilityOutput(
  output: unknown,
  input?: ExecutionVisibilityInput,
): ValidationOk | ValidationError {
  if (!isRecord(output)) return fail("output must be an object");

  const extraKeysCheck = assertNoExtraTopLevelKeys(output);
  if (!extraKeysCheck.ok) return extraKeysCheck;

  if (!isBoolean(output.ok)) return fail("ok invalid");
  if (!isExecutionVisibilityContractVersion(output.contractVersion)) {
    return fail("contractVersion invalid");
  }
  if (!isIsoDateString(output.evaluatedAt)) return fail("evaluatedAt invalid");
  if (!isNonEmptyString(output.tenantId)) return fail("tenantId invalid");
  if (!isNonEmptyString(output.robotId)) return fail("robotId invalid");
  if (!isCoherenceStatus(output.coherenceStatus)) return fail("coherenceStatus invalid");
  if (!isIsoDateString(output.snapshotAt)) return fail("snapshotAt invalid");

  if (!validateArtifactsPresent(output.artifactsPresent)) return fail("artifactsPresent invalid");
  if (!validateLastExecutionByModule(output.lastExecutionByModule)) {
    return fail("lastExecutionByModule invalid");
  }

  if (!Array.isArray(output.gates)) return fail("gates invalid");
  for (const gate of output.gates) {
    if (!validateGateSummary(gate)) return fail("gate invalid");
  }

  if (!isRecord(output.builderReadiness)) return fail("builderReadiness invalid");
  if (!isBoolean(output.builderReadiness.canDryRun)) return fail("builderReadiness.canDryRun invalid");
  if (
    output.builderReadiness.blockedReason !== null &&
    output.builderReadiness.blockedReason !== undefined &&
    !isNonEmptyString(output.builderReadiness.blockedReason)
  ) {
    return fail("builderReadiness.blockedReason invalid");
  }
  if (!Array.isArray(output.builderReadiness.requiredMissing)) {
    return fail("builderReadiness.requiredMissing invalid");
  }
  for (const item of output.builderReadiness.requiredMissing) {
    if (!isNonEmptyString(item)) return fail("builderReadiness.requiredMissing invalid");
  }

  if (!Array.isArray(output.nextActions)) return fail("nextActions invalid");
  for (const action of output.nextActions) {
    if (!validateNextAction(action)) return fail("nextActions invalid");
  }

  if (output.history !== undefined) {
    if (input?.includeHistory !== true) return fail("history requires includeHistory");
    if (!Array.isArray(output.history)) return fail("history invalid");
    for (const entry of output.history) {
      if (!validateHistoryEntry(entry)) return fail("history invalid");
    }
  }

  return { ok: true };
}
