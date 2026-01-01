import { NextResponse } from "next/server";
import { prisma } from "@crealeph/db";
import { fuseInsights } from "@/lib/robots/fusion";
import { appendLedgerEntry, getIntelligenceSnapshot, isJsonObject, latestLedgerEntry, type JsonObject } from "@/lib/ledger";
import type { PolicyInput } from "@/lib/contracts/policy-engine";
import { validatePolicyInput, validatePolicyOutput } from "@/lib/contracts/policy-engine-validate";
import { evaluatePolicy } from "@/lib/policy/policy-engine";
import {
  createDevFusion,
  getDevRobot,
  isDbConnectionError,
  listDevInsightsByRobot,
} from "@/lib/robots/devStore";

function getTenantId() {
  return process.env.DEFAULT_TENANT_ID ?? "demo-tenant";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function POST(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const tenantId = getTenantId();
  const robotId = params.id;
  if (!robotId) return NextResponse.json({ ok: false, message: "id required" }, { status: 400 });

  try {
    const robot = await prisma.robot.findFirst({
      where: { id: robotId, tenantId },
    });

    if (!robot) {
      return NextResponse.json({ ok: false, message: "robot not found" }, { status: 404 });
    }

    const evaluatedAt = new Date().toISOString();
    const snapshot = await getIntelligenceSnapshot(prisma, { tenantId, robotId });
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
      robotId,
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
      requestedAction: "fusion.run",
      requestedObjective: { type: "fusion", action: "run" },
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
        module: "fusion",
        source: "fusion-run",
        type: "fusion_gate",
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
        lineage: { robotId },
        robotId,
      });
      return NextResponse.json({ ok: false, message: "COHERENCE_BLOCKED" }, { status: 403 });
    }

    if (policyOutput.decision === "DEFER") {
      await appendLedgerEntry(prisma, {
        tenantId,
        module: "fusion",
        source: "fusion-run",
        type: "fusion_gate",
        state: "cancelled",
        payload: {
          cancelReason: "POLICY_DEFERRED",
          coherenceStatus,
          snapshotAt,
        },
        lineage: { robotId },
        robotId,
      });
      return NextResponse.json({ ok: false, message: "POLICY_DEFERRED" }, { status: 409 });
    }

    const signalEntry = await latestLedgerEntry(prisma, {
      tenantId,
      robotId,
      module: "robots",
      types: ["signal"],
    });

    const snapshotSignals = isJsonObject(snapshot.signals) ? snapshot.signals : null;
    const signalPayload = isJsonObject(signalEntry?.payload) ? signalEntry?.payload : null;
    const signals = snapshotSignals ?? signalPayload;

    if (!signalEntry || !signals) {
      return NextResponse.json({ ok: false, message: "no signals available" }, { status: 400 });
    }

    const insights = await prisma.competitorInsight.findMany({
      where: {
        competitor: {
          robot: { id: robotId, tenantId },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (insights.length === 0) {
      return NextResponse.json(
        { ok: false, message: "no competitor insights found" },
        { status: 400 },
      );
    }

    const insightPayloads = insights.map((insight) =>
      isRecord(insight.summaryJson) ? insight.summaryJson : {},
    );
    const fusedSummary = fuseInsights([signals, ...insightPayloads]);

    const fusion = await prisma.robotFusion.create({
      data: {
        robotId,
        name: "Default Fusion",
        summaryJson: fusedSummary,
      },
    });

    await appendLedgerEntry(prisma, {
      tenantId,
      module: "robots",
      source: "fusion",
      type: "fusion",
      state: "approved",
      payload: fusedSummary,
      lineage: {
        robotId,
        fusionId: fusion.id,
        dependsOnInsightIds: insights.map((i) => i.id),
        dependsOnLedgerIds: [signalEntry.id],
      },
      robotId,
    });

    return NextResponse.json({ ok: true, data: fusedSummary });
  } catch (error) {
    if (isDbConnectionError(error)) {
      const robot = getDevRobot(tenantId, robotId);
      if (!robot) {
        return NextResponse.json({ ok: false, message: "robot not found" }, { status: 404 });
      }
      const insights = listDevInsightsByRobot(robotId);
      if (insights.length === 0) {
        return NextResponse.json(
          { ok: false, message: "no competitor insights found" },
          { status: 400 },
        );
      }
      const fusedSummary = fuseInsights(
        insights.map((insight) => (isRecord(insight.summaryJson) ? insight.summaryJson : {})),
      );
      createDevFusion(robotId, "Default Fusion", fusedSummary);
      return NextResponse.json({ ok: true, data: fusedSummary, devMode: true });
    }
    throw error;
  }
}
