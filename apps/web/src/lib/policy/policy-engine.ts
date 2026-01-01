import type {
  JsonObject,
  PolicyActionType,
  PolicyInput,
  PolicyOutput,
  PolicyReason,
} from "@/lib/contracts/policy-engine";
import { validatePolicyOutput } from "@/lib/contracts/policy-engine-validate";

const ALL_ACTIONS: PolicyActionType[] = [
  "builder.run",
  "robots.run",
  "ideator.run",
  "copywriter.run",
  "fusion.run",
  "market_twin.run",
  "playbooks.v1.run",
  "playbooks.v2.run",
  "competitors.run_insights",
];

const ACTION_RECENCY_REQUIREMENTS: Record<PolicyActionType, string[][]> = {
  "builder.run": [["signalsAt"], ["fusionAt"]],
  "robots.run": [],
  "ideator.run": [["signalsAt", "fusionAt"]],
  "copywriter.run": [["ideaAt"], ["signalsAt", "fusionAt"]],
  "fusion.run": [],
  "market_twin.run": [["signalsAt"]],
  "playbooks.v1.run": [["fusionAt"], ["ideaAt"], ["benchmarkAt"]],
  "playbooks.v2.run": [["fusionAt"], ["ideaAt"], ["benchmarkAt"]],
  "competitors.run_insights": [],
};

function dedupe(values: PolicyActionType[]): PolicyActionType[] {
  return Array.from(new Set(values));
}

function isIsoDateString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0 && !Number.isNaN(Date.parse(value));
}

function computeDraftOnlyAllowed(input: PolicyInput): boolean {
  return input.thresholds.minLineageCount === 0;
}

type RecencyCheck = {
  ok: boolean;
  missingKeys: string[];
  staleKeys: string[];
  usedTimestamps: Record<string, string>;
};

function checkRecency(
  input: PolicyInput,
  action: PolicyActionType,
): RecencyCheck {
  const requirements = ACTION_RECENCY_REQUIREMENTS[action] ?? [];
  if (requirements.length === 0) {
    return { ok: true, missingKeys: [], staleKeys: [], usedTimestamps: {} };
  }

  const nowMs = Date.parse(input.evaluatedAt);
  const maxAgeMs = input.thresholds.maxStalenessMinutes * 60 * 1000;
  const recency = input.ledgerRecency as Record<string, unknown>;

  const missingKeys: string[] = [];
  const staleKeys: string[] = [];
  const usedTimestamps: Record<string, string> = {};

  for (const group of requirements) {
    let bestKey: string | null = null;
    let bestTime = -1;
    let foundAny = false;

    for (const key of group) {
      const raw = recency[key];
      if (!isIsoDateString(raw)) {
        missingKeys.push(key);
        continue;
      }
      foundAny = true;
      const timeMs = Date.parse(raw);
      const ageMs = nowMs - timeMs;
      if (ageMs <= maxAgeMs && timeMs > bestTime) {
        bestTime = timeMs;
        bestKey = key;
      }
    }

    if (bestKey) {
      usedTimestamps[bestKey] = new Date(bestTime).toISOString();
      continue;
    }

    if (foundAny) {
      for (const key of group) {
        const raw = recency[key];
        if (isIsoDateString(raw)) {
          staleKeys.push(key);
        }
      }
    }
  }

  const ok = requirements.every((group) => {
    return group.some((key) => Object.prototype.hasOwnProperty.call(usedTimestamps, key));
  });

  return { ok, missingKeys, staleKeys, usedTimestamps };
}

function buildReason(
  ruleId: string,
  message: string,
  severity: "info" | "warn" | "critical",
  evidence: Record<string, unknown>,
): PolicyReason {
  return {
    ruleId,
    message,
    severity,
    evidence: evidence as unknown as JsonObject,
  };
}

export function evaluatePolicy(input: PolicyInput): PolicyOutput {
  let decision: PolicyOutput["decision"] = "DEFER";
  let allowedActions: PolicyActionType[] = [];
  let blockedActions: PolicyActionType[] = [];
  let deferredActions: PolicyActionType[] = [];
  let reasons: PolicyReason[] = [];
  let confidence = 0.5;

  if (input.coherenceStatus === "stale") {
    decision = "BLOCK";
    blockedActions = [...ALL_ACTIONS];
    reasons = [
      buildReason(
        "coherence.stale.block",
        "Coherence status is stale; execution actions are blocked.",
        "critical",
        {
          coherenceStatus: input.coherenceStatus,
          snapshotAt: input.snapshotAt,
          evaluatedAt: input.evaluatedAt,
        },
      ),
    ];
    confidence = 0.95;
  } else if (input.coherenceStatus === "partial") {
    const draftOnlyAllowed = computeDraftOnlyAllowed(input);
    if (draftOnlyAllowed) {
      decision = "ALLOW";
      allowedActions = ["builder.run"];
      deferredActions = ALL_ACTIONS.filter((action) => action !== "builder.run");
      reasons = [
        buildReason(
          "coherence.partial.draft_only",
          "Coherence is partial; only draft-only builder runs are allowed.",
          "warn",
          {
            coherenceStatus: input.coherenceStatus,
            thresholds: input.thresholds,
            allowedActions: ["builder.run"],
          },
        ),
      ];
      confidence = 0.7;
    } else {
      decision = "DEFER";
      deferredActions = input.requestedAction ? [input.requestedAction] : [...ALL_ACTIONS];
      reasons = [
        buildReason(
          "coherence.partial.defer",
          "Coherence is partial; execution is deferred pending review.",
          "warn",
          {
            coherenceStatus: input.coherenceStatus,
            thresholds: input.thresholds,
          },
        ),
      ];
      confidence = 0.6;
    }
  } else {
    const requestedAction = input.requestedAction ?? null;
    if (!requestedAction) {
      decision = "DEFER";
      deferredActions = [...ALL_ACTIONS];
      reasons = [
        buildReason(
          "coherence.coherent.no_action",
          "Coherence is coherent but no requestedAction was provided.",
          "warn",
          { coherenceStatus: input.coherenceStatus },
        ),
      ];
      confidence = 0.5;
    } else {
      const recency = checkRecency(input, requestedAction);
      if (!recency.ok) {
        decision = "DEFER";
        deferredActions = [requestedAction];
        reasons = [
          buildReason(
            "recency.stale_or_missing",
            "Required recency timestamps are missing or stale.",
            "warn",
            {
              action: requestedAction,
              missingKeys: recency.missingKeys,
              staleKeys: recency.staleKeys,
              maxStalenessMinutes: input.thresholds.maxStalenessMinutes,
            },
          ),
        ];
        confidence = 0.55;
      } else {
        decision = "ALLOW";
        allowedActions = [requestedAction];
        reasons = [
          buildReason(
            "coherence.coherent.allow",
            "Coherence is coherent and recency thresholds are met.",
            "info",
            {
              action: requestedAction,
              usedTimestamps: recency.usedTimestamps,
              maxStalenessMinutes: input.thresholds.maxStalenessMinutes,
            },
          ),
        ];
        confidence = 0.9;
      }
    }
  }

  const output: PolicyOutput = {
    ok: true,
    decision,
    allowedActions: dedupe(allowedActions),
    blockedActions: dedupe(blockedActions),
    deferredActions: dedupe(deferredActions),
    reasons,
    confidence,
    policyContractVersion: "v1",
    evaluatedAt: input.evaluatedAt,
  };

  const validation = validatePolicyOutput(output, input);
  if (!validation.ok) {
    throw new Error("POLICY_OUTPUT_INVALID");
  }

  return output;
}
