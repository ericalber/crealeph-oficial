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

  if (!latestRun) {
    return NextResponse.json({ ok: false, message: "no signals available" }, { status: 400 });
  }

  const fallback = {
    pricePercentile: 50,
    ctaStrengthPercentile: 50,
    competitionLevel: "medium",
    reviewQualityPercentile: 50,
    growthDirection: "flat",
  };

  const signals = latestRun.result as any;

  if (!process.env.OPENAI_API_KEY) {
    await prisma.marketTwinEntry.create({
      data: { robotId: robot.id, data: fallback },
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
            "You are MARKET TWIN V1. Compare this robot's signals with typical percentiles for its region and niche. Output JSON with: pricePercentile (0-100), ctaStrengthPercentile (0-100), competitionLevel (low/medium/high), reviewQualityPercentile (0-100), growthDirection (down/flat/up).",
        },
        { role: "user", content: JSON.stringify({ signals, config: robot.config }) },
      ],
      temperature: 0.2,
    });

    const content = completion.choices?.[0]?.message?.content ?? "";
    const parsed = JSON.parse(content);
    const result = parsed ?? fallback;

    await prisma.marketTwinEntry.create({
      data: { robotId: robot.id, data: result },
    });

    return NextResponse.json({ ok: true, data: result });
  } catch {
    await prisma.marketTwinEntry.create({
      data: { robotId: robot.id, data: fallback },
    });
    return NextResponse.json({ ok: true, data: fallback });
  }
}
