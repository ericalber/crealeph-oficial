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

async function runParasite(robot: any) {
  const isCleaning = (robot?.config?.niche ?? "").toLowerCase() === "cleaning";
  const fallback = {
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
    const messages =
      isCleaning
        ? [
            {
              role: "system",
              content:
                "You are Parasite V2 for CLEANING industry. Extract structured signals: promises, CTAs, objections, priceWindows, reviewPatterns, competitorMoves, trendSignals. Always output a JSON object with exactly these keys. Consider typical cleaning categories: deep clean, move-out, move-in, post-construction, recurring. Consider regional pricing windows. Consider review clusters.",
            },
            { role: "user", content: JSON.stringify(robot?.config ?? {}) },
          ]
        : [
            {
              role: "system",
              content:
                "You are Parasite V1, a vertical market observer. Extract structured signals: promises, CTAs, objections, priceWindows, trendSignals. Always output JSON.",
            },
            { role: "user", content: JSON.stringify(robot?.config ?? {}) },
          ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages,
      temperature: 0.2,
    });

    const content = completion.choices?.[0]?.message?.content ?? "";
    const parsed = JSON.parse(content);
    return parsed ?? fallback;
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

  const runResult = await runParasite(robot);

  await prisma.robotRun.create({
    data: {
      robotId: robot.id,
      result: runResult,
    },
  });

  return NextResponse.json({ ok: true, data: runResult });
}
