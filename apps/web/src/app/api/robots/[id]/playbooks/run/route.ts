import { NextResponse } from "next/server";
import { prisma } from "@crealeph/db";
import OpenAI from "openai";
import { appendLedgerEntry, getIntelligenceSnapshot, latestLedgerEntry, type JsonObject } from "@/lib/ledger";
import type { PolicyInput } from "@/lib/contracts/policy-engine";
import { validatePolicyInput, validatePolicyOutput } from "@/lib/contracts/policy-engine-validate";
import { evaluatePolicy } from "@/lib/policy/policy-engine";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonObject | JsonArray;
type JsonArray = JsonValue[];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isJsonValue(value: unknown): value is JsonValue {
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

function isJsonArray(value: unknown): value is JsonArray {
  return Array.isArray(value) && value.every(isJsonValue);
}

function getTenantId() {
  return process.env.DEFAULT_TENANT_ID ?? "demo-tenant";
}

export async function POST(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const robotId = params.id;
  if (!robotId) return NextResponse.json({ ok: false, message: "id required" }, { status: 400 });

  const tenantId = getTenantId();
  const robot = await prisma.robot.findFirst({ where: { id: robotId, tenantId } });
  if (!robot) return NextResponse.json({ ok: false, message: "not found" }, { status: 404 });

  const evaluatedAt = new Date().toISOString();
  const snapshot = await getIntelligenceSnapshot(prisma, { tenantId, robotId: robot.id });
  const coherenceStatus =
    snapshot.coherence?.status === "coherent" ||
    snapshot.coherence?.status === "partial" ||
    snapshot.coherence?.status === "stale"
      ? snapshot.coherence.status
      : "partial";
  const timestamps = snapshot.timestamps ?? {};
  const snapshotAtCandidates = [
    timestamps.signalsAt,
    timestamps.fusionAt,
    timestamps.ideaAt,
    timestamps.copyAt,
    timestamps.benchmarkAt,
    timestamps.playbookAt,
  ]
    .map((value) => (value ? new Date(value).getTime() : 0))
    .filter((value) => Number.isFinite(value));
  const snapshotAtMs = snapshotAtCandidates.length ? Math.max(...snapshotAtCandidates) : 0;
  const snapshotAt = snapshotAtMs > 0 ? new Date(snapshotAtMs).toISOString() : evaluatedAt;

  const policyInput: PolicyInput = {
    tenantId,
    robotId: robot.id,
    policyContractVersion: "v1",
    evaluatedAt,
    coherenceStatus,
    snapshotAt,
    intelligenceSnapshot: snapshot as unknown as JsonObject,
    ledgerRecency: {
      signalsAt: timestamps.signalsAt ? new Date(timestamps.signalsAt).toISOString() : null,
      fusionAt: timestamps.fusionAt ? new Date(timestamps.fusionAt).toISOString() : null,
      ideaAt: timestamps.ideaAt ? new Date(timestamps.ideaAt).toISOString() : null,
      copyAt: timestamps.copyAt ? new Date(timestamps.copyAt).toISOString() : null,
      benchmarkAt: timestamps.benchmarkAt ? new Date(timestamps.benchmarkAt).toISOString() : null,
      playbookAt: timestamps.playbookAt ? new Date(timestamps.playbookAt).toISOString() : null,
    },
    requestedAction: "playbooks.v1.run",
    requestedObjective: { type: "playbooks", action: "run_v1" },
    thresholds: { minConfidence: 0.5, maxStalenessMinutes: 0, minLineageCount: 1 },
  };

  const policyInputValidation = validatePolicyInput(policyInput);
  if (!policyInputValidation.ok) {
    return NextResponse.json({ ok: false, message: "VALIDATION_ERROR" }, { status: 400 });
  }

  let policyOutput;
  try {
    policyOutput = evaluatePolicy(policyInput);
  } catch {
    return NextResponse.json({ ok: false, message: "VALIDATION_ERROR" }, { status: 400 });
  }

  const policyOutputValidation = validatePolicyOutput(policyOutput, policyInput);
  if (!policyOutputValidation.ok) {
    return NextResponse.json({ ok: false, message: "VALIDATION_ERROR" }, { status: 400 });
  }

  if (policyOutput.decision === "BLOCK") {
    await appendLedgerEntry(prisma, {
      tenantId,
      module: "playbooks",
      source: "playbooks-run",
      type: "playbooks_v1_gate",
      state: "failed",
      payload: {
        error: {
          code: "COHERENCE_BLOCKED",
          message: "Policy blocked execution.",
          retryable: false,
        },
        coherenceStatus,
        snapshotAt,
      },
      lineage: { robotId: robot.id },
      robotId: robot.id,
    });
    return NextResponse.json({ ok: false, message: "COHERENCE_BLOCKED" }, { status: 403 });
  }

  if (policyOutput.decision === "DEFER") {
    await appendLedgerEntry(prisma, {
      tenantId,
      module: "playbooks",
      source: "playbooks-run",
      type: "playbooks_v1_gate",
      state: "cancelled",
      payload: {
        cancelReason: "POLICY_DEFERRED",
        coherenceStatus,
        snapshotAt,
      },
      lineage: { robotId: robot.id },
      robotId: robot.id,
    });
    return NextResponse.json({ ok: false, message: "POLICY_DEFERRED" }, { status: 409 });
  }

  const latestFusionEntry = await latestLedgerEntry(prisma, {
    tenantId,
    robotId: robot.id,
    types: ["fusion"],
  });

  const latestIdeaEntry = await latestLedgerEntry(prisma, {
    tenantId,
    robotId: robot.id,
    types: ["idea"],
  });

  const latestBenchmarkEntry = await latestLedgerEntry(prisma, {
    tenantId,
    robotId: robot.id,
    types: ["benchmark"],
  });

  const latestRun =
    (await prisma.robotRun.findFirst({
      where: { robotId: robot.id },
      orderBy: { createdAt: "desc" },
    })) ?? null;

  const latestIdea =
    (await prisma.robotIdea.findFirst({
      where: { robotId: robot.id },
      orderBy: { createdAt: "desc" },
    })) ?? null;

  const latestTwin =
    (await prisma.marketTwinEntry.findFirst({
      where: { robotId: robot.id },
      orderBy: { createdAt: "desc" },
    })) ?? null;

  const runSignals = latestFusionEntry?.payload ?? latestRun?.result ?? null;
  const ideaResult = latestIdeaEntry?.payload ?? latestIdea?.result ?? null;
  const twinData = latestBenchmarkEntry?.payload ?? latestTwin?.data ?? null;

  if (!runSignals || !ideaResult) {
    return NextResponse.json({ ok: false, message: "no signals or campaigns available" }, { status: 400 });
  }

  const fallbackActions: JsonArray = [
    {
      type: "copy-update",
      label: "Update description on main listing",
      reason: "Reviews show pricing confusion and you can clarify benefits.",
      confidence: "medium",
    },
  ];
  const fallback = {
    actions: fallbackActions,
  };

  const payload = {
    parasite: runSignals,
    ideator: ideaResult,
    marketTwin: twinData ?? null,
    config: robot.config,
  };

  if (!process.env.OPENAI_API_KEY) {
    await prisma.robotPlaybook.create({
      data: { robotId: robot.id, actions: fallback.actions },
    });
    await appendLedgerEntry(prisma, {
      tenantId,
      module: "playbooks",
      source: "playbooks-v1",
      type: "playbook",
      state: "approved",
      payload: { actions: fallback.actions },
      lineage: {
        robotId: robot.id,
        dependsOnRunIds: latestRun?.id ? [latestRun.id] : [],
        dependsOnIdeaIds: latestIdea?.id ? [latestIdea.id] : [],
        dependsOnLedgerIds: [
          ...(latestFusionEntry ? [latestFusionEntry.id] : []),
          ...(latestIdeaEntry ? [latestIdeaEntry.id] : []),
          ...(latestBenchmarkEntry ? [latestBenchmarkEntry.id] : []),
        ],
      },
      robotId: robot.id,
    });
    return NextResponse.json({ ok: true, data: fallback });
  }

  try {
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      instructions:
        "You are PLAYBOOKS V1. Based on the signals, campaigns and benchmarks, propose recommended actions for this business. Always output JSON with: actions. Each action is { type, label, reason, confidence }.",
      input: [{ role: "user", content: JSON.stringify(payload) }],
      temperature: 0.3,
      text: { format: { type: "json_object" } },
    });

    const content = response.output_text ?? "";
    const parsed: unknown = JSON.parse(content);
    const parsedActions = isRecord(parsed) ? parsed.actions : null;
    const actions = isJsonArray(parsedActions) ? parsedActions : fallback.actions;
    const result = { actions };

    await prisma.robotPlaybook.create({
      data: { robotId: robot.id, actions },
    });

    await appendLedgerEntry(prisma, {
      tenantId,
      module: "playbooks",
      source: "playbooks-v1",
      type: "playbook",
      state: "approved",
      payload: { actions },
      lineage: {
        robotId: robot.id,
        dependsOnRunIds: latestRun?.id ? [latestRun.id] : [],
        dependsOnIdeaIds: latestIdea?.id ? [latestIdea.id] : [],
        dependsOnLedgerIds: [
          ...(latestFusionEntry ? [latestFusionEntry.id] : []),
          ...(latestIdeaEntry ? [latestIdeaEntry.id] : []),
          ...(latestBenchmarkEntry ? [latestBenchmarkEntry.id] : []),
        ],
      },
      robotId: robot.id,
    });

    return NextResponse.json({ ok: true, data: result });
  } catch {
    await prisma.robotPlaybook.create({
      data: { robotId: robot.id, actions: fallback.actions },
    });
    await appendLedgerEntry(prisma, {
      tenantId,
      module: "playbooks",
      source: "playbooks-v1",
      type: "playbook",
      state: "approved",
      payload: { actions: fallback.actions },
      lineage: {
        robotId: robot.id,
        dependsOnRunIds: latestRun?.id ? [latestRun.id] : [],
        dependsOnIdeaIds: latestIdea?.id ? [latestIdea.id] : [],
        dependsOnLedgerIds: [
          ...(latestFusionEntry ? [latestFusionEntry.id] : []),
          ...(latestIdeaEntry ? [latestIdeaEntry.id] : []),
          ...(latestBenchmarkEntry ? [latestBenchmarkEntry.id] : []),
        ],
      },
      robotId: robot.id,
    });
    return NextResponse.json({ ok: true, data: fallback });
  }
}
