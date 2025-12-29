export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
export type JsonObject = { [key: string]: JsonValue };
export type JsonArray = JsonValue[];

export type BuilderExecutionState =
  | "planned"
  | "running"
  | "succeeded"
  | "failed"
  | "cancelled";

export type BuilderCoherenceStatus = "coherent" | "partial" | "stale";

export type BuilderExecutionCoherencePolicy = {
  on_partial: "block" | "draft_only";
};

export type BuilderExecutionErrorCode =
  | "COHERENCE_BLOCKED"
  | "MODEL_OUTPUT_INVALID"
  | "VALIDATION_ERROR"
  | "IDEMPOTENCY_CONFLICT";

export type BuilderExecutionError = {
  code: BuilderExecutionErrorCode;
  message: string;
  retryable: boolean;
};

export type BuilderExecutionPayload = JsonObject & {
  executionId: string;
  workflowVersion: string;
  agentVersion: string;
  executionContractVersion: "v1";
  attempt: number;
  target: string;
  action: string;
  snapshotAt: string;
  coherenceStatus: BuilderCoherenceStatus;
  dryRun: boolean;
  result?: JsonValue;
  error?: BuilderExecutionError;
  cancelReason?: string;
  externalRefs?: JsonObject;
  durationMs?: number;
};

export type BuilderExecutionLineage = JsonObject & {
  dependsOnLedgerIds: string[];
  rerunOfExecutionId?: string;
};

export type BuilderExecutionEvent = {
  tenantId: string;
  robotId: string;
  module: "agent-builder";
  source: "agent-builder";
  type: "execution_event";
  state: BuilderExecutionState;
  createdAt: string;
  payload: BuilderExecutionPayload;
  lineage: BuilderExecutionLineage;
};

export type BuilderExecutionContext = {
  tenantId: string;
  robotId: string;
  snapshotAt: string;
  coherenceStatus: BuilderCoherenceStatus;
  dependsOnLedgerIds: string[];
  objectiveType: string;
  objectiveAction: string;
  workflowVersion: string;
  agentVersion: string;
  dryRun: boolean;
  attempt: number;
  executionId: string;
};

export type BuilderExecutionIdempotencyKey = string;
