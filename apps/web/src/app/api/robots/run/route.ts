import { NextResponse } from "next/server";
import { prisma } from "@crealeph/db";
import OpenAI from "openai";
import {
  appendLedgerEntry,
  getIntelligenceSnapshot,
  isJsonObject,
  type JsonObject,
} from "@/lib/ledger";
import type { PolicyInput } from "@/lib/contracts/policy-engine";
import {
  validatePolicyInput,
  validatePolicyOutput,
} from "@/lib/contracts/policy-engine-validate";
import { evaluatePolicy } from "@/lib/policy/policy-engine";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function getTenantId() {
  return process.env.DEFAULT_TENANT_ID ?? "demo-tenant";
}

async function runParasite(robot: { config?: unknown }): Promise<JsonObject> {
  const config = isJsonObject(robot?.config) ? robot.config : {};
  const niche = typeof config.niche === "string" ? config.niche : "";
  const isCleaning = niche.toLowerCase() === "cleaning";
  const fallback: JsonObject = {
    promises: ["Faster booking", "No long-term contract"],
    ctas: ["Book now", "Get a quote"],
    objections: ["Price concern", "Trust and safety"],
    priceWindows: ["$120-$180", "$180-$240"],
    reviewPatterns: ["Positive about punctuality", "Pricing concerns"],
    competitorMoves: ["New 24h service in SF"],
    trendSignals: ["Demand rising in target region", "Competitors adding 24h service"],
  };

  if (!process.env.OPENAI_API_KEY) {
    return fallback;
  }

  try {
    const instructions = isCleaning
      ? "You are Parasite V2 for CLEANING industry. Extract structured signals: promises, CTAs, objections, priceWindows, reviewPatterns, competitorMoves, trendSignals. Always output a JSON object with exactly these keys. Consider typical cleaning categories: deep clean, move-out, move-in, post-construction, recurring. Consider regional pricing windows. Consider review clusters."
      : "You are Parasite V1, a vertical market observer. Extract structured signals: promises, CTAs, objections, priceWindows, trendSignals. Always output JSON.";

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      instructions,
      input: JSON.stringify(config),
      text: {
        format: { type: "json_object" },
      },
      temperature: 0.2,
    });

    const content = response.output_text ?? "";
    const parsed: unknown = JSON.parse(content);
    return isJsonObject(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { id } = body ?? {};
  if (!id) return NextResponse.json({ ok: false, message: "id required" }, { status: 400 });
  const tenantId = getTenantId();

  const robot = await prisma.robot.findFirst({ where: { id, tenantId } });
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
    requestedAction: "robots.run",
    requestedObjective: { type: "robots", action: "run" },
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

  const isDev = process.env.NODE_ENV !== "production";
  const shouldOverrideDefer = isDev && policyOutput.decision === "DEFER";
  const effectiveDecision = shouldOverrideDefer ? "ALLOW" : policyOutput.decision;

  if (shouldOverrideDefer) {
    await appendLedgerEntry(prisma, {
      tenantId,
      module: "policy",
      source: "policy-override",
      type: "policy_override",
      state: "applied",
      payload: {
        reason: "dev_override",
        originalDecision: "DEFER",
      },
      lineage: { robotId: robot.id },
      robotId: robot.id,
    });
  }

  if (effectiveDecision === "BLOCK") {
    await appendLedgerEntry(prisma, {
      tenantId,
      module: "robots",
      source: "robot-run",
      type: "robots_run_gate",
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

  if (effectiveDecision === "DEFER") {
    await appendLedgerEntry(prisma, {
      tenantId,
      module: "robots",
      source: "robot-run",
      type: "robots_run_gate",
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

  const runResult = await runParasite(robot);

  const run = await prisma.robotRun.create({
    data: {
      robotId: robot.id,
      result: runResult,
    },
  });

  await appendLedgerEntry(prisma, {
    tenantId,
    module: "robots",
    source: "robot-run",
    type: "signal",
    state: "approved",
    payload: runResult,
    lineage: { runId: run.id, robotId: robot.id },
    robotId: robot.id,
  });

  return NextResponse.json({ ok: true, data: runResult });
}
