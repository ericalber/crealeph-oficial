import type {
  BuilderCoherenceStatus,
  BuilderExecutionCoherencePolicy,
  BuilderExecutionErrorCode,
  BuilderExecutionEvent,
  BuilderExecutionIdempotencyKey,
  BuilderExecutionState,
  JsonObject,
  JsonValue,
} from "./builder-execution";

type ValidationOk = { ok: true };
type ValidationError = {
  ok: false;
  error: { code: BuilderExecutionErrorCode; message: string; retryable: boolean };
};

type TransitionOk = { ok: true };
type TransitionError = { ok: false; reason: string };

type CoherenceOutcome = {
  allowedTerminalStates: BuilderExecutionState[];
  requiredError?: { code: BuilderExecutionErrorCode; retryable: boolean };
  requiredCancelReason?: string;
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

function isState(value: unknown): value is BuilderExecutionState {
  return (
    value === "planned" ||
    value === "running" ||
    value === "succeeded" ||
    value === "failed" ||
    value === "cancelled"
  );
}

function isCoherenceStatus(value: unknown): value is BuilderCoherenceStatus {
  return value === "coherent" || value === "partial" || value === "stale";
}

function isErrorCode(value: unknown): value is BuilderExecutionErrorCode {
  return (
    value === "COHERENCE_BLOCKED" ||
    value === "MODEL_OUTPUT_INVALID" ||
    value === "VALIDATION_ERROR" ||
    value === "IDEMPOTENCY_CONFLICT"
  );
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

function fail(message: string): ValidationError {
  return { ok: false, error: { code: "VALIDATION_ERROR", message, retryable: false } };
}

export function computeExecutionIdentityKey(
  tenantId: string,
  robotId: string,
  executionId: string,
): BuilderExecutionIdempotencyKey {
  return `${tenantId}:${robotId}:${executionId}`;
}

export function computeExecutionEventIdentityKey(
  executionId: string,
  attempt: number,
  state: BuilderExecutionState,
): string {
  return `${executionId}:${attempt}:${state}`;
}

export function validateExecutionEventShape(event: unknown): ValidationOk | ValidationError {
  if (!isRecord(event)) return fail("event must be an object");

  if (!isNonEmptyString(event.tenantId)) return fail("tenantId required");
  if (!isNonEmptyString(event.robotId)) return fail("robotId required");
  if (event.module !== "agent-builder") return fail("module invalid");
  if (event.source !== "agent-builder") return fail("source invalid");
  if (event.type !== "execution_event") return fail("type invalid");
  if (!isState(event.state)) return fail("state invalid");
  if (!isIsoDateString(event.createdAt)) return fail("createdAt invalid");

  if (!isRecord(event.payload)) return fail("payload invalid");
  const payload = event.payload;

  if (!isNonEmptyString(payload.executionId)) return fail("payload.executionId required");
  if (!isNonEmptyString(payload.workflowVersion)) return fail("payload.workflowVersion required");
  if (!isNonEmptyString(payload.agentVersion)) return fail("payload.agentVersion required");
  if (payload.executionContractVersion !== "v1") {
    return fail("payload.executionContractVersion invalid");
  }
  if (!isNumber(payload.attempt) || !Number.isInteger(payload.attempt) || payload.attempt < 1) {
    return fail("payload.attempt invalid");
  }
  if (!isNonEmptyString(payload.target)) return fail("payload.target required");
  if (!isNonEmptyString(payload.action)) return fail("payload.action required");
  if (!isIsoDateString(payload.snapshotAt)) return fail("payload.snapshotAt invalid");
  const createdAtMs = Date.parse(event.createdAt);
  const snapshotAtMs = Date.parse(payload.snapshotAt);
  if (snapshotAtMs > createdAtMs) {
    return fail("payload.snapshotAt must be <= createdAt");
  }
  if (!isCoherenceStatus(payload.coherenceStatus)) return fail("payload.coherenceStatus invalid");
  if (typeof payload.dryRun !== "boolean") return fail("payload.dryRun invalid");

  if (payload.result !== undefined && !isJsonValue(payload.result)) {
    return fail("payload.result invalid");
  }
  if (payload.externalRefs !== undefined && !isJsonObject(payload.externalRefs)) {
    return fail("payload.externalRefs invalid");
  }
  if (payload.durationMs !== undefined && (!isNumber(payload.durationMs) || payload.durationMs < 0)) {
    return fail("payload.durationMs invalid");
  }

  if (!isRecord(event.lineage)) return fail("lineage invalid");
  const lineage = event.lineage;
  if (!Array.isArray(lineage.dependsOnLedgerIds)) return fail("lineage.dependsOnLedgerIds missing");
  const deps = lineage.dependsOnLedgerIds.filter(
    (id): id is string => isNonEmptyString(id),
  );
  if (deps.length === 0) return fail("lineage.dependsOnLedgerIds empty");
  if (lineage.rerunOfExecutionId !== undefined && !isNonEmptyString(lineage.rerunOfExecutionId)) {
    return fail("lineage.rerunOfExecutionId invalid");
  }

  if (event.state === "failed") {
    if (!isRecord(payload.error)) return fail("payload.error required for failed");
    if (!isErrorCode(payload.error.code)) return fail("payload.error.code invalid");
    if (!isNonEmptyString(payload.error.message)) return fail("payload.error.message invalid");
    if (typeof payload.error.retryable !== "boolean") {
      return fail("payload.error.retryable invalid");
    }
  } else if (payload.error) {
    return fail("payload.error not allowed for non-failed state");
  }

  if (event.state === "cancelled") {
    if (!isNonEmptyString(payload.cancelReason)) return fail("payload.cancelReason required");
  } else if (payload.cancelReason) {
    return fail("payload.cancelReason not allowed for non-cancelled state");
  }

  if ((event.state === "failed" || event.state === "cancelled") && payload.result !== undefined) {
    return fail("payload.result not allowed for failed or cancelled");
  }

  if (payload.coherenceStatus === "stale") {
    if (event.state !== "failed") return fail("stale must be failed");
    const error = isRecord(payload.error) ? payload.error : null;
    if (!error || error.code !== "COHERENCE_BLOCKED") {
      return fail("stale must use COHERENCE_BLOCKED");
    }
    if (error.retryable !== false) return fail("stale must be retryable=false");
  }

  return { ok: true };
}

export function validateExecutionTransition(
  previousState: BuilderExecutionState | null,
  nextState: BuilderExecutionState,
  previousAttempt: number | null,
  nextAttempt: number,
): TransitionOk | TransitionError {
  if (!previousState) return { ok: true };

  if (previousState === "planned") {
    return nextState === "running"
      ? { ok: true }
      : { ok: false, reason: "planned can only transition to running" };
  }

  if (previousState === "running") {
    return nextState === "succeeded" || nextState === "failed" || nextState === "cancelled"
      ? { ok: true }
      : { ok: false, reason: "running can only transition to succeeded, failed, cancelled" };
  }

  if (previousState === "failed") {
    const allowed = nextState === "planned" || nextState === "running";
    const attemptOk =
      typeof previousAttempt === "number" &&
      Number.isInteger(previousAttempt) &&
      nextAttempt > previousAttempt;
    if (!allowed) return { ok: false, reason: "failed can only transition to planned or running" };
    if (!attemptOk) return { ok: false, reason: "failed transition requires attempt increment" };
    return { ok: true };
  }

  if (previousState === "succeeded") {
    return { ok: false, reason: "succeeded is terminal" };
  }

  return { ok: false, reason: "cancelled is terminal" };
}

export function assertCoherenceGatingOutcome(
  coherenceStatus: BuilderCoherenceStatus,
  policy: BuilderExecutionCoherencePolicy,
  dryRun: boolean,
): CoherenceOutcome {
  if (coherenceStatus === "coherent") {
    return {
      allowedTerminalStates: [dryRun ? "succeeded" : "planned"],
    };
  }

  if (coherenceStatus === "partial") {
    if (policy.on_partial === "block") {
      return {
        allowedTerminalStates: ["failed"],
        requiredError: { code: "COHERENCE_BLOCKED", retryable: false },
      };
    }
    return dryRun
      ? { allowedTerminalStates: ["succeeded"] }
      : {
          allowedTerminalStates: ["cancelled"],
          requiredCancelReason: "PARTIAL_REQUIRES_REVIEW",
        };
  }

  return {
    allowedTerminalStates: ["failed"],
    requiredError: { code: "COHERENCE_BLOCKED", retryable: false },
  };
}
