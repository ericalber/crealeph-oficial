import { NextResponse } from "next/server";
import { prisma } from "@crealeph/db";
import OpenAI from "openai";
import { appendLedgerEntry, getIntelligenceSnapshot, isJsonObject, type JsonObject } from "@/lib/ledger";
import type { PolicyInput } from "@/lib/contracts/policy-engine";
import { validatePolicyInput, validatePolicyOutput } from "@/lib/contracts/policy-engine-validate";
import { evaluatePolicy } from "@/lib/policy/policy-engine";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
    requestedAction: "market_twin.run",
    requestedObjective: { type: "market_twin", action: "run" },
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
      module: "market-twin",
      source: "market-twin-run",
      type: "market_twin_gate",
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
      module: "market-twin",
      source: "market-twin-run",
      type: "market_twin_gate",
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

  const latestRun = await prisma.robotRun.findFirst({
    where: { robotId: robot.id },
    orderBy: { createdAt: "desc" },
  });

  if (!latestRun) {
    return NextResponse.json({ ok: false, message: "no signals available" }, { status: 400 });
  }

  const fallback: JsonObject = {
    pricePercentile: 50,
    ctaStrengthPercentile: 50,
    competitionLevel: "medium",
    reviewQualityPercentile: 50,
    growthDirection: "flat",
  };

  const signals = latestRun.result;

  if (!process.env.OPENAI_API_KEY) {
    const entry = await prisma.marketTwinEntry.create({
      data: { robotId: robot.id, data: fallback },
    });
    await appendLedgerEntry(prisma, {
      tenantId,
      module: "market-twin",
      source: "market-twin",
      type: "benchmark",
      state: "approved",
      payload: fallback,
      lineage: { robotId: robot.id, marketTwinId: entry.id, dependsOnRunIds: [latestRun.id] },
      robotId: robot.id,
    });
    return NextResponse.json({ ok: true, data: fallback });
  }

  try {
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      instructions:
        "You are MARKET TWIN V1. Compare this robot's signals with typical percentiles for its region and niche. Output JSON with: pricePercentile (0-100), ctaStrengthPercentile (0-100), competitionLevel (low/medium/high), reviewQualityPercentile (0-100), growthDirection (down/flat/up).",
      input: JSON.stringify({ signals, config: robot.config }),
      text: {
        format: { type: "json_object" },
      },
      temperature: 0.2,
    });

    const content = response.output_text ?? "";
    const parsed: unknown = JSON.parse(content);
    const result = isJsonObject(parsed) ? parsed : fallback;

    const entry = await prisma.marketTwinEntry.create({
      data: { robotId: robot.id, data: result },
    });

    await appendLedgerEntry(prisma, {
      tenantId,
      module: "market-twin",
      source: "market-twin",
      type: "benchmark",
      state: "approved",
      payload: result,
      lineage: { robotId: robot.id, marketTwinId: entry.id, dependsOnRunIds: [latestRun.id] },
      robotId: robot.id,
    });

    return NextResponse.json({ ok: true, data: result });
  } catch {
    const entry = await prisma.marketTwinEntry.create({
      data: { robotId: robot.id, data: fallback },
    });
    await appendLedgerEntry(prisma, {
      tenantId,
      module: "market-twin",
      source: "market-twin",
      type: "benchmark",
      state: "approved",
      payload: fallback,
      lineage: { robotId: robot.id, marketTwinId: entry.id, dependsOnRunIds: [latestRun.id] },
      robotId: robot.id,
    });
    return NextResponse.json({ ok: true, data: fallback });
  }
}
