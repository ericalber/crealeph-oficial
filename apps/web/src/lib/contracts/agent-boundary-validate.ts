import type {
  AgentArtifact,
  AgentArtifactType,
  AgentErrorCode,
  AgentInput,
  AgentOutput,
  JsonObject,
  JsonValue,
} from "./agent-boundary";

type ValidationOk = { ok: true };
type ValidationError = {
  ok: false;
  error: { code: AgentErrorCode; message: string; retryable: boolean };
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

function fail(message: string): ValidationError {
  return { ok: false, error: { code: "VALIDATION_ERROR", message, retryable: false } };
}

const allowedOutputKeys = new Set([
  "ok",
  "executionId",
  "status",
  "artifacts",
  "error",
  "diagnostics",
]);

const allowedObjectiveTypes = new Set([
  "site_plan",
  "landing_plan",
  "paid_media_plan",
  "seo_cluster",
  "campaign_plan",
]);

const allowedObjectiveActions = new Set(["plan", "draft", "apply"]);

const allowedArtifactTypes = new Set([
  "idea",
  "copy",
  "playbook",
  "task",
  "site_plan",
  "seo_cluster",
  "paid_plan",
]);

const allowedErrorCodes = new Set([
  "COHERENCE_BLOCKED",
  "MODEL_OUTPUT_INVALID",
  "VALIDATION_ERROR",
]);

export function computeAgentRunIdentityKey(
  tenantId: string,
  robotId: string,
  executionId: string,
): string {
  return `${tenantId}:${robotId}:${executionId}`;
}

export function computeAgentRunEventKey(executionId: string, attempt: number): string {
  return `${executionId}:${attempt}`;
}

export function validateAgentInput(input: unknown): ValidationOk | ValidationError {
  if (!isRecord(input)) return fail("input must be an object");

  if (!isNonEmptyString(input.tenantId)) return fail("tenantId required");
  if (!isNonEmptyString(input.robotId)) return fail("robotId required");
  if (!isNonEmptyString(input.executionId)) return fail("executionId required");
  if (!isNumber(input.attempt) || !Number.isInteger(input.attempt) || input.attempt < 1) {
    return fail("attempt invalid");
  }
  if (!isNonEmptyString(input.workflowVersion)) return fail("workflowVersion required");
  if (!isNonEmptyString(input.agentVersion)) return fail("agentVersion required");
  if (input.boundaryContractVersion !== "v1") {
    return fail("boundaryContractVersion invalid");
  }
  if (input.runMode !== "dry_run" && input.runMode !== "execute") {
    return fail("runMode invalid");
  }
  if (!isIsoDateString(input.snapshotAt)) return fail("snapshotAt invalid");
  if (input.coherenceStatus !== "coherent" && input.coherenceStatus !== "partial" && input.coherenceStatus !== "stale") {
    return fail("coherenceStatus invalid");
  }
  if (!isJsonObject(input.constraints)) return fail("constraints invalid");
  if (!isRecord(input.objective)) return fail("objective invalid");
  if (!allowedObjectiveTypes.has(input.objective.type as string)) {
    return fail("objective.type invalid");
  }
  if (!allowedObjectiveActions.has(input.objective.action as string)) {
    return fail("objective.action invalid");
  }
  if (!isJsonObject(input.objective.payload)) return fail("objective.payload invalid");
  if (!isJsonObject(input.intelligenceSnapshot)) return fail("intelligenceSnapshot invalid");
  if (!isRecord(input.allowedLineage)) return fail("allowedLineage invalid");
  if (!Array.isArray(input.allowedLineage.dependsOnLedgerIds)) {
    return fail("allowedLineage.dependsOnLedgerIds missing");
  }
  const allowedDependsOn = input.allowedLineage.dependsOnLedgerIds.filter(
    (id): id is string => isNonEmptyString(id),
  );
  if (allowedDependsOn.length === 0) return fail("allowedLineage.dependsOnLedgerIds empty");
  if (!Array.isArray(input.allowedArtifactTypes) || input.allowedArtifactTypes.length === 0) {
    return fail("allowedArtifactTypes invalid");
  }
  const types = input.allowedArtifactTypes as AgentArtifactType[];
  if (!types.every((type) => allowedArtifactTypes.has(type))) {
    return fail("allowedArtifactTypes contains invalid type");
  }
  if (!isNonEmptyString(input.outputSchemaVersion)) {
    return fail("outputSchemaVersion required");
  }
  if (input.runMode === "execute" && input.coherenceStatus === "stale") {
    return fail("execute not allowed when coherenceStatus is stale");
  }

  return { ok: true };
}

export function assertAllowedArtifactTypes(
  artifacts: AgentArtifact[],
  allowedTypes: AgentArtifactType[],
): ValidationOk | ValidationError {
  const allowed = new Set(allowedTypes);
  for (const artifact of artifacts) {
    if (!allowed.has(artifact.type)) return fail("artifact type not allowed");
  }
  return { ok: true };
}

export function assertLineageSubset(
  artifactDependsOn: string[],
  allowedDependsOn: string[],
): ValidationOk | ValidationError {
  const allowed = new Set(allowedDependsOn);
  for (const id of artifactDependsOn) {
    if (!allowed.has(id)) return fail("artifact dependsOnLedgerIds not allowed");
  }
  return { ok: true };
}

export function validateAgentOutput(
  output: unknown,
  input: AgentInput,
): ValidationOk | ValidationError {
  if (!isRecord(output)) return fail("output must be an object");

  for (const key of Object.keys(output)) {
    if (!allowedOutputKeys.has(key)) return fail("output has unsupported top-level key");
  }

  if (typeof output.ok !== "boolean") return fail("ok invalid");
  if (!isNonEmptyString(output.executionId)) return fail("executionId required");
  if (output.status !== "succeeded" && output.status !== "blocked" && output.status !== "failed") {
    return fail("status invalid");
  }

  if (output.error !== undefined) {
    if (!isRecord(output.error)) return fail("error invalid");
    if (!allowedErrorCodes.has(output.error.code as string)) {
      return fail("error.code invalid");
    }
    if (!isNonEmptyString(output.error.message)) return fail("error.message invalid");
    if (typeof output.error.retryable !== "boolean") {
      return fail("error.retryable invalid");
    }
  }

  if (output.diagnostics !== undefined && !isJsonObject(output.diagnostics)) {
    return fail("diagnostics invalid");
  }

  if (output.status === "succeeded") {
    if (!Array.isArray(output.artifacts) || output.artifacts.length === 0) {
      return fail("artifacts required for succeeded");
    }
  }

  if (output.artifacts !== undefined) {
    if (!Array.isArray(output.artifacts)) return fail("artifacts invalid");
    const artifacts = output.artifacts as AgentArtifact[];
    for (const artifact of artifacts) {
      if (!isRecord(artifact)) return fail("artifact invalid");
      if (!allowedArtifactTypes.has(artifact.type)) return fail("artifact.type invalid");
      if (!isJsonObject(artifact.payload)) return fail("artifact.payload invalid");
      if (!Array.isArray(artifact.dependsOnLedgerIds)) return fail("artifact.dependsOnLedgerIds missing");
      const dependsOn = artifact.dependsOnLedgerIds.filter(
        (id): id is string => isNonEmptyString(id),
      );
      if (dependsOn.length === 0) return fail("artifact.dependsOnLedgerIds empty");
      const subset = assertLineageSubset(dependsOn, input.allowedLineage.dependsOnLedgerIds);
      if (!subset.ok) return subset;
      if (!isRecord(artifact.metadata)) return fail("artifact.metadata invalid");
      if (!isIsoDateString(artifact.metadata.generatedAt)) {
        return fail("artifact.metadata.generatedAt invalid");
      }
      if (artifact.metadata.model !== undefined && !isNonEmptyString(artifact.metadata.model)) {
        return fail("artifact.metadata.model invalid");
      }
      if (
        artifact.metadata.tokensUsed !== undefined &&
        (!isNumber(artifact.metadata.tokensUsed) || artifact.metadata.tokensUsed < 0)
      ) {
        return fail("artifact.metadata.tokensUsed invalid");
      }
    }
    const typesOk = assertAllowedArtifactTypes(artifacts, input.allowedArtifactTypes);
    if (!typesOk.ok) return typesOk;
  }

  return { ok: true };
}
