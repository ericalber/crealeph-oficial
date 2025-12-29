import type {
  JsonObject,
  PolicyActionType,
  PolicyDecision,
  PolicyInputV1_1,
  PolicyMissingPrerequisite,
  PolicyOutputV1_1,
  PolicyPrerequisiteKey,
  PolicyReason,
  PolicyRecommendationV1_1,
} from "@/lib/contracts/policy-engine-v1_1";
import { validatePolicyOutputV1_1 } from "@/lib/contracts/policy-engine-v1_1-validate";

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

const RECENCY_KEYS: PolicyPrerequisiteKey[] = [
  "signalsAt",
  "benchmarkAt",
  "fusionAt",
  "ideaAt",
  "copyAt",
  "playbookAt",
];

const ACTION_RECENCY_REQUIREMENTS: Record<PolicyActionType, PolicyPrerequisiteKey[]> = {
  "builder.run": ["signalsAt", "fusionAt"],
  "robots.run": [],
  "ideator.run": ["signalsAt", "fusionAt"],
  "copywriter.run": ["ideaAt"],
  "fusion.run": ["signalsAt"],
  "market_twin.run": ["signalsAt"],
  "playbooks.v1.run": ["fusionAt", "ideaAt", "benchmarkAt"],
  "playbooks.v2.run": ["fusionAt", "ideaAt", "benchmarkAt"],
  "competitors.run_insights": [],
};

const PREREQ_RECOMMENDATION_MAP: Record<
  PolicyPrerequisiteKey,
  { action: PolicyActionType; priority: PolicyRecommendationV1_1["priority"]; rationale: string }
> = {
  signalsAt: {
    action: "robots.run",
    priority: "high",
    rationale: "Signals are required before downstream execution.",
  },
  benchmarkAt: {
    action: "competitors.run_insights",
    priority: "high",
    rationale: "Benchmark data is required to ground decisions.",
  },
  fusionAt: {
    action: "fusion.run",
    priority: "medium",
    rationale: "Fusion must be refreshed before downstream planning.",
  },
  ideaAt: {
    action: "ideator.run",
    priority: "medium",
    rationale: "Ideas must be generated before copy execution.",
  },
  copyAt: {
    action: "copywriter.run",
    priority: "medium",
    rationale: "Copy must be generated before publishing flows.",
  },
  playbookAt: {
    action: "playbooks.v1.run",
    priority: "low",
    rationale: "Playbooks should be generated to guide execution.",
  },
};

type RecencyStatus = "missing" | "stale" | "fresh";

type RecencyEntry = {
  status: RecencyStatus;
  observed: string | null;
};

type RecencyMap = Record<PolicyPrerequisiteKey, RecencyEntry>;

function isIsoDateString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0 && !Number.isNaN(Date.parse(value));
}

function buildReason(
  ruleId: string,
  message: string,
  severity: "info" | "warn" | "critical",
  evidence: JsonObject,
): PolicyReason {
  return {
    ruleId,
    message,
    severity,
    evidence,
  };
}

function dedupeActions(actions: PolicyActionType[]): PolicyActionType[] {
  return Array.from(new Set(actions));
}

function computeRecencyMap(input: PolicyInputV1_1): RecencyMap {
  const snapshotAtMs = Date.parse(input.snapshotAt);
  const maxAgeMs = input.thresholds.maxStalenessMinutes * 60 * 1000;
  const recency = input.ledgerRecency;

  const map: RecencyMap = {
    signalsAt: { status: "missing", observed: null },
    benchmarkAt: { status: "missing", observed: null },
    fusionAt: { status: "missing", observed: null },
    ideaAt: { status: "missing", observed: null },
    copyAt: { status: "missing", observed: null },
    playbookAt: { status: "missing", observed: null },
  };

  for (const key of RECENCY_KEYS) {
    const raw = recency[key];
    if (!isIsoDateString(raw)) {
      map[key] = { status: "missing", observed: null };
      continue;
    }
    const timeMs = Date.parse(raw);
    const ageMs = snapshotAtMs - timeMs;
    const stale = !Number.isFinite(snapshotAtMs) || ageMs < 0 || ageMs > maxAgeMs;
    map[key] = { status: stale ? "stale" : "fresh", observed: raw };
  }

  return map;
}

function listKeysByStatus(map: RecencyMap, status: RecencyStatus): PolicyPrerequisiteKey[] {
  return RECENCY_KEYS.filter((key) => map[key].status === status);
}

function buildMissingPrerequisites(
  map: RecencyMap,
  coherenceStatus: PolicyInputV1_1["coherenceStatus"],
  snapshotAt: string,
  maxStalenessMinutes: number,
): PolicyMissingPrerequisite[] {
  const items: PolicyMissingPrerequisite[] = [];

  for (const key of RECENCY_KEYS) {
    const entry = map[key];
    if (entry.status === "fresh") continue;

    const isCritical =
      coherenceStatus === "stale" && (key === "signalsAt" || key === "benchmarkAt");
    const severity = isCritical ? "critical" : "warn";
    const message =
      entry.status === "missing" ? `${key} missing` : `${key} stale`;
    const evidence: JsonObject = {
      observed: entry.observed,
      snapshotAt,
      maxStalenessMinutes,
    };

    items.push({ key, message, severity, evidence });
  }

  return items;
}

function orderRecommendations(
  recommendations: PolicyRecommendationV1_1[],
): PolicyRecommendationV1_1[] {
  const high: PolicyRecommendationV1_1[] = [];
  const medium: PolicyRecommendationV1_1[] = [];
  const low: PolicyRecommendationV1_1[] = [];

  for (const recommendation of recommendations) {
    if (recommendation.priority === "high") {
      high.push(recommendation);
    } else if (recommendation.priority === "medium") {
      medium.push(recommendation);
    } else {
      low.push(recommendation);
    }
  }

  return [...high, ...medium, ...low];
}

function buildRecommendationsFromKeys(
  keys: PolicyPrerequisiteKey[],
  map: RecencyMap,
): PolicyRecommendationV1_1[] {
  const recommendations: PolicyRecommendationV1_1[] = [];
  const seen = new Set<PolicyActionType>();

  for (const key of keys) {
    const mapping = PREREQ_RECOMMENDATION_MAP[key];
    if (!mapping || seen.has(mapping.action)) continue;

    const status = map[key].status;
    const rationale = `${key} is ${status}; ${mapping.rationale}`;
    recommendations.push({
      action: mapping.action,
      priority: mapping.priority,
      rationale,
    });
    seen.add(mapping.action);
  }

  return orderRecommendations(recommendations);
}

function computeCoverage(map: RecencyMap): number {
  const freshCount = RECENCY_KEYS.filter((key) => map[key].status === "fresh").length;
  return RECENCY_KEYS.length > 0 ? freshCount / RECENCY_KEYS.length : 0;
}

function checkActionRecency(
  action: PolicyActionType,
  map: RecencyMap,
): { ok: boolean; missingKeys: PolicyPrerequisiteKey[]; staleKeys: PolicyPrerequisiteKey[] } {
  const required = ACTION_RECENCY_REQUIREMENTS[action] ?? [];
  const missingKeys = required.filter((key) => map[key].status === "missing");
  const staleKeys = required.filter((key) => map[key].status === "stale");
  return {
    ok: missingKeys.length === 0 && staleKeys.length === 0,
    missingKeys,
    staleKeys,
  };
}

export function evaluatePolicyV1_1(input: PolicyInputV1_1): PolicyOutputV1_1 {
  const recencyMap = computeRecencyMap(input);
  const missingKeys = listKeysByStatus(recencyMap, "missing");
  const staleKeys = listKeysByStatus(recencyMap, "stale");
  const missingPrerequisites = buildMissingPrerequisites(
    recencyMap,
    input.coherenceStatus,
    input.snapshotAt,
    input.thresholds.maxStalenessMinutes,
  );

  const coverage = computeCoverage(recencyMap);
  let readinessScore = coverage;
  let confidence = coverage;

  let decision: PolicyDecision = "DEFER";
  let allowedActions: PolicyActionType[] = [];
  let blockedActions: PolicyActionType[] = [];
  let deferredActions: PolicyActionType[] = [];
  let reasons: PolicyReason[] = [];
  let recommendedNextActions: PolicyRecommendationV1_1[] = [];
  let recommendedRunMode: "dry_run" | "planned" = "dry_run";

  if (input.coherenceStatus === "stale") {
    decision = "BLOCK";
    blockedActions = [...ALL_ACTIONS];
    readinessScore = 0;
    confidence = 0.95;
    recommendedRunMode = "dry_run";
    recommendedNextActions = orderRecommendations([
      {
        action: "robots.run",
        priority: "high",
        rationale: "Coherence is stale; refresh signals first.",
      },
      {
        action: "market_twin.run",
        priority: "medium",
        rationale: "Update market twin after signals refresh.",
      },
    ]);
    reasons = [
      buildReason(
        "coherence.stale.block",
        "Coherence status is stale; execution is blocked.",
        "critical",
        {
          coherenceStatus: input.coherenceStatus,
          snapshotAt: input.snapshotAt,
        },
      ),
    ];
  } else if (input.coherenceStatus === "partial") {
    readinessScore = Math.min(0.7, coverage);
    confidence = Math.min(0.8, coverage + 0.1);
    const allow = confidence >= input.thresholds.minConfidence;

    if (allow) {
      decision = "ALLOW";
      allowedActions = [input.requestedAction ?? "builder.run"];
      deferredActions = ALL_ACTIONS.filter(
        (action) => !allowedActions.includes(action),
      );
      reasons = [
        buildReason(
          "coherence.partial.allow",
          "Coherence is partial; allow with dry run recommendation.",
          "warn",
          {
            coherenceStatus: input.coherenceStatus,
            confidence,
            missingKeys,
            staleKeys,
          },
        ),
      ];
    } else {
      decision = "DEFER";
      deferredActions = input.requestedAction
        ? [input.requestedAction]
        : [...ALL_ACTIONS];
      reasons = [
        buildReason(
          "coherence.partial.defer",
          "Coherence is partial; execution deferred pending prerequisites.",
          "warn",
          {
            coherenceStatus: input.coherenceStatus,
            confidence,
            missingKeys,
            staleKeys,
          },
        ),
      ];
    }

    recommendedRunMode = "dry_run";
    recommendedNextActions = buildRecommendationsFromKeys(
      [...missingKeys, ...staleKeys],
      recencyMap,
    );
  } else {
    const requestedAction = input.requestedAction ?? null;

    readinessScore = Math.max(0.8, coverage);

    if (!requestedAction) {
      decision = "DEFER";
      deferredActions = [...ALL_ACTIONS];
      confidence = Math.max(0.5, coverage);
      recommendedRunMode = "dry_run";
      recommendedNextActions = orderRecommendations([
        {
          action: "builder.run",
          priority: "low",
          rationale: "No requestedAction provided; submit an explicit action.",
        },
      ]);
      reasons = [
        buildReason(
          "coherence.coherent.no_action",
          "Coherence is coherent but no action was requested.",
          "warn",
          {
            coherenceStatus: input.coherenceStatus,
          },
        ),
      ];
    } else {
      const recencyCheck = checkActionRecency(requestedAction, recencyMap);
      if (!recencyCheck.ok) {
        decision = "DEFER";
        deferredActions = [requestedAction];
        confidence = Math.max(0.6, coverage);
        recommendedRunMode = "dry_run";
        recommendedNextActions = buildRecommendationsFromKeys(
          [...recencyCheck.missingKeys, ...recencyCheck.staleKeys],
          recencyMap,
        );
        reasons = [
          buildReason(
            "recency.defer",
            "Required recency prerequisites are missing or stale.",
            "warn",
            {
              action: requestedAction,
              missingKeys: recencyCheck.missingKeys,
              staleKeys: recencyCheck.staleKeys,
              snapshotAt: input.snapshotAt,
            },
          ),
        ];
      } else {
        decision = "ALLOW";
        allowedActions = [requestedAction];
        confidence = 0.9;
        recommendedRunMode = "planned";
        reasons = [
          buildReason(
            "coherence.coherent.allow",
            "Coherence is coherent and recency thresholds are met.",
            "info",
            {
              action: requestedAction,
              snapshotAt: input.snapshotAt,
            },
          ),
        ];
      }
    }
  }

  const output: PolicyOutputV1_1 = {
    ok: true,
    decision,
    allowedActions: dedupeActions(allowedActions),
    blockedActions: dedupeActions(blockedActions),
    deferredActions: dedupeActions(deferredActions),
    reasons,
    confidence,
    readinessScore,
    missingPrerequisites,
    recommendedNextActions,
    recommendedRunMode,
    policyContractVersion: "v1.1",
    evaluatedAt: input.evaluatedAt,
  };

  const validation = validatePolicyOutputV1_1(output, input);
  if (!validation.ok) {
    throw new Error("POLICY_OUTPUT_INVALID");
  }

  return output;
}
