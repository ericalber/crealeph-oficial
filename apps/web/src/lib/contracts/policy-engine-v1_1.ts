export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
export type JsonObject = { [key: string]: JsonValue };
export type JsonArray = JsonValue[];

export type PolicyContractVersionV1_1 = "v1.1";
export type PolicyDecision = "ALLOW" | "BLOCK" | "DEFER";

export type PolicyActionType =
  | "builder.run"
  | "robots.run"
  | "ideator.run"
  | "copywriter.run"
  | "fusion.run"
  | "market_twin.run"
  | "playbooks.v1.run"
  | "playbooks.v2.run"
  | "competitors.run_insights";

export type PolicyRuleId = string;

export type PolicyReason = {
  ruleId: PolicyRuleId;
  message: string;
  severity: "info" | "warn" | "critical";
  evidence: JsonObject;
};

export type PolicyPrerequisiteKey =
  | "signalsAt"
  | "benchmarkAt"
  | "fusionAt"
  | "ideaAt"
  | "copyAt"
  | "playbookAt";

export type PolicyMissingPrerequisite = {
  key: PolicyPrerequisiteKey;
  message: string;
  severity: "info" | "warn" | "critical";
  evidence: JsonObject;
};

export type PolicyRecommendationV1_1 = {
  action: PolicyActionType;
  priority: "low" | "medium" | "high";
  rationale: string;
};

export type PolicyInputV1_1 = {
  tenantId: string;
  robotId: string;
  policyContractVersion: PolicyContractVersionV1_1;
  evaluatedAt: string;
  coherenceStatus: "coherent" | "partial" | "stale";
  snapshotAt: string;
  intelligenceSnapshot: JsonObject;
  ledgerRecency: JsonObject & {
    signalsAt?: string | null;
    fusionAt?: string | null;
    ideaAt?: string | null;
    copyAt?: string | null;
    benchmarkAt?: string | null;
    playbookAt?: string | null;
  };
  requestedAction?: PolicyActionType;
  requestedObjective?: {
    type: string;
    action: string;
  };
  thresholds: JsonObject & {
    minConfidence: number;
    maxStalenessMinutes: number;
    minLineageCount: number;
  };
};

export type PolicyOutputV1_1 = {
  ok: boolean;
  decision: PolicyDecision;
  allowedActions: PolicyActionType[];
  blockedActions: PolicyActionType[];
  deferredActions: PolicyActionType[];
  reasons: PolicyReason[];
  confidence: number;
  readinessScore: number;
  missingPrerequisites: PolicyMissingPrerequisite[];
  recommendedNextActions: PolicyRecommendationV1_1[];
  recommendedRunMode: "dry_run" | "planned";
  policyContractVersion: PolicyContractVersionV1_1;
  evaluatedAt: string;
};
