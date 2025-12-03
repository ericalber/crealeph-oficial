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
  request: Request,
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
