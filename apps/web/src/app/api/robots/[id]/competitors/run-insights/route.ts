import { NextResponse } from "next/server";
import { prisma } from "@crealeph/db";
import {
  appendLedgerEntry,
  getIntelligenceSnapshot,
  isJsonObject,
  latestLedgerEntry,
  type JsonObject,
} from "@/lib/ledger";
import type { PolicyInput } from "@/lib/contracts/policy-engine";
import { validatePolicyInput, validatePolicyOutput } from "@/lib/contracts/policy-engine-validate";
import { evaluatePolicy } from "@/lib/policy/policy-engine";

function getTenantId() {
  return process.env.DEFAULT_TENANT_ID ?? "demo-tenant";
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const result: string[] = [];
  for (const item of value) {
    if (typeof item !== "string") continue;
    const trimmed = item.trim();
    if (!trimmed) continue;
    if (!result.includes(trimmed)) result.push(trimmed);
  }
  return result;
}

function toNamedArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const result: string[] = [];
  for (const item of value) {
    if (typeof item === "string") {
      const trimmed = item.trim();
      if (!trimmed) continue;
      if (!result.includes(trimmed)) result.push(trimmed);
      continue;
    }
    if (isJsonObject(item) && typeof item.name === "string") {
      const trimmed = item.name.trim();
      if (!trimmed) continue;
      if (!result.includes(trimmed)) result.push(trimmed);
    }
  }
  return result;
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
    requestedAction: "competitors.run_insights",
    requestedObjective: { type: "competitors", action: "run_insights" },
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
      module: "competitors",
      source: "competitors-insights-run",
      type: "competitors_insights_gate",
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
      module: "competitors",
      source: "competitors-insights-run",
      type: "competitors_insights_gate",
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

  const signalEntry = await latestLedgerEntry(prisma, {
    tenantId,
    robotId: robot.id,
    types: ["signal"],
    module: "robots",
  });

  const signals = isJsonObject(snapshot.signals) ? snapshot.signals : null;
  if (!signalEntry || !signals) {
    await appendLedgerEntry(prisma, {
      tenantId,
      module: "competitors",
      source: "competitors-insights",
      type: "competitors_insights",
      state: "failed",
      payload: {
        error: { code: "NO_SIGNALS", message: "No signals available." },
        coherenceStatus,
        snapshotAt,
      },
      lineage: { robotId: robot.id },
      robotId: robot.id,
    });
    return NextResponse.json({ ok: false, message: "no signals available" }, { status: 400 });
  }

  const competitorMoves = toStringArray(signals.competitorMoves);
  const competitorNames = [
    ...toNamedArray(signals.competitors),
    ...toNamedArray(signals.competitorNames),
  ];
  const reviewPatterns = toStringArray(signals.reviewPatterns);
  const trendSignals = toStringArray(signals.trendSignals);

  const insights: JsonObject[] = [];
  if (competitorMoves.length > 0) {
    competitorMoves.forEach((summary, index) => {
      insights.push({
        kind: "competitor_move",
        summary,
        competitor: competitorNames[index] ?? null,
        evidence: {
          reviewPatterns,
          trendSignals,
        },
        source: { signalKey: "competitorMoves", index },
      });
    });
  } else if (competitorNames.length > 0) {
    competitorNames.forEach((name, index) => {
      insights.push({
        kind: "competitor_presence",
        summary: name,
        competitor: name,
        evidence: {
          reviewPatterns,
          trendSignals,
        },
        source: { signalKey: "competitors", index },
      });
    });
  }

  if (insights.length === 0) {
    await appendLedgerEntry(prisma, {
      tenantId,
      module: "competitors",
      source: "competitors-insights",
      type: "competitors_insights",
      state: "failed",
      payload: {
        error: { code: "NO_COMPETITOR_SIGNALS", message: "No competitor signals available." },
        coherenceStatus,
        snapshotAt,
      },
      lineage: { dependsOnLedgerIds: [signalEntry.id], robotId: robot.id },
      robotId: robot.id,
    });
    return NextResponse.json(
      { ok: false, message: "no competitor signals available" },
      { status: 400 },
    );
  }

  const payload: JsonObject = {
    insights,
    signals: {
      competitorMoves,
      competitors: competitorNames,
      reviewPatterns,
      trendSignals,
    },
  };

  const lineage = { dependsOnLedgerIds: [signalEntry.id], robotId: robot.id };
  const insightAppend = await appendLedgerEntry(prisma, {
    tenantId,
    module: "competitors",
    source: "competitors-insights",
    type: "competitor_insight",
    state: "succeeded",
    payload,
    lineage,
    robotId: robot.id,
  });

  if (!insightAppend.ok) {
    return NextResponse.json({ ok: false, message: "INTERNAL_ERROR" }, { status: 500 });
  }

  await appendLedgerEntry(prisma, {
    tenantId,
    module: "robots",
    source: "competitors-insights",
    type: "insight",
    state: "succeeded",
    payload,
    lineage,
    robotId: robot.id,
  });

  const latestInsight = await latestLedgerEntry(prisma, {
    tenantId,
    robotId: robot.id,
    types: ["competitor_insight"],
    module: "competitors",
  });

  if (!latestInsight) {
    return NextResponse.json({ ok: false, message: "INTERNAL_ERROR" }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    artifacts: [{ id: latestInsight.id, type: latestInsight.type }],
  });
}
