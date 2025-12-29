import { NextResponse } from "next/server";
import { prisma } from "@crealeph/db";
import { generatePlaybook as generateGoogleAds } from "@/lib/robots/playbooks/googleAds";
import { generatePlaybook as generateMetaAds } from "@/lib/robots/playbooks/metaAds";
import { generatePlaybook as generateSeo } from "@/lib/robots/playbooks/seo";
import { generatePlaybook as generateLanding } from "@/lib/robots/playbooks/landing";
import { generatePlaybook as generateVideo } from "@/lib/robots/playbooks/video";
import { appendLedgerEntry, getIntelligenceSnapshot, latestLedgerEntry, type JsonObject } from "@/lib/ledger";
import type { PolicyInput } from "@/lib/contracts/policy-engine";
import { validatePolicyInput, validatePolicyOutput } from "@/lib/contracts/policy-engine-validate";
import { evaluatePolicy } from "@/lib/policy/policy-engine";
import {
  createDevPlaybook,
  createDevTasks,
  getDevRobot,
  isDbConnectionError,
} from "@/lib/robots/devStore";

function getTenantId() {
  return process.env.DEFAULT_TENANT_ID ?? "demo-tenant";
}

type TaskSeed = {
  category: string;
  title: string;
  description: string;
  priority: number;
};

const taskSeedsByType: Record<string, TaskSeed[]> = {
  google_ads: [
    {
      category: "ads",
      title: "Map conversion events",
      description: "Set up lead tracking and import conversions.",
      priority: 1,
    },
    {
      category: "ads",
      title: "Build keyword themes",
      description: "Finalize keyword lists and match types per ad group.",
      priority: 2,
    },
    {
      category: "ads",
      title: "Write ad variations",
      description: "Draft 3 ads per ad group for A/B testing.",
      priority: 3,
    },
  ],
  meta_ads: [
    {
      category: "ads",
      title: "Define audiences",
      description: "Create cold, warm, and BOF audiences.",
      priority: 1,
    },
    {
      category: "content",
      title: "Produce creatives",
      description: "Design UGC and before/after assets.",
      priority: 2,
    },
    {
      category: "ads",
      title: "Launch tests",
      description: "Set up creative and angle experiments.",
      priority: 3,
    },
  ],
  seo: [
    {
      category: "seo",
      title: "Publish pillar page",
      description: "Draft and publish pillar content with internal links.",
      priority: 1,
    },
    {
      category: "seo",
      title: "Create cluster articles",
      description: "Write cluster posts for target keywords.",
      priority: 2,
    },
    {
      category: "seo",
      title: "Optimize on-page SEO",
      description: "Update metadata and schema.",
      priority: 3,
    },
  ],
  landing: [
    {
      category: "content",
      title: "Draft page sections",
      description: "Write copy for hero, proof, and CTA sections.",
      priority: 1,
    },
    {
      category: "setup",
      title: "Implement form + tracking",
      description: "Add lead form and analytics.",
      priority: 2,
    },
    {
      category: "content",
      title: "Collect proof",
      description: "Gather testimonials and before/after assets.",
      priority: 3,
    },
  ],
  video: [
    {
      category: "content",
      title: "Script variations",
      description: "Write hooks and CTA variations.",
      priority: 1,
    },
    {
      category: "content",
      title: "Capture footage",
      description: "Record before/after and team shots.",
      priority: 2,
    },
    {
      category: "content",
      title: "Edit and caption",
      description: "Finalize edits for short-form delivery.",
      priority: 3,
    },
  ],
};

export async function POST(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const robotId = params.id;
  if (!robotId) return NextResponse.json({ ok: false, message: "id required" }, { status: 400 });

  const tenantId = getTenantId();
  try {
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
      requestedAction: "playbooks.v2.run",
      requestedObjective: { type: "playbooks", action: "run_v2" },
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
        source: "playbooks-v2-run",
        type: "playbooks_v2_gate",
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
        source: "playbooks-v2-run",
        type: "playbooks_v2_gate",
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

    const latestFusion = await prisma.robotFusion.findFirst({
      where: { robot: { id: robotId, tenantId } },
      orderBy: { createdAt: "desc" },
    });

    const latestIdea = await prisma.robotIdea.findFirst({
      where: { robotId: robot.id },
      orderBy: { createdAt: "desc" },
    });

    const latestTwin = await prisma.marketTwinEntry.findFirst({
      where: { robotId: robot.id },
      orderBy: { createdAt: "desc" },
    });

    const input = {
      robot,
      fusion: latestFusionEntry?.payload ?? latestFusion?.summaryJson ?? null,
      ideator: latestIdeaEntry?.payload ?? latestIdea?.result ?? null,
      marketTwin: latestBenchmarkEntry?.payload ?? latestTwin?.data ?? null,
    };

    const playbookSeeds = [
      { type: "google_ads", title: "Google Ads Structure", structure: generateGoogleAds(input) },
      { type: "meta_ads", title: "Meta Ads Structure", structure: generateMetaAds(input) },
      { type: "seo", title: "SEO Cluster Plan", structure: generateSeo(input) },
      { type: "landing", title: "Landing Page Framework", structure: generateLanding(input) },
      { type: "video", title: "Video Script Plan", structure: generateVideo(input) },
    ];

    const created = [];

    for (const seed of playbookSeeds) {
      const playbook = await prisma.robotPlaybookV2.create({
        data: {
          robotId: robot.id,
          type: seed.type,
          title: seed.title,
          structure: seed.structure,
        },
      });

      const tasks = taskSeedsByType[seed.type] ?? [];
      if (tasks.length) {
        await prisma.playbookTask.createMany({
          data: tasks.map((task) => ({ ...task, playbookId: playbook.id })),
        });
        const createdTasks = await prisma.playbookTask.findMany({
          where: { playbookId: playbook.id },
          orderBy: { priority: "asc" },
        });
        for (const task of createdTasks) {
          await appendLedgerEntry(prisma, {
            tenantId,
            module: "playbooks",
            source: "playbooks-v2",
            type: "task",
            state: "approved",
            payload: {
              category: task.category,
              title: task.title,
              description: task.description,
              priority: task.priority,
            },
            lineage: {
              robotId: robot.id,
              playbookId: playbook.id,
              dependsOnLedgerIds: [
                ...(latestFusionEntry ? [latestFusionEntry.id] : []),
                ...(latestIdeaEntry ? [latestIdeaEntry.id] : []),
                ...(latestBenchmarkEntry ? [latestBenchmarkEntry.id] : []),
              ],
            },
            robotId: robot.id,
          });
        }
      }

      await appendLedgerEntry(prisma, {
        tenantId,
        module: "playbooks",
        source: "playbooks-v2",
        type: "playbook",
        state: "approved",
        payload: { type: seed.type, title: seed.title, structure: seed.structure },
        lineage: {
          robotId: robot.id,
          playbookId: playbook.id,
          dependsOnLedgerIds: [
            ...(latestFusionEntry ? [latestFusionEntry.id] : []),
            ...(latestIdeaEntry ? [latestIdeaEntry.id] : []),
            ...(latestBenchmarkEntry ? [latestBenchmarkEntry.id] : []),
          ],
        },
        robotId: robot.id,
      });

      created.push(playbook);
    }

    return NextResponse.json({ ok: true, data: created });
  } catch (error) {
    if (isDbConnectionError(error)) {
      const robot = getDevRobot(tenantId, robotId);
      if (!robot) return NextResponse.json({ ok: false, message: "not found" }, { status: 404 });

      const input = {
        robot,
        fusion: null,
        ideator: null,
        marketTwin: null,
      };

      const playbookSeeds = [
        { type: "google_ads", title: "Google Ads Structure", structure: generateGoogleAds(input) },
        { type: "meta_ads", title: "Meta Ads Structure", structure: generateMetaAds(input) },
        { type: "seo", title: "SEO Cluster Plan", structure: generateSeo(input) },
        { type: "landing", title: "Landing Page Framework", structure: generateLanding(input) },
        { type: "video", title: "Video Script Plan", structure: generateVideo(input) },
      ];

      const created = playbookSeeds.map((seed) => {
        const playbook = createDevPlaybook(robot.id, seed.type, seed.title, seed.structure);
        const tasks = taskSeedsByType[seed.type] ?? [];
        if (tasks.length) {
          createDevTasks(playbook.id, tasks);
        }
        return playbook;
      });

      return NextResponse.json({ ok: true, data: created, devMode: true });
    }
    throw error;
  }
}
