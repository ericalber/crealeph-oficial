import type {
  BuilderCoherencePolicy,
  BuilderCoherenceStatus,
  BuilderErrorCode,
  BuilderObjectiveType,
  BuilderRunRequest,
} from "./builder";
import type { BuilderArtifact, JsonObject, JsonValue } from "./builder-artifacts";

type ValidationOk<T> = { ok: true; value: T };
type ValidationError = { ok: false; error: BuilderErrorCode; reason: string };

type ArtifactValidationOk = { ok: true; artifacts: BuilderArtifact[] };
type ArtifactValidationError = { ok: false; error: BuilderErrorCode; reason: string };

const OBJECTIVE_TYPES: BuilderObjectiveType[] = [
  "campaign_plan",
  "landing_plan",
  "seo_cluster",
  "paid_media_plan",
  "site_plan",
];

const ARTIFACT_TYPES: BuilderArtifact["type"][] = [
  "idea",
  "copy",
  "playbook",
  "task",
  "site_plan",
  "seo_cluster",
  "paid_plan",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
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

function isObjectiveType(value: unknown): value is BuilderObjectiveType {
  return typeof value === "string" && OBJECTIVE_TYPES.some((type) => type === value);
}

function isArtifactType(value: unknown): value is BuilderArtifact["type"] {
  return typeof value === "string" && ARTIFACT_TYPES.some((type) => type === value);
}

function isCoherencePolicy(value: unknown): value is BuilderCoherencePolicy {
  if (!isRecord(value)) return false;
  if (value.on_stale !== "block") return false;
  return value.on_partial === "block" || value.on_partial === "draft_only";
}

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function dedupeSorted(values: string[]) {
  return Array.from(new Set(values)).sort();
}

export function validateBuilderRequest(input: unknown): ValidationOk<BuilderRunRequest> | ValidationError {
  if (!isRecord(input)) {
    return { ok: false, error: "INVALID_REQUEST", reason: "body must be an object" };
  }

  const robotId = normalizeString(input.robotId);
  const objectiveType = input.objective_type;
  const objectivePayload = input.objective_payload;
  const constraints = input.constraints;
  const coherencePolicy = input.coherence_policy;
  const dryRun = input.dryRun;
  const workflowVersion = normalizeString(input.workflowVersion);
  const agentVersion = normalizeString(input.agentVersion);
  const attempt =
    typeof input.attempt === "number" && Number.isInteger(input.attempt) ? input.attempt : NaN;
  const executionId = normalizeString(input.executionId);

  if (!robotId) {
    return { ok: false, error: "INVALID_REQUEST", reason: "robotId required" };
  }
  if (!isObjectiveType(objectiveType)) {
    return { ok: false, error: "INVALID_REQUEST", reason: "objective_type invalid" };
  }
  if (!isJsonObject(objectivePayload)) {
    return { ok: false, error: "INVALID_REQUEST", reason: "objective_payload invalid" };
  }
  if (!isJsonObject(constraints)) {
    return { ok: false, error: "INVALID_REQUEST", reason: "constraints invalid" };
  }
  if (!isCoherencePolicy(coherencePolicy)) {
    return { ok: false, error: "INVALID_REQUEST", reason: "coherence_policy invalid" };
  }
  if (typeof dryRun !== "boolean") {
    return { ok: false, error: "INVALID_REQUEST", reason: "dryRun invalid" };
  }
  if (!workflowVersion) {
    return { ok: false, error: "INVALID_REQUEST", reason: "workflowVersion required" };
  }
  if (!agentVersion) {
    return { ok: false, error: "INVALID_REQUEST", reason: "agentVersion required" };
  }
  if (!Number.isInteger(attempt) || attempt < 1) {
    return { ok: false, error: "INVALID_REQUEST", reason: "attempt invalid" };
  }

  return {
    ok: true,
    value: {
      robotId,
      objective_type: objectiveType,
      objective_payload: objectivePayload,
      constraints,
      coherence_policy: coherencePolicy,
      dryRun,
      executionId: executionId || undefined,
      workflowVersion,
      agentVersion,
      attempt,
    },
  };
}

export function validateBuilderArtifacts(
  artifacts: unknown,
): ArtifactValidationOk | ArtifactValidationError {
  if (!Array.isArray(artifacts) || artifacts.length === 0) {
    return { ok: false, error: "MODEL_OUTPUT_INVALID", reason: "missing artifacts" };
  }

  const sanitized: BuilderArtifact[] = [];
  for (const artifact of artifacts) {
    if (!isRecord(artifact) || !isArtifactType(artifact.type)) {
      return { ok: false, error: "MODEL_OUTPUT_INVALID", reason: "invalid artifact type" };
    }
    if (!isJsonObject(artifact.payload)) {
      return { ok: false, error: "MODEL_OUTPUT_INVALID", reason: "invalid payload" };
    }
    if (!Array.isArray(artifact.dependsOnLedgerIds)) {
      return { ok: false, error: "MODEL_OUTPUT_INVALID", reason: "missing dependsOnLedgerIds" };
    }
    const dependsOnLedgerIds = dedupeSorted(
      artifact.dependsOnLedgerIds.filter(
        (id): id is string => typeof id === "string" && id.trim().length > 0,
      ),
    );
    if (dependsOnLedgerIds.length === 0) {
      return { ok: false, error: "MODEL_OUTPUT_INVALID", reason: "empty dependsOnLedgerIds" };
    }
    sanitized.push({
      type: artifact.type,
      payload: artifact.payload,
      dependsOnLedgerIds,
    });
  }

  return { ok: true, artifacts: sanitized };
}

export function assertCoherencePolicy(
  snapshot: unknown,
  policy: BuilderCoherencePolicy,
): { status: BuilderCoherenceStatus; blocked: boolean; reason?: BuilderErrorCode } {
  const status = (() => {
    if (!isRecord(snapshot)) return "partial";
    const coherence = snapshot.coherence;
    if (!isRecord(coherence)) return "partial";
    const raw = coherence.status;
    if (raw === "coherent" || raw === "partial" || raw === "stale") return raw;
    return "partial";
  })();

  const blocked =
    status === "stale" || (status === "partial" && policy.on_partial === "block");
  return {
    status,
    blocked,
    reason: blocked ? "COHERENCE_BLOCKED" : undefined,
  };
}
