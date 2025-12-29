import type { ArtifactType, JsonObject, JsonValue } from "./builder-artifacts";

export type BuilderObjectiveType =
  | "campaign_plan"
  | "landing_plan"
  | "seo_cluster"
  | "paid_media_plan"
  | "site_plan";

export type BuilderObjectiveAction = `plan_${BuilderObjectiveType}`;

export type BuilderObjective = {
  type: BuilderObjectiveType;
  payload: JsonObject;
  action: BuilderObjectiveAction;
};

export type BuilderConstraints = JsonObject;

export type BuilderCoherencePolicy = {
  on_stale: "block";
  on_partial: "block" | "draft_only";
};

export type BuilderExecutionState =
  | "planned"
  | "running"
  | "succeeded"
  | "failed"
  | "cancelled";

export type BuilderCoherenceStatus = "coherent" | "partial" | "stale";

export type BuilderErrorCode =
  | "INVALID_REQUEST"
  | "SNAPSHOT_EMPTY"
  | "MISSING_LINEAGE"
  | "COHERENCE_BLOCKED"
  | "MODEL_OUTPUT_INVALID"
  | "IDEMPOTENCY_CONFLICT";

export type BuilderRunRequest = {
  robotId: string;
  objective_type: BuilderObjectiveType;
  objective_payload: JsonObject;
  constraints: BuilderConstraints;
  coherence_policy: BuilderCoherencePolicy;
  dryRun: boolean;
  executionId?: string;
  workflowVersion: string;
  agentVersion: string;
  attempt: number;
};

export type BuilderCoherenceSummary = JsonObject & {
  status: BuilderCoherenceStatus;
  outdated?: string[];
  reason?: string;
};

export type BuilderArtifactReference = {
  id: string;
  type: ArtifactType;
};

export type BuilderRunResponse = {
  ok: boolean;
  executionId?: string;
  state?: BuilderExecutionState;
  coherence?: BuilderCoherenceSummary;
  artifacts?: BuilderArtifactReference[];
  blocking_reason?: BuilderErrorCode;
  error?: BuilderErrorCode;
  idempotent?: boolean;
  result?: JsonValue;
};
