import { prisma } from "@crealeph/db";

type PrismaClient = typeof prisma;

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
export type JsonObject = { [key: string]: JsonValue };
export type JsonArray = JsonValue[];

type AppendLedgerInput = {
  tenantId: string;
  module: string;
  source: string;
  type: string;
  state: string;
  payload: JsonValue;
  lineage?: JsonValue;
  robotId?: string | null;
};

type ListLedgerInput = {
  tenantId: string;
  module?: string;
  robotId?: string;
  types?: string[];
  limit?: number;
};

const defaultLineage = (): JsonObject => ({});

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isJsonValue(value: unknown): value is JsonValue {
  if (value === null) return true;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return true;
  }
  if (Array.isArray(value)) {
    return value.every(isJsonValue);
  }
  if (isRecord(value)) {
    return Object.values(value).every(isJsonValue);
  }
  return false;
}

export function isJsonObject(value: unknown): value is JsonObject {
  return isRecord(value) && Object.values(value).every(isJsonValue);
}

function getErrorDetails(error: unknown) {
  if (error instanceof Error) {
    return { message: error.message, stack: error.stack ?? "" };
  }
  return { message: String(error), stack: "" };
}

export async function appendLedgerEntry(prisma: PrismaClient, input: AppendLedgerInput) {
  const payload = {
    tenantId: input.tenantId,
    module: input.module,
    source: input.source,
    type: input.type,
    state: input.state,
    payload: input.payload,
    lineage: input.lineage ?? defaultLineage(),
    robotId: input.robotId ?? null,
  };

  try {
    await prisma.intelligenceLedgerEntry.create({ data: payload });
    return { ok: true as const };
  } catch (error: unknown) {
    const details = getErrorDetails(error);
    const errMsg = details.message;
    const errStack = details.stack;
    const logPayload = {
      level: "error",
      at: "ledger.append",
      tenantId: input.tenantId,
      robotId: input.robotId ?? null,
      module: input.module,
      type: input.type,
      error: errMsg,
      stack: errStack,
      timestamp: new Date().toISOString(),
    };
    console.error(JSON.stringify(logPayload));

    try {
      await prisma.intelligenceLedgerFailure.create({
        data: {
          tenantId: input.tenantId,
          robotId: input.robotId ?? null,
          module: input.module,
          source: input.source,
          type: input.type,
          state: input.state,
          payload: input.payload,
          lineage: input.lineage ?? defaultLineage(),
          errorMessage: errMsg,
        },
      });
    } catch (deadLetterError: unknown) {
      const details = getErrorDetails(deadLetterError);
      console.error(
        JSON.stringify({
          level: "error",
          at: "ledger.deadletter",
          tenantId: input.tenantId,
          robotId: input.robotId ?? null,
          module: input.module,
          type: input.type,
          error: details.message,
          stack: details.stack,
          timestamp: new Date().toISOString(),
        }),
      );
    }

    return { ok: false as const, errorId: logPayload.timestamp };
  }
}

export async function listLedgerEntries(prisma: PrismaClient, input: ListLedgerInput) {
  const limit = input.limit && input.limit > 0 ? input.limit : 1;
  return prisma.intelligenceLedgerEntry.findMany({
    where: {
      tenantId: input.tenantId,
      ...(input.module ? { module: input.module } : {}),
      ...(input.robotId ? { robotId: input.robotId } : {}),
      ...(input.types && input.types.length ? { type: { in: input.types } } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function latestLedgerEntry(prisma: PrismaClient, input: ListLedgerInput) {
  const entries = await listLedgerEntries(prisma, { ...input, limit: 1 });
  return entries[0] ?? null;
}

type SnapshotInput = { tenantId: string; robotId: string };

export async function getIntelligenceSnapshot(prisma: PrismaClient, input: SnapshotInput) {
  const { tenantId, robotId } = input;
  const entries = await prisma.intelligenceLedgerEntry.findMany({
    where: { tenantId, robotId },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  type LedgerEntry = (typeof entries)[number];
  const latestByType: Record<string, LedgerEntry | undefined> = {};
  const tasks: LedgerEntry[] = [];
  const playbooks: LedgerEntry[] = [];
  const entriesById = new Map(entries.map((entry) => [entry.id, entry]));

  for (const entry of entries) {
    if (!latestByType[entry.type]) {
      latestByType[entry.type] = entry;
    }
    if (entry.type === "task") {
      tasks.push(entry);
    }
    if (entry.type === "playbook") {
      playbooks.push(entry);
    }
  }

  const pickPayload = (type: string) => latestByType[type]?.payload ?? null;
  const toTime = (value: Date | string | null | undefined) => {
    if (!value) return 0;
    return (value instanceof Date ? value : new Date(value)).getTime();
  };
  const extractLineageIds = (lineage: unknown) => {
    if (!isRecord(lineage)) return [];
    const ids = lineage.dependsOnLedgerIds;
    if (!Array.isArray(ids)) return [];
    return ids.filter((id): id is string => typeof id === "string");
  };
  const pickLatestEntry = (items: LedgerEntry[]) => {
    let latest: LedgerEntry | null = null;
    for (const item of items) {
      if (!latest || toTime(item.createdAt) > toTime(latest.createdAt)) {
        latest = item;
      }
    }
    return latest;
  };
  const collectUpstreamEntries = (entry: LedgerEntry | null | undefined) => {
    const dependencyIds = extractLineageIds(entry?.lineage);
    const missingIds = new Set<string>();
    const upstream = {
      signal: new Map<string, LedgerEntry>(),
      fusion: new Map<string, LedgerEntry>(),
    };

    const addUpstream = (depEntry: LedgerEntry | null | undefined) => {
      if (!depEntry) return;
      if (depEntry.type === "signal") upstream.signal.set(depEntry.id, depEntry);
      if (depEntry.type === "fusion") upstream.fusion.set(depEntry.id, depEntry);
    };

    const addLineageUpstream = (sourceEntry: LedgerEntry | null | undefined) => {
      const ids = extractLineageIds(sourceEntry?.lineage);
      for (const id of ids) {
        const nested = entriesById.get(id);
        if (!nested) {
          missingIds.add(id);
          continue;
        }
        addUpstream(nested);
      }
    };

    for (const id of dependencyIds) {
      const depEntry = entriesById.get(id);
      if (!depEntry) {
        missingIds.add(id);
        continue;
      }
      addUpstream(depEntry);
      addLineageUpstream(depEntry);
    }

    return {
      usedSignal: pickLatestEntry([...upstream.signal.values()]),
      usedFusion: pickLatestEntry([...upstream.fusion.values()]),
      hasLineage: dependencyIds.length > 0,
      missingCount: missingIds.size,
    };
  };

  const outdatedArtifacts = new Set<string>();
  const partialArtifacts = new Set<string>();
  const latestSignal = latestByType["signal"] ?? null;
  const latestFusion = latestByType["fusion"] ?? null;

  const compareUpstream = (
    artifactEntry: LedgerEntry,
    latestEntry: LedgerEntry | null,
    usedEntry: LedgerEntry | null,
  ) => {
    if (!latestEntry) return { outdated: false, partial: false };
    if (!usedEntry) {
      if (toTime(latestEntry.createdAt) > toTime(artifactEntry.createdAt)) {
        return { outdated: true, partial: false };
      }
      return { outdated: false, partial: true };
    }
    if (latestEntry.id !== usedEntry.id && toTime(latestEntry.createdAt) > toTime(usedEntry.createdAt)) {
      return { outdated: true, partial: false };
    }
    return { outdated: false, partial: false };
  };

  const assessArtifact = (artifactType: "idea" | "copy" | "playbook") => {
    const artifactEntry = latestByType[artifactType];
    if (!artifactEntry) {
      partialArtifacts.add(artifactType);
      return;
    }

    const { usedSignal, usedFusion, hasLineage, missingCount } = collectUpstreamEntries(artifactEntry);
    if (!hasLineage || missingCount > 0) {
      partialArtifacts.add(artifactType);
    }

    const signalCheck = compareUpstream(artifactEntry, latestSignal, usedSignal);
    const fusionCheck = compareUpstream(artifactEntry, latestFusion, usedFusion);
    if (signalCheck.partial || fusionCheck.partial) {
      partialArtifacts.add(artifactType);
    }
    if (signalCheck.outdated || fusionCheck.outdated) {
      outdatedArtifacts.add(artifactType);
    }
  };

  assessArtifact("idea");
  assessArtifact("copy");
  assessArtifact("playbook");

  const outdatedList = Array.from(outdatedArtifacts);
  const partialList = Array.from(partialArtifacts);

  let coherenceStatus: "coherent" | "partial" | "stale" = "coherent";
  if (outdatedList.length > 0) {
    coherenceStatus = "stale";
  } else if (partialList.length > 0) {
    coherenceStatus = "partial";
  }

  let coherenceReason = "Artifacts align with the latest signal/fusion lineage.";
  if (coherenceStatus === "stale") {
    coherenceReason = `Newer upstream signal/fusion entries detected for ${outdatedList.join(", ")}.`;
    if (partialList.length > 0) {
      coherenceReason = `${coherenceReason} Lineage gaps prevent full verification for ${partialList.join(", ")}.`;
    }
  } else if (coherenceStatus === "partial") {
    coherenceReason = `Missing artifacts or lineage data for ${partialList.join(", ")}; coherence cannot be fully verified.`;
  }

  const snapshot = {
    robotId,
    tenantId,
    signals: pickPayload("signal"),
    fusion: pickPayload("fusion"),
    idea: pickPayload("idea"),
    copy: pickPayload("copy"),
    benchmark: pickPayload("benchmark"),
    playbook: pickPayload("playbook"),
    tasks: tasks.map((t) => ({
      id: t.id,
      payload: t.payload,
      lineage: t.lineage,
      createdAt: t.createdAt,
    })),
    playbooks: playbooks.map((p) => ({
      id: p.id,
      payload: p.payload,
      lineage: p.lineage,
      createdAt: p.createdAt,
    })),
    lineage: {
      signals: latestByType["signal"]?.lineage ?? null,
      fusion: latestByType["fusion"]?.lineage ?? null,
      idea: latestByType["idea"]?.lineage ?? null,
      copy: latestByType["copy"]?.lineage ?? null,
      benchmark: latestByType["benchmark"]?.lineage ?? null,
      playbook: latestByType["playbook"]?.lineage ?? null,
    },
    timestamps: {
      signalsAt: latestByType["signal"]?.createdAt ?? null,
      fusionAt: latestByType["fusion"]?.createdAt ?? null,
      ideaAt: latestByType["idea"]?.createdAt ?? null,
      copyAt: latestByType["copy"]?.createdAt ?? null,
      benchmarkAt: latestByType["benchmark"]?.createdAt ?? null,
      playbookAt: latestByType["playbook"]?.createdAt ?? null,
    },
    coherence: {
      status: coherenceStatus,
      outdated: outdatedList,
      reason: coherenceReason,
    },
  };

  return snapshot;
}
