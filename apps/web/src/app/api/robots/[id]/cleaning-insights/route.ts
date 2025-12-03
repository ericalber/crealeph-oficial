import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function getTenantId() {
  return process.env.DEFAULT_TENANT_ID ?? "demo-tenant";
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const tenantId = getTenantId();
  const robotId = params.id;
  if (!robotId) return NextResponse.json({ ok: false, message: "id required" }, { status: 400 });

  const robot = await prisma.robot.findFirst({ where: { id: robotId, tenantId } });
  if (!robot) return NextResponse.json({ ok: false, message: "not found" }, { status: 404 });

  const isCleaning = (robot.config as any)?.niche?.toLowerCase?.() === "cleaning";
  if (!isCleaning) {
    return NextResponse.json({
      ok: true,
      data: {
        promises: [],
        ctas: [],
        objections: [],
        priceWindows: [],
        reviewPatterns: [],
        competitorMoves: [],
        trendSignals: [],
      },
    });
  }

  const run = await prisma.robotRun.findFirst({
    where: { robotId: robot.id },
    orderBy: { createdAt: "desc" },
  });

  const result = (run?.result as any) ?? {};

  return NextResponse.json({
    ok: true,
    data: {
      promises: Array.isArray(result.promises) ? result.promises : [],
      ctas: Array.isArray(result.ctas) ? result.ctas : [],
      objections: Array.isArray(result.objections) ? result.objections : [],
      priceWindows: Array.isArray(result.priceWindows) ? result.priceWindows : [],
      reviewPatterns: Array.isArray(result.reviewPatterns) ? result.reviewPatterns : [],
      competitorMoves: Array.isArray(result.competitorMoves) ? result.competitorMoves : [],
      trendSignals: Array.isArray(result.trendSignals) ? result.trendSignals : [],
    },
  });
}
