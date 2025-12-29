import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@crealeph/db";
import {
  getIntelligenceSnapshot,
  isJsonObject,
  type JsonObject,
  type JsonValue,
} from "@/lib/ledger";
import type {
  BuilderExecutionState,
  BuilderObjectiveType,
  BuilderArtifactReference,
  BuilderRunResponse,
} from "@/lib/contracts/builder";
import type { AgentInput } from "@/lib/contracts/agent-boundary";
import type { PolicyInput } from "@/lib/contracts/policy-engine";
import type { ArtifactType, BuilderArtifact } from "@/lib/contracts/builder-artifacts";
import {
  assertCoherencePolicy,
  validateBuilderArtifacts,
  validateBuilderRequest,
} from "@/lib/contracts/builder-validate";
import {
  validatePolicyInput,
  validatePolicyOutput,
} from "@/lib/contracts/policy-engine-validate";
import { runAgentWithBoundary } from "@/lib/agent/agent-bridge";
import { evaluatePolicy } from "@/lib/policy/policy-engine";

type PrismaClient = typeof prisma;

type ExecutionPayload = JsonObject & {
  executionId: string;
  workflowVersion: string;
  agentVersion: string;
  attempt: number;
  target: "site_builder" | "paid_media" | "seo";
  action: string;
  snapshotAt: string;
  coherenceStatus: "coherent" | "partial" | "stale";
  dryRun: boolean;
  result?: JsonObject;
  error?: { code: string; message: string; retryable: boolean };
  cancelReason?: string;
};

type LedgerEntryInput = {
  tenantId: string;
  robotId: string;
  module: string;
  source: string;
  type: string;
  state: string;
  payload: JsonValue;
  lineage: JsonValue;
};

const OBJECTIVE_TARGET: Record<BuilderObjectiveType, ExecutionPayload["target"]> = {
  campaign_plan: "paid_media",
  paid_media_plan: "paid_media",
  landing_plan: "site_builder",
  site_plan: "site_builder",
  seo_cluster: "seo",
};

const ARTIFACT_TYPES: ArtifactType[] = [
  "idea",
  "copy",
  "playbook",
  "task",
  "site_plan",
  "seo_cluster",
  "paid_plan",
];

const OBJECTIVE_ALLOWED_ARTIFACT_TYPES: Record<BuilderObjectiveType, ArtifactType[]> = {
  campaign_plan: ["paid_plan", "copy", "playbook"],
  paid_media_plan: ["paid_plan", "copy"],
  landing_plan: ["site_plan"],
  site_plan: ["site_plan"],
  seo_cluster: ["seo_cluster", "copy"],
};

function getTenantId() {
  return process.env.DEFAULT_TENANT_ID ?? "demo-tenant";
}

function isArtifactType(value: unknown): value is ArtifactType {
  return typeof value === "string" && ARTIFACT_TYPES.some((type) => type === value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function dedupeSorted(values: string[]) {
  return Array.from(new Set(values)).sort();
}

function normalizeLineage(lineage: JsonValue | null | undefined): JsonObject {
  const safe = isJsonObject(lineage) ? lineage : {};
  const dependsOnLedgerIds = Array.isArray(safe.dependsOnLedgerIds)
    ? dedupeSorted(safe.dependsOnLedgerIds.filter((id): id is string => typeof id === "string"))
    : [];
  return { ...safe, dependsOnLedgerIds };
}

function isOkState(state: BuilderExecutionState) {
  return state === "planned" || state === "succeeded" || state === "cancelled";
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }
  if (isRecord(value)) {
    const entries = Object.entries(value).sort(([a], [b]) => a.localeCompare(b));
    return `{${entries
      .map(([key, val]) => `${JSON.stringify(key)}:${stableStringify(val)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

function getErrorDetails(error: unknown) {
  if (error instanceof Error) {
    return { message: error.message, stack: error.stack ?? "" };
  }
  return { message: String(error), stack: "" };
}

function toDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  const parsed = new Date(String(value));
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

function toIsoString(value: unknown): string | null {
  const date = toDate(value);
  return date ? date.toISOString() : null;
}

function pickSnapshotAt(timestamps: Record<string, unknown> | null | undefined) {
  const candidates = [
    timestamps?.signalsAt,
    timestamps?.fusionAt,
    timestamps?.ideaAt,
    timestamps?.copyAt,
    timestamps?.benchmarkAt,
    timestamps?.playbookAt,
  ]
    .map((value) => toDate(value))
    .filter((value): value is Date => Boolean(value));

  if (!candidates.length) return null;
  const latest = candidates.reduce((max, current) =>
    current.getTime() > max.getTime() ? current : max,
  );
  return latest;
}

async function createLedgerEntry(prismaClient: PrismaClient, input: LedgerEntryInput) {
  try {
    return await prismaClient.intelligenceLedgerEntry.create({
      data: {
        tenantId: input.tenantId,
        robotId: input.robotId,
        module: input.module,
        source: input.source,
        type: input.type,
        state: input.state,
        payload: input.payload,
        lineage: input.lineage,
      },
    });
  } catch (error: unknown) {
    const details = getErrorDetails(error);
    const errMsg = details.message;
    console.error(
      JSON.stringify({
        level: "error",
        at: "builder.ledger.append",
        tenantId: input.tenantId,
        robotId: input.robotId,
        module: input.module,
        type: input.type,
        error: errMsg,
        stack: details.stack,
        timestamp: new Date().toISOString(),
      }),
    );

    try {
      await prismaClient.intelligenceLedgerFailure.create({
        data: {
          tenantId: input.tenantId,
          robotId: input.robotId,
          module: input.module,
          source: input.source,
          type: input.type,
          state: input.state,
          payload: input.payload,
          lineage: input.lineage,
          errorMessage: errMsg,
        },
      });
    } catch (deadLetterError: unknown) {
      const details = getErrorDetails(deadLetterError);
      console.error(
        JSON.stringify({
          level: "error",
          at: "builder.ledger.deadletter",
          tenantId: input.tenantId,
          robotId: input.robotId,
          module: input.module,
          type: input.type,
          error: details.message,
          stack: details.stack,
          timestamp: new Date().toISOString(),
        }),
      );
    }

    return null;
  }
}

async function findExecutionEvent(
  prismaClient: PrismaClient,
  input: {
    tenantId: string;
    robotId: string;
    executionId: string;
    attempt: number;
    state: BuilderExecutionState;
  },
) {
  const entries = await prismaClient.intelligenceLedgerEntry.findMany({
    where: {
      tenantId: input.tenantId,
      robotId: input.robotId,
      module: "agent-builder",
      source: "agent-builder",
      type: "execution_event",
      state: input.state,
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return entries.find((entry) => {
    const payload = isJsonObject(entry.payload) ? entry.payload : {};
    const rawExecutionId = payload.executionId;
    const existingExecutionId = typeof rawExecutionId === "string" ? rawExecutionId : "";
    const existingAttempt = Number(payload.attempt);
    return (
      existingExecutionId === input.executionId &&
      Number.isFinite(existingAttempt) &&
      existingAttempt === input.attempt &&
      entry.state === input.state
    );
  });
}

async function collectLedgerContext(
  prismaClient: PrismaClient,
  tenantId: string,
  robotId: string,
  snapshotAt: Date,
) {
  const baselineEntries = await prismaClient.intelligenceLedgerEntry.findMany({
    where: {
      tenantId,
      robotId,
      type: {
        in: ["signal", "fusion", "idea", "copy", "benchmark", "playbook"],
      },
    },
    orderBy: { createdAt: "desc" },
    take: 300,
  });

  type LedgerEntry = (typeof baselineEntries)[number];
  const latestByType: Record<string, LedgerEntry | undefined> = {};
  for (const entry of baselineEntries) {
    if (!latestByType[entry.type]) {
      latestByType[entry.type] = entry;
    }
  }

  const referencedIds = new Set<string>();
  for (const entry of Object.values(latestByType)) {
    if (!entry) continue;
    referencedIds.add(entry.id);
    const lineage = isJsonObject(entry.lineage) ? entry.lineage : {};
    const dependsOn = Array.isArray(lineage.dependsOnLedgerIds)
      ? lineage.dependsOnLedgerIds.filter((id): id is string => typeof id === "string")
      : [];
    for (const id of dependsOn) {
      referencedIds.add(id);
    }
  }

  const referencedEntries =
    referencedIds.size > 0
      ? await prismaClient.intelligenceLedgerEntry.findMany({
          where: {
            tenantId,
            robotId,
            id: { in: Array.from(referencedIds) },
          },
        })
      : [];

  const entriesById = new Map<string, LedgerEntry>();
  for (const entry of referencedEntries) {
    entriesById.set(entry.id, entry);
  }

  const snapshotAtMs = snapshotAt.getTime();
  const allowedLedgerIds = Array.from(entriesById.values())
    .filter((entry) => (toDate(entry.createdAt)?.getTime() ?? 0) <= snapshotAtMs)
    .map((entry) => entry.id);

  return {
    allowedLedgerIds: dedupeSorted(allowedLedgerIds),
  };
}

async function findArtifactsByExecutionId(
  prismaClient: PrismaClient,
  tenantId: string,
  robotId: string,
  executionId: string,
): Promise<BuilderArtifactReference[]> {
  const entries = await prismaClient.intelligenceLedgerEntry.findMany({
    where: {
      tenantId,
      robotId,
      module: "builder",
      source: "builder",
    },
    orderBy: { createdAt: "desc" },
    take: 300,
  });

  const seen = new Set<string>();
  const artifacts: BuilderArtifactReference[] = [];
  for (const entry of entries) {
    const lineage = isJsonObject(entry.lineage) ? entry.lineage : {};
    const rawExecutionId = lineage.executionId;
    const lineageExecutionId = typeof rawExecutionId === "string" ? rawExecutionId : "";
    if (lineageExecutionId === executionId && !seen.has(entry.id) && isArtifactType(entry.type)) {
      seen.add(entry.id);
      artifacts.push({ id: entry.id, type: entry.type });
    }
  }

  return artifacts;
}

async function generateArtifacts(agentInput: AgentInput): Promise<unknown[]> {
  const agentOutput = await runAgentWithBoundary(agentInput);
  if (agentOutput.status !== "succeeded") {
    throw new Error("MODEL_OUTPUT_INVALID");
  }
  return agentOutput.artifacts ?? [];
}

function validateArtifacts(
  artifacts: unknown,
  allowedLedgerIds: Set<string>,
): { ok: true; artifacts: BuilderArtifact[] } | { ok: false; reason: string } {
  const validation = validateBuilderArtifacts(artifacts);
  if (validation.ok === false) {
    return { ok: false, reason: validation.reason };
  }

  for (const artifact of validation.artifacts) {
    for (const id of artifact.dependsOnLedgerIds) {
      if (!allowedLedgerIds.has(id)) {
        return { ok: false, reason: "dependsOnLedgerIds not allowed" };
      }
    }
  }

  return { ok: true, artifacts: validation.artifacts };
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const respond = (payload: BuilderRunResponse, status?: number) =>
    NextResponse.json<BuilderRunResponse>(payload, status ? { status } : undefined);

  let responsePayload: BuilderRunResponse | null = null;
  let responseStatus: number | undefined;

  const validation = validateBuilderRequest(body);
  if (validation.ok === false) {
    responsePayload = { ok: false, error: validation.error };
    responseStatus = 400;
  }

  if (validation.ok) {
    const {
      robotId,
      objective_type: objectiveType,
      objective_payload: objectivePayload,
      constraints,
      coherence_policy: coherencePolicy,
      dryRun,
      workflowVersion,
      agentVersion,
      attempt,
      executionId: providedExecutionId,
    } = validation.value;

    const executionId = providedExecutionId ?? randomUUID();

    const tenantId = getTenantId();

    const snapshot = await getIntelligenceSnapshot(prisma, { tenantId, robotId });
    const coherenceCheck = assertCoherencePolicy(snapshot, coherencePolicy);
    const coherenceStatus = coherenceCheck.status;

    const snapshotAtDate = pickSnapshotAt(snapshot.timestamps ?? null);
    let snapshotAt = "";
    if (!snapshotAtDate) {
      responsePayload = { ok: false, error: "SNAPSHOT_EMPTY", executionId };
      responseStatus = 400;
    } else {
      snapshotAt = snapshotAtDate.toISOString();
    }

    let baseLineageIds: string[] = [];
    if (!responsePayload) {
      const ledgerContext = await collectLedgerContext(
        prisma,
        tenantId,
        robotId,
        snapshotAtDate as Date,
      );
      baseLineageIds = ledgerContext.allowedLedgerIds;
      if (!baseLineageIds.length) {
        responsePayload = { ok: false, error: "MISSING_LINEAGE", executionId };
        responseStatus = 400;
      }
    }

    const target = OBJECTIVE_TARGET[objectiveType];
    const action = `plan_${objectiveType}`;

    if (!responsePayload) {
      const policyInput: PolicyInput = {
        tenantId,
        robotId,
        policyContractVersion: "v1",
        evaluatedAt: new Date().toISOString(),
        coherenceStatus,
        snapshotAt,
        intelligenceSnapshot: snapshot as unknown as JsonObject,
        ledgerRecency: {
          signalsAt: toIsoString(snapshot.timestamps?.signalsAt),
          fusionAt: toIsoString(snapshot.timestamps?.fusionAt),
          ideaAt: toIsoString(snapshot.timestamps?.ideaAt),
          copyAt: toIsoString(snapshot.timestamps?.copyAt),
          benchmarkAt: toIsoString(snapshot.timestamps?.benchmarkAt),
          playbookAt: toIsoString(snapshot.timestamps?.playbookAt),
        },
        requestedAction: "builder.run",
        requestedObjective: {
          type: objectiveType,
          action,
        },
        thresholds: {
          minConfidence: 0.5,
          maxStalenessMinutes: 0,
          minLineageCount: 1,
        },
      };

      const policyInputValidation = validatePolicyInput(policyInput);
      if (!policyInputValidation.ok) {
        responsePayload = { ok: false, error: "VALIDATION_ERROR", executionId };
        responseStatus = 400;
      }

      const policyValidationFailure = async () => {
        if (responsePayload) return;
        const payload: ExecutionPayload = {
          executionId,
          workflowVersion,
          agentVersion,
          attempt,
          target,
          action,
          snapshotAt,
          coherenceStatus,
          dryRun,
          error: {
            code: "VALIDATION_ERROR",
            message: "Policy output invalid.",
            retryable: false,
          },
        };
        const lineage = normalizeLineage({ dependsOnLedgerIds: baseLineageIds });
        const existing = await findExecutionEvent(prisma, {
          tenantId,
          robotId,
          executionId,
          attempt,
          state: "failed",
        });

        if (existing) {
          const samePayload = stableStringify(payload) === stableStringify(existing.payload);
          const sameLineage =
            stableStringify(lineage) === stableStringify(normalizeLineage(existing.lineage));
          if (!samePayload || !sameLineage) {
            responsePayload = { ok: false, error: "IDEMPOTENCY_CONFLICT", executionId };
            responseStatus = 409;
            return;
          }
          responsePayload = { ok: false, error: "VALIDATION_ERROR", executionId };
          return;
        }

        await createLedgerEntry(prisma, {
          tenantId,
          robotId,
          module: "agent-builder",
          source: "agent-builder",
          type: "execution_event",
          state: "failed",
          payload,
          lineage,
        });

        responsePayload = { ok: false, error: "VALIDATION_ERROR", executionId };
      };

      let policyOutput: ReturnType<typeof evaluatePolicy> | null = null;
      if (!responsePayload) {
        try {
          policyOutput = evaluatePolicy(policyInput);
        } catch {
          await policyValidationFailure();
        }
      }

      if (!responsePayload && policyOutput) {
        const policyOutputValidation = validatePolicyOutput(policyOutput, policyInput);
        if (!policyOutputValidation.ok) {
          await policyValidationFailure();
        }
      }

      if (!responsePayload && policyOutput?.decision === "BLOCK") {
        const payload: ExecutionPayload = {
          executionId,
          workflowVersion,
          agentVersion,
          attempt,
          target,
          action,
          snapshotAt,
          coherenceStatus,
          dryRun,
          error: {
            code: "COHERENCE_BLOCKED",
            message: "Policy blocked execution.",
            retryable: false,
          },
        };

        const lineage = normalizeLineage({ dependsOnLedgerIds: baseLineageIds });
        const existing = await findExecutionEvent(prisma, {
          tenantId,
          robotId,
          executionId,
          attempt,
          state: "failed",
        });

        if (existing) {
          const samePayload = stableStringify(payload) === stableStringify(existing.payload);
          const sameLineage =
            stableStringify(lineage) === stableStringify(normalizeLineage(existing.lineage));
          if (!samePayload || !sameLineage) {
            responsePayload = { ok: false, error: "IDEMPOTENCY_CONFLICT", executionId };
            responseStatus = 409;
          } else {
            responsePayload = { ok: false, blocking_reason: "COHERENCE_BLOCKED", executionId };
          }
        }

        if (!responsePayload) {
          await createLedgerEntry(prisma, {
            tenantId,
            robotId,
            module: "agent-builder",
            source: "agent-builder",
            type: "execution_event",
            state: "failed",
            payload,
            lineage,
          });

          responsePayload = { ok: false, blocking_reason: "COHERENCE_BLOCKED", executionId };
        }
      }

      if (!responsePayload && policyOutput?.decision === "DEFER") {
        const payload: ExecutionPayload = {
          executionId,
          workflowVersion,
          agentVersion,
          attempt,
          target,
          action,
          snapshotAt,
          coherenceStatus,
          dryRun,
          cancelReason: "POLICY_DEFERRED",
        };

        const lineage = normalizeLineage({ dependsOnLedgerIds: baseLineageIds });
        const existing = await findExecutionEvent(prisma, {
          tenantId,
          robotId,
          executionId,
          attempt,
          state: "cancelled",
        });

        if (existing) {
          const samePayload = stableStringify(payload) === stableStringify(existing.payload);
          const sameLineage =
            stableStringify(lineage) === stableStringify(normalizeLineage(existing.lineage));
          if (!samePayload || !sameLineage) {
            responsePayload = { ok: false, error: "IDEMPOTENCY_CONFLICT", executionId };
            responseStatus = 409;
          } else {
            responsePayload = {
              ok: true,
              executionId,
              state: "cancelled",
              coherence: snapshot.coherence,
              artifacts: [],
            };
          }
        }

        if (!responsePayload) {
          await createLedgerEntry(prisma, {
            tenantId,
            robotId,
            module: "agent-builder",
            source: "agent-builder",
            type: "execution_event",
            state: "cancelled",
            payload,
            lineage,
          });

          responsePayload = {
            ok: true,
            executionId,
            state: "cancelled",
            coherence: snapshot.coherence,
            artifacts: [],
          };
        }
      }
    }

    if (!responsePayload) {
      const blockedByCoherence = coherenceCheck.blocked;

      if (blockedByCoherence) {
        const payload: ExecutionPayload = {
          executionId,
          workflowVersion,
          agentVersion,
          attempt,
          target,
          action,
          snapshotAt,
          coherenceStatus,
          dryRun,
          error: {
            code: "COHERENCE_BLOCKED",
            message: "Coherence status blocked execution.",
            retryable: false,
          },
        };

        const lineage = normalizeLineage({ dependsOnLedgerIds: baseLineageIds });
        const existing = await findExecutionEvent(prisma, {
          tenantId,
          robotId,
          executionId,
          attempt,
          state: "failed",
        });

        if (existing) {
          const samePayload = stableStringify(payload) === stableStringify(existing.payload);
          const sameLineage =
            stableStringify(lineage) === stableStringify(normalizeLineage(existing.lineage));
          if (!samePayload || !sameLineage) {
            responsePayload = { ok: false, error: "IDEMPOTENCY_CONFLICT", executionId };
            responseStatus = 409;
          } else {
            responsePayload = { ok: false, blocking_reason: "COHERENCE_BLOCKED", executionId };
          }
        }

        if (!responsePayload) {
          await createLedgerEntry(prisma, {
            tenantId,
            robotId,
            module: "agent-builder",
            source: "agent-builder",
            type: "execution_event",
            state: "failed",
            payload,
            lineage,
          });

          responsePayload = { ok: false, blocking_reason: "COHERENCE_BLOCKED", executionId };
        }
      }
    }

    let artifacts: BuilderArtifact[] = [];
    if (!responsePayload) {
      try {
        const agentInput: AgentInput = {
          tenantId,
          robotId,
          executionId,
          attempt,
          workflowVersion,
          agentVersion,
          boundaryContractVersion: "v1",
          runMode: dryRun ? "dry_run" : "execute",
          snapshotAt,
          coherenceStatus,
          constraints,
          objective: {
            type: objectiveType,
            action: "plan",
            payload: objectivePayload,
          },
          intelligenceSnapshot: snapshot as unknown as JsonObject,
          allowedLineage: {
            dependsOnLedgerIds: baseLineageIds,
          },
          allowedArtifactTypes: OBJECTIVE_ALLOWED_ARTIFACT_TYPES[objectiveType],
          outputSchemaVersion: "v1",
        };

        const modelArtifacts = await generateArtifacts(agentInput);

        const validation = validateArtifacts(modelArtifacts, new Set(baseLineageIds));
        if (validation.ok === false) {
          throw new Error(validation.reason);
        }
        artifacts = validation.artifacts;
      } catch (error) {
        const payload: ExecutionPayload = {
          executionId,
          workflowVersion,
          agentVersion,
          attempt,
          target,
          action,
          snapshotAt,
          coherenceStatus,
          dryRun,
          error: {
            code: "MODEL_OUTPUT_INVALID",
            message: "Model output invalid or missing.",
            retryable: true,
          },
        };
        const lineage = normalizeLineage({ dependsOnLedgerIds: baseLineageIds });
        const existing = await findExecutionEvent(prisma, {
          tenantId,
          robotId,
          executionId,
          attempt,
          state: "failed",
        });

        if (existing) {
          const samePayload = stableStringify(payload) === stableStringify(existing.payload);
          const sameLineage =
            stableStringify(lineage) === stableStringify(normalizeLineage(existing.lineage));
          if (!samePayload || !sameLineage) {
            responsePayload = { ok: false, error: "IDEMPOTENCY_CONFLICT", executionId };
            responseStatus = 409;
          } else {
            responsePayload = { ok: false, error: "MODEL_OUTPUT_INVALID", executionId };
          }
        }

        if (!responsePayload) {
          await createLedgerEntry(prisma, {
            tenantId,
            robotId,
            module: "agent-builder",
            source: "agent-builder",
            type: "execution_event",
            state: "failed",
            payload,
            lineage,
          });

          responsePayload = { ok: false, error: "MODEL_OUTPUT_INVALID", executionId };
        }
      }
    }

    if (!responsePayload) {
      const unionDependsOnLedgerIds = dedupeSorted(
        artifacts.flatMap((artifact) => artifact.dependsOnLedgerIds),
      );

      let executionState: BuilderExecutionState = "planned";
      let cancelReason: string | undefined;

      if (coherenceStatus === "partial" && coherencePolicy.on_partial === "draft_only") {
        if (dryRun) {
          executionState = "succeeded";
        } else {
          executionState = "cancelled";
          cancelReason = "PARTIAL_REQUIRES_REVIEW";
        }
      } else if (coherenceStatus === "coherent") {
        executionState = dryRun ? "succeeded" : "planned";
      }

      const payload: ExecutionPayload = {
        executionId,
        workflowVersion,
        agentVersion,
        attempt,
        target,
        action,
        snapshotAt,
        coherenceStatus,
        dryRun,
      };

      if (executionState === "succeeded") {
        payload.result = {
          summary: "Artifacts generated.",
          artifactCount: artifacts.length,
        };
      }
      if (executionState === "cancelled") {
        payload.cancelReason = cancelReason ?? "CANCELLED";
      }

      const lineage = normalizeLineage({ dependsOnLedgerIds: unionDependsOnLedgerIds });

      const existing = await findExecutionEvent(prisma, {
        tenantId,
        robotId,
        executionId,
        attempt,
        state: executionState,
      });

      if (existing) {
        const samePayload = stableStringify(payload) === stableStringify(existing.payload);
        const sameLineage =
          stableStringify(lineage) === stableStringify(normalizeLineage(existing.lineage));
        if (!samePayload || !sameLineage) {
          responsePayload = { ok: false, error: "IDEMPOTENCY_CONFLICT", executionId };
          responseStatus = 409;
        } else {
          const existingArtifacts = await findArtifactsByExecutionId(
            prisma,
            tenantId,
            robotId,
            executionId,
          );
          responsePayload = {
            ok: isOkState(executionState),
            executionId,
            state: executionState,
            coherence: snapshot.coherence,
            artifacts: existingArtifacts,
            idempotent: true,
          };
        }
      }

      if (!responsePayload) {
        const artifactEntries: BuilderArtifactReference[] = [];
        for (const artifact of artifacts) {
          const entry = await createLedgerEntry(prisma, {
            tenantId,
            robotId,
            module: "builder",
            source: "builder",
            type: artifact.type,
            state: "draft",
            payload: artifact.payload,
            lineage: {
              dependsOnLedgerIds: artifact.dependsOnLedgerIds,
              executionId,
            },
          });
          if (entry) {
            artifactEntries.push({ id: entry.id, type: artifact.type });
          }
        }

        await createLedgerEntry(prisma, {
          tenantId,
          robotId,
          module: "agent-builder",
          source: "agent-builder",
          type: "execution_event",
          state: executionState,
          payload,
          lineage,
        });

        responsePayload = {
          ok: isOkState(executionState),
          executionId,
          state: executionState,
          coherence: snapshot.coherence,
          artifacts: artifactEntries,
        };
      }
    }
  }

  return respond(responsePayload!, responseStatus);
}
