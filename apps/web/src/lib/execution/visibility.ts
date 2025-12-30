import { prisma } from "@crealeph/db";
import { getIntelligenceSnapshot } from "@/lib/ledger";
import type {
  ExecutionVisibilityArtifactsPresent,
  ExecutionVisibilityGateSummary,
  ExecutionVisibilityInput,
  ExecutionVisibilityLastExecutionByModule,
  ExecutionVisibilityModuleStatus,
  ExecutionVisibilityNextAction,
  ExecutionVisibilityOutput,
} from "@/lib/contracts/execution-visibility";
import {
  validateExecutionVisibilityInput,
  validateExecutionVisibilityOutput,
} from "@/lib/contracts/execution-visibility-validate";

type LedgerEntry = NonNullable<
  Awaited<ReturnType<typeof prisma.intelligenceLedgerEntry.findFirst>>
>;

type Snapshot = {
  signals?: unknown;
  fusion?: unknown;
  idea?: unknown;
  copy?: unknown;
  benchmark?: unknown;
  playbook?: unknown;
  tasks?: unknown[];
  coherence?: { status?: string };
  timestamps?: {
    signalsAt?: Date | string | null;
    fusionAt?: Date | string | null;
    ideaAt?: Date | string | null;
    copyAt?: Date | string | null;
    benchmarkAt?: Date | string | null;
    playbookAt?: Date | string | null;
  };
};

type VisibilityResponse =
  | { status: 200; body: ExecutionVisibilityOutput }
  | { status: 400 | 404 | 500; body: { ok: false; message: string } };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toIso(value: Date | string | null | undefined): string | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function normalizeCoherenceStatus(value: unknown): ExecutionVisibilityOutput["coherenceStatus"] {
  if (value === "coherent" || value === "partial" || value === "stale") {
    return value;
  }
  return "partial";
}

async function findLatestLedgerEntry(input: {
  tenantId: string;
  robotId: string;
  types?: string[];
  module?: string;
  source?: string;
}): Promise<LedgerEntry | null> {
  const where: {
    tenantId: string;
    robotId: string;
    module?: string;
    source?: string;
    type?: { in: string[] };
  } = {
    tenantId: input.tenantId,
    robotId: input.robotId,
  };

  if (input.module) where.module = input.module;
  if (input.source) where.source = input.source;
  if (input.types && input.types.length) where.type = { in: input.types };

  return prisma.intelligenceLedgerEntry.findFirst({
    where,
    orderBy: { createdAt: "desc" },
  });
}

async function hasLedgerEntry(input: {
  tenantId: string;
  robotId: string;
  types?: string[];
  module?: string;
  source?: string;
}): Promise<boolean> {
  const entry = await findLatestLedgerEntry(input);
  return Boolean(entry);
}

function pickLatest(entries: Array<LedgerEntry | null>): LedgerEntry | null {
  let latest: LedgerEntry | null = null;
  for (const entry of entries) {
    if (!entry) continue;
    if (!latest || entry.createdAt.getTime() > latest.createdAt.getTime()) {
      latest = entry;
    }
  }
  return latest;
}

function extractReason(payload: unknown): string | null {
  if (!isRecord(payload)) return null;
  const error = payload.error;
  if (isRecord(error) && typeof error.code === "string" && error.code.trim()) {
    return error.code;
  }
  if (typeof payload.cancelReason === "string" && payload.cancelReason.trim()) {
    return payload.cancelReason;
  }
  return null;
}

function buildModuleStatus(entry: LedgerEntry | null): ExecutionVisibilityModuleStatus {
  if (!entry) {
    return {
      status: "never_ran",
      lastEventAt: null,
      lastEventType: null,
      lastReason: null,
    };
  }

  let status: ExecutionVisibilityModuleStatus["status"] = "unknown";
  if (entry.state === "failed") status = "failed";
  if (entry.state === "cancelled") status = "cancelled";
  if (entry.state === "approved" || entry.state === "succeeded") status = "succeeded";

  return {
    status,
    lastEventAt: entry.createdAt.toISOString(),
    lastEventType: entry.type,
    lastReason: extractReason(entry.payload),
  };
}

function buildGateSummary(
  entry: LedgerEntry,
  gateType: ExecutionVisibilityGateSummary["gateType"],
): ExecutionVisibilityGateSummary {
  const message = extractReason(entry.payload) ?? gateType;
  const state = entry.state === "cancelled" ? "cancelled" : "failed";
  return {
    gateType,
    state,
    message,
    createdAt: entry.createdAt.toISOString(),
  };
}

function buildHistorySummary(entry: LedgerEntry): string {
  return extractReason(entry.payload) ?? entry.type;
}

function getSnapshotAt(snapshot: Snapshot, fallback: string): string {
  const timestamps = snapshot.timestamps ?? {};
  const candidates = [
    timestamps.signalsAt,
    timestamps.fusionAt,
    timestamps.ideaAt,
    timestamps.copyAt,
    timestamps.benchmarkAt,
    timestamps.playbookAt,
  ]
    .map((value) => (value ? new Date(value).getTime() : 0))
    .filter((value) => Number.isFinite(value) && value > 0);

  if (!candidates.length) return fallback;
  return new Date(Math.max(...candidates)).toISOString();
}

export async function resolveExecutionVisibility(
  input: ExecutionVisibilityInput,
): Promise<ExecutionVisibilityOutput> {
  const robot = await prisma.robot.findFirst({
    where: { id: input.robotId, tenantId: input.tenantId },
  });
  if (!robot) throw new Error("NOT_FOUND");

  const snapshot = (await getIntelligenceSnapshot(prisma, {
    tenantId: input.tenantId,
    robotId: input.robotId,
  })) as Snapshot;

  const coherenceStatus = normalizeCoherenceStatus(snapshot.coherence?.status);

  const snapshotAt = getSnapshotAt(snapshot, input.evaluatedAt);

  const artifactsPresent: ExecutionVisibilityArtifactsPresent = {
    signal: snapshot.signals != null,
    insight: false,
    fusion: snapshot.fusion != null,
    idea: snapshot.idea != null,
    copy: snapshot.copy != null,
    benchmark: snapshot.benchmark != null,
    playbook: snapshot.playbook != null,
    task: Array.isArray(snapshot.tasks) && snapshot.tasks.length > 0,
    builder_artifact: false,
  };

  if (!artifactsPresent.signal) {
    artifactsPresent.signal = await hasLedgerEntry({
      tenantId: input.tenantId,
      robotId: input.robotId,
      types: ["signal"],
      module: "robots",
    });
  }

  if (!artifactsPresent.insight) {
    artifactsPresent.insight = await hasLedgerEntry({
      tenantId: input.tenantId,
      robotId: input.robotId,
      types: ["insight"],
      module: "robots",
    });
  }

  if (!artifactsPresent.fusion) {
    artifactsPresent.fusion = await hasLedgerEntry({
      tenantId: input.tenantId,
      robotId: input.robotId,
      types: ["fusion"],
      module: "robots",
    });
  }

  if (!artifactsPresent.idea) {
    artifactsPresent.idea = await hasLedgerEntry({
      tenantId: input.tenantId,
      robotId: input.robotId,
      types: ["idea"],
      module: "ideator",
    });
  }

  if (!artifactsPresent.copy) {
    artifactsPresent.copy = await hasLedgerEntry({
      tenantId: input.tenantId,
      robotId: input.robotId,
      types: ["copy"],
      module: "copywriter",
    });
  }

  if (!artifactsPresent.benchmark) {
    artifactsPresent.benchmark = await hasLedgerEntry({
      tenantId: input.tenantId,
      robotId: input.robotId,
      types: ["benchmark"],
      module: "market-twin",
    });
  }

  if (!artifactsPresent.playbook) {
    artifactsPresent.playbook = await hasLedgerEntry({
      tenantId: input.tenantId,
      robotId: input.robotId,
      types: ["playbook"],
      module: "playbooks",
    });
  }

  if (!artifactsPresent.task) {
    artifactsPresent.task = await hasLedgerEntry({
      tenantId: input.tenantId,
      robotId: input.robotId,
      types: ["task"],
      module: "playbooks",
    });
  }

  if (!artifactsPresent.builder_artifact) {
    artifactsPresent.builder_artifact = await hasLedgerEntry({
      tenantId: input.tenantId,
      robotId: input.robotId,
      module: "builder",
    });
  }

  const [
    robotsSignal,
    robotsGate,
    competitorsInsight,
    fusionEntry,
    fusionGate,
    ideatorEntry,
    ideatorGate,
    copyEntry,
    copyGate,
    marketEntry,
    marketGate,
    playbookV1Entry,
    playbookV1Gate,
    playbookV2Entry,
    playbookV2Task,
    playbookV2Gate,
    builderExecution,
    builderArtifact,
  ] = await Promise.all([
    findLatestLedgerEntry({
      tenantId: input.tenantId,
      robotId: input.robotId,
      types: ["signal"],
      module: "robots",
    }),
    findLatestLedgerEntry({
      tenantId: input.tenantId,
      robotId: input.robotId,
      types: ["robots_run_gate"],
      module: "robots",
    }),
    findLatestLedgerEntry({
      tenantId: input.tenantId,
      robotId: input.robotId,
      types: ["insight"],
      module: "robots",
    }),
    findLatestLedgerEntry({
      tenantId: input.tenantId,
      robotId: input.robotId,
      types: ["fusion"],
      module: "robots",
    }),
    findLatestLedgerEntry({
      tenantId: input.tenantId,
      robotId: input.robotId,
      types: ["fusion_gate"],
      module: "fusion",
    }),
    findLatestLedgerEntry({
      tenantId: input.tenantId,
      robotId: input.robotId,
      types: ["idea"],
      module: "ideator",
    }),
    findLatestLedgerEntry({
      tenantId: input.tenantId,
      robotId: input.robotId,
      types: ["ideator_gate"],
      module: "ideator",
    }),
    findLatestLedgerEntry({
      tenantId: input.tenantId,
      robotId: input.robotId,
      types: ["copy"],
      module: "copywriter",
    }),
    findLatestLedgerEntry({
      tenantId: input.tenantId,
      robotId: input.robotId,
      types: ["copywriter_gate"],
      module: "copywriter",
    }),
    findLatestLedgerEntry({
      tenantId: input.tenantId,
      robotId: input.robotId,
      types: ["benchmark"],
      module: "market-twin",
    }),
    findLatestLedgerEntry({
      tenantId: input.tenantId,
      robotId: input.robotId,
      types: ["market_twin_gate"],
      module: "market-twin",
    }),
    findLatestLedgerEntry({
      tenantId: input.tenantId,
      robotId: input.robotId,
      types: ["playbook"],
      module: "playbooks",
      source: "playbooks-v1",
    }),
    findLatestLedgerEntry({
      tenantId: input.tenantId,
      robotId: input.robotId,
      types: ["playbooks_v1_gate"],
      module: "playbooks",
    }),
    findLatestLedgerEntry({
      tenantId: input.tenantId,
      robotId: input.robotId,
      types: ["playbook"],
      module: "playbooks",
      source: "playbooks-v2",
    }),
    findLatestLedgerEntry({
      tenantId: input.tenantId,
      robotId: input.robotId,
      types: ["task"],
      module: "playbooks",
      source: "playbooks-v2",
    }),
    findLatestLedgerEntry({
      tenantId: input.tenantId,
      robotId: input.robotId,
      types: ["playbooks_v2_gate"],
      module: "playbooks",
    }),
    findLatestLedgerEntry({
      tenantId: input.tenantId,
      robotId: input.robotId,
      types: ["execution_event"],
      module: "agent-builder",
    }),
    findLatestLedgerEntry({
      tenantId: input.tenantId,
      robotId: input.robotId,
      module: "builder",
    }),
  ]);

  const lastExecutionByModule: ExecutionVisibilityLastExecutionByModule = {
    robots: buildModuleStatus(pickLatest([robotsSignal, robotsGate])),
    competitors: buildModuleStatus(competitorsInsight),
    fusion: buildModuleStatus(pickLatest([fusionEntry, fusionGate])),
    ideator: buildModuleStatus(pickLatest([ideatorEntry, ideatorGate])),
    copywriter: buildModuleStatus(pickLatest([copyEntry, copyGate])),
    market_twin: buildModuleStatus(pickLatest([marketEntry, marketGate])),
    playbooks_v1: buildModuleStatus(pickLatest([playbookV1Entry, playbookV1Gate])),
    playbooks_v2: buildModuleStatus(
      pickLatest([playbookV2Entry, playbookV2Task, playbookV2Gate]),
    ),
    builder: buildModuleStatus(pickLatest([builderExecution, builderArtifact])),
  };

  const gateTypes = [
    "robots_run_gate",
    "market_twin_gate",
    "competitors_insights_gate",
    "fusion_gate",
    "ideator_gate",
    "copywriter_gate",
    "playbooks_v1_gate",
    "playbooks_v2_gate",
  ] as const;

  const gateEntries = await Promise.all(
    gateTypes.map((gateType) =>
      findLatestLedgerEntry({
        tenantId: input.tenantId,
        robotId: input.robotId,
        types: [gateType],
      }),
    ),
  );

  const gates: ExecutionVisibilityGateSummary[] = [];
  gateEntries.forEach((entry, index) => {
    if (!entry) return;
    gates.push(buildGateSummary(entry, gateTypes[index]));
  });

  const requiredForBuilder = [
    "signal",
    "fusion",
    "benchmark",
    "idea",
    "copy",
    "playbook",
  ] as const;
  const requiredMissing = requiredForBuilder.filter((key) => !artifactsPresent[key]);

  const canDryRun = coherenceStatus !== "stale";
  const builderReadiness = {
    canDryRun,
    blockedReason: canDryRun ? null : "COHERENCE_BLOCKED",
    requiredMissing: [...requiredMissing],
  };

  const nextActions: ExecutionVisibilityNextAction[] = [];
  const addAction = (
    action: ExecutionVisibilityNextAction["action"],
    rationale: string,
    priority: ExecutionVisibilityNextAction["priority"],
  ) => {
    if (nextActions.some((item) => item.action === action)) return;
    nextActions.push({ action, rationale, priority });
  };

  if (!artifactsPresent.signal) {
    addAction("robots.run", "Missing signal artifact.", "high");
  }
  if (!artifactsPresent.insight) {
    addAction("competitors.run_insights", "Missing competitor insights.", "medium");
  }
  if (!artifactsPresent.fusion && artifactsPresent.signal) {
    addAction("fusion.run", "Missing fusion artifact.", "high");
  }
  if (!artifactsPresent.idea && artifactsPresent.fusion) {
    addAction("ideator.run", "Missing idea artifact.", "high");
  }
  if (!artifactsPresent.copy && artifactsPresent.idea) {
    addAction("copywriter.run", "Missing copy artifact.", "medium");
  }
  if (!artifactsPresent.benchmark) {
    addAction("market_twin.run", "Missing benchmark artifact.", "medium");
  }
  if (
    !artifactsPresent.playbook &&
    (artifactsPresent.idea || artifactsPresent.fusion || artifactsPresent.benchmark)
  ) {
    addAction("playbooks.v1.run", "Missing playbook artifact.", "medium");
  }
  if (!artifactsPresent.task && artifactsPresent.playbook) {
    addAction("playbooks.v2.run", "Missing playbook tasks.", "low");
  }
  if (!artifactsPresent.builder_artifact && builderReadiness.canDryRun) {
    addAction("builder.run", "No builder artifacts present.", "low");
  }

  let history: ExecutionVisibilityOutput["history"];
  if (input.includeHistory) {
    const limit = input.historyLimit ?? 50;
    const entries = await prisma.intelligenceLedgerEntry.findMany({
      where: { tenantId: input.tenantId, robotId: input.robotId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    history = entries.map((entry) => ({
      createdAt: entry.createdAt.toISOString(),
      module: entry.module,
      type: entry.type,
      state: entry.state,
      summary: buildHistorySummary(entry),
      id: entry.id,
    }));
  }

  const output: ExecutionVisibilityOutput = {
    ok: true,
    contractVersion: "v1",
    evaluatedAt: input.evaluatedAt,
    tenantId: input.tenantId,
    robotId: input.robotId,
    coherenceStatus,
    snapshotAt,
    artifactsPresent,
    lastExecutionByModule,
    gates,
    builderReadiness,
    nextActions,
    ...(history ? { history } : {}),
  };

  const outputValidation = validateExecutionVisibilityOutput(output, input);
  if (!outputValidation.ok) {
    throw new Error("VALIDATION_ERROR");
  }

  return output;
}

export async function handleExecutionVisibilityRequest(
  request: Request,
  tenantId: string,
  robotIdOverride?: string | null,
): Promise<VisibilityResponse> {
  const url = new URL(request.url);
  const robotId = (robotIdOverride ?? url.searchParams.get("robotId") ?? "").trim();
  if (!robotId) {
    return { status: 404, body: { ok: false, message: "not found" } };
  }

  const includeHistoryParam = url.searchParams.get("includeHistory");
  if (
    includeHistoryParam !== null &&
    includeHistoryParam !== "true" &&
    includeHistoryParam !== "false"
  ) {
    return { status: 400, body: { ok: false, message: "VALIDATION_ERROR" } };
  }
  const includeHistory =
    includeHistoryParam === "true"
      ? true
      : includeHistoryParam === "false"
        ? false
        : undefined;

  const historyLimitParam = url.searchParams.get("historyLimit");
  const historyLimit =
    historyLimitParam !== null ? Number.parseInt(historyLimitParam, 10) : undefined;
  if (historyLimitParam !== null && Number.isNaN(historyLimit)) {
    return { status: 400, body: { ok: false, message: "VALIDATION_ERROR" } };
  }

  const input: ExecutionVisibilityInput = {
    tenantId,
    robotId,
    contractVersion: "v1",
    evaluatedAt: new Date().toISOString(),
    ...(includeHistoryParam !== null ? { includeHistory } : {}),
    ...(historyLimitParam !== null ? { historyLimit } : {}),
  };

  const inputValidation = validateExecutionVisibilityInput(input);
  if (!inputValidation.ok) {
    return { status: 400, body: { ok: false, message: "VALIDATION_ERROR" } };
  }

  try {
    const output = await resolveExecutionVisibility(input);
    return { status: 200, body: output };
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "NOT_FOUND") {
      return { status: 404, body: { ok: false, message: "not found" } };
    }
    if (message === "VALIDATION_ERROR") {
      return { status: 400, body: { ok: false, message: "VALIDATION_ERROR" } };
    }
    return { status: 500, body: { ok: false, message: "INTERNAL_ERROR" } };
  }
}
