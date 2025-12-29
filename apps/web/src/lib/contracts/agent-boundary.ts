export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
export type JsonObject = { [key: string]: JsonValue };
export type JsonArray = JsonValue[];

export type AgentBoundaryContractVersion = "v1";
export type AgentRunMode = "dry_run" | "execute";

export type AgentObjectiveType =
  | "site_plan"
  | "landing_plan"
  | "paid_media_plan"
  | "seo_cluster"
  | "campaign_plan";

export type AgentObjectiveAction = "plan" | "draft" | "apply";

export type AgentArtifactType =
  | "idea"
  | "copy"
  | "playbook"
  | "task"
  | "site_plan"
  | "seo_cluster"
  | "paid_plan";

export type AgentErrorCode =
  | "COHERENCE_BLOCKED"
  | "MODEL_OUTPUT_INVALID"
  | "VALIDATION_ERROR";

export type AgentError = {
  code: AgentErrorCode;
  message: string;
  retryable: boolean;
};

export type AgentInput = {
  tenantId: string;
  robotId: string;
  executionId: string;
  attempt: number;
  workflowVersion: string;
  agentVersion: string;
  boundaryContractVersion: AgentBoundaryContractVersion;
  runMode: AgentRunMode;
  snapshotAt: string;
  coherenceStatus: "coherent" | "partial" | "stale";
  constraints: JsonObject;
  objective: {
    type: AgentObjectiveType;
    action: AgentObjectiveAction;
    payload: JsonObject;
  };
  intelligenceSnapshot: JsonObject;
  allowedLineage: {
    dependsOnLedgerIds: string[];
  };
  allowedArtifactTypes: AgentArtifactType[];
  outputSchemaVersion: string;
};

export type AgentArtifact = {
  type: AgentArtifactType;
  payload: JsonObject;
  dependsOnLedgerIds: string[];
  metadata: {
    generatedAt: string;
    model?: string;
    tokensUsed?: number;
  };
};

export type AgentOutput = {
  ok: boolean;
  executionId: string;
  status: "succeeded" | "blocked" | "failed";
  artifacts?: AgentArtifact[];
  error?: AgentError;
  diagnostics?: JsonObject;
};
