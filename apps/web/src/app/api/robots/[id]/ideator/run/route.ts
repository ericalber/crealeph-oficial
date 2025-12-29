import { NextResponse } from "next/server";
import { prisma } from "@crealeph/db";
import OpenAI from "openai";
import { appendLedgerEntry, getIntelligenceSnapshot, type JsonObject } from "@/lib/ledger";
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
  request: Request,
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
    requestedAction: "ideator.run",
    requestedObjective: { type: "ideator", action: "run" },
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
      module: "ideator",
      source: "ideator-run",
      type: "ideator_gate",
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
      module: "ideator",
      source: "ideator-run",
      type: "ideator_gate",
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

  const fallback = {
    headlineIdeas: ["Fast Deep Clean for Busy Families"],
    angles: ["Trust and safety", "Transparent pricing"],
    offers: ["First clean 15% off"],
    callouts: ["Licensed & insured", "Same-week booking"],
    scripts: ["Hi! We can get your home spotless with a transparent flat rate."],
  };

  const runSignals = latestRun.result as any;

  if (!process.env.OPENAI_API_KEY) {
    await prisma.robotIdea.create({
      data: { robotId: robot.id, result: fallback },
    });
    return NextResponse.json({ ok: true, data: fallback });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You are IDEATOR V1. Convert market signals into campaigns. Output JSON with: headlineIdeas, angles, offers, callouts, scripts.",
        },
        { role: "user", content: JSON.stringify(runSignals ?? {}) },
      ],
      temperature: 0.3,
    });

    const content = completion.choices?.[0]?.message?.content ?? "";
    const parsed = JSON.parse(content);
    const result = parsed ?? fallback;

    await prisma.robotIdea.create({
      data: { robotId: robot.id, result },
    });

    return NextResponse.json({ ok: true, data: result });
  } catch {
    await prisma.robotIdea.create({
      data: { robotId: robot.id, result: fallback },
    });
    return NextResponse.json({ ok: true, data: fallback });
  }
}
