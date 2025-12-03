import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";

const prisma = new PrismaClient();
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

  const latestRun = await prisma.robotRun.findFirst({
    where: { robotId: robot.id },
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

  if (!latestRun || !latestIdea) {
    return NextResponse.json({ ok: false, message: "no signals or campaigns available" }, { status: 400 });
  }

  const fallback = {
    actions: [
      {
        type: "copy-update",
        label: "Update description on main listing",
        reason: "Reviews show pricing confusion and you can clarify benefits.",
        confidence: "medium",
      },
    ],
  };

  const payload = {
    parasite: latestRun.result,
    ideator: latestIdea.result,
    marketTwin: latestTwin?.data ?? null,
    config: robot.config,
  };

  if (!process.env.OPENAI_API_KEY) {
    await prisma.robotPlaybook.create({
      data: { robotId: robot.id, actions: fallback.actions },
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
            "You are PLAYBOOKS V1. Based on the signals, campaigns and benchmarks, propose recommended actions for this business. Always output JSON with: actions. Each action is { type, label, reason, confidence }.",
        },
        { role: "user", content: JSON.stringify(payload) },
      ],
      temperature: 0.3,
    });

    const content = completion.choices?.[0]?.message?.content ?? "";
    const parsed = JSON.parse(content);
    const result = parsed ?? fallback;

    await prisma.robotPlaybook.create({
      data: { robotId: robot.id, actions: Array.isArray(result.actions) ? result.actions : fallback.actions },
    });

    return NextResponse.json({ ok: true, data: result });
  } catch {
    await prisma.robotPlaybook.create({
      data: { robotId: robot.id, actions: fallback.actions },
    });
    return NextResponse.json({ ok: true, data: fallback });
  }
}
