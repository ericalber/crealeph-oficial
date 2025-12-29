export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
export type JsonObject = { [key: string]: JsonValue };
export type JsonArray = JsonValue[];

export type PolicyContractVersion = "v1";
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

export type PolicyRecommendation = {
  action: PolicyActionType;
  rationale: string;
  priority: "low" | "medium" | "high";
};

export type PolicyInput = {
  tenantId: string;
  robotId: string;
  policyContractVersion: PolicyContractVersion;
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

export type PolicyOutput = {
  ok: boolean;
  decision: PolicyDecision;
  allowedActions: PolicyActionType[];
  blockedActions: PolicyActionType[];
  deferredActions: PolicyActionType[];
  reasons: PolicyReason[];
  confidence: number;
  policyContractVersion: PolicyContractVersion;
  evaluatedAt: string;
};
