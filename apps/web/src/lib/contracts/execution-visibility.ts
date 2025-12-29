export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
export type JsonObject = { [key: string]: JsonValue };
export type JsonArray = JsonValue[];

export type ExecutionVisibilityContractVersion = "v1";

export type ExecutionVisibilityInput = {
  tenantId: string;
  robotId: string;
  contractVersion: ExecutionVisibilityContractVersion;
  evaluatedAt: string;
  includeHistory?: boolean;
  historyLimit?: number;
};

export type ExecutionVisibilityCoherenceStatus = "coherent" | "partial" | "stale";

export type ExecutionVisibilityArtifactsPresent = {
  signal: boolean;
  insight: boolean;
  fusion: boolean;
  idea: boolean;
  copy: boolean;
  benchmark: boolean;
  playbook: boolean;
  task: boolean;
  builder_artifact: boolean;
};

export type ExecutionVisibilityModuleStatus = {
  status: "never_ran" | "succeeded" | "failed" | "cancelled" | "unknown";
  lastEventAt: string | null;
  lastEventType: string | null;
  lastReason: string | null;
};

export type ExecutionVisibilityModuleKey =
  | "robots"
  | "competitors"
  | "fusion"
  | "ideator"
  | "copywriter"
  | "market_twin"
  | "playbooks_v1"
  | "playbooks_v2"
  | "builder";

export type ExecutionVisibilityLastExecutionByModule = Record<
  ExecutionVisibilityModuleKey,
  ExecutionVisibilityModuleStatus
>;

export type ExecutionVisibilityGateType =
  | "robots_run_gate"
  | "market_twin_gate"
  | "fusion_gate"
  | "ideator_gate"
  | "copywriter_gate"
  | "playbooks_v1_gate"
  | "playbooks_v2_gate";

export type ExecutionVisibilityGateSummary = {
  gateType: ExecutionVisibilityGateType;
  state: "failed" | "cancelled";
  message: string;
  createdAt: string;
};

export type ExecutionVisibilityBuilderReadiness = {
  canDryRun: boolean;
  blockedReason: string | null;
  requiredMissing: string[];
};

export type ExecutionVisibilityNextActionType =
  | "robots.run"
  | "competitors.run_insights"
  | "fusion.run"
  | "ideator.run"
  | "copywriter.run"
  | "market_twin.run"
  | "playbooks.v1.run"
  | "playbooks.v2.run"
  | "builder.run";

export type ExecutionVisibilityNextAction = {
  action: ExecutionVisibilityNextActionType;
  rationale: string;
  priority: "low" | "medium" | "high";
};

export type ExecutionVisibilityHistoryEntry = {
  createdAt: string;
  module: string;
  type: string;
  state: string;
  summary: string;
  id: string;
};

export type ExecutionVisibilityOutput = {
  ok: boolean;
  contractVersion: ExecutionVisibilityContractVersion;
  evaluatedAt: string;
  tenantId: string;
  robotId: string;
  coherenceStatus: ExecutionVisibilityCoherenceStatus;
  snapshotAt: string;
  artifactsPresent: ExecutionVisibilityArtifactsPresent;
  lastExecutionByModule: ExecutionVisibilityLastExecutionByModule;
  gates: ExecutionVisibilityGateSummary[];
  builderReadiness: ExecutionVisibilityBuilderReadiness;
  nextActions: ExecutionVisibilityNextAction[];
  history?: ExecutionVisibilityHistoryEntry[];
};
